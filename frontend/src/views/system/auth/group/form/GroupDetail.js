import { Fragment } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Col, Row } from "reactstrap"
import { ROUTE_SYSTEMMGMT_AUTH_GROUP } from '../../../../../constants'
import { changePageType } from "../../../../../redux/module/authGroup"
import { axiosDelete } from "../../../../../utility/Utils"
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { authAPIObj, authLabelObj } from "../../data"

const GroupDetail = (props) => {
	useAxiosIntercepter()
	const { control, setSubmitResult } = props
	const dispatch = useDispatch()
	const authGroup = useSelector((state) => state.authGroup)
	// DELETE
	const onDelete = () => {
		const API = `${authAPIObj['group']}/${authGroup.detailRow}`
		axiosDelete(authLabelObj['group'], API, setSubmitResult)
	}

	return (
		<Fragment>
			<Row>
				<Col style={{display:'flex', justifyContent:'flex-end'}}>
					<Button color='danger' className="ms-1 mb-1" onClick={() => onDelete()}>삭제</Button>
					<Button color='primary' className="ms-1 mb-1" onClick={() => dispatch(changePageType('modify'))}>수정</Button>
					<Button className="ms-1 mb-1" tag={Link} to={ROUTE_SYSTEMMGMT_AUTH_GROUP}>목록</Button>
				</Col>
			</Row>
			<Row className='card_table top table_row'>
				<Col lg='6' md='6' xs='12'>
					<Row className='card_table'>
						<Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>그룹명</Col>
						<Col lg='8' md='8' xs='8' className='card_table col text start'>
							<div>{control._formValues.name}</div>
						</Col>
					</Row>
				</Col>
			</Row>
		</Fragment>
	)
}

export default GroupDetail