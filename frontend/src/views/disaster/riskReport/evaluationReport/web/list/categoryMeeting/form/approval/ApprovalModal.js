/* eslint-disable */
import { useRef, useState } from "react"
import { useDispatch } from 'react-redux'
import { Modal, ModalHeader, Row, ModalBody } from "reactstrap"
import winLogoImg from '@src/assets/images/winlogo.png'
import Wizard from '@components/wizard'
import DisasterSignTable from "./DisasterSignTable"
import { primaryColor } from "../../../../../../../../../utility/Utils"

const ApprovalModal = (props) => {
    const {
        isOpen, setIsOpen, userSign, setUserSign, 
        signType, setSignType, handelNextTab=null,
        oldUserSign, setOldUserSign, setSignUserData
    } = props
    
    const dispatch = useDispatch()
    const ref = useRef(null)
    const [stepper, setStepper] = useState(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [checked, setChecked] = useState(false)
    
    const customToggle = () => {
		setIsOpen(!isOpen)
	}

    const steps = [
        {
            id:'manager',
            title: '1. 담당자',
            content: <DisasterSignTable 
                        setIsOpen={setIsOpen} 
                        userSign={userSign} 
                        setUserSign={setUserSign} 
                        signType={signType}
                        setSignType={setSignType}
                        // inputData={inputData} 
                        checked={checked}
                        setChecked={setChecked}
                        // state={state}
                        // setSubmitResult={setSubmitResult}
                        setActiveIndex={setActiveIndex}
                        oldUserSign={oldUserSign}
                        setOldUserSign={setOldUserSign}
                        setSignUserData={setSignUserData}
                        // API = {API}
                        id={'manager'}
                        dispatch={dispatch}
                        handelNextTab={handelNextTab}/>
        },
        {
            id:'manager2',
            title: '2. 책임자',
            content: <DisasterSignTable 
                        setIsOpen={setIsOpen} 
                        userSign={userSign} 
                        setUserSign={setUserSign} 
                        signType={signType}
                        setSignType={setSignType}
                        // inputData={inputData} 
                        checked={checked}
                        setChecked={setChecked}
                        // state={state}
                        // setSubmitResult={setSubmitResult}
                        setActiveIndex={setActiveIndex}
                        oldUserSign={oldUserSign}
                        setOldUserSign={setOldUserSign}
                        setSignUserData={setSignUserData}
                        // API = {API}
                        id={'manager2'}
                        dispatch={dispatch}
                        handelNextTab={handelNextTab}/>
        }
    ]


    return (
        <Modal isOpen={isOpen} toggle={() => customToggle()} className='modal-dialog-centered modal-xl'>
            <ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
                <div className='mb-1' style={{display: 'flex', alignItems: 'center', paddingLeft: '3%', justifyContent:'space-between'}}>
                    <div className='mt-1' style={{justifyContent:'space-between'}}>
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
                    <div className="pe-2">
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
export default ApprovalModal