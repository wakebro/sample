/* eslint-disable */
import winLogoImg from '@src/assets/images/winlogo.png'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useAxiosIntercepter } from '@utility/hooks/useAxiosInterceptor'

import { Fragment } from "react"
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { Button, Col, Form, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import Cookies from 'universal-cookie'

import { axiosPostPutNavi } from '@utils'
import { API_DISASTER_EMERGENCY, ROUTE_DASHBOARD } from '../../../constants'
import { useNavigate } from 'react-router-dom'
import { primaryColor } from '../../../utility/Utils'

const AlarmMdal = (props) => {
	useAxiosIntercepter()
	const { isOpen, setIsOpen} = props
	const cookies = new Cookies()
	const navigate = useNavigate()
	
	const selectList = [
		// {value:'', label: '선택'},
		{value:0, label: '사고'},
		{value:1, label: '화재'},
		{value:2, label: '누수'},
		{value:3, label: '누전'}
	]

	const defaultValues = {
		type:selectList[0],
		contents: ''
	}

	const {
		control,
		handleSubmit,
	} = useForm({
		defaultValues
	})


	const handleSendAlarm = (data) => {
		console.log('전송')
		console.log(data)
		const formData = new FormData()
		formData.append('type', data.type.value)
		formData.append('contents', data.contents)
		formData.append('property_id', cookies.get('property').value)
		formData.append('sender_id', cookies.get('userId'))
		// user_id 추가
		axiosPostPutNavi('register', '긴급알림', API_DISASTER_EMERGENCY, formData, navigate, ROUTE_DASHBOARD)
	}

	const closeModal = () => {
		setIsOpen(false)
	}

	return ( 
		<Fragment>
			<Modal isOpen={isOpen} toggle={() => closeModal()} className='modal-dialog-centered modal'>
				<ModalHeader style={{backgroundColor: 'red', width: '100%', padding: 0}}>
					<div className='mb-1 px-1' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
						<div>
							<Row>
								<span style={{color: 'white', fontSize: '20px', paddingLeft:'23px', paddingTop:'4%'}}>
									긴급알림 발송
								</span>
							</Row>
						</div>
						<div>
							<img src={winLogoImg} style={{maxHeight: '85px'}}/> 
						</div>
					</div>
				</ModalHeader>
				<Form onSubmit={handleSubmit(handleSendAlarm)}>
					<ModalBody>
						<Controller 
							control={control}
							id='type'
							name='type'
							render={({ field: {onChange, value} }) => {
								return(
									<Select 
										onChange={e => {
											onChange(e)
										}}
										className="react-select"
										classNamePrefix={'select'}
										options={selectList}
										value={value}
										isClearable={false}
									/>
								)
							}}
						/>
						<br/>
						<Controller
							control={control}
							id='contents'
							name='contents'
							render={({ field }) => 
									<Input type='textarea' rows={3} maxLength={100} {...field}
										placeholder='비고'/>
							}
						/>

					</ModalBody>
					<ModalFooter>
						<Row style={{width:'100%'}}>
							<Col style={{display:'flex', justifyContent:'end'}}>
								<Button color='report' onClick={() => closeModal()}>취소</Button>
								<Button color='danger' className="ms-1" onClick={handleSubmit(handleSendAlarm)}>발송</Button>
							</Col>
						</Row>
					</ModalFooter>
				</Form>
			</Modal>
		</Fragment>
	)
}
export default AlarmMdal