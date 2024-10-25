import {
	Button, Modal, ModalBody,
	ModalFooter, ModalHeader
} from "reactstrap"
import { useState, useEffect } from "react"
import { API_INSPECTION_CHECKLIST_FORM } from '../../../constants'
import DataTable from 'react-data-table-component'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { customQaStyles } from "../data"
import { NoDataCause } from "../../../components/Sentence"
import { getTableDataCallback } from "../../../utility/Utils"
const InspectionModal = (props) => {
	const {modal, setModal, rowId} = props
	const [data, setData] = useState([])
	const columns = [
		{
			name: '점검현황',
			sortable: false,
			
			sortField: 'title',
			selector: row => row.title
		}
	]
	const getInit = () => {
		const param = {
			id :  rowId
		}
		getTableDataCallback(API_INSPECTION_CHECKLIST_FORM, param, (data) => {
			const temp = []
			Object.values(data['sections']).map((item) => {
				Object.values(item['questions']).map((qa) => {
					temp.push({title : qa['title']})
				})
			})
			setData(temp)
		})
	}
	useEffect(() => {
		if (rowId !== 0) {
			getInit()
		}
	}, [modal])

	return (
		<Modal isOpen={modal} toggle={() => setModal(!modal)} className='modal-dialog-centered'>
			<ModalHeader><span style={{fontSize: '20px'}}>점검일지 보기</span></ModalHeader>
			<ModalBody>
				<DataTable
					noHeader
					data={data}
					columns={columns}
					className='react-dataTable'
					noDataComponent={<NoDataCause/>}
					persistTableHead
					customStyles={customQaStyles}
				/>
				{/* {rowId} 확인 확인 */}
			</ModalBody>
			<ModalFooter>
				<Button onClick={() => setModal(!modal)} color='primary' >
					확인
				</Button>
			</ModalFooter>

		</Modal>
	)
}

export default InspectionModal
