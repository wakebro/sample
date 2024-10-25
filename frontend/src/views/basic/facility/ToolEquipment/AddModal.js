import { yupResolver } from '@hookform/resolvers/yup'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import "@styles/react/pages/page-authentication.scss"
import * as moment from 'moment'
import { useState, useEffect } from 'react'
import Flatpickr from "react-flatpickr"
import { Controller, useForm } from 'react-hook-form'
import {
	Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody,
	ModalHeader, Row
} from "reactstrap"
import * as yup from 'yup'
import { API_BASICINFO_FACILITY_TOOLEQUIPMENT_RECORD, API_BASICINFO_FACILITY_TOOLEQUIPMENT_RECORD_MODAL  } from '../../../../constants'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import Cookies from "universal-cookie"
import { getTableData, axiosPostPut, sweetAlert } from '../../../../utility/Utils'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const defaultValues = {
	title: '',
	date : moment().format('YYYY-MM-DD')
	
}

const AddModal = (props) => {
	useAxiosIntercepter()
	const {formModal, setFormModal, activeTab, toolequipment_id, setSubmitResult} = props
	const now = moment().toDate()
    const [file, setFile] = useState()
	const [detail, setDetail] = useState()
	const cookies = new Cookies()
    const userid = cookies.get('userId')
	const property_id = cookies.get('property').value

	const validationSchema = yup.object().shape({
		title: yup.string().required('제목을 입력해주세요').min(1, '1자 이상 입력해주세요')

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

	const onSubmit = data => {
		if (activeTab === 'file' && file === undefined) {
			sweetAlert('', '등록된 첨부파일이 없습니다.<br/>다시 확인해 주세요.', 'warning')
			return false
		}
		const formData = new FormData()
		formData.append('title', data.title)
		formData.append('date',  data.date)
        formData.append('file', file)
        formData.append('description', data.description)
        formData.append('activeTab', activeTab)
        formData.append('toolequipment_id', toolequipment_id)
		formData.append('user_id', userid)
		const mainTitle = activeTab === 'record' ? '공구비품이력' : '첨부파일'
		axiosPostPut('register', mainTitle, API_BASICINFO_FACILITY_TOOLEQUIPMENT_RECORD, formData, setSubmitResult)
		reset()
		setFormModal(!formModal)
	}
    
    const handleChangeFile = (event) => {
        setFile(event.target.files[0])
    }

	const customToggle = () => {
		setFormModal(!formModal)
		reset()
	}

	useEffect(() => {
		getTableData(API_BASICINFO_FACILITY_TOOLEQUIPMENT_RECORD_MODAL, {property_id: property_id, user_id: userid, toolequipment_id: toolequipment_id }, setDetail)
	}, [])

	return (
		
		<Modal isOpen={formModal} className='modal-dialog-centered modal-lg'>
			<Form id='secondForm' onSubmit={handleSubmit(onSubmit)}>
				<ModalHeader><span style={{fontSize: '20px'}}>공구비품이력</span></ModalHeader>
				<ModalBody>
					<div className='mb-1'>{`${detail && detail.toolequipment} (${detail && detail.property}) 의 공구비품이력`}</div>
					<Row className="card_table top">
                        <Col  xs='6'>
                            <Row className='card_table table_row'>
                                <Col xs='4'  className='card_table col  text center ' style={{ backgroundColor: '#D8D6DE'}}>사진제목</Col>
                                <Col xs='8' className='card_table col text start '>
								<Controller
									id='title'
									name='title'
									control={control}
									render={({ field }) => <Input invalid={errors.title && true} {...field} />}
								/>
								{errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}

                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row className='card_table table_row'>
                                <Col xs='4'  className='card_table col text center ' style={{ backgroundColor: '#D8D6DE'}}>등록일자</Col>
                                <Col xs='8' className='card_table col text start '>
									<Controller
										id='date'
										name='date'
										control={control}
										render={({ field: { onChange, value } }) => (
											<Flatpickr
											value={value ? moment(value).toDate() : null}
											id='range-picker'
											className='form-control'
											onChange={date => onChange(moment(date[0]).format('YYYY-MM-DD'))}
											options={{
												mode: 'single',
												maxDate: now,
												ariaDateFormat: 'Y-m-d',
												locale: Korean
											}}
											/>
										)}
										/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
               		<Row className="card_table mid">
						<Col>
                            <Row className='card_table table_row'>
                                <Col xs='4'  className='card_table col text center ' style={{ backgroundColor: '#D8D6DE'}}>등록자</Col>
                                <Col xs='8' className='card_table col text start '>
	                                <div>{detail && detail.username}</div>
                                </Col>
                            </Row>
                    	</Col>
						<Col>
							<Row className='card_table table_row' >
								<Col xs='4'  className='card_table col  text center' style={{whiteSpace: 'nowrap', backgroundColor: '#D8D6DE'}}>첨부파일</Col>
								<Col xs='8' className='card_table col text start'>
									<Input type='file' id='file' name='file' onChange={(e) => handleChangeFile(e)} />      
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className="card_table mid">
						<Col>
							<Row className='card_table table_row'>
								<Col xs='2'  className='card_table col  text center' style={{whiteSpace: 'nowrap', backgroundColor: '#D8D6DE'}}>비고</Col>
								<Col xs='10' className='card_table col text start '>
									<Controller
											id='description'
											name='description'
											control={control}
											render={({ field }) => <Input type='textarea' invalid={errors.description && true} {...field} />}
										/>
										{errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
					</Row>
					<Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%'}}>
						<Button style={{marginTop: '1%', marginRight: '1%'}} color="report" onClick={customToggle}>취소</Button>
						<Button type='submit' color='primary' style={{marginTop: '1%'}}>저장</Button>
					</Col>
				</ModalBody>
			</Form>
		</Modal>
	)
}

export default AddModal
