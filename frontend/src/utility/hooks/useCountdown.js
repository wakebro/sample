import { useEffect, useState } from "react"

const useCountdown = () => {
	const getReturnValue = (remain) => {
		const minutes = Math.floor(remain / 60)
		const second = remain - (minutes * 60)
		if (remain === 0) {
			minutes = 0
			second = 0
		}
		
		return [minutes, (second.toString().length === 2) ? second : `0${second}`]
	}

	const [remain, setRemain] = useState(180)

	useEffect(() => {
		if (!remain) return

		const interval = setInterval(() => {
			setRemain(remain - 1)
		}, 1000)

		return () => clearInterval(interval)
	}, [remain])

	return getReturnValue(remain)
}

export { useCountdown }