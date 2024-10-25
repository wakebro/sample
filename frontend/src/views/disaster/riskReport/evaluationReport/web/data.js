/* eslint-disable */
import { getCommaDel, resultCheckFunc, dateFormat, primaryHeaderColor, primaryColor } from '@utils'
import * as moment from 'moment'

import {
	// 안전교육
	setEducationId,
	setCdTotalTitle,
	setEducationParticipantMan,
	setEducationParticipantWoman,
	// 위험성 평가 양식
	setEvaluationEvaluatorId,
	setEvaluationEvaluatorList,
	setEvaluationEvaluatorModalIsOpen,
	setEvaluationFormIsDone,
	setEvaluationId,
	setEvaluationSelectEvaluator,
	setEvaluationSelectWorker,
	setEvaluationWorkerList,
	setEvaluationWorkerModalIsOpen,
	// 사전회의
	setMeetingId,
	setMeetingParticipantMan,
	setMeetingParticipantWoman,
	setModalIsOpen,
	setModalName,
	// 실시공고
	setNoticeId,
	setPageType,
	setRegisterFormType,
	setRegisterModalIsOpen,
	// 결과보고서
	setReportId,
	setRowData,
	setTab,
	setTabTempSaveCheck,
	// 위험성 평가 양식
	setTemplateTab
} from '@store/module/criticalDisaster'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as yup from 'yup'

import { ComponentDiv, ComponentProgress, ComponentSign, ModalOpen } from './Component'
import { setTemplateId } from '../../../../../redux/module/criticalDisaster'
import axios from 'axios'
import { API_REPORT_APPROVAL_LIST } from '../../../../../constants'

export const FREQUENCY_3X3 = 0
export const FREQUENCY_5X5 = 1
export const STEP_3 = 2
export const CHECKLIST = 3

export const tabObjList = [
	{label: '실시 공고', value: 'notice'},
	{label: '사전 회의', value: 'meeting'},
	{label: '위험성평가', value: 'evaluation'},
	{label: '예방대책', value: 'counterplan'},
	{label: '안전 교육', value: 'education'},
	{label: '결과 보고서', value: 'report'}
]

export const tabList = ['notice', 'meeting', 'evaluation', 'counterplan', 'education', 'report']

export const NOTICE = 0 
export const MEETING = 1 
export const EVALUATION = 2
export const COUNTERPLAN = 3
export const EDUCATION = 4
export const REPORT = 5

export const defaultValues = {
	// 공통 ID
	disaster : {
		critical_disaster_form_id: '',
		type: '',
		progress: ''
	},

	// 실시공고 notice
	notice : {
		critical_disaster: '',
		type: false,
		progress: 0,
		title: '',
		start_datetime: '',
		end_datetime: '',
		location: '',
		content: ''
	},

	// 결과보고서 report
	report: {
		critical_disaster: '',
		type: false,
		progress: 0,
		title: '',
		start_datetime: '',
		end_datetime: '',
		man: '',
		content: '',
		description: ''
	},

	// 사전회의 meeting
	meeting: {
		meetingTitle: '',
		meetingTargetTotal: 0,
		meetingTargetMan: 0,
		meetingTargetWoman: 0,
		meetingParticipantTotal: 0,
		meetingParticipantMan: 0,
		meetingParticipantWoman: 0,
		meetingContent: '',
		meetingManager: '',
		meetingLocation: '',
		meetingDescription: ''
		// 회의록 key값 추가 필요
	},
	
	// 안전교육 education
	education: {
		educationTitle: '',
		educationTargetTotal: 0,
		educationTargetMan: 0,
		educationTargetWoman: 0,
	
		educationParticipantTotal: 0,
		educationParticipantMan: 0,
		educationParticipantWoman: 0,
		eduAbsenceContent: '',
	
		educationContent: '',
		educationManagerName: '',
		educationManagerLevel: '',
		educationLocation: '',
		educationDescription: ''
	},

	// 위험성평가 & 예방대책
	evaluation: {
		evaluationTitle: '',
		counterplanTitle: '',
		scene: '',
		target: '',
		date: moment().format('YYYY-MM-DD'),
		department: '',
	}
}

export const validationSchema = {
	test: yup.object().shape({
		evaluationTitle: yup.string().required('코드를 입력해주세요.')
		// counterplanTitle: yup.string().required('코드를 입력해주세요.')
	})
}

