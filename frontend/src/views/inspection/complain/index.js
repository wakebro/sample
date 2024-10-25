import Breadcrumbs from '@components/breadcrumbs'
import axios from "axios"
import { Fragment, useEffect, useState } from "react"
import { FileText } from "react-feather"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, CardTitle, Row } from 'reactstrap'
import Cookies from 'universal-cookie'
import CustomDataTable from "../../../components/CustomDataTable"
import { API_INSPECTION_COMPLAIN_LIST, API_INSPECTION_COMPLAIN_LIST_EXPORT, ROUTE_INSPECTION_COMPLAIN_DETAIL, ROUTE_INSPECTION_COMPLAIN_REGISTER } from "../../../constants"
import { INSPECTION_COMPLAIN } from "../../../constants/CodeList"
import { checkOnlyView, getTableData } from "../../../utility/Utils"
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import EmployeeFilter from "./EmployeeFilter"
import TotalLabel from '../../../components/TotalLabel'

const Complain = () => {
		useAxiosIntercepter()
		const loginAuth = useSelector((state) => state.loginAuth)
		const [data, setData] = useState([])
		const cookies = new Cookies()
		const [Causetype, setCauseType] = useState({label: '원인유형 전체', value:''}) 
		const [Problemtype, setProblemType] = useState({label: '문제유형 전체', value:''})
		const [Status, setStatus] = useState({label: '작업상태 전체', value:''})
		const [searchitemParams, setSearchItemParams] = useState('')
		const [emp_class, setEmpClass] = useState({label: '직종 전체', value:''})
		const property_id = cookies.get('property').value

		const basicColumns = [
			{
				name: '사업소',
				selector: row => row.prop && row.prop.name,
				minWidth: '100px'
			},
			{
				name: '접수일자',
				selector: row => row.request_datetime && row.request_datetime.split('T')[0],
				width: '150px'
			},
			{
				name: '문제유형',
				selector: row => row.problem_type && row.problem_type.code,
				width: '100px'
			},
			{
				name: '직종',
				selector: row => row.emp_class && row.emp_class.code,
				width: '80px'
			},
			{
				name: '접수내용',
				style: {justifyContent:'left'},
				minWidth: '200px',
				selector: row => {
					const description = row.request_description
					return description ? (description.length > 10 ? `${description.slice(0, 20)}...` : description) : ''
				}
			},
			{
				name: '작업상태',
				selector: row => (
					<span style={{
						color: row.status === '접수' ? 'red' : row.status === '완료' ? 'green' : row.status === '진행중' ? 'orange' : 'gray'
					}}>
						{row.status}
					</span>
				),
				width: '100px'
			},
			{
				name: '신청자',
				selector: row => {
					const requesterName = row.requester_name
					return requesterName && requesterName.length > 10 ? `${requesterName.slice(0, 10)}...` : requesterName
				},
				minWidth: '100px'
			}
			
		]

		const getInit = () => {
			const param = {
				prop_id :  cookies.get('property').value,
				problem_type : Problemtype.value,
				cause_type : Causetype.value,
				status : Status.value,
				emp_class : emp_class.value,
				search: searchitemParams
			}
			getTableData(API_INSPECTION_COMPLAIN_LIST, param, setData)
		}

		const changeSearch = () => {
			getInit()
		}

		const handleExport = () => {
			axios.get(API_INSPECTION_COMPLAIN_LIST_EXPORT, {params: {prop_id :  cookies.get('property').value, problem_type : Problemtype.value, cause_type : Causetype.value, status : Status.value, emp_class : emp_class.value, search: searchitemParams}})
			.then((res) => {
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
			getInit()
		}, [])
		
	return (
		<Fragment>
			<>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='작업현황관리' breadCrumbParent='점검관리' breadCrumbActive='작업현황관리' />
						<Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
							<FileText size={14}/>문서변환
						</Button.Ripple>
					</div>
				</Row>
				<Card>
					<CardHeader>
						<CardTitle>
						작업현황관리
						</CardTitle>
						<Button hidden={checkOnlyView(loginAuth, INSPECTION_COMPLAIN, 'available_create')}
							color='primary' tag={Link} to={ROUTE_INSPECTION_COMPLAIN_REGISTER} state={{type:'status'}}
						>접수</Button>
					</CardHeader>
					<CardBody style={{ paddingTop: 0}}>
						<EmployeeFilter 
							Causetype={Causetype} 
							setCauseType={setCauseType} 
							Problemtype={Problemtype} 
							setProblemType={setProblemType}
							Status={Status}
							setStatus = {setStatus}
							emp_class = {emp_class}
							setEmpClass = {setEmpClass}
							searchitemParams ={searchitemParams}
							setSearchItemParams = {setSearchItemParams}
							changeSearch={changeSearch}
							prop_id = {property_id}
						/>
						<TotalLabel 
							num={3}
							data={data.length}
						/>
						<Row>
							<CustomDataTable
								tableData={data}
								columns={basicColumns}
								detailAPI={ROUTE_INSPECTION_COMPLAIN_DETAIL}
							/>
						</Row>
					</CardBody>
				</Card>
			</>
	</Fragment>
	)
}


export default Complain