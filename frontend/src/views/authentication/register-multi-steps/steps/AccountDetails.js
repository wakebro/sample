// ** React Imports
import { Fragment, useEffect, useState } from 'react'
// useRef
import { Link, useNavigate } from "react-router-dom"
// ** Third Party Components
import { yupResolver } from '@hookform/resolvers/yup'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Reactstrap Imports
import Select from 'react-select'
import { Button, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
// ** Custom Components
import InputPasswordToggle from '@components/input-password-toggle'

import { 
	API_FIND_PROPERTY, API_FIND_OFFICE, API_REGISTER, ROUTE_LOGIN,
	API_EMPLOYEE_CLASS_LIST, API_EMPLOYEE_LEVEL_LIST, API_FIND_EMPOLYEE
} from '../../../../constants'

import axios from "../../../../utility/AxiosConfig"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'

import { axiosPostPutNavi, autoPhoneNumberHyphen, getObjectKeyCheck, sweetAlert } from '@utils'
import  UserIDFormFeedback from './UserIDFormFeedback'
import { checkSelectValue, checkSelectValueObj } from '../../../../utility/Utils'
import { isEmptyObject } from 'jquery'

// input default values
const defaultValues = {
	userId: '',
	userName : '',
	email: '',
	password: '',
	confirmPassword: '',
	//address: '',
	phone: '',
	//cellPhone:'',
	center: {value : '', label : '사업소 선택'},
	occupation :{value : '', label : '직종 선택'},
	rank : {value : '', label : '직급 선택'},
	office: {value : '', label : '회사 선택'},
	note : '',
	idDuplCheck : false,
	idDuplCheckResult : false
}

// component
const AccountDetails = () => {

	// axios 통신 설정
	useAxiosIntercepter()

	// 등록 후 로그인 페이지로 전환을 위한 useNavigate
	const navigate = useNavigate()
	
	const [center, setCenter] = useState({value : 0, label : '사업소 선택'}) // 사업소 state
	const [occuState, setOccuState] = useState(false) // select 작동 트리거
	const [occupation, setOccuation] = useState([{value : '', label : '직종 선택'}]) // 직종 state
	const [rank, setRank] = useState([{value : '', label : '직급 선택'}]) // 직급 state
	const [office, setOffice] = useState([{value : '', label : '회사 선택'}]) // 회사 state
	
	// yup validation schema 정의
	const validationSchema = yup.object().shape({
		userId: yup.string().required('아이디를 입력해주세요').min(3, '3자 이상 입력해주세요'),
		userName: yup.string().required('이름를 입력해주세요').min(2, '1자 이상 입력해주세요'),
		email: yup.string().email('email 형식에 맞춰주세요.').required('이메일 주소를 입력해주세요'),
		password: yup.string().required('비밀번호를 입력해주세요').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()-_+=|?/,.])[A-Za-z\d`~!@#$%^&*()-_+=|?/,.]{8,}$/, '최소 8글자 이상, 대소문자, 특수문자 포함'),
		confirmPassword: yup
			.string()
			.required('비밀번호를 입력해주세요')
			.oneOf([yup.ref(`password`), null], '비밀번호가 일치하지 않습니다'),
		phone: yup.string().required('전화번호를 입력해주세요').matches(/^\d{2,3}-\d{3,4}-\d{4}$/, '전화번호 형식에 맞게 써주세요'),
		idDuplCheck : yup.boolean().oneOf([true], '아이디를 중복체크 해주세요.'),
		idDuplCheckResult : yup.boolean().oneOf([true], '아이디가 중복입니다.')
	})
	const [selectError, setSelectError] = useState({center: false})

	// ** Hooks useform 사용 
	const {
		control,
		trigger,
		handleSubmit,
		formState: { errors },
		getValues,
		setValue,
		watch
	} = useForm({
		defaultValues,
		resolver: yupResolver(validationSchema)
	})

	// id dupl check on click func
	const onClickIdDuplCheck = async () => {
		
		if (!(await trigger("userId")).valueOf()) { // 중복 체크시 아이디 validation 체크
			return
		}
		setValue('idDuplCheck', true)
		// axios id code check
		const param = {
			username : getValues("userId")
		}
		await axios.get(API_FIND_EMPOLYEE, {params: param}) // 중복 아이디 체크
		.then((res) => {
			if (res.data === true) {
				setValue('idDuplCheckResult', true)
			} else {
				setValue('idDuplCheckResult', false)
			}
		})// axios end

		trigger("idDuplCheck")
		trigger("idDuplCheckResult")
	}
	// onClickIdDuplCheck end

	// 사업소 목록 통신
	const findCenter = () => {
		axios.get(API_FIND_PROPERTY)
		.then(res => setCenter(res.data))
		.catch(err => console.log(err))
	}

	/** 회원가입 필요 데이터 가져오기 */
	function getTableData (API, param, setTableData) {
		axios.get(API, {params: param})
		.then(res => {
			res.data[0].label = `${res.data[0].label} 선택`
			setTableData(res.data)
		})
		.catch(res => console.log(API, res))
	}

	const getOccupation = (data) => {
		setValue('office', {value : '', label : '회사 선택'})
		// select input 활성화
		if (data.value !== 0) {
			
			// 사업소 하위 select 활성화
			setOccuState(true)

			// 사업소 id 전송
			const param = {
				prop_id : data.value
			}

			// 사업소 id를 통해 각 select 목록 받아옴.
			// 회사
			getTableData(API_FIND_OFFICE, param, setOffice)
			
		} else {
			// 데이터 없을시 
			// select 비활성화
			// select value default로 설정
			// setOccuation(occupation[0])
			// setRank(rank[0])
			setOffice(office[0])
			setOccuState(false)
		}
	}
	// getOccupation end

	const handleSelectValidation = (e, event, onChange) => {
		onChange(e)
		getOccupation(e)
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

	//// server submit func
	const onSubmit = (data) => {
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }

		if (getObjectKeyCheck(data.center, 'value') === '' || getObjectKeyCheck(data.center, 'value') === 0) {
			sweetAlert('', '사업소를 선택해주세요.<br/> 다시 한번 확인해주세요.', 'warning', 'center')
			return
		}
		// form data
		const formData = new FormData()
		// input data append
		formData.append('username', data.userId)
		formData.append('name', data.userName)
		formData.append('email', data.email)
		formData.append('password', data.password)
		formData.append('confirmPassword', data.confirmPassword)
		formData.append('phone', data.phone)
		formData.append('main_property', data.center.value)
		formData.append('property', data.center.value)
		formData.append('employee_class', data.occupation.value)
		formData.append('employee_level', data.rank.value)
		formData.append('company', data.office.value)
		formData.append('description', data.note)
		formData.append('images', '')
		formData.append('status', '신청')
		formData.append('sign', '')

		axiosPostPutNavi('register', '유저등록', API_REGISTER, formData, navigate, -1)
	}// onSubmit end

    useEffect(() => {
        if (!isEmptyObject(errors)) {
            checkSelectValueObj(control, selectError, setSelectError)
        }
	}, [errors]) // select error 처리

	useEffect(() => {
		if (watch('password') !== undefined && watch('password') !== '') {
			trigger('confirmPassword')
		}
	}, [watch('password')])

	// hook render 될때 
	// 사업소 목록 받아옴
	useEffect(() => {
        // 사업소
		findCenter()
        // 직종
        getTableData(API_EMPLOYEE_CLASS_LIST, {}, setOccuation)
        // 직급
        getTableData(API_EMPLOYEE_LEVEL_LIST, {}, setRank)
	}, [])

	return (
		<Fragment>
			<div className='content-header mb-2'>
				<h2 className='fw-bolder mb-12'>사용자 신청 양식</h2>
				<span>사용자 정보를 입력해 주세요</span>
			</div>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row>
					<Col md='4' className='mb-1'>
						<Label className='form-label' for='userId' style={{display:'flex', alignItems:'center'}}>
							신청 ID &nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							id='userId'
							name='userId'
							control={control}
							render={({ field: {onChange, value} }) => <Input 
							placeholder='honggildong' 
							valid={(getValues('idDuplCheckResult')) && true}
							invalid={(errors.userId || errors.idDuplCheck || errors.idDuplCheckResult) && true} 
							onChange={e => {
								onChange(e)
								setValue('idDuplCheck', false)
								setValue('idDuplCheckResult', false)
							}}
							value={value}
							/>}
						/>
						{(errors.userId || errors.idDuplCheck || errors.idDuplCheckResult) && <UserIDFormFeedback
							errors={errors}
						/>}
					</Col>
					<Col mb='2' className='mt-2 mb-1 mx-0 ps-1 pe-0'>
						<Label className='form-label mx-0' for='checkId'>
							&nbsp;
						</Label>
						<Button id='checkId' name='checkId' type='button' color='primary' 
							className='mx-0'
							onClick={ async (e) => {
								onClickIdDuplCheck(e)
							}}>
							중복체크
						</Button>
					</Col>
					<Col md='6' className='mb-1'>
						<Label className='form-label' for={`userName`} style={{display:'flex', alignItems:'center'}}>
							이름 &nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							control={control}
							id='userName'
							name='userName'
							render={({ field }) => (
								<Input type='userName' placeholder='홍길동' invalid={errors.userName && true} {...field} />
							)}
						/>
						{errors.userName && <FormFeedback>{errors.userName.message}</FormFeedback>}
					</Col>
				</Row>
				<Row>
					<div className='form-password-toggle col-md-6 mb-1'>
						<Label className='form-label' for={`userName`} style={{display:'flex', alignItems:'center'}}>
							비밀번호 &nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							id='password'
							name='password'
							control={control}
							render={({ field }) => (
								<InputPasswordToggle
									// label='패스워드 *'
									htmlFor='password'
									className='input-group-merge'
									invalid={errors.password && true}
									{...field}
								/>
							)}
						/>
						{errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
					</div>
					<div className='form-password-toggle col-md-6 mb-1'>
						<Label className='form-label' for={`userName`} style={{display:'flex', alignItems:'center'}}>
							비밀번호 확인&nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							control={control}
							id='confirmPassword'
							name='confirmPassword'
							render={({ field }) => (
								<InputPasswordToggle
									// label='패스워드 확인'
									htmlFor='confirmPassword'
									className='input-group-merge'
									invalid={errors.confirmPassword && true}
									{...field}
								/>
							)}
						/>
						{errors.confirmPassword && <FormFeedback>{errors.confirmPassword.message}</FormFeedback>}
					</div>
				</Row>
				<Row>
					<div className='col-md-6 mb-1'>
						<Label className='form-label' for='phone' style={{display:'flex', alignItems:'center'}}>
							핸드폰번호 &nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
								control={control}
								id='phone'
								name='phone'
								render={({ field: {onChange, value} }) => <Input onChange={e => {
									autoPhoneNumberHyphen(e, onChange)
								}}
								placeholder='- 없이 작성해주세요'
								invalid={errors.phone && true}
								value={value}
								/>}
						/>
						{errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
					</div>
					<div className='col-md-6 mb-1'>
						<Label className='form-label' for={`email`} style={{display:'flex', alignItems:'center'}}>
							이메일 &nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							control={control}
							id='email'
							name='email'
							render={({ field }) => (
								<Input type='email' placeholder='gildong.hong@email.com' invalid={errors.email && true} {...field} />
							)}
						/>
						{errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
					</div>
				</Row>
				<Row>
					<div className='col-md-6 mb-1'>
						<Label className='form-label' for='center' style={{display:'flex', alignItems:'center'}}>
							사업소 &nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							control={control}
							id='center'
							name='center'
							render={({ field: { onChange, value } })  => (
								<Select
									id='center'
									name='center'
									onChange={(e, event) => {
										handleSelectValidation(e, event, onChange)
									}}
									className="react-select custom-react-select custom-select-center"
									classNamePrefix={'select'}
									options={center}
									value={value}
									isClearable={false}/>
							)}/>
						{selectError.center && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>{'사업소를 선택해주세요.'}</div>}
					</div>
					<div className='col-md-6 mb-1'>
						<Label className='form-label' for={`officeName`}>
							회사
						</Label>
						<Controller
							control={control}
							id='office'
							name='office'
							render={({ field: { onChange, value } })  => <Select
												onChange={e => onChange(e)}
												className="react-select"
												classNamePrefix={'select'}
												options={office}
												value={value}
												isClearable={false}
												isDisabled = {!occuState}
											/>}
		/>
					</div>
				</Row>
				<Row>
					<div className='col-md-6 mb-1'>
						<Label className='form-label' for={`occupation`} style={{display:'flex', alignItems:'center'}}>
							직종 &nbsp;
							{/* <div className='essential_value'/> */}
						</Label>
						<Controller
							control={control}
							id='occupation'
							name='occupation'
							render={({ field: { onChange, value } })  => <Select
															onChange={e => {
																onChange(e)
															}} 
															className="react-select"
															classNamePrefix={'select'}
															options={occupation}
															value={value}
															isClearable={false}
														/>}
						/>
					</div>
					<div className='col-md-6 mb-1'>
						<Label className='form-label' for='rank' style={{display:'flex', alignItems:'center'}}>
							직급 &nbsp;
							{/* <div className='essential_value'/> */}
						</Label>
						<Controller
								control={control}
								id='rank'
								name='rank'
								render={({ field: { onChange, value } })  => <Select
																onChange={e => {
																	onChange(e)
																}}
																className="react-select"
																classNamePrefix={'select'}
																options={rank}
																value={value}
																isClearable={false}
															/>}
								/>
					</div>
				</Row>
				<Row>
					<div className='col-md-12 mb-1'>
						<Label className='form-label' for={`note`}>
							비고
						</Label>
						<Controller
							control={control}
							id='note'
							name='note'
							render={({ field }) => (
								<Input type='textarea' {...field} />
							)}
						/>
					</div>
				</Row>
				<div className='d-flex justify-content-between mt-2'>
					<Button color='secondary' className='btn-prev' outline tag={Link} to={ROUTE_LOGIN}>
						<ChevronLeft size={14} className='align-middle me-sm-25 me-0'></ChevronLeft>
						<span className='align-middle d-sm-inline-block d-none'>로그인 화면으로</span>
					</Button>
					<Button type='submit' color='primary' className='btn-next'>
						<span className='align-middle d-sm-inline-block d-none'>신청</span>
						<ChevronRight size={14} className='align-middle ms-sm-25 ms-0'></ChevronRight>
					</Button>
				</div>
			</Form>
		</Fragment>
	)
}

export default AccountDetails
