import { Circle, Sliders } from "react-feather"
import { ROUTE_FACILITYMGMT_ALARM, ROUTE_FACILITYMGMT_GUARD, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST, ROUTE_FACILITYMGMT_MATERIAL_REQUEST_LIST, ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_LIST, ROUTE_INSPECTION_COMPLAIN, ROUTE_INSPECTION_COMPLAIN_REGISTER_TAB, ROUTE_INSPECTION_DEFECT, ROUTE_MANUAL } from "../../constants"
import { FACILITY_ALARM, FACILITY_CAMERA, FACILITY_CONTRACT_MGMT, FACILITY_GUARD, FACILITY_HISTORY, FACILITY_HISTORY_IOT, FACILITY_IOT, FACILITY_MATERIAL_INFO, FACILITY_MATERIAL_MGMT, FACILITY_MATERIAL_REQUEST, FACILITY_MGMT, FACILITY_NFC_LIST, FACILITY_NFC_MGMT, FACILITY_NFC_SCAN, FACILITY_WORK_STATUS, INSPECTION_COMPLAIN, INSPECTION_COMPLAIN_STATUS, INSPECTION_DEFECT, INSPECTION_MANUAL } from "../../constants/CodeList"

export default [
	{
		id: "facility-mgmt",
		title: "시설관리",
		icon: <Sliders size={20} />,
		code: FACILITY_MGMT,
		appExpose:true,
		children: [
			{
				id: 'facility-mgmt-alarm',
				title: '경보관리',
				icon: <Circle size={12} />,
				code: FACILITY_ALARM,
				appExpose:true,
				children: [
					{
						id: 'facility-mgmt-alarm-camera',
						title: 'CCTV 관리',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_FACILITYMGMT_ALARM}/camera`,
						code: FACILITY_CAMERA,
						appExpose:false
					},
					{
						id: 'facility-mgmt-alarm-history-camera',
						title: 'CCTV 히스토리',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_FACILITYMGMT_ALARM}/history/camera`,
						code: FACILITY_HISTORY,
						appExpose:true
					},
					{
						id: 'facility-mgmt-alarm-iot',
						title: 'IoT 관리',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_FACILITYMGMT_ALARM}/iot`,
						code: FACILITY_IOT,
						appExpose:false
					},
					{
						id: 'facility-mgmt-alarm-history-iot',
						title: 'IoT 히스토리',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_FACILITYMGMT_ALARM}/history/iot`,
						code: FACILITY_HISTORY_IOT,
						appExpose:true
					}
				]
			},
			{
				id: 'facility-mgmt-guard',
				title: '경비업무',
				icon: <Circle size={12} />,
				code: FACILITY_GUARD,
				appExpose:true,
				children: [
					{
						title: 'NFC스캔',
						id: 'facility-mgmt-guard-scanning',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_FACILITYMGMT_GUARD}/scanning`,
						code: FACILITY_NFC_SCAN,
						appExpose:true
					},
					{
						title: 'NFC스캔목록',
						id: 'facility-mgmt-guard-list',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_FACILITYMGMT_GUARD}/scan-list`,
						code: FACILITY_NFC_LIST,
						appExpose:true
					},
					{
						id: 'facility-mgmt-guard-nfc-manage',
						title: 'NFC관리',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_FACILITYMGMT_GUARD}/nfc-manage`,
						code: FACILITY_NFC_MGMT,
						appExpose:false
					},
					{
						id: 'facility-mgmt-guard-work-status',
						title: '경비업무현황',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_FACILITYMGMT_GUARD}/work-status`,
						code: FACILITY_WORK_STATUS,
						appExpose:true
					}
				]
			},
			{
				id: 'inspection-complain-register',
				title: '불편신고접수',
				icon: <Circle size={12} />,
				navLink: ROUTE_INSPECTION_COMPLAIN_REGISTER_TAB,
				code: INSPECTION_COMPLAIN,
				appExpose:true
			},
			{
				id: 'inspection-complain-status',
				title: '작업현황관리',
				icon: <Circle size={12} />,
				navLink: ROUTE_INSPECTION_COMPLAIN,
				code: INSPECTION_COMPLAIN_STATUS,
				appExpose:true
			},
			{
				id: 'inspection-defect',
				title: '하자관리',
				icon: <Circle size={12} />,
				navLink: ROUTE_INSPECTION_DEFECT,
				code: INSPECTION_DEFECT,
				appExpose:false
				
			},
			{
				id: 'facility-mgmt-material',
				title: '자재관리',
				icon: <Circle size={12} />,
				code: FACILITY_MATERIAL_MGMT,
				appExpose:false,
				children: [
					{
						id: 'facility-mgmt-material-info',
						title: '자재정보',
						icon: <Circle size={12} />,
						navLink: ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST,
						code: FACILITY_MATERIAL_INFO
					},
					{
						id: 'facility-mgmt-material-request',
						title: '자재청구',
						icon: <Circle size={12} />,
						navLink: ROUTE_FACILITYMGMT_MATERIAL_REQUEST_LIST,
						code: FACILITY_MATERIAL_REQUEST
					}
				]
			},
			{
				id: 'facility-mgmt-contract',
				title: '외주계약관리',
				icon: <Circle size={12} />,
				navLink: ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_LIST,
				code: FACILITY_CONTRACT_MGMT,
				appExpose:false
			},
			{
				id: 'inspection-manual',
				title: '유지관리매뉴얼',
				icon: <Circle size={12} />,
				navLink: ROUTE_MANUAL,
				code: INSPECTION_MANUAL,
				appExpose:true
			}
		]
	}
]
