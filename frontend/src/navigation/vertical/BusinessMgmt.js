import { Briefcase, Circle } from "react-feather"
import {
	ROUTE_BUSINESS_COST,
	ROUTE_BUSINESS_REQUISITION
} from '../../constants'
import { BUSINESS_MAINTENANCE, BUSINESS_MGMT, BUSINESS_PLAN, BUSINESS_REQUISITION, BUSINESS_REQUISITION_BTL, BUSINESS_REQUISITION_OURIDURI } from "../../constants/CodeList"

export default [
	{
		id: "business-mgmt",
		title: "사업관리",
		icon: <Briefcase size={20} />,
		appExpose:false,
		code: BUSINESS_MGMT,
		children: [
			{
				id: "business-mgmt-requisition",
				title: "품의서",
				icon: <Circle size={20} />,
				code: BUSINESS_REQUISITION,
				children:[
					{
						id: 'business-mgmt-requisition-btl',
						title: 'BTL 사업소',
						icon: <Circle size={12} />,
						code: BUSINESS_REQUISITION_BTL,
						navLink: `${ROUTE_BUSINESS_REQUISITION}/btl`
					},
					{
						id: 'business-mgmt-requisition-ouriduri',
						title: '우리두리 사업소',
						icon: <Circle size={12} />,
						code: BUSINESS_REQUISITION_OURIDURI,
						navLink: `${ROUTE_BUSINESS_REQUISITION}/ouriduri`
					}
				]
			},
			{
				id: 'business-mgmt-maintenance',
				title: '유지보수(일상수선)',
				icon: <Circle size={12} />,
				code: BUSINESS_MAINTENANCE,
				navLink: `${ROUTE_BUSINESS_COST}/maintenance`
			},
			{
				id: 'business-mgmt-appropriation',
				title: '장기수선충당금',
				icon: <Circle size={12} />,
				code: BUSINESS_PLAN,
				navLink: `${ROUTE_BUSINESS_COST}/plan`
			}
			// {
			// 	id: "evaluation",
			// 	title: "성과평가",
			// 	icon: <Circle size={20} />,
			// 	// code: ,
			// 	children: [
			// 		{
			// 			id: 'evaluation-mgmt',
			// 			title: '평가관리',
			// 			icon: <Circle size={12} />,
			// 			// code: ,
			// 			navLink: `${ROUTE_BUSINESS_EVALUATION}/mgmt`
			// 		},
			// 		{
			// 			id: 'evaluation-items-mgmt',
			// 			title: '평가항목관리',
			// 			icon: <Circle size={12} />,
			// 			// code: ,
			// 			navLink: `${ROUTE_BUSINESS_EVALUATION}/items-mgmt`
			// 		}
			// 	]
			// }
		]
	}
]