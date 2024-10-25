import { Fragment, useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import BuildingBasicInfoCard from "./BuildingBasicInfoCard"
import Tab from "./Tab"
import { API_BASICINFO_AREA_BUILDING_DRAWING_LIST, API_BASICINFO_AREA_BUILDING_DRAWING_SELECT_ARRAY, ROUTE_BASICINFO_AREA_BUILDING_DRAWING_ADD, ROUTE_BASICINFO_AREA_BUILDING_DRAWING_DETAIL } from "../../../../constants"
import { getTableData, handleDownload, primaryColor } from "../../../../utility/Utils"
import Select from 'react-select'
import CustomDataTable from "../../../../components/CustomDataTable"
import { Link, useParams } from "react-router-dom"
import Cookies from "universal-cookie"

const Drawing = () => {
	const cookies = new Cookies()
	const { type } = useParams()
	const [data, setData] = useState([])
	const [employeeClassOptions, setEmployeeClassOptions] = useState([{ value: '', label: '전체' }])
	const [employeeClass, setEmployeeClass] = useState({value: '', label: '전체'})
	const [search, setSearch] = useState('') 
	
	const columns = [
		{
			name:'직종',
			width: '130px',
			cell: row => row.employee
		},
		{
			name:'도면명',
			cell: row => row.name,
			minWidth: '40%'
		},
		{
			name:'등록일',
			width:'150px',
			cell: row => row.create_datetime
		},
		{
			name:'작성자',
			width:'150px',
			cell: row => row.writer
		},
		{
			name:'첨부파일',
			style: {justifyContent: 'left'},
			width:'210px',
			cell: row => {
				return row.files.map((file, i) => (
					<a key={file.id} id={file.id} onClick={() => handleDownload(`${file.path}${file.file_name}`, file.original_file_name)} style={{ color: primaryColor, textAlign: 'left', display:'contents'}}>[{i + 1}]&nbsp;</a>
				))
			}
		}
	]
	
	useEffect(() => {
		getTableData(API_BASICINFO_AREA_BUILDING_DRAWING_LIST, {select: employeeClass.value, search: search, building: type, property:''}, setData)
		
		getTableData(API_BASICINFO_AREA_BUILDING_DRAWING_SELECT_ARRAY, {property_id: cookies.get('property').value, type: 'list', building_id: type}, setEmployeeClassOptions)
	}, [])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='건물정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='건물정보' />
				</div>
			</Row>
			<Row>
				<Col md='4'>
					<BuildingBasicInfoCard />
				</Col>
				<Col>
					<Tab md='5' id={type} active='drawing'></Tab>
					<Card>
						<CardHeader>
							<CardTitle>도면</CardTitle>
							<Button color='primary' tag={Link} to={`${ROUTE_BASICINFO_AREA_BUILDING_DRAWING_ADD}/${type}`} state={{pageType:'register'}}>등록</Button>
						</CardHeader>
						<CardBody style={{paddingTop: 0}}>
							<Row>
								<Col className="mb-1" md='3' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
										<Col xs='3' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>직종</Col>
										<Col xs='9'>
											<Select 
												id='employeeClass-select'
												autosize={true}
												className='react-select'
												classNamePrefix='select'
												defaultValue={employeeClassOptions[0]}
												options={employeeClassOptions}
												onChange={(e) => setEmployeeClass(e)}
												value={employeeClass}
												menuPortalTarget={document.body} 
												styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
											/>
										</Col>
									</div>
								</Col>
								<Col className="mb-1"  md='5'>
									<InputGroup>
										<Input 
											value={search} 
											onChange={(e) => setSearch(e.target.value)} 
											placeholder='도면명을 검색해 주세요.'
											onKeyDown={e => {
												if (e.key === 'Enter') {
													getTableData(API_BASICINFO_AREA_BUILDING_DRAWING_LIST, {select:employeeClass.value, search:search, building:type, property:''}, setData)
												}
											}}/>
										<Button style={{zIndex:0}} onClick={() => { getTableData(API_BASICINFO_AREA_BUILDING_DRAWING_LIST, {select:employeeClass.value, search:search, building:type, property:''}, setData) }}>검색</Button>
									</InputGroup>
								</Col>
							</Row>
							{data &&
								<CustomDataTable
									tableData={data}
									columns={columns}
									detailAPI={`${ROUTE_BASICINFO_AREA_BUILDING_DRAWING_DETAIL}/${type}`}
								/>
							}
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
}

export default Drawing