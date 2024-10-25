import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Row } from 'reactstrap'
import { ROUTE_INSPECTION_INSPECTION_LIST, API_INSPECTION_PERFORMANCES, ROUTE_INSPECTION_INSPECTION_EXPORT, ROUTE_CRITICAL_DISASTER_LIST } from '../../../constants'
import { useParams } from "react-router-dom"

import '@styles/react/libs/flatpickr/flatpickr.scss'
import * as moment from 'moment'
import CustomDataTable from './CustomDataTable'
import Filter from './Filter'
import { getScheduleCycle, getTableData, pickerDateChange } from '../../../utility/Utils'
import Cookies from 'universal-cookie'
import { FileText } from 'react-feather'
import CustomHelpCircle from '../../apps/CustomHelpCircle'
import TotalLabel from '../../../components/TotalLabel'

// 점검실적
const InspectionIndex = () => {
	const cookies = new Cookies()
	const type = useParams()
	const [searchValue, setSearchValue] = useState('')
	const [classList, setClassList] = useState([{label: '전체', value:''}])
	const [classSelect, setClassSelect] = useState({label: '전체', value:''})

	const [data, setData] = useState([])
	const now = moment()
	const beforeday = moment().subtract(15, 'days')
	const [picker, setPicker] = useState([beforeday.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')])

	const columns = [
		{
			name: '직종',
			sortable: true,
			sortField: 'class',
			cell: row => row.class
		},
		{
			name: '상태',
			sortable: true,
			sortField: 'state',
			cell: row => {
				const temp = row.state ? <>{'사용중'}</> : <>{'사용중지'}</>
				return temp
			}
		},
		{
			name: '점검 주기',
			cell: row => getScheduleCycle(row)
		},
		{
			name: '일지명',
			sortable: true,
			sortField: 'name',
			cell: row => row.name
		},
		{
			name: '계획/실적(특별)',
			sortable: false,
			sortField: 'count_result',
			cell: row => row.count_result
			// selector: row => row.count_fl
		},
		{
			name: '완료율',
			sortable: true,
			sortField: 'per',
			// selector: row => (`${row.per}%`)
			cell: row => { return `${row.per}%` } 

		}
	]

	const handleClick = () => {
    	localStorage.setItem("data", JSON.stringify(data))
		window.open(ROUTE_INSPECTION_INSPECTION_EXPORT, '_blank')
	}

	// 데이터 받아오는 func
	const getInit = () => {
		setData([])
		const param = {
			prop_id :  cookies.get('property').value,
			search_value : searchValue,
			class_select : classSelect.value,
			picker : pickerDateChange(picker),
			type: type.type === undefined ? 'inspection' : 'disaster'
		}
		getTableData(API_INSPECTION_PERFORMANCES, param, setData)
	}

	// 첫 랜더링 출력
	useEffect(() => {
		getInit()
	}, [])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs 
						breadCrumbTitle={`${type.type === undefined ? '점검실적' : '안전점검실적'}`} 
						breadCrumbParent={`${type.type === undefined ? '점검관리' : '중대재해관리'}`} 
						breadCrumbParent2={`${type.type === undefined ? '자체점검' : '일일안전점검'}`}
						breadCrumbActive={`${type.type === undefined ? '점검실적' : '점검일지'}`}
					/>
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
							{type.type === undefined ? '점검실적' : '안전점검실적'}
							<CustomHelpCircle
								id={'inspectionIcon'}
								content={'일정관리의 업무등록/중대재 업무등록에 등록된 점검양식에 대해 자동적으로 생성됩니다.'}
							/> 
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
							type={type.type}
							picker={pickerDateChange(picker)}
							detailAPI={type.type === undefined ? ROUTE_INSPECTION_INSPECTION_LIST : ROUTE_CRITICAL_DISASTER_LIST}
						/>
					</CardBody>
				</Card>
			</Row>
		</Fragment>
	)
}
export default InspectionIndex