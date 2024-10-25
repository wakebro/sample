import { useState } from "react"
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { customStyles } from "../../../../system/basic/company/data"
import { NoDataCause } from "../../../../../components/Sentence"
import { useNavigate } from "react-router-dom"

export const TenantCustomDataTable = (props) => {
	const {columns, tableData, setTabelData, setTableSelect, selectType, setRowId, setIsOpen, detailAPI} = props
	const [currentPage, setCurrentPage] = useState(0)
	const navigate = useNavigate()

	const handleRowClick = (row) => {
		if (setRowId === undefined && detailAPI === undefined) return
		if (detailAPI !== undefined) {
			if (row?.is_notice) {
				navigate(`${detailAPI}/${row.row_id}`)
			} else {
				navigate(`${detailAPI}/${row.id}`)
			}
		} else {
			setRowId(row.id)
			setIsOpen(true)
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

	const CustomPagination = () => {

		return (
			<>
			{/* <>넣어지나</> */}
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
			</>

		)
	}

	return (
        <DataTable
            noHeader
            pagination
            selectableRows={selectType}
            data={tableData}
            columns={columns}
            className='react-dataTable'
            sortIcon={<ChevronDown size={15}/>}
            paginationPerPage={15}
            onSort={handleSort}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            // paginationRowsPerPageOptions={[10, 25, 50, 100]}
            paginationRowsPerPageOptions={5}
            onRowClicked={handleRowClick}
            // selectableRowsComponent={BootstrapCheckbox}
            onSelectedRowsChange={handleSelectedRowChange}
            customStyles={customStyles}
            noDataComponent={<NoDataCause />}
            persistTableHead
        />
	)
}

export default TenantCustomDataTable