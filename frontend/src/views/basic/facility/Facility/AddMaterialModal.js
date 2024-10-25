import winLogoImg from '@src/assets/images/winlogo.png'
import "@styles/react/pages/page-authentication.scss"

import axios from "@utility/AxiosConfig"
import { axiosPostPutRedux } from '@utils'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
import {
	Button, Card, Col,
	Input, Label, Modal, ModalBody,
	ModalFooter,
	Row
} from "reactstrap"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Cookies from "universal-cookie"
import { API_BASICINFO_FACILITY, API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT_SELECT_OPTIONS } from '../../../../constants'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { modalStyles, nameReduxObj } from '../data'
import { primaryColor } from '../../../../utility/Utils'

const AddMaterialModal = (props) => {
	useAxiosIntercepter()
	const {name, redux, list} = props
	const dispatch = useDispatch()
	const cookies = new Cookies()
	const [facilityMaterial, setFacilityMaterial] = useState({
		materialList: [],
		material: {label: '자재가 없습니다.', value: ''},
		description: ''
	})
	const { materialList, material, description } = facilityMaterial

	function handleInputObj (e, event) {
		setFacilityMaterial({
			...facilityMaterial,
			[event.name]: e
		})
	}

	function initlogInfo () {
		setFacilityMaterial({
			...facilityMaterial,
			materialList: [],
			material: {label: '자재가 없습니다.', value: ''},
			description: ''
		})
	}

	function closeModal () {
		dispatch(nameReduxObj[name].setModalType(''))
		dispatch(nameReduxObj[name].setRowInfo(null))
		dispatch(nameReduxObj[name].setFacilityMaterialModalIsOpen(false))
		initlogInfo()
	}

	function handleAddModify () {
		const method = redux.modalType === 'register' ? redux.modalType : 'modify'
		const formData = new FormData()
		if (redux.modalType === 'register') {
			formData.append('facility', redux.id)
			formData.append('material', material.value)
			formData.append('description', description !== '' ? description : null)
		} else if (redux.modalType === 'detail') {
			formData.append('facility', redux.id)
			formData.append('material', material.value)
			formData.append('description', description !== '' ? description : null)
		}

		const API = redux.modalType === 'register' ? `${API_BASICINFO_FACILITY}/facility_material/-1`
											: `${API_BASICINFO_FACILITY}/facility_material/${redux.rowInfo.id}`
		axiosPostPutRedux(method, '설비정보이력', API, formData, dispatch, nameReduxObj[name].setFacilityMaterialModalIsOpen, false)
	}

	function getData(modalType) {
		const tempList = list.map(row => { return row.material.id })
		axios.get(API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT_SELECT_OPTIONS, {
			params: {
				property_id: cookies.get('property').value
			}
		}).then(res => {
			if (res.data.length > 1) {
				res.data.shift()
				const selectList = res.data.filter(row => {
					if (!tempList.includes(row.value)) return row
				})
				if (modalType === 'register') {
					setFacilityMaterial({
						...facilityMaterial,
						materialList: selectList,
						material: selectList[0]
					})
				} else if (modalType === 'detail') {
					setFacilityMaterial({
						...facilityMaterial,
						materialList: selectList,
						material: {label: redux.rowInfo.material.code, value: redux.rowInfo.material.id},
						description: redux.rowInfo.description ? redux.rowInfo.description : description
					})
				}
			} else {
				closeModal()
				const MySwal = withReactContent(Swal)
				MySwal.fire({
					icon: "warning",
					html: "등록된 자재 정보가 없습니다.",
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
		})
	}

	useEffect(() => {
		if (redux.facilityMaterialModalIsOpen) {
			getData(redux.modalType)
		} else if (!redux.facilityMaterialModalIsOpen) closeModal()
	}, [redux.facilityMaterialModalIsOpen])
	
	return (
		<Fragment>
			{
				redux.facilityMaterialModalIsOpen &&
				<Modal isOpen={redux.facilityMaterialModalIsOpen} toggle={() => closeModal()} className='modal-dialog-centered'>
					<ModalBody style={{backgroundColor:primaryColor, borderTopLeftRadius : '0.357rem', borderTopRightRadius : '0.357rem'}}>
						<Row className='ms-1' style={{width:'100%', margin:'inherit'}}>
							<Col xs='10' className='custom-modal-header' style={{display: 'flex', flexDirection : 'column', justifyContent : 'center'}}>
								<Row style={{fontSize: '20px', color:'white'}}>관련자재</Row>
								{
									redux.modalType === 'register' &&
										<Row  style={{fontSize: '16px', color:'white'}}>
											빈칸에 맞춰 양식을 작성해 주세요.
										</Row>
								}
							</Col>

							<Col xs='2' className='custom-modal-header'>
								<Card style={{marginBottom:0, boxShadow:'none', backgroundColor:'transparent'}}>
									<img src={winLogoImg} style={{display:'flex', position:'relative', flexDirection:'column', maxHeight: "85px"}}/>
								</Card>
							</Col>
						</Row>
					</ModalBody>

					<ModalBody className='ms-1 me-1' style={{ backgroundColor:'#fff', borderBottomLeftRadius : '0.357rem', borderBottomRightRadius : '0.357rem', height:'auto'}}>
						<Row>
							<Col xs={12} >
								<Label className="form-check-label custom_label">자재코드</Label>
								<Select
									name='material'
									classNamePrefix={'select'}
									className="react-select"
									value={material}
									options={materialList}
									onChange={handleInputObj}/>
							</Col>
						</Row>
						<br/>
						<Row>
							<Col xs={12}>
								<Label className="form-check-label custom_label">비고</Label>
								<Input style={modalStyles} name='description' rows='3' type='textarea' value={description || ""}
									onChange={(e) => handleInputObj(e.target.value, e.target)}/>
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button color='secondary' outline style={{marginTop: '1%', marginRight: '1%'}} onClick={() => closeModal()}>닫기</Button>
						{(redux.pageType === 'modify' && redux.modalType === 'detail') && <Button color='primary' style={{marginTop: '1%', marginRight: '1%'}} onClick={() => handleAddModify()}>수정</Button>}
						{(redux.pageType === 'modify' && redux.modalType === 'register') && <Button color='primary' style={{marginTop: '1%', marginRight: '1%'}} onClick={() => handleAddModify()}>추가</Button>}
					</ModalFooter>
				</Modal>
			}
		</Fragment>
	)
}

export default AddMaterialModal
