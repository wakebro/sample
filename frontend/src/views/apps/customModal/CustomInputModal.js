/* eslint-disable */
import { Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import winLogoImg from '@src/assets/images/winlogo.png'
import Select from 'react-select'
import { useEffect, useRef, useState } from "react"
import { getTableData, primaryColor } from "../../../utility/Utils"
import Cookies from "universal-cookie"
import { useNavigate } from "react-router-dom"
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"

// 공용 컴포넌트 선택 모달
const CustomInputModal = (props) => {
    const {
        headerTitle, // modal 제목
        headerHelpText, // modal 도움말 
        isOpen, // modal open state
        setIsOpen, // modal open state set
        navAPI, 
        input,
        setInput,
        callbackSubmit
    } = props

    // 필수 변수
	const navigate = useNavigate()
    const [buttonDisabled, setButtonDisabled] = useState(true)

    const customToggle = () => {
        if (setInput) setInput('')
		setIsOpen(!isOpen)
	} // customToggle end

    // 사업소 그룹 선택 버튼
    const handleSubmit = () => {
        if (input) {
            callbackSubmit(input)
            setIsOpen(false)
            return
        }
        setIsOpen(false)
        if (navAPI && navAPI !== '') { // 넘어갈 네비가 있을때만 실행
		    navigate(navAPI) // navigate end
        }
    }// handleSubmit end

    useEffect(() => {
        if (input === undefined) {
            setButtonDisabled(true)
            return
        }
        const tempInput = input.trim()
        const tempDisabled = (tempInput !== undefined && tempInput !=='')
        setButtonDisabled(!tempDisabled)
    }, [input])
    
    return (
        <Modal isOpen={isOpen} toggle={() => customToggle()} className='modal-dialog-centered modal'>
            <ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
                <div className='mb-1 px-1' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div>
                        <Row className="my-1">
                            <span style={{color: 'white', fontSize: '20px'}}>
                                {headerTitle}<br/>
                            </span>
                        </Row>
                        <Row>
                            <span style={{color: 'white'}}>
                                {headerHelpText}
                            </span>
                        </Row>
                    </div>
                    <div>
                        <img src={winLogoImg} style={{maxHeight: '85px'}}/> 
                    </div>
                </div>
            </ModalHeader>
            <ModalBody>
                <Label>
                    평가 제목
                </Label>
                <Input 
                    onChange={(e) => {setInput(e.target.value)}}
                    value={input}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            handleSubmit()
                        }
                    }}
                />
                <div className='d-flex mt-1' style={{justifyContent:'end'}}>
                    <Button onClick={customToggle} >
                        취소
                    </Button>
                    <Button color='primary' className="ms-1" onClick={() => handleSubmit()} disabled={buttonDisabled}>
                        확인
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default CustomInputModal