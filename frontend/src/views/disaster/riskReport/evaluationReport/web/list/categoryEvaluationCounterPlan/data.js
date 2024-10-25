import * as yup from 'yup'
import { FREQUENCY_3X3, FREQUENCY_5X5 } from "../../data"

export const ADD_ELEMENT_FIRST = 0
export const ADD_ELEMENT_SECOND = 1
export const ADD_REQUIRED_DESCRIPTION = 6
export const addContentsList = ['addElementFirst_', 'addElementSecond_', 'addFrequency_', 'addStrength_', 'addDangerousness_', 'addManager_', 'addRequiredDescription_', 'addNowAction_', 'addMultiResult_', 'addOptionDescription_', 'addCounterplan_', 'addSchedule_', 'addComplete_', 'addEvaluation_']

export function setResultObj(obj, id, name, result) {
	if (Object.keys(obj).includes(id)) {
		obj[id][name] = null
		obj[id][name] = typeof (result) === 'object' ? result.value : result
	} else {
		obj[id] = {}
		obj[id][name] = null
		obj[id][name] = typeof (result) === 'object' ? result.value : result
	}
}

export function backendFormContents(data, formData) {
	const tempObj = {template:{}, add:{}}
	Object.keys(data).map(row => {
		const [name, id] = row.split('_')
		if (name.includes('add')) setResultObj(tempObj.add, id, name, data[row])
		else setResultObj(tempObj.template, id, name, data[row])
	})
	formData.append('contents', JSON.stringify(tempObj))
}

/** 불필요한 control, select, yup delete */
export function initList(control, unregister, yupData = null, setYupData, selectError = null, setSelectError) {
	const deleteList = Object.keys(control._formValues).filter(key => {
		if (key.includes('_')) return key
	})
	// control 지우기
	deleteList.forEach(key => {
		unregister(key)
		// delete control._formValues[key]
	})

	if (yupData !== null) {
		// yup validation 지우기
		const tempYup = yup.object().shape({...yupData.fields})
		Object.keys(tempYup.fields).map(key => {
			if (deleteList.includes(key)) delete tempYup.fields[key]
		})
		setYupData(tempYup)
	}

	if (selectError !== null) {
		// selectError 지우기
		const tempError = selectError
		Object.keys(tempError).map(key => {
			if (deleteList.includes(key)) delete tempError[key]
		})
		setSelectError(tempError)
	}
}

/** 빈도*강도 결과 출력 */
export function returnResult (id, source, target, e, control, setValue) {
	const check = control._formValues[target]
	const tempResult = (check && check.value !== '' && isNaN(check) && e.value !== '')
		? parseInt(check.value) * e.value
		: ''
	setValue(source, e)
	setValue(source.includes('add') ? `addMultiResult_${id}` : `multiResult_${id}`, tempResult)
}

export const modifyMutiResult = (index, resultFirst, resultSecond, setValue) => {
	console.log(resultFirst)
	console.log(resultSecond)

	setValue(`multiResult_${index}`, 25)
}