/** 등록 또는 수정에서 목록보기, 초기화 버튼 클릭시 SweetAlert */
export function handleResetNToListBTN(title, html, callback, type = 'warning') {
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		icon: type,
		title: title,
		html: html,
		showCancelButton: true,
		showConfirmButton: true,
		heightAuto: false,
		cancelButtonText: "취소",
		confirmButtonText: '확인',
		confirmButtonColor : primaryColor,
		reverseButtons :true,
		customClass: {
			actions: 'sweet-alert-custom right',
			cancelButton: 'me-1'
		}
	}).then((res) => {
		if (res.isConfirmed) {
			callback()
		}
	})
}

export const eduDefaultValues = {
	// 안전교육 education
	educationTitle: '',
	educationTargetTotal: 0,
	educationTargetMan: 0,
	educationTargetWoman: 0,

	educationParticipantTotal: 0,
	educationParticipantMan: 0,
	educationParticipantWoman: 0,
	eduAbsenceContent: '',

	educationContent: '',
	educationManagerName: '',
	educationManagerLevel: '',
	educationLocation: '',
	educationDescription: ''
}

// 안전 교육 데이터 계산
export const educationProcess = (setValue, getValues) => {
	const targetTotal = getCommaDel(getValues('educationTargetMan')) + getCommaDel(getValues('educationTargetWoman'))
	setValue('educationTargetTotal', resultCheckFunc(targetTotal))

	const participantTotal = getCommaDel(getValues('educationParticipantMan')) + getCommaDel(getValues('educationParticipantWoman'))
	setValue('educationParticipantTotal', resultCheckFunc(participantTotal))
}

// 직원 선택 테이블 데이터 없을시 출력 compoent
export const NoDataComponent = () => (
	<div className='card_table text center border-x border-b px-2 py-2 fs-4'>교육에 참석할 직원을 선택해주세요.</div>
)

export const evaluationTypeBadge = {
	[FREQUENCY_3X3]: <span className='basic-badge evaluation'>빈도•강도법(3x3)</span>,
	[FREQUENCY_5X5]: <span className='basic-badge evaluation'>빈도•강도법(5x5)</span>,
	[STEP_3]: <span className='basic-badge evaluation'>3단계 판단법</span>,
	[CHECKLIST]: <span className='basic-badge evaluation'>체크리스트</span>,
	true: <span className='basic-badge evaluation'>작성중</span>,
	false: <span className='basic-badge evaluation'>작성완료</span>
}

export const evaluationTypeLimit = {
	[FREQUENCY_3X3] : 3,
	[FREQUENCY_5X5] : 8,
	[STEP_3] : 2,
	[CHECKLIST] : 3
}

const isCompleteObj = {
	true:  <div style={{color:'green'}}>{'완료'}</div>,
	false: <div style={{color:'red'}}>{'미완료'}</div>
}
//row.modDate !== '' ? moment(row.modDate).format('YYYY-MM-DD') : ''
//row.date
export const evaluationListColumns = {
	webList: [
		{
			name:'등록일자',
			style:{cursor:'pointer', padding:'0px !important'},
			width:'150px',
			cell: row => <ComponentDiv title={dateFormat(row.create_datetime)} id={row.id}/>
		},
		{
			name:'제목',
			style: {justifyContent:'left', cursor:'pointer', padding:'0px !important', paddingLeft:'20px !important'},
			minWidth:'400px',
			cell: row => <ComponentDiv title={row.title} id={row.id} widthAlign='left'/>
		},
		{
			name:'완료여부',
			style:{cursor:'pointer', padding:'0px !important'},
			width:'100px',
			cell: row => <ComponentDiv title={isCompleteObj[`${row.type}`]} id={row.id}/>
		},
		{
			name:'진행도',
			style:{cursor:'pointer', padding:'0px !important'},
			width:'180px',
			cell: row => <ComponentProgress row={row}/>
		},
		{
			name:<div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}><div>결재</div><div>(사전회의)</div></div>,
			width: '110px',
			selector: row => <ComponentSign name='meeting' row={row}/>
		},
		{
			name:<div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}><div>결재</div><div>(안전교육)</div></div>,
			width: '110px',
			selector: row => <ComponentSign name='education' row={row}/>
		},
		{
			name:<div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}><div>작업자</div><div>서명</div></div>,
			width: '110px',
			selector: row => <ComponentSign name='evaluation' row={row}/>
		}
	],
	appList: [
		{
			name:'위험성 평가명',
			style: {justifyContent:'left', cursor:'pointer', padding:'0px !important', paddingLeft:'20px !important'},
			minWidth:'300px',
			cell: row => <ComponentDiv title={row.title} id={row.id} widthAlign='left'/>
		},
		{
			name:'나의 서명',
			minWidth: '110px',
			selector: row => <ModalOpen name='evaluation' row={row}/>
		},
		{
			name:'상태',
			style:{cursor:'pointer', padding:'0px !important'},
			width:'100px',
			cell: row => <ComponentDiv title={isCompleteObj[`${row.type}`]} id={row.id}/>
		},
		{
			name:'평가자',
			style:{cursor:'pointer', padding:'0px !important'},
			width:'100px',
			cell: row => <ComponentDiv title={row.admin} id={row.id}/>
		},
		{
			name:'등록일자',
			style:{cursor:'pointer', padding:'0px !important'},
			width:'150px',
			cell: row => <ComponentDiv title={moment(row.create_datetime).format('YYYY-MM-DD')} id={row.id}/>
		}
	]
}

