import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@utility/hooks/useAxiosInterceptor'
import { axiosPostPut, makeSelectList, sweetAlert } from '@utils'

import axios from 'axios'
import { isEmptyObject } from 'jquery'
import { Fragment, useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router'
import Select from 'react-select'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"

import { API_EMPLOYEE_AUTH_LIST, API_EMPLOYEE_LIST, API_SYSTEMMGMT_AUTH_PROPERTY, ROUTE_SYSTEMMGMT_AUTH_USER } from '../../../../constants'
import PropertyGroupCheckTable from '../../../apps/cutomTable/PropertyGroupCheckTable'

const AuthProperty = () => {
	useAxiosIntercepter()
	const navigate = useNavigate()
	const { state } = useLocation()
	const [searchValueTemp, setSearchValueTemp] = useState('')
	const [search, setSearch] = useState({value:'', detect:false})
	const [users, setUsers] = useState([])
	const [user, setUser] = useState({})
	const [submitResult, setSubmitResult] = useState(false)
	const [checklist, setChecklist] = useState(new Set())
	const [dpPropertyList, setDpPropertyList] = useState([])
	const [filterPropertyList, setFilterPropertyList] = useState([])

	/** 선택한 작업자와 같은 사업소에 있는 작업자 리스트 */
	const getPropertyUserList = () => {
		axios.get(API_EMPLOYEE_LIST, {
			params: {
				propId: state.property,
				employeeClass: '',
				employeeLevel: '',
				employeeStatue: '재직',
				search: ''
			}
		})
		.then(res => {
			makeSelectList(true, '', res.data, users, setUsers, ['name'], 'id')
			const temp = res.data.find(row => row.id === state.user)
			setUser({label:temp.name, value:temp.id})
		})
	}

	/** 사업소 검색 */
	const handleSearch = () => {
		setSearch({
			...search,
			// value: '공주',
			value: searchValueTemp,
			detect: true
		}) //setSearchValue(searchValueTemp)
	}

	const onSubmit = () => {
		if (checklist.size === 0) {
			sweetAlert('사업소 미선택', '권한을 가질 사업소를 선택해주세요.', 'warning', 'center')
			return
		}
		const API = `${API_SYSTEMMGMT_AUTH_PROPERTY}/${user.value}`

		const result = []
		const formData = new FormData()
		dpPropertyList.map(data => {
			if (checklist.has(data.value)) result.push([data.value, data.is_only_view])
		})
		formData.append('property', JSON.stringify(result))

		axiosPostPut('modify', '사업소권한관리', API, formData, setSubmitResult)
	}
	
	useEffect(() => getPropertyUserList(), [])

	useEffect(() => {
		if (submitResult) navigate(ROUTE_SYSTEMMGMT_AUTH_USER)
	}, [submitResult])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='사용자권한관리' breadCrumbParent='시스템관리' breadCrumbParent2='권한관리' breadCrumbActive='사용자권한관리'/>
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
						사업소권한관리
					</CardTitle>
				</CardHeader>
				<CardBody style={{paddingTop:'0'}}>
					<Row style={{marginBottom:'1%'}}>
						<Col md={10}>
							<Row>
								<Col className='mb-1' lg={3} md={4} sm={4} xs={12}>
									<Row>
										<Col md={3} xs={2} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }} htmlFor='jobSelect'>이름</Col>
										<Col md={9} xs={10}>
											<Select
												classNamePrefix={'select'}
												className="react-select"
												options={users}
												value={user}
												onChange={e => setUser(e)}
												styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
											/>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>

					<Row style={{flexDirection:'row-reverse'}}>
						<Col className='mb-1'md={4} xs={12}>
							<InputGroup>
								<Input
									name='search'
									placeholder='사업소를 입력하세요.'
									onChange={(e) => setSearchValueTemp(e.target.value)}
									value={searchValueTemp}
									onKeyDown={e => {
										if (e.key === 'Enter') handleSearch()
									}}/>
								<Button style={{zIndex:0}} onClick={() => handleSearch()}>검색</Button>
							</InputGroup>
						</Col>
					</Row>

					<Row>
						{
							!isEmptyObject(user) ?
								<PropertyGroupCheckTable
									checkList={checklist}
									setCheckList={setChecklist}
									purpose='auth'
									user={user}
									customDpPropertyList={dpPropertyList}
									setCustomDpPropertyList={setDpPropertyList}
									filterPropertyList={filterPropertyList}
									setFilterPropertyList={setFilterPropertyList}
									search={search}
								/>
							:
								<></>
						}
					</Row>

				</CardBody>
				<CardFooter style={{marginTop:'1rem'}}>
					<Row style={{justifyContent:'end'}}>
						<Col style={{display:'flex', justifyContent:'flex-end'}}>
							<Button color='report' onClick={() => navigate(ROUTE_SYSTEMMGMT_AUTH_USER)}>취소</Button>
							&nbsp;&nbsp;
							<Button color='primary' onClick={() => onSubmit()}>확인</Button>
						</Col>
					</Row>
				</CardFooter>
			</Card>
		</Fragment>
	)
}

export default AuthProperty