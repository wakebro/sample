import {
	Button, Modal, ModalBody,
	ModalFooter, ModalHeader, Input
} from "reactstrap"
import { useState } from "react"
const PreviewModal = (props) => {
	const {modal, setModal, inputName, setValue, getValues} = props
	const [inputValue, setInputValue] = useState("")
	const changeValue = () => {
		setModal(!modal)
		setValue(inputName, inputValue)
	}

	return (
		<Modal isOpen={modal} toggle={() => setModal(!modal)} className='modal-dialog-centered'>
			<ModalHeader  toggle={() => setModal(!modal)}><span style={{fontSize: '20px'}}>비고 입력</span></ModalHeader>
			<ModalBody>
				<Input type="textarea" defaultValue={getValues(inputName)} onChange={(e) => setInputValue(e.target.value)}/>
			</ModalBody>
			<ModalFooter>
				<Button onClick={() => changeValue()} color='primary' >
					확인
				</Button>
			</ModalFooter>

		</Modal>
	)
}

export default PreviewModal
