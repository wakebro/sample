import { Fragment, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "reactstrap"
import { API_EMPLOYEE_APPOINTMENT_DETAIL, ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT, ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_FORM } from "../../../../constants"
import axios from "axios"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { dateFormat, axiosDelete } from "../../../../utility/Utils"

const AppointmentDetail = () => {
    useAxiosIntercepter()
    const { id } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState()
    const [submitResult, setSubmitResult] = useState(false)
    
    const handleDeleteClick = () => {
        axiosDelete('자격증선임현황', `${API_EMPLOYEE_APPOINTMENT_DETAIL}/${id}`, setSubmitResult)
	}

    useEffect(() => {
        axios.get(`${API_EMPLOYEE_APPOINTMENT_DETAIL}/${id}`)
        .then(res => {
            setData(res.data)
        })
        .catch(res => {
            console.log(API_EMPLOYEE_APPOINTMENT_DETAIL, res)
        })
    }, [])

    useEffect(() => {
		if (submitResult) {
            navigate(ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT)
		}
	}, [submitResult])

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
                            <CardTitle>자격증선임현황</CardTitle>
                        </CardHeader>
                        <CardBody className="mb-1">
                            <Row>
                                {data.photo !== null ?
                                    <Col className="card_table col text center" md='5'style={{height : 'auto'}}>
                                        <img src={`/static_backend/${data.photo}`} style={{height:"100%", width: '100%', objectFit:'contain'}}></img>
                                    </Col>
                                    :
                                    <Col className="card_table col text center" md='5' style={{height : 'auto', backgroundColor: '#ECE9E9'}}>                                        
                                            자격증 이미지를 등록해 주세요.
                                    </Col>
                                }
                                <Col md='7'>
                                    <CardTitle className="mb-1">기본정보</CardTitle>
                                    <Row className='card_table top'>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>이름(코드)</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text start'>{`${data.user.name}(${data.user.username})`}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mid'>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>자격증이름</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text start'>{data.license.code}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mid'>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>취득일자</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text start'>{dateFormat(data.acquisition_date)}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mid'>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>선임대상</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text start'>{data.building ? data.building.name : data.building}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mid'>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>선임일</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text start'>{dateFormat(data.create_datetime)}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mid'>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>갱신일</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text start'>{dateFormat(data.renewal_date)}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mid'>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>선임시작일</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text start'>{dateFormat(data.start_date)}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mid'>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>선임종료일</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text start'>{dateFormat(data.end_date)}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mid'>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>선임상태</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text start'>{data.status}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mid'>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>관련법규</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text start'>{data.legal ? data.legal.name : data.legal}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mid'>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>비고</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text start'>{data.description}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter style={{display:'flex', justifyContent:'end', alignItems:'center'}}>
                            <Button color='danger' onClick={() => handleDeleteClick()}>삭제</Button>
                            <Button className="mx-1" color="primary" tag={Link} to={ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_FORM} state={{type: 'modify', id: id, data: data}}>수정</Button>
                            <Button tag={Link} to={ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT}>확인</Button>
                        </CardFooter>
                    </Card>
                </>
            )}
        </Fragment>
    )
}

export default AppointmentDetail