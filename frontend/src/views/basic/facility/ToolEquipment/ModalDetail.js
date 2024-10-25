
import '@styles/react/libs/flatpickr/flatpickr.scss'
import "@styles/react/pages/page-authentication.scss"
import {
	Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody,
	ModalFooter, ModalHeader,
	Row
} from "reactstrap"
import { API_BASICINFO_FACILITY_TOOLEQUIPMENT_RECORD_MODAL, URL  } from '../../../../constants'
import { useEffect, useState } from 'react'
import axios from "../../../../utility/AxiosConfig"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'

const ModalDetail = (props) => {
	useAxiosIntercepter()
	const {formModal, setFormModal, record_id} = props
	const [data, setData] = useState([])
	const path = data && data.path
	const filepath = path ? path.replace("static/", "") : null
	const datetime = data && data.rental_datetime
	const date = datetime ? datetime.split('T')[0] : null

	const handleDownload = () => {
		axios({
			url: `${URL}/static_backend/${(filepath)}`,
			method: 'GET',
			responseType: 'blob'
		}).then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', `${data && data.file_name}`)
			document.body.appendChild(link)
			link.click()
		})
		}

	const customToggle = () => {
		setFormModal(!formModal)
		// reset()
		// resetValue()
	}
	const getData = () => {
		if (record_id) {
			axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_RECORD_MODAL, { params: { id: record_id } })
			.then(res => {
				setData(res.data)
			})
		}
	}

	useEffect(() => {
		getData()
	}, [record_id])
	
	
	return (
		<Modal isOpen={formModal} className='modal-dialog-centered modal-lg'>
			<ModalHeader><span style={{fontSize: '20px'}}>공구비품이력</span></ModalHeader>
			<ModalBody>
				<Row className="card_table top">
					<Col  xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col  text center ' style={{backgroundColor: '#D8D6DE'}}>사진제목</Col>
							<Col xs='8' className='card_table col text start '>
								<Row style={{width:'100%'}}><div>{data && data.title}</div></Row>
							</Col>
						</Row>
					</Col>
					<Col>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col  text center ' style={{backgroundColor: '#D8D6DE'}}>등록일자</Col>
							<Col xs='8' className='card_table col text start '>{date}</Col>
						</Row>
					</Col>
				</Row>

				<Row className="card_table mid">
					<Col>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col text center ' style={{backgroundColor: '#D8D6DE'}}>등록자</Col>
							<Col xs='8' className='card_table col text start '>
							<Row style={{width:'100%'}}>
								<div>
								{data.sender && data.sender.username}
								</div>
							</Row>
							</Col>
						</Row>
					</Col>
					<Col>
						<Row className='card_table table_row' >
							<Col xs='4'  className='card_table col text center' style={{whiteSpace: 'nowrap', backgroundColor: '#D8D6DE'}}>첨부파일</Col>
							<Col xs='8' className='card_table col text start'>
								<Row style={{wordBreak:'break-all'}}>
									<a onClick={() => handleDownload()}>
										<span className='text-muted fw-bolder align-text-top'>{data && data.file_name}</span>
									</a>
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="card_table mid">
					<Col>
						<Row className='card_table table_row'>
							<Col xs='2'  className='card_table col text center' style={{whiteSpace: 'nowrap', backgroundColor: '#D8D6DE' }}>비고</Col>
							<Col xs='10' className='card_table col text start '>
								<Row style={{width:'100%'}}>
									<div style={{whiteSpace:'break-spaces'}}>{data && data.description}</div>
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
			</ModalBody>
			<ModalFooter>
				<Col className='d-flex justify-content-end'>
					<Button color="report" onClick={customToggle}>취소</Button>
					<Button className='ms-1' color='primary' onClick={customToggle}>확인</Button>
				</Col>
			</ModalFooter>
		</Modal>
	)
}

export default ModalDetail
