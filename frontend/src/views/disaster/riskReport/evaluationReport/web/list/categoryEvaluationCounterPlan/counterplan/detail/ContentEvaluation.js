import { CardBody, Col, Row } from "reactstrap"
import { CHECKLIST, FREQUENCY_3X3, FREQUENCY_5X5, STEP_3, multResult, val2Label } from "../../../../data"

const ContentEvaluation = (props) => {
	const { type, cnt, data, file } = props

	return (
		<CardBody>
			<Row className='card_table top'>
				<Col xs='12' className='card_table col col_color text center' style={{borderRight:'0px'}}>유해 위험요인{cnt}</Col>
			</Row>
			<Row className='card_table mid' >
				<Col xs='12'>
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
					<Row className='card_table table_row'>
						<Col xs='3' className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
							<div>유해</div><div>위험요인</div>
						</Col>
						<Col style={{display:'flex', alignItems:'center'}}>{data.inputResult}</Col>
					</Row>
				</Col>
			</Row>
			{
				(type === FREQUENCY_3X3 || type === FREQUENCY_5X5) &&
				<>
					<Row className='card_table mid' >
						<Col xs='12'>
							<Row className='card_table table_row'>
								<Col xs='3'  className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
									<div>위험성</div><div>평가</div>
								</Col>
								<Col xs='9'  className='card_table col text center' style={{flexDirection:'column', padding:0}}>
									<Row style={{width:'100%', borderBottom:'1px solid #B9B9C3'}}><Col >현재 위험성</Col></Row>
									<Row style={{width:'100%'}}>
										<Col xs={4} style={{flexDirection:'column', borderRight:'1px solid #B9B9C3', padding:'1px 0px'}}><div>가능성</div><div>(빈도)</div></Col>
										<Col xs={4} style={{flexDirection:'column', borderRight:'1px solid #B9B9C3', padding:'1px 0px'}}><div>중대성</div><div>(강도)</div></Col>
										<Col xs={4} className="d-flex card_table text center" style={{padding:'1px 0px'}}>위험성</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='12'>
							<Row className='card_table table_row'>
								<Col xs='3'  className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
									{data.evaluation}
								</Col>
								<Col xs='9'  className='card_table col text center' style={{flexDirection:'column', padding:0}}>
									<Row style={{width:'100%', height:'100%'}}>
										<Col xs={4} style={{display:'flex', alignItems:'center', justifyContent:'center', borderRight:'1px solid #B9B9C3'}}>
											{data.frequency.label}
										</Col>
										<Col xs={4} style={{display:'flex', alignItems:'center', justifyContent:'center', borderRight:'1px solid #B9B9C3'}}>
											{data.strength.label}
										</Col>
										<Col xs={4} style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
											{val2Label(type, multResult(type, data.frequency.value, data.strength.value)).label}
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
				</>
			}
			{
				(type === STEP_3 || type === CHECKLIST) && 
				<>
					<Row className='card_table mid' >
						<Col xs='12'>
							<Row className='card_table table_row'>
								<Col xs='3' className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3', padding:0}}>
									<div>위험성</div>
								</Col>
								<Col xs='9' className='card_table col text center' style={{flexDirection:'column'}}>
									위험성 평가
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='12'>
							<Row className='card_table table_row'>
								<Col xs='3'  className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
									{val2Label(type, multResult(type, data.frequency.value)).label}
								</Col>
								<Col xs='9'  className='card_table col text center' style={{flexDirection:'column', padding:0}}>
									{data.evaluation}
								</Col>
							</Row>
						</Col>
					</Row>
				</>
			}
		</CardBody>
	)
}

export default ContentEvaluation