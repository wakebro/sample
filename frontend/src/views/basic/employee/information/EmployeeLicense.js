import { Fragment, useState, useEffect } from "react"
import { Card, CardBody, CardHeader, CardTitle, Button } from 'reactstrap'
import { API_USER_LICENSE_LIST, ROUTE_BASICINFO_EMPLOYEE_LICENSE_REGISTER, ROUTE_BASICINFO_EMPLOYEE_LICENSE } from '../../../../constants'
import { getTableData, sweetAlert } from '../../../../utility/Utils'
import LicenseDataTable from "./LicenseDataTable"
import { Link, useNavigate } from 'react-router-dom'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'

import * as moment from 'moment'
import TotalLabel from "../../../../components/TotalLabel"
const EmployeeLicense = (props) => {
	useAxiosIntercepter()
	const {userId, userName} = props
	const navigate = useNavigate()
	const [data, setData] = useState([])

	const dateFormat = (data) => {
		return moment(data).format('YYYY-MM-DD')
	}
	const columns = [
		{
			name: '이름',
			sortable: true,
			sortField: 'name',
			selector: row => row.user.username
		},
		{
			name: '자격이름',
			sortable: true,
			sortField: 'name',
			selector: row => row.license.code
		},
		{
			name: '취득일자',
			sortable: true,
			sortField: 'acquisition_date',
			selector: (row) => (row.acquisition_date ? dateFormat(row.acquisition_date) : row.acquisition_date)
			// selector: row => row.count_fl
		},
		{
			name: '비고',
			sortable: true,
			sortField: 'description',
			selector: row => row.description
		}
	]

	// const cookies = new Cookies()
	const getInit = () => {
		const param = {
			userId :  userId
		}
		getTableData(API_USER_LICENSE_LIST, param, setData)
	}

	const handleregister = () => {
		if (userName === '') {
			sweetAlert('자격증 등록 실패', '직원 선택 후 자격증 등록이 가능합니다.</br>직원 목록 페이지로 돌아갑니다.', 'info', 'right')
			return false
		}
		navigate(ROUTE_BASICINFO_EMPLOYEE_LICENSE_REGISTER, {state : {userId : userId, userName : userName, type: 'post'}})
	}

	useEffect(() => {
		getInit()
	}, [userId])


	return (
		<Fragment>
			
			<Card>
				<CardHeader style={{borderBottom : '1px solid #B9B9C3'}}>
					<CardTitle>
						자격증정보
					</CardTitle>
					{userId !== 0 && 
						<Button onClick={() => handleregister()} color='primary'>등록</Button>
					}

				</CardHeader>
				<CardBody>
					<TotalLabel 
						num={3}
						data={data.length}
					/>
					<LicenseDataTable 
						columns={columns} 
						tableData={data} 
						setTabelData={setData}
						detailAPI={ROUTE_BASICINFO_EMPLOYEE_LICENSE}
					/>
				</CardBody>			
			</Card>
		</Fragment>
	)
}

export default EmployeeLicense
