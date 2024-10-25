import { lazy } from "react"
import { 
	ROUTE_INSPECTION_INSPECTION,
	ROUTE_INSPECTION_INSPECTION_LIST,
	ROUTE_INSPECTION_INSPECTION_DETAIL,
	ROUTE_INSPECTION_INSPECTION_FORM,
	ROUTE_INSPECTION_INSPECTION_FORM_LIST,
	ROUTE_INSPECTION_INSPECTION_PREVIEW,
	ROUTE_MANUAL,
	ROUTE_MANUAL_REGISTER,
	ROUTE_MANUAL_DETAIL,
	ROUTE_MANUAL_FIX,
	ROUTE_INSPECTION_PERFORMANCE,
	ROUTE_INSPECTION_COMPLAIN,
	ROUTE_INSPECTION_COMPLAIN_REGISTER,
	ROUTE_INSPECTION_COMPLAIN_DETAIL,
	ROUTE_INSPECTION_COMPLAIN_FIX,
	ROUTE_INSPECTION_DEFECT,
	ROUTE_INSPECTION_DEFECT_REGISTER,
	ROUTE_INSPECTION_DEFECT_DETAIL,
	ROUTE_INSPECTION_DEFECT_FIX,
	ROUTE_INSPECTION_INSPECTION_DETAIL_EXPORT,
	ROUTE_INSPECTION_INSPECTION_EXPORT,
	ROUTE_INSPECTION_INSPECTION_LIST_EXPORT,
	ROUTE_INSPECTION_OUTSOURCING_DETAIL,
	ROUTE_INSPECTION_OUTSOURCING,
	ROUTE_INSPECTION_OUTSOURCING_REGISTER,
	ROUTE_INSPECTION_OUTSOURCING_DETAIL_EXPORT,
	ROUTE_INSPECTION_MAIN,
	ROUTE_INSPECTION_REG,
	ROUTE_INSPECTION_COMPLAIN_REGISTER_TAB
} from "../../constants"

const Inspection = lazy(() => import('../../views/inspection/inspection/index'))
const InspectionMain = lazy(() => import('../../views/inspection/main'))
const InspectionList = lazy(() => import('../../views/inspection/inspection/InspectionList'))
const InspectionManageList = lazy(() => import('../../views/inspection/inspection/register/InspectionManageList'))
const InspectDetail = lazy(() => import('../../views/inspection/inspection/InspectDetail'))
const InspectDetailPreview = lazy(() => import('../../views/inspection/inspection/InspectDetailPreview'))
const InspectFormList = lazy(() => import('../../views/inspection/inspection/InspectFormList'))
const InspectForm = lazy(() => import('../../views/inspection/inspection/InspectForm'))
const InspectExport = lazy(() => import('../../views/inspection/inspection/InspectExport'))
const InspectionListExport = lazy(() => import('../../views/inspection/inspection/InspectionListExport'))
const InspectDetailExport = lazy(() => import('../../views/inspection/inspection/InspectDetailExport'))
const InspectionPerformance = lazy(() => import('../../views/inspection/inspection/Performance'))
const Manual = lazy(() => import("../../views/inspection/manual"))
const ManualRegister = lazy(() => import("../../views/inspection/manual/register"))
const ManualDetail =  lazy(() => import("../../views/inspection/manual/detail"))
const ManualFix = lazy(() => import("../../views/inspection/manual/fix"))
const Complain = lazy(() => import("../../views/inspection/complain"))
const ComplainStatusRegister = lazy(() => import("../../views/inspection/complain/register"))
const ComplainRegister = lazy(() => import("../../views/inspection/complain/register"))
const ComplainDetail = lazy(() => import("../../views/inspection/complain/detail"))
const ComplainFix = lazy(() => import("../../views/inspection/complain/fix"))
const Defect = lazy(() => import("../../views/inspection/defect"))
const DefectRegister = lazy(() => import("../../views/inspection/defect/register"))
const DefectDetail = lazy(() => import("../../views/inspection/defect/detail"))
const DefectFix = lazy(() => import("../../views/inspection/defect/fix"))
const OutSourcing = lazy(() => import("../../views/inspection/outsourcing"))
const OutSourcingRegister = lazy(() => import("../../views/inspection/outsourcing/register"))
const OutSourcingDetail = lazy(() => import("../../views/inspection/outsourcing/detail"))
const OutsourcingExport = lazy(() => import('../../views/inspection/outsourcing/detail/export'))

