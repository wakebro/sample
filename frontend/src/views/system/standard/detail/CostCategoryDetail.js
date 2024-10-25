import axios from 'axios'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, CardFooter } from "reactstrap"
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ROUTE_STANDARD, API_STANDARD_COSTCATEGORY, ROUTE_STANDARD_ADD } from '../../../../constants' 
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { StandardUrlObj } from '../data'
import Cookies from 'universal-cookie'
import { axiosDeleteParm } from '../../../../utility/Utils'

const DetailFacility = () => { // 안쓰는 컴포넌트
	const { id } = useParams()
    const [data, setData] = useState()
    const [selectCostTypeList, setSelectCostTypeList] = useState([{ value:'', label: '인덱스타입'}])
    const cookies = new Cookies()
	const navigator = useNavigate()
	
	useAxiosIntercepter()

	const handleDeleteSubmit = () => {
		axiosDeleteParm('', `${API_STANDARD_COSTCATEGORY}/${id}`, {params:{view_order:data.view_order}}, ROUTE_STANDARD, navigator)
	}

    useEffect(() => {
        console.log(cookies.get('store').value)
        axios.get(`${API_STANDARD_COSTCATEGORY}/${id}`, {params:{property:cookies.get('store').value}})
        .then(res => {
            const costTypeList = []
            for (let i = 0; i < res.data.cost_type_list.length; i++) {
                costTypeList.push({value:res.data.cost_type_list[i].id, label:res.data.cost_type_list[i].code})
            }
            setSelectCostTypeList(costTypeList)
            setData(res.data.data)
        })
    }, [])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='임대표준관리' breadCrumbParent='시스템관리' breadCrumbParent2='임대표준관리' breadCrumbActive='인덱스캣 상세' />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
					인덱스캣
					</CardTitle>
				</CardHeader>
			{ data && 
				<CardBody style={{marginBottom: '1%'}}>
					<Row className='card_table top' style={{marginTop: '1%'}} >
						<Col md='6' xs='12'>
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>인덱스타입명</Col>
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
						<Col md='6' xs='12'>
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>장비분류코드</Col>
									<Col lg='8' md='8' xs='8' className='card_table col center'>
										<Row style={{width:'100%'}}>
											<Col lg='8' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
												<Row style={{width:'100%'}}>
													{/* <div>{data.code}</div> */}
												</Row>
											</Col>
										</Row>
									</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table top'>
						<Col lg='6' md='6' xs='12'>
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>인덱스타입(코드)</Col>	
									<Col lg='8' md='8' xs='8' className='card_table col center'>
										<Row style={{width:'100%'}}>
											<Col lg='8' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
												<Row style={{width:'100%'}}>
													<div>{selectCostTypeList.find(item => item.value === data.cost_type).label}</div>
												</Row>
											</Col>
										</Row>
									</Col>
							</Row>
						</Col>
						<Col lg='6' md='6' xs='12'>
							<Row className='card_table table_row'>
								<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>보기 순서</Col>	
									<Col lg='8' md='8' xs='8' className='card_table col center'>
										<Row style={{width:'100%'}}>
											<Col lg='8' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
												<Row style={{width:'100%'}}>
													<div>{data.view_order}</div>
												</Row>
											</Col>
										</Row>
									</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table top'>
						<Col xs='12'>
							<Row className='card_table table_row'>
								<Col xs='2' className='card_table col col_color text center'>설명</Col>
								<Col xs='10' className='card_table col text center' style={{justifyContent:'space-between'}}>
									<Fragment>
										<div>{data.description}</div>
									</Fragment>
								</Col>
							</Row>
						</Col>
					</Row>
				</CardBody>
				}
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
					<Fragment >
						<Button type='button' color="danger" onClick={handleDeleteSubmit}>삭제</Button>
						<Button type='submit' color='primary' 
							className="ms-1"
							tag={Link} 
							to={ROUTE_STANDARD_ADD} 
							state={{
								title: "인덱스캣",
								key: "costCategory",
								API: StandardUrlObj["costCategory"],
								type:'modify',
								id: id
							}}>수정</Button>
						{/* <Button color='primary' 
							tag={Link} 
							to={ROUTE_STANDARD} 
							state={{
								key: 'costType'
							}} >목록보기</Button> */}
					</Fragment>
				</CardFooter>
			</Card>
		</Fragment>
	)
}
export default DetailFacility