/* eslint-disable */
import Cookies from 'universal-cookie'
import { Fragment, useState, useEffect } from "react"
import { Card, CardBody, CardFooter, Col, Row, Label, Button, CardHeader } from "reactstrap"
import * as moment from 'moment'

import EmployeeTable from '../component/EmployeeTable'
import { useDispatch, useSelector } from 'react-redux'
import { CustomBadge } from '../../../Component'
import { addCommaNumber, getObjectKeyCheck, getTableDataCallback, handleDownload, signAuthCheck } from '../../../../../../../../utility/Utils'
import { API_DISASTER_EDUCATION_DETAIL } from '../../../../../../../../constants'
import { FooterLineDetail } from '../../EvaluationDetail'
import ModalSign from '../../ModalSign'
import { isSignBtnDisplayCheck } from '../../../data'
import { useAxiosIntercepter } from '../../../../../../../../utility/hooks/useAxiosInterceptor'
import { setModalName, setEducationParticipantMan, setEducationParticipantWoman } from '../../../../../../../../redux/module/criticalDisaster'

const EducationDetail = (props) => {
    useAxiosIntercepter()
	const dispatch = useDispatch()
    // 사업소, 유저 정보를 위한 쿠키
    const cookies = new Cookies()
    const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const loginAuth = useSelector((state) => state.loginAuth)
    const pageType = criticalDisaster.pageType
    const educationId = criticalDisaster.educationId
	// const isManager = cookies.get('isManager') === 'true'
    const [isManager, setIsManager] = useState(false)
    const activeUser = Number(cookies.get('userId'))

    // modal
    const [isOpen, setIsOpen] = useState(false)

    //sign data list
    const [userSign, setUserSign] = useState(['', ''])

    // 교육 참석 유저 state
    const [attendUser, setAttendUser] = useState([])

    // 완료 체크 state 수정 해야함
    const [completedPage, setCompletedPage] = useState(false)
    const [eduDetail, setEduDetail] = useState({})
    const [rejectReason, setRejectReason] = useState([])

    // button auth
	const [isSign, setIsSign] = useState(false) // 결재 버튼을 보여줄건지
    const [isSignAuth, setIsSignAuth] = useState(false) // 결재 권한이 있는지?
	const [isChargeSign, setIsChargeSign] = useState(false) // 담당자가 결재 진행했는지
    const [isReject, setIsReject] = useState(false) // 해당문서가 반려되었는지
    const [isChargerCheck, setIsChargeCheck] = useState(false) // 담당자인지?

    // 직원 선택 모달
    function handleModal() {
        setIsOpen(true)
    }

    const getEducationDetail = (data) => {
        dispatch(setModalName('안전교육 결재'))
        setCompletedPage(data.is_completed)
        const tempSignLine = [...data.sign_line]
        setIsReject(data.is_rejected)
        setEduDetail(data)
        setAttendUser(data.emp_list)
        setUserSign(tempSignLine.length <= 0 ? ['',''] : tempSignLine)
        setRejectReason(data.reject_reason)
    }

    useEffect(() => { // 비동기 이므로 함수를 다시 호출해야함
        if (!completedPage) { // 문서가 완료 되었는지?
            setIsSign(false)
            return
        }
        if (!signAuthCheck(activeUser, userSign)){ // 결재 권한이 있는지?
            setIsSign(false)
            return 
        }
        setIsSign(isSignBtnDisplayCheck(activeUser, userSign)) // 나의 결재 여부 검사
    }, [completedPage, userSign])

    useEffect(() => {
        setIsSignAuth(signAuthCheck(activeUser, userSign))
        const inChargeSign = getObjectKeyCheck(userSign[0], 'is_other_final')
        setIsChargeSign(inChargeSign !== '' && inChargeSign === true)
        const isTempCharger = getObjectKeyCheck(userSign[0], 'user')
        setIsChargeCheck(isTempCharger !== '' && Number(isTempCharger) === activeUser)
    }, [userSign])

    useEffect(() => {
        setIsManager(loginAuth.isManager)
        getTableDataCallback(`${API_DISASTER_EDUCATION_DETAIL}/${educationId}`, {}, getEducationDetail)
	}, [])

    // useEffect(() => {
    //     let mCount = 0
    //     let fCount = 0
    //     if (attendUser.length > 0) {
    //         attendUser.filter(user => user.gender === 'male' && user.is_final && user.is_attend && mCount++)
    //         attendUser.filter(user => user.gender === 'female' && user.is_final && user.is_attend && fCount++)
    //     }
    //     dispatch(setEducationParticipantMan(mCount))
    //     dispatch(setEducationParticipantWoman(fCount))
    // }, [attendUser])

	return (
		<Fragment>
            <Card>
                {/* 제목 */}
                <CardHeader>
                    <Row className='w-100'>
                        <Col md={9} xs={9}>
                            <Label className='risk-report title-bold d-flex align-items-center'>
                                {eduDetail.title}&nbsp;
                                { 
                                    completedPage ? 
                                    (isManager || isSignAuth) && 
                                    <CustomBadge color='light-success'>작성완료</CustomBadge>
                                    :
                                    (isManager || isSignAuth) && 
                                    <CustomBadge color='light-danger'>작성중</CustomBadge>
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
                                        {rejectReason.map(data => {
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
                    {/* 교육 인원 */}
                    <Row className='mb-2 pe-0' style={{display:'flex'}}>
                        <Label className='risk-report text-lg-bold'>교육 인원</Label>
                        <Col md={8} xs={12} className="pe-0">
                            <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='3'  className='card_table col col_color text center border-b risk-report text-normal'>구분</Col>
                                <Col lg='2' md='2' xs='3'  className='card_table col text center col_b risk-report text-normal'>계</Col>
                                <Col lg='2' md='2' xs='3'  className='card_table col col_color text center border-b risk-report text-normal'>남</Col>
                                <Col lg='2' md='2' xs='3'  className='card_table col text center col_b risk-report text-normal'>여</Col>
                            </Row>
                            <Row className="card_table mx-0 border-right border-b">
                                <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>교육 대상자 수</Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    <span className='risk-report text-normal'>
                                        {addCommaNumber(eduDetail.target_total)}
                                    </span>
                                </Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center border-x' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    <span className='risk-report text-normal'>
                                        {addCommaNumber(eduDetail.target_man)}
                                    </span>
                                </Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    <span className='risk-report text-normal'>
                                        {addCommaNumber(eduDetail.target_woman)}
                                    </span>
                                </Col>
                            </Row>
                            <Row className="card_table mx-0 border-right border-b">
                                <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>교육 실시자 수</Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    <span className='risk-report text-normal'>
                                        {/* {addCommaNumber(eduDetail.participant_total)} */}
                                        {addCommaNumber(eduDetail.participant_man + eduDetail.participant_woman)}
                                    </span>
                                </Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center border-x' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    <span className='risk-report text-normal'>
                                        {/* {addCommaNumber(eduDetail.participant_man)} */}
                                        {addCommaNumber(eduDetail.participant_man)}
                                    </span>
                                </Col>
                                <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    <span className='risk-report text-normal'>
                                        {/* {addCommaNumber(eduDetail.participant_woman)} */}
                                        {addCommaNumber(eduDetail.participant_woman)}
                                    </span>
                                </Col>
                            </Row>
                            <Row className="card_table mx-0 border-right border-b">
                                <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>교육 미참석 사유</Col>
                                <Col lg='6' md='6' xs='9' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                    <div className='risk-report text-normal'>
                                        { typeof eduDetail.absence_content === 'string' && eduDetail.absence_content.split('\n').map((line, idx) => (
                                            <span key={idx}>
                                                {line}
                                                <br/>
                                            </span>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        {/* 서명 */}
                        <Col lg={4} xs={12}>
                            <Row className='d-flex justify-content-center'>
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
                    {/* 교육 내용 */}
                    <Row className='mb-2'>
                        <Col>
                            <Label className='risk-report text-lg-bold'>교육 내용</Label>
                            <Row className='card_table mx-0'>
                                <Col className='border-all risk-report content-h px-2 py-2' style={{overflowX: 'scroll'}} dangerouslySetInnerHTML={{__html: eduDetail.content}} />
                            </Row>
                        </Col>
                    </Row>
                    {/* 교육 사진 */}
                    <Row className='mb-2'>
                        <Label className='risk-report text-lg-bold'>교육 사진</Label>
                        <Col>
                            <Row className='mx-0'>
                                <Col className='px-2 py-2 border-x border-y'>
                                    <Row className='risk-report content-h'>
                                        { getObjectKeyCheck(eduDetail, 'cd_images') !== '' &&
                                            eduDetail.cd_images.map((image, idx) => {
                                                // console.log(image)
                                                if (image.partner_status === false) {
                                                    const iamge = `/static_backend/${image.path}${image.file_name}`
                                                    return (
                                                        <Col key={idx}>
                                                            <img src={iamge} className='w-100' style={{objectFit: 'contain', maxHeight: '400px'}} />
                                                        </Col>
                                                    )
                                                }
                                            })
                                        }
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* 교육 실시자 및 장소 */}
                    <Row className='mb-2'>
                        <Label className='risk-report text-lg-bold'>교육 실시자 및 장소</Label>
                        <Col lg={12}>
                            <Row className='mx-0'>
                                <Col lg={3} xs={12}>
                                    <Row>
                                        <Col className='card_table col top col_color text center risk-report text-normal col-h-rem'>담당</Col>
                                    </Row>
                                    <Row>
                                        <Col className='card_table col top text center border-left risk-report col-h-rem'>
                                            <span className='card_table center risk-report text-normal'>
                                                {eduDetail.manager}
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
                                                {eduDetail.position}
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
                                                {eduDetail.location}
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
                                                {eduDetail.description}
                                            </span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* 교육 참석자 명단 */}
                    <EmployeeTable
                        pageType={pageType}
                        handleModal={handleModal}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        cookies={cookies}
                        attendUser={attendUser}
                        setAttendUser={setAttendUser}
                    />
                    {eduDetail.cd_images && eduDetail.cd_images.length > 0 && 
                        eduDetail.cd_images.map((file, index) => {
                            if (file.partner_status === true) {
                                return (
                                    <Row className='mb-2'>
                                        <Row className='mx-0'>
                                            <Col className='px-2 py-2 border-x border-y'>
                                                <Row className='risk-report content-h'>
                                                                    <Col key={index} >
                                                                        <img src={`/static_backend/${file.path}${file.file_name}`} className='w-100' style={{objectFit: 'contain', maxHeight:'1200px'}} onClick={() => handleDownload(`${file.path}${file.file_name}`, file.original_file_name)} />
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
                <CardFooter>
                    <FooterLineDetail
                        isSign={isSign}
                        setIsSign={setIsSign}
                        isChargeSign={isChargeSign}
                        setIsChargeSign={setIsChargeSign}
                        userSign={userSign}
                        setUserSign={setUserSign}
                        isReject={isReject}
                        isChargerCheck={isChargerCheck}
                        isInCharge={isSignAuth}
                    />
                </CardFooter>
            </Card>
		</Fragment>
	)
}

export default EducationDetail
