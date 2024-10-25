import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "reactstrap"
import { useParams, Link } from 'react-router-dom'
import { API_INCONV_EMPLOYEE_LEVEL, ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL } from '../../../../constants' 
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import Cookies from 'universal-cookie'
import {axiosDelete, checkOnlyView} from '../../../../utility/Utils'
import { InconvInfoUrlObj } from '../InconData'
import Breadcrumbs from '@components/breadcrumbs'
import { useSelector } from 'react-redux'
import { SYSTEM_INCONVENIENCE_EMPLOYEE_LEVEL } from '../../../../constants/CodeList'

const EmployeeLevelDetail = () => {
	const { id } = useParams()
    const loginAuth = useSelector((state) => state.loginAuth)
    const [data, setData] = useState()
	const cookies = new Cookies()
    const [submitResult, setSubmitResult] = useState(false)
	
	useAxiosIntercepter()

	const handleDeleteSubmit = () => {
        axiosDelete('직급 관리', `${API_INCONV_EMPLOYEE_LEVEL}/${id}`, setSubmitResult)
	}

    useEffect(() => {
		axios.get(`${API_INCONV_EMPLOYEE_LEVEL}/${id}`, {params:{property:cookies.get('property').value}})
		.then(res => {
			setData(res.data)
		})
    }, [])

    useEffect(() => {
		if (submitResult) {
			window.location.href = ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL
		}
	}, [submitResult])

	return (
        <Fragment>
            <Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='직급 관리' breadCrumbParent='시스템관리' breadCrumbParent2='시설표준정보' breadCrumbActive='직급 관리' />
				</div>
			</Row>
            <Card>
                <CardHeader>
                    <CardTitle className="title">
                    직급 관리
                    </CardTitle>
                </CardHeader>
                { data && 
				<CardBody style={{marginBottom: '1%'}}>
                    <Row className='mx-0'>
                        <Col lg='6' md='6' xs='12' className='card_table top'>
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>직급 코드</Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                    <Col style={{width:'100%'}}>
                                        <div>{data.code}</div>
                                    </Col>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg='6' md='6' xs='12' className='card_table top'>
                            <Row className='card_table' style={{height:'100%'}}>
                                <Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>보기순서</Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text start '>
                                    <div>{data.view_order}</div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='mb-1 card_table mid'>
                        <Col lg='6' md='6' xs='12'>
                            <Row className='card_table'>
                                <Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>업무 내용</Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text start '>
                                    <Col style={{width:'100%'}}>
                                        <div>{data.description}</div>
                                    </Col>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
                }
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
                    <Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_EMPLOYEE_LEVEL, 'available_delete')}
                        type='button' color='danger' onClick={handleDeleteSubmit}>삭제</Button>
                    <Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_EMPLOYEE_LEVEL, 'available_update')}
                        type='submit' color='primary' tag={Link} 
                        className='ms-1'
                        to={`${ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL}/add`} 
                        state={{
                            title: "직급 관리",
                            key: "employee_level",
                            API: InconvInfoUrlObj["employee_level"],
                            type:'modify',
                            id: id
                        }}>수정</Button>
                    <Button
                        className='ms-1'
                        tag={Link} 
                        to={ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL} 
                        state={{
                            key: 'employee_level'
                        }} >목록</Button>
                </CardFooter>
            </Card>
        </Fragment>
	)
	// 삭제할때 확인
}
export default EmployeeLevelDetail