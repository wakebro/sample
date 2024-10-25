import { forwardRef } from "react"
import { Input} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import '@styles/react/libs/tables/Modal_table.scss'

const BootstrapCheckbox = forwardRef((props, ref) => {
	const { type, name, checked, disabled, onChange, onClick, tableData, tableSelect, setTableSelect } = props 
	const handleCheckBox = () => {
		const nameList = name.split('-')
		const tempList = [...tableSelect]
		// 전체 선택
		if (nameList[2] === 'rows') {
			const tempData = [...tableData.map(row => row.id)]
			if (!checked) {
				tempData.forEach(rowId => {
					if (!tempList.includes(rowId)) {
						tempList.push(rowId)
					}
				})
				setTableSelect(tempList)
				return
			}
			let deleteList = tempList
			tempData.forEach(rowId => {
				if (tempList.includes(rowId)) {
					deleteList = deleteList.filter(id => id !== rowId)
				}
			})
			setTableSelect(deleteList)
			return
		}
		
		// 각 항목 선택
		const rowId = Number(nameList[2])
		if (checked) {
			if (tempList.includes(rowId)) {
				setTableSelect(tempList.filter(id => id !== rowId))
			}
			return
		}
		if (!tempList.includes(rowId)) {
			tempList.push(rowId)
			setTableSelect(tempList)
		}
	}

	return (
		<div className='form-check px-0'>
			<Input 
				type={type} 
				style={{marginLeft: '10px' }} 
				ref={ref} 
				onClick={(e) => {
					onClick(e)
					handleCheckBox()
				}}
				name={name}
				aria-label={props['aria-label']}
				checked={checked}
				disabled={disabled}
				onChange={onChange}
			/>
		</div>
	)
})

const ModalAddTable = (props) => {
	const {columns, tableData, setTabelData, selectType, detailAPI, tableSelect, setTableSelect} = props

	const selectProps = { 
		tableData,
		tableSelect,
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

	const NoDataComponent = () => (
		<div style={{margin:'3%'}} className="no-data-message">데이터가 없습니다.</div>
	)
	
	const rowSelectCritera = row => tableSelect.includes(row.id)

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
				selectableRowsComponent={BootstrapCheckbox}
				selectableRowsComponentProps={selectProps}
				fixedHeader = {true}
				fixedHeaderScrollHeight = '200px'
				responsive
				selectableRowSelected={selectType && rowSelectCritera}
				customStyles={customStyles}
				noDataComponent={<NoDataComponent/>}
			/>
		</div>
	)
}
export default ModalAddTable