export const customStyles = {
	headRow: {
		style: {
			// backgroundColor: 'red',
			height: '60px !important'
		}
	},
	headCells: {
		style: {
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3'
			},
			backgroundColor: primaryHeaderColor,
			border: '0.5px solid #B9B9C3',
			display: 'flex',
			justifyContent: 'center',
			fontSize: '14px',
			fontFamily: 'Pretendard-Regular'
		}
	},
	cells: {
		style: {
			// 첫번째 cell에만 좌측 테두리 출력
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3',
				justifyContent: 'center'
			},
			border: '0.5px solid #B9B9C3',
			borderTop: 'none', // 상단 테두리 제거
			borderLeft: 'none', // 좌측 테두리 제거
			display: 'flex',
			justifyContent: 'center',
			fontSize: '14px',
			fontWeight: '500',
			testAlign: 'center',
			'&:nth-child(5)': {
				paddingLeft: '7px !important',
				paddingRight: '7px !important'
			},
			'&:nth-child(6)': {
				paddingLeft: '7px !important',
				paddingRight: '7px !important'
			},
			'&:nth-child(7)': {
				paddingLeft: '7px !important',
				paddingRight: '7px !important'
			}
		}
	},
	rows: {
		style: {
			cursor: 'default', // 마우스 포인터를 원하는 형태로 변경합니다.
			minHeight: '35px'
		}
	}
}

export const signIndex = {
	manager: 0,
	manager2: 1
}

const LOWEST = 0	// 매우 낮음
const LOW = 1		// 낮음
export const NOMAL = 2	// 보통
const LOW_DANGER = 3 // 약간 높음
const DANGE = 4		// 위험 & 높음
const DANGEREST = 5	// 매우 높음

export const typeSelectList = {
	[FREQUENCY_3X3]: [
		{label:'선택', value:''},
		{label:3, value:3},
		{label:2, value:2},
		{label:1, value:1}
	],
	[FREQUENCY_5X5]: [
		{label:'선택', value:''},
		{label:5, value:5},
		{label:4, value:4},
		{label:3, value:3},
		{label:2, value:2},
		{label:1, value:1}
	],
	[STEP_3]: [
		{label:'선택', value:''},
		{label:'상', value:3},
		{label:'중', value:2},
		{label:'하', value:1}
	],
	[CHECKLIST]: [
		{label:'선택', value:''},
		{label:'보완', value:2},
		{label:'적정', value:1},
		{label:'해당없음', value:0}
	]
}

export const val2Label = (type, value) => {
	switch (type) {
		case FREQUENCY_3X3:
			if (value === LOW) return {label:'낮음', value:value}
			else if (value === NOMAL) return {label:'보통', value:value}
			else if (value === DANGE) return {label:'위험', value:value}
		case FREQUENCY_5X5:
			if (value === LOWEST) return {label:'매우낮음', value:value}
			else if (value === LOW) return {label:'낮음', value:value}
			else if (value === NOMAL) return {label:'보통', value:value}
			else if (value === LOW_DANGER) return {label:'약간높음', value:value}
			else if (value === DANGE) return {label:'높음', value:value}
			else if (value === DANGEREST) return {label:'매우높음', value:value}
		case STEP_3:
			if (value === 1) return {label:'하', value:value}
			else if (value === 2) return {label:'중', value:value}
			else if (value === 3) return {label:'상', value:value}
		case CHECKLIST:
			if (value === 0) return {label:'해당없음', value:value}
			else if (value === 1) return {label:'적정', value:value}
			else if (value === 2) return {label:'보완', value:value}
		default:
			return {label:'', value:''}
			break;
	}
}

