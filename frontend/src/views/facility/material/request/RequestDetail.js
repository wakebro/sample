import { Fragment, useEffect, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "reactstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { axiosDelete, checkOnlyView, dateFormat, primaryHeaderColor } from "../../../../utility/Utils"
import { API_FACILITY_MATERIAL_REQUEST_DETAIL, ROUTE_FACILITYMGMT_MATERIAL_REQUEST_LIST, ROUTE_FACILITYMGMT_MATERIAL_REQUEST_MODIFY } from "../../../../constants"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import axios from "axios"
import CustomDataTable from "../../../../components/CustomDataTable"
import { useSelector } from "react-redux"
import { FACILITY_MATERIAL_REQUEST } from "../../../../constants/CodeList"

const RequestDetail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const { id } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState()
    const [detailData, setDetailData] = useState()
    const [deleteResult, setDeleteResult] = useState(false)
    const columns = [
        {
            name: '자재코드',
            cell: row => row.material.code
        },
        {
            name: '자재명',
            cell: row => row.material.model_no
        },
        {
            name: '직종',
            cell: row => (row.material.employee_class ? row.material.employee_class?.code : '')
        },
        {
            name: '규격',
            cell: row => row.material.capacity
        },
        {
            name: '재고',
            cell: row => <Col style={{textAlign: 'end'}}>{row.material.stock ? row.material.stock.toLocaleString('ko-KR') : ''}</Col>
        },
        {
            name: '청구수량',
            cell: row => <Col style={{textAlign: 'end'}}>{(row.request_quantity.toLocaleString('ko-KR'))}</Col>
        },
        {
            name: '단가',
            cell: row => <Col style={{textAlign: 'end'}}>{(row.unit_price.toLocaleString('ko-KR'))}</Col>
        },
        {
            name: '청구금액',
            cell: row => <Col style={{textAlign: 'end'}}>{((row.request_quantity * row.unit_price).toLocaleString('ko-KR'))}</Col>
        }
    ]

    useEffect(() => {
        axios.get(`${API_FACILITY_MATERIAL_REQUEST_DETAIL}/${id}`)
        .then(res => {
            setData(res.data.request)
            setDetailData(res.data.request_detail)
        })
        .catch(res => {
            console.log(`${API_FACILITY_MATERIAL_REQUEST_DETAIL}/${id}`, res)
        })
    }, [])

    useEffect(() => {
        if (deleteResult) {
            navigate(ROUTE_FACILITYMGMT_MATERIAL_REQUEST_LIST)
        }
    }, [deleteResult])

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
                        </CardHeader>
                        <CardBody>
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>청구번호</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{data.id}</div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>직종</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{data.employee_class?.code}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>청구일자</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{dateFormat(data.create_datetime)}</div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>입고희망일자</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{dateFormat(data.create_datetime)}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>총 청구수량</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{data.total_request_quantity.toLocaleString('ko-KR')}</div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>총 청구금액</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{data.total_request_price.toLocaleString('ko-KR')}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', borderTop: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>작성자</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{data.user.name}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderBottom: '0.5px solid #B9B9C3', minHeight: '70px'}}>
                                <Col lg='12' md='12' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='2' md='2' xs='4' className='card_table col text center' style={{borderLeft: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>비고</Col>
                                        <Col lg='10' md='10' xs='8' className='card_table col text start' style={{borderLeft: '0.5px solid #B9B9C3'}}>
                                            <div>{data.description}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <CustomDataTable
                                    tableData={detailData}
                                    columns={columns}
                                />
                            </Row>
                        </CardBody>
                        <CardFooter className='mt-1' style={{display: 'flex', justifyContent: 'end'}}>
                            <Button hidden={checkOnlyView(loginAuth, FACILITY_MATERIAL_REQUEST, 'available_delete')} 
                                color='danger' onClick={() => axiosDelete('자재청구', `${API_FACILITY_MATERIAL_REQUEST_DETAIL}/${id}`, setDeleteResult)}>삭제</Button>
                            <Button hidden={checkOnlyView(loginAuth, FACILITY_MATERIAL_REQUEST, 'available_update')} 
                                className='mx-1' color="primary" tag={Link} to={`${ROUTE_FACILITYMGMT_MATERIAL_REQUEST_MODIFY}/${id}`}>수정</Button>
                            <Button tag={Link} to={ROUTE_FACILITYMGMT_MATERIAL_REQUEST_LIST}>목록</Button>
                        </CardFooter>
                    </Card>
                </>
            }
        </Fragment>
    )
}

export default RequestDetail