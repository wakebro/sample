import Breadcrumbs from '@components/breadcrumbs'
import InputPasswordToggle from '@components/input-password-toggle'
import { yupResolver } from '@hookform/resolvers/yup'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import { isEmptyObject } from "jquery"
import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import Flatpickr from "react-flatpickr"
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from "react-router-dom"
import Select from 'react-select'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, FormFeedback, Input, InputGroup, Label, Row } from 'reactstrap'
import Cookies from 'universal-cookie'
import * as yup from 'yup'
import { API_EMPLOYEE_CLASS_LIST, API_EMPLOYEE_LEVEL_LIST, API_FIND_DEPARTMENT, API_FIND_OFFICE, API_FIND_PROPERTY, API_REGISTER } from '../../../../constants'
import { axiosPostPut, checkSelectValue, checkSelectValueObj, compareCodeWithProperty, getTableData, getTableDataModifyFirstIdx, setStringDate, sweetAlert } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import FileUploaderSingle from "../../area/building/FileUploaderSingle"
import EmployeeSign from './EmployeeSign'

const EmployeeRegister = () => {
	useAxiosIntercepter()
	const navigate = useNavigate()
	const cookies = new Cookies()
	const { state } = useLocation()
	const now = moment().format('YYYY-MM-DD')
	const [images, setImages] = useState(state ? (state.photo ? [`/static_backend/${state.photo}`] : []) : [])
	const [signFile, setSignFile] = useState(state ? (state.signature ? [`/static_backend/${state.signature}`] : []) : [])
	const [propertyList, setPropertyList] = useState([])
	const [initPW, setInitPw] = useState(false)
	
	const [classList, setClassList] = useState([{label: '선택', value:''}])
	const [levelList, setLevelList] = useState([{label: '선택', value:''}])
	const [companyList, setCompanyList] = useState([{label: '선택', value:''}])
	const [departmentList, setDepartmentList] = useState([{label: '선택', value:''}])
	
	const [selectError, setSelectError] = useState({property: false, employeeClass: false, employeeLevel: false})
	const {property, employeeClass, employeeLevel} = selectError

	const [oldCode, setOldCode] = useState()
	const [checkCode, setCheckCode] = useState(false)
	const [submitResult, setSubmitResult] = useState(false)

	const [valiSchema, setValiSchema] = useState(yup.object().shape({
		code: yup.string().required('아이디를 입력해주세요.').min(3, '3자 이상 입력해주세요'),
		name: yup.string().required('이름을 입력해주세요.').min(2, '1자 이상 입력해주세요')
	}))

	const defaultValues = state === null ? {
		code : "", //건물 코드
		name : "", //건물 명
		property : {label:cookies.get('property').label, value:cookies.get('property').value},
		employeeClass : {label: '선택', value:''},
		employeeLevel : {label: '선택', value:''},
		employeeStatus : '신청',
		start_date : now,
		gender : 'male',
		disasterManager : false,
		company : {label: '선택', value:''},
		department : {label: '선택', value:''}
	} 
	:
	{
		code : state.username, //회원 코드
		name : state.name, //회원 이름
		phoneStart : (state.phone !== null && state.phone !== '') && state.phone.split('-')[0],
		phoneMid : (state.phone !== null && state.phone !== '') && state.phone.split('-')[1],
		phoneEnd : (state.phone !== null && state.phone !== '') && state.phone.split('-')[2],
		employeeNumber : state.employee_number !== null ? state.employee_number : "",
		email : state.email !== null ? state.email : "",
		address : state.address !== null ? state.address : "",
		property : {label:cookies.get('property').label, value:cookies.get('property').value},
		employeeClass : state.employee_class ? {label: state.employee_class.code, value:state.employee_class.id} : {label: '선택', value:''},
		employeeLevel : state.employee_level ? {label: state.employee_level.code, value:state.employee_level.id} : {label: '선택', value:''},
		account_number : state.account_number !== null ? state.account_number : "",
		// employeeType : '미정'
		// employeeStatus : '신청중',
		start_date : state.start_date !== null ? moment(state.start_date.split('T')[0]).format('YYYY-MM-DD') : "",
		disasterManager : state.is_manager,
		company : state.company ? {label: state.company.name, value:state.company.id} : {label: '선택', value:''},
		employeeStatus : state.status ? state.status : "",
		end_date : state.end_date ? moment(state.end_date.split('T')[0]).format('YYYY-MM-DD') : "",
		birthday : state.birthday ? moment(state.birthday.split('T')[0]).format('YYYY-MM-DD') : "",
		topSize : state.top_size ? state.top_size : "",
		bottomSize : state.bottom_size ? state.bottom_size : "",
		description : state.description && state.description !== 'undefined' ? state.description : "",
		gender : state.gender ? state.gender : "male",
		department : state.department ? {label: state.department.name, value:state.department.id} : {label: '선택', value:''}
	}

	const onClickBtn = () => {
		navigate(-1) // 바로 이전 페이지로 이동, '/main' 등 직접 지정도 당연히 가능
	}


	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		trigger,
		watch
	} = useForm({
		defaultValues,
		resolver: yupResolver(valiSchema)
	})

	const getDepartment = (data) => {
		if (data.value !== "") {
			const param = {
				companyId :  data.value
			}
			getTableDataModifyFirstIdx(API_FIND_DEPARTMENT, param, setDepartmentList, '선택')
		} 
		setDepartmentList({label : '선택', value : ""})
	}

	const handleSelectValidation = (e, event) => {
		if (event.name === 'property') {
			setValue('company', {label : '선택', value : ""})
			setValue('department', {label : '선택', value : ""})
		}
		if (event.name === 'company') {
			setValue('company', e)
			setValue('department', {label : '선택', value : ""})
			getDepartment(e)
		}
		if (event.name === 'property' || event.name === 'employeeClass' || event.name === 'employeeLevel') checkSelectValue(e, event, selectError, setSelectError, setValue)
	}
	const onSubmit = data => {
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }
		if ((!checkCode) && (data.code !==  oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
		const formData = new FormData()
		formData.append('username', data.code)
		formData.append('name', data.name)
		formData.append('employee_number', data.employeeNumber !== undefined ? data.employeeNumber : '')
		formData.append('email', data.email !== undefined ? data.email : '')
		formData.append('address', data.address !== undefined ? data.address : '')
		formData.append('account_number', data.account_number !== undefined ? data.account_number : '') 
		formData.append('status', data.employeeStatus)
		formData.append('top_size', data.topSize !== undefined ? data.topSize : '')
		formData.append('bottom_size', data.bottomSize !== undefined ? data.bottomSize : '')
		formData.append('description', data.description !== undefined ? data.description : '')
		formData.append('start_date', data.start_date)
		formData.append('end_date', data.end_date !== undefined ? data.end_date : '')
		formData.append('birthday', data.birthday !== undefined ? data.birthday : '')
		formData.append('gender', data.gender)
		formData.append('is_manager', data.disasterManager)
		if ((data.phoneStart !== undefined && data.phoneStart !== false) && (data.phoneMid !== undefined && data.phoneMid !== false) && (data.phoneEnd !== undefined && data.phoneEnd !== false)) {
			formData.append('phone', `${data.phoneStart}-${data.phoneMid}-${data.phoneEnd}`)
		} else {
			formData.append('phone', '')
		}		
		formData.append('main_property', data.property.value)
		formData.append('property', data.property.value)
		formData.append('company', data.company.value)
		formData.append('department', data.department.value)
		formData.append('employee_class', data.employeeClass.value)
		formData.append('employee_level', data.employeeLevel.value)
		if (state === null) {
			formData.append('images', images[0])
			formData.append('sign', signFile[0])
		} else {
			if (typeof images[0] !== 'string') formData.append('images', images[0])
			if (typeof signFile[0] !== 'string') formData.append('sign', signFile[0])
			if (initPW) formData.append('password', data.password)
		}
		if (state === null) {
			formData.append('create_datetime', now)
			formData.append('password', data.password)

			axiosPostPut('register', "직원정보", API_REGISTER, formData, setSubmitResult)
		} else {
			formData.append('userId', state.id)
			axiosPostPut('modify', "직원정보", API_REGISTER, formData, setSubmitResult)
		}
	}
	
	const getInit = () => {
		const param = {
			prop_id :  cookies.get('property').value
		}
		getTableData(API_FIND_PROPERTY, {}, setPropertyList)
		getTableDataModifyFirstIdx(API_EMPLOYEE_CLASS_LIST, param, setClassList, '선택')
		getTableDataModifyFirstIdx(API_EMPLOYEE_LEVEL_LIST, param, setLevelList, '선택')

		if (state && state.company !== undefined && state.company !== null) {
			const param = {
				companyId :  state.company.id
			}
			getTableData(API_FIND_DEPARTMENT, param, setDepartmentList)
		}
	}

	useEffect(() => {
		getInit()
	}, [])

	useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])

	useEffect(() => {
		if (state !== null) setOldCode(state.username)
		else {
			const tempValidSchema = yup.object().shape({ // input validation
				...valiSchema.fields,
				password: yup.string().required('비밀번호를 입력해주세요').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()-_+=|?/,.])[A-Za-z\d`~!@#$%^&*()-_+=|?/,.]{8,}$/, '최소 8글자 이상, 대소문자, 특수문자 포함')
			})
			setValiSchema(tempValidSchema)
		}
	}, [state])

	useEffect(() => {
		if (submitResult) {
			onClickBtn()
		}
	}, [submitResult])

	useEffect(() => {
		if (state !== null) {
			if (initPW) {
				const tempValidSchema = yup.object().shape({ // input validation
					...valiSchema.fields,
					password: yup.string().required('비밀번호를 입력해주세요').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()-_+=|?/,.])[A-Za-z\d`~!@#$%^&*()-_+=|?/,.]{8,}$/, '최소 8글자 이상, 대소문자, 특수문자 포함')
				})
				setValiSchema(tempValidSchema)
			} else {
				setValiSchema(yup.object().shape({
					code: yup.string().required('아이디를 입력해주세요.').min(3, '3자 이상 입력해주세요'),
					name: yup.string().required('이름을 입력해주세요.').min(2, '1자 이상 입력해주세요')
				}))
			}
		}
	}, [initPW])

	useEffect(() => {
		if (watch('property').value !== '') {
			const param = {prop_id :  watch('property').value}
			setDepartmentList([{label: '선택', value:''}])
			getTableDataModifyFirstIdx(API_FIND_OFFICE, param, setCompanyList, '선택')
		}
	}, [watch('property')])

	return (
		<Fragment>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='직원정보' breadCrumbParent='기본정보' breadCrumbParent2='직원정보관리' breadCrumbActive='직원정보' />
					</div>
				</Row>
				<Card>
					<CardHeader style={{borderBottom : '1px solid #B9B9C3'}}>
						<CardTitle>
							직원 {state !== null ? '수정' : '등록'}
						</CardTitle>
					</CardHeader>
					<CardBody className="mb-2">
						<Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text word-normal center'>
										<div>아이디</div>&nbsp;
										<div className='essential_value'/>
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id='code'
											name='code'
											control={control}
											render={({ field }) => (
												<Col className='card_table col text start'>
													<InputGroup>
														<Input invalid={errors.code && true} {...field}/>
														<Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem'}} onClick={() => compareCodeWithProperty(field.value, cookies.get('property').value, oldCode, API_REGISTER, setCheckCode)}>중복검사</Button>
														{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
													</InputGroup>
												</Col>
											)}
										/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center'>
										<div>이름</div>&nbsp;
										<div className='essential_value'/>
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id='name'
											name='name'
											control={control}
											render={({ field }) => (
												<Col className='card_table col text start' style={{flexDirection:'column'}}>
													<Input bsSize='sm' placeholder={'사용자코드를 입력해주세요.'} invalid={errors.name && true} {...field} />
													{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
												</Col>
											)}
										/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
									<Row className='card_table table_row'>
										<Col xs='4'  className='card_table col col_color text word-normal center'>
											<div>패스워드</div>&nbsp;
											{state === null && <div className='essential_value'/>}
										</Col>
										{state === null &&
											<Controller
												id='password'
												name='password'
												control={control}
												render={({ field: {onChange, value} }) => (
													<Col className='card_table col text start' style={{flexDirection:'column'}}>
														<InputPasswordToggle 
															bsSize='sm' 
															invalid={errors.password && true} 
															value={value}
															onChange={(e) => {
																onChange(e.target.value)
																trigger('password')
															}} />
														{errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
													</Col>
												)}/>
										}
										{state !== null && (
											initPW ? 
												<Controller
													id='password'
													name='password'
													control={control}
													render={({ field }) => (
														<Col className='card_table col text start' style={{flexDirection:'column'}}>
															<InputGroup>
																<Input invalid={errors.password && true} {...field}/>
																<Button onClick={() => setInitPw(!initPW)} color='primary' outline>취소</Button>
															{errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
															</InputGroup>
														</Col>
													)}
												/>
											:
												<Col className='card_table col text center'>
													<Button onClick={() => setInitPw(!initPW)} color='primary' outline>재설정</Button>
												</Col>
										)}
									</Row>
							</Col>
						</Row>
						<Row className="card_table mx-0 border-right">
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center'>
										사번
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id='employeeNumber'
											name='employeeNumber'
											control={control}
											render={({ field }) => <Input bsSize='sm' {...field} />}
										/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text word-normal center'>
										전화번호
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id='phoneStart'
											name='phoneStart'
											control={control}
											render={({ field }) => <Input bsSize='sm' type='number' invalid={errors.phoneStart && true} {...field} />}
										/>
										<div className="ms-1 me-1">
											-
										</div>
										<Controller
											id='phoneMid'
											name='phoneMid'
											control={control}
											render={({ field }) => <Input bsSize='sm' type='number' invalid={errors.phoneMid && true} {...field} />}
										/>
										<div className="ms-1 me-1">
											-
										</div>
										<Controller
											id='phoneEnd'
											name='phoneEnd'
											control={control}
											render={({ field }) => <Input bsSize='sm' type='number' invalid={errors.phoneEnd && true} {...field} />}
										/>
										{errors.phoneEnd && <FormFeedback>{errors.phoneEnd.message}</FormFeedback>}
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text word-normal center'>
										성별
									</Col>
									<Col xs='8' className='card_table col text start '>
										<Controller
											name='gender'
											control={control}
											render={({ field : {onChange, value} }) => (
												<Col className='form-check'>
													<Label className='form-check-label' for='gender1'>
														남성
													</Label>
													<Input id='gender1' name='gender'  type='radio' checked={value === 'male'} onChange={() => onChange('male')}/>
												</Col>
										)}/>
										<Controller
											name='gender'
											control={control}
											render={({ field: {onChange, value} }) => (
												<Col className='form-check ms-1'>
													<Label className='form-check-label' for='gender2'>
														여성
													</Label>
													<Input id='gender2' name='gender' type='radio' checked={value === 'female'} onChange={() => onChange('female')}/>
												</Col>
										)}/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className="card_table mx-0 border-right">
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text word-normal center'>
										이메일
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id='email'
											name='email'
											control={control}
											render={({ field }) => <Input bsSize='sm' {...field} />}
										/>
									</Col>
								</Row>
							</Col>
							<Col md='8' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col md='2' xs='4'  className='card_table col col_color text center'>
										주소
									</Col>
									<Col md='10' xs='8' className='card_table col text start ' >
										<Controller
											id='address'
											name='address'
											control={control}
											render={({ field }) => <Input bsSize='sm' {...field} />}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className="card_table mx-0 border-right">
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text word-normal center'>
										<div>사업소</div>&nbsp;
										<div className='essential_value'/>
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id = 'property'
											name='property'
											control={control}
											render={({ field: { value } }) => (
												<Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
													<Select
														name='property'
														classNamePrefix={'select'}
														className="react-select custom-select-property custom-react-select"
														options={propertyList}
														value={value}
														onChange={ handleSelectValidation }/>
														{property && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>사업소를 선택해주세요.</div>}
												</Col>
										)}/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center'>
										<div>직종 코드</div>&nbsp;
										<div className='essential_value'/>
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id = 'employeeClass'
											name='employeeClass'
											control={control}
											render={({ field: { value } }) => (
												<Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
													<Select
														name='employeeClass'
														classNamePrefix={'select'}
														className="react-select custom-select-employeeClass custom-react-select"
														options={classList}
														value={value}
														defaultValue={classList[0]}
														onChange={ handleSelectValidation }
														/>
													{employeeClass && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
												</Col>
										)}/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center'>
										<div>직급 코드</div>&nbsp;
										<div className='essential_value'/>
									</Col>
									<Col xs='8' className='card_table col text start ' >
									<Controller
										id = 'employeeLevel'
										name='employeeLevel'
										control={control}
										render={({ field: { value } }) => (
											<Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
												<Select
													name='employeeLevel'
													classNamePrefix={'select'}
													className="react-select custom-select-employeeLevel custom-react-select"
													options={levelList}
													value={value}
													defaultValue={levelList[0]}
													onChange={ handleSelectValidation }
													/>
												{employeeLevel && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직급을 선택해주세요.</div>}
											</Col>
										)}/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className="card_table mx-0 border-right">
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text word-normal center'>
										계좌번호
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id='account_number'
											name='account_number'
											control={control}
											render={({ field }) => <Input bsSize='sm' invalid={errors.email && true} {...field} />}
										/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center'>
										생일
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id='birthday'
											name='birthday'
											control={control}
											render={({field : {onChange, value}}) => <Flatpickr
														value={value}
														id='range-picker'
														className='form-control '
														onChange={(data) => {
															const newData = setStringDate(data)
															onChange(newData)
														}}
														options={{
															mode: 'single', 
															maxDate: now,
															ariaDateFormat:'Y-m-d',
															locale: Korean
															}}
														placeholder={now}
														/>
														}
										/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text word-normal center'>
										입사일자
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
										id='start_date'
										name='start_date'
										control={control}
										render={({field : {onChange, value}}) => <Flatpickr
													value={value}
													id='range-picker'
													className='form-control'
													onChange={(data) => {
														const newData = setStringDate(data)
														onChange(newData)
													}}
													options={{
														mode: 'single', 
														maxDate: now,
														ariaDateFormat:'Y-m-d',
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
						<Row className="card_table mx-0 border-right">
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text word-normal center'>
										회사명
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id = 'company'
											name='company'
											control={control}
											render={({ field: { value } }) => (
												
												<Select
													name='company'
													classNamePrefix='select'
													className="react-select custom-select-company custom-react-select"
													options={companyList}
													value={value}
													defaultValue={companyList[0]}
													onChange={handleSelectValidation}
													isClearable={false}
													placeholder={'선택'}
												/>
										)}/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center'>
										직원 상태
									</Col>
									<Col xs='8' className='card_table col text word-normal start ' >
										<Controller
										name='employeeStatus'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='form-check'>
												<Input id='employeeStatus1' name='employeeStatus' type='radio' checked={value === '신청'} onChange={() => onChange('신청')}/>
												<Label className='form-check-label' for='employeeStatus1'>
													신청
												</Label>
											</Col>
										)}/>
										<Controller
											name='employeeStatus'
											control={control}
											render={({ field: {onChange, value} }) => (
												<Col className='form-check'>
													<Input id='employeeStatus2' name='employeeStatus' type='radio' checked={value === '재직'} onChange={() => onChange('재직')}/>
													<Label className='form-check-label' for='employeeStatus2'>
														재직
													</Label>
												</Col>
										)}/>
										<Controller
											name='employeeStatus'
											control={control}
											render={({ field : {onChange, value}}) => (
												<Col className='form-check'>
													<Input id='employeeStatus3' name='employeeStatus' type='radio' checked={value === '퇴직'} onChange={() => onChange('퇴직')}/>
													<Label className='form-check-label' for='employeeStatus3'>
														퇴직
													</Label>
												</Col>
										)}/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text word-normal center'>
										퇴사일자
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id='end_date'
											name='end_date'
											control={control}
											render={({field : {onChange, value}}) => <Flatpickr
												value={value}
												id='range-picker'
												className='form-control'
												onChange={(data) => {
													const newData = setStringDate(data)
													onChange(newData)
												}}
												options={{
													mode: 'single', 
													maxDate: now,
													ariaDateFormat:'Y-m-d',
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
						<Row className="card_table mx-0 border-right">
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center'>
										부서
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id = 'department'
											name='department'
											control={control}
											render={({ field: { value, onChange } }) => (
												<Select
													isDisabled = {companyList.value === ''}
													name='department'
													classNamePrefix={'select'}
													className="react-select custom-select-department custom-react-select"
													options={departmentList}
													value={value}
													onChange={e => onChange(e)}
												/>
										)}/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center'>
										상의 사이즈
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id='topSize'
											name='topSize'
											control={control}
											render={({ field }) => <Input bsSize='sm'  {...field} />}
										/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center'>
										하의 사이즈
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id='bottomSize'
											name='bottomSize'
											control={control}
											render={({ field }) => <Input bsSize='sm'  {...field} />}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className="card_table mx-0 border-right">
							<Col md='8' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col md='2' xs='4'  className='card_table col col_color text word-normal center'>
										중대재해 관리
									</Col>
									<Col md='4' xs='8' className='card_table col text start ' >
										<Controller
											name='disasterManager'
											control={control}
											render={({ field : {onChange, value} }) => (
												<Col className='form-check'>
													<Label className='form-check-label' for='disasteManager'>
														관리자
													</Label>
													<Input id='disasteManager'  type='radio' checked={value === true} onChange={() => onChange(true)}/>
												</Col>
										)}/>
										<Controller
											name='disasterManager'
											control={control}
											render={({ field: {onChange, value} }) => (
												<Col className='form-check ms-1'>
													<Label className='form-check-label' for='disasteWorker'>
														작업자
													</Label>
													<Input id='disasteWorker'  type='radio' checked={value === false} onChange={() => onChange(false)}/>
												</Col>
										)}/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col col_color text center'>사인</Col>
									<Col xs='8' className='card_table col text center border-b' style={{display:'flex'}}>
										<Row style={{width:'100%', padding:'0'}}>
											<EmployeeSign
												signFile={signFile}
												setSignFile={setSignFile}/>
										</Row>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className="card_table mx-0 border-right">
							<Col md='8' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col md='2' xs='4'  className='card_table col col_color text word-normal center'>
										비고(주요자격)
									</Col>
									<Col md='10' xs='8' className='card_table col text start ' >
										<Controller
											id='description'
											name='description'
											control={control}
											render={({ field }) => <Input style={{height : '100%'}} type="textarea" {...field} />}
										/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12' className="border-b">
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text word-normal center border-b'>
										<Row style={{justifyContent:'center'}}>
											<Col xs={12} className='card_table col text center'>첨부파일</Col>
											<Col xs={12} className='card_table col text center'>(직원사진)</Col>
										</Row>
									</Col>
									<Col xs='8' className='card_table col text center border-b' >
										<FileUploaderSingle
											setFiles={setImages}
											files={images}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</CardBody>
					<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
						<Button className="me-1" color="report" onClick={() => onClickBtn()} >취소</Button>
						<Button type="submit" color="primary">{state !== null ? '수정' : '등록'}</Button>
					</CardFooter>
				</Card>
			</Form>
		</Fragment>
	)
}

export default EmployeeRegister
