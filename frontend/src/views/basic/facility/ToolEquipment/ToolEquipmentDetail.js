import { Fragment, useEffect, useState } from "react"
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Button, CardFooter } from "reactstrap"
import Breadcrumbs from '@components/breadcrumbs'
import { useParams, Link, useNavigate } from "react-router-dom"
import { ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_FIX, API_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL, ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT, API_EXPORT_FACILITY_EQUIPMENT, URL } from "../../../../constants"
import PriceLogTab from "./pricelogtab_fix"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import Cookies from "universal-cookie"
import axios from '../../../../utility/AxiosConfig'
import { FileText } from "react-feather"
import { axiosDeleteParm } from "../../../../utility/Utils"

const Facility_ToolEquipment_detail = () => {
	useAxiosIntercepter()
	const  id  = useParams()
	const [data, setData] = useState([])
	const navigate = useNavigate()
	const cookies = new Cookies()
	const toolequipment_id = id.id

	const filePath = data.toolequipment && data.toolequipment.path ? data.toolequipment.path.replace("static/", "") : null

	const GetDetailData = () => {
		axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL,  { params: {id : toolequipment_id} })
		.then((response) => {
			setData(response.data)
		})
		.catch(error => {
		  // 응답 실패 시 처리
			console.error(error)// 에러 메시지
		})
	}

	useEffect(() => {
		GetDetailData()
	}, [])

	const DeleteData = () => {
		axiosDeleteParm('공구 비품 정보', API_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL, {data:{id : toolequipment_id}}, ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT, navigate)
	}

	const handleExport = () => {
		axios.get(API_EXPORT_FACILITY_EQUIPMENT, {params: {property_id: cookies.get('property').value, id : toolequipment_id}})
		.then((res) => {
			axios({
				url: res.data.url,
				method: 'GET',
				responseType: 'blob'
			}).then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]))
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', `${res.data.name}`)
				document.body.appendChild(link)
				link.click()
			}).catch((res) => {
				console.log(res)
			})
		})
		.catch(res => {
			console.log(res)
		})
	}

	return (
		<Fragment>
			<div>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='공구비품정보' breadCrumbParent='기본정보'  breadCrumbParent2='설비정보관리' breadCrumbActive='공구비품정보' />
						<Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
							<FileText size={14}/>
							문서변환
						</Button.Ripple>
					</div>
				</Row>
				<Card>
					<CardHeader><CardTitle>공구비품정보</CardTitle></CardHeader>
					<CardBody style={{ paddingTop: 0 }}>
						<Row className="mb-2">
							<Col xs='12' md='6' className="card_table col center d-flex justify-content-center" style={{height : '350px'}}>
								{data.toolequipment && data.toolequipment.path ? (
									<img
										src={`${URL}/static_backend/${filePath}`}
										style={{ height: "100%", width: "100%", objectFit: "contain" }}/>
								) : (
									<div style={{padding:'20px', color:'#B9B9C3'}}> 이미지</div>
								)}
							</Col>

							<Col>
								<CardTitle className="mb-1">기본정보</CardTitle>
								<div>
									<Row className="card_table top" style={{borderBottom: 'none'}}>
										<Col xs='12' md='6'>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4' className='card_table col col_color text center'>
													<Row style={{wordBreak:'break-all'}}>공구비품코드</Row>
												</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
															{data.toolequipment && data.toolequipment.code}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
										<Col xs='12' md='6'>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>제작사</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
															{data.toolequipment && data.toolequipment.maker}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row className="card_table mid"  style={{ borderBottom: 'none'}}>
										<Col xs='12' md='6'>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>규격</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
															{data.toolequipment &&  data.toolequipment.capacity}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
										<Col>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center ' style={{whiteSpace:'nowrap'}}>수량/단위</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
															{data.toolequipment ? data.toolequipment.qty.toLocaleString('ko-KR') : ''}/{data.toolequipment && data.toolequipment.unit}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row className="card_table mid"  style={{ borderBottom: 'none'}}>
										<Col xs='12'  md='6'>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>직종</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
														{data.toolequipment &&  data.toolequipment.employee_class ? data.toolequipment.employee_class.code : ''}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
										<Col>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>입고일</Col>
												<Col xs='8' className='card_table col text start '>
													{data.toolequipment && data.toolequipment.stored_date && data.toolequipment.stored_date.split('T')[0]}
												</Col>
											</Row>
										</Col>
									</Row>
									<Row className="card_table mid"  style={{ borderBottom: 'none'}}>
										<Col xs='12' md='6'>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>구분</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
														{data.toolequipment &&  data.toolequipment.type}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
										<Col>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>구매가</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
														{data.toolequipment ? data.toolequipment.purchase_price.toLocaleString('ko-KR') : ''}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row className="card_table mid"  style={{ borderBottom: 'none'}}>
										<Col xs='12' md='6'>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>상태</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
														{data.toolequipment &&  data.toolequipment.status}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
										<Col>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>감가율</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
															{data.toolequipment ? data.toolequipment.depreciation_rate.toLocaleString('ko-KR') : ''}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row className="card_table mid"  style={{ borderBottom: 'none'}}>
										<Col xs='12'  md='6'>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>위치</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
														{data.toolequipment &&  data.toolequipment.location}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
										<Col>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>
													<Row style={{wordBreak:'break-all'}}>기초잔존가</Row>
												</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
														{data.toolequipment_pricelog ? data.toolequipment_pricelog.basic_remain_price.toLocaleString('ko-KR') : ''}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row className="card_table mid"  style={{ borderBottom: 'none'}}> 
										<Col xs='12' md='6'>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>폐기일</Col>
												<Col xs='8' className='card_table col text start '>{data.toolequipment && data.toolequipment.dispose_date && data.toolequipment.dispose_date.split('T')[0]}</Col>
											</Row>
										</Col>
										<Col>
											<Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
												<Col xs='4'  className='card_table col col_color text center '>잔존가</Col>
												<Col xs='8' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
														{data.toolequipment_pricelog ? data.toolequipment_pricelog.remain_price.toLocaleString('ko-KR') : ''}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row className="card_table mid">
										<Col  xs='12'>
											<Row className='card_table table_row' style={{minHeight:'100px'}} >
												<Col xs='4' md='2'  className='card_table col col_color text center '>비고</Col>
												<Col xs='8' md='10' className='card_table col text start '>
													<Row style={{width:'100%'}}>
														<div>
														{data.toolequipment && data.toolequipment.description}
														</div>
													</Row>
												</Col>
											</Row>
										</Col>
									</Row>
								</div>
							</Col>
						</Row>
						<Row><PriceLogTab/></Row>
					</CardBody>
					<CardFooter className='mt-2' style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
						<Fragment>
							<Button color="danger" onClick={DeleteData}>삭제</Button>
							<Button className="ms-1" color="primary" tag={Link}
								to={`${ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_FIX}/${toolequipment_id}`}>수정</Button>
							<Button 
								className="ms-1"
								tag={Link} 
								to={ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT} 
								>목록</Button>	
						</Fragment>
					</CardFooter>
				</Card>
			</div>
		</Fragment>
	)
}

export default Facility_ToolEquipment_detail