import { axiosDelete } from "@utils"

import { Fragment } from "react"
import { Link } from 'react-router-dom'
import { Button, CardFooter, Col, Input, Row } from "reactstrap"
import { ROUTE_SYSTEMMGMT_BASIC_SPACE } from "../../../../../constants"
import { apiObj, labelObj } from "../data"
import { useSelector } from "react-redux"
import { SYSTEM_INFO_SPACE } from "../../../../../constants/CodeList"
import { checkOnlyView } from "../../../../../utility/Utils"

const BuildingDetail = (props) => {
	const { setPageType, control, rowId, setSubmitResult} = props
    const loginAuth = useSelector((state) => state.loginAuth)

	// DELETE
	const onDelete = () => {
		const API = `${apiObj['building']}/${rowId}`
		axiosDelete(labelObj['building'], API, setSubmitResult)
	}

	return (
		<Fragment>
			<Row className='mx-0'>
				<Col lg='6' md='6' xs='12' className="card_table top">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>건물코드</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start'>
							<div>{`${control._formValues.code}`}</div>
						</Col>
					</Row>
				</Col>
				<Col lg='6' md='6' xs='12' className="card_table top">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>건물명</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{`${control._formValues.name}`}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid table_row'>
				<Col xs='12'>
					<Row className='card_table'>
						<Col lg='2' md='2' xs='4'  className='card_table col col_color text center '>비고</Col>
						<Col lg='10' md='10' xs='8' className='card_table col text start'>
							<Input value={control._formValues.comments} rows={10} disabled type='textarea' style={{width:'100%', backgroundColor:'white', color:'black'}} bsSize='sm'/>
						</Col>
					</Row>
				</Col>
			</Row>
			<CardFooter className="px-1" style={{marginTop:'2rem'}}>
				<Col style={{display:'flex', justifyContent:'flex-end'}}>
					<Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_SPACE, 'available_delete')} color='danger' onClick={() => onDelete()}>삭제</Button>
					<Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_SPACE, 'available_update')} className='ms-1' color='primary' onClick={() => setPageType('modify')}>수정</Button>
					<Button className='ms-1' tag={Link} to={ROUTE_SYSTEMMGMT_BASIC_SPACE}>목록</Button>
				</Col>
			</CardFooter>
		</Fragment>
	)
}

export default BuildingDetail