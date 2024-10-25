import '@styles/react/libs/tables/react-dataTable-component.scss'
import check from '@src/assets/images/check.png'
import unCheck from '@src/assets/images/unCheck.png'
import {sweetAlert} from '@utils/'
import axios from '@utility/AxiosConfig'
import { forwardRef, useState } from "react"
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { useNavigate } from 'react-router'
import { Link } from "react-router-dom"
import { Col, Input, Row } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as yup from 'yup'
import { API_SYSTEMMGMT_AUTH_GROUP, API_SYSTEMMGMT_AUTH_MENU, ROUTE_SYSTEMMGMT_AUTH_GROUP, ROUTE_SYSTEMMGMT_AUTH_GROUP_DETAIL, ROUTE_SYSTEMMGMT_AUTH_MENU } from "../../../constants"
import { BASIC_INFO, BUSINESS_MGMT, DASHBOARD, EDUCATION_MGMT, ENERGY_MGMT, FACILITY_MGMT, INSPECTION, INTRANET, REPORT_MGMT, SCHEDULE, SYSTEM_AUTH_GROUP, SYSTEM_MGMT } from '../../../constants/CodeList'
import { checkOnlyView, primaryColor, primaryHeaderColor } from '../../../utility/Utils'
import { useSelector } from 'react-redux'

export const getCodeName = (data, depth) => {
	const code = data.code
	switch (depth) {
		case 'depth1':
			if (code.substr(2) === '0000') {
				return <div>{data.name}</div>
			} else {
				return false
			}
		case 'depth2':
			if (code.substr(2) !== '0000' && code.substr(4) === '00') {
				return <div>{data.name}</div>
			} else {
				return false
			}
		case 'depth3':
			if (code.substr(2) !== '0000' && code.substr(4) !== '00') {
				return <div>{data.name}</div>
			} else {
				return false
			}
		default:
			return false
	}
}

const checkObj = {
	true: check,
	false: unCheck
}

