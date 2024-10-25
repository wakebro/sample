import { useEffect, useState } from "react"
import Cookies from 'universal-cookie'

const useType = () => {
	const [result, setResult] = useState()
	const cookies = new Cookies()

	useEffect(() => {
		const path = window.location.pathname 
		const type = cookies.get('type')
		if (type !== '') {
			setResult(type)
		}
	}, [result])
	return result
}

export {useType}