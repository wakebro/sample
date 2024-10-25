import { yupResolver } from '@hookform/resolvers/yup'
import winLogoImg from '@src/assets/images/winlogo.png'
import axios from "@utility/AxiosConfig"
import { AddCommaOnChange, axiosPostPutRedux, checkSelectValue, checkSelectValueObj, compareCodeWithValue, getTableDataRedux, primaryColor, setFormData, setValueFormat, sweetAlert } from '@utils'
import { isEmptyObject } from 'jquery'
import { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from "react-redux"
import Select from 'react-select'
import { Button, Col, Form, FormFeedback, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Cookies from 'universal-cookie'
import { API_EMPLOYEE_LIST, API_FIND_BUILDING, API_FIND_FLOOR, API_FIND_ROOM } from '../../../../constants'
import { assetTypeAPI, iotTypeSelect } from '../data'

const noneValue = {label:'', value:''}

const AddCameraModal = (props) => {
	const { type, modalTitle, redux, isOpen, modalType, defaultValues, resolver, setBuildingList, setFloorList, setRoomList, setContactList, setManagerList } = props
	const dispatch = useDispatch()
	const cookies = new Cookies()
	const [oldCode, setOldCode] = useState()
	const [checkCode, setCheckCode] = useState(false)
	const [selectError, setSelectError] = useState(type === 'camera' ? {building: false, contact: false}
																	: {building: false, contact: false, iotType: false})
	const {building, contact, iotType} = selectError
	const keyObj = {
		buildingsAPI: API_FIND_BUILDING,
		buildings: setBuildingList,
		buildingDefault: {label:'건물을 선택해주세요', value:''},
		floorsAPI: API_FIND_FLOOR,
		floors: setFloorList,
		floorDefault: {label:'층을 선택해주세요', value:''},
		roomsAPI: API_FIND_ROOM,
		rooms: setRoomList,
		roomDefault: {label:'실을 선택해주세요', value:''},
		contactAPI: API_EMPLOYEE_LIST,
		contacts: setContactList,
		contactDefault: {label:'담딩자를 선택해주세요', value:''},
		managerAPI: '',
		managers: setManagerList,
		managerDefault: {label:'관리자를 선택해주세요', value:''},
		iotTypeDefault: {label:'타입을 선택해주세요', value:''},
		nomalMin: 0.0,
        nomalMax: 0.0
	}

	const {
		control
		, handleSubmit
		, formState: { errors }
		, setValue
		, clearErrors
		, watch
		, trigger
	} = useForm({
		defaultValues: defaultValues[type],
		resolver: yupResolver(resolver[type])
	})

	const init = () => {
		setValue('code', '')
		setValue('location', '')
		setValue('building', keyObj.buildingDefault)
		setValue('floor', keyObj.floorDefault)
		setValue('room', keyObj.roomDefault)
		setValue('contact', keyObj.contactDefault)
		setValue('manager', keyObj.managerDefault)
		setValue('iotType', keyObj.iotTypeDefault)
		setValue('nomalMin', keyObj.nomalMin)
		setValue('nomalMax', keyObj.nomalMax)
		clearErrors('code')
		clearErrors('location')
		clearErrors('building')
		clearErrors('contact')
		clearErrors('iotType')
		clearErrors('nomalMin')
		clearErrors('nomalMax')
		const tempSelectError = type === 'camera' ? {building: false, contact: false}
												: {building: false, contact: false, iotType: false}
		setSelectError(tempSelectError)
		dispatch(modalType(''))
	}

	const closeModal = () => {
		init()
		dispatch(isOpen(false))
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

	function registerModify(data) {
		if (!checkCode && (data.code !== oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}

		const formData = new FormData()
		setFormData(data, formData)
		const API = redux.modalPageType === 'register' ? `${assetTypeAPI[type]}/-1`
													: `${assetTypeAPI[type]}/${redux.id}`
		axiosPostPutRedux(redux.modalPageType, modalTitle, API, formData, dispatch, isOpen, false)
	}

	/**등록 */
	useEffect(() => {
		if (redux.modalIsOpen === true && redux.modalPageType !== '') {
			const buildingListParams = {prop_id:cookies.get('property').value}
			const employeeListParams = {
				propId: cookies.get('property').value,
				employeeClass: '',
				employeeLevel: '',
				employeeStatue: '',
				search: ''
			}
			getTableDataRedux(keyObj.buildingsAPI, buildingListParams, dispatch, keyObj.buildings)
			axios.get(keyObj.contactAPI, {params: employeeListParams})
				.then(res => {
					const tempList = [keyObj.managerDefault]
					res.data.map(row => {
						if (row.status === '재직') tempList.push({label:`${row.name} (${row.class ? row.class : ''}/${row.level ? row.level : ''})`, value:row.id})
					})
					dispatch(keyObj.managers(tempList))
					const temp2 = tempList.filter((_, idx) => idx !== 0)
					dispatch(keyObj.contacts(temp2))
				})
		} else init()
	}, [redux.modalIsOpen])

	/**수정 */
	useEffect(() => {
		if (redux.id !== null) {
			axios.get(`${assetTypeAPI[type]}/${redux.id}`)
			.then(res => {
				setOldCode(res.data.code)
				setValueFormat(res.data, control._formValues, setValue, null)
				if (res.data.floor === null) setValue('floor', keyObj.floorDefault)
				if (res.data.room === null) setValue('room', keyObj.roomDefault)
				if (res.data.contact === null) setValue('contact', keyObj.contactDefault)
				if (res.data.manager === null) setValue('manager', keyObj.managerDefault)
				if (type === 'iot') {
					setValue('iotType', iotTypeSelect.filter(type => type.value === res.data.iot_type)[0])
					setValue('nomalMin', res.data.normal_min)
					setValue('nomalMax', res.data.normal_max)
				}
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
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
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
			<Form onSubmit={handleSubmit(registerModify)}>
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
															onClick={() => compareCodeWithValue(watch('code'), oldCode, assetTypeAPI[type], setCheckCode)}
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
							<Col xs={12} md={6}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>담당자</div>
										&nbsp;
										<div className='essential_value'/>
									</Col></Row>
								</Label>
								<Controller
									name='contact'
									control={control}
									render={({ field: {value} }) => (
										<Fragment>
											<Select
												name='contact'
												classNamePrefix={'select'}
												className="react-select custom-select-contact custom-react-select"
												options={redux.contactList}
												value={value}
												onChange={ handleSelectValidation }/>
											{contact && <div className='custom-form-feedback'>담당자를 선택해주세요.</div>}
										</Fragment>
								)}/>
							</Col>
							<Col xs={12} md={6}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>관리자</div>
									</Col></Row>
								</Label>
								<Controller
									name='manager'
									control={control}
									render={({ field: {value} }) => (
										<Fragment>
											<Select
												name='manager'
												classNamePrefix={'select'}
												className="react-select"
												options={redux.managerList}
												value={redux.managerList.length === 0 ? noneValue : value}
												onChange={ handleSelectValidation }/>
										</Fragment>
								)}/>
							</Col>
						</Row>
						{
							type === 'iot' &&
							<>
								<br/>
								<Row>
									<Col xs={12} md={4}>
										<Label className="form-check-label custom_label">
											<Row><Col style={{display:'flex', alignItems:'center'}}>
												<div>타입</div>
												&nbsp;
												<div className='essential_value'/>
											</Col></Row>
										</Label>
										<Controller
											name='iotType'
											control={control}
											render={({ field: {value} }) => (
												<Fragment>
													<Select
														name='iotType'
														classNamePrefix={'select'}
														className="react-select custom-select-iotType custom-react-select"
														options={iotTypeSelect}
														value={value}
														onChange={ handleSelectValidation }/>
													{iotType && <div className='custom-form-feedback'>타입을 선택해주세요.</div>}
												</Fragment>
											)}/>
									</Col>
									<Col xs={12} md={4}>
										<Label className="form-check-label custom_label">
											<Row><Col style={{display:'flex', alignItems:'center'}}>
												<div>정상범위 최소값</div>
												&nbsp;
												<div className='essential_value'/>
											</Col></Row>
										</Label>
										<Controller
											name='nomalMin'
											control={control}
											render={({ field: {onChange, value} }) => (
												<Fragment>
													{/* <Input style={{textAlign:'right'}} invalid={errors.nomalMin && true} {...field}/> */}
													<Input
														style={{textAlign:'right'}}
														type="text"
														value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
														invalid={errors.nomalMin && true}
														onChange={e => {
															AddCommaOnChange(e, onChange)
															trigger('nomalMin')
													}}/>
													{errors.nomalMin && <FormFeedback>{errors.nomalMin.message}</FormFeedback>}
												</Fragment>
											)}/>
									</Col>
									<Col xs={12} md={4}>
										<Label className="form-check-label custom_label">
											<Row><Col style={{display:'flex', alignItems:'center'}}>
												<div>정상범위 최대값</div>
												&nbsp;
												<div className='essential_value'/>
											</Col></Row>
										</Label>
										<Controller
											name='nomalMax'
											control={control}
											render={({ field: {onChange, value} }) => (
												<Fragment>
													<Input
														style={{textAlign:'right'}}
														type="text"
														value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
														invalid={errors.nomalMax && true}
														onChange={e => {
															AddCommaOnChange(e, onChange)
															trigger('nomalMax')
													}}/>
													{errors.nomalMax && <FormFeedback>{errors.nomalMax.message}</FormFeedback>}
												</Fragment>
											)}/>
									</Col>
								</Row>
							</>
						}
					</ModalBody>

					<ModalFooter>
						<Button color='primary' onClick={handleSubmit(registerModify)}>{redux.modalPageType === 'register' ? '등록' : '수정'}</Button>
						<Button color='report' onClick={() => closeModal()}>{'취소'}</Button>
					</ModalFooter>
				</Modal>
			</Form>
		</Fragment>
	)
}

export default AddCameraModal