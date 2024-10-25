import { Fragment } from "react"
import { Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button, CardBody, CardFooter, Col, Input, Row } from 'reactstrap'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { ROUTE_BASICINFO_AREA_PROPERTY } from "../../../../constants"

const PropertyDetail = (props) => {
	const {setPageType, control} = props
	useAxiosIntercepter()

	return (
		<Fragment>
			<CardBody style={{paddingBottom: '3%'}}>
				<Row className="card_table mx-0 border-right" style={{borderTop: '1px solid #B9B9C3'}}>
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row style={{height:'100%'}}>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>사업소</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.name}</div>
							</Col>
						</Row>
					</Col>
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row style={{height:'100%'}}>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center '>지역</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.city.label}</div>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="card_table mx-0 border-right">
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row style={{height:'100%'}}>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>용도</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.main_purpose}</div>
							</Col>
						</Row>
					</Col>
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row style={{height:'100%'}}>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>담장자</Col>
							<Col lg='8' md='8' xs='8' className='card_table col start '>
								<div>{control._formValues.contact_name}</div>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="card_table mx-0 border-right">
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row style={{height:'100%'}}>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>건물수</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.prop_group}&nbsp;</div>
							</Col>
						</Row>
					</Col>
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row style={{height:'100%'}}>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>연락처</Col>
							<Col lg='8' md='8' xs='8' className='card_table col start '>
								<div>{control._formValues.contact_phone}</div>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="card_table mx-0 border-right">
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row style={{height:'100%'}}>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>연체이자율</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start'>
								<Col style={{textAlign:'end'}}xs={3}>{control._formValues.overdue_daily_rate}</Col>
								<Col style={{textAlign:'start'}} xs={3}>%(일)</Col>
								<Col style={{textAlign:'end'}} xs={3}>{control._formValues.overdue_monthly_rate}</Col>
								<Col style={{textAlign:'start'}} xs={3}>%(월)</Col>
							</Col>
						</Row>
					</Col>
					<Col lg='6' md='6' xs='12' className="border-b">
						<Row style={{height:'100%'}}>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>주소</Col>
							<Col lg='8' md='8' xs='8' className='card_table col start' style={{wordBreak:'break-all'}}>
								<div>{control._formValues.address}</div>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid'>
					<Col xs='12'>
						<Row style={{height:'100%'}}>
							<Col md='2' xs='4'  className='card_table col col_color text center '>비고</Col>
							<Col md={10} xs={8} className='card_table col text start' style={{flexDirection:'column', minHeight:'10rem', alignItems:'start'}}>
								<div>{control._formValues.description !== 'null' && control._formValues.description !== 'undefined' && control._formValues.description}</div>
							</Col>
						</Row>
					</Col>
				</Row>
			</CardBody>
			<CardFooter>
				<Row>
					<Col className='d-flex justify-content-end' style={{paddingRight: '3%'}}>
						<Button  color='primary' onClick={() => setPageType('modify')}>수정</Button>
						<Button className="ms-1" tag={Link} to={ROUTE_BASICINFO_AREA_PROPERTY}>목록</Button>
					</Col>
				</Row>
			</CardFooter>
		</Fragment>
	)
}

export default PropertyDetail
