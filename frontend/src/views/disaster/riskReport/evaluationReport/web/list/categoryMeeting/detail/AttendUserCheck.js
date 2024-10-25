/* eslint-disable */
import { getObjectKeyCheck, sweetAlert } from '@utils'

import Swal from 'sweetalert2'
import { Fragment, useEffect, useState } from "react"
import { Button, Col, Row, Label } from "reactstrap"
import { useSelector } from 'react-redux'
import { API_CRITICAL_DISASTER_PARTICIPANT_SIGN, API_DISASTER_EVALUTION_SIGN } from '../../../../../../../../constants'
import { primaryColor, axiosPostPutCallback } from '../../../../../../../../utility/Utils'

export const AttendUserCheck = (props) => {
    const { user, cookies, attendUser, setAttendUser, title } = props
    const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const meetingId = criticalDisaster.meetingId
    const evaluationId = criticalDisaster.evaluationId

    const [check, setCheck] = useState(false)
    const [isFinal, setIsFinal] = useState(false)
    const [isAttend, setIsAttend] = useState(false)

    const setFinalCallback = (updateUser) => {
        setAttendUser(updateUser)
    }

    function handleAttend(value) {
        Swal.fire({
            icon: "info",
            title: value !== 'return' ? `${title === '회의 참석자' ? '회의' : '작업자'} ${value === 'attend' ? '참석' : '불참'} 등록 여부 확인` : '현재 상태 변경',
            html: value !== 'return' ? `${value === 'attend' ? '참석' : '불참'} 하시는게 맞으실까요?` : `${title === '회의 참석자' ? '참석' : '서명'} 확인 전 초기 상태로 변경하시겠습니까?`,
            showCancelButton: true,
            showConfirmButton: true,
            heightAuto: false,
            cancelButtonText: "취소",
            confirmButtonText: '확인',
            confirmButtonColor : primaryColor,
            reverseButtons :true,
            customClass: {
                actions: 'sweet-alert-custom right',
                cancelButton: 'me-1'
            }
        }).then((res) => {
            if (res.isConfirmed) {
                const API = title === '회의 참석자' ? `${API_CRITICAL_DISASTER_PARTICIPANT_SIGN}/${meetingId}` : API_DISASTER_EVALUTION_SIGN
                const formData = new FormData()
                formData.append(title === '회의 참석자' ? 'user_id' : 'line_id', cookies.get('userId'))
                if (title === '회의 참석자') {
                    formData.append('is_attend', value === 'attend')
                    formData.append('is_final',  value === 'attend' || value === 'notAttend')
                } else {
                    formData.append('type', 'evaluation')
                    formData.append('pk_id', evaluationId)
                    if (value === 'return') formData.append('return', true)
                }
                sweetAlert(value !== 'return' ? `${title === '회의 참석자' ? '회의' : '작업자'} ${value === 'attend' ? '참석' : '불참'} 성공` : `${title === '회의 참석자' ? '회의 참석' : '작업자 서명'} 상태 변경`, 
                            value !== 'return' ? `${title === '회의 참석자' ? '회의' : '작업자'} ${value === 'attend' ? '참석' : '불참'} 하셨습니다.` : '초기 상태로 변경되었습니다.', 'success')
                axiosPostPutCallback('modify', '', API, formData, setFinalCallback, false)
            } else {
                sweetAlert(value !== 'return' ? `${title === '회의 참석자' ? '회의' : '작업자'} ${value === 'attend' ? '참석' : '불참'} 취소` : '',
                            value !== 'return' ? `${title === '회의 참석자' ? '회의' : '작업자'} ${value === 'attend' ? '참석' : '불참'}을 취소했습니다.` : '현재 상태를 유지합니다.', 'warning')
            }
        })
    }

    useEffect(() => {
        const tempCheck = Number(user.id) === Number(cookies.get('userId'))
        const tempIsFinal = getObjectKeyCheck(user, 'is_final') !== '' ? getObjectKeyCheck(user, 'is_final') : false
        const tempIsAttend = getObjectKeyCheck(user, 'is_attend') !== '' ? getObjectKeyCheck(user, 'is_attend') : false 
        setCheck(tempCheck)
        setIsFinal(tempIsFinal)
        setIsAttend(tempIsAttend)
	}, [attendUser])

    const userSignImage = (url) => {
        if (url === null || url === undefined || url === '') {
            return (
                <>
                {check ? 
                    <Row style={{width:'100%', padding:0, alignItems:'center'}}>
                        <Col xs={12} lg={7} className="px-0">
                            이미지없음
                        </Col>
                        <Col xs={12} lg={5} className="px-0">
                            <Button color='danger' outline className='m-mobile' onClick={() => handleAttend('return')} style={{padding:'5px 10px'}}>취소</Button>
                        </Col>
                    </Row>
                    :
                    '이미지없음'
                }
                </>
            )
        }
        return (
            check ?
                <Row style={{width:'100%', padding:0, alignItems:'center'}}>
                    <Col xs={12} lg={7} className="px-0">
                        <img src={`/static_backend/${user.signature}`} style={{width:'100%', minHeight:'33px'}} />
                    </Col>
                    <Col xs={12} lg={5} className="px-0" style={{justifyContent:'end', display:'flex'}}>
                        <Button color='danger' outline className='m-mobile' onClick={() => handleAttend('return')} style={{padding:'5px 10px'}}>취소</Button>
                        </Col>
                </Row>
                :
                <img src={`/static_backend/${user.signature}`} style={{width:'100%', height:'33px', objectFit:'scale-down'}} />
            
        )
    }

    return (
        isFinal ?
        (
            isAttend ?
            userSignImage(user.signature)
            :
            check ?
                <Row style={{width:'100%', padding:0, alignItems:'center'}}>
                    <Col xs={12} lg={7} className="px-0">
                        불참석
                    </Col>
                    <Col xs={12} lg={5} className="px-0">
                        <Button color='danger' outline className='m-mobile' onClick={() => handleAttend('return')} style={{padding:'5px 10px'}}>취소</Button>
                    </Col>
                </Row>
                :
                '불참석'
        )
        :
        (
            check ?
            title !== '작업자' ?
                <Row style={{width:'100%', padding:0, justifyContent:'center'}}>
                    <Col xs={12} lg={5} style={{marginRight: '2px', marginLeft: '2px', textAlign:'center'}}>
                        <Row>
                            <Button color='primary' onClick={() => handleAttend('attend')} style={{ paddingRight:'10px', paddingLeft:'10px'}}>참석</Button>
                        </Row>
                    </Col>
                    <Col xs={12} lg={5} style={{marginRight: '2px', marginLeft: '2px', textAlign:'center'}}>
                        <Row>
                            <Button color='danger' outline className='m-mobile' onClick={() => handleAttend('notAttend')} style={{paddingRight:'10px', paddingLeft:'10px'}}>불참</Button>
                        </Row>
                    </Col>
                </Row>
                :
                <Row style={{width:'100%', padding:0, justifyContent:'center'}}>
                    <Col xs={12} lg={12} style={{marginRight: '2px', marginLeft: '2px', textAlign:'center'}}>
                        <Row>
                            <Button color='primary' onClick={() => handleAttend('attend')} style={{ paddingRight:'10px', paddingLeft:'10px'}}>서명</Button>
                        </Row>
                    </Col>
                </Row>
            :
            <></>
        )
    )
}

