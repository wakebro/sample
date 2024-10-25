import { useEffect, useRef } from "react"

export const useInterval = (callback, delay) => {
	const savedCallback = useRef()

	useEffect(() => {
		savedCallback.current = callback
	})

	useEffect(() => {
		const tick = () => {
			savedCallback.current()
		}

		const timerId = setInterval(tick, delay)
		return () => clearInterval(timerId)
	}, [delay])
}