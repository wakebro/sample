import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { Col, Row } from 'reactstrap'
import EmployeeDetail from './EmployeeDetail'
import EmployeeLicense from './EmployeeLicense'
import EmployeeTable from './EmployeeTable'
// import DrawingTabContent from "./DrawingTabContent"
// import axios from "../../../../utility/AxiosConfig"
import Tab from "./Tab"

// import {  } from "react-router-dom"
const emplyeeInfoIndex = () => {
	const [userId, setUserId] = useState(0)
	const [userName, setUserName] = useState("")
	const [reset, setReset] = useState(false)
	const [active, setActive] = useState('info')

	useEffect(() => {
		if (window.location.pathname !== localStorage.getItem('pathname')) {
			localStorage.clear()
			localStorage.setItem('pathname', window.location.pathname)
			localStorage.setItem('navTab', 'info')
			localStorage.setItem('clickId', 0)
			setActive('info')
			setUserId(0)
		} else {
			setActive(localStorage.getItem('navTab'))
			// setUserId(localStorage.getItem('clickId'))
		}
	}, [])
	useEffect(() => {
		if (active !== undefined) {
			if (active !== localStorage.getItem('navTab')) {
				localStorage.setItem('navTab', active)
			}
		}
	}, [active])
	useEffect(() => {
		if (userId !== undefined) {
			if (userId !== localStorage.getItem('clickId')) {
				localStorage.setItem('clickId', userId)
			}
		}
	}, [userId])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='직원정보' breadCrumbParent='기본정보' breadCrumbParent2='직원정보관리' breadCrumbActive='직원정보' />
				</div>
			</Row>
			<Row style={{height : '100%'}}>
				<Col md='6'>
					<EmployeeTable userId={userId}  setUserId ={setUserId} setUserName={setUserName} reset ={reset}/>
				</Col>
				<Col md='6'>
					<Tab md='5' id={userId} active={active} setActive ={setActive}></Tab>
					{active === 'info' ?
						<EmployeeDetail userId={userId} setReset={setReset} reset={reset}/>
					:
						<EmployeeLicense userId={userId} setReset={setReset} reset={reset} userName={userName}/>
					}
				</Col>
			</Row>
		</Fragment>
	)
}
export default emplyeeInfoIndex