import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row, TabContent, TabPane } from "reactstrap"
import Cookies from 'universal-cookie'
import { ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD, ROUTE_SYSTEMMGMT_BASIC_SPACE_DETAIL } from '../../../../../constants'
import { checkOnlyView, getTableData } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import CustomDataTable from '../../company/list/CustomDataTable'
import NavTab from '../../company/list/NavTab'
import { BasicInfoTabList, apiObj, basicInfoColumn, spacePlaceHolder } from '../data'
import { useSelector } from 'react-redux'
import { SYSTEM_INFO_SPACE } from '../../../../../constants/CodeList'
import TotalLabel from '../../../../../components/TotalLabel'

const SystemBasicSpace = () => {
	useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
	const [navActive, setNavActive] = useState()
	const [columns, setColumns] = useState()
	const [data, setData] = useState([])
	const [tableSelect, setTableSelect] = useState([])
	const [searchValue, setSearchValue] = useState('')

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
			setColumns(basicInfoColumn[navActive])
			getTableData(apiObj[navActive], {searchValue:'', selectFilter:'', property: cookies.get('property').value}, setData)
		}
	}, [navActive])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='공간정보관리' breadCrumbParent='시스템관리' breadCrumbParent2='기본정보' breadCrumbActive='공간정보관리'/>
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
										<Button hidden={checkOnlyView(loginAuth, SYSTEM_INFO_SPACE, 'available_create')}
                                            color='primary' tag={Link} 
											to={ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD}
											state={{pageType:'register', key: navActive}}
											>등록</Button>
									</CardHeader>
									<CardBody>
										<Row>
											<Col className='mb-1' md={7} xs={12}>
												<InputGroup>
													<Input
														className='dataTable-filter'
														type='text'
														id='searchValue-input'
														value={searchValue}
														placeholder={spacePlaceHolder[navActive]}
														onChange={handleSearchWord}
														onKeyDown={e => {
															if (e.key === 'Enter') {
																getTableData(apiObj[navActive], {searchValue:searchValue, property:cookies.get('property').value}, setData)
															}
														}}
													/>
													<Button onClick={() => getTableData(apiObj[navActive], {searchValue:searchValue, property:cookies.get('property').value}, setData)}>검색</Button>
												</InputGroup>
											</Col>
										</Row>
										<TotalLabel 
											num={3}
											data={data.length}
										/>
										<CustomDataTable
											columns={columns} 
											tableData={data} 
											setTabelData={setData} 
											setTableSelect={setTableSelect}
											selectType={false}
											detailAPI={ROUTE_SYSTEMMGMT_BASIC_SPACE_DETAIL}
											state={{key:navActive}}
										/>
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

export default SystemBasicSpace