import winLogoImg from '@src/assets/images/winlogo.png'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import "@styles/react/pages/page-authentication.scss"
import axios from "@utility/AxiosConfig"
import { axiosPostPutRedux, sweetAlert } from '@utils'
import * as moment from 'moment'
import { Fragment, useEffect, useState } from 'react'
import Flatpickr from "react-flatpickr"
import { useDispatch } from 'react-redux'
import {
    Button, Card, Col,
    Input, Label, Modal, ModalBody,
    ModalFooter,
    Row
} from "reactstrap"
import Cookies from "universal-cookie"
import { API_BASICINFO_FACILITY_LOG, URL } from '../../../../constants'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { modalStyles, nameReduxObj } from '../data'
import { primaryColor } from '../../../../utility/Utils'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const AddLogModal = (props) => {
	useAxiosIntercepter()
	const {name, redux} = props
	const dispatch = useDispatch()
	const cookies = new Cookies()
	const [logInfo, setLoginfo] = useState({
		datetime:  moment().format('YYYY-MM-DD'),
		writer: '',
		file: null,
		fileName: '',
		description: ''
	})
	const { datetime, writer, file, fileName, description } = logInfo
	
	function handleInputObj (e, event) {
		if (event.name === 'file') {
			setLoginfo({
				...logInfo,
				[event.name]: e,
				fileName: e.name
			})
		} else {
			setLoginfo({
				...logInfo,
				[event.name]: e
			})
		}
	}

	function initlogInfo () {
		setLoginfo({
			...logInfo,
			datetime: moment().format('YYYY-MM-DD'),
			writer: '',
			file: null,
			fileName: '',
			description: ''
		})
	}

	function handleDownload () {
		const filePath = redux.rowInfo.path.replace('static/', '')
		axios({
			url: `${URL}/static_backend/${filePath}`,
			method: 'GET',
			responseType: 'blob'
		}).then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', redux.rowInfo.file_name)
			document.body.appendChild(link)
			link.click()
		})
	}

	function closeModal () {
		dispatch(nameReduxObj[name].setModalType(''))
		dispatch(nameReduxObj[name].setRowInfo(null))
		dispatch(nameReduxObj[name].setLogModalIsOpen(false))
		initlogInfo()
	}

	function handleAddModify () {
		const method = redux.modalType === 'register' ? redux.modalType : 'modify'
		if (description === '') {
			sweetAlert('', '수리내용을 입력해주세요.', 'warning')
			return false
		}
		const formData = new FormData()
		if (redux.modalType === 'register') {
			formData.append('facility', redux.id)
			formData.append('regist_datetime', `${datetime}T00:00:00`)
			formData.append('description', description)
			formData.append('file', file)
			formData.append('writer', cookies.get('userId'))
		} else if (redux.modalType === 'detail') {
			formData.append('description', description)
			formData.append('regist_datetime', `${datetime} 00:00:00`)
		}

		const API = redux.modalType === 'register' ? `${API_BASICINFO_FACILITY_LOG}/-1`
											: `${API_BASICINFO_FACILITY_LOG}/${redux.rowInfo.id}`
		axiosPostPutRedux(method, '설비정보이력', API, formData, dispatch, nameReduxObj[name].setLogModalIsOpen, false)
	}

	useEffect(() => {
		if (redux.logModalIsOpen && (redux.modalType === 'detail')) {
			setLoginfo({
				...logInfo,
				datetime: redux.rowInfo.regist_datetime.split('T')[0],
				writer: redux.rowInfo.writer.name,
				fileName: redux.rowInfo.file_name ? redux.rowInfo.file_name : '',
				description: redux.rowInfo.description
			})
		} else if (!redux.logModalIsOpen) closeModal()
	}, [redux.logModalIsOpen])
	
	return (
		<Fragment>
			{
				redux.logModalIsOpen &&
				<Modal isOpen={redux.logModalIsOpen} toggle={() => closeModal()} className='modal-dialog-centered'>
					<ModalBody style={{backgroundColor: primaryColor, borderTopLeftRadius : '0.357rem', borderTopRightRadius : '0.357rem'}}>
						<Row className='ms-1' style={{width:'100%', margin:'inherit'}}>
							<Col xs='10' className='custom-modal-header' style={{display: 'flex', flexDirection : 'column', justifyContent : 'center'}}>
								<Row style={{fontSize: '20px', color:'white'}}>작업이력</Row>
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
							<Col xs={12} md={redux.modalType !== 'register' ? 6 : 12}>
								<Label className="form-check-label custom_label">등록일자</Label>
								{
									redux.pageType === 'detail' ?
									<Input style={modalStyles} disabled value={datetime}/>
									:
									<Flatpickr
										id='range-picker'
										name='datetime'
										className='form-control'
										value={datetime}
										onChange={date => {
											const tempDatetime = moment(date[0]).format('YYYY-MM-DD')
											const event = {name:'datetime'}
											handleInputObj(tempDatetime, event)
										}}
										options={{
											mode: 'single',
											ariaDateFormat:'Y-m-d',
											locale: Korean
										}}/>
								}
							</Col>
							{
								redux.modalType !== 'register' &&
								<Col xs={12} md={6}>
									<Label className="form-check-label custom_label">작성자</Label>
									<Input style={modalStyles} disabled readOnly value={writer}/>
								</Col>
							}
						</Row>
						<br/>
						<Row>
							<Col xs={12}>
								<Label className="form-check-label custom_label">첨부파일</Label>
								{
									redux.modalType === 'detail' ?
										<Input style={{width:'100%', backgroundColor:'white', cursor:`${ fileName !== '' && 'pointer'}`}} readOnly
											disabled={fileName === '' && true} value={fileName} onClick={() => handleDownload()}/>
									:
										<Input type='file' name='file' onChange={(e) => handleInputObj(e.target.files[0], e.target)}/>
								}
							</Col>
						</Row>
						<br/>
						<Row>
							<Col xs={12}>
								<Label className="form-check-label custom_label">수리내용</Label>
								<Input style={modalStyles} name='description' rows='5' type='textarea' disabled={redux.pageType === 'detail'} value={description}
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

export default AddLogModal
