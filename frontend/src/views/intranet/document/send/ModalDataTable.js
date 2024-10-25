import { forwardRef } from "react"
import { Input} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import '@styles/react/libs/tables/Modal_table.scss'

const BootstrapCheckbox = forwardRef((props, ref) => {
	const { type, name, checked, disabled, onChange} = props 

	return (
		<div className='form-check'>
			<Input 
				type={type} 
				style={{marginLeft: '10px' }} 
				ref={ref} 
				{...props}
				name={name}
				aria-label={props['aria-label']}
				checked={checked}
				disabled={disabled}
				onChange={onChange}
			/>
		</div>
	)
})

const ModalDataTable = (props) => {
	const {columns, tableData, setTabelData, selectType, detailAPI, setTableSelect} = props

	const selectProps = { 
		tableData,
		// tableSelect,
		setTableSelect: () => function(list) { setTableSelect(list) } 
	}

	const customStyles = {
		headRow: {
			style: {
				height: '20px'
			}
		},
		headCells: {
			style: {
				display: 'flex',
				justifyContent: 'center',
				fontSize: '12px'
			}
		},
		cells: {
			style: {
				borderTop: 'none', // 상단 테두리 제거
				borderLeft: 'none', // 좌측 테두리 제거
				display: 'flex',
				justifyContent: 'center',
				fontSize: '12px',
				minWidth: 'auto'
			}
		},
		rows: {
			style: {
				cursor: 'pointer', // 마우스 포인터를 원하는 형태로 변경합니다.
				minHeight: '35px'
			}
		}
	}

	const handleRowClick = (row) => {
		if (detailAPI !== undefined) {
			window.location.href = `${detailAPI}/${row.id}`
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
	const handleSelectedRowChange = ({selectedRows}) => {
		const tempList = []
		selectedRows.map((row) => {
				tempList.push(row.id)
			})
		setTableSelect(tempList)
	}
	const NoDataComponent = () => (
		<div style={{margin:'3%'}} className="no-data-message">데이터가 없습니다.</div>
	)
	
	return (
		<div style={{ maxHeight:'200px', overflowX: 'auto' }}>
			<DataTable
				persistTableHead
				selectableRows={selectType}
				data={tableData}
				columns={columns}
				className='react-dataTable-modal'
				sortIcon={<ChevronDown size={10}/>}
				onSort={handleSort}
				onRowClicked={handleRowClick}
				onSelectedRowsChange={handleSelectedRowChange}
				selectableRowsComponent={BootstrapCheckbox}
				selectableRowsComponentProps={selectProps}
				fixedHeader = {true}
				fixedHeaderScrollHeight = '200px'
				responsive
				customStyles={customStyles}
				selectableRowsNoSelectAll={true}
				noDataComponent={<NoDataComponent/>}
			/>
		</div>
	)
}
export default ModalDataTable