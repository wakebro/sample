/* eslint-disable */
import axios from 'axios'
import winLogoImg from '@src/assets/images/winlogo.png'
import { setModalIsOpen, setModalName, setRowData } from '@store/module/criticalDisaster'

import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Button, ModalHeader, Col, Modal, ModalBody, ModalFooter, Row } from "reactstrap"
import ModalSign from './ModalSign'

import { API_INTRANET_NOTIFICATION_FORM, API_DISASTER_EVALUTION_SIGN, API_DISASTER_EVALUATION_SIGN_CHECK } from '../../../../../../constants'
import { checkApp, getTableData, getTableDataCallback, primaryColor, sweetAlert } from '../../../../../../utility/Utils'
import Cookies from 'universal-cookie'

const ApprovalModal = (props) => {
	const {redux} = props
	const criticalDisasterRedux = useSelector((state) => state.criticalDisaster)
	const dispatch = useDispatch()
	const [signList, setSignList] = useState([])
	const [signDoneCount, setSignDoneCount] = useState(0)
	const cookies = new Cookies
	
	const typeObj = {
		'사전회의 결재': 'meeting',
		'안전교육 결재' : 'education',
		'작업자 서명': 'evaluation'
	}
	// const signList = singListTest[criticalDisasterRedux.modalName] //type
	const [totalCount, setTotalCount] = useState(2)
	const modalSize = criticalDisasterRedux.modalName !== '작업자 서명' ? 'modal-md' : 'modal-lg'
	
	const sendNotification = (data) => {
		if (data.state === 200) {
			const list = [signList.map(user => user.user)]
			const formData = new FormData()
			formData.append('subject', criticalDisasterRedux.rowData.title)
			formData.append('contents', `${criticalDisasterRedux.modalName} 진행되지 않았습니다. 확인 요청드립니다.`)
			formData.append('sender_id', cookies.get('userId'))
			formData.append('employee_list', list)
			formData.append('doc_file', 'undefined')
			formData.append('where_to_start', `${typeObj[criticalDisasterRedux.modalName]}_${criticalDisasterRedux.rowData.id}`)
			axios.post(API_INTRANET_NOTIFICATION_FORM, formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})
			.then(res => {
				if (res.status === 200) {
					sweetAlert('완료', '알림 발송 완료되었습니다!', 'success', 'right')
				} else {
					sweetAlert('실패', '다시한번 확인 해주세요.', 'warning', 'right')
				}
			})
		} else {
			sweetAlert('실패', `알림은 10분간격으로 전송이 가능합니다.<br/><br/>${10 - Math.floor(data.time)}후에 다시 시도해주세요.`, 'info', 'right')
		}
	}

	const handleNotificaionSend = () => {
		getTableDataCallback(API_DISASTER_EVALUATION_SIGN_CHECK, {form_id:criticalDisasterRedux.rowData.id, type:typeObj[criticalDisasterRedux.modalName]}, sendNotification)
		// sweetAlert('완료', '알림 발송 완료되었습니다!', 'success', 'right')
		// return false // 백엔드 연결하면 밑에 로직이용
	}

	function closeModal () {
		setSignList([])
		setSignDoneCount(0)
		dispatch(setRowData(null))
		dispatch(setModalName(''))
		dispatch(setModalIsOpen(false))
	}

	useEffect(() => {
		if (criticalDisasterRedux.rowData) getTableData(API_DISASTER_EVALUTION_SIGN, {form_id:criticalDisasterRedux.rowData.id, type:typeObj[criticalDisasterRedux.modalName]}, setSignList)
	}, [criticalDisasterRedux.modalIsOpen])

	useEffect(() => {
		// console.log(signList)
		if (signList.length > 0) {
			let count = 0
			signList.forEach((user) => {
				if (user.is_other_final === true) {
					count++
				}
			})
			setSignDoneCount(count)
		}
		if (criticalDisasterRedux.modalName === '작업자 서명') {
			setTotalCount(signList.length)
		}
	}, [signList])

	return (
		<Fragment>
			{
				redux.modalIsOpen &&
				<Modal isOpen={redux.modalIsOpen} toggle={() => closeModal()} className={`modal-dialog-centered ${modalSize}`}>
					<ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
						<div className='mb-1 px-1' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
							<div>
								<Row>
									<span style={{color: 'white', fontSize: '20px', paddingLeft:'23px', paddingTop:'4%'}}>
										{criticalDisasterRedux.modalName} 내역
									</span>
								</Row>
							</div>
							<div>
								<img src={winLogoImg} style={{maxHeight: '85px'}}/> 
							</div>
						</div>
					</ModalHeader>

					<ModalBody className='ms-1 me-1' style={{ backgroundColor:'#fff', borderBottomLeftRadius : '0.357rem', borderBottomRightRadius : '0.357rem', height:'auto'}}>
						<Row>
							<Col >
								<div className='d-inline-block' style={{fontWeight:1000}}>위험성평가명</div>
								&nbsp;
								&nbsp;
								{checkApp ? <br/> : ''}
								<div className='d-inline-block'>{redux.rowData.title}</div>
								{checkApp ? <><br/><br/></> : ''}
							</Col>
						</Row>
						{ criticalDisasterRedux.modalName === '작업자 서명' && 
							<Row>
								<Col>
									<div className='d-inline-block' style={{fontWeight:1000}}>작업자 명단</div>
									&nbsp;
									&nbsp;
									<div className='d-inline-block'>
										{ signList.map((user,index) => {
											if (index != 0) {
												return (
													`, ${user.name}`
												)
											}
											return user.name
											})
										}
									</div>
								</Col>
							</Row>
						}
						<Row className='pt-1'>
							<Col className={''}>
								<ModalSign 
									criticalDisasterRedux={criticalDisasterRedux}
									userSign={signList.length > 0 ? signList : criticalDisasterRedux.modalName !== '작업자 서명' ? ['', ''] : ['']}
								/>
							</Col>
						</Row>
						<Row>
							<Col style={{display:'flex', justifyContent:'center', paddingTop:'2%', fontSize:'16px'}}>
								<div>완료된 서명 {signDoneCount}/{totalCount}</div>
							</Col>
						</Row>
					</ModalBody>

					<ModalFooter>
						<Row style={{width:'100%'}}>
							{/* redux.rowData.isComplete 로 이용예정 */}
							{ signDoneCount !== totalCount ?
								<Col style={{display:'flex', justifyContent:'space-between'}}>
									 {signList.length !== 0 && <Button color='primary' outline onClick={() => handleNotificaionSend()} disabled={signList.length === 0} >미완료자 알림 발송</Button>}
									<Button color='primary justify-content-end' onClick={() => closeModal()}>확인</Button>
								</Col>
								:
								<Col style={{display:'flex', justifyContent:'end'}}>
									<Button color='primary' onClick={() => closeModal()}>확인</Button>
								</Col>
							}
						</Row>
					</ModalFooter>
				</Modal>
			}
		</Fragment>
	)
}

export default ApprovalModal