import { lazy } from "react"
import { 
	ROUTE_REPORT_ACCIDENT_FORM,
	ROUTE_REPORT_FORM,
	ROUTE_REPORT_TOTAL,
	ROUTE_REPORT_DETAIL,
	ROUTE_REPORT_ACCIDENT_DETAIL,
	ROUTE_REPORT_OPERATE_EXPORT,
	ROUTE_REPORT_MANAGE,
	ROUTE_REPORT_MANAGE_INSPECTION_DETAIL_PDF,
	ROUTE_REPORT_MANAGE_OUTSOURCING_DETAIL_PDF,
	ROUTE_REPORT_MANAGE_DISASTER_DETAIL_PDF,
	ROUTE_REPORT_MANAGE_DISASTER_REPORT_PDF,
	ROUTE_REPORT_EXPORT_DETAIL
} from "../../constants"

const ReportTotalList = lazy(() => import('../../views/Report/list/ReportTotal'))
const ReportForm = lazy(() => import('../../views/Report/form/ReportForm'))
const ReportAccidentForm = lazy(() => import('../../views/Report/form/ReportAccidentForm'))
const ReportDetail = lazy(() => import('../../views/Report/detail/ReportDetail'))
const ReportAccidentDetail = lazy(() => import('../../views/Report/detail/ReportAccidentDetail'))
const Report = lazy(() => import('../../views/Report/manage/export/Report'))
const ReportDetailExportPdf = lazy(() => import('../../views/Report/Export/ReportExport'))
const ReportManage = lazy(() => import('../../views/Report/manage/index'))
const Inspection = lazy(() => import('../../views/Report/manage/export/Inspection'))
const Outsourcing = lazy(() => import('../../views/Report/manage/export/Outsourcing'))
const DisasterDetail = lazy(() => import('../../views/Report/manage/export/DisasterSafety'))
const DisasterReportPdf = lazy(() => import('../../views/Report/manage/export/DisasterReport'))

const ReportRoutes = [
    {
		path: ROUTE_REPORT_TOTAL,
		element: <ReportTotalList />
	},
	{
		path: ROUTE_REPORT_FORM,
		element: <ReportForm />
	},
	{
		path: ROUTE_REPORT_ACCIDENT_FORM,
		element: <ReportAccidentForm />
	},
	{
		path:`${ROUTE_REPORT_DETAIL}/:id`,
		element: <ReportDetail />
	},
	{
		path: `${ROUTE_REPORT_ACCIDENT_DETAIL}/:id`,
		element: <ReportAccidentDetail />
	},
	{
		path: ROUTE_REPORT_OPERATE_EXPORT,
		element: <Report />,
		meta: {
			layout: 'blank'
		}
	},
	{
		path: ROUTE_REPORT_EXPORT_DETAIL,
		element: <ReportDetailExportPdf />,
		meta: {
			layout: 'blank'
		}
	},
	{
		path: ROUTE_REPORT_MANAGE,
		element: <ReportManage />
	},
	{
		path: ROUTE_REPORT_MANAGE_INSPECTION_DETAIL_PDF,
		element: <Inspection />,
		meta: {
			layout: 'blank'
		}
	},
	{
		path: ROUTE_REPORT_MANAGE_OUTSOURCING_DETAIL_PDF,
		element: <Outsourcing />,
		meta: {
			layout: 'blank'
		}
	},
	{
		path: ROUTE_REPORT_MANAGE_DISASTER_DETAIL_PDF,
		element: <DisasterDetail />,
		meta: {
			layout: 'blank'
		}
	},
	{
		path: ROUTE_REPORT_MANAGE_DISASTER_REPORT_PDF,
		element: <DisasterReportPdf />,
		meta: {
			layout:'blank'
		}
	}
]
export default ReportRoutes