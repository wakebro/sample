import { CardBody, Col, Row } from "reactstrap"
import { multResult, val2Label } from "../../../../data"

const ContentCounterPlan = (props) => {
	const { type, cnt, data, file } = props

	return (
		<CardBody>
			<Row className='card_table top'>
				<Col xs='12' className='card_table col col_color text center' style={{borderRight:'0px'}}>예방대책{cnt}</Col>
			</Row>
			<Row className='card_table mid'>
				<Col>
					<Row className='card_table table_row'>
						<Col xs='12' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3'}}>
							<img style={{height:"200px", width: '100%', objectFit:'contain'}}
								src={file.length !== 0 ? 
									`/static_backend/${file[0].path}/${file[0].file_name}` :
									`/static_backend/disaster/noImg.png`}/>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid' >
				<Col xs='12'>
					<Row className='card_table table_row' style={{minHeight:'48px'}}>
						<Col xs='3' className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
							<div>조치사항</div>
						</Col>
						<Col xs='9' style={{display:'flex', alignItems:'center'}}>{data.nowAction}</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid' >
				<Col xs='12'>
					<Row className='card_table table_row' style={{minHeight:'48px'}}>
						<Col xs='9' className='card_table col text center' style={{display:'flex', alignItems:'center', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>예방대책</Col>
						<Col xs='3' className='card_table text center' style={{display:'flex', alignItems:'center', flexDirection:'column'}}><div>개선후</div><div>위험성</div></Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid' >
				<Col xs='12'>
					<Row className='card_table table_row' style={{minHeight:'43px'}}>
						<Col xs='9' className='card_table col text center' style={{display:'flex', alignItems:'center', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>{data.counterplan}</Col>
						<Col xs='3' className='card_table text center' style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
							{data.dangerousness !== null && val2Label(type, multResult(type, data.dangerousness.value, 1)).label}
						</Col>
					</Row>
				</Col>
			</Row>
		</CardBody>
	)
}

export default ContentCounterPlan