import { yupResolver } from '@hookform/resolvers/yup'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import "@styles/react/pages/page-authentication.scss"
import * as moment from 'moment'
import { useEffect, useState } from 'react'
import Flatpickr from "react-flatpickr"
import { Controller, useForm } from 'react-hook-form'
import {
	Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody,
	ModalFooter, ModalHeader,
	Row
} from "reactstrap"
import * as yup from 'yup'
import { API_FIND_BUILDING, API_FIND_PROPERTY, API_FIND_FLOOR, API_FIND_OCCUPATION, API_FIND_QUESTION, API_FIND_WORK, API_COMPAINTS_RECEIVED, API_FIND_ROOM, API_INSPECTION_COMPLAIN_REGISTER } from '../../constants'
import axios from "../../utility/AxiosConfig"
import { useAxiosIntercepter } from '../../utility/hooks/useAxiosInterceptor'
import { formatDateTime, sweetAlert } from "../../utility/Utils"
import { BasicSelect, CustomSelect } from './ModalSelect'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const getAPI = (API, param, setData) => {
	axios.get(API, {
		params:param
	}).then(res => {
		setData(res.data)
	}).catch(err => {
		console.log(err)
	})
}
const defaultValues = {
	title: '',
	applicant: '',
	reception : moment().format('YYYY-MM-DD'),
	property: {value : '', label : '사업소 선택'},
	occupation: {value : '', label : '직종 선택'},
	work: {value : '', label : '업무 선택'},
	building : {value : '', label : '건물 선택'},
	floor : {value : '', label : '층수 선택'},
	room : {value : '', label : '호수 선택'},
	question : {value : '', label : '문제유형 선택'},
	memo : ""
}

