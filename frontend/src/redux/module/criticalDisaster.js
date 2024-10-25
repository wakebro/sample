import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	// 전체
	templateId: '',
	evaluationId: '',
	cdTotalTitle: '',
	pageType: '',
	tab: 'notice',
	registerModalIsOpen: null,
	registerFormType: {label:'선택', value:''},
	modalName: '',
	modalIsOpen: null,
	rowData: null,
	tabTempSaveCheck: true, // Tab에서 임시저장 했는지 체크
	cdEvaluationAdmin: '',

	// 실시공고 notice
	noticeId:'',

	// 결과보고서 report
	reportId: '',

	// 사전회의 meeting
	meetingId:'',
	meetingParticipantMan: 0,
	meetingParticipantWoman: 0,
	
	// 안전교육 education
	educationId: '',
	educationParticipantMan:0,
	educationParticipantWoman:0,

	// 위험성평가&예방대책 evaluation&counterplan
	evaluationEvaluatorId: '',
	evaluationWorkerModalIsOpen: false,
	evaluationWorkerList: [],
	evaluationSelectWorker: [],
	evaluationEvaluatorModalIsOpen: false,
	evaluationEvaluatorList: [],
	evaluationSelectEvaluator: [],
	evaluationFormIsDone: false,
	evaluationFormBody:[],

	//위험성 평가 양식
	templateTab: 'list',

	// app 전체 문항 조회
	appEvaluationList: false
}

const criticalDisaster = createSlice({
	name: 'criticalDisaster',
	initialState,
	reducers: {
		// 전체
		setTemplateId: (state, action) => ({
			...state,
			['templateId']: action.payload
		}),
		setEvaluationId: (state, action) => ({
			...state,
			['evaluationId']: action.payload
		}),
		setCdTotalTitle: (state, action) => ({
			...state,
			['cdTotalTitle']: action.payload
		}),
		setPageType: (state, action) => ({
			...state,
			['pageType']: action.payload
		}),
		setTab: (state, action) => ({
			...state,
			['tab']: action.payload
		}),
		setRegisterModalIsOpen: (state, action) => ({
			...state,
			['registerModalIsOpen']: action.payload
		}),
		setRegisterFormType: (state, action) => ({
			...state,
			['registerFormType']: action.payload
		}),
		setModalName: (state, action) => ({
			...state,
			['modalName']: action.payload
		}),
		setModalIsOpen: (state, action) => ({
			...state,
			['modalIsOpen']: action.payload
		}),
		setRowData: (state, action) => ({
			...state,
			['rowData']: action.payload
		}),
		setTabTempSaveCheck: (state, action) => ({
			...state,
			['tabTempSaveCheck']: action.payload
		}), // cdEvaluationAdmin
		setCdEvaluationAdmin: (state, action) => ({
			...state,
			['cdEvaluationAdmin']: action.payload
		}),
		
		// 실시공고
		setNoticeId: (state, action) => ({
			...state,
			['noticeId'] : action.payload
		}),

		// 결과보고서
		setReportId: (state, action) => ({
			...state,
			['reportId']: action.payload
		}),

		// 사전회의
		setMeetingParticipantMan: (state, action) => ({
			...state,
			['meetingParticipantMan']: action.payload
		}),
		setMeetingParticipantWoman: (state, action) => ({
			...state,
			['meetingParticipantWoman']: action.payload
		}),
		setMeetingId: (state, action) => ({
			...state,
			['meetingId']: action.payload
		}),

		// 안전교육
		setEducationId: (state, action) => ({
			...state,	
			['educationId']: action.payload
		}),
		setEducationParticipantMan: (state, action) => ({
			...state,
			['educationParticipantMan']: action.payload
		}),
		setEducationParticipantWoman: (state, action) => ({
			...state,
			['educationParticipantWoman']: action.payload
		}),

		// 위험성 평가 양식
		setEvaluationEvaluatorId : (state, action) => ({
			...state,
			['evaluationEvaluatorId']: action.payload
		}),
		setEvaluationWorkerModalIsOpen: (state, action) => ({
			...state,
			['evaluationWorkerModalIsOpen']: action.payload
		}),
		setEvaluationWorkerList: (state, action) => ({
			...state,
			['evaluationWorkerList']: action.payload
		}),
		setEvaluationSelectWorker: (state, action) => ({
			...state,
			['evaluationSelectWorker']: action.payload
		}),
		setEvaluationEvaluatorModalIsOpen: (state, action) => ({
			...state,
			['evaluationEvaluatorModalIsOpen']: action.payload
		}),
		setEvaluationEvaluatorList: (state, action) => ({
			...state,
			['evaluationEvaluatorList']: action.payload
		}),
		setEvaluationSelectEvaluator: (state, action) => ({
			...state,
			['evaluationSelectEvaluator']: action.payload
		}),
		setEvaluationFormIsDone: (state, action) => ({
			...state,
			['evaluationFormIsDone']: action.payload
		}),
		setEvaluationFormBody: (state, action) => ({
			...state,
			['evaluationFormBody']: action.payload
		}),
		// 위험성 평가 양식
		setTemplateTab: (state, action) => ({
			...state,
			['templateTab']: action.payload
		}),

		// 위험성 평가 양식
		setAppEvaluationList: (state, action) => ({
			...state,
			['appEvaluationList']: action.payload
		})
	}
})

export const { 
	// 전체
	setTemplateId,
	setEvaluationId,
	setCdTotalTitle,
	setPageType, 
	setTab,
	setRegisterModalIsOpen,
	setRegisterFormType,
	setModalName,
	setModalIsOpen,
	setRowData,
	setTabTempSaveCheck,
	setCdEvaluationAdmin,

	// 실시공고
	setNoticeId,
	setNoticeTitle,
	setNoticeRange,
	setNoticeLocation,
	setNoticeContent,

	// 결과보고서
	setReportId,
	setReportTitle,
	setReportRange,
	setReportLocation,
	setReportContent,
	setReportDescription,

	// 사전회의
	setMeetingId,
	setMeetingParticipantMan,
	setMeetingParticipantWoman,
	// setMeetingWriteCount,

	// 안전교육
	setEducationId,
	setEducationParticipantMan,
	setEducationParticipantWoman,

	// 위험성 평가 양식
	setEvaluationEvaluatorId,
	setEvaluationWorkerModalIsOpen,
	setEvaluationWorkerList,
	setEvaluationSelectWorker,
	setEvaluationEvaluatorModalIsOpen,
	setEvaluationEvaluatorList,
	setEvaluationSelectEvaluator,
	setEvaluationFormIsDone,
	setEvaluationFormBody,

	// 위험성 평가 양식
	setTemplateTab,

	// app 전체항목리스트
	setAppEvaluationList
} = criticalDisaster.actions
export default criticalDisaster.reducer