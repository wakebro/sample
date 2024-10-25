import '@styles/react/libs/flatpickr/flatpickr.scss'
import "@styles/react/pages/page-authentication.scss"
import { useEffect, useState } from 'react'
import { Button, Col, Modal, ModalBody, ModalHeader } from "reactstrap"
import Cookies from "universal-cookie"
import { API_DOC_RECEIVER_GROUP_LIST } from '../../../../constants'
import axios from "../../../../utility/AxiosConfig"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import ModalDataTable from "./ModalDataTable"

const ListModal = (props) => {
	useAxiosIntercepter()
	const {formModal, setFormModal, setGroupReceivers} = props
	const cookies = new Cookies()
	const [data, setData] = useState()
	const [tableSelect, setTableSelect] = useState([])

	const columns = [
		{
			name: '그룹명',
			sortable: true,
			selector: row => row.name,
			width:'35%'
		},
		{
			name: '직종',
			sortable: true,
			selector: row => row.employee_class

		},
		{
			name: '등록자',
			sortable: true,
			selector: row => row.register_user
		},
		{
			name: '수신인원',
			sortable: true,
			selector: row => row.receiver_count
		}
	]
	
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
			axios.get(API_DOC_RECEIVER_GROUP_LIST,  {params :{userId: cookies.get('userId')}})
			.then(response => {
				setData(response.data)
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
					<ModalDataTable 
						className= 'mt-2'
						columns={columns}
						tableData={data}
						setTabelData={setData}
						setTableSelect={setTableSelect}
						tableSelect={tableSelect}
						selectType={true}
					/>
					<Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%'}}>
						<Button color='report' style={{marginTop: '1%', marginRight: '1%'}} onClick={customToggle}>
							취소
						</Button>
						<Button color='primary' style={{marginTop: '1%'}} onClick={() => { GetGroupUser() }}>
							저장
						</Button>
					</Col>
				</ModalBody>
		</Modal>
	)
}

export default ListModal
