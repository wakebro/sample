import { useState, forwardRef } from "react"
import { Input} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { NoDataCause } from "../../../components/Sentence"
import { customStyles } from "../../system/basic/company/data"

// const customStyles = {
// 	headCells: {
// 		style: {
// 			'&:first-child': {
// 				borderLeft: '0.5px solid #B9B9C3'
// 			},
// 			backgroundColor: '#FF9F4333',
// 			border: '0.5px solid #B9B9C3',
// 			display: 'flex',
// 			justifyContent: 'center'
// 		}
// 	},
// 	cells: {
// 		style: {
// 			// 첫번째 cell에만 좌측 테두리 출력
// 			'&:first-child': {
// 				borderLeft: '0.5px solid #B9B9C3',
// 				minWidth: 'auto'
// 			},
// 			border: '0.5px solid #B9B9C3',
// 			borderTop: 'none', // 상단 테두리 제거
// 			borderLeft: 'none', // 좌측 테두리 제거
// 			display: 'flex',
// 			justifyContent: 'center'
// 		}
// 	},
// 	rows: {
// 		style: {
// 			minHeight: '25px'
// 		}
// 	}
// }

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check'>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const CustomDataTable = (props) => {
	const {columns, tableData, setTabelData, setTableSelect, selectType, detailAPI} = props
	const [currentPage, setCurrentPage] = useState(0)


	const handleRowClick = (row) => {
		if (detailAPI !== undefined) {
			window.location.href = `${detailAPI}/${row.id}`
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

	const handleSelectedRowChange = ({allSelected, selectedCount, selectedRows}) => {
		console.log(allSelected, selectedCount)
		console.log(selectedRows)
		setTableSelect(selectedRows)
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
				onSelectedRowsChange={handleSelectedRowChange}
				customStyles={customStyles}
				persistTableHead
				noDataComponent={<NoDataCause />}
			/>
	)
}

export default CustomDataTable