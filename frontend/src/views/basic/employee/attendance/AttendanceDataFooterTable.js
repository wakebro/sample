import '@styles/react/libs/tables/react-dataTable-component-attendance.scss'
import { forwardRef, Fragment, useState } from "react"
import DataTable from 'react-data-table-component-footer'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { useNavigate } from 'react-router-dom'
import { Input } from 'reactstrap'
import { NoDataCause } from '../../../../components/Sentence'
import { customStyles } from '../../../system/basic/company/data'
import { dateFormat } from '../../../../utility/Utils'

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check'>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const AttendanceDataFooterTable = (props) => {
	const navigate = useNavigate()
	const {columns, tableData, setTableSelect, selectType, detailAPI, customFooter} = props
	const [currentPage, setCurrentPage] = useState(0)
	
	// console.log("detailAPI", detailAPI, setTabelData)
	const handleRowClick = (row) => {
		if (detailAPI !== undefined && row.create_datetime !== undefined) {
			// window.location.href = `${detailAPI}/${row.create_datetime}`
			navigate(detailAPI, {state: {type: 'modify', date: dateFormat(row.create_datetime)}})
		} 
	}
	// ** Function to handle Pagination

	const handlePagination = page => {
		setCurrentPage(page.selected)
	}
	/* eslint-disable */
	const sortPageReset = (rows, field) => {
		setCurrentPage(0)
	}
	/* eslint-disable */

	const handleSort = (rows, field, sortDirection) => {
		rows.sort(function (a, b) {
			if (field !== null) {
				if (isNaN(a[field] - b[field])) {
					return a[field].localeCompare(b[field])
				} else {
					return a[field] - b[field]
				}
			}
		})
		// desc
		if (sortDirection === 'desc') {
			rows = [...rows].reverse()
		}
		return rows
	}

	const handleSelectedRowChange = ({allSelected, selectedCount, selectedRows}) => {
		console.log(allSelected, selectedCount)
		console.log(selectedRows)
		setTableSelect(selectedRows)
	}

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
				pageCount={Math.ceil(tableData.length / 15) || 1}
				onPageChange={page => handlePagination(page)}
				containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-center mt-1'
			/>
		</Fragment>
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
				paginationPerPage={15}
				onSort={sortPageReset}
				sortFunction = {handleSort}
				paginationComponent={CustomPagination}
				paginationDefaultPage={currentPage + 1}
				// paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationRowsPerPageOptions={[15]}
				onRowClicked={handleRowClick}
				selectableRowsComponent={BootstrapCheckbox}
				onSelectedRowsChange={handleSelectedRowChange}
				customStyles={customStyles}
				footer = {customFooter} //데이터
				noDataComponent={<NoDataCause />}
				persistTableHead
			/>
	)
}

export default AttendanceDataFooterTable