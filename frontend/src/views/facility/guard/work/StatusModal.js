import winLogoImg from '@src/assets/images/winlogo.png'
import { axiosPostPutCallback, checkOnlyView, dateFormat, primaryColor } from '@utils'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import moment from 'moment'
import { Fragment, useEffect, useState } from 'react'
import Flatpickr from 'react-flatpickr'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { Button, Card, Col, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, Row } from "reactstrap"
import { API_FACILITY_GUARD_ADMIN_WORK_STATUS } from '../../../../constants'
import { FACILITY_WORK_STATUS } from '../../../../constants/CodeList'
import { AM, selectAmPm, selectHour, selectMinute, workStatusObj } from '../data'

const StatusModal = (props) => {
	const { isOpen, setIsOpen, row, setRow, employeeList, callback } = props
	const loginAuth = useSelector((state) => state.loginAuth)
	const [isDetail, setIsDetail] = useState(false)
	const [employee, setEmployee] = useState({label: '선택', value: ''})
	const [dataInfo, setDataInfo] = useState({
		ampm: selectAmPm[0],
		hh: {label: '', value: ''},
		mm: {label: '', value: ''},
		date: moment().format('YYYY-MM-DD'),
		description: ''
	})
	const { ampm, hh, mm, date, description } = dataInfo

	function closeModal() {
		setRow()
		setIsOpen(!isOpen)
		setIsDetail(false)
		setEmployee({label: '선택', value: ''})
		setDataInfo({
			...dataInfo,
			ampm: selectAmPm[0],
			hh: {label: '', value: ''},
			mm: {label: '', value: ''},
			date: moment().format('YYYY-MM-DD'),
			description: ''
		})
	}

	function handleChange (e, event) {
		setDataInfo({
			...dataInfo,
			[event.name]: e
		})
	}

	function handleDisableBtn() {
		if (employee.value === '') return true
		if (hh.value === '') return true
		if (mm.value === '') return true
		return false
	}

	function handleModify() {
		let datetime = ''
		if (dataInfo.ampm.value === AM) datetime = `${date} ${hh.value}:${mm.value}:00`
		else datetime = `${date} ${parseInt(hh.value) + 12}:${mm.value}:00`
		const formData = new FormData()
		formData.append('description', dataInfo.description)
		formData.append('user_id', employee.value)
		formData.append('datetime', datetime)
		axiosPostPutCallback('modify', '경비업무', `${API_FACILITY_GUARD_ADMIN_WORK_STATUS}/${row.id}`, formData, closeModal)
	}

	useEffect(() => {
		if (isOpen) {
			if (row.user) setIsDetail(true)
		}
	}, [isOpen])
	return (
		<Fragment>
			{
				row !== undefined &&
				<Modal isOpen={isOpen} toggle={() => closeModal()} className='modal-dialog-centered modal-lg'>
					<ModalBody style={{backgroundColor:`${primaryColor}`, borderTopLeftRadius : '0.357rem', borderTopRightRadius : '0.357rem'}}>
						<Row className='ms-1' style={{width:'100%', margin:'inherit'}}>
							<Col xs='10' className='custom-modal-header' style={{display: 'flex', flexDirection : 'column', justifyContent : 'center'}}>
								<Row style={{fontSize: '20px', color:'white'}}>
									경비업무
								</Row>
							</Col>

							<Col xs='2' className='custom-modal-header'>
								<Card style={{marginBottom:0, boxShadow:'none', backgroundColor:'transparent'}}>
									<img src={winLogoImg} style={{display:'flex', position:'relative', flexDirection:'column', height: "82px", width: '89px' }}/>
								</Card>
							</Col>
						</Row>
					</ModalBody>

					<ModalBody className='ms-1 me-1' style={{ backgroundColor:'#fff', borderBottomLeftRadius : '0.357rem', borderBottomRightRadius : '0.357rem', height:'auto'}}>
						<Row >
							{
								isDetail &&
								<Col xs={12} md={4}>
									<Label className="form-check-label custom_label">
										<Row><Col style={{display:'flex', alignItems:'center'}}>
											<div>직종</div>
										</Col></Row>
									</Label>
									<Input style={{width:'100%'}} readOnly value={row.user !== null ? row.user.employee_class?.code : ''}/>
								</Col>
							}
							<Col xs={12} md={4}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>이름</div>
									</Col></Row>
								</Label>
								{
									isDetail ?
										<Input style={{width:'100%'}} readOnly value={row.user !== null ? row.user.name : ''}/>
									:   <Select
											name='employeeClass'
											classNamePrefix={'select'}
											className="react-select"
											value={employee}
											options={employeeList}
											onChange={(e) => setEmployee(e)}
										/>
								}
							</Col>
							{
								isDetail &&
									<Col xs={12} md={4}>
										<Label className="form-check-label custom_label">
											<Row><Col style={{display:'flex', alignItems:'center'}}>
												<div>상태</div>
											</Col></Row>
										</Label>
										<Input style={{width:'100%'}} readOnly value={workStatusObj[row.status]}/>
									</Col>
							}
						</Row>
						<br/>
						<Row>
							<Col xs={12}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>위치</div>
									</Col></Row>
								</Label>
								<Input style={{width:'100%'}} readOnly value={row.nfc.location}/>
							</Col>
						</Row>
						<br/>
						<Row>
							<Col xs={12}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>순찰예정일시</div>
									</Col></Row>
								</Label>
								<Input style={{width:'100%'}} readOnly value={row.target_datetime}/>
							</Col>
						</Row>
						<br/>
						<Row>
							<Col xs={12}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>순찰일시</div>
									</Col></Row>
								</Label>
								{
									isDetail ?
										<Input style={{width:'100%'}} readOnly value={`${callback(row.status, row.tag_datetime, row.modify_datetime)}`}/>
									:
										<Row>
											<Col xs={4}>
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
											<Col xs={8}>
												<InputGroup style={{boxShadow:'none'}}>
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
								}
							</Col>
						</Row>
						<br/>
						<Row>
							<Col xs={12}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>비고</div>
									</Col></Row>
								</Label>
								{
									isDetail ?
										<Input rows={2} type='textarea' style={{width:'100%'}} readOnly value={row.description === null ? '' : row.description}/>
									:   <Input rows={10} type='textarea' name='description' style={{width:'100%', backgroundColor:'white', color:'black'}} bsSize='sm' value={description} 
											onChange={e => handleChange(e.target.value, e.target) }/>
								}
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter hidden={checkOnlyView(loginAuth, FACILITY_WORK_STATUS, 'available_update')}>
						{
							isDetail ?
								<Button type='submit' outline color='primary' onClick={() => setIsDetail(false)}>
									수정
								</Button>
							:
								<>
									<Button type='submit' outline color='danger' onClick={() => closeModal()}>
										취소
									</Button>
									<Button type='submit' outline color='primary' onClick={() => handleModify()} disabled={handleDisableBtn()}>
										수정
									</Button>
								</>
						}
					</ModalFooter>
				</Modal>
			}
		</Fragment>
	)
}

export default StatusModal