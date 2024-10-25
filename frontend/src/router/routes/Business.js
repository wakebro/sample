import { lazy } from "react"
import {
	ROUTE_BUSINESS_COST,
	ROUTE_BUSINESS_EVALUATION,
	ROUTE_BUSINESS_REQUISITION,
	ROUTE_BUSINESS_REQUISITION_DETAIL,
	ROUTE_BUSINESS_REQUISITION_FIX
} from "../../constants"

// 장기수선충당금, 유지보수
const Cost = lazy(() => import('@views/business/cost'))
//품의서
const ApprovalLetter = lazy(() => import('@views/business/approval'))
const ApprovalLetterRegister = lazy(() => import('@views/business/approval/register'))
const ApprovalLetterDetail = lazy(() => import('@views/business/approval/detail'))
// 평가항목관리
const EvaluationItems = lazy(() => import('@views/business/evaluation/itemsMgmt'))
const EvaluationItemsForm = lazy(() => import('@views/business/evaluation/itemsMgmt/ItemsMgmt'))


const BusinessRoutes = [
	{
		path: `${ROUTE_BUSINESS_COST}/:costType`,
		element: <Cost/>
	},
	{
		path: `${ROUTE_BUSINESS_REQUISITION}/btl`,
		element: <ApprovalLetter/>
	},
	{
		path: `${ROUTE_BUSINESS_REQUISITION}/ouriduri`,
		element: <ApprovalLetter/>
	},
	{
		path: `${ROUTE_BUSINESS_REQUISITION}/btl/register`,
		element: <ApprovalLetterRegister/>
	},
	{
		path: `${ROUTE_BUSINESS_REQUISITION}/ouriduri/register`,
		element: <ApprovalLetterRegister/>
	},
	{
		path: `${ROUTE_BUSINESS_REQUISITION}/btl/detail/:id`,
		element: <ApprovalLetterDetail/>
	},
	{
		path: `${ROUTE_BUSINESS_REQUISITION}/btl/fix/:id`,
		element: <ApprovalLetterRegister/>
	},
	{
		path: `${ROUTE_BUSINESS_REQUISITION}/ouriduri/detail/:id`,
		element: <ApprovalLetterDetail/>
	},
	{
		path: `${ROUTE_BUSINESS_REQUISITION}/ouriduri/fix/:id`,
		element: <ApprovalLetterRegister/>
	},
	{
		path: `${ROUTE_BUSINESS_EVALUATION}/items-mgmt`,
		element: <EvaluationItems/>
	},
	{
		path: `${ROUTE_BUSINESS_EVALUATION}/items-mgmt/register`,
		element: <EvaluationItemsForm/>
	}
]

export default BusinessRoutes