/* eslint-disable */
import axios from 'axios'
import Cookies from 'universal-cookie'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as moment from 'moment'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, Col, Row, CardFooter, Badge } from "reactstrap"
import Sign from '../../../Report/detail/ReportSign'
import { signListObj } from '../../../Report/ReportData'
import {ROUTE_INSPECTION_OUTSOURCING, API_INSPECTION_OUTSOURCING_DETAIL, ROUTE_INSPECTION_OUTSOURCING_REGISTER, ROUTE_INSPECTION_OUTSOURCING_DETAIL_EXPORT, API_INSPECTION_OUTSOURCING_SIGN_FORM, ROUTE_INSPECTION_OUTSOURCING_DETAIL, URL, API_INSPECTION_OUTSOURCING_REJECT} from "../../../../constants"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import RejectModal from '../../../Report/detail/RejectModal'
import { reportNumberList } from '../register/ReportData'
import { FileText } from 'react-feather'
import { SIGN_COLLECT, SIGN_CONFIRM, SIGN_REJECT, axiosDeleteParm, checkOnlyView, getObjectKeyCheck, isSignPreSignCheck, signAuthCheck, signPreCheck, sweetAlert, sweetAlertCallback } from '../../../../utility/Utils'
import { useSelector } from 'react-redux'
import { INSPECTION_OUTSOURCING } from '../../../../constants/CodeList'

