import { Fragment, useEffect, useState } from 'react'
import {ChevronLeft,  Star,  Folder, Trash2, Edit2, Info, Mail, Tag, Delete } from 'react-feather'
import axios from '../../../../utility/AxiosConfig'
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { API_DOC_DETAIL, ROUTE_INTRANET_DOCUMENT, API_DOC_MAILBOX, URL } from "../../../../constants"
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {Card, CardBody, Col, Row, Button} from "reactstrap"
import  Sidebar from "./DetailSidebar"
import Breadcrumbs from '@components/breadcrumbs'
import '@styles/react/apps/app-email.scss'
import classnames from 'classnames'
import Cookies from "universal-cookie"
import Avatar from "@components/avatar"
import { axiosDeleteParm, handleDownload } from "../../../../utility/Utils"

const MailDetails = () => {
	useAxiosIntercepter()
	const location = useLocation()
	const selectedtab = location.state.state
	const methodType = location.state.method
	const [selectedTab, setSelectedTab] = useState(selectedtab)
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [data, setData] = useState([])
	const [files, setFiles] = useState([])
	const cookies = new Cookies()
	const userid = cookies.get('userId')
	const navigate = useNavigate()
	const mail_id = useParams()
	const id = mail_id.id
	const doc_title = data[0]?.doc_title || null
	const doc_content = data[0]?.doc_content || null
	const star = data[0]?.star || null
	const date = data[0]?.date || ''
	const sender = data[0]?.sender || ''
	const receiver = data[0]?.receiver || ''
	const Sender = sender ? sender : null
	const Receiver = receiver ? receiver : null 
	const dateObj = new Date(date)
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
	const formattedDate = dateObj.toLocaleDateString('ko-KR', options)
	const formattedTime = dateObj.toLocaleTimeString('ko-KR')
	const timeWithoutSeconds = formattedTime.slice(0, formattedTime.lastIndexOf(':'))

	const GetDetailData = () => {
		axios.get(API_DOC_DETAIL,  { params: { mail_id : id, selectedTab: selectedTab, userid: userid, method:methodType } })
		.then((response) => {
			setData(response.data)
			setFiles(response.data[0].doc_files_name)
		}).catch(error => {
		// 응답 실패 시 처리
		console.error(error)// 에러 메시지
		})
	}

	const Starclicked_detail = () => {
		const id = data[0].id
		const formData = new FormData()
		formData.append('userid', userid)
		formData.append('id', id)
		axios.put(API_DOC_MAILBOX, formData)
		.then(() => {
			GetDetailData()
		}).catch(error => {
			// 응답 실패 시 처리
			console.error(error)// 에러 메시지
		}) 
	}

	const handleDeleteMail = () => {
		const id  = data[0].id
		axiosDeleteParm(
			'문서', 
			API_DOC_MAILBOX, 
			{ data: { mail_ids: id, userid: userid, selectedTab: selectedTab } }, 
			ROUTE_INTRANET_DOCUMENT, 
			navigate
		)
	}

	const handleGoBack = () => navigate(ROUTE_INTRANET_DOCUMENT, {state:selectedTab})

	useEffect(() => setSelectedTab(selectedtab), [selectedtab])

	useEffect(() => {
		axios.get(API_DOC_DETAIL,  { params: { mail_id : id, selectedTab: location.state.state, userid: userid, method:location.state.mothod } })
		.then((response) => {
			setData(response.data)
			setFiles(response.data[0].doc_files_name)
		}).catch(error => {
		// 응답 실패 시 처리
		console.error(error)// 에러 메시지
		})
	}, [location])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='문서함' breadCrumbParent='인트라넷' breadCrumbActive='문서함'/>
				</div>
			</Row>

			<Card style={{ height: '100%' }}>
				<div className='d-flex justify-space-between'>
					<Sidebar
						sidebarOpen={sidebarOpen}
						selectedTab={selectedtab}/>

					<div className='content-right'>
						<div className='content-body'>
							<div className={classnames('body-content-overlay', {show: sidebarOpen})}onClick={() => setSidebarOpen(false)}/>
							<div style={{ borderLeft: '1px solid #ccc' }}>
								<CardBody>	
									<Row md={12}>
										<div className='email-header-left d-flex align-items-center' style={{marginBottom: '15px'}}>
											<span className='go-back me-1' onClick = {handleGoBack} style={{cursor: 'pointer'}}>
												<ChevronLeft size={20} />
											</span>
											<h1 className='email-subject mb-0'>{doc_title}</h1>
											{(selectedTab === 'inbox' || selectedTab === 'star') && (
												<Star className='ms-1' size={18} color={star === true ? 'yellow' : 'gray'}   onClick={Starclicked_detail} style={{ cursor: 'pointer', width:'fit-content'}}/>
											)}
										</div>
									</Row>

									<Row style={{justifyContent:'end'}}>
										<Trash2 className='me-50' onClick={handleDeleteMail } style={{cursor: 'pointer', width:'fit-content', marginLeft:'35px'}} size={18}/>
									</Row>

									<Row className='mt-1'>
										<Col xs='12' md='6'>
											<div className='ms-1' style={{display: 'flex', alignItems:'center'}}>
												<Avatar className="ms-1 mt-auto" style={{marginLeft: '28px'}} color="primary" content = {Sender && Sender.substring(0, 1).toUpperCase()}/>
												<div  style={{ display: 'flex', flexDirection: 'column' }}>
													{Sender && <div className='ms-1' style={{ fontWeight: 'bold' }}>{Sender}</div>}
													{Receiver && <div className='ms-1' style={{ fontWeight: 'bold' }}>{Receiver}</div>}
												</div>
											</div>
										</Col>
										<Col className='d-flex flex-column mt-1' xs='10' md='6'>
											<div style={{textAlign:'end'}}>{formattedDate} {timeWithoutSeconds}</div>
										</Col>
									</Row>
									
									<Row md={7}>
										<div style={{ borderBottom: '3px dotted #ccc', borderTop:'1px dotted #ccc', marginTop: '15px', height:'300px' }}>
											{/* <Row className='mt-1'><Col xs='12'><h1>{doc_title}</h1></Col></Row> */}
											<Row md={10}><Col md={12} className="mt-2" style={{whiteSpace:'break-spaces'}}>{doc_content}</Col></Row>
										</div>
									</Row>

									<Row md={3}>
										<Col md={12}>
											<div style={{ marginTop: '15px', marginBottom:'15px'}}>
												<span>첨부파일</span>
												{data && files.length !== 0 && (<span> {files.length}개</span>)}
												{data && files &&
													files.map((file, index) => {
														let imagePath
														try {
															imagePath = require(`../../../../assets/images/icons/${file.file_name.split('.').pop()}.png`).default
														} catch (error) {
															// 파일을 찾을 수 없는 경우 대체 이미지 경로를 지정
															imagePath = require('../../../../assets/images/icons/unknown.png').default
														}
														return (
															<div key={index}>
																<a onClick={() => handleDownload(file.path, file.file_name)}>
																<img src={imagePath} width='16' className='me-50' />
																<span className='text-muted fw-bolder align-text-top'>{file.file_name}</span>
																</a>
															</div>
														)
													})
												}
											</div>
										</Col>
									</Row>
								</CardBody>
							</div>
						</div>
					</div>  
				</div>
			</Card>
		</Fragment>
	)
} 
export default MailDetails