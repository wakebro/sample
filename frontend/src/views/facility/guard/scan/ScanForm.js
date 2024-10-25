import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setSubmitResult } from '@store/module/nfcWorker'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { axiosPostPutRedux, dateFormat } from '@utils/'

import { Fragment, useEffect, useState } from "react"
import Flatpickr from 'react-flatpickr'
import { Controller } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { Button, Card, CardBody, Col, Form, Input, InputGroup, Row } from "reactstrap"
import { API_FACILITY_GUARD_SCAN } from '../../../../constants'
import { listAmPm, selectAmPm, selectHour, selectMinute } from '../data'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const ScanForm = (props) => {
	useAxiosIntercepter()
	const { control, handleSubmit } = props
	const nfcWorker = useSelector((state) => state.nfcWorker)
	const dispatch = useDispatch()
	const [datetime, setDatetime] = useState({
		ampm: {label: '', value: ''},
		hh: {label: '', value: ''},
		mm: {label: '', value: ''},
		date: ''
	})
	const { ampm, hh, mm, date } = datetime

	function handleChange (e, event) {
		setDatetime({
			...datetime,
			[event.name]: e
		})
	}

	function onSubmit (data) {
		const formData = new FormData()
		formData.append('modify_datetime', `${datetime.date} ${datetime.ampm.value === 0 ? datetime.hh.value : parseInt(datetime.hh.value) + 12}:${datetime.mm.value}:00`)
		formData.append('description', data.description)
		
		axiosPostPutRedux('modify', 'NFC 태그', `${API_FACILITY_GUARD_SCAN}/${nfcWorker.id}`, formData, dispatch, setSubmitResult, true)
	}

	useEffect(() => {
		const [tempDate, tempTime] = control._formValues.tagTime.split('T')
		// 시간
		const ampm =  parseInt(tempTime.substr(0, 2)) >= 12 ? 1 : 0
		let hh =  parseInt(tempTime.substr(0, 2)) >= 12 ? parseInt(tempTime.substr(0, 2)) - 12 : parseInt(tempTime.substr(0, 2))
		hh = 10 < hh ? `0${hh}` : String(hh)
		const mm =  tempTime.substr(3, 2)

		setDatetime({
			...datetime,
			ampm: {label: listAmPm[`${ampm}`], value: ampm},
			hh: {label: hh, value: hh},
			mm: {label: mm, value: mm},
			date: dateFormat(tempDate)
		})
	}, [])
	return (
		<Fragment>
			<Card>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<CardBody style={{cursor:'pointer'}}>
						<Row>
							<Col xs={3}>
								<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
									<Col xs={12}>위치</Col>
								</Row>
							</Col>
							<Col xs={9}>
								<Row>
									<Col xs={12} style={{color:'#6E6B7B', fontSize:'16px', fontWeight:500}}>{control._formValues.location}</Col>
								</Row>
							</Col>
						</Row>
					</CardBody>
					<hr style={{margin:0}}/>
					<CardBody style={{cursor:'pointer'}}>
						<Row>
							<Col xs={3}>
								<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
									<Col xs={12}>날짜</Col>
								</Row>
							</Col>
							<Col xs={9}>
								<Flatpickr
									name='date'
									className='form-control'
									value={date}
									options={{
										ariaDateFormat:'Y-m-d',
										locale: Korean
									}}
									onChange={date => {
										const event = {name : 'date'}
										handleChange(dateFormat(date[0]), event)
									}}/>
							</Col>
						</Row>
					</CardBody>
					<hr style={{margin:0}}/>
					<CardBody style={{cursor:'pointer'}}>
						<Row>
							<Col xs={3}>
								<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
									<Col xs={12}>시간</Col>
								</Row>
							</Col>
							<Col xs={9}>
								<Row>
									<Col xs={12} style={{color:'#5E5873', fontSize:'15px', fontWeight:600}}>
										<InputGroup>
											<Select
												name='ampm'
												classNamePrefix={'select'}
												className="react-select "
												options={selectAmPm}
												value={ampm}
												onChange={ handleChange }
											/>
											<Select
												name='hh'
												classNamePrefix={'select'}
												className="react-select "
												options={selectHour}
												value={hh}
												onChange={ handleChange }
											/>
											<Select
												name='mm'
												classNamePrefix={'select'}
												className="react-select "
												options={selectMinute}
												value={mm}
												onChange={ handleChange }
											/>
										</InputGroup>
									</Col>
								</Row>
							</Col>
						</Row>
					</CardBody>
					<hr style={{margin:0}}/>
					<CardBody style={{cursor:'pointer'}}>
						<Row>
							<Col xs={3}>
								<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
									<Col xs={12}>직종</Col>
								</Row>
							</Col>
							<Col xs={9}>
								<Row>
									<Col xs={12} style={{color:'#6E6B7B', fontSize:'16px', fontWeight:500}}>{control._formValues.employeeClass}</Col>
								</Row>
							</Col>
						</Row>
					</CardBody>
					<hr style={{margin:0}}/>
					<CardBody style={{cursor:'pointer'}}>
						<Row>
							<Col xs={3}>
								<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
									<Col xs={12}>직원</Col>
								</Row>
							</Col>
							<Col xs={9}>
								<Row>
									<Col xs={12} style={{color:'#6E6B7B', fontSize:'16px', fontWeight:500}}>{control._formValues.user}</Col>
								</Row>
							</Col>
						</Row>
					</CardBody>
					<hr style={{margin:0}}/>
					<CardBody style={{cursor:'pointer'}}>
						<Row>
							<Col xs={3}>
								<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
									<Col xs={12}>비고</Col>
								</Row>
							</Col>
							<Col xs={9}>
								<Row>
									<Col xs={12} style={{color:'#6E6B7B', fontSize:'16px', fontWeight:500}}>
										<Controller
											name='description'
											control={control}
											render={({ field }) => (
												<Input rows={10} type='textarea' style={{width:'100%', backgroundColor:'white', color:'black'}} bsSize='sm' {...field}/>
											)}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</CardBody>
					<hr style={{margin:0}}/>
					<CardBody style={{cursor:'pointer'}}>
						<Row>
							<Col className='d-flex justify-content-end' style={{paddingRight: '3%'}}>
								<Button color="primary" outline onClick={handleSubmit(onSubmit)}>
									<span className='align-middle ms-20'>수정</span>
								</Button>
							</Col>
						</Row>
					</CardBody>
				</Form>
			</Card>
		</Fragment>
	)
}

export default ScanForm