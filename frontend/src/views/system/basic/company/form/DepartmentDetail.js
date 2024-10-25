import { Fragment } from "react"
import { Link } from 'react-router-dom'
import { Button, CardFooter, Col, Row } from "reactstrap"
import { ROUTE_SYSTEMMGMT_BASIC_COMPANY } from "../../../../../constants"
import { BasicInfoAPIObj, BasicInfoLabelObj } from "../data"
import { axiosDelete, checkOnlyView } from "../../../../../utility/Utils"
import { useSelector } from "react-redux"
import { SYSTEM_INFO_COMPANY } from "../../../../../constants/CodeList"

const DepartmentDetail = (props) => {
	const { setPageType, control, rowId, setSubmitResult} = props
    const loginAuth = useSelector((state) => state.loginAuth)

	// DELETE
	const onDelete = () => {
		const API = `${BasicInfoAPIObj['department']}/${rowId}`
		axiosDelete(BasicInfoLabelObj['department'], API, setSubmitResult)
	}

	return (
		<Fragment>
			<Row className='mx-0'>
				<Col xs='12' className="card_table top">
					<Row className='card_table'>
						<Col md='2' xs='4'  className='card_table col col_color text center '>회사명</Col>
						<Col md='8' xs='8' className='card_table col text start'>
							<div>{control._formValues.company.label}</div>
						</Col>
					</Row>
				</Col>
				{/* <Col lg='6' md='6' xs='12' className="card_table top">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>보기 순서</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.view_order}</div>
						</Col>
					</Row>
				</Col> */}
			</Row>
			<Row className='mx-0'>
				<Col lg='6' md='6' xs='12' className="card_table mid">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>부서 코드</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start'>
							<Col style={{width:'100%', whiteSpace:'break-spaces'}}>
								<div>{control._formValues.code}</div>
							</Col>
						</Col>
					</Row>
				</Col>
				<Col lg='6' md='6' xs='12' className="card_table mid">
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>부서명</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<Col style={{width:'100%', whiteSpace:'break-spaces'}}>
								<div>{control._formValues.name}</div>
							</Col>
						</Col>
					</Row>
				</Col>
			</Row>
			<CardFooter className="mt-2">
				<Row>
					<Col style={{display:'flex', justifyContent:'flex-end'}}>
						<Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_COMPANY, 'available_delete')} color='danger' onClick={() => onDelete()}>삭제</Button>
						<Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_COMPANY, 'available_update')} className='ms-1' color='primary' onClick={() => setPageType('modify')}>수정</Button>
						<Button className='ms-1' tag={Link} to={ROUTE_SYSTEMMGMT_BASIC_COMPANY}>목록</Button>
					</Col>
				</Row>
			</CardFooter>
		</Fragment>
	)
}

export default DepartmentDetail