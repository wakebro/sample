import { forwardRef, useState } from "react"
import { Input} from 'reactstrap'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { NoDataCause } from "../../components/Sentence"
import '@styles/react/libs/tables/Education_table.scss'

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check' style={{justifyContent:'center', display:'flex', transform:'none'}}>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
    
))

const EducationDataTable = (props) => {
	const {columns, tableData, setTabelData, selectType, detailAPI, tempCheck, setTempCheck, rowSelect, setRowSelect} = props
	const [action] = useState({ fromUser: false }) //this is a way to have an instant-changing state

	const customStyles = {
		headRow: {
			style: {
				// backgroundColor: 'red',
				height: '20px'
			}
		},
		headCells: {
			style: {
				'&:first-child': {
					borderLeft: '0.5px solid #B9B9C3'
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
					borderLeft: '0.5px solid #B9B9C3',
					minWidth: 'auto'
				},
				border: '0.5px solid #B9B9C3',
				borderTop: 'none', // 상단 테두리 제거
				borderLeft: 'none', // 좌측 테두리 제거
				display: 'flex',
				justifyContent: 'center',
				fontSize: '12px'
			}
		},
		rows: {
			style: {
				cursor: 'pointer', // 마우스 포인터를 원하는 형태로 변경합니다.
				// maxHeight: '100px',
				minHeight: '35px'
			}
		}
	}

	const handleRowClick = (row) => {
		if (detailAPI !== undefined) {
			window.location.href = `${detailAPI}/${row.id}`
		} 
	}

	const handleMouseEnter = () => {
		action.fromUser = true //this was the way I found to prevent the component to clear the selection on every page render,
		//if the user is not with the mouse on a row, doesn't allow to change the selected rows
	}
	
	const handleMouseLeave = () => {
		action.fromUser = false //When the users moves the mouse out of a row, block the changes to the selected rows array (line 39)
	}

	const rowSelectCritera = row => rowSelect.includes(row.id)

	const handleSelectedRowChange = (allSelected, selectedCount, selectedRows) => {

		const copyUserData = [...tableData]
		const tempList = []
		// const tempUserList = []

		selectedRows.map(item => {
			tempList.push(item.id)
		})

		if (allSelected) {
			if (selectedCount === rowSelect.length) {
				action.fromUser = true
				return
			}
			copyUserData.map(data => { 
				if (tempList.includes(data.id)) {
					data.checked = true
					data.employee.map(employee => {
						employee.default = true
					})
				} else {
					if (data.checked) {
						data.employee.map(employee => {
							employee.default = false
						})
						data.checked = false
					}
				}
			})
			setRowSelect(tempList)
			setTabelData(copyUserData)
			action.fromUser = false
			return
		} 
	
		if (!action.fromUser) {
			action.fromUser = true
			return
		}
		if (!tempCheck) {
			console.log('no')
			setTempCheck(true)
			action.fromUser = false
			return
		}
		setRowSelect(tempList)
		copyUserData.forEach(data => {
			if (tempList.includes(data.id)) {
				data.checked = true
				data.employee.forEach(employee => {
					employee.default = true
					// tempUserList.push(employee.id)
				})
				// action.fromUser = false
			} else {
				if (data.checked) {
					data.employee.forEach(employee => {
						employee.default = false
					})
					data.checked = false
				}		
			}
			action.fromUser = false
		})

		setTabelData(copyUserData)
		action.fromUser = false
		// console.log('done!!!!!!!!!!!!!!')

	}

	return (
		<div style={{ overflowX: 'auto' }}>
			<DataTable
				persistTableHead
				selectableRows={selectType}
				selectableRowSelected={rowSelectCritera}
				data={tableData}
				columns={columns}
				className='react-dataTable-send'
				sortIcon={<ChevronDown size={10}/>}
				responsive={true} 
				// onSort={handleSort}
				onRowClicked={handleRowClick}
				onSelectedRowsChange={({ allSelected, selectedCount, selectedRows }) => {
					handleSelectedRowChange(allSelected, selectedCount, selectedRows)
				}}
				onRowMouseEnter={handleMouseEnter}
				onRowMouseLeave={handleMouseLeave}
				selectableRowsComponent={BootstrapCheckbox}
				responsiveTableOverflow={true}
				fixedHeader = {true}
                customStyles={customStyles}
                noDataComponent={<NoDataCause />}
			/>
			</div>
	)
}
export default EducationDataTable