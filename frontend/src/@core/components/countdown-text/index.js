import { useCountdown } from "@hooks/useCountdown"
import { InputGroupText } from "reactstrap"

const CountdownText = () => {
	const [minutes, second] = useCountdown()
	
	if (minutes === 0 && second === 0) {
		return <InputGroupText>유효시간 만료</InputGroupText>
	} else {
		return <InputGroupText>유효시간 {minutes}:{second}</InputGroupText>
	}
}

export default CountdownText