import Breadcrumbs from '@components/breadcrumbs'
import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_INCONV_LICENSE, ROUTE_SYSTEMMGMT_INCONV_LICENSE } from '../../../../constants'
import { SYSTEM_INCONVENIENCE_LICENSE } from '../../../../constants/CodeList'
import { axiosDelete, checkOnlyView } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { InconvInfoUrlObj } from '../InconData'

const LicenseDetail = () => {
    const loginAuth = useSelector((state) => state.loginAuth)
	const { id } = useParams()
    const [data, setData] = useState()
    const [submitResult, setSubmitResult] = useState(false)
	const cookies = new Cookies()

	useAxiosIntercepter()

	const handleDeleteSubmit = () => {
        axiosDelete('자격증 정보', `${API_INCONV_LICENSE}/${id}`, setSubmitResult)
	}

    useEffect(() => {
		axios.get(`${API_INCONV_LICENSE}/${id}`, {params:{property:cookies.get('property').value}})
		.then(res => {
			setData(res.data.data)
		})
    }, [])
    useEffect(() => {
		if (submitResult) {
			window.location.href = ROUTE_SYSTEMMGMT_INCONV_LICENSE
		}
	}, [submitResult])

	return (
        <Fragment>
            <Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='자격증 정보' breadCrumbParent='시스템관리' breadCrumbParent2='시설표준정보' breadCrumbActive='자격증 정보' />
				</div>
			</Row>
            <Card>
                <CardHeader>
                    <CardTitle className="title">
                    자격증 정보
                    </CardTitle>
                </CardHeader>
                { data &&
                <CardBody>
                    <Row className='mx-0'>
                        <Col lg='6' md='6' xs='12' className='card_table top'>
                            <Row className='card_table' style={{height:'100%'}}>
                                <Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>자격명</Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text start '>
                                    <Col style={{width:'100%'}}>
                                        <div>{data.code}</div>
                                    </Col>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg='6' md='6' xs='12' className='card_table top'>
                            <Row className='card_table table_row' style={{height:'100%'}}>
                                <Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>법규 코드</Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                    <Col style={{width:'100%'}}>
                                        <div>{data.legal_code}</div>
                                    </Col>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='mx-0'>
                        <Col lg='6' md='6' xs='12' className='card_table mid'>
                            <Row className='card_table table_row' style={{height:'100%'}}>
                                <Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>직종 코드</Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                    <div>{data.emp_class.code}</div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg='6' md='6' xs='12' className='card_table mid'>
                            <Row className='card_table' style={{height:'100%'}}>
                                <Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>발급처</Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text start '>
                                    <Col style={{width:'100%'}}>
                                        <div>{data.issuer}</div>
                                    </Col>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='mb-1 mx-0 card_table mid'>
                        <Col lg='2' md='2' xs='4'  className='card_table col col_color text center '>비고</Col>
                        <Col lg='10' md='10' xs='8' className='card_table col text start '>
                            <Col style={{width:'100%'}}>
                                <div>{data.description}</div>
                            </Col>
                        </Col>
                    </Row>
                </CardBody>
                }
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
                    <Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_LICENSE, 'available_delete')}
                        type='button' color='danger' onClick={handleDeleteSubmit}>삭제</Button>
                    <Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_LICENSE, 'available_update')}
                        color='primary' tag={Link}
                        className='ms-1'
                        to={`${ROUTE_SYSTEMMGMT_INCONV_LICENSE}/add`} 
                        state={{
                            title: "자격증",
                            key: "license",
                            API: InconvInfoUrlObj["license"],
                            type:'modify',
                            id: id
                        }}>수정</Button>
                    <Button 
                        className='ms-1' 
                        tag={Link} 
                        to={ROUTE_SYSTEMMGMT_INCONV_LICENSE} 
                        state={{
                            key: 'license'
                        }}>목록</Button>
                </CardFooter>
            </Card>
        </Fragment>
	)
}

export default LicenseDetail