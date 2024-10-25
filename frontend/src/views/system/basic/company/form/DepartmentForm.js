import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { Button, CardFooter, Col, Form, FormFeedback, Input, InputGroup, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { ROUTE_SYSTEMMGMT_BASIC_COMPANY } from "../../../../../constants"
import { axiosPostPut, checkSelectValue, checkSelectValueObj, compareCodeWithValueProperty, makeSelectList, setFormData, setValueFormat, sweetAlert } from "../../../../../utility/Utils"
import { BasicInfoAPIObj, BasicInfoLabelObj } from "../data"

const DepartmentForm = (props) => {
	const {
		pageType, setPageType, 
		control, 
		handleSubmit, 
		errors, oldCode, 
		checkCode, 
		setCheckCode, 
		setValue, setSubmitResult, rowId, selectError, setSelectError,
		detailBackUp, code, setCode, selectCompany, setSelectCompany
	} = props
	const {company} = selectError
	const [companies, setCompanies] = useState([{label: '선택', value:''}])
	const cookies = new Cookies()

	const getCompanies = () => {
		setCompanies([])
		axios.get(BasicInfoAPIObj.company, {
			params: {
				searchValue: '',
				property: cookies.get('property').value
			}
		})
		.then(res => {
			makeSelectList(true, '', res.data, companies, setCompanies, ['name'], 'id')
		})
	}

	const handleSelectValidation = (e, event) => {
		setSelectCompany(e)
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

		const API = pageType === 'register' ? `${BasicInfoAPIObj['department']}/-1`
										: `${BasicInfoAPIObj['department']}/${rowId}`

		axiosPostPut(pageType, BasicInfoLabelObj['department'], API, formData, setSubmitResult)
	}

	const handleCompare = () => {
		if (selectCompany.value === '') {
			sweetAlert('', '회사명을 선택해주세요.', 'warning', 'center')
			return false
		}
		compareCodeWithValueProperty(code, selectCompany.value, oldCode, BasicInfoAPIObj.department, setCheckCode)
	}

	useEffect(() => {
		getCompanies()
	}, [])

	return (
		<Fragment>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row className='mx-0'>
					<Col xs='12' className="card_table top">
						<Row className='card_table table_row'>
							<Col md='2' xs='4' className='card_table col col_color text center'>
								회사명&nbsp;
								<div className='essential_value'/>
							</Col>
							<Controller
								name='company'
								control={control}
								render={({ field: { value } }) => (
									<Col md={4} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
										<Select
											name='company'
											classNamePrefix={'select'}
											className="react-select custom-select-company custom-react-select"
											options={companies}
											value={value}
											styles={{menuPortal: base => ({...base, zIndex:9999})}}
											onChange={ handleSelectValidation }/>
										{company && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>회사를 선택해주세요.</div>}
									</Col>
								)}/>
						</Row>
					</Col>
					{/* <Col md='6' xs='12' className="card_table top">
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								보기 순서&nbsp;
								<div className='essential_value'/>
							</Col>
							<Controller
								name='view_order'
								control={control}
								render={({ field: {onChange, value} }) => (
									<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
										<Input type='number' maxLength={30} style={{width:'100%'}} bsSize='sm' invalid={errors.view_order && true} value={value}
										onChange={e => { replaceStr2Null(e, onChange) }}/>
										{errors.view_order && <FormFeedback>{errors.view_order.message}</FormFeedback>}
									</Col>
								)}/>
						</Row>
					</Col> */}
				</Row>
				<Row className='mx-0'>
					<Col md='6' xs='12' className="card_table mid">
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								부서 코드&nbsp;
							<div className='essential_value'/>
							</Col>
							<Controller
								name='code'
								control={control}
								render={({ field: {onChange} }) => (
									<Col className='card_table col text'>
										<InputGroup>
											<Input style={{zIndex:0}} bsSize='sm' invalid={errors.code && true} value={code || ''} onChange={(e) => {
												onChange(e)
												setCode(e.target.value)
											}}/>
											<Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem', zIndex:'0'}} size='sm' onClick={() => handleCompare()}>중복검사</Button>
											{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
										</InputGroup>
									</Col>
								)}/>
						</Row>
					</Col>
					<Col lg='6' md='6' xs='12' className="card_table mid">
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								부서명&nbsp;
								<div className='essential_value'/>
							</Col>
							<Controller
								name='name'
								control={control}
								render={({ field }) => (
									<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
										<Input maxLength='30' style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field}/>
										{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
									</Col>
							)}/>
						</Row>
					</Col>
				</Row>
				<CardFooter style={{borderTop: '1px solid #dae1e7', marginTop:'2rem'}}>
					<Col style={{display:'flex', justifyContent:'flex-end'}}>
						{pageType === 'modify' && <Button color='report' onClick={() => {
							setValueFormat(detailBackUp, control._formValues, setValue, setPageType)
							setValue('company', {label:detailBackUp.company.name, value:detailBackUp.company.id})
						}}>취소</Button>}
						<Button className='ms-1' onClick={handleSubmit(onSubmit)} color='primary'>{pageType === 'register' ? '저장' : '수정'}</Button>
						<Button className='ms-1' tag={Link} to={ROUTE_SYSTEMMGMT_BASIC_COMPANY}>목록</Button>
					</Col>
				</CardFooter>
			</Form>
		</Fragment>
	)
}

export default DepartmentForm