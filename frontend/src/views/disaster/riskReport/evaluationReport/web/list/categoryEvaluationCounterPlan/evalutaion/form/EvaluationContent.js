/* eslint-disable */
import { API_DISASTER_TEMPLATE_EVALUATION_LIST } from "@src/constants"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { getTableDataCallback } from "@utils"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CardBody, Col, Label, Row, Table } from "reactstrap"

import { CHECKLIST, FREQUENCY_3X3, FREQUENCY_5X5, STEP_3, typeSelectList } from "../../../../data"
import { Frequency } from "./EvaluationContentFrequency"
import EvaluationContentHead from "./EvaluationContentHead"
import { Step3 } from "./EvaluationContent3Step"
import { setTabTempSaveCheck } from '@store/module/criticalDisaster'

const EvaluationContent = (props) => {
	const {
		control, setValue, watch, unregister, 
		managerList, getValues, itemList, setItemList
	} = props
	
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const dispatch = useDispatch()
	const type = criticalDisaster.registerFormType.value

	// options state
	const [max, setMax] = useState(criticalDisaster.evaluationFormBody.length) // id 겹침 방지용
	const [selectList, setSelectList] = useState([])
	const [dangerSelectList, setDangerSelectList] = useState([])

	// insert prototype
	Array.prototype.insert = function (index, ...items) {
		this.splice(index+1, 0, ...items)
	}

	// delete prototype
	Array.prototype.delete = function (index) {
		this.splice(index, 1)
	}

	// useform unregister func
	function itemUnregister(value, unregister) {
		Object.keys(control._formValues).forEach(key => {
			if (key.includes('_')) {
				const sIndex = key.split('_')
				if (Number(sIndex[1]) === value) {
					unregister(key)
				}
			}
		})
	}

	/** add event */ 
	function addItem(index) {
		const copyList = [...itemList]
		const valueMax = max + 1
		copyList.insert(index, valueMax) // 요소 증가
		setItemList(copyList)
		setMax(valueMax)
		dispatch(setTabTempSaveCheck(false))
	}

	 /** item remove 이벤트 */ 
	function removeItem(index) {
		const copyList = [...itemList]
		itemUnregister(copyList[index], unregister) // useForm unregister
		copyList.delete(index) // 삭제
		setItemList(copyList)
		dispatch(setTabTempSaveCheck(false))
	}

	function getDataInitCallback(data) {
		const copyDanger = data.danger
		const tempDanger = []
		for (const danger of copyDanger) {
			const temp = {label: danger.name, value: danger.id}
			tempDanger.push(temp)
		}
		setDangerSelectList(tempDanger)
	}

	useEffect(() => {
		if (!criticalDisaster.evaluationFormBody || criticalDisaster.evaluationFormBody.length <= 0) return
		Object.keys(control._formValues).forEach(key => {
			if (key.includes('_')) {
				setValue(key, '')
			}
		})

		setMax(criticalDisaster.evaluationFormBody.length)

		const tempBody = [...criticalDisaster.evaluationFormBody]
		for (const index in tempBody) {
			for (const obj of Object.entries(tempBody[index])) {
				setValue(`${obj[0]}_${index}`, (obj[1] && obj[1] !== null && obj[1] !== undefined) ? obj[1] : '')
			}
		}
	}, [criticalDisaster.evaluationFormBody])

	useEffect(() => {
		if (criticalDisaster.registerFormType.value !== '') {
			setSelectList(typeSelectList[criticalDisaster.registerFormType.value])
		}
	}, [criticalDisaster.registerFormType.value])

	useEffect(() => {

		getTableDataCallback(API_DISASTER_TEMPLATE_EVALUATION_LIST, {}, getDataInitCallback)
	}, [criticalDisaster.registerFormType])

	return (
		<CardBody>
			<Col style={{display:'flex', alignItems:'end'}}>
				<Label className='risk-report text-lg-bold'>평가 내용</Label>
				&nbsp;
				&nbsp;
				{
					(criticalDisaster.registerFormType.value === FREQUENCY_3X3 || criticalDisaster.registerFormType.value === FREQUENCY_5X5) &&
					<div style={{color:'#7A97C2'}}>현재 위험성은 입력된 빈도•강도값이 곱해져 자동 계산됩니다.</div>
				}
			</Col>
			<Table responsive className="mb-2 electric-table" style={{maxHeight:'750px'}}>
					<EvaluationContentHead/>
					<tbody>
						{ (type === FREQUENCY_3X3 || type === FREQUENCY_5X5) ?
							<Frequency
								type={type}
								control={control}
								watch={watch}
								setValue={setValue}
								itemList={itemList}
								setItemList={setItemList}
								selectList={selectList}
								managerList={managerList}
								dangerSelectList={dangerSelectList}
								getValues={getValues}
								clickAddButton={addItem}
								clickDeleteButton={removeItem}
							/>
							:
							(type === STEP_3 || type === CHECKLIST) ?
							<Step3
								type={type}
								control={control}
								watch={watch}
								setValue={setValue}
								itemList={itemList}
								setItemList={setItemList}
								selectList={selectList}
								managerList={managerList}
								getValues={getValues}
								clickAddButton={addItem}
								clickDeleteButton={removeItem}
							/>
							:
							<tr style={{border:'none'}}>
								<td className='px-0' style={{border:'none'}}>
									<Row className='mx-0'>
										<Col className='py-3 border-left card_table text center risk-report text-bold border-all'>
											평가 양식을 선택해주세요.
										</Col>
									</Row>
								</td>
							</tr>
						}
					</tbody>
			</Table>
		</CardBody>
	)
}

export default EvaluationContent