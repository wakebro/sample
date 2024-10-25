import { useState, forwardRef } from "react"
import { Input} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component-footer'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/react-dataTable-component.scss'
const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check'>
	  <Input type='checkbox' ref={ref} {...props} />
	</div>
))

const CustomDataTable = (props) => {
	const {columns, tableData, setTableSelect, selectType, detailAPI} = props
	const [currentPage, setCurrentPage] = useState(0)


	const handleRowClick = (row) => {
		console.log(row)
		if (detailAPI !== undefined) {
			window.location.href = `${detailAPI}/${row.id}`
		} 
	}

	// ** Function to handle Pagination
	const handlePagination = page => {
		setCurrentPage(page.selected)
	}

	// const handleSort = (column, sortDirection, event) => {
	// 	// 정렬(asc)
	// 	console.log(column, sortDirection, event)
	// 	// sortedRows.sort(function (a, b) {
	// 	// 	return a[column.sortField] - b[column.sortField]
	// 	// })
	// 	// // desc
	// 	// if (sortDirection === 'desc') {
	// 	// 	sortedRows = [...sortedRows].reverse()
	// 	// }
	// 	// setTabelData(sortedRows)
	// 	console.log(setTabelData)
	// 	// setCurrentPage(0)
	// }
	// const handleSort = (column, sortDirection, sortedRows) => {
	// 	// 정렬(asc)
	// 	console.log(column, sortDirection, sortedRows)
	// 	sortedRows.sort(function (a, b) {
	// 		return a[column.sortField] - b[column.sortField]
	// 	})
	// 	// desc
	// 	if (sortDirection === 'desc') {
	// 		sortedRows = [...sortedRows].reverse()
	// 	}
		
	// 	setTabelData(sortedRows)
	// 	setCurrentPage(0)
	// }

	const handleSelectedRowChange = ({allSelected, selectedCount, selectedRows}) => {
		console.log(allSelected, selectedCount)
		console.log(selectedRows)
		setTableSelect(selectedRows)
	}
	const customFooter = {
		name :'total',
		phone: '010-5775-6981',
		email:'test1@naver.com',
		age: 10
		}
	  
	const customPagination = () => (
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
				// pagination
				selectableRows={selectType}
				data={tableData}
				footer={customFooter}
				columns={columns}
				className='react-dataTable'
				sortIcon={<ChevronDown size={10}/>}
				paginationPerPage={10}
				// onSort={handleSort}
				paginationComponent={customPagination}
				paginationDefaultPage={currentPage + 1}
				// paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationRowsPerPageOptions={5}
				onRowClicked={handleRowClick}
				selectableRowsComponent={BootstrapCheckbox}
				onSelectedRowsChange={handleSelectedRowChange}
			/>
	)
}

export default CustomDataTable