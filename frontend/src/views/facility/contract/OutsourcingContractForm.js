import { Fragment, useEffect, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, FormFeedback, Input, InputGroup, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { API_FACILITY_OUTSOURCINGCONTRACT_ATTACHMENT_MODIFY, API_FACILITY_OUTSOURCINGCONTRACT_DETAIL, API_FACILITY_OUTSOURCINGCONTRACT_DETAIL_SELECT_OPTIONS, API_FACILITY_OUTSOURCINGCONTRACT_FORM_MODAL, ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_DETAIL, ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_LIST } from "../../../constants"
import { Controller, useForm } from "react-hook-form"
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { dataTableClickStyle, setStringDate, axiosPostPut, getTableData, dateFormat, checkSelectValueObj, checkSelectValue, AddCommaOnChange, addCommaNumber, resultCheckFunc, getCommaDel, sweetAlert, handleFileInputLimitedChange, primaryHeaderColor, getTableDataCallback } from "../../../utility/Utils"
import Select from 'react-select'
import axios from "axios"
import Cookies from "universal-cookie"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'
import OutsourcingContractModalTable from "./OutsourcingContractModalTable"
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import { isEmptyObject } from "jquery"
import FileIconImages from "../../apps/customFiles/FileIconImages"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import * as moment from 'moment'

const statusOptions = [
	{value: '', label: '선택'},
	{value: 1, label: '검토'},
	{value: 2, label: '계획'},
	{value: 3, label: '진행중'},
	{value: 4, label: '완료'}
]

const OutsourcingContractForm = () => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const [property, setProperty] = useState({value: '', label: '사업소'})
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const { state } = useLocation()
    const now = moment().format('YYYY-MM-DD')
	const [employeeClassOptions, setEmployeeClassOptions] = useState([{value: '', label: '선택'}])
	const [buildingOptions, setBuildingOptions] = useState([{value: '', label: '선택'}])
	const [propertyOptions, setPropertyOptions] = useState([{value: '', label: '선택'}])
	const [modal, setModal] = useState(false)
	const [modalData, setModalData] = useState([])
	const [files, setFiles] = useState([])
	const [rowId, setrowId] = useState(0)
	const [selectError, setSelectError] = useState({status: false, building: false, employeeClass: false})
	const [companyId, setCompanyId] = useState(0)
	const [selectedFiles, setSelectedFiles] = useState([])
	const [fileId, setFileId] = state.type === 'modify' ? useState(state.fileId) : useState(0)
	const [showNames, setShowNames] = state.type === 'modify' ? useState(state.data.outsourcing_contract_attachment) : useState([])
	const [submitResult, setSubmitResult] = useState()
	const toggle = () => setModal(!modal)
	const validationSchema = yup.object().shape({
		name: yup.string().required('계약명을 입력해주세요.'),
		start_datetime: yup.array().test('isNonEmpty', '시작일을 입력해주세요.', function(value) {
			return value
		}).nullable(),
		end_datetime: yup.array().test('isNonEmpty', '종료일을 입력해주세요.', function(value) {
			return value
		}).nullable(),
		description: yup.string().required('비고를 입력해주세요.'),
		outsourcing_company: yup.string().required('협력업체를 선택해주세요.')
	})
	const validationSchemaModify = yup.object().shape({
		name: yup.string().required('계약명을 입력해주세요.'),
		price: yup.string().required('계약금액을 입력해주세요.').transform((value, originalValue) => {
			if (originalValue === "") return null
			return value
		}).min(0, '0이상 값을 입력해주세요.').nullable(),
		description: yup.string().required('비고를 입력해주세요.'),
		outsourcing_company: yup.string().required('협력업체를 선택해주세요.')
	})
	const modalColumns = [
		{
			name: '업체명',
			selector: row => row.name,
			conditionalCellStyles: dataTableClickStyle(rowId)
		},
		{
			name: '주요취급품목',
			selector: row => row.item,
			conditionalCellStyles: dataTableClickStyle(rowId)
		}
	]
	const defaultValues = state.type === 'register' ? {
		name: '',
		start_datetime: '',
		outsourcing_company: '',
		description: '',
		price: 0,
		status: {value: '', label: '선택'},
		building: {value: '', label: '선택'},
		employeeClass: {value: '', label: '선택'}
	} : {
		name: state.data.outsourcing_contract.name,
		status: { value: Object.keys(statusOptions).find(key => statusOptions[key] === state.data.outsourcing_contract.status), label: state.data.outsourcing_contract.status },
		start_datetime: dateFormat(state.data.outsourcing_contract.start_datetime),
		end_datetime: dateFormat(state.data.outsourcing_contract.end_datetime),
		building: {value: state.data.outsourcing_contract.building.id, label:state.data.outsourcing_contract.building.name},
		price: state.data.outsourcing_contract.price,
		employeeClass: {value: state.data.outsourcing_contract.employee_class.id, label:state.data.outsourcing_contract.employee_class.code},
		outsourcing_company: state.data.outsourcing_contract.outsourcing_company.name,
		description: state.data.outsourcing_contract.description
	}

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		trigger
	} = state.type === 'register' ? useForm({
		defaultValues,
		resolver: yupResolver(validationSchema)
	}) : useForm({
		defaultValues,
		resolver: yupResolver(validationSchemaModify)
	})

	const handleFileInputChange = (e) => {
		if (state.type === 'register') {
			handleFileInputLimitedChange(e, files, setFiles, 6, showNames, setShowNames, setSelectedFiles)
			return
		}
		const inputFiles = Array.from(e.target.files)
		const copyFiles = [...files]
		const copyOldFiles = showNames ? [...showNames] : undefined
		const copyFileId = [...fileId]
		const oldLFileLength = copyOldFiles ? copyOldFiles.length : 0
		const totalFilesLength = copyFiles.length + oldLFileLength + inputFiles.length
		if (totalFilesLength > 6) {
			sweetAlert('', `업로드 파일은 6개 이하로만 등록이 가능합니다.`, 'warning')
			e.target.value = null
			return
		}
		const formData = new FormData()
		inputFiles.forEach((file, index) => {
			formData.append(`file${index + 1}`, file)
		})
		axios.post(`${API_FACILITY_OUTSOURCINGCONTRACT_ATTACHMENT_MODIFY}/${state.id}`, formData)
		.then((res) => {
			const updateFiles = [...res.data]
			// 중복 제거
			const resultArray = [
				...copyFiles,
				...inputFiles.map(file => Object.assign(file))
			]
			const resultId = [
				...copyFileId,
				...updateFiles
			]
			setSelectedFiles(resultArray)
			setFiles(resultArray)
			setFileId(resultId)
		})
		.catch(res => {
			console.log(`${API_FACILITY_OUTSOURCINGCONTRACT_ATTACHMENT_MODIFY}/${state.id}`, res)
		})
	}

	// 콤마 넣기
	const approvalCommaValue = (value) => { return addCommaNumber(resultCheckFunc(getCommaDel(value))) }

	// 새로 업로드한 부분 삭제
	const onRemoveFile = (file) => {
		const updatedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file)
		setSelectedFiles(updatedFiles)
		setFiles(updatedFiles)
	}
	// 과거의 파일 리스트중 삭제
	const onPastRemoveFile = (file) => {
		setShowNames(showNames.filter((element) => element !== file))
		setFileId(prevFileId => {
			const deleted = prevFileId.filter((value) => {
				return value !== file.id
			})
			return deleted
		})
	}

	const handleCancel = () => {
		setrowId(0)
		toggle()
	}
	
	const onModalButton = () => {
		toggle()
		const data = modalData.find(item => item.id === rowId)
		console.log(data.name)
		setCompanyId(data.id)
		setValue('outsourcing_company', data.name)
		trigger('outsourcing_company')
	}
	const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

	const onSubmit = (data) => {
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }

		const formData = new FormData()
		formData.append('property_id', cookies.get('property').value)
		formData.append('user_id', cookies.get('userId'))
		formData.append('name', data.name)
		formData.append('status', data.status.label)
		formData.append('start_datetime', data.start_datetime)
		formData.append('end_datetime', data.end_datetime)
		formData.append('building', data.building.value)
		formData.append('price', resultCheckFunc(getCommaDel(data.price)))
		formData.append('employee_class', data.employeeClass.value)
		if (state.type === 'register') {
			formData.append('outsourcing_company', companyId)
		} else if (state.type === 'modify') {
			formData.append('outsourcing_company', state.data.outsourcing_contract.outsourcing_company.id)
		}
		formData.append('description', data.description)
		files.forEach((file, index) => {
			formData.append(`file${index + 1}`, file)
		})
		formData.append('file_id', fileId)

		const API = state.type === 'register' ? `${API_FACILITY_OUTSOURCINGCONTRACT_DETAIL}/-1`
											: `${API_FACILITY_OUTSOURCINGCONTRACT_DETAIL}/${state.id}`
		axiosPostPut(state.type, '외주계약', API, formData, setSubmitResult)
	}

	// 파일 삭제하면 선택된파일 없다고 나타나는 곳
	useEffect(() => {
		const inputElement = document.getElementById("doc_file")
		inputElement.value = ""
		
		const dataTransfer = new DataTransfer()
		for (let i = 0; i < files.length; i++) {
			dataTransfer.items.add(files[i])
		}
		inputElement.files = dataTransfer.files
	}, [files])

	const getSelectOptions = (data) => {
		setEmployeeClassOptions(data.employee_class_array)
		const tempBuildingList = data?.building_array
		if (Array.isArray(tempBuildingList)) {
			tempBuildingList.shift()
			tempBuildingList.unshift({value: '', label: '선택'})
			setBuildingOptions(tempBuildingList)
		}
		setPropertyOptions(data.property_array)
	}

	useEffect(() => {
		getTableDataCallback(
			API_FACILITY_OUTSOURCINGCONTRACT_DETAIL_SELECT_OPTIONS, 
			{property_id: cookies.get('property').value}, 
			getSelectOptions
		)
	}, [])

	useEffect(() => {
		getTableData(API_FACILITY_OUTSOURCINGCONTRACT_FORM_MODAL, {property_id: property.value, search: ''}, setModalData)
	}, [property])

	useEffect(() => {
		if (submitResult) {
			if (state.type === 'register') {
				navigate(ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_LIST)
			} else {
				navigate(`${ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_DETAIL}/${state.id}`)
			}
		}
	}, [submitResult])

	useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='외주계약관리' breadCrumbParent='시설관리' breadCrumbActive='외주계약관리' />
				</div>
			</Row>
			<Card>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>외주계약관리 {state.type === 'register' ? '등록' : '수정'}</CardTitle>
					</CardHeader>
					<CardBody>
						<Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
							<Col lg='6' md='6' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
										<div>계약명</div> &nbsp;
										<div className='essential_value'/>
									</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
										<Controller
											id='name'
											name='name'
											control={control}
											render={({ field }) => (
												<Row style={{width: '100%'}}>
													<Input invalid={errors.name && true} {...field} />
													{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
												</Row>
											)}
										/>
									</Col>
								</Row>
							</Col>
							<Col lg='6' md='6' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
										<div>상태</div> &nbsp;
										<div className="essential_value"/>
									</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text start'>
										<Controller
											id='status'
											name='status'
											control={control}
											render={({ field: { value } }) => (
												<Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column', alignItems:'start', paddingTop: 0, paddingBottom: 0}}>
													<>
														<Select
															name='status'
															classNamePrefix={'select'}
															className="react-select custom-select-status custom-react-select"
															options={statusOptions}
															value={value}
															defaultValue={statusOptions[0]}
															onChange={ handleSelectValidation }
														/>
														{selectError.status && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>상태를 선택해주세요.</div>}
													</>
												</Col>
										)}/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
							<Col lg='6' md='6' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
										<div>시작일</div> &nbsp;
										<div className='essential_value'/>
									</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
										<Controller
											id='start_datetime'
											name='start_datetime'
											control={control}
											render={({field : {onChange, value}}) => (
												<Row style={{width: '100%'}}>
													<Flatpickr
														value={value}
														id='default-picker'
														className="form-control"
														onChange={(data) => {
															const newData = setStringDate(data)
															onChange(newData)
														}}
														options={{
															mode: 'single',
															ariaDateFormat: 'Y-m-d',
															locale: Korean
														}}
														placeholder={now}
													/>
													{errors.start_datetime && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.start_datetime.message}</div>}
												</Row>
											)}
										/>
									</Col>
								</Row>
							</Col>
							<Col lg='6' md='6' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
										<div>종료일</div> &nbsp;
										<div className='essential_value'/>
									</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
										<Controller
											id='end_datetime'
											name='end_datetime'
											control={control}
											render={({field : {onChange, value}}) => (
												<Row style={{width: '100%'}}>
													<Flatpickr
														value={value}
														id='default-picker'
														className="form-control"
														onChange={(data) => {
															const newData = setStringDate(data)
															onChange(newData)
														}}
														options={{
															mode: 'single',
															ariaDateFormat: 'Y-m-d',
															locale: Korean
														}}
														placeholder={now}
													/>
													{errors.end_datetime && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.end_datetime.message}</div>}
												</Row>
											)}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
							<Col lg='6' md='6' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
										<div>건물명</div> &nbsp;
										<div className='essential_value'/>
									</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text start'>
										<Controller
											id='building'
											name='building'
											control={control}
											render={({ field: { value } }) => (
											<Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column', alignItems:'start', paddingTop: 0, paddingBottom: 0}}>
												{/* <Row style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}> */}
												<>
													<Select
														name='building'
														classNamePrefix={'select'}
														className="react-select custom-select-building custom-react-select"
														options={buildingOptions}
														value={value}
														defaultValue={buildingOptions[0]}
														onChange={ handleSelectValidation }
													/>
													{selectError.building && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>건물을 선택해주세요.</div>}
												</>
												{/* </Row> */}
											</Col>
										)}/>
									</Col>
								</Row>
							</Col>
							<Col lg='6' md='6' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
										<div>계약금액</div>
									</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text'>
										<Controller
											id='price'
											name='price'
											control={control}
											render={({ field: {onChange, value} }) => (
												<Col lg='12' md='12' xs='12' >
													<Fragment>
														<InputGroup style={{padding: 'inherit', zIndex:0}}>
															<Input
																onChange={(e) => {
																	AddCommaOnChange(e, onChange, true)
																	trigger('price')
																}}
																value={approvalCommaValue(value)}
															/>
															<InputGroupText style={{borderTopRightRadius:'0.357rem', borderBottomRightRadius:'0.357rem', borderLeft:'none'}}>{'원'}</InputGroupText>
														</InputGroup>
														{errors.price && <div className='custom-form-feedback'>{errors.price.message}</div>}
													</Fragment>
												</Col>
											)}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
							<Col lg='6' md='6' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
										<div>직종</div> &nbsp;
										<div className='essential_value'/>
									</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text start'>
										<Controller
											id='employeeClass'
											name='employeeClass'
											control={control}
											render={({ field: { value } }) => (
											<Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column', alignItems:'start', paddingTop: 0, paddingBottom: 0}}>
												<>
													<Select
														name='employeeClass'
														classNamePrefix={'select'}
														className="react-select custom-select-employeeClass custom-react-select"
														options={employeeClassOptions}
														value={value}
														onChange={ handleSelectValidation }
													/>
													{selectError.employeeClass && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
												</>
											</Col>
										)}/>
									</Col>
								</Row>
							</Col>
							<Col lg='6' md='6' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
										<div>협력업체명</div> &nbsp;
										<div className='essential_value'/>
									</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text start'>
										<Controller
											id='outsourcing_company'
											name='outsourcing_company'
											control={control}
											render={({ field: {onChange, value} }) => (
												<Col lg='12' md='12' xs='12' >
													<Fragment>
														<InputGroup style={{zIndex:'0'}}>
															<Input 
																readOnly 
																invalid={errors.outsourcing_company && true} 
																onChange={e => {
																	onChange(e)
																	trigger('outsourcing_company')
																}} 
																value={value} 
															/>
															<Button outline onClick={toggle}>선택</Button>
														</InputGroup>
														{errors.outsourcing_company && <div className='custom-form-feedback'>{errors.outsourcing_company.message}</div>}
													</Fragment>
												</Col>
											)}
										/>
										<Modal isOpen={modal} toggle={toggle} size='lg'>
											<ModalHeader>협력업체</ModalHeader>
											<ModalBody style={{padding: 0}}>
												<Row className="my-1" style={{paddingRight: '1%', paddingLeft: '1%'}}>
													<Col md='6' xs='12'>
														<Row>
															<Col md='4' xs='3' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 0}}>
																사업소
															</Col>
															<Col md='8' xs='9' style={{paddingLeft: 0}}>
																<Select
																	id='property-select'
																	className='react-select'
																	classNamePrefix='select'
																	defaultValue={propertyOptions[0]}
																	options={propertyOptions}
																	onChange={(e) => setProperty(e)}
																	value={property}
																/>
															</Col>
														</Row>
													</Col>
													<Col md='6' xs='12'>
														<InputGroup>
															<Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='업체명 또는 주요 취급 품목을 입력하세요.'
																onKeyDown={e => {
																	if (e.key === 'Enter') getTableData(API_FACILITY_OUTSOURCINGCONTRACT_FORM_MODAL, {property_id:property.value, search: search}, setModalData)
																}}/>
															<Button onClick={() => getTableData(API_FACILITY_OUTSOURCINGCONTRACT_FORM_MODAL, {property_id:property.value, search: search}, setModalData)}>검색</Button>
														</InputGroup>
													</Col>
												</Row>
												<OutsourcingContractModalTable
													tableData={modalData}
													columns={modalColumns}
													setClick={setrowId}
												/>
											</ModalBody>
											<ModalFooter className='mt-1' style={{display:'flex', justifyContent:'end', alignItems:'center', borderTop: '1px solid #B9B9C3'}}>
												<Button color='report' className="mx-1" onClick={() => handleCancel()}>취소</Button>
												<Button color='primary' disabled={rowId === 0} onClick={() => onModalButton()}>확인</Button>
											</ModalFooter>
										</Modal>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row style={{marginLeft: 0, marginRight: 0, borderBottom: '0.5px solid #B9B9C3', minHeight: '70px'}}>
							<Col lg='12' md='12' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='2' md='2' xs='4' className='card_table col text center' style={{borderLeft: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
										<div>비고</div> &nbsp;
										<div className='essential_value'/>
									</Col>
									<Col lg='10' md='10' xs='8' className='card_table col text center'>
										<Controller
											id='description'
											name='description'
											control={control}
											render={({ field }) => (
												<Row style={{width: '100%'}}>
													<Input type="textarea" invalid={errors.description && true} {...field}/>
													{errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
												</Row>
											)}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className="card_table my-1">
							<div className="mb-1">
								<Label className="form-label" for="doc_file">
									첨부파일
								</Label>
								<Input type="file" id="doc_file" name="doc_file" multiple onChange={handleFileInputChange} />
							</div>
							<div className="mb-1">
								<div className="form-control hidden-scrollbar" style={{height: '40px', display: 'flex', alignItems: 'center', whiteSpace:'nowrap', overflow:'auto' }}>
									{ selectedFiles && selectedFiles.length > 0 &&
										selectedFiles.map((file, idx) => {
											const ext = file.name.split('.').pop()
											return (
											  <span key={`file_${idx}`} className="mx-0 px-0">
												<FileIconImages
												  ext={ext}
												  file={file}
												  filename={file.name}
												  removeFunc={onRemoveFile}
												/>
											  </span>
											)
										})
									}
									{ state.type === 'modify' && 
										showNames.map((file, idx) => {
											const ext = file.original_file_name.split('.').pop()
											return (
											  <span key={idx} className="mx-0 px-0">
												<FileIconImages
												  ext={ext}
												  file={file}
												  filename={file.original_file_name}
												  removeFunc={onPastRemoveFile}
												/>
											  </span>
											)
										})
									}
								</div>
							</div>
						</Row>
					</CardBody>
					<CardFooter style={{display:'flex', justifyContent:'end'}}>
						<Button color='report' className="mx-1" onClick={() => navigate(-1)}>취소</Button>
						<Button type='submit' color='primary'>확인</Button>
					</CardFooter>
				</Form>
			</Card>
		</Fragment>
	)
}

export default OutsourcingContractForm