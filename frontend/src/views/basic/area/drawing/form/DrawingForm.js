import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { isEmptyObject } from 'jquery'
import Select from 'react-select'
import Cookies from 'universal-cookie'

import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Row } from "reactstrap"
import {
    API_BASICINFO_AREA_BUILDING_DRAWING_DETAIL,
    API_BASICINFO_AREA_BUILDING_DRAWING_FORM,
    API_BASICINFO_AREA_BUILDING_DRAWING_SELECT_ARRAY,
    ROUTE_BASICINFO_AREA_DRAWING
} from '../../../../../constants'
import { axiosPostPut, checkSelectValue, checkSelectValueObj, getTableData, primaryHeaderColor, sweetAlert } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { formApiObj, formDefaultValues, getDataList, validationSchema } from '../data'

const DrawingForm = () => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const navigate = useNavigate()
	const { id } = useParams()
	const [files, setFiles] = useState(['', '', '', '', '', ''])
	const [employeeClassOptions, setEmployeeClassOptions] = useState([{value: '', label: '직종'}])
	const [buildingList, setbuildingList] = useState([{ value: '', label: '건물선택' }])
	const [floorOptions, setFloorOptions] = useState([{value: '', label: '층코드'}])
	const [submitResult, setSubmitResult] = useState(false)
	const [selectError, setSelectError] = useState({building: false})
	const {building} = selectError

	const [detailData, setDetailData] = useState('')
	
	const { 
		control, 
		handleSubmit, 
		watch,
		setValue,
		formState: { errors }
	} = useForm({
		defaultValues: formDefaultValues,
		resolver: yupResolver(validationSchema)
	})
	
	const handleSelectValidation = (e, event) => {
		// setSelectedBuilding(e)
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

	const handleButtonClick = (inputId) => {
		const fileInput = document.getElementById(`file${inputId}`)
		if (fileInput) {
			fileInput.click()
		}
	}

	const checkSize = (event, index) => {
		const input = event.target
		if (input.value && input.files && input.files[0].size > (10 * 1024 * 1024)) {
			sweetAlert('', `최대 용량(10MB)을 초과했습니다.`, 'warning', 'center')
			input.value = null
		} else if (input.value === undefined) {
			
		} else {
			const updatedFiles = [...files]
			updatedFiles[index] = input.files[0]
			setFiles(updatedFiles)
		}
	}
	
	const onSubmit = (data) => {
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }
		const formData = new FormData()
		formData.append('name', data.drawing_name)
		formData.append('employee_class', data.employeeClass.value)
		formData.append('building', data.building.value)
		formData.append('floor', data.floorCode.value)
		formData.append('type', 'floor_plan')
		if (files.length > 0) {
			for (let i = 0; i < files.length; i++) {
				if (files[i].type !== undefined) {
					formData.append('file', files[i])
				} else {
					formData.append('file', JSON.stringify(files[i]))
				}
			}
		} else {
			formData.append('file', JSON.stringify(['']))
		}
		formData.append('user', cookies.get('userId'))
		
		const pageType = id !== 'undefined' ? 'modify' : 'register'
		const API = id !== 'undefined' ? `${API_BASICINFO_AREA_BUILDING_DRAWING_DETAIL}/${id}` : API_BASICINFO_AREA_BUILDING_DRAWING_FORM
		axiosPostPut(pageType, "건물도면", API, formData, setSubmitResult)
	}

	const deleteFile = (num) => {
		const inputFiles = document.getElementsByName(`file${num}`)
		if (inputFiles[0] !== undefined && inputFiles[0].value !== '') {
			inputFiles[0].value = ''
		}
		const updatedFiles = [...files]
		updatedFiles[num] = ''
		setFiles(updatedFiles)
	}

	useEffect(() => {
		const params = {property :  cookies.get('property').value}
		getDataList(formApiObj.buildings, params, buildingList, setbuildingList, 'building')

		getTableData(API_BASICINFO_AREA_BUILDING_DRAWING_SELECT_ARRAY, {property_id: cookies.get('property').value, type: 'list'}, setEmployeeClassOptions)
	}, [])

	useEffect(() => {
		setFloorOptions([])
		if (watch('building').value !== '') {
			const params = {
				property: cookies.get('property').value,
				building: watch('building').value
			}
			getDataList(formApiObj.floors, params, floorOptions, setFloorOptions, 'floor')
		}
	}, [watch('building')])

	useEffect(() => {
		if (detailData && floorOptions.length > 1 && detailData.drawing.floor) {
			setValue('floorCode', floorOptions.find(floor => floor.value === detailData.drawing.floor.id))
		}
	}, [detailData, floorOptions])

	useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])

	useEffect(() => {
		if (submitResult) {
			navigate(ROUTE_BASICINFO_AREA_DRAWING)
		}
	}, [submitResult])
	
	useEffect(() => {
		if (id !== 'undefined' && buildingList.length > 1 && employeeClassOptions.length > 1) {
			axios.get(`${API_BASICINFO_AREA_BUILDING_DRAWING_DETAIL}/${id}`)
			.then((res) => {
				setDetailData(res.data)
				const data = res.data
				setValue('drawing_name', data.drawing.name)
				setValue('building', buildingList.find(building => building.value === data.drawing.building.id))
				if (data.drawing.employee_class) setValue('employeeClass', employeeClassOptions.find(employee => employee.value === data.drawing.employee_class.id))
				setFiles(data.file)
			})
		}
	}, [id, buildingList, employeeClassOptions])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='도면정보관리' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='도면정보관리' />
				</div>
			</Row>
			<Card>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>도면 등록</CardTitle>
					</CardHeader>
					<CardBody className='mb-1'>
						<Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
							<Col lg='6' md='6' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
										<div>도면명</div> &nbsp;
										<div className='essential_value'/>
									</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column', alignItems:'center'}}>
										<Controller
											name='drawing_name'
											control={control}
											render={({ field }) => (
												<Row style={{width: '100%'}}>
													<Input style={{width: '100%'}} invalid={errors.drawing_name && true} {...field}/>
													{errors.drawing_name && <FormFeedback>{errors.drawing_name.message}</FormFeedback>}
												</Row>
											)}
										/>
									</Col>
								</Row>
							</Col>
							<Col lg='6' md='6' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
										건물코드&nbsp;
										<div className='essential_value'/>
									</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text start'>
										<Controller
											id='building'
											name='building'
											control={control}
											render={({ field: { value } }) => (
											<Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column', alignItems:'start', paddingTop: 0, paddingBottom: 0}}>
												<>
													<Select
														name='building'
														classNamePrefix={'select'}
														className="react-select custom-select-building custom-react-select"
														options={buildingList}
														value={value}
														defaultValue={buildingList[0]}
														onChange={handleSelectValidation}
													/>
													{building && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>건물을 선택해주세요.</div>}
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
									<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>직종</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text start'>
										<Controller
											id='employeeClass'
											name='employeeClass'
											control={control}
											render={({ field: { onChange, value } }) => (
											<Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column', alignItems:'start', paddingTop: 0, paddingBottom: 0}}>
												<>
													<Select
														name='employeeClass'
														classNamePrefix={'select'}
														className="react-select custom-select-employeeClass custom-react-select"
														options={employeeClassOptions}
														value={value}
														defaultValue={employeeClassOptions[0]}
														onChange={onChange}
													/>
												</>
											</Col>
										)}/>
									</Col>
								</Row>
							</Col>
							<Col lg='6' md='6' xs='12'>
								<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
									<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>층코드</Col>
									<Col lg='8' md='8' xs='8' className='card_table col text start'>
										<Controller
											id='floorCode'
											name='floorCode'
											control={control}
											render={({ field: { onChange, value } }) => (
											<Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column', alignItems:'start', paddingTop: 0, paddingBottom: 0}}>
												<>
													<Select
														name='floorCode'
														classNamePrefix={'select'}
														className="react-select custom-select-floorCode custom-react-select"
														options={floorOptions}
														value={value}
														defaultValue={floorOptions[0]}
														isDisabled={floorOptions.length <= 1}
														onChange={onChange}
													/>
												</>
											</Col>
										)}/>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row style={{marginLeft: 0, marginRight: 0, borderBottom: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
							<Col md='2' className='card_table col text center' style={{backgroundColor: primaryHeaderColor, borderLeft: '0.5px solid #B9B9C3', borderTop: '0.5px solid #B9B9C3'}}>첨부파일</Col>
							<Col md='10' style={{ display: 'flex', flexDirection: 'column', padding: 0, borderTop: '0.5px solid #B9B9C3'}}>
								{files.map((event, index) => {
									return (
										<Row style={{ display: 'flex', borderBottom: '1px solid #B9B9C3', borderLeft: '0.5px solid #B9B9C3', marginLeft: 0, marginRight: 0}} key={index}>
											<Col className="d-flex" style={{margin: '0.5%', paddingLeft: 0, paddingRight: 0}}>
												{event !== ''
													?
														<>
															<Col className='card_table col text start' style={{ paddingLeft: '1%', paddingRight: 0 }}>
																{event.original_name ? event.original_name : event.name}
															</Col>
															<Input type='file' id={`file${index}`} name={`file${index}`} onChange={(event) => checkSize(event, index)} style={{ width: '50%', display: 'none'}} />
															<Button onClick={() => handleButtonClick(index)} outline style={{ transform: 'rotate(0deg)', whiteSpace: 'nowrap' }}>변경</Button>
															<Button outline onClick={() => deleteFile(index)} style={{ transform: 'rotate(0deg)', whiteSpace: 'nowrap', marginLeft: '1%' }}>삭제</Button>
														</>
													: 
														<>
															<Input type='file' name={`file${index}`} onChange={(event) => checkSize(event, index)}/>
															<Button outline onClick={() => deleteFile(index)} style={{ transform: 'rotate(0deg)', whiteSpace: 'nowrap', marginLeft: '1%' }}>삭제</Button>
														</>
												}
											</Col>
										</Row>
									)
								})}
							</Col>
						</Row>
					</CardBody>
					<CardFooter style={{display:'flex', justifyContent:'end'}}>
						<Button color="report" className="mx-1" onClick={() => navigate(-1)}>취소</Button>
						<Button type='submit' color='primary'>확인</Button>
					</CardFooter>
				</Form>
			</Card>
		</Fragment>
	)
}

export default DrawingForm