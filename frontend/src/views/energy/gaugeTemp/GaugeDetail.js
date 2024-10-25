import { Fragment, useEffect, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "reactstrap"
import { API_ENERGY_GAUGE_DETAIL, ROUTE_ENERGY_GAUGE_FORM, ROUTE_ENERGY_GAUGE_LIST } from "../../../constants"
import { axiosDelete, checkOnlyView, dateFormat, getTableData, primaryHeaderColor } from "../../../utility/Utils"
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import { useSelector } from "react-redux"
import { ENERGY_GAUGE } from "../../../constants/CodeList"

const GaugeDetail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const { id } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState()
    const [deleteResult, setDeleteResult] = useState(false)

    useEffect(() => {
        getTableData(`${API_ENERGY_GAUGE_DETAIL}/${id}`, {}, setData)
    }, [])

    useEffect(() => {
        if (deleteResult) {
            navigate(ROUTE_ENERGY_GAUGE_LIST)
        }
    }, [deleteResult])

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
                            <CardTitle>계기정보</CardTitle>
                        </CardHeader>
                        <CardBody className="mb-1">
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>등록일자</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            {/* <div>{data.gauge_group.code}</div> */}
                                            <div>{dateFormat(data.create_datetime)}</div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>수정일자</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            {/* <div>{`${data.examin_type} / ${data.place}`}</div> */}
                                            <div>{dateFormat(data.update_datetime)}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>계량기명</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            {/* <div>{data.gauge_group.employee_class.code}</div> */}
                                            <div>{data.gauge_group.code}</div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>설치 장소</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{data.place}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>직종</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{data.gauge_group.employee_class.code}</div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>검침주기</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{data.examin_type}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>계기명</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{data.name}</div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor, padding: 0}}>배율 / 단위</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <div>{`${data.magnification} / ${data.unit}`}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderBottom: '0.5px solid #B9B9C3', minHeight: '70px'}}>
                                <Col lg='12' md='12' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='2' md='2' xs='4' className='card_table col text center' style={{borderLeft: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>비고</Col>
                                        <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                            <div>{data.description}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter style={{display:'flex', justifyContent:'end', alignItems:'center'}}>
                            <Button hidden={checkOnlyView(loginAuth, ENERGY_GAUGE, 'available_delete')}
                                color='danger' onClick={() => axiosDelete('계기정보', `${API_ENERGY_GAUGE_DETAIL}/${id}`, setDeleteResult)}>삭제</Button>
                            <Button hidden={checkOnlyView(loginAuth, ENERGY_GAUGE, 'available_update')}
                                className="mx-1" color="primary" tag={Link} to={ROUTE_ENERGY_GAUGE_FORM} state={{type: 'modify', id: id, data: data}}>수정</Button>
                            <Button tag={Link} to={ROUTE_ENERGY_GAUGE_LIST}>목록</Button>
                        </CardFooter>
                    </Card>
                </>
            }
        </Fragment>
    )
}

export default GaugeDetail