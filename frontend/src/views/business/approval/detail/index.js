import axios from 'axios'
import Swal from 'sweetalert2'
import * as moment from 'moment'
import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState, useEffect } from 'react'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, Col, Row, CardFooter } from "reactstrap"
import { 
    API_BUSINESS_APPROVAL_DETAIL, ROUTE_BUSINESS_REQUISITION, 
    API_BUSINESS_APPROVAL_SIGN_FROM, URL, 
    API_BUSINESS_APPROVAL_REJECT 
} from "../../../../constants"
import { BUSINESS_REQUISITION_BTL, BUSINESS_REQUISITION_OURIDURI } from "../../../../constants/CodeList"
import Sign from './Sign'
import {signListObj} from '../ApprovalData'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import RejectModal from '../../../Report/detail/RejectModal'
import { SIGN_COLLECT, SIGN_CONFIRM, SIGN_REJECT, axiosDeleteParm, checkOnlyView, getObjectKeyCheck, isSignPreSignCheck, signAuthCheck, signPreCheck, sweetAlert, sweetAlertCallback } from '../../../../utility/Utils'
import { useSelector } from 'react-redux'

const ApprovalLetterDetail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    require('moment/locale/ko')
    const { id } = useParams()
    const location = useLocation()
    const type = location.state
    const cookies = new Cookies()
    const navigate = useNavigate()
    const [data, setData] = useState()
    const [userSign, setUserSign] = useState(["", "", "", ""])
	const [signList, setSignList] = useState([0, 0, 0, 0])
    const [signIdList, setSignIdList] = useState([])
    const [signNameList, setSignNameList] = useState([])
    const [isOpen, setIsOpen] = useState(false)
        
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
        axios.put(`${API_BUSINESS_APPROVAL_REJECT}/${id}`, formData, {
        }).then(() => {
            sweetAlertCallback('회수 완료', '품의서 회수가 완료 되었습니다', 'success', 'right', function() {
                navigate(`${ROUTE_BUSINESS_REQUISITION}/${type}`)
            })
        }).catch(() => {
            console.log('server error')
        })
    }

    const handleDownload = (path, name, orangeName) => {
        axios({
            url: `${URL}/static_backend/${path}${(name)}`, // 수정해야함.
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
        axiosDeleteParm('품의서', API_BUSINESS_APPROVAL_DETAIL, { data: {approval_letter_id : id } }, `${ROUTE_BUSINESS_REQUISITION}/${type}`, navigate)
	}
    // handleDeleteSubmit end

    const handleSignSubmit = () => {
		const activeUserIndex = signIdList.indexOf(cookies.get('userId'))
        const previousUserSigns = [ // 클릭한 박스의 왼쪽 박스 유저를 가져옴
            userSign[activeUserIndex - 1],
            userSign[activeUserIndex - 2],
            userSign[activeUserIndex - 3]
        ]
        const preSignCheckResult = signPreCheck(activeUser, previousUserSigns)
        
        if (activeUserIndex === 0 || (getObjectKeyCheck(preSignCheckResult, 'result') !== '' && preSignCheckResult.result)) { // 이전 결재자 결재 체크
            // temp 실제 db 날아가는 로직
            return Swal.fire({
                title: '알림',
                html: "확인을 클릭하면 더는 수정하실 수 없습니다.\n 해당 결재 내역을 저장하시겠습니까?",
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: '취소',
                confirmButtonText: '결재',
                customClass: {
                    cancelButton: 'btn btn-report ms-1',
                    confirmButton: 'btn btn-primary',
                    container: 'space',
                    actions: 'sweet-alert-custom right'
                }
                // buttonsStyling: false
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
                    axios.put(`${API_BUSINESS_APPROVAL_SIGN_FROM}/${id}`, formData, {
                    })
                    .then(res => {
                        if (res.status = 200) {
                            Swal.fire({
                                title: '결재 완료!',
                                text: '결재가 진행 되었습니다',
                                icon: 'success',
                                customClass: {
                                    confirmButton: 'btn btn-success',
                                    actions: 'sweet-alert-custom right'
                                }
                            })
                            navigate(`${ROUTE_BUSINESS_REQUISITION}/${type}/detail/${id}`, {state: type})
                        }
                    })
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    sweetAlert('결재 취소', '결재가 취소 되었습니다. 재 확인 해주세요.', 'info')
                }
            })
            // temp end
        } else {
            sweetAlert('결재 불가', `${signListObj[preSignCheckResult.index]} 결재가 진행 되지 않았습니다.`, 'warning')
        }
    }

    useEffect(() => {
        axios.get(API_BUSINESS_APPROVAL_DETAIL, {
            params: {approval_letter_id : id}
        }).then((res) => {
            setData(res.data)
            const nameList = []
            const signTypeList = []
            const idList = []
            res.data.line.map(data => {
                nameList.push(data.username)
                signTypeList.push(data.type)
                idList.push(String(data.user))
            })
            setSignNameList(nameList)
            setSignList(signTypeList)
            setSignIdList(idList)
            setUserSign(res.data.line)
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
                    <Breadcrumbs breadCrumbTitle='품의서' breadCrumbParent='사업관리' breadCrumbActive='품의서'/>
                </div>
            </Row>
            <Card>
                <CardBody>
                    {data && data.is_rejected === SIGN_REJECT && 
                        <Row className='card_table'>
                            <div className="mb-1" style={{color:'crimson'}}>
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div style={{fontSize:'21px'}}>반려 사유</div>
                                </Col>
                                <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                    <Row style={{width:'100%', height: '10rem', border:'1px solid #C1C1CB', whiteSpace:'break-spaces', overflow: 'auto'}}>
                                        {data.reject_list.map(data => {
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
                    <Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='8' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row style={{height:'33%'}}>
                                <Col xs='4' md='3'  className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3'}}>
                                분류번호
                                </Col>
                                <Col xs='8' md='9' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                    <Row style={{height: '100%', width:'100%', alignItems:'center'}}>
                                        <div>
                                            {data && data.code}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{height:'33%'}}>
                                <Col xs='4' md='3'  className='card_table col col_color text center ' style={{borderBottom: '1px solid #B9B9C3'}}>
                                <div>보존년한</div>
                                </Col>
                                <Col xs='8' md='9' className='card_table col text start ' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                    <Row style={{height: '100%', width:'100%', alignItems:'center'}}>
                                        <div>
                                            {data && data.preserve_year}년
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{height:'34%'}}>
                                <Col xs='4' md='3'  className='card_table col col_color text center '>
                                <div>기안부서</div>
                                </Col>
                                <Col xs='8' md='9' className='card_table col text start ' style={{borderRight: '1px solid #B9B9C3'}}> 
                                    <Row style={{height: '100%', width:'100%', alignItems:'center'}}>
                                        <div>
                                            {data && data.department}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                        
                        </Col>
                        <Col xs='12' md='4' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row>
                            <Col md='12' xs='12' className='p-0'>
                                <Sign 
                                    userSign={userSign}
                                    setUserSign={setUserSign}
                                    signList={signList}
                                    setSignList={setSignList}
                                    signIdList={signIdList}
                                    signNameList={signNameList}
                                    completable = {userSign.find(user => String(user.user) === cookies.get('userId'))}
                                />
                            </Col>
                                
                            </Row>
                        </Col>
                    </Row>

                    <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row style={{height:'100%'}}>
                                <Col xs='4' md='2'  className='card_table col col_color text center '>
                                    기안일자
                                </Col>
                                <Col xs='8' md='6' className='card_table col text start '>
                                    <Row style={{height: '100%', width:'100%'}}>
                                        <div>
                                            {data && data.report_date && data.report_date.split('T')[0]}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row style={{height:'100%'}}>
                                <Col xs='4' md='2'  className='card_table col col_color text center '>
                                    전결근거 및 전결권자
                                </Col>
                                <Col xs='8' md='10' className='card_table col text start '>
                                    <Row style={{height: '100%', width:'100%'}}>
                                        <div>
                                            {data && data.arbitary_cause}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row style={{height:'100%'}}>
                                <Col xs='4' md='2'  className='card_table col col_color text center '>
                                    합의
                                </Col>
                                <Col xs='8' md='10' className='card_table col text start '>
                                    <Row style={{height: '100%', width:'100%'}}>
                                        <div>
                                            {data && data.agreement}
                                        </div>
                                    </Row>  
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row style={{height:'100%'}}>
                                <Col xs='4' md='2'  className='card_table col col_color text center '>
                                    제목
                                </Col>
                                <Col xs='8' md='10' className='card_table col text start '>
                                    <Row style={{height: '100%', width:'100%'}}>
                                        <div>
                                            {data && data.title}
                                        </div>
                                    </Row>                        
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row style={{height:'100%'}}>
                                <Col xs='4' md='2'  className='card_table col col_color text center '>
                                    목적
                                </Col>
                                <Col xs='8' md='10' className='card_table col text start '>
                                    <Row style={{height: '100%', width:'100%'}}>
                                        <div>
                                            {data && data.purpose}
                                        </div>
                                    </Row>                             
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row style={{height:'100%'}}>
                                <Col xs='4' md='2'  className='card_table col col_color text center '>
                                    업체명
                                </Col>
                                <Col xs='8' md='10' className='card_table col text start '>
                                    <Row style={{height: '100%', width:'100%'}}>
                                        <div>
                                            {data && data.company_name}
                                        </div>
                                    </Row>                             
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row style={{height:'100%'}}>
                                <Col xs='4' md='2'  className='card_table col col_color text center '>
                                    집행금액
                                </Col>
                                <Col xs='8' md='10' className='card_table col text start ' style={{ justifyContent:'end' }}>
                                    <Row style={{height: '100%', paddingRight:'10px', justifyContent: 'end'}}>
                                           {data && data.execution_amount && data.execution_amount.toLocaleString('ko-KR')} {data && data.execution_amount && '원'}
                                    </Row>                               
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='12'>
                            <Row style={{height:'100%'}}>
                                <Col xs='4' md='2'  className='card_table col col_color text center '>
                                    집행내용
                                </Col>
                                <Col xs='8' md='10' className='card_table col text start '>
                                    <Row style={{height: '100%', width:'100%'}}>
                                        <Col className='risk-report content-h px-2 py-2' style={{overflowX: 'scroll'}} dangerouslySetInnerHTML={{__html: data && data.content}}>
                                        </Col>
                                    </Row>                                
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row style={{height:'100%', minHeight:'80px'}}>
                                <Col xs='4' md='2'  className='card_table col col_color text center' style={{borderTop: '1px solid #B9B9C3'}}>
                                    <div style={{textAlign:'center'}}>예산대비 집행내역</div>
                                </Col>
                                <Col xs='8' md='10' style={{height:'100%'}} >
                                    <Row style={{height:'100%'}}>
                                        <Col xs='12' md='3'  style={{borderRight: '1px solid #B9B9C3', borderTop:'1px solid #B9B9C3' }}>
                                            <Row xs='6'  style={{borderBottom: '1px solid #B9B9C3', height:'50%', justifyContent:'center', alignItems: 'center'}}>
                                                예산
                                            </Row>
                                            <Row xs='6' style={{padding: '5px', alignItems:'center', justifyContent: 'end', height:'50%'}}>
                                                {data && data.budget && data.budget.toLocaleString('ko-KR')} 원
                                            </Row>
                                        </Col>
                                        <Col xs='12' md='3'  style={{borderRight: '1px solid #B9B9C3', borderTop:'1px solid #B9B9C3'}}>
                                            <Row xs='6'  style={{borderBottom: '1px solid #B9B9C3', height:'50%', justifyContent:'center', alignItems: 'center'}}>
                                                기집행 금액
                                            </Row>
                                            <Row xs='6' style={{padding: '5px', alignItems:'center', justifyContent: 'end', height:'50%'}}>
                                                {data && data.recently_total && data.recently_total.toLocaleString('ko-KR')} 원
                                            </Row>
                                        </Col>
                                        <Col xs='12' md='3'  style={{borderRight: '1px solid #B9B9C3', borderTop:'1px solid #B9B9C3'}}>
                                            <Row xs='6'  style={{borderBottom: '1px solid #B9B9C3', height:'50%', justifyContent:'center', alignItems: 'center'}}>
                                                    금번 집행액
                                            </Row>
                                            <Row xs='6' style={{padding: '5px', alignItems:'center', justifyContent: 'end', height:'50%'}}>
                                               {data && data.execution_amount && data.execution_amount.toLocaleString('ko-KR')} 원
                                            </Row>
                                        </Col>
                                        <Col xs='12' md='3' style={{ borderTop:'1px solid #B9B9C3'}}>
                                            <Row xs='6'  style={{ height:'50%', borderBottom: '1px solid #B9B9C3', justifyContent:'center', alignItems: 'center'}}>
                                                잔액
                                            </Row>
                                            <Row xs='6' style={{padding: '5px', alignItems:'center', justifyContent: 'end', height:'50%'}}>
                                                {data && data.budget && (data.budget - data.recently_total - data.execution_amount).toLocaleString('ko-KR')} 원
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row style={{height:'100%'}}>
                                <Col xs='4' md='2'  className='card_table col col_color text center '>
                                    처리과목
                                </Col>
                                <Col xs='8' md='10' className='card_table col text start '>
                                    <Row style={{height: '100%', width:'100%'}}>
                                        <div>
                                            {data && data.processing_items}    
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className='card_table mt-2 mb-1'>
                        <Col>
                        {data && data.report_files && 
                            <Row style={{borderBottom: '3px dotted #ccc', marginBottom:'1%'}}>
                                <div>
                                    <Col className='card_table col text' >
                                        <div style={{fontSize:'21px'}}>첨부 자료 {data.report_files.length}개</div>
                                    </Col>
                                </div>
                            </Row>
                        }
                        {data && data.report_files && data.report_files.map((file, idx) => {
                                let imagePath
                                const file_path = file.original_file_name.split('.').pop()
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
                        <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                            <Fragment>
                                <Row>
                                    <div className='approval-style' style={{display:'flex', justifyContent:'flex-end'}}>
                                        { isMod && isInCharge && data.is_rejected !== SIGN_REJECT && data.is_rejected !== SIGN_COLLECT &&
                                            <Button 
                                                hidden={checkOnlyView(loginAuth, type === 'btl' ? BUSINESS_REQUISITION_BTL : BUSINESS_REQUISITION_OURIDURI, 'available_delete')}
                                                type='button' 
                                                className='approval-button' 
                                                color="danger" 
                                                onClick={() => {
                                                    sweetAlertCallback(
                                                        '품의서 회수', 
                                                        '해당 품의서를 회수하시겠습니까?.<br/>결재 내역은 초기화 됩니다.', 
                                                        'warning',
                                                        'right',
                                                        handleSignCollect,
                                                        true,
                                                        '품의서 회수가 취소 되었습니다.<br/>재 확인 해주세요.'
                                                    )
                                                }}>
                                                    회수
                                            </Button>
                                        }
                                        { data  && (data.is_rejected === SIGN_REJECT || data.is_rejected === SIGN_COLLECT) && isInCharge &&
                                            <>
                                                <div>
                                                    <Button hidden={checkOnlyView(loginAuth, type === 'btl' ? BUSINESS_REQUISITION_BTL : BUSINESS_REQUISITION_OURIDURI, 'available_delete')}
                                                        type='button' className='approval-button' color="danger" onClick={handleDeleteSubmit}>
                                                            삭제
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button hidden={checkOnlyView(loginAuth, type === 'btl' ? BUSINESS_REQUISITION_BTL : BUSINESS_REQUISITION_OURIDURI, 'available_update')}
                                                        type='submit' color='primary' 
                                                        className="ms-1 approval-button"
                                                        onClick={() => { navigate(`${ROUTE_BUSINESS_REQUISITION}/${type}/fix/${id}`, { state: { type: 'modify', prop: type } }) } }
                                                    >수정</Button>
                                                </div>
                                            </>
                                        }
                                        { data && data.is_rejected === SIGN_CONFIRM && signButton && userSign[3].is_final === false &&
                                            <div>
                                                {isSignPreSign && <Button hidden={checkOnlyView(loginAuth, type === 'btl' ? BUSINESS_REQUISITION_BTL : BUSINESS_REQUISITION_OURIDURI, 'available_update')}
                                                    className="ms-1 approval-button" type='button' color="primary" onClick={() => handleSignSubmit()}> 결재 </Button>}
                                            </div>
                                        } 
                                        { data && data.is_rejected === SIGN_CONFIRM && activeUser !== userSign[0].user && isSignPreSign &&
                                            <div>
                                                <Button hidden={checkOnlyView(loginAuth, type === 'btl' ? BUSINESS_REQUISITION_BTL : BUSINESS_REQUISITION_OURIDURI, 'available_update')}
                                                    className="ms-1 approval-button" type='button' color="danger" onClick={toggle}> 반려 </Button>
                                            </div>
                                        }
                                        <div>
                                            <Button
                                                className="ms-1 approval-button"
                                                xs={12}
                                                tag={Link} 
                                                to={`${ROUTE_BUSINESS_REQUISITION}/${type}`}
                                                >목록</Button>
                                        </div>
                                    </div>
                                </Row>
                            </Fragment>
                        </CardFooter>
                        <RejectModal 
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            id={id}
                            userData={userSign}
                            type = {'approval'}
                            state = {type}
                            API={API_BUSINESS_APPROVAL_REJECT}
                            returnAPI={`${ROUTE_BUSINESS_REQUISITION}/${type}`}
                        />
                </CardBody>
            </Card>
        </Fragment>
    )

}

export default ApprovalLetterDetail