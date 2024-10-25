import axios from 'axios'
import { Fragment, useState, useEffect } from 'react'
import { Controller} from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button, CardBody, CardFooter, Col, Form, FormFeedback, Input, InputGroup, Row } from "reactstrap"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { API_INCONV_EMPLOYEE_LEVEL, ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL, ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL_DETAIL } from '../../../../constants'
import { axiosPostPut, compareCodeWithValueProperty, sweetAlert } from '../../../../utility/Utils'
import Cookies from 'universal-cookie'
import { InconvInfoUrlObj } from '../InconData'

const EmployeeLevel = (props) => {
	const { state, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue} = props
	const [detailData, setDetailData] = useState()
	const [submitResult, setSubmitResult] = useState(false)
    const [oldCode, setOldCode] = useState()
	const cookies = new Cookies()
    const pageType = state.type
	useAxiosIntercepter()
    
	const onSubmit = (data) => {
        if ((!checkCode) && (data.code !==  oldCode)) { 
            sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
        }
		const formData = new FormData()
		formData.append('code', data.code)
        formData.append('view_order', data.view_order)
		formData.append('description', data.description)
        formData.append('property', cookies.get('property').value)
		const API = (pageType === 'register' ? API_INCONV_EMPLOYEE_LEVEL
										: `${API_INCONV_EMPLOYEE_LEVEL}/${state.id}`)

        axiosPostPut(pageType, '직급코드', API, formData, setSubmitResult)
    }

	useEffect(() => {
		if (state.type === 'modify') {
			axios.get(`${API_INCONV_EMPLOYEE_LEVEL}/${state.id}`, {params:{property:cookies.get('property').value}})
			.then(res => {
				setDetailData(res.data)
			    setOldCode(res.data.code)
			})
		}
    }, [])

	useEffect(() => {
		setCheckCode(false)
	}, [watch])

	useEffect(() => {
		if (submitResult) {
			if (state.type === 'modify') {
				window.location.href = `${ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL_DETAIL}/${state.id}`
			} else {
				window.location.href = ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL
			}
		}
	}, [submitResult])

	useEffect(() => {
		if (detailData) {
			setValue("code", detailData.code)
			setValue("view_order", detailData.view_order)
			setValue("description", detailData.description ? detailData.description : '')
		}
	}, [detailData])

	return (
        <Fragment>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <CardBody>
                    <Row className='mx-0'>
                        <Col lg='6' md='6' xs='12' className='card_table top'>
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='3'  className='card_table col col_color text center px-0'>
                                    직급코드&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <Controller
                                    name='code'
                                    control={control}
                                    render={({ field }) => (
                                        <Col className='card_table col text'>
                                            <InputGroup>
                                                <Input bsSize='sm' invalid={errors.code && true} maxLength='60' {...field}/>
                                                <Button size='sm' style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem'}} onClick={() => compareCodeWithValueProperty(field.value, cookies.get('property').value, oldCode, InconvInfoUrlObj.employee_level, setCheckCode)}>중복검사</Button>
                                                {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                                            </InputGroup>
                                        </Col>
                                )}/>
                            </Row>
                        </Col>
                        <Col lg='6' md='6' xs='12' className='card_table top'>
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='3' className='card_table col col_color text center'>보기순서</Col>
                                <Controller
                                    name='view_order'
                                    control={control}
                                    render={({ field }) => (
                                    <Col className='card_table col text' style={{flexDirection:'column'}}>
                                        <Input bsSize='sm' invalid={errors.view_order && true} {...field}/>
                                        {errors.view_order && <FormFeedback>{errors.view_order.message}</FormFeedback>}
                                    </Col>
                                )}/>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='mb-1 card_table mid'>
                        <Col lg='6' md='6' xs='12'>
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='3'className='card_table col col_color text center px-0'>
                                    업무내용&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <Controller
                                    name='description'
                                    control={control}
                                    render={({ field }) => (
                                    <Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
                                        <Input maxLength='100' bsSize='sm' invalid={errors.description && true} {...field}/>
                                        {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                                    </Col>
                                )}/>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                    {state.type === 'modify' &&
                        <Button color='report' 
                            className="ms-1"
                            tag={Link} 
                            to={`${ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL_DETAIL}/${state.id}`} 
                            state={{
                                key: 'normal'
                            }} >취소</Button> 
                    }
                    <Button type='submit' className="ms-1" color='primary'>{state.type === 'register' ? '저장' : '수정'}</Button>
                    <Button className='ms-1' tag={Link} to={ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL}>목록</Button>
                </CardFooter>
            </Form>
        </Fragment>
	)
}

export default EmployeeLevel