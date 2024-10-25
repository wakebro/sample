import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Cookies from 'universal-cookie'
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, Card, ModalHeader, InputGroup, Row, ModalFooter } from "reactstrap"
import { API_INTRANET_NOTIFICATION_FORM } from '../../../constants'
import {validationRejectModal} from '../ReportData'
import winLogoImg from '@src/assets/images/winlogo.png'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { yupResolver } from "@hookform/resolvers/yup"
import { sweetAlert, primaryColor } from '../../../utility/Utils'

const RejectModal = (props) => {
    useAxiosIntercepter()
    const {isOpen, setIsOpen, id, userData, type, API, returnAPI} = props
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate()
    const cookies = new Cookies()

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(validationRejectModal)
    })

    const onSubmit = (data) => {
        const formData = new FormData()
        formData.append('is_rejected', true)
        formData.append('reason', data.reason)
        formData.append('userId',  cookies.get('userId'))
        axios.put(`${API}/${id}`, formData, {
        })
        .then(res => {
            if (res.status = '200') {
                const formData = new FormData()
                formData.append('subject', `${type === 'report' ? '보고서 반려' : '품의서 반려'}`)
                formData.append('contents', data.reason)
                formData.append('sender_id', cookies.get('userId'))
                const list = [userData.map(user => user.user)]
                formData.append('employee_list', list)
                formData.append('doc_file', 'undefined')
                formData.append('where_to_start', `${type}_${id}`)
                axios.post(API_INTRANET_NOTIFICATION_FORM, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then(res => {
                    if (res.status === 200) {
                        MySwal.fire({
                            title: '반려 완료',
                            text: '반려가 진행 되었습니다',
                            icon: 'success',
                            heightAuto: false,
                            customClass: {
                                confirmButton: 'btn btn-primary',
                                actions: `sweet-alert-custom right`
                            }
                        }).then(res => {
                            if (res.isConfirmed === true) {
                                navigate(returnAPI)
                            }
                        })
                    }
                })
            }
        })
    }

    const customToggle = () => {
        sweetAlert('반려 취소', '반려가 취소 되었습니다. 재 확인 해주세요.', 'info')
		setIsOpen(!isOpen)
        reset()
	}

    return (
        <Modal isOpen={isOpen} toggle={() => customToggle()} className='modal-dialog-centered'>
            <ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
                <div className='mb-1' style={{display: 'flex', alignItems: 'center', paddingLeft: '3%'}}>
                    <div className='mt-1' style={{width: '76%'}}>
                        <Row>
                            <span style={{color: 'white', fontSize: '20px'}}>
                                반려 등록<br />
                            </span>
                        </Row>
                        <Row>
                            <span style={{color: 'white'}}>
                            반려 사유를 작성해 주세요.
                            </span>
                        </Row>
                    </div>
                    <div>
                        <img src={winLogoImg} style={{maxHeight: '85px'}}/> 
                    </div>
                </div>
            </ModalHeader>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <Row style={{margin: 0}}>
                        반려 사유
                    </Row>
                    <Controller
                        id='reason'
                        name='reason'
                        control={control}
                        render={({ field }) => (
                        <Input className='mb-1' type="textarea" invalid={errors.reason && true} {...field} />
                        )}
                    />
                    {errors.reason && <FormFeedback>{errors.reason.message}</FormFeedback>}
                    <Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%'}}>
                        <Button color='report' style={{marginTop: '1%', marginRight: '1%'}} onClick={customToggle}>
                            취소</Button>
                        <Button color='primary' style={{marginTop: '1%'}}>
                            확인</Button>
                    </Col>
                </ModalBody>
            </Form>
        </Modal>
    )
}

export default RejectModal