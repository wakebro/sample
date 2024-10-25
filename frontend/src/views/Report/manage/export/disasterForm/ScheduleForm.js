import { CardBody, CardHeader, Col, Label, Row, CardTitle } from "reactstrap"
import {addCommaNumber, getObjectKeyCheck} from '@utils'
import ModalSign from "../../../../disaster/riskReport/evaluationReport/web/list/ModalSign"

const ScheduleForm = (props) => {
    const {data, type, lastPage, index, lastIndex} = props

    return (
        ((type === 'meeting' && !Array.isArray(data.meeting)) || (type === 'education' && !Array.isArray(data.education))) && 
        <> 
            <CardHeader> 
                <Row className='w-100'>
                    <Col md={9} xs={9}>
                        <Label className="risk-report title-bold d-flex align-items-center">
                            { type === 'meeting' ? data.meeting.title : data.education.title }
                        </Label>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody className='risk-report'>
                <Row className='mb-2 pe-0' style={{ display: 'flex' }}>
                    <Label className='risk-report text-lg-bold'>회의 인원</Label>
                    <Col md={8} xs={12} className="pe-0">
                        <Row className="card_table mx-0" style={{ borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3' }}>
                            <Col lg='6' md='6' xs='3' className='card_table col col_color text center border-b risk-report text-normal'>구분</Col>
                            <Col lg='2' md='2' xs='3' className='card_table col text center col_b risk-report text-normal'>계</Col>
                            <Col lg='2' md='2' xs='3' className='card_table col col_color text center border-b risk-report text-normal'>남</Col>
                            <Col lg='2' md='2' xs='3' className='card_table col text center col_b risk-report text-normal'>여</Col>
                        </Row>
                        <Row className="card_table mx-0 border-right border-b">
                            <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>회의 대상자 수</Col>
                            <Col lg='2' md='2' xs='3' className='card_table col text center risk-report text-normal'
                                style={{
                                    paddingRight: '6px',
                                    paddingLeft: '6px'
                                }}>
                                { type === 'meeting'
                                    ? addCommaNumber(data.meeting.target_man + data.meeting.target_woman)
                                    : addCommaNumber(data.education.target_man + data.education.target_woman)
                                }
                            </Col>
                            <Col lg='2' md='2' xs='3' className='card_table col text center border-x risk-report text-normal'
                                style={{
                                    paddingRight: '6px',
                                    paddingLeft: '6px'
                                }}>
                                { type === 'meeting'
                                    ? addCommaNumber(data.meeting.target_man)
                                    : addCommaNumber(data.education.target_man)
                                }
                            </Col>
                            <Col lg='2' md='2' xs='3' className='card_table col text center risk-report text-normal'
                                style={{
                                    paddingRight: '6px',
                                    paddingLeft: '6px'
                                }}>
                                { type === 'meeting'
                                    ? addCommaNumber(data.meeting.target_woman)
                                    : addCommaNumber(data.education.target_woman)
                                }
                            </Col>
                        </Row>
                        <Row className="card_table mx-0 border-right border-b">
                            <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>회의 실시자 수</Col>
                            <Col lg='2' md='2' xs='3' className='card_table col text center risk-report text-normal'
                                style={{
                                    paddingRight: '6px',
                                    paddingLeft: '6px'
                                }}>
                                { type === 'meeting'
                                    ? addCommaNumber(data.meeting.participant_man + data.meeting.participant_woman)
                                    : addCommaNumber(data.education.participant_man + data.education.participant_woman)
                                }
                            </Col>
                            <Col lg='2' md='2' xs='3' className='card_table col text center border-x risk-report text-normal'
                                style={{
                                    paddingRight: '6px',
                                    paddingLeft: '6px'
                                }}>
                                { type === 'meeting'
                                    ? addCommaNumber(data.meeting.participant_man)
                                    : addCommaNumber(data.education.participant_man)
                                }
                            </Col>
                            <Col lg='2' md='2' xs='3' className='card_table col text center risk-report text-normal'
                                style={{
                                    paddingRight: '6px',
                                    paddingLeft: '6px'
                                }}>
                                { type === 'meeting'
                                    ? addCommaNumber(data.meeting.participant_woman)
                                    : addCommaNumber(data.education.participant_woman)
                                }
                            </Col>
                        </Row>
                        <Row className="card_table mx-0 border-right border-b">
                            <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>회의 미참석 사유</Col>
                            <Col lg='6' md='6' xs='9' className='card_table col text center risk-report text-normal'
                                style={{
                                    paddingRight: '6px',
                                    paddingLeft: '6px'
                                }}>
                                <div className='risk-report text-normal'>
                                    { type === 'meeting'
                                        ? data.meeting.absence_content
                                            ? (data.meeting.absence_content.split('\n').map((line, idx) => (
                                                <span key={`meeting_${idx}`}>
                                                    {line}
                                                    <br/>
                                                </span>
                                            )))
                                            : (data.meeting.absence_content)
                                        : typeof data.education.absence_content === 'string' && data.education.absence_content.split('\n').map((line, idx) => (
                                            <span key={`education_${idx}`}>
                                                {line}
                                                <br/>
                                            </span>
                                        ))
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} xs={12}>
                        <Row className='d-flex d-flex justify-content-center'>
                            <Col lg={9} md={9} xs={12}>
                                <ModalSign
                                    criticalDisasterRedux={{ modalName: '서명'}}
                                    userSign={type === 'meeting'
                                        ? data.meeting.sign_line.length > 0
                                            ? data.meeting.sign_line
                                            : ['', '']
                                        : data.education.sign_line.length > 0
                                            ? data.education.sign_line
                                            : ['', '']}
                                    type={'export'}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Col>
                        <Label className='risk-report text-lg-bold'>{ type === 'meeting' ? '회의 내용' : '교육 내용' }</Label>
                        <Row className='card_table mx-0'>
                            <Col
                                className='border-all risk-report col-export-h-m px-2 py-2'
                                dangerouslySetInnerHTML={{
                                    __html: type === 'meeting'
                                        ? data.meeting.content
                                        : data.education.content
                                }}></Col>
                        </Row>
                    </Col>
                </Row>
                { lastPage !== '' && lastPage !== type && 
                    < div className = 'page-break' /> 
                }
                { lastPage === type && index !== lastIndex &&
                    <div className='page-break'/>
                }
                <Row className='mb-2'>
                    <Label className='risk-report text-lg-bold'>{ type === 'meeting' ? '회의 사진' : '교육 사진' }</Label>
                    <Col>
                        <Row className='mx-0'>
                            <Col className='px-2 py-2 border-x border-y'>
                                <Row className='risk-report export-h-rem'>
                                    { getObjectKeyCheck(type === 'meeting' ? data.meeting : data.education, type === 'meeting' ? 'images' : 'cd_images') !== '' && 
                                        (type === 'meeting'
                                            ? data.meeting.images
                                            : data.education.cd_images).map((image, idx) => {
                                                if (image.partner_status === false) {
                                                    const imagePath = `/static_backend/${image.path}${image.file_name}`
                                                    return (
                                                        <Col key={`meeting_img${idx}`}>
                                                            <img
                                                                src={imagePath}
                                                                className='w-100'
                                                                style={{
                                                                    objectFit: 'contain',
                                                                    maxHeight: '300px'
                                                                }}/>
                                                        </Col>
                                                    )
                                                }
                                            }
                                        )
                                    }
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='mb-2'>
                    <Label className='risk-report text-lg-bold'>{ type === 'meeting' ? '회의' : '교육' } 실시자 및 장소</Label>
                    <Col lg={12}>
                        <Row className='mx-0'>
                            <Col lg={3} xs={12}>
                                <Row>
                                    <Col className='card_table col top col_color text center risk-report text-normal col-h-rem'>담당</Col>
                                </Row>
                                <Row>
                                    <Col className='card_table col top text center border-left risk-report col-h-rem'>
                                        <span className='card_table center risk-report text-normal'>
                                            { type === 'meeting' ? data.meeting.manager : data.education.manager }
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={3} xs={12}>
                                <Row>
                                    <Col className='card_table col top col_color text center risk-report text-normal col-h-rem'>직책</Col>
                                </Row>
                                <Row>
                                    <Col className='card_table col top text center border-left risk-report col-h-rem'>
                                        <span className='card_table center risk-report text-normal'>
                                            { type === 'meeting' ? data.meeting.position : data.education.position }
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={3} xs={12}>
                                <Row>
                                    <Col className='card_table col top col_color text center risk-report text-normal col-h-rem'>교육 장소</Col>
                                </Row>
                                <Row>
                                    <Col className='card_table col top text center border-left risk-report col-h-rem'>
                                        <span className='risk-report text-normal'>
                                            { type === 'meeting' ? data.meeting.location : data.education.location }
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={3} xs={12}>
                                <Row>
                                    <Col className='card_table col top col_color text center risk-report text-normal col-h-rem'>비고</Col>
                                </Row>
                                <Row>
                                    <Col className='card_table col top text center border-left risk-report col-h-rem'>
                                        <span className='risk-report text-normal'>
                                            { type === 'meeting' ? data.meeting.description : data.education.description }
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className = 'mb-2'> 
                    <Col className="mx-0">
                        <Row>
                            <Col>
                                <Label className='risk-report text-lg-bold'>{ type === 'meeting' ? '회의' : '교육' } 참석자 명단</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} xs={12} className="pe-1" style={{ paddingTop: '5px' }}>
                                <Row className="card_table mx-0" style={{ borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3' }}>
                                    <Col lg='2' md='2' xs='3' className='card_table col col_color text center border-b risk-report text-normal' style={{ backgroundColor: 'report' }}>번호</Col>
                                    <Col lg='3' md='3' xs='3' className='card_table col text center col_b risk-report text-normal'>직책</Col>
                                    <Col lg='4' md='4' xs='3' className='card_table col col_color text center border-b risk-report text-normal'>서명</Col>
                                    <Col lg='3' md='3' xs='3' className='card_table col text center col_b risk-report text-normal'>사인</Col>
                                </Row>
                                { data && 
                                    (type === 'meeting' ? data.meeting.participant_list : data.education.emp_list).map((user, index) => {
                                        if (index <= Math.floor((type === 'meeting' ? data.meeting.participant_list : data.education.emp_list).length / 2)) {
                                            return (
                                                <Row className="card_table mx-0" key={`partner${user.name}_${user.id}`} style={{ borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3' }}>
                                                    <Col lg='2' md='2' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>{index + 1}</Col>
                                                    <Col lg='3' md='3' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>{user.position}</Col>
                                                    <Col lg='4' md='4' xs='3' className='card_table col text center border-b border-left risk-report text-normal' style={{ wordBreak: 'break-all' }}>{user.name}</Col>
                                                    <Col lg='3' md='3' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>
                                                        { getObjectKeyCheck(user, 'is_final') !== false
                                                            ? getObjectKeyCheck(user, 'is_attend') !== false
                                                                ? user.signature 
                                                                    ? <img src={`/static_backend/${user.signature}`} alt="User Signature" style={{width:'100%', height:'33px', objectFit:'scale-down'}}/>
                                                                    : <>{'참석'}</>
                                                                : <> {'불참석'}</>
                                                            : <></>
                                                        }
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                    })
                                }
                            </Col>
                            <Col md={6} xs={12} className="pe-1" style={{ paddingTop: '5px' }}>
                                <Row className="card_table mx-0" style={{ borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3' }}>
                                    <Col lg='2' md='2' xs='3' className='card_table col col_color text center border-b risk-report text-normal' style={{ backgroundColor: 'report' }}>번호</Col>
                                    <Col lg='3' md='3' xs='3' className='card_table col text center col_b risk-report text-normal'>직책</Col>
                                    <Col lg='4' md='4' xs='3' className='card_table col col_color text center border-b risk-report text-normal'>서명</Col>
                                    <Col lg='3' md='3' xs='3' className='card_table col text center col_b risk-report text-normal'>사인</Col>
                                </Row>
                                { data && (
                                    type === 'meeting'
                                        ? data.meeting.participant_list
                                        : data.education.emp_list
                                    ).map((user, index) => {
                                        if (index > Math.floor((type === 'meeting' ? data.meeting.participant_list : data.education.emp_list).length / 2)) {
                                            return (
                                                <Row className="card_table mx-0" key={`partner2${user.name}_${user.id}`} style={{ borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3' }}>
                                                    <Col lg='2' md='2' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>{index + 1}</Col>
                                                    <Col lg='3' md='3' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>{user.position}</Col>
                                                    <Col lg='4' md='4' xs='3' className='card_table col text center border-b border-left risk-report text-normal' style={{ wordBreak: 'break-all' }}>{user.name}</Col>
                                                    <Col lg='3' md='3' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>
                                                        { getObjectKeyCheck(user, 'is_final') !== false
                                                            ? getObjectKeyCheck(user, 'is_attend') !== false
                                                                ? user.signature
                                                                    ? <img src={`/static_backend/${user.signature}`} alt="User Signature" style={{width:'100%', height:'33px', objectFit:'scale-down'}}/> 
                                                                    : <> {'참석'}</>
                                                                : <> {'불참석'}</>
                                                            : <></>
                                                        }
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                    })
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {type !== 'meeting' && 
                    data.education.cd_images && data.education.cd_images.length > 0 && 
                        data.education.cd_images.map((file, index) => {
                            if (file.partner_status === true) {
                                return (
                                <>
                                    < div className = 'page-break' /> 
                                    <Row className='mb-2'>
                                        <Row className='mx-0'>
                                            <Col className='px-2 py-2 border-x border-y'>
                                                <Row className='risk-report content-h'>
                                                    <Col key={index}>
                                                        <img src={`/static_backend/${file.path}${file.file_name}`} className='w-100' style={{objectFit: 'contain', maxHeight:'900px'}} onClick={() => handleDownload(`${file.path}${file.file_name}`, file.original_file_name)}/>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Row>
                                </>
                            )
                        }
                    })
                }
            </CardBody>
            { lastPage !== '' && lastPage !== type && 
                < div className = 'page-break' /> 
            }
            { lastPage === type && index !== lastIndex &&
                <div className='page-break'/>
            }
            { type === 'meeting' && 
            <> 
                <CardHeader> 
                    <CardTitle
                        md='9'
                        xs='8'
                        className="risk-report title-bold d-flex align-items-center">
                        {data.meeting.minutes_title}
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Row className="card_table mb-2">
                        <Col lg={12}>
                            <Row className='mx-0'>
                                <Col xs={12}>
                                    <Row style={{ minHeight: '3rem' }}>
                                        <Col lg={2} xs={4} className='card_table top col col_color text center risk-report text-normal'>일시</Col>
                                        <Col lg={4} xs={8} className='card_table top col text risk-report text-normal'>{data.meeting.minutes_date}</Col>
                                        <Col lg={2} xs={4} className='card_table top col col_color text center risk-report text-normal'>부서</Col>
                                        <Col lg={4} xs={8} className='card_table top col text risk-report text-normal'>{data.meeting.minutes_department}</Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row style={{ minHeight: '3rem' }}>
                                        <Col lg={2} xs={4} className='card_table mid col col_color text center risk-report text-normal'>작성자</Col>
                                        <Col lg={4} xs={8} className='card_table mid col text risk-report text-normal'>{data.meeting.minutes_writer}</Col>
                                        <Col lg={2} xs={4} className='card_table mid col col_color text center risk-report text-normal'>참석자</Col>
                                        <Col lg={4} xs={8} className='card_table mid col text risk-report text-normal'>{data.meeting.minutes_participant}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="card_table mb-2">
                        <Col lg={12}>
                            <Row className='mx-0' style={{ minHeight: '3rem' }}>
                                <Col lg={2} xs={4}>
                                    <Row style={{ height: '100%' }}>
                                        <Col className='card_table top col_color text center risk-report text-normal'>회의 주제</Col>
                                    </Row>
                                </Col>
                                <Col lg={10} xs={8}>
                                    <Row style={{ height: '100%' }}>
                                        <Col className='card_table top text border-left risk-report text-normal'>{data.meeting.minutes_topic}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="card_table mb-2">
                        <Col lg={12}>
                            <Row className='mx-0' style={{ minHeight: '45rem' }}>
                                <Col lg={2} xs={4}>
                                    <Row style={{ height: '100%' }}>
                                        <Col className='card_table top col_color text center risk-report text-normal'>회의 내용</Col>
                                    </Row>
                                </Col>
                                <Col lg={10} xs={8}>
                                    <Row style={{ height: '100%' }}>
                                        <Col className='card_table top text border-left'>
                                            <div dangerouslySetInnerHTML={{ __html: data.meeting.minutes_content }}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    < div className = 'page-break' /> 
                    <Row className="card_table mb-2">
                        <Col lg={12}>
                            <Row className='mx-0' style={{ minHeight: '7rem' }}>
                                <Col lg={2} xs={4}>
                                    <Row style={{ height: '100%' }}>
                                        <Col className='card_table top col_color text center risk-report text-normal'>전달 사항</Col>
                                    </Row>
                                </Col>
                                <Col lg={10} xs={8}>
                                    <Row style={{ height: '100%' }}>
                                        <Col className='card_table top text border-left risk-report text-normal'>{data.meeting.minutes_infomation}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={12}>
                            <Row className='mx-0' style={{ minHeight: '3rem' }}>
                                <Col lg={2} xs={4}>
                                    <Row style={{ height: '100%' }}>
                                        <Col className='card_table top col_color text center risk-report text-normal'>기타사항</Col>
                                    </Row>
                                </Col>
                                <Col lg={10} xs={8}>
                                    <Row style={{ height: '100%' }}>
                                        <Col className='card_table top text border-left risk-report text-normal'>{data.meeting.minutes_etc}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {data.meeting.images && data.meeting.images.length > 0 && 
                        data.meeting.images.map((file, index) => {
                            if (file.partner_status === true) {
                                return (
                                    <>
                                        < div className = 'page-break' /> 
                                        <Row className='mb-2'>
                                            <Row className='mx-0'>
                                                <Col className='px-2 py-2 border-x border-y'>
                                                    <Row className='risk-report content-h'>
                                                        <Col key={index}>
                                                            <img src={`/static_backend/${file.path}${file.file_name}`} className='w-100' style={{objectFit: 'contain', maxHeight:'900px'}} onClick={() => handleDownload(`${file.path}${file.file_name}`, file.original_file_name)}/>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Row>
                                    </>
                                )
                            }
                        })
                    }
                </CardBody>
                { lastPage !== '' && lastPage !== type && 
                    < div className = 'page-break' /> 
                }            
                { lastPage === type && index !== lastIndex &&
                    <div className='page-break'/>
                }
                </>
            } 
        </>
    )
}
export default ScheduleForm