const ComplainModal = (props) => {
	useAxiosIntercepter()

	const {formModal, setFormModal} = props
	const now = moment().format('YYYY-MM-DD')
	const [status, setStatus] = useState(false)
	const [buildStatus, setBuildStatus] = useState(false)
	const [floorStatus, setFloorStatus] = useState(false)

	const [property, setProperty] = useState({value : '', label : '사업소 선택'})
	
	const [occupation, setOccupation] = useState([{value : '', label : '직종 선택'}])
	const [occuValue, setOccuValue] = useState({value : '', label : '직종 선택'})

	const [building, setBuilding] = useState([{value : '', label : '건물 선택'}])
	const [buildValue, setBuildValue] = useState({value : '', label : '건물 선택'})

	const [floor, setFloor] = useState([{value : '', label : '층수 선택'}])
	const [floorValue, setFloorValue] = useState({value : '', label : '층수 선택'})
	const [room, setRoom] = useState([{value : '', label : '호수 선택'}])
	const [roomValue, setRoomValue] = useState({value : '', label : '호수 선택'})

	const [work, setWork] = useState([{value : '', label : '업무 선택'}])

	const [question, setQuestion] = useState([{value : '', label : '문제유형 선택'}])
	const [questionValue, setQuestionValue] = useState({value : '', label : '문제유형 선택'})


	const validationSchema = yup.object().shape({
		title: yup.string().required('제목을 입력해주세요').min(1, '1자 이상 입력해주세요')
		// userName: yup.string().required('이름를 입력해주세요').min(3, '1자 이상 입력해주세요'),
		// email: yup.string().email().required('이메일 주소를 입력해주세요'),
		// password: yup.string().required('비밀번호를 입력해주세요').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, '최소 8글자 이상, 대문자, 특수문자 포함'),
		// confirmPassword: yup
		// 	.string()
		// 	.required('비밀번호를 입력해주세요')
		// 	.oneOf([yup.ref(`password`), null], '비밀번호가 일치하지 않습니다'),
		// phone: yup.string().required('전화번호를 입력해주세요')

	})
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm({
		defaultValues,
		resolver: yupResolver(validationSchema)
	})
	const resetValue = () => {
		setStatus(false)
		setBuildStatus(false)
		setFloorStatus(false)
		setQuestionValue({value : '', label : '문제유형 선택'})
		setBuildValue({value : '', label : '건물 선택'})
		setFloorValue({value : '', label : '층수 선택'})
		setRoomValue({value : '', label : '호수 선택'})
	}

	const onSubmit = data => {
		if (data.property.value === '') {
			sweetAlert('', '사업소를 선택 해주세요.', 'warning', 'center')
			return false
		}
		if (data.work.value === '') {
			sweetAlert('', '업무구분을 선택 해주세요.', 'warning', 'center')
			return false
		}
		const formData = new FormData()
		formData.append('title', `${data.title} (비직원 신고)`)
		formData.append('request_datetime', formatDateTime(data.reception))
		formData.append('requester_name', `${data.applicant} (비직원)`)
		formData.append('prop_id', data.property.value)
		formData.append('emp_class_id', occuValue.value)
		formData.append('type', data.work.value)
		formData.append('building_id', buildValue.value)
		formData.append('floor_id', floorValue.value)
		formData.append('room_id', roomValue.value)
		formData.append('problem_type_id', questionValue.value)
		formData.append('request_description', data.memo)
		formData.append('status', '접수')
		
		axios.post(API_INSPECTION_COMPLAIN_REGISTER, formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		}).then(res => {
			if (res.status === 200) {
				resetValue()
				sweetAlert('', '불편신고 접수가 완료 되었습니다.', 'success', 'center')
			}
		}).catch(res => {
			console.log(res, "!!!!!!!!error")
			resetValue()
		})

		reset()
		setFormModal(!formModal)
	}

	const getFindCenter = () => {
		axios.get(API_FIND_PROPERTY)
			.then(res => {
				setProperty(res.data)
			}).catch(err => {
				console.log(err)
		})
	}
	// 업무 
	const getFindWork = () => {
		axios.get(API_FIND_WORK)
			.then(res => {
				setWork(res.data)
			}).catch(err => {
				console.log(err)
		})
	}
	
	const getFindOccupation = (data) => {
		const param = {
			prop_id : data.value
		}
		if (data.value !== '') {
			resetValue()
			setStatus(true)

			getAPI(API_FIND_QUESTION, param, setQuestion)
			getAPI(API_FIND_BUILDING, {prop_id: data.value}, setBuilding)

		} else {
			resetValue()
		}
	}

	const getFindFloor = (data) => {
		const param = {
			building_id : data.value
		}
		if (data.value !== '') {
			setBuildStatus(true)
			setFloorStatus(false)
			setFloorValue(floor[0])
			setRoomValue(room[0])

			axios.get(API_FIND_FLOOR, {
				params:param
			})
			.then(res => {
				if (res.data !== undefined) {
					setFloor(res.data)
					
				}
			}).catch(err => {
				console.log(err)
			})
		} else {
			setFloorValue(floor[0])
			setRoomValue(room[0])
			setBuildStatus(false)
			setFloorStatus(false)

		}
	}

	const getFindRoom = (data) => {
		const param = {
			floor_id : data.value
		}
		if (data.value !== 0) {
			setFloorStatus(true)
			setRoomValue(room[0])

			axios.get(API_FIND_ROOM, {
				params:param
			})
			.then(res => {
				if (res.data !== undefined) {
					setRoom(res.data)
				}
			}).catch(err => {
				console.log(err)
			})
		} else {
			setRoomValue(room[0])
			setFloorStatus(false)

		}
	}

	const customToggle = () => {
		setFormModal(!formModal)
		reset()
		resetValue()
	}
	
	useEffect(() => {
		if (formModal) {
			getAPI(API_FIND_OCCUPATION, {}, setOccupation)
			getFindCenter()
			getFindWork()
		}
	}, [formModal])
	return (
		
		<Modal isOpen={formModal} toggle={() => customToggle()} className='modal-dialog-centered modal-lg'>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<ModalHeader  toggle={() => customToggle()}><span style={{fontSize: '20px'}}>불편신고 접수</span></ModalHeader>
				<ModalBody>
					<div className='modal_complain' >
						<h5>불편신고 제목</h5>
					</div>
					<div className='mb-2'>
						<Controller
							id='title'
							name='title'
							control={control}
							render={({ field }) => <Input placeholder='시설물 안전 점검표' invalid={errors.title && true} {...field} />}
						/>
						{errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
					</div>
					<div className='modal_complain' >
						<h5>불편신고 정보</h5>
					</div>
					<div className='mb-2'>
						<Row className='mb-2'>
							<Col className='mb-1' lg ='6' md ='12'>
								<Label className="form-label mb-1" for="reception">
									접수 일시
								</Label>
								<Controller
									id='reception'
									name='reception'
									control={control}
									render={({field : {onChange, value}}) => <Flatpickr
													value={value}
													id='range-picker'
													className='form-control'
													onChange={date => onChange(date)}
													options={{
														mode: 'single', 
														maxDate: now,
														ariaDateFormat:'Y-m-d',
														locale: Korean
														}}/>
													}
								/>
								
							</Col>
							<Col className='mb-1' lg ='6' md ='12'>
								<BasicSelect yupControl={control} customId={'work'} customName={'업무 구분'} customOption={work}/>
							</Col>
						</Row>
						<Row className='mb-2'>
							<Col className='mb-1' lg ='6' md ='12'>
								<CustomSelect 
									yupControl = {control}
									customId = {'occupation'}
									customName = {'직종'}
									setCustomValue = {setOccuValue}
									customValue = {occuValue}
									customOption = {occupation}
									customState = {status}
								/>
							</Col>
							<Col className='mb-1' lg ='6' md ='12'>
								<Label className="form-label mb-1" for="applicant">
									신청자
								</Label>
								<Controller
									id='applicant'
									name='applicant'
									control={control}
									render={({ field }) => <Input type="text" placeholder='성함을 적어주세요.' {...field} />}
								/>	
							</Col>
						</Row>
					</div>
					<div className='modal_complain' >
						<h5>위치 정보</h5>
					</div>
					<div className='mb-2'>
						<Row className='mb-2'>
							<Col>
								<Row>
									<Col className='mb-1' lg ='6' md ='12'>
										<BasicSelect yupControl={control} customId={'property'} customName={'사업소'} callback={getFindOccupation} customOption={property}/>
									</Col>
									<Col className='mb-1' lg ='6' md ='12'>
										<CustomSelect 
											yupControl = {control}
											customId = {'building'}
											customName = {'건물'}
											customOption = {building}
											customState = {status}
											setCustomValue = {setBuildValue}
											customValue = {buildValue}
											callback = {getFindFloor}
										/>
										{/* {selectController('건물', 'building', building, getFindFloor)} */}
									</Col>
								</Row>
											
							</Col>
							<Col>
								<Row>
									<Col className='mb-1' lg ='6' md ='12'>
										<CustomSelect 
											yupControl = {control}
											customId = {'floor'}
											customName = {'층'}
											customOption = {floor}
											customState = {buildStatus}
											setCustomValue = {setFloorValue}
											customValue = {floorValue}
											callback = {getFindRoom}
										/>
									</Col>
									<Col className='mb-1' lg ='6' md ='12'>
										<CustomSelect 
											yupControl = {control}
											customId = {'room'}
											customName = {'호실'}
											customOption = {room}
											customState = {floorStatus}
											setCustomValue = {setRoomValue}
											customValue = {roomValue}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</div>
					<div className='modal_complain' >
						<h5>문제 유형</h5>
					</div>
					<div className='mb-2'>
						<Row className='mb-2'>
							<Col className='mb-1' lg ='6' md ='12'>
								<CustomSelect 
									yupControl = {control}
									customId = {'question'}
									customName = {'문제 유형'}
									customOption = {question}
									customState = {status}
									setCustomValue = {setQuestionValue}
									customValue = {questionValue}
									
								/>
							</Col>
						</Row>
						<Row className='mb-2'>
							<Col className='mb-1'>
								<Label className="form-label mb-1" for="memo">
									상세 설명
								</Label>
								<Controller
									id='memo'
									name='memo'
									control={control}
									render={({ field }) => <Input type="textarea" placeholder='상세 설명을 적어주세요.' {...field} />}
								/>		
							</Col>
						</Row>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button type='submit' outline color='primary' >
						저장
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	)
}

export default ComplainModal
