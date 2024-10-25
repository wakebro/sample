import { Fragment, useState, useEffect } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { useNavigate } from "react-router-dom"
import CustomDataTable from "../../../components/CustomDataTable"
import {ROUTE_INSPECTION_OUTSOURCING_REGISTER, API_INSPECTION_OUTSOURCING_LIST, API_EMPLOYEE_CLASS_LIST, ROUTE_INSPECTION_OUTSOURCING_DETAIL } from "../../../constants"
import { SIGN_COLLECT, SIGN_REJECT, checkOnlyView, getTableDataCallback, getTableDataModifyFirstIdx, primaryColor } from "../../../utility/Utils"
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import Flatpickr from "react-flatpickr"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
import { useSelector } from "react-redux"
import { INSPECTION_OUTSOURCING } from "../../../constants/CodeList"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from "../../../components/TotalLabel"

const OutSourcing = () => {
		useAxiosIntercepter()
        const loginAuth = useSelector((state) => state.loginAuth)
		const [data, setData] = useState([])
		const cookies = new Cookies()
		const activeUser = Number(cookies.get('userId'))
		const property_id = cookies.get('property').value
        const navigate = useNavigate()
		
		const [picker, setPicker] = useState([
			moment().subtract(7, 'days').format('YYYY-MM-DD'),
			moment().format('YYYY-MM-DD')
		]
		)
		const formatDate = (date) => {
			return moment(date).format("YYYY-MM-DD")
		}

		const [employeeClass, setEmployeeClass] = useState({label: '전체', value:''})
		const [classList, setClassList] = useState([{label: '전체', value:''}])
		const [searchitemParams, setSearchItemParams] = useState('')

 		const basicColumns = [
            {
				name: '일자',
				cell: row => row.create_datetime && formatDate(row.create_datetime),
				minWidth: '80px',
				maxWidth: '160px'
			},
            {
				name: '점검일지명',
				cell: row => row.title && row.title,
				minWidth: '100px'
			},
            {
				name: '작성자',
				cell: row => row.user && row.user,
				width: '100px'
			},
            {
				name: '담당자확인',
				cell: row => row.sign_lines.map(user => {
					if (user.view_order === 0) {
						if (user.is_final === true && user.type === 1) {
							return (
								(user.url !== '') ? <img src={user.url} key={user.id} style={{height:"100%", width: '100%'}}></img>
								:
								<span key={user.id} >{user.username}</span>
							)
						} else {
							return <span key={user.id} style={{color:'darkgray'}} >{user.username}</span>
						}
					}
				}),
				width: '100px'
			},
            {
				name: '1차 결재자',
				cell: row => row.sign_lines.map(user => {
					if (user.view_order === 1) {
						if (user.is_final === true && user.type === 1) {
							return (
								(user.url !== '') ? <img src={user.url} key={user.id} style={{height:"100%", width: '100%'}}></img>
								:
								<span key={user.id} >{user.username}</span>
							)
						} else if (user.type === 2) {
							return 	<hr key={user.id} style={{ border: '1px solid black', width : '100%', margin: 0}}/>
	
						} else if (user.type === 3) {
							return <span key={user.id}>미지정</span>
						} else {
							return <span key={user.id} style={{color:'darkgray'}} >{user.username}</span>
						}
					}
				}),
				width: '100px'
			},
            {
				name: '2차 결재자',
				cell: row => row.sign_lines.map(user => {
					if (user.view_order === 2) {
						if (user.is_final === true && user.type === 1) {
							return (
								(user.url !== '') ? <img src={user.url} key={user.id} style={{height:"100%", width: '100%'}}></img>
								:
								<span key={user.id} >{user.username}</span>
							)
						} else if (user.type === 2) {
							return 	<hr key={user.id} style={{ border: '1px solid black', width : '100%', margin: 0}}/>
	
						} else if (user.type === 3) {
							return <span key={user.id}>미지정</span>
						} else {
							return <span key={user.id} style={{color:'darkgray'}} >{user.username}</span>
						}
					}
				}),
				width: '100px'
			},
            {
				name: '최종 결재자',
				cell: row => row.sign_lines.map(user => {
					if (user.view_order === 3) {
						if (user.is_final === true && user.type === 1) {
							return (
								(user.url !== '') ? <img src={user.url} key={user.id} style={{height:"100%", width: '100%'}}></img>
								:
								<span key={user.id} >{user.username}</span>
							)
						} else {
							return <span key={user.id} style={{color:'darkgray'}} >{user.username}</span>
						}
					}
				}),
				width: '100px'
			},
			{
				name: '결재',
				cell: row => {
					console.log(row)
					const signState = row?.is_rejected
					let count = 0
					row.sign_lines.map((user) => {
						if (user.type === 1 || user.type === 2 || user.type === 3) {
							count++
						}
					})
					if (signState === SIGN_REJECT) {
						return (
							<>반려</>
						)
					} else if (signState === SIGN_COLLECT) {
						return (
							<>회수</>
						)
					} else if (count === 4) {
						return (
							<>완료</>
						)
					}
					return (
						<>결재대기</>
					)
				},
				conditionalCellStyles: [
					{
						when: row => row?.is_rejected === SIGN_REJECT,
						style: {
							color: 'red'
						}
					},
					{
						when: row => row?.is_rejected === SIGN_COLLECT,
						style: {
							color: primaryColor
						}
					},
					{
						when: row => {
							let count = 0
							row.sign_lines.map((user) => {
								if (user.type === 1 || user.type === 2 || user.type === 3) {
									count++
								}
							})
							return count === 4
						},
						style: {
							color: 'green'
						}
					}
				],
				width: '105px'
			}
		]
        
		const getApprovalList = (data) => {
			if (Array.isArray(data)) {
				const tempData = data.filter(row => !(row?.user_id !== activeUser && row?.is_rejected === 2))
				setData(tempData)
				return	
			}
			setData(data)
		}

		const changeSearch = () => {
			getTableDataCallback(API_INSPECTION_OUTSOURCING_LIST, {property_id : property_id, picker: picker, employee_class: employeeClass.value, search: searchitemParams}, getApprovalList)
		}

		useEffect(() => {
			getTableDataCallback(API_INSPECTION_OUTSOURCING_LIST, {property_id : property_id, picker: picker, employee_class: employeeClass.value, search: searchitemParams}, getApprovalList)
			getTableDataModifyFirstIdx(API_EMPLOYEE_CLASS_LIST, {prop_id: property_id}, setClassList, '전체')
		}, [])

	return (
		<Fragment>
			<>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='외주점검' breadCrumbParent='점검관리' breadCrumbActive='외주점검' />
					</div>
				</Row>
				<Card>
					<CardHeader>
						<CardTitle>
                            외주점검
						</CardTitle>
						<Button hidden={checkOnlyView(loginAuth, INSPECTION_OUTSOURCING, 'available_create')}
                            color='primary' 
                        	onClick = { () => { navigate(ROUTE_INSPECTION_OUTSOURCING_REGISTER, {state: {type:'register', reportType:'outsourcing'}}) } }
						>접수</Button>
					</CardHeader>
					<CardBody style={{ paddingTop: 0}}>
						<Row style={{ display: 'flex'}}>
							<Col md='3' className="mb-1">
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
									<Col xs='3' md='2' style={{ display:'flex', alignItems: 'center', justifyContent:'center'}}>직종</Col>
									<Select
										name='employeeClass'
										classNamePrefix={'select'}
										className="react-select custom-select-employeeClass custom-react-select"
										options={classList}
										value={employeeClass}
										onChange={(e) => setEmployeeClass(e)}
									/>
								</div>
							</Col>
							<Col md='4' className="mb-1">
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
									<Col xs='3' md='2' style={{ display:'flex', alignItems: 'center', justifyContent:'center'}}>접수일</Col>
									<Flatpickr
										value={picker}
										id='range-picker'
										className='form-control'
										placeholder='2022/02/09~2023/03/03'
										onChange={(dates) => setPicker(dates.map(formatDate))} // 날짜를 'yyyy-mm-dd' 형식으로 변환
										options={{
										mode: 'range',
										ariaDateFormat:'Y-m-d',
										locale: {
											rangeSeparator: ' ~ '
										},
										locale: Korean,
										defaultValue: picker // 초기값 설정

										}}
									/>								
								</div>
							</Col>
                            <Col className="mb-1" xs='12' md ='4'>
                                <InputGroup>
                                    <Input 
                                        value={searchitemParams}
                                        onChange={(e) => setSearchItemParams(e.target.value)}
                                        placeholder= {'점검일지명를 검색해 보세요.'}
										maxLength={498}
										onKeyDown={e => {
											if (e.key === 'Enter') {
												changeSearch()
											}
										}}/>
                                    <Button style={{zIndex:0}} onClick={() => { changeSearch() }}>검색</Button>
                                </InputGroup>
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
								detailAPI={ROUTE_INSPECTION_OUTSOURCING_DETAIL}
							/>
						</Row>
					</CardBody>
				</Card>
			</>
	</Fragment>
	)
}


export default OutSourcing