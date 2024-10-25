import { Fragment, useEffect, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"
import Tab from "./Tab"
import { FileText } from "react-feather"
import Select from 'react-select'
import StockLogTotalTable from "./StockLogTotalTable"
import { getTableData } from "../../../../utility/Utils"
import Cookies from "universal-cookie"
import { API_FACILITY_MATERIAL_INFO_STOCK_LOG_TOTAL, API_FACILITY_MATERIAL_INFO_STOCK_LOG_TOTAL_EXPORT } from "../../../../constants"
import axios from "axios"
import CustomHelpCircle from "../../../apps/CustomHelpCircle"

const yearList = []
const currentYear = new Date().getFullYear()
const startYear = currentYear - 9
for (let year = currentYear; year >= startYear; year--) {
    yearList.push({ label: `${year}년`, value: `${year}` })
}
const monthList = [
    { label: '1월', value: 1 },
    { label: '2월', value: 2 },
    { label: '3월', value: 3 },
    { label: '4월', value: 4 },
    { label: '5월', value: 5 },
    { label: '6월', value: 6 },
    { label: '7월', value: 7 },
    { label: '8월', value: 8 },
    { label: '9월', value: 9 },
    { label: '10월', value: 10 },
    { label: '11월', value: 11 },
    { label: '12월', value: 12 }
]

const StockLogTotal = () => {
    const cookies = new Cookies()
    const [data, setData] = useState([])
    const [year, setYear] = useState(yearList[0])
    const [month, setMonth] = useState({value: new Date().getMonth() + 1, label: `${new Date().getMonth() + 1}월`})
    const columns = [
        {
            name: '직종',
            selector: row => row.employee_class,
            conditionalCellStyles: [
                {
                    when: row => row.employee_class === '합계',
                    style: {
                        backgroundColor: '#FFF8F2'
                    }
                }
            ]
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{ height:'50%' }}>&nbsp;</div>
                    <div style={{ borderTop: '0.5px solid #B9B9C3', height:'50%', borderRight: '0.5px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">수량</div>
                </div>
            ),
            cell: row => <Col style={{ textAlign: 'end' }}>{row.carry_over_quantity.toLocaleString('ko-KR')}</Col>,
            width: '150px',
            conditionalCellStyles: [
                {
                    when: row => row.employee_class === '합계',
                    style: {
                        backgroundColor: '#FFF8F2'
                    }
                }
            ]
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{ height:'50%', borderRight: '0.5px solid #B9B9C3', display: 'flex', alignItems: 'center', paddingLeft: '26px' }}>이월재고</div>
                    <div style={{ borderTop: '0.5px solid #B9B9C3', height:'50%', borderRight: '0.5px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">금액</div>
                </div>
            ),
            cell: row => <Col style={{ textAlign: 'end' }}>{`₩${row.carry_over_price.toLocaleString('ko-KR')}`}</Col>,
            width: '250px',
            conditionalCellStyles: [
                {
                    when: row => row.employee_class === '합계',
                    style: {
                        backgroundColor: '#FFF8F2'
                    }
                }
            ]
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{ height:'50%' }}>&nbsp;</div>
                    <div style={{ borderTop: '0.5px solid #B9B9C3', height:'50%', borderRight: '0.5px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">수량</div>
                </div>
            ),
            cell: row => <Col style={{ textAlign: 'end' }}>{row.incoming_quantity.toLocaleString('ko-KR')}</Col>,
            width: '150px',
            conditionalCellStyles: [
                {
                    when: row => row.employee_class === '합계',
                    style: {
                        backgroundColor: '#FFF8F2'
                    }
                }
            ]
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{ height:'50%', borderRight: '0.5px solid #B9B9C3', display: 'flex', alignItems: 'center', paddingLeft: '26px' }}>금월입고</div>
                    <div style={{ borderTop: '0.5px solid #B9B9C3', height:'50%', borderRight: '0.5px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">금액</div>
                </div>
            ),
            cell: row => <Col style={{textAlign: 'end'}}>{`₩${row.incoming_price.toLocaleString('ko-KR')}`}</Col>,
            width: '250px',
            conditionalCellStyles: [
                {
                    when: row => row.employee_class === '합계',
                    style: {
                        backgroundColor: '#FFF8F2'
                    }
                }
            ]
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{ height:'50%' }}>&nbsp;</div>
                    <div style={{ borderTop: '0.5px solid #B9B9C3', height:'50%', borderRight: '0.5px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">수량</div>
                </div>
            ),
            cell: row => <Col style={{ textAlign: 'end' }}>{row.outgoing_quantity.toLocaleString('ko-KR')}</Col>,
            width: '150px',
            conditionalCellStyles: [
                {
                    when: row => row.employee_class === '합계',
                    style: {
                        backgroundColor: '#FFF8F2'
                    }
                }
            ]
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{ height:'50%', borderRight: '0.5px solid #B9B9C3', display: 'flex', alignItems: 'center', paddingLeft: '26px' }}>금월출고</div>
                    <div style={{ borderTop: '0.5px solid #B9B9C3', height:'50%', borderRight: '0.5px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">금액</div>
                </div>
            ),
            cell: row => <Col style={{textAlign: 'end'}}>{`₩${row.outgoing_price.toLocaleString('ko-KR')}`}</Col>,
            width: '250px',
            conditionalCellStyles: [
                {
                    when: row => row.employee_class === '합계',
                    style: {
                        backgroundColor: '#FFF8F2'
                    }
                }
            ]
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{ height:'50%' }}>&nbsp;</div>
                    <div style={{ borderTop: '0.5px solid #B9B9C3', height:'50%', borderRight: '0.5px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">수량</div>
                </div>
            ),
            cell: row => <Col style={{ textAlign: 'end' }}>{(row.carry_over_quantity + row.incoming_quantity - row.outgoing_quantity).toLocaleString('ko-KR')}</Col>,
            width: '150px',
            conditionalCellStyles: [
                {
                    when: row => row.employee_class === '합계',
                    style: {
                        backgroundColor: '#FFF8F2'
                    }
                }
            ]
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{ height:'50%', borderRight: '0.5px solid #B9B9C3', display: 'flex', alignItems: 'center', paddingLeft: '26px' }}>금월재고</div>
                    <div style={{ borderTop: '0.5px solid #B9B9C3', height:'50%', borderRight: '0.5px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">금액</div>
                </div>
            ),
            cell: row => <Col style={{textAlign: 'end'}}>{`₩${(row.carry_over_price + row.incoming_price - row.outgoing_price).toLocaleString('ko-KR')}`}</Col>,
            width: '250px',
            conditionalCellStyles: [
                {
                    when: row => row.employee_class === '합계',
                    style: {
                        backgroundColor: '#FFF8F2'
                    }
                }
            ]
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{ height:'50%' }}>&nbsp;</div>
                    <div style={{ borderTop: '0.5px solid #B9B9C3', height:'50%', borderRight: '0.5px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">수량</div>
                </div>
            ),
            cell: row => <Col style={{ textAlign: 'end' }}>{(row.carry_over_quantity + row.incoming_quantity - row.outgoing_quantity - (row.carry_over_quantity + row.incoming_quantity - row.outgoing_quantity)).toLocaleString('ko-KR')}</Col>,
            width: '150px',
            conditionalCellStyles: [
                {
                    when: row => row.employee_class === '합계',
                    style: {
                        backgroundColor: '#FFF8F2'
                    }
                }
            ]
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{ height:'50%', borderRight: '0.5px solid #B9B9C3', display: 'flex', alignItems: 'center', paddingLeft: '38px' }}>오차</div>
                    <div style={{ borderTop: '0.5px solid #B9B9C3', height:'50%', borderRight: '0.5px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">금액</div>
                </div>
            ),
            cell: row => <Col style={{textAlign: 'end'}}>{`₩${(row.carry_over_price + row.incoming_price - row.outgoing_price - (row.carry_over_price + row.incoming_price - row.outgoing_price)).toLocaleString('ko-KR')}`}</Col>,
            width: '250px',
            conditionalCellStyles: [
                {
                    when: row => row.employee_class === '합계',
                    style: {
                        backgroundColor: '#FFF8F2'
                    }
                }
            ]
        }
    ]

    const handleExport = () => {
        axios.get(API_FACILITY_MATERIAL_INFO_STOCK_LOG_TOTAL_EXPORT, {params: {property_id: cookies.get('property').value, year: year.value, month: month.value}})
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
        getTableData(API_FACILITY_MATERIAL_INFO_STOCK_LOG_TOTAL, {property_id: cookies.get('property').value, year: year.value, month: month.value}, setData)
    }, [year, month])
    
    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='입출고집계표' breadCrumbParent='시설관리' breadCrumbParent2='자재관리' breadCrumbActive='자재정보' />
                    <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
                        <FileText size={14}/>
                        문서변환
                    </Button.Ripple>
                </div>
            </Row>
            <Row className="mb-1">
                <Col>
                    <Tab active='stockLogTotal'></Tab>
                </Col>
            </Row>
            <Card>
                <CardHeader>
                    <CardTitle>입출고집계표
                        <CustomHelpCircle
                            id={'stockLogTotal'}
                            content={'자재현황 중 직종이 등록되지 않을 경우 기타로 합산되어 조회됩니다.'}
                        /> 
                    </CardTitle>
                </CardHeader>
                <CardBody className="mb-2">
                    <Row style={{ display: 'flex'}} className='my-1'>
                        <Col md='2'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                <Col xs='4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>년도</Col>
                                <Col xs='8' style={{ paddingLeft: '1%' }}>
                                    <Select 
                                        id='employeeClass-select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        defaultValue={yearList[0]}
                                        options={yearList}
                                        onChange={(e) => setYear(e)}
                                        value={year}
                                    />
                                </Col>
                            </div>
                        </Col>
                        <Col md='2'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                <Col xs='4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>월</Col>
                                <Col xs='8' style={{ paddingLeft: '1%' }}>
                                    <Select 
                                        id='ownType-select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        defaultValue={monthList[0]}
                                        options={monthList}
                                        onChange={(e) => setMonth(e)}
                                        value={month}
                                    />
                                </Col>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{display: 'flex', justifyContent: 'end'}}>
                            *오차 = 이월재고+금월입고-금월출고-금월재고
                        </Col>
                    </Row>
                    <StockLogTotalTable
                        tableData={data}
                        columns={columns}
                    />
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default StockLogTotal