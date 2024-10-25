import Breadcrumbs from '@components/breadcrumbs'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import * as moment from 'moment'
import { API_USER_LICENSE_DETAIL, ROUTE_BASICINFO_EMPLOYEE_INFORMATION, ROUTE_BASICINFO_EMPLOYEE_LICENSE_REGISTER } from '../../../../constants'
import { Fragment, useEffect, useState } from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { getTableData, axiosDeleteParm } from '../../../../utility/Utils'

const LicenseDetail = () => {
	useAxiosIntercepter()
	const { state } = useLocation()
	const [data, setData] = useState()
	const navigate = useNavigate()
	
	const dateFormat = (data) => {

		return moment(data).format('YYYY-MM-DD')
	}
	const getInit = () => {
		const param = {
			user_license_id :  state.data.id
		}
		getTableData(API_USER_LICENSE_DETAIL, param, setData)
	}

	useEffect(() => {
		getInit()
	}, [])

	const delectClick = () => {
		axiosDeleteParm('자격증', API_USER_LICENSE_DETAIL, {params: {user_license_id :  state.data.id}}, ROUTE_BASICINFO_EMPLOYEE_INFORMATION, navigate)
	}

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='직원정보' breadCrumbParent='기본정보' breadCrumbParent2='직원정보관리' breadCrumbActive='직원정보' />
				</div>
			</Row>
			<Card>
				<CardHeader style={{borderBottom : '1px solid #B9B9C3'}}>
					<CardTitle>
						자격증 상세페이지
					</CardTitle>
				</CardHeader>
				<CardBody className="mb-2">
					<Row className="card_table mx-0 border-right border-b">
						<Col md='8' xs='12' >
							<Row className='card_table table_row border-top'>
								<Col xs='4'  className='card_table col col_color text center'>
									이름
								</Col>
								<Col xs='8' className='card_table col text start ' >
									{data !== undefined && data.user.username}
								</Col>
								<Col xs='4'  className='card_table col col_color text center' style={{borderTop: '1px solid #B9B9C3'}}>
									자격증 이름
								</Col>
								<Col xs='8' className='card_table col' style={{borderTop: '1px solid #B9B9C3'}}>
									{data !== undefined && data.license.code}
								</Col>
								<Col xs='4'  className='card_table col col_color text center' style={{borderTop: '1px solid #B9B9C3'}}>
									<div>취득일자</div>
								</Col>
								<Col xs='8' className='card_table col text start ' style={{borderTop: '1px solid #B9B9C3'}}>
									{(data !== undefined && data.acquisition_date) && dateFormat(data.acquisition_date)}
								</Col>
								<Col xs='4'  className='card_table col col_color text center' style={{borderTop: '1px solid #B9B9C3'}}>
									<div>비고</div>
								</Col>
								<Col xs='8' className='card_table col text start ' style={{borderTop: '1px solid #B9B9C3'}}>
									{data !== undefined && data.description}
								</Col>
							</Row>
						</Col>
						<Col md='4' xs='12'>
							<Row className='card_table table_row border-top'>
								<Col xs='4'  className='card_table col col_color text word-normal center'>
									<div>이미지</div>
								</Col>
								<Col xs='8' className='card_table col text center ' >
									
									{ data !== undefined && (data.photo !== undefined && data.photo !== null
										?
										<div style={{height:"160px", width: '220px', objectFit:'contain'}}>
											<img src={`/static_backend/${data !== undefined && data.photo}`} style={{height:"100%", width: '100%', objectFit:'contain'}}></img>
										</div>
										:	
										<div className='d-flex align-items-center justify-content-center flex-column'  style={{height:"100%", width: '100%', backgroundColor: '#DCDCDC', borderRadius : '6px'}}>
											<h5 className='mt-1'>이미지 없음</h5>
										</div>)
									}
								</Col>
							</Row>
						</Col>
					</Row>

				</CardBody>
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
					<Button className="me-1" color='danger' onClick={() => delectClick()} >
						삭제
					</Button>
					<Button className="me-1" tag={Link} to={ROUTE_BASICINFO_EMPLOYEE_LICENSE_REGISTER} state={{data: data, type: 'put'}}  color="primary">
						수정
					</Button>
					<Button tag={Link} to={ROUTE_BASICINFO_EMPLOYEE_INFORMATION} >목록</Button>
				</CardFooter>
			</Card>
		</Fragment>
	)
}

export default LicenseDetail
