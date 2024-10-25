/* eslint-disable */
import { setPageType } from '@store/module/criticalDisaster'
import { axiosDeleteParm, axiosPostPutCallback, checkApp, checkOnlyView, getTableDataCallback, sweetAlert } from '@utils'
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom"
import { Button, Col, Row } from "reactstrap"
import Swal from 'sweetalert2'
import Cookies from 'universal-cookie'
import { API_CRITICAL_DISASTER_EVALUATION_DETAIL, API_CRITICAL_DISASTER_EVALUATION_LIST, API_CRITICAL_DISASTER_EVALUATION_REJECT, API_DISASTER_EVALUTION_SIGN, ROUTE_CRITICAL_DISASTER_EVALUATION } from "../../../../../../constants"
import { setCdEvaluationAdmin, setEducationId, setEvaluationEvaluatorId, setEvaluationId, setMeetingId, setNoticeId, setReportId, setTab, setTemplateId } from '../../../../../../redux/module/criticalDisaster'
import { preSignResult } from '../data'
import EducationDetail from './categoryEducation/detail/EducationDetail'
import EvaluationCounterplanDetail from "./categoryEvaluationCounterPlan/EvaluationCounterplanDetail"
import CategoryMeetingDetail from "./categoryMeeting/detail"
import CategoryNoticeDetail from "./categoryNotice/CategoryNoticeDetail"
import CategoryReportDetail from "./categoryReport/CategoryReportDetail"


import EvaluationRejectModal from './EvaluationRejectModal'
import CategoryEducation from './categoryEducation'
import EvaluationCounterplanForm from './categoryEvaluationCounterPlan/EvaluationCounterplanForm'
import CategoryMeetingForm from './categoryMeeting'
import CategoryNoticeForm from './categoryNotice/CategoryNoticeForm'
import CategoryReportForm from './categoryReport/CategoryReportForm'
import EvaluationTitle from './categoryTitle'
import { CRITICAL_EVALUATION_LIST } from '../../../../../../constants/CodeList'

const MEETING_COMPLETE = 21 // 사전회의

