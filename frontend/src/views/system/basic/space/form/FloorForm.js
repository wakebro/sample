import axios from "axios"
import { Fragment, useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { Button, CardFooter, Col, Form, FormFeedback, Input, InputGroup, Row } from "reactstrap"
import { API_SPACE_BUILDING, ROUTE_SYSTEMMGMT_BASIC_SPACE } from "../../../../../constants"
import {
	axiosPostPut,
	checkSelectValue, checkSelectValueObj,
	compareCodeWithValue, makeSelectList, setFormData,
	setValueFormat, sweetAlert
} from "../../../../../utility/Utils"
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { BasicInfoAPIObj as companyInfo } from "../../company/data"
import { apiObj, labelObj } from '../data'

const FloorForm = (props) => {
	useAxiosIntercepter()
	const { pageType, setPageType, control, handleSubmit, errors, oldCode, checkCode, setCheckCode, setValue, setSubmitResult, rowId, selectError, setSelectError, watch, detailBackUp } = props
	const {property, building} = selectError
	const [propertyList, setPropertyList] = useState([])
	const [buildingList, setBuildingList] = useState([])

	const getPropertyBudildingList = () => {
		axios.get(companyInfo.property, {
			params: {searchValue:'', selectFilter:''}
		})
		.then(res => {
			makeSelectList(false, 'custom1', res.data, propertyList, setPropertyList, ['name', 'code'], 'id')
		})
	}

	const onSubmit = (data) => {
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }
		if (!checkCode && (data.code !== oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
		const formData = new FormData()
		setFormData(data, formData)

		const API = pageType === 'register' ? `${apiObj['floor']}/-1`
										: `${apiObj['floor']}/${rowId}`

		axiosPostPut(pageType, labelObj['floor'], API, formData, setSubmitResult)
	}

	const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
		if (event.name === 'property') {
			setBuildingList([{label: '선택', value:''}])
			setValue('building', {label: '선택', value:''})
		}
		setValue(event.name, e)
	}

	useEffect(() => {
		getPropertyBudildingList()
	}, [])

	useEffect(() => {
		if (watch.value !== '') {
			axios.get(API_SPACE_BUILDING, {
				params:{
					property: watch.value
				}
			})
			.then(res => {
				if (res.data.length !== 0) makeSelectList(false, 'custom1', res.data, buildingList, setBuildingList, ['name', 'code'], 'id')
			})
		}
	}, [watch])

	return (
		<Fragment>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row className='mx-0'>
					<Col md='6' xs='12' className="card_table top">
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								사업소 코드&nbsp;
								<div className='essential_value'/>
							</Col>
							<Controller
								name='property'
								control={control}
								render={({ field: { value } }) => (
									<Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
										<Select
											name='property'
											classNamePrefix={'select'}
											className="react-select custom-select-property custom-react-select"
											styles={{menuPortal: base => ({...base, zIndex:9999})}}
											menuPortalTarget={document.body} 
											options={propertyList}
											value={value}
											onChange={ handleSelectValidation }/>
										{property && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>사업소를 선택해주세요.</div>}
									</Col>
								)}/>
						</Row>
					</Col>
					<Col md='6' xs='12' className="card_table top">
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								건물 코드&nbsp;
								<div className='essential_value'/>
							</Col>
							<Controller
								name='building'
								control={control}
								render={({ field: { value } }) => (
									<Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
										<Select
											name='building'
											classNamePrefix={'select'}
											className="react-select custom-select-building custom-react-select"
											options={buildingList}
											value={value}
											menuPortalTarget={document.body} 
											styles={{menuPortal: base => ({...base, zIndex:9999})}}
											onChange={ handleSelectValidation }/>
										{building && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>빌딩을 선택해주세요.</div>}
									</Col>
								)}/>
						</Row>
					</Col>
				</Row>
				<Row className='mx-0'>
					<Col md='6' xs='12' className="card_table mid">
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								층 코드&nbsp;
								<div className='essential_value'/>
							</Col>
							<Controller
								name='code'
								control={control}
								render={({ field }) => (
									<Col className='card_table col text'>
										<InputGroup>
											<Input bsSize='sm' invalid={errors.code && true} {...field}/>
											<Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem', zIndex:'0'}} size='sm' onClick={() => compareCodeWithValue(field.value, oldCode, apiObj.floor, setCheckCode)}>중복검사</Button>
											{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
										</InputGroup>
									</Col>
								)}/>
						</Row>
					</Col>
					<Col lg='6' md='6' xs='12' className="card_table mid">
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								층명&nbsp;
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
				<CardFooter style={{borderTop: '1px solid #dae1e7', marginTop:'2rem'}}>
					<Col style={{display:'flex', justifyContent:'flex-end'}}>
						{pageType === 'modify' && <Button color="report" onClick={() => setValueFormat(detailBackUp, control._formValues, setValue, setPageType)}>취소</Button>}
						<Button className='ms-1'color='primary' onClick={handleSubmit(onSubmit)} >{pageType === 'register' ? '저장' : '수정'}</Button>
						<Button className='ms-1'tag={Link} to={ROUTE_SYSTEMMGMT_BASIC_SPACE}>목록</Button>
					</Col>
				</CardFooter>
			</Form>
		</Fragment>
	)
}

export default FloorForm