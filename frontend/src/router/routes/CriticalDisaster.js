import { lazy } from "react"
import { 
	ROUTE_CRITICAL_DISASTER_EVALUATION
	, ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM_LIST
	, ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM
	, ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_PREVIEW
	, ROUTE_CRITICAL_DISASTER_DIRECTORY
	, ROUTE_CRITICAL_DISASTER_LIST
	, ROUTE_CRITICAL_DISASTER_DETAIL
	, ROUTE_CRITICAL_CORPERATION_EVALUATION_LIST
	, ROUTE_CRITICAL_CORPERATION_EVALUATION_FORM
	, ROUTE_CRITICAL_CORPERATION_EVALUATION_DETAIL
	, ROUTE_CRITICAL_CORPERATION_EVALUATION_EXPORT
	, ROUTE_CRITICAL_DISASTER_WORKER_QNA
	, ROUTE_CRITICAL_DISASTER_INSPECTION_REG
	, ROUTE_CRITICAL_DISASTER_REPORT_EXPORT
	, ROUTE_CRITICAL_DISASTER_REPORT_LIST_EXPORT
} from "../../constants"

// 위험성평가 목록
const EvaluationListIndex = lazy(() => import('@views/disaster/riskReport/evaluationReport/web/list'))
// const EvaluationListIndex = window.navigator.userAgent.includes('work_app') 
//     ? lazy(() => import('@views/disaster/riskReport/evaluationReport/app/list'))
//     : lazy(() => import('@views/disaster/riskReport/evaluationReport/web/list'))
const EvaluationForm = lazy(() => import('@views/disaster/riskReport/evaluationReport/web/list/Evaluation'))
const EvaluationDetail = lazy(() => import('@views/disaster/riskReport/evaluationReport/web/list/Evaluation'))
const EvaluationTemplate = lazy(() => import('@views/disaster/riskReport/evaluationTemplate'))
const EvaluationTemplateForm = lazy(() => import('@views/disaster/riskReport/evaluationTemplate/form/EvaluationTemplateForm'))
const EvaluationTemplateDetail = lazy(() => import('@views/disaster/riskReport/evaluationTemplate/detail/EvaluationTemplateDetail'))
const SafetyInspectionFormList = lazy(() => import('@views/inspection/inspection/InspectFormList'))
const SafetyInspectionForm = lazy(() => import('@views/inspection/inspection/InspectForm'))
const SafetyInspectioniFormPreview = lazy(() => import('@views/inspection/inspection/InspectDetailPreview'))
const SafetyInspectionCategory = lazy(() => import('@views/inspection/inspection/index'))
const SafetyInspectionList = lazy(() => import('@views/inspection/inspection/InspectionList'))
const SafetyInspectionDetail = lazy(() => import('@views/inspection/inspection/InspectDetail'))
const WorkerQnaList = lazy(() => import('@views/disaster/workerQna/WorkerQnaList'))
const WorkerQnaForm = lazy(() => import('@views/disaster/workerQna/form/WorkerQnaForm'))
const WorkerQnaDetail = lazy(() => import('@views/disaster/workerQna/detail/WorkerQnaDetail'))
const CriticalCorperationEvaluationList = lazy(() => import('@views/disaster/corperationEvaluation/list/index'))
const CriticalCorperationEvaluationForm = lazy(() => import('@views/disaster/corperationEvaluation/form/index'))
const CriticalCorperationEvaluationDetail = lazy(() => import('@views/disaster/corperationEvaluation/form/index'))
const CriticalCorperationEvaluationExport = lazy(() => import('@views/Report/manage/export/DisasterEvaluation'))
const SafetyInspectionManageList = lazy(() => import('../../views/inspection/inspection/register/InspectionManageList'))
const CriticalReportSigleExport = lazy(() => import('../../views/disaster/riskReport/evaluationReport/web/list/ExportReport'))
const CriticalReportListExport = lazy(() => import('../../views/disaster/riskReport/evaluationReport/web/list/ExportReportList'))

const CriticalDisasterRoutes = [
	{
		path: `${ROUTE_CRITICAL_DISASTER_EVALUATION}/list`,
		element: <EvaluationListIndex/>
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_EVALUATION}/list/register`,
		element: <EvaluationForm/>
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_EVALUATION}/list/:id`,
		element: <EvaluationDetail/>
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_EVALUATION}/template`,
		element: <EvaluationTemplate/>
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_EVALUATION}/template/:id`,
		element: <EvaluationTemplateDetail/>
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_EVALUATION}/template/register`,
		element: <EvaluationTemplateForm/>
	},
	// 일일안전점검
	{
		path: `${ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM_LIST}/:type`,
		element: <SafetyInspectionFormList /> //양식리스트
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_DIRECTORY}/:type`,
		element: <SafetyInspectionCategory /> // 실적 리스트
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_LIST}/:type`,
		element: <SafetyInspectionList />
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_DETAIL}/:id`,
		element: <SafetyInspectionDetail />
	},
	{ // 일지관리
		path: `${ROUTE_CRITICAL_DISASTER_INSPECTION_REG}/:type`,
		element: <SafetyInspectionManageList />
	},
	{ // 일지관리등록
		path: `${ROUTE_CRITICAL_DISASTER_INSPECTION_REG}/:type/:id`,
		element: <SafetyInspectionDetail />
	},
	{
		path: ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM,
		element: <SafetyInspectionForm />
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM}/:formId`,
		element: <SafetyInspectionForm />
	},
	{
		path: ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_PREVIEW,
		element: <SafetyInspectioniFormPreview />
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_WORKER_QNA}`,
		element: <WorkerQnaList/>
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_WORKER_QNA}/form`,
		element: <WorkerQnaForm/>
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_WORKER_QNA}/detail/:id`,
		element: <WorkerQnaDetail/>
	},
	{
		path: ROUTE_CRITICAL_CORPERATION_EVALUATION_LIST,
		element: <CriticalCorperationEvaluationList />
	},
	{
		path: ROUTE_CRITICAL_CORPERATION_EVALUATION_FORM,
		element: <CriticalCorperationEvaluationForm />
	},
	{
		path: `${ROUTE_CRITICAL_CORPERATION_EVALUATION_DETAIL}/:id`,
		element: <CriticalCorperationEvaluationDetail />
	},
	{
		path: ROUTE_CRITICAL_CORPERATION_EVALUATION_EXPORT,
		element: <CriticalCorperationEvaluationExport />,
		meta: {
			layout: 'blank'
		}
	},
	{
		path: `${ROUTE_CRITICAL_DISASTER_REPORT_EXPORT}/:id`,
		element: <CriticalReportSigleExport />,
		meta: {
			layout: 'blank'
		}
	},
	{
		path: ROUTE_CRITICAL_DISASTER_REPORT_LIST_EXPORT,
		element: <CriticalReportListExport />,
		meta: {
			layout: 'blank'
		}
	}
]

export default CriticalDisasterRoutes