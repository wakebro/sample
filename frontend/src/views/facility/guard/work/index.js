import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import NoData from '@src/components/NoData'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { getKorAmPmHHMMSS, getTableData, pickerDateChange, sweetAlert } from '@utils'
import { AXIOS } from "@views/system/basic/company/data"
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { Korean } from "flatpickr/dist/l10n/ko.js"
import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import { ChevronDown } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import ReactPaginate from 'react-paginate'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import TotalLabel from '../../../../components/TotalLabel'
import { API_EMPLOYEE_CLASS_LIST, API_EMPLOYEE_LIST, API_FACILITY_GUARD_WORK_STATUS, ROUTE_FACILITYMGMT_GUARD } from '../../../../constants'
import { getTableDataCallback, makeSelectList, primaryColor } from '../../../../utility/Utils'
import { DEFAULT_ROW_CNT, MINIMUM_ROW_CNT, NFC_COMPLETE, NFC_OMISSION, NFC_REFUSE, NFC_REQUEST, customStyles, statusIcon, statusText, statusTitle, statusValue, workStatus, workStatusObj } from '../data'
import StatusModal from './StatusModal'

const WorkStatus = () => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const navigate = useNavigate()
	const [currentPage, setCurrentPage] = useState(0)
	const [employeeClassList, setEmployeeClassList] = useState([])
	const [employeeList, setEmployeeList] = useState([{label: '선택', value: ''}])
	const [dataList, setDataList] = useState([])
	const [updateResult, setUpdateResult] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [row, setRow] = useState()

	const [searchObj, setSearchObj] = useState({
		employeeClass: {label:'직종', value:''},
		status: {label:'전체', value:''},
		pickr: pickerDateChange([moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]),
		keword: ''
	})

	const { employeeClass, status, pickr, keword } = searchObj

	const handlePagination = page => {
		setCurrentPage(page.selected)
	}

	const handleRowClick = (row) => {
        // console.log(row)
        setRow(row)
		// if (row.user) setRow(row)
		// return false
	}

	function handleSearchObj (e, event) {
		setSearchObj({
			...searchObj,
			[event.name]: e
		})
	}

	function settingManagerList (data) {
		makeSelectList(true, '', data, employeeList, setEmployeeList, ['name'], 'id')
	}

	function getData() {
		const employeeClassListParam = {
			prop_id: cookies.get('property').value
		}
		const dataListParam = {
			property: cookies.get('property').value,
			employeeClass: employeeClass.value,
			status: status.value,
			pickr: pickr,
			keword: keword
		}
		const param = {
			propId :  cookies.get('property').value,
			employeeClass : '',
			employeeLevel : '',
			employeeStatue : '',
			search : ''
		}

		getTableData(API_EMPLOYEE_CLASS_LIST, employeeClassListParam, setEmployeeClassList)
		getTableData(API_FACILITY_GUARD_WORK_STATUS, dataListParam, setDataList)
		getTableDataCallback(API_EMPLOYEE_LIST, param, settingManagerList)
	}

	function updateStatus(id, status) {
		const MySwal = withReactContent(Swal)
		MySwal.fire({
			icon: statusIcon[status],
			title: `요청을 ${statusTitle[status]}하시겠습니까?`,
			text: statusText[status],
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonText: "취소",
			confirmButtonText: '확인',
			confirmButtonColor : primaryColor,
			reverseButtons :true,
			customClass: {
				actions: 'sweet-alert-custom right',
				cancelButton: 'me-1'
			}
		}).then(res => {
			if (res.isConfirmed) {
				const formData = new FormData()
				formData.append('status', statusValue[status])

				AXIOS['modify'](`${API_FACILITY_GUARD_WORK_STATUS}/${id}`, formData)
				.then(res => {
					if (res.status === 200) {
						sweetAlert('', '처리가 완료되었습니다.', 'success')
						setUpdateResult(true)
					} else {
						sweetAlert('', '요청처리에 실패하였습니다.', 'warning')
						setUpdateResult(true)
					}
				})
				.catch(() => {
					sweetAlert('', '요청처리에 실패하였습니다.', 'warning')
					setUpdateResult(true)
				})
			}
		})
	}

	function workingDatetime(status, tag, modify) {
		switch (status) {
			case NFC_REQUEST:
				return `${tag.split('T')[0].replaceAll('-', '.')} ${getKorAmPmHHMMSS(tag.split('T')[1])} > ${modify.split('T')[0].replaceAll('-', '.')} ${getKorAmPmHHMMSS(modify.split('T')[1])}`
			case NFC_COMPLETE:
				return `${modify.split('T')[0].replaceAll('-', '.')} ${getKorAmPmHHMMSS(modify.split('T')[1])}`
			case NFC_OMISSION:
				return ''
			default:
				return `${tag.split('T')[0].replaceAll('-', '.')} ${getKorAmPmHHMMSS(tag.split('T')[1])}`
		}
	}

	useEffect(() => {
        if (!isOpen) getData()
	}, [isOpen])

	useEffect(() => {
		if (updateResult) navigate(`${ROUTE_FACILITYMGMT_GUARD}/work-status`)
	}, [updateResult])

	useEffect(() => {
		if (row) setIsOpen(true)
	}, [row])

	const columns = [
		{
			name:'순찰예정일시',
			minWidth: '210px',
			// selector: row => <div onClick={() => handleRowClick(row)} style={{color:`${row.status === NFC_OMISSION && '#D95E5A'}`}}>{row.create_datetime.split('T')[0].replaceAll('-', '.')}</div>
			selector: row => <div onClick={() => handleRowClick(row)} style={{color:`${row.status === NFC_OMISSION && '#D95E5A'}`}}>{row.target_datetime}</div>
		},
		{
			name:'직종',
			maxWidth: '50px',
			selector: row => <div onClick={() => handleRowClick(row)} style={{color:`${row.status === NFC_OMISSION && '#D95E5A'}`}}>{row.status === NFC_OMISSION ? '' : (row.user !== null && row.user.employee_class) ? row.user.employee_class.code : ''}</div>
		},
		{
			name:'직원명',
			maxWidth: '70px',
			selector: row => <div onClick={() => handleRowClick(row)} style={{color:`${row.status === NFC_OMISSION && '#D95E5A'}`}}>{row.status === NFC_OMISSION ? '' : row.user !== null ? row.user !== null ? row.user.name : '' : ''}</div>
		},
		{
			name:'상태',
			maxWidth: '80px',
			selector: row => <div onClick={() => handleRowClick(row)} style={{color:`${row.status === NFC_OMISSION && '#D95E5A'}`}}>{row.status !== null ? row.status !== null ? workStatusObj[row.status] : '' : ''}</div>
		},
		{
			name:'순찰일시',
			width: '540px',
			selector: row => `${row.status !== null ? workingDatetime(row.status, row.tag_datetime, row.modify_datetime) : ''}`
		},
		{
			name:'장소',
			minWidth: '300px',
			selector: row => <div onClick={() => handleRowClick(row)} style={{color:`${row.status === NFC_OMISSION && '#D95E5A'}`}}>{row.nfc.location}</div>
		},
		{
			name:'비고',
			selector: row => <div onClick={() => handleRowClick(row)} style={{textDecoration:`${row.status === NFC_REFUSE ? 'line-through' : ''}`}}>{row.description}</div>
		},
		{
			name:'요청',
			width: '160px',
			selector: row => { 
				return (
					<Fragment key={row.id}>
						<Row>
							<Col xs={12}>
								<Button className={`${row.status === NFC_REQUEST ? 'nfc-color approval' : 'nfc-color'}`} disabled={row.status !== NFC_REQUEST} size='sm' onClick={() => updateStatus(row.id, 'approval')}>승인</Button>
								&nbsp;
								<Button className={`${row.status === NFC_REQUEST ? 'nfc-color refuse' : 'nfc-color'}`} disabled={row.status !== NFC_REQUEST} size='sm' onClick={() => updateStatus(row.id, 'refuse')}>거절</Button>
							</Col>
						</Row>
					</Fragment> 
				)
			}
		}
	]
	const CustomPagination = () => (
		<Fragment>
			<ReactPaginate
				nextLabel=''
				breakLabel='...'
				previousLabel=''
				pageRangeDisplayed={2}
				forcePage={currentPage}
				marginPagesDisplayed={1}
				activeClassName='active'
				pageClassName='page-item'
				breakClassName='page-item'
				nextLinkClassName='page-link'
				pageLinkClassName='page-link'
				breakLinkClassName='page-link'
				previousLinkClassName='page-link'
				nextClassName='page-item next-item'
				previousClassName='page-item prev-item'
				pageCount={Math.ceil(dataList.length / 15) || 1}
				onPageChange={page => handlePagination(page)}
				containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-center mt-1'
			/>
		</Fragment>
	)
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='경비업무현황' breadCrumbParent='시설관리' breadCrumbParent2='경비업무' breadCrumbActive='경비업무현황' />
				</div>
			</Row>
			<Card className='overflow-hidden'>
				<CardHeader>
					<CardTitle>경비업무현황</CardTitle>
				</CardHeader>
				<CardBody>
					<Row>
						<Col md={10} xs={12}>
							<Row>
								<Col className='mb-1'lg={2} xs={12}>
									<Row>
										<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>직종</Col>
										<Col xs={9}>
											<Select
												styles={(dataList.length - (DEFAULT_ROW_CNT * (currentPage))) < MINIMUM_ROW_CNT && {menuList: base => ({...base, height:'150px'})}}
												name='employeeClass'
												classNamePrefix={'select'}
												className="react-select"
												value={employeeClass}
												options={employeeClassList}
												onChange={handleSearchObj}/>
										</Col>
									</Row>
								</Col>
								<Col className='mb-1'lg={2} xs={12}>
									<Row>
										<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>상태</Col>
										<Col xs={9}>
											<Select
												styles={(dataList.length - (DEFAULT_ROW_CNT * (currentPage))) < MINIMUM_ROW_CNT && {menuList: base => ({...base, height:'150px'})}}
												name='status'
												classNamePrefix={'select'}
												className="react-select"
												value={status}
												options={workStatus}
												onChange={handleSearchObj}/>
										</Col>
									</Row>
								</Col>
								<Col className='mb-1'lg={4} xs={12}>
									<Row>
										<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>기간</Col>
										<Col xs={9}>
											<Flatpickr
												id='range-picker'
												name='pickr'
												className='form-control'
												value={pickr}
												onChange={date => {
													if (date.length === 2) {
														const tempPickerList = pickerDateChange(date)
														const event = {name:'pickr'}
														handleSearchObj(tempPickerList, event)
													}
												}}
												options={{
													mode: 'range',
													ariaDateFormat:'Y-m-d',
													locale: {
														rangeSeparator: ' ~ '
													},
													locale: Korean
												}}/>
										</Col>
									</Row>
								</Col>
								<Col className='mb-1'lg={4} xs={12}>
									<Row>
										<InputGroup>
											<Input
												name='keword'
												placeholder='직원명을 입력하세요'
												onChange={(e) => handleSearchObj(e.target.value, e.target)}
												onKeyDown={e => {
													if (e.key === 'Enter') getData()
												}}/>
											<Button style={{zIndex:0}} onClick={() => getData()}>검색</Button>
										</InputGroup>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
					<TotalLabel 
						num={3}
						data={dataList.length}
					/>
					<div className='react-dataTable'>
						<DataTable
							noHeader
							pagination
							data={dataList}
							columns={columns}
							className='react-dataTable'
							sortIcon={<ChevronDown size={10}/>}
							paginationPerPage={15}
							paginationComponent={CustomPagination}
							paginationDefaultPage={currentPage + 1}
							// paginationRowsPerPageOptions={[10, 25, 50, 100]}
							paginationRowsPerPageOptions={5}
							onRowClicked={handleRowClick}
							customStyles={customStyles}
							noDataComponent={<NoData/>}
							persistTableHead
						/>
					</div>
				</CardBody>
			</Card>
			<StatusModal
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				row={row}
				setRow={setRow}
				employeeList={employeeList}
				workStatus={workStatus}
				callback={workingDatetime}/>
		</Fragment>
	)
}

export default WorkStatus