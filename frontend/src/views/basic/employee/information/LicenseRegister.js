import { Fragment, useState, useEffect } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Flatpickr from "react-flatpickr"
import * as moment from 'moment'
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, Row, Col, Input, Form, Label, FormFeedback } from 'reactstrap'
import { API_LICENSE_INPUT, API_USER_LICENSE_LIST, ROUTE_BASICINFO_EMPLOYEE_INFORMATION } from '../../../../constants'
import axios from "../../../../utility/AxiosConfig"
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import Cookies from 'universal-cookie'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { yupResolver } from '@hookform/resolvers/yup'
import { setStringDate, checkSelectValue, checkAsyncSelectValueObj, axiosPostPut } from '../../../../utility/Utils'
import FileUploaderSingle from "../../area/building/FileUploaderSingle"
import * as yup from 'yup' 
import AsyncSelect from 'react-select/async'
import { isEmptyObject } from "jquery"

const LicenseRegister = () => {
	useAxiosIntercepter()
	const navigate = useNavigate()
	const cookies = new Cookies()
	const { state } = useLocation()
	// const [user, setUser] = useState({})
	const now = moment().format('YYYY-MM-DD')
	
	const [images, setImages] = useState(state.type === 'put' ? (state.data.photo ? [`/static_backend/${state.data.photo}`] : []) : [])
	const [selectError, setSelectError] = useState({name: false})
	const [submitResult, setSubmitResult] = useState(false)
	const {name} = selectError

	const dateFormat = (data) => {
		return moment(data).format('YYYY-MM-DD')
	}

	const promiseOptions = () => {
		return new Promise((resolve) => {
			setTimeout(() => {
				axios.get(`${API_LICENSE_INPUT}`, {params: {prop_id: cookies.get('property').value}})
				.then(res => {
					resolve(res.data.map(data => {
						const result = `${data.code}`
						return { value: data.id, label: result }
					}))
				})
			}, 1000)
		})
	}
	const defaultValues = state.type === 'post' ? {
		userName : state.userName
	} 
	:
	{
		userName : state.data.user.username,
		name : {label : state.data.license.code, value : state.data.license.id},
		acquisitionDate : state.data.acquisition_date ? dateFormat(state.data.acquisition_date) : '',
		description : state.data.description ? state.data.description : ''
	}


	const onClickBtn = () => {
		navigate(-1) // 바로 이전 페이지로 이동, '/main' 등 직접 지정도 당연히 가능
	}
	
	const validationSchema = yup.object().shape({
		userName: yup.string().required('사용자 코드를 입력해주세요.').min(1, '1자 이상 입력해주세요')
	})

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm({
		defaultValues,
		resolver: yupResolver(validationSchema)
	})
	const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}
	
	const onSubmit = data => {
		const check = checkAsyncSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }
		const formData = new FormData()
		formData.append('user_id', state.userId)
		formData.append('license_id', data.name.value)

		if (data.acquisitionDate !== undefined && data.acquisitionDate !== '') formData.append('acquisitionDate', data.acquisitionDate)
		if (data.description !== undefined && data.description !== '') formData.append('description', data.description)

		if (state.type === 'register') {
			formData.append('img', images[0])
		} else {
			if (typeof images[0] !== 'string') {
				formData.append('img', images[0])
			}
		}

		if (state.type === 'post') {
			axiosPostPut('register', "직원 자격증", API_USER_LICENSE_LIST, formData, setSubmitResult)

		} else {
			formData.append('user_license_id', state.data.id)
			axiosPostPut('modify', "직원 자격증", API_USER_LICENSE_LIST, formData, setSubmitResult)
		}
	}

	useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkAsyncSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])

	useEffect(() => {
		if (submitResult) navigate(ROUTE_BASICINFO_EMPLOYEE_INFORMATION)
	}, [submitResult])

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
							자격증 {state.type !== 'post' ? '수정' : '등록'}
						</CardTitle>
					</CardHeader>
					<CardBody className="mb-2">
						<Row className="card_table mx-0 border-right border-b">
							<Col md='8' xs='12' >
								<Row className='card_table table_row border-top'>
									<Col xs='4'  className='card_table col col_color text center'>
										<div>직원 이름</div>&nbsp;
										<div className='essential_value'/>
									</Col>
									<Col xs='8' className='card_table col text start ' >
										<Controller
											id='userName'
											name='userName'
											control={control}
											render={({ field }) => <Input bsSize='sm' disabled invalid={errors.userName && true} {...field} />}
										/>
										{errors.userName && <FormFeedback>{errors.userName.message}</FormFeedback>}
									</Col>
									<Col xs='4'  className='card_table col col_color text center' style={{borderTop: '1px solid #B9B9C3'}}>
										<div>자격증 이름</div>&nbsp;
										<div className='essential_value'/>
									</Col>
									<Col xs='8' className='card_table border-top' style={{alignItems:'center', display:'flex'}}>
										<Controller
											id='name'
											name='name'
											control={control}
											render={({ field : {value}}) => (
												<Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
													<AsyncSelect 
														name='name'
														classNamePrefix={'select'}
														className="react-select custom-select-name custom-react-select"
														cacheOptions
														defaultOptions 
														loadOptions={promiseOptions} 
														value={value}
														placeholder={'자격증 이름'} 
														onChange={handleSelectValidation} 
													/>
													{name && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>자격증을 선택해주세요.</div>}
												</Col>
											)}
										/>
									</Col>
									<Col xs='4'  className='card_table col col_color text center' style={{borderTop: '1px solid #B9B9C3'}}>
										<div>취득일자</div>
									</Col>
									<Col xs='8' className='card_table col text start ' style={{borderTop: '1px solid #B9B9C3'}}>
										<Controller
											id='acquisitionDate'
											name='acquisitionDate'
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
									<Col xs='4'  className='card_table col col_color text center' style={{borderTop: '1px solid #B9B9C3'}}>
										<div>비고</div>
									</Col>
									<Col xs='8' className='card_table col text start ' style={{borderTop: '1px solid #B9B9C3'}}>
										<Controller
											id='description'
											name='description'
											control={control}
											render={({ field }) => <Input type="textarea"  {...field} />}
										/>
									</Col>
								</Row>
							</Col>
							<Col md='4' xs='12'>
								<Row className='card_table table_row border-top' >
									<Col xs='4'  className='card_table col col_color text word-normal center'>
										<div>이미지</div>
									</Col>
									<Col xs='8' className='card_table col text center ' >
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
						<Button type="submit" color="primary">{state.type !== 'post' ? '수정' : '등록'}</Button>
					</CardFooter>
				</Card>
			</Form>
		</Fragment>
	)
}

export default LicenseRegister
