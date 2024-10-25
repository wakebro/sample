import { Card, Col } from "reactstrap"

export const NoData = () => {
	return (
		<Card className='pt-1' style={{display: 'flex', justifyContent:'center', alignItems: 'center'}}>
			<div>등록된 결과가 없습니다.</div>
		</Card>
	)
}

export const NoDataCause = () => {
	return (
		<Col lg='12' md='12' xs='12' className='card_table col text start' style={{justifyContent: 'center', borderBottom: '1px solid #adb5bd', borderLeft: '1px solid #adb5bd', borderRight: '1px solid #adb5bd', marginBottom: '2%'}}>등록된 결과가 없습니다.</Col>	
	)
  }

  export const DailyListNodata = () => {
	return (
		<Col lg='12' md='12' xs='12' className='card_table col text start' style={{justifyContent: 'center', borderBottom: '1px solid #adb5bd', borderLeft: '1px solid #adb5bd', borderRight: '1px solid #adb5bd' }}>등록된 결과가 없습니다.</Col>	
	)
  }