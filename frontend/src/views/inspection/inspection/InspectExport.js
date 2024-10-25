import { useEffect } from "react"
import CustomDataTable from "./ExportTable"
import { getScheduleCycle } from "../../../utility/Utils"

const InspectExport = () => {
    const data = JSON.parse(localStorage.getItem('data'))
   
    const columns = [
		{
			name: '직종',
			sortable: true,
			sortField: 'class',
			cell: row => row.class
		},
		{
			name: '상태',
			sortable: true,
			sortField: 'state',
			cell: row => {
				const temp = row.state ? <>{'사용중'}</> : <>{'사용중지'}</>
				return temp
			}
		},
		{
			name: '점검 주기',
			cell: row => getScheduleCycle(row)
		},
		{
			name: '일지명',
			sortable: true,
			sortField: 'name',
			cell: row => row.name
		},
		{
			name: '계획/실적(특별)',
			sortable: false,
			sortField: 'count_result',
			cell: row => row.count_result,
			width:'18%'
		},
		{
			name: '완료율',
			sortable: true,
			sortField: 'per',
			cell: row => (`${row.per}%`)
		}
	]

    useEffect(() => {
        setTimeout(() => window.print(), 50)
    }, [])

    return (
        <div style={{margin: '1%'}}>
            <CustomDataTable
                tableData={data}
                columns={columns}
            />
        </div>
    )
}

export default InspectExport