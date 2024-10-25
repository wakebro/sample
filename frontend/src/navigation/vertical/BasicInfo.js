import { Circle, Square } from "react-feather"
import {
	ROUTE_BASICINFO_AREA_BUILDING,
	ROUTE_BASICINFO_AREA_CONTRACT, ROUTE_BASICINFO_AREA_FLOOR,
	ROUTE_BASICINFO_AREA_PROPERTY,
	ROUTE_BASICINFO_AREA_ROOM,
	ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT,
	ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_LIST,
	ROUTE_BASICINFO_EMPLOYEE_INFORMATION,
	ROUTE_BASICINFO_FACILITY_FACILITYINFO,
	ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT,
	ROUTE_BASICINFO_PARTNER_MANAGEMENT, ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION,
	ROUTE_BASICINFO_PNR_MGMT_CLASS,
	ROUTE_BASICINFO_AREA_DRAWING
} from "../../constants"
import { BASIC_INFO, BASIC_INFO_AREA, BASIC_INFO_AREA_BUILDING, BASIC_INFO_AREA_CONTRACT, BASIC_INFO_AREA_FLOOR, BASIC_INFO_AREA_PROPERTY, BASIC_INFO_EMPLOYEE, BASIC_INFO_EMPLOYEE_APPOINTMENT, BASIC_INFO_EMPLOYEE_ATTENDANCE, BASIC_INFO_EMPLOYEE_INFO, BASIC_INFO_FACILITY, BASIC_INFO_FACILITY_FACILITY_INFO, BASIC_INFO_FACILITY_TOOL_EQUIPMENT, BASIC_INFO_PARTNER, BASIC_INFO_PARTNER_CLASS, BASIC_INFO_PARTNER_EVALUATION, BASIC_INFO_PARTNER_MAIN, BASIC_INFO_AREA_DRAWING } from "../../constants/CodeList"


export default [
	{
		id: "basic-info",
		title: "기본정보",
		icon: <Square size={20} />,
		appExpose:true,
		code: BASIC_INFO,
		children: [
			{
				id: 'basic-info-area',
				title: '공간정보관리',
				icon: <Circle size={12} />,
				appExpose:true,
				code: BASIC_INFO_AREA,
				children: [
					{
						id:'basic-info-area-center',
						title: '사업소정보',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_AREA_PROPERTY,
						code: BASIC_INFO_AREA_PROPERTY,
						appExpose:false
					},
					{
						id:'basic-info-area-building',
						title: '건물정보',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_AREA_BUILDING,
						code: BASIC_INFO_AREA_BUILDING,
						appExpose:true
					},
					{
						id:'basic-info-area-floor',
						title: '층정보',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_AREA_FLOOR,
						code: BASIC_INFO_AREA_FLOOR,
						appExpose:false
					},
					{
						id:'basic-info-area-room',
						title: '실정보',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_AREA_ROOM,
						code: BASIC_INFO,
						appExpose:false
					},
					{
						id:'basic-info-area-contract',
						title: '사업소별계약관리',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_AREA_CONTRACT,
						code: BASIC_INFO_AREA_CONTRACT,
						appExpose:false
					}
				]
			},
			{
				id: 'basic-info-facility',
				title: '설비정보관리',
				icon: <Circle size={12} />,
				appExpose:true,
				code: BASIC_INFO_FACILITY,
				children : [
					{
						id:'basic-info-facility-facility_info',
						title: '설비정보',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_FACILITY_FACILITYINFO,
						code: BASIC_INFO_FACILITY_FACILITY_INFO,
						appExpose:true
					},
					{
						id:'basic-info-facility-tool-equipment',
						title: '공구비품정보',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT,
						code: BASIC_INFO_FACILITY_TOOL_EQUIPMENT,
						appExpose:false
					}
				]
			},
			{
				id:'basic-info-drawing',
				title: '도면정보관리',
				icon: <Circle size={12} />,
				navLink: ROUTE_BASICINFO_AREA_DRAWING,
				code: BASIC_INFO_AREA_DRAWING,
				appExpose:false
			},
			{
				id: 'basic-info-employee',
				title: '직원정보관리',
				icon: <Circle size={12} />,
				appExpose:false,
				code: BASIC_INFO_EMPLOYEE,
				children: [
					{
						id:'basic-info-employee-employee-info',
						title: '직원정보',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_EMPLOYEE_INFORMATION,
						code: BASIC_INFO_EMPLOYEE_INFO
					},
					{
						id:'basic-info-employee-appointment',
						title: '선임관리',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT,
						code: BASIC_INFO_EMPLOYEE_APPOINTMENT
					},
					{
						id:'basic-info-employee-attendance',
						title: '근태현황',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_LIST,
						code: BASIC_INFO_EMPLOYEE_ATTENDANCE
					}
				]
			},
			{
				id: 'basic-info-partner-mgmt',
				title: '협력업체관리',
				icon: <Circle size={12} />,
				appExpose:false,
				code: BASIC_INFO_PARTNER,
				children : [
					{
						id:'basic-info-partner-mgmt-main',
						title: '협력업체',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_PARTNER_MANAGEMENT,
						code: BASIC_INFO_PARTNER_MAIN
					},
					{
						id:'basic-info-partner-mgmt-class',
						title: '협력업체분류',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_PNR_MGMT_CLASS,
						code: BASIC_INFO_PARTNER_CLASS
					},
					{
						id:'basic-info-partner-mgmt-evaluation',
						title: '협력업체평가',
						icon: <Circle size={12} />,
						navLink: ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION,
						code: BASIC_INFO_PARTNER_EVALUATION
					}
				]
			}
		]
	}
]
