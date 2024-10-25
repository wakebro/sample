
import { useState, forwardRef } from "react"
import { Collapse, Input} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/react-dataTable-defect.scss'
import { NoDataCause } from "../../../../../components/Sentence"
import { primaryHeaderColor } from "../../../../../utility/Utils"

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check' style={{display: 'flex'}}>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const CompareTable = (props) => {
	const {columns, tableData, selectType} = props
	const [currentPage, setCurrentPage] = useState(0)

	// ** Function to handle Pagination
	const handlePagination = page => {
		setCurrentPage(page.selected)
	}

	const customStyles = {

		headCells: {
			style: {
				'&:first-child': {
					borderLeft: '0.5px solid #B9B9C3'
				},
                '&:nth-child(1)': {
					width: '700px !important'
				},
                '&:nth-child(3)': {
					borderRight: 'none'
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
					borderLeft: 'none'
				},
				'&:nth-child(9)': {
                    borderRight: 'none'
				},
                '&:nth-child(10)': {
					borderRight: 'none',
                    borderLeft: 'none'
				},
                '&:nth-child(11)': {
					borderLeft: 'none'
				},
                '&:nth-child(14)': {
                    borderRight: 'none'
				},
                '&:nth-child(15)': {
					borderRight: 'none',
                    borderLeft: 'none'
				},
                '&:nth-child(16)': {
                    borderLeft: 'none'
				},
                '&:nth-child(19)': {
                    borderRight: 'none'
				},
                '&:nth-child(20)': {
                    borderLeft: 'none'
				},
                '&:nth-child(21)': {
                    borderRight: 'none'
				},
                '&:nth-child(22)': {
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
				paginationComponent={CustomPagination}
				paginationDefaultPage={currentPage + 1}
				// paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationRowsPerPageOptions={5}
				selectableRowsComponent={BootstrapCheckbox}
				customStyles={customStyles}
				noDataComponent={<NoDataCause />}
				persistTableHead				
			/>
	)
}

export default CompareTable