import { useState, forwardRef } from "react"
import { Collapse, Input} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/react-dataTable-defect.scss'
import { NoDataCause } from "../../../components/Sentence"
import { useNavigate } from "react-router-dom"
import { primaryHeaderColor } from "../../../utility/Utils"

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check' style={{display: 'flex'}}>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const CustomDataTable = (props) => {
	const {columns, tableData, setTabelData, setTableSelect, selectType, detailAPI, state} = props
	const [currentPage, setCurrentPage] = useState(0)
	const navigate = useNavigate()


	const handleRowClick = (row) => {
		if (detailAPI !== undefined) {
			// window.location.href = `${detailAPI}/${row.id}`
			navigate(`${detailAPI}/${row.id}`, {state: state})
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

	const customStyles = {

		headCells: {
			style: {
				'&:first-child': {
					borderLeft: '0.5px solid #B9B9C3'
				},
				'&:nth-child(7)': {
					borderRight: 'none'
				},
				'&:nth-child(8)': {
					borderRight: 'none',
					borderLeft: 'none'

				},
				'&:nth-child(9)': {
					borderLeft: 'none'
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
				className='react-dataTable-defect'
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
				noDataComponent={<NoDataCause />}
				persistTableHead				
			/>
	)
}

export default CustomDataTable