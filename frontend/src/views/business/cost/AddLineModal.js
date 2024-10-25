/*eslint-disable */
import { yupResolver } from '@hookform/resolvers/yup'
import winLogoImg from '@src/assets/images/winlogo.png'
import axios from 'axios'
import moment from 'moment'
import { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from "react-redux"
import { Button, Card, Col, Form, Modal, ModalBody, ModalFooter, Row, ModalHeader } from "reactstrap"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Cookies from 'universal-cookie'
import * as yup from 'yup'
import { API_FIND_BUILDING } from '../../../constants'
import CreateLine from './CreateLine'
import { BUILDING_TYPE, getSelectShiftRedux } from '../data'
import { axiosPostPutRedux, getCommaDel, primaryColor } from '@utils'

const AddLineModal = (props) => {
	const { modalTitle, redux, isOpen, modalType, defaultValues, resolver, setBuildingList, api } = props
	const dispatch = useDispatch()
	const cookies = new Cookies()
	const [lineList, setLineList] = useState([])
	const [customResolver, setResolver] = useState(resolver)
	const [inputs, setInputs] = useState({
		lineIdx: null,
		date: null,
		title: null,
		company: null,
		buildingType: null,
		building: null,
		price: null
	})

	const {
		control
		, handleSubmit
		, formState: { errors }
		, setValue
		, unregister
		, watch
		, trigger
	} = useForm({
		defaultValues: defaultValues,
		resolver: yupResolver(customResolver)
	})

	/** useForm 초기화 */
	function initForm() {
		const currentResolver = yup.object().shape({...resolver.fields})
		lineList.map(line => {
			unregister(`date_${line}`)
			unregister(`title_${line}`)
			unregister(`company_${line}`)
			unregister(`buildingType_${line}`)
			unregister(`building_${line}`)
			unregister(`price_${line}`)
			delete currentResolver.fields[`date_${line}`]
			delete currentResolver.fields[`title_${line}`]
			delete currentResolver.fields[`company_${line}`]
			delete currentResolver.fields[`price_${line}`]
			
		})
		setInputs({
			lineIdx: null,
			date: null,
			title: null,
			company: null,
			buildingType: null,
			building: null,
			price: null
		})
		setLineList([])
		setResolver(currentResolver)
		dispatch(modalType(''))
	}
	
	const closeModal = () => {
		initForm()
		dispatch(isOpen(false))
	}

	const registerModifyLines = (e) => {
		const formData = new FormData()
		lineList.map(line => {
			const temp = {}
			temp['date'] = e[`date_${line}`]
			temp['title'] = e[`title_${line}`]
			temp['company'] = e[`company_${line}`]
			temp['building_type'] = e[`buildingType_${line}`].value
			temp['building'] = e[`building_${line}`].value
			temp['price'] = getCommaDel(e[`price_${line}`])
			temp['cost_type'] = redux.costType
			
			formData.append('lines[]', JSON.stringify(temp))
		})
		
		const API = redux.modalPageType === 'register' ? `${api}/-1`: `${api}/${redux.id}`
		axiosPostPutRedux(redux.modalPageType, modalTitle, API, formData, dispatch, isOpen, false)
		initForm()
	}

	const handleDisabled = () => {
		const lastIdx = lineList[lineList.length - 1]
		if (watch(`title_${lastIdx}`) !== '' &&
			watch(`company_${lastIdx}`) !== '' &&
			watch(`price_${lastIdx}`) !== '' &&
			watch(`building_${lastIdx}`)
		) return false
		else return true
	}

	/**등록 */
	useEffect(() => {
		if (redux.modalIsOpen === true && redux.modalPageType !== '') {
			console.log(control._formValues)
			getSelectShiftRedux(API_FIND_BUILDING, {prop_id:cookies.get('property').value}, dispatch, setBuildingList)
		}
	}, [redux.modalIsOpen])

	/**수정 */
	useEffect(() => {
		if (redux.id !== null) {
			dispatch(isOpen(true))
			dispatch(modalType('modify'))
		}
	}, [redux.id])

	useEffect(() => {
		if (redux.modalIsOpen && redux.buildingList.length !== 0) {
			if (redux.modalPageType === 'register') {
				setInputs({
					'lineIdx' : 0,
					'date' : moment().format('YYYY-MM-DD'),
					'title' : '',
					'company' : '',
					'buildingType' : {label:'기존건물', value:false},
					'building' : redux.buildingList[0],
					'price' : '',
				})
			} else if (redux.modalPageType === 'modify') {
				axios.get(`${api}/${redux.id}`)
				.then(res => {
					setInputs({
						'lineIdx' : res.data.id,
						'date' : moment(res.data.date).format('YYYY-MM-DD'),
						'title' : res.data.title,
						'company' : res.data.company,
						'buildingType' : {label:BUILDING_TYPE[res.data.building_type], value:res.data.building_type},
						'building' : {label:res.data.building.name, value:res.data.building.id},
						'price' : res.data.price
					})
				})
			}
		} else if (redux.modalIsOpen && redux.buildingList.length == 0) {
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
			}).then((res) => {
				if (res.isConfirmed) closeModal()
			})

		}
	}, [redux.buildingList])

	useEffect(() => {
		if (inputs.lineIdx !== null) {
			setLineList([...lineList, inputs.lineIdx])
			setValue(`date_${inputs.lineIdx}`, inputs.date)
			setValue(`title_${inputs.lineIdx}`, inputs.title)
			setValue(`company_${inputs.lineIdx}`, inputs.company)
			setValue(`buildingType_${inputs.lineIdx}`, inputs.buildingType)
			setValue(`building_${inputs.lineIdx}`, inputs.building)
			setValue(`price_${inputs.lineIdx}`, inputs.price)
			const currentResolver = yup.object().shape({
				...customResolver.fields,
				[`date_${inputs.lineIdx}`]: yup.string().required('날짜를 입력해주세요.'), 
				[`title_${inputs.lineIdx}`]: yup.string().required('공사명를 입력해주세요.'),
				[`company_${inputs.lineIdx}`]: yup.string().required('업체명를 입력해주세요.'),
				[`price_${inputs.lineIdx}`]: yup.string().required('금액을 입력해주세요.').matches(/^[\d,\.]+$/g, '올바른 금액형태로 입력해주세요.')
			})
			setResolver(currentResolver)
		}
	}, [inputs])

	return (
		<Fragment>
			{
				lineList.length !== 0 && <Form onSubmit={handleSubmit(registerModifyLines)}>
					<Modal isOpen={redux.modalIsOpen} toggle={() => closeModal()} className='modal-dialog-centered modal-lg'>
						<ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
							<div className='mb-1' style={{display: 'flex', alignItems: 'center', paddingLeft: '3%', justifyContent:'space-between'}}>
								<div className='mt-1'>
									<Row>
										<span style={{color: 'white', fontSize: '20px'}}>
											{modalTitle}
										</span>
									</Row>
									<Row  style={{fontSize: '16px', color:'white'}}>
										<span style={{color: 'white'}}>빈칸에 맞춰 양식을 작성해 주세요.</span>
									</Row>
								</div>
								<div className='me-1'>
									<img src={winLogoImg} style={{maxHeight: '85px'}}/> 
								</div>
							</div>
						</ModalHeader>
						{lineList.map(line => (
							<CreateLine key={line}
								id={line}
								redux={redux}
								control={control}
								setValue={setValue}
								unregister={unregister}
								errors={errors}
								lineList={lineList}
								setLineList={setLineList}
								resolver={customResolver}
								setResolver={setResolver}
								trigger={trigger}
							/>
						))}

						<ModalFooter>
							<Button color="report" onClick={() => closeModal()}>취소</Button>
							{redux.modalPageType === 'register' && <Button disabled={handleDisabled()} color='primary' onClick={handleSubmit(registerModifyLines)}>등록</Button>}
							{redux.modalPageType === 'modify' && <Button color='primary' onClick={handleSubmit(registerModifyLines)}
							>수정</Button>}
						</ModalFooter>
					</Modal>
				</Form>
			}
		</Fragment>
	)
}

export default AddLineModal