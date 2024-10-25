import { Fragment, useEffect, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import Tab from "./Tab"
import axios from "axios"
import { API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, API_FACILITY_MATERIAL_INFO_STOCK_LOG, API_FACILITY_MATERIAL_INFO_STOCK_LOG_EXPORT } from "../../../../constants"
import Cookies from "universal-cookie"
import Select from 'react-select'
import { dateFormat, getTableData, pickerDateChange } from "../../../../utility/Utils"
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import * as moment from 'moment'
import CustomDataTable from "../../../../components/CustomDataTable"
import { FileText } from "react-feather"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from "../../../../components/TotalLabel"

const ownTypeOptions = [
    {value: '', label: '전체'},
    {value: '운영사', label: '운영사'},
    {value: '건물주', label: '건물주'}
]

const stockLogOptions = [
    {value: '', label: '전체'},
    {value: 'incoming', label: '입고'},
    {value: 'outgoing', label: '출고'}
]

export const columns = [
    {
        name: '직종',
        selector: row => row.employee_class,
        width: '100px'
    },
    {
        name: '자재코드',
        selector: row => row.code,
        minWidth: '250px'
    },
    {
        name: '소유구분',
        selector: row => row.own_type,
        width: '90px'
    },
    {
        name: '단위',
        selector: row => row.unit,
        width: '90px'
    },
    {
        name: '입고수량',
        cell: row => <Col style={{textAlign: 'end'}}>{row.incoming_quantity}</Col>,
        width: '90px'
    },
    {
        name: '입고단가',
        cell: row => <Col style={{textAlign: 'end'}}>{`₩${row.incoming_unit_price.toLocaleString('ko-KR')}`}</Col>
    },
    {
        name: '입고금액',
        cell: row => <Col style={{textAlign: 'end'}}>{`₩${row.incoming_total_price.toLocaleString('ko-KR')}`}</Col>
    },
    {
        name: '출고수량',
        cell: row => <Col style={{textAlign: 'end'}}>{row.outgoing_quantity}</Col>,
        width: '90px'
    },
    {
        name: '출고단가',
        cell: row => <Col style={{textAlign: 'end'}}>{`₩${row.outgoing_unit_price.toLocaleString('ko-KR')}`}</Col>
    },
    {
        name: '출고금액',
        cell: row => <Col style={{textAlign: 'end'}}>{`₩${row.outgoing_total_price.toLocaleString('ko-KR')}`}</Col>
    },
    {
        name: '등록일자',
        selector: row => (dateFormat(row.create_datetime)),
        width: '130px'
    },
    {
        name: '구분',
        selector: row => row.type,
        width: '90px'
    }
]

const StockLog = () => {
    const cookies = new Cookies()
    const [employeeClass, setEmployeeClass] = useState({value: '', label: '전체'})
    const [ownType, setOwnType] = useState({value: '', label: '전체'})
    const [stockLog, setStockLog] = useState({value: '', label: '전체'})
    const [employeeClassOptions, setEmployeeClassOptions] = useState([{value: '', label: '전체'}])
    const [search, setSearch] = useState('')
    const [picker, setPicker] = useState([moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
    const [data, setData] = useState([])
    const columns = [
        {
			name: '직종',
            cell: row => (row.employee_class),
            width: '100px'
		},
        {
			name: '자재명',
            cell: row => (`${row.name} (${row.code})`),
            minWidth: '300px'
		},
        {
			name: '소유구분',
            cell: row => (row.own_type),
            width: '90px'
		},
        {
			name: '단위',
            cell: row => (row.unit),
            width: '90px'
		},
        {
			name: '입고수량',
            cell: row => <Col style={{textAlign: 'end'}}>{row.incoming_quantity}</Col>,
            width: '90px'
		},
        {
			name: '입고단가',
            minWidth: '180px',
            cell: row => <Col style={{textAlign: 'end'}}>{`₩${row.incoming_unit_price.toLocaleString('ko-KR')}`}</Col>
		},
        {
			name: '입고금액',
            minWidth: '180px',
            cell: row => <Col style={{textAlign: 'end'}}>{`₩${row.incoming_total_price.toLocaleString('ko-KR')}`}</Col>
		},
        {
			name: '출고수량',
            cell: row => <Col style={{textAlign: 'end'}}>{row.outgoing_quantity}</Col>,
            width: '90px'
		},
        {
			name: '출고단가',
            minWidth: '180px',
            cell: row => <Col style={{textAlign: 'end'}}>{`₩${row.outgoing_unit_price.toLocaleString('ko-KR')}`}</Col>
		},
        {
			name: '출고금액',
            minWidth: '180px',
            cell: row => <Col style={{textAlign: 'end'}}>{`₩${row.outgoing_total_price.toLocaleString('ko-KR')}`}</Col>
		},
        {
			name: '등록일자',
            cell: row => (dateFormat(row.create_datetime)),
            width: '130px'
		},
        {
			name: '구분',
            cell: row => (row.type),
            width: '90px'
		}
    ]
    const handleExport = () => {
        axios.get(API_FACILITY_MATERIAL_INFO_STOCK_LOG_EXPORT, {params: {property_id : cookies.get('property').value, picker:picker, employee_class: employeeClass.value}})
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
        getTableData(API_FACILITY_MATERIAL_INFO_STOCK_LOG, {property_id: cookies.get('property').value, employee_class: employeeClass.value, own_type: ownType.value, stock_log: stockLog.value, start_date: picker[0], end_date: picker[1], search: search}, setData)
    }, [])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='입출고현황' breadCrumbParent='시설관리' breadCrumbParent2='자재관리' breadCrumbActive='자재정보' />
                    <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
                        <FileText size={14}/>
                        문서변환
                    </Button.Ripple>
                </div>
            </Row>
            <Row className="mb-1">
                <Col>
                    <Tab active='stockLog'></Tab>
                </Col>
            </Row>
            <Card>
                <CardHeader>
                    <CardTitle>입출고현황</CardTitle>
                </CardHeader>
                <CardBody>
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
                        <Col className="mb-1" md='2'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                <Col xs='4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>입출구분</Col>
                                <Col xs='8' style={{ paddingLeft: '1%' }}>
                                    <Select 
                                        id='stockLog-select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        defaultValue={stockLogOptions[0]}
                                        options={stockLogOptions}
                                        onChange={(e) => setStockLog(e)}
                                        value={stockLog}
                                    />
                                </Col>
                            </div>
                        </Col>
                        <Col className="mb-1" md='3'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                <Col xs='4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>등록일</Col>
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
                                    placeholder='자재코드를 검색해 보세요.'
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            getTableData(API_FACILITY_MATERIAL_INFO_STOCK_LOG, {property_id: cookies.get('property').value, employee_class: employeeClass.value, own_type: ownType.value, stock_log: stockLog.value, start_date: picker[0], end_date: picker[1], search: search}, setData)   
                                        }
                                    }}
                                    />
                                <Button 
                                    style={{zIndex:0}} 
                                    onClick={() => (
                                        getTableData(API_FACILITY_MATERIAL_INFO_STOCK_LOG, {property_id: cookies.get('property').value, employee_class: employeeClass.value, own_type: ownType.value, stock_log: stockLog.value, start_date: picker[0], end_date: picker[1], search: search}, setData)
                                    )}>검색</Button>
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
                    />
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default StockLog