import { Fragment } from "react"
import { Link } from 'react-router-dom'
import { Button, CardFooter, Col, Row } from "reactstrap"
import { ROUTE_SYSTEMMGMT_BASIC_COMPANY } from "../../../../../constants"
import { axiosDelete, checkOnlyView } from "../../../../../utility/Utils"
import { BasicInfoAPIObj, BasicInfoLabelObj } from "../data"
import { useSelector } from "react-redux"
import { SYSTEM_INFO_COMPANY } from "../../../../../constants/CodeList"

const CompanyDetail = (props) => {
	const { setPageType, control, rowId, setSubmitResult} = props
    const loginAuth = useSelector((state) => state.loginAuth)

	// DELETE
	const onDelete = () => {
		const API = `${BasicInfoAPIObj['company']}/${rowId}`
		axiosDelete(BasicInfoLabelObj['company'], API, setSubmitResult)
	}

	return (
		<Fragment>
			<Row className="mx-0">
				<Col md='6' xs='12' className='card_table top'>
					<Row className='card_table table_row'>
					<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>회사 코드</Col>
					<Col lg='8' md='8' xs='8' className='card_table col text start'>
						<div>{control._formValues.code}</div>
					</Col>
					</Row>
				</Col>
				<Col lg='6' md='6' xs='12' className='card_table top'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>회사구분</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start'>
							<div>{control._formValues.type.label}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className="mx-0">
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>보기설정</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text center' style={{justifyContent:'space-between'}}>
							<div>{control._formValues.use_property_group === true ? '부동산' : '전사업장'}</div>
						</Col>
					</Row>
				</Col>
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>회사명</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text center' style={{justifyContent:'space-between'}}>
							<div>{control._formValues.name}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='mx-0'>
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>법인번호</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.coporate_number}</div>
						</Col>
					</Row>
				</Col>
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>사업자번호</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.company_number}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='mx-0'>
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>대표자</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.ceo}</div>
						</Col>
					</Row>
				</Col>
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>주민등록번호</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.personal_number}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='mx-0'>
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>업태</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.business_type}</div>
						</Col>
					</Row>
				</Col>
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>종목</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.business_item}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid'>
				<Col xs='12'>
					<Row className='card_table table_row'>
						<Col md='2' xs='4' className='card_table col col_color text center'>주소</Col>
						<Col lg='10' md='10' xs='8' className='card_table col text start '>
							<div>{control._formValues.address}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='mx-0'>
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>담당자</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.contact_name}</div>
						</Col>
					</Row>
				</Col>
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>전화번호</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.contact_mobile}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='mx-0'>
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>핸드폰</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.phone}</div>
						</Col>
					</Row>
				</Col>
				<Col md='6' xs='12' className='card_table mid'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>팩스번호</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.fax}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid'>
				<Col md='6' xs='12'>
					<Row className='card_table table_row'>
						<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>e-mail</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start '>
							<div>{control._formValues.email}</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid'>
				<Col xs='12'>
					<Row className='card_table table_row'>
						<Col md='2' xs='4' className='card_table col col_color text center'>비고</Col>
						<Col md='10' xs='8' className='card_table col text' style={{justifyContent:'space-between', whiteSpace:'break-spaces'}}>
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

export default CompanyDetail