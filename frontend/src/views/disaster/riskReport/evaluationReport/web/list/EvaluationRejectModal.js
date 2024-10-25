import Cookies from 'universal-cookie'
import { useForm, Controller } from "react-hook-form"
import { useSelector, useDispatch } from 'react-redux'
import { Button, Col, Form, FormFeedback, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import { API_CRITICAL_DISASTER_EVALUATION_REJECT } from '../../../../../../constants'

import winLogoImg from '@src/assets/images/winlogo.png'
import { sweetAlert, axiosPostPutCallback } from '@utils'
import { useAxiosIntercepter } from '../../../../../../utility/hooks/useAxiosInterceptor'
import { setEducationId, setMeetingId, setPageType } from '../../../../../../redux/module/criticalDisaster'
import { primaryColor } from '../../../../../../utility/Utils'

const EvaluationRejectModal = (props) => {
    useAxiosIntercepter()
    const {isOpen, setIsOpen, setUserSign} = props
    const cookies = new Cookies()
    const dispatch = useDispatch()
    const criticalDisaster = useSelector((state) => state.criticalDisaster)

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({})

        const handleReturnNotification = (data) => {
        const setTabObj = {
			meeting : setMeetingId,
			education : setEducationId,
			evaulation : '위험성평가'
		}
        if (criticalDisaster.tab === 'education' || criticalDisaster.tab === 'meeting') {
			setUserSign(data.sign_list)
		}
        dispatch(setPageType('detail'))
        dispatch(setTabObj[data.tab](data.id))
        reset()
        setIsOpen(!isOpen)
    }

    const onSubmit = (data) => {
        const titleObj = {
			meeting : '사전회의',
			education : '안전교육',
			evaulation : '위험성평가'
		}
        const tabIdObj = {
            meeting : criticalDisaster.meetingId,
			education : criticalDisaster.educationId,
			evaulation : '위험성평가'
        }
        console.log(data)
        const formData = new FormData()
        formData.append('is_rejected', true)
        formData.append('reason', data.reason)
        formData.append('userId',  cookies.get('userId'))
        formData.append('tab',  criticalDisaster.tab)
        formData.append('tab_id', tabIdObj[criticalDisaster.tab])
        formData.append('type', 'reject')

        axiosPostPutCallback('modify', `${titleObj[criticalDisaster.tab]} 반려`, API_CRITICAL_DISASTER_EVALUATION_REJECT, formData, handleReturnNotification, true, '진행')
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
export default EvaluationRejectModal