import { Fragment } from "react"
import { Col, Input, ModalBody, Row } from "reactstrap"

const ItemLine = (props) => {
	const { idx, data } = props
	return (
		<Fragment>
			<ModalBody style={{backgroundColor:`${idx % 2 === 0 && '#FF9F431A'}`}}>
				<Row className='card_table' style={{height:'100%'}}>
					<Col xs='12'>
						<Row className='card_table table_row'>
							<Col xs='1'  className='card_table col text center'>내용 :</Col>
							<Col xs='11' className='card_table col text center' style={{flexDirection:'column'}}><Input/></Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table' style={{height:'100%'}}>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='2'  className='card_table col text center'>등급 : {data}</Col>
							<Col xs='10' className='card_table col text center' style={{flexDirection:'column'}}><Input/></Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='2'  className='card_table col text center'>점수</Col>
							<Col xs='10' className='card_table col text center' style={{flexDirection:'column'}}><Input/></Col>
						</Row>
					</Col>
				</Row>
			</ModalBody> 
		</Fragment>
	)
}

export default ItemLine