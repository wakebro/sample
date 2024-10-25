import '@styles/react/libs/tables/Send_table.scss'
import { forwardRef } from "react"
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import { Input } from 'reactstrap'
import { setsAreEqual } from '../../data'

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check'>
		<Input type='checkbox' style={{marginLeft: '10px' }} ref={ref} {...props} />
	</div>))

	
const SendDataTable = (props) => {
	const {columns, tableData, selectType, keySelectedList, searchValue, setKeySelectedList} = props

	const rowSelectCritera = row => keySelectedList[searchValue]['selectedRow'].has(row.id)

	const handleSelectedRowChange = ({selectedRows}) => {
		if (tableData.length === 0) return false
		const tempSelectedRows = new Set(selectedRows.map(row => row.id))
		const compare = setsAreEqual(keySelectedList[searchValue]['selectedRow'], tempSelectedRows)
		if (compare) return false
		else {
			setKeySelectedList({
				...keySelectedList,
				[searchValue]: {
					...keySelectedList[searchValue],
					selectedRow: tempSelectedRows
				}
			})
		}
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
				className='react-dataTable-send'
				sortIcon={<ChevronDown size={10}/>}
				selectableRowSelected={selectType && rowSelectCritera}
				selectableRowsComponent={BootstrapCheckbox}
				onSelectedRowsChange={handleSelectedRowChange}
				fixedHeader = {true}
				fixedHeaderScrollHeight = '170px'
				noDataComponent={<NoDataComponent/>}
			/>
		</div>
	)
}
export default SendDataTable