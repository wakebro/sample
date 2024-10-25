import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Row } from 'reactstrap'
import { ROUTE_SYSTEMMGMT_AUTH_GROUP_REGISTER } from '../../../../../constants'
import { checkOnlyView, getTableData } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { CustomDataTable, authAPIObj, authColumn } from '../../data'
import { useSelector } from 'react-redux'
import { SYSTEM_AUTH_GROUP } from '../../../../../constants/CodeList'
import TotalLabel from '../../../../../components/TotalLabel'

const AuthGroup = () => {
	useAxiosIntercepter()
	const loginAuth = useSelector((state) => state.loginAuth)
	const [data, setData] = useState([])
	const [columns, setColumns] = useState()
	const [tableSelect, setTableSelect] = useState([])

	useEffect(() => {
	}, [tableSelect])

	useEffect(() => {
		if (window.location.pathname !== localStorage.getItem('pathname')) {
			localStorage.clear()
			localStorage.setItem('pathname', window.location.pathname)
		}
		setColumns(authColumn.group)
		getTableData(authAPIObj['group'], {searchValue:''}, setData)
	}, [])

    useEffect(() => {
        if (data.length !== 0) console.log(data)
    }, [data])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='그룹권한관리' breadCrumbParent='시스템관리' breadCrumbParent2='권한관리' breadCrumbActive='그룹권한관리' />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle className='title'>그룹권한관리</CardTitle>
					<Button hidden={checkOnlyView(loginAuth, SYSTEM_AUTH_GROUP, 'available_create')}
						color='primary' tag={Link} 
						to={ROUTE_SYSTEMMGMT_AUTH_GROUP_REGISTER}
						state={{pageType:'register', key: 'group'}}>등록
					</Button>
				</CardHeader>
				<CardBody style={{paddingTop:'0'}}>
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
					/>
				</CardBody>
			</Card>
		</Fragment>
	)
}

export default AuthGroup