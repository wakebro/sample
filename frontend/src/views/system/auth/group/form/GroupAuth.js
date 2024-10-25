import Breadcrumbs from '@components/breadcrumbs'
import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { useLocation, useParams } from 'react-router'
import { Card, CardBody, CardHeader, CardTitle, Col, Row, TabContent, TabPane } from "reactstrap"
import { API_SYSTEMMGMT_AUTH_MENU } from '../../../../../constants'
import { makeSelectList } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import CustomDataTable from '../../../basic/company/list/CustomDataTable'
import NavTab from '../../../basic/company/list/NavTab'
import { authColumn } from '../../data'


const Common = () => {
	useAxiosIntercepter()
	const { state } = useLocation()
	const [detailRow] = useState(useParams().id)
	const [navActive, setNavActive] = useState()
	const [data, setData] = useState([])
	const [columns] = useState(authColumn.menu)
	const [tableSelect, setTableSelect] = useState([])
	const [authMenuTabList, setAuthMenuTabList] = useState([])

	const getMainMenu = () => {
		axios.get(API_SYSTEMMGMT_AUTH_MENU, {})
		.then(res => {
			makeSelectList(true, '', res.data, authMenuTabList, setAuthMenuTabList, ['name'], 'code')
		})
	}

	useEffect(() => {
		console.log(state)
		console.log(detailRow)
		getMainMenu()
	}, [])

	useEffect(() => {
	}, [tableSelect])

	useEffect(() => {
		if (authMenuTabList.length !== 0) {
			setNavActive(authMenuTabList[7].value)
		}
	}, [authMenuTabList])

	useEffect(() => {
		if (navActive !== undefined) {
			axios.get(`${API_SYSTEMMGMT_AUTH_MENU}/${navActive.substr(0, 2)}`, {})
            .then(res => console.log(res.data))
		}
	}, [navActive])
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='그룹권한관리' breadCrumbParent='시스템관리' breadCrumbParent2='권한관리' breadCrumbActive='그룹권한관리' />
				</div>
			</Row>
			<Row>
				<Col md={12}>
					<NavTab tabList={authMenuTabList} active={navActive} setActive={setNavActive}/>
				</Col>
			</Row>
			<TabContent activeTab={navActive}>
				{
					authMenuTabList !== undefined && authMenuTabList.map((tab, idx) => {
						return (
							<TabPane tabId={tab.value} key={idx}>
								<Card>
									<CardHeader>
										<CardTitle className="title">{tab.label}</CardTitle>
									</CardHeader>
									<CardBody>
										{
											data &&
											<CustomDataTable
												columns={columns} 
												tableData={data} 
												setTabelData={setData} 
												setTableSelect={setTableSelect}
												selectType={false}
												// detailAPI={'/aaa'}
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

export default Common