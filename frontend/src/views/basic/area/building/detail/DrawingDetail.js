import { Fragment, useState, useEffect } from "react"
import { API_BASICINFO_AREA_BUILDING_DRAWING_DETAIL, API_BASICINFO_AREA_BUILDING_DRAWING_LIST, ROUTE_BASICINFO_AREA_BUILDING_DRAWING, ROUTE_BASICINFO_AREA_BUILDING_DRAWING_ADD} from "../../../../../constants"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Row, Card, CardHeader, CardBody, Button, Col, CardTitle, CardFooter } from "reactstrap"
import Breadcrumbs from '@components/breadcrumbs'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useAxiosIntercepter } from "../../../../../utility/hooks/useAxiosInterceptor"
import Tab from "../Tab"
import BuildingBasicInfoCard from "../BuildingBasicInfoCard"
import { getTableData, axiosDeleteParm, primaryHeaderColor, handleDownload } from "../../../../../utility/Utils"

const DrawingDetail = () => {
	useAxiosIntercepter()
	const { type, id } = useParams()
	const [data, setData] = useState()
	const navigate = useNavigate()
	const [files, setFiles] = useState(['', '', '', '', '', ''])

	const handleDelete = (num) => {
		axiosDeleteParm(
			'건물 도면', 
			API_BASICINFO_AREA_BUILDING_DRAWING_LIST, 
			{data: {id: num}}, 
			`${ROUTE_BASICINFO_AREA_BUILDING_DRAWING}/${type}`, 
			navigate
		)
	}
	
	useEffect(() => {
		getTableData(`${API_BASICINFO_AREA_BUILDING_DRAWING_DETAIL}/${id}`, {}, setData)
	}, [])

	useEffect(() => {
		if (data) {
			if (data) setFiles(data.file)
		}
	}, [data])

	return (
		<Fragment>
			{data && (
				<>
					<Row>
						<div className='d-flex justify-content-start'>
							<Breadcrumbs breadCrumbTitle='건물정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='건물정보' />
						</div>
					</Row>
					<Row>
						<Col md='4'>
							<BuildingBasicInfoCard />
						</Col>
						<Col>
							<Tab md='5' id={type} active='drawing'></Tab>
							<Card>
								<CardHeader>
									<CardTitle className="title">
										도면
									</CardTitle>
								</CardHeader>
								<CardBody className="mb-1">
									<Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
										<Col lg='6' md='6' xs='12'>
											<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
												<Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>도면명</Col>
												<Col lg='8' md='8' xs='8' className='card_table col text start'>
													<div>{data.drawing.name}</div>
												</Col>
											</Row>
										</Col>
										<Col lg='6' md='6' xs='12'>
											<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
												<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>건물코드</Col>
												<Col lg='8' md='8' xs='8' className='card_table col text start'>
													<div>{data.drawing.building ? data.drawing.building.name : ''}</div>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
										<Col lg='6' md='6' xs='12'>
											<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
												<Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>직종</Col>
												<Col lg='8' md='8' xs='8' className='card_table col text start'>
													<div>{data.drawing.employee_class ? data.drawing.employee_class.code : ''}</div>
												</Col>
											</Row>
										</Col>
										<Col lg='6' md='6' xs='12'>
											<Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
												<Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>층코드</Col>
												<Col lg='8' md='8' xs='8' className='card_table col text start'>
													<div>{data.drawing.floor ? data.drawing.floor.name : ''}</div>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row style={{marginLeft: 0, marginRight: 0, borderBottom: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3'}}>
										<Col md='2' className="d-flex align-items-center justify-content-center" style={{backgroundColor: primaryHeaderColor, borderLeft: '0.5px solid #B9B9C3', borderTop: '0.5px solid #B9B9C3'}}>첨부파일</Col>
										<Col md='10' style={{display: 'flex', flexDirection: 'column', padding: 0, borderTop: '0.5px solid #B9B9C3'}}>
											{
												files.map((file, index) => (
													<Row className="d-flex align-items-center" style={{ display: 'flex', borderBottom: '0.5px solid #B9B9C3', margin: 0, minHeight: '42px', borderLeft: '0.5px solid #B9B9C3'}} key={index}>
														<Col xs='7'>{file.original_name}</Col>
														{
															(file)
															? <Col className="d-flex justify-content-end"><Button outline style={{ margin: '0.5%' }} onClick={() => handleDownload(file.path, file.original_name)} download>다운로드</Button></Col>
															: <Col></Col>
														}
													</Row>
												))
											}
										</Col>
									</Row>
								</CardBody>
								<CardFooter style={{display: 'flex', justifyContent: 'end'}}>
									<Button color='danger' onClick={() => handleDelete(id)}>삭제</Button>
									<Button className="mx-1" color="primary" tag={Link} to={`${ROUTE_BASICINFO_AREA_BUILDING_DRAWING_ADD}/${type}`} state={{pageType:'modify', id:id}}>수정</Button>
									<Button tag={Link} to={`${ROUTE_BASICINFO_AREA_BUILDING_DRAWING}/${type}`}>목록</Button>
								</CardFooter>
							</Card>
						</Col>
					</Row>
				</>
			)}
		</Fragment>
	)
}


export default DrawingDetail
