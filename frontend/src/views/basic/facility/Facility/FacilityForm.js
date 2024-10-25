
import Breadcrumbs from '@components/breadcrumbs'
import { HotTable } from '@handsontable/react'
import { yupResolver } from "@hookform/resolvers/yup"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/HandsonTable.scss'
import { useAxiosIntercepter } from "@utility/hooks/useAxiosInterceptor"
import { axiosPostPut, checkSelectValue, checkSelectValueObj, handleCheckCodeWithProperty, selectListType, setStringDate, sweetAlert } from "@utils"

import axios from "axios"
import 'handsontable/dist/handsontable.full.min.css'
import { koKR, registerLanguageDictionary } from 'handsontable/i18n'
import { registerAllModules } from 'handsontable/registry'
import { isEmptyObject } from 'jquery'
import * as moment from 'moment'
import { Fragment, useEffect, useRef, useState } from "react"
import Flatpickr from "react-flatpickr"
import { Controller, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import Select from "react-select"
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, FormFeedback, Input, InputGroup, Row } from "reactstrap"
import Cookies from "universal-cookie"
import * as yup from 'yup'
import { API_BASICINFO_FACILITY_DETAIL, API_BASICINFO_FACILITY_SELECT_ARRAY, API_SPACE_FLOOR, API_SPACE_ROOM, ROUTE_BASICINFO_FACILITY_FACILITYINFO, ROUTE_BASICINFO_FACILITY_FACILITYINFO_DETAIL } from "../../../../constants"

import { nameReduxObj } from "../data"
import FacilityLog from "./FacilityLog"
import FileUploaderSingle from "./FileUploaderSingle"

import { Korean } from "flatpickr/dist/l10n/ko.js"

registerLanguageDictionary(koKR)
registerAllModules()

const keyObj = {
	buildingName: '건물',
	floorName: '층',
	floorsAPI: API_SPACE_FLOOR,
	roomName: '실',
	roomsAPI: API_SPACE_ROOM
}
const defaultValue = (name) => {
	const resultName = keyObj[`${name}Name`]
	return {label:`${resultName} 전체`, value:''}
}

