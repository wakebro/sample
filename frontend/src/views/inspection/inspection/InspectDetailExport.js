import { useEffect } from "react"
import { CardBody, Col, Row } from "reactstrap"
import Sign from './Sign'
import Cookies from "universal-cookie"
import { useParams } from "react-router-dom"
import { QaListTemp, descriptionTemp } from "../data"
import { API_INSPECTION_ATTACHMENT_IMPORT } from '../../../constants'
import { customFileBadge } from '../../../utility/Utils'
import axios from "axios"

const InspectDetailExport = () => {
    const data = JSON.parse(localStorage.getItem('data'))
    const { id } = useParams() 
    const cookies = new Cookies()
	const signList = data.sign_list

    useEffect(() => {
        axios.get(API_INSPECTION_ATTACHMENT_IMPORT, {params: {property_id: cookies.get('property').value, id:id}})
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
    }, [id])
    useEffect(() => {
        setTimeout(() => window.print(), 100)
    }, [])

    return (
        <div className='print' style={{margin: '1%'}}>
            <Row>
                <Col md='7' xs='7'>
                    <Row className="mt-3">
                        <h2>{data['title']}</h2>
                    </Row>
                    <Row className='card_table top'>
                        <Col lg='4' md='4'>
                            <Row className='card_table table_row'>
                                <Col md='4' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
                                    건물
                                </Col>
                                <Col md='8' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
                                    {data.building}
                                </Col>
                            </Row>
                        </Col>
                        <Col lg='4' md='4'>
                            <Row className='card_table table_row'>
                                <Col md='4' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
                                    작성일자
                                </Col>
                                <Col md='8' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
                                    {data.write_datetime}
                                </Col>
                            </Row>
                        </Col>
                        <Col lg='4' md='4'>
                            <Row className='card_table table_row'>
                                <Col md='4' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
                                    관리자
                                </Col>
                                <Col md='8' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
                                    {data.user}
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
                                    {data.employee_class}
                                </Col>
                            </Row>
                        </Col>
                        <Col lg='4' md='4'>
                            <Row className='card_table table_row'>
                                <Col md='4' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
                                    직급
                                </Col>
                                <Col md='8' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
                                    {data?.employee_level}
                                </Col>
                            </Row>
                        </Col>
                        <Col lg='4' md='4'>
                            <Row className='card_table table_row'>
                                <Col md='4' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
                                    이름
                                </Col>
                                <Col md='8' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
                                    {data?.writer}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col md='5' xs='5'>
                    <Sign
                        userSign={signList}
                        signList={signList.map(sing => sing.type)}
                        signNameList={signList.map(sign => sign.username)}
                        completable={signList.find(user => String(user.user) === cookies.get('userId'))}
                    />
                </Col>
            </Row>
            <CardBody>
                <Row>
                    {
                        data.sections.map((data, i) => {
                            let check_hour = "\b"
                            if (data['check_hour'] !== null) {
                                if (data['check_hour'] < 10) {
                                    check_hour = `0${data['check_hour']}:00`
                                } else {
                                    check_hour = `${data['check_hour']}:00`
                                }
                            }
                            return (
                                <>
                                    <div style={{margin: '1%'}} >
                                        <Col  style={{marginTop : '1rem'}} lg='5' md='5' xl='5' xxl='5'>
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
                                    {/* <div className="section-break"/> */}
                                </>
                            )
                        })
                    }
                </Row>
            </CardBody>
            <CardBody style={{borderTop : '1px dashed #C1C1CB'}}>
                <Row>
                    <Col>
                        첨부파일 {data.file.length}개
                    </Col>
                </Row>
                {
                    data.file.map((data, i) => {
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
        </div>
    )
}

export default InspectDetailExport