const OutSourcingDetail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    require('moment/locale/ko')
    const { id } = useParams()
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)
    const cookies = new Cookies()
    const [userData, setUserData] = useState()
    const [userSign, setUserSign] = useState([])
	const [signList, setSignList] = useState([])
    const [signIdList, setSignIdList] = useState([])
    const [signNameList, setSignNameList] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [returnReasonData, setReturnReasonData] =  useState([])
    const [signCount, setSignCount] = useState(0)
    
    const [signButton, setSignButton] = useState(true) // 현재 접속 유저가 결재권한이 있는지 체크
    const activeUser = Number(cookies.get('userId')) // 현재 접속 유저 아이디
    const [isInCharge, setIsInCharge] = useState(false) // 담당자인지 체크
    const [isSignPreSign, setIsSignPreSign] = useState(false) // 전결, 결재 할 것이 있는지 체크
    const [isMod, setIsMod] = useState(false)

    const toggle = () => { setIsOpen(!isOpen) }

    const handleSignCollect = () => {
        const formData = new FormData()
        formData.append('is_rejected', 2)
        formData.append('userId',  cookies.get('userId'))
        axios.put(`${API_INSPECTION_OUTSOURCING_REJECT}/${id}`, formData, {
        }).then(() => {
            sweetAlertCallback('회수 완료', '외주점검 회수가 완료 되었습니다', 'success', 'right', function() {
                navigate(`${ROUTE_INSPECTION_OUTSOURCING_DETAIL}/${id}`)
            })
        }).catch(() => {
            console.log('server error')
        })
    }

    const handleDownload = (path, name, orangeName) => {
        axios({
            url: `${URL}/static_backend/${path}${(name)}`,
            method: 'GET',
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${orangeName}`)
            document.body.appendChild(link)
            link.click()
        })
    }

    const handleDeleteSubmit = () => {
        axiosDeleteParm('외주점검', API_INSPECTION_OUTSOURCING_DETAIL,  { data: {outsourcing_id : id } }, ROUTE_INSPECTION_OUTSOURCING, navigate)
	}

    const handleSignSubmit = () => {
		const activeUserIndex = signIdList.indexOf(cookies.get('userId'))
        const previousUserSigns = [ // 클릭한 박스의 왼쪽 박스 유저를 가져옴
            userSign[activeUserIndex - 1],
            userSign[activeUserIndex - 2],
            userSign[activeUserIndex - 3]
        ]
        const preSignCheckResult = signPreCheck(activeUser, previousUserSigns)

        if (activeUserIndex === 0 || (getObjectKeyCheck(preSignCheckResult, 'result') !== '' && preSignCheckResult.result)) {
            return MySwal.fire({
                title: '알림',
                text: "확인을 클릭하면 더는 수정하실 수 없습니다.\n 해당 결재 내역을 저장하시겠습니까?",
                icon: 'info',
                showCancelButton: true,
                cancelButtonText: '취소',
                confirmButtonText: '결재',
                customClass: {
                    cancelButton: 'btn btn-report ms-1',
                    confirmButton: 'btn btn-primary',
                    container: 'space',
                    actions: 'sweet-alert-custom right'
                }
                }).then(function (result) {
                if (result.value) {
                    const copyList = [...signList]
                    for (const i in copyList) {
                        const numberI = Number(i)
                        if ((numberI === activeUserIndex) && (userSign[numberI].is_final === false)) {
                            copyList[numberI] = 1
                            break
                        } else if ((numberI !== activeUserIndex) && (userSign[numberI].view_order > userSign[activeUserIndex].view_order) && (userSign[numberI].is_final === false) && (userSign[numberI].type !== 3)) {
                            copyList[numberI] = 2
                            break
                        }
                    }
                    const formData = new FormData()
                    formData.append('sign_list', copyList)
                    formData.append('user', cookies.get('userId'))
                    axios.put(`${API_INSPECTION_OUTSOURCING_SIGN_FORM}/${id}`, formData, {
                    })
                    .then(res => {
                        if (res.status = 200) {
                            MySwal.fire({
                                title: '결재 완료!',
                                text: '결재가 진행 되었습니다',
                                icon: 'success',
                                customClass: {
                                    confirmButton: 'btn btn-success',
                                    actions: 'sweet-alert-custom right'
                                }
                            })
                            navigate(`${ROUTE_INSPECTION_OUTSOURCING_DETAIL}/${id}`)
                        } else {
                            sweetAlert('결재 취소', '결재가 취소 되었습니다. 재 확인 해주세요.', 'info')
                        }
                    })
                } else if (result.dismiss === MySwal.DismissReason.cancel) {
                    sweetAlert('결재 취소', '결재가 취소 되었습니다. 재 확인 해주세요.', 'info')
                }
            })
        } else {
            sweetAlert('결재 불가', `${signListObj[preSignCheckResult.index]} 결재가 진행 되지 않았습니다.`, 'warning')
        }
    }

    const handleExport = () => {
        window.open(`${ROUTE_INSPECTION_OUTSOURCING_DETAIL_EXPORT}/${id}`, '_blank')
    }

    useEffect(() => {
        axios.get(API_INSPECTION_OUTSOURCING_DETAIL,  { params: {outsourcing_id : id} })
        .then((response) => {
            const nameList = []
            const signTypeList = []
            const idList = []
            let count = 0
            setUserData(response.data)
            response.data.sign_lines.map(data => {
                nameList.push(data.username)
                signTypeList.push(data.type)
                idList.push(String(data.user))
                if ((data.is_final === true && data.type === 1) || (data.is_final === true && data.type === 2)) {
                    count += 1
                }
            })
            setSignNameList(nameList)
            setSignList(signTypeList)
            setSignIdList(idList)
            setUserSign(response.data.sign_lines)
            setReturnReasonData(response.data.return_reasons)
            setSignCount(count)
        })
        .catch(error => {
            // 응답 실패 시 처리
            console.error(error)// 에러 메시지
        })
    }, [])

    useEffect(() => {
        if (userSign.length && userSign.length === 4) {
            setIsInCharge(userSign[0].user === activeUser)
            const tempSignButtonCheck = signAuthCheck(activeUser, userSign) // 결재 버튼 보여질 권한 체크
            setSignButton(tempSignButtonCheck) 
            if (tempSignButtonCheck) setIsSignPreSign(isSignPreSignCheck(activeUser, userSign))
            //temp
            setIsMod(true)
            for (const userData of userSign) {
                if (userData.view_order >= 1 && (userData.type === 1 || userData.type === 2)) {
                    setIsMod(false)
                    break
                }
            }
        }
    }, [userSign])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='외주점검' breadCrumbParent='점검관리' breadCrumbActive='외주점검' />
                    <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
                        <FileText size={14}/>
                        문서변환
                    </Button.Ripple>
                </div>
            </Row>
            <Card>
                {userData &&
                    <CardBody>
                        <Row className="mb-1">
                            <Col md='8' xs='12' >
                                <Row>
                                    <Col md='12'>
                                        <Row className='card_table table_row'>
                                            <Col className='card_table col text'>
                                                <Row style={{width:'100%'}}>
                                                    <h2>{userData.title}</h2>
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
                                                                    {userData.id}
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
                                                                    {reportNumberList[userData.main_purpose]}
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
                                                                    {moment(userData.create_datetime).format('YYYY-MM-DD (dddd)')}
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
                                                                    {userData.user}
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
                                                                    <div style={{padding: 0 }}>
                                                                        {userData.site_name}
                                                                    </div>
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
                                                                    {userData.emp_class && userData.emp_class.code }
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
                            <Col md='4' xs='12' className='p-0'>
                                <Sign 
                                    userSign={userSign}
                                    setUserSign={setUserSign}
                                    signList={signList}
                                    setSignList={setSignList}
                                    signNameList={signNameList}
                                    completable = {userSign.find(user => String(user.user) === cookies.get('userId'))}
                                />
                            </Col>
                        </Row>
                        { userData.is_rejected === SIGN_REJECT && 
                            <Row className='card_table'>
                                <div className="mb-1" style={{color:'crimson'}}>
                                    <Col className='card_table col text' style={{paddingBottom:0}}>
                                        <div style={{fontSize:'21px'}}>반려 사유</div>
                                    </Col>
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%', height: '15rem', border:'1px solid #C1C1CB', whiteSpace:'break-spaces', overflow: 'auto'}}>
                                            {returnReasonData.map(data => {
                                                return (
                                                    <div style={{padding: '1rem', whiteSpace: 'pre-wrap'}}>
                                                        반려 : {data.user}<br />
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
                        <Row className='card_table'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div style={{fontSize:'21px'}}>보고 내용</div>
                                </Col>
                                <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                    <Row style={{width:'100%', minHeight: '35rem', border:'1px solid #C1C1CB', whiteSpace:'break-spaces'}}>
                                        <div style={{padding: '1rem'}}>
                                            {userData.report_content}
                                        </div>
                                    </Row>
                                </Col>
                            </div>
                        </Row>
                        <Row className='card_table mb-1'>
                            <Col>
                                {userData.report_files && 
                                    <Row style={{borderBottom: '3px dotted #ccc', marginBottom:'1%'}}>
                                        <div>
                                            <Col className='card_table col text' >
                                                <div style={{fontSize:'21px'}}>첨부 자료 {userData.report_files.length}개</div>
                                            </Col>
                                        </div>
                                    </Row>
                                }
                                {userData.report_files && userData.report_files.map((file, idx) => {
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
                                                <a onClick={() => handleDownload(file.path, file.file_name, file.original_file_name)}>
                                                    <img src={imagePath} width='16' height='18' className='me-50' />
                                                    <span className='text-muted fw-bolder align-text-top'>
                                                        {file.original_file_name}
                                                    </span>
                                                </a>
                                            </div>
                                        )
                                })}
                            </Col>
                        </Row>
                        <RejectModal 
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            id={id}
                            userData={userData.sign_lines}
                            API={API_INSPECTION_OUTSOURCING_REJECT}
                            returnAPI={`${ROUTE_INSPECTION_OUTSOURCING_DETAIL}/${id}`}
                            type= {'outsourcing'}
                        />
                        <CardFooter className='outsourcing_footer padding-0'>
                            { isMod && isInCharge && userData?.is_rejected !== SIGN_REJECT && userData?.is_rejected !== SIGN_COLLECT &&
                                <Button hidden={checkOnlyView(loginAuth, INSPECTION_OUTSOURCING, 'available_delete')}
                                    type='button' 
                                    color="danger" 
                                    className='ms-1'
                                    onClick={() => {
                                        sweetAlertCallback(
                                            '외주점검 회수', 
                                            '해당 외주점검을 회수하시겠습니까?.<br/>결재 내역은 초기화 됩니다.', 
                                            'warning',
                                            'right',
                                            handleSignCollect,
                                            true,
                                            '외주점검 회수가 취소 되었습니다.<br/>재 확인 해주세요.'
                                        )
                                    }}>
                                    회수
                                </Button>
                            }
                            { (userData?.is_rejected === SIGN_REJECT || userData?.is_rejected === SIGN_COLLECT) && isInCharge && 
                                <>
                                    <Button hidden={checkOnlyView(loginAuth, INSPECTION_OUTSOURCING, 'available_delete')}
                                        type='button' 
                                        color="danger"
                                        className='ms-1'
                                        onClick={handleDeleteSubmit}>
                                        삭제
                                    </Button>
                                    <Button hidden={checkOnlyView(loginAuth, INSPECTION_OUTSOURCING, 'available_update')}
                                        type='submit' 
                                        color='primary'
                                        className='ms-1'
                                        tag={Link} 
                                        to={ROUTE_INSPECTION_OUTSOURCING_REGISTER} 
                                        state={{
                                            type:'modify',
                                            id: id
                                        }}>
                                        수정
                                    </Button>
                                </>
                            }
                            { userData.is_rejected === SIGN_CONFIRM && signButton && userSign[3]?.is_final === false &&
                                <div>
                                    { isSignPreSign && 
                                        <Button hidden={checkOnlyView(loginAuth, INSPECTION_OUTSOURCING, 'available_update')}
                                            className="ms-1" type='button' color="primary" onClick={() => handleSignSubmit()}>결재
                                        </Button>
                                    }
                                </div>
                            }
                            { userData.is_rejected === SIGN_CONFIRM && activeUser !== userSign[0].user && isSignPreSign &&
                                <Button hidden={checkOnlyView(loginAuth, INSPECTION_OUTSOURCING, 'available_update')}
                                    className="ms-1" type='button' color="danger" onClick={toggle}>
                                    반려
                                </Button>
                            }
                            <Button
                                className='ms-1'
                                tag={Link} 
                                to={ROUTE_INSPECTION_OUTSOURCING}
                                >목록</Button>
                        </CardFooter>
                    </CardBody>
                }
            </Card>

        </Fragment>
    )

}

export default OutSourcingDetail