import '@styles/react/libs/tables/react-dataTable-component.scss'
import { forwardRef, Fragment, useState } from "react"
import DataTable from 'react-data-table-component-footer'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { Col, Input } from 'reactstrap'
import { customStyles } from "@views/system/basic/company/data"
import { useNavigate } from 'react-router'

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check'>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const CustomDataFooterTable = (props) => {
	const {columns, tableData, setTableSelect, selectType, detailAPI, customFooter, sortAble = true} = props
	const [currentPage, setCurrentPage] = useState(0)
	const navigate = useNavigate()
	
	const handleRowClick = (row) => {
		if (detailAPI !== undefined && row.id !== undefined) {
			navigate(`${detailAPI}/${row.id}`)
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

	const handleSelectedRowChange = ({selectedRows}) => {
		setTableSelect(selectedRows)
	}

	const NoDataComponent = () => (
		<Col lg='12' md='12' xs='12' className='card_table col text start' style={{justifyContent: 'center', borderBottom: '1px solid #adb5bd', borderLeft: '1px solid #adb5bd', borderRight: '1px solid #adb5bd', marginBottom: '2%'}}>등록된 결과가 없습니다.</Col>	
	)

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
				pageCount={Math.ceil(tableData.length / 10) || 1}
				onPageChange={page => handlePagination(page)}
				containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-center mt-1'
			/>
		</Fragment>
	)
	return (
		<Fragment>
			{
				sortAble ?
					<DataTable
						noHeader
						pagination
						selectableRows={selectType}
						data={tableData}
						columns={columns}
						className='react-dataTable'
						sortIcon={<ChevronDown size={10}/>}
						paginationPerPage={10}
						onSort={sortPageReset}
						sortFunction = {handleSort}
						paginationComponent={CustomPagination}
						paginationDefaultPage={currentPage + 1}
						// paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        paginationRowsPerPageOptions={5}
						onRowClicked={handleRowClick}
						selectableRowsComponent={BootstrapCheckbox}
						onSelectedRowsChange={handleSelectedRowChange}
						customStyles={customStyles}
						footer = {customFooter} //데이터
						persistTableHead
						noDataComponent={<NoDataComponent/>}
					/>
				:
					<DataTable
						noHeader
						pagination
						selectableRows={selectType}
						data={tableData}
						columns={columns}
						className='react-dataTable'
						sortIcon={<ChevronDown size={10}/>}
						paginationPerPage={10}
						onSort={sortPageReset}
						paginationComponent={CustomPagination}
						paginationDefaultPage={currentPage + 1}
						// paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        paginationRowsPerPageOptions={5}
						onRowClicked={handleRowClick}
						selectableRowsComponent={BootstrapCheckbox}
						onSelectedRowsChange={handleSelectedRowChange}
						customStyles={customStyles}
						footer = {customFooter} //데이터
						persistTableHead
						noDataComponent={<NoDataComponent/>}
					/>
			}
		</Fragment>
	)
}

export default CustomDataFooterTable