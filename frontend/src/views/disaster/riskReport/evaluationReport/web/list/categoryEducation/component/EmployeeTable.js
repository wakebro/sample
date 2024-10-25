import { Fragment, useEffect, useState } from "react"
import { Button, Col, Label, Row } from "reactstrap"
import DisasterEmployeeModal from "./EmployeeModal"
import { axiosPostPutCallback, getObjectKeyCheck, primaryColor, sweetAlert } from "../../../../../../../../utility/Utils"
import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import { API_CRITICAL_DISASTER_PARTICIPANT_SIGN } from "../../../../../../../../constants"

export const AttendUserCheck = (props) => {
    const { user, cookies, attendUser, setAttendUser } = props
    const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const educationId = criticalDisaster.educationId

    const [check, setCheck] = useState(false)
    const [isFinal, setIsFinal] = useState(false)
    const [isAttend, setIsAttend] = useState(false)

    const setFinalCallback = (updateUser) => {
        setAttendUser(updateUser)
    }

    function handleAttend(value) {
        Swal.fire({
            icon: "info",
            title: value !== 'return' ? `교육 ${value === 'attend' ? '참석' : '불참'} 등록 여부 확인` : '현재 상태 변경',
            html: value !== 'return' ? `${value === 'attend' ? '참석' : '불참'} 하시는게 맞으실까요?` : '참석 확인 전 초기 상태로 변경하시겠습니까?',
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
                const formData = new FormData()
                formData.append('user_id', cookies.get('userId'))
                formData.append('is_attend', value === 'attend')
                formData.append('is_final',  value === 'attend' || value === 'notAttend')
                sweetAlert(value !== 'return' ? `교육 ${value === 'attend' ? '참석' : '불참'} 성공` : '교육 참석 상태 변경', 
                            value !== 'return' ? `교육 ${value === 'attend' ? '참석' : '불참'} 하셨습니다.` : '초기 상태로 변경되었습니다.', 'success')
                axiosPostPutCallback('modify', '', `${API_CRITICAL_DISASTER_PARTICIPANT_SIGN}/${educationId}`, formData, setFinalCallback, false)
            } else {
                sweetAlert(value !== 'return' ? `교육 ${value === 'attend' ? '참석' : '불참'} 취소` : '',
                            value !== 'return' ? `교육 ${value === 'attend' ? '참석' : '불참'}을 취소했습니다.` : '현재 상태를 유지합니다.', 'warning')
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
        if (url === null || url === undefined) {
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
                        <img src={`/static_backend/${user.signature}`} alt={'dddd'} style={{width:'100%', minHeight:'33px'}} />
                    </Col>
                    <Col xs={12} lg={5} className="px-0" style={{justifyContent:'end', display:'flex'}}>
                        <Button color='danger' outline className='m-mobile' onClick={() => handleAttend('return')} style={{padding:'5px 10px'}}>취소</Button>
                        </Col>
                </Row>
                :
                <img src={`/static_backend/${user.signature}`} alt={'dddd'} style={{width:'100%', height:'33px', objectFit:'scale-down'}} />
            
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
            <></>
        )
    )
}

/* eslint-disable */
const EmployeeTable = (props) => {
	const {handleModal, isOpen, setIsOpen, cookies, attendUser, setAttendUser, setAttendState} = props

    const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const [isEmpRegMod, setIsEmpRegMod] = useState(false) 

    useEffect(() => {
        const pageType = criticalDisaster.pageType
        const educationId = criticalDisaster.educationId
        if (pageType === 'register' || pageType === 'modify' || educationId === '') {
            setIsEmpRegMod(true)
        }
	}, [])

    return (
        <Fragment>
            {/* 교육 참석자 명단 */}
            <Row className='mb-2'>
                <Col className="mx-0">
                    <Row>
                        <Col>
                            <Label className='risk-report text-lg-bold'>
                                교육 참석자 명단
                            </Label>
                            {
                                isEmpRegMod && 
                                <Button 
                                    color='primary' 
                                    className='ms-1' 
                                    onClick={handleModal} 
                                    style={{padding: '5px', marginBottom: '3px', fontSize: '13px'}}
                                >직원 선택</Button>
                            }
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
                            <Col lg={6} xs={12} style={{paddingTop: '5px'}}>
                                <Row className='mx-0'>
                                    <Col lg={2} md={2} xs={2} className='card_table top text center col col_color risk-report text-normal'>
                                        번호
                                    </Col>
                                    <Col lg={3} md={3} xs={3} className='card_table top text center col col_color risk-report text-normal'>
                                        직책
                                    </Col>
                                    <Col lg={4} md={4} xs={4} className='card_table top text center col col_color risk-report text-normal'>
                                        성명
                                    </Col>
                                    <Col lg={3} md={3} xs={3} className='card_table top text center col col_color risk-report text-normal'>
                                        서명
                                    </Col>
                                </Row>
                                {attendUser.map((user, index) => {
                                    return (
                                        (index <= Math.floor(attendUser.length / 2)) && (
                                            <Row  className='mx-0' key={index}>
                                                <Col lg={2} md={2} xs={2} className='card_table top border-left text center col risk-report text-normal'>
                                                    {index+1}
                                                </Col>
                                                <Col lg={3} md={3} xs={3} className='card_table top border-left text center col risk-report text-normal'>
                                                    {user.position}
                                                </Col>
                                                <Col lg={4} md={4} xs={4} className='card_table top border-left text center col risk-report text-normal'>
                                                    {user.name}
                                                </Col>
                                                <Col lg={3} md={3} xs={3} key={index} className='card_table top border-left text center col risk-report text-normal'>
                                                    { !isEmpRegMod ? 
                                                        (<>
                                                            <AttendUserCheck
                                                                cookies={cookies}
                                                                user={user}
                                                                attendUser={attendUser}
                                                                setAttendUser={setAttendUser}
                                                            />
                                                        </>)
                                                        :
                                                        ('공란')
                                                    }
                                                </Col>
                                            </Row>
                                        ) // end
                                    )
                                })}
                            </Col>
                            <Col lg={6} xs={12} style={{paddingTop: '5px'}}>
                                <Row className='mx-0'>
                                    <Col lg={2} md={2} xs={2} className='card_table top text center col col_color risk-report text-normal'>
                                        번호
                                    </Col>
                                    <Col lg={3} md={3} xs={3} className='card_table top text center col col_color risk-report text-normal'>
                                        직책
                                    </Col>
                                    <Col lg={4} md={4} xs={4} className='card_table top text center col col_color risk-report text-normal'>
                                        성명
                                    </Col>
                                    <Col lg={3} md={3} xs={3} className='card_table top text center col col_color risk-report text-normal'>
                                        서명
                                    </Col>
                                </Row>
                                {attendUser.map((user, index) => {
                                    return (
                                        (index > Math.floor(attendUser.length / 2)) && (
                                            <Row  className='mx-0' key={index}>
                                                <Col lg={2} md={2} xs={2} className='card_table top border-left text center col risk-report text-normal'>
                                                    {index+1}
                                                </Col>
                                                <Col lg={3} md={3} xs={3} className='card_table top border-left text center col risk-report text-normal'>
                                                    {user.position}
                                                </Col>
                                                <Col lg={4} md={4} xs={4} className='card_table top border-left text center col risk-report text-normal'>
                                                    {user.name}
                                                </Col>
                                                <Col lg={3} md={3} xs={3} key={index} className='card_table top border-left text center col risk-report text-normal'>
                                                    { !isEmpRegMod ? 
                                                        (<>
                                                            <AttendUserCheck
                                                                cookies={cookies}
                                                                user={user}
                                                                attendUser={attendUser}
                                                                setAttendUser={setAttendUser}
                                                            />
                                                        </>)
                                                        :
                                                        ('공란')
                                                    }
                                                </Col>
                                            </Row>
                                        ) // end
                                    )
                                })}
                            </Col>
                        </Row>
                    }
                </Col>
            </Row>
            <DisasterEmployeeModal
                modalTitle='교육'
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                cookies={cookies}
                attendUser={attendUser}
                setAttendUser={setAttendUser}
                setAttendState={setAttendState}
            />
        </Fragment>
    )
}

export default EmployeeTable
