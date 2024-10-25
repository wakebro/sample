import { Fragment } from "react"
import { Link } from 'react-router-dom'
import { Button, CardFooter, Col, Row } from "reactstrap"
import { ROUTE_SYSTEMMGMT_BASIC_COMPANY } from "../../../../../constants"
import { axiosDelete, checkOnlyView } from "../../../../../utility/Utils"
import { BasicInfoAPIObj, BasicInfoLabelObj } from "../data"
import { useSelector } from "react-redux"
import { SYSTEM_INFO_COMPANY } from "../../../../../constants/CodeList"

const PropertyDetail = (props) => {
	const { setPageType, control, rowId, setSubmitResult} = props
    const loginAuth = useSelector((state) => state.loginAuth)

	// DELETE
	const onDelete = () => {
		const API = `${BasicInfoAPIObj['property']}/${rowId}`
		axiosDelete(BasicInfoLabelObj['property'], API, setSubmitResult)
	}

	return (
		<Fragment>
			<Row className='card_table table_row mx-0'>
				<Col lg='6' md='6' xs='12' className="card_table top">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>사업소 코드</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start'>
							<div>{control._formValues.code}</div>
						</Col>
					</Row>
				</Col>
				<Col lg='6' md='6' xs='12' className="card_table top">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>사업소 이름</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.name}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table table_row mx-0'>
				<Col lg='6' md='6' xs='12' className="card_table mid">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>사업소 그룹</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start'>
							<div>{control._formValues.property_group ? control._formValues.property_group.label : ''}</div>
						</Col>
					</Row>
				</Col>
				<Col lg='6' md='6' xs='12' className="card_table mid">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>지역</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.city.value !== '' ? control._formValues.city.label : ''}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid table_row mx-0'>
				<Col lg='6' md='6' xs='12' className="">
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>사업소 종류</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start'>
							<div>{control._formValues.high_property ? '상위 ' : '일반 '} 사업소</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table table_row mx-0'>
				<Col lg='6' md='6' xs='12' className="card_table mid">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>사설망</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start'>
							<div>{control._formValues.use_intranet === true ? '사용' : '사용안함'}</div>
						</Col>
					</Row>
				</Col>
				<Col lg='6' md='6' xs='12' className="card_table mid">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>경보사용</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.use_alarm === true ? '사용' : '사용안함'}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid table_row'>
				<Col lg='6' md='6' xs='12'>
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>비고</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start'>
							<div>{control._formValues.description}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<CardFooter className='px-0' style={{borderTop: '1px solid #dae1e7', marginTop:'2rem'}}>
				<Col style={{display:'flex', justifyContent:'flex-end'}}>
					<Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_COMPANY, 'available_delete')} color='danger' onClick={() => onDelete()}>삭제</Button>
					<Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_COMPANY, 'available_update')} className='ms-1' color='primary' onClick={() => setPageType('modify')}>수정</Button>
					<Button className='ms-1' tag={Link} to={ROUTE_SYSTEMMGMT_BASIC_COMPANY}>목록</Button>
				</Col>
			</CardFooter>
		</Fragment>
	)
}

export default PropertyDetail