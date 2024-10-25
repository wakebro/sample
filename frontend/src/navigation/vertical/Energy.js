import { BatteryCharging, Circle } from "react-feather"
import { 
	ROUTE_ENERGY_GAUGE_GROUP, 
	ROUTE_ENERGY_GAUGE_LIST, 
	ROUTE_ENERGY_GAUGE_EXAMIN,
	ROUTE_ENERGY_ELECTRIC_REGISTER,
	ROUTE_ENERGY_ELECTRIC_LIST,
	ROUTE_ENERGY_ELECTRIC_ITSS,
	ROUTE_ENERGY_ELECTRIC_TOTAL, 
	ROUTE_ENERGY_CODE, 
	ROUTE_ENERGY_PURPOSE, 
	ROUTE_ENERGY_SOLID, 
	ROUTE_ENERGY_SOLID_FORM,
	ROUTE_ENERGY_UTILITIES
} from "../../constants"
import { ENERGY_BASIC_INFO, ENERGY_BASIC_MAGIFICATION, ENERGY_BASIC_PURPOSE, ENERGY_BASIC_UTILITY_CODE, ENERGY_BASIC_UTILITY_ENTRY, ENERGY_CHART, ENERGY_DAILY, ENERGY_DAY_MONTH, ENERGY_ELECTRIC, ENERGY_ELECTRIC_ITSS, ENERGY_ELECTRIC_LIST, ENERGY_ELECTRIC_REGISTER, ENERGY_ELECTRIC_TOTAL, ENERGY_GAS_COMPARE, ENERGY_GAS_DAY, ENERGY_GAS_MGMT, ENERGY_GAS_MONTH, ENERGY_GAS_REGISTER, ENERGY_GAS_YEAR, ENERGY_GAUGE, ENERGY_GAUGE_GROUP, ENERGY_MGMT, ENERGY_MONTHLY, ENERGY_READ, ENERGY_UE_IDRATE, ENERGY_UE_LIST, ENERGY_UE_MGMT, ENERGY_UE_PERFORM } from "../../constants/CodeList"

