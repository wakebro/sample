import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { Button, CardBody, Col, Form, FormFeedback, Input, Row, Card, CardFooter, InputGroup } from 'reactstrap'
import { API_SYSTEMMGMT_BASIC_INFO_CITY, ROUTE_SYSTEMMGMT_BASIC_COMPANY, ROUTE_SYSTEMMGMT_BASIC_COMPANY_DETAIL } from '../../../../../constants'
import { axiosDelete, axiosPostPut, compareCodeWithValue, sweetAlert } from '@utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { BasicInfoAPIObj, BasicInfoLabelObj } from '../data'
import { SYSTEM_INFO_COMPANY } from '../../../../../constants/CodeList'
import { checkOnlyView } from '../../../../../utility/Utils'
import { useSelector } from 'react-redux'

const City = (props) => {
	useAxiosIntercepter()
	const { pageType, setPageType, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue, rowId} = props
    const loginAuth = useSelector((state) => state.loginAuth)
	const [oldCode, setOldCode] = useState()
	const [submitResult, setSubmitResult] = useState(false)
	const [data, setData]  = useState(false)
	const navigate = useNavigate()

	// GET
	const getDetail = (id) => {
		axios.get(`${API_SYSTEMMGMT_BASIC_INFO_CITY}/${id}`)
		.then(res => {
			setValue('code', res.data.code)
			setValue('name', res.data.name)
			setOldCode(res.data.code)
			setData(res.data)
		})
	}

	// POST, PUT
	const onSubmit = (data) => {
		if (!checkCode && (data.code !== oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
		const formData = new FormData()
		formData.append("code", data.code)
		formData.append("name", data.name)

		const API = pageType === 'register' ? `${BasicInfoAPIObj['city']}/-1`
										: `${BasicInfoAPIObj['city']}/${rowId}`

		axiosPostPut(pageType, BasicInfoLabelObj['city'], API, formData, setSubmitResult)
	}

	// DELETE
	const onDelete = () => {
		const API = `${BasicInfoAPIObj['city']}/${rowId}`
		axiosDelete(BasicInfoLabelObj['city'], API, setSubmitResult)
	}

	useEffect(() => {
		if (rowId) {
			getDetail(rowId)
		}
	}, [])

	useEffect(() => {
		setCheckCode(false)
	}, [watch])

	useEffect(() => {
		if (submitResult) {
			if (pageType === 'modify') {
				const stateObj = {pageType:'detail'}
				stateObj['key'] = 'city'
				navigate(`${ROUTE_SYSTEMMGMT_BASIC_COMPANY_DETAIL}/${rowId}`, {state:stateObj})
			} else {
				navigate(ROUTE_SYSTEMMGMT_BASIC_COMPANY)
			}
		}
	}, [submitResult])

	return (
		<Fragment>
			<CardBody>
				{
					(pageType === 'register' || pageType === 'modify') ?
						<Form onSubmit={handleSubmit(onSubmit)}>
							<Row className='mx-0' style={{borderCollapse: 'collapse'}}>
								<Col lg='6' md='6' xs='12' className='card_table top'>
									<Row className='card_table table_row'>
										<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
											지역코드&nbsp;
											<div className='essential_value'/>
										</Col>
										<Controller
											name='code'
											control={control}
											render={({ field }) => (
												<Col className='card_table col text'>
													<InputGroup>
														<Input bsSize='sm' invalid={errors.code && true} {...field}/>
														<Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem'}} size='sm' onClick={() => compareCodeWithValue(field.value, oldCode, API_SYSTEMMGMT_BASIC_INFO_CITY, setCheckCode)}>중복검사</Button>
														{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
													</InputGroup>
												</Col>
											)}/>
									</Row>
								</Col>
								<Col lg='6' md='6' xs='12' className='card_table top'>
									<Row className='card_table table_row'>
										<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
											지역 이름&nbsp;
											<div className='essential_value'/>
										</Col>
										<Controller
											name='name'
											control={control}
											render={({ field }) => (
												<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
													<Input invalid={errors.name && true} {...field}/>
													{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
												</Col>
											)}/>
									</Row>
								</Col>
							</Row>
							<br/>
						</Form>
					:
						data && 
							<Row className='mx-0'>
								<Col lg='6' md='6' xs='12' className='card_table top'>
									<Row>
										<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>지역코드</Col>
										<Col lg='8' md='8' xs='8' className='card_table col text start'>
											<div>{data.code}</div>
										</Col>
									</Row>
								</Col>
								<Col lg='6' md='6' xs='12' className='card_table top'>
									<Row>
										<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>지역 이름</Col>
										<Col lg='8' md='8' xs='8' className='card_table col text start '>
											<div>{data.name}</div>
										</Col>
									</Row>
								</Col>
							</Row>
						
				}
			</CardBody>
			<CardFooter style={{borderTop: '1px solid #dae1e7', marginTop:'2rem'}}>
				<Fragment>
					<Row>
						<Col style={{display:'flex', justifyContent:'flex-end'}}>
							{pageType === 'detail' && <Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_COMPANY, 'available_delete')} color='danger' onClick={() => onDelete()}>삭제</Button>}
							{pageType === 'detail' && <Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_COMPANY, 'available_update')} color='primary' className='ms-1' onClick={() => setPageType('modify')}>수정</Button>}
							{pageType === 'modify' && <Button color='report' onClick={() => setPageType('detail')}>취소</Button>}
							{pageType !== 'detail' && <Button className='ms-1' onClick={handleSubmit(onSubmit)} color='primary'>{pageType === 'register' ? '저장' : '수정'}</Button>}
							<Button className='ms-1' tag={Link} to={ROUTE_SYSTEMMGMT_BASIC_COMPANY}>목록</Button>
						</Col>
					</Row>
				</Fragment>
			</CardFooter>
		</Fragment>
	)
}

export default City