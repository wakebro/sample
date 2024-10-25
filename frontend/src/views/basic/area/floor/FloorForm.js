import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setPageType } from '@store/module/basicFloor'
import { Fragment, useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import { Button, CardBody, CardFooter, Col, Form, Input, InputGroup, InputGroupText, Row, FormFeedback } from "reactstrap"
import { API_SYSTEMMGMT_BASIC_INFO_FLOOR, ROUTE_BASICINFO_AREA_FLOOR } from "../../../../constants"
import { setSubmitResult } from '../../../../redux/module/basicFloor'
import { axiosPostPut, setValueFormat, AddCommaOnChange, getCommaDel } from "../../../../utility/Utils"

const FloorForm = (props) => {
	const {
		control,
		setValue,
		handleSubmit,
		trigger,
		errors
	} = props

	useAxiosIntercepter()
	const basicFloor = useSelector((state) => state.basicFloor)
	const dispatch = useDispatch()
	const [pyeong, setPyeong] = useState(control._formValues.fl_area)

	const handleCancel = () => {
		setValueFormat(basicFloor.detailBackUp, control._formValues, setValue)
		dispatch(setPageType('detail'))
	}

	const onSubmit = (data) => {
		const formData = new FormData()
		formData.append('building', data.building.value)
		formData.append('property', data.property.value)
		formData.append('code', data.code)
		formData.append('description', data.description)
		formData.append('fl_area', getCommaDel(data.fl_area))
		formData.append('name', data.name)

		const API = `${API_SYSTEMMGMT_BASIC_INFO_FLOOR}/${basicFloor.id}`
		axiosPostPut(basicFloor.pageType, '층 정보', API, formData)
		dispatch(setSubmitResult(true))
	}

	useEffect(() => {
		console.log("pyeong", pyeong)
	}, [pyeong])

	return (
		<Fragment>
			<CardBody style={{paddingBottom: '3%'}}>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
						<Col md='6' xs='12' className="border-b">
							<Row className='card_table table_row' style={{minHeight:'3rem'}}>
								<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>사업소</Col>
								<Col lg='8' md='8' xs='8' className='card_table col text start '>
									<div>{control._formValues.property.label}</div>
								</Col>
							</Row>
						</Col>
						<Col lg='6' md='6' xs='12' className="border-b">
							<Row style={{minHeight:'3rem'}}>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center '>층면적</Col>
								<Col md={8} xs='8'>
									<Controller
										id='fl_area'
										name='fl_area'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Fragment>
													<Row>
														<Col md={6} xs='12' className='card_table col text' style={{flexDirection:'column'}}>
															<InputGroup>
																<Input 
																	bsSize='sm' 
																	value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
																	style={{textAlign:'end'}}
																	invalid={errors.fl_area && true}
																	onChange={(e) => {
																		AddCommaOnChange(e, onChange)
																		const target = e.target.value
																		if (isNaN(target)) setPyeong()
																		else setPyeong(target)
																		trigger('fl_area')
																	}}
																	/>
																<InputGroupText>m<sup>2</sup></InputGroupText>
																{errors.fl_area && <FormFeedback>{errors.fl_area.message}</FormFeedback>}
															</InputGroup>
														</Col>
														{
															pyeong &&
															<Col md={6} xs='12'className='card_table col text center px-0' style={{flexDirection:'column'}}>
																<div>약 {(parseFloat(getCommaDel(pyeong)) * 0.3).toFixed(2)} 평</div>
															</Col>
														}
													</Row>
											</Fragment>
										)}/>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className="card_table mx-0 border-right">
						<Col lg='6' md='6' xs='12' className="border-b">
							<Row style={{minHeight:'3rem'}}>
								<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>건물</Col>
								<Col lg='8' md='8' xs='8' className='card_table col text start '>
									<div>{control._formValues.building.label}</div>
								</Col>
							</Row>
						</Col>
						<Col lg='6' md='6' xs='12' className="border-b">
							<Row style={{minHeight:'3rem'}}>
								<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>층코드</Col>
								<Col lg='8' md='8' xs='8' className='card_table col text start '>
									<div>{control._formValues.code}</div>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className="card_table mx-0 border-right">
						<Col lg='12' md='12' xs='12' className="border-b">
							<Row style={{minHeight:'2rem'}}>
								<Col md='2' xs='4'  className='card_table col col_color text center'>층이름</Col>
								<Controller
									name='name'
									control={control}
									render={({ field }) => (
										<Col md={10} xs= {8} className='card_table col text center' style={{flexDirection:'column'}}>
											<Input style={{width:'100%'}} bsSize='sm' {...field}/>
										</Col>
									)}/>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid'>
						<Col xs='12'>
							<Row style={{height:'100%'}}>
								<Col md='2' xs='4'  className='card_table col col_color text center'>입주사 현황</Col>
								<Controller
									name='description'
									control={control}
									render={({ field }) => (
										<Col md={10} xs= {8} className='card_table col text center' style={{flexDirection:'column'}}>
											<Input rows={10} type='textarea' style={{width:'100%', backgroundColor:'white', color:'black'}} bsSize='sm' {...field}/>
										</Col>
									)}
								/>
							</Row>
						</Col>
					</Row>
				</Form>
			</CardBody>
			<CardFooter>
				<Row>
					<Col className='d-flex justify-content-end' style={{paddingRight: '3%'}}>
					<Button color='report' onClick={() => handleCancel()}>취소</Button>
					<Button className='ms-1' onClick={handleSubmit(onSubmit)} color='primary'>수정</Button>
					<Button className='ms-1' tag={Link} to={ROUTE_BASICINFO_AREA_FLOOR}>목록</Button>
					</Col>
				</Row>
			</CardFooter>
		</Fragment>
	)
}

export default FloorForm