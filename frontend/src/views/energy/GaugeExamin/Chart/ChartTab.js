// import { useNavigate } from "react-router-dom"
import { Button, Col, Row } from "reactstrap"

const ChartTab = (props) => {
    const { active, setActive } = props
    // const navigate = useNavigate()

    const handleTabClick = (e) => {
        // navigate(`/report/${e}`)
        setActive(e)
    }

    return (
        <Row className='report-pm'>
            <Col lg='2' md ='2' xs='12' style={{ paddingLeft: '1rem', display: 'flex' }}>
                <Button className='mb-1' color={active === 'dailyChart' ? 'primary' : 'report'} style={{width:'100%'}} onClick={() => handleTabClick('dailyChart')}>일일차트</Button>
            </Col>
            <Col lg='2' md ='2' xs='12' style={{ paddingLeft: '1rem', display: 'flex' }}>
                <Button className='mb-1' color={active === "dailyList" ? "primary" : "report"} style={{width:'100%'}} onClick={() => handleTabClick('dailyList')}>일일 리스트</Button>
            </Col>
            <Col lg='2' md ='2' xs='12' style={{ paddingLeft: '1rem', display: 'flex' }}>
                <Button className='mb-1' color={active === 'monthlyChart' ? 'primary' : 'report'} style={{width:'100%'}} onClick={() => handleTabClick('monthlyChart')}>월간차트</Button>
            </Col>
            <Col lg='2' md ='2' xs='12' style={{ paddingLeft: '1rem', display: 'flex' }}>
                <Button className='mb-1' color={active === 'monthlyList' ? 'primary' : 'report'} style={{width:'100%'}} onClick={() => handleTabClick('monthlyList')}>월간 리스트</Button>
            </Col>
        </Row>
    )
}

export default ChartTab