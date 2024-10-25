import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { API_DISASTER_WORKER_QNA_DETAIL, ROUTE_CRITICAL_DISASTER_WORKER_QNA } from '../../../../constants'
import { axiosDeleteParm, checkOnlyView, dateFormat, getObjectKeyCheck, getTableDataCallback } from '../../../../utility/Utils'
import Cookies from 'universal-cookie'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import FileDetailDownload from '../../../apps/customFiles/FileDetailDownload'
import { useSelector } from 'react-redux'
import { CRITICAL_QNA } from '../../../../constants/CodeList'

const WorkerQnaDetail = () => {
    useAxiosIntercepter()
    const { id } = useParams()
    const loginAuth = useSelector((state) => state.loginAuth)
    const [detail, setDetail] = useState({})
    const [mainProperty, setMainProperty] = useState('')
    const [isModify, setIsModify] = useState(false)
	const cookies = new Cookies()
    const activeUser = Number(cookies.get('userId'))
    const navigate = useNavigate()
    const [files, setFiles] = useState([])

    const handleDelete = () => {
        axiosDeleteParm('의견', `${API_DISASTER_WORKER_QNA_DETAIL}/${id}`, {}, ROUTE_CRITICAL_DISASTER_WORKER_QNA, navigate)
    }

    const handleModify = () => {
        navigate(`${ROUTE_CRITICAL_DISASTER_WORKER_QNA}/form`, {state:{type:'modify', id:id}})
    }

    const setDetailPage = (data) => {
        setDetail(data)
        setMainProperty(`${data.property.name} (${data.property.code})`)
        setIsModify(activeUser === Number(data.user.id))
        setFiles(data.qna_files)
    }
    useEffect(() => {
        getTableDataCallback(`${API_DISASTER_WORKER_QNA_DETAIL}/${id}`, {}, setDetailPage)
    }, [])
    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='종사자의견상세' breadCrumbParent='종사자의견청취' breadCrumbActive={'종사자의견상세'} />
                </div>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                종사자의견상세
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                        <Row className="mx-0 mb-2">
                            <Col>
                                <Row>
                                    <Col xs={3} className="d-flex card_table col_color text center border-y risk-report text-bold">
                                        제목
                                    </Col>
                                    <Col className="d-flex card_table top">
                                        {getObjectKeyCheck(detail, 'title')}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={3} xs={6} className="d-flex card_table col_color border-b text center risk-report text-bold">
                                        사업소 소속
                                    </Col>
                                    <Col className="card_table mid text center risk-report text-normal">
                                        {mainProperty}
                                    </Col>
                                    <Col md={3} xs={6} className="d-flex card_table col_right border-b text center risk-report text-bold">
                                        작성일자
                                    </Col>
                                    <Col className="card_table mid text center risk-report text-normal">
                                        {dateFormat(getObjectKeyCheck(detail, 'create_datetime'))}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={3} xs={6} className="d-flex card_table col_color border-b text center risk-report text-bold">
                                        성명
                                    </Col>
                                    <Col className="card_table mid text center risk-report text-normal">
                                        {getObjectKeyCheck(detail, 'worker_name')}
                                    </Col>
                                    <Col md={3} xs={6} className="d-flex card_table col_right border-b text center risk-report text-bold">
                                        서명
                                    </Col>
                                    <Col className="card_table mid text center risk-report text-normal">
                                        { getObjectKeyCheck(detail, 'worker_sign') === null || getObjectKeyCheck(detail, 'worker_sign') === '' ?
                                            '이미지 없음'
                                            :
                                            <img src={`/static_backend/${getObjectKeyCheck(detail, 'worker_sign')}`} className='sign-image'/>
                                        }
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} className="border-left d-flex card_table col col_color border-b text center risk-report text-bold">
                                        {'현재상황 (안전/보건/유해/위험/시설/장소 내용)'}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="d-flex border-left card_table mid text start" style={{minHeight:'200px', alignItems: 'start', whiteSpace:'pre-line'}}>
                                        {getObjectKeyCheck(detail, 'current_problem')}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} className="d-flex card_table col col_color border-b text center risk-report text-bold">
                                        {'개선 건의(제안) 사항'}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="d-flex border-left card_table mid text start" style={{minHeight:'200px', alignItems: 'start', whiteSpace:'pre-line'}}>
                                        {getObjectKeyCheck(detail, 'improvement')}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <FileDetailDownload
                            detailFiles={files}
                        />
                        </CardBody>
                        <CardFooter className="d-flex justify-content-end">
                            { isModify ?
                                <>
                                    <Button hidden={checkOnlyView(loginAuth, CRITICAL_QNA, 'available_delete')} color='danger' className='me-1' onClick={handleDelete}>삭제</Button>
                                    <Button hidden={checkOnlyView(loginAuth, CRITICAL_QNA, 'available_update')} color="primary" className="me-1" onClick={handleModify}>수정</Button>
                                </>
                                :
                                <></>
                            }
                            <Button className="me-1" tag={Link} to={ROUTE_CRITICAL_DISASTER_WORKER_QNA}>목록</Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default WorkerQnaDetail