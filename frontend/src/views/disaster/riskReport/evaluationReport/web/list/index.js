/* eslint-disable */
import Breadcrumbs from '@components/breadcrumbs'
import { setEvaluationId, setPageType, setRegisterModalIsOpen, setTab } from '@store/module/criticalDisaster'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { checkApp, pickerDateChange } from '@utils'
import CustomDataTable from '@views/system/basic/company/list/CustomDataTable'

import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import { Calendar, FileText } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, InputGroupText, Row } from "reactstrap"
import Cookies from 'universal-cookie'

import { API_CRITICAL_DISASTER_EVALUATION_LIST, API_CRITICAL_DISASTER_EVALUATION_REG, API_DISASTER_TEMPLATE_LIST, ROUTE_CRITICAL_DISASTER_EVALUATION, ROUTE_CRITICAL_DISASTER_REPORT_LIST_EXPORT } from '../../../../../../constants'
import { CRITICAL_EVALUATION_LIST } from '../../../../../../constants/CodeList'
import { setCdTotalTitle } from '../../../../../../redux/module/criticalDisaster'
import { axiosPostPutCallback, checkOnlyView, getTableDataCallback } from '../../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../../utility/hooks/useAxiosInterceptor'
import TitleInputModal from '../../../../../apps/customModal/CustomInputModal'
import { criticalDisasterReset, customStyles, evaluationListColumns } from '../data'
import ApprovalModal from './ApprovalModal'

import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from '../../../../../../components/TotalLabel'

