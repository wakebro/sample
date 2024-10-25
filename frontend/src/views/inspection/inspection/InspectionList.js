import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState, useEffect } from "react"
import { Card, CardBody, CardHeader, CardTitle, Row, Button } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import * as moment from 'moment'
import CustomDataTable from './CustomDataTable'
import Filter from './Filter'
import { ROUTE_INSPECTION_INSPECTION_DETAIL, API_INSPECTION_PERFORMANCE_LIST, ROUTE_INSPECTION_INSPECTION_LIST_EXPORT, 
	ROUTE_INSPECTION_INSPECTION, ROUTE_CRITICAL_DISASTER_DETAIL, ROUTE_CRITICAL_DISASTER_DIRECTORY
} from '../../../constants'
import { useParams, useLocation } from "react-router-dom"
import { getTableData, pickerDateChange } from '../../../utility/Utils'
import { FileText } from 'react-feather'
import TotalLabel from '../../../components/TotalLabel'

const InspectionList = () => {
	const [searchValue, setSearchValue] = useState('')
	const [data, setData] = useState([])
	const [classList, setClassList] = useState([{label: '직종', value:''}])
	const [classSelect, setClassSelect] = useState({label: '직종', value:''})
	const dateFormat = (data) => {
		return moment(data).format('YYYY-MM-DD')
	}
	const { type } = useParams()
	const { state } = useLocation()
	// console.log(state?.initPicker)
	const pageLocation = (state?.type === 'manager' || state?.type === undefined || state?.type === 'inspection') ? 'inspection' : 'critical'

	const now = moment().subtract(0, 'days')
	const beforeday = moment().subtract(15, 'days')
	const [picker, setPicker] = useState(
		state?.initPicker ? 
		state?.initPicker :
		[beforeday.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')]
	)
	const [selectIsComplete, setSelectIsComplete] = useState({label:'전체', value: ''})

	const columns = [
		{
			name: '점검일',
			sortable: true,
			sortField: 'date',
			cell: row => dateFormat(row.date)
		},
		{
			name: '직종',
			sortable: true,
			sortField: 'class',
			cell: row => row.class
		},
		{
			name: '점검일지명',
			sortable: true,
			sortField: 'name',
			cell: row => row.name
		},
		{
			name: '양식번호',
			sortable: true,
			sortField: 'templateId',
			cell: row => row.templateId
		},
		{
			name: '일자번호',
			sortable: true,
			sortField: 'id',
			cell: row => row.id
		},
		{
			name: '담당자',
			sortable: true,
			sortField: 'user',
			cell: row => row?.user
		},
		{
			name: '최종 결재자',
			sortable: true,
			sortField: 'approver',
			cell: row => row?.approver
		},
		{
			name: '점검여부',
			sortable: true,
			sortField: 'status',
			cell: row => row?.status,
            conditionalCellStyles: [
                {
                    when: row => moment(now).isAfter(row?.date) && row?.status === '미완료',
                    style: {
                        color: 'red'
                    }
                },
				{
                    when: row => row?.status === '완료',
                    style: {
                        color: 'green'
                    }
                }
            ]
		}
	]

	const getInit = () => {
		const param = {
			template_id : type,
			schedule_id : state?.scheduleId,
			search_value : searchValue,
			class_select : classSelect.value,
			picker : pickerDateChange(picker),
			complete:selectIsComplete.value
		}
		getTableData(API_INSPECTION_PERFORMANCE_LIST, param, setData)
	}
	
	const handleClick = () => {
    	localStorage.setItem("data", JSON.stringify(data))
		window.open(ROUTE_INSPECTION_INSPECTION_LIST_EXPORT, '_blank')
	}

	useEffect(() => {
		getInit()
	}, [])
	
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs 
						breadCrumbTitle={`${pageLocation === 'inspection' ? '점검실적상세' : '안전점검일지'}`} 
						breadCrumbParent={`${pageLocation === 'inspection' ? '점검현황' : '중대재해관리'}`} 
						breadCrumbParent2={`${pageLocation === 'inspection' ? '자체점검' : '일일안전점검'}`}
						breadCrumbActive={`${pageLocation === 'inspection' ? '점검실적' : '점검일지'}`}/>
					<Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleClick}>
						<FileText size={14}/>
						문서변환
					</Button.Ripple>
				</div>
			</Row>
			<Row >
				<Card>
					<CardHeader>
						<CardTitle>
							{pageLocation === 'inspection' ? '점검실적상세' : '안전점검실적상세'}
						</CardTitle>
					</CardHeader>
					<CardBody>
						<Filter 
							searchValue={searchValue} 
							setSearchValue={setSearchValue} 
							picker={picker} setPicker={setPicker} 
							classSelect={classSelect}
							setClassSelect={setClassSelect} 
							classList ={classList}
							setClassList ={setClassList}
							handleSearch={getInit}
							listFlag={true}
							listLink={pageLocation === 'inspection' ? ROUTE_INSPECTION_INSPECTION : `${ROUTE_CRITICAL_DISASTER_DIRECTORY}/safety`}
							selectIsComplete={selectIsComplete}
							setSelectIsComplete={setSelectIsComplete}
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
							// type = {'detail'}
							type = {pageLocation}
							detailAPI={pageLocation === 'inspection' ? ROUTE_INSPECTION_INSPECTION_DETAIL : ROUTE_CRITICAL_DISASTER_DETAIL}
						/>
					</CardBody>
				</Card>
				
			</Row>
		</Fragment>
	)
}
export default InspectionList