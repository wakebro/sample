import { lazy } from "react"
import { ROUTE_FACILITYMGMT_ALARM, ROUTE_FACILITYMGMT_GUARD, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_FORM, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_INCOMING_FORM, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_OUTGOING_FORM, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_PERFORMANCE, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_STOCK_LOG, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_STOCK_LOG_EXPORT, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_STOCK_LOG_TOTAL, ROUTE_FACILITYMGMT_MATERIAL_REQUEST_DETAIL, ROUTE_FACILITYMGMT_MATERIAL_REQUEST_LIST, ROUTE_FACILITYMGMT_MATERIAL_REQUEST_MODIFY, ROUTE_FACILITYMGMT_MATERIAL_REQUEST_REGISTER, ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_DETAIL, ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_FORM, ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_LIST } from "../../constants"

const OutsourcingContractList = lazy(() => import('../../views/facility/contract/OutsourcingContractList'))
const OutsourcingContractDetail = lazy(() => import('../../views/facility/contract/OutsourcingContractDetail'))
const OutsourcingContractForm = lazy(() => import('../../views/facility/contract/OutsourcingContractForm'))
const MaterialInfoList = lazy(() => import('../../views/facility/material/info/MaterialInfoList'))
const MaterialInfoDetail = lazy(() => import('../../views/facility/material/info/MaterialInfoDetail'))
const MaterialInfoForm = lazy(() => import('../../views/facility/material/info/MaterialInfoForm'))
const IncomingForm = lazy(() => import('../../views/facility/material/info/IncomingForm'))
const OutgoingForm = lazy(() => import('../../views/facility/material/info/OutgoingForm'))
const RequestList = lazy(() => import('../../views/facility/material/request/RequestList'))
const RequestDetail = lazy(() => import('../../views/facility/material/request/RequestDetail'))
const RequestRegister = lazy(() => import('../../views/facility/material/request/RequestRegister'))
const RequestModify = lazy(() => import('../../views/facility/material/request/RequestModify'))
const StockLog = lazy(() => import('../../views/facility/material/info/StockLog'))
const StockLogExport = lazy(() => import('../../views/facility/material/info/StockLogExport'))
const Performance = lazy(() => import('../../views/facility/material/info/Performance'))
const StockLogTotal = lazy(() => import('../../views/facility/material/info/StockLogTotal'))
const NFC = lazy(() => import('@views/facility/guard/nfc'))
const WorkStatus = lazy(() => import('@views/facility/guard/work'))
const Scanning = lazy(() => import('@views/facility/guard/scan/Scanning'))
const ScanList = lazy(() => import('@views/facility/guard/scan/List'))
const Scan = lazy(() => import('@views/facility/guard/scan/Scan'))
const Asset = lazy(() => import('@views/facility/alarm/camera'))
const CameraHistory = lazy(() => import('@views/facility/alarm/history'))

const FacilityRoutes = [
	{
		path: ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_LIST,
		element: <OutsourcingContractList />
	},
	{
		path: `${ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_DETAIL}/:id`,
		element: <OutsourcingContractDetail />
	},
	{
		path: ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_FORM,
		element: <OutsourcingContractForm />
	},
	{
		path: ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST,
		element: <MaterialInfoList />
	},
	{
		path: `${ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL}/:id`,
		element: <MaterialInfoDetail />
	},
	{
		path: ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_FORM,
		element: <MaterialInfoForm />
	},
	{
		path: ROUTE_FACILITYMGMT_MATERIAL_REQUEST_LIST,
		element: <RequestList />
	},
	{
		path: `${ROUTE_FACILITYMGMT_MATERIAL_REQUEST_DETAIL}/:id`,
		element: <RequestDetail />
	},
	{
		path: ROUTE_FACILITYMGMT_MATERIAL_REQUEST_REGISTER,
		element: <RequestRegister />
	},
	{
		path: `${ROUTE_FACILITYMGMT_MATERIAL_REQUEST_MODIFY}/:id`,
		element: <RequestModify />
	},
	{
		path: ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_INCOMING_FORM,
		element: <IncomingForm />
	},
	{
		path: ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_OUTGOING_FORM,
		element: <OutgoingForm />
	},
	{
		path: ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_STOCK_LOG,
		element: <StockLog />
	},
	{
		path: ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_STOCK_LOG_EXPORT,
		element: <StockLogExport />,
		meta: {
			layout: 'blank'
		}
	},
	{
		path: ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_PERFORMANCE,
		element: <Performance />
	},
	{
		path: ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_STOCK_LOG_TOTAL,
		element: <StockLogTotal />
	},
	{
		path: `${ROUTE_FACILITYMGMT_GUARD}/nfc-manage`,
		element: <NFC/>
	},
	{
		path: `${ROUTE_FACILITYMGMT_GUARD}/work-status`,
		element: <WorkStatus/>
	},
	{
		path: `${ROUTE_FACILITYMGMT_GUARD}/scanning`,
		element: <Scanning/>
	},
	{
		path: `${ROUTE_FACILITYMGMT_GUARD}/scan-list`,
		element: <ScanList/>
	},
	{
		path: `${ROUTE_FACILITYMGMT_GUARD}/scan-list/:rowId`,
		element: <Scan/>
	},
	{
		path: `${ROUTE_FACILITYMGMT_ALARM}/:asset`,
		element: <Asset/>
	},
	{
		path: `${ROUTE_FACILITYMGMT_ALARM}/history/:asset`,
		element: <CameraHistory/>
	}
]

export default FacilityRoutes