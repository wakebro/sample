import Select from 'react-select'
import { useState } from "react"
import { useNavigate } from 'react-router'
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, Card, ModalHeader, InputGroup, Row } from "reactstrap"
import { ROUTE_REPORT_FORM, ROUTE_REPORT_ACCIDENT_FORM } from "../../../constants"
import { reportType } from '../ReportData'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import winLogoImg from '@src/assets/images/winlogo.png'
import { primaryColor } from '../../../utility/Utils'

const RegisterModal = (props) => {
    useAxiosIntercepter()
    const {isOpen, setIsOpen} = props
    const [selected, setSelected] = useState(reportType[0])
    const navigate = useNavigate()

    const customToggle = () => {
		setIsOpen(!isOpen)
		// reset()
	}

    const sendRegisterType = () => {
        if (selected.value !== '') {
            if (selected.value === 'accident') {
                navigate(ROUTE_REPORT_ACCIDENT_FORM, {state:{reportType:selected.value, type:'register'}})
            } else {
                navigate(ROUTE_REPORT_FORM, {state:{reportType:selected.value, type:'register'}})
            }
            setIsOpen(!isOpen)
        }
    }

    return (
        <Modal isOpen={isOpen} toggle={() => customToggle()} className='modal-dialog-centered'>
            <ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
                <div className='mb-1' style={{display: 'flex', alignItems: 'center', paddingLeft: '7%'}}>
                    <div className='mt-1' style={{width: '74%'}}>
                        <Row>
                            <span style={{color: 'white', fontSize: '20px'}}>
                                양식 선택<br />
                            </span>
                        </Row>
                        <Row>
                            <span style={{color: 'white'}}>
                            작성하실 보고서 양식을 선택해주세요.
                            </span>
                        </Row>
                    </div>
                    <div>
                        <img src={winLogoImg} style={{maxHeight: '85px'}}/> 
                    </div>
                </div>
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col style={{ paddingLeft: '1%' }}>
                        <Select
                            classNamePrefix={'select'}
                            className="react-select"
                            options={reportType}
                            value={selected}
                            onChange={(e) => setSelected(e)}
                        />
                    </Col>
                </Row>
                <Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%'}}>
                    <Button color='report' style={{marginTop: '1%', marginRight: '1%'}} onClick={customToggle}>
                        취소</Button>
                    <Button color='primary' style={{marginTop: '1%'}} onClick={sendRegisterType}>
                        확인</Button>
                </Col>
            </ModalBody>
        </Modal>

)
}
export default RegisterModal