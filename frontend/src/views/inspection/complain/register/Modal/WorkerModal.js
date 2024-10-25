/* eslint-disable */
// import Select from 'react-select'
import axios from '@utility/AxiosConfig'
import { dataTableClickStyle, getTableData } from '@utils'

import { useEffect, useState } from "react"
import { Button, Col, Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'

import { API_DOC_RECEIVER } from "../../../../../constants"
import AppointmentDataTable from '../../../../basic/employee/appointment/AppointmentDataTable'

const WorkerModal = (props) => {
	const {open, toggle, property_id, setWorker} = props
	const [rowId, setrowId] = useState(0)
	const [tableData, setTableData] = useState([])
	const [searchValue, setSearchValue] = useState('')
	// const [employeeClass, setEmployeeClass] = useState({label: '전체', value: ''})
	// const [classList, setClassList] = useState([{label: '직종', value: ''}])

	const columns = [
		{
			name: '이름',
			selector: row => row.name,
			conditionalCellStyles: dataTableClickStyle(rowId),
			width: '40%'
		}, {
			name: '직종',
			selector: row => row.employee_class,
			conditionalCellStyles: dataTableClickStyle(rowId),
			width: '30%'
		}, {
			name: '직급',
			selector: row => row.position,
			conditionalCellStyles: dataTableClickStyle(rowId),
			width: '30%'
		}
	]

	const postSearchData = () => {
		const params = {
			search: searchValue,
			propertyId: property_id
			// employeeClass: employeeClass.value
		}
		axios.get(API_DOC_RECEIVER, {params})
		.then((response) => setTableData(response.data))
		.catch((error) => console.error(error))
	}

	const handleSearch = (event) => {
		const value = event.target.value
		setSearchValue(value)
	}

	useEffect(() => {
		getTableData(API_DOC_RECEIVER, {
			propertyId: property_id,
			employeeClass: '',
			search: ''
		}, setTableData)

		// getTableData(API_EMPLOYEE_CLASS_LIST, {
		// 	prop_id: property_id
		// }, setClassList)
	}, [])

	const onModalButton = () => {
		toggle()
		const data = tableData.find(item => item.id === rowId)
		if (data !== undefined && data !== null) {
			setWorker(
				{name: data.name, value: data.id, position: data.position, employee_class: data.employee_class}
			)
		}
	}

	return (
		<Modal isOpen={open} toggle={toggle}>
			<ModalHeader className="mb-2">작업자</ModalHeader>
			<ModalBody>
				<Row className='d-flex align-items-center justify-content-start'>
					{/* <Col xs='12' md='5' className="mb-1">
						<Row>
							<Col xs='3' md='3' className="d-flex align-items-center justify-content-center px-0" >직종</Col>
							<Col xs='9' md='9' className="ps-0">
								<Select
									name='employeeClass'
									classNamePrefix={'select'}
									className="react-select custom-select-employeeClass custom-react-select"
									options={classList}
									value={employeeClass}
									defaultValue={classList[0]}
									onChange={(e) => setEmployeeClass(e)}/>
							</Col>
						</Row>
					</Col> */}
					<Col xs='12' md='8' className="mb-1">
						<InputGroup>
							<Input
								id='search'
								placeholder='작업자를 검색해 보세요.'
								value={searchValue}
								onChange={handleSearch}
								onKeyDown={e => {
									if (e.key === 'Enter') {
										postSearchData()
									}
								}}/>
							<Button style={{zIndex: 0}} onClick={postSearchData}>검색</Button>
						</InputGroup>
					</Col>
				</Row>
			</ModalBody>
			<AppointmentDataTable
				tableData={tableData}
				columns={columns}
				setClick={setrowId}/>
			<ModalFooter
				className='mt-1'
				style={{
					display: 'flex',
					justifyContent: 'end',
					alignItems: 'center',
					borderTop: '1px solid #B9B9C3'
				}}>
				<Button color='report' className="mx-1" onClick={() => toggle()}>취소</Button>
				<Button color='primary' onClick={() => onModalButton()}>저장</Button>
			</ModalFooter>
		</Modal>
	)
}
export default WorkerModal
