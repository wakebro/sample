/* eslint-disable */
import Cookies from 'universal-cookie'
import * as moment from 'moment'

import { Fragment, useState, useEffect } from "react"
import { Card, CardBody, CardHeader, Col, Label, Row } from "reactstrap"
import { API_DISASTER_MEETING_DETAIL } from '../../../../../../../../constants'

import MinutesDetail from './MinutesDetail'
import { CustomBadge } from '../../../Component'
import { setModalName, setMeetingParticipantWoman, setMeetingParticipantMan } from '@store/module/criticalDisaster'
import { addCommaNumber, signAuthCheck, getObjectKeyCheck } from '@utils'

import axios from 'axios'
import { useSelector } from 'react-redux'
import ModalSign from '../../ModalSign'
import {isSignBtnDisplayCheck} from '../../../data'
import MeetingAttendTable from './AttendUserCheck'

const CategoryMeetingDetail = (props) => {
    const {navigate, dispatch} = props
    const cookies = new Cookies()
    const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const loginAuth = useSelector((state) => state.loginAuth)
    const activeUser = Number(cookies.get('userId'))
    const [data, setData] = useState([])
    const [userSign, setUserSign] = useState([])
    const [isManager, setIsManager] = useState(false)
    const [attendUser, setAttendUser] = useState([])

    // button auth
	const [isSign, setIsSign] = useState(false) // 결재 버튼을 보여줄건지
    const [completedPage, setCompletedPage] = useState(false)
    const [isSignAuth, setIsSignAuth] = useState(false) // 결재 권한이 있는지?
	const [isChargeSign, setIsChargeSign] = useState(false) // 담당자가 결재 진행했는지
	const [isReject, setIsReject] = useState(false) // 해당문서가 반려되었는지
    const [isChargerCheck, setIsChargeCheck] = useState(false) // 담당자인지?

	useEffect(() => setIsManager(loginAuth.isManager), [])

    useEffect(() => {
        dispatch(setModalName('사전회의 결재'))
        if (criticalDisaster.meetingId !== '' && typeof criticalDisaster.meetingId === 'number') {

            axios.get(`${API_DISASTER_MEETING_DETAIL}/${criticalDisaster.meetingId}`)
            .then(res => {
                if (res.status == 200) {
                    console.log(res.data)
                    setData(res.data)
                    setUserSign(res.data.sign_line.length > 1 ? res.data.sign_line : ['', ''])
                    setIsReject(res.data.is_rejected)
                    setCompletedPage(res.data.is_completed && res.data.minutes_completed ? true : false)
                    setAttendUser(res.data.participant_list)
                }
            })
        }
    }, [criticalDisaster.meetingId])

    useEffect(() => {
        if (!completedPage) {
            setIsSign(false)
            return
        }
        setIsSign(isSignBtnDisplayCheck(activeUser, userSign)) // 나의 결재 여부 검사
        setIsSignAuth(signAuthCheck(activeUser, userSign))
        const inChargeSign = getObjectKeyCheck(userSign[0], 'is_other_final')
        setIsChargeSign(inChargeSign !== '' && inChargeSign === true)
        const isTempCharger = getObjectKeyCheck(userSign[0], 'user')
        setIsChargeCheck(isTempCharger !== '' && Number(isTempCharger) === activeUser)
    }, [userSign, completedPage])

    // 우선 사용안함
    // useEffect(() => {
    //     let mCount = 0ㅂ
    //     let fCount = 0
    //     if (attendUser.length > 0) {
    //         attendUser.filter(user => user.gender === 'male' && user.is_final && user.is_attend && mCount++)
    //         attendUser.filter(user => user.gender === 'female' && user.is_final && user.is_attend && fCount++)
    //     }
    //     dispatch(setMeetingParticipantMan(mCount))
    //     dispatch(setMeetingParticipantWoman(fCount))
    // }, [attendUser])

    return (
        <Fragment>
            <Card>
                <CardHeader>
                    <Row className='w-100'>
                        <Col md={9} xs={9}>
                            <Label className="risk-report title-bold d-flex align-items-center">
                                {data.title}&nbsp;
                                {data.is_completed !== true ?
                                    (isManager || isSignAuth) &&
                                    <CustomBadge color='light-danger'>작성중</CustomBadge>
                                :
                                    (isManager || isSignAuth) &&
                                    <CustomBadge color='light-success'>작성완료</CustomBadge>
                                }
                            </Label>
                        </Col>
                    </Row>
				</CardHeader>
                <CardBody className='risk-report'>
                    {(isManager || isSignAuth) && isReject === true && 
                        <Row className='card_table'>
                            <div className="mb-1" style={{color:'crimson'}}>
                                <Label className='risk-report text-lg-bold' style={{color:'red'}}>반려 사유</Label>
                                <Col lg='12' xs='12'className='card_table col text start border_none pt-0' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                    <Row style={{width:'100%', height: '15rem', border:'1px solid #C1C1CB', whiteSpace:'break-spaces', overflow: 'auto'}}>
                                        {data.reject_reason.map(data => {
                                            return (
                                                <div style={{padding: '1rem', whiteSpace: 'pre-wrap'}}>
                                                    반려 : {data.reject_user}<br />
                                                    사유 : {data.reason}<br />
                                                    발행 : {moment(data.create_datetime).format('YYYY-MM-DD HH시mm분ss초')}
                                                </div>
                                                )
                                            })
                                        }
                                    </Row>
                                </Col>
                            </div>
                        </Row>
                    }
                    <Row className='mb-2 pe-0' style={{display:'flex'}}>
                        <Label className='risk-report text-lg-bold'>회의 인원</Label>
                        <Col md={8} xs={12} className="pe-0">
                            <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='3'  className='card_table col col_color text center border-b risk-report text-normal'>구분</Col>
                                <Col lg='2' md='2' xs='3'  className='card_table col text center col_b risk-report text-normal'>계</Col> 
                                <Col lg='2' md='2' xs='3'  className='card_table col col_color text center border-b risk-report text-normal'>남</Col>
                                <Col lg='2' md='2' xs='3'  className='card_table col text center col_b risk-report text-normal'>여</Col>
                            </Row>
                            <Row className="card_table mx-0 border-right border-b">
                                <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>회의 대상자 수</Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center risk-report text-normal' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    {addCommaNumber(data.target_man + data.target_woman)}
                                </Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center border-x risk-report text-normal' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    {addCommaNumber(data.target_man)}
                                </Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center risk-report text-normal' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    {addCommaNumber(data.target_woman)}
                                </Col>
                            </Row>
                            <Row className="card_table mx-0 border-right border-b">
                                <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>회의 실시자 수</Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center risk-report text-normal' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    {addCommaNumber(data.participant_man + data.participant_woman)}
                                </Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center border-x risk-report text-normal' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    {addCommaNumber(data.participant_man)}
                                </Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center risk-report text-normal' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    {addCommaNumber(data.participant_woman)}
                                </Col>
                            </Row>
                            <Row className="card_table mx-0 border-right border-b">
                                <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>회의 미참석 사유</Col>
                                <Col lg='6' md='6' xs='9' className='card_table col text center risk-report text-normal' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    <div className='risk-report text-normal'>
                                        {data.absence_content ? (
                                            data.absence_content.split('\n').map((line, idx) => (
                                                <span key={idx}>
                                                    {line}
                                                    <br/>
                                                </span>
                                            ))
                                        ) : (
                                            data.absence_content
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={4} xs={12}>
                            <Row className='d-flex d-flex justify-content-center'>
                                <Col lg={9} md={9} xs={12}>
                                    <ModalSign 
                                        activeUser={activeUser}
                                        criticalDisasterRedux={criticalDisaster}
                                        userSign={userSign}
                                        setUserSign={setUserSign}
                                        isCompleted={completedPage}
                                        type='detail'
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className='mb-2'>
                        <Label className='risk-report text-lg-bold'>회의 내용</Label>
                        <Col lg='12' xs='12'>
                            <Row className='card_table mx-0'>
                                <Col className='border-all risk-report content-h px-2 py-2' style={{overflowX: 'scroll'}} dangerouslySetInnerHTML={{__html: data.content}}>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className='mb-2'>
                        <Label className='risk-report text-lg-bold'>회의 사진</Label>
                        <Col>
                            <Row className='mx-0'>
                                <Col className='px-2 py-2 border-x border-y'>
                                    <Row className='risk-report content-h'>
                                        {data.images && data.images.length > 0 && data.images.map((file, index) => {
                                            if (file.partner_status === false) {
                                                return (
                                                    <Col
                                                        key={index}>
                                                        <img src={`/static_backend/${file.path}${file.file_name}`} className='w-100' style={{objectFit: 'contain', maxHeight:'400px'}} />
                                                    </Col>
                                                )
                                            }})
                                        }
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='mb-2 card_table'>
                        <Label className='risk-report text-lg-bold'>회의 실시자 및 장소</Label>
                        <Col lg={12}>
                            <Row className='mx-0'>
                                <Col lg={3} xs={12}>
                                    <Row>
                                        <Col className='card_table top col_color text center risk-report text-normal col-h-rem'>담당</Col>
                                    </Row>
                                    <Row>
                                        <Col className='card_table top text center border-left risk-report text-normal col-h-rem'> 
                                            {data.manager}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={3} xs={12}>
                                    <Row>
                                        <Col className='card_table top col_color text center risk-report text-normal col-h-rem'>직책</Col>
                                    </Row>
                                    <Row>
                                        <Col className='card_table top text center border-left risk-report text-normal col-h-rem'>
                                            {data.position}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={3} xs={12}>
                                    <Row>
                                        <Col className='card_table top col_color text center risk-report text-normal col-h-rem'>교육 장소</Col>
                                    </Row>
                                    <Row>
                                        <Col className='card_table top center text border-left risk-report text-normal col-h-rem'>
                                            {data.location}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={3} xs={12}>
                                    <Row>
                                        <Col className='card_table top text col_color text center risk-report text-normal col-h-rem'>비고</Col>
                                    </Row>
                                    <Row>
                                        <Col className='card_table top text center border-left risk-report text-normal col-h-rem'>
                                            {data.description}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <MeetingAttendTable 
                        title={'회의 참석자'}
                        cookies={cookies}
                        attendUser={attendUser}
                        setAttendUser={setAttendUser}
                    />
                </CardBody>
            </Card>
            <MinutesDetail
                activeUser={activeUser}
                navigate={navigate} 
                data={data}   
                isManager={isManager}
                isSign={isSign}
                setIsSign={setIsSign}
                isChargeSign={isChargeSign}
                setIsChargeSign={setIsChargeSign}
                userSign={userSign}
                setUserSign={setUserSign}
                isSignAuth={isSignAuth}
                isReject={isReject}
                isChargerCheck={isChargerCheck}
                isInCharge={isSignAuth}
            />
        </Fragment>
    )
}

export default CategoryMeetingDetail