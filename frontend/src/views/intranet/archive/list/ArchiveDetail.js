import axios from 'axios'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, CardFooter } from "reactstrap"
import { API_INTRANET_ARCHIVE, ROUTE_INTRANET_ARCHIVE, ROUTE_INTRANET_ARCHIVE_FORM } from "../../../../constants"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import * as moment from 'moment'
import { axiosDeleteParm, checkOnlyView, handleDownload } from '../../../../utility/Utils'
import { useSelector } from 'react-redux'
import { INTRANET_ARCHIVES } from '../../../../constants/CodeList'

const ArchiveDetail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const { id } = useParams()
    const [data, setData] = useState([])
    const navigate = useNavigate()

    const handleDeleteSubmit = () => {
        axiosDeleteParm('자료실', `${API_INTRANET_ARCHIVE}/${id}`, {}, ROUTE_INTRANET_ARCHIVE, navigate)
	}

    useEffect(() => {
		axios.get(`${API_INTRANET_ARCHIVE}/${id}`)
		.then(res => {
            console.log(res.data)
			setData(res.data)
		})
    }, [])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='자료실' breadCrumbParent='인트라넷' breadCrumbActive='자료실' />
                </div>
            </Row>
            <Card>
				<CardHeader>
					<CardTitle className="title">
                        {data.subject}
					</CardTitle>
				</CardHeader>
                <CardBody>
                    <Row style={{width:'100%', textAlign: 'right' }}>
                        <Col md={6}/>
                        <Col md={2} style={{padding:'inherit'}}>직종 : {data.employee_class}</Col>
                        <Col md={2} style={{padding:'inherit'}}>작성자 : {data.user}</Col>
                        <Col md={2} style={{padding:'inherit'}}>등록일 : {moment(data.create_datetime).format('YYYY-MM-DD')}</Col>
                    </Row>
                    <Row className='card_table'>
                        <div className="mb-1">
                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                <Row style={{width:'100%', whiteSpace:'break-spaces'}}>
                                    <div>{data.contents}</div>
                                </Row>
                            </Col>
                        </div>
                    </Row>
                    <Row className='card_table' style={{marginBottom:'1%'}}>
                        <Col style={{borderTop: '3px dotted #ccc'}}>
                            {data.archive_files && 
                                <Col lg='4' md='4' xs='4' className='card_table col text' style={{fontSize:'18px'}}>
                                    첨부파일 {data.archive_files.length}
                                </Col>
                            }
                                {data.archive_files && data.archive_files.map((file, idx) => {
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
                        <Button hidden={checkOnlyView(loginAuth, INTRANET_ARCHIVES, 'available_update')}
                            type='button' color="danger" onClick={handleDeleteSubmit}>삭제</Button>
                        <Button type='submit' color='primary' 
                            className="ms-1"
                            hidden={checkOnlyView(loginAuth, INTRANET_ARCHIVES, 'available_delete')}
                            tag={Link} 
                            to={ROUTE_INTRANET_ARCHIVE_FORM} 
                            state={{
                                title: "공지사항",
                                key: "announcement",
                                API: API_INTRANET_ARCHIVE,
                                type:'modify',
                                id: id
                            }}>수정</Button>
                            <Button
                                className="ms-1"
                                tag={Link} 
                                to={ROUTE_INTRANET_ARCHIVE}
                                state={{
                                    key: 'anouncement'
                                }} >목록</Button>
                        </Fragment>
                    </CardFooter>
                </CardBody>
			</Card>
        </Fragment>
    )


}
export default ArchiveDetail