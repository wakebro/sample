import { useRef, useState } from 'react'
import { Button, Col, Modal, ModalBody, Card, ModalHeader, InputGroup, Row } from "reactstrap"
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import winLogoImg from '@src/assets/images/winlogo.png'
import Wizard from '@components/wizard'
import SignTable from './SignTable'
import { primaryColor } from '../../../utility/Utils'

const ReportSignModal = (props) => {
    useAxiosIntercepter()
    const {
        isOpen, setIsOpen, userSign, setUserSign, signType, 
        setSignType, inputData, setSubmitResult, state, API, 
        orignUserSign, orignSignType
    } = props
    const ref = useRef(null)
    const [stepper, setStepper] = useState(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const customToggle = () => {
        console.log(stepper)
		setIsOpen(!isOpen)
	}

    const steps = [
        {
            id:'manager',
            title: '1. 담당자',
            content: <SignTable 
                        setIsOpen={setIsOpen} 
                        userSign={userSign} 
                        setUserSign={setUserSign} 
                        signType={signType}
                        setSignType={setSignType}
                        inputData={inputData} 
                        state={state}
                        setSubmitResult={setSubmitResult}
                        setActiveIndex={setActiveIndex}
                        API = {API}
                        orignUserSign={orignUserSign}
                        orignSignType={orignSignType}
                        id={'manager'}/>
        },
        {
            id:'manager2',
            title: '2. 1차 결재자',
            content: <SignTable 
                        setIsOpen={setIsOpen} 
                        userSign={userSign} 
                        setUserSign={setUserSign} 
                        signType={signType}
                        setSignType={setSignType}
                        inputData={inputData} 
                        state={state}
                        setSubmitResult={setSubmitResult}
                        setActiveIndex={setActiveIndex}
                        API = {API}
                        orignUserSign={orignUserSign}
                        orignSignType={orignSignType}
                        id={'manager2'}/>
        },
        {
            id:'manager3',
            title: '3. 2차 결재자',
            content: <SignTable 
                        setIsOpen={setIsOpen} 
                        userSign={userSign} 
                        setUserSign={setUserSign} 
                        signType={signType}
                        setSignType={setSignType}
                        inputData={inputData} 
                        state={state}
                        setSubmitResult={setSubmitResult}
                        setActiveIndex={setActiveIndex}
                        API = {API}
                        orignUserSign={orignUserSign}
                        orignSignType={orignSignType}
                        id={'manager3'}/>
        },
        {
            id:'manager4',
            title: '4. 최종 결재자',
            content: <SignTable 
                        setIsOpen={setIsOpen} 
                        userSign={userSign} 
                        setUserSign={setUserSign} 
                        signType={signType}
                        setSignType={setSignType}
                        inputData={inputData} 
                        state={state}
                        setSubmitResult={setSubmitResult}
                        setActiveIndex={setActiveIndex}
                        API = {API}
                        orignUserSign={orignUserSign}
                        orignSignType={orignSignType}
                        id={'manager4'}/>
        }
    ]

    return (
        <Modal isOpen={isOpen} toggle={() => customToggle()} className='modal-dialog-centered modal-xl'>
            <ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
                <div className='mb-1' style={{display: 'flex', alignItems: 'center', paddingLeft: '3%'}}>
                    <div className='mt-1' style={{width: '89%'}}>
                        <Row>
                            <span style={{color: 'white', fontSize: '20px'}}>
                                결재자 지정<br />
                            </span>
                        </Row>
                        <Row>
                            <span style={{color: 'white'}}>
                            아래 창에서 해당 결재자를 선택해주세요.
                            </span>
                        </Row>
                    </div>
                    <div>
                        <img src={winLogoImg} style={{maxHeight: '85px'}}/> 
                    </div>
                </div>
            </ModalHeader>
            <ModalBody>
                <Wizard 
                    ref={ref}
                    steps={steps}
                    userSign={userSign}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    type='vertical'
                    options={{ linear: false }}
                    instance={el => setStepper(el)}
                    contentClassName='shadow-none'
                    className='bg-transparent create-app-wizard shadow-none'
                />
            </ModalBody>
        </Modal>
    )
}

export default ReportSignModal