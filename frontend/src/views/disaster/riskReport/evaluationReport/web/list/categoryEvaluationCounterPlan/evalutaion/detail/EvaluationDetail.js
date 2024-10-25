/* eslint-disable */
import { API_DISASTER_EVALUATION_CONTENT } from "@src/constants"
import { setRegisterFormType, setModalName } from '@store/module/criticalDisaster'
import { getTableDataCallback } from '@utils'

import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardBody, CardFooter, CardHeader, Col, Label, Row } from "reactstrap"

import { CustomBadge } from "../../../../Component"
import { FooterLineDetail } from "../../../EvaluationDetail"
import EvaluationContent from "./EvaluationContent"
import EvaluationInfo from "./EvaluationInfo"
import ModalSign from "../../../ModalSign"
import Cookies from "universal-cookie"
import { signAuthCheck } from "../../../../../../../../../utility/Utils"
import { isSignBtnDisplayCheck } from "../../../../data"
import MeetingAttendTable from "../../../categoryMeeting/detail/AttendUserCheck"

const EvaluationDetail = (props) => {
	const { setValue, isSign, setIsSign, isInCharge, setIsInCharge} = props
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const loginAuth = useSelector((state) => state.loginAuth)
	const cookies = new Cookies()
	const activeUser = Number(cookies.get('userId'))
	const dispatch = useDispatch()
	// const isManager = cookies.get('isManager') === 'true'
	const [isManager, setIsManager] = useState(false)
	const [evaluationInfo, setEvaluationInfo] = useState({})
	const [evaluationContentsBody, setEvaluationContentsBody] = useState({})

	const [signWorkerList, setSignWorkerList] = useState([])
	const [completedPage, setCompletedPage] = useState(false) // 
	const [isSignAuth, setIsSignAuth] = useState(false) // 결재 권한이 있는지? 현재 미사용
	const [evalCompleted, setEvalComleted] = useState(false)
	const [counterCompleted, setCounterCompleted] = useState(false)

	const setTemp = (data) => {
		// console.log(data)
		const tempInfo = {...data.info}
		const workerList = [...data.worker_list]
		tempInfo['workerList'] = workerList
		dispatch(setRegisterFormType({label:'', value:data.info.form_type}))
		setEvaluationInfo(tempInfo)
		setEvaluationContentsBody(data.contents)
		setValue('evaluationTitle', data.info.evaluation_title)
		setValue('counterplan_title', data.info.counterplan_title)
		setSignWorkerList((workerList && workerList.length > 0) ? workerList : [''])

		const tempEVCompleted = data.critical_disaster.is_evaluation_completed === 1
		const tempCTCompleted = data.critical_disaster.is_counterplan_completed === 1
		setEvalComleted(tempEVCompleted)
		setCounterCompleted(tempCTCompleted)
		setCompletedPage(tempEVCompleted)
	}
	useEffect(() => {
		if (criticalDisaster.evaluationEvaluatorId !== '' && criticalDisaster.pageType === 'detail') {
			getTableDataCallback(`${API_DISASTER_EVALUATION_CONTENT}/${criticalDisaster.evaluationEvaluatorId}`, {}, setTemp)
		}
	}, [criticalDisaster.evaluationEvaluatorId])

	useEffect(() => {
		if (!evalCompleted || !counterCompleted) {
			setIsSign(false)
			return
		}
		if (!signAuthCheck(activeUser, signWorkerList)){ // 결재 권한이 있는지?
			setIsSign(false)
			return 
		}
		setIsSign(isSignBtnDisplayCheck(activeUser, signWorkerList)) // 나의 결재 여부 검사
	}, [evalCompleted, counterCompleted, signWorkerList])

	useEffect(() => {
		setIsSignAuth(signAuthCheck(activeUser, signWorkerList))
		setIsInCharge(signAuthCheck(activeUser, signWorkerList))
	}, [signWorkerList])

	useEffect(() => {
		dispatch(setModalName('작업자 서명'))
		setIsManager(loginAuth.isManager)
	}, [])

	return (
		<Fragment>
			<Card>
				<CardHeader>
					<Row className='w-100'>
						<Col md={9} xs={9}>
							<Label className="risk-report title-bold d-flex align-items-center">
								{ evaluationInfo.evaluation_title }&nbsp;
								{ completedPage !== true ?
									(isManager || isSignAuth) &&
									<CustomBadge color='light-danger'>작성중</CustomBadge>
								:
									(isManager || isSignAuth) &&
									<CustomBadge color='light-success'>작성완료</CustomBadge>
								}
							</Label>
						</Col>
					</Row>
				</CardHeader>
				
				<EvaluationInfo
					data={evaluationInfo}/>
				<br/>
				<br/>

				<EvaluationContent
					body={evaluationContentsBody}
				/>
				<br/>
				<br/>
				<Row style={{display:'flex', justifyContent:'center'}}>
					<MeetingAttendTable 
						title={'작업자'}
						cookies={cookies}
						attendUser={signWorkerList}
						setAttendUser={setSignWorkerList}
					/>
				</Row>

				<CardFooter>
					<FooterLineDetail
						isSign={isSign}
						setIsSign={setIsSign}
						isInCharge={isInCharge}
						setIsInCharge={setIsInCharge}
						userSign={signWorkerList}
						setUserSign={setSignWorkerList}
						isChargeSign={false}
					/>
				</CardFooter>
			</Card>
		</Fragment>
	)
}

export default EvaluationDetail