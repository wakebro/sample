import { Col } from "reactstrap"

const NoData = () => {
	return (
		// <Col lg='12' md='12' xs='12' className='card_table col text start' style={{justifyContent: 'center', borderBottom: '1px solid #adb5bd', borderLeft: '1px solid #adb5bd', borderRight: '1px solid #adb5bd', marginBottom: '2%'}}>데이터가 없습니다.</Col>	
        <div style={{margin:'3%'}} className="no-data-message">데이터가 없습니다.</div>
	)
}

export default NoData