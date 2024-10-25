import Breadcrumbs from '@components/breadcrumbs'
import { axiosDelete, dateFormat, getTableData, handleDownload } from "@utils"
import { useAxiosIntercepter } from "@utility/hooks/useAxiosInterceptor"

import { Fragment, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "reactstrap"
import Cookies from "universal-cookie"
import { API_FACILITY_OUTSOURCINGCONTRACT_DETAIL, ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_FORM, ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_LIST, URL } from "../../../constants"
import { checkOnlyView, primaryHeaderColor } from '../../../utility/Utils'
import { useSelector } from 'react-redux'
import { FACILITY_CONTRACT_MGMT } from '../../../constants/CodeList'

const OutsourcingContractDetail = () => {
	useAxiosIntercepter()
	const navigate = useNavigate()
    const loginAuth = useSelector((state) => state.loginAuth)
	const cookies = new Cookies()
	const { id } = useParams()
	const [data, setData] = useState()
	const [submitResult, setSubmitResult] = useState(false)

	const handleDelete = () => {
		axiosDelete('외주계약관리', `${API_FACILITY_OUTSOURCINGCONTRACT_DETAIL}/${id}`, setSubmitResult)
	}

	useEffect(() => {
		getTableData(`${API_FACILITY_OUTSOURCINGCONTRACT_DETAIL}/${id}`, {property_id: cookies.get('property').value}, setData)
	}, [])

	const fileId = []
	useEffect(() => {
		if (data) {
			data.outsourcing_contract_attachment.forEach((file) => {
				fileId.push(file.id)
			})
		}
	}, [data])

	useEffect(() => {
		if (submitResult) {
			navigate(ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_LIST)
		}
	}, [submitResult])

	return (
		<Fragment>
			{data &&
				<>
					<Row>
						<div className='d-flex justify-content-start'>
							<Breadcrumbs breadCrumbTitle='외주계약관리' breadCrumbParent='시설관리' breadCrumbActive='외주계약관리' />
						</div>
					</Row>
					<Card>
						<CardHeader>
							<CardTitle>외주계약관리</CardTitle>
						</CardHeader>
						<CardBody>
							<Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
								<Col lg='6' md='6' xs='12'>
									<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
										<Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>계약명</Col>
										<Col lg='8' md='8' xs='8' className='card_table col text start'>
											<div>{data.outsourcing_contract.name}</div>
										</Col>
									</Row>
								</Col>
								<Col lg='6' md='6' xs='12'>
									<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
										<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>상태</Col>
										<Col lg='8' md='8' xs='8' className='card_table col text start'>
											<div>{data.outsourcing_contract.status}</div>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
								<Col lg='6' md='6' xs='12'>
									<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
										<Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>시작일</Col>
										<Col lg='8' md='8' xs='8' className='card_table col text start'>
											<div>{dateFormat(data.outsourcing_contract.start_datetime)}</div>
										</Col>
									</Row>
								</Col>
								<Col lg='6' md='6' xs='12'>
									<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
										<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>종료일</Col>
										<Col lg='8' md='8' xs='8' className='card_table col text start'>
											<div>{dateFormat(data.outsourcing_contract.end_datetime)}</div>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
								<Col lg='6' md='6' xs='12'>
									<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
										<Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>건물명</Col>
										<Col lg='8' md='8' xs='8' className='card_table col text start'>
											<div>{data.outsourcing_contract.building.name}</div>
										</Col>
									</Row>
								</Col>
								<Col lg='6' md='6' xs='12'>
									<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
										<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>계약금액</Col>
										<Col lg='8' md='8' xs='8' className='card_table col text start'>
											<div>{`${data.outsourcing_contract.price.toLocaleString('ko-KR')}원`}</div>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
								<Col lg='6' md='6' xs='12'>
									<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
										<Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>직종</Col>
										<Col lg='8' md='8' xs='8' className='card_table col text start'>
											<div>{data.outsourcing_contract.employee_class.code}</div>
										</Col>
									</Row>
								</Col>
								<Col lg='6' md='6' xs='12'>
									<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
										<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>협력업체명</Col>
										<Col lg='8' md='8' xs='8' className='card_table col text start'>
											<div>{data.outsourcing_contract.outsourcing_company.name}</div>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row style={{marginLeft: 0, marginRight: 0, borderBottom: '0.5px solid #B9B9C3', minHeight: '70px'}}>
								<Col lg='12' md='12' xs='12'>
									<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
										<Col lg='2' md='2' xs='4' className='card_table col text center' style={{borderLeft: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>비고</Col>
										<Col lg='10' md='10' xs='8' className='card_table col start' style={{wordBreak:'break-all'}}>
											<div>{data.outsourcing_contract.description}</div>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row className='card_table my-1'>
								<Col style={{borderTop: '3px dotted #ccc'}}>
									{data && 
										<Col lg='4' md='4' xs='4' className='card_table col text'>
											첨부파일 {data.outsourcing_contract_attachment.length}
										</Col>
									}
									{data.outsourcing_contract_attachment && data.outsourcing_contract_attachment.map((file, idx) => {
										let imagePath
										try {
											imagePath = require(`../../../assets/images/icons/${file.original_file_name.split('.').pop()}.png`).default
										} catch (error) {
											imagePath = require('../../../assets/images/icons/unknown.png').default
										}
										return (
											<div key={idx}>
												<a onClick={() => handleDownload(`${file.path}${file.uuid}`, file.original_file_name)}>
													<img src={imagePath} width='16' height='18' className='me-50' />
													<span className='text-muted fw-bolder align-text-top'>
														{file.original_file_name}
													</span>
												</a>
											</div>
										)
									})}
								</Col>
							</Row>
						</CardBody>
						<CardFooter className='mt-1' style={{display: 'flex', justifyContent: 'end'}}>
							<Button hidden={checkOnlyView(loginAuth, FACILITY_CONTRACT_MGMT, 'available_delete')}
                                color='danger' onClick={() => handleDelete()}>삭제</Button>
							<Button hidden={checkOnlyView(loginAuth, FACILITY_CONTRACT_MGMT, 'available_update')}
                                className="mx-1" color="primary" tag={Link} to={ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_FORM} state={{type: 'modify', data: data, id: id, fileId: fileId}}>수정</Button>
							<Button tag={Link} to={ROUTE_FACILITYMGMT_OUTSOURCINGCONTRACT_LIST}>목록</Button>
						</CardFooter>
					</Card>
				</>
			}
		</Fragment>
	)
}

export default OutsourcingContractDetail