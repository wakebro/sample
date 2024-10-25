import { yupResolver } from '@hookform/resolvers/yup'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import "@styles/react/pages/page-authentication.scss"
import axios from "@utility/AxiosConfig"
import { getTableData, makeSelectList, sweetAlert, primaryHeaderColor } from '@utils'

import * as moment from 'moment'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	Button, Col, Form, FormFeedback, Input,
	Modal, ModalBody,
	ModalHeader,
	Row
} from "reactstrap"
import Cookies from "universal-cookie"
import * as yup from 'yup'

import { API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, API_DOC_RECEIVER, API_DOC_RECEIVER_GROUP_LIST, API_INTRANET_NOTIFICATION_FORM, API_MANUAL_REGISTER } from "../../../../../constants"
import ModalAddTable from "../../../../intranet/document/send/ModalAddTable"
import ModalDataTable from "../../../../intranet/document/send/ModalDataTable"
import EmployeeFilter from "./EmployeeFilter"

const GroupAddModal = (props) => {
	useAxiosIntercepter()
	const {formModal, setFormModal} = props
	const cookies = new Cookies()
	const [data, setData] = useState([])
	const [tableSelect, setTableSelect] = useState([])
	const [employeeClassList, setEmployeeClassList] = useState([])
	const [selectClass, setSelectClass] = useState({label: '직종 전체', value:''}) // 필터의 직종
	const [searchParams, setSearchParams] = useState('')
	const [show, setShow] = useState(false)
	const [writer, setWriter] = useState('')
	const now = moment().format('YYYY-MM-DD')
	const [groupReceivers, setReceiverGroup] = useState([])
	const [groupReceiverId, setReceiverGroupId] = useState({label: '수신자 그룹', value:''})
	const [emergency, setEmergency] = useState()
	const user_id = cookies.get('userId')
	
	const validationSchema = yup.object().shape({})
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm({
		resolver: yupResolver(validationSchema)
	})

	const changeSearch = (property) => {
		const param = {
			employeeClass : selectClass.value,
			search : searchParams,
			propertyId: property
		}
		getTableData(API_DOC_RECEIVER, param, setData)
	}

	const columns = [
		{
			name: '직종',
			sortable: true,
			selector: row => row.employee_class
		},
		{
			name: '직급',
			sortable: true,
			selector: row => row.position
		},
		{
			name: '이름(아이디)',
			sortable: true,
			selector: row => row.name,
			width:'35%'
		}
	]

	const onSubmit = (data) => {
		if (tableSelect.length === 0) {
			sweetAlert('', "알림을 보낼 대상을 선택해주세요.", 'warning')
			return
		}
		const formData = new FormData()
		formData.append('subject', '불편신고 및 작업현황')
		formData.append('contents', (data.description !== null && data.description !== undefined) ? data.description : '')
		formData.append('sender_id', user_id)
		formData.append('employee_list', tableSelect)
		formData.append('doc_file', undefined)
		formData.append('where_to_start', '')

		axios.post(API_INTRANET_NOTIFICATION_FORM, formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		})
		.then(res => {
			if (res.status === 200) {
				sweetAlert('알림 전송 성공', '알림이 전송 되었습니다.', 'success')
			} else {
				sweetAlert('알림 전송 실패', '알림이 전송 실패하였습니다.', 'warning')
			}
		})
		.catch(error => {
			// 응답 실패 시 처리
			console.error(error) 
		})
		//axios end

		setTableSelect([])
		reset()
		setFormModal(!formModal)
	}
	const customToggle = () => {
		setFormModal(!formModal)
		reset()
	}

	useEffect(() => {
	if (groupReceiverId && groupReceiverId.value !== '') {
		setShow(false)
		const params = { tableSelect: JSON.stringify([groupReceiverId.value]) }
		axios.get(API_DOC_RECEIVER_GROUP_LIST, { params })
			.then((res) => setReceiverGroup(res.data))
			.catch((error) => console.error(error))
	}	
	}, [groupReceiverId])

	useEffect(() => {
		if (formModal) {
			const param = {
				employeeClass : selectClass.value,
				search : searchParams,
				propertyId: cookies.get('property').value
			}
			getTableData(API_DOC_RECEIVER, param, setData)
		}
	}, [formModal])

	useEffect(() => {
		axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, { params: {property_id: 0} })
		.then(resEmployeeClass => {
			makeSelectList(true, '', resEmployeeClass.data, employeeClassList, setEmployeeClassList, ['name'], 'id')
		})
		axios.get(API_MANUAL_REGISTER, { params: {user_id: cookies.get('userId')} })
		.then(res => setWriter(res.data.username))
	}, [])

	useEffect(() => {
		if (groupReceivers.length > 0) {
			const temp = []
			groupReceivers.map(row => temp.push(row.id))
			setTableSelect(temp)
			setShow(true)
		}
	}, [groupReceivers])

	return (
		<Modal isOpen={formModal} toggle={() => customToggle()} className='modal-dialog-centered modal-lg'>
			<Form id='secondForm' onSubmit={handleSubmit(onSubmit)}>
				<ModalHeader>
					<div className="d-flex" style={{ flexDirection: 'column' }}>
						<span style={{fontSize: '20px'}}>앱 알림발송</span>
						<span style={{ fontSize: '12px' }}>수신자 등록 후 알림내용 작성 후 발신하기 버튼을 눌러 알림을 발송해 보세요.</span>
					</div>
				</ModalHeader>
				<ModalBody>
					<EmployeeFilter 
						selectClass={selectClass} 
						setSelectClass={setSelectClass} 
						searchParams={searchParams}
						setSearchParams={setSearchParams}
						changeSearch={changeSearch}
						groupReceiverId={groupReceiverId}
						setReceiverGroupId={setReceiverGroupId}
						/>
					{show ? (
						<Row>
							<ModalAddTable className= 'mt-2'
							columns={columns}
							tableData={data}
							setTabelData={setData}
							setTableSelect={setTableSelect}
							tableSelect={tableSelect}
							selectType={true}/>
						</Row>
					) : (
						<Row>
							<ModalAddTable className='mt-2'
								columns={columns}
								tableData={data}
								setTabelData={setData}
								setTableSelect={setTableSelect}
								tableSelect={tableSelect}
								selectType={true}/>
						</Row>
					)}   
					<Row className="card_table top mt-2">
						<Col xs='12' md='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col text center 'style={{ backgroundColor: primaryHeaderColor}}>수신인원</Col>
								<Col xs='8' className='card_table col text start ' >
								{`총 ${tableSelect.length} 명`}
								</Col>
							</Row>
						</Col>
						<Col>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col text center ' style={{ backgroundColor: primaryHeaderColor}}>긴급도</Col>
								<Col xs='8' className='card_table col text start '>
									<Input
									type='radio'
									checked={!emergency}
									onChange={() => setEmergency(false)}
									/>
									<div style={{marginRight:'10%'}}>일반</div>
									<Input
									type='radio'
									checked={emergency}
									onChange={() => setEmergency(true)}
									/>
									<div>긴급</div>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className="card_table mid">
						<Col xs='12' md='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col text center ' style={{ backgroundColor: primaryHeaderColor}}>발신자</Col>
								<Col xs='8' className='card_table col text start '>
									{writer}
								</Col>
							</Row>
						</Col>
						<Col>
							<Row className='card_table table_row' >
								<Col xs='4'  className='card_table col  text center' style={{whiteSpace: 'nowrap', backgroundColor: primaryHeaderColor}}>발신일자</Col>
								<Col xs='8' className='card_table col text start'>
									{now}	
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className="card_table mid">  
						<Col xs='12' md='12'>
							<Row className='card_table table_row'>
								<Col xs='4' md='2'  className='card_table col  text center' style={{whiteSpace: 'nowrap', backgroundColor: primaryHeaderColor}}>발신내용</Col>
								<Col xs='8' md='10' className='card_table col text start '>
								<Controller
										id='description'
										name='description'
										control={control}
										render={({ field }) => <Input type='textarea' invalid={errors.description && true} {...field} />}/>
									{errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}

								</Col>
							</Row>
						</Col>
					</Row>

				</ModalBody>
			</Form>
			<Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%'}}>
				<Button color='report' style={{marginTop: '1%', marginRight: '1%'}} onClick={customToggle}>취소</Button>
				<Button color='primary' style={{marginTop: '1%'}} onClick={handleSubmit(onSubmit)}>발신</Button>
			</Col>
		</Modal>
	)
}

export default GroupAddModal