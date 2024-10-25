import { Fragment, useEffect, useState } from "react"
import { Col, Form, Input, Row, Button, FormFeedback, CardTitle, CardBody, Card, CardHeader, Label } from "reactstrap"
import { Link, useParams, useNavigate } from "react-router-dom"
import {  API_INSPECTION_DEFECT_DETAIL, ROUTE_INSPECTION_DEFECT, ROUTE_INSPECTION_DEFECT_FIX, API_INSPECTION_DEFECT_EXPORT } from "../../../../constants"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import axios from '../../../../utility/AxiosConfig'
import Breadcrumbs from '@components/breadcrumbs'
import { FileText } from "react-feather"
import { axiosDeleteParm, checkOnlyView } from "../../../../utility/Utils"
import { useSelector } from "react-redux"
import { INSPECTION_DEFECT } from "../../../../constants/CodeList"

const DefectDetail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const navigate = useNavigate()
	const params = useParams()
	const defect_id = params.id
    const [data, setData] = useState()
    
    const handleDelete = () => {
        axiosDeleteParm('하자관리', API_INSPECTION_DEFECT_DETAIL, { data: {defect_id : defect_id } }, ROUTE_INSPECTION_DEFECT, navigate)
    } // handleDelete end

    const handleExport = () => {
        axios.get(`${API_INSPECTION_DEFECT_EXPORT}/${defect_id}`)
        .then((res) => {
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

    useEffect(() => {
        axios.get(API_INSPECTION_DEFECT_DETAIL,  { params: {defect_id : defect_id} })
        .then((response) => {
        setData(response.data)
        })
        .catch(error => {
        // 응답 실패 시 처리
        console.error(error)// 에러 메시지
        })

	}, [])
    
	return (
    <Fragment>
        <Row>
            <div className='d-flex justify-content-start'>
                <Breadcrumbs breadCrumbTitle='하자관리' breadCrumbParent='시설관리' breadCrumbActive='하자관리' />
                <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
                    <FileText size={14}/>문서변환
                </Button.Ripple>
            </div>
        </Row>
        <Card>
            <CardHeader>
                <CardTitle>하자관리</CardTitle>
            </CardHeader>
     
            <CardBody>
                <Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center '>
                            <div>분류 번호</div>
                            </Col>
                            <Col xs='8' className='card_table col text start' style={{justifyContent: 'space-between'}}>
                            {data && data.defect && data.defect.prop && data.defect.prop.name}&nbsp;-&nbsp;
                            {data && data.defect && data.defect.emp_class && data.defect.emp_class.code}&nbsp;-&nbsp;{data && data.defect_index}
                            </Col>
                        </Row>                   </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>점검자</Col>
                            <Col xs='8' className='card_table col text start '>
                                {data && data.defect && data.defect.check_user_name}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4'  className='card_table col col_color text center '>
                                하자명
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                {data && data.defect && data.defect.name &&
                                <Row style={{width:'100%'}}>
                                    <div>
                                    {data && data.defect && data.defect.name}
                                    </div>
                                </Row>
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>점검일자</Col>
                            <Col xs='8' className='card_table col text start '>
                            {data && data.defect && data.defect.check_datetime && data.defect.check_datetime.split('T')[0]}

                            </Col>
                        </Row>
                    </Col>
                </Row>
                
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center '>
                            <div>위치</div>
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                            {data && data.defect && data.defect.location &&
                                <Row style={{width:'100%'}}>
                                    <div>
                                    {data && data.defect && data.defect.location}
                                    </div>
                                </Row>
                            }
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>중요도</Col>
                        <Col xs='8' className='card_table col text start '>
                            {data && data.defect &&  
                            (
                            data.defect.priority === 0 ? '중요' :
                            data.defect.priority === 1 ? '경미' :
                            data.defect.priority === 2 ? '제안' :
                            ''
                            )}
                        </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                                <div>관련사항</div>
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                             {data && data.defect && data.defect.related_matters}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height: '100%' }}>
                            <Col xs='4'  className='card_table col col_color text center '>
                                시공 전 사진
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                {data && data.files && data.files.before_image !== null
                                    ?
                                    <div className='d-flex align-items-center justify-content-center flex-column' style={{height:"210px", width: '100%', objectFit:'contain'}}>
                                        <img src={`/static_backend/${data.files.before_image_path}${data.files.before_image}`} style={{height:"100%", width: '100%', objectFit:'contain'}}></img>
                                    </div>
                                    :	
                                    <div className='d-flex align-items-center justify-content-center flex-column'  style={{height:"100%", width: '100%', backgroundColor: '#DCDCDC', borderRadius : '6px'}}>
                                        <h5 className='mt-1'>이미지 없음</h5>
                                    </div>
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3', minHeight:'110px'}}>문제점</Col>
                            <Col xs='8' className='card_table col text center'  style={{borderBottom: '1px solid #B9B9C3'}}>
                                {data && data.defect && data.defect.problem &&
                                    <Row style={{width:'100%', paddingTop:'2%'}}>
                                        <div style={{whiteSpace:'break-spaces'}}>
                                            {data && data.defect && data.defect.problem}
                                        </div>
                                    </Row>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center'  style={{ minHeight:'110px'}}>예상 손해</Col>
                            <Col xs='8' className='card_table col text center '>
                                {data && data.defect && data.defect.expected_loss &&
                                    <Row style={{width:'100%', paddingTop:'2%'}}>
                                        <div style={{whiteSpace:'break-spaces'}}>
                                            {data && data.defect && data.defect.expected_loss}
                                        </div>
                                    </Row>
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height: '100%' }}>
                            <Col xs='4'  className='card_table col col_color text center '>
                                시공 후 사진
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                {data && data.files && data.files.after_image !== null
                                    ?
                                    <div className='d-flex align-items-center justify-content-center flex-column' style={{height:"210px", width: '100%', objectFit:'contain'}}>
                                        <img src={`/static_backend/${data.files.after_image_path}${data.files.after_image}`} style={{height:"100%", width: '100%', objectFit:'contain'}}></img>
                                    </div>
                                    :	
                                    <div className='d-flex align-items-center justify-content-center flex-column'  style={{height:"100%", width: '100%', backgroundColor: '#DCDCDC', borderRadius : '6px'}}>
                                        <h5 className='mt-1'>이미지 없음</h5>
                                    </div>
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3', minHeight:'110px'}}>개선 방향</Col>
                            <Col xs='8' className='card_table col text center ' style={{borderBottom: '1px solid #B9B9C3'}}>
                            {data && data.defect && data.defect.repair_plan && 
                                <Row style={{width:'100%', paddingTop:'2%'}}>
                                    <div style={{whiteSpace:'break-spaces'}}>
                                        {data && data.defect && data.defect.repair_plan}
                                    </div>
                                </Row>
                            }
                            </Col>
                        </Row>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center ' style={{minHeight:'110px'}}>결정 사안</Col>
                            <Col xs='8' className='card_table col text center'>
                            {data && data.defect && data.defect.decision &&
                                <Row style={{width:'100%', paddingTop:'2%'}}>
                                    <div style={{whiteSpace:'break-spaces'}}>
                                        {data && data.defect && data.defect.decision}
                                    </div>
                                </Row>
                            }
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                            <div>비고</div>
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                            {data && data.defect && data.defect.description &&
                                <Row style={{width:'100%'}}>
                                    <div>
                                    {data && data.defect && data.defect.description}
                                    </div>
                                </Row>
                            }
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4'  className='card_table col col_color text center'>
                            <div>조치자</div>
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                {data && data.defect && data.defect.repair_user_name &&
                                <Row style={{width:'100%'}}>
                                    <div>
                                    {data && data.defect && data.defect.repair_user_name}
                                    </div>
                                </Row>
                                }
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>완료일자</Col>
                            <Col xs='8' className='card_table col text start '>
                                {data && data.defect && data.defect.repair_datetime && data.defect.repair_datetime.split('T')[0]}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                            <div>처리내용</div>
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                                {data && data.defect && data.defect.repair_detail && 
                                    <Row style={{width:'100%'}}>
                                        <div>
                                        {data && data.defect && data.defect.repair_detail}
                                        </div>
                                    </Row>
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>

                <Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%', borderTop: '1px solid #B9B9C3'}}>
                    <Button hidden={checkOnlyView(loginAuth, INSPECTION_DEFECT, 'available_delete')}
                        color= 'danger' style={{marginTop: '1%', marginRight: '1%'}} onClick={handleDelete}
                    >삭제</Button>
                    <Button hidden={checkOnlyView(loginAuth, INSPECTION_DEFECT, 'available_update')}
                        color='primary' style={{marginTop: '1%', marginRight: '1%'}} tag={Link} to={`${ROUTE_INSPECTION_DEFECT_FIX}/${defect_id}`} 
                    >수정</Button>
                    <Button style={{marginTop: '1%'}} tag={Link}
                        to={ROUTE_INSPECTION_DEFECT} 
                    >목록</Button>
                </Col>      
                </Row>
            </CardBody>
        </Card>
    </Fragment>
	)
}

export default DefectDetail