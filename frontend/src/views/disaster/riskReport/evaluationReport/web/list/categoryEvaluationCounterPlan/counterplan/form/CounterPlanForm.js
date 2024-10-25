/* eslint-disable */
import Arrow from '@src/assets/images/arrow.png'
import { API_DISASTER_EVALUATION_CONTENT } from '@src/constants'
import { setEvaluationEvaluatorId, setEvaluationSelectEvaluator, setEvaluationSelectWorker, setPageType, setTabTempSaveCheck } from '@store/module/criticalDisaster'
import { axiosPostPutCallback, getTableDataCallback } from '@utils'

import { Fragment, useEffect, useRef, useState } from "react"
import { Controller } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardBody, CardFooter, CardHeader, Col, Form, Input, Row } from "reactstrap"
import Cookies from 'universal-cookie'

import { setEvaluationFormBody, setRegisterFormType, setTab } from '../../../../../../../../../redux/module/criticalDisaster'
import { axiosSweetAlert } from '../../../../../../../../../utility/Utils'
import { NOMAL, multResult } from '../../../../data'
import { FooterLine } from '../../../EvaluationForm'
import ContentCounterPlan from './ContentCounterPlan'
import ContentEvaluation from "./ContentEvaluation"

// //첫 랜더링에서 effect 효과 막기
const useDidMountEffect = (func, deps) => {
	const didMount = useRef(false)
  
	useEffect(() => {
	  if (didMount.current) func()
	  else didMount.current = true
	}, deps)
}// useDidMountEffect end

const inputName = {
    inputDetail: 'element_first',
    selectDanger: 'element_second',
    inputResult: 'required_description',
    inputReason: 'option_description'
}

const selectList = ['selectDanger', 'dangerousness', 'manager']

