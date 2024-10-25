/* eslint-disable */
import { API_DISASTER_EVALUATION_CONTENT, API_EMPLOYEE_LIST } from '@src/constants'
import { setEvaluationEvaluatorId, setEvaluationFormBody, setEvaluationFormIsDone, setEvaluationSelectEvaluator, setEvaluationSelectWorker, setPageType, setRegisterFormType, setTabTempSaveCheck, setEvaluationWorkerModalIsOpen } from '@store/module/criticalDisaster'
import { axiosPostPutCallback, getTableDataCallback, makeSelectList } from '@utils'

import moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, Input, Label, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import Select from 'react-select'

import { NOMAL, evaluationTypeBadge, multResult} from '../../../../data'
import { FooterLine } from '../../../EvaluationForm'
import EvaluationContent from './EvaluationContent'
import EvaluationInfo from './EvaluationInfo'
import { getObjectKeyCheck } from '../../../../../../../../../utility/Utils'
import { API_DISASTER_TEMPLATE_LIST } from '../../../../../../../../../constants'
import { setTemplateId } from '../../../../../../../../../redux/module/criticalDisaster'
import EmployeeTable from '../../../categoryMeeting/form/EmployeeTable'

const inputName = {
    inputDetail: 'element_first',
    selectDanger: 'element_second',
    inputResult: 'required_description',
    inputReason: 'option_description'
}

const selectList = ['selectDanger', 'dangerousness', 'manager']

