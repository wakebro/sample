import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, CardFooter } from "reactstrap"
import { API_INTRANET_ANOUNCEMENT, API_SYSTEMMGMT_BASIC_INFO_PROPERTY, ROUTE_INTRANET_ANNOUNCEMENT, ROUTE_INTRANET_ANNOUNCEMENT_FORM } from "../../../../constants"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import * as moment from 'moment'
import 'moment/locale/ko'
import { axiosDeleteParm, checkOnlyView, getTableDataCallback, handleDownload } from '../../../../utility/Utils'
import { INTRANET_ANNOUNCEMENT } from '../../../../constants/CodeList'
import { useSelector } from 'react-redux'
import Cookies from 'universal-cookie'

const AnnouncementDetail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const { id } = useParams()
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const cookies = new Cookies()
    const property_id = cookies.get("property").value

    const [isHighProperty, setIsHighProperty] = useState(false)
    const [isProperty, setIsProperty] = useState(false)

    const handleDeleteSubmit = () => {
        axiosDeleteParm('공지사항', `${API_INTRANET_ANOUNCEMENT}/${id}`, {}, ROUTE_INTRANET_ANNOUNCEMENT, navigate)
	}

    useEffect(() => {
        getTableDataCallback(`${API_SYSTEMMGMT_BASIC_INFO_PROPERTY}/${property_id}`, {}, (data) => {
            const tempIsHighProperty = data?.high_property
            if (typeof tempIsHighProperty === 'boolean') setIsHighProperty(tempIsHighProperty)
        })
        getTableDataCallback(`${API_INTRANET_ANOUNCEMENT}/${id}`, {}, (data) => {
            setData(data)
            setIsProperty(data?.property === property_id)
        })
    }, [])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='공지사항' breadCrumbParent='인트라넷' breadCrumbActive='공지사항' />
                </div>
            </Row>
            <Card>
				<CardHeader>
					<CardTitle className="title">
                        {data.subject}
					</CardTitle>
				</CardHeader>
                <CardBody>
                    <Row style={{width:'100%', textAlign: 'right'}}>
                        <Col md={7}/>
                        <Col md={2} xs={4}style={{padding:'inherit'}}>작성자 : {data.user}</Col>
                        <Col md={3} xs={8} style={{padding:'inherit'}}>등록일 : {moment(data.create_datetime).format('YYYY.MM.DD')}({moment(data.create_datetime).fromNow()})</Col>
                    </Row>
                    <Row className='card_table'>
                        <div className="mb-1">
                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                <Row style={{height: '100%', width:'100%'}}>
                                    <Col className='risk-report content-h px-2 py-2' style={{overflowX: 'auto'}} dangerouslySetInnerHTML={{__html: data && data.contents}}>
                                    </Col>
                                </Row>   
                            </Col>
                        </div>
                    </Row>
                    <Row className='card_table' style={{marginBottom:'1%'}}>
                        <Col style={{borderTop: '3px dotted #ccc'}}>
                            {data.announcement_files && 
                                <Col lg='4' md='4' xs='4' className='card_table col text' style={{fontSize:'18px'}}>
                                    첨부파일 {data.announcement_files.length}
                                </Col>
                            }
                            {data.announcement_files && data.announcement_files.map((file, idx) => {
                                let imagePath
                                try {
                                imagePath = require(`../../../../assets/images/icons/${file.original_file_name.split('.').pop()}.png`).default
                                } catch (error) {
                                imagePath = require('../../../../assets/images/icons/unknown.png').default
                                }
                                return (
                                    <div key={idx}>
                                        <a onClick={() => handleDownload(`${file.path}${file.file_name}`, file.original_file_name)}>
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
                            { (isHighProperty || isProperty) && 
                                <>
                                    <Button hidden={checkOnlyView(loginAuth, INTRANET_ANNOUNCEMENT, 'available_delete')}
                                        type='button' color="danger" onClick={handleDeleteSubmit}>삭제</Button>
                                    <Button type='submit' color='primary' 
                                        hidden={checkOnlyView(loginAuth, INTRANET_ANNOUNCEMENT, 'available_update')}
                                        className="ms-1"
                                        tag={Link} 
                                        to={ROUTE_INTRANET_ANNOUNCEMENT_FORM} 
                                        state={{
                                            title: "공지사항",
                                            key: "announcement",
                                            API: API_INTRANET_ANOUNCEMENT,
                                            type:'modify',
                                            id: id
                                        }}>
                                        수정
                                    </Button>
                                </>
                            }
                            <Button
                                className="ms-1"
                                tag={Link} 
                                to={ROUTE_INTRANET_ANNOUNCEMENT}
                                state={{ key: 'anouncement' }}>
                                목록
                            </Button>
                        </Fragment>
                    </CardFooter>
                </CardBody>
			</Card>
        </Fragment>
    )


}
export default AnnouncementDetail