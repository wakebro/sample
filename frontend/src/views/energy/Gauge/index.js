import { Fragment, useEffect, useState } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, ROUTE_ENERGY_GAUGE_GROUP_REGISTER, ROUTE_ENERGY_GAUGE_GROUP_DETAIL, API_GAUGE_GROUP_LIST  } from "../../../constants"
import { Link } from "react-router-dom"
import CustomDataTable from "../../../components/CustomDataTable"
import { checkOnlyView, getTableData, makeSelectList } from "../../../utility/Utils"
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import Cookies from 'universal-cookie'
import Select from "react-select"
import axios from '../../../utility/AxiosConfig'
import { useSelector } from "react-redux"
import { ENERGY_GAUGE_GROUP } from "../../../constants/CodeList"
import TotalLabel from "../../../components/TotalLabel"

const Gauge = () => {
		useAxiosIntercepter()
        const loginAuth = useSelector((state) => state.loginAuth)
		const [data, setData] = useState([])
		const cookies = new Cookies()
		const property_id = cookies.get('property').value
        const [employeeClassList, setEmployeeClassList] = useState([{value:'', label: '전체'}])
		const [employeeClass, setEmployeeClass] = useState({value:'', label:'전체'})
		const [searchValue, setSearchValue] = useState('')

		const basicColumns = [
			{
				name: '직종',
				cell: row => row.employee_class.code,
                width: '100px'
			},
            {
				name: '계량기명',
				cell: row => row.code,
                minWidth: '120px'
			},
			{
				name: '비고',
				cell: row => row.description,
                minWidth: '120px'
			}
		]

		const postSearchData = () => {
			const params = {
				searchValue: searchValue,
			  	property_id: property_id,
			  	employee_class_id: employeeClass.value
			}
		  
			axios.get(API_GAUGE_GROUP_LIST, { params })
			  .then((response) => {
				setData(response.data)
			  })
			  .catch((error) => {
				console.error(error)
			  })
		} // postSearchData end
		  
		const handleSearch = (event) => {
			const value = event.target.value
			setSearchValue(value)
		}

        useEffect(() => {
			getTableData(API_GAUGE_GROUP_LIST, {property_id : property_id, employee_class_id : employeeClass && employeeClass.value, searchValue : '' }, setData)
			
			axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, { params: {property_id: property_id} })
			.then(
				resEmployeeClass => {
				makeSelectList(true, '', resEmployeeClass.data, employeeClassList, setEmployeeClassList, ['name'], 'id')
			})
		}, [])

		useEffect(() => {
			getTableData(API_GAUGE_GROUP_LIST, {property_id : property_id, employee_class_id:employeeClass && employeeClass.value, searchValue : ''}, setData)
		}, [])


	return (
		<Fragment>
			<>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='계량기 정보' breadCrumbParent='에너지관리' breadCrumbParent2='검침정보관리' breadCrumbActive='계량기정보' />
					</div>
				</Row>
				<Card>
					<CardHeader>
						<CardTitle>
							계량기 정보
						</CardTitle>
						<Button hidden={checkOnlyView(loginAuth, ENERGY_GAUGE_GROUP, 'available_create')}
                            color='primary' tag={Link}
							to={ROUTE_ENERGY_GAUGE_GROUP_REGISTER}
						>등록</Button>
					</CardHeader>
					<CardBody style={{ paddingTop: 0}}>
						<Row style={{ display: 'flex'}}>
							<Col  className='mb-1' md='3'>
							<div style={{ display: 'flex', alignItems: 'center' }}>
									<Col xs='2' md='3' className='pe-0' style={{paddingRight: 0, textAlign: 'center'}}>직종</Col>
									<Col xs='10' md='9' style={{}}>
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
			
							<Col className='mb-1' md='5'>
								<InputGroup>
									<Input 
										id='search'
										maxLength={250}
										placeholder='계량기명을 검색해 보세요.'
										value={searchValue}
										onChange={handleSearch}
										onKeyDown={e => {
											if (e.key === 'Enter') {
												postSearchData()
											}
										}}
									/>
									<Button
										style={{zIndex:0}}
										onClick={postSearchData}
									>검색
									</Button>
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
								detailAPI={ROUTE_ENERGY_GAUGE_GROUP_DETAIL}
							/>
						</Row>
					</CardBody>
				</Card>
			</>
	</Fragment>
	)
}


export default Gauge