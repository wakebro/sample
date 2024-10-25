import {  forwardRef } from "react"
import { Collapse, Input, Col} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
// import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { customStyles } from "../data"
import { useNavigate } from "react-router-dom"

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check' style={{display: 'flex'}}>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const CustomDataTable = (props) => {
	const {columns, tableData, setTabelData, setTableSelect, selectType, detailAPI, state} = props
	const navigate = useNavigate()

	const handleRowClick = (row) => {
		if (detailAPI !== undefined) {
			navigate(`${detailAPI}/${row.id}`, {state: state})
		} 
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
	}

	const handleSelectedRowChange = ({allSelected, selectedCount, selectedRows}) => {
		console.log(allSelected, selectedCount)
		console.log(selectedRows)
		setTableSelect(selectedRows)
	}

	const DailyListNodata = () => {
		return (
			<Col lg='12' md='12' xs='12' className='card_table col text start ps-4' style={{justifyContent: 'start', borderBottom: '1px solid #adb5bd', borderLeft: '1px solid #adb5bd', borderRight: '1px solid #adb5bd' }}>등록된 결과가 없습니다.</Col>	
		)
	}

	return (
			<DataTable
				noHeader
				// pagination
				selectableRows={selectType}
				data={tableData}
				columns={columns}
				//className='react-dataTable p-0'
				sortIcon={<ChevronDown size={10}/>}
				onSort={handleSort}
				onRowClicked={handleRowClick}
				selectableRowsComponent={BootstrapCheckbox}
				onSelectedRowsChange={handleSelectedRowChange}
				customStyles={customStyles}
				noDataComponent={<DailyListNodata />}
				persistTableHead
			/>
	)
}

export default CustomDataTable