import { Fragment, useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import { API_EMPLOYEE_LIST, ROUTE_BASICINFO_AREA_BUILDING_DETAIL, ROUTE_BASICINFO_EMPLOYEE_REGISTER } from '../../../../constants'
import CustomDataTable from "./CustomDataTable"
// import axios from "../../../../utility/AxiosConfig"
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { dataTableClickStyle, getTableData } from '../../../../utility/Utils'
import EmployeeFilter from "./EmployeeFilter"
import TotalLabel from "../../../../components/TotalLabel"

const EmployeeTable = (props) => {
	useAxiosIntercepter()
	const {userId, setUserId, reset, setUserName} = props
	const [data, setData] = useState([])
	const [selectClass, setSelectClass] = useState({label: '직종 전체', value:''})
	const [selectLevel, setSelectLevel] = useState({label: '직급 전체', value:''})
	const [selectStatus, setSelectStatus] = useState({label: '상태 전체', value:''})
	const [searchParams, setSearchParams] = useState('')
	
	const cookies = new Cookies()
	const getInit = () => {
		const param = {
			propId :  cookies.get('property').value,
			employeeClass : selectClass.value,
			employeeLevel : selectLevel.value,
			employeeStatue : selectStatus.value,
			search : searchParams
		}
		getTableData(API_EMPLOYEE_LIST, param, setData)
	}
	const changeSearch = () => getInit()

	const columns = [
		{
			name: '이름',
			sortable: true,
			sortField: 'name',
			selector: row => row.name,
			conditionalCellStyles: dataTableClickStyle(userId)
		},
		{
			name: '직급',
			sortable: true,
			sortField: 'level',
			selector: row => row.level,
			conditionalCellStyles: dataTableClickStyle(userId)
		},
		{
			name: '직종',
			sortable: true,
			sortField: 'class',
			selector: row => row.class,
			conditionalCellStyles: dataTableClickStyle(userId)
			// selector: row => row.count_fl
		},
		{
			name: '상태',
			sortable: true,
			sortField: 'status',
			selector: row => row.status,
			conditionalCellStyles: dataTableClickStyle(userId)
		},
		{
			name: '전화번호',
			sortable: true,
			sortField: 'phone',
			selector: row => row.phone,
			conditionalCellStyles: dataTableClickStyle(userId)
		}
	]

	useEffect(() => {
		getInit()
	}, [reset])

	return (
		<Fragment>
			<Card>
				<CardHeader>
					<CardTitle>
						직원정보
					</CardTitle>
					<Button tag={Link} to={ROUTE_BASICINFO_EMPLOYEE_REGISTER} color='primary'>등록</Button>
				</CardHeader>
				<CardBody>
					<EmployeeFilter 
						selectClass={selectClass} 
						setSelectClass={setSelectClass} 
						selectLevel={selectLevel} 
						setSelectLevel={setSelectLevel}
						searchParams={searchParams}
						setSearchParams={setSearchParams}
						changeSearch={changeSearch}
						selectStatus={selectStatus}
						setSelectStatus={setSelectStatus}
					/>
					<TotalLabel 
						num={3}
						data={data.length}
						unit={'명'}
					/>
					<CustomDataTable 
						columns={columns} 
						tableData={data} 
						setTabelData={setData}
						setClick={setUserId}
						setUserName ={setUserName}
						// setTableSelect={setTableSelect}	
						// selectType={true} 
						detailAPI={ROUTE_BASICINFO_AREA_BUILDING_DETAIL}
					/>
				</CardBody>
				
			</Card>
		</Fragment>
	)
}

export default EmployeeTable
