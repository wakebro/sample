import { yupResolver } from '@hookform/resolvers/yup'
import winLogoImg from '@src/assets/images/winlogo.png'
import { axiosPostPutRedux, checkSelectValue, checkSelectValueObj, getTableDataRedux, handleCheckCode, primaryColor, setFormData, setValueFormat, sweetAlert } from '@utils'
import axios from 'axios'
import { isEmptyObject } from 'jquery'
import { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from "react-redux"
import Select from 'react-select'
import { Button, Col, Form, FormFeedback, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Cookies from 'universal-cookie'
import { API_FACILITY_GUARD_NFC, API_FIND_BUILDING, API_FIND_FLOOR, API_FIND_ROOM } from '../../../../constants'
import { selectHourFull } from '../data'

const noneValue = {label:'', value:''}

const AddNFCModal = (props) => {
	const { modalTitle, redux, isOpen, modalType, defaultValues, resolver, setBuildingList, setFloorList, setRoomList } = props
	const dispatch = useDispatch()
	const cookies = new Cookies()
	const [oldCode, setOldCode] = useState()
	const [checkCode, setCheckCode] = useState(false)
	const [selectError, setSelectError] = useState({building: false})
	const [checkedHHList, setCheckedHHList] = useState(new Set())
	const [checkAllHH, setCheckAllHH] = useState(false)
	const {building} = selectError
	const keyObj = {
		buildingsAPI: API_FIND_BUILDING,
		buildings: setBuildingList,
		buildingDefault: {label:'건물을 선택해주세요', value:''},
		floorsAPI: API_FIND_FLOOR,
		floors: setFloorList,
		floorDefault: {label:'층을 선택해주세요', value:''},
		roomsAPI: API_FIND_ROOM,
		rooms: setRoomList,
		roomDefault: {label:'실을 선택해주세요', value:''}
	}

	const {
		control
		, handleSubmit
		, formState: { errors }
		, setValue
		, clearErrors
		, watch
	} = useForm({
		defaultValues: defaultValues,
		resolver: yupResolver(resolver)
	})

	const init = () => {
		setOldCode()
		setValue('code', '')
		setValue('location', '')
		setValue('building', keyObj.buildingDefault)
		setValue('floor', keyObj.floorDefault)
		setValue('room', keyObj.roomDefault)
		clearErrors('code')
		clearErrors('location')
		clearErrors('building')
		setSelectError({
			...selectError,
			building: false
		})
		setCheckedHHList(new Set())
		setCheckAllHH(false)
		dispatch(modalType(''))
	}

	const closeModal = () => {
		init()
		dispatch(isOpen(false))
	}

	function compareCode(newCode, oldCode, API, setCheckCode) {
		if (newCode === oldCode) {
			sweetAlert('', '중복된 코드가 존재합니다.<br/> 다시 한번 확인해주세요.', 'info', 'center')
			return false
		}

		const korean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
		if (!korean.test(newCode)) handleCheckCode(newCode, API, setCheckCode)
		else sweetAlert('NFC에는 한글 등록이 불가능합니다.', '영어, 숫자로 이루어진 NFC코드를 입력해주세요.', 'warning', 'center')
	}

	function handleSelectValidation (e, event) {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
		if (event.name === 'building') {
			dispatch(setFloorList([]))
			dispatch(setRoomList([]))
			setValue('floor', keyObj.buildingDefault)
			setValue('room', keyObj.roomDefault)
		} else if (event.name === 'floor') {
			dispatch(setRoomList([]))
			setValue('room', keyObj.roomDefault)
		}
	}

	function registerModifyNFC(data) {
		if (!checkCode && (data.code !== oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
		const resultString = Array.from(checkedHHList).sort().join(',')
		const formData = new FormData()

		setFormData(data, formData)
		formData.append('target_datetime', resultString)

		const API = redux.modalPageType === 'register' ? `${API_FACILITY_GUARD_NFC}/-1`
													: `${API_FACILITY_GUARD_NFC}/${redux.id}`
		axiosPostPutRedux(redux.modalPageType, modalTitle, API, formData, dispatch, isOpen, false)
	}

	function handleCheckboxClick(hour) {
		const tempChekedList = new Set(checkedHHList)
		if (tempChekedList.has(hour)) tempChekedList.delete(hour)
		else tempChekedList.add(hour)
		setCheckedHHList(tempChekedList)
	}

	function handleAllHHCheck(result) {
		const tempList = new Set()
		if (result) {
			selectHourFull.map(hour => tempList.add(hour.value))
		}
		setCheckedHHList(tempList)
		setCheckAllHH(result)
	}

	/**등록 */
	useEffect(() => {
		if (redux.modalIsOpen === true && redux.modalPageType !== '') {
			const params = {prop_id:cookies.get('property').value}
			getTableDataRedux(keyObj.buildingsAPI, params, dispatch, keyObj.buildings)
		} else init()
	}, [redux.modalIsOpen])

	/**수정 */
	useEffect(() => {
		if (redux.id !== null) {
			axios.get(`${API_FACILITY_GUARD_NFC}/${redux.id}`)
			.then(res => {
				const targetHH = res.data['target_datetime'].split(',')
				if (targetHH.length === selectHourFull.length) setCheckAllHH(true)
				setCheckedHHList(new Set(targetHH))
				setOldCode(res.data.code)
				setValueFormat(res.data, control._formValues, setValue, null)
				if (res.data.floor === null) setValue('floor', keyObj.floorDefault)
				if (res.data.room === null) setValue('room', keyObj.roomDefault)
				dispatch(isOpen(true))
				dispatch(modalType('modify'))
			})
		}
	}, [redux.id])

	useEffect(() => {
		if (redux.modalIsOpen && redux.buildingList.length === 0) {
			closeModal()
			const MySwal = withReactContent(Swal)
			MySwal.fire({
				icon: "warning",
				html: "등록된 건물 정보가 없습니다.",
				showConfirmButton: true,
				confirmButtonText: '확인',
				confirmButtonColor : primaryColor,
				reverseButtons :true,
				customClass: {
					actions: 'sweet-alert-custom right',
					cancelButton: 'me-1'
				}
			})
		}
	}, [redux.buildingList])

	useEffect(() => {
		if (!isEmptyObject(errors)) checkSelectValueObj(control, selectError, setSelectError)
	}, [errors])

	useEffect(() => setCheckCode(false), [watch('code')])

	useEffect(() => {
		if (watch('building').value !== '') {
			if (redux.modalPageType === 'register') setValue('floor', keyObj.floorDefault)
			const params = {building_id:watch('building').value}
			getTableDataRedux(keyObj.floorsAPI, params, dispatch, keyObj.floors)
		}
	}, [watch('building')])

	useEffect(() => {
		if (watch('floor') !== undefined && watch('floor').value !== '') {
			if (redux.modalPageType === 'register') setValue('room', keyObj.roomDefault)
			const params = {floor_id:watch('floor').value}
			getTableDataRedux(keyObj.roomsAPI, params, dispatch, keyObj.rooms)
		}
	}, [watch('floor')])

	return (
		<Fragment>
			<Form onSubmit={handleSubmit(registerModifyNFC)}>
				<Modal isOpen={redux.modalIsOpen} toggle={() => closeModal()} className='modal-dialog-centered modal-lg'>
					<ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
						<div className='mb-1 px-2' style={{display: 'flex', alignItems: 'center', justifyContent:'space-between'}}>
							<div className='mt-1'>
								<Row style={{fontSize: '20px', color:'white'}}>
									<span>
										{modalTitle}									
									</span>
								</Row>
								{
									redux.modalPageType === 'register' &&
										<Row  style={{fontSize: '16px', color:'white'}}>
											<span>
												빈칸에 맞춰 양식을 작성해 주세요.
											</span>
										</Row>
								}
							</div>
							<div>
								<img src={winLogoImg} style={{maxHeight: '85px'}}/> 
							</div>
						</div>
					</ModalHeader>

					<ModalBody className='ms-1 me-1' style={{ backgroundColor:'#fff', borderBottomLeftRadius : '0.357rem', borderBottomRightRadius : '0.357rem', height:'auto'}}>
						<Row>
							<Col xs={12} md={6}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>코드</div>
										&nbsp;
										{redux.modalPageType === 'register' && <div className='essential_value'/>}
									</Col></Row>
								</Label>
								
								{
									redux.modalPageType === 'register' ?
										<Controller
											name='code'
											control={control}
											render={({ field }) => (
												<Fragment>
													<InputGroup>
														<Input invalid={errors.code && true} {...field}/>
														<Button 
															onClick={() => compareCode(watch('code'), oldCode, API_FACILITY_GUARD_NFC, setCheckCode)}
														>중복검사</Button>
													</InputGroup>
													{errors.code && <div className='custom-form-feedback'>{errors.code.message}</div>}
												</Fragment>
											)}/>
									: 
										<Input style={{width:'100%'}} readOnly value={control._formValues.code}/>
								}
							</Col>
							<Col xs={12} md={6}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>장소</div>
										&nbsp;
										<div className='essential_value'/>
									</Col></Row>
								</Label>

								<Controller
									name='location'
									control={control}
									render={({ field }) => (
										<Fragment>
											<Input style={{width:'100%'}} invalid={errors.location && true} {...field}/>
											{errors.location && <FormFeedback>{errors.location.message}</FormFeedback>}
										</Fragment>
								)}/>
							</Col>
						</Row>
						<br/>
						<Row >
							<Col xs={12} md={4}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>건물</div>
										&nbsp;
										<div className='essential_value'/>
									</Col></Row>
								</Label>
								<Controller
									name='building'
									control={control}
									render={({ field: {value} }) => (
										<Fragment>
											<Select
												name='building'
												classNamePrefix={'select'}
												className="react-select custom-select-building custom-react-select"
												options={redux.buildingList}
												value={value}
												onChange={ handleSelectValidation }/>
											{building && <div className='custom-form-feedback'>건물을 선택해주세요.</div>}
										</Fragment>
								)}/>
							</Col>
							<Col xs={12} md={4}>
								<Label className="form-check-label custom_label">층</Label>
								<Controller
									name='floor'
									control={control}
									render={({ field: {value} }) => (
										<Fragment>
											<Select
												isDisabled={redux.floorList.length === 0}
												name='floor'
												classNamePrefix={'select'}
												className="react-select"
												options={redux.floorList}
												value={redux.floorList.length === 0 ? noneValue : value}
												onChange={ handleSelectValidation }/>
										</Fragment>
								)}/>
							</Col>
							<Col xs={12} md={4}>
								<Label className="form-check-label custom_label">실</Label>
								<Controller
									name='room'
									control={control}
									render={({ field: {onChange, value} }) => (
										<Fragment>
											<Select
												isDisabled={redux.roomList.length === 0}
												name='room'
												classNamePrefix={'select'}
												className="react-select"
												options={redux.roomList}
												value={redux.roomList.length === 0 ? noneValue : value}
												onChange={e => onChange(e)}/>
										</Fragment>
								)}/>
							</Col>
						</Row>
						<br/>
						<Row>
							<Col xs={12}>
								<Label className="form-check-label custom_label">
									<Row>
										<Col style={{display:'flex', alignItems:'center'}}>
											<div>순찰 시간</div>&nbsp;
											<div className='essential_value'/>
											&nbsp;&nbsp;
											<Input type="checkbox" id='total'
												checked={checkAllHH} readOnly 
												onClick={() => handleAllHHCheck(!checkAllHH)}
											/>&nbsp;&nbsp;&nbsp;
											<span>전체 선택</span>
									</Col></Row>
								</Label>
							</Col>
							<Col xs={12}>
								<Row>
									{
										selectHourFull.map((hour, idx) => {
											return (
												<Col key={idx} md={3} xs={4}>
													<Input type="checkbox" id={hour.value} 
														checked={checkedHHList.has(hour.value)} readOnly 
														onClick={() => handleCheckboxClick(hour.value)}
														/>&nbsp;<span>{`${hour.label}시`}</span>
												</Col>
											)
										})
									}
								</Row>
							</Col>
						</Row>
					</ModalBody>

					<br/>

					<ModalFooter>
						<Button disabled={checkedHHList.size === 0} color='primary' onClick={handleSubmit(registerModifyNFC)}>{redux.modalPageType === 'register' ? '등록' : '수정'}</Button>
						<Button color='report' onClick={() => closeModal()}>{'취소'}</Button>
					</ModalFooter>
				</Modal>
			</Form>
		</Fragment>
	)
}

export default AddNFCModal