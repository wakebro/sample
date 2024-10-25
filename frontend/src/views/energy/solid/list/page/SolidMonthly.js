import { Fragment } from "react"
import MonthlyCustomTable from '../table/MonthlyCustomTable'

const SolidMonthly = (props) => {
    const {data} = props

    const columns = [
        {
            name: '날짜',
            with:'1200px',
            cell: row => row.date
        },
        {
            name: '건물명',
            with:'1200px',
            cell: row => row.building_name
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%'}}>&nbsp;</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">1호기</div>
                </div>
            ),
            with: '100px',
            cell: row => row.boiler_1.toLocaleString('ko-KR')
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%', justifyContent:'end'}} className="d-flex align-items-center">보일러</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">2호기</div>
                </div>
            ),
            with: '100px',
            cell: row => row.boiler_2.toLocaleString('ko-KR')
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%'}} className="d-flex align-items-center">&nbsp;가동시간</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">3호기</div>
                </div>
            ),
            with: '100px',
            cell: row => row.boiler_3.toLocaleString('ko-KR')
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%'}}>&nbsp;</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">4호기</div>
                </div>
            ),
            with: '100px',
            cell: row => row.boiler_4.toLocaleString('ko-KR')
        },
        {
            name: '가동시간 합계',
            cell: row => (row.boiler_1 + row.boiler_2 + row.boiler_3 + row.boiler_4).toLocaleString('ko-KR')
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%'}}>&nbsp;</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">중압</div>
                </div>
            ),
            with: '100px',
            cell: row => row.middle_used.toLocaleString('ko-KR')
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%'}} className="d-flex align-items-center justify-content-center">가스사용량</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">저압</div>
                </div>
            ),
            with: '100px',
            cell: row => row.low_used.toLocaleString('ko-KR')
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%'}}>&nbsp;</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">취사</div>
                </div>
            ),
            with: '100px',
            cell: row => row.cook_used.toLocaleString('ko-KR')
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%', justifyContent:'end'}} className="d-flex align-items-center">사용량</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">중저압</div>
                </div>
            ),
            with: '20px',
            cell: row => <Fragment><div style={{color:'green'}}>{(row.middle_used + row.low_used).toLocaleString('ko-KR')}</div></Fragment>
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%'}} className="d-flex align-items-center">&nbsp;합계</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">취사</div>
                </div>
            ),
            with: '20px',
            cell: row => <Fragment><div style={{color:'green'}}>{row.cook_used.toLocaleString('ko-KR')}</div></Fragment>
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%'}}>&nbsp;</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">중압</div>
                </div>
            ),
            with: '100px',
            cell: row => row.middle_press.toLocaleString('ko-KR')
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%'}} className="d-flex align-items-center justify-content-center">정압실 검침량</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">저압</div>
                </div>
            ),
            with: '100px',
            cell: row => row.low_press.toLocaleString('ko-KR')
        },
        {
            name: (
                <div style={{width: '100%', height:'100%'}}>
                    <div style={{height:'50%'}}>&nbsp;</div>
                    <div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">취사</div>
                </div>
            ),
            with: '100px',
            cell: row => row.cook.toLocaleString('ko-KR')
        },
        {
            name: '사용금액 합계(가스)',
            cell: row => row.price.toLocaleString('ko-KR')
        }
    ]

    return (
        <Fragment>
            <MonthlyCustomTable 
                columns={columns}
                selectType={false}
                tableData={data}
            />
        </Fragment>

    )
}
export default SolidMonthly