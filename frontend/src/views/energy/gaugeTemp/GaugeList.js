import Breadcrumbs from '@components/breadcrumbs'
import axios from "axios"
import { Fragment, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import Cookies from "universal-cookie"
import CustomDataTable from "../../../components/CustomDataTable"
import {
    API_EMPLOYEE_CLASS_LIST,
    API_ENERGY_GAUGE_FORM_SELECT_OPTIONS,
    API_ENERGY_GAUGE_LIST,
    API_ENERGY_GAUGE_LIST_SELECT_OPTIONS,
    ROUTE_ENERGY_GAUGE_DETAIL,
    ROUTE_ENERGY_GAUGE_FORM
} from "../../../constants"
import { ENERGY_GAUGE } from "../../../constants/CodeList"
import { checkOnlyView, dateFormat, getTableData } from "../../../utility/Utils"
import TotalLabel from '../../../components/TotalLabel'

const GaugeTemp = () => {
    const cookies = new Cookies()
    const loginAuth = useSelector((state) => state.loginAuth)
    const [employeeClassOptions, setEmployeeClassOptions] = useState([{value: '', label: '전체'}])
    const [employeeClass, setEmployeeClass] = useState({value: '', label: '전체'})
    const [guageGroupOptions, setGaugeGroupOptions] = useState([{value: '', label: '전체'}])
    const [gaugeGroup, setGaugeGroup] = useState({value: '', label: '전체'})
    const [examinType, setExaminTypeOptions] = useState({value: '', label: '전체'})
    const [data, setData] = useState([])
    const columns = [
        {
			name: '구분',
			selector: row => row.examin_type,
            width: '80px'
		},
		{
			name: '직종',
			selector: row => row.gauge_group.employee_class.code,
            width: '130px'
		},
        {
			name: '계량기명',
			selector: row => row.gauge_group.code,
            minWidth: '200px'
		},
        {
			name: '계기명',
			selector: row => row.code,
            minWidth: '200px'
		},
        {
			name: '설치장소',
			selector: row => row.place,
            width: '170px'
		},
        {
			name: '배율',
			selector: row => row.magnification,
            width: '150px'
		},
        {
			name: '단위',
			selector: row => row.unit,
            width: '150px'
		},
        {
			name: '등록일자',
            cell: row => { return dateFormat(row.create_datetime) },
            width: '150px'
		}
    ]
    // 계기 검침 주기 타입 변경
    const examinTypeOptions = [
        {value: '', label: '전체'},
        {value: 'm', label: '월간'},
        {value: 'd', label: '일일'}
    ]
    const [search, setSearch] = useState('')

    const getInit = () => {
        getTableData(
            API_ENERGY_GAUGE_LIST, 
            {
                property_id: cookies.get('property').value, 
                examin_type: examinType.value, 
                employee_class: employeeClass.value, 
                gauge_group: gaugeGroup.value, 
                search: search
            }, 
            setData
        ) // getTableData end
    }// getInit end

    useEffect(() => {
        axios.get(API_EMPLOYEE_CLASS_LIST, {params: {}})
        .then(res => {
            res.data[0]['label'] = '전체'
            setEmployeeClassOptions(res.data)
        })
        .catch(res => console.log(API_ENERGY_GAUGE_LIST_SELECT_OPTIONS, res))
    }, [])

    useEffect(() => {
        getInit()
    }, [])

    useEffect(() => {
        setGaugeGroup({value: '', label: '전체'})
        axios.get(API_ENERGY_GAUGE_FORM_SELECT_OPTIONS, {params: {property_id: cookies.get('property').value, employee_class_id: employeeClass.value}})
        .then(res => {
            res.data.gauge_group_array[0]['label'] = '전체'
            setGaugeGroupOptions(res.data.gauge_group_array)
        })
        .catch(res => console.log(API_ENERGY_GAUGE_FORM_SELECT_OPTIONS, res))
    }, [employeeClass])

    return (
        <Fragment>
            {data &&
                <>
                    <Row>
                        <div className='d-flex justify-content-start'>
                            <Breadcrumbs breadCrumbTitle='계기정보' breadCrumbParent='에너지관리' breadCrumbParent2='검침정보관리' breadCrumbActive='계기정보' />
                        </div>
				    </Row>
                    <Card>
                        <CardHeader>
                            <CardTitle>계기 정보</CardTitle>
                            <Button hidden={checkOnlyView(loginAuth, ENERGY_GAUGE, 'available_create')}
                                color='primary' tag={Link} to={ROUTE_ENERGY_GAUGE_FORM} state={{type: 'register'}}>등록</Button>
                        </CardHeader>
                        <CardBody>
                            <Row style={{ display: 'flex'}}>
                                <Col md='2' className='mb-1'>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col xs='4' className="pe-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>검침주기</Col>
                                        <Col xs='8' style={{ paddingLeft: '1%' }}>
                                            <Select 
                                                id='examinType-select'
                                                autosize={true}
                                                className='react-select'
                                                classNamePrefix='select'
                                                options={examinTypeOptions}
                                                onChange={(e) => setExaminTypeOptions(e)}
                                                value={examinType}
                                                styles={{ menu: base => ({ ...base, zIndex: 100 })}}
                                            />
                                        </Col>
                                    </div>
                                </Col>
                                <Col md='2' className='mb-1'>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col xs='4' className="pe-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>직종</Col>
                                        <Col xs='8' style={{ paddingLeft: '1%'}}>
                                            <Select 
                                                id='employeeClass-select'
                                                autosize={true}
                                                className='react-select'
                                                classNamePrefix='select'
                                                options={employeeClassOptions}
                                                onChange={(e) => setEmployeeClass(e)}
                                                value={employeeClass}
                                                styles={{ menu: base => ({ ...base, zIndex: 100 })}}
                                            />
                                        </Col>
                                    </div>
                                </Col>
                                <Col md='3' className='mb-1'>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col xs='4' className="pe-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>계량기명</Col>
                                        <Col xs='8' style={{ paddingLeft: '1%' }}>
                                            <Select 
                                                id='gaugeGroup-select'
                                                autosize={true}
                                                className='react-select'
                                                classNamePrefix='select'
                                                options={guageGroupOptions}
                                                onChange={(e) => setGaugeGroup(e)}
                                                value={gaugeGroup}
                                                styles={{ menu: base => ({ ...base, zIndex: 100 })}}
                                            />
                                        </Col>
                                    </div>
                                </Col>
                                <Col className='mb-1' md='3'>
                                    <InputGroup>
                                        <Input 
                                            value={search} 
                                            maxLength={250}
                                            onChange={(e) => setSearch(e.target.value)} 
                                            placeholder='계기명을 검색해 보세요.'
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    getInit()
                                                }
                                            }}
                                        />
                                        <Button style={{zIndex:0}} onClick={getInit}>검색</Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                            <TotalLabel 
                                num={3}
                                data={data.length}
                            />
                            <CustomDataTable
                                tableData={data}
                                columns={columns}
                                detailAPI={ROUTE_ENERGY_GAUGE_DETAIL}
                            />
                        </CardBody>
                    </Card>
                </>
            }
        </Fragment>
    )
}

export default GaugeTemp