import { lazy } from "react"
import { ROUTE_INFORMATION_PROTECTION_GUIDELINES, ROUTE_LOGIN, ROUTE_REGISTER } from "../../constants"

const Login = lazy(() => import("../../views/authentication/Login"))
const RegisterMultiSteps = lazy(() => import("../../views/authentication/register-multi-steps"))
const InformationProtectionGuidelines = lazy(() => import("@views/authentication/ProtectionGuidelines"))

const AuthenticationRoutes = [
	{
		path: ROUTE_LOGIN,
		element: <Login />,
		meta: {
			layout: "blank"
		}
	},
	{
		path: ROUTE_REGISTER,
		element: <RegisterMultiSteps />,
		meta: {
		  layout: "blank"
		}
	},
	{
		path: ROUTE_INFORMATION_PROTECTION_GUIDELINES,
		element: <InformationProtectionGuidelines/>,
		meta: {
			layout: "blank"
		}
	}
]

export default AuthenticationRoutes