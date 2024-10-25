import { Fragment } from "react"
import { Link } from 'react-router-dom'
import { Button, CardFooter, Col, Row } from "reactstrap"
import { ROUTE_SYSTEMMGMT_BASIC_SPACE } from "../../../../../constants"
import { axiosDelete, checkOnlyView } from "../../../../../utility/Utils"
import { apiObj, labelObj } from "../data"
import { useSelector } from "react-redux"
import { SYSTEM_INFO_SPACE } from "../../../../../constants/CodeList"

const FloorDetail = (props) => {
	const { setPageType, control, rowId, setSubmitResult} = props
    const loginAuth = useSelector((state) => state.loginAuth)

	// DELETE
	const onDelete = () => {
		const API = `${apiObj['floor']}/${rowId}`
		axiosDelete(labelObj['floor'], API, setSubmitResult)
	}

	return (
		<Fragment>
			<Row className='mx-0'>
				<Col lg='6' md='6' xs='12' className="card_table top">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>사업소</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start'>
							{/* <div>{`${control._formValues.property.label.name}(${control._formValues.property.label.code})`}</div> */}
							<div>{`${control._formValues.property.label}`}</div>
						</Col>
					</Row>
				</Col>
				<Col lg='6' md='6' xs='12' className="card_table top">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>건물명</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							{/* <div>{`${control._formValues.building.label.name}(${control._formValues.building.label.code})`}</div> */}
							<div>{`${control._formValues.building.label}`}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='mx-0'>
				<Col lg='6' md='6' xs='12' className="card_table mid">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>층 코드</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start'>
							<div>{control._formValues.code}</div>
						</Col>
					</Row>
				</Col>
				<Col lg='6' md='6' xs='12' className="card_table mid">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>층명</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.name}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<CardFooter className="px-0" style={{borderTop: '1px solid #dae1e7', marginTop:'2rem'}}>
				<Col style={{display:'flex', justifyContent:'flex-end'}}>
					<Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_SPACE, 'available_delete')} color='danger' onClick={() => onDelete()}>삭제</Button>
					<Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_SPACE, 'available_update')} className='ms-1' color='primary' onClick={() => setPageType('modify')}>수정</Button>
					<Button className='ms-1' tag={Link} to={ROUTE_SYSTEMMGMT_BASIC_SPACE}>목록</Button>
				</Col>
			</CardFooter>
		</Fragment>
	)
}

export default FloorDetail