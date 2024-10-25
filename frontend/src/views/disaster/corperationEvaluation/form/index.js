import Breadcrumbs from '@components/breadcrumbs'
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, Input, Row, Label, FormFeedback } from "reactstrap"
import { useLocation } from 'react-router'
import { FileText } from "react-feather"
import { Link, useNavigate, useParams } from "react-router-dom"
import Select from "react-select"
import Flatpickr from "react-flatpickr"
import '@styles/react/libs/flatpickr/flatpickr.scss'

import { selectLevelList, defaultValues, validationSchema, levelList, sectionAll } from '../data'
import { getTableData, setStringDate, checkSelectValue, checkSelectValueObj, axiosPostPutNavi, getTableDataCallback, axiosDeleteNavi } from '@utility/Utils'
import { API_CRITICAL_DISASTER_EVALUATION_QUESTION, API_EMPLOYEE_DETAIL, 
	API_CRITICAL_CORPERATION_EVALUATION_FORM, ROUTE_CRITICAL_CORPERATION_EVALUATION_LIST, 
	API_CRITICAL_CORPERATION_EVALUATION_DETAIL, ROUTE_CRITICAL_CORPERATION_EVALUATION_FORM,
	ROUTE_CRITICAL_CORPERATION_EVALUATION_EXPORT 
} from '../../../../constants'
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { yupResolver } from '@hookform/resolvers/yup'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const CorperationEvalutionForm = () => {
	useAxiosIntercepter()
	const { state } = useLocation()
	const { id } = useParams()
	const cookies = new Cookies()
	const activeUser = Number(cookies.get('userId'))
	const navigator = useNavigate()

	const [userData, setUserData] = useState([])
	const [detailData, setDetailData] = useState([])
	const [question, setQuestion] = useState([])
	const currentDate = moment().format('YYYY-MM-DD')
	const [writingDate, setWritingDate] = useState([currentDate])
	const [subTitle, setSubTitle] = useState('')
	const [selectLevel, setSelectLevel] = useState(selectLevelList[0])

	const [scores_D, setScores_D] = useState(1)

	const [totalScore_A, setTotalScore_A] = useState(3) //A번 항목 점수 총합
	const [totalScore_B, setTotalScore_B] = useState(5) //B번 항목 점수 총합
	const [totalScore_C, setTotalScore_C] = useState(3) //C번 항목 점수 총합

	const totalScore = Number(totalScore_A) + Number(totalScore_B)  + Number(totalScore_C) + Number(scores_D)
	const [evaluatioinLevel, setEvaluationLevel] = useState('D')
	const [judgement, setJudgemet] = useState('부적격')

	const [selectError, setSelectError] = useState({work_level: false})
	const {work_level} = selectError

	const [modifyAuth, setModifyAuth] = useState(false)

	const {
		control,
		handleSubmit,
		setValue,
		watch,
		trigger,
		formState: { errors }
	} = useForm({
		defaultValues,
		resolver: yupResolver(validationSchema)
	})

	const handleSelectValidation = (e, event) => {
		setSelectLevel(e)
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

	const onSubmit = (data) => {
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }
		Object.keys(data).map(key => {
			if (key in sectionAll) {
				sectionAll[key] = data[key]
			}
		})
		console.log("sectionAll", sectionAll)
		const formData = new FormData()
		formData.append('user_id', cookies.get('userId'))
		formData.append('property_id', cookies.get('property').value)
		formData.append('corperation_name', data.corperation_name)
		formData.append('contract_work', data.contract_work)
		formData.append('evaluation_date',	writingDate[0])
		formData.append('work_level', selectLevel.value)
		formData.append('control_state', data.control_state)
		formData.append('haed_office', data.haed_office)
		formData.append('department', data.department)
		formData.append('employee_level', data.employee_level)		
		formData.append('answer', JSON.stringify(sectionAll))
		formData.append('total_score', totalScore)
		formData.append('signature', userData.signature ? userData.signature : '')

		const API = state.pageType === 'register' ? API_CRITICAL_CORPERATION_EVALUATION_FORM : `${API_CRITICAL_CORPERATION_EVALUATION_DETAIL}/${state.id}`

		axiosPostPutNavi(state.pageType, '협력업체평가', API, formData, navigator, ROUTE_CRITICAL_CORPERATION_EVALUATION_LIST)
	}

	const handleSetFun = (data) => {
		setModifyAuth(activeUser === Number(data.user))
		setDetailData(data)
		setValue("corperation_name", data.corperation_name)
		setValue("control_state", data.control_state)
		setValue("contract_work", data.contract_work)
		setValue("haed_office", data.haed_office)
		setValue("department", data.department)
		setValue("employee_level", data.employee_level)
		setValue("work_level", selectLevelList.find(select => String(select.value) === String(data.work_level)))
		setSelectLevel(selectLevelList.find(select => String(select.value) === String(data.work_level)))
		setValue('C01', data.answer[0].score)
		setValue('C02', data.answer[1].score)
		setValue('C03', data.answer[2].score)
		setValue('C04', data.answer[3].score)
		setValue('C05', data.answer[4].score)
		setValue('C06', data.answer[5].score)
		setValue('C07', data.answer[6].score)
		setValue('C08', data.answer[7].score)
		setValue('C09', data.answer[8].score)
		setValue('C10', data.answer[9].score)
		setValue('C11', data.answer[10].score)
		setValue('C12', data.answer[11].score)
		setScores_D(data.answer[11].score)
	}

	const handleExport = () => {
		localStorage.setItem('disaster_evaluation_id', id)
		window.open(ROUTE_CRITICAL_CORPERATION_EVALUATION_EXPORT, '_blank')
	}

	useEffect(() => {
		if (state.pageType !== 'detail') { // 의도하고 sign 수정 막음.
			getTableData(API_EMPLOYEE_DETAIL, {userId:cookies.get('userId')}, setUserData)
		} 
		getTableData(API_CRITICAL_DISASTER_EVALUATION_QUESTION, {}, setQuestion)
	}, [])

	useEffect(() => {
		if (state.pageType !== 'register') getTableDataCallback(`${API_CRITICAL_CORPERATION_EVALUATION_DETAIL}/${id !== undefined ? id : state.id}`, {}, handleSetFun)
	}, [id])

	useEffect(() => {
		const month = Number(moment(writingDate[0]).format('MM'))
		if (month <= 6) {
			setSubTitle('상반기')
		} else {
			setSubTitle('하반기')
		}
	}, [writingDate])

	// 자동계산
	useEffect(() => {
		setTotalScore_A(Number(watch('C01')) + Number(watch('C02')) + Number(watch('C03')))
		setTotalScore_B(Number(watch('C04')) + Number(watch('C05')) + Number(watch('C06')) + Number(watch('C07')) + Number(watch('C08')))
		setTotalScore_C(Number(watch('C09')) + Number(watch('C10')) + Number(watch('C11')))
		setScores_D(watch('C12'))
	}, [
		watch('C01'),
		watch('C02'),
		watch('C03'),
		watch('C04'),
		watch('C05'),
		watch('C06'),
		watch('C07'),
		watch('C08'),
		watch('C09'),
		watch('C10'),
		watch('C11'),
		watch('C12')
	])

	useEffect(() => {
		// 평가 등급
		if (totalScore >= 90) {
			setEvaluationLevel('S')
		} else if (totalScore >= 80) {
			setEvaluationLevel('A')
		} else if (totalScore >= 70) {
			setEvaluationLevel('B')
		} else if (totalScore >= 60) {
			setEvaluationLevel('C')
		} else {
			setEvaluationLevel('D')
		}
	}, [totalScore])

	useEffect(() => {
		// 적격여부
		const inputLevleIdx = levelList.indexOf(selectLevel.value)
		const evaluationIdx = levelList.indexOf(evaluatioinLevel)
		if (inputLevleIdx >= 0 && evaluationIdx >= inputLevleIdx) {
			setJudgemet('적격')
		} else {
			setJudgemet('부적격')
		}
	}, [evaluatioinLevel, selectLevel])

	const detailDataValueCheck = (obj, key) => {
		if (obj.hasOwnProperty(key) && obj[`${key}`] !== '' &&  obj[`${key}`] !== null &&  obj[`${key}`] !== 'null') {
			return obj[`${key}`]
		}
		return undefined
	}

	useEffect(() => {
		console.log(detailData)
	}, [detailData])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='협력업체평가' breadCrumbParent='중대재해관리' breadCrumbActive={`협력업체평가 ${state.pageType === 'register' ? '등록' : state.pageType !== 'detail' ? '수정' : ''}`}/>
					{state.pageType === 'detail' &&
						<Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
							<FileText size={14}/>
							문서변환
						</Button.Ripple>
					}
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle>협력업체평가 {moment(writingDate[0]).format('YYYY')}년 {subTitle}</CardTitle>
				</CardHeader>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<CardBody>
						<Row className='mx-0' style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col col_color text center '>
										업체명&nbsp;
										{ state.pageType !== 'detail' && 
											<div className='essential_value'/>
										}
									</Col>
									<Col xs='8' className='card_table col text start'>
										<Controller 
											name='corperation_name'
											control={control}
											render={({ field }) => (
												<Col>
													{ state.pageType !== 'detail' ? 
														<Input maxLength={148} invalid={errors.corperation_name && true} {...field}/>
														:
														detailData.corperation_name
													}
													{errors.corperation_name && <FormFeedback>{errors.corperation_name.message}</FormFeedback>}
												</Col>
											)}
										/>
									</Col>
								</Row>
							</Col>
							<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col col_color text center'>
										계약업무&nbsp;
										{ state.pageType !== 'detail' && 
											<div className='essential_value'/>
										}
									</Col>
									<Col xs='8' className='card_table col text start'>
										<Controller 
											name='contract_work'
											control={control}
											render={({ field }) => (
												<Col>
													{ state.pageType !== 'detail' ? 
														<Input maxLength={198} invalid={errors.contract_work && true} {...field}/>
														:
														detailData.contract_work
													}
													{errors.contract_work && <FormFeedback>{errors.contract_work.message}</FormFeedback>}
												</Col>
											)}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className='mx-0' style={{borderRight: '1px solid #B9B9C3', fontSize:'16px', borderBottom: '1px solid #B9B9C3'}}>
							<Col xs='12' md='6'>
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col col_color text center'>평가일자</Col>
									<Col xs='8' className='card_table col text start '>
										{ state.pageType !== 'detail' ? 
											<Flatpickr
												value={writingDate}
												id='range-picker'
												className='form-control'
												onChange={(data) => {
													const newData = setStringDate(data)
													setWritingDate(newData)
												}}
												options={{
													mode: 'single', 
													// maxDate: now,
													defaultDate: writingDate,
													ariaDateFormat:'Y-m-d',
													locale:Korean
												}}
											/>
											:
											moment(detailData.evaluation_date).format('YYYY-MM-DD')
										}
									</Col>
								</Row>
							</Col>
							<Col xs='12' md='6'>
								<Row className='card_table table_row'>
								</Row>
							</Col>
						</Row>
						<Row className='mx-0' style={{borderRight: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col col_color text center'>
										작업등급&nbsp;
										{ state.pageType !== 'detail' && 
											<div className='essential_value'/>
										}
									</Col>
									<Col xs='8' className='card_table col text start '>
										<Controller 
											name='work_level'
											control={control}
											render={({ field: {value} }) => (
												<Col md='6'>
													{ state.pageType !== 'detail' ? 
														<Select
															name='work_level'
															autosize={true}
															classNamePrefix={'select'}
															className="react-select custom-select-work_level custom-react-select"
															options={selectLevelList}
															value={value}
															onChange={ handleSelectValidation }
														/>
														:
														detailData.work_level
													}
													{work_level && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>작업등급을 선택해주세요.</div>}
												</Col>
											)}
										/>
									</Col>
								</Row>
							</Col>
							<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col col_color text center '>실질지배여부</Col>
									<Col xs='8' className='card_table col text start '>
										{ state.pageType !== 'detail' ? 
											<>
											<Controller
												name='control_state'
												control={control}
												render={({ field : {onChange, value} }) => (
													<Col className='form-check'>
														<Label className='form-check-label' for='target'>
															대상
														</Label>
														<Input id='target'  type='radio' checked={value === true} onChange={() => onChange(true)}/>
													</Col>
											)}/>
											<Controller
												name='control_state'
												control={control}
												render={({ field: {onChange, value} }) => (
													<Col className='form-check ms-1'>
														<Label className='form-check-label' for='untarget'>
															비대상
														</Label>
														<Input id='untarget'  type='radio' checked={value === false} onChange={() => onChange(false)}/>
													</Col>
											)}/>
											</>
											:
											detailData.control_state === true ? '대상' : '비대상'
										}
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className='mx-0' style={{borderRight: '1px solid #B9B9C3', fontSize:'16px', minHeight:'55.99px'}}>
							<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col col_color text center'>평가점수</Col>
									<Col xs='8' className='card_table col text start '>{totalScore} 점</Col>
								</Row>
							</Col>
							<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col col_color text center'>평가자</Col>
									<Col xs='8' className='card_table col text start'>
										{state.pageType !== 'register' ?
											detailData.user_name
											:
											`${userData.name}(${userData.username})`
										}
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className='mx-0' style={{borderRight: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col col_color text center '>평가등급</Col>
									<Col xs='8' className='card_table col text start'>{evaluatioinLevel}</Col>
								</Row>
							</Col>
							<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col col_color text center'>
										본부 / 부서&nbsp;
										{ state.pageType !== 'detail' && 
											<div className='essential_value'/>
										}
									</Col>
									<Col xs='8' className='card_table col text start' style={{paddingTop:'4px', paddingBottom:'4px'}}>
										<Col md='6' className='card_table col text start'>
											<Controller 
												name='haed_office'
												control={control}
												render={({ field }) => (
													<Col>
														{ state.pageType !== 'detail' ?
															<Input maxLength={148} invalid={errors.haed_office && true} placeholder='본부' {...field}/>
															:
															detailData.haed_office
														}
														{errors.haed_office && <FormFeedback>{errors.haed_office.message}</FormFeedback>}
													</Col>
												)}
											/>
										</Col>
										<Col md='6' className='card_table col text start'>
											<Controller 
												name='department'
												control={control}
												render={({ field }) => (
													<Col>
														{ state.pageType !== 'detail' ? 
															<Input invalid={errors.department && true} placeholder='부서' {...field}/>
															:
															`/ ${detailData.department}`
														}
														{errors.department && <FormFeedback>{errors.department.message}</FormFeedback>}
													</Col>
												)}
											/>
										</Col>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className='mx-0' style={{borderRight: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col col_color text center'>적격여부</Col>
									<Col xs='8' className='card_table col text start '>{judgement}</Col>
								</Row>
							</Col>
							<Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='4' className='card_table col text col_color center'>
										직급 / 성명&nbsp;
										{ state.pageType !== 'detail' && 
											<div className='essential_value'/>
										}
									</Col>
									<Col xs='8' className='card_table col text' style={{paddingTop:'4px', paddingBottom:'4px'}}>
										<Col md='6' className='card_table col text start'>
											<Controller 
												name='employee_level'
												control={control}
												render={({ field }) => (
													<Col>
														{ state.pageType !== 'detail' ? 
															<Input maxLength={148} invalid={errors.employee_level && true} placeholder='직급' {...field}/>
															:
															detailData.employee_level
														}
														{errors.employee_level && <FormFeedback>{errors.employee_level.message}</FormFeedback>}
													</Col>
												)}
											/>
										</Col>
										<Col md='6' className='card_table col text center'>
											{ state.pageType !== 'detail' &&
												<>(서명)</>
											}
											{ state.pageType === 'detail' &&
												<>
												{
													detailDataValueCheck(detailData, 'signature') ? 
													<>
														(서명)
														<img src={`/static_backend/${detailData.signature}`} className='sign-image'/>
													</>
													:
													<>(서명)&nbsp;&nbsp;이미지없음
													</>
												}
												</>
											}
										</Col>
									</Col>
								</Row>
							</Col>
						</Row>
						{/* 평가 시작 */}
						<Row className='mx-0 mt-3 risk-report text-bold' style={{borderTop: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text center '>평가항목 및 배점</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '> 평가내용 및 평가기준</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '>배점</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '>득점</Col>
								</Row>
							</Col>
						</Row>
						{/* A 구간 */}
						<Row className='mx-0 risk-report text-bold' style={{borderLeft: '1px solid #B9B9C3', backgroundColor:'#f1f1f1'}}>
							<Col xs='6' md='8' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text'>A. 안전보건관리체계</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '>20</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '>{totalScore_A}</Col>
								</Row>
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[0].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[0].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '>{question && question.length > 0 && question[0].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C01'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C01 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C01')
													}}
													/>
													{errors.C01 && <FormFeedback>{errors.C01.message}</FormFeedback>}
											</Col>
										)}
									/>
								:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C01}</Col>
									</Row>
								}
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[1].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[1].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[1].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C02'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C02 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C02')
													}}
													/>
													{errors.C02 && <FormFeedback>{errors.C02.message}</FormFeedback>}
											</Col>
										)}
									/>
								:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C02}</Col>
									</Row>
								}
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[2].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[2].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[2].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C03'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C03 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C03')
													}}
													/>
													{errors.C03 && <FormFeedback>{errors.C03.message}</FormFeedback>}
											</Col>
										)}
									/>
									:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C03}</Col>
									</Row>
								}
							</Col>
						</Row>
						{/* B 질문 */}
						<Row className='mx-0 risk-report text-bold' style={{borderLeft: '1px solid #B9B9C3', backgroundColor:'#f1f1f1'}}>
							<Col xs='6' md='8' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text'>B. 실행수준</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '>40</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '>{totalScore_B}</Col>
								</Row>
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[3].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[3].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[3].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C04'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C04 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C04')
													}}
													/>
													{errors.C04 && <FormFeedback>{errors.C04.message}</FormFeedback>}
											</Col>
										)}
									/>
									:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C04}</Col>
									</Row>
								}
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[4].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[4].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[4].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C05'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C05 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C05')
													}}
													/>
													{errors.C05 && <FormFeedback>{errors.C05.message}</FormFeedback>}
											</Col>
										)}
									/>
									:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C05}</Col>
									</Row>
								}
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[5].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row' style={{whiteSpace:'pre-wrap'}}>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[5].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[5].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3', display:'flex', alignItems:'center', justifyContent:'center'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C06'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C06 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C06')
													}}
													/>
													{errors.C06 && <FormFeedback>{errors.C06.message}</FormFeedback>}
											</Col>
										)}
									/>
									:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C06}</Col>
									</Row>
								}
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[6].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[6].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[6].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C07'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C07 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C07')
													}}
													/>
													{errors.C07 && <FormFeedback>{errors.C07.message}</FormFeedback>}
											</Col>
										)}
									/>
									:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C07}</Col>
									</Row>
								}
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[7].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[7].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[7].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C08'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C08 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C08')
													}}
													/>
													{errors.C08 && <FormFeedback>{errors.C08.message}</FormFeedback>}
											</Col>
										)}
									/>
									:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C08}</Col>
									</Row>
								}
							</Col>
						</Row>
						{/* C 질문 */}
						<Row className='mx-0 risk-report text-bold' style={{borderLeft: '1px solid #B9B9C3', backgroundColor:'#f1f1f1'}}>
							<Col xs='6' md='8' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text'>C. 운영관리</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '>20</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '>{totalScore_C}</Col>
								</Row>
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[8].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[8].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[8].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C09'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C09 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C09')
													}}
													/>
													{errors.C09 && <FormFeedback>{errors.C09.message}</FormFeedback>}
											</Col>
										)}
									/>
									:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C09}</Col>
									</Row>
								}
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[9].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[9].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[9].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C10'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C10 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C10')
													}}
													/>
													{errors.C10 && <FormFeedback>{errors.C10.message}</FormFeedback>}
											</Col>
										)}
									/>
									:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C10}</Col>
									</Row>
								}
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[10].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row' style={{whiteSpace:'pre-wrap'}}>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[10].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[10].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3', display:'flex', alignItems:'center', justifyContent:'center'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C11'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C11 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C11')
													}}
													/>
													{errors.C11 && <FormFeedback>{errors.C11.message}</FormFeedback>}
											</Col>
										)}
									/>
									:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C11}</Col>
									</Row>
								}
							</Col>
						</Row>
						{/* D 질문 */}
						<Row className='mx-0 risk-report text-bold' style={{borderLeft: '1px solid #B9B9C3', backgroundColor:'#f1f1f1'}}>
							<Col xs='6' md='8' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text'>D. 재해발생 수준</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '>20</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center '>{scores_D}</Col>
								</Row>
							</Col>
						</Row>
						<Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
							<Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[11].name}</Col>
								</Row>
							</Col>
							<Col xs='6' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text '>{question && question.length > 0 && question[11].type}</Col>
								</Row>
							</Col>
							<Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								<Row className='card_table table_row'>
									<Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[11].rate}</Col>
								</Row>
							</Col>
							<Col xs='4' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
								{ state.pageType !== 'detail' ? 
									<Controller
										name='C12'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='card_table col text' style={{flexDirection:'column', alignItems:'start'}}>
												<Input 
													disabled={state.pageType === 'detail' && true}
													maxLength="10" 
													type='number' 
													style={{width:'100%', textAlign:'center'}} 
													invalid={errors.C12 && true} 
													value={Number(value)}
													onChange={e => {
														onChange(e)
														trigger('C12')
													}}
													/>
													{errors.C12 && <FormFeedback>{errors.C12.message}</FormFeedback>}
											</Col>
										)}
									/>
									:
									<Row className='card_table table_row'>
										<Col xs='12' className='card_table col text center'>{control._formValues.C12}</Col>
									</Row>
								}
							</Col>
						</Row>
					</CardBody>
					<CardFooter className='mt-2' style={{display:'flex', justifyContent:'end', alignItems:'center'}}>
						{state.pageType !== 'detail' &&
							<Button color='primary'>{state.pageType === 'register' ? '저장' : '수정'}</Button>
						}
						{
							state.pageType === 'detail' && modifyAuth &&
							<>
								<Button color='danger' onClick={() => axiosDeleteNavi('협력업체평가', `${API_CRITICAL_CORPERATION_EVALUATION_DETAIL}/${id}`, navigator, ROUTE_CRITICAL_CORPERATION_EVALUATION_LIST)}>삭제</Button>
								<Button className="ms-1" color='primary' onClick={() => navigator(ROUTE_CRITICAL_CORPERATION_EVALUATION_FORM, {state:{id:id, pageType:'modify'}})}>수정</Button>
							</>
						}
						<Button type='button' className="mx-1" tag={Link} to={ROUTE_CRITICAL_CORPERATION_EVALUATION_LIST}>목록</Button>
					</CardFooter>
				</Form>
			</Card>

		</Fragment>
	)
}

export default CorperationEvalutionForm