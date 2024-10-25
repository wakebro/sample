import Breadcrumbs from '@components/breadcrumbs'
import { selectThemeColors } from '@utils'
import { Fragment, useEffect, useState } from "react"
import { useLocation } from 'react-router'
import { Button, Col, Row, TabContent, Card, CardBody, CardTitle, TabPane, CardHeader, Input, InputGroup } from "reactstrap"
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'
import Select from 'react-select'
import CustomDataTable from '../../../../components/CustomDataTable'
import { ROUTE_SYSTEMMGMT_INCONV_ADD } from "../../../../constants"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import NavTab from '../../basic/company/list/NavTab'
import { CustomGetTableData, DetailUrlObj, InconvInfoColumn, InconvInfoUrlObj, SearchGetTableData, StandardTabList, TabGetTableData, defaultSystemTable, tabNameList } from '../InconData'
import { checkOnlyView } from '../../../../utility/Utils'
import { useSelector } from 'react-redux'
import { SYSTEM_INCONVENIENCE_TYPE } from '../../../../constants/CodeList'
import TotalLabel from '../../../../components/TotalLabel'

const InconvenienceInfo = () => {
	useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
	const { state } = useLocation()
	const [data, setData] = useState([])
	const [activeTab, setActiveTab] = useState()
	const [column, setColumn] = useState() 
	const [searchParams, setSearchParams] = useState('')
	const [selectEmpColumn, setSelectEmpColumn] = useState(defaultSystemTable[0])
	const [selectTableList, setSelectTableList] = useState([{label: '직종 전체', value:''}])
	const cookies = new Cookies()

	useEffect(() => {
		if (window.location.pathname !== localStorage.getItem('pathname')) {
			localStorage.clear()
			localStorage.setItem('pathname', window.location.pathname)
			localStorage.setItem('navTab', 'cause')
			setActiveTab('cause')
		} else {
			setActiveTab(localStorage.getItem('navTab'))
		}
	}, [])
	useEffect(() => {
		if (activeTab !== undefined) {
			if (activeTab !== localStorage.getItem('navTab')) {
				localStorage.setItem('navTab', activeTab)
			}
			setColumn(InconvInfoColumn[activeTab])
			if (selectTableList.length === 1) {
				setData([])
				setSearchParams('')
				setSelectEmpColumn(defaultSystemTable[0])
				CustomGetTableData(InconvInfoUrlObj[activeTab], {property:cookies.get('property').value, search:'', select_employee_class:''}, setData, setSelectTableList)
			} else {
				setSearchParams('')
				setSelectEmpColumn(defaultSystemTable[0])
				TabGetTableData(InconvInfoUrlObj[activeTab], {property:cookies.get('property').value, search:'', select_employee_class:''}, setData)
			}
		}
	}, [activeTab])

	useEffect(() => {
		if (data !== undefined && selectTableList.length === 1 && selectTableList[1] !== undefined) {
			const tempList = []
			selectTableList.map(d => { tempList.push({label:d.code, value:d.id}) })
			setSelectTableList(prevList => [...prevList, ...tempList])
		}
	}, [data])

	useEffect(() => {
		if (state !== null) {
			setActiveTab(state.key)
		}
	}, [])
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='유형별 분류' breadCrumbParent='시스템관리' breadCrumbParent2='시설표준정보' breadCrumbActive='유형별 분류' />
				</div>
			</Row>
			<Row>
				<Col sm={6} md={8} lg={6}>
					<NavTab tabList={StandardTabList} active={activeTab} setActive={setActiveTab}/>
				</Col>
			</Row>
			<Col>		
				<Card>
					<CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
						<TabContent activeTab={activeTab}>
							<TabPane tabId='cause'>
								<CardTitle tag='h4'>원인 유형</CardTitle>
							</TabPane>
							<TabPane tabId='repair'>
								<CardTitle tag='h4'>처리 유형</CardTitle>
							</TabPane>
							<TabPane tabId='problem'>
								<CardTitle tag='h4'>문제 유형</CardTitle>
							</TabPane>
							<TabPane tabId='normal'>
								<CardTitle tag='h4'>표준 자재</CardTitle>
							</TabPane>
						</TabContent>
						<Row>
							{ localStorage.getItem('navTab') && activeTab && 
								<Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_TYPE, 'available_create')}
                                    color='primary' 
									style={{marginLeft: '-22%'}}
									tag={Link} 
									to={ROUTE_SYSTEMMGMT_INCONV_ADD} 
									state={{
										title: tabNameList.find(item => activeTab in item)[activeTab],
										key: activeTab,
										API: InconvInfoUrlObj[activeTab],
										type:'register'
									}}>등록</Button>
							}
						</Row>
					</CardHeader>
						<CardBody>
							<Row className='d-flex align-items-center mt-sm-0 mt-1' style={{justifyContent: 'space-between'}}>
								{/* <Col className='d-flex align-items-center mt-sm-0 mt-1' sm='6' style={{justifyContent: 'space-between'}}> */}
									<Col md='6' sm='12'>
										<CardTitle tag='h6' style={{marginBottom: '1%'}}>{cookies.get('property').label}</CardTitle>
									</Col>
									<Col style={{display:'flex-end'}}>
										<Row>
											<Col md={2}/>
											<Col className='mb-1' md='4' sm='4'>
											{ activeTab !== 'normal' &&
												<Select
													key={selectTableList}
													theme={selectThemeColors}
													className='react-select'
													classNamePrefix='select'
													value={selectEmpColumn}
													options={selectTableList}
													onChange={(e) => setSelectEmpColumn(e)}
													isClearable={false}
													styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
												/>
											}
											</Col>
											{ localStorage.getItem('navTab') && activeTab &&
												<Col className='mb-1' md='6' sm='8'>
													<InputGroup>
														<Input 
															value={searchParams} 
															onChange={(e) => setSearchParams(e.target.value)} 
															placeholder= {tabNameList.find(item => activeTab in item)[activeTab]}
															onKeyDown={e => {
																if (e.key === 'Enter') {
																	SearchGetTableData(InconvInfoUrlObj[activeTab], { property:cookies.get('property').value, search: searchParams, select_employee_class: selectEmpColumn.value}, setData)
																}
															}}
															/>
														<Button
															onClick={() => {
																SearchGetTableData(InconvInfoUrlObj[activeTab], { property:cookies.get('property').value, search: searchParams, select_employee_class: selectEmpColumn.value}, setData)
																}}
														>
														검색
														</Button>
													</InputGroup>
												</Col>
											}
										</Row>
									</Col>
								{/* </Col> */}
							</Row>
							<TotalLabel 
								num={3}
								data={data.length}
							/>
							<CustomDataTable 
								columns={column} 
								tableData={data}
								setTabelData={setData} 
								setTableSelect={setActiveTab}
								selectType={false} 
								onRowClicked
								detailAPI={DetailUrlObj[activeTab]}
								noDataComponent
							/>
						</CardBody>
				</Card>
			</Col>
		</Fragment>
	)
}

export default InconvenienceInfo