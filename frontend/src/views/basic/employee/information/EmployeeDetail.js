import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { API_EMPLOYEE_DETAIL, API_REGISTER, ROUTE_BASICINFO_EMPLOYEE_REGISTER } from '../../../../constants'
import axios from "../../../../utility/AxiosConfig"
import { axiosSweetAlert, getTableData, primaryColor, sweetAlert } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'

import * as moment from 'moment'
const EmployeeDetail = (props) => {
	useAxiosIntercepter()
	const {userId, setReset, reset} = props
	const [data, setData] = useState([])
	
	const dateFormat = (data) => {
		if (data !== null && data !== undefined) {
			return moment(data).format('YYYY-MM-DD')
		}
	}
	const maleFemaleCustom = (data) => {
		if (data !== null && data !== undefined) {
			if (data === 'male') {
				return '남자'
			} else {
				return '여자'
			}
		}
	}
	const getInit = () => {
		const param = {
			userId :  userId
		}
		getTableData(API_EMPLOYEE_DETAIL, param, setData)
	}

	const deleteAPI = () => {
		const MySwal = withReactContent(Swal)
		MySwal.fire({
			icon: "warning",
			title: '퇴직과 삭제 중 선택해 주세요.',
			html: "삭제의 경우 복구가 불가능합니다.",
			showCancelButton: true,
			showConfirmButton: true,
			showDenyButton: true,
			heightAuto: false,
			confirmButtonText: '퇴직',
			denyButtonText: '삭제',
			cancelButtonText: '취소',
			confirmButtonColor : primaryColor,
			customClass: {
				actions: 'sweet-alert-custom right',
				confirmButton: 'me-1',
				denyButton: 'me-1'
			}
		}).then((res) => {
			if (res.isConfirmed || res.isDenied) {
				const alertText = res.isDenied ? '직원 삭제 처리' : '직원 퇴직 처리'
				axios.delete(API_REGISTER, {
					data: {
						userId: userId,
						isDelete: res.isDenied
					}
				}).then(res => {
					if (res.status === 200) {
						axiosSweetAlert(`${alertText}`, `${alertText}가 완료되었습니다.`, 'success', 'center', null)
						setReset(!reset)
					} else {
						sweetAlert(`${alertText} 실패`, `${alertText}가 실패했습니다.<br/>다시한번 확인 해주세요.`, 'warning')
					}
				}).catch(() => {
					sweetAlert(`${alertText} 실패`, `${alertText}가 실패했습니다.<br/>다시한번 확인 해주세요.`, 'warning')
				})
			} else {
				MySwal.fire({
					icon: "info",
					html: "취소하였습니다.",
					showCancelButton: true,
					showConfirmButton: false,
					heightAuto: false,
					cancelButtonText: "확인",
					cancelButtonColor : primaryColor,
					reverseButtons :true,
					customClass: {
						actions: 'sweet-alert-custom right'
					}
				})
			}
		})
	}
	useEffect(() => {
		getInit()
	}, [userId, reset])

	return (
		<Fragment>
			
			<Card>
				<CardHeader style={{borderBottom : '1px solid #B9B9C3'}}>
					<CardTitle>
						직원정보
					</CardTitle>
				</CardHeader>
				<CardBody className="mb-2">
						<Row className='card_table top' >
							<Col  xs='6' >
								<Row className='card_table table_row'>
									<Col xs='12'  className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
										
										{ data['photo'] !== undefined && data['photo'] !== null
											?
											<div style={{height:"160px", width: '220px', objectFit:'contain'}}>
												<img src={`/static_backend/${data['photo']}`} style={{height:"100%", width: '100%', objectFit:'contain'}}></img>
											</div>
											:	
											<div className='d-flex align-items-center justify-content-center flex-column'  style={{height:"100%", width: '100%', backgroundColor: '#DCDCDC', borderRadius : '6px'}}>
												<h5 className='mt-1'>이미지 없음</h5>
											</div>
										}
									</Col>
								</Row>
							</Col>
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center'>이름</Col>
									<Col xs='8' className='card_table col text start ' >{data['name']}</Col>
									<Col xs='4'  className='card_table col col_color text center ' style={{borderTop: '1px solid #B9B9C3'}}>생일</Col>
									<Col xs='8' className='card_table col text start ' style={{borderTop: '1px solid #B9B9C3'}}>{dateFormat(data['birthday'])}</Col>
									<Col xs='4'  className='card_table col col_color text center ' style={{borderTop: '1px solid #B9B9C3'}}>전화번호</Col>
									<Col xs='8' className='card_table col text start ' style={{borderTop: '1px solid #B9B9C3'}}>{data['phone']}</Col>
									{/* <Col xs='4'  className='card_table col col_color text center ' style={{borderTop: '1px solid #B9B9C3'}}>핸드폰</Col>
									<Col xs='8' className='card_table col text start ' style={{borderTop: '1px solid #B9B9C3'}}>{data['phone']}</Col> */}
									<Col xs='4'  className='card_table col col_color text center ' style={{borderTop: '1px solid #B9B9C3'}}>이메일</Col>
									<Col xs='8' className='card_table col text start ' style={{borderTop: '1px solid #B9B9C3'}}>{data['email'] !== 'undefined' ? data['email'] : null}</Col>
									<Col xs='4'  className='card_table col col_color text center ' style={{borderTop: '1px solid #B9B9C3'}}>성별</Col>
									<Col xs='8' className='card_table col text start ' style={{borderTop: '1px solid #B9B9C3'}}>{maleFemaleCustom(data['gender'])}</Col>
								</Row>
							</Col>
						</Row>
						<Row className='card_table mid' >
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>주소</Col>
									<Col xs='8' className='card_table col text start '>{data['address']}</Col>
								</Row>
							</Col>
						</Row>
						<Row className='card_table mid' >
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>회사명</Col>
									<Col xs='8' className='card_table col text start '>{data['company'] && data['company']['name']}</Col>
								</Row>
							</Col>
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>직종</Col>
									<Col xs='8' className='card_table col text start '>{data['employee_class'] && data['employee_class']['code']}</Col>
								</Row>
							</Col>
						</Row>
						<Row className='card_table mid' >
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>부서명</Col>
									<Col xs='8' className='card_table col text start '>{data['department'] && data['department']['name']}</Col>
								</Row>
							</Col>
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>직급</Col>
									<Col xs='8' className='card_table col text start '>{data['employee_level'] && data['employee_level']['code']}</Col>
								</Row>
							</Col>
						</Row>
						<Row className='card_table mid' >
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>사번</Col>
									<Col xs='8' className='card_table col text start '>{data['employee_number']}</Col>
								</Row>
							</Col>
							{/* <Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '></Col>
									<Col xs='8' className='card_table col text start '></Col>
								</Row>
							</Col> */}
						</Row>
						<Row className='card_table mid' >
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>입사일</Col>
									<Col xs='8' className='card_table col text start '>{dateFormat(data['start_date'])}</Col>
								</Row>
							</Col>
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>등록일</Col>
									<Col xs='8' className='card_table col text start '>{dateFormat(data['create_datetime'])}</Col>
								</Row>
							</Col>
						</Row>
						<Row className='card_table mid' >
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>수정일</Col>
									<Col xs='8' className='card_table col text start '>{dateFormat(data['update_datetime'])}</Col>
								</Row>
							</Col>
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>퇴사일</Col>
									<Col xs='8' className='card_table col text start '>{dateFormat(data['end_date'])}</Col>
								</Row>
							</Col>
						</Row>
						<Row className='card_table mid' >
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>상의 사이즈</Col>
									<Col xs='8' className='card_table col text start '>{data['top_size']}</Col>
								</Row>
							</Col>
							<Col xs='6'>
								<Row className='card_table table_row'>
									<Col xs='4'  className='card_table col col_color text center '>하의 사이즈</Col>
									<Col xs='8' className='card_table col text start '>{data['bottom_size']}</Col>
								</Row>
							</Col>
						</Row>
						<Row className='card_table mid' >
							<Col xs='12'>
								<Row className='card_table table_row' style={{height : '100px'}}>
									<Col xs='2'  className='card_table col col_color text center '>비고</Col>
									<Col xs='10' className='card_table col text start '>{data['description']}</Col>
								</Row>
							</Col>
						</Row>
					</CardBody>
					{ userId !== 0 &&
					<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
							<Button disabled={parseInt(userId) === 0} className="me-1" onClick={() => deleteAPI()} color="danger">
								삭제
							</Button>
							<Button disabled={parseInt(userId) === 0} tag={Link} to={ROUTE_BASICINFO_EMPLOYEE_REGISTER} state={data} color='primary'>
								수정
							</Button>		
					</CardFooter>
					}
				
			</Card>
		</Fragment>
	)
}

export default EmployeeDetail
