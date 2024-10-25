import { Circle, Clipboard } from "react-feather"

import { 
	ROUTE_INSPECTION_INSPECTION, 
	ROUTE_INSPECTION_INSPECTION_FORM_LIST, 
	ROUTE_MANUAL, ROUTE_INSPECTION_PERFORMANCE, 
	ROUTE_INSPECTION_COMPLAIN, 
	ROUTE_INSPECTION_OUTSOURCING,
	ROUTE_INSPECTION_MAIN, 
	ROUTE_INSPECTION_REG,
	ROUTE_INSPECTION_COMPLAIN_REGISTER_TAB
} from "../../constants"
import { INSPECTION, INSPECTION_COMPLAIN, INSPECTION_FORM, INSPECTION_INFO, INSPECTION_INSPECTION, INSPECTION_MAIN, INSPECTION_MANUAL, INSPECTION_OUTSOURCING, INSPECTION_PERFORMANCE, INSPECTION_COMPLAIN_STATUS, INSPECTION_REG } from "../../constants/CodeList"

export default [
	{
		id: "inspection",
		title: "점검관리",
		icon: <Clipboard size={20} />,
		appExpose:true,
		code: INSPECTION,
		children: [
			{
				id: 'inspection-main',
				title: '점검현황',
				icon: <Circle size={12} />,
				navLink: ROUTE_INSPECTION_MAIN,
				code: INSPECTION_MAIN,
				appExpose:false
			},
			{
				id: 'inspection-info',
				title: '자체점검',
				icon: <Circle size={12} />,
				appExpose:true,
				code: INSPECTION_INFO,
				children: [
					{
						id: 'inspection-register',
						title: '점검일지관리',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_INSPECTION_REG}/mg`,
						code: INSPECTION_REG,
						appExpose:true
					},
					{
						id: 'inspection-inspection',
						title: '점검실적관리',
						icon: <Circle size={12} />,
						navLink: ROUTE_INSPECTION_INSPECTION,
						code: INSPECTION_INSPECTION,
						appExpose:true
					},
					{
						id: 'inspection-form',
						title: '점검양식관리',
						icon: <Circle size={12} />,
						navLink: ROUTE_INSPECTION_INSPECTION_FORM_LIST,
						code: INSPECTION_FORM,
						appExpose:false
					},
					{
						id: 'inspection-performance',
						title: '점검실적조회',
						icon: <Circle size={12} />,
						navLink: ROUTE_INSPECTION_PERFORMANCE,
						code: INSPECTION_PERFORMANCE,
						appExpose:false
					}
				]
			},
			{
				id: 'inspection-outsourcing',
				title: '외주점검',
				icon: <Circle size={12} />,
				navLink: ROUTE_INSPECTION_OUTSOURCING,
				code: INSPECTION_OUTSOURCING,
				appExpose:false
			}
		]
	}
]
