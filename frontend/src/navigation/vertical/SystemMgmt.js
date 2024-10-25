import { Circle, Settings } from "react-feather"
import { 
	ROUTE_INCONV, 
	ROUTE_SYSTEMMGMT_BASIC_COMPANY, 
	ROUTE_SYSTEMMGMT_BASIC_SPACE,
	ROUTE_SYSTEMMGMT_AUTH_USER,
	ROUTE_SYSTEMMGMT_AUTH_GROUP,
	ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS,
	ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL,
	ROUTE_SYSTEMMGMT_INCONV_LICENSE,
	ROUTE_SYSTEMMGMT_INCONV_NORMAL,
	ROUTE_STANDARD
} from "../../constants"
import { SYSTEM_MGMT, SYSTEM_AUTH_MGMT, SYSTEM_AUTH_GROUP, SYSTEM_AUTH_USER, SYSTEM_INFO_BASIC, SYSTEM_INFO_COMPANY, SYSTEM_INFO_SPACE, SYSTEM_INCONVENIENCE, SYSTEM_INCONVENIENCE_TYPE, SYSTEM_INCONVENIENCE_NORMAL, SYSTEM_INCONVENIENCE_EMPLOYEE_CLASS, SYSTEM_INCONVENIENCE_EMPLOYEE_LEVEL, SYSTEM_INCONVENIENCE_LICENSE } from "../../constants/CodeList"


export default [
	{
		id: "system-mgmt",
		title: "시스템관리",
		icon: <Settings size={20} />,
		code: SYSTEM_MGMT,
		appExpose:false,
		children: [
			{
				id: 'system-basic',
				title: '기본정보',
				icon: <Circle size={12} />,
				code: SYSTEM_INFO_BASIC,
				appExpose:false,
				children: [
					{
						id: 'system-basic-company',
						title: '회사정보관리',
						icon: <Circle size={12} />,
						code: SYSTEM_INFO_COMPANY,
						navLink: ROUTE_SYSTEMMGMT_BASIC_COMPANY,
						appExpose:false
					},
					{
						id: 'system-basic-space',
						title: '공간정보관리',
						icon: <Circle size={12} />,
						code: SYSTEM_INFO_SPACE,
						navLink: ROUTE_SYSTEMMGMT_BASIC_SPACE,
						appExpose:false
					}
				]
			},
			{
				id: 'system-inconvenience',
				title: '시설표준정보',
				icon: <Circle size={12} />,
				code: SYSTEM_INCONVENIENCE,
				appExpose:false,
				children: [
					{
						id: 'system-inconvenience-type',
						title: '유형별 분류',
						icon: <Circle size={12} />,
						code: SYSTEM_INCONVENIENCE_TYPE,
						navLink: ROUTE_INCONV
					},
					// {
					// 	id: 'system-inconvenience-normal',
					// 	title: '표준 자재',
					// 	icon: <Circle size={12} />,
					// 	code: SYSTEM_INCONVENIENCE_NORMAL,
					// 	navLink: ROUTE_SYSTEMMGMT_INCONV_NORMAL
					// },
					{
						id: 'system-inconvenience-employee-class',
						title: '직종 관리',
						icon: <Circle size={12} />,
						code: SYSTEM_INCONVENIENCE_EMPLOYEE_CLASS,
						navLink: ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS
					},
					{
						id: 'system-inconvenience-employee-level',
						title: '직급 관리',
						icon: <Circle size={12} />,
						code: SYSTEM_INCONVENIENCE_EMPLOYEE_LEVEL,
						navLink: ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL
					},
					{
						id: 'system-inconvenience-license',
						title: '자격증 정보',
						icon: <Circle size={12} />,
						code: SYSTEM_INCONVENIENCE_LICENSE,
						navLink: ROUTE_SYSTEMMGMT_INCONV_LICENSE
					}
				]
			},
			{
				id: 'basic3',
				title: '임대표준정보',
				code: 'test',
				icon: <Circle size={12} />,
				navLink: '',
				appExpose:false
			},
			{
				id: 'system-auth',
				title: '권한관리',
				icon: <Circle size={12} />,
				code: SYSTEM_AUTH_MGMT,
				appExpose:false,
				children: [
					{
						id: 'system-auth-user',
						title: '사용자권한관리',
						icon: <Circle size={12} />,
						code: SYSTEM_AUTH_USER,
						navLink: ROUTE_SYSTEMMGMT_AUTH_USER
					},
					{
						id: 'system-auth-group',
						title: '그룹권한관리',
						icon: <Circle size={12} />,
						code: SYSTEM_AUTH_GROUP,
						navLink: ROUTE_SYSTEMMGMT_AUTH_GROUP
					}
				]
			}
		]
	}
]
