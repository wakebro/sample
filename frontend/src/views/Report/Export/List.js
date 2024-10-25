import { Fragment, useEffect } from "react"
import { Badge, Button } from "reactstrap"
import ExportDataTable from "./ExportDataTable"
import * as moment from 'moment'
import { reportTypeList } from "../ReportData"

const ExportList = () => {
    const data = JSON.parse(localStorage.getItem('data'))
    const columns = [
        {
            name:'작성일자',
            with:'10%',
            cell: row => <Fragment key={row.id}>{moment(row.create_datetime).format('YYYY/MM/DD')}</Fragment>
        },
        {
            name:'종류',
            with:'5%',
            cell: row => <Fragment key={row.id}>{reportTypeList[row.main_purpose]}</Fragment>
        },
        {
            name:'현장명',
            with:'30%',
            cell: row => <Fragment>{row.accident_title}</Fragment>
        },
        {
            name:'보고서명',
            width:'35%',
            cell: row =>  { 
                if (row.is_completabled === false) {
                    return (
                        <Fragment key={row.id}>
                            <Badge color='light-success' style={{paddingTop:'6px', marginRight:'1%'}}> 임시저장 </Badge>
                            <span style={{ width:'100%', textAlign: 'left' }} >{row.title}</span>
                        </Fragment>
                    )
                } else {
                    return (
                        <Fragment key={row.id}>
                            <span style={{ width:'100%', textAlign: 'left' }} >{row.title}</span>
                        </Fragment>) 
                }
            }
        },
        {
            name:'작성자',
            with:'10%',
            cell: row => <Fragment key={row.id}>{row.user}</Fragment>
        },
        {
            name:'결재',
            with:'10%',
            cell: row => { 
                let count = 0
                row.line.map((user) => {
                    if (user.type === 1 || user.type === 2) {
                        count++
                    }
                })
                if (count === 4) {
                    return (
                        <Button key={row.id} color='report'>완료</Button>
                    )
                } else {
                    return (
                        <Button key={row.id} color='danger'>미완료</Button>
                    )
                }
            }
        }
    ]

    useEffect(() => {
        setTimeout(() => window.print(), 100)
    }, [])

    return (
        <ExportDataTable
            tableData={data}
            columns={columns}
        />
    )
}

export default ExportList