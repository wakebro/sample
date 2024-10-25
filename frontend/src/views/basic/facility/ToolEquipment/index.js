import { Fragment, useEffect, useState } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { FileText } from "react-feather"
import { 
		API_BASICINFO_FACILITY_TOOLEQUIPMENT, 
		ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_ADD, 
		ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL, 
		API_EMPLOYEE_CLASS_LIST, 
		API_EXPORT_FACILITY_EQUIPMENT_LIST 
		} from "../../../../constants"
import { Link } from "react-router-dom"
import Select from "react-select"
import CustomDataTable from "../../../../components/CustomDataTable"
import { getTableData } from "../../../../utility/Utils"
import axios from '../../../../utility/AxiosConfig'
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import Cookies from 'universal-cookie'
import { toolEquipmentColumns } from "../data"
import TotalLabel from "../../../../components/TotalLabel"

const Facility_ToolEquipment = () => {
	useAxiosIntercepter()
	const [data, setData] = useState([])
	const cookies = new Cookies()
	const property_id = cookies.get('property').value
	const [employeeClassList, setEmployeeClassList] = useState([{label:'전체', value:''}])
	const [employeeClass, setEmployeeClass] = useState({label:'전체', value:''})
	const [searchValue, setSearchValue] = useState('')
	
	const exportXlsx = () => {
		axios.get(API_EXPORT_FACILITY_EQUIPMENT_LIST, {
			params: {
				property_id :  cookies.get('property').value
			}
		})
		.then((res) => {
			console.log(res.data)
			axios({
				url: res.data.url,
				method: 'GET',
				responseType: 'blob'
			}).then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]))
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', `${res.data.name}`)
				document.body.appendChild(link)
				link.click()
			}).catch((res) => {
				console.log(res)
			})
		})
		.catch(res => {
			console.log(res)
		})
	}

	useEffect(() => {
		getTableData(API_BASICINFO_FACILITY_TOOLEQUIPMENT, {property_id : property_id, employee_class_id : employeeClass && employeeClass.value, searchValue : '' }, setData)
		getTableData(API_EMPLOYEE_CLASS_LIST, {}, setEmployeeClassList)
	}, [])
	
	return (
		<Fragment>
			<>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='공구비품정보' breadCrumbParent='기본정보' breadCrumbParent2='설비정보관리' breadCrumbActive='공구비품정보' />
						<Button.Ripple className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={() => exportXlsx()}>
						<FileText size={14}/>
							문서변환
						</Button.Ripple>
					</div>
				</Row>
				<Card>
					<CardHeader>
						<CardTitle>
							공구비품목록
						</CardTitle>
						<Button color='primary' tag={Link}
							to={ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_ADD}
							state={{pageType:'register'}}
						>등록</Button>
					</CardHeader>
					<CardBody style={{ paddingTop: 0}}>
						<Row style={{ display: 'flex'}}>
							<Col className="mb-1" md='2'>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								
									<Col xs='2' md='3' style={{ alignItems: 'center', paddingRight: 0, textAlign: 'center'  }}>직종</Col>
									<Col xs='10' md='9' style={{ paddingLeft: '1%' }}>
										<Select 
											id='jobSelect'
											autosize={true}
											className='react-select'
											classNamePrefix='select'
											options={employeeClassList}
											value={employeeClass}
											onChange={(e) => setEmployeeClass(e)}
										/>
									</Col>
								</div>
							</Col>
							<Col className='mb-1' md='3'>
								<InputGroup>
									<Input 
									id='search'
									placeholder='공구정보를 검색해 보세요.'
									value={searchValue}
									onChange={(e) => setSearchValue(e.target.value)}
									onKeyDown={e => {
											if (e.key === 'Enter') {
												getTableData(API_BASICINFO_FACILITY_TOOLEQUIPMENT, {searchValue:searchValue, property_id: property_id, employee_class_id: employeeClass.value}, setData)
											}
										}}
									/>
									<Button
										style={{zIndex: 0}}
										onClick={() => getTableData(API_BASICINFO_FACILITY_TOOLEQUIPMENT, {searchValue:searchValue, property_id: property_id, employee_class_id: employeeClass.value}, setData)}
									>검색
									</Button>
								</InputGroup>
							</Col>
							<Col/>
						</Row>
						<TotalLabel 
							num={3}
							data={data.length}
						/>
						<Row>
							<CustomDataTable
								tableData={data}
								columns={toolEquipmentColumns}
								detailAPI={ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL}
							/>
						</Row>
					</CardBody>
				</Card>
			</>
	</Fragment>
	)
}

export default Facility_ToolEquipment