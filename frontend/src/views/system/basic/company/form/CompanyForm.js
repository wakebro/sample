import Cleave from 'cleave.js/react'
import { isEmptyObject } from 'jquery'
import { Fragment, useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { Button, CardFooter, Col, Form, FormFeedback, Input, InputGroup, Label, Row } from "reactstrap"
import { ROUTE_SYSTEMMGMT_BASIC_COMPANY } from '../../../../../constants'
import { axiosPostPut, checkSelectValue, checkSelectValueObj, compareCodeWithValueProperty, setFormData, setValueFormat, sweetAlert, autoPhoneNumberHyphen } from "@utils"
import { BasicInfoAPIObj, BasicInfoLabelObj, cleaveFormat, companyTypeList, replaceStr2Null } from '../data'

const CompanyForm = (props) => {
	const {pageType, setPageType, control, handleSubmit, errors, oldCode, checkCode, setCheckCode, setValue, setSubmitResult, rowId, detailBackUp, property_id} = props
	const [selectList] = useState(companyTypeList)

	// Select validation
	const [selectError, setSelectError] = useState({type: false})
	const {type} = selectError

	const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
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

		formData.append('property', property_id)

		const API = pageType === 'register' ? `${BasicInfoAPIObj['company']}/-1`
										: `${BasicInfoAPIObj['company']}/${rowId}`

		axiosPostPut(pageType, BasicInfoLabelObj['company'], API, formData, setSubmitResult)
	}

	useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])
	return (
		<Fragment>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row className='mx-0'>
					<Col md='6' xs='12' className='card_table top'>
						<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
							회사 코드&nbsp;
							<div className='essential_value'/>
						</Col>
							<Controller
								name='code'
								control={control}
								render={({ field }) => (
									<Col className='card_table col text'>
										<InputGroup>
											<Input maxLength={30} bsSize='sm' invalid={errors.code && true} {...field}/>
											<Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem'}} size='sm' onClick={() => compareCodeWithValueProperty(field.value, property_id, oldCode, BasicInfoAPIObj.company, setCheckCode)}>중복검사</Button>
											{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
										</InputGroup>
									</Col>
								)}/>
						</Row>
					</Col>
					<Col lg='6' md='6' xs='12' className='card_table top'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>회사구분</Col>
							<Controller
								name='type'
								control={control}
								render={({ field: { value } }) => (
									<Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
										<Select
											name='type'
											classNamePrefix={'select'}
											className="react-select custom-select-type custom-react-select"
											options={selectList}
											value={value}
											onChange={ handleSelectValidation }/>
										{type && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>업체를 선택해주세요.</div>}
									</Col>
								)}/>
						</Row>
					</Col>
				</Row>
				<Row className='mx-0'>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>보기설정</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text center' style={{justifyContent:'space-between'}}>
								<Controller
									name='use_property_group'
									control={control}
									render={({ field : {onChange, value} }) => (
										<Col className='form-check'>
											<Input id='use_property_group_true' value={true} type='radio' checked={value === true}
											onChange={() => onChange(true)}/>
											<Label className='form-check-label' for='use_property_group_true'>
												부동산
											</Label>
										</Col>
									)}/>
								<Controller
									name='use_property_group'
									control={control}
									render={({ field : {onChange, value} }) => (
										<Col className='form-check'>
											<Input id='use_property_group_false' value={false} type='radio' checked={value === false}
											onChange={() => onChange(false)}/>
											<Label className='form-check-label' for='use_property_group_false'>
												전사
											</Label>
										</Col>
									)}/>
							</Col>
						</Row>
					</Col>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								회사명&nbsp;<div className='essential_value'/>
							</Col>
							<Controller
								name='name'
								control={control}
								render={({ field }) => (
									<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
										<Input maxLength={30} style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field}/>
										{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
									</Col>
								)}/>
						</Row>
					</Col>
				</Row>
				<Row className='mx-0'>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>법인번호</Col>
								<Controller
									name='coporate_number'
									control={control}
									render={({ field }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
											<Input maxLength={30} style={{width:'100%'}} bsSize='sm' {...field}/>
										</Col>
									)}/>
						</Row>
					</Col>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>사업자번호</Col>
								<Controller
									name='company_number'
									control={control}
									render={({ field }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
											<Input maxLength={30} style={{width:'100%'}} bsSize='sm' {...field}/>
										</Col>
									)}/>
						</Row>
					</Col>
				</Row>
				<Row className='mx-0'>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>대표자</Col>
								<Controller
									name='ceo'
									control={control}
									render={({ field }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
											<Input maxLength={30} style={{width:'100%'}} bsSize='sm' {...field}/>
										</Col>
									)}/>
						</Row>
					</Col>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>주민등록번호</Col>
								<Controller
									name='personal_number'
									control={control}
									render={({ field }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
											<Cleave style={{height:'90%'}} className='form-control' options={cleaveFormat['personal_number']} id='personal_number' {...field}/>
										</Col>
									)}/>
						</Row>
					</Col>
				</Row>
				<Row className='mx-0'>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>업태</Col>
								<Controller
									name='business_type'
									control={control}
									render={({ field }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
											<Input maxLength={30} style={{width:'100%'}} bsSize='sm' {...field}/>
										</Col>
									)}/>
						</Row>
					</Col>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>종목</Col>
								<Controller
									name='business_item'
									control={control}
									render={({ field }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
											<Input maxLength={30} style={{width:'100%'}} bsSize='sm' {...field}/>
										</Col>
									)}/>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid'>
					<Col xs='12'>
						<Row className='card_table table_row'>
							<Col md='2' xs='4' className='card_table col col_color text center'>주소</Col>
								<Controller
									name='address'
									control={control}
									render={({ field }) => (
										<Col md='10' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
											<Input maxLength={50} style={{width:'100%'}} bsSize='sm' {...field}/>
										</Col>
									)}/>
						</Row>
					</Col>
				</Row>
				<Row className='mx-0'>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>담당자</Col>
								<Controller
									name='contact_name'
									control={control}
									render={({ field }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
											<Input maxLength={30} style={{width:'100%'}} bsSize='sm' {...field}/>
										</Col>
									)}/>
						</Row>
					</Col>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>전화번호</Col>
								<Controller
									name='contact_mobile'
									control={control}
									render={({ field: {onChange, value} }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
											<Input maxLength={30} style={{width:'100%'}} bsSize='sm' value={value}
												placeholder='- 없이 작성해주세요' onChange={e => { replaceStr2Null(e, onChange) }}/>
										</Col>
									)}/>
						</Row>
					</Col>
				</Row>
				<Row className='mx-0'>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>핸드폰</Col>
								<Controller
									name='phone'
									control={control}
									render={({ field: {onChange, value} }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
											<Input maxLength={30} placeholder='- 없이 작성해주세요' style={{width:'100%'}} bsSize='sm' value={value}
												onChange={e => { autoPhoneNumberHyphen(e, onChange) }}/>
											{/* <Cleave style={{height:'90%'}} className='form-control' options={cleaveFormat['phone']} id='phone' {...field}/> */}
										</Col>
									)}/>
						</Row>
					</Col>
					<Col md='6' xs='12' className='card_table mid'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>팩스번호</Col>
								<Controller
									name='fax'
									control={control}
									render={({ field: {onChange, value} }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
											<Input maxLength={30} placeholder='- 없이 작성해주세요' style={{width:'100%'}} bsSize='sm' value={value}
												onChange={e => { replaceStr2Null(e, onChange) }}/>
										</Col>
									)}/>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid'>
					<Col md='6' xs='12'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>e-mail</Col>
								<Controller
									name='email'
									control={control}
									render={({ field }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
											<Input maxLength={30} type='email' placeholder='gildong.hong@email.com' invalid={errors.email && true} style={{width:'100%'}} bsSize='sm' {...field}/>
											{errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
										</Col>
									)}/>
						</Row>
					</Col>
				</Row>
				<Row className='mx-0'>
					<Col xs='12' className='card_table mid'>
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
						{pageType === 'modify' && <Button color='report' onClick={() => {
							setValueFormat(detailBackUp, control._formValues, setValue, setPageType)
							setValue('type', {label:detailBackUp.type, value:detailBackUp.type})
						}}>취소</Button>}
						<Button onClick={handleSubmit(onSubmit)} className='ms-1' color='primary'>{pageType === 'register' ? '저장' : '수정'}</Button>

						<Button className='ms-1' tag={Link} to={ROUTE_SYSTEMMGMT_BASIC_COMPANY}>목록</Button>
					</Col>
				</CardFooter>
			</Form>
		</Fragment>
	)
}

export default CompanyForm