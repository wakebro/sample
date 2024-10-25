import { Circle, Monitor } from "react-feather"
import {
	ROUTE_CRITICAL_CORPERATION_EVALUATION_LIST,
	ROUTE_CRITICAL_DISASTER_DIRECTORY,
	ROUTE_CRITICAL_DISASTER_EVALUATION,
	ROUTE_CRITICAL_DISASTER_INSPECTION_REG,
	ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM_LIST,
	ROUTE_CRITICAL_DISASTER_WORKER_QNA
} from "../../constants"
import { CRITICAL_CORPERATION, CRITICAL_DISASTER, CRITICAL_DISASTER_INSPECTION_REG, CRITICAL_EVALUATION, CRITICAL_EVALUATION_LIST, CRITICAL_EVALUATION_TEMPLATE, CRITICAL_INSPECTION, CRITICAL_INSPECTION_FORM, CRITICAL_INSPECTION_INSPECTION, CRITICAL_QNA } from "../../constants/CodeList"

export default [
	{
		id: "critical-disaster",
		title: "중대재해관리",
		icon: <Monitor size={20} />,
		code: CRITICAL_DISASTER,
		appExpose:true,
		children: [
			{
				id: "critical-disaster-report",
				title: '일일안전점검',
				icon: <Circle size={12} />,
				code: CRITICAL_INSPECTION,
				appExpose:true,
				children: [
					{
						id: 'critical-disaster-inspection-register',
						title: '점검일지관리',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_CRITICAL_DISASTER_INSPECTION_REG}/safety`,
						code: CRITICAL_DISASTER_INSPECTION_REG,
						appExpose:true
					},
					{
						id:'critical-disaster-report-list',
						title: '점검일지',
						icon: <Circle size={12} />,
						code: CRITICAL_INSPECTION_INSPECTION,
						navLink: `${ROUTE_CRITICAL_DISASTER_DIRECTORY}/safety`,
						appExpose:true
					},
					{
						id:'critical-disaster-report-form',
						title: '점검양식',
						icon: <Circle size={12} />,
						code: CRITICAL_INSPECTION_FORM,
						navLink: `${ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM_LIST}/safety`,
						appExpose:false
					}
				]
			},
			{
				id: "critical-disaster-assessment",
				title: '위험성평가',
				icon: <Circle size={12} />,
				code: CRITICAL_EVALUATION,
				appExpose: true,
				children: [
					{
						id: "critical-disaster-assessment-list",
						title: '위험성평가 목록',
						icon: <Circle size={12} />,
						code: CRITICAL_EVALUATION_LIST,
						navLink: `${ROUTE_CRITICAL_DISASTER_EVALUATION}/list`,
						appExpose:true
					},
					{
						id: "critical-disaster-assessment-template",
						title: '위험성평가 양식',
						icon: <Circle size={12} />,
						code: CRITICAL_EVALUATION_TEMPLATE,
						navLink: `${ROUTE_CRITICAL_DISASTER_EVALUATION}/template`,
						appExpose:false
					}
				]
			},
			{
				id: "worker-comment",
				title: '종사자의견청취',
				icon: <Circle size={12} />,
				code: CRITICAL_QNA,
				navLink: `${ROUTE_CRITICAL_DISASTER_WORKER_QNA}`,
				appExpose:true
			},
			{
				id: "disaster-cooperator-evaluation",
				title: '협력업체평가',
				icon: <Circle size={12} />,
				code: CRITICAL_CORPERATION,
				navLink: ROUTE_CRITICAL_CORPERATION_EVALUATION_LIST,
				// code: FACILITY_CONTRACT_MGMT,
				appExpose:false
			}
		]
	}
]
