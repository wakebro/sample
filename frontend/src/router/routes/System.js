import { lazy } from "react"
import {
	ROUTE_INCONV,
	ROUTE_SYSTEMMGMT_AUTH_GROUP,
	ROUTE_SYSTEMMGMT_AUTH_GROUP_DETAIL,
	ROUTE_SYSTEMMGMT_AUTH_GROUP_REGISTER,
	ROUTE_SYSTEMMGMT_AUTH_MENU,
	ROUTE_SYSTEMMGMT_AUTH_PROPERTY,
	ROUTE_SYSTEMMGMT_AUTH_USER,
	ROUTE_SYSTEMMGMT_BASIC_COMPANY, ROUTE_SYSTEMMGMT_BASIC_COMPANY_ADD, ROUTE_SYSTEMMGMT_BASIC_COMPANY_DETAIL,
	ROUTE_SYSTEMMGMT_BASIC_SPACE, ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD, ROUTE_SYSTEMMGMT_BASIC_SPACE_DETAIL,
	ROUTE_SYSTEMMGMT_INCONV_ADD, ROUTE_SYSTEMMGMT_INCONV_CAUSE_DETAIL,
	ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS,
	ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS_DETAIL,
	ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL,
	ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL_DETAIL,
	ROUTE_SYSTEMMGMT_INCONV_LICENSE,
	ROUTE_SYSTEMMGMT_INCONV_LICENSE_DETAIL,
	ROUTE_SYSTEMMGMT_INCONV_NORMAL,
	ROUTE_SYSTEMMGMT_INCONV_NORMAL_DETAIL,
	ROUTE_SYSTEMMGMT_INCONV_PROBLEM_DETAIL,
	ROUTE_SYSTEMMGMT_INCONV_REPAIR_DETAIL
} from "../../constants"


const SystemMgmInconvMgm = lazy(() => import('../../views/system/inconvenience/list/InconvenienceInfo'))
const SystemMgmtBasicCompanyList = lazy(() => import('../../views/system/basic/company/list'))
const SystemMgmtBasicCompanyAdd = lazy(() => import('../../views/system/basic/company/form'))
const SystemMgmtBasicSpaceList = lazy(() => import('../../views/system/basic/space/list'))
const SystemMgmtBasicSpaceAdd = lazy(() => import('../../views/system/basic/space/form'))
const SystemMgmtInconvAdd = lazy(() => import('../../views/system/inconvenience/add&modify/index'))

const SystemMgmtInconvCauseDetail = lazy(() => import('../../views/system/inconvenience/detail/CauseDetail'))
const SystemMgmtInconvRepairDetail = lazy(() => import('../../views/system/inconvenience/detail/RepairDetail'))
const SystemMgmtInconvProblemDetail = lazy(() => import('../../views/system/inconvenience/detail/ProblemDetail'))
const SystemMgmtInconvNormalDetail = lazy(() => import('../../views/system/inconvenience/detail/NormalDetail'))

const SystemMgmtInconvEmployeeClassDetail = lazy(() => import('../../views/system/inconvenience/detail/EmployeeClassDetail'))
const SystemMgmtInconvEmployeeLevelDetail = lazy(() => import('../../views/system/inconvenience/detail/EmployeeLevelDetail'))
const SystemMgmtInconvLicenseDetail = lazy(() => import('../../views/system/inconvenience/detail/LicenseDetail'))
const SystemMgmtAuthUser = lazy(() => import('../../views/system/auth/user'))
const SystemMgmtInconvNormalList = lazy(() => import('../../views/system/inconvenience/list/Normal'))
const SystemMgmtInconvEmployeeClassList = lazy(() => import('../../views/system/inconvenience/list/EmployeeClass'))
const SystemMgmtInconvEmployeeLevelList = lazy(() => import('../../views/system/inconvenience/list/EmployeeLevel'))
const SystemMgmtInconvLicenseList = lazy(() => import('../../views/system/inconvenience/list/License'))

const SystemMgmtAuthProperty = lazy(() => import('../../views/system/auth/property'))
const SystemMgmtAuthGroup = lazy(() => import('../../views/system/auth/group/list'))
const SystemMgmtAuthGroupRegister = lazy(() => import('../../views/system/auth/group/form'))
const SystemMgmtAuthMenu = lazy(() => import('../../views/system/auth/menu/form'))
// const SystemMgntStandard = lazy(() => import('../../views/system/standard/list/StandardInfo'))
// const SystemMgntStandardAdd = lazy(() => import('../../views/system/standard/add&modify/index'))
// const SystemMgntStandardFacilityDetail = lazy(() => import('../../views/system/standard/detail/FacilityDetail'))
// const SystemMgntStandardCostTypeDetail = lazy(() => import('../../views/system/standard/detail/CostTypeDetail'))
// const SystemMgntStandardCostCategoryDetail = lazy(() => import('../../views/system/standard/detail/CostCategoryDetail'))
// const SYstemMgmtAuthDetail = lazy(() => import('../../views/system/auth/commom'))

