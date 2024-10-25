import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Row } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import * as moment from 'moment'
import CustomDataTable from '../CustomDataTable'
import Filter from '../Filter'
import { useParams } from "react-router-dom"
import { API_INSPECTION_PERFORMANCE_LIST, ROUTE_INSPECTION_REG, ROUTE_CRITICAL_DISASTER_INSPECTION_REG, ROUTE_INSPECTION_INSPECTION_LIST_EXPORT } from '../../../../constants'
import { getTableData, pickerDateChange } from '../../../../utility/Utils'
import Cookies from 'universal-cookie'
import { FileText } from 'react-feather'
import TotalLabel from '../../../../components/TotalLabel'

const InspectionManageList = () => {
	const cookies = new Cookies()
	const propertyId = cookies.get('property').value
	const [searchValue, setSearchValue] = useState('')
	const [data, setData] = useState([])
	const [classList, setClassList] = useState([{label: '직종', value:''}])
	const [classSelect, setClassSelect] = useState({label: '직종', value:''})
	const [selectIsComplete, setSelectIsComplete] = useState({label:'전체', value: ''})
	const dateFormat = (data) => {
		return moment(data).format('YYYY-MM-DD')
	}
	const { type } = useParams()
	const listType = type === 'mg' ? 'inspection' : 'disaster'

	const now = moment().subtract(0, 'days')
	const yesterday = moment().subtract(6, 'days')
	const [picker, setPicker] = useState([yesterday.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')])
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

	const handleClick = () => {
    	localStorage.setItem("data", JSON.stringify(data))
		window.open(ROUTE_INSPECTION_INSPECTION_LIST_EXPORT, '_blank')
	}

	const getInit = () => {
		const param = {
			property : propertyId,
			search_value : searchValue,
			class_select : classSelect.value,
			picker : pickerDateChange(picker),
			list_type: listType,
			complete:selectIsComplete.value
		}
		getTableData(API_INSPECTION_PERFORMANCE_LIST, param, setData)
	}
	
	useEffect(() => {
		getInit()
	}, [])
	
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs 
						breadCrumbTitle={`${type === 'mg' ? '점검일지관리' : '안전점검일지관리'}`} 
						breadCrumbParent={`${type === 'mg' ? '점검관리' : '중대재해관리'}`} 
						breadCrumbParent2={`${type === 'mg' ? '자체점검' : '일일안전점검'}`}
						breadCrumbActive={`${type === 'mg' ? '점검일지관리' : '점검일지관리'}`}/>
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
							{type === 'mg' ? '점검일지관리' : '안전점검일지관리'}
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
							type = {'manager'}
							detailAPI={type === 'mg' ? `${ROUTE_INSPECTION_REG}/mg` : `${ROUTE_CRITICAL_DISASTER_INSPECTION_REG}/safety`} // 중대재링크수정
						/>
					</CardBody>
				</Card>
				
			</Row>
		</Fragment>
	)
}
export default InspectionManageList