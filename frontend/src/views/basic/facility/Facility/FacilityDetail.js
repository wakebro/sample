/* eslint-disable */
import { Fragment, useEffect, useState } from "react"
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "reactstrap"
import Breadcrumbs from '@components/breadcrumbs'
import { Link, useParams } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { API_BASICINFO_FACILITY_DETAIL, ROUTE_BASICINFO_FACILITY_FACILITYINFO, ROUTE_BASICINFO_FACILITY_FACILITYINFO_FORM, URL } from "../../../../constants"
import axios from "axios"
import Cookies from "universal-cookie"
import * as moment from 'moment'
import { useAxiosIntercepter } from "@utility/hooks/useAxiosInterceptor"
import CustomDataTable from "../CustomDataTable"
import { basicInfoColumn, customStyles, nameReduxObj } from "../data"
import { axiosDelete } from '../../../../utility/Utils'
import { NoDataCause }  from "@src/components/Sentence"
import DataTable from "react-data-table-component"
import AddLogModal from "./AddLogModal"

const FacilityDetail = () => {
	useAxiosIntercepter()
	const { id } = useParams()
	const dispatch = useDispatch()
	const facilityRedux = useSelector((state) => state.facility)
	const cookies = new Cookies()
	const [submitResult, setSubmitResult] = useState(false)
	const [list, setList] = useState({
		data : [],
		detailData : [],
		logData : [],
		workLogData : [],
		useMaterialLog: [],
		facilityMaterial: []
	})
	const { data, detailData, logData, workLogData, useMaterialLog, facilityMaterial } = list

	const dateFormat = (data) => {
		if (data !== null && data !== undefined) {
			return moment(data).format('YYYY-MM-DD')
		}
	}

	const handleDeleteClick = () => {
		axiosDelete('설비 정보', `${API_BASICINFO_FACILITY_DETAIL}/${id}`, setSubmitResult)
	}
	
	useEffect(() => {
		dispatch(nameReduxObj.facility.setPageType('detail'))
		axios.get(`${API_BASICINFO_FACILITY_DETAIL}/${id}`, {params:{property:cookies.get('property').value}})
		.then(res => {
			setList({
				...list,
				data: res.data.facility,
				detailData: res.data.facility_detail,
				logData: res.data.facility_log,
				workLogData: res.data.facility_work_log,
				useMaterialLog: res.data.use_material_log,
				facilityMaterial: res.data.facility_material
			})
		})
	}, [])
	useEffect(() => {
		if (submitResult) {
			window.location.href = ROUTE_BASICINFO_FACILITY_FACILITYINFO
		}
	}, [submitResult])
	return (
		<Fragment>
			<Row>
				<Col>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='설비정보' breadCrumbParent='기본정보' breadCrumbParent2='설비정보관리' breadCrumbActive='설비정보' />
					</div>
				</Col>
				<Col>
					{/* <div className='d-flex justify-content-end'>
						문서변환
					</div> */}
				</Col>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle>설비이력카드</CardTitle>
				</CardHeader>
				{data &&
					<CardBody style={{ paddingTop: 0, marginLeft: '1%' }}>
						<Row className="mb-2">
							{data.photo !== null ?
								<Col className="card_table col text center" style={{height : 'auto'}}>
									<img src={`/static_backend/${data.photo}`} style={{height:"100%", width: '100%', objectFit:'contain'}}></img>
								</Col>
								:
								<Col className="card_table col text center" style={{height : 'auto', backgroundColor: '#ECE9E9'}}>                                        
										건물 사진을 등록해 주세요.
								</Col>
							}
							<Col md='7'>
								<CardTitle className="mb-1">기본정보</CardTitle>
								<Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center'>설비코드</Col>
											<Col xs='8' className='card_table col text start'>{data.code}</Col>
										</Row>
									</Col>
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center border-x'>설비명</Col>
											<Col xs='8' className='card_table col text start'>{data.name}</Col>
										</Row>
									</Col>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center'>용도</Col>
											<Col xs='8' className='card_table col text start'>{data.use}</Col>
										</Row>
									</Col>
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center border-x'>규격</Col>
											<Col xs='8' className='card_table col text start'>{data.capacity}</Col>
										</Row>
									</Col>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center'>모델</Col>
											<Col xs='8' className='card_table col text start'>{data.model_no}</Col>
										</Row>
									</Col>
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center border-x'>작성일</Col>
											<Col xs='8' className='card_table col text start'>{dateFormat(data.create_datetime)}</Col>
										</Row>
									</Col>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center'>제조사</Col>
											<Col xs='8' className='card_table col text start'>{data.maker}</Col>
										</Row>
									</Col>
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center border-x'>제조번호</Col>
											<Col xs='8' className='card_table col text start'>{data.maker_no}</Col>
										</Row>
									</Col>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4'  className='card_table col col_color text center '>대분류</Col>
											<Col xs='8' className='card_table col text start '>{data.option_1}</Col>
										</Row>
									</Col>
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center border-x'>중분류</Col>
											<Col xs='8' className='card_table col text start'>{data.option_2}</Col>
										</Row>
									</Col>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center border-x'>제조일자</Col>
											<Col xs='8' className='card_table col text start '>{dateFormat(data.manufactured_date)}</Col>
										</Row>
									</Col>
									<Col className='border-left'/>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4'  className='card_table col col_color text center'>구입일자</Col>
											<Col xs='8' className='card_table col text start '>{dateFormat(data.purchased_date)}</Col>
										</Row>
									</Col>
									<Col className='border-left'/>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4'  className='card_table col col_color text center '>설치일자</Col>
											<Col xs='8' className='card_table col text start '>{dateFormat(data.installed_date)}</Col>
										</Row>
									</Col>
									<Col className='border-left'/>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center '>내구년수</Col>
											<Col xs='8' className='card_table col text start '>{data.durab_year}</Col>
										</Row>
									</Col>
									<Col className='border-left'/>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center '>직종</Col>
											<Col xs='8' className='card_table col text start '>{data.employee_class ? data.employee_class.code : data.employee_class}</Col>
										</Row>
									</Col>
									<Col className='border-left'/>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4'  className='card_table col col_color text center '>건물</Col>
											<Col xs='8' className='card_table col text start '>{data.building ? data.building.name : data.building}</Col>
										</Row>
									</Col>
									<Col className='border-left'/>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4'  className='card_table col col_color text center '>층</Col>
											<Col xs='8' className='card_table col text start '>{data.floor ? data.floor.name : data.floor}</Col>
										</Row>
									</Col>
									<Col className='border-left'/>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4' className='card_table col col_color text center border-x'>실</Col>
											<Col xs='8' className='card_table col text start'>{data.room ? data.room.name : data.room}</Col>
										</Row>
									</Col>
									<Col className='border-left'/>
								</Row>
								<Row className="card_table mx-0 border-right">
									<Col xs='12' md='6' className="border-b">
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4'  className='card_table col col_color text center '>작성자</Col>
											<Col xs='8' className='card_table col text start '>{data.user ? data.user.name : data.user}</Col>
										</Row>
									</Col>
									<Col className='border-left'/>
								</Row>
								<Row className="card_table mid">
									<Col xs='12' md='6'>
										<Row className='card_table table_row' style={{ minHeight:'2.5rem'}}>
											<Col xs='4'  className='card_table col col_color text center '>비고</Col>
											<Col xs='8' className='card_table col start' style={{wordBreak:'break-all'}}>{data.description}</Col>
										</Row>
									</Col>
									<Col className='border-left'/>
								</Row>
							</Col>
						</Row>
					</CardBody>
				}

				<CardHeader>
					<CardTitle>세부사양</CardTitle>
				</CardHeader>
				<CardBody style={{paddingTop: 0, paddingBottom: '2%'}}>
					<CustomDataTable
						tableData={detailData}
						columns={basicInfoColumn.detail}/>
				</CardBody>

				<CardHeader>
					<CardTitle>수리이력</CardTitle>
				</CardHeader>
				<CardBody style={{paddingTop: 0, paddingBottom: '2%'}}>
					<DataTable
						noHeader
						data={logData}
						columns={basicInfoColumn.log}
						className='react-dataTable'
						customStyles={customStyles}
						noDataComponent={<NoDataCause/>}
						persistTableHead/>
				</CardBody>

				<CardHeader>
					<CardTitle>작업이력</CardTitle>
				</CardHeader>
				<CardBody style={{paddingTop: 0, paddingBottom: '2%'}}>
					<DataTable
						noHeader
						data={workLogData}
						columns={basicInfoColumn.workLog}
						className='react-dataTable'
						customStyles={customStyles}
						noDataComponent={<NoDataCause/>}
						persistTableHead/>
				</CardBody>

				<CardHeader>
					<CardTitle>자재사용이력</CardTitle>
				</CardHeader>
				<CardBody style={{paddingTop: 0, paddingBottom: '2%'}}>
					<DataTable
						noHeader
						data={useMaterialLog}
						columns={basicInfoColumn.useMaterial}
						className='react-dataTable'
						customStyles={customStyles}
						noDataComponent={<NoDataCause/>}
						persistTableHead/>
				</CardBody>

				<CardHeader>
					<CardTitle>관련자재</CardTitle>
				</CardHeader>
				<CardBody style={{paddingTop: 0, paddingBottom: '2%'}}>
					<DataTable
						noHeader
						data={facilityMaterial}
						columns={basicInfoColumn.facilityMaterialDetail}
						className='react-dataTable'
						customStyles={customStyles}
						noDataComponent={<NoDataCause/>}
						persistTableHead/>
				</CardBody>

				<CardFooter style={{display:'flex', justifyContent:'end', alignItems:'center'}}>
					<Button color='danger' onClick={() => handleDeleteClick()}>삭제</Button>
					<Button className="mx-1" color="primary" tag={Link} to={ROUTE_BASICINFO_FACILITY_FACILITYINFO_FORM} state={{type: 'modify', id: id}}>수정</Button>
					<Button tag={Link} to={ROUTE_BASICINFO_FACILITY_FACILITYINFO}>목록</Button>
				</CardFooter>
			</Card>
			<AddLogModal
				name='facility'
				redux={facilityRedux}/>
		</Fragment>
	)
}

export default FacilityDetail