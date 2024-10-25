/* eslint-disable */
import Breadcrumbs from '@components/breadcrumbs'
import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import Swal from "sweetalert2"
import Cookies from 'universal-cookie'
import { API_SCHEDULE_DETAIL, API_SCHEDULE_LIST, ROUTE_SCHEDULE_REGISTRATION, ROUTE_SCHEDULE_REGISTRATION_DISASTER_CALENDAR, ROUTE_SCHEDULE_REGISTRATION_INSPECT_CALENDAR } from '../../../constants'
import axios from "../../../utility/AxiosConfig"
import { checkOnlyView, getScheduleCycle, getTableData, primaryColor } from '../../../utility/Utils'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { completeResultToListAlert } from '../data'
import CustomDataTable from './CustomDataTable'
import Filter from './Filter'
import InspectionModal from './InspectionModal'
import RegisterModal from './RegisterModal'
import { SCHEDULE_REGISTER, SCHEDULE_REGISTER_DISASTER } from '../../../constants/CodeList'
import TotalLabel from '../../../components/TotalLabel'

const SchedulRegisterIndex = () => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const loginAuth = useSelector((state) => state.loginAuth)
	const type = useParams()
	const [searchValue, setSearchValue] = useState('')
	const [classList, setClassList] = useState([{label: '전체', value:''}])
	const [classSelect, setClassSelect] = useState({label: '전체', value:''})
	const [registerModal, setRegisterModal] = useState(false)
	const [inspectionModal, setInspectionModal] = useState(false)
	const [inspectionId, setInspectionId] = useState(0)
	const btnActive = true

	const [data, setData] = useState([])
	const [state, setState] = useState('')
	const navigate = useNavigate()
	const calendarUrl = type.type === 'inspection' ? ROUTE_SCHEDULE_REGISTRATION_INSPECT_CALENDAR : ROUTE_SCHEDULE_REGISTRATION_DISASTER_CALENDAR

	const getDataInit = () => {
		const param = {
			property : cookies.get('property').value,
			search_value : searchValue,
			class_select : classSelect.value,
			type : type.type
		}
		// const totalParm = {
		// 	model:'checklist_schedule AS che INNER JOIN checklist_template AS template ON che.checklist_template = template.id', 
		// 	condition:`template.prop_id=${cookies.get('property').value} AND che.delete_datetime is null AND template.type="${type.type}"`
		// }
		getTableData(API_SCHEDULE_LIST, param, setData)
		// getTableData(API_REPORT_TABLE_TOTAL_COUNT, totalParm, setTotalCount)
	}

	const clickInspectionModal = (data) => {
		if (checkOnlyView(loginAuth, SCHEDULE_REGISTER, 'available_read')) return
		setInspectionId(data)
		setInspectionModal(!inspectionModal)
	}

	const handleDelete = (id) => {
		if (checkOnlyView(loginAuth, SCHEDULE_REGISTER, 'available_delete')) return
		Swal.fire({
			icon: "warning",
			html: "정말 삭제하시겠습니까?",
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonText: "취소",
			// cancelButtonColor : '#FF9F43',
			confirmButtonText: '확인',
			confirmButtonColor : primaryColor,
			reverseButtons :true,
			customClass: {
				actions: 'sweet-alert-custom right',
				cancelButton: 'me-1'
			}
		}).then((result) => {
			if (result.isConfirmed) {
				axios.delete(`${API_SCHEDULE_DETAIL}/${id}`)
				.then(res => {
					if (res.status === 200) {
						completeResultToListAlert('삭제를', navigate)
					}
				})
			} else if (result.dismiss) {
				Swal.fire({
					icon: "info",
					html: "취소하였습니다.",
					showCancelButton: true,
					showConfirmButton: false,
					cancelButtonText: "확인",
					cancelButtonColor : primaryColor,
					reverseButtons :true,
					customClass: {
						actions: 'sweet-alert-custom right'
					}
				})
			}
		})
	}

	const handleEdit = (id) => {
		if (checkOnlyView(loginAuth, SCHEDULE_REGISTER, 'available_update')) return
		setState('modify')
		setInspectionId(id)
		setRegisterModal(!registerModal)
	}

	const columns = [
		{
			name: '작성일자',
			width: '130px',
			sortField: 'create_datetime',
			cell: row => moment(row.create_datetime).format('YYYY-MM-DD')
		},
		{
			name: '직종',
			sortable: false,
			width: '100px',
			sortField: 'employee_class',
			cell: row => row.employee_class
		},
		{
			name: '문서번호',
			sortable: false,
			width: '100px',
			sortField: 'id',
			cell: row => row.view_order
		},
		{
			name: '일지명',
			sortable: true,
			minWidth: '300px',
			cell: row => row.name
		},
		{
			name: '시작일',
			sortable: false,
			sortField: 'start_datetime',
			width:'150px',
			cell: row => row.start_datetime
		},
		{
			name: '점검 주기',
			minWidth: '428px',
			cell: row => getScheduleCycle(row)
		},
		{
			name: '양식',
			width: '100px',
			style: {
				padding:'0.3rem !important'
			},
			cell: row => { 
				return (
					<div className='custom-table-button' onClick={() => clickInspectionModal(row.checklist_template)}>조회</div> 
				)
			}
		},
		{
			name: '편집',
			width: '160px',
			cell: row => {
				return (
					<Fragment key={row.id}>
						<Row style={{width:'100%', padding:0}}>
							<Col xs={12} lg={6} style={{textAlign:'center'}}>
								<Row>
									<Button hidden={checkOnlyView(loginAuth, type.type === 'inspection' ? SCHEDULE_REGISTER : SCHEDULE_REGISTER_DISASTER, 'available_update')} size='sm' color='primary' outline onClick={() => handleEdit(row.id)}>수정</Button>
								</Row>
							</Col>
							<Col xs={12} lg={6} style={{textAlign:'center'}}>
								<Row>
									<Button hidden={checkOnlyView(loginAuth, type.type === 'inspection' ? SCHEDULE_REGISTER : SCHEDULE_REGISTER_DISASTER, 'available_delete')} size='sm' style={{marginLeft:'0.4rem'}} color='report' onClick={() => handleDelete(row.id)}>삭제</Button>
								</Row>
							</Col>
						</Row>
					</Fragment> 
				)
			}
		}
	]

	useEffect(() => {
		getDataInit()
	}, [])

	// certificate
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs 
						breadCrumbTitle='업무등록'
						breadCrumbParent='일정관리'
						breadCrumbActive={`${type.type === 'inspection' ? '업무등록' : '중대재 안전점검 업무등록'}`}  
					/>
				</div>
			</Row>
			<Row >
				<Card>
					<CardHeader>
						<Col md='6' xs='12'>
							<CardTitle>
								{type.type === 'inspection' ? '일일점검 업무등록' : '중대재 안전점검 업무등록'}
							</CardTitle>
						</Col>
						<Col md='6' xs='12' className='calendar-buttons' style={{display:"flex", justifyContent:'right'}}>
							<Button color='primary' className={`to-list ${btnActive ? "active" : ""}`} outline tag={Link} style={{borderTopRightRadius:0, borderBottomRightRadius:0}} to={`${ROUTE_SCHEDULE_REGISTRATION}/${type.type}`}>목록</Button>
							<Button color='primary' className="to-list" outline tag={Link} style={{marginLeft:'-1px', borderBottomLeftRadius:0, borderTopLeftRadius:0}} to={calendarUrl} state={{'type':type.type}}>캘린더</Button>
							<Button hidden={checkOnlyView(loginAuth, type.type === 'inspection' ? SCHEDULE_REGISTER : SCHEDULE_REGISTER_DISASTER, 'available_create')}
								color='primary' className='ms-1' onClick={() => setRegisterModal(!registerModal)}>등록</Button>
						</Col>
					</CardHeader>
					<CardBody>
						<Filter 
							searchValue={searchValue} 
							setSearchValue={setSearchValue} 
							classSelect={classSelect}
							setClassSelect={setClassSelect} 
							classList ={classList}
							setClassList ={setClassList}
							getDataInit={getDataInit}
						/>
						<Row>
							<TotalLabel 
								num={3}
								data={data.length}
							/>
						</Row>
						<CustomDataTable 
							columns={columns} 
							tableData={data} 
							setTabelData={setData}
							detailAPI={'/'}
						/>
					</CardBody>
				</Card>
			</Row>
			<RegisterModal isOpen={registerModal} setIsOpen={setRegisterModal} state={state} setState={setState} rowId={inspectionId} type={type.type}/>
			<InspectionModal modal={inspectionModal} setModal={setInspectionModal} rowId = {inspectionId}/>
		</Fragment>
	)
}
export default SchedulRegisterIndex