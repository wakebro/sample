import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import {API_INTRANET_NOTIFICATION, ROUTE_INTRANET_NOTIFICATION, URL} from "../../../../constants"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import * as moment from 'moment'
import { useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router"
import { handleDownload, primaryColor } from "../../../../utility/Utils"

const NotificationDetailModal = (props) => {
	useAxiosIntercepter()
	const [searchParams] = useSearchParams()
	const {formModal, setFormModal, rowId, cookies} = props
	const [data, setData] = useState([])
	const navigate = useNavigate()

	const customToggle = () => {
		setFormModal(!formModal)
		if (searchParams.get('id')) {
            searchParams.delete('id')
            navigate(ROUTE_INTRANET_NOTIFICATION)
        }
	}
    useEffect(() => {
        if (formModal === true) {
            axios.get(`${API_INTRANET_NOTIFICATION}/${rowId}`, {params:{userId: cookies.get('userId')}})
            .then(res => {
                setData(res.data)
            })
        }
    }, [formModal])

	return (
		<>
			{
				data.length !== 0 &&
				<Modal isOpen={formModal} toggle={customToggle}>
					<ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
						<Col className='mt-1 mx-2'>
							<Row className='mb-1' style={{display: 'flex', alignItems: 'center'}}>
								<Col md={6}>
									<span style={{color: 'white', fontSize: '20px'}}>
										알림창
									</span>
								</Col>
								<Col md={6} style={{display:'flex', justifyContent:'end'}}>
									<span style={{color: 'white', fontSize: '14px'}}>
										{moment(data.create_datetime).format('YYYY-MM-DD HH:mm:ss')}
									</span>
								</Col>
							</Row>
						</Col>
					</ModalHeader>
					<ModalBody>
						<Row className="ps-1" style={{display: 'flex', alignItems: 'center', wordBreak:'break-all'}}>
							<Col style={{fontSize: '20px'}}>
								<div>{data.subject}</div>
							</Col>
						</Row>
						<Row className='mt-1' style={{display: 'flex', alignItems: 'center'}}>
							<Col md='9' xs='12' className="ps-0">
								<Row className='card_table top' style={{borderBottom:0, borderTop:0, borderRight:0}}>
									<Col md='6' xs='12'>
										<Row className='card_table table_row'>
											<Col lg='6' md='6' xs='3' className='card_table col text center' style={{borderRight:'1px solid #B9B9C3'}}>
												<div>발신자</div>
											</Col>
											<Col lg='6' md='6' xs='9' className='card_table col text center'>
												<Row style={{width:'100%'}}>
													<Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
														<Row style={{width:'100%'}}>
															{data.sender.length > 10 ? `${data.sender.substring(0, 10)}...` : data.sender}
														</Row>
													</Col>
												</Row>
											</Col>
										</Row>
									</Col>
									<Col md='6' xs='12'>
										<Row className='card_table table_row'>
											<Col lg='6' md='6' xs='3' className='card_table col text center' style={{ borderRight:'1px solid #B9B9C3'}}>
												<div>수신자</div>
											</Col>
											<Col lg='6' md='6' xs='9' className='card_table col text center'>
												<Row style={{width:'100%'}}>
													<Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
														<Row style={{width:'100%'}}>
															{data.receiver.length > 10 ? `${data.receiver.substring(0, 10)}...` : data.receiver}
														</Row>
													</Col>
												</Row>
											</Col>
										</Row>
									</Col>
								</Row>
							</Col>
						</Row>
						<Row className="px-1 mt-1">
							<Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
								<Row style={{width:'100%', minHeight: '10rem', border:'1px solid #C1C1CB', whiteSpace:'break-spaces', borderRadius:'0.4rem'}}>
									<div style={{padding: '1rem', wordBreak:'break-all'}}>
										{data.contents !== 'undefined' ? data.contents : null}
									</div>
								</Row>
							</Col>
						</Row>
						{data.file_name !== '' && (
						<Row className='card_table mt-1'>
								<div>
									<div className='form-control hidden-scrollbar' style={{ display: 'flex', alignItems: 'center' }}>
										<Button color='primary' onClick={() => handleDownload(`${data.path}${data.file_name}`, data.original_file_name)} style={{ transform: 'rotate(0deg)', whiteSpace: 'nowrap', marginRight:'1%' }}>다운로드</Button>
											<div style={{ position: 'relative', paddingRight: '10px' }}>
												<span>{data.original_file_name}</span>
											</div>
									</div>    
								</div> 
						</Row>
						)}
					</ModalBody>
					<ModalFooter>
						<Col className='d-flex justify-content-end m-0'>
							<Button onClick={customToggle}>
								닫기
							</Button>
						</Col>
					</ModalFooter>
				</Modal>
			}
		</>

	)

}
export default NotificationDetailModal