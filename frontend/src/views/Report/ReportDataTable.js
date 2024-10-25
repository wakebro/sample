import { useState, forwardRef } from "react"
import { Collapse, Input} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { customStyles } from "../system/basic/company/data"
import { NoDataCause } from "../../components/Sentence"
import { useNavigate } from "react-router-dom"
import { ROUTE_REPORT_ACCIDENT_DETAIL, ROUTE_REPORT_FORM, ROUTE_REPORT_ACCIDENT_FORM } from "../../constants"

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check' style={{display: 'flex'}}>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const ReportDataTable = (props) => {
	const {columns, tableData, setTabelData, selectType, detailAPI, state} = props
	const [currentPage, setCurrentPage] = useState(0)
	const navigate = useNavigate()


	const handleRowClick = (row) => {
		if (detailAPI !== undefined) {
			if (row.is_final) {
				if (row.main_purpose === 'accident') {
					navigate(`${ROUTE_REPORT_ACCIDENT_DETAIL}/${row.id}`, {state: state})
				} else {
					navigate(`${detailAPI}/${row.id}`, {state: state})
				}
			} else {
				if (row.main_purpose === 'accident') {
					navigate(ROUTE_REPORT_ACCIDENT_FORM, {state: {reportType: row.main_purpose, type:'temporary', id: row.id}})
				} else {
					navigate(ROUTE_REPORT_FORM, {state: {reportType: row.main_purpose, type:'temporary', id: row.id}})
				}
			} 
		}
	}

	// ** Function to handle Pagination
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
		
		setTabelData(sortedRows)
		setCurrentPage(0)
	}

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
			pageCount={Math.ceil(tableData.length / 10) || 1}
			onPageChange={page => handlePagination(page)}
			containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-center mt-1'
		/>
	)

	return (
			<DataTable
				noHeader
				pagination
				selectableRows={selectType}
				data={tableData}
				columns={columns}
				className='react-dataTable'
				sortIcon={<ChevronDown size={10}/>}
				paginationPerPage={10}
				onSort={handleSort}
				paginationComponent={CustomPagination}
				paginationDefaultPage={currentPage + 1}
				// paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationRowsPerPageOptions={5}
				onRowClicked={handleRowClick}
				selectableRowsComponent={BootstrapCheckbox}
				customStyles={customStyles}
				noDataComponent={<NoDataCause />}
				persistTableHead
			/>
	)
}

export default ReportDataTable