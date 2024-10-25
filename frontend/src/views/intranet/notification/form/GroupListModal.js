import axios from "../../../../utility/AxiosConfig"
import Cookies from "universal-cookie"
import { useState, useEffect } from 'react'
import { Button, Col, Modal, ModalBody, ModalHeader } from "reactstrap"
import { columns } from '../NotificationData'
import {API_DOC_RECEIVER_GROUP_LIST} from "../../../../constants"
import ModalDataTable from "../../document/send/ModalDataTable"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import "@styles/react/pages/page-authentication.scss"

const GroupListModal = (props) => {
    useAxiosIntercepter()
	const {formModal, setFormModal, setGroupReceivers} = props
    const cookies = new Cookies()
	const [data, setData] = useState()
	const [tableSelect, setTableSelect] = useState([])

    const GetGroupUser = () => {
		const params = { tableSelect:  JSON.stringify(tableSelect) }

		axios.get(API_DOC_RECEIVER_GROUP_LIST, { params })
		.then((res) => {
			setGroupReceivers(res.data)
		}).catch((error) => {
			console.error(error)
		}).finally(() => {
			setFormModal(!formModal)
		})
		setFormModal(!formModal)
	}
    
	const customToggle = () => {
		setFormModal(!formModal)
	}

	useEffect(() => {
		if (formModal) {
			axios.get(API_DOC_RECEIVER_GROUP_LIST, {params :{userId: cookies.get('userId')}})
		  	.then(res => {
				setData(res.data)
		 	 }).catch(error => {
				console.error(error)
		  	})
		}
	}, [formModal])

    return (
		<Modal isOpen={formModal} toggle={() => customToggle()} className='modal-dialog-centered modal-lg'>
            <ModalHeader>
                <span style={{fontSize: '20px'}}>수신자 그룹 선택</span>
            </ModalHeader>
            <ModalBody>
                <ModalDataTable className= 'mt-2'
                    columns={columns}
                    tableData={data}
                    setTabelData={setData}
                    setTableSelect={setTableSelect}
                    selectType={true}
                />
                <Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%'}}>
                    <Button color='report' style={{marginTop: '1%', marginRight: '1%'}} onClick={customToggle}>
                        취소
                    </Button>
                    <Button color='primary' style={{marginTop: '1%'}} onClick={() => { GetGroupUser() }}>
                        선택
                    </Button>
                </Col>
            </ModalBody>
		</Modal>
	)
}

export default GroupListModal