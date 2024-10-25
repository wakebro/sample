import { useState } from "react"
import { Button, ButtonGroup } from "reactstrap"

// toggle button component
const InspectCustomButtonGroup = (props) => {

    if (!props.setPeriodCallback) {
        return
    }

    if (!props.periodObj && props.periodObj.label && props.periodObj.value) {
        return
    }

    // 버튼 select 효과를 위한 state
    const [selectButtonOne, setSelectButtonOne] = useState(false)
    const [selectButtonTwo, setSelectButtonTwo] = useState(true)
    const [selectButtonThere, setSelectButtonThere] = useState(true)

    // 라디오 버튼 형태로 작동
    // 상위 컴포넌트에서 콜백형태로 함수를 받아옴
    const onRadioBtnClick = (periodFunc) => {
        // 상위 컴포넌트에서 받음 함수로 값을 전달
        props.setPeriodCallback(periodFunc)
        // 라디오 형태로 버튼이 선택 된걸 표시하기 위한 조건문
        if (periodFunc === props.periodObj.value[0]) {
            setSelectButtonOne(false)
            setSelectButtonTwo(true)
            setSelectButtonThere(true)
            return
        }// if end
        if (periodFunc === props.periodObj.value[1]) {
            setSelectButtonOne(true)
            setSelectButtonTwo(false)
            setSelectButtonThere(true)
            return
        }// if end
        if (periodFunc === props.periodObj.value[2]) {
            setSelectButtonOne(true)
            setSelectButtonTwo(true)
            setSelectButtonThere(false)
        }// if end
    }// onRadioBtnClick end

    return (
        <>
            <ButtonGroup>
                <Button outline={selectButtonOne} color='primary' onClick={() => onRadioBtnClick(props.periodObj.value[0])}>{props.periodObj.label[0]}</Button>
                <Button outline={selectButtonTwo} color='primary' onClick={() => onRadioBtnClick(props.periodObj.value[1])}>{props.periodObj.label[1]}</Button>
                <Button outline={selectButtonThere} color='primary' onClick={() => onRadioBtnClick(props.periodObj.value[2])}>{props.periodObj.label[2]}</Button>
            </ButtonGroup>
        </>
    ) // return end
} // InspectCustomButtonGroup end
export default InspectCustomButtonGroup