import { Fragment, useEffect, useState } from "react"
import { Badge, Button, Card, CardTitle, Col, Row } from "reactstrap"
import { API_OPERATE_REPORT_EXPORT_REPORT } from "../../../../constants"
import Sign from "../../detail/ReportSign"
import { reportNumberList, reportTypeList } from "../../ReportData"
import * as moment from 'moment'
import Cookies from "universal-cookie"
import axios from "axios"
import 'moment/locale/ko'
import ExportDataTable from "../../Export/ExportDataTable"

const Report = () => {
    const startDate = localStorage.getItem('start_date')
    const endDate = localStorage.getItem('end_date')
    const mainPurpose = localStorage.getItem('main_purpose')
    const [userData, setUserData] = useState([])
    const cookies = new Cookies()

    const columns = [
        {
            name:'작성일자',
            with:'10%',
            cell: row => <Fragment key={row.id}>{moment(row.create_datetime).format('YYYY/MM/DD')}</Fragment>
        },
        {
            name:'종류',
            with:'5%',
            cell: row => <Fragment key={row.id}>{reportTypeList[row.main_purpose]}</Fragment>
        },
        {
            name:'현장명',
            with:'30%',
            cell: row => <Fragment>{row.accident_title}</Fragment>
        },
        {
            name:'보고서명',
            width:'35%',
            cell: row =>  { 
                if (row.is_completabled === false) {
                    return (
                        <Fragment key={row.id}>
                            <Badge color='light-success' style={{paddingTop:'6px', marginRight:'1%'}}> 임시저장 </Badge>
                            <span style={{ width:'100%', textAlign: 'left' }} >{row.title}</span>
                        </Fragment>
                    )
                } else {
                    return (
                        <Fragment key={row.id}>
                            <span style={{ width:'100%', textAlign: 'left' }} >{row.title}</span>
                        </Fragment>) 
                }
            }
        },
        {
            name:'작성자',
            with:'10%',
            cell: row => <Fragment key={row.id}>{row.user}</Fragment>
        },
        {
            name:'결재',
            with:'10%',
            cell: row => { 
                let count = 0
                row.sign_lines.map((user) => {
                    if (user.type === 1 || user.type === 2) {
                        count++
                    }
                })
                if (count === 4) {
                    return (
                        <div key={row.id} color='report'>완료</div>
                    )
                } else {
                    return (
                        <div key={row.id} color='danger'>미완료</div>
                    )
                }
            }
        }
    ]

    useEffect(() => {
        axios.get(API_OPERATE_REPORT_EXPORT_REPORT, {params :{property_id: cookies.get('property').value, start_date: startDate, end_date: endDate, main_purpose: mainPurpose} })
        .then((res) => {
            setUserData(res.data)
        })
    }, [])

    useEffect(() => {
        if (userData.length > 0) setTimeout(() => window.print(), 200)
    }, [userData])

    return (
        <Fragment>
            <div id="print page">
            {
                userData && userData.length > 0 &&
                <>
                    <ExportDataTable 
                        tableData={userData}
                        columns={columns}
                    />
                    <div className='page-break'/>
                    <Card className="shadow-none">
                        {userData.map((item, index) => {
                            const lastIndex = userData.length - 1
                            return (
                                // item.main_purpose !== 'accident' ? (
                                    <>
                                    <Row className="mb-1">
                                        <Col md='7' xs='7' >
                                            <Row style={{display:'flex', flexDirection:'row', flexWrap:'nowrap', width:'100%'}}>
                                                <CardTitle style={{width:'auto'}}>{item.title}</CardTitle><Badge color='light-skyblue' style={{width:'55px', height:'25px', fontSize:'15px'}}>{reportTypeList[item.main_purpose]}</Badge>
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
                                                                                {item.id}
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
                                                                                {reportNumberList[item.main_purpose]}
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
                                                                                {moment(item.create_datetime).format('YYYY-MM-DD (dddd)')}
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
                                                                                {item.user}
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
                                                                                {item.accident_title}
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
                                                userSign={item.sign_lines}
                                                signList={item.sign_lines.map(sign => sign.type)}
                                                signNameList={item.sign_lines.map(sign => sign.username)}
                                                completable={item.sign_lines.find(user => String(user.user) === cookies.get('userId'))}
                                            />
                                        </Col>
                                    </Row>
                                    {
                                        item.main_purpose !== 'accident' ? (
                                        <Row className='card_table'>
                                            <div className="mb-1">
                                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                                    <div style={{fontSize:'21px'}}>보고 내용</div>
                                                </Col>
                                                <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                    <Row style={{width:'100%', border:'1px solid #C1C1CB',  whiteSpace:'break-spaces'}}>
                                                        <div style={{padding: '1rem'}}>
                                                            {item.section_1}
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
                                                                    {item.event_outline}
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
                                                                {item.report_files && 
                                                                    item.report_files.map((file, idx) => {
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
                                                                    {item.section_1}
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
                                                                    {item.section_2}
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
                                                                    {item.section_3}
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
                                                                            {item.confirm_employee}
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
                                                        <div style={{fontSize:'21px'}}>첨부 자료{item.report_files.length}</div>
                                                    </Col>
                                                </div>
                                            </Row>
                                            {item.report_files.map((file, idx) => {
                                                if (file.type === 'file') {
                                                    let imagePath
                                                    let file_path = file.original_file_name.split('.').pop()
                                                    if (file_path === 'csv') {
                                                        file_path = 'xlsx'
                                                    } 
                                                    try {
                                                        imagePath = require(`../../../../assets/images/icons/${file_path}.png`).default
                                                    } catch (error) {
                                                        imagePath = require('../../../../assets/images/icons/unknown.png').default
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
                                    {  index !== lastIndex &&
                                        <div className='page-break'/>
                                    }
                                </>
                            )
                        })}
                    </Card>
                </>
            }
            </div>
        </Fragment>
    )
}

export default Report