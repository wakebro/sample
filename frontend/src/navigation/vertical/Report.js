import { Circle, Inbox } from "react-feather"
import {
	ROUTE_REPORT_MANAGE,
	ROUTE_REPORT_TOTAL
} from "../../constants"
import { REPORT_INFO, REPORT_MANAGE, REPORT_MGMT } from "../../constants/CodeList"

export default [
	{
		id: "report",
		title: "보고서관리",
		icon: <Inbox size={20} />,
		code: REPORT_MGMT,
		appExpose:false,
		children: [
			{
				id: 'report-info',
				title: '보고서',
				icon: <Circle size={12} />,
				navLink: ROUTE_REPORT_TOTAL,
				code: REPORT_INFO
			},
			{
				id: 'report-manage',
				title: 	'운영보고서',
				icon: <Circle size={12} />,
				navLink: ROUTE_REPORT_MANAGE,
				code: REPORT_MANAGE
			}
		]
	}
]