const EvaluationListIndex = () => {
	useAxiosIntercepter()
	const criticalDisasterRedux = useSelector((state) => state.criticalDisaster)
	const loginAuth = useSelector((state) => state.loginAuth)
	const cookies = new Cookies()
	// const isManager = cookies.get('isManager') === 'true' || cookies.get('isManager') === true
	const [isManager, setIsManager] = useState(false)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [data, setData] = useState([])
	const [templateData, setTemplateData] = useState([])
	const [searchName, setSearchName] = useState('')
	const [picker, setPicker] = useState(pickerDateChange([moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]))
	const [check, setCheck] = useState(false)

	const [template, setTemplate] = useState([])
	const [title, setTitle] = useState('')

	// modal isOpen
	const setTemplateModalIsOpne = (boolean) => {
		dispatch(setRegisterModalIsOpen(boolean)) // redux
	}

	function handleRegisterBtn () {
		dispatch(setTab('notice'))
		setTemplateModalIsOpne(true)
	}

	// axiosPostPutCallback set
	const setEvaluationIdCallback = (data) => { // 위험성 평가 아이디 redux에 저장하는 func
		dispatch(setEvaluationId(data))
		navigate(`${ROUTE_CRITICAL_DISASTER_EVALUATION}/list/register`, {state:{pageType:'register'}})
	}
	// modal callback 
	const regEvaluation = (inputValue) => {
		let tempTitle = inputValue.trim()
		dispatch(setCdTotalTitle(tempTitle))
		dispatch(setPageType('register'))
		const formData = new FormData()
		formData.append('title', tempTitle)
		formData.append('property', cookies.get('property').value)
		formData.append('cd_evaluation_admin', cookies.get('userId'))
		axiosPostPutCallback('register', '위험성 평가', API_CRITICAL_DISASTER_EVALUATION_REG, formData, setEvaluationIdCallback, false) // 위험성 평가 등록
	}

	// modal select options 
	const makeTemplateOptions = (data) => { // 양식 목록 만드는 func
		const tempList = [...data]
		const templateList = []
		tempList.forEach(template => templateList.push({label: template.title, value: template.id}))
		setTemplateData(templateList)
	}

	// 미완료 필터
	const setfilterCheck = (data) => {
		const temp = [...data]
		if (check) {
			setData(temp.filter((row) => !row.type))
			return
		}
		setData(temp)
	}
	const getEvaluationList = () => {
		const param = {
			property: cookies.get('property').value,
			search: searchName,
			picker: picker
		}
		getTableDataCallback(API_CRITICAL_DISASTER_EVALUATION_LIST, param, setfilterCheck)
	}

	const handleClick = () => {
    	localStorage.setItem("data", JSON.stringify(data))
		window.open(ROUTE_CRITICAL_DISASTER_REPORT_LIST_EXPORT, '_blank')
	}

	useEffect(() => {
		localStorage.removeItem('data')
		criticalDisasterReset(dispatch)
		const param = {
			property: cookies.get('property').value,
			search: ''
		}
		getTableDataCallback(API_DISASTER_TEMPLATE_LIST, param, makeTemplateOptions)
		// evaluation list
		getEvaluationList()
		setIsManager(loginAuth.isManager)
	}, [])

	return (
		<Fragment>
			{
				checkApp ? '' :
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='위험성평가' breadCrumbParent='중대재해관리' breadCrumbActive='위험성평가' />
						<Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleClick}>
							<FileText size={14}/>
							문서변환
						</Button.Ripple>
					</div>
				</Row>
			}
			<Row>
				<Col>
					<Card>
						<CardHeader>
							<CardTitle>위험성평가 목록</CardTitle>
							{(!checkApp && isManager) && <Button hidden={checkOnlyView(loginAuth, CRITICAL_EVALUATION_LIST, 'available_create')} color='primary' onClick={() => { handleRegisterBtn() }}>등록</Button>}
						</CardHeader>

						<CardBody>
							<Row>
								<Col xs={12}>
									<Row>
										<Col className='mb-1'md={4} xs={12}>
											<Row>
												<Col xs={2} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>기간</Col>
												<Col xs={10}>
													<InputGroup>
														<Flatpickr
															name='pickr'
															className='form-control'
															value={picker}
															onChange={date => {
																if (date.length === 2) setPicker(pickerDateChange(date))
															}}
															options={{
																mode: 'range',
																ariaDateFormat:'Y-m-d',
																locale: {
																	rangeSeparator: ' ~ '
																},
																locale: Korean
															}}/>
														<InputGroupText>
															<Calendar color='#B9B9C3'/>
														</InputGroupText>
													</InputGroup>
												</Col>
											</Row>
										</Col>
										{
											// !checkApp &&
											<Col className='mb-1'md={4} xs={12}>
												<Row>
													<Col xs={12}>
													<InputGroup>
														<Input
															name='name'
															placeholder='위험성평가명을 입력하세요.'
															onChange={(e) => setSearchName(e.target.value)}
															value={searchName}
															onKeyDown={e => {
																if (e.key === 'Enter') {
																	getEvaluationList()
																}
															}}/>
														<Button style={{zIndex:0}}
															onClick={() => {
																getEvaluationList()
															}}>검색</Button>
													</InputGroup>
													</Col>
												</Row>
											</Col>
										}
										<Col className='mb-1'md={4} xs={12} style={checkApp ? undefined : {display:'flex', alignItems:'center'}} >
											<Row>
												{checkApp && <Col xs={2} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>필터</Col>}
												<Col xs={checkApp ? 10 : 12} style={{display:'flex'}}>
													<Input 
														type='checkbox' 
														color='#FF922A' 
														onChange={(e) => {setCheck(e.target.checked)}}
													/>
													&nbsp;&nbsp;
													{
														// checkApp ? <div>작성중 문서 모아보기</div>:
														<div style={{color:'#FF922A'}}>미완료 문서 모아보기</div>
													}
												</Col>
											</Row>
										</Col>
									</Row>
								</Col>
							</Row>

							<Row>
								<Col md={3} xs={12}>
									<TotalLabel 
										num={3}
										data={data.length}
									/>
								</Col>
								{
									// checkApp ?
									// <Col style={{color:'#FF922A', textAlign:'start'}}>{`서명이 필요한 ${tempCnt}개의 문서가 있습니다.`}</Col>
									// :
									!checkApp && <Col md={9} xs={12} style={{color:'#ACACAC', textAlign:'end'}}>결재 및 서명란을 클릭해 해당 내역을 볼 수 있습니다.</Col>
								}
							</Row>
							<CustomDataTable
								columns={checkApp ? evaluationListColumns.appList : evaluationListColumns.webList}
								tableData={data}
								selectType={false}
								styles={customStyles}
								// detailAPI = {ROUTE_CRITICAL_DISASTER_DETAIL} //? 무엇을 위한 라우터인가요?
							/>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<ApprovalModal redux={criticalDisasterRedux}/>
			<TitleInputModal
				headerTitle={'위험성 평가 양식'}
				headerHelpText={'위험성 평가 양식을 선택해주세요.'}
				selectTitle={'위험성 평가 양식'}
				isOpen={criticalDisasterRedux.registerModalIsOpen}
				setIsOpen={setTemplateModalIsOpne}
				navAPI={`${ROUTE_CRITICAL_DISASTER_EVALUATION}/list/register`}
				input={title}
				setInput={setTitle}
				callbackSubmit={regEvaluation}
			/>
			{/* <TemplateModal
				headerTitle={'위험성 평가 양식'}
				headerHelpText={'위험성 평가 양식을 선택해주세요.'}
				selectTitle={'위험성 평가 양식'}
				isOpen={criticalDisasterRedux.registerModalIsOpen}
				setIsOpen={setTemplateModalIsOpne}
				navAPI={`${ROUTE_CRITICAL_DISASTER_EVALUATION}/list/register`}
				data={templateData}
				type={template}
				setType={setTemplate}
				input={title}
				setInput={setTitle}
				callbackSubmit={regEvaluation}
			/> */}
		</Fragment>
	)
}

export default EvaluationListIndex