import { useState, forwardRef, Fragment } from "react"
import { Input} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import { NoDataCause } from "../../../../components/Sentence"
import '@styles/react/libs/tables/tool_log_table.scss'
// import { customStyles } from "../../../../views/system/basic/company/data"
import ModalDetail from './ModalDetail'
import { primaryHeaderColor } from "../../../../utility/Utils"

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check'>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const CustomDataTable = (props) => {
	const {columns, tableData, setTableSelect, selectType} = props
	const [currentPage, setCurrentPage] = useState(0)
	const [isOpen, setIsOpen] = useState(false)
	const [row_id, SetRow] = useState()

	const handleRowClick = (row) => {
		setIsOpen(true)
		SetRow(row.id)
	}

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
				backgroundColor: primaryHeaderColor,
				borderRight: '0.2px solid #B9B9C3',
				borderTop: '0.2px solid #B9B9C3',
				borderBottom: '0.2px solid #B9B9C3',

				display: 'flex',
				justifyContent: 'center'
			}
		},
		cells: {
			style: {
				// 첫번째 cell에만 좌측 테두리 출력
				'&:first-child': {
					borderLeft: '0.5px solid #B9B9C3'
			
				},
				border: '0.5px solid #B9B9C3',
				borderTop: 'none', // 상단 테두리 제거
				borderLeft: 'none'
			}
		},
		rows: {
			style: {
			  cursor: 'pointer' // 마우스 포인터를 원하는 형태로 변경합니다.
			}
		}		
	}

	const handleSelectedRowChange = ({allSelected, selectedCount, selectedRows}) => {
		console.log(allSelected, selectedCount)
		console.log(selectedRows)
		setTableSelect(selectedRows)
	}
	const NoDataComponent = () => {
		return <div style={{padding:'20px', color:'#B9B9C3'}}>데이터가 없습니다.</div>
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
			pageCount={Math.ceil(tableData.length / 3) || 1}
			onPageChange={page => handlePagination(page)}
			containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-center mt-1'
		/>
	)

	return (
		<Fragment>

			<DataTable
				// noHeader
				// pagination
				selectableRows={selectType}
				data={tableData}
				columns={columns}
				className='react-dataTable-toollog'
				sortIcon={<ChevronDown size={10}/>}
				// paginationPerPage={3}
				// onSort={handleSort}
				// paginationComponent={CustomPagination}
				// paginationDefaultPage={currentPage + 1}
				// paginationRowsPerPageOptions={[10, 25, 50, 100]}
				onRowClicked={handleRowClick}
				selectableRowsComponent={BootstrapCheckbox}
				onSelectedRowsChange={handleSelectedRowChange}
				noDataComponent={<NoDataCause />} 
				persistTableHead
				fixedHeader={true}
				fixedHeaderScrollHeight = '200px'
				customStyles={customStyles}
			/>
			<ModalDetail
			formModal= {isOpen}
			setFormModal= {setIsOpen}
			record_id ={row_id}
			>
			</ModalDetail>
		</Fragment>
		
	)
}

export default CustomDataTable