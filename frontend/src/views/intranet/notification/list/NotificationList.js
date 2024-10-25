import Breadcrumbs from '@components/breadcrumbs'
import * as moment from 'moment'
import Cookies from 'universal-cookie'
import { Fragment, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Flatpickr from 'react-flatpickr'
import { Send } from 'react-feather'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, InputGroup } from "reactstrap"
import {ROUTE_INTRANET_NOTIFICATION_FORM, API_INTRANET_NOTIFICATION} from "../../../../constants"
import TenantCustomDataTable from '../../../basic/area/tenant/list/TenantCustomTable'
import {NotificationColumn, resultSelectList} from '../NotificationData'
import NotificationDetailModal from './DetailModal'
import { pickerDateChange, getObjectKeyCheck, checkOnlyView, getTableData } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useSelector } from 'react-redux'
import { INTRANET_NOTIFICATION } from '../../../../constants/CodeList'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from '../../../../components/TotalLabel'

const NotificationList = () => {
	useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
	const cookies = new Cookies()
	const [searchParams] = useSearchParams()
	const now = moment().subtract(0, 'days')
	const yesterday = moment().subtract(7, 'days')
	const [selected, setSelected] = useState(resultSelectList[0])
	const [data, setData] = useState([])
	const [searchValue, setSearchValue] = useState('')
	const [picker, setPicker] = useState([yesterday.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')])

	const [isOpen, setIsOpen] = useState(false)
	const [rowId, setRowId] = useState()

	useEffect(() => {
		setData([])
		getTableData(API_INTRANET_NOTIFICATION, {userId: cookies.get('userId'), date: pickerDateChange(picker), type: selected.value, search: searchValue}, setData)
	}, [])

	useEffect(() => {
		if (searchParams.size !== 0 && searchParams.get('id') !== null) {
			setRowId(searchParams.get('id'))
			setIsOpen(true)
		}
	}, [searchParams])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='알림함' breadCrumbParent='인트라넷' breadCrumbActive='알림함' />
				</div>
			</Row>
			<Card>
				<CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
					<CardTitle className="title">
						알림함
					</CardTitle>
					<Row>
						<Button color='primary' 
                            hidden={checkOnlyView(loginAuth, INTRANET_NOTIFICATION, 'available_create')}
							style={{marginLeft: '-22%'}}
							tag={Link} 
							to={ROUTE_INTRANET_NOTIFICATION_FORM} 
							><Send style={{width:'14px', height:'14px'}}/> 알림 발송</Button>
					</Row>
				</CardHeader>
				<CardBody>
					<Row>
						<Col md={8}>
							<Row>
								<Col className='mb-1'md={3} xs={12}>
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
										<Col md='3' className='d-flex align-items-center justify-content-center' style={{paddingRight: 0 }}>구분</Col>
										<Col style={{ paddingLeft: '1%' }}>
											<Select
												classNamePrefix={'select'}
												className="react-select"
												options={resultSelectList}
												value={selected}
												onChange={(e) => setSelected(e)}
											/>
										</Col>
									</div>
								</Col>
								<Col className='mb-1'md={5} xs={12}>
									<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
										<Col md='2' className='d-flex align-items-center justify-content-center'>기간</Col>
										<Col style={{ paddingLeft: '1%' }}>
											<Flatpickr
												value={picker}
												id='range-picker'
												className='form-control'
												onChange={date => { if (date.length === 2) setPicker(date) } }
												options={{
												mode: 'range',
												ariaDateFormat:'Y-m-d',
												locale: {
													rangeSeparator: ' ~ '
												},
												locale: Korean
												}}
											/>
										</Col>
									</div>
								</Col>
								<Col className='mb-1'md={4} xs={12}>
									<InputGroup>
										<Input 
											value={searchValue} 
											onChange={(e) => setSearchValue(e.target.value)}
											onKeyDown={e => {
												if (e.key === 'Enter') {
													getTableData(API_INTRANET_NOTIFICATION, {userId: cookies.get('userId'), date: pickerDateChange(picker), search: searchValue, type: getObjectKeyCheck(selected, 'value')}, setData)
												}
											}}
											placeholder='알림 제목으로 검색해주세요.'
											maxLength={250}
											/>
										<Button
											style={{zIndex:0}}
											onClick={() => {
												setData([])
												getTableData(API_INTRANET_NOTIFICATION, {userId: cookies.get('userId'), date: pickerDateChange(picker), search: searchValue, type: getObjectKeyCheck(selected, 'value')}, setData)
												}}
										>검색</Button>
									</InputGroup>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row>
						<TotalLabel 
							num={3}
							data={data.length}
						/>
					</Row>
					<TenantCustomDataTable 
						columns={NotificationColumn} 
						tableData={data}
						selectType={false} 
						onRowClicked
						setRowId={setRowId}
						setIsOpen={setIsOpen}
						noDataComponent
					/>
					<NotificationDetailModal 
						formModal={isOpen} 
						setFormModal={setIsOpen}
						rowId={rowId}
						cookies={cookies}
					/>
				</CardBody>
			</Card>
		</Fragment>
	)
}
export default NotificationList