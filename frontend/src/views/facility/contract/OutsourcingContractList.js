import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from 'reactstrap'
import Select from 'react-select'
import { checkOnlyView, dateFormat, getTableData } from '../../../utility/Utils'
import { API_FACILITY_OUTSOURCINGCONTRACT_LIST, API_FACILITY_OUTSOURCINGCONTRACT_SELECT_OPTIONS, ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_DETAIL, ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_FORM } from '../../../constants'
import CustomDataTable from '../../../components/CustomDataTable'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { useSelector } from 'react-redux'
import { FACILITY_CONTRACT_MGMT } from '../../../constants/CodeList'
import TotalLabel from '../../../components/TotalLabel'

const OutsourcingContractList = () => {
    const loginAuth = useSelector((state) => state.loginAuth)
    const [employeeClassArray, setEmployeeClassArray] = useState([{value: '', label: '전체'}])
    const [employeeArray, setEmployeeArray] = useState([{value: '', label: '전체'}])
    const [employeeClass, setEmployeeClass] = useState({value: '', label: '전체'})
    const [employee, setEmployee] = useState({value: '', label: '전체'})
    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const cookies = new Cookies()
	const columns = [
		{
			name: '직종',
			selector: row => row.employee_class.code,
            width: '10%'
		},
		{
			name: '계약명',
			selector: row => row.name
		},
		{
			name: '협력업체명',
			selector: row => row.outsourcing_company.name
		},
		{
			name: '상태',
			selector: row => row.status,
            width: '10%'
		},
		{
			name: '시작일',
            cell: row => { return dateFormat(row.start_datetime) }
		},
		{
			name: '종료일',
            cell: row => { return dateFormat(row.end_datetime) }
		},
		{
			name: '등록일',
            cell: row => { return dateFormat(row.create_datetime) }
		},
		{
			name: '작성자',
			selector: row => row.user.name,
            width: '10%'
		}
	]

    useEffect(() => {
        axios.get(API_FACILITY_OUTSOURCINGCONTRACT_SELECT_OPTIONS, {params: {property_id: cookies.get('property').value}})
        .then(res => {
            setEmployeeClassArray(res.data.employee_class_array)
            setEmployeeArray(res.data.employee_array)
        })
        .catch(res => {
            console.log(API_FACILITY_OUTSOURCINGCONTRACT_SELECT_OPTIONS, res)
        })
    }, [])

    useEffect(() => {
        getTableData(API_FACILITY_OUTSOURCINGCONTRACT_LIST, {property_id: cookies.get('property').value, employee_class: employeeClass.value, employee: employee.value, search: search}, setData)
    }, [])

    return (
        <Fragment>
            {data &&
                <>
                    <Row>
                        <div className='d-flex justify-content-start'>
                            <Breadcrumbs breadCrumbTitle='외주계약관리' breadCrumbParent='시설관리' breadCrumbActive='외주계약관리' />
                        </div>
                    </Row>
                    <Card>
                        <CardHeader>
                            <CardTitle>외주계약관리</CardTitle>
                            <Button hidden={checkOnlyView(loginAuth, FACILITY_CONTRACT_MGMT, 'available_create')}
                                color='primary' tag={Link} to={ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_FORM} state={{type: 'register'}}>작성</Button>
                        </CardHeader>
                        <CardBody>
                            <Row style={{ display: 'flex'}}>
                                <Col md='2' className='mb-1'>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col xs='2' className='pe-0' style={{ display: 'flex', justifyContent: 'center'}}>직종</Col>
                                        <Col xs='10' style={{ paddingLeft: '1%' }}>
                                            <Select 
                                                id='job-select'
                                                autosize={true}
                                                className='react-select'
                                                classNamePrefix='select'
                                                defaultValue={employeeClassArray[0]}
                                                options={employeeClassArray}
                                                onChange={(e) => setEmployeeClass(e)}
                                                value={employeeClass}
                                            />
                                        </Col>
                                    </div>
                                </Col>
                                <Col md='2' className='mb-1'>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col xs='2' className='pe-0' style={{ display: 'flex', justifyContent: 'center'}}>직원</Col>
                                        <Col xs='10' style={{ paddingLeft: '1%' }}>
                                            <Select
                                                id='euipment-select'
                                                autosize={true}
                                                className='react-select'
                                                classNamePrefix='select'
                                                defaultValue={employeeArray[0]}
                                                options={employeeArray}
                                                onChange={(e) => setEmployee(e)}
                                                value={employee}
                                            />
                                        </Col>
                                    </div>
                                </Col>
                                <Col className='mb-1' md='3'>
                                    <InputGroup>
                                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='계약명을 검색해 보세요.'
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    getTableData(API_FACILITY_OUTSOURCINGCONTRACT_LIST, {property_id:cookies.get('property').value, employee_class: employeeClass.value, employee: employee.value, search: search}, setData)
                                                }
                                            }}/>
                                        <Button style={{zIndex:0}} onClick={() => getTableData(API_FACILITY_OUTSOURCINGCONTRACT_LIST, {property_id:cookies.get('property').value, employee_class: employeeClass.value, employee: employee.value, search: search}, setData)}>검색</Button>
                                    </InputGroup>
                                </Col>
                                <Col></Col>
                            </Row>
                            <TotalLabel 
                                num={3}
                                data={data.length}
                            />
                            <CustomDataTable
                                tableData={data}
                                columns={columns}
                                detailAPI={ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_DETAIL}
                            />
                        </CardBody>
                    </Card>
                </>
            }
        </Fragment>
    )
}

export default OutsourcingContractList