const FacilityForm = () => {
	useAxiosIntercepter()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const now = moment().format('YYYY-MM-DD')
	const { state } = useLocation()
	const [files, setFiles] = useState([])
	const [selectEmployeeClassList, setSelectEmployeeClassList] = useState([{value: '', label: '직종'}])
	const [selectBuildingList, setSelectBuildingList] = useState([defaultValue('building')])
	const [floorOptions, setFloorOptions] = useState([defaultValue('floor')])
	const [roomOptions, setRoomOptions] = useState([defaultValue('room')])
	const cookies = new Cookies()
	const [data, setData] = useState()
	const [detailData, setDetailData] = useState()
	const [oldCode, setOldCode] = useState()
	const [checkCode, setCheckCode] = useState(false)
	const hotRef = useRef(null)
	const testRef = useRef(null)
	const [submitResult, setSubmitResult] = useState()
	const [clickDeleteOriginFile, setClickDeleteOriginFile] = useState(false)
	const [selectError, setSelectError] = useState({building: false})
	const {building} = selectError

	const onClickBtn = () => {
		navigate(-1)
	}
	let title = ''

	if (state.type === 'register') {
		title = '설비정보등록'
	} else {
		title = '설비정보수정'
	}

	const defaultValues = {
		code: '', // 설비코드
		name: '', // 설비명
		use: '', // 용도
		capacity: '', // 규격
		model_no: '', // 모델
		room: roomOptions[0], // 실
		maker: '', // 제조사
		create_datetime: now, // 작성일
		maker_no: '', // 제조번호
		option_2: '', // 중분류
		manufactured_date: '', // 제조일자
		purchased_date: '', // 구입일자
		installed_date: '', // 설치일자
		durab_year: '', // 내구년수
		employee_class: selectEmployeeClassList[0], // 직종
		building: selectBuildingList[0], // 건물
		floor: floorOptions[0], // 층
		user: '', // 작성자
		option_1: '', // 대분류
		description: ''  // 비고
	}

	const validationSchema = yup.object().shape({
		code: yup.string().required('설비코드를 입력해주세요.'),
		durab_year: yup.number("숫자").transform((value, originalValue) => {
			if (originalValue === "") return null
			return value
		}).min(0, '0이상 값을 입력해주세요.').nullable()
	})

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		watch
	} = useForm({
		defaultValues,
		resolver: yupResolver(validationSchema)
	})

	const handleSelectValidation = (e, event) => {
		if (event.name === 'building') {
			checkSelectValue(e, event, selectError, setSelectError, setValue)
			setValue('floor', defaultValue('floor'))
			setValue('room', defaultValue('room'))
		} else if (event.name === 'floor') {
			setValue('room', defaultValue('room'))
		}
	}
	
	const onSubmit = (data) => {
		const hot = hotRef.current.hotInstance
		const API = state.type === 'register' ? `${API_BASICINFO_FACILITY_DETAIL}/-1`
								: `${API_BASICINFO_FACILITY_DETAIL}/${state.id}`
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }
		if ((!checkCode) && (data.code !== oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
		
		const formData = new FormData()
		Object.keys(defaultValues).map((key) => {
			if (key !== 'room' && key !== 'employee_class' && key !== 'building' && key !== 'floor') {
			formData.append(key, data[key])
			}
		})
		formData.append('property', cookies.get('property').value)
		formData.append('room', data.room.value)
		formData.append('employee_class', data.employee_class.value)
		formData.append('building', data.building.value)
		formData.append('floor', data.floor.value)
		formData.append('image', files[0])
		formData.append('detail', hot.getData())
		formData.append('click_delete_origin_file', clickDeleteOriginFile)
		formData.append('user', cookies.get('userId'))
		
		axiosPostPut(state.type, "설비정보", API, formData, setSubmitResult)
	}

	const handleDeleteClick = () => {
		const hot = hotRef.current.hotInstance
		const data = hot.getData()
		const filterData = data.filter(test => test[0] !== true)
		const newData = filterData.map(data => ({available: data[0], subject: data[1], contents: data[2]}))
		hot.loadData(newData)
	}

	const getSelectList = (key, params, setState) => {
		axios.get(keyObj[`${key}sAPI`], {params:params})
		.then(res => {
			const tempList = [defaultValue(key)]
			res.data.map(row => tempList.push(selectListType('', row, ['name'], 'id')))
			setState(tempList)
		})
	}

	useEffect(() => {
		if (submitResult) {
			if (state.type === 'modify') {
				navigate(`${ROUTE_BASICINFO_FACILITY_FACILITYINFO_DETAIL}/${state.id}`)
			} else {
				navigate(ROUTE_BASICINFO_FACILITY_FACILITYINFO)
			}
		}
	}, [submitResult])
	useEffect(() => {
		if (state.type === 'register') {
			if (!isEmptyObject(errors)) {
				checkSelectValueObj(control, selectError, setSelectError)
			}
		}
	}, [errors])
	useEffect(() => {
		if (state.type === 'modify') {
			dispatch(nameReduxObj.facility.setPageType('modify'))
			dispatch(nameReduxObj.facility.setId(state.id))
			axios.get(`${API_BASICINFO_FACILITY_DETAIL}/${state.id}`, {params: {id: state.id}})
			.then(res => {
				console.log(res.data)
				setData(res.data.facility)
				setDetailData(res.data.facility_detail)
				setOldCode(res.data.facility.code)
			})
		}
	}, [])

	useEffect(() => {
		axios.get(API_BASICINFO_FACILITY_SELECT_ARRAY, {params: {property_id: cookies.get('property').value, employee_class: '', type: 'form'}})
		.then(res => {
			setSelectEmployeeClassList(res.data.employee_class_array)
			setSelectBuildingList(res.data.building_array)
		})
		.catch(res => {
			console.log(API_BASICINFO_FACILITY_SELECT_ARRAY, res)
		})
	}, [])	

	useEffect(() => {
		// if (data && selectBuildingList[0].value !== '' && selectEmployeeClassList[0].value !== '' && floorOptions[0].value !== '' && roomOptions[0].value !== '') {
		if (data) {
			setValue("code", data.code)
			setValue("name", data.name)
			setValue("use", data.use)
			setValue("capacity", data.capacity)
			setValue("model_no", data.model_no)
			setValue("room", data.room ? {value: data.room.id, label: data.room.name} : roomOptions[0])
			setValue("create_datetime", moment(data.create_datetime).format('YYYY-MM-DD'))
			setValue("maker", data.maker)
			setValue("maker_no", data.maker_no)
			setValue("option_1", data.option_1)
			setValue("option_2", data.option_2)
			setValue("manufactured_date", data.manufactured_date ? moment(data.manufactured_date).format('YYYY-MM-DD') : '')
			setValue("purchased_date", data.purchased_date ? moment(data.purchased_date).format('YYYY-MM-DD') : '')
			setValue("installed_date", data.installed_date ? moment(data.installed_date).format('YYYY-MM-DD') : '')
			setValue("durab_year", data.durab_year ? data.durab_year : '')
			setValue("employee_class", data.employee_class ? {value: data.employee_class.id, label: data.employee_class.code} : selectEmployeeClassList[0])
			setValue("building", data.building ? {value: data.building.id, label: data.building.name} : selectBuildingList[0])
			setValue("floor", data.floor ? {value: data.floor.id, label: data.floor.name} : floorOptions[0])
			setValue("user", data.user.name)
			setValue("description", data.description)
			setValue("detail", detailData)
		}
	// }, [data, selectBuildingList, selectEmployeeClassList, roomOptions, floorOptions])
	}, [data, selectBuildingList, selectEmployeeClassList])

	useEffect(() => {
		if (watch('building').value !== '') {
			console.log(watch('building').value)
			const params = {
				property: cookies.get('property').value,
				building: watch('building').value
			}
			getSelectList('floor', params, setFloorOptions)
		}
	}, [watch('building')])

	useEffect(() => {
		if (watch('floor').value !== '') {
			const params = {
				property: cookies.get('property').value,
				building: '',
				floor: watch('floor').value,
				description: ''
			}
			getSelectList('room', params, setRoomOptions)
		}
	}, [watch('floor')])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='설비정보' breadCrumbParent='기본정보' breadCrumbParent2='설비정보관리' breadCrumbActive='설비정보' />
				</div>
			</Row>
			<Card>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>{title}</CardTitle>
					</CardHeader>
					<CardBody className="mb-1">
						<Row>
							<Col md='5' style={{height: '100%'}}>
								{ state.type === 'register' ? (
									<FileUploaderSingle
										setFiles={setFiles}
										files={files}
									/>
									) : (data &&
										<FileUploaderSingle
											setFiles={setFiles}
											files={files}
											updatedfilename={data.original_file_name}
											setClickDeleteOriginFile={setClickDeleteOriginFile}
										/>
									)
								}
								<div className="d-flex form-control hidden-scrollbar mt-1 flex-column" style={{ width: '100%', height: '330px', display: 'flex', paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
									<div id='test' ref={testRef} style={{ display: 'flex', borderBottom: '1px solid #d8d6de', paddingLeft: '3%', paddingRight: '3%', paddingBottom: '2%', alignItems: 'center' }}>
										<Col style={{ alignItems: 'center' }}>세부사양</Col>
										<Button outline style={{ alignItems: 'right', marginRight: '1%'}} onClick={ handleDeleteClick }>삭제</Button>
									</div>
									{
										(state.type === 'register') 
										? (
											<HotTable
												id='hot-table'
												className="react-dataTable-Handson"
												ref={hotRef}
												language={koKR.languageCode}
												beforeRefreshDimensions={() => true}
												colHeaders={['', '구분', '규격']}
												startRows={1}
												columns={[
													{
														data: 'available',
														type: 'checkbox'
													},
													{
														data: 'subject'
													},
													{
														data: 'contents'
													}
												]}
												minSpareRows={1}
												contextMenu={true}
												width='100%'
												height='100%'
												stretchH="all"
												colWidths={[10, undefined, undefined]}
												rowHeights={40}
												columnHeaderHeight={40}
												licenseKey="non-commercial-and-evaluation"
											/>
										) : (detailData &&
											<HotTable
												id='hot-table'
												className="react-dataTable-Handson"
												ref={hotRef}
												language={koKR.languageCode}
												beforeRefreshDimensions={() => true}
												colHeaders={['', '구분', '규격']}
												data={detailData}
												columns={[
													{
														data: 'available',
														type: 'checkbox'
													},
													{
														data: 'subject'
													},
													{
														data: 'contents'
													}
												]}
												minSpareRows={1}
												contextMenu={true}
												width='100%'
												height='100%'
												stretchH="all"
												colWidths={[10, undefined, undefined]}
												rowHeights={40}
												columnHeaderHeight={40}
												licenseKey="non-commercial-and-evaluation"
											/>
										)
									}
								</div>
							</Col>
							{state.type === 'register' &&
								<Col md='7' style={{height: '100%'}}>
									<CardTitle className="mb-1">기본정보</CardTitle>
									<Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row>
												<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
													<div>장비코드</div> &nbsp;
													<div className='essential_value'/>
												</Col>
												<Col lg='8' md='8' xs='8' className='card_table col text start'>
													<Controller
														name='code'
														control={control}
														render={({ field }) => (
															<Col className='card_table col text'>
															<InputGroup>
																<Input bsSize='sm' invalid={errors.code && true} {...field}/>
																<Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem'}}  size='sm' onClick={() => handleCheckCodeWithProperty(field.value, cookies.get('property').value, `${API_BASICINFO_FACILITY_DETAIL}/-1`, setCheckCode)}>중복검사</Button>
																{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
															</InputGroup>
														</Col>
													)}/>
												</Col>
											</Row>
										</Col>
										<Col style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>설비명</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='name'
														name='name'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.name && true} {...field} />}
													/>
													{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row>
												<Col xs='4'  className='card_table col col_color text center'>용도</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='use'
														name='use'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.use && true} {...field} />}
													/>
													{errors.use && <FormFeedback>{errors.use.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
										<Col style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>규격</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='capacity'
														name='capacity'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.capacity && true} {...field} />}
													/>
													{errors.capacity && <FormFeedback>{errors.capacity.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row style={{height: '100%'}}>
												<Col xs='4' className='card_table col col_color text center '>모델</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='model_no'
														name='model_no'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.model_no && true} {...field} />}
													/>
													{errors.model_no && <FormFeedback>{errors.model_no.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
										<Col style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>작성일</Col>
												<Col xs='8' className='card_table col text start '>
												<Controller
													id='create_datetime'
													name='create_datetime'
													control={control}
													render={({field : {onChange, value}}) => <Flatpickr
														value={value}
														id='default-picker'
														className="form-control"
														onChange={(data) => {
															const newData = setStringDate(data)
															onChange(newData)
														}}
														options={{
															mode: 'single',
															maxDate: now,
															ariaDateFormat: 'Y-m-d',
															locale: Korean
														}}
														placeholder={now}
														/>
													}
												/>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row style={{height: '100%'}}>
												<Col xs='4' className='card_table col col_color text center'>제조사</Col>
												<Col xs='8' className='card_table col text start'>
													<Controller
														id='maker'
														name='maker'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.maker && true} {...field} />}
													/>
													{errors.maker && <FormFeedback>{errors.maker.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>제조번호</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='maker_no'
														name='maker_no'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.maker_no && true} {...field} />}
													/>
													{errors.maker_no && <FormFeedback>{errors.maker_no.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col lg='4' md='4' xs='4' className='card_table col col_color text center '>대분류</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='option_1'
														name='option_1'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.option_1 && true} {...field} />}
													/>
													{errors.option_1 && <FormFeedback>{errors.option_1.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>중분류</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='option_2'
														name='option_2'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.option_2 && true} {...field} />}
													/>
													{errors.option_2 && <FormFeedback>{errors.option_2.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>제조일자</Col>
												<Col xs='8' className='card_table col text start '>
												<Controller
													id='manufactured_date'
													name='manufactured_date'
													control={control}
													render={({field : {onChange, value}}) => <Flatpickr
														value={value}
														id='default-picker'
														className="form-control"
														onChange={(data) => {
															const newData = setStringDate(data)
															onChange(newData)
														}}
														options={{
															mode: 'single',
															maxDate: now,
															ariaDateFormat: 'Y-m-d',
															locale: Korean
														}}
														placeholder={now}
														/>
													}
												/>
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>구입일자</Col>
												<Col xs='8' className='card_table col text start '>
												<Controller
													id='purchased_date'
													name='purchased_date'
													control={control}
													render={({field : {onChange, value}}) => <Flatpickr
														value={value}
														id='default-picker'
														className="form-control"
														onChange={(data) => {
															const newData = setStringDate(data)
															onChange(newData)
														}}
														options={{
															mode: 'single',
															maxDate: now,
															ariaDateFormat: 'Y-m-d',
															locale: Korean
														}}
														placeholder={now} 
														/>
													}
												/>
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>설치일자</Col>
												<Col xs='8' className='card_table col text start '>
												<Controller
													id='installed_date'
													name='installed_date'
													control={control}
													render={({field : {onChange, value}}) => <Flatpickr
														value={value}
														id='default-picker'
														className="form-control"
														onChange={(data) => {
															const newData = setStringDate(data)
															onChange(newData)
														}}
														options={{
															mode: 'single',
															maxDate: now,
															ariaDateFormat: 'Y-m-d',
															locale: Korean
														}}
														placeholder={now}
														/>
													}
												/>
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>내구년수</Col>
												<Col xs='8' className='card_table col text center '>
													<Controller
														id='durab_year'
														name='durab_year'
														control={control}
														render={({ field }) => (
															<Row style={{width:'100%'}}>
																<Input type='number' invalid={errors.durab_year && true} {...field} />
																{errors.durab_year && <FormFeedback>{errors.durab_year.message}</FormFeedback>}
															</Row>
														)
													}/>
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>직종</Col>
												<Controller
													id='employee_class'
													name='employee_class'
													control={control}
													render={({ field: { onChange, value } }) => (
													<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
														<Select
															name='employee_class'
															classNamePrefix={'select'}
															className="react-select custom-select-employee_class custom-react-select"
															options={selectEmployeeClassList}
															value={value}
															defaultValue={selectEmployeeClassList[0]}
															onChange={ onChange }
														/>
													</Col>
												)}/>
											</Row>
										</Col>
										<Col lg='6' md='6' xs='12' style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col lg='4' md='4' xs='4' className='card_table col col_color text center '>
													<div>건물</div>&nbsp;
													<div className='essential_value'/>
												</Col>
												<Controller
													name='building'
													control={control}
													render={({ field: { value } }) => (
													<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
														<Select
															name='building'
															classNamePrefix={'select'}
															className="react-select custom-select-building custom-react-select"
															options={selectBuildingList}
															value={value}
															onChange={ handleSelectValidation }
														/>
														{building && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>건물을 선택해주세요.</div>}
													</Col>
												)}/>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col lg='4' md='4' xs='4' className='card_table col col_color text center '>층</Col>
												<Controller
													name='floor'
													control={control}
													render={({ field: { onChange, value } }) => (
													<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
														<Select
															isDisabled={(watch('building').value === '' || floorOptions.length <= 1) && true}
															name='floor'
															classNamePrefix={'select'}
															className="react-select custom-select-floor custom-react-select"
															options={floorOptions}
															value={value}
															onChange={(e) => {
																onChange(e)
																setValue('room', defaultValue('room'))
															}}
															menuPortalTarget={document.body} 
															styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
														/>
														{/* {emp_class && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>} */}
													</Col>
												)}/>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>실</Col>
													<Controller
														name='room'
														control={control}
														render={({ field: { onChange, value } }) => (
														<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
															<Select
																isDisabled={(watch('floor').value === '' || roomOptions.length <= 1) && true}
																name='room'
																classNamePrefix={'select'}
																className="react-select custom-select-room custom-react-select"
																options={roomOptions}
																value={value}
																onChange={onChange}
																menuPortalTarget={document.body} 
																styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
															/>
													</Col>
												)}/>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>작성자</Col>
												<Col xs='8' className='card_table col text start '>
													<div>
														{state.type === 'register' ? cookies.get('username') : data.user.name}
													</div>
													{/* <Controller
														id='user'
														name='user'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.user && true} {...field} />}
													/>
													{errors.user && <FormFeedback>{errors.user.message}</FormFeedback>} */}
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row className="card_table mid">
										<Col xs='12' md='6'>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>비고</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='description'
														name='description'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.description && true} {...field} />}
													/>
													{errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
								</Col>
							}
							{ data &&
								<Col md='7' style={{height: '100%'}}>
								<CardTitle className="mb-1">기본정보</CardTitle>
									<Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4' lg='4' md='4' className='card_table col col_color text center'>장비코드</Col>
												<Controller
													name='code'
													control={control}
													render={({ field }) => (
														<Col className='card_table col text center'>
															<InputGroup>
																<Input bsSize='sm' invalid={errors.code && true} {...field}/>
																<Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem'}}  size='sm' onClick={() => handleCheckCodeWithProperty(field.value, cookies.get('property').value, `${API_BASICINFO_FACILITY_DETAIL}/-1`, setCheckCode)}>중복검사</Button>
																{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
															</InputGroup>
														</Col>
												)}/>
											</Row>
										</Col>
										<Col style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>설비명</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='name'
														name='name'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.name && true} {...field} />}
													/>
													{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>용도</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='use'
														name='use'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.use && true} {...field} />}
													/>
													{errors.use && <FormFeedback>{errors.use.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
										<Col style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>규격</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='capacity'
														name='capacity'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.capacity && true} {...field} />}
													/>
													{errors.capacity && <FormFeedback>{errors.capacity.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>모델</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='model_no'
														name='model_no'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.model_no && true} {...field} />}
													/>
													{errors.model_no && <FormFeedback>{errors.model_no.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
										<Col style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>작성일</Col>
												<Col xs='8' className='card_table col text start '>
												<Controller
													id='create_datetime'
													name='create_datetime'
													control={control}
													render={({field : {onChange, value}}) => <Flatpickr
														value={value}
														id='default-picker'
														className="form-control"
														onChange={(data) => {
															const newData = setStringDate(data)
															onChange(newData)
														}}
														options={{
															mode: 'single',
															maxDate: now,
															ariaDateFormat: 'Y-m-d',
															locale: Korean
														}} />
													}/>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>제조사</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='maker'
														name='maker'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.maker && true} {...field} />}
													/>
													{errors.maker && <FormFeedback>{errors.maker.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
										<Col style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>제조번호</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='maker_no'
														name='maker_no'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.maker_no && true} {...field} />}
													/>
													{errors.maker_no && <FormFeedback>{errors.maker_no.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col lg='4' md='4' xs='4' className='card_table col col_color text center '>대분류</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='option_1'
														name='option_1'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.option_1 && true} {...field} />}
													/>
													{errors.option_1 && <FormFeedback>{errors.option_1.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
										<Col style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>중분류</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='option_2'
														name='option_2'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.option_2 && true} {...field} />}
													/>
													{errors.option_2 && <FormFeedback>{errors.option_2.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>제조일자</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='manufactured_date'
														name='manufactured_date'
														control={control}
														render={({field : {onChange, value}}) => <Flatpickr
															value={value}
															id='default-picker'
															className="form-control"
															onChange={(data) => {
																const newData = setStringDate(data)
																// setManufacturedPicker(date)
																onChange(newData)
															}}
															options={{
																mode: 'single',
																maxDate: now,
																ariaDateFormat: 'Y-m-d',
																locale: Korean
															}} />
														}
													/>
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>구입일자</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='purchased_date'
														name='purchased_date'
														control={control}
														render={({field : {onChange, value}}) => <Flatpickr
															value={value}
															id='default-picker'
															className="form-control"
															onChange={(data) => {
																const newData = setStringDate(data)
																// setManufacturedPicker(date)
																onChange(newData)
															}}
															options={{
																mode: 'single',
																maxDate: now,
																ariaDateFormat: 'Y-m-d',
																locale: Korean
															}} />
														}
													/>
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>설치일자</Col>
												<Col xs='8' className='card_table col text start '>
												   <Controller
														id='installed_date'
														name='installed_date'
														control={control}
														render={({field : {onChange, value}}) => <Flatpickr
															value={value}
															id='default-picker'
															className="form-control"
															onChange={(data) => {
																const newData = setStringDate(data)
																onChange(newData)
															}}
															options={{
																mode: 'single',
																maxDate: now,
																ariaDateFormat: 'Y-m-d',
																locale: Korean
															}} />
														}
													/>
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>내구년수</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='durab_year'
														name='durab_year'
														control={control}
														render={({ field }) => <Input type='number' invalid={errors.durab_year && true} {...field} />}
													/>
													{errors.durab_year && <FormFeedback>{errors.durab_year.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>직종</Col>
												<Controller
													id='employee_class'
													name='employee_class'
													control={control}
													render={({ field: { onChange, value } }) => (
													<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
														<Select
															name='employee_class'
															classNamePrefix={'select'}
															className="react-select custom-select-employee_class custom-react-select"
															options={selectEmployeeClassList}
															value={value}
															onChange={ onChange }
														/>
													</Col>
												)}/>
											</Row>
										</Col>
										<Col lg='6' md='6' xs='12' style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col lg='4' md='4' xs='4' className='card_table col col_color text center '>
													<div>건물</div>&nbsp;
													<div className='essential_value'/>												
												</Col>
												<Controller
													name='building'
													control={control}
													render={({ field: { value } }) => (
													<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
														<Select
															name='building'
															classNamePrefix={'select'}
															className="react-select custom-select-building custom-react-select"
															options={selectBuildingList}
															value={value}
															onChange={ handleSelectValidation }
														/>
														{building && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>건물을 선택해주세요.</div>}
													</Col>
												)}/>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col lg='4' md='4' xs='4' className='card_table col col_color text center '>층</Col>
												<Controller
													name='floor'
													control={control}
													render={({ field: { onChange, value } }) => (
													<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
														<Select
															isDisabled={(watch('building').value === '' || floorOptions.length <= 1) && true}
															name='floor'
															classNamePrefix={'select'}
															className="react-select custom-select-floor custom-react-select"
															options={floorOptions}
															value={value}
															onChange={(e) => {
																onChange(e)
																setValue('room', defaultValue('room'))
															}}
														/>
													</Col>
												)}/>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>실</Col>
												<Controller
													name='room'
													control={control}
													render={({ field: { onChange, value } }) => (
													<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
														<Select
															isDisabled={(watch('floor').value === '' || roomOptions.length <= 1) && true}
															name='room'
															classNamePrefix={'select'}
															className="react-select custom-select-room custom-react-select"
															options={roomOptions}
															value={value}
															onChange={onChange}
														/>
														{/* {emp_class && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>} */}
													</Col>
												)}/>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
										<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>작성자</Col>
												<Col xs='8' className='card_table col text start '>
													<div>
														{state.type === 'register' ? cookies.get('username') : data.user.name}
													</div>
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
									<Row className="card_table mid">
										<Col xs='12' md='6'>
											<Row className='card_table table_row'>
												<Col xs='4'  className='card_table col col_color text center '>비고</Col>
												<Col xs='8' className='card_table col text start '>
													<Controller
														id='description'
														name='description'
														control={control}
														render={({ field }) => <Input bsSize='sm' invalid={errors.description && true} {...field} />}
													/>
													{errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
												</Col>
											</Row>
										</Col>
										<Col style={{ borderLeft: '1px solid #B9B9C3'}}></Col>
									</Row>
								</Col>
							}
							{
								state.type === 'modify' &&
								<Row className="mt-2"><FacilityLog/></Row>
							}
						</Row>
					</CardBody>
					<CardFooter style={{display:'flex', justifyContent:'end', alignItems:'center'}}>
						<Button type='submit' color='primary'>저장</Button>
						<Button className="mx-1" onClick={onClickBtn}>목록</Button>
					</CardFooter>
				</Form>
			</Card>
		</Fragment>
	)
}

export default FacilityForm