const InspectionRoutes = [
	{
		path: ROUTE_INSPECTION_INSPECTION,
		element: <Inspection />
	},	
	{
		path: ROUTE_INSPECTION_MAIN,
		element: <InspectionMain/>
	},
	{
		path: `${ROUTE_INSPECTION_INSPECTION_LIST}/:type`,
		element: <InspectionList />
	},
	{ // 일지관리
		path: `${ROUTE_INSPECTION_REG}/:type`,
		element: <InspectionManageList/>
	},
	{ // 일지관리등록
		path: `${ROUTE_INSPECTION_REG}/:type/:id`,
		element: <InspectDetail/>
	},
	{
		path: `${ROUTE_INSPECTION_INSPECTION_DETAIL}/:id`,
		element: <InspectDetail />
	},
	{
		path: ROUTE_INSPECTION_INSPECTION_FORM_LIST,
		element: <InspectFormList />
	},
	{
		path: ROUTE_INSPECTION_INSPECTION_FORM,
		element: <InspectForm />
	},
	{
		path: `${ROUTE_INSPECTION_INSPECTION_FORM}/:formId`,
		element: <InspectForm />
	},
	{

		path: `${ROUTE_INSPECTION_INSPECTION_PREVIEW}`,
		element: <InspectDetailPreview />
	},
	{

		path: `${ROUTE_INSPECTION_PERFORMANCE}`,
		element: <InspectionPerformance />
	},
	{
		path: ROUTE_MANUAL,
		element: <Manual/>
	},
	{
		path: ROUTE_MANUAL_REGISTER,
		element: <ManualRegister/>

	},
	{
		path: `${ROUTE_MANUAL_DETAIL}/:id`,
		element: <ManualDetail/>

	},
	{
		path: `${ROUTE_MANUAL_FIX}/:id`,
		element: <ManualFix/>
	},
	{
		path: ROUTE_INSPECTION_COMPLAIN,
		element: <Complain/>
	},
	{
		path: ROUTE_INSPECTION_COMPLAIN_REGISTER,
		element: <ComplainStatusRegister/>

	},
	{
		path: ROUTE_INSPECTION_COMPLAIN_REGISTER_TAB,
		element: <ComplainRegister/>

	},
	{
		path: `${ROUTE_INSPECTION_COMPLAIN_DETAIL}/:id`,
		element: <ComplainDetail/>
	},
	{
		path: `${ROUTE_INSPECTION_COMPLAIN_FIX}/:id`,
		element: <ComplainFix/>
	},
	{
		path: ROUTE_INSPECTION_DEFECT,
		element: <Defect/>
	},
	{
		path: ROUTE_INSPECTION_DEFECT_REGISTER,
		element: <DefectRegister/>
	},
	{
		path: `${ROUTE_INSPECTION_DEFECT_DETAIL}/:id`,
		element: <DefectDetail/>
	},
	{
		path: `${ROUTE_INSPECTION_DEFECT_FIX}/:id`,
		element: <DefectFix/>
	},
	{
		path: ROUTE_INSPECTION_OUTSOURCING,
		element: <OutSourcing/>
	},
	{
		path: ROUTE_INSPECTION_OUTSOURCING_REGISTER,
		element: <OutSourcingRegister/>
	},
	{
		path: `${ROUTE_INSPECTION_OUTSOURCING_DETAIL}/:id`,
		element: <OutSourcingDetail/>
	},
	{
		path: `${ROUTE_INSPECTION_INSPECTION_DETAIL_EXPORT}/:id`,
		element: <InspectDetailExport />,
		meta: {
			layout: "blank"
		}
	},
	{
		path: ROUTE_INSPECTION_INSPECTION_EXPORT,
		element: <InspectExport />,
		meta: {
			layout: 'blank'
		}
	},
	{
		path: ROUTE_INSPECTION_INSPECTION_LIST_EXPORT,
		element: <InspectionListExport />,
		meta: {
			layout: 'blank'
		}
	},
	{
		path: `${ROUTE_INSPECTION_OUTSOURCING_DETAIL_EXPORT}/:id`,
		element: <OutsourcingExport />,
		meta: {
			layout: 'blank'
		}
	}
]

export default InspectionRoutes