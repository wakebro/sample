import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button, CardBody, Col, Form, FormFeedback, Input, InputGroup, Row, CardFooter } from "reactstrap"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { API_INCONV_NORMAL, ROUTE_SYSTEMMGMT_INCONV_NORMAL, ROUTE_SYSTEMMGMT_INCONV_NORMAL_DETAIL } from '../../../../constants'
import { axiosPostPut, compareCodeWithValueProperty, sweetAlert } from '../../../../utility/Utils'
import Cookies from 'universal-cookie'

// 안쓰는 컴포넌트
const Normal = (props) => {
	const { state, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue} = props
	const [detailData, setDetailData] = useState()
	const [submitResult, setSubmitResult] = useState(false)
	const [oldCode, setOldCode] = useState()
	const cookies = new Cookies()
	useAxiosIntercepter()

	const onSubmit = (data) => {
		if ((!checkCode) && (data.code !==  oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
		const pageType = state.type
		const formData = new FormData()
		formData.append('code', data.code)
		formData.append('unit', data.unit)
		formData.append('property', cookies.get('property').value)
		const API = pageType === 'register' ? API_INCONV_NORMAL
										: `${API_INCONV_NORMAL}/${state.id}`

		axiosPostPut(pageType, "표준자재", API, formData, setSubmitResult)
	}
	useEffect(() => {
		if (state.type === 'modify') {
			axios.get(`${API_INCONV_NORMAL}/${state.id}`, {params:{property:cookies.get('property').value}})
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
				window.location.href = `${ROUTE_SYSTEMMGMT_INCONV_NORMAL_DETAIL}/${state.id}`
			} else {
				window.location.href = ROUTE_SYSTEMMGMT_INCONV_NORMAL
			}
		}
	}, [submitResult])
	useEffect(() => {
		if (detailData) {
			setValue("code", detailData.code)
			setValue("unit", detailData.unit)
		}
	}, [detailData])

	return (
		<CardBody>
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Row className='mx-0' style={{marginTop: '1%', marginBottom: '1%'}} >
				<Col md='6' xs='12' className='card_table top'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
							<div>자재 코드</div>&nbsp;
							<div className='essential_value'/>
						</Col>
						<Controller
							name='code'
							control={control}
							render={({ field }) => (
								<Col className='card_table col text'>
									<InputGroup>
										<Input maxLength='60' invalid={errors.code && true} {...field}/>
										<Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem'}} onClick={() => compareCodeWithValueProperty(field.value, cookies.get('property').value, oldCode, API_INCONV_NORMAL, setCheckCode)}>중복검사</Button>
										{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
									</InputGroup>
								</Col>
							)}/>
					</Row>
				</Col>
				<Col md='6' xs='12' className='card_table top'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
							표준단위&nbsp;
							<div className='essential_value'/>
						</Col>
						<Controller
							name='unit'
							control={control}
							render={({ field }) => (
								<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
									<Input maxLength='10' style={{width:'100%'}} bsSize='sm' invalid={errors.unit && true} {...field} />
									{errors.unit && <FormFeedback>{errors.unit.message}</FormFeedback>}
								</Col>
							)}/>
					</Row>
				</Col>
			</Row>
			<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
				<Fragment >
					{state.type === 'modify' &&
						<Button color='report' 
							className="ms-1"
							tag={Link} 
							to={`${ROUTE_SYSTEMMGMT_INCONV_NORMAL_DETAIL}/${state.id}`} 
							state={{
								key: 'normal'
							}} >취소</Button>
					}
					<Button type='submit' className="ms-1" color='primary'>{state.type === 'register' ? '저장' : '수정'}</Button>
					<Button
						className="ms-1"
						tag={Link} 
						to={ROUTE_SYSTEMMGMT_INCONV_NORMAL} 
						>목록</Button>
				</Fragment>
			</CardFooter>
		</Form>
	</CardBody>
	)
}

export default Normal