const EvaluationForm = (props) => {
	const {control, unregister, errors, handleSubmit, setValue, watch, getValues, reset} = props
	const cookies = new Cookies()
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const dispatch = useDispatch()
	// form에 등록된 리스트는 리덕스에 있음.
	const [itemList, setItemList] = useState([]) // 추가 항목 리스트
	const [selectError, setSelectError] = useState({})
	const [managerList, setManagerList] = useState([{label: '선택', value: ''}])
	const [files, setFiles] = useState({})
	const [selectTemplate, setSelectTemplate] = useState({label: '선택', value: ''})
	const [templateData, setTemplateData] = useState([])
	const totlaTitle = criticalDisaster.cdTotalTitle

	function regModReset() {
		setValue('evaluationTitle', '')
		setValue('counterplanTitle', '')
		setValue('scene', '')
		setValue('target','')
		setValue('date',moment().format('YYYY-MM-DD'))
		setValue('department', '')
		setItemList([])
		dispatch(setRegisterFormType({label: '선택', value: ''}))
		Object.keys(control._formValues).forEach(key => {
			if (key.includes('_')) {
				unregister(key)
			}
		})
	}

	//임시 저장후 로직
	function regModCallback(data) {
		dispatch(setEvaluationEvaluatorId(data))
		dispatch(setTemplateId(''))
		if (criticalDisaster.pageType === 'modify') dispatch(setPageType('detail')) // 현재 페이지 타입이 수정일때는 상세페이지로 이동
	}

	// 임시 저장 로직
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

		const tempTotal= [...itemList]

		tempTotal.forEach((value, index) => {
			const tempItem = {}
			for (const row of Object.entries(data)) { 
				const tempLabel = row[0].split('_')[0]
				const tempIndex = row[0].split('_')[1]
				const tempValue = row[1]
				if (typeof value === 'number' && tempIndex !== String(value)) continue // 검색을 위한 조건문
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
				if (filerow[0] !== String(value)) continue
				if (filerow[1]['evaluation'].length === 0) formData.append(`images_${index}_evaluation`, [])
				else {
					for (const file of filerow[1]['evaluation']) {
						formData.append(`images_${index}_evaluation`, file instanceof File ? file : JSON.stringify(file))
					}
				}
				if (filerow[1]['counterplan'].length === 0) formData.append(`images_${index}_counterplan`, [])
				else {
					for (const file of filerow[1]['counterplan']) {
						formData.append(`images_${index}_counterplan`, file instanceof File ? file : JSON.stringify(file))
					}
				}
			}
		})
		// return
		axiosPostPutCallback(regMod, '위험성평가', API, formData, regModCallback)
		dispatch(setTabTempSaveCheck(true))
	}

	const settingManagerList = (data) => {
		makeSelectList(true, '', data, managerList, setManagerList, ['name'], 'id')
	}

	// 양식 선택 이벤트 처리
	const setTemlate = (item) => {
		dispatch(setTemplateId(''))
		const tempObject = {label:item.label, value:item.type}
		setSelectTemplate(tempObject)
		dispatch(setRegisterFormType(tempObject)) // label 양식명 , value 양식 타입
		if ('evaluation' in item) { // 사용중인 양식 선택시 분기 분리
			dispatch(setEvaluationEvaluatorId(Number(item.evaluation)))
			return
		}
		dispatch(setTemplateId(item.value))
	}

	// select에서 순수한 양식을 선택 했을때
	useEffect(() => {
		if (criticalDisaster.templateId !== '') {
			getTableDataCallback(API_DISASTER_EVALUATION_CONTENT, {templateId: criticalDisaster.templateId}, (data) => {
				Object.keys(control._formValues).forEach(key => {
					if (key.includes('_')) {
						unregister(key)
					}
				})
				const tempItems = getObjectKeyCheck(data, 'items')
				const itemsLen = tempItems.length
				setItemList([...Array(itemsLen).keys()])
				dispatch(setEvaluationFormBody(data.items))
				setFiles({})
			})
		}
	}, [criticalDisaster.templateId])

	// 임시저장하거나 수정상태 일때는 id가 존재함. 그때 훅
	// 아이디가 있을때 backend response callback
	useEffect(() => {
        const evaluationEvaluatorId = criticalDisaster.evaluationEvaluatorId
        if (evaluationEvaluatorId !== '' && typeof evaluationEvaluatorId === 'number' && criticalDisaster.templateId === '') {
            getTableDataCallback(
				`${API_DISASTER_EVALUATION_CONTENT}/${criticalDisaster.evaluationEvaluatorId}`,{}, 
				(data) => {
					Object.keys(control._formValues).forEach(key => {
						if (key.includes('_')) {
							unregister(key)
						}
					})
			
					setValue('evaluationTitle', data.info.evaluation_title)
					setValue('counterplanTitle', data.info.counterplan_title)
					setValue('scene', data.info.scene)
					setValue('target', data.info.target)
					setValue('date', data.info.date)
					setValue('department', data.info.department)
			
					const tempObject = {label:`${data.info.evaluation_title} (사용중)`, value:data.info.form_type}
					setSelectTemplate(tempObject)
					dispatch(setRegisterFormType(tempObject))
			
					dispatch(setEvaluationSelectWorker(data.worker_list))
			
					const tempItems = getObjectKeyCheck(data, 'contents')
					const itemsLen = tempItems.length
					setItemList([...Array(itemsLen).keys()])
			
					dispatch(setEvaluationFormBody(data.contents))
					
					const evaluationType = data.info.form_type
					const tempFiles = {}
					const copyList = [...data.contents]
					copyList.map((row, index) => {
						const tempResult = multResult(evaluationType, row.frequency.value, row.strength.value)
						if (tempResult !== false && tempResult >= NOMAL) {
							tempFiles[index] = {
								evaluation: row.images.evaluation,
								counterplan: row.images.counterplan
							}
						}
					})
					setFiles(tempFiles)
				}
			) // getTableDataCallback end

			const templateParam = {
				property: cookies.get('property').value,
				search: '',
				evaluatorId: criticalDisaster.evaluationEvaluatorId
			}
			getTableDataCallback(API_DISASTER_TEMPLATE_LIST, templateParam, (data) => {
				setTemplateData(data)
			})
        }
    }, [criticalDisaster.evaluationEvaluatorId, criticalDisaster.templateId])

	// 처음 랜더링 
	useEffect(() => {
		const param = {
			propId :  cookies.get('property').value,
			employeeClass : '',
			employeeLevel : '',
			employeeStatue : '',
			search : ''
		}
		getTableDataCallback(API_EMPLOYEE_LIST, param, settingManagerList)

		const evaluationEvaluatorId = criticalDisaster.evaluationEvaluatorId
		if (evaluationEvaluatorId === '') {
			setValue('evaluationTitle', `${totlaTitle}-위험성평가-${moment().format('YYYY-MM-DD')}`)
			setValue('counterplanTitle', `${totlaTitle}-예방대책-${moment().format('YYYY-MM-DD')}`)
			const templateParam = {
				property: cookies.get('property').value,
				search: ''
			}
			
			// 양식 목록 만드는 func
			getTableDataCallback(API_DISASTER_TEMPLATE_LIST, templateParam, (data) => { 
				const tempList = [...data]
				const templateList = []
				tempList.forEach(template => templateList.push({label: template.title, value: template.id, type: template.type_id}))
				setTemplateData(templateList)
			})
		}
	}, [])

	useEffect(() => {
		console.log("criticalDisaster.evaluationSelectWorker", criticalDisaster.evaluationSelectWorker)
	}, [criticalDisaster])

	return (
		<Fragment>
			<Form onSubmit={handleSubmit(handleTempSave)}>
				<Card>
					<CardHeader>
						<Controller
							name="evaluationTitle"
							control={control}
							render={({ field: {onChange, value} }) => (
								<Row className='w-100' style={{alignItems:'center'}}>
									<Col md={9} xs={9} style={{display:'flex'}}>
										<Input 
											className='risk-report title-input'
											bsSize='lg' 
											placeholder='위험성 평가 제목을 입력하세요.'
											onChange={ e => {
												onChange(e)
												dispatch(setTabTempSaveCheck(false))
											}}
										/>
									</Col>
									<Col xs={3} style={{padding:0}}>
										{evaluationTypeBadge[criticalDisaster.registerFormType.value]}
									</Col>
								</Row>
						)}/>
					</CardHeader>

					<EvaluationInfo
						control={control}
					/>

					<CardBody>
						<Row className='mt-2'>
							<Col lg={4} md={12} xs={12}>
								<Label className='risk-report text-lg-bold'>평가양식</Label> 
								<Select
									name={`template`}
									classNamePrefix='select'
									className={`react-select`}
									placeholder='위험성 평가 양식을 선택해주세요.'
									onChange={ (e) => { 
										setTemlate(e)
										dispatch(setTabTempSaveCheck(false))
									}}
									value={selectTemplate}
									options={templateData}
									menuPortalTarget={document.body}
									styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
								/>
							</Col>
						</Row>
					</CardBody>

					<EvaluationContent
						control={control}
						unregister={unregister}
						setValue={setValue}
						watch={watch}
						errors={errors}
						selectError={selectError}
						setSelectError={setSelectError}
						itemList={itemList}
						setItemList={setItemList}
						managerList={managerList}
						getValues={getValues}
						reset={reset}
					/>
					
					<Row className='ms-1'>
						<Row className="card_table">
							<Col className='card_table col text py-0'>
								<Label className='risk-report text-lg-bold'>작업자 명단</Label>
								<Button color="skyblue" className='ms-1' size="sm" onClick={() => dispatch(setEvaluationWorkerModalIsOpen(true))}>직원 선택</Button>
							</Col>
						</Row>
						<EmployeeTable 
							title='작업자'
							isOpen={criticalDisaster.evaluationWorkerModalIsOpen}
							setIsOpen={setEvaluationWorkerModalIsOpen}
							cookies={cookies}
							selectPartner={criticalDisaster.evaluationSelectWorker}
							setSelectPartner={setEvaluationSelectWorker}
							setAttendState={undefined}
						/>
					</Row>

					<CardFooter>
						<FooterLine
							handleSubmit={handleSubmit}
							reset={regModReset}
							tempSave={handleTempSave}
						/>
					</CardFooter>
				</Card>
			</Form>
		</Fragment>
	)
}

export default EvaluationForm