export default [
	{
		id: "energy-mgmt",
		title: "에너지관리",
		icon: <BatteryCharging size={20} />,
		code: ENERGY_MGMT,
		appExpose:false,
		children: [
			{
				id: 'energe-read',
				title: '검침정보관리',
				icon: <Circle size={12} />,
				code: ENERGY_READ,
				children : [
					{
						id:'energe-gauge-group-info',
						title: '계량기정보',
						icon: <Circle size={12} />,
						navLink : ROUTE_ENERGY_GAUGE_GROUP,
						code: ENERGY_GAUGE_GROUP
					},
					{
						id:'energe-gauge-info',
						title: '계기정보',
						icon: <Circle size={12} />,
						navLink: ROUTE_ENERGY_GAUGE_LIST,
						code: ENERGY_GAUGE
					}
				]
			},
			{
				id: 'energe-daymonth',
				title: '일일/월간검침',
				icon: <Circle size={12} />,
				code: ENERGY_DAY_MONTH,
				children : [
					{
						id:'daily-gauge',
						title: '일일검침',
						icon: <Circle size={12} />,
						navLink : `${ROUTE_ENERGY_GAUGE_EXAMIN}/daily`,
						code: ENERGY_DAILY
					},
					{
						id:'month-gauge',
						title: '월간검침',
						icon: <Circle size={12} />,
						navLink : `${ROUTE_ENERGY_GAUGE_EXAMIN}/monthly`,
						code: ENERGY_MONTHLY
					},
					{
						id:'gauge-chart',
						title: '검침차트',
						icon: <Circle size={12} />,
						navLink : `${ROUTE_ENERGY_GAUGE_EXAMIN}/chart`,
						code: ENERGY_CHART
					}
				]
			},
			{
				id: 'energe-electric',
				title: '전력사용관리',
				icon: <Circle size={12} />,
				code: ENERGY_ELECTRIC,
				children : [
					{
						id:'energe-electric-register',
						title: '전력 및 발전량 관리',
						icon: <Circle size={12} />,
						navLink : ROUTE_ENERGY_ELECTRIC_REGISTER,
						code: ENERGY_ELECTRIC_REGISTER
					},
					{
						id:'energe-electric-list',
						title: '전력 및 발전량 조회',
						icon: <Circle size={12} />,
						navLink : ROUTE_ENERGY_ELECTRIC_LIST,
						code: ENERGY_ELECTRIC_LIST
					},
					{
						id:'energe-electric-itss',
						title: '빙축열 조회',
						icon: <Circle size={12} />,
						navLink : ROUTE_ENERGY_ELECTRIC_ITSS,
						code: ENERGY_ELECTRIC_ITSS
					},
					{
						id:'energe-electric-total',
						title: '전력사용 집계',
						icon: <Circle size={12} />,
						navLink : ROUTE_ENERGY_ELECTRIC_TOTAL,
						code: ENERGY_ELECTRIC_TOTAL
					}
				]
			},
			{
				id: 'energe-gas',
				title: '가스사용관리',
				icon: <Circle size={12} />,
				code: ENERGY_GAS_MGMT,
				children: [
					{
						id: 'solid-form',
						title:'가스 사용량 관리',
						icon: <Circle size={12} />,
						navLink: ROUTE_ENERGY_SOLID_FORM,
						code: ENERGY_GAS_REGISTER
					},
					{
						id:'solid-day',
						title: '보일러 및 가스사용량',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_ENERGY_SOLID}/day`,
						code: ENERGY_GAS_DAY
					},
					{
						id:'solid-monthly',
						title: '월별 사용량',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_ENERGY_SOLID}/monthly`,
						code: ENERGY_GAS_MONTH
					},
					{
						id:'solid-compare',
						title:'지정월 사용량',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_ENERGY_SOLID}/compare`,
						code: ENERGY_GAS_COMPARE
					},
					{
						id:'solid-year',
						title: '년도별 사용량',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_ENERGY_SOLID}/year`,
						code: ENERGY_GAS_YEAR
					}
				]
			},
			{
				id: 'energe-ue',
				title: '수광비관리',
				icon: <Circle size={12} />,
				code: ENERGY_UE_MGMT,
				children: [
					{
						id:'ue-perform-manage',
						title: '수광비실적관리',
						icon: <Circle size={12} />,
						navLink : `${ROUTE_ENERGY_UTILITIES}/manage`,
						code: ENERGY_UE_PERFORM
					},
					{
						id:'ue-perform-list',
						title: '수광비실적조회',
						icon: <Circle size={12} />,
						navLink : `${ROUTE_ENERGY_UTILITIES}/list`,
						code: ENERGY_UE_LIST
					},
					{
						id:'ue-perform-idrate',
						title: '수광비실적증감률',
						icon: <Circle size={12} />,
						navLink : `${ROUTE_ENERGY_UTILITIES}/idr`,
						code: ENERGY_UE_IDRATE
					}
				]
			},
			{
				id: 'energy-basic-info',
				title: '기본정보',
				icon: <Circle size={12} />,
				code: ENERGY_BASIC_INFO,
				children: [
					{
						id:'energy-basic-magnification',
						title: '배율관리',
						icon: <Circle size={12} />,
						navLink : `${ROUTE_ENERGY_CODE}/magnification`,
						code: ENERGY_BASIC_MAGIFICATION
					},
					{
						id:'energy-basic-utility-code',
						title: '수광비코드관리',
						icon: <Circle size={12} />,
						navLink : `${ROUTE_ENERGY_CODE}/utilitycode`,
						code: ENERGY_BASIC_UTILITY_CODE
					},
					{
						id:'energy-basic-utility-entry',
						title: '수광비항목관리',
						icon: <Circle size={12} />,
						navLink : `${ROUTE_ENERGY_CODE}/utilityentry`,
						code: ENERGY_BASIC_UTILITY_ENTRY
					},
					{
						id:'energy-basic-purpose',
						title: '에너지목표관리',
						icon: <Circle size={12} />,
						navLink : ROUTE_ENERGY_PURPOSE,
						code: ENERGY_BASIC_PURPOSE
					}
				]
			}
		]
	}
]