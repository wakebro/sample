import { Circle, Calendar } from "react-feather"
import { ROUTE_SCHEDULE_REGISTRATION, ROUTE_SCHEDULE_TOTAL } from "../../constants"
import { SCHEDULE, SCHEDULE_INFO, SCHEDULE_REGISTER, SCHEDULE_REGISTER_DISASTER } from "../../constants/CodeList"


export default [
	{
		id: "schedule",
		title: "일정관리",
		icon: <Calendar size={20} />,
		code: SCHEDULE,
		appExpose:true,
		children: [
			{
				id: 'schedule-info',
				title: '일정',
				icon: <Circle size={12} />,
				navLink: ROUTE_SCHEDULE_TOTAL,
				code: SCHEDULE_INFO,
				appExpose:true
			},
			{
				id: 'schedule-register',
				title: '업무등록',
				icon: <Circle size={12} />,
				navLink: `${ROUTE_SCHEDULE_REGISTRATION}/inspection`,
				code: SCHEDULE_REGISTER,
				appExpose:false
			},
			{
				id: 'disaster-schedule-register',
				title: '중대재 업무등록',
				icon: <Circle size={12} />,
				navLink: `${ROUTE_SCHEDULE_REGISTRATION}/disaster`,
				code: SCHEDULE_REGISTER_DISASTER,
				appExpose:false
			}
		]
	}
]
