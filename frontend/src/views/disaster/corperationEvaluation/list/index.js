/* eslint-disable */
import * as moment from 'moment'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, Row, Button, CardBody, Col, InputGroup, InputGroupText, Input } from "reactstrap"
import { Calendar } from 'react-feather'
import { useNavigate } from 'react-router-dom'

import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { ROUTE_CRITICAL_CORPERATION_EVALUATION_FORM, API_CRITICAL_CORPERATION_EVALUATION_LIST, ROUTE_CRITICAL_CORPERATION_EVALUATION_DETAIL } from '../../../../constants'
import { pickerDateChange } from '@utils'
import CustomDataTable from '@views/system/basic/company/list/CustomDataTable'
import { cooperatorColumns } from '../data'
import { customStyles } from '../../riskReport/evaluationReport/web/data'
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { checkOnlyView, getTableData } from '../../../../utility/Utils'
import Cookies from 'universal-cookie'
import { useSelector } from 'react-redux'
import { CRITICAL_CORPERATION } from '../../../../constants/CodeList'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from '../../../../components/TotalLabel'

const DisasterCorperationEvaluation = () => {
	useAxiosIntercepter()
	const navigator = useNavigate()
	const loginAuth = useSelector((state) => state.loginAuth)
	const cookies = new Cookies
	const [searchObj, setSearchObj] = useState({
		picker: pickerDateChange([moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]),
		search: ''
	})
	const { picker, search } = searchObj

	const [data, setData] = useState([])

	function handleSearchObj (e, event) {
		setSearchObj({
			...searchObj,
			[event.name]: e
		})
	}

	useEffect(() => {
		getTableData(API_CRITICAL_CORPERATION_EVALUATION_LIST, {propertyId: cookies.get('property').value, search: search, picker: picker}, setData)
	}, [])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='협력업체평가' breadCrumbParent='중대재해관리' breadCrumbActive='협력업체평가'/>
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle>협력업체평가</CardTitle>
					<Button hidden={checkOnlyView(loginAuth, CRITICAL_CORPERATION, 'available_create')}
						color='primary' onClick={() => navigator(ROUTE_CRITICAL_CORPERATION_EVALUATION_FORM, {state: {pageType:'register'}})}>등록</Button>
				</CardHeader>
				<CardBody>
					<Row>
						<Col xs={12}>
							<Row>
								<Col className='mb-1'md={4} xs={12}>
									<Row>
										<Col xs={2} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>기간</Col>
										<Col xs={10}>
											<InputGroup>
												<Flatpickr
													name='pickr'
													className='form-control'
													value={picker}
													onChange={date => {
														if (date.length === 2) {
															const tempPickerList = pickerDateChange(date)
															const event = {name:'picker'}
															handleSearchObj(tempPickerList, event)
														}
													}}
													options={{
														mode: 'range',
														ariaDateFormat:'Y-m-d',
														locale: {
															rangeSeparator: ' ~ '
														},
														locale: Korean
													}}/>
												<InputGroupText>
													<Calendar color='#B9B9C3'/>
												</InputGroupText>
											</InputGroup>
										</Col>
									</Row>
								</Col>
								<Col className='mb-1'md={4} xs={12}>
									<InputGroup>
										<Input
											name='search'
											placeholder='업체명을 입력하세요.'
											maxLength={148}
											onChange={(e) => handleSearchObj(e.target.value, e.target)}
											value={search}
											onKeyDown={e => {
												if (e.key === 'Enter') {
													getTableData(API_CRITICAL_CORPERATION_EVALUATION_LIST, {propertyId: cookies.get('property').value, search: search, picker: picker}, setData)
												}
											}}
											/>
										<Button style={{zIndex:0}}
											onClick={() => {
												getTableData(API_CRITICAL_CORPERATION_EVALUATION_LIST, {propertyId: cookies.get('property').value, search: search, picker: picker}, setData)
												console.log('1')
											}}>검색</Button>
									</InputGroup>
								</Col>
							</Row>
						</Col>
					</Row>
					<TotalLabel 
						num={3}
						data={data.length}
					/>
					<CustomDataTable 
						columns={cooperatorColumns}
						tableData={data}
						selectType={false}
						styles={customStyles}
						detailAPI = {ROUTE_CRITICAL_CORPERATION_EVALUATION_DETAIL}
					/>
				</CardBody>
			</Card>
		</Fragment>
	)
}

export default DisasterCorperationEvaluation