export function getCaseMultiResult(type, first, second) {
	switch (type) {
		case FREQUENCY_3X3:
			if (!Number.isNaN(parseInt(first) * parseInt(second))) return parseInt(first) * parseInt(second)
			else return ''
		case FREQUENCY_5X5:
			if (!Number.isNaN(parseInt(first) * parseInt(second))) return parseInt(first) * parseInt(second)
			else return ''
		case STEP_3:
			if (!Number.isNaN(parseInt(first))) return first
			else return ''
		case CHECKLIST:
			if (!Number.isNaN(parseInt(first))) return first
			else return ''
		default:
			console.log('err')
	}
}

/** 가능성 * 중대성의 위험성 결과의 분류 */
export function getMultiResult(type, dangerousness) {
	switch (type) {
		case FREQUENCY_3X3:
			if (dangerousness <= 2) return LOW
			else if (dangerousness < 5) return NOMAL
			else if (dangerousness < 10) return DANGE
			else return 'Err'
			
		case FREQUENCY_5X5:
			if (dangerousness <= 3) return LOWEST //매우낮음 0
			else if (dangerousness < 7) return LOW // 낮음 1
			else if (dangerousness < 10) return NOMAL //보통 
			else if (dangerousness < 13) return LOW_DANGER // 약 높음
			else if (dangerousness < 17) return DANGE // 높음
			else if (dangerousness < 26) return DANGEREST // 매우 높음
			else return 'Err'
		case STEP_3:
			return dangerousness
		case CHECKLIST:
			return dangerousness
		default:
			return 'Err'
	}
}

/** 위험성 값 */
export function multResult(type, first, second) {
	switch(type) {
		case FREQUENCY_3X3:
			if (Number.isNaN(parseInt(first) * parseInt(second))) return false
			return getMultiResult(type, parseInt(first) * parseInt(second))
		case FREQUENCY_5X5:
			if (Number.isNaN(parseInt(first) * parseInt(second))) return false
			return getMultiResult(type, parseInt(first) * parseInt(second))
		case STEP_3:
			if (!Number.isNaN(parseInt(first))) return first
			else return false
		case CHECKLIST:
			if (!Number.isNaN(parseInt(first))) return first
			else return false
		default:
			console.log('err')
	}
}

/** 위험성 결과의 등급 리턴 */
export function getStrGrade(type, classification) {
	if (classification === LOWEST) return '(매우 낮음)'
	else if (classification === LOW) return '(낮음)'
	else if (classification === NOMAL) return '(보통)'
	else if (classification === LOW_DANGER) return '(약간 높음)'
	else if (classification === DANGE) {
		if (type === FREQUENCY_3X3) return '(위험)'
		else if (type === FREQUENCY_5X5) return '(높음)'
	} else if (classification === DANGEREST) return '(매우 높음)'
}

export function getStrGradeApp(type, classification) {
	if (classification >= NOMAL) return '(위험)'
	return '(낮음)'
}

export function criticalDisasterReset(dispatch) {
	dispatch(setEvaluationId(''))
	dispatch(setTemplateId(''))
	dispatch(setCdTotalTitle(''))
	dispatch(setPageType(''))
	dispatch(setTab('notice'))
	dispatch(setRegisterModalIsOpen(null))
	dispatch(setRegisterFormType({label:'', value:''}))
	dispatch(setModalName(''))
	dispatch(setModalIsOpen(null))
	dispatch(setRowData(null))
	dispatch(setTabTempSaveCheck(true))
	//실시공고
	dispatch(setNoticeId(''))
	//결과보고서
	dispatch(setReportId(''))
	//사전회의
	dispatch(setMeetingId(''))
	dispatch(setMeetingParticipantMan(0))
	dispatch(setMeetingParticipantWoman(0))
	//안전교육
	dispatch(setEducationId(''))
	dispatch(setEducationParticipantMan(0))
	dispatch(setEducationParticipantWoman(0))

	//위험성 평가 양식
	dispatch(setEvaluationEvaluatorId(''))
	dispatch(setEvaluationWorkerModalIsOpen(false))
	dispatch(setEvaluationWorkerList([]))
	dispatch(setEvaluationSelectWorker([]))
	dispatch(setEvaluationEvaluatorModalIsOpen(false))
	dispatch(setEvaluationEvaluatorList([]))
	dispatch(setEvaluationSelectEvaluator([]))
	dispatch(setEvaluationFormIsDone(false))
	//위험성 평가 양식
	dispatch(setTemplateTab('list'))
}


