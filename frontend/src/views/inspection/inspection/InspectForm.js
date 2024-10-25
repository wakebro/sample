import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { isEmptyObject } from "jquery"
import { Fragment, useEffect, useState } from "react"
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { Card, CardBody, Col, Form, FormFeedback, Input, Row } from 'reactstrap'
import Cookies from 'universal-cookie'
import * as yup from 'yup'
import { API_EMPLOYEE_CLASS_LIST, API_FIND_BUILDING, API_INSPECTION_CHECKLIST_FORM, ROUTE_INSPECTION_INSPECTION_FORM_LIST, ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM_LIST } from '../../../constants'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { axiosPostPutCallback, checkSelectValue, checkSelectValueObj, getTableData, getTableDataModifyFirstIdx, primaryColor } from '../../../utility/Utils'
import axios from "../../../utility/AxiosConfig"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { FormButton } from './FormButton'
import InspectFormItem from './InspectFormItem'
import InspectFormItemCreate from './InspectFormItemCreate'
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { timeListOption, multiChoiceList } from '../data'
import { useSelector, useDispatch } from 'react-redux'
import { setReportType, setSignList } from '../../../redux/module/inspectionPreview'

const InspectForm = () => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const { state } = useLocation()
	const {formId} = useParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const activeUser = Number(cookies.get("userId"))
	const username = cookies.get("username")

	const typeClass = [
		{label: '선택', value:''},
		{label: '대기', value: 0},
		{label: '사용', value:1},
		{label: '중지', value:2}
	]
	const defaultValues = {
		name : "", //건물 코드
		employeeClass : {label: '선택', value:''},
		building : {label: '선택', value:''},
		type : {label: '선택', value:''},
		discription : '',
		buildingLocation : '',
		buildingUse : ''
	} 
	const validationSchema = yup.object().shape({
		name: yup.string().required('일지명을 입력해주세요.').min(1, '1자 이상 입력해주세요').max(147, "255바이트 이하로 입력해주세요.")

	})
	const previewData = useSelector((state) => state.inspectionPreview)

	const [classList, setClassList] = useState([{label: '선택', value:''}])
	const [buildingList, setBuildingList] = useState([{label: '선택', value:''}])
	const [selectError, setSelectError] = useState({employeeClass: false, type : false, building : false})
	const [customResolver, setResolver] = useState(validationSchema)
	// const [defaultCustom, setDefaultCustom] = useState(defaultValues)
	const {employeeClass, type, building} = selectError
	const [items, itemsSet] = useState([])
	const [questionIndex, setQuestionIndex] = useState({})

	// const [userSign, setUserSign] = useState([cookies.get("userId"), 0, 0, 0])
    // const [signType, setSignType] = useState([0, 3, 3, ''])
	// const [isOpen, setIsOpen] = useState(false)
	// const [inputData, setInputData] = useState([])

	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		unregister,
		formState: { errors }
	} = useForm({
		defaultValues : defaultValues,
		resolver: yupResolver(customResolver)
	})
	const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

	const onSubmit = data => {
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }

		const formData = new FormData()
		formData.append('prop_id', cookies.get('property').value)
		formData.append('form_id', formId)

		formData.append('manager', activeUser) // 관리자

		// 일지명
		formData.append('name', data.name)
		// 일지 기본정보
		formData.append('emp_class', data.employeeClass.value)
		formData.append('status', data.type.value)
		formData.append('description', data.discription)
		// 위치정보
		formData.append('building', data.building.value)
		formData.append('building_name', data.buildingLocation)
		formData.append('main_purpose', data.buildingUse)

		formData.append('type', previewData.reportType)
		const section = []
	
		Object.entries(questionIndex).forEach((item) => {
			
			const temp = {
				check_hour_status : data[`timeType${item[0]}`],
				title : data[`checkListName${item[0]}`],
				sub_title : data[`middleCategory${item[0]}`],
				question_list : []
			}
			if (data[`timeType${item[0]}`]) {
				temp['check_hour'] = data[`timeList${item[0]}`].value
			}

			item[1].forEach((qa) => {
				const qa_temp = {}
				qa_temp[`title`] = data[`qaName_${item[0]}${qa}`] 
				qa_temp[`is_choicable`] = data[`choiceForm_${item[0]}${qa}`]
				qa_temp[`choice_type`] = data[`multiChoice_${item[0]}${qa}`].value
				qa_temp[`use_description`] = data[`discription_${item[0]}${qa}`] 
				temp['question_list'].push(qa_temp)
			})
			section.push(temp)
		})
		formData.append('questions', JSON.stringify(section))

		const pageType = formId === undefined || formId === 'undefined' || formId === 'new' ? 'register' : 'modify'

		axiosPostPutCallback(pageType, '점검 양식', API_INSPECTION_CHECKLIST_FORM, formData, function() {
			const listUrl = previewData.reportType !== 'disaster' ? 
			ROUTE_INSPECTION_INSPECTION_FORM_LIST 
			: 
			`${ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM_LIST}/safety`
			navigate(listUrl)
		})
	}

	const createItemForm = () => {
		return (
			items.map((v, i) => {
				return <InspectFormItem 
				key={i} 
				itemIndex={v} 
				control = {control}
				handleSubmit = {handleSubmit}
				setValue = {setValue}
				getValues = {getValues}
				errors = {errors}
				setResolver={setResolver} 
				resolver={customResolver}
				unregister={unregister}
				items={items}
				itemsSet={itemsSet}
				questionIndex ={questionIndex}
				setQuestionIndex ={setQuestionIndex}
				/>
			})
		)
	}

	const getForm = () => {
		if (state === 'back') {
			setValue('name', previewData.name)
			setValue('employeeClass', previewData.employeeClass)
			setValue('type', previewData.type)
			setValue('discription', previewData.discription)
			setValue('building', previewData.building)
			setValue('buildingLocation', previewData.buildingLocation)
			setValue('buil∂dingUse', previewData.buildingUse)
			const sectionTemp = {}
			const sectionLength = []
			Object.entries(previewData.section).map((data, i) => {
				setValue(`checkListName${i}`, data[1]['title'])
				setValue(`middleCategory${i}`, data[1]['sub_title'])

				sectionTemp[i] = []
				sectionLength.push(i)
				if (data[1]['check_hour'] !== null && data[1]['check_hour'] !== undefined) {			
					setValue(`timeList${i}`, timeListOption.find(item => item.value === data[1]['check_hour']))
					setValue(`timeType${i}`, true)
				} else {
					setValue(`timeType${i}`, false)
				}

				data[1]['question_list'].map((qa, index) => {
					sectionTemp[i].push(index)
					setValue(`qaName_${i}${index}`, qa['title'])
					setValue(`choiceForm_${i}${index}`, qa['is_choicable'])
					setValue(`multiChoice_${i}${index}`, multiChoiceList.find(item => item.value === qa['choice_type']))
					setValue(`discription_${i}${index}`, qa['use_description'])
				})
			})
			itemsSet(sectionLength)
			setQuestionIndex(sectionTemp)
		} else {
			axios.get(API_INSPECTION_CHECKLIST_FORM, {
				params: {id : formId}
			}).then(res => {
					console.log(res.data)
					setValue('name', res.data.name)
					setValue('employeeClass', res.data.employeeClass)
					setValue('type', typeClass.find(item => item.value === parseInt(res.data.type)))
					setValue('discription', res.data.discription)
					setValue('building', res.data.building)
					setValue('buildingLocation', res.data.buildingLocation)
					setValue('buildingUse', res.data.buildingUse)
					dispatch(setReportType(res.data.report_type))
					dispatch(setSignList(res.data.sign_list))
					
					const sectionLength = []
					const sectionTemp = {}
	
					Object.entries(res.data.sections).map((data, i) => {
						setValue(`checkListName${i}`, data[1]['title'])
						setValue(`middleCategory${i}`, data[1]['sub_title'])
						sectionLength.push(i)
						if (data[1]['check_hour'] !== null) {			
							setValue(`timeList${i}`, timeListOption.find(item => item.value === data[1]['check_hour']))
							setValue(`timeType${i}`, true)
						} else {
							setValue(`timeType${i}`, false)
						}
						sectionTemp[i] = []
						data[1]['questions'].map((qa, index) => {
							sectionTemp[i].push(index)
							setValue(`qaName_${i}${index}`, qa['title'])
							setValue(`choiceForm_${i}${index}`, qa['is_choicable'])
							setValue(`multiChoice_${i}${index}`, multiChoiceList.find(item => item.value === qa['choice_type']))
							setValue(`discription_${i}${index}`, qa['use_description'])
						})
					})
					itemsSet(sectionLength)
					setQuestionIndex(sectionTemp)
				}).catch(err => {
					console.log(err)
			})
			
		}
	}
	const getInit = () => {
		const param = {
			prop_id :  cookies.get('property').value
		}
		getTableDataModifyFirstIdx(API_EMPLOYEE_CLASS_LIST, param, setClassList, '선택')
		getTableData(API_FIND_BUILDING, param, setBuildingList)
		if (state && state.type !== undefined) dispatch(setReportType(state.type))
		if (formId !== undefined) {
			getForm()
		}
	}

	useEffect(() => {
		getInit()
	}, [])
	useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])
	return (
		<Fragment>
			{/* <Form onSubmit={handleSubmit(onSubmit)}> */}
			<Form >
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs 
							breadCrumbTitle={`${previewData.reportType !== 'disaster' ? '점검양식' : '안전 점검일지'}`} 
							breadCrumbParent={`${previewData.reportType !== 'disaster' ? '점검관리' : '중대재해관리'}`} 
							breadCrumbParent2={`${previewData.reportType !== 'disaster' ? '자체점검' : '일일안전점검'}`}
							breadCrumbActive='점검양식' 
						/>
					</div>
				</Row>

				<Card>
					<Col className="custom-card-header">
						<div className="custom-create-title">일지명</div>
						<div className='essential_value'/>
						<div className="custom-create-title-sub">필수항목</div>
					</Col>
					
					<hr/>
					<CardBody>
						<Controller
							id='name'
							name='name'
							control={control}
							render={({ field }) => <Input bsSize='sm' placeholder={'일지명을 입력해주세요.'} invalid={errors.name && true} {...field} />}
						/>
						{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
					</CardBody>
				</Card>

				<Card>
					<Col className="custom-card-header">
						<div className="custom-create-title">일지 기본정보</div>
						<div className='essential_value'/>
					</Col>
					<hr/>
					<CardBody>
						<Row className='mb-1 align-items-center'>
							<Col md='6' xs='12'>
								<Row className='align-items-center'>
									<Col className='card_table col text center' xs='2'>
										관리자
									</Col>
									<Col xs='10'>
										<Input 
											disabled 
											readOnly
											className='risk-report background-color-disabled'
											value={(username && username !== null) ? username : ''}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className='mb-1' style={{alignItems:'center'}}>
							<Col md='6' xs='12'>
								<Row style={{alignItems:'center'}}>
									<Col className='card_table col text center' xs='2'>
										직종 구분
		  							</Col>
									<Col xs='10' >
										<Controller
											id = 'employeeClass'
											name='employeeClass'
											control={control}
											render={({ field: { value } }) => (
												<Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
													<Select
														name='employeeClass'
														classNamePrefix={'select'}
														className="react-select custom-select-employeeClass custom-react-select"
														options={classList}
														value={value}
														onChange={ handleSelectValidation }
														/>
													{employeeClass && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
												</Col>
										)}/>
									</Col>
								</Row>
							</Col>
							<Col md='6' xs='12'>
								<Row style={{alignItems:'center'}}>
									<Col className='card_table col text center' xs='2'>
										구분
		  							</Col>
									<Col xs='10'>
										<Controller
											id = 'type'
											name='type'
											control={control}
											render={({ field: { value } }) => (
												<Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
													<Select
														name='type'
														classNamePrefix={'select'}
														className="react-select custom-select-type custom-react-select"
														options={typeClass}
														value={value}
														defaultValue={typeClass[0]}
														onChange={ handleSelectValidation }
														/>
													{type && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>구분을 선택해주세요.</div>}
												</Col>
										)}/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row style={{alignItems:'center'}}>
							<Col>
								<Row style={{alignItems:'center'}}>
									<Col className='card_table col text center' md= '1' xs='2'>
										비고
		  							</Col>
									<Col md='11' xs='10' >
										<Controller
											id='discription'
											name='discription'
											control={control}
											render={({ field }) => <Input maxLength={498} bsSize='sm' {...field} />}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</CardBody>
				</Card>

				<Card>
					<Col className="custom-card-header">
						<div className="custom-create-title">위치정보</div>
					</Col>
					<hr/>
					<CardBody>
						<Row className='mb-1' style={{alignItems:'center'}}>
							<Col  md='6' xs='12'>
								<Row style={{alignItems:'center'}}>
									<Col className='card_table col text center'   xs='2'>
										건물&nbsp;
										<div className='essential_value'/>
		  							</Col>
									<Col xs='10' >
										<Controller
											id = 'building'
											name='building'
											control={control}
											render={({ field: { value } }) => (
												<Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
													<Select
														name='building'
														classNamePrefix={'select'}
														className="react-select custom-select-building custom-react-select"
														options={buildingList}
														value={value}
														// defaultValue={buildingList[0]}
														onChange={ handleSelectValidation }
														/>
													{building && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>빌딩을 선택해주세요.</div>}
												</Col>
										)}/>
									</Col>
								</Row>
							</Col>
							<Col md='6' xs='12'>
								<Row style={{alignItems:'center'}}>
									<Col className='card_table col text center' xs='2' >
										건물 위치
		  							</Col>
									<Col  xs='10' >
										<Controller
											id='buildingLocation'
											name='buildingLocation'
											control={control}
											render={({ field }) => <Input maxLength={48} bsSize='sm' {...field} />}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row style={{alignItems:'center'}}>
							<Col>
								<Row style={{alignItems:'center'}}>
									<Col className='card_table col text center' md= '1' xs='2'>
										건물 용도
		  							</Col>
									<Col  md='11' xs='10' >
										<Controller
											id='buildingUse'
											name='buildingUse'
											control={control}
											render={({ field }) => <Input maxLength={98} bsSize='sm' {...field} />}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</CardBody>
				</Card>
				<Row>
					<div className='d-flex justify-content-start' style={{fontSize : '22px', color : primaryColor, fontFamily : 'Montserrat,sans-serif'}}>
						점검일지 항목 설정
					</div>
				</Row>
				<hr/>
				{createItemForm()}
				<InspectFormItemCreate 
					items={items} 
					itemsSet={itemsSet} 
					setResolver={setResolver} 
					resolver={customResolver}
					setValue = {setValue}
					setQuestionIndex ={setQuestionIndex}
				/>
				<Row className='my-5'>
				</Row>
				<FormButton 
					type={'create'}
					handleSubmit= {handleSubmit}
					onSubmit ={onSubmit}
					questionIndex={questionIndex}
				/>
			</Form>
		</Fragment>
	)
}
export default InspectForm