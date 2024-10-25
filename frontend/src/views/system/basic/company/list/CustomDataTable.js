import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment, forwardRef, useState } from "react"
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { useNavigate } from 'react-router'
import { Col, Input, Row } from 'reactstrap'
import { customStyles } from "../data"
import { NoDataCause } from "../../../../../components/Sentence"

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check' style={{justifyContent:'center'}}>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const CustomDataTable = (props) => {
	const {columns, tableData, setTabelData = null, tableSelect, setTableSelect, selectType, detailAPI, state, rowCnt = 15, styles = customStyles, footer = undefined} = props
	const [currentPage, setCurrentPage] = useState(0)
	const navigate = useNavigate()

	const handleRowClick = (row) => {
		if (detailAPI !== undefined) {
			const stateObj = {pageType:'detail'}
			if (state !== undefined && Object.keys(state).includes('key')) stateObj['key'] = state.key
			navigate(`${detailAPI}/${row.id}`, {state:stateObj})
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
		<Fragment>
			{footer !== undefined && footer}
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
				customStyles={styles}
				noDataComponent={<NoDataCause />}
				persistTableHead
			/>
	)
}

export default CustomDataTable