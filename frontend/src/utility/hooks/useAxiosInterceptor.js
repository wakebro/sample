import { useEffect } from "react"
import { ROUTE_LOGIN, SET_CSRF } from "../../constants"
import axios from "../AxiosConfig"

export const useAxiosIntercepter = () => {
	//const navigate = useNavigate()
	const errorHandler = (error) => {
		if (error.status === 403) {
			window.location.href = ROUTE_LOGIN
		} else if (error.status === 401) {
			window.location.href = `${ROUTE_LOGIN}?error=401`
		}
		return Promise.reject(error)
	}

	const responseHandler = (response) => {
		return response
	}

	const requestInterceptor = axios.interceptors.request.use(
		(config) => {
			config.headers['X-CSRFToken'] = localStorage.getItem('token')
			return config
		},
		(error) => {
			return Promise.reject(error)
		}
	)

	const responseIntercepter = axios.interceptors.response.use(
		(response) => responseHandler(response),
		(error) => errorHandler(error.response)
	)

	useEffect(() => {
		axios.get(SET_CSRF).then(res => {
			localStorage.setItem('token', res.headers['x-csrftoken'])
		})
		
		return () => {
			axios.interceptors.request.eject(requestInterceptor)
			axios.interceptors.response.eject(responseIntercepter)
		}
	}, [requestInterceptor, responseIntercepter])
}