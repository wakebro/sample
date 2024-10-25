import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState, useEffect } from "react"
import { Card, CardBody, CardHeader, CardTitle, Row, Button } from 'reactstrap'
import { useParams } from 'react-router'
import { ROUTE_INSPECTION_INSPECTION_LIST, ROUTE_INSPECTION_INSPECTION_FORM, 
	API_INSPECTION_CHECKLIST_FORMS, ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM
 } from '../../../constants'
import { Link } from 'react-router-dom'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import CustomDataTable from './CustomDataTable'
import FormFilter from './FormFilter'
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import { checkOnlyView, getTableData } from '../../../utility/Utils'
import { CRITICAL_INSPECTION_FORM, INSPECTION_FORM } from '../../../constants/CodeList'
import { useSelector, useDispatch } from 'react-redux'
import { setSignList } from '../../../redux/module/inspectionPreview'
import TotalLabel from '../../../components/TotalLabel'

const InspectFormList = () => {
	const loginAuth = useSelector((state) => state.loginAuth)
	const dispatch = useDispatch()

	const cookies = new Cookies()
	const { type } = useParams()
	const statusList = [
		{label: '상태', value:''},
		{label: '대기', value: 0},
		{label: '사용', value: 1},
		{label: '중지', value: 2}
	]

	const dateFormat = (data) => {
		return moment(data).format('YYYY-MM-DD')
	}
	const statuFormat = (data) => {
		if (data === '0') {
			return '대기'
		} else if (data === '1') {
			return '사용'
		} else if (data === '2') {
			return '중지'
		} else {
			return '-'
		}
	}

	const [searchValue, setSearchValue] = useState('')
	const [classList, setClassList] = useState([{label: '전체', value:''}])
	const [classSelect, setClassSelect] = useState({label: '전체', value:''})
	const [statusSelect, setStatusSelect] = useState(statusList[0])
	const [data, setData] = useState([])

	const columns = [
		{
			name: '양식번호',
			sortable: true,
			sortField: 'code',
			selector: row => row.code,
			width:'110px'
		},
		{
			name: '직종',
			sortable: true,
			sortField: 'employee_class',
			selector: row => row.employee_class
		},
		{
			name: '점검일지명',
			sortable: true,
			sortField: 'name',
			selector: row => row.name,
			minWidth: '50rem'
		},
		{
			name: '관리자',
			sortable: false,
			selector: row => row?.manager,
			width:'110px'
		},
		{
			name: '사용건',
			sortable: true,
			sortField: 'count',
			selector: row => row.count,
			width:'110px'
		},
		{
			name: '구분',
			sortable: true,
			sortField: 'status',
			selector: row => statuFormat(row.status)
		},
		{
			name: '최종변경일',
			sortable: true,
			sortField: 'update_date',
			selector: row => dateFormat(row.update_date)
		}
	]
	
	const getInit = () => {
		dispatch(setSignList([]))
		const param = {
			prop_id :  cookies.get('property').value,
			search_value : searchValue,
			status_select : statusSelect.value,
			class_select : classSelect.value,
			type: type === undefined ? 'inspection' : 'disaster'
		}
		getTableData(API_INSPECTION_CHECKLIST_FORMS, param, setData)
	}

	useEffect(() => {
		getInit()
	}, [])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs 
						breadCrumbTitle={`${type === undefined ? '점검양식' : '안전점검양식'}`} 
						breadCrumbParent={`${type === undefined ? '점검관리' : '중대재해관리'}`} 
						breadCrumbParent2={`${type === undefined ? '자체점검' : '일일안전점검'}`}
						breadCrumbActive='점검양식' 
					/>
				</div>
			</Row>
			<Row >
				<Card>
					<CardHeader>
						<CardTitle>
							{type === undefined ? '점검양식관리' : '안전점검양식관리'}
						</CardTitle>
						<Button 
							hidden={checkOnlyView(loginAuth, type === undefined ? INSPECTION_FORM : CRITICAL_INSPECTION_FORM, 'available_create')}
							tag={Link} 
							to={ type === undefined ? ROUTE_INSPECTION_INSPECTION_FORM : ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM}  
							color='primary'
							state={{
								type: type === undefined ? 'inspection' : 'disaster'
							}}
						>등록</Button>
					</CardHeader>
					<CardBody>
						<FormFilter
							searchValue={searchValue}
							setSearchValue={setSearchValue} 
							statusList={statusList} 
							statusSelect={statusSelect}
							setStatusSelect={setStatusSelect}
							classSelect={classSelect}
							setClassSelect={setClassSelect} 
							classList ={classList}
							setClassList ={setClassList}
							handleSearch={getInit}
						/>
						<TotalLabel 
							num={3}
							data={data.length}
						/>
						<CustomDataTable 
							columns={columns} 
							tableData={data} 
							setTabelData={setData}
							pagination ={true} 
							type={'detail'}
							detailAPI={type === undefined ? 
								!checkOnlyView(loginAuth, INSPECTION_FORM, 'available_update') ? ROUTE_INSPECTION_INSPECTION_FORM : undefined 
								: ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM}
						/>
					</CardBody>
				</Card>
			</Row>
		</Fragment>
	)
}
export default InspectFormList