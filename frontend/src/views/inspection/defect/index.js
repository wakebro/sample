import { Fragment, useState, useEffect } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import {ROUTE_INSPECTION_DEFECT_REGISTER, API_INSPECTION_DEFECT_LIST, ROUTE_INSPECTION_DEFECT_DETAIL, API_EMPLOYEE_CLASS_LIST } from "../../../constants"
import { Link } from "react-router-dom"
import CustomDataTable from "./CustomDataTable"
import { checkOnlyView, getTableData, getTableDataModifyFirstIdx } from "../../../utility/Utils"
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import Flatpickr from "react-flatpickr"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
import { useSelector } from "react-redux"
import { INSPECTION_DEFECT } from "../../../constants/CodeList"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from "../../../components/TotalLabel"

const Defect = () => {
		useAxiosIntercepter()
        const loginAuth = useSelector((state) => state.loginAuth)
		const [data, setData] = useState([])
		const cookies = new Cookies()
		const property_id = cookies.get('property').value
		
		const [picker, setPicker] = useState([
			moment().subtract(7, 'days').format('YYYY-MM-DD'),
			moment().format('YYYY-MM-DD')
		]
		)
		const formatDate = (date) => {
			return moment(date).format("YYYY-MM-DD")
		}

		const getCellContent = (row) => {
			if (row.repair_datetime) {
				return <div>완료</div>
			} else {
				return <div>미완료</div>
			}
		}
		const [employee_class, setEmployeeClass] = useState({label: '전체', value:''})
		const [classList, setClassList] = useState([{label: '전체', value:''}])
		const [complete, setComplete] = useState({label: '전체', value:''})
		const [completeList, setCompleteList] = useState([{label: '전체', value:''}])

 		const basicColumns = [
            {
				name: '사업소',
				cell: row => row.prop && row.prop.name,
				width: '100px'
			},
			{
				name: '점검일', // 접수일
				cell: row => row.check_datetime && row.check_datetime.split('T')[0],
				minWidth: '100px'
			},
            {
				name: '점검자', // 접수자
				cell: row => row.check_user_name && row.check_user_name,
				width: '100px'
			},
            {
				name: '직종', // 공종 : 공사명 , 직종: 직업 명 
				cell: row => row.emp_class && row.emp_class.code,
				width: '80px'
			},
            {
				name: '위치',
				cell: row => row.location && row.location,
				minWidth: '100px'

			},
			{
				name: '내용',
				cell: row => {
					const problem = row.problem
					return problem ? (problem.length > 5 ? `${problem.slice(0, 5)}...` : problem) : ''
				}
			},
			{
				name: (
					<div style={{width: '100%', height:'100%'}}>
						<div style={{height:'50%'}}>&nbsp;</div>
						<div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">완료일</div>
					</div>
				),
				width: '100px',
				cell: row => row.repair_datetime && row.repair_datetime.split('T')[0]

			},
			{
				name: (
						<div style={{width: '100%', height:'100%'}}>
							<div style={{height:'50%'}} className="d-flex align-items-center justify-content-center">조치 현황</div>
							<div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderLeft: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">조치자</div>
						</div>
				),
				width: '100px',
				cell: row => row.repair_user_name && row.repair_user_name
			},
			{
				name: (
					<div style={{width: '100%', height:'100%'}}>
						<div style={{height:'50%'}}>&nbsp;</div>
						<div style={{ borderTop: '2px solid #B9B9C3', height:'50%', borderLeft: '1px solid #B9B9C3'}} className="d-flex align-items-center justify-content-center">상태</div>
					</div>
				),
				width: '100px',
				compact: true,
				cell: row => (
					<div>
        				{getCellContent(row)}
					</div>
				)
			},
			{
				name: '비고',
				cell: row => {
					const description = row.description
					return description ? (description.length > 5 ? `${description.slice(0, 5)}...` : description) : ''
				},
				minWidth: '100px'
			}
		]

		useEffect(() => {
			getTableData(API_INSPECTION_DEFECT_LIST, {property_id : property_id, picker: picker, employee_class: employee_class.value, complete: complete.value }, setData)
			getTableDataModifyFirstIdx(API_EMPLOYEE_CLASS_LIST, {prop_id: property_id}, setClassList, '전체')
			setCompleteList([{label: '전체', value:''}, {label: '완료', value:'완료'}, {label: '미완료', value:'미완료'}])
		}, [])

		useEffect(() => {
			getTableData(API_INSPECTION_DEFECT_LIST, {property_id : property_id, picker: picker, employee_class: employee_class.value, complete: complete.value }, setData)
		}, [picker, employee_class, complete])

	return (
		<Fragment>
			<>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='하자관리' breadCrumbParent='시설관리' breadCrumbActive='하자관리' />
					</div>
				</Row>
				<Card>
					<CardHeader>
						<CardTitle>
                            하자관리
						</CardTitle>
						<Button hidden={checkOnlyView(loginAuth, INSPECTION_DEFECT, 'available_create')}
                            color='primary' tag={Link} to={ROUTE_INSPECTION_DEFECT_REGISTER}
						>등록</Button>
					</CardHeader>
					<CardBody style={{ paddingTop: 0}}>
						<Row className="ps-1">
							<Col md='2' className="mb-1">
								<Row style={{ width: '100%'}}>
									<Col xs='3' md='3' className="card_table text facility-center">직종</Col>{/* 공종 */}
									<Col className="px-0">
										<Select
										name='employeeClass'
										classNamePrefix={'select'}
										className="react-select custom-select-employeeClass custom-react-select"
										options={classList}
										value={employee_class}
										defaultValue={classList[0]}
										onChange={(e) => setEmployeeClass(e)}
										/>
									</Col>
								</Row>
							</Col>
							<Col md='3' className="mb-1">
								<Row style={{ width: '100%'}}>
									<Col xs='3' md='3' className="card_table text facility-center">처리여부</Col> 
									<Col className="px-0">
										<Select
										name='complete'
										classNamePrefix={'select'}
										className="react-select custom-select-complete custom-react-select"
										options={completeList}
										value={complete}
										defaultValue={completeList[0]}
										onChange={(e) => setComplete(e)}
										/>
									</Col>                   
								</Row>
							</Col>
							<Col md='4' className="mb-1">
								<Row style={{ width: '100%'}}>
									<Col xs='3' md='2' className="card_table text facility-center">접수일</Col>
									<Col className="px-0">
										<Flatpickr
											value={picker}
											id='range-picker'
											className='form-control'
											placeholder='2022/02/09~2023/03/03'
											onChange={(dates) => setPicker(dates.map(formatDate))} // 날짜를 'yyyy-mm-dd' 형식으로 변환
											options={{
											mode: 'range',
											locale: Korean,
											ariaDateFormat:'Y-m-d',
											locale: {
												rangeSeparator: ' ~ '
											},
											defaultValue: picker // 초기값 설정

											}}
										/>								
									</Col>
								</Row>
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
								detailAPI={ROUTE_INSPECTION_DEFECT_DETAIL}
							/>
							{/* <UseTable/> */}

						</Row>
					</CardBody>
				</Card>
			</>
	</Fragment>
	)
}


export default Defect