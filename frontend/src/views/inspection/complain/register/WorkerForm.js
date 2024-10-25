import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useAxiosIntercepter } from "@utility/hooks/useAxiosInterceptor"
import { sweetAlert } from '@utils'

import { Fragment, useState } from "react"
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'

import { Button, Card, CardBody, Col, Input, InputGroup, InputGroupText, Row } from 'reactstrap'
import CustomDataTable from "../../../basic/facility/CustomDataTable"
import { columns, defaultWorkTypeList } from "../../data"
import WorkerModal from "./Modal/WorkerModal"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import { setStringDate } from '../../../../utility/Utils'

const WorkerForm = (props) => {
	useAxiosIntercepter()
	const { 
		property_id, worker, setWorker, workerDate, setWorkerDate, worktype, setWorkType,
		description, setDescription, tableData, setTableData, dataCount, setDataCount,
		workHour, setWorkHour
	} = props
	
	const [tableSelect, setTableSelect] = useState([])

	const PlusTableData = () => {
		if (worker.name === '') {
			sweetAlert('', '작업자를 등록 해주세요', 'warning', 'center')
			return false
		}
		if (workerDate === '') {
			sweetAlert('', '작업일시를 등록 해주세요', 'warning', 'center')
			return false
		}
		const newData = { id: dataCount, worker: worker, workerDate: workerDate, description: description, worktype: worktype.value, workHour: workHour }
		const updatedTableData = [...tableData, newData]
		setTableData(updatedTableData)
		setDataCount(dataCount - 1)
		setWorker({ name: '', value: '' })
		setWorkType({label:'작업유형', value:''})
		setWorkerDate('')
		setDescription('')
		setWorkHour('')
	}

	const DeleteTableData = () => {
		if (tableSelect.length !== 0) {
			const selectedIds = tableSelect.map(item => item.id)
			const updatedTableData = tableData.filter(item => !selectedIds.includes(item.id))
			setTableData(updatedTableData)
		}
	}

	const [modal, setModal] = useState(false)
	const toggle = () => setModal(!modal)

	return (
		<Fragment>
			<Card className="mt-1 mb-15" style={{marginBottom:'80px'}}>
				<Col className="custom-card-header">
					<div className="custom-create-title">작업자 정보</div>
				</Col>
				<hr/>
				<CardBody>
					<Row className='mb-1' style={{alignItems:'center'}}>
						<Col md='6' xs='12'>
							<Row style={{alignItems:'center'}}>
								<Col className='card_table col text center' xs='2'>
									작업자&nbsp;
									<div className='essential_value'/>
								</Col>
								<Col xs='10'>
									<Row>
										<Col xs='7' md='9'>
											<Input placeholder="작업자 정보를 검색해 주세요"
												value={worker.name} disabled={true}/>
										</Col>
										<Col xs='3' md='3'>
											<Button color='white' style={{ borderColor:'gray', whiteSpace: 'nowrap', justifyContent:'end'}} onClick={toggle}>검색</Button>
										</Col>
										<WorkerModal
											property_id = {property_id}
											open = {modal}
											toggle = {toggle}
											setWorker = {setWorker}/>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className="mb-1" style={{alignItems:'center'}}>
						<Col md='6' xs='12'>
							<Row style={{alignItems:'center'}}>
								<Col className='card_table col text center' xs='2'>작업타입</Col>
								<Col xs='10'>
									<Select
										name='worktype'
										classNamePrefix={'select'}
										className="react-select custom-select-worktype custom-react-select"
										options={defaultWorkTypeList}
										value={worktype}
										defaultValue={defaultWorkTypeList[0]}
										onChange={(e) => setWorkType(e)}/>
									</Col>
							</Row>
						</Col>
					</Row>
					<Row className="mb-1" style={{alignItems:'center'}}>
						<Col md='6' xs='12'>
							<Row style={{alignItems:'center'}}>
								<Col className='card_table col text center' xs='2'>
									작업일시&nbsp;
									<div className='essential_value'/>
								</Col>
								<Col xs='10'>
									<Flatpickr
										id='range-picker'
										className='form-control'
										placeholder="YYYY/MM/DD HH:mm"
										value={workerDate}
										onChange={(data) => {
											const newData = setStringDate(data, true)
											setWorkerDate(newData)
										}}
										options = {{
											enableTime: true,
											dateFormat: "Y-m-d H:i",
											locale: Korean
										}}/>
								</Col>
							</Row>
						</Col>
						<Col md='6' xs='12'>
							<Row style={{alignItems:'center'}}>
								<Col className='card_table col text center' xs='2'>작업시간</Col>
								<Col xs='10'>
									<InputGroup>
										<Input
											type="number"
											min={0}
											value={workHour}
											onChange={(e) => {
												if (e.target.value === '') return
												setWorkHour(e.target.value)
											}}/>
										<InputGroupText>시간</InputGroupText>
									</InputGroup>        
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='mb-1' style={{alignItems:'center'}}>
						<Col md='12' xs='12'>
							<Row style={{alignItems:'center'}}>
								<Col className='card_table col text center' xs='2' md='1'>비고</Col>
								<Col xs='10' md='11'>
									<Input value={description}
										onChange={(e) => setDescription(e.target.value)}/>
								</Col>
							</Row>
						</Col>
					</Row>
					<hr/>
					<Row>
						<div className='d-flex justify-content-end mb-1'>
							<Button color="white" style={{borderColor: 'gray', whiteSpace:'nowrap'}} onClick={() => { PlusTableData() }} >추가 </Button>
							<Button color="white" style={{borderColor: 'gray', whiteSpace:'nowrap', marginLeft:'1%'}} onClick={() => { DeleteTableData() }} >삭제 </Button>  
						</div>
					</Row>
					<Row>
						<CustomDataTable
							tableData={tableData}
							columns={columns.workerForm}
							setTableSelect={setTableSelect}
							selectType = {true}/>
					</Row>
				</CardBody>
			</Card>
		</Fragment>
	)
}


export default WorkerForm