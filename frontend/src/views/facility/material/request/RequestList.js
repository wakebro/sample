import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import * as moment from 'moment'
import { checkOnlyView, dateFormat, getTableData, pickerDateChange } from '../../../../utility/Utils'
import { API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, API_FACILITY_MATERIAL_REQUEST_LIST, ROUTE_FACILITYMGMT_MATERIAL_REQUEST_DETAIL, ROUTE_FACILITYMGMT_MATERIAL_REQUEST_REGISTER } from '../../../../constants'
import Cookies from 'universal-cookie'
import CustomDataTable from '../../../../components/CustomDataTable'
import { useSelector } from 'react-redux'
import { FACILITY_MATERIAL_REQUEST } from '../../../../constants/CodeList'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from '../../../../components/TotalLabel'

const RequestList = () => {
    const cookies = new Cookies()
    const loginAuth = useSelector((state) => state.loginAuth)
    const [picker, setPicker] = useState([moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD 23:59:59')])
    const [employeeClassOptions, setEmployeeClassOptions] = useState([{value: '', label: '전체'}])
    const [employeeClass, setEmployeeClass] = useState({value: '', label: '전체'})
    const [data, setData] = useState([])
    const columns = [
        {
            name: '청구번호',
            cell: row => row.id
        },
        {
            name: '신청일자',
            selector: row => (dateFormat(row.create_datetime))
        },
        {
            name: '직종',
            selector: row => row.employee_class?.code
        },
        {
            name: '청구수량',
            cell: row => (row.total_request_quantity.toLocaleString('ko-KR'))
        },
        {
            name: '청구금액',
            style: {justifyContent: 'right'},
            cell: row => ((row.total_request_price.toLocaleString('ko-KR')))
        },
        {
            name: '입고희망일',
            selector: row => (dateFormat(row.receiving_datetime))
        },
        {
            name: '신청자',
            selector: row => row.user.name
        }
    ]

    useEffect(() => {
        getTableData(API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, {property_id: cookies.get('property').value, type: 'list'}, setEmployeeClassOptions)
    }, [])

    useEffect(() => {
        getTableData(API_FACILITY_MATERIAL_REQUEST_LIST, {property_id: cookies.get('property').value, employee_class: employeeClass.value, start_date: picker[0], end_date: picker[1]}, setData)
    }, [employeeClass, picker])

    return (
        <Fragment>
            {data &&
                <>
                    <Row>
                        <div className='d-flex justify-content-start'>
                            <Breadcrumbs breadCrumbTitle='자재청구' breadCrumbParent='시설관리' breadCrumbParent2='자재관리' breadCrumbActive='자재청구' />
                        </div>
                    </Row>
                    <Card>
                        <CardHeader>
                            <CardTitle>자재청구</CardTitle>
                            <Button hidden={checkOnlyView(loginAuth, FACILITY_MATERIAL_REQUEST, 'available_create')}
                            color='primary' tag={Link} to={ROUTE_FACILITYMGMT_MATERIAL_REQUEST_REGISTER}>등록</Button>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col className="mb-1" md='3' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col xs='3' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>직종</Col>
                                        <Col xs='9' style={{ paddingLeft: '1%' }}>
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
                                    </Row>
                                </Col>
                                <Col className="mb-1" md='4' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col xs='3' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0}}>신청일자</Col>
                                        <Col xs='9' style={{ paddingLeft: '1%' }}>
                                            <Flatpickr
                                                value={picker}
                                                id='range-picker'
                                                className='form-control'
                                                onChange={date => { if (date.length === 2) setPicker(pickerDateChange(date)) }}
                                                options={{
                                                    mode: 'range',
                                                    ariaDateFormat:'Y-m-d',
                                                    locale: {
                                                        rangeSeparator: ' ~ '
                                                    },
                                                    locale: Korean
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <TotalLabel 
                                num={3}
                                data={data.length}
                            />
                            <CustomDataTable
                                tableData={data}
                                columns={columns}
                                detailAPI={ROUTE_FACILITYMGMT_MATERIAL_REQUEST_DETAIL}
                            />
                        </CardBody>
                    </Card>
                </>
            }
        </Fragment>
    )
}

export default RequestList