import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { Button, CardFooter, Col, Form, FormFeedback, Input, InputGroup, Label, Row } from "reactstrap"
import { ROUTE_SYSTEMMGMT_BASIC_COMPANY } from '../../../../../constants'
import { axiosPostPut, setValueFormat, checkSelectValue, checkSelectValueObj, compareCodeWithValue, setFormData, sweetAlert } from "../../../../../utility/Utils"
import { BasicInfoAPIObj, BasicInfoLabelObj } from '../data'

const PropertyForm = (props) => {
	const {pageType, setPageType, 
		control, 
		handleSubmit, 
		errors, oldCode, 
		checkCode, 
		setCheckCode, 
		setValue, setSubmitResult, rowId, selectError, setSelectError,
		detailBackUp
	} = props
	const {city} = selectError
	const [citytList, setCityList] = useState([{label: '지역 선택', value:''}])
	const [propertyGroupList, setPropertyGroupList] = useState([{label: '사업소 그룹 선택', value:''}])

	const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

	const getSelectList = (API, params, setList) => {
		axios.get(API, {
			params: params
		})
		.then(res => {
			const tempList = []
			res.data.map(data => {
				tempList.push({label:data.name, value:data.id})
			})
			setList(prevList => [...prevList, ...tempList])
		})
	}

	// POST, PUT
	const onSubmit = (data) => {
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }
		if (!checkCode && (data.code !== oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
		const formData = new FormData()
		setFormData(data, formData)

		const API = pageType === 'register' ? `${BasicInfoAPIObj['property']}/-1`
										: `${BasicInfoAPIObj['property']}/${rowId}`

		axiosPostPut(pageType, BasicInfoLabelObj['property'], API, formData, setSubmitResult)
	}

	function handleCancle() {
		setValueFormat(detailBackUp, control._formValues, setValue, setPageType)
	}

	useEffect(() => {
		getSelectList(BasicInfoAPIObj.city, {searchValue: ''}, setCityList)
		getSelectList(BasicInfoAPIObj.propertyGroup, {searchValue: ''}, setPropertyGroupList)
	}, [])

	return (
		<Fragment>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row className='mx-0'>
					<Col md='6' xs='12' className='card_table top'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								<div>사업소 코드</div>&nbsp;
								<div className='essential_value'/>
							</Col>
							<Controller
								name='code'
								control={control}
								render={({ field }) => (
									<Col className='card_table col text'>
										<InputGroup>
											<Input bsSize='sm' invalid={errors.code && true} {...field}/>
											<Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem'}} size='sm' onClick={() => compareCodeWithValue(field.value, oldCode, BasicInfoAPIObj.property, setCheckCode)}>중복검사</Button>
											{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
										</InputGroup>
									</Col>
								)}/>
						</Row>
					</Col>
					<Col md='6' xs='12' className='card_table top'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								사업소 이름&nbsp;
								<div className='essential_value'/>
							</Col>
							<Controller
								name='name'
								control={control}
								render={({ field }) => (
									<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
										<Input style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field}/>
										{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
									</Col>
								)}/>
						</Row>
					</Col>
				</Row>
				<Row className='mx-0'>
					<Col lg='6' md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								사업소 그룹
							</Col>
							<Controller
								name='property_group'
								control={control}
								render={({ field: { onChange, value } }) => (
									<Col md={8} className='card_table col text center' style={{flexDirection:'column'}}>
										<Select
											name='property_group'
											classNamePrefix={'select'}
											className="react-select custom-select-property_group custom-react-select"
											options={propertyGroupList}
											value={value}
											onChange={onChange}/>
									</Col>
								)}/>
						</Row>
					</Col>
					<Col lg='6' md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								지역&nbsp;
								<div className='essential_value'/>
							</Col>
							<Controller
								name='city'
								control={control}
								render={({ field: { value } }) => (
									<Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
										<Select
											name='city'
											classNamePrefix={'select'}
											className="react-select custom-select-city custom-react-select"
											options={citytList}
											value={value}
											onChange={ handleSelectValidation }/>
										{city && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>지역을 선택해주세요.</div>}
									</Col>
								)}/>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid'>
					<Col md='6' xs='12'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>사업소 종류</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text center' style={{justifyContent:'space-between'}}>
								<Controller
									name='high_property'
									control={control}
									render={({ field : {onChange, value} }) => (
										<Col className='form-check'>
											<Input id='high_property_true' value={true} type='radio' checked={value === true}
											onChange={() => onChange(true)}/>
											<Label className='form-check-label' for='high_property_true'>
												상위 사업소
											</Label>
										</Col>
									)}/>
								<Controller
									name='high_property'
									control={control}
									render={({ field : {onChange, value} }) => (
										<Col className='form-check'>
											<Input id='high_property_false' value={false} type='radio' checked={value === false}
											onChange={() => onChange(false)}/>
											<Label className='form-check-label' for='high_property_false'>
												일반 사업소
											</Label>
										</Col>
									)}/>
							</Col>
						</Row>
					</Col>
					{
						pageType === 'register' &&
						<Col md='6' xs='12'>
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>직종통제</Col>
								<Col lg='8' md='8' xs='8' className='card_table col text center' style={{justifyContent:'space-between'}}>
									<Controller
										name='employee_class_control'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='form-check'>
												<Input id='employee_class_control_true' value={true} type='radio' checked={value === true}
												onChange={() => onChange(true)}/>
												<Label className='form-check-label' for='employee_class_control_true'>
													사용
												</Label>
											</Col>
										)}/>
									<Controller
										name='employee_class_control'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='form-check'>
												<Input id='employee_class_control_false' value={false} type='radio' checked={value === false}
												onChange={() => onChange(false)}/>
												<Label className='form-check-label' for='employee_class_control_false'>
													사용안함
												</Label>
											</Col>
										)}/>
								</Col>
							</Row>
						</Col>
					}
				</Row>
				<Row className='mx-0'>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>사설망</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text center' style={{justifyContent:'space-between'}}>
								<Controller
									name='use_intranet'
									control={control}
									render={({ field : {onChange, value} }) => (
										<Col className='form-check'>
											<Input id='use_intranet_true' value={true} type='radio' checked={value === true}
											onChange={() => onChange(true)}/>
											<Label className='form-check-label' for='use_intranet_true'>
												사용
											</Label>
										</Col>
									)}/>
								<Controller
									name='use_intranet'
									control={control}
									render={({ field : {onChange, value} }) => (
										<Col className='form-check'>
											<Input id='use_intranet_false' value={false} type='radio' checked={value === false}
											onChange={() => onChange(false)}/>
											<Label className='form-check-label' for='use_intranet_false'>
												사용안함
											</Label>
										</Col>
									)}/>
							</Col>
						</Row>
					</Col>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>경보사용</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text center' style={{justifyContent:'space-between'}}>
								<Controller
									name='use_alarm'
									control={control}
									render={({ field : {onChange, value} }) => (
										<Col className='form-check'>
											<Input id='use_alarm_true' value={true} type='radio' checked={value === true}
											onChange={() => onChange(true)}/>
											<Label className='form-check-label' for='use_alarm_true'>
												사용
											</Label>
										</Col>
									)}/>
								<Controller
									name='use_alarm'
									control={control}
									render={({ field : {onChange, value} }) => (
										<Col className='form-check'>
											<Input id='use_alarm_false' value={false} type='radio' checked={value === false}
											onChange={() => onChange(false)}/>
											<Label className='form-check-label' for='use_alarm_false'>
												사용안함
											</Label>
										</Col>
									)}/>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid'>
					<Col xs='12'>
						<Row className='card_table table_row'>
							<Col md='2' xs='4' className='card_table col col_color text center'>비고</Col>
							<Col md='10' xs='8' className='card_table col text center' style={{justifyContent:'space-between'}}>
							<Controller
								name='description'
								control={control}
								render={({ field }) => (
									<Fragment>
										<Input type='textarea' rows='10' placeholder='비고 내용을 입력해주세요.' {...field}/>
									</Fragment>
								)}/>
							</Col>
						</Row>
					</Col>
				</Row>
				<CardFooter style={{borderTop: '1px solid #dae1e7', marginTop:'2rem'}}>
					<Col style={{display:'flex', justifyContent:'flex-end'}}>
						{pageType === 'modify' && <Button color='report' onClick={() => handleCancle()}>취소</Button>}
						<Button onClick={handleSubmit(onSubmit)} color='primary' className='ms-1'>{pageType === 'register' ? '저장' : '수정'}</Button>
						<Button className='ms-1' tag={Link} to={ROUTE_SYSTEMMGMT_BASIC_COMPANY}>목록</Button>
					</Col>
				</CardFooter>
			</Form>
		</Fragment>
	)
}

export default PropertyForm