import { useState, forwardRef } from "react"
import { Input} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { customStyles, conditionalRowStyles } from "../data"
import { useNavigate } from "react-router-dom"

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check'>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const CustomDataTable = (props) => {
	const {columns, tableData, setTabelData, detailAPI, pagination, sortType, type, picker} = props
	const [currentPage, setCurrentPage] = useState(0)
	const navigate = useNavigate()

	const handleRowClick = (row) => {
		if (detailAPI !== undefined) {
			navigate(`${detailAPI}/${row.id}`, {state:{type: type, scheduleId: row.schedule, initPicker: picker ? picker : undefined}})
		}
	}

	// ** Function to handle Pagination
	const handlePagination = page => {
		setCurrentPage(page.selected)
	}

	const handleSort = (column, sortDirection, sortedRows) => {
		// 정렬(asc)
		if (sortType) {
			let tempValueList = [...sortedRows.slice(0, sortedRows.length - 4)]
			tempValueList.sort(function (a, b) {
				return a[column.sortField] - b[column.sortField]
			})
			// desc
			if (sortDirection === 'desc') {
				
				tempValueList = [...tempValueList].reverse()
			}
			sortedRows = [...tempValueList, ...sortedRows.splice(-4)]
		} else {
			sortedRows.sort(function (a, b) {
				return a[column.sortField] - b[column.sortField]
			})
			// desc
			if (sortDirection === 'desc') {
				sortedRows = [...sortedRows].reverse()
			}
		}
		setTabelData(sortedRows)
		setCurrentPage(0)
	}
	const handleSelectedRowChange = ({allSelected, selectedCount, selectedRows}) => {
		console.log(allSelected, selectedCount)
		setTableSelect(selectedRows)
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
			pageCount={Math.ceil(tableData.length / 10) || 1}
			onPageChange={page => handlePagination(page)}
			containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-center mt-1'
		/>
	)

	return (
			<DataTable
				noHeader
				pagination = {pagination}
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
				onSelectedRowsChange={handleSelectedRowChange}
				noDataComponent={<NoDataComponent/>}
				persistTableHead
				conditionalRowStyles={conditionalRowStyles}
				customStyles={customStyles}
			/>
	)
}

export default CustomDataTable