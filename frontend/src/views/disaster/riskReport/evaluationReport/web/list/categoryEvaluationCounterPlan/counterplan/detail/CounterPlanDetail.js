/* eslint-disable */
import Arrow from '@src/assets/images/arrow.png'
import { API_DISASTER_EVALUATION_CONTENT } from "@src/constants"
import { setRegisterFormType } from '@store/module/criticalDisaster'
import { getTableDataCallback } from '@utils'
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody, CardFooter, CardHeader, Col, Label, Row } from "reactstrap"
import { CustomBadge } from "../../../../Component"
import { NOMAL, isSignBtnDisplayCheck, multResult } from '../../../../data'
import { FooterLineDetail } from '../../../EvaluationDetail'
import ContentCounterPlan from './ContentCounterPlan'
import ContentEvaluation from './ContentEvaluation'
import Cookies from 'universal-cookie'
import { signAuthCheck } from '../../../../../../../../../utility/Utils'

const CounterPlanDetail = (props) => {
	const {isSign, setIsSign, isInCharge, setIsInCharge} = props
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const loginAuth = useSelector((state) => state.loginAuth)
	const cookies = new Cookies()
	const activeUser = Number(cookies.get('userId'))
	// const isManager = cookies.get('isManager') === 'true'
	const [isManager, setIsManager] = useState(false)
	const [counterplanInfo, setCounterplanInfoInfo] = useState({})
	const [counterplanContentsBody, setCounterplanContentsBody] = useState([])
	const [files, setFiles] = useState({})
	const dispatch = useDispatch()

	const [signWorkerList, setSignWorkerList] = useState([])
	const [isSignAuth, setIsSignAuth] = useState(false) // 결재 권한이 있는지? 현재 미사용
	const [completedPage, setCompletedPage] = useState(false) // 
	const [evalCompleted, setEvalComleted] = useState(false)
	const [counterCompleted, setCounterCompleted] = useState(false)

	const setTemp = (data) => {
		const tempInfo = {...data.info}
		const workerList = [...data.worker_list]
		tempInfo['workerList'] = workerList
		dispatch(setRegisterFormType({label:'', value:data.info.form_type}))
		setCounterplanInfoInfo(tempInfo)
		setSignWorkerList((workerList && workerList.length > 0) ? workerList : [''])

		// 위험성 높은 내용 필터링
		const tempFiles = {}
		const tempEvaluationList = []
		const copyList = [...data.contents]
		const evaluationType = data.info.form_type
		copyList.map((row, index) => {
			const tempResult = multResult(evaluationType, row.frequency.value, row.strength.value)
			if (tempResult !== false && tempResult >= NOMAL) {
				const copyRow = {...row}
				copyRow['index'] = index
				tempEvaluationList.push(copyRow)
				tempFiles[index] = {
					evaluation: row.images.evaluation,
					counterplan: row.images.counterplan
				}
			}
		})
		setCounterplanContentsBody(tempEvaluationList)
		setFiles(tempFiles)

		const tempEVCompleted = data.critical_disaster.is_evaluation_completed === 1
		const tempCTCompleted = data.critical_disaster.is_counterplan_completed === 1
		setEvalComleted(tempEVCompleted)
		setCounterCompleted(tempCTCompleted)
		setCompletedPage(tempCTCompleted)
	}

	useEffect(() => setIsManager(loginAuth.isManager), [])

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
	return (
		<Fragment>
			<Card>
				<CardHeader>
					<Row className='w-100'>
						<Col md={9} xs={9}>
							<Label className="risk-report title-bold d-flex align-items-center">
								{counterplanInfo.counterplan_title}&nbsp;
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

				<CardBody>
					{
						counterplanContentsBody.length !== 0 ? counterplanContentsBody.map((row, idx) => {
							return (
								<Row key={idx}>
									<Col xl={6} lg={6} md={12} xs={12}>
										<ContentEvaluation
											type={criticalDisaster.registerFormType.value}
											cnt={idx + 1}
											data={row}
											file={files[row.index]['evaluation']}/>
									</Col>
									<Col xl={1} lg={1} md={12} xs={12} className='risk-report custom-img-rotate' style={{padding:'0', display:'flex', justifyContent:'center', alignItems:'center'}}>
										<img src={Arrow}/>
									</Col>
									<Col xl={5} lg={5} md={12} xs={12}>
										<ContentCounterPlan
											type={criticalDisaster.registerFormType.value}
											cnt={idx + 1}
											data={row}
											file={files[row.index]['counterplan']}/>
									</Col>
								</Row>
							)
						})
						:
						<Row className='mx-0 my-2'>
							<Col className='py-3 border-left card_table text center risk-report title-bold border-all'>
								예방 대책 미필요
							</Col>
						</Row>
					}
				</CardBody>

				<CardFooter>
					<FooterLineDetail
						isSign={isSign}
						setIsSign={setIsSign}
						isInCharge={isInCharge}
						setIsInCharge={setIsInCharge}
						userSign={signWorkerList}
						setUserSign={setSignWorkerList}
					/>
				</CardFooter>
			</Card>
		</Fragment>
	)
}

export default CounterPlanDetail