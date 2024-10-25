import { useNavigate } from "react-router-dom"
import { Button } from "reactstrap"
import { ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_PERFORMANCE, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_STOCK_LOG, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_STOCK_LOG_TOTAL } from "../../../../constants"

const Tab = (props) => {
    const { active } = props
    const navigate = useNavigate()

    const handleTabClick = (e) => {
        switch (e) {
            case 'info':
                navigate(ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST)
                break
            case 'stockLog':
                navigate(ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_STOCK_LOG)
                break
            case 'performance':
                navigate(ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_PERFORMANCE)
                break
            case 'stockLogTotal':
                navigate(ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_STOCK_LOG_TOTAL)
                break
        }
    }

    return (
        <div style={{ padding: 0, display: 'flex' }}>
            <Button color={active === 'info' ? 'primary' : 'report'} onClick={() => handleTabClick('info')}>자재현황</Button>
            <Button className="mx-1" color={active === "stockLog" ? "primary" : "report"} onClick={() => handleTabClick('stockLog')}>입출고현황</Button>
            <Button color={active === "performance" ? "primary" : "report"} onClick={() => handleTabClick('performance')}>자재실적조회</Button>
            <Button className='mx-1' color={active === "stockLogTotal" ? "primary" : "report"} onClick={() => handleTabClick('stockLogTotal')}>입출고집계표</Button>
        </div>
    )
}

export default Tab