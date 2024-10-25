import { Fragment, useEffect } from "react"
import { Card, Row, Col, CardTitle, Badge } from "reactstrap"
import { reportNumberList, reportTypeList } from "../ReportData"
import * as moment from 'moment'
import Sign from "../detail/ReportSign"
import Cookies from "universal-cookie"

const ReportExportDetail = () => {
    const data = JSON.parse(localStorage.getItem('reportData'))
    const cookies = new Cookies()

    useEffect(() => {
        if (data) setTimeout(() => window.print(), 200)
    }, [data])

    return (
        <Fragment>
            <div id='print page'>
                {
                    data &&
                    <Card className="shadow-none">
                         <Row className="mb-1">
                            <Col md='7' xs='7' >
                                <Row style={{display:'flex', flexDirection:'row', flexWrap:'nowrap', width:'100%'}}>
                                    <CardTitle style={{width:'auto'}}>{data.title}</CardTitle><Badge color='light-skyblue' style={{width:'55px', height:'25px', fontSize:'15px'}}>{reportTypeList[data.main_purpose]}</Badge>
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
                                                                    {data.id}
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
                                                                    {reportNumberList[data.main_purpose]}
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
                                        <Row className='card_table top'>
                                            <Col md='6' xs='6'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                                        <div>작성일자</div>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                        <Row style={{width:'100%'}}>
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width:'100%'}}>
                                                                    {moment(data.create_datetime).format('YYYY-MM-DD (dddd)')}
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md='6' xs='6'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                                        <div>작성자</div>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                        <Row style={{width:'100%'}}>
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width:'100%'}}>
                                                                    {data.user}
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className='card_table top'>
                                            <Col>
                                                <Row className='card_table table_row'>
                                                    <Col lg='2' md='2' xs='2' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                                        <div>현장명</div>
                                                    </Col>
                                                    <Col lg='10' md='10' xs='10' className='card_table col text center'>
                                                        <Row style={{width:'100%'}}>
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', padding:0}}>
                                                                <Row style={{width:'100%'}}>
                                                                    {data.accident_title}
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
                            <Col md='5' xs='5'>
                                <Sign 
                                    userSign={data.sign_lines}
                                    signList={data.sign_lines.map(sign => sign.type)}
                                    signNameList={data.sign_lines.map(sign => sign.username)}
                                    completable={data.sign_lines.find(user => String(user.user) === cookies.get('userId'))}
                                />
                            </Col>
                        </Row>
                        { data.main_purpose !== 'accident' ? (
                            <Row className='card_table'>
                                <div className="mb-1">
                                    <Col className='card_table col text' style={{paddingBottom:0}}>
                                        <div style={{fontSize:'21px'}}>보고 내용</div>
                                    </Col>
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%', border:'1px solid #C1C1CB',  whiteSpace:'break-spaces'}}>
                                            <div style={{padding: '1rem'}}>
                                                {data.section_1}
                                            </div>
                                        </Row>
                                    </Col>
                                </div>
                            </Row>
                            ) : ( 
                                <>
                                    <Row className='card_table'>
                                        <div className="mb-1">
                                            <Col className='card_table col text' style={{paddingBottom:0}}>
                                                <div style={{fontSize:'21px'}}>사건 개요</div>
                                            </Col>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%', border:'1px solid #C1C1CB', whiteSpace:'break-spaces'}}>
                                                    <div style={{padding: '1rem'}}>
                                                        {data.event_outline}
                                                    </div>
                                                </Row>
                                            </Col>
                                        </div>
                                    </Row>
                                    <Row className='card_table'>
                                        <div className="mb-1">
                                            <Col className='card_table col text' style={{paddingBottom:0}}>
                                                <div style={{fontSize:'21px'}}>사진</div>
                                            </Col>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%', border:'1px solid #C1C1CB', alignItems:'center', padding:'0.5%'}}>
                                                    {data.report_files && 
                                                        data.report_files.map((file, idx) => {
                                                            if (file.type === 'picture') {
                                                                return (
                                                                    <Col md='4' xs='12' style={{display:'flex', justifyContent:'center', height:'fit-content'}}> 
                                                                        <Card style={{height:'fit-content'}}>
                                                                            <img key={idx} src={`/static_backend/${file.path}${file.file_name}`} style={{objectFit: 'scale-down' }} />
                                                                        </Card>
                                                                    </Col>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </Row>
                                            </Col>
                                        </div>
                                    </Row>
                                    <div className='page-break'/>
                                    <Row className='card_table'>
                                        <div className="mb-1">
                                            <Col className='card_table col text' style={{paddingBottom:0}}>
                                                <div style={{fontSize:'21px'}}>진행 경과</div>
                                            </Col>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%', border:'1px solid #C1C1CB', whiteSpace:'break-spaces'}}>
                                                    <div style={{padding: '1rem'}}>
                                                        {data.section_1}
                                                    </div>
                                                </Row>
                                            </Col>
                                        </div>
                                    </Row>
                                    <Row className='card_table'>
                                        <div className="mb-1">
                                            <Col className='card_table col text' style={{paddingBottom:0}}>
                                                <div style={{fontSize:'21px'}}>처리 예정</div>
                                            </Col>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%', border:'1px solid #C1C1CB', whiteSpace:'break-spaces'}}>
                                                    <div style={{padding: '1rem'}}>
                                                        {data.section_2}
                                                    </div>
                                                </Row>
                                            </Col>
                                        </div>
                                    </Row>
                                    <Row className='card_table'>
                                        <div className="mb-1">
                                            <Col className='card_table col text' style={{paddingBottom:0}}>
                                                <div style={{fontSize:'21px'}}>조치 결과</div>
                                            </Col>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%', border:'1px solid #C1C1CB', whiteSpace:'break-spaces'}}>
                                                    <div style={{padding: '1rem'}}>
                                                        {data.section_3}
                                                    </div>
                                                </Row>
                                            </Col>
                                        </div>
                                    </Row>
                                    <Row className='card_table top mb-1'>
                                        <Col>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='2' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                                    <div>조치 확인자</div>
                                                </Col>
                                                <Col lg='10' md='10' xs='10' className='card_table col text center'>
                                                    <Row style={{width:'100%'}}>
                                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', padding:0}}>
                                                            <Row style={{width:'100%'}}>
                                                                {data.confirm_employee}
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row> 
                                </>
                            )
                        }
                        <Row className='card_table mb-1'>
                            <Col>
                                <Row style={{borderBottom: '3px dotted #ccc', marginBottom:'1%'}}>
                                    <div>
                                        <Col className='card_table col text' >
                                            <div style={{fontSize:'21px'}}>첨부 자료{data.report_files.length}</div>
                                        </Col>
                                    </div>
                                </Row>
                                {data && data.report_files.map((file, idx) => {
                                    if (file.type === 'file') {
                                        let imagePath
                                        let file_path = file.original_file_name.split('.').pop()
                                        if (file_path === 'csv') {
                                            file_path = 'xlsx'
                                        } 
                                        try {
                                            imagePath = require(`../../../assets/images/icons/${file_path}.png`).default
                                        } catch (error) {
                                            imagePath = require('../../../assets/images/icons/unknown.png').default
                                        }
                                        return (
                                            <div key={`files-${idx}`}>
                                                <img src={imagePath} width='16' height='18' className='me-50' />
                                                <span className='text-muted fw-bolder align-text-top'>
                                                    {file.original_file_name}
                                                </span>
                                            </div>
                                        )
                                    }
                                })}
                            </Col>
                        </Row>
                    </Card>
                }
            </div>
        </Fragment>
    )

}

export default ReportExportDetail