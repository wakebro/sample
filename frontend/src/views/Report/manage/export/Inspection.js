import axios from "axios"
import { Fragment, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as moment from 'moment'
import { Button, Col, Row, Card, CardBody } from "reactstrap"
import Cookies from "universal-cookie"
import { API_REPORT_MANAGE_INSPECTION } from "../../../../constants"
import { descriptionTemp, QaListTemp, scoreChoiceList, OXChoiceList, fiveSelectList } from "../../../inspection/data"
import Sign from "../../detail/ReportSign"
import ExportDataTable from "../../Export/ExportDataTable"
import {customFileBadge} from '../../../../utility/Utils'

const Inspection = () => {
    const cookies = new Cookies()
    const start_date = localStorage.getItem('start_date')
    const end_date = localStorage.getItem('end_date')
    const employeeClass = localStorage.getItem('employeeClassInspection')

    const [data, setData] = useState([])

    const columns = [
        {
            name: '점검일',
            cell: row => moment(row.target_datetime).format('YYYY-MM-DD'),
            minWidth: '150px'
        },
        {
            name: '직종',
            cell: row => row.employee_class,
            minWidth: '100px'
        },
        {
            name: '점검일지명',
            cell: row => row.title,
            minWidth: '215px'
        },
        {
            name: '양식번호',
            cell: row => row.templete_code,
            minWidth: '100px'
        },
        {
            name: '일자번호',
            cell: row => row.id,
            minWidth: '120px'
        },
        {
            name: '담당자',
            cell: row => row.user,
            minWidth: '120px'
        },
        {
            name: '최종결재자',
            cell: row => {
                if (row.sign_list[3] !== undefined) {
                    if (row.sign_list[3].username !== null) {
                        return (
                            row.sign_list[3].username
                            )
                    } else {
                        return (
                            null
                        )
                    }
                }
            },
            minWidth: '120px'
        },
        {
            name: '완료여부',
            cell: row => {
                if (row.is_completabled) {
                    return (
                        '예'
                    )
                } else {
                    return (
                        '아니요'
                    )
                }
            },
            minWidth: '100px'
        }
    ]
    const defaultValues = {} 
    const {
		setValue
	} = useForm({
		defaultValues : defaultValues
	})

    useEffect(() => {
        axios.get(API_REPORT_MANAGE_INSPECTION, {params: {property_id:cookies.get('property').value, start_date: start_date, end_date: end_date, employee_class: employeeClass, type: localStorage.getItem('inspectionType')}
        }).then(res => {
            res.data.map((data) => {
                data.sections.forEach((section) => {
                    section.questions.forEach((v) => {
                        if (v['use_description']) {
                            setValue(`discription_${v['id']}`, v['description'])
                        }
                        if (v['is_choicable']) {
                            setValue(`result_${v['id']}`, v['answer'])
                        } else {
                            if (v['choice_type'] === 0) {
                                if (v['answer'] !== "") {
                                    setValue(`result_${v['id']}`, scoreChoiceList.find(item => item.value === parseInt(v['answer'])))
                                } else {
                                    setValue(`result_${v['id']}`, {label:'선택', value : ""})
                                }
                            } else if (v['choice_type'] === 1) {
                                if (v['answer'] !== "") {
                                    setValue(`result_${v['id']}`, OXChoiceList.find(item => item.value === parseInt(v['answer'])))
                                } else {
                                    setValue(`result_${v['id']}`, {label:'선택', value : ""})
                                }
                            } else if (v['choice_type'] === 2) {
                                if (v['answer'] !== "") {
                                    setValue(`result_${v['id']}`, fiveSelectList.find(item => item.value === parseInt(v['answer'])))
                                } else {
                                    setValue(`result_${v['id']}`, {label:'선택', value : ""})
                                }
                            }
                        }
                    })
                })
            })
            setData(res.data)
        }).catch(res => {
            console.log(res, "!!!!!!!!error")
        })
    }, [])
    
    useEffect(() => {
        if (data.length > 0) setTimeout(() => window.print(), 200)
    }, [data])
    return (
        <Fragment>
            <div id='print' className='print' style={{margin: '1%'}}>
                {data && (
                <Card className="shadow-none">
                    <ExportDataTable 
                        tableData={data}
                        columns={columns}
                    />
                    <div className='page-break'></div>
                    {data.map((item, index) => {
                        console.log(item)
                        const lastIndex = data.length - 1
                        return (
                        <div key={item.id} style={{padding: '1%'}}>
                            <Row>
                                <Col md='7' xs='7'>
                                    <Row className="mt-3">
                                        <h2>{item.title}</h2>
                                    </Row>
                                    <Row className='card_table top'>
                                        <Col lg='4' md='4'>
                                            <Row className='card_table table_row'>
                                                <Col md='4' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    건물
                                                </Col>
                                                <Col md='8' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    {item.building}
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg='4' md='4'>
                                            <Row className='card_table table_row'>
                                                <Col md='4' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    작성일자
                                                </Col>
                                                <Col md='8' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    {moment(item.target_datetime).format('YYYY-MM-DD')}
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg='4' md='4'>
                                            <Row className='card_table table_row'>
                                                <Col md='4' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    관리자
                                                </Col>
                                                <Col md='8' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    {item.user}
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mid'>
                                        <Col lg='4' md='4'>
                                            <Row className='card_table table_row'>
                                                <Col md='4' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    직종
                                                </Col>
                                                <Col md='8' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    {item.employee_class}
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg='4' md='4'>
                                            <Row className='card_table table_row'>
                                                <Col md='4' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    직급
                                                </Col>
                                                <Col md='8' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    {item.employee_level}
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg='4' md='4'>
                                            <Row className='card_table table_row'>
                                                <Col md='4' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    이름
                                                </Col>
                                                <Col md='8' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
                                                    {item.user_name}
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md='5' xs='5'>
                                    <Sign
                                        userSign={item.sign_list}
                                        signList={item.sign_list.map(sign => sign.type)}
                                        signNameList={item.sign_list.map(sign => sign.username)}
                                        completable={item.sign_list.find(user => String(user.user) === cookies.get('userId'))}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                {
                                    item.sections.map((data, i) => {
                                        let check_hour = "\b"
                                        if (data['check_hour'] !== null) {
                                            if (data['check_hour'] < 10) {
                                                check_hour = `0${data['check_hour']}:00`
                                            } else {
                                                check_hour = `${data['check_hour']}:00`
                                            }
                                        }
                                        return (
                                            <div style={{margin: '1%'}}>
                                                <Col  style={{marginTop : '1rem'}} lg='5' md='11'>
                                                    <Row className='mt-1 mb-1'>
                                                        <Col style={{fontFamily : 'Montserrat,sans-serif', fontWeight : '900'}}>
                                                            {check_hour}
                                                        </Col>
                                                    </Row>
                                                    <Row style={{borderBottom : '1px solid #D8D6DE'}}>
                                                        <Col style={{fontFamily : 'Montserrat,sans-serif', fontWeight : '900'}}>
                                                            {data['title']}
                                                        </Col>
                                                        <Col>
                                                            점검결과
                                                        </Col>
                                                        {descriptionTemp(data)}
                                                    </Row>
                                                    {QaListTemp(data, i)}
                                                </Col>
                                                <Col lg='1' md='1'>
                                                </Col>
                                            </div>
                                        )
                                    })
                                }
                            </Row>
                            <CardBody className='pt-2' style={{borderTop : '1px dashed #C1C1CB'}}>
                                <Row>
                                    <Col>
                                        첨부파일 {item.file.length}개
                                    </Col>
                                </Row>
                                {
                                    item.file.map((data, i) => {
                                        return (
                                            <Row key={i} >
                                                <Col>
                                                    <span style={{cursor:'pointer'}}>{customFileBadge(data['ext'])}{data['name']}</span>
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                            </CardBody>
                            {  index !== lastIndex &&
                                <div className='page-break'/>
                            } 
                        </div>
                        )
                    })}
                </Card>
                )}
            </div>
        </Fragment>
    )
}

export default Inspection