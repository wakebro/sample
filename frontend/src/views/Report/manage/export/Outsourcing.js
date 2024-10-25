import axios from "axios"
import { Fragment, useEffect, useState } from "react"
import { Badge, Button, Card, Col, Row } from "reactstrap"
import Cookies from "universal-cookie"
import { API_REPORT_MANAGE_OUTSOURCING } from "../../../../constants"
import { reportNumberList } from "../../ReportData"
import * as moment from 'moment'
import Sign from "../../detail/ReportSign"
import ExportDataTable from "../../Export/ExportDataTable"

const Outsourcing = () => {
    const start_date = localStorage.getItem('start_date')
    const end_date = localStorage.getItem('end_date')
    const employeeClass = localStorage.getItem('employeeClassOutsourcing')
    const cookies = new Cookies
    const [detail, setDetail] = useState([])
    const [list, setList] = useState([])

    const columns = [
        {
            name: '일자',
            cell: row => row.create_datetime && moment(row.create_datetime).format('YYYY-MM-DD'),
            width: '150px'
        },
        {
            name: '점검일지명',
            cell: row => row.title && row.title,
            minWidth: '100px'
        },
        {
            name: '작성자',
            cell: row => row.username,
            width: '150px'
        },
        {
            name: '담당자확인',
            cell: row => {
                if (row.sign_lines[0].username) {
                    return row.sign_lines[0].username
                }
                return ''
            },
            width: '150px'

        },
        {
            name: '1차 결재자',
            cell: row => {
                if (row.sign_lines[1].username) {
                    return row.sign_lines[1].username
                }
                return ''
            },
            width: '150px'

        },
        {
            name: '2차 결재자',
            cell: row => {
                if (row.sign_lines[2].username) {
                    return row.sign_lines[2].username
                }
                return ''
            },
            width: '150px'

        },
        {
            name: '최종 결재자',
            cell: row => {
                if (row.sign_lines[3].username) {
                    return row.sign_lines[3].username
                }
                return ''
            },
            width: '150px'
        }
    ]

    useEffect(() => {
        axios.get(API_REPORT_MANAGE_OUTSOURCING,  {params: {property_id: cookies.get('property').value, start_date: start_date, end_date: end_date, employee_class: employeeClass}})
        .then((res) => {
            setList(res.data.list)
            setDetail(res.data.detail)
        })
        .catch(err => {
            console.error(err)
        })
    }, [])

    useEffect(() => {
        if (detail.length > 0) setTimeout(() => window.print(), 200)
    }, [detail])

    return (
        <Fragment>
            <div id='print'>
            {
                detail &&
                <Card className="shadow-none">
                    <ExportDataTable
                        tableData={list}
                        columns={columns}
                    />
                    <div className='page-break'/>
                    {detail.map((item, index) => {
                        const lastIndex = detail.length - 1
                        return (
                            <div style={{padding: '1%'}} key={item.id}>
                                <Row className="mb-1">
                                    <Col md='7' xs='12' >
                                        <Row>
                                            <Col>
                                                <Row className='card_table table_row'>
                                                    <Col className='card_table col text'>
                                                        <Row style={{width:'100%'}}>
                                                            <h2>{item.title}</h2>
                                                        </Row>
                                                    </Col>
                                                </Row>
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
                                                                            {moment(item.create_datetime).format('YYYY-MM-DD (dddd)')}
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
                                                                            {item.user}
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
                                                                            {item.site_name}
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
                                                                            {item.emp_class && item.emp_class.code }
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
                                    {/* <Col md='5' xs='12' className='p-0'> */}
                                    <Col md='5' xs='12'>
                                        <Sign
                                            userSign={item.sign_lines}
                                            signList={item.sign_lines.map(sign => sign.type)}
                                            signNameList={item.sign_lines.map(sign => sign.username)}
                                            completable={item.sign_lines.find(user => String(user.user) === cookies.get('userId'))}
                                        />
                                    </Col>
                                </Row>
                                <Row className='card_table'>
                                    <div className="mb-1">
                                        <Col className='card_table col text' style={{paddingBottom:0}}>
                                            <div style={{fontSize:'21px'}}>보고 내용</div>
                                        </Col>
                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                            <Row style={{width:'100%', border:'1px solid #C1C1CB', whiteSpace:'break-spaces'}}>
                                                <div style={{padding: '1rem'}}>
                                                    {item.report_content}
                                                </div>
                                            </Row>
                                        </Col>
                                    </div>
                                </Row>
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
                                            // if (file.type === 'file') {
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
                                                    <div key={idx}>
                                                        {/* <a onClick={() => handleDownload(file.file_name, file.original_file_name)}> */}
                                                        <img src={imagePath} width='16' height='18' className='me-50' />
                                                        <span className='text-muted fw-bolder align-text-top'>
                                                            {file.original_file_name}
                                                        </span>
                                                        {/* </a> */}
                                                    </div>
                                                )
                                            // }
                                        })}
                                    </Col>
                                </Row>
                                {  index !== lastIndex &&
                                    <div className='page-break'/>
                                }                            
                            </div>
                        )
                    })}
                </Card>
            }
            </div>
        </Fragment>
    )
}

export default Outsourcing