import Breadcrumbs from '@components/breadcrumbs'
import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, TabContent, TabPane, InputGroup } from "reactstrap"
import Cookies from 'universal-cookie'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import CustomDataTable from '../../../../components/CustomDataTable'
import { StandardTabList, StandardColumn, StandardUrlObj, StandardtabNameList, StandadDetailUrlObj, getCustomTableData } from '../../standard/data'
import { SearchGetTableData } from '../../inconvenience/inconData'
import {ROUTE_STANDARD_ADD} from '../../../../constants'
import NavTab from '../../basic/company/list/NavTab'
import { checkOnlyView } from '../../../../utility/Utils'
import { SYSTEM_INCONVENIENCE_NORMAL } from '../../../../constants/CodeList'
import { useSelector } from 'react-redux'

const StandardInfoList = () => {
	useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
	const [activeTab, setActiveTab] = useState()
	const [columns, setColumns] = useState()
	const [data, setData] = useState([])
	const [tableSelect, setTableSelect] = useState([])
	const [selectCostTypeList, setSelectCostTypeList] = useState([{ value:'', label: '인덱스타입'}])
	const [selected, setSelected] = useState(selectCostTypeList[0])
	const [searchValue, setSearchValue] = useState('')
	const cookies = new Cookies()
	useEffect(() => {
		if (window.location.pathname !== localStorage.getItem('pathname')) {
			localStorage.clear()
			localStorage.setItem('pathname', window.location.pathname)
			setActiveTab(StandardTabList[0].value)
		} else {
			setActiveTab(localStorage.getItem('navTab'))
		}
	}, [])

	useEffect(() => {
	}, [tableSelect])

	useEffect(() => {
		if (activeTab !== undefined) {
			if (activeTab !== localStorage.getItem('navTab')) {
				localStorage.setItem('navTab', activeTab)
			}
			setData([])
			setSearchValue('')
			setColumns(StandardColumn[activeTab])
			if (activeTab === 'costCategory') {
				getCustomTableData(StandardUrlObj[activeTab], {property:cookies.get('store').value, search:'', select_cost_type:''}, setData, setSelectCostTypeList)
			} else {
				SearchGetTableData(StandardUrlObj[activeTab], {search:'', select_cost:''}, setData)
			}
		}
	}, [activeTab])

	useEffect(() => {
		if (localStorage.getItem('navTab') !== undefined && localStorage.getItem('navTab') !== null) {
			axios.get(StandardUrlObj[localStorage.getItem('navTab')], {
				params: {property:cookies.get('store').value, search: '', select_cost_type: selected.value}
			})
			.then(res => {
				setData(res.data.data)
			})
		}
	}, [selected])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
                	<Breadcrumbs breadCrumbTitle='임대표준관리' breadCrumbParent='시스템관리' breadCrumbActive='임대표준관리' />
				</div>
			</Row>
			<Row>
				<Col sm={6} md={8} lg={6}>
					<NavTab tabList={StandardTabList} active={activeTab} setActive={setActiveTab}/>
				</Col>
			</Row>
			<TabContent activeTab={activeTab}>
				{ StandardTabList.map((tab, idx) => {
                    return (
						<TabPane tabId={tab.value} key={idx}>
							<Card>
								<CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
									<CardTitle className="title">
										{tab.label}
									</CardTitle>
									<Row>
									{ localStorage.getItem('navTab') && activeTab &&	
										<Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_NORMAL, 'available_create')}
                                            color='primary' 
											style={{marginLeft: '-22%'}}
											tag={Link} 
											to={ROUTE_STANDARD_ADD} 
											state={{
												title: StandardtabNameList.find(item => activeTab in item)[activeTab],
												key: activeTab,
												API: StandardUrlObj[activeTab],
												type:'register'
											}}
											>등록</Button>
									}
									</Row>
								</CardHeader>
								<CardBody>
									<Row>
										<Col className='d-flex align-items-center mt-sm-0 mt-1' sm='6' style={{justifyContent: 'space-between'}}>
											<Col>
												<CardTitle tag='h6' style={{marginBottom: '1%'}}>{cookies.get('store').label}</CardTitle>
											</Col>
											<Col style={{display:'flex-end'}}>
												<Row>
													<Col md={2}/>
													<Col className='mb-1' md='4' sm='4'>
														{ activeTab === 'costCategory' &&
															<Select
																classNamePrefix={'select'}
																className="react-select"
																options={selectCostTypeList}
																value={selected}
																onChange={(e) => setSelected(e)}
															/>
														}
													</Col>
													{ activeTab &&
													<Col className='mb-1' md='6' sm='10'>
														<InputGroup>
															<Input 
																value={searchValue} 
																onChange={(e) => setSearchValue(e.target.value)}
																placeholder= {StandardtabNameList.find(item => activeTab in item)[activeTab]} 
																/>
															<Button
																onClick={() => SearchGetTableData(StandardUrlObj[activeTab], {property:cookies.get('store').value, search:searchValue, select_cost_type: ''}, setData)}>검색</Button>
														</InputGroup>
													</Col>
													}
												</Row>
											</Col>
										</Col>
									</Row>
									{ data && 
										<CustomDataTable
											columns={columns} 
											tableData={data} 
											setTabelData={setData} 
											setTableSelect={setTableSelect}
											selectType={false}
											onRowClicked
											detailAPI={StandadDetailUrlObj[activeTab]}
											noDataComponent
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

export default StandardInfoList