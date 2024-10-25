import { useEffect } from "react"
import { dateFormat } from "../../../utility/Utils"
import CustomDataTable from "./ExportTable"
import * as moment from 'moment'

const InspectionListExport = () => {
    const data = JSON.parse(localStorage.getItem('data'))
	const now = moment().subtract(0, 'days')
    const columns = [
		{
			name: '점검일',
			sortable: false,
			sortField: 'date',
			cell: row => dateFormat(row.date),
			width:'13%'
		},
		{
			name: '직종',
			sortable: false,
			sortField: 'class',
			cell: row => row.class,
			width:'10%'
		},
		{
			name: '점검일지명',
			sortable: false,
			sortField: 'name',
			cell: row => row.name
		},
		{
			name: '양식번호',
			sortable: false,
			sortField: 'templateId',
			cell: row => row.templateId,
			width:'11%'
		},
		{
			name: '일자번호',
			sortable: false,
			sortField: 'id',
			cell: row => row.id
		},
		{
			name: '담당자',
			sortable: false,
			sortField: 'user',
			cell: row => row.user,
			width:'10%'
		},
		{
			name: '최종 결재자',
			sortable: false,
			sortField: 'approver',
			cell: row => row.approver,
			width:'13%'
		},
		{
			name: '완료여부',
			sortable: false,
			sortField: 'status',
			cell: row => row.status,
			conditionalCellStyles: [
                {
                    when: row => moment(now).isAfter(row?.date) && row?.status === '미완료',
                    style: {
                        color: 'red'
                    }
                },
				{
                    when: row => row?.status === '완료',
                    style: {
                        color: 'green'
                    }
                }
            ],
			width:'13%'
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

export default InspectionListExport