import '@styles/react/libs/tables/react-dataTable-component.scss'
import { forwardRef, Fragment, useState } from "react"
import DataTable from 'react-data-table-component-footer'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { Input } from 'reactstrap'

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check'>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const CustomDataFooterTable = (props) => {
	const {columns, tableData, setTableSelect, selectType, detailAPI, customFooter, sortAble = true} = props
	const [currentPage, setCurrentPage] = useState(0)
	
	// console.log("detailAPI", detailAPI, setTabelData)
	const handleRowClick = (row) => {
		if (detailAPI !== undefined && row.id !== undefined) {
			window.location.href = `${detailAPI}/${row.id}`
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

	const NoDataComponent = () => (
		<div style={{margin:'3%'}} className="no-data-message">데이터가 없습니다.</div>
	)

	const customStyles = {
		headCells: {
			style: {
				'&:first-child': {
					borderLeft: '0.5px solid #B9B9C3'
				},
				'&:nth-child(2)': {
					borderRight: 'none'
				},
				'&:nth-child(3)': {
					borderRight: 'none',
					borderLeft: 'none'
				},
				'&:nth-child(4)': {
					borderRight: 'none',
					borderLeft: 'none'
				},
				'&:nth-child(5)': {
					borderRight: 'none',
					borderLeft: 'none'

				},
				'&:nth-child(6)': {
					borderRight: 'none',
					borderLeft: 'none'

				},
				'&:nth-child(7)': {
					borderRight: 'none',
					borderLeft: 'none'

				},
				'&:nth-child(8)': {
					borderRight: 'none',
					borderLeft: 'none'

				},
				'&:nth-child(9)': {
					borderRight: 'none',
					borderLeft: 'none'

				},
				'&:nth-child(10)': {
					borderRight: 'none',
					borderLeft: 'none'

				},
				'&:nth-child(11)': {
					borderLeft: 'none'
				},
				backgroundColor: '#FF9F4333',
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
					borderLeft: '0.5px solid #B9B9C3'
					// minWidth: 'auto'
				},
				border: '0.5px solid #B9B9C3',
				borderTop: 'none', // 상단 테두리 제거
				borderLeft: 'none', // 좌측 테두리 제거
				display: 'flex',
				justifyContent: 'center',
				fontSize: '16px',
				fontFamily: 'Pretendard-Regular'
			}
		},
		rows: {
			style: {
				cursor: 'pointer', // 마우스 포인터를 원하는 형태로 변경합니다.
				minHeight: '35px'
			}
		}
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