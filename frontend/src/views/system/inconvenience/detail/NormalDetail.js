import Breadcrumbs from '@components/breadcrumbs'
import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_INCONV_NORMAL, ROUTE_SYSTEMMGMT_INCONV_NORMAL } from '../../../../constants'
import { SYSTEM_INCONVENIENCE_NORMAL } from '../../../../constants/CodeList'
import { axiosDelete, checkOnlyView } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { InconvInfoUrlObj } from '../InconData'

// 안쓰는 컴포넌트
const NormlaDetail = () => {
    const { id } = useParams()
    const loginAuth = useSelector((state) => state.loginAuth)
    const [data, setData] = useState()
	const cookies = new Cookies()
	const [submitResult, setSubmitResult] = useState(false)
	
	useAxiosIntercepter()

	const handleDeleteSubmit = () => {
		axiosDelete('처리 유형', `${API_INCONV_NORMAL}/${id}`, setSubmitResult)
	}
    useEffect(() => {
		axios.get(`${API_INCONV_NORMAL}/${id}`, {params:{property:cookies.get('property').value}})
		.then(res => {
			setData(res.data)
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
					<Breadcrumbs breadCrumbTitle='시설표준정보' breadCrumbParent='시스템관리' breadCrumbParent2='시설표준정보' breadCrumbActive='표준자재관리 상세' />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
					표준자재관리
					</CardTitle>
				</CardHeader>
				{ data &&
				<CardBody style={{marginBottom: '1%'}}>
					<Row className='mx-0' style={{marginTop: '1%'}} >
						<Col md='6' xs='12' className='card_table top'>
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>표준자재관리</Col>
									<Col lg='8' md='8' xs='8' className='card_table col center'>
										<Row style={{width:'100%'}}>
											<Col lg='8' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
												<Row style={{width:'100%'}}>
													<div>{data.code}</div>
												</Row>
											</Col>
										</Row>
									</Col>
							</Row>
						</Col>
						<Col md='6' xs='12' className='card_table top'>
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>표준단위</Col>
									<Col lg='8' md='8' xs='8' className='card_table col center'>
										<Row style={{width:'100%'}}>
											<Col lg='8' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
												<Row style={{width:'100%'}}>
													<div>{data.unit}</div>
												</Row>
											</Col>
										</Row>
									</Col>
							</Row>
						</Col>
					</Row>
				</CardBody>
				}
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
					<Fragment >
						<Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_NORMAL, 'available_delete')}
                            type='button' color="danger" onClick={handleDeleteSubmit}>삭제</Button>
						<Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_NORMAL, 'available_update')}
                            type='submit' color='primary' tag={Link} 
							className="ms-1"
							to={`${ROUTE_SYSTEMMGMT_INCONV_NORMAL}/add`} 
							state={{
								title: "표준자재관리",
								key: "normal",
								API: InconvInfoUrlObj["normal"],
								type:'modify',
								id: id
							}}>수정</Button>
						<Button
							className="ms-1"
							tag={Link} 
							to={ROUTE_SYSTEMMGMT_INCONV_NORMAL} 
							state={{
								key: 'normal'
							}} >목록</Button>
					</Fragment>
				</CardFooter>
			</Card>
		</Fragment>
	)
}

export default NormlaDetail