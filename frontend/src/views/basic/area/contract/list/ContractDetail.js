import axios from 'axios'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { useParams, Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, CardFooter } from "reactstrap"
import { API_BASICINFO_AREA_CONTRACT, ROUTE_BASICINFO_AREA_CONTRACT, ROUTE_BASICINFO_AREA_CONTRACT_FORM, URL } from "../../../../../constants"
import * as moment from 'moment'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { axiosDelete } from '../../../../../utility/Utils'

const ContractDetail = () => {
    useAxiosIntercepter()
    const { id } = useParams()
    const [data, setData] = useState([])
    const [submitResult, setSubmitResult] = useState(false)

    useAxiosIntercepter()

    const handleDownload = (path, name, orangeName) => {
        axios({
            url: `${URL}/static_backend/${path}${(name)}`,
            method: 'GET',
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${orangeName}`)
            document.body.appendChild(link)
            link.click()
        })
    }

	const handleDeleteSubmit = () => {
        axiosDelete('사업소별계약관리', `${API_BASICINFO_AREA_CONTRACT}/${id}`, setSubmitResult)
	}

    useEffect(() => {
		axios.get(`${API_BASICINFO_AREA_CONTRACT}/${id}`)
		.then(res => {
			console.log(res.data)
			setData(res.data)
		})
    }, [])

    useEffect(() => {
		if (submitResult) {
			window.location.href = ROUTE_BASICINFO_AREA_CONTRACT
		}
	}, [submitResult])

    return (
        <Fragment>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='사업소별계약관리' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='계약정보자료실' />
					</div>
				</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
						계약정보자료실
					</CardTitle>
				</CardHeader>
                {data && 
                <CardBody>
                    <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                        <Col md='4' xs='12' className="border-b">
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>현장명</Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                    <Row style={{width:'100%'}}>
                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                            <Row style={{width:'100%'}}>
                                                <div>{data.name}</div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col md='4' xs='12' className="border-b">
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>관리인원</Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                    <Row style={{width:'100%'}}>
                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                            <Row style={{width:'100%'}}>
                                                <div>{data.members && data.members.toLocaleString('ko-KR')}</div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col md='4' xs='12' className="border-b">
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>최초계약일</Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                    <Row style={{width:'100%'}}>
                                        <div>{moment(data.contract_date).format('YYYY-MM-DD')}</div>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="card_table mx-0 border-right">
                        <Col md='4' xs='12' className="border-b">
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>계약금액</Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                    <Row style={{width:'100%'}}>
                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                            <Row style={{width:'100%'}}>
                                                <div>{data.amount && data.amount.toLocaleString('ko-KR')}</div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col md='4' xs='12' className="border-b">
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>연면적(평)</Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                        <Row style={{width:'100%'}}>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%'}}>
                                                    <div>{data.area_total && data.area_total.toLocaleString('ko-KR')}</div>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                            </Row>
                        </Col>
                        <Col md='4' xs='12' className="border-b">
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>관리형태</Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                        <Row style={{width:'100%'}}>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%'}}>
                                                    <div>{data.manage}</div>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="card_table mx-0 border-right" style={{marginBottom: '2%'}}>
                        <Col md='4' xs='12' className="border-b">
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>계약기간</Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                        <Row style={{width:'100%'}}>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%'}}>
                                                    <div>{moment(data.start_date).format('YYYY-MM-DD')}~{moment(data.end_date).format('YYYY-MM-DD')}</div>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                            </Row>
                        </Col>
                        <Col md='4' xs='12' className="border-b">
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>건물코드</Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                        <Row style={{width:'100%'}}>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%'}}>
                                                    <div>{data.building}</div>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                            </Row>
                        </Col>
                        <Col md='4' xs='12' className="border-b">
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>비고</Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                        <Row style={{width:'100%'}}>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%'}}>
                                                    <div>{data.description}</div>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='card_table' style={{marginBottom:'1%'}}>
                        <Col style={{borderTop: '3px dotted #ccc'}}>
                            {data.contract_files && 
                                <Col lg='4' md='4' xs='4' className='card_table col text'>
                                    첨부파일 {data.contract_files.length}
                                </Col>
                            }
                            {data.contract_files && data.contract_files.map((file, idx) => {
                                let imagePath
                                try {
                                    imagePath = require(`../../../../../assets/images/icons/${file.original_file_name.split('.').pop()}.png`).default
                                } catch (error) {
                                    imagePath = require('../../../../../assets/images/icons/unknown.png').default
                                }
                                return (
                                    <div key={idx}>
                                        <a onClick={() => handleDownload(file.path, file.file_name, file.original_file_name)}>
                                            <img src={imagePath} width='16' height='18' className='me-50' />
                                            <span className='text-muted fw-bolder align-text-top'>
                                                {file.original_file_name}
                                            </span>
                                        </a>
                                    </div>
                                )
                            })}
                        </Col>
                    </Row>
                    <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                        <Fragment >
                            <Button type='button' color="danger" onClick={handleDeleteSubmit}>삭제</Button>
                            <Button type='submit' color='primary' 
                                className="ms-1"
                                tag={Link} 
                                to={ROUTE_BASICINFO_AREA_CONTRACT_FORM} 
                                state={{
                                    title: "사업소계약관리",
                                    key: "contract",
                                    API: API_BASICINFO_AREA_CONTRACT,
                                    type:'modify',
                                    id: id
                                }}>수정</Button>
                            <Button
                                className="ms-1"
                                tag={Link} 
                                to={ROUTE_BASICINFO_AREA_CONTRACT}
                                state={{
                                    key: 'costCategory'
                                }} >목록</Button>
                        </Fragment>
                    </CardFooter>
                </CardBody>
                }
			</Card>
		</Fragment>
    )

}
export default ContractDetail