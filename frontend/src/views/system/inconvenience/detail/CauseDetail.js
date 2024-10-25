import Breadcrumbs from '@components/breadcrumbs'
import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_INCONV_CAUSE, ROUTE_INCONV, ROUTE_SYSTEMMGMT_INCONV_ADD } from '../../../../constants'
import { axiosDelete, checkOnlyView } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { InconvInfoUrlObj } from '../InconData'
import { useSelector } from 'react-redux'
import { SYSTEM_INCONVENIENCE_TYPE } from '../../../../constants/CodeList'

const DetailCause = () => {
	const { id } = useParams()
    const loginAuth = useSelector((state) => state.loginAuth)
	const [data, setData] = useState()
	const [selectTableList, setSelectTableList] = useState()
	const [submitResult, setSubmitResult] = useState(false)
	const cookies = new Cookies()
	
	useAxiosIntercepter()

	const handleDeleteSubmit = () => {
		axiosDelete('원인 유형', `${API_INCONV_CAUSE}/${id}`, setSubmitResult)
	}
	useEffect(() => {
		axios.get(`${API_INCONV_CAUSE}/${id}`, {params:{property:cookies.get('property').value}})
		.then(res => {
			const empClassList = []
			for (let i = 0; i < res.data.emp_class_list.length; i++) {
				empClassList.push({value:res.data.emp_class_list[i].id, label:res.data.emp_class_list[i].code})
			}
			setSelectTableList(empClassList)
			setData(res.data.cause)
		})
	}, [])
	useEffect(() => {
		if (submitResult) {
			window.location.href = ROUTE_INCONV
		}
	}, [submitResult])
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='원인유형' breadCrumbParent='시스템관리' breadCrumbParent2='시설표준정보' breadCrumbParent3='유형별 분류' breadCrumbActive='원인유형' />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
					원인유형
					</CardTitle>
				</CardHeader>
			{ data && 
				<CardBody style={{marginBottom: '1%'}} >
					<Row className='mx-0' style={{marginTop: '1%'}} >
						<Col md='6' xs='12' className="card_table top">
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>직종</Col>	
									<Col lg='8' md='8' xs='8' className='card_table col center'>
										<Row style={{width:'100%'}}>
											<Col lg='8' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
												<Row style={{width:'100%'}}>
													<div>{selectTableList.find(item => item.value === data.employee_class).label}</div>
												</Row>
											</Col>
										</Row>
									</Col>
							</Row>
						</Col>
                    	<Col md='6' xs='12' className="card_table top">
                            <Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>원인유형</Col>
									<Col lg='8' md='8' xs='8' className='card_table col center'>
										<Col style={{width:'100%'}}>
											<div>{data.code}</div>
										</Col>
									</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid'>
						<Col lg='6' md='6' xs='12'>
                            <Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>업무내용</Col>
									<Col lg='8' md='8' xs='8' className='card_table col center'>
										<Col style={{width:'100%'}}>
											<div>{data.description}</div>
										</Col>
									</Col>
							</Row>
						</Col>
					</Row>
				</CardBody>
				}
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
					<Fragment >
						<Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_TYPE, 'available_delete')}
                            type='button' color="danger" onClick={handleDeleteSubmit}>삭제</Button>
						<Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_TYPE, 'available_update')}
                            type='submit' color='primary' 
							className="ms-1"
							tag={Link} 
							to={ROUTE_SYSTEMMGMT_INCONV_ADD} 
							state={{
								title: "원인 유형",
								key: "cause",
								API: InconvInfoUrlObj["cause"],
								type:'modify',
								id: id
							}}>수정</Button>
						<Button 
							className="ms-1"
							tag={Link} 
							to={ROUTE_INCONV} 
							state={{
								key: 'cause'
						}} >목록</Button>			
					</Fragment>
				</CardFooter>
			</Card>
		</Fragment>
	)
}
export default DetailCause