const FooterLineDetail = (props) => {
	const { 
		isSign, // 내가 결재 가능한지
		setIsSign,
		isInCharge, // 담당자인지
		userSign,
		setUserSign,
		isReject,
		isChargeSign, // 담당자가 사인했는지
		isChargerCheck // 내가 담당자인지
	} = props

	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const loginAuth = useSelector((state) => state.loginAuth)
	const cookies = new Cookies()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { id } = useParams()
	const activeUser = Number(cookies.get('userId'))
	// const isManager = cookies.get('isManager') === 'true'
	const [isManager, setIsManager] = useState(false)
	const [rejectIsOpen, setRejectIsOpen] = useState(false)

	// 담당자 결재 여부는 각페이지에서 검사 
	// 결재가 없는 페이지는 props로 false보내줌
	
	function evaluationDeleteMove () {
		axiosDeleteParm('위험성 평가', API_CRITICAL_DISASTER_EVALUATION_LIST, {data:{evaluation_id: id}}, `${ROUTE_CRITICAL_DISASTER_EVALUATION}/list`, navigate, 'error')
	}

	function handleModify() {
		dispatch(setPageType('modify'))
		navigate(`${ROUTE_CRITICAL_DISASTER_EVALUATION}/list/${id}`, {state:{pageType:'modify', id:id}})
	}

	const authCheckObj = {
		'meeting': userSign,
		'evaluation': userSign,
		'counterplan': userSign,
		'education': userSign
	}

	function handleSetReduxSignLine (data) {
		if (criticalDisaster.tab === 'education' || criticalDisaster.tab === 'meeting') {
			setUserSign(data)
			return
		}
		setUserSign(data)
		dispatch(setTab('evaluation'))
	}

	function handleSign() {
		const titleObj = {
			meeting : '사전회의',
			education : '안전교육',
			evaluation : '위험성평가',
			counterplan : '위험성평가'
		}
		const tabType = criticalDisaster.tab
		const filterData = authCheckObj[tabType].find(user => user.user === activeUser)
		const temp = (tabType === 'meeting' || tabType === 'education') ? ['담당자', '책임자'] : [...userSign.map((_,i) => `작업자${i+1}`)]

		if (tabType === 'meeting' || tabType === 'education') {
			const preUserSignResult = preSignResult(filterData.view_order, authCheckObj[tabType])
			if (filterData.view_order !== 0 && !preUserSignResult.result) {
				if (activeUser === filterData.user) {
					sweetAlert('결재 불가', `${temp[filterData.view_order-1]} 결재가 진행 되지 않았습니다.`, 'warning')
				}
				return
			}
		}
		const formData = new FormData()
		formData.append('line_id', filterData.row_id)
		formData.append('type', criticalDisaster.tab)
		formData.append('pk_id', filterData.content_schedule ? filterData.content_schedule : filterData.critical_disaster)
		Swal.fire({
			title: '알림',
			text: "확인을 클릭하면 더는 수정하실 수 없습니다.\n 해당 결재 내역을 저장하시겠습니까?",
			icon: 'info',
			showCancelButton: true,
			cancelButtonText: '취소',
			confirmButtonText: '결재',
			customClass: {
				cancelButton: 'btn btn-report ms-1',
				confirmButton: 'btn btn-primary',
				container: 'space',
				actions: 'sweet-alert-custom right'
			}
			}).then(function (result) {
				if (result.value) {
					axiosPostPutCallback('modify', `${titleObj[criticalDisaster.tab]} 결재`, API_DISASTER_EVALUTION_SIGN, formData, handleSetReduxSignLine, true, '등록')
				} else {
					sweetAlert('결재 취소', '결재가 취소 되었습니다. 재 확인 해주세요.', 'info')
				}
			})
	}

	const handleReturnNotification = (data) => {
		const setTabObj = {
			meeting : setMeetingId,
			education : setEducationId,
			evaulation : '위험성평가'
		}
		if (criticalDisaster.tab === 'education' || criticalDisaster.tab === 'meeting') {
			setUserSign(data.sign_list)
			return
		}
		dispatch(setTabObj[data.tab](data.id))
		// 알림발송하는 부분 추가해야함
		// 사전회의, 안전 교육 -> 서명하는 사람만?  isManager까지 포함해서?
		// 위험성평가 -> 작업자만 isManager까지 포함해서?
	}

	function handleSignCancel() {
		Swal.fire({
			title: '알림',
			text: "해당 보고서를 회수하시겠습니까?.\n 결재 내역은 초기화 됩니다.",
			icon: 'info',
			showCancelButton: true,
			cancelButtonText: '취소',
			confirmButtonText: '회수',
			customClass: {
				cancelButton: 'btn btn-report ms-1',
				confirmButton: 'btn btn-primary',
				container: 'space',
				actions: 'sweet-alert-custom right'
			}
			}).then(function (result) {
				if (result.value) {
					const titleObj = {
						meeting : '사전회의',
						education : '안전교육',
						evaulation : '위험성평가'
					}
					const tabIdObj = {
						meeting : criticalDisaster.meetingId,
						education : criticalDisaster.educationId,
						evaulation : '위험성평가'
					}
					const formData = new FormData()
					formData.append('userId',  cookies.get('userId'))
					formData.append('tab',  criticalDisaster.tab)
					formData.append('tab_id', tabIdObj[criticalDisaster.tab])
					formData.append('type', 'return')
					axiosPostPutCallback('modify', `${titleObj[criticalDisaster.tab]} 회수`, API_CRITICAL_DISASTER_EVALUATION_REJECT, formData, handleReturnNotification, true, '진행')
				} else {
					sweetAlert('회수 취소', '회수 취소 되었습니다. 재 확인 해주세요.', 'info')
				}
			})
	}

	useEffect(() => {
		setIsManager(loginAuth.isManager)
		const tab = criticalDisaster.tab
		if (tab === 'meeting') { // 사전회의 버튼 표시 로직 if문 안에서 처리 하시면 됩니다.
			setIsSign(criticalDisaster.meetingWriteCount === MEETING_COMPLETE)
			return
		}
	}, [])

	return (
		<Row>
			<Col xs={12}>
				<Col style={{display:'flex', justifyContent:'flex-end'}}>
					{ 
						(isManager || isInCharge) && !isChargeSign &&
						<>
							<Button hidden={checkOnlyView(loginAuth, CRITICAL_EVALUATION_LIST, 'available_delete')} color='danger' className="ms-1"onClick={() => evaluationDeleteMove()}>삭제</Button>
							<Button hidden={checkOnlyView(loginAuth, CRITICAL_EVALUATION_LIST, 'available_update')} color='primary' outline  className="ms-1" onClick={handleModify}>수정</Button>
						</>
					}
					{/* 반려되었을때는 결재 버튼 보이지 않음 */}
					{
						isSign && !isReject && <Button color='primary' className="ms-1" onClick={handleSign}>결재</Button>
					}
					{/* 결재가 진행되고 나서 반려버튼이 나타나게 설정 */}
					{
						(criticalDisaster.tab !== 'evaluation' && criticalDisaster.tab !== 'counterplan') && isChargeSign && !isReject && isInCharge && (
							isChargerCheck ?
							<Button color='danger' className="ms-1" onClick={() => handleSignCancel()}>회수</Button>
							:
							isSign && <Button color='danger' className="ms-1" onClick={() => setRejectIsOpen(true)}>반려</Button>
						)

					}
				</Col>
			</Col>
			<EvaluationRejectModal 
				isOpen={rejectIsOpen}
				setIsOpen={setRejectIsOpen}
				setUserSign={setUserSign}
			/>
		</Row>
	)
}

