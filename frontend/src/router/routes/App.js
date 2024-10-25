import { lazy } from "react"

import { ROUTE_DASHBOARD, ROUTE_INSPECTION_INSPECTION_EXPORT } from "../../constants"


const Dashboard = lazy(() => import("../../views/dashboard"))
const Error = lazy(() => import("../../views/apps/Error"))

const AppRoutes = [
	{
		path: ROUTE_DASHBOARD,
		element: <Dashboard />
	},
	{
		path: "*",
		element: <Error />,
		meta: {
			layout: "blank"
		}
	}
]

export default AppRoutes