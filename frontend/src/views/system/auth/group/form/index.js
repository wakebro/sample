import Breadcrumbs from '@components/breadcrumbs'

import { Fragment, useEffect, useState } from "react"

import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router'
import { Card, CardHeader, CardTitle, Row } from 'reactstrap'
import { changePageType, changeTitle, setDetailRow, setKey } from '../../../../../redux/module/authGroup'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { authLabelObj } from '../../data'
import { Group } from './Group'

const AuthGroup = () => {
	useAxiosIntercepter()
	const dispatch = useDispatch()
	const { state } = useLocation()
	const [detailRow] = useState(useParams().id)
	const authGroup = useSelector((state) => state.authGroup)

	useEffect(() => {
		dispatch(setKey(state.key))
		dispatch(changePageType(state.pageType))
		dispatch(changeTitle(authLabelObj[state.key]))
		dispatch(setDetailRow(detailRow))
	}, [])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='그룹권한관리' breadCrumbParent='시스템관리' breadCrumbParent2='권한관리' breadCrumbActive='그룹권한관리' />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle>
						{authGroup.title}
					</CardTitle>
				</CardHeader>
				{
					(authGroup[Object.keys(authGroup)[0]] !== '' && Object.keys(authGroup)[0] !== undefined) && <Group/>
				}
			</Card>
		</Fragment>
	)
}

export default AuthGroup