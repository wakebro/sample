import {
	Button, Modal, ModalBody,
	ModalFooter, ModalHeader
} from "reactstrap"

const PreviewModal = (props) => {
	const {modal, setModal, imgPath} = props

	return (
		<Modal isOpen={modal} className='modal-dialog-centered'>
			<ModalHeader><span style={{fontSize: '20px'}}>미리보기</span></ModalHeader>
			<ModalBody>
				<img src={imgPath} style={{height:"100%", width: '100%', objectFit:'contain'}}></img>
			</ModalBody>
			<ModalFooter>
				<Button onClick={() => setModal(!modal)} color='primary' >
					확인
				</Button>
			</ModalFooter>

		</Modal>
	)
}

export default PreviewModal
