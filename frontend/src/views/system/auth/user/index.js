import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setAuth, setAuths, setId, setName } from '@store/module/authUser'
import { getTableData, makeSelectList, checkAuth, primaryColor } from '@utils'
import axios from 'axios'
// import { isEmptyObject } from 'jquery'
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "react-router-dom"
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_EMPLOYEE_AUTH_LIST, API_EMPLOYEE_CLASS_LIST, API_EMPLOYEE_LIST, API_SYSTEMMGMT_AUTH_PROPERTY, ROUTE_SYSTEMMGMT_AUTH_PROPERTY } from '../../../../constants'
import { CustomDataTable } from '../data'
import AddPermissionGroupAuth from './AddAuth'
import TotalLabel from '../../../../components/TotalLabel'
import { SYSTEM_AUTH_USER } from '../../../../constants/CodeList'

const DEFAULT_VALUE = {label:'전체', value:''}

const AuthUser = () => {
	useAxiosIntercepter()
	const authUser = useSelector((state) => state.authUser)
	const loginAuth = useSelector((state) => state.loginAuth)
	const dispatch = useDispatch()

	const [data, setData] = useState([])
	const [properties, setProperties] = useState([])
	const [property, setProperty] = useState()
	const [employeeClassList, setEmployeeClassList] = useState([])
	const [employeeClass, setEmployeeClass] = useState(DEFAULT_VALUE)
	const [employeeStatus, setEmployeeStatus] = useState(DEFAULT_VALUE)
	const [searchValue, setSearchValue] = useState('')

	const cookies = new Cookies()

	const getSettings = () => {
		axios.get(API_SYSTEMMGMT_AUTH_PROPERTY, {params: {user_id:cookies.get('userId')}})
		.then(resProperties => {
			// Properties 세팅
			makeSelectList(true, '', resProperties.data.propList, properties, setProperties, ['label'], 'value')
			
			// property&employeeClass 세팅
			const temp = resProperties.data.propList.find(row => row.value === cookies.get('property').value)
			setProperty({
				label: temp?.label, 
				value: temp?.value
			})
		})
	}

	const reset = () => {
		setEmployeeClassList([])
		setProperties([])
		setProperty()
		dispatch(setId(null))
		dispatch(setName(''))
		dispatch(setAuths([]))
		dispatch(setAuth(authUser.defaultAuth))
		getSettings()
		getTableData(API_EMPLOYEE_LIST, {
			auth: true,
			propId: cookies.get('property').value, 
			employeeClass: '',
			employeeLevel: '',
			employeeStatue: '재직',
			search: ''
		}, setData)
	}

	const handleSearchWord = (e) => {
		const value = e.target.value
		setSearchValue(value)
	}

	useEffect(() => {
		getTableData(API_EMPLOYEE_LIST, {
			auth: true,
			propId: cookies.get('property').value, 
			employeeClass: '',
			employeeLevel: '',
			employeeStatue: '재직',
			search: ''
		}, setData)
	}, [])

	useEffect(() => {
		if (property) {
			axios.get(API_EMPLOYEE_CLASS_LIST, {params: {prop_id: property.value}})
			.then(res => {
				res.data.shift()
				makeSelectList(false, '', res.data, employeeClassList, setEmployeeClassList, ['label'], 'value')
			})
		}
	}, [property])

	useEffect(() => {
		if (!authUser.isOpen) reset()
	}, [authUser.isOpen])

	const columns = [
		{
			name: '이름',
			cell: row => row.name
		},
		{
			name: '직급',
			cell: row => row.level
		},
		{
			name: '직종',
			cell: row => row.class
		},
		{
			name: '아이디',
			cell: row => row.username
		},
		{
			name: '사업소권한',
			cell: row => {
				if (checkAuth(loginAuth, SYSTEM_AUTH_USER, 'available_update')) {
					return <></>
				} else {
					return <Link id={row.id} to={ROUTE_SYSTEMMGMT_AUTH_PROPERTY} state={{user: row.id, property: row.property}}>[변경]</Link>
				}
		}
		},
		{
			name: '그룹권한',
			cell: row => {
				if (checkAuth(loginAuth, SYSTEM_AUTH_USER, 'available_update')) {
					return <></>
				} else {
					return (
						<Fragment>
							<div className='px-0 mx-0 py-0 my-0 w-100 d-flex flex-row justify-content-center'>
								{row.auth !== null && <div className='px-0 mx-0 py-0 my-0'>{ row.auth.label }</div>}
								<div 
									className='px-0 mx-0 py-0 my-0'
									style={{cursor:'pointer', color:primaryColor}}
									onClick={() => dispatch(setId(row.id))}
								>
									[변경]
								</div>
							</div>
						</Fragment>
					)
				}
			}
		}
		// {
		// 	name: '테스트',
		// 	cell: row => <div id={row.id} style={{ color: '#FF9F43',  width:'100%', textAlign: 'center' }}>[변경]</div>
		// }
	]

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='사용자권한관리' breadCrumbParent='시스템관리' breadCrumbParent2='권한관리' breadCrumbActive='사용자권한관리' />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">사용자권한관리</CardTitle>
				</CardHeader>
				<CardBody style={{paddingTop:'0'}}>
					<Row>
						<Col lg={12} md={12} xs={12}>
							<Row>
								<Col className='mb-1' lg={3} md={6} xs={12}>
									<Row>
										<Col md={3} xs={2} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }} htmlFor='jobSelect'>사업소</Col>
										<Col>
											<Select
												classNamePrefix={'select'}
												className="react-select"
												options={properties}
												value={property}
												onChange={(e) => {
													setProperty(e)
													setEmployeeClassList([])
													setEmployeeClass({label:'전체', value:''})
													setEmployeeStatus({label:'전체', value:''})
												}}
												styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
											/>
										</Col>
									</Row>
								</Col>
								<Col className='mb-1' lg={2} md={6} xs={12}>
									<Row>
										<Col md={3} xs={2} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }} htmlFor='jobSelect'>직종</Col>
										<Col>
											<Select
												classNamePrefix={'select'}
												className="react-select"
												options={employeeClassList}
												value={employeeClass}
												onChange={(e) => setEmployeeClass(e)}
												styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
											/>
										</Col>
									</Row>
								</Col>
								{/* <Col className='mb-1' lg={3} md={6} xs={12}>
									<Row>
										<Col md={3}className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }} htmlFor='jobSelect'>상태</Col>
										<Col>
											<Select
												classNamePrefix={'select'}
												className="react-select"
												options={employeeStatusList}
												value={employeeStatus}
												onChange={(e) => setEmployeeStatus(e)}
												styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
											/>
										</Col>
									</Row>
								</Col> */}
								<Col className='mb-1' lg={3} md={6} xs={12}>
									<Row>
										<Col>
											<InputGroup>
												<Input
													value={searchValue}
													placeholder='직원의 이름을 입력해주세요.'
													onChange={handleSearchWord}
													onKeyDown={e => {
														if (e.key === 'Enter') {
															getTableData(API_EMPLOYEE_LIST, {
																propId:property.value, 
																employeeClass: employeeClass.value,
																employeeLevel:'',
																employeeStatue: employeeStatus.value,
																search: searchValue
															}, setData)
														}
													}}
												/>
												<Button 
													onClick={() => {
														getTableData(API_EMPLOYEE_LIST, {
															propId:property.value, 
															employeeClass: employeeClass.value,
															employeeLevel:'',
															employeeStatue: employeeStatus.value,
															search: searchValue
														}, setData)
													}}
												>검색</Button>
											</InputGroup>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
					<TotalLabel 
						num={3}
						data={data.length}
						unit={'명'}
					/>
					<CustomDataTable
						columns={columns} 
						tableData={data} 
						setTabelData={setData} 
						selectType={false}
						state={{key:'user'}}
					/>
				</CardBody>
			</Card>
			<AddPermissionGroupAuth/>
		</Fragment>
	)
}

export default AuthUser