// login_user보다 앞에 결재가 진행되었는지 체크
export const preSignResult = (index, copyUserSign) => {
	if (index === 0) return
	const filterData = copyUserSign[index - 1]
	if (filterData.is_other_final !== true) {
		return {result: false, index: filterData.view_order }
	} else {
		return {result: true, index: filterData.view_order }
	}
}

/**
 * (sign 관련 func) 현재 유저가 결재 라인에 등록된 유저 일때 결재 버튼을 표시하는 로직
 * @param {*} activeUser 현재 접속 유저
 * @param {*} userList 결재라인 등록 유저리스트
 * @returns 전결이 없는 결재 라인
 */
export function isSignBtnDisplayCheck(activeUser, userList) {
	// 결재 권한이 있는 유저가 접속했을때만 실행됨.
	let signUser = undefined // 유저데이터
	const copySignList = [...userList]
	for (const userSignData of copySignList) {
		if (activeUser === userSignData.user) {
			signUser = userSignData
			break
		}
	}
	if (!signUser) return false // 결재 정보가 없다.
	return !signUser.is_other_final // 이전 결재가 결재 안했다면 미 출력
}

/**
 * 실시공고, 결과 보고서 
 * @param {*} picker picker range
 * @param {*} type date type
 * @returns pickerlist
 */
export const customPickerDateChange = (picker, type) => {
	const pickerlist = []
	if (type === true){
		pickerlist.push(moment(picker[0]).format('YYYY-MM-DD HH:mm'))
		pickerlist.push(moment(picker[1]).format('YYYY-MM-DD HH:mm'))
		return pickerlist
	}
	pickerlist.push(moment(picker[0]).format('YYYY-MM-DD'))
	pickerlist.push(moment(picker[1]).format('YYYY-MM-DD'))
	return pickerlist
}

export function handleEvaluationTempSave(formData, data, files, criticalDisaster, cookies) {
	// formData.append('property', cookies.get('property').value)
	formData.append('critical_disaster', criticalDisaster.evaluationId)
	formData.append('worker_list', JSON.stringify(criticalDisaster.evaluationSelectWorker))
    formData.append('form_type', criticalDisaster.registerFormType.value)
	// formData.append('admin_list', JSON.stringify(criticalDisaster.evaluationSelectEvaluator))

	formData.append('evaluation_title', data.evaluationTitle)
	formData.append('counterplan_title', data.counterplanTitle)
	formData.append('scene', data.scene)
	formData.append('target', data.target)
	formData.append('date', data.date)
	formData.append('department', data.department)
	formData.append('manager', data.manager)

	delete data['evaluationTitle']
	delete data['counterplanTitle']
	delete data['scene']
	delete data['target']
	delete data['date']
	delete data['department']

	// backendFormContents(data, formData)
	// Object.keys(files).map(key => {
	// 	const evaluationKey = key.includes('add') ? 'addImgEvaluation' : 'imgEvaluation'
	// 	const counterplanKey = key.includes('add') ? 'addImgCounterplan' : 'imgCounterplan'

	// 	if (files[key][evaluationKey].length === 0) formData.append(`${key}_evaluation`, [])
	// 	else files[key][evaluationKey].map(file => formData.append(`${key}_evaluation`, file instanceof File ? file : JSON.stringify(file)))
	
	// 	if (files[key][counterplanKey].length === 0) formData.append(`${key}_counterplan`, [])
	// 	else files[key][counterplanKey].map(file => formData.append(`${key}_counterplan`, file instanceof File ? file : JSON.stringify(file)))
	// })
}

export function handleAttendTarget(propertyId, setValueMan, setValueWoman, setValue) {
	axios.get(API_REPORT_APPROVAL_LIST, {params: {propertyId:propertyId, search:'', employeeClass:''}})
	.then(res => {
		let mCount = 0
        let fCount = 0
		const data = res.data
		data.filter(user => user.gender === 'male' && mCount++)
		data.filter(user => user.gender === 'female' && fCount++)
		setValue(setValueMan, mCount)
		setValue(setValueWoman, fCount)

	})
}