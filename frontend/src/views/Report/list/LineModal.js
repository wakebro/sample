import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Cookies from 'universal-cookie'
import { useEffect, useState } from "react"
import { Button, Col, Modal, ModalBody, ModalHeader, Row, ModalFooter } from "reactstrap"
import { API_INTRANET_NOTIFICATION_FORM, API_DISASTER_EVALUATION_SIGN_CHECK } from '../../../constants'
import ReportSign from '../detail/ReportSign'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import {getTableDataCallback, sweetAlert} from '../../../utility/Utils'

const LineModal = (props) => {
    useAxiosIntercepter()
    const MySwal = withReactContent(Swal)
    const cookies = new Cookies()
    const {isOpen, setIsOpen, data, state} = props
    const [userSign, setUserSign] = useState([])
	const [signList, setSingList] = useState([])
    const [signNameList, setSignNameList] = useState([])
    const [unDoneUserId, setUnDoneUserID] = useState([])
    const [isSendButton, setIsSendButton] = useState(false)

    const customToggle = () => {
		setIsOpen(!isOpen)
	}

    const sendNotification = (returnData) => {
        if (returnData.state === 200) {
            const formData = new FormData()
            formData.append('subject', data.accident_title)
            formData.append('contents', data.title)
            formData.append('sender_id', cookies.get('userId'))
            formData.append('employee_list', unDoneUserId)
            formData.append('doc_file', 'undefined')
            formData.append('where_to_start', `${data.main_purpose}_${data.id}`)
            axios.post(API_INTRANET_NOTIFICATION_FORM, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then(res => {
                if (res.status === 200) {
                    sweetAlert('완료', '알림 발송 완료되었습니다!', 'success', 'right')
                } else {
                    sweetAlert('실패', '다시한번 확인 해주세요.', 'warning', 'right')
                }
            })
        } else {
            sweetAlert('실패', `알림은 10분간격으로 전송이 가능합니다.<br/><br/>${10 - Math.floor(returnData.time)}후에 다시 시도해주세요.`, 'info', 'right')

        }
    }

    const handleNotificaionSend = () => {
        getTableDataCallback(API_DISASTER_EVALUATION_SIGN_CHECK, {form_id:data.id, type:data.main_purpose}, sendNotification)
    }

    useEffect(() => {
        if (data) {
            const signList = []
            const nameList = []
            const unDoneSignUserId = []
            data.line.map(data => {
                nameList.push(data.username)
                signList.push(data.type)
                if (data.is_final === false) {
                    unDoneSignUserId.push(data.user)
                }
            })
            setUnDoneUserID(unDoneSignUserId)
            setIsSendButton(data?.is_final === true && data?.is_rejected === 0 && unDoneSignUserId?.length > 0)
            if (data.line?.length > 0) {
                setUserSign(data.line)
                setSingList(signList)
                setSignNameList(nameList)
                return
            }
            setUserSign(['', '', '', ''])
            setSingList([3, 3, 3, 3])
        }
    }, [data])
    
    return (
        <Modal isOpen={isOpen} toggle={() => customToggle()} className='modal-dialog-centered'>
            <ModalHeader style={{backgroundColor:'white'}}>
                <div style={{fontSize:'20px'}}>
                    보고서 결재 내역
                </div>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col md='12' xs='12'>
                        <Row className='card_table table_row'>
                            <Col lg='2' md='2' xs='4' className='card_table col text'>
                                <div>현장명</div>
                            </Col>
                            <Col lg='10' md='10' xs='8' className='card_table col text center'>
                                <Row style={{width:'100%'}}>
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%'}}>
                                            {data && 
                                                data.accident_title
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md='12' xs='12'>
                        <Row className='card_table table_row'>
                            <Col lg='2' md='2' xs='4' className='card_table col text'>
                                <div>보고서명</div>
                            </Col>
                            <Col lg='10' md='10' xs='8' className='card_table col text center'>
                                <Row style={{width:'100%'}}>
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%'}}>
                                        {data && 
                                            data.title
                                        }
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ReportSign 
                            userSign={userSign}
                            setUserSign={setUserSign}
                            signList={signList}
                            setSingList={setSingList}
                            state={state}
                            signNameList={signNameList}
                            completable = {userSign.find(user => String(user.user) === cookies.get('userId'))}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col style={{display:'flex', justifyContent:'center', paddingTop:'2%', fontSize:'16px'}}>
                        {data && (
                            (() => {
                                let count = 0
                                signList.forEach((type) => {
                                    if (type === 1 || type === 2 || type === 3) {
                                        count++
                                    }
                                })
                                return <div>완료된 서명 {count}/4</div>
                            })()
                        )}
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Col className={ isSendButton ? 'd-flex justify-content-between' : 'd-flex justify-content-end'}>
                    { isSendButton &&
                        <Button color='primary' outline style={{marginTop: '1%', marginRight: '1%'}} onClick={() => handleNotificaionSend()}>
                            미완료자 알림 발송
                        </Button>
                    }
                    <Button color='primary' style={{marginTop: '1%'}} onClick={customToggle}>
                        확인
                    </Button>
                </Col>
            </ModalFooter>
        </Modal>
    )
}

export default LineModal