import { setPageType, setSubmitResult } from "@store/module/basicRoom"
import { Fragment } from "react"
import { Controller } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import { Button, CardBody, CardFooter, Col, Input, Row } from "reactstrap"
import Cookies from "universal-cookie"
import { API_SPACE_ROOM, ROUTE_BASICINFO_AREA_ROOM } from "../../../../constants"
import { axiosDeleteRedux } from "@utils"

const RoomDetail = ({control}) => {
	const cookies = new Cookies()
    const basicRoom = useSelector((state) => state.basicRoom)
	const dispatch = useDispatch()

	const handelDelete = () => {
		axiosDeleteRedux('실정보', `${API_SPACE_ROOM}/${basicRoom.id}`, null, dispatch, setSubmitResult)
	}

	return (
		<Fragment>
			<CardBody style={{paddingBottom: '3%'}}>
				<Row className='card_table top'>
					<Col lg='6' md='6' xs='12'>
						<Row>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>사업소</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{cookies.get('property').label}</div>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="card_table mx-0 border-right">
					<Col xs='12' md='6' className="border-b">
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>건물</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.building.label}</div>
							</Col>
						</Row>
					</Col>
					<Col xs='12' md='6' className="border-b">
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>실번호</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.code}</div>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="card_table mx-0 border-right">
					<Col xs='12' md='6' className="border-b">
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>층</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.floor.label}</div>
							</Col>
						</Row>
					</Col>
					<Col xs='12' md='6' className="border-b">
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4'  className='card_table col col_color text center'>실이름</Col>
							<Col lg='8' md='8' xs='8' className='card_table col text start '>
								<div>{control._formValues.name}</div>
							</Col>
						</Row>
					</Col>
				</Row>

				<Row className='card_table mid'>
					<Col xs='12'>
						<Row style={{height:'100%'}}>
							<Col md='2' xs='4'  className='card_table col col_color text center'>입주사</Col>
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
						<Button color='danger' onClick={() => handelDelete()}>삭제</Button>
						<Button className='ms-1' color='primary' onClick={() => dispatch(setPageType('modify'))}>수정</Button>
						<Button className='ms-1' tag={Link} to={ROUTE_BASICINFO_AREA_ROOM}>목록</Button>
					</Col>
				</Row>
			</CardFooter>
		</Fragment>
	)
}

export default RoomDetail