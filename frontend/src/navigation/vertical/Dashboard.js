import { Home} from "react-feather"
import { ROUTE_DASHBOARD } from "../../constants"
import { DASHBOARD } from "../../constants/CodeList"


export default [
	{
		id: "dashboard",
		title: "Home",
		icon: <Home size={20} />,
		navLink: ROUTE_DASHBOARD,
		code: DASHBOARD,
		appExpose:true
	}
]
