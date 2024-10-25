import { Fragment } from "react"
import { Controller } from "react-hook-form"
import { Link } from 'react-router-dom'
import { Button, CardBody, CardFooter, Col, Form, Input, InputGroup, InputGroupText, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_SYSTEMMGMT_BASIC_INFO_PROPERTY, ROUTE_BASICINFO_AREA_PROPERTY } from "../../../../constants"
import { axiosPostPut, setFormData, setValueFormat, autoPhoneNumberHyphen } from "../../../../utility/Utils"

const PropertyForm = (props) => {
	const {
		pageType,
		setPageType,
		control,
		setValue,
		handleSubmit,
		detailBackUp,
		setSubmitResult
	} = props
	
	const cookies = new Cookies()

	// PUT
	const onSubmit = (data) => {
		const formData = new FormData()
		setFormData(data, formData)

		const API = `${API_SYSTEMMGMT_BASIC_INFO_PROPERTY}/${cookies.get('property').value}`
		axiosPostPut(pageType, '사업자 정보', API, formData, setSubmitResult)
	}

	return (
		<Fragment>
			<CardBody style={{paddingBottom: '3%'}}>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
						<Col md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>사업소</Col>
								<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
									<div style={{width:'100%'}}>{control._formValues.name}</div>
								</Col>
							</Row>
						</Col>
						<Col lg='6' md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>지역</Col>
								<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
									<div style={{width:'100%'}}>{control._formValues.city.label}</div>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className="card_table mx-0 border-right">
						<Col lg='6' md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>용도</Col>
								<Controller
									name='main_purpose'
									control={control}
									render={({ field }) => (
										<Col md={8} className='card_table col text center' style={{flexDirection:'column'}}>
											<Input style={{width:'100%'}} bsSize='sm' maxLength={45} {...field}/>
										</Col>
									)}/>
							</Row>
						</Col>
						<Col lg='6' md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>담당자</Col>
								<Controller
									name='contact_name'
									control={control}
									render={({ field }) => (
										<Col md={8} className='card_table col text center' style={{flexDirection:'column'}}>
											<Input style={{width:'100%'}} bsSize='sm' maxLength={45} {...field}/>
										</Col>
									)}/>
							</Row>
						</Col>
					</Row>
					<Row className="card_table mx-0 border-right">
						<Col lg='6' md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>건물수</Col>
								<Col md={8} className='card_table col text center' style={{flexDirection:'column'}}>
									<div style={{width:'100%', textAlign:'end'}}>{control._formValues.prop_group}&nbsp;</div>
								</Col>
							</Row>
						</Col>
						<Col lg='6' md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>연락처</Col>
								<Controller
									name='contact_phone'
									control={control}
									render={({ field: {onChange, value} }) => (
										<Col md={8} className='card_table col text center' style={{flexDirection:'column'}}>
											<Input 
												maxLength={45} 
												style={{width:'100%'}} 
												bsSize='sm' 
												value={value}
												onChange={(e) => {
												autoPhoneNumberHyphen(e, onChange)
											}}/>
										</Col>
									)}/>
							</Row>
						</Col>
					</Row>
					<Row className="card_table mx-0 border-right">
						<Col lg='6' md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>연체이자율</Col>
								<Col md={8} className='card_table col text center' style={{flexDirection:'column'}}>
									<Row>
										<Controller
											name='overdue_daily_rate'
											control={control}
											render={({ field }) => (
												<Col lg={6} xs={12}>
													<InputGroup>
														<Input type='number' bsSize='sm' {...field} style={{textAlign:'end'}}/>
														<InputGroupText>%(일)</InputGroupText>
													</InputGroup>
												</Col>
											)}/>
										<Controller
											name='overdue_monthly_rate'
											control={control}
											render={({ field }) => (
												<Col lg={6} xs={12}>
													<InputGroup>
														<Input type='number' bsSize='sm' {...field} style={{textAlign:'end'}}/>
														<InputGroupText>%(월)</InputGroupText>
													</InputGroup>
												</Col>
											)}/>
									</Row>
								</Col>
							</Row>
						</Col>
						<Col lg='6' md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>주소</Col>
								<Controller
									name='address'
									control={control}
									render={({ field }) => (
										<Col md={8} className='card_table col text center' style={{flexDirection:'column'}}>
											<Input style={{width:'100%'}} bsSize='sm'  maxLength={250} {...field}/>
										</Col>
									)}/>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid'>
						<Col xs='12'>
							<Row className='card_table table_row'>
								<Col lg='2' md='2' xs='4' className='card_table col col_color text center'>비고</Col>
								<Controller
									name='description'
									control={control}
									render={({ field }) => (
										<Col md={10} className='card_table col text center' style={{flexDirection:'column'}}>
											<Input rows={10} type="textarea" style={{width:'100%'}} bsSize='sm' {...field}/>
										</Col>
									)}/>
							</Row>
						</Col>
					</Row>
				</Form>
			</CardBody>
			<CardFooter>
				<Row>
					<Col style={{display:'flex', justifyContent:'flex-end'}}>
						{pageType === 'modify' && <Button color='report' onClick={() => setValueFormat(detailBackUp, control._formValues, setValue, setPageType)}>취소</Button>}
						<Button className="ms-1" onClick={handleSubmit(onSubmit)} color='primary'>수정</Button>
						<Button className="ms-1" tag={Link} to={ROUTE_BASICINFO_AREA_PROPERTY}>목록</Button>
					</Col>
				</Row>
			</CardFooter>
		</Fragment>
	)
}

export default PropertyForm