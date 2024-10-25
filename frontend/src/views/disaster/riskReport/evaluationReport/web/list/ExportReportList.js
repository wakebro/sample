import { useEffect } from "react"
import { ComponentDiv, ComponentProgress, ExporListSignCount } from "../Component"
import { dateFormat } from "../../../../../../utility/Utils"
import { customStyles } from "../data"
import ExportDataTable from "../../../../../Report/Export/ExportDataTable"


const ExportReportList = () => {
    const data = JSON.parse(localStorage.getItem('data'))

    const isCompleteObj = {
        true:  <div style={{color:'green'}}>{'완료'}</div>,
        false: <div style={{color:'red'}}>{'미완료'}</div>
    }

    const column = [
        {
			name:'등록일자',
			style:{cursor:'pointer', padding:'0px !important'},
			width:'100px',
			selector: row => <ComponentDiv title={dateFormat(row.create_datetime)} type='export' id={row.id}/>
		},
		{
			name:'제목',
			style: {justifyContent:'left', cursor:'pointer', padding:'0px !important', paddingLeft:'20px !important'},
			minWidth:'30%',
			selector: row => <ComponentDiv title={row.title} id={row.id} type='export' widthAlign='left'/>
		},
		{
			name:'완료여부',
			style:{cursor:'pointer', padding:'0px !important'},
			width:'90px',
			selector: row => <ComponentDiv title={isCompleteObj[`${row.type}`]} id={row.id} type='export'/>
		},
		{
			name:'진행도',
			style:{cursor:'pointer', padding:'0px !important'},
			width:'160px',
			selector: row => <ComponentProgress row={row}/>
		},
		{
			name:<div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}><div>결재</div><div>(사전회의)</div></div>,
			// width: '110px',
			selector: row => <ExporListSignCount type='meeting' row={row}/>
		},
		{
			name:<div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}><div>결재</div><div>(안전교육)</div></div>,
			// width: '110px',
			selector: row => <ExporListSignCount type='education' row={row}/>
		},
		{
			name:<div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}><div>작업자</div><div>서명</div></div>,
			// width: '110px',
			selector: row => <ExporListSignCount type='evaluation' row={row}/>
		}
    ]

    useEffect(() => {
        setTimeout(() => window.print(), 100)
    }, [])

    return (
        <div style={{margin: '1%'}}>
            <ExportDataTable 
                tableData={data}
                columns={column}
                styles={customStyles}
            />
        </div>
    )
}

export default ExportReportList