const CounterPlanForm = (props) => {
	const {control, handleSubmit, setValue, watch} = props
	const cookies = new Cookies()
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const dispatch = useDispatch()
	const [checkTempSave, setCheckTempSave] = useState(false)
	const [dataList, setDataList] = useState([])
	const [files, setFiles] = useState({})
	const [submitResult, setSubmitResult] = useState(false)

	function reset() {
		setValue('counterplanTitle', '')
	}

	function regModCallback(data) {
		setCheckTempSave(true)
		dispatch(setEvaluationEvaluatorId(data))
		if (criticalDisaster.pageType === 'modify') dispatch(setPageType('detail')) // 현재 페이지 타입이 수정일때는 상세페이지로 이동
	}

	function handleTempSave(data) {

		const regMod = criticalDisaster.evaluationEvaluatorId === '' ? 'register' : 'modify'
		const API = regMod === 'register' ? `${API_DISASTER_EVALUATION_CONTENT}/-1` : `${API_DISASTER_EVALUATION_CONTENT}/${criticalDisaster.evaluationEvaluatorId}`

		const formData = new FormData()
		formData.append('critical_disaster', criticalDisaster.evaluationId)
		formData.append('worker_list', JSON.stringify(criticalDisaster.evaluationSelectWorker))
		formData.append('form_type', criticalDisaster.registerFormType.value)
		formData.append('evaluation_title', data.evaluationTitle ? data.evaluationTitle : '')
		formData.append('counterplan_title', data.counterplanTitle? data.counterplanTitle : '')
		formData.append('scene', data.scene? data.scene : '')
		formData.append('target', data.target? data.target : '')
		formData.append('date', data.date? data.date : '')
		formData.append('department', data.department? data.department : '')
		formData.append('manager', cookies.get('userId'))

		delete data['evaluationTitle']
		delete data['counterplanTitle']
		delete data['scene']
		delete data['target']
		delete data['date']
		delete data['department']

		const tempTotal= [...criticalDisaster.evaluationFormBody]

		tempTotal.forEach((_, index) => {
			const tempItem = {}
			for (const row of Object.entries(data)) { // index를 찾고 달라지면 break 걸면 성능이 좀더 좋아짐.
				const tempLabel = row[0].split('_')[0]
				const tempIndex = row[0].split('_')[1]
				const tempValue = row[1]
				if (tempIndex !== String(index)) continue // 검색을 위한 조건문
				if (selectList.includes(tempLabel)) {
					if (tempLabel in inputName) tempItem[inputName[tempLabel]] = tempValue ? tempValue.value : ''
					else tempItem[tempLabel] = tempValue ? tempValue.value : ''
					continue
				}
				if (tempLabel in inputName) {
					tempItem[inputName[tempLabel]] = tempValue ? tempValue : ''
					continue
				}
				tempItem[tempLabel] = tempValue ? tempValue : ''
			}

			tempItem['view_order'] = index // 입력순서 지키기 위한 변수
			formData.append('contents', JSON.stringify(tempItem))
			
			// 첨부파일
			for (const filerow of Object.entries(files)) {
				if (filerow[0] !== String(index)) continue
				if (filerow[1]['evaluation'].length === 0) formData.append(`images_${filerow[0]}_evaluation`, [])
				else {
					for (const file of filerow[1]['evaluation']) {
						formData.append(`images_${filerow[0]}_evaluation`, file instanceof File ? file : JSON.stringify(file))
					}
				}
				if (filerow[1]['counterplan'].length === 0) formData.append(`images_${filerow[0]}_counterplan`, [])
				else {
					for (const file of filerow[1]['counterplan']) {
						formData.append(`images_${filerow[0]}_counterplan`, file instanceof File ? file : JSON.stringify(file))
					}
				}
			}
		})

		axiosPostPutCallback(regMod, '예방대책', API, formData, regModCallback)

		dispatch(setTabTempSaveCheck(true))
	}

	function getModifyData(data) {
		const evaluationType = data.info.form_type
		const tempFiles = {}
		// info 정보
		if (data.worker_list.length === 0) dispatch(setEvaluationSelectWorker([]))
		else dispatch(setEvaluationSelectWorker(data.worker_list))
		
		dispatch(setEvaluationSelectEvaluator([]))
		setValue('evaluationTitle', data.info.evaluation_title)
		setValue('counterplanTitle', data.info.counterplan_title)
		setValue('scene', data.info.scene)
		setValue('target', data.info.target)
		setValue('date', data.info.date)
		setValue('department', data.info.department)

		dispatch(setRegisterFormType({label:`${data.info.evaluation_title} (사용중)`, value:data.info.form_type}))
		dispatch(setEvaluationFormBody(data.contents))

		// 위험성 높은 내용 필터링
		const tempEvaluationList = []
		const copyList = [...data.contents]
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

		setDataList(tempEvaluationList)
		setFiles(tempFiles)
	}

	useEffect(() => {
		if (!criticalDisaster.evaluationFormBody || criticalDisaster.evaluationFormBody.length <= 0) return
		Object.keys(control._formValues).forEach(key => {
			if (key.includes('_')) {
				setValue(key, '')
			}
		})

		const tempBody = [...criticalDisaster.evaluationFormBody]
		for (const index in tempBody) {
			for (const obj of Object.entries(tempBody[index])) {
                setValue(`${obj[0]}_${index}`, (obj[1] && obj[1] !== null && obj[1] !== undefined) ? obj[1] : '')
			}
		}
	}, [criticalDisaster.evaluationFormBody])

	useEffect(() => {
		const evaluationEvaluatorId = criticalDisaster.evaluationEvaluatorId
		if (evaluationEvaluatorId !== '' && typeof (evaluationEvaluatorId) === 'number') {
			getTableDataCallback(`${API_DISASTER_EVALUATION_CONTENT}/${evaluationEvaluatorId}`,{}, getModifyData)
			return
		}
		axiosSweetAlert('평가 미등록', '위험성 평가를 저장하지 않았습니다.', 'warning', 'right', setSubmitResult)
	}, [criticalDisaster.evaluationEvaluatorId])

	useEffect(() => {
		if (submitResult) {
			dispatch(setTab('education'))
		}
	}, [submitResult])

	useDidMountEffect(() => {
		if (criticalDisaster.evaluationEvaluatorId !== '' && dataList.length <= 0) {
			axiosSweetAlert('예방 대책 미필요', '위험 및 보안 등급의 항목이 존재하지 않습니다.', 'warning', 'right', setSubmitResult)
		}
	}, [dataList])

	return (
		<Fragment>
			<Form>
				<Card>
					<CardHeader>
						<Controller
							name="counterplanTitle"
							control={control}
							render={({ field: {onChange, value} }) => (
								<Row style={{alignItems:'center', width:'100%'}}>
									<Col md={9} xs={9}>
										<Input 
											className='risk-report title-input'
											bsSize='lg'  
											placeholder='예방 대책 제목을 입력하세요.'
											onChange={e => {
												onChange(e)
												dispatch(setTabTempSaveCheck(false))
											}}
											value={value}
										/>
									</Col>
								</Row>
						)}/>
					</CardHeader>

					<CardBody>
						{
							dataList.length !== 0 ? dataList.map((row, idx) => {
								return (
									<Row key={idx}>
										<Col xl={6} lg={6} md={12} xs={12}>
											<ContentEvaluation
												num = {idx + 1}
												data = {row}
												control={control}
												setValue={setValue}
												watch={watch}
												setFiles={setFiles} 
												files={files}/>
										</Col>
										<Col xl={1} lg={1} md={12} xs={12} className='risk-report custom-img-rotate' style={{padding:'0', display:'flex', justifyContent:'center', alignItems:'center'}}>
											<img src={Arrow}/>
										</Col>
										<Col xl={5} lg={5} md={12} xs={12}>
											<ContentCounterPlan
												num = {idx + 1}
												data = {row}
												control={control}
												setValue={setValue}
												watch={watch}
												setFiles={setFiles} 
												files={files}/>
										</Col>
									</Row>
								)
							}) 
							: 
							<Row className='mx-0 my-1'>
								<Col className='py-3 border-left card_table text center risk-report title-bold border-all'>
									예방 대책 미필요
								</Col>
							</Row>
						}
					</CardBody>

					<CardFooter>
						<FooterLine
							handleSubmit={handleSubmit}
							reset={reset}
							tempSave={handleTempSave}
							checkSave={checkTempSave}
						/>
					</CardFooter>
				</Card>
			</Form>
		</Fragment>
	)
}

export default CounterPlanForm