const EvaluationDetail = () => {
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const { id } = useParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const setDetailCallback = (data) => {
		dispatch(setCdEvaluationAdmin(data.cdEvaluationAdmin)) // 관리자 현재 미사용
		dispatch(setNoticeId(data.notice)) //실시공고
		dispatch(setMeetingId(data.meeting)) //사전회의
		dispatch(setEvaluationEvaluatorId(data.evaluation)) // 위험성평가
		dispatch(setEducationId(data.education)) // 예방대책
		dispatch(setReportId(data.report)) // 결과보고서
		// dispatch(setTemplateId(data.template)) // 템플릿
	}

	useEffect(() => {
		dispatch(setEvaluationId(id))
		if (criticalDisaster.pageType !== '') getTableDataCallback(`${API_CRITICAL_DISASTER_EVALUATION_DETAIL}/${id}`, {}, setDetailCallback)
	}, [id, criticalDisaster.pageType])

	useEffect(() => {
		if (checkApp && criticalDisaster.evaluationEvaluatorId !== '') dispatch(setTab('evaluation'))
	}, [criticalDisaster.evaluationEvaluatorId])

	return (
		<Fragment>
			<EvaluationTitle/>
			{
				criticalDisaster.tab === 'notice' && 
				<>
					{
						criticalDisaster.noticeId === '' || criticalDisaster.pageType === 'modify' ?
						<CategoryNoticeForm
							criticalDisaster={criticalDisaster}
							pageType={'register'}
						/>
						:
						<CategoryNoticeDetail
							pageType={'detail'}
						/>
					}
				</>
			}
			{
				criticalDisaster.tab === 'meeting' &&
				<>
				{
					criticalDisaster.meetingId === '' ||  criticalDisaster.pageType === 'modify' ?
					<CategoryMeetingForm
						criticalDisaster={criticalDisaster}	
					/>
					:
					<CategoryMeetingDetail 
						navigate={navigate}
						dispatch={dispatch}
						id={id}
					/>
				}
				</>
			}
			{
				(criticalDisaster.tab === 'evaluation' || criticalDisaster.tab === 'counterplan') &&
				<>
					{
						criticalDisaster.evaluationEvaluatorId === '' || criticalDisaster.pageType === 'modify' ? // 현재 미개발 페이지
						<EvaluationCounterplanForm/>
						:
						<EvaluationCounterplanDetail/>
					}
				</>
			}
			{
				criticalDisaster.tab === 'education' &&
				<>
				{
					criticalDisaster.educationId === '' || criticalDisaster.pageType === 'modify'  ?
					<CategoryEducation/>
					:
					<EducationDetail/>
				}
				</>
			}
			{
				criticalDisaster.tab === 'report' &&
				<>
				{
					criticalDisaster.reportId === '' || criticalDisaster.pageType === 'modify'?
					<CategoryReportForm/>
					:
					<CategoryReportDetail/>
				}
				</>
			}
		</Fragment>
	)
}

export { EvaluationDetail, FooterLineDetail }
