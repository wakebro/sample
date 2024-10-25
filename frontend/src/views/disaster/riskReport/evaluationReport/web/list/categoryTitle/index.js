import { useDispatch, useSelector } from "react-redux"
import { Button, Card, CardBody, Col, Input, Label, Row } from "reactstrap"
import { axiosPostPutCallback, checkOnlyView, getTableDataCallback } from "../../../../../../../utility/Utils"
import { API_CRITICAL_DISASTER_EVALUATION_FIND_DETAIL } from "../../../../../../../constants"
import { useEffect, useState } from "react"
import { useAxiosIntercepter } from "../../../../../../../utility/hooks/useAxiosInterceptor"
import { setCdTotalTitle } from "../../../../../../../redux/module/criticalDisaster"
import { CRITICAL_EVALUATION_LIST } from "../../../../../../../constants/CodeList"

const EvaluationTitle = () => {
    useAxiosIntercepter()
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const loginAuth = useSelector((state) => state.loginAuth)
    const [inputDisabled, setInputDisabled] = useState(true)
	const [title, setTitle] = useState('')
	// const isManager = cookies.get('isManager') === 'true'
    const [isManager, setIsManager] = useState(false)
	const dispatch = useDispatch()


    const modifyTitleFunc = () => {
		if (title === '') return
		const evaluationId = criticalDisaster.evaluationId
		const formData = new FormData()
		formData.append('title', title)
		axiosPostPutCallback('modify', '', `${API_CRITICAL_DISASTER_EVALUATION_FIND_DETAIL}/${evaluationId}`, formData, undefined, false)
		setInputDisabled(true)
	}

    const getEvaluationData = (data) => {
		setTitle(data.title)
        dispatch(setCdTotalTitle(data.title))
	}

    useEffect(() => setIsManager(loginAuth.isManager), [])

    useEffect(() => {
		const evaluationId = criticalDisaster.evaluationId
		if (evaluationId !== null && evaluationId !== '') {
			getTableDataCallback(`${API_CRITICAL_DISASTER_EVALUATION_FIND_DETAIL}/${evaluationId}`, {}, getEvaluationData)
		}
	}, [criticalDisaster.evaluationId])
    return (
        <Card>
            <CardBody>
                <Row>
                    {
                        inputDisabled ?
                        <>
                            <Col xs={12} md={12} lg={10} className='risk-report m-10'>
                                <div className='risk-report title-bold'>
                                    {title}
                                </div>
                            </Col>
                            <Col xs={12} md={12} lg={2} className='d-flex justify-content-end align-items-end'>
                                { isManager &&
                                    <Button hidden={checkOnlyView(loginAuth, CRITICAL_EVALUATION_LIST, 'available_update')} color='primary' className='risk-report button-h' onClick={() => { setInputDisabled(false) }} style={{marginRight: '5px'}}>
                                        수정
                                    </Button>
                                }
                            </Col>
                        </>
                        :
                        <>
                            <Col xs={12} md={12} lg={10} className='risk-report m-10'>
                                <Label className='risk-report text-lg-bold'>
                                    위험성 평가 제목
                                </Label>
                                <Input
                                    value={title}
                                    invalid={title === ''}
                                    onChange={(e) => { setTitle(e.target.value) }}
                                    placeholder='위험성 평가 제목을 입력해주세요.'
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            modifyTitleFunc()
                                        }
                                    }}
                                />
                            </Col>
                            <Col xs={12} md={12} lg={2} className='d-flex justify-content-end align-items-end'>
                                <Button color='primary' className='risk-report button-h' onClick={modifyTitleFunc} style={{marginRight: '5px'}}>
                                    저장
                                </Button>
                                <Button className='risk-report button-h' onClick={() => { setInputDisabled(true) }}>
                                    취소
                                </Button>
                            </Col>
                        </>
                    }
                </Row>
            </CardBody>
        </Card>
    )
}
export default EvaluationTitle