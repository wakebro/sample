import { Fragment, useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import Breadcrumbs from '@components/breadcrumbs'
import Select from 'react-select'
import Cookies from "universal-cookie"
import { API_FACILITY_MATERIAL_INFO_PERFORMANCE, API_FACILITY_MATERIAL_INFO_PERFORMANCE_EXPORT, API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS } from "../../../../constants"
import axios from "axios"
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { getTableData, pickerDateChange } from "../../../../utility/Utils"
import * as moment from 'moment'
import Tab from "./Tab"
import CustomDataTable from "./CustomDataTable"
import { FileText } from "react-feather"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from "../../../../components/TotalLabel"

const ownTypeOptions = [
    {value: '', label: '전체'},
    {value: '운영사', label: '운영사'},
    {value: '건물주', label: '건물주'}
]

const Performance = () => {
    const cookies = new Cookies()
    const [ownType, setOwnType] = useState({value: '', label: '전체'})
    const [employeeClassOptions, setEmployeeClassOptions] = useState([{value: '', label: '전체'}])    
    const [employeeClass, setEmployeeClass] = useState({value: '', label: '전체'})
    const [search, setSearch] = useState('')
	const [picker, setPicker] = useState([moment().startOf('month').format('YYYY-MM-DD 00:00:00'), moment().endOf('month').format('YYYY-MM-DD 23:59:59')])
    const [data, setData] = useState([])
    const columns = [
        {
            name: '직종',
            selector: row => row.employee_class,
            width: '120px'
        },
        {
            name: '자재명',
            width: '300px',
            cell: row => row.material_code
        },
        {
            name: '소유구분',
            selector: row => row.own_type,
            width: '120px'
        },
        {
            name: '이월수량',
            cell: row => <Col style={{ textAlign: 'end' }}>{row.carry_over_quantity.toLocaleString('ko-KR')}</Col>,
            width: '100px'
        },
        {
            name: '이월금액',
            cell: row => <Col style={{ textAlign: 'end' }}>{`₩${row.carry_over_price.toLocaleString('ko-KR')}`}</Col>,
            width: '200px'
        },
        {
            name: '구매수량',
            cell: row => <Col style={{ textAlign: 'end' }}>{row.incoming_quantity.toLocaleString('ko-KR')}</Col>,
            minWidth: '120px'
        },
        {
            name: '구매금액',
            cell: row => <Col style={{ textAlign: 'end' }}>{`₩${row.incoming_price.toLocaleString('ko-KR')}`}</Col>,
            width: '200px'
        },
        {
            name: '출고수량',
            cell: row => <Col style={{ textAlign: 'end' }}>{row.outgoing_quantity.toLocaleString('ko-KR')}</Col>,
            width: '100px'
        },
        {
            name: '출고금액',
            cell: row => <Col style={{ textAlign: 'end' }}>{`₩${row.outgoing_price.toLocaleString('ko-KR')}`}</Col>,
            width: '200px'
        },
        {
            name: '재고수량',
            cell: row => <Col style={{ textAlign: 'end' }}>{(row.carry_over_quantity + row.incoming_quantity - row.outgoing_quantity).toLocaleString('ko-KR')}</Col>,
            minWidth: '120px'
        },
        {
            name: '재고금액',
            cell: row => <Col style={{ textAlign: 'end' }}>{`₩${(row.carry_over_price + row.incoming_price - row.outgoing_price).toLocaleString('ko-KR')}`}</Col>,
            width: '200px'
        }
    ]

    const handleExport = () => {
        axios.get(API_FACILITY_MATERIAL_INFO_PERFORMANCE_EXPORT, {params: {property_id: cookies.get('property').value, employee_class: employeeClass.value, own_type: ownType.value, start_date: picker[0], end_date: picker[1], search: search}})
        .then((res) => {
            axios({
                url: res.data.url,
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${res.data.name}`)
                document.body.appendChild(link)
                link.click()
            }).catch((res) => {
                console.log(res)
            })
        })
        .catch(res => {
            console.log(res)
        })
	}

    const handleResetButton = () => {
        setEmployeeClass({value: '', label: '전체'})
        setOwnType({value: '', label: '전체'})
        setSearch('')
        setPicker([moment().startOf('month').format('YYYY-MM-DD 00:00:00'), moment().endOf('month').format('YYYY-MM-DD 23:59:59')])
    }

    useEffect(() => {
        axios.get(API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, {params: {property_id: cookies.get('property').value, type: 'list'}})
        .then(res => {
            setEmployeeClassOptions(res.data)
        })
        .catch(res => {
            console.log(API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, res)
        })
    }, [])

    useEffect(() => {
        getTableData(
            API_FACILITY_MATERIAL_INFO_PERFORMANCE, 
            {property_id: cookies.get('property').value, employee_class: employeeClass.value, own_type: ownType.value, start_date: picker[0], end_date: picker[1], search: search}, 
            setData
        )
    }, [])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='자재실적조회' breadCrumbParent='시설관리' breadCrumbParent2='자재관리' breadCrumbActive='자재정보' />
                    <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
                        <FileText size={14}/>
                        문서변환
                    </Button.Ripple>
                </div>
            </Row>
            <Row className="mb-1">
                <Col>
                    <Tab md='5' active='performance'></Tab>
                </Col>
            </Row>
            <Card>
                <CardHeader>
                    <CardTitle>자재실적조회</CardTitle>
                </CardHeader>
                <CardBody className="mb-2">
                    <Row style={{ display: 'flex'}}>
                        <Col className="mb-1" md='2'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                <Col xs='4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>직종</Col>
                                <Col xs='8' style={{ paddingLeft: '1%' }}>
                                    <Select 
                                        id='employeeClass-select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        defaultValue={employeeClassOptions[0]}
                                        options={employeeClassOptions}
                                        onChange={(e) => setEmployeeClass(e)}
                                        value={employeeClass}
                                    />
                                </Col>
                            </div>
                        </Col>
                        <Col className="mb-1" md='2'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                <Col xs='4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>소유구분</Col>
                                <Col xs='8' style={{ paddingLeft: '1%' }}>
                                    <Select 
                                        id='ownType-select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        defaultValue={ownTypeOptions[0]}
                                        options={ownTypeOptions}
                                        onChange={(e) => setOwnType(e)}
                                        value={ownType}
                                    />
                                </Col>
                            </div>
                        </Col>
                        <Col className="mb-1" md='3'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                <Col xs='4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>기간</Col>
                                <Col xs='8' style={{ paddingLeft: '1%' }}>
                                    <Flatpickr
                                        value={picker}
                                        id='range-picker'
                                        className='form-control'
                                        onChange={date => { if (date.length === 2) setPicker(pickerDateChange(date)) } }
                                        options={{
                                            mode: 'range',
                                            ariaDateFormat:'Y-m-d',
                                            locale: {
                                                rangeSeparator: ' ~ '
                                            },
                                            defaultValue: picker,
                                            locale: Korean
                                        }}
                                    />
                                </Col>
                            </div>
                        </Col>
                        <Col className="mb-1" md='3'>
                            <InputGroup>
                                <Input 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)} 
                                    placeholder='자재명을 입력하세요.'
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            getTableData(API_FACILITY_MATERIAL_INFO_PERFORMANCE, {property_id: cookies.get('property').value, employee_class: employeeClass.value, own_type: ownType.value, start_date: picker[0], end_date: picker[1], search: search}, setData)                                        
                                        }
                                    }}
                                    />
                                <Button style={{zIndex:0}} onClick={() => getTableData(API_FACILITY_MATERIAL_INFO_PERFORMANCE, {property_id: cookies.get('property').value, employee_class: employeeClass.value, own_type: ownType.value, start_date: picker[0], end_date: picker[1], search: search}, setData)}>검색</Button>
                            </InputGroup>
                        </Col>
                        <Col className="mb-1" md='2' style={{display: 'flex', justifyContent: 'end'}}>
                            <Button outline color='primary'  onClick={() => handleResetButton()}>검색초기화</Button>
                        </Col>
                    </Row>
                    <TotalLabel 
                        num={3}
                        data={data.length}
                    />
                    <CustomDataTable
                        tableData={data}
                        columns={columns}
                    />
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default Performance