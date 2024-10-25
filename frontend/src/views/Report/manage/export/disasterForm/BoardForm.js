import { CardBody, CardHeader, Col, Label, Row } from "reactstrap"

const BoardForm = (props) => {
    const { type, data, lastPage, index, lastIndex } = props
    return (
        <>
            <CardHeader>
                <Col md={9} xs={9}>
                    <Label className="risk-report title-bold d-flex align-items-center">
                        {type === 'notice' ? data.notice.title : data.riskReport.title}
                    </Label>
                </Col>
            </CardHeader>
            <CardBody>
                <Row className='mb-2 card_table mid'>
                    <Col lg='6' md='6' xs='12'>
                        <Row className='border-top'>
                            <Col lg='4' md='4' xs='4' className='card_table col col_color text center risk-report text-normal' style={{minHeight:'3rem'}}>
                                {type === 'notice' ? '공고 기간' : '시행 일시'}
                            </Col>
                            <Col lg='8' md='8' xs='8' className='card_table col text center risk-report text-normal'>
                                {type === 'notice' ? data.notice.start_datetime !== undefined ? `${data.notice.start_datetime} ~ ${data.notice.end_datetime}` : '' : data.riskReport.start_datetime !== undefined ? `${data.riskReport.start_datetime} ~ ${data.riskReport.end_datetime}` : ''}
                            </Col>
                        </Row>
                    </Col>
                    <Col lg='6' md='6' xs='12'>
                        <Row className='border-top'>
                            <Col lg='4' md='4' xs='4' className='card_table col col_color text center risk-report text-normal' style={{minHeight:'3rem'}}>
                               {type === 'notice' ? '공고장소' : '평가자'}
                            </Col>
                            <Col lg='8' md='8' xs='8' className='card_table col text center risk-report text-normal'>
                                {type === 'notice' ? data.notice.location : data.riskReport.evaluator}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <Label className='risk-report text-lg-bold'>공고 내용</Label>
                        <Row className='card_table mx-0'>
                            <Col 
                                className='border-all risk-report col-export-h px-2 py-2' 
                                dangerouslySetInnerHTML={{__html:type === 'notice' ? data.notice.content : data.riskReport.content}}>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {type !== 'notice' && 
                    <>
                        <div className='page-break'/>
                        <Row className="mb-2">
                            <Col>
                                <Label className='risk-report text-lg-bold'>기타 특이사항</Label>
                                <Row className='card_table mx-0'>
                                    <Col className='border-all risk-report col-export-h-l px-2 py-2'>
                                        <div className='risk-report text-normal'>
                                            {data.riskReport.description}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                }
            </CardBody>
            { lastPage !== '' && lastPage !== type &&
                <div className='page-break'/>
            }
            { lastPage === type && index !== lastIndex &&
                <div className='page-break'/>
            }
        </>
    )
}

export default BoardForm