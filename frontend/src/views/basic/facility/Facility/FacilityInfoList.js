import { Fragment, useEffect, useState } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { API_BASICINFO_FACILITY_LIST, API_BASICINFO_FACILITY_SELECT_ARRAY, ROUTE_BASICINFO_FACILITY_FACILITYINFO_FORM, ROUTE_BASICINFO_FACILITY_FACILITYINFO_DETAIL } from "../../../../constants"
import { Link } from "react-router-dom"
import Select from "react-select"
import CustomDataTable from "@src/components/CustomDataTable"
import Cookies from 'universal-cookie'
import axios from "axios"
import { getTableData } from "@utils"
import { basicColumns } from "../data"
import TotalLabel from "../../../../components/TotalLabel"

const FacilityInfoList = () => {
	const [data, setData] = useState([])
	const [employeeClassArray, setEmployeeClassArray] = useState([{value: '', label: '전체'}])
	const [equipmentArray, setEquipmentArray] = useState([{value: '', label: '전체'}])
	const [employeeClass, setEmployeeClass] = useState({value: '', label: '전체'})
	const [equipment, setEquipment] = useState({value: '', label: '전체'})
	const [searchParams, setSearchParams] = useState('')
	const cookies = new Cookies()

	const handleJob = (event) => {
		// const param = {
		// 	property_id: cookies.get('property').value,
		// 	type: 'list',
		// 	employee_class: event.value,
		// 	equipment: '',
		// 	search: searchParams
		// }
		setEmployeeClass(event)
		// getTableData(API_BASICINFO_FACILITY_LIST, param, setData)
		if (event.value === "") {
			setEquipment({value: '', label: '전체'})
		}
	}
	
	const handleEquipment = (event) => {
		// const param = {
		// 	property_id: cookies.get('property').value,
		// 	type: 'list',
		// 	employee_class: employeeClass.value,
		// 	equipment: event.value,
		// 	search: searchParams
		// }
		setEquipment(event)
		// getTableData(API_BASICINFO_FACILITY_LIST, param, setData)
	}

	const SearchGetTableData = (API, param, setTableData) => {
		axios.get(API, {
			params: param
		})
		.then(res => {
			setTableData(res.data)
		})
		.catch(res => {
			console.log(API, res)
		})
	}

	useEffect(() => {
		const param = {
			property_id: cookies.get('property').value,
			type: 'list',
			employee_class: '',
			equipment: '',
			search: ''
		}
		getTableData(API_BASICINFO_FACILITY_LIST, param, setData)
	}, [])

	useEffect(() => {
		axios.get(API_BASICINFO_FACILITY_SELECT_ARRAY, {params: {property_id: cookies.get('property').value, employee_class: employeeClass.value, equipment: equipment.value, search: searchParams, type: 'list'}})
		.then(res => {
			setEmployeeClassArray(res.data.employee_class_array)
			setEquipmentArray(res.data.tool_equipment_array)
		})
		.catch(res => {
			console.log(API_BASICINFO_FACILITY_SELECT_ARRAY, res)
		})
	}, [employeeClass.value])

	return (
		<Fragment>
			{data && (
				<>
					<Row>
						<div className='d-flex justify-content-start'>
							<Breadcrumbs breadCrumbTitle='설비정보' breadCrumbParent='기본정보' breadCrumbParent2='설비정보관리' breadCrumbActive='설비정보' />
						</div>
					</Row>
					<Card>
						<CardHeader>
							<CardTitle>
								설비정보
							</CardTitle>
							<Button color='primary' tag={Link} to={ROUTE_BASICINFO_FACILITY_FACILITYINFO_FORM} state={{type: 'register'}}>등록</Button>
						</CardHeader>
						<CardBody style={{ paddingTop: 0}}>
							<Row style={{ display: 'flex'}}>
								<Col className='mb-1 px-0' md='3'>
									<Row style={{width: '100%'}}>
										<Col xs='2' className='card_table text facility-center pe-0'>직종</Col>
										<Col xs='10' className='pe-0' style={{ paddingLeft: '1%' }}>
											<Select 
												id='job-select'
												autosize={true}
												className='react-select'
												classNamePrefix='select'
												options={employeeClassArray}
												onChange={(e) => handleJob(e)}
												value={employeeClass}
												menuPortalTarget={document.body} 
												styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
											/>
										</Col>
									</Row>
								</Col>
								<Col className='mb-1 px-0' md='3'>
									<Row style={{width: '100%'}}>
										<Col xs='2' className='card_table text facility-center pe-0'>장비</Col>
										<Col xs='10' className='pe-0' style={{ paddingLeft: '1%' }}>
											<Select
												// isDisabled = {employeeClass === ''}
												id='euipment-select'
												autosize={true}
												className='react-select'
												classNamePrefix='select'
												defaultValue={equipmentArray[0]}
												options={equipmentArray}
												onChange={(e) => handleEquipment(e)}
												value={equipment}
												menuPortalTarget={document.body} 
												styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
											/>
										</Col>
									</Row>
								</Col>
								<Col className='mb-1' md='4'>
									<InputGroup>
										<Input 
											value={searchParams} 
											onChange={(e) => setSearchParams(e.target.value)} 
											placeholder='설비 정보를 검색해 보세요.'
											onKeyDown={e => {
												if (e.key === 'Enter') {
													SearchGetTableData(API_BASICINFO_FACILITY_LIST, {property_id:cookies.get('property').value, search: searchParams, employee_class: employeeClass.value, equipment: equipment.value}, setData)			
												}
											}}
										/>
										<Button style={{zIndex:0}} onClick={() => SearchGetTableData(API_BASICINFO_FACILITY_LIST, {property_id:cookies.get('property').value, search: searchParams, employee_class: employeeClass.value, equipment: equipment.value}, setData)}>검색</Button>
									</InputGroup>
								</Col>
								<Col>
								</Col>
							</Row>
							<TotalLabel 
								num={3}
								data={data.length}
							/>
							<Row>
								<CustomDataTable
									tableData={data}
									columns={basicColumns}
									detailAPI={ROUTE_BASICINFO_FACILITY_FACILITYINFO_DETAIL}
								/>
							</Row>
						</CardBody>
					</Card>
				</>
			)}
		</Fragment>
	)
}

export default FacilityInfoList
