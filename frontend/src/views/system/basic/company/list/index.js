import Breadcrumbs from '@components/breadcrumbs'
import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row, TabContent, TabPane } from "reactstrap"
import Cookies from 'universal-cookie'
import { ROUTE_SYSTEMMGMT_BASIC_COMPANY_ADD, ROUTE_SYSTEMMGMT_BASIC_COMPANY_DETAIL } from '../../../../../constants'
import { SYSTEM_INFO_COMPANY } from '../../../../../constants/CodeList'
import { checkOnlyView, getTableData } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { BasicInfoAPIObj, BasicInfoTabList, BasicInputPlaceholder, basicInfoColumn } from '../data'
import CustomDataTable from './CustomDataTable'
import NavTab from './NavTab'
import TotalLabel from '../../../../../components/TotalLabel'

const DEFAULT_OBJ = {label: '전체', value:''}

const SystemBasicCompany = () => {
	useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
	const [navActive, setNavActive] = useState()
	const [columns, setColumns] = useState()
	const [data, setData] = useState([])
	const [tableSelect, setTableSelect] = useState([])
	const [selectList, setSelectList] = useState([{label: '전체', value:''}])
	const [selected, setSelected] = useState(selectList[0])
	const [searchValue, setSearchValue] = useState('')
	const [cityList, setCityList] = useState([{label: '전체', value:''}])

	const cookies = new Cookies()

	const handleSearchWord = (e) => {
		const value = e.target.value
		setSearchValue(value)
	}

	useEffect(() => {
		if (window.location.pathname !== localStorage.getItem('pathname')) {
			localStorage.clear()
			localStorage.setItem('pathname', window.location.pathname)
			setNavActive(BasicInfoTabList[0].value)
		} else {
			setNavActive(localStorage.getItem('navTab'))
		}
	}, [])

	useEffect(() => {
	}, [tableSelect])

	useEffect(() => {
		if (navActive !== undefined) {
			if (navActive !== localStorage.getItem('navTab')) {
				localStorage.setItem('navTab', navActive)
			}
			setData([])
			setSearchValue('')
			setSelectList([{label: '전체', value:''}])
			setSelected(selectList[0])
			setColumns(basicInfoColumn[navActive])
			if (navActive === 'property') {
				axios.get(BasicInfoAPIObj[navActive], {
					params: {type: true}
				})
				.then(res => {
					// setSelectList(prevList => [...prevList, ...res.data])
					setSelectList([...res.data])
				})
			}
			getTableData(BasicInfoAPIObj[navActive], {searchValue:'', selectFilter:'', property: cookies.get('property').value}, setData)
		}
	}, [navActive])

	useEffect(() => {
		if (data !== undefined && cityList.length === 1) {
			const tempList = []
			data.map(d => { tempList.push({label:d.name, value:d.code}) })
			setCityList([...tempList])
		}
	}, [data])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='회사정보관리' breadCrumbParent='시스템관리' breadCrumbParent2='기본정보' breadCrumbActive='회사정보관리' />
				</div>
			</Row>
			<Row>
				<Col sm={6} md={8} lg={6}>
					<NavTab tabList={BasicInfoTabList} active={navActive} setActive={setNavActive}/>
				</Col>
			</Row>
			<TabContent activeTab={navActive}>
				{
					BasicInfoTabList.map((tab, idx) => {
						return (
							<TabPane tabId={tab.value} key={idx}>
								<Card>
									<CardHeader>
										<CardTitle className="title">
											{tab.label}
										</CardTitle>
										<Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_COMPANY, 'available_create')}
                                            color='primary' tag={Link} 
											to={ROUTE_SYSTEMMGMT_BASIC_COMPANY_ADD}
											state={{pageType:'register', key: navActive}}
											>등록</Button>
									</CardHeader>
									<CardBody style={{paddingTop:'0'}}>
										<Row>
											<Col md={8}>
												<Row>
													{
														navActive === 'property' &&
															<Col className='mb-1'md={3} xs={12}>
																<Select
																	classNamePrefix={'select'}
																	className="react-select"
																	options={selectList}
																	value={selected}
																	onChange={(e) => setSelected(e)}
																	styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
																/>
															</Col>
													}
													<Col className='mb-1'md={5} xs={12}>
														<InputGroup>
															<Input
																value={searchValue}
																onChange={handleSearchWord}
																placeholder={BasicInputPlaceholder[navActive]}
																onKeyDown={e => {
																	if (e.key === 'Enter') {
																		getTableData(BasicInfoAPIObj[navActive], {searchValue:searchValue, selectFilter:selected.value, property: cookies.get('property').value}, setData)
																	}
																}}
															/>
															<Button onClick={() => getTableData(BasicInfoAPIObj[navActive], {searchValue:searchValue, selectFilter:selected.value, property: cookies.get('property').value}, setData)}>검색</Button>
														</InputGroup>
													</Col>
												</Row>
											</Col>
										</Row>
										<TotalLabel
											num={3}
											data={data.length}
										/>
										{
											data &&
											<CustomDataTable
												columns={columns} 
												tableData={data} 
												setTabelData={setData} 
												setTableSelect={setTableSelect}
												selectType={false}
												detailAPI={ROUTE_SYSTEMMGMT_BASIC_COMPANY_DETAIL}
												state={{key:navActive}}
											/>
										}
									</CardBody>
								</Card>
							</TabPane>
						)
					})
				}
			</TabContent>
		</Fragment>
	)
}

export default SystemBasicCompany