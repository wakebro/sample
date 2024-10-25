import { useState, forwardRef, Fragment, useEffect } from "react"
import { Input } from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/Custom_table.scss'
import { useNavigate } from 'react-router'
import { API_DOC_UPDATETIME } from "../../../constants"
import axios from '../../../utility/AxiosConfig'
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"

const CustomDataTable = (props) => {
	const {columns, tableData, detailAPI, setTabelData, setTableSelect, selectType, selectedTab, currentPage, setCurrentPage, total_Count} = props
	const [toggledClearRows, setToggleClearRows] = useState(false)
	const navigate = useNavigate()
	useAxiosIntercepter()

	const BootstrapCheckbox = forwardRef((props, ref) => (
		<div className='form-check'>
		  <Input
			type='checkbox'
			ref={ref}
			{...props}/>
		</div>))
	  
	const handleRowClick = (row) => {
		const {id} = row
		axios.post(API_DOC_UPDATETIME, { id })
		  .then(() => {
	
		  })
		  .catch(error => {
			console.error(error)
		  })

		if (detailAPI !== undefined) {
			navigate(`${detailAPI}/${row.id}`, {state: {state:selectedTab, mothod:row.method}})
		} 
	}
	const handlePagination = page => {
		setCurrentPage(page.selected)
	}
	const NoDataComponent = () => {
		return <div style={{padding:'20px', color:'#B9B9C3'}}>문서가 없습니다.</div>
	  }
	  
	const handleSort = () => {
		  setTabelData(sortedData)
		  setCurrentPage(0)
			  }
	const handleSelectedRowChange = ({ selectedRows }) => {
		setTableSelect(selectedRows)
		
	}
	const handleClearRows = () =>  {
		setToggleClearRows(!toggledClearRows)
		setTableSelect([])
	}
	useEffect(() => {
		handleClearRows()
		}, [selectedTab, currentPage])
	
	
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
			pageCount={Math.ceil(total_Count / 10) || 1}
			onPageChange={page => handlePagination(page)}
			containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-center mt-5'
		/>
	)
	return (
		<Fragment>
			<DataTable
				//persistTableHead
                noHeader = {true}
				pagination
				selectableRows={selectType}
				data={tableData}
				columns={columns}
				className='react-dataTable-custom p-0'
				sortIcon={<ChevronDown size={10}/>}
				paginationServer={true} // 서버 사이드 페이지네이션 활성화
				paginationTotalRows={total_Count} // 전체 데이터 개수 설정
				paginationPerPage={10}
				onSort={handleSort}
				paginationComponent={CustomPagination}
				paginationDefaultPage={currentPage + 1}
				// paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationRowsPerPageOptions={5}
				onRowClicked={handleRowClick}
				selectableRowsComponent={BootstrapCheckbox}
				onSelectedRowsChange={handleSelectedRowChange}
				clearSelectedRows={toggledClearRows}
				noDataComponent={<NoDataComponent />} 
				defaultSortAsc ={false}
			/>
		</Fragment>
	)
}
export default CustomDataTable