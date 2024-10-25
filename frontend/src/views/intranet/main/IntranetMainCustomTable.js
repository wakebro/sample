// import { useState } from "react"
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { NoDataCause } from "../../../components/Sentence"
import { primaryHeaderColor } from '../../../utility/Utils'

export const IntranetMainCustomDataTable = (props) => {
	const {columns, tableData, setTabelData, setTableSelect, selectType, detailAPI, dataType} = props
    const navigate = useNavigate()

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
                    // borderLeft: '0.5px solid #B9B9C3'
                },
                height: '35px',
                // backgroundColor: '#FF9F4333',
                backgroundColor: primaryHeaderColor,
                border: '0.5px solid #B9B9C3',
                // borderBotton: '0.5px solid #B9B9C3',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '12px'
            }
        },
        cells: {
            style: {
                // 첫번째 cell에만 좌측 테두리 출력
                '&:first-child': {
                    // borderLeft: '0.5px solid #B9B9C3',
                    minWidth: 'auto'
                },
                // border: '0.5px solid #B9B9C3',
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
                minHeight: '35px'
            }
        }
    }
    
	const handleRowClick = (row) => {
		if (detailAPI !== undefined) {
			// window.location.href = `${detailAPI}/${row.id}`
            if (dataType === 'notification') {
                console.log('pass!!!!')
                navigate(detailAPI)
            } else {
                navigate(`${detailAPI}/${row.id}`, {state:'inbox'})
            }
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
		setCurrentPage(0)
	}

	const handleSelectedRowChange = ({allSelected, selectedCount, selectedRows}) => {
		console.log(allSelected, selectedCount)
		console.log(selectedRows)
		setTableSelect(selectedRows)
	}

	return (
        <DataTable
            noHeader
            selectableRows={selectType}
            data={tableData}
            columns={columns}
            className='react-dataTable'
            sortIcon={<ChevronDown size={15}/>}
            paginationPerPage={15}
            onSort={handleSort}
            onRowClicked={handleRowClick}
            onSelectedRowsChange={handleSelectedRowChange}
            customStyles={customStyles}
            noDataComponent={<NoDataCause />}
            persistTableHead
        />
	)
}

export default IntranetMainCustomDataTable