const SystemRoutes = [
	{
		path: ROUTE_SYSTEMMGMT_BASIC_COMPANY,
		element: <SystemMgmtBasicCompanyList />
	},
	{
		path: ROUTE_SYSTEMMGMT_BASIC_COMPANY_ADD,
		element: <SystemMgmtBasicCompanyAdd />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_BASIC_COMPANY_DETAIL}/:id`,
		element: <SystemMgmtBasicCompanyAdd />
	},
	{
		path: ROUTE_SYSTEMMGMT_BASIC_SPACE,
		element: <SystemMgmtBasicSpaceList />
	},
	{
		path: ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD,
		element: <SystemMgmtBasicSpaceAdd />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_BASIC_SPACE_DETAIL}/:id`,
		element: <SystemMgmtBasicSpaceAdd />
	},
	{
		path: ROUTE_SYSTEMMGMT_AUTH_USER,
		element: <SystemMgmtAuthUser />
	},
	{
		path: ROUTE_SYSTEMMGMT_AUTH_PROPERTY,
		element: <SystemMgmtAuthProperty />
	},
	{
		path: ROUTE_SYSTEMMGMT_AUTH_GROUP,
		element: <SystemMgmtAuthGroup />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_AUTH_GROUP_DETAIL}/:id`,
		element: <SystemMgmtAuthGroupRegister />
	},
	{
		path: ROUTE_SYSTEMMGMT_AUTH_GROUP_REGISTER,
		element: <SystemMgmtAuthGroupRegister />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_AUTH_MENU}/:id`,
		element: <SystemMgmtAuthMenu/>
	},
	{
		path: ROUTE_INCONV,
		element: <SystemMgmInconvMgm />
	},
	{
		// `${ROUTE_INCONV}/add`
		path: ROUTE_SYSTEMMGMT_INCONV_ADD,
		element: <SystemMgmtInconvAdd />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_INCONV_CAUSE_DETAIL}/:id`,
		element: <SystemMgmtInconvCauseDetail />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_INCONV_REPAIR_DETAIL}/:id`,
		element: <SystemMgmtInconvRepairDetail />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_INCONV_PROBLEM_DETAIL}/:id`,
		element: <SystemMgmtInconvProblemDetail />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_INCONV_NORMAL_DETAIL}/:id`,
		element: <SystemMgmtInconvNormalDetail />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS_DETAIL}/:id`,
		element: <SystemMgmtInconvEmployeeClassDetail />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL_DETAIL}/:id`,
		element: <SystemMgmtInconvEmployeeLevelDetail />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_INCONV_LICENSE_DETAIL}/:id`,
		element: <SystemMgmtInconvLicenseDetail />
	},
	{
		path: ROUTE_SYSTEMMGMT_INCONV_NORMAL,
		element: <SystemMgmtInconvNormalList />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_INCONV_NORMAL}/add`,
		element: <SystemMgmtInconvAdd />
	},
	{
		path: ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS,
		element: <SystemMgmtInconvEmployeeClassList />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS}/add`,
		element: <SystemMgmtInconvAdd />
	},
	{
		path: ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL,
		element: <SystemMgmtInconvEmployeeLevelList />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL}/add`,
		element: <SystemMgmtInconvAdd />
	},
	{
		path: ROUTE_SYSTEMMGMT_INCONV_LICENSE,
		element: <SystemMgmtInconvLicenseList />
	},
	{
		path: `${ROUTE_SYSTEMMGMT_INCONV_LICENSE}/add`,
		element: <SystemMgmtInconvAdd />
	}


	// {
	// 	path: ROUTE_STANDARD,
	// 	element: <SystemMgntStandard />
	// },
	// {
	// 	path: ROUTE_STANDARD_ADD,
	// 	element: <SystemMgntStandardAdd />
	// },
	// {
	// 	path: `${ROUTE_STANDARD_FACILITY_DETAIL}/:id`,
	// 	element: <SystemMgntStandardFacilityDetail />
	// },
	// {
	// 	path: `${ROUTE_STANDARD_COSTTYPE_DETAIL}/:id`,
	// 	element: <SystemMgntStandardCostTypeDetail />
	// },
	// {
	// 	path: `${ROUTE_STANDARD_COSTCATEGORY_DETAIL}/:id`,
	// 	element: <SystemMgntStandardCostCategoryDetail />
	// }
	// ,
	// {
	// 	path: ROUTE_SYSTEMMGMT_AUTH_USER,
	// 	element: <SystemMgmtAuthUser />
	// }
]

export default SystemRoutes