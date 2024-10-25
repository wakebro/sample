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
const DefaultSelectModal = (props) => {
    const {
        headerTitle, // modal 제목
        headerHelpText, // modal 도움말 
        isOpen, // modal open state
        setIsOpen, // modal open state set
        API, // select data get API url
        data, // select data
        setData, // select data set
        navAPI, 
        navState,
        type,
        setType,
        input,
        setInput,
        callbackSubmit
    } = props

    // 필수 변수
	useAxiosIntercepter()
    const cookies = new Cookies()
    const activeUser = cookies.get('userId')
	const navigate = useNavigate()
    const [buttonDisabled, setButtonDisabled] = useState(true)

    const customToggle = () => {
        if (setType) setType('')
        if (setInput) setInput('')
		setIsOpen(!isOpen)
	} // customToggle end

    // 사업소 그룹 선택 버튼
    const handleSubmit = () => {
        if (callbackSubmit && type && input) {
            callbackSubmit(type, input)
            setIsOpen(false)
            return
        }

        if (callbackSubmit && type) {
            callbackSubmit(type)
            setIsOpen(false)
            return
        }

        setIsOpen(false)
        if (navAPI && navAPI !== '') { // 넘어갈 네비가 있을때만 실행
		    navigate(navAPI, {state:{type: type}}) // navigate end
        }
    }// handleSubmit end

    // select list를 서버에서 가져오면 API를 넣어야합니다.
    // 또한 data setData를 useState로 선언해서 props로 넘겨받아야합니다.
    useEffect(() => {
        if (API && API !== '') {
            const param = {
                user: activeUser,
                property: ''
            }
            getTableData(API, param, setData) 
        }
    }, [])

    useEffect(() => {
        if (callbackSubmit && type !== undefined && input !== undefined) {
            setButtonDisabled(!(type !== undefined && type !=='') || !(input !== undefined && input !==''))
            return
        }
        setButtonDisabled(!(type !== undefined && type !==''))
    }, [type, input])
    
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
                    평가 양식
                </Label>
                <Select
                    name='templateType'
                    classNamePrefix={'select'}
                    className="react-select custom-select-building custom-react-select mb-1"
                    options={data}
                    placeholder={'선택'}
                    onChange={setType}
                />
                {
                    input !== undefined &&
                    <>
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
                    </>
                }
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

export default DefaultSelectModal