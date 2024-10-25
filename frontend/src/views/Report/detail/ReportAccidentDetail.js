import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, Col, Row, CardFooter, Badge } from "reactstrap"
import { 
    API_REPORT_DETAIL, ROUTE_REPORT_TOTAL, ROUTE_REPORT_ACCIDENT_FORM, 
    ROUTE_REPORT_ACCIDENT_DETAIL, API_REPORT_SIGN_FORM, ROUTE_REPORT_ACCIDENT, 
    URL, API_REPORT_REJECT, ROUTE_REPORT_EXPORT_DETAIL 
} from "../../../constants"
import { reportTypeList, reportNumberList, signListObj } from '../ReportData'
import Sign from '../detail/ReportSign'
import RejectModal from './RejectModal'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { SIGN_CONFIRM, SIGN_REJECT, axiosDelete, checkOnlyView, getObjectKeyCheck, isSignPreSignCheck, signAuthCheck, signPreCheck, sweetAlert, sweetAlertCallback } from '../../../utility/Utils'
import { useSelector } from 'react-redux'
import { REPORT_INFO } from '../../../constants/CodeList'
import { FileText } from 'react-feather'

const ReportAccidentDetail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const MySwal = withReactContent(Swal)
    const cookies = new Cookies()
    const navigate = useNavigate()
    require('moment/locale/ko')
    const { id } = useParams()
    const [userData, setUserData] = useState([])
    const [fileCount, setFileCount] = useState('')
    const [returnReasonData, setReturnReasonData] =  useState([])

    const [userSign, setUserSign] = useState([])
	const [signList, setSignList] = useState([])
    const [signIdList, setSignIdList] = useState([])
    const [signNameList, setSignNameList] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [deleteResult, setDeleteResult] = useState(false)

    const [signButton, setSignButton] = useState(true) // 현재 접속 유저가 결재권한이 있는지 체크
    const activeUser = Number(cookies.get('userId')) // 현재 접속 유저 아이디
    const [isInCharge, setIsInCharge] = useState(false) // 담당자인지 체크
    const [isSignPreSign, setIsSignPreSign] = useState(false) // 전결, 결재 할 것이 있는지 체크
    const [isMod, setIsMod] = useState(false) // temp

    const toggle = () => { setIsOpen(!isOpen) }

    const handleSignCollect = () => {
        const formData = new FormData()
        formData.append('is_rejected', 2)
        formData.append('userId',  cookies.get('userId'))
        axios.put(`${API_REPORT_REJECT}/${id}`, formData, {
        }).then(() => {
            sweetAlertCallback('회수 완료', '보고서 회수가 완료 되었습니다', 'success', 'right', function() {
                navigate(ROUTE_REPORT_TOTAL, { state: {type: 'temporary'} })
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
        // 유틸 함수로 변경
        axiosDelete(`${reportTypeList[userData.main_purpose]} 보고서`, `${API_REPORT_DETAIL}/${id}`, setDeleteResult)
	}

    const handleClick = () => {
        localStorage.setItem("reportData", JSON.stringify(userData))
        window.open(ROUTE_REPORT_EXPORT_DETAIL, '_blank')
    }
    // 삭제 완료시 페이지 이동
    useEffect(() => {
        if (deleteResult) window.location.href = ROUTE_REPORT_ACCIDENT
    }, [deleteResult])

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
                html: "확인을 클릭하면 더는 수정하실 수 없습니다.\n 해당 결재 내역을 저장하시겠습니까?",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: '취소',
                confirmButtonText: '결재',
                titleColor: 'primary',
                customClass: {
                    cancelButton: 'btn btn-report ms-1',
                    confirmButton: 'btn btn-primary',
                    container: 'space',
                    actions: 'sweet-alert-custom right'
                },
                buttonsStyling: false
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
                    axios.put(`${API_REPORT_SIGN_FORM}/${id}`, formData, {
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
                            navigate(`${ROUTE_REPORT_ACCIDENT_DETAIL}/${id}`)
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

    useEffect(() => {
        axios.get(`${API_REPORT_DETAIL}/${id}`)
		.then(res => {
			setUserData(res.data)
            let count = ''
            res.data.report_files.map((file) => {
                if (file.type === 'file') {
                    count++
                }
            })
            setFileCount(count)
            const nameList = []
            const signListTemp = []
            const idList = []
            res.data.sign_lines.map(data => {
                nameList.push(data.username)
                signListTemp.push(data.type)
                idList.push(String(data.user))
            })
            setSignNameList(nameList)
            setSignList(signListTemp)
            setSignIdList(idList)
            setUserSign(res.data.sign_lines)
            setReturnReasonData(res.data.return_reasons)
		})
    }, [])

    useEffect(() => {
        if (userSign.length && userSign.length === 4) {
            setIsInCharge(userSign[0].user === activeUser)
            const tempSignButtonCheck = signAuthCheck(activeUser, userSign) // 결재 버튼 보여질 권한 체크
            setSignButton(tempSignButtonCheck) 
            if (tempSignButtonCheck) setIsSignPreSign(isSignPreSignCheck(activeUser, userSign))
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
                    <Breadcrumbs breadCrumbTitle='보고서' breadCrumbParent='보고서 관리' breadCrumbActive='보고서' />
                    <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleClick}>
                        <FileText size={14}/>
                        문서변환
                    </Button.Ripple>
                </div>
            </Row>
            <Card>
                {userData && 
                <CardBody>
                    <Row>
                        <Col md='8' xs='12' >
                            <Row>
                                <Col md='6'>
                                    <Row className='card_table table_row'>
                                        <Col className='card_table col text start'>
                                            <Row style={{width:'100%'}}>
                                                <h2>{userData.title}<Badge color='light-skyblue' style={{width:'55px', height:'25px', fontSize:'15px', marginLeft:'4%', verticalAlign:'text-top'}}>{reportTypeList[userData.main_purpose]}</Badge></h2>
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
                                    <Row className='card_table top'>
                                        <Col md='6' xs='6'>
                                            <Row className='card_table table_row'>
                                                <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                                    <div>작성일자</div>
                                                </Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                    <Row style={{width:'100%'}}>
                                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                            <Row style={{width:'100%'}}>
                                                                {moment(userData.create_datetime).format('YYYY-MM-DD (dd)')}
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md='6' xs='6'>
                                            <Row className='card_table table_row'>
                                                <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                                    <div>작성자</div>
                                                </Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                    <Row style={{width:'100%'}}>
                                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                            <Row style={{width:'100%'}}>
                                                            {`${userData.user}(${userData.username})`}
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table top'>
                                        <Col md='6' xs='6'>
                                            <Row className='card_table table_row'>
                                                <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                                    <div>현장명</div>
                                                </Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                    <Row style={{width:'100%'}}>
                                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                            <Row style={{width:'100%'}}>
                                                                {userData.accident_title}
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md='6' xs='6'>
                                            <Row className='card_table table_row'>
                                                <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                                    <div>근무자</div>
                                                </Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                    <Row style={{width:'100%'}}>
                                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                            <Row style={{width:'100%'}}>
                                                                {userData.employees}
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
                        <Col md='4' xs='12'>
                            <Sign 
                                userSign={userSign}
                                setUserSign={setUserSign}
                                signList={signList}
                                setSignList={setSignList}
                                signNameList={signNameList}
                                completable = {userSign.find(user => String(user.user) === cookies.get('userId'))}
                                isRejected={userData?.is_rejected}
                            />
                        </Col>
                    </Row>
                    {userData.is_rejected === SIGN_REJECT && 
                            <Row className='card_table'>
                                <div className="mb-1" style={{color:'crimson'}}>
                                    <Col className='card_table col text' style={{paddingBottom:0}}>
                                        <div style={{fontSize:'21px'}}>반려 사유</div>
                                    </Col>
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%', height: '15em', border:'1px solid #C1C1CB', whiteSpace:'break-spaces', overflow: 'auto'}}>
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
                                <div style={{fontSize:'21px'}}>사건 개요</div>
                            </Col>
                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                <Row style={{width:'100%', minHeight: '15rem', border:'1px solid #C1C1CB', whiteSpace:'break-spaces'}}>
                                    <div style={{padding: '1rem'}}>
                                        {userData.event_outline}
                                    </div>
                                </Row>
                            </Col>
                        </div>
                    </Row>
                    <Row className='card_table'>
                        <div className="mb-1">
                            <Col className='card_table col text' style={{paddingBottom:0}}>
                                <div style={{fontSize:'21px'}}>사진</div>
                            </Col>
                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                <Row style={{width:'100%', border:'1px solid #C1C1CB', alignItems:'center', padding:'0.5%'}}>
                                    {userData.report_files && 
                                        userData.report_files.map((file, idx) => {
                                            if (file.type === 'picture') {
                                                return (
                                                    <Col md='4' xs='12' style={{display:'flex', justifyContent:'center', height:'fit-content'}}> 
                                                        <Card style={{height:'264px'}}>
                                                            <img key={idx} src={`/static_backend/${file.path}${file.file_name}`} style={{objectFit: 'scale-down', height:'inherit' }} />
                                                        </Card>
                                                    </Col>
                                                )
                                            }
                                        })
                                    }
                                </Row>
                            </Col>
                        </div>
                    </Row>
                    <Row className='card_table'>
                        <div className="mb-1">
                            <Col className='card_table col text' style={{paddingBottom:0}}>
                                <div style={{fontSize:'21px'}}>진행 경과</div>
                            </Col>
                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                <Row style={{width:'100%', minHeight: '15rem', border:'1px solid #C1C1CB', whiteSpace:'break-spaces'}}>
                                    <div style={{padding: '1rem'}}>
                                        {userData.section_1}
                                    </div>
                                </Row>
                            </Col>
                        </div>
                    </Row>
                    <Row className='card_table'>
                        <div className="mb-1">
                            <Col className='card_table col text' style={{paddingBottom:0}}>
                                <div style={{fontSize:'21px'}}>처리 예정</div>
                            </Col>
                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                <Row style={{width:'100%', minHeight: '15rem', border:'1px solid #C1C1CB', whiteSpace:'break-spaces'}}>
                                    <div style={{padding: '1rem'}}>
                                        {userData.section_2}
                                    </div>
                                </Row>
                            </Col>
                        </div>
                    </Row>
                    <Row className='card_table'>
                        <div className="mb-1">
                            <Col className='card_table col text' style={{paddingBottom:0}}>
                                <div style={{fontSize:'21px'}}>조치 결과</div>
                            </Col>
                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                <Row style={{width:'100%', minHeight: '15rem', border:'1px solid #C1C1CB', whiteSpace:'break-spaces'}}>
                                    <div style={{padding: '1rem'}}>
                                        {userData.section_3}
                                    </div>
                                </Row>
                            </Col>
                        </div>
                    </Row>
                    <Row className='card_table top mb-1'>
                        <Col>
                            <Row className='card_table table_row'>
                                <Col lg='2' md='2' xs='2' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                    <div>조치 확인자</div>
                                </Col>
                                <Col lg='10' md='10' xs='10' className='card_table col text center'>
                                    <Row style={{width:'100%'}}>
                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', padding:0}}>
                                            <Row style={{width:'100%'}}>
                                                {userData.confirm_employee}
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='card_table mb-1'>
                        <Col>
                            {userData.report_files && 
                                <Row style={{borderBottom: '3px dotted #ccc', marginBottom:'1%'}}>
                                    <div>
                                        <Col className='card_table col text' >
                                            <div style={{fontSize:'21px'}}>첨부 자료{fileCount}</div>
                                        </Col>
                                    </div>
                                </Row>
                            }
                            {userData.report_files && userData.report_files.map((file, idx) => {
                                if (file.type === 'file') {
                                    let imagePath
                                    const file_path = file.original_file_name.split('.').pop()
                                    try {
                                    imagePath = require(`../../../assets/images/icons/${file_path}.png`).default
                                    } catch (error) {
                                    imagePath = require('../../../assets/images/icons/unknown.png').default
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
                                }
                            })}
                        </Col>
                    </Row>
                    <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                        <Fragment >
                            { isMod && isInCharge && userData.is_rejected !== SIGN_REJECT &&
                                <Button hidden={checkOnlyView(loginAuth, REPORT_INFO, 'available_update')}
                                    color='danger' 
                                    className="ms-1 approval-button"
                                    onClick={() => {
                                        sweetAlertCallback(
                                            '보고서 회수', 
                                            '해당 보고서를 회수하시겠습니까?.<br/>결재 내역은 초기화 됩니다.', 
                                            'warning',
                                            'right',
                                            handleSignCollect,
                                            true,
                                            '보고서 회수가 취소 되었습니다.<br/>재 확인 해주세요.'
                                        )
                                    }}
                                >회수</Button>
                            }
                            { userData.is_rejected === SIGN_REJECT && isInCharge &&
                                <div>
                                    <Button hidden={checkOnlyView(loginAuth, REPORT_INFO, 'available_delete')}
                                        type='button' color="danger" onClick={handleDeleteSubmit}>삭제</Button>
                                    <Button hidden={checkOnlyView(loginAuth, REPORT_INFO, 'available_update')}
                                        type='submit' color='primary' 
                                            className="ms-1"
                                            tag={Link} 
                                            to={ROUTE_REPORT_ACCIDENT_FORM} 
                                            state={{
                                                reportType: userData.main_purpose,
                                                type:'modify',
                                                id: id
                                    }}>수정</Button>
                                </div>
                            }
                            { userData.is_rejected === SIGN_CONFIRM && signButton && getObjectKeyCheck(userSign[3], 'is_final') === false && 
                                <div>
                                    {isSignPreSign && <Button hidden={checkOnlyView(loginAuth, REPORT_INFO, 'available_update')}
                                        className="ms-1" type='button' color="primary" onClick={() => handleSignSubmit()}> 결재 </Button>}
                                </div>
                            }
                            { userData.is_rejected === SIGN_CONFIRM && activeUser !== userSign[0].user && isSignPreSign &&
                                <Button hidden={checkOnlyView(loginAuth, REPORT_INFO, 'available_update')}
                                    className="ms-1" type='button' color="danger" onClick={toggle}> 반려 </Button>
                            }
                            <Button
                                className="ms-1"
                                tag={Link} 
                                to={ROUTE_REPORT_TOTAL}
                                state={{
                                    type: userData.main_purpose
                                }}
                                >목록</Button>
                        </Fragment>
                    </CardFooter>
                    <RejectModal 
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        id={id}
                        userData={userData.sign_lines}
                        type = {'report'}
                        API={API_REPORT_REJECT}
                        returnAPI={ROUTE_REPORT_TOTAL}
                    />
                </CardBody>
                }
            </Card>

        </Fragment>
    )
}

export default ReportAccidentDetail