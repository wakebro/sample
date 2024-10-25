/* eslint-disable */
import { setEvaluationSelectEvaluator, setEvaluationSelectWorker, setRegisterFormType } from '@store/module/criticalDisaster'
import { getTableDataCallback, makeSelectList, signAuthCheck } from '@utils'
import moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Col, Row, Spinner } from "reactstrap"
import Cookies from "universal-cookie"
import { API_DISASTER_EVALUATION_CONTENT, API_DISASTER_TEMPLATE_DETAIL, API_EMPLOYEE_LIST } from '../../../../../../../constants'
import { NOMAL, getCaseMultiResult, multResult, val2Label } from '../../../web/data'
import { initList } from '../../../web/list/categoryEvaluationCounterPlan/data'
import EvaluationContents from './EvaluationContents'
import EvaluationInfoAccordion from './EvaluationInfoAccordion'
import { isEmptyObject } from 'jquery'

const EvaluationAppDetail = (props) => {
	const {control, unregister, errors, handleSubmit, setValue, watch
		// , itemsYup, setItemsYup
	} = props
	const cookies = new Cookies()
	const activeUser = Number(cookies.get('userId'))
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const templateId = criticalDisaster.templateId
	const dispatch = useDispatch()
	const [managerList, setManagerList] = useState([{label: '선택', value: ''}])
	const [load, setLoad] = useState(true)
	const [files, setFiles] = useState({})
	const [evaluationInfo, setEvaluationInfo] = useState({})
	const [dataInfo, setDataInfo] = useState({info:{}, list:[]})
	const [evaluationContentsBody, setEvaluationContentsBody] = useState([])
	const [signWorkerList, setSignWorkerList] = useState([])
	const [evalCompleted, setEvalComleted] = useState(false)
	const [counterCompleted, setCounterCompleted] = useState(false)
	const [completedPage, setCompletedPage] = useState(false)
	const [isInCharge, setIsInCharge] = useState(false) // 담당자인지 
	const [isSign, setIsSign] = useState(false) // 결재 버튼을 보여줄건지
	const [isSignAuth, setIsSignAuth] = useState(false) // 결재 권한이 있는지? 현재 미사용

	function settingManagerList(data) {
		makeSelectList(true, '', data, managerList, setManagerList, ['name'], 'id')
	}

	function getEvaluationData(data) {
		Object.keys(control._formValues).forEach(key => {
			if (key.includes('_')) {
				unregister(key)
			}
		})
		// console.log(data)
		const tempInfo = {...data.info}
		const workerList = [...data.worker_list]
		tempInfo['workerList'] = workerList
		dispatch(setRegisterFormType({label:'', value:data.info.form_type}))
		dispatch(setEvaluationSelectWorker(data.worker_list))
		setEvaluationInfo(tempInfo)
		setEvaluationContentsBody(data.contents)

		setValue('evaluationTitle', data.info.evaluation_title)
		setValue('counterplanTitle', data.info.counterplan_title)
		setValue('scene', data.info.scene)
		setValue('target', data.info.target)
		setValue('date', data.info.date)
		setValue('department', data.info.department)
		setValue('manager', data.info.manager)
		setSignWorkerList((workerList && workerList.length > 0) ? workerList : [''])

		const tempEVCompleted = data.critical_disaster.is_evaluation_completed === 1
		const tempCTCompleted = data.critical_disaster.is_counterplan_completed === 1
		setEvalComleted(tempEVCompleted)
		setCounterCompleted(tempCTCompleted)
		setCompletedPage(tempEVCompleted)

		const evaluationType = data.info.form_type
		const tempFiles = {}
		const copyList = [...data.contents]
		copyList.map((row, index) => {
			tempFiles[index] = {}
			tempFiles[index] = {
				evaluation: row.images.evaluation,
				counterplan: row.images.counterplan
			}
		})
		setFiles(tempFiles)
		setLoad(false)
	}

	useEffect(() => {
		setLoad(true)
		const param = {
			propId :  cookies.get('property').value,
			employeeClass : '',
			employeeLevel : '',
			employeeStatue : '',
			search : ''
		}
		getTableDataCallback(API_EMPLOYEE_LIST, param, settingManagerList)
	}, [])

	useEffect(() => {
		if (managerList.length !== 0 && criticalDisaster.evaluationEvaluatorId !== '') {
			getTableDataCallback(`${API_DISASTER_EVALUATION_CONTENT}/${criticalDisaster.evaluationEvaluatorId}`, {}, getEvaluationData)
		}
	}, [managerList, criticalDisaster.evaluationEvaluatorId])

	useEffect(() => {
		setIsSignAuth(signAuthCheck(activeUser, signWorkerList))
		setIsInCharge(signAuthCheck(activeUser, signWorkerList))
	}, [signWorkerList])

	useEffect(() => {
		if (isEmptyObject(evaluationContentsBody) || evaluationContentsBody.length <= 0) return
		Object.keys(control._formValues).forEach(key => {
			if (key.includes('_')) {
				setValue(key, '')
			}
		})


		const tempBody = [...evaluationContentsBody]
		for (const index in tempBody) {
			for (const obj of Object.entries(tempBody[index])) {
				setValue(`${obj[0]}_${index}`, (obj[1] && obj[1] !== null && obj[1] !== undefined) ? obj[1] : '')
			}
			if (criticalDisaster.registerFormType.value >= 2) {
				const tempFrequency = tempBody[index]['frequency']
				let numFre = tempFrequency
				if (typeof tempFrequency === 'object') {
					numFre = tempFrequency.value
				}
				if (typeof numFre !== 'number') setValue(`multiResult_${index}`, '')
				else setValue(`multiResult_${index}`, numFre)

			} else {
				const tempFrequency = tempBody[index]['frequency']
				const tempStrength = tempBody[index]['strength']
		
				let numFre = tempFrequency
				let numStre = tempStrength
		
				if (typeof tempFrequency === 'object') {
					numFre = tempFrequency.value
				}
				if (typeof tempStrength === 'object') {
					numStre = tempStrength.value
				}
		
				if (typeof numFre !== 'number' || typeof numStre !== 'number') setValue(`multiResult_${index}`, '')
				else setValue(`multiResult_${index}`, numFre * numStre)
			}
	
		}
	}, [evaluationContentsBody])

	return (
		<Fragment>
			{
				load ? 
					<Col style={{textAlign:'center'}}><Spinner color='primary'/></Col>
				:
				<>
					<Row>
						{
							!isEmptyObject(evaluationInfo) ?
							<EvaluationInfoAccordion dataInfo={evaluationInfo}/>
							: <></>
						}
					</Row>

					<EvaluationContents
						control={control}
						unregister={unregister}
						setValue={setValue}
						watch={watch}
						errors={errors}
						managerList={managerList}
						dataInfo={dataInfo}
						body={evaluationContentsBody}
						handleSubmit={handleSubmit}
						files={files}
						setFiles={setFiles}
						// itemsYup={itemsYup}
						// setItemsYup={setItemsYup}
						/>
				</>
			}

		</Fragment>
	)
}

export default EvaluationAppDetail