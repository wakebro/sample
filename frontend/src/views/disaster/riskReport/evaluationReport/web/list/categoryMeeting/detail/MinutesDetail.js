/* eslint-disable */
import { Card, CardBody, Col, Row, Badge, CardFooter, Button, CardHeader, CardTitle } from "reactstrap"
// import { ROUTE_CRITICAL_DISASTER_EVALUATION } from '../../../../../../../../constants'
import { CustomBadge } from "../../../Component"
import { FooterLineDetail } from "../../EvaluationDetail"
import { handleDownload } from "../../../../../../../../utility/Utils"
// import { signAuthCheck } from '@utils'

const MinutesDetail = (props) => {
    const {data, isSign, setIsSign, isSignAuth, userSign, setUserSign, isChargeSign, setIsChargeSign, isManager, isReject, isChargerCheck, isInCharge } = props

    return (
        <Card>
            <CardHeader>
                <CardTitle md='9' xs='8' className="risk-report title-bold d-flex align-items-center">
                    {data.minutes_title}&nbsp;
                    {isManager && data.minutes_completed !== true ?
                        (isManager || isSignAuth) &&
                        <CustomBadge color='light-danger'>작성중</CustomBadge>
                    :
                        (isManager || isSignAuth) &&
                        <CustomBadge color='light-success'>작성완료</CustomBadge>
                    }
                </CardTitle>
            </CardHeader>

            <CardBody>
                <Row className="card_table mb-2">
                    <Col lg={12}>
                        <Row className='mx-0'>
                            <Col xs={12}><Row style={{minHeight:'3rem'}}>
                                <Col lg={2} xs={4} className='card_table top col col_color text center risk-report text-normal'>일시</Col>
                                <Col lg={4} xs={8} className='card_table top col text risk-report text-normal'>{data.minutes_date}</Col>
                                <Col lg={2} xs={4} className='card_table top col col_color text center risk-report text-normal'>부서</Col>
                                <Col lg={4} xs={8} className='card_table top col text risk-report text-normal'>{data.minutes_department}</Col>
                            </Row></Col>
                            <Col xs={12}><Row style={{minHeight:'3rem'}}>
                                <Col lg={2} xs={4} className='card_table mid col col_color text center risk-report text-normal'>작성자</Col>
                                <Col lg={4} xs={8} className='card_table mid col text risk-report text-normal'>{data.minutes_writer}</Col>
                                <Col lg={2} xs={4} className='card_table mid col col_color text center risk-report text-normal'>참석자</Col>
                                <Col lg={4} xs={8} className='card_table mid col text risk-report text-normal'>{data.minutes_participant}</Col>
                            </Row></Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="card_table mb-2">
                    <Col lg={12}>
                        <Row className='mx-0' style={{minHeight:'3rem'}}>
                            <Col lg={2} xs={4}>
                                <Row style={{height:'100%'}}>
                                    <Col className='card_table top col_color text center risk-report text-normal'>회의 주제</Col>
                                </Row>
                            </Col>
                            <Col lg={10} xs={8}>
                                <Row style={{height:'100%'}}>
                                    <Col className='card_table top text border-left risk-report text-normal'>
                                        {data.minutes_topic}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="card_table mb-2">
                    <Col lg={12}>
                        <Row className='mx-0' style={{minHeight:'45rem'}}>
                            <Col lg={2} xs={4}>
                                <Row style={{height:'100%'}}>
                                    <Col className='card_table top col_color text center risk-report text-normal'>회의 내용</Col>
                                </Row>
                            </Col>
                            <Col lg={10} xs={8}>
                                <Row style={{height:'100%'}}>
                                    <Col className='card_table top text border-left' style={{overflowX: 'scroll'}} dangerouslySetInnerHTML={{__html: data.minutes_content}}>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="card_table mb-2">
                    <Col lg={12}>
                        <Row className='mx-0' style={{minHeight:'7rem'}}>
                            <Col lg={2} xs={4}>
                                <Row style={{height:'100%'}}>
                                    <Col className='card_table top col_color text center risk-report text-normal'>전달 사항</Col>
                                </Row>
                            </Col>
                            <Col lg={10} xs={8}>
                                <Row style={{height:'100%'}}>
                                    <Col className='card_table top text border-left risk-report text-normal'>
                                        {data.minutes_infomation}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={12}>
                        <Row className='mx-0' style={{minHeight:'3rem'}}>
                            <Col lg={2} xs={4}>
                                <Row style={{height:'100%'}}>
                                    <Col className='card_table top col_color text center risk-report text-normal'>기타사항</Col>
                                </Row>
                            </Col>
                            <Col lg={10} xs={8}>
                                <Row style={{height:'100%'}}>
                                    <Col className='card_table top text border-left risk-report text-normal'>
                                        {data.minutes_etc}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {data.images && data.images.length > 0 && 
                    data.images.map((file, index) => {
                        if (file.partner_status === true) {
                            return (
                                <Row className='mb-2'>
                                    <Row className='mx-0'>
                                        <Col className='px-2 py-2 border-x border-y'>
                                            <Row className='risk-report content-h'>
                                                <Col key={index}>
                                                    <img src={`/static_backend/${file.path}${file.file_name}`} className='w-100' style={{objectFit: 'contain', maxHeight:'1200px'}} onClick={() => handleDownload(`${file.path}${file.file_name}`, file.original_file_name)}/>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Row>
                            )
                        }
                    })
                }
            </CardBody>
            <CardFooter style={{display:'flex', justifyContent:'end'}}>
                <FooterLineDetail
                    isSign={isSign}
                    setIsSign={setIsSign}
                    isChargeSign={isChargeSign}
                    setIsChargeSign={setIsChargeSign}
                    userSign={userSign}
                    setUserSign={setUserSign}
                    isReject={isReject}
                    isChargerCheck={isChargerCheck}
                    isInCharge={isInCharge}
                />
            </CardFooter>
        </Card>
    )
}
export default MinutesDetail