import { Button, Col, Row } from "reactstrap"

const ReportTap = (props) => {
    const { active, setActive, setPastActive } = props

    const handleTabClick = (e) => {
        if (active !== e) {
            setPastActive(active)
        }
        setActive(e)
    }

    return (
        <Row className='report-pm'>
            <Col lg='2' md ='12' xs='12' className="ps-1" style={{display: 'flex' }}>
                <Button className='mb-1' color={active === 'total' ? 'primary' : 'report'} style={{width:'100%'}} onClick={() => handleTabClick('total')}>전체</Button>
            </Col>
            <Col lg='2' md ='12' xs='12' className='report-pl' style={{ display: 'flex' }}>
                <Button className='mb-1' color={active === "general" ? "primary" : "report"} style={{width:'100%'}} onClick={() => handleTabClick('general')}>일반 보고서</Button>
            </Col>
            <Col lg='2' md ='12' xs='12' className='report-pl'  style={{ display: 'flex' }}>
                <Button className='mb-1' color={active === "weekly" ? "primary" : "report"} style={{width:'100%'}} onClick={() => handleTabClick('weekly')}>주간 보고서</Button>
            </Col>
            <Col lg='2' md ='12' xs='12' className='report-pl' style={{ display: 'flex' }}>
                <Button className='mb-1' color={active === "monthly" ? "primary" : "report"} style={{width:'100%'}} onClick={() => handleTabClick('monthly')}>월간 보고서</Button>
            </Col>
            <Col lg='2' md ='12' xs='12' className='report-pl'  style={{display: 'flex' }}>
                <Button className='mb-1' color={active === "accident" ? "primary" : "report"} style={{width:'100%'}} onClick={() => handleTabClick('accident')}>사고 보고서</Button>
            </Col>
            <Col lg='2' md ='12' xs='12' className='report-pl' style={{ display: 'flex' }}>
                <Button className='mb-1' color={active === "temporary" ? "primary" : "report"} style={{width:'100%'}} onClick={() => handleTabClick('temporary')}>임시 보관함</Button>
            </Col>
        </Row>
    )
}

export default ReportTap