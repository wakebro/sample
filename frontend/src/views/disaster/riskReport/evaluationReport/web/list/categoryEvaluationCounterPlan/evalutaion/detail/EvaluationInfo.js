/* eslint-disable */
import { CardBody, Col, Label, Row } from "reactstrap"

import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useEffect, useState } from "react"

const EvaluationInfo = (props) => {
	const { data } = props
	const [user, setUser] = useState('')
	useEffect(() => {
		const tempData = {...data}
		if (tempData.hasOwnProperty('manager')) {
			setUser(tempData.manager_name)
		}
	}, [data])
	return (
		<CardBody>
			<Label className='risk-report text-lg-bold'>평가 정보</Label>
			<Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
				<Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
					<Row className='card_table table_row'>
						<Col xs='4' className='card_table col col_color text center'>현장명</Col>
						<Col xs='8' className='card_table col text start'>
							<div>{data.scene}</div>
						</Col>
					</Row>
				</Col>
				<Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
					<Row className='card_table table_row'>
						<Col xs='4' className='card_table col col_color text center' style={{textAlign:'center'}}>작업명<br/>(평가대상)</Col>
						<Col xs='8' className='card_table col text start'>
							<div>{data.target}</div>
						</Col>
					</Row>
				</Col>
				<Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
					<Row className='card_table table_row'>
						<Col xs='4' className='card_table col col_color text center'>평가일자</Col>
						<Col xs='8' className='card_table col text start'>
							<div>{data.date}</div>
						</Col>
					</Row>
				</Col>
			</Row>

			<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
				<Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
					<Row className='card_table table_row'>
						<Col xs='4'  className='card_table col col_color text center'>평가자<br/>(관리자)</Col>
						<Col xs='8' className='card_table col text start'>
							<Row style={{width:'100%'}}>
								<Col xs='12'>
									<div>
										{ user }
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
					<Row className='card_table table_row'>
						<Col xs='4'  className='card_table col col_color text center'>부서</Col>
						<Col xs='8' className='card_table col text start'>
							<div>{data.department}</div>
						</Col>
					</Row>
				</Col>
				<Col md='4' sm='12' xs='12' className="disaster-info"/>
			</Row>
		</CardBody>
	)
}

export default EvaluationInfo