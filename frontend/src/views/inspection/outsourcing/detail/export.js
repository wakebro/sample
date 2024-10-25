/* eslint-disable */
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Badge, Card, CardBody, Col, Row } from "reactstrap"
import { API_INSPECTION_OUTSOURCING_DETAIL, API_INSPECTION_OUTSOURCING_IMPORT } from "../../../../constants"
import { reportNumberList, reportTypeList } from "../register/ReportData"
import * as moment from 'moment'
import Sign from "../../inspection/Sign"


const OutsourcingExport = () => {
    const { id } = useParams()
    const [userData, setUserData] = useState([])
    const [userSign, setUserSign] = useState(["", "", "", ""])
    
    useEffect(() => {
        axios.get(API_INSPECTION_OUTSOURCING_DETAIL,  {params: {outsourcing_id: id}})
        .then((response) => {
            setUserData(response.data)
            setUserSign(response.data.sign_lines)
        })
        .catch(error => {
            console.error(error)
        })
        axios.get(API_INSPECTION_OUTSOURCING_IMPORT, {params: {outsourcing_id: id}})
        .then((res) => {
            axios({
                url: res.data.url,
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                console.log(response.data)
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
    }, [])

    useEffect(() => {
        setTimeout(() => window.print(), 300)
    }, [])

    return (
        <Card className="shadow-none">
            <CardBody>
                <Row className="mb-1">
                    <Col md='8' xs='12' >
                        <Row>
                            <Col md='6'>
                                <Row className='card_table table_row'>
                                    <Col className='card_table col text'>
                                        <Row style={{width:'100%'}}>
                                            <h2>{userData.title}</h2>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md='6' style={{paddingTop:'1%'}}>
                                <Badge color='light-skyblue' style={{width:'55px', height:'25px', fontSize:'15px'}}>{reportTypeList[userData.main_purpose]}</Badge>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='12' xs='12' style={{paddingBottom:'1%'}}>
                                <Row className='card_table top' style={{borderBottom:0, borderTop:0, borderRight:0}}>
                                    <Col md='6' xs='6'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight:'1px solid #B9B9C3'}}>
                                                <div>문서 번호</div>
                                            </Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            {userData.id}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md='6' xs='6'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col text center' style={{ borderRight:'1px solid #B9B9C3'}}>
                                                <div>양식 번호</div>
                                            </Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            {reportNumberList[userData.main_purpose]}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='12' xs='12' className="mb-1">
                                <Row className='card_table top' style={{borderTop:0, borderBottom:0}}>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3', borderTop:'1px solid #B9B9C3'}}>
                                                <div>작성일자</div>
                                            </Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center'  style={{borderTop: '1px solid #B9B9C3'}}>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            {moment(userData.create_datetime).format('YYYY-MM-DD (dddd)')}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3', borderTop:'1px solid #B9B9C3'}}>
                                                <div>작성자</div>
                                            </Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center' style={{borderTop:'1px solid #B9B9C3'}}>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            {userData.user}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid' style={{borderTop:0}}>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3', borderTop: '1px solid #B9B9C3'}}>
                                                <div>현장명</div>
                                            </Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center' style={{ borderTop: '1px solid #B9B9C3'}}>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            {userData.site_name}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3', borderTop: '1px solid #B9B9C3'}}>
                                                <div>직종</div>
                                            </Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center' style={{borderTop: '1px solid #B9B9C3'}}>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            {userData.emp_class && userData.emp_class.code }
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col md='4' xs='12' className='p-0'>
                        <Sign
                            userSign={userSign}
                            signList={userSign.map(sign => sign.type)}
                            signNameList={userSign.map(sign => sign.username)}
                            // completable={userSign.find(user => String(user.user) === cookies.get('userId'))}
                        />
                    </Col>
                </Row>
                <Row className='card_table'>
                    <div className="mb-1">
                        <Col className='card_table col text' style={{paddingBottom:0}}>
                            <div style={{fontSize:'21px'}}>보고 내용</div>
                        </Col>
                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                            <Row style={{width:'100%', minHeight: '35rem', border:'1px solid #C1C1CB', whiteSpace:'break-spaces'}}>
                                <div style={{padding: '1rem'}}>
                                    {userData.report_content}
                                </div>
                            </Row>
                        </Col>
                    </div>
                </Row>
            </CardBody>
        </Card>
    )
}

export default OutsourcingExport