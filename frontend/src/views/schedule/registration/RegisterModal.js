import Select from 'react-select'
import { Fragment, useEffect, useState } from "react"
import * as moment from 'moment'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Flatpickr from "react-flatpickr"
import Swal from "sweetalert2"
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import InputNumber from 'rc-input-number'
import '@styles/react/libs/input-number/input-number.scss'
import { Plus, Minus } from 'react-feather'
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import { API_SCHEDULE_REGISTRAION, API_INSPECTION_CHECKLIST_FORMS, API_SCHEDULE_DETAIL, ROUTE_INSPECTION_INSPECTION_FORM_LIST, ROUTE_SCHEDULE_REGISTRATION, ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM_LIST } from "../../../constants"
import axios from "../../../utility/AxiosConfig"
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import winLogoImg from '@src/assets/images/winlogo.png'
import { checkSelectValue, setStringDate, getTableData, primaryColor, getTableDataCallback } from '../../../utility/Utils'
import Cookies from 'universal-cookie'
import { maintenanceList, weekdaysData, checkSelectValueObj, WeeklyDaysButton, dayFormatList, weekdayKr, completeResultToListAlert, numberToChangeKr, numToWeek } from '../data'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import CustomHelpCircle from '../../apps/CustomHelpCircle'

const RegisterModal = (props) => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const [templateList, setTemplateList] = useState([{label : '선택', value : ''}])
	const navigate = useNavigate()

	const defaultValues = {
		// start_date : '',
		choiceInput : 1,
		template : templateList[0],
		maintenanceCycle : maintenanceList[0],
		lastDateChocie : dayFormatList[0],
		dateChocie : dayFormatList[0],
		dateChoicePicker : [],
		dayFirst : false,
		daySecond : false,
		dayThird : false,
		dayFourth : false,
		dayLast : false,
		lastDay : false,
		lastDayBeforAfter : 'beforeDay'
		
	}
	const {isOpen, setIsOpen, state, setState, rowId, type} = props
	
	const [detailData, setDetailData] = useState([])

	const validationSchema = yup.object().shape({
		start_date : yup.array().test('isNonEmpty', '기간을 입력해주세요.', function(value) {
			if (value === null) {
				return true
			}
			return value
		}).nullable()
	})

	const [choice, setChoice] = useState(false)
	const [dateChoice, setDateChoice] = useState(false)
	const [dayChoice, setDayChoice] = useState(false)

	const [picker, setPicker] = useState('')
	const [pickerState, setPickerState] = useState(false)
	const [weekdays, setWeekdays] = useState(weekdaysData)
	const [weekdayState, setWeekdayState] = useState('disabled')
	const [calenderState, setCalenderState] = useState(false)
	const [selectError, setSelectError] = useState({template: false, maintenanceCycle : false})
	const {template, maintenanceCycle} = selectError

	const [dayState, setDayState] = useState({
		dayFirst : false,
		daySecond : false,
		dayThird : false,
		dayFourth : false,
		dayLast : false
	})

	const [resolver, setResolver] = useState(validationSchema)

	// const koreanWeekdays = {
	// 	shorthand: ['일', '월', '화', '수', '목', '금', '토'],
	// 	longhand: [
	// 	  '일요일',
	// 	  '월요일',
	// 	  '화요일',
	// 	  '수요일',
	// 	  '목요일',
	// 	  '금요일',
	// 	  '토요일'
	// 	]
	//   }
	
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		resetField,
		getValues,
		watch,
		setValue
	} = useForm({
		defaultValues,
		resolver: yupResolver(resolver)
	})
	const checkboxReset = () => {
		setValue('dayFirst', false)
		setValue('daySecond', false)
		setValue('dayThird', false)
		setValue('dayFourth', false)
		setValue('dayLast', false)
		setValue('lastDay', false)
		setValue('choiceInput', 1)
		setValue('dateChoicePicker', [''])
		resetField('lastDateChocie')
		resetField('dateChocie')
	}
	
	const handleSelectTemplate = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

	const checkPicker = (data) => {
		const copyWeekDays = {...weekdaysData}
		if (data[0] !== "" || state === 'modify') {
			setPickerState(true)
			let dayTemp = null
			if (state === 'modify') {
				dayTemp = moment(data).day()
			} else {
				dayTemp = moment(data[0]).day()
			}
			// moment의 day로 숫자를 뽑은 후, Week로 변환
			const day = numToWeek[dayTemp]
			setPicker(day)
			setWeekdays({
				...copyWeekDays,
				[day] : true
			})
		} else {
			setPickerState(false)
		}
	}

	const handleSelectValidation = (e, event) => {
		checkboxReset()
		if (e.value === 'everyWeek') {
			// setChoiceFormat('주마다(선택)') // 선택입력의 텍스트 
			setCalenderState(false) //날짜 선택의 nocalender 옵션
			setDateChoice(false) // 점검주기 - 매월(날짜 선택)시 날짜선택/특정일 선택 boolean
			setDayChoice(false) // 점검주기 - 매월(요일 선택)시 첫번째,두번쨰,세번쨰,네번쨰,마지막 boolean
			setChoice(true) // 반복 주기의 숫자 
			setWeekdayState('able')
			setWeekdays({
				...weekdaysData,
				[picker] : true
			})
			const selectErrorTemp = {template: false, maintenanceCycle : false}
			checkSelectValue(e, event, selectErrorTemp, setSelectError, setValue)
			setResolver(validationSchema)
		} else if (e.value === 'everyday') {
			// setChoiceFormat('일마다') // 선택입력의 텍스트 
			setCalenderState(false) //날짜 선택의 nocalender 옵션
			setDateChoice(false) // 점검주기 - 매월(날짜 선택)시 날짜선택/특정일 선택 boolean
			setDayChoice(false) // 점검주기 - 매월(요일 선택)시 첫번째,두번쨰,세번쨰,네번쨰,마지막 boolean
			setChoice(true) // 반복 주기의 숫자 
			setWeekdayState('disabled')
			setWeekdays(weekdaysData)

			const selectErrorTemp = {template: false, maintenanceCycle : false}
			checkSelectValue(e, event, selectErrorTemp, setSelectError, setValue)

			setResolver(validationSchema)
		} else if (e.value === 'everyMonthDate') {
			const updateResolver = yup.object().shape({
				...validationSchema.schema,
				...validationSchema.fields,
				dateChoicePicker : yup.array().test('isNonEmpty', '날짜 또는 특정일을 선택해주세요.', function(value) {
					if (value.includes("") || value.length === 0) {
						return false // 유효성 검사 실패 
					}
					return true // 유효성 검사 통과
				}),
				lastDay : yup.array().test('isNonEmpty', '날짜 또는 특정일을 선택해주세요.', function(value) {
					if (state === 'modify' && value === null) {
						return true
					}
					return value // 유효성 검사 통과
				}).nullable()
			})
			setResolver(updateResolver)

			// setChoiceFormat('개월마다') // 선택입력의 텍스트 
			setCalenderState(true) //날짜 선택의 nocalender 옵션
			setDateChoice(true) // 점검주기 - 매월(날짜 선택)시 날짜선택/특정일 선택 boolean
			setDayChoice(false) // 점검주기 - 매월(요일 선택)시 첫번째,두번쨰,세번쨰,네번쨰,마지막 boolean
			setChoice(true) // 반복 주기의 숫자 
			setWeekdayState('disabled')
			setWeekdays(weekdaysData)
			const selectErrorTemp = {template: false, maintenanceCycle : false}
			checkSelectValue(e, event, selectErrorTemp, setSelectError, setValue)
		} else if (e.value === 'everyMonthDay') {
			const updateResolver = yup.object().shape({
				...validationSchema.schema,
				...validationSchema.fields,
				dayFirst : yup.boolean().test('atLeastOneChecked', '하나 이상 선택하세요.', function () {
					const checkboxes = ['dayFirst', 'daySecond', 'dayThird', 'dayFourth', 'dayLast']
					const atLeastOneChecked = checkboxes.some((checkbox) => dayState[checkbox])
					if (!atLeastOneChecked) {
					  return false // 유효성 검사 실패 (오류 발생)
					}
					return true // 유효성 검사 통과
				})
			})
			setResolver(updateResolver)
			// setChoiceFormat('개월마다') // 선택입력의 텍스트 
			setCalenderState(false) //날짜 선택의 nocalender 옵션
			setDateChoice(false) // 점검주기 - 매월(날짜 선택)시 날짜선택/특정일 선택 boolean
			setDayChoice(true)  // 점검주기 - 매월(요일 선택)시 첫번째,두번쨰,세번쨰,네번쨰,마지막 boolean
			setChoice(true) // 반복 주기의 숫자 
			setWeekdayState('able')
			setWeekdays({
				...weekdaysData,
				[picker] : true
			})
			const selectErrorTemp = {template: false, maintenanceCycle : false}
			checkSelectValue(e, event, selectErrorTemp, setSelectError, setValue)
		} else {
			setCalenderState(false) //날짜 선택의 nocalender 옵션
			setDateChoice(false) // 점검주기 - 매월(날짜 선택)시 날짜선택/특정일 선택 boolean
			setDayChoice(false) // 점검주기 - 매월(요일 선택)시 첫번째,두번쨰,세번쨰,네번쨰,마지막 boolean
			setChoice(true) // 반복 주기의 숫자 
			setWeekdayState('disabled')
			setWeekdays(weekdaysData)
			const selectErrorTemp = {template: false, maintenanceCycle : false}
			checkSelectValue(e, event, selectErrorTemp, setSelectError, setValue)
			if (state !== 'modify') {
				setResolver(validationSchema)
			}
		}
	}

	const customToggle = () => {
		reset()
		setDetailData([])
		checkboxReset()
		setPickerState(false)
		setChoice(false)
		setDateChoice(false)
		setCalenderState(false)
		setWeekdayState('disabled')
		setSelectError({template: false, maintenanceCycle : false})
		setState('')
		setIsOpen(!isOpen)
	}

	const onSubmit = (data) => {
		const check = checkSelectValueObj(control, selectError, setSelectError, choice)
		if (!check) { return false }
		Swal.fire({
			icon: "warning",
			titleText : `업무 일정을 ${state === 'modify' ? '수정' : '등록'}하시겠습니까?`,
			text: "기간 내 문서 중 결재 내역이 없는 경우 해당 일지가 초기화되며 이는 작성이 완료된 문서에는 영향을 끼치지 않습니다.",
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonText: "취소",
			// cancelButtonColor : '#FF9F43',
			confirmButtonText: '확인',
			confirmButtonColor : primaryColor,
			reverseButtons :true,
			customClass: {
				actions: 'sweet-alert-custom right',
				cancelButton: 'me-1'
			}
		}).then((result) => {
			if (result.isConfirmed) {
				const formData = new FormData()
				formData.append('start_date', data['start_date'] === null ? detailData.start_datetime : data['start_date'][0]) //시작일
				formData.append('template', data['template'].value) //양식선택
				formData.append('maintenanceCycle', data['maintenanceCycle'].value) //점검주기
				formData.append('user', cookies.get('userId'))
				let temp = {}
				// choiceInput => 선택입력 숫자
				// weekdays => 요일선택에 일월화수목금토 버튼
				// dayState => 요일선택에 첫번째 두번째 ...
				// lastDay => 마지막날 체크박스
				// dateChoicePicker => 날짜 선택의 picker
				// dateChocie => 날짜 선택의 드롭다운
				// lastDateChocie => 특정일 선택의 드롭다운
				// lastDayBeforAfter => 29,30,31일 선택시에 나오는 특수 라디오 버튼 
				if (data['maintenanceCycle'].value === 'everyday') { // 매일
					temp = {choiceInput : data['choiceInput']}
				} else if (data['maintenanceCycle'].value === 'everyWeek') { //매주
					temp = {choiceInput : data['choiceInput'], weekdays : weekdays}
				} else if (data['maintenanceCycle'].value === 'everyMonthDay') { //매월(요일선택)
					temp = {choiceInput : data['choiceInput'], weekdays : weekdays, dayState : dayState}
				} else if (data['maintenanceCycle'].value === 'everyMonthDate') { //매월(날짜 선택)
					const pickerListTemp = []
					if (data['dateChoicePicker'][0] !== '') {
						data['dateChoicePicker'].map((item) => {
							const tempDay = moment(item).format("DD")
							pickerListTemp.push(tempDay)
						})
					}
					temp = {
						choiceInput : data['choiceInput'], 
						lastDay : data['lastDay'], 
						dateChoicePicker : pickerListTemp, 
						lastDateChocie : data['lastDateChocie'].value,
						dateChocie : data['dateChocie'].value,
						lastDayBeforAfter : data['lastDayBeforAfter']
					}
				}
				
				formData.append('result', JSON.stringify(temp)) //주기 결과값
				if (state === 'modify') {
					axios.put(`${API_SCHEDULE_DETAIL}/${rowId}`, formData, {
						headers: {
							"Content-Type": "multipart/form-data"
						}
					}).then(res => {
						if (res.status === 200) {
							const listUrl = type === 'inspection' ? `${ROUTE_SCHEDULE_REGISTRATION}/inspection` : `${ROUTE_SCHEDULE_REGISTRATION}/disaster`
							completeResultToListAlert('수정을', navigate, listUrl)
						}
					}).catch(res => {
						console.log(res, "!!!!!!!!error")
					})
				} else {
					axios.post(API_SCHEDULE_REGISTRAION, formData, {
						headers: {
							"Content-Type": "multipart/form-data"
						}
					}).then(res => {
						if (res.status === 200) {
							const listUrl = type === 'inspection' ? `${ROUTE_SCHEDULE_REGISTRATION}/inspection` : `${ROUTE_SCHEDULE_REGISTRATION}/disaster`
							completeResultToListAlert('등록을', navigate, listUrl)
						}
					}).catch(res => {
						console.log(res, "!!!!!!!!error")
					})
				}
				customToggle()
			}
		})
		
	}

	const everyMonthClick = (data) => {
		if (data === 'picker') {
			const updateResolver = yup.object().shape({
				...validationSchema.schema,
				...validationSchema.fields,
				dateChoicePicker : yup.array().test('isNonEmpty', '날짜를 선택해주세요.', function(value) {
					if (value.includes("") || value.length === 0) {
						return false // 유효성 검사 실패
					}
					return true // 유효성 검사 통과
				})
			})
			setResolver(updateResolver)
			setSelectError({template: false, maintenanceCycle : false, dateChocie : false})
			resetField('lastDay')
			resetField('lastDateChocie')
			
		} else if (data === 'check') {
			setResolver(validationSchema)
			setSelectError({template: false, maintenanceCycle : false, lastDateChocie : false})
			setValue('dateChoicePicker', [''])
			resetField('dateChocie')
		}
		setValue("result", "")
	}

	const reusltInput = () => {
		// 선택 ex) 내용없음
		const cycleValue = getValues('maintenanceCycle').value
		if (cycleValue === "everyday") {
			let tempChoiceInput = '매일'
			if (watch('choiceInput') !== 1) {
				tempChoiceInput = `${watch('choiceInput')}일마다`
			}
			setValue("result", tempChoiceInput)
		} else if (cycleValue === "everyWeek") {
			let tempDate = ''
			let tempChoiceInput = '매주'
			if (watch('choiceInput') !== 1) {
				tempChoiceInput = `${watch('choiceInput')}주마다`
			}
			Object.entries(weekdays).map(([key, value]) => {
				if (value) {
					if (key !== 'Invalid date') {
						tempDate += `${weekdayKr[key]}`
					}
				}
			})
			setValue("result", `${tempChoiceInput} -${tempDate}`)
		} else if (cycleValue === "everyMonthDay") {
			let tempDate = ''
			const tempMonthList = []
			let tempChoiceInput = '매월'
			if (watch('choiceInput') !== 1) {
				tempChoiceInput = `${watch('choiceInput')}개월마다`
			}
			const tempDayState = dayState
			if (watch('dayFirst')) {
				tempMonthList.push('첫번째')
				if (!tempDayState['dayFirst']) {
					tempDayState['dayFirst'] = true
				}
			} else {
				if (tempDayState['dayFirst']) {
					tempDayState['dayFirst'] = false
				}
			}
			if (watch('daySecond')) {
				tempMonthList.push('두번째')
				if (!tempDayState['daySecond']) {
					tempDayState['daySecond'] = true
				}
			} else {
				if (tempDayState['daySecond']) {
					tempDayState['daySecond'] = false
				}
			}
			if (watch('dayThird')) {
				tempMonthList.push('세번째')
				if (!tempDayState['dayThird']) {
					tempDayState['dayThird'] = true
				}
			} else {
				if (tempDayState['dayThird']) {
					tempDayState['dayThird'] = false
				}
			}
			if (watch('dayFourth')) {
				tempMonthList.push('네번째')
				if (!tempDayState['dayFourth']) {
					tempDayState['dayFourth'] = true
				}
			} else {
				if (tempDayState['dayFourth']) {
					tempDayState['dayFourth'] = false
				}
			} 
			if (watch('dayLast')) {
				tempMonthList.push('마지막')
				if (!tempDayState['dayLast']) {
					tempDayState['dayLast'] = true
				}
			} else {
				if (tempDayState['dayLast']) {
					tempDayState['dayLast'] = false
				}
			} 
			setDayState(tempDayState)
			const tempMonth = tempMonthList.join(',')

			Object.entries(weekdays).map(([key, value]) => {
				if (value) {
					if (key !== 'Invalid date') {
						tempDate += `${weekdayKr[key]}`
					}
				}
			})
			setValue("result", `${tempChoiceInput} - ${tempMonth} ${tempDate}`)
		} else if (cycleValue === "everyMonthDate") {
			let tempChoiceInput = '매월'
			if (watch('choiceInput') !== 1) {
				tempChoiceInput = `${watch('choiceInput')}개월마다`
			}
			if (watch('lastDay')) {
				let lastDateChocie = ''
				if (watch('lastDateChocie').value !== "") {
					lastDateChocie = `(${watch('lastDateChocie').label})`
				}
				setValue("result", `${tempChoiceInput} - 마지막날${lastDateChocie}`)
			} else {
				const tempDay = []
				watch('dateChoicePicker').map((data) => {
					if (data !== "") {
						tempDay.push(`${moment(data).format("DD")}일`)
					}
				})
				const resultDayList = tempDay.join(',')
				let dateChocie = ''
				if (watch('dateChocie').value !== "") {
					dateChocie = `(${watch('dateChocie').label})`
				}
				setValue("result", `${tempChoiceInput} - ${resultDayList}${dateChocie}`)
			}

			
		} else {
			setValue("result", "")
		}
	}

	const lastDayBeforAfter = () => {
		let stateWarning = false
		if (!watch('dateChoicePicker').includes('')) {
			watch('dateChoicePicker').map((data) => {
				const tempDay = moment(data).format("DD")
				if (tempDay === '29' || tempDay === '30' || tempDay === '31') {
					stateWarning = true
				}
			})
		}
		if (stateWarning) {
			return (
				<Fragment>
					<span style={{color : primaryColor}}>
						*선택하신 날짜의 경우(29,30,31일) 특정한 달에는 일지 생성이 되지 않을 수 있습니다. 대체일을 선택해 주세요.
					</span>
					<div className='demo-inline-spacing mt-1'>
						<Controller
							name='lastDayBeforAfter'
							control={control}
							render={({ field : {onChange, value} }) => (
								<div className='form-check me-1'>
									<Label className='form-check-label' for='beforeDay' style={{color : primaryColor}}>
										이전 날짜
									</Label>
									<Input id='beforeDay'  type='radio' checked={value === 'beforeDay'} onChange={() => onChange('beforeDay')}/>
								</div>
						)}/>
						<Controller
							name='lastDayBeforAfter'
							control={control}
							render={({ field: {onChange, value} }) => (
								<div className='form-check'>
									<Label className='form-check-label' for='afterDay' style={{color : primaryColor}}>
										이후 날짜
									</Label>
									<Input id='afterDay'  type='radio' checked={value === 'afterDay'} onChange={() => onChange('afterDay')}/>
								</div>
						)}/>
					</div>
				</Fragment>
			)
		}
		
	}
	const getInit = () => {
		if (state === 'modify') {
			const param = {
				property : cookies.get('property').value
			}
			getTableData(`${API_SCHEDULE_DETAIL}/${rowId}`, param, setDetailData)
		}
		const param = {
			prop_id :  cookies.get('property').value,
			search_value : '',
			status_select :'',
			class_select : '',
			type:type
		}
		getTableDataCallback(API_INSPECTION_CHECKLIST_FORMS, param, (data) => {
			const temp = [{label : '선택', value : ''}]
			Object.values(data).map((item) => {
				temp.push({label : item['name'], value : item['code']})
			})
			setTemplateList(temp)
		})
	}
	useEffect(() => {
		getInit()
	}, [state])
	useEffect(() => {
		reusltInput()
	}, [
		watch('start_date'), 
		watch('template'), 
		watch('maintenanceCycle'), 
		watch('choiceInput'), 
		watch('dateChoicePicker'),
		watch('dateChocie'),
		watch('lastDay'),
		watch('lastDateChocie'),
		weekdays, 
		watch('dayFirst'),
		watch('daySecond'),
		watch('dayThird'),
		watch('dayFourth'),
		watch('dayLast')
	])

	useEffect(() => {
		if (isOpen === true) {
			if (templateList.length === 1) {
				Swal.fire({
					icon: "info",
					titleText : '선택 가능한 양식이 없습니다.',
					text: "점검 양식 등록하는 페이지로 이동하시겠습니까?",
					showCancelButton: true,
					showConfirmButton: true,
					cancelButtonText: "취소",
					// cancelButtonColor : '#FF9F43',
					confirmButtonText: '확인',
					confirmButtonColor : primaryColor,
					reverseButtons :true,
					customClass: {
						actions: 'sweet-alert-custom right',
						cancelButton: 'me-1'
					}
				}).then((result) => {
					if (result.isConfirmed) {
						navigate(type === 'inspection' ? ROUTE_INSPECTION_INSPECTION_FORM_LIST : `${ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM_LIST}/safety`)
					} else {
						customToggle()
					}
				})
			}
		}
	}, [isOpen])

	useEffect(() => {
		if (state === 'modify') {
			const copyWeekDays = {...weekdaysData}
			const detailDataCycle = maintenanceList.find(item => item.value === detailData.maintenance_cycle)
			setValue('start_date', detailData.start_datetime)
			checkPicker(detailData.start_datetime)

			const choiceTemplate = templateList.find(item => item.value === detailData.checklist_template)
			if (!choiceTemplate === undefined) {
				setValue('template', templateList.find(item => item.value === detailData.checklist_template))
			} else {
				setValue('template', {label: detailData.name, value: detailData.checklist_template})
			}
			setPickerState(true)
			setValue('maintenanceCycle', detailDataCycle)
			handleSelectValidation(detailDataCycle, {action: 'select-option', option: undefined, name: 'maintenanceCycle'})
			if (detailData.date_choice !== null) {
				setValue('dateChoicePicker', detailData.date_choice.split(','))
			}
			if (detailData.last_day === true) {
				setValue('lastDateChocie', dayFormatList.find(item => item.value === numberToChangeKr[detailData.option]))
			} else {
				setValue('dateChocie', dayFormatList.find(item => item.value === numberToChangeKr[detailData.option]))
			}
			setValue('choiceInput', detailData.period)
			if (detailData.day_of_week !== null) {
				detailData.day_of_week.split(',').map(day => {
					copyWeekDays[day] = true
				})
				setWeekdays(copyWeekDays)
			}
			if (detailData.week_of_month !== null) {
				detailData.week_of_month.split(',').map(week => {
					setValue(`${week}`, true)
				})
			}
			setValue('lastDay', detailData.last_day)
			if (detailData.last_day_option !== null) {
				setValue("lastDayBeforAfter", detailData.last_day_option)
			}
		}
	}, [detailData])

    useEffect(() => {
        if (watch('choiceInput') === null) setValue('choiceInput', 1)
    }, [watch('choiceInput')])

	return (
		<Modal isOpen={isOpen} toggle={() => customToggle()} className='modal-dialog-centered modal-lg' >
			<ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
				<div className='mb-1 px-1' style={{display: 'flex', alignItems: 'center', justifyContent:'space-between'}}>
					<div className='mt-1'>
						<Row>
							<span style={{color: 'white', fontSize: '20px'}}>
								{type === 'inspection' ? '' : '안전점검 '}업무일정 {state === 'modify' ? '수정' : '등록'}<br />
							</span>
						</Row>
						<Row>
							<span style={{color: 'white'}}>
							빈칸에 맞춰 양식을 작성해 주세요.
							</span>
						</Row>
					</div>
					<div>
						<img src={winLogoImg} style={{maxHeight: '85px'}}/> 
					</div>
				</div>
			</ModalHeader>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<ModalBody className='ms-1 me-1' style={{ backgroundColor:'#fff', borderBottomLeftRadius : '0.357rem', borderBottomRightRadius : '0.357rem'}}>
					<Row >
						<Col md='5'>
							<Label className="form-check-label custom_label">시작일(점검일지 작성일자)</Label>
							<Controller
								name='start_date'
								id='start_date'
								control={control}
								render={({ field : { onChange, value } }) => <Flatpickr
									placeholder="2000-00-00 (일)" 
									id='default-picker'
									value={value}
									className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
									onChange={(data) => {
										checkPicker(data)
										const newData = setStringDate(data)
										onChange(newData)

									}}
									options={{
										mode: 'single',
										dateFormat : 'Y-m-d (D)',
										locale: Korean
										// locale: {
										// 	weekdays: koreanWeekdays // 한글 요일 설정
										// }
									}}
									/>
								}
								
							/>
							{errors.start_date && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.start_date.message}</div>}

						</Col>
						<Col md='7'>
							<Label className="form-check-label custom_label">
								양식 선택
								<CustomHelpCircle
									id={'scheduleRegistration'}
									content={type === 'inspection' ? '양식은 점검관리>자체점검>점검양식에 등록된 내용이 조회됩니다.' : '양식은 중대재해관리>일일안전점검>점검양식에 등록된 내용이 조회됩니다.'}
								/> 
							</Label>
							<Controller
								name='template'
								control={control}
								render={({ field: { value } }) => (
									<Fragment>
										<Select
											isDisabled={!pickerState}
											name='template'
											classNamePrefix={'select'}
											className="react-select custom-select-template custom-react-select zIndexCustom"
											options={templateList}
											value={value}
											onChange={ handleSelectTemplate }
											styles={{
												singleValue : (provided) => ({
													...provided,
													color: !pickerState && '#ACACAC !important'
												  })
											}}
											/>
										{template && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>양식을 선택해주세요.</div>}
									</Fragment>
							)}/>
						</Col>
					</Row>
					<Row className='mt-1'>
						<Col md='5'>
							<Label className="form-check-label custom_label" for='test'>반복 주기</Label>
							<Controller
								id='choiceInput'
								name='choiceInput'
								control={control}
								render={({ field }) => <InputNumber
															className='input-lg'
															style={{width : '100%'}}
															min = {1}
															max = {999}
															id='basic-number-input'
															disabled={!choice} 
															upHandler={<Plus />}
															downHandler={<Minus />}
															{...field}
														/>
							}/>
						</Col>
						<Col md='7'>
							<Label className="form-check-label custom_label">점검 주기</Label>
							<Controller
								name='maintenanceCycle'
								control={control}
								render={({ field: { value } }) => (
									<Fragment>
										<Select
											isDisabled={!pickerState}
											name='maintenanceCycle'
											classNamePrefix={'select'}
											className="react-select custom-select-maintenanceCycle custom-react-select"
											options={maintenanceList}
											value={value}
											onChange={ handleSelectValidation }
											styles={{
												singleValue : (provided) => ({
													...provided,
													color: !pickerState && '#ACACAC !important'
												  })
											}}
											/>
											
										{maintenanceCycle && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>점검 주기를 선택해주세요.</div>}
									</Fragment>
							)}/>
						</Col>
					</Row>
					<Row className='mt-1'>
						<Col md='5'>
							<Label className="form-check-label custom_label">날짜 선택</Label>
							{
								!calenderState ?
								<Controller
									name='dateChoicePicker'
									id='dateChoicePicker'
									control={control}
									render={({ field : { value} }) => <Flatpickr
										placeholder="00일" 
										id='default-picker'
										value={value}
										
										className={`form-control ${errors.dateChoicePicker ? 'is-invalid' : ''}`}
										options={{
											mode: 'multiple',
											locale: Korean,
											noCalendar : !calenderState,
											altFormat: 'd일', // 보조 형식 지정
											altInput: true,   // 보조 입력란 활성화
											altInputClass: `form-control alt-date-input-custom disabled` // 보조 입력란 클래스 지정
											// locale: {
											// 	weekdays: koreanWeekdays // 한글 요일 설정
											// }
										}}
										/>
									}
								/>
								:
								<Fragment>
									<Controller
										name='dateChoicePicker'
										id='dateChoicePicker'
										control={control}
										render={({ field : { onChange } }) => <Flatpickr
											placeholder="00일" 
											id='default-picker'
											value={watch('dateChoicePicker')}
											onChange={(data) => {
												everyMonthClick('picker')
												onChange(data)
											}}
											className={`form-control ${errors.dateChoicePicker ? 'is-invalid' : ''}`}
											options={{
												mode: 'multiple',
												locale: Korean,
												noCalendar : !calenderState,
												altFormat: 'd일', // 보조 형식 지정
												altInput: true,   // 보조 입력란 활성화
												altInputClass: `form-control alt-date-input-custom` // 보조 입력란 클래스 지정
												// locale: {
												// 	weekdays: koreanWeekdays // 한글 요일 설정
												// }
											}}
											/>
										}
									/>
									{errors.dateChoicePicker && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.dateChoicePicker.message}</div>}
								</Fragment>
							}
						</Col>
						<Col>
							<Label className="form-check-label custom_label">특정일 선택</Label>	
							<div style={{display : 'flex', justifyContent:'center', alignItems : 'center'}}>
								<Controller
									name='lastDay'
									control={control}
									render={({ field }) => (<Fragment >
											<Input disabled={!dateChoice} className={`custom-boolean ${!dateChoice && 'disabled'}`} id ='lastDay' type='checkbox' checked={watch('lastDay')} onClick={() => everyMonthClick('check')} {...field}></Input>
											<span style={{wordBreak : 'keep-all', paddingLeft : '0.5rem', paddingRight : '0.5rem', color : !dateChoice && '#ACACAC'}}>마지막날</span>
										</Fragment>
									)}
								/>
								
								<Controller
									name='lastDateChocie'
									control={control}
									render={({ field: { value, onChange } }) => (
										<Fragment>
											<Select
												name='lastDateChocie'
												isDisabled={!watch('lastDay')}
												classNamePrefix={'select'}
												className="react-select custom-select-lastDateChocie custom-react-select"
												options={dayFormatList}
												value={value}
												onChange={(data) => onChange(data)}
												styles={{
													singleValue : (provided) => ({
														...provided,
														color: !watch('lastDay') && '#ACACAC !important'
													  })
												}}
												/>
												
										</Fragment>
								)}/>
							</div>
							{errors.lastDay && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.lastDay.message}</div>}
							{selectError['lastDateChocie'] && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>특정일을 선택해주세요.</div>}
						</Col>
					</Row>
					<Row className='mt-1'>
						<Col md ='5'>
							<Controller
								name='dateChocie'
								control={control}
								render={({ field: { value, onChange } }) => (
									<Fragment>
										<Select
											name='dateChocie'
											isDisabled={!dateChoice}
											classNamePrefix={'select'}
											className="react-select custom-select-dateChocie custom-react-select"
											options={dayFormatList}
											value={value}
											onChange={(data) => onChange(data)}
											styles={{
												singleValue : (provided) => ({
													...provided,
													color: !dateChoice && '#ACACAC !important'
												  })
											}}
											/>
									</Fragment>
							)}/>
							{selectError['dateChocie'] && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>특정일을 선택해주세요.</div>}
						</Col>
					</Row>
					<Row className='mt-1'>
						<Label className="form-check-label custom_label">요일 선택</Label>
						<Col >
							<Controller
								name='dayFirst'
								control={control}
								render={({ field}) => (<Fragment >
										<Input disabled={!dayChoice} className={`custom-boolean ${!dayChoice && 'disabled'}`}  id ='dayFirst' type='checkbox' checked={watch('dayFirst')} {...field}></Input>
										<span style={{wordBreak : 'keep-all', paddingLeft : '0.5rem', paddingRight : '1rem', color : !dayChoice && '#ACACAC'}}>첫번째</span>
									</Fragment>
								)}
							/>
							<Controller
								name='daySecond'
								control={control}
								render={({ field}) => (<Fragment >
										<Input disabled={!dayChoice} className={`custom-boolean ${!dayChoice && 'disabled'}`} id ='daySecond' type='checkbox' checked={watch('daySecond')} {...field}></Input>
										<span style={{wordBreak : 'keep-all', paddingLeft : '0.5rem', paddingRight : '1rem', color : !dayChoice && '#ACACAC'}}>두번째</span>
									</Fragment>
								)}
							/>
							<Controller
								name='dayThird'
								control={control}
								render={({ field}) => (<Fragment >
										<Input disabled={!dayChoice} className={`custom-boolean ${!dayChoice && 'disabled'}`} id ='dayThird' type='checkbox' checked={watch('dayThird')} {...field}></Input>
										<span style={{wordBreak : 'keep-all', paddingLeft : '0.5rem', paddingRight : '1rem', color : !dayChoice && '#ACACAC'}}>세번째</span>
									</Fragment>
								)}
							/>
							<Controller
								name='dayFourth'
								control={control}
								render={({ field}) => (<Fragment >
										<Input disabled={!dayChoice} className={`custom-boolean ${!dayChoice && 'disabled'}`} id ='dayFourth' type='checkbox' checked={watch('dayFourth')} {...field}></Input>
										<span style={{wordBreak : 'keep-all', paddingLeft : '0.5rem', paddingRight : '1rem', color : !dayChoice && '#ACACAC'}}>네번째</span>
									</Fragment>
								)}
							/>
							<Controller
								name='dayLast'
								control={control}
								render={({ field}) => (<Fragment >
										<Input disabled={!dayChoice} className={`custom-boolean ${!dayChoice && 'disabled'}`} id ='dayLast' type='checkbox' checked={watch('dayLast')} {...field}></Input>
										<span style={{wordBreak : 'keep-all', paddingLeft : '0.5rem', paddingRight : '1rem', color : !dayChoice && '#ACACAC'}}>마지막</span>
									</Fragment>
								)}
							/>
							<span style={{color : primaryColor}}>
								{
									dayChoice && '*n주차가 아닌 달력상 요일의 순서'
								}
							</span>
						</Col>
						{errors.dayFirst && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.dayFirst.message}</div>}
						<Col md='12'>
							<WeeklyDaysButton weekdays ={weekdays}  setWeekdays = {setWeekdays} state = {weekdayState}/>
						</Col>
					</Row>
					<Row className='mt-2'>
						<Col>
							<Controller
								name='result'
								control={control}
								render={({ field }) => (<Input readOnly {...field}></Input>)}/>
						</Col>
					</Row>
					<Row className='mt-1'>
						{dateChoice && lastDayBeforAfter()}
					</Row>
					<Col className='d-flex justify-content-end mt-2 mb-1'>
						<Button color='report' style={{marginTop: '1%', marginRight: '1%'}} onClick={customToggle}>
							취소</Button>
						<Button color='primary' style={{marginTop: '1%'}} type='submit'>
							확인</Button>
					</Col>
				</ModalBody>
			</Form>
		</Modal>

)
}
export default RegisterModal