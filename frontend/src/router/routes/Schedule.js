import { lazy } from "react"
import { 
	ROUTE_SCHEDULE_REGISTRATION,
	ROUTE_SCHEDULE_REGISTRATION_INSPECT_CALENDAR,
	ROUTE_SCHEDULE_REGISTRATION_DISASTER_CALENDAR,
	ROUTE_SCHEDULE_TOTAL
} from "../../constants"

const Schedule = lazy(() => import('../../views/schedule/registration/index'))
const ScheduleDailyCalendar = lazy(() => import('../../views/schedule/dailyCalendar/index'))
const ScheduleCalendarTotal = lazy(() => import('../../views/schedule/total/index'))

const ScheduleRoutes = [
	{
		path: `${ROUTE_SCHEDULE_REGISTRATION}/:type`,
		element: <Schedule />
	},
	{
		path: ROUTE_SCHEDULE_REGISTRATION_INSPECT_CALENDAR,
		element: <ScheduleDailyCalendar />
	},
	{
		path:ROUTE_SCHEDULE_REGISTRATION_DISASTER_CALENDAR,
		element: <ScheduleDailyCalendar />
	},
	{
		path: ROUTE_SCHEDULE_TOTAL,
		element: <ScheduleCalendarTotal />
	}
]

export default ScheduleRoutes