const MeetingAttendTable = (props) => {
    const { title, cookies, attendUser, setAttendUser} = props
    return (
        <Fragment>
            <Row className='mb-2'>
                <Col className="mx-0">
                    <Row>
                        <Col>
                            <Label className='risk-report text-lg-bold'>{title} 명단</Label>
                        </Col>
                    </Row>
                    {(!attendUser || getObjectKeyCheck(attendUser, 'length') === '' || getObjectKeyCheck(attendUser, 'length') === 0) ?
                        <Row>
                            <Col md={6} xs={12} className="pe-1" style={{paddingTop:'5px'}}>
                                <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                    <Col lg='2' md='2' xs='3' className='card_table col col_gray text center border-b risk-report text-normal' style={{backgroundColor:'report'}}>번호</Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b risk-report text-normal'>직책</Col>
                                    <Col lg='4' md='4' xs='3'  className='card_table col col_gray text center border-b risk-report text-normal'>서명</Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b risk-report text-normal'>사인</Col>
                                </Row>
                                <Row className="card_table mx-0" style={{ borderRight: '1px solid #B9B9C3'}}>
                                    <Col lg='2' md='2' xs='3'  className='card_table col col_gray text center border-b risk-report text-normal'>1</Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b risk-report text-normal'></Col>
                                    <Col lg='4' md='4' xs='3'  className='card_table col col_gray text center border-b risk-report text-normal'></Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b risk-report text-normal'></Col>
                                </Row>
                            </Col>
                            <Col md={6} xs={12} className="pe-1" style={{paddingTop:'5px'}}>
                                <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                    <Col lg='2' md='2' xs='3'  className='card_table col col_gray text center border-b risk-report text-normal'>번호</Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b risk-report text-normal'>직책</Col>
                                    <Col lg='4' md='4' xs='3'  className='card_table col col_gray text center border-b risk-report text-normal'>서명</Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b risk-report text-normal'>사인</Col>
                                </Row>
                                <Row className="card_table mx-0" style={{borderRight: '1px solid #B9B9C3'}}>
                                    <Col lg='2' md='2' xs='3'  className='card_table col col_gray text center border-b risk-report text-normal'>2</Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b risk-report text-normal'></Col>
                                    <Col lg='4' md='4' xs='3'  className='card_table col col_gray text center border-b risk-report text-normal'></Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b risk-report text-normal'></Col>
                                </Row>
                            </Col>
                        </Row>
                        :
                        <Row>
                            <Col md={6} xs={12} className="pe-1" style={{paddingTop:'5px'}}>
                                <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                    <Col lg='2' md='2' xs='2' className='card_table col col_color text center border-b risk-report text-normal' style={{backgroundColor:'report'}}>번호</Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_b risk-report text-normal'>직책</Col>
                                    <Col lg='4' md='4' xs='4'  className='card_table col col_color text center border-b risk-report text-normal'>서명</Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_b risk-report text-normal'>사인</Col>
                                </Row>
                                {attendUser && attendUser.map((user, index) => {
                                    if (index <= Math.floor(attendUser.length / 2)) {
                                        return (
                                            <Row className="card_table mx-0" key={`partner${user.name}_${user.id}`} style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                                <Col lg='2' md='2' xs='2'  className='card_table col text center border-b border-left risk-report text-normal'>{index + 1}</Col>
                                                <Col lg='3' md='3' xs='3'  className='card_table col text center border-b border-left risk-report text-normal'>{user.position}</Col>
                                                <Col lg='4' md='4' xs='4'  className='card_table col text center border-b border-left risk-report text-normal'>{user.name}</Col>
                                                <Col lg='3' md='3' xs='3'  className='card_table col text center border-b border-left risk-report text-normal'>
                                                    <AttendUserCheck 
                                                        cookies={cookies}
                                                        user={user}
                                                        attendUser={attendUser}
                                                        setAttendUser={setAttendUser}
                                                        title={title}
                                                    />
                                                </Col>
                                            </Row>
                                        )
                                    }
                                })}
                            </Col>
                            <Col md={6} xs={12} className="pe-1" style={{paddingTop:'5px'}}>
                                <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                    <Col lg='2' md='2' xs='2' className='card_table col col_color text center border-b risk-report text-normal' style={{backgroundColor:'report'}}>번호</Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_b risk-report text-normal'>직책</Col>
                                    <Col lg='4' md='4' xs='4'  className='card_table col col_color text center border-b risk-report text-normal'>서명</Col>
                                    <Col lg='3' md='3' xs='3'  className='card_table col text center col_b risk-report text-normal'>사인</Col>
                                </Row>
                                {attendUser && attendUser.map((user, index) => {
                                    if (index > Math.floor(attendUser.length / 2)) {
                                        return (
                                            <Row className="card_table mx-0" key={`partner${user.name}_${user.id}`} style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                                <Col lg='2' md='2' xs='2'  className='card_table col text center border-b border-left risk-report text-normal'>{index + 1}</Col>
                                                <Col lg='3' md='3' xs='3'  className='card_table col text center border-b border-left risk-report text-normal'>{user.position}</Col>
                                                <Col lg='4' md='4' xs='4'  className='card_table col text center border-b border-left risk-report text-normal' >{user.name}</Col>
                                                <Col lg='3' md='3' xs='3'  className='card_table col text center border-b border-left risk-report text-normal'>
                                                    <AttendUserCheck 
                                                        cookies={cookies}
                                                        user={user}
                                                        attendUser={attendUser}
                                                        setAttendUser={setAttendUser}
                                                        title={title}
                                                    />
                                                </Col>
                                            </Row>
                                        )
                                    }
                                })}
                            </Col>
                        </Row>
                    }
                </Col>
            </Row>
        </Fragment>
    )

}

export default MeetingAttendTable