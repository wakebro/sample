import { useEffect } from "react"
import ExportDataTable from '../../../Report/Export/ExportDataTable.js'
import { columns } from "./StockLog"

const StockLogExport = () => {
    const data = JSON.parse(localStorage.getItem('data'))

    useEffect(() => {
        setTimeout(() => window.print(), 200)
    }, [])

    return (
        <div style={{margin: '1%'}}>
            <ExportDataTable
                tableData={data}
                columns={columns}
            />
        </div>
    )
}

export default StockLogExport