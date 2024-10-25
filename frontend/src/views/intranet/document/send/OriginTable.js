import '@styles/react/libs/tables/Send_table.scss'
import { forwardRef } from "react"
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import { Input } from 'reactstrap'

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check'>
		<Input type='checkbox' style={{marginLeft: '10px' }} ref={ref} {...props} />
	</div>))

	
const OriginTable = (props) => {
	const {columns, tableData, selectType, keySelectedList, searchValue, setKeySelectedList } = props

	const handleSelectedRowChange = ({selectedRows}) => {
		const tempList = new Set()
		selectedRows.map((row) => tempList.add(row.id))
		setKeySelectedList({
			...keySelectedList,
			[searchValue]: {
				...keySelectedList[searchValue],
				selectedRow: tempList
			}
		})
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
				selectableRowsComponent={BootstrapCheckbox}
				onSelectedRowsChange={handleSelectedRowChange}
				fixedHeader = {true}
				fixedHeaderScrollHeight = '170px'
				responsive
				noDataComponent={<NoDataComponent/>}
			/>
			</div>
	)
}
export default OriginTable