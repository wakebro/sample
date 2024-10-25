import { ROUTE_BASICINFO_AREA_FLOOR } from "@src/constants"
import { setPageType } from '@store/module/basicFloor'
import { Fragment } from "react"
import { Controller } from "react-hook-form"
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, CardBody, CardFooter, Col, Input, Row } from "reactstrap"

const FloorDetail = (props) => {
	const {control} = props
	const dispatch = useDispatch()

	const getPyeonValue = (data) => {
		if (data) {
			return `/ 약 ${(parseFloat(data) * 0.3).toFixed(2)}평`
		}
		return false
	}

	return (
		<Fragment>
			<CardBody style={{paddingBottom: '3%'}}>
				<Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>사업소</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.property.label}</div>
							</Col>
						</Row>
					</Col>
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center '>층면적</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								{
									control._formValues.fl_area &&
									<div>{control._formValues.fl_area}&nbsp;m<sup>2</sup>{getPyeonValue(control._formValues.fl_area)}</div>
								}
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="card_table mx-0 border-right">
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>건물</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.building.label}</div>
							</Col>
						</Row>
					</Col>
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>층코드</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.code}</div>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="card_table mx-0 border-right border-b">
					<Col lg='6' md='6' xs='12'>
						<Row>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>층이름</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.name}</div>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid'>
					<Col xs='12'>
						<Row style={{height:'100%'}}>
							<Col md= '2' xs='4'  className='card_table col col_color text center'>입주사 현황</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.description}</div>
							</Col>
						</Row>
					</Col>
				</Row>
			</CardBody>
			<CardFooter>
				<Row>
					<Col className='d-flex justify-content-end' style={{paddingRight: '3%'}}>
						<Button color='primary' onClick={() => dispatch(setPageType('modify'))}>수정</Button>
						<Button className='ms-1' tag={Link} to={ROUTE_BASICINFO_AREA_FLOOR}>목록</Button>
					</Col>
				</Row>
			</CardFooter>
		</Fragment>
	)
}

export default FloorDetail