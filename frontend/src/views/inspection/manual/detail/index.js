import { Fragment, useState, useEffect } from "react"
import { Col, Form, Input, Row, Button, FormFeedback, CardTitle, CardBody, Card, CardHeader } from "reactstrap"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ROUTE_MANUAL, API_MANUAL_REGISTER, API_MANUAL_DETAIL, ROUTE_MANUAL_FIX, API_MANUAL_EXPORT, URL  } from "../../../../constants"
import axios from '../../../../utility/AxiosConfig'
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import Breadcrumbs from '@components/breadcrumbs'
import { FileText } from "react-feather"
import { 
    axiosDeleteParm
} from '@utils'
import { useSelector } from "react-redux"
import { checkOnlyView } from "../../../../utility/Utils"
import { INSPECTION_MANUAL } from "../../../../constants/CodeList"

// 매뉴얼 상세
const Manual_Detail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
	const params = useParams()
	const manual_id = params.id
    const navigate = useNavigate()
	const [data, setData] = useState()
	const files_name = data?.files_name || null
    const path = data && data.path ? data.path : null
	const filepath = path && path.map(filePath => filePath.replace("static/", ""))
	const file_extensions = path && path.map(path => path.split('.').pop())
	
    const handleDownload = (num) => {
        axios({
            url: `${URL}/static_backend/${(filepath)[num]}`,
            method: 'GET',
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${(files_name)[num]}`)
            document.body.appendChild(link)
            link.click()
        })
    }

    const GetDetailData = () => {
        axios.get(API_MANUAL_DETAIL,  { params: {manual_id : manual_id} })
        .then((response) => {
            setData(response.data)
        })
        .catch(error => {
            // 응답 실패 시 처리
            console.error(error)// 에러 메시지
        })
    }
    useEffect(() => {
        GetDetailData()
    }, [])

    const handleDelete = () => {
        axiosDeleteParm('유지관리매뉴얼', API_MANUAL_DETAIL, { data: {manual_id : manual_id }}, ROUTE_MANUAL, navigate)
    }

    const handleExport = () => {
        axios.get(`${API_MANUAL_EXPORT}/${manual_id}`)
        .then((res) => {
            console.log(res)
            axios({
                url: res.data.url,
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${res.data.name}`)
                document.body.appendChild(link)
                link.click()
            }).catch((res) => {
                console.log(res)
            })
        })
        .catch(res => {
            console.log(res)
        })
    }

	return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='유지관리매뉴얼' breadCrumbParent='점검관리' breadCrumbActive='유지관리매뉴얼' />
                    <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
                        <FileText size={14}/>
                        문서변환
                    </Button.Ripple>
                </div>
            </Row>
            <Card>
                <CardHeader>
                        <CardTitle>유지관리매뉴얼</CardTitle>
                </CardHeader>
                <CardBody>
                    <Row className="card_table mx-0 border-right border-top">
                        <Col md='6' xs='12' className="border-b">
                            <Row className='card_table table_row'>
                                <Col md='4' xs='2'  className='card_table col col_color text center '>제목</Col>
                                <Col md='8' xs='10' className='card_table col text start '>
                                <Row style={{width:'-webkit-fill-available'}}>
                                    <div>
                                        {data && data.subject}
                                    </div>
                                </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col md='6' xs='12' className="border-b">
                            <Row className='card_table table_row'>
                            <Col md='4' xs='2'  className='card_table col col_color text center '>작성자</Col>
                            <Col md='8' xs='10' className='card_table col text start '>
								{data && data.writer}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                <Row className="card_table mid">
                    <Col>
                        <Row className='card_table table_row' >
                            <Col xs='2'  className='card_table col col_color text center' style={{whiteSpace: 'nowrap'}}>첨부파일</Col>
                            <Col xs='10' className='card_table col text start'>
							<div>
							{files_name && files_name.map((name, index) => {
							let imagePath
							try {
							imagePath = require(`../../../../assets/images/icons/${file_extensions[index]}.png`).default
							} catch (error) {
							// 파일을 찾을 수 없는 경우 대체 이미지 경로를 지정
							imagePath = require('../../../../assets/images/icons/unknown.png').default
							}
							return (
							<div key={index}>
								<a onClick={() => handleDownload(index)}>
								<img src={imagePath} width='16' className='me-50' />
								<span className='text-muted fw-bolder align-text-top'>{name}</span>
								</a>
							</div>
							)
						})}
						</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="card_table mid">
                    
                    <Col>
                        <Row className='card_table table_row'>
                            <Col xs='2'  className='card_table col col_color text center' style={{whiteSpace: 'nowrap', minHeight: '300px' }}>내용</Col>
                            <Col xs='10' className='card_table col d-flex align-items-start'>
                                <Row style={{width:'-webkit-fill-available'}}>
                                    <div style={{whiteSpace:'break-spaces'}}>
                                        {data && data.content}
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%', borderTop: '1px solid #B9B9C3'}}>
                    <Button hidden={checkOnlyView(loginAuth, INSPECTION_MANUAL, 'available_delete')}
                        color= 'danger' style={{marginTop: '1%', marginRight: '1%'}} onClick={handleDelete}
                    >삭제</Button>
                    <Button hidden={checkOnlyView(loginAuth, INSPECTION_MANUAL, 'available_update')}
                        color='primary' style={{marginTop: '1%', marginRight: '1%'}} tag={Link} to={`${ROUTE_MANUAL_FIX}/${manual_id}`} 
                    >수정</Button>
                    <Button  style={{marginTop: '1%'}} tag={Link}
                        to={ROUTE_MANUAL} 
                    >목록</Button>
                </Col>

                    
                </CardBody>
            </Card>     
        </Fragment>
    )
    }
export default Manual_Detail