const WholeBtn = ({id, code, menuList}) => {
	const navigate = useNavigate()
	const loginAuth = useSelector((state) => state.loginAuth)
	const checkList = []
	menuList.map(menu => {
		if (menu.code === code) {
			checkList.push(menu.available_create)
			checkList.push(menu.available_read)
			checkList.push(menu.available_update)
			checkList.push(menu.available_delete)
		}
	})
	const result = checkList.every(list => list === true)

	function handleClick(id, code, result) {
		if (checkOnlyView(loginAuth, SYSTEM_AUTH_GROUP, 'available_update')) return
		const MySwal = withReactContent(Swal)
		MySwal.fire({
			icon: "warning",
			html: "수정 내용이 바로 저장됩니다. <br/>저장하시겠습니까?",
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
		}).then((res) => {
			if (res.isConfirmed) {
				const formData = new FormData()
				formData.append('id', id)
				formData.append('code', code)
				formData.append('now_result', result)
				axios.put(`${API_SYSTEMMGMT_AUTH_MENU}-whole`, formData)
				.then(res => {
					if (res.status === 200) {
						sweetAlert(`변경 완료`, `메뉴 권한 수정이 완료되었습니다.`, 'success', 'center')
						navigate(ROUTE_SYSTEMMGMT_AUTH_GROUP)
					} else {
						sweetAlert(`변경 실패`, `메뉴 권한 수정이 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning', 'center')
					}
				})
				.catch(() => {
					sweetAlert(`변경 실패`, `메뉴 권한 수정이 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning', 'center')
				})
			} else {
				MySwal.fire({
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

	return (
		<Row>
			<Col xs={12} style={{width:'100%'}}>
				<img style={{cursor:'pointer', width:'20px', height:'20px'}} src={checkObj[result]} onClick={() => handleClick(id, code, result)}/>
			</Col>
		</Row>
	)
}

export const authLabelObj = {
	group: '그룹명'
}

export const authColumn = {
	group: [
		{
			name: '그룹명',
			style: { cursor: 'pointer' },
			cell: row => <Link id={row.group_id} to={`${ROUTE_SYSTEMMGMT_AUTH_GROUP_DETAIL}/${row.group_id}`} state={{user: row.group_id, property: row.property}}>{row.group_name}</Link>
		},
		{
			name: 'Home',
			selector: row => <WholeBtn
								id={row.group_id}
								code={DASHBOARD}
								menuList={row.menu}/>
		},
		{
			name: '인트라넷',
			selector: row => <WholeBtn
								id={row.group_id}
								code={INTRANET}
								menuList={row.menu}/>
		},
		{
			name: '일정관리',
			selector: row => <WholeBtn
								id={row.group_id}
								code={SCHEDULE}
								menuList={row.menu}/>
		},
		{
			name: '기본정보',
			selector: row => <WholeBtn
								id={row.group_id}
								code={BASIC_INFO}
								menuList={row.menu}/>
		},
		{
			name: '시설관리',
			selector: row => <WholeBtn
								id={row.group_id}
								code={FACILITY_MGMT}
								menuList={row.menu}/>
		},
		{
			name: '중대재해관리',
			selector: row => <WholeBtn
								id={row.group_id}
								code={FACILITY_MGMT}
								menuList={row.menu}/>
		},
		{
			name: '점검관리',
			selector: row => <WholeBtn
								id={row.group_id}
								code={INSPECTION}
								menuList={row.menu}/>
		},
		{
			name: '보고서관리',
			selector: row => <WholeBtn
								id={row.group_id}
								code={REPORT_MGMT}
								menuList={row.menu}/>
		},
		{
			name: '교육관리',
			selector: row => <WholeBtn
								id={row.group_id}
								code={EDUCATION_MGMT}
								menuList={row.menu}/>
		},
		{
			name: '에너지관리',
			selector: row => <WholeBtn
								id={row.group_id}
								code={ENERGY_MGMT}
								menuList={row.menu}/>
		},
		{
			name: '사업관리',
			selector: row => <WholeBtn
								id={row.group_id}
								code={BUSINESS_MGMT}
								menuList={row.menu}/>
		},
		{
			name: '시스템관리',
			selector: row => <WholeBtn
								id={row.group_id}
								code={SYSTEM_MGMT}
								menuList={row.menu}/>
		},
		{
			name: '세부항목 권한변경',
			width: '140px',
			selector: row => <Link id={row.group_id} to={`${ROUTE_SYSTEMMGMT_AUTH_MENU}/${row.group_id}`}>[변경]</Link>
		}
	]
}

export const employeeStatusList = [
	{label: '전체', value:''},
	{label: '신청', value:'신청'},
	{label: '재직', value:'재직'},
	{label: '퇴직', value:'퇴직'}
]

export const authMenuTabList = [
	{label : 'Home', value : 'dashboard'},
	{label : '인트라넷', value : 'intranet'},
	{label : '일정관리', value : 'schedule'},
	{label : '기본정보', value : 'private'},
	{label : '시설관리', value : 'facility'},
	{label : '중대재해관리', value : 'law'},
	{label : '점검관리', value : 'inspect'},
	{label : '보고서관리', value : 'report'},
	{label : '교육관리', value : 'education'},
	{label : '에너지관리', value : 'energy'},
	{label : '사업관리', value : 'business'},
	{label : '시스템관리', value : 'system'}
]

export const authDefaultValues = {
	group:{
		name: ''
	}
}
export const authAPIObj = {
	group: API_SYSTEMMGMT_AUTH_GROUP
}

export const authValidationSchemaObj = {
	group: yup.object().shape({
		name: yup.string().required('그룹명을 입력해주세요.').max(200, '200자 이내로 작성해주세요.')
	})
}

export const pageTypeKor = {
	register : ' 등록',
	detail : ' 상세',
	modify : ' 수정'
}

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check' style={{justifyContent:'center'}}>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))


export const CustomDataTable = (props) => {
	const {columns, tableData, setTabelData = null, tableSelect, setTableSelect, selectType, detailAPI, state, rowCnt = 15} = props
	const [currentPage, setCurrentPage] = useState(0)
	const navigate = useNavigate()

	const handleRowClick = (row) => {
		if (detailAPI !== undefined) {
			navigate(`${detailAPI}/${row.id}`, {state:{pageType:'detail', key: state.key}})
		} 
	}

	const handlePagination = page => {
		setCurrentPage(page.selected)
	}

	const handleSort = (column, sortDirection, sortedRows) => {
		// 정렬(asc)
		sortedRows.sort(function (a, b) {
			return a[column.sortField] - b[column.sortField]
		})
		// desc
		if (sortDirection === 'desc') {
			sortedRows = [...sortedRows].reverse()
		}
		
		if (setTabelData !== null) {
			setTabelData(sortedRows)
		}
		setCurrentPage(0)
	}

	const rowSelectCritera = row => tableSelect.includes(row.id)

	const handleSelectedRowChange = ({selectedRows}) => {
		const tempList = []

		if (selectedRows.length < tableSelect.length) {
			selectedRows.map((row) => {
				if (tableSelect.includes(row.id)) {
					tempList.push(row.id)
				}
			})
			setTableSelect(tempList)
		} else if (selectedRows.length > tableSelect.length) {
			selectedRows.map((row) => {
				tempList.push(row.id)
			})
			setTableSelect(tempList)
		}
	}

	const NoDataComponent = () => (
		<div style={{margin:'3%'}} className="no-data-message">데이터가 없습니다.</div>
	)

	const CustomPagination = () => (
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
			pageCount={Math.ceil(tableData.length / rowCnt) || 1}
			onPageChange={page => handlePagination(page)}
			containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-center mt-1'
		/>
	)

	const customStyles = {
		headCells: {
			style: {
				'&:first-child': {
					borderLeft: '0.5px solid #B9B9C3'
				},
				backgroundColor: primaryHeaderColor,
				border: '0.5px solid #B9B9C3',
				display: 'flex',
				justifyContent: 'center',
				fontSize: '12px'
			}
		},
		cells: {
			style: {
				// 첫번째 cell에만 좌측 테두리 출력
				'&:first-child': {
					borderLeft: '0.5px solid #B9B9C3',
					minWidth: 'auto'
				},
				border: '0.5px solid #B9B9C3',
				borderTop: 'none', // 상단 테두리 제거
				borderLeft: 'none', // 좌측 테두리 제거
				display: 'flex',
				justifyContent: 'center',
				fontSize: '12px'
			}
		},
		rows: {
			style: {
				// cursor: 'pointer', // 마우스 포인터를 원하는 형태로 변경합니다.
				minHeight: '35px'
			}
		}
	}

	return (
			<DataTable
				noHeader
				pagination
				selectableRows={selectType}
				data={tableData}
				columns={columns}
				className='react-dataTable'
				sortIcon={<ChevronDown size={10}/>}
				paginationPerPage={rowCnt}
				onSort={handleSort}
				paginationComponent={CustomPagination}
				paginationDefaultPage={currentPage + 1}
				// paginationRowsPerPageOptions={[10, 25, 50, 100]}
				paginationRowsPerPageOptions={5}
				onRowClicked={handleRowClick}
				selectableRowsComponent={BootstrapCheckbox}
				selectableRowSelected={selectType && rowSelectCritera}
				onSelectedRowsChange={handleSelectedRowChange}
				customStyles={customStyles}
				noDataComponent={<NoDataComponent/>}
				persistTableHead
			/>
	)
}