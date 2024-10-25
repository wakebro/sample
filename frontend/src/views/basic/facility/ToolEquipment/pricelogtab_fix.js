import axios from 'axios'
import Swal from 'sweetalert2'
import { Fragment, useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, TabContent, TabPane, InputGroup, InputGroupText, Modal} from "reactstrap"
import { ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL, API_BASICINFO_FACILITY_TOOLEQUIPMENT_RECORD } from '../../../../constants'
import { axiosSweetAlert, sweetAlert, getTableData, pickerDateChange, primaryColor } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import CustomDataTable from "./CustomDataTable"
import NavTab from './NavTab'
import AddModal from './AddModal'
import * as moment from 'moment'
import Flatpickr from "react-flatpickr"
import { Korean } from "flatpickr/dist/l10n/ko.js"

const PriceLogTab = () => {
	useAxiosIntercepter()
	const BasicInfoTabList = [
		{label : '공구비품이력', value : 'record'},
		{label : '첨부파일', value : 'file'}
	]
	const BasicInfoAPIObj = {
		record : API_BASICINFO_FACILITY_TOOLEQUIPMENT_RECORD,
		file : API_BASICINFO_FACILITY_TOOLEQUIPMENT_RECORD
	}

	const [navActive, setNavActive] = useState()
	const [columns, setColumns] = useState()
	const [data, setData] = useState([])
	const [tableSelect, setTableSelect] = useState([])
	const [isOpen, setIsOpen] = useState(false)
	const [submitResult, setSubmitResult] = useState(false)
	const navigate = useNavigate()
	const id = useParams()
	const toolequipment_id = id.id
	const past = moment().subtract(7, 'days')
	const [picker, setPicker] = useState([past.format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')])

	const basicInfoColumn = {
		record : [
			{
				name: '제목',
				cell: row => row.title,
				minWidth:'200px'
				
			},
			{
				name: '첨부파일',
				cell: row => row.file_name

			},
			{
				name: '등록일자',
				cell: row => row.date.split('T')[0],
				width:'120px'

			}
		],
		file : [
			{
				name: '제목',
				cell: row => row.title,
				minWidth:'200px'
			},
			{
				name: '첨부파일',
				cell: row => row.file_name
			},
			{
				name: '등록일자',
				cell: row => row.date.split('T')[0],
				width:'120px'

			}
		]
	}

	const openModal = () => {
		setIsOpen(true)
	}

	useEffect(() => {
		if (window.location.pathname !== localStorage.getItem('pathname')) {
			localStorage.clear()
			localStorage.setItem('pathname', window.location.pathname)
			setNavActive(BasicInfoTabList[0].value)
			getTableData(BasicInfoAPIObj[BasicInfoTabList[0].value], {id : toolequipment_id, navActive: BasicInfoTabList[0].value, picker: pickerDateChange(picker)}, setData)
		} else {
			setNavActive(localStorage.getItem('navTab'))
		}
	}, [])

	useEffect(() => {
		if (navActive !== undefined) {
			if (navActive !== localStorage.getItem('navTab')) {
				localStorage.setItem('navTab', navActive)
			}
			setData([])
			// setSelected(selectList[0])
			setColumns(basicInfoColumn[navActive])
			getTableData(BasicInfoAPIObj[navActive], {id : toolequipment_id, navActive: navActive, picker: pickerDateChange(picker)}, setData)
		}
	}, [navActive, picker])

	const handleDelete = () => {
		const recordIds = tableSelect.map(item => item.id)
		if (recordIds.length === 0) {
			sweetAlert('', `삭제할 공구비품 이력을 선택해주세요.`, 'warning')
			return false
		}
		Swal.fire({
			icon: "warning",
			html: "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
			showCancelButton: true,
			showConfirmButton: true,
			heightAuto: false,
			cancelButtonText: "취소",
			confirmButtonText: '확인',
			confirmButtonColor : primaryColor,
			reverseButtons :true,
			customClass: {
				actions: 'sweet-alert-custom right',
				cancelButton: 'me-1'
			}
		}).then((res) => {
			if (res.isConfirmed) {
				axios.delete(API_BASICINFO_FACILITY_TOOLEQUIPMENT_RECORD, { data: { recordIds: recordIds  } })
					.then((res) => {
						if (res.status === 200) {
							axiosSweetAlert(`공구비품 이력 삭제 완료`, `공구비품 이력 삭제가 완료되었습니다.`, 'success', 'center', setSubmitResult)
						} else {
							sweetAlert(`공구비품 삭제 실패`, `공구비품 삭제를 실패헀습니다.<br/>다시한번 확인 해주세요.`, 'warning')
						}
					}).catch(() => {
						sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
					})
			} else {
				Swal.fire({
					icon: "info",
					html: "취소하였습니다.",
					showCancelButton: true,
					showConfirmButton: false,
					heightAuto: false,
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

	useEffect(() => {
		if (submitResult) {
			navigate(`${ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL}/${toolequipment_id}`, {state: BasicInfoTabList[0].value})
		}
	}, [submitResult])

	return (
		<Fragment>
			<Row>
				<Col sm={6} md={8} lg={6} style={{paddingLeft:'0px'}}>
					<NavTab tabList={BasicInfoTabList} active={navActive} setActive={setNavActive}/>
				</Col>
			</Row>
			<TabContent className='px-0' activeTab={navActive} style={{border:'1px solid #D8D6DE'}}>
				{
					BasicInfoTabList.map((tab, idx) => {
						return (
							<TabPane tabId={tab.value} key={idx}>
								<Card>
									<CardHeader className='d-flex justify-content-between'>
										<CardTitle className="title">{tab.label}</CardTitle>
											<div className='d-flex mb-1'>
												<Button color='white' size='sm' style={{ marginTop: '1%', marginRight: '1%', borderColor: 'gray', whiteSpace:'nowrap' }} onClick={handleDelete}>삭제</Button>
												<Button className='ms-1' size='sm' color='white' style={{ marginTop: '1%', borderColor: 'gray', whiteSpace:'nowrap', marginRight:'10px'}} onClick={openModal}>추가</Button>
												<AddModal
													formModal= {isOpen}
													setFormModal= {setIsOpen}
													activeTab={navActive}
													toolequipment_id={toolequipment_id}
													setSubmitResult={setSubmitResult}/>
											</div>
									</CardHeader>
									<CardBody className='pt-0'>
										<Row className='mb-1'>
											<Col md='1' xs='2' style={{ textAlign: 'right', display: 'flex', alignItems: 'center', whiteSpace:'nowrap', justifyContent:'center' }}>등록일</Col>
											<Col md='3' xs='10' style={{paddingLeft: 'inherit'}}>
												<Flatpickr
													value={picker}
													id='range-picker'
													className='form-control'
													placeholder='2022/02/09~2023/03/03'
													onChange={date => { if (date.length === 2) setPicker(date) } }
													options={{
														mode: 'range',
														ariaDateFormat:'Y-m-d',
														locale: {rangeSeparator: ' ~ '},
														defaultValue: picker, // 초기값 설정,
														locale: Korean
													}}/>
											</Col>
										</Row>
											{
												data &&
												<CustomDataTable
													columns={columns} 
													tableData={data} 
													setTableSelect={setTableSelect}
													selectType={true}
													// detailAPI={ROUTE_SYSTEMMGMT_BASIC_COMPANY_DETAIL}
												/>
											}
									</CardBody>
								</Card>
							</TabPane>
						)
					})
				}
			</TabContent>
		</Fragment>
	)
}

export default PriceLogTab