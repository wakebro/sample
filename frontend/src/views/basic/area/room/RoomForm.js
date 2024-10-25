import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setPageType, setSubmitResult } from '@store/module/basicRoom'
import { makeSelectList, selectListType, setFormData, setValueFormat } from '@utils'
import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { Button, CardBody, CardFooter, Col, Form, FormFeedback, Input, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_SPACE_BUILDING, API_SPACE_FLOOR, API_SPACE_ROOM, ROUTE_BASICINFO_AREA_ROOM } from '../../../../constants'
import { axiosPostPutRedux } from '../../../../utility/Utils'

const apiObj = {
	buildings: API_SPACE_BUILDING,
	floors: API_SPACE_FLOOR
}
const defaultValue = {label:'등록된 층이 없습니다.', value:''}

const RoomForm = (props) => {
	const {
		control
		, handleSubmit
		, errors
		, setValue
		, watch
	} = props
	useAxiosIntercepter()
	const cookies = new Cookies()
	const basicRoom = useSelector((state) => state.basicRoom)
	const dispatch = useDispatch()
	const [buildings, setBuildings] = useState([])
	const [floors, setFloors] = useState([])

	const handleSelectValidation = (e, event) => {
		if (event.name === 'building') {
			setFloors([])
			setValue('floor', defaultValue)
		}
		setValue(event.name, e)
	}

	const getDataList = (API, params, useState, setUseSate, key) => {
		axios.get(API, {params:params})
		.then(res => {
			makeSelectList(false, 'custom1', res.data, useState, setUseSate, ['code', 'name'], 'id')
			if (res.data.length > 0 && basicRoom.pageType === 'register') setValue(key, selectListType('custom1', res.data[0], ['code', 'name'], 'id'))
		})
	}

	const onSubmit = (data) => {
		const formData = new FormData()
		setFormData(data, formData)
		formData.append('property', cookies.get('property').value)

		const API = basicRoom.pageType === 'register' ? `${API_SPACE_ROOM}/-1`
										: `${API_SPACE_ROOM}/${basicRoom.id}`
		axiosPostPutRedux(basicRoom.pageType, '실정보', API, formData, dispatch, setSubmitResult, true)
	}

	const handleDisable = () => {
		if (watch('floor').value === '') return true
		return false
	}

	const handleModifyCancel = () => {
		setValueFormat(basicRoom.detailBackUp, control._formValues, setValue)
		dispatch(setPageType('detail'))
	}

	useEffect(() => {
		const params = {property :  cookies.get('property').value}
		getDataList(apiObj.buildings, params, buildings, setBuildings, 'building')
	}, [])
	
	useEffect(() => {
		if (watch('building').value !== '') {
			setFloors([])
			const params = {
				property: cookies.get('property').value,
				building: watch('building').value
			}
			getDataList(apiObj.floors, params, floors, setFloors, 'floor')
		}
	}, [watch('building')])

	return (
		<Fragment>
			<CardBody style={{paddingBottom: '3%'}}>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Row className='card_table top'>
						<Col md='6' xs='12'>
							<Row className='card_table table_row' style={{minHeight:'3rem'}}>
								<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>사업소</Col>
								<Col lg='8' md='8' xs='8' className='card_table col text start '>{cookies.get('property').label}</Col>
							</Row>
						</Col>
					</Row>
					<Row className="card_table mx-0 border-right">
						<Col md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>건물</Col>
								<Controller
									name='building'
									control={control}
									render={({ field: { value } }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text start '>
											<Select
												name='building'
												classNamePrefix={'select'}
												className="react-select custom-select-city custom-react-select"
												options={buildings}
												value={value}
												onChange={ handleSelectValidation }
											/>
										</Col>
									)}/>
							</Row>
						</Col>
						<Col md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>
									실번호&nbsp;
									<div className='essential_value'/>
								</Col>
								<Controller
									name='code'
									control={control}
									render={({ field }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
											<Input disabled={handleDisable()} style={{width:'100%'}} bsSize='sm' invalid={errors.code && true} {...field}/>
											{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
										</Col>
									)}/>
							</Row>
						</Col>
					</Row>
					<Row className="card_table mx-0 border-right">
						<Col md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>층</Col>
								<Controller
									name='floor'
									control={control}
									render={({ field: { value } }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text start '>
											<Select
												name='floor'
												classNamePrefix={'select'}
												className="react-select custom-select-city custom-react-select"
												options={floors}
												value={value}
												onChange={ handleSelectValidation }
											/>
										</Col>
									)}/>
							</Row>
						</Col>
						<Col md='6' xs='12' className="border-b">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>
									실이름&nbsp;
									<div className='essential_value'/>
								</Col>
								<Controller
									name='name'
									control={control}
									render={({ field }) => (
										<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
											<Input disabled={handleDisable()} style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field}/>
											{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
										</Col>
									)}/>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid'>
						<Col xs='12'>
							<Row style={{height:'100%'}}>
								<Col md='2' xs='4'  className='card_table col col_color text center'>입주사</Col>
								<Controller
									name='description'
									control={control}
									render={({ field }) => (
										<Col md={10} xs={8}className='card_table col text center' style={{flexDirection:'column'}}>
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
						<Button disabled={handleDisable()} onClick={handleSubmit(onSubmit)} color='primary'>{basicRoom.pageType === 'register' ? '등록' : '수정'}</Button>
						{basicRoom.pageType === 'register' && <Button className='ms-1' color="report" tag={Link} to={ROUTE_BASICINFO_AREA_ROOM}>취소</Button>}
						{basicRoom.pageType === 'modify' && <Button className='ms-1' color="report" onClick={() => handleModifyCancel()}>취소</Button>}
					</Col>
				</Row>
			</CardFooter>
		</Fragment>
	)
}

export default RoomForm