import Breadcrumbs from '@components/breadcrumbs'
import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { Card, CardBody, CardHeader, CardTitle, Col, Input, Row, InputGroup, Button } from 'reactstrap'
import Cookies from 'universal-cookie'
import CustomDataTable from '../../../../components/CustomDataTable'
import { API_EMPLOYEE_APPOINTMENT_LIST, API_EMPLOYEE_CLASS_LIST, API_EMPLOYEE_SELECT_ARRAY, ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_DETAIL, ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_FORM } from '../../../../constants'
import { dateFormat, getTableData } from '../../../../utility/Utils'
import TotalLabel from '../../../../components/TotalLabel'

const AppointmentList = () => {
    const cookies = new Cookies()
    const statusArray = [{value: '', label: '전체'}, {value: '선임', label: '선임'}, {value: '만료', label: '만료'}, {value: '취소', label: '취소'}, {value: '중지', label: '중지'}]
    const [status, setStatus] = useState({value: '', label: '전체'})
    const [buildingArray, setBuildingArray] = useState([{value: '', label: '전체'}])
    const [building, setBuilding] = useState({value: '', label: '전체'})
    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const columns = [
		{
			name: '이름(코드)',
			selector: row => `${row.user.name}(${row.user.username})`,
            width: '10%'
		},
		{
			name: '소속',
			selector: row => row.property.name,
            width: '10%'
		},
		{
			name: '관련법규',
			selector: row => (row.legal === null ? '' : row.legal.name)
		},
		{
			name: '자격이름',
			selector: row => row.license.code,
            width: '10%'
		},
		{
			name: '선임건물',
			selector: row => (row.building === null ? '' : row.building.name),
            width: '10%'
		},
		{
			name: '선임일자',
			selector: row => dateFormat(row.create_datetime),
            width: '10%'
		},
		{
			name: '선임상태',
			selector:row => row.status,
            width: '7%'
		}
	]
    
    useEffect(() => {
        axios.get(API_EMPLOYEE_SELECT_ARRAY, {params: {property_id: cookies.get('property').value}})
        .then(res => {
            setBuildingArray(res.data.building_array)
        })
        .catch(res => {
            console.log(API_EMPLOYEE_CLASS_LIST, res)
        })
    }, [])
    
    useEffect(() => {
        getTableData(API_EMPLOYEE_APPOINTMENT_LIST, {property_id: cookies.get('property').value, status: status.value, building: building.value, search: search}, setData)
    }, [])

    return (
        <Fragment>
            {data && (
                <>
                    <Row>
                        <div className='d-flex justify-content-start'>
                            <Breadcrumbs breadCrumbTitle='선임관리' breadCrumbParent='기본정보' breadCrumbParent2='직원정보관리' breadCrumbActive='선임관리' />
                        </div>
                    </Row>
                    <Card>
                        <CardHeader>
                            <CardTitle>선임관리</CardTitle>
                            <Button color='primary' tag={Link} to={ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_FORM} state={{type: 'register'}}>등록</Button>
                        </CardHeader>
                        <CardBody>
                            <Row style={{ display: 'flex'}}>
                                <Col md='2' className='mb-1'>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col xs='2' style={{ alignItems: 'center', paddingRight: 0 }}>구분</Col>
                                        <Col xs='10' style={{ paddingLeft: '1%' }}>
                                            <Select 
                                                id='status-select'
                                                autosize={true}
                                                className='react-select'
                                                classNamePrefix='select'
                                                defaultValue={statusArray[0]}
                                                options={statusArray}
                                                onChange={(e) => setStatus(e)}
                                                value={status}
                                            />
                                        </Col>
                                    </div>
                                </Col>
                                <Col md='2' className='mb-1'>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col xs='2' style={{ alignItems: 'center', paddingRight: 0 }}>건물</Col>
                                        <Col xs='10' style={{ paddingLeft: '1%' }}>
                                            <Select
                                                id='building-select'
                                                autosize={true}
                                                className='react-select'
                                                classNamePrefix='select'
                                                defaultValue={buildingArray[0]}
                                                options={buildingArray}
                                                onChange={(e) => setBuilding(e)}
                                                value={building}
                                            />
                                        </Col>
                                    </div>
                                </Col>
                                <Col className='mb-1' md='3'>
                                    <InputGroup>
                                        <Input 
                                            value={search} 
                                            onChange={(e) => setSearch(e.target.value)} 
                                            placeholder='이름을 검색해 보세요.'
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    getTableData(API_EMPLOYEE_APPOINTMENT_LIST, {property_id: cookies.get('property').value, status: status.value, building: building.value, search: search}, setData)
                                                }
                                            }}
                                            />
                                        <Button 
                                            style={{zIndex:0}}
                                            onClick={() => getTableData(API_EMPLOYEE_APPOINTMENT_LIST, {property_id: cookies.get('property').value, status: status.value, building: building.value, search: search}, setData)}
                                        >
                                            검색
                                        </Button>
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
                                detailAPI={ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_DETAIL}
                            />
                        </CardBody>
                    </Card>
                </>
            )}
        </Fragment>
    )
}

export default AppointmentList