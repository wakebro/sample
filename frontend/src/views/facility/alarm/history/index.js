import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import NoData from '@src/components/NoData'
import { setProperty } from "@store/module/loginAuth"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import axios from "@utility/AxiosConfig"
import { getKorAmPmHHMMSS, pickerDateChange } from '@utils'
import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import ReactPaginate from 'react-paginate'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, Col, Input, InputGroup, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { ROUTE_FACILITYMGMT_ALARM } from '../../../../constants'
import { assetTypeKor, customStyles, historyIotStatus, historyStatus, historyStatusSelect, searchObjDefault, selectListAPI } from '../data'
import HistoryModal from './HistoryModal'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from '../../../../components/TotalLabel'

const noneValue = {label:'', value:''}

const getTableData = (API, param, setTableData, setTotalCount) => {
	axios.get(API, {
		params: param
	})
	.then(res => {
		setTableData(res.data.data)
		setTotalCount(res.data.total)
	})
	.catch(res => {
		console.error(API, res)
	})
}

const History = () => {
	useAxiosIntercepter()
	const { asset } = useParams()
	const cookies = new Cookies()
	const { state } = useLocation()
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const [totalCount, setTotalCount] = useState(1)
	const [isOpen, setIsOpen] = useState(false)
	const [dataList, setDataList] = useState([])
	const [row, setRow] = useState()
	const dispatch = useDispatch()

	const [searchObj, setSearchObj] = useState({
		pickr: pickerDateChange([moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]),
		code: '',
		status: {label:'전체', value:''},
		building: searchObjDefault.building,
		floor: searchObjDefault.floor,
		room: searchObjDefault.room,
		location: '',
		currentPage: 0
	})

	const { pickr, code, status, building, floor, room, location, currentPage } = searchObj

	const [list, setList] = useState({
		buildingList: [],
		floorList: [],
		roomList: []
	})
	const { buildingList, floorList, roomList } = list

	const selectParam = {
		building: {prop_id: cookies.get('property').value},
		floor: {building_id: building.value},
		room: {floor_id: floor.value}
	}

	const handlePagination = page => {
		setSearchObj({
			...searchObj,
			currentPage: page.selected
		})
	}

	function handleSearchObj (e, event) {
		switch (event.name) {
			case 'building':
				setSearchObj({
					...searchObj,
					[event.name]: e,
					floor: searchObjDefault.floor,
					room: searchObjDefault.room
				})
				setList({
					...list,
					floorList: [],
					roomList: []
				})
				break

			case 'floor':
				setSearchObj({
					...searchObj,
					[event.name]: e,
					room: searchObjDefault.room
				})
				setList({
					...list,
					roomList: []
				})
				break
		
			default:
				setSearchObj({
					...searchObj,
					[event.name]: e
				})
				break
		}
	}

	function workingDatetime(datetime) {
		return `${datetime.split('T')[0].replaceAll('-', '.')} ${getKorAmPmHHMMSS(datetime.split('T')[1])}`
	}

	function initSelectList (key) {
		axios.get(selectListAPI[key], {params: selectParam[key]})
		.then(res => {
			const tempList = []
			if (key !== 'building') tempList.push(searchObjDefault[key])
			res.data.map(data => tempList.push(data))
			setList({...list, [`${key}List`]: tempList})
		})
	}

	useEffect(() => {
		if (state !== null) {
			const handleBeforeUnload = (e) => {
				e.preventDefault()
				navigate(`${ROUTE_FACILITYMGMT_ALARM}/history/${asset}`)
				e.returnValue = '' // 이 줄은 필수는 아니지만 일부 브라우저에서 사용
			}
		
			window.addEventListener('beforeunload', handleBeforeUnload)
		
			return () => {
				window.removeEventListener('beforeunload', handleBeforeUnload)
			}
		}
	}, [])

	useEffect(() => {
		initSelectList('building')
	}, [])

	useEffect(() => {
		const historyParams = {}
		if (state) {
			historyParams['property'] = cookies.get('property').value
			historyParams['range'] = pickr
			historyParams['code'] = state.code
			historyParams['status'] = ''
			historyParams['building'] = state.building.id
			historyParams['floor'] = state.floor !== null ? state.floor.id : ''
			historyParams['room'] = state.room !== null ? state.room.id : ''
			historyParams['location'] = state.location
			historyParams['currentPage'] = currentPage + 1
			setSearchObj({
				...searchObj,
				code: state.code,
				building: {value: state.building.id, label:state.building.name},
				floor: state.floor !== null ? {value: state.floor.id, label:state.floor.name} : searchObjDefault.floor,
				room: state.room !== null ? {value: state.room.id, label:state.room.name} : searchObjDefault.room,
				location: state.location
			})
		} else {
			historyParams['property'] = cookies.get('property').value
			historyParams['range'] = pickr
			historyParams['code'] = code
			historyParams['status'] = status.value
			historyParams['building'] = building.value
			historyParams['floor'] = floor.value
			historyParams['room'] = room.value
			historyParams['location'] = location
			historyParams['currentPage'] = currentPage + 1
		}
		getTableData(selectListAPI[`${asset}_history`], historyParams, setDataList, setTotalCount)
	}, [currentPage])

	useEffect(() => {
		if (searchParams.size !== 0 && searchParams.get('id') !== null && parseInt(searchParams.get('id')) !== parseInt(cookies.get('property').value)) {
			const newProperty = {label:searchParams.get('property'), value:searchParams.get('id')}
			cookies.remove('property')
			dispatch(setProperty(newProperty))
			cookies.set('property', newProperty, {path:'/'})
			window.location.reload()
		}
		if (dataList.length !== 0 && searchParams.size !== 0  && searchParams.get('id') !== null) {
			const temp = dataList.filter(data => parseInt(data.id) === parseInt(searchParams.get(asset)))
			setRow(temp[0])
		}
	}, [dataList])

	useEffect(() => {
		if (building.value !== '' && buildingList.length !== 0) {
			initSelectList('floor')
		}
	}, [building, buildingList])

	useEffect(() => {
		if (floor.value !== '' && floorList.length !== 0) {
			initSelectList('room')
		}
	}, [floor, floorList])

	useEffect(() => {
		if (row) setIsOpen(true)
	}, [row])

	const columns = [
		{
			name:'일시',
			width: '240px',
			selector: row => workingDatetime(row.create_datetime)
		},
		{
			name:'코드',
			width: '130px',
			selector: row => row[`${asset}`].code
		},
		{
			name:'상태',
			width: '100px',
			selector: (row) => (asset === 'camera' ? historyStatus[row.status] : historyIotStatus[row.status])
		},
		{
			name:'위치',
			selector: row => row[`${asset}`].location
		},
		{
			name:'건물',
			width: '100px',
			selector: row => row[`${asset}`].building.name
		},
		{
			name:'층',
			width: '100px',
			selector: (row) => (row[`${asset}`].floor ? row[`${asset}`].floor.name : '')
		},
		{
			name:'실',
			width: '100px',
			selector: (row) => (row[`${asset}`].room ? row[`${asset}`].room.name : '')
		},
		{
			name:'사진보기',
			width: '100px',
			selector: row => { 
				return (
					<Fragment key={row.id}>
						<Row><Col xs={12} style={{display:'flex', justifyContent:'center'}}>
							<Button size='sm' color='primary' outline onClick={() => {
								console.log(row)
								setRow(row)
							}}>보기</Button>
						</Col></Row>
					</Fragment> 
				)
			}
		}
	]

	const CustomPagination = () => (
		<ReactPaginate
			nextLabel=''
			breakLabel='...'
			previousLabel=''
			pageRangeDisplayed={2}
			forcePage={currentPage}
			marginPagesDisplayed={1}
			activeClassName='active'
			pageClassName='page-item'
			breakClassName='page-item'
			nextLinkClassName='page-link'
			pageLinkClassName='page-link'
			breakLinkClassName='page-link'
			previousLinkClassName='page-link'
			nextClassName='page-item next-item'
			previousClassName='page-item prev-item'
			pageCount={Math.ceil(totalCount / 15) || 1}
			onPageChange={page => handlePagination(page)}
			// containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-start pe-1 mt-1'
			containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-center mt-1'
		/>
	)

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle={`${assetTypeKor[asset]} 히스토리`} breadCrumbParent='시설관리' breadCrumbParent2='경보관리' breadCrumbActive='히스토리'/>
				</div>
			</Row>
			<Card>
				<CardBody>
					<Row style={{marginBottom:'1%'}}>
						<Col xs={12}>
							<Row>
								<Col className='mb-1'md={4} xs={12}>
									<Row>
										<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>기간</Col>
										<Col xs={9}>
											<Flatpickr
												name='pickr'
												className='form-control'
												value={pickr}
												onChange={date => {
													if (date.length === 2) {
														const tempPickerList = pickerDateChange(date)
														const event = {name:'pickr'}
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
										</Col>
									</Row>
								</Col>
								<Col className='mb-1'md={4} xs={12}>
									<Row>
										<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>코드</Col>
										<Col xs={9}>
										<Input
											name='code'
											value={code}
											onChange={(e) => handleSearchObj(e.target.value, e.target)}
											/>
										</Col>
									</Row>
								</Col>
								<Col className='mb-1'md={4} xs={12}>
									<Row>
										<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>상태</Col>
										<Col xs={9}>
											<Select
												name='status'
												classNamePrefix={'select'}
												className="react-select"
												value={status}
												options={historyStatusSelect[asset]}
												onChange={handleSearchObj}/>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row>
								<Col className='mb-1'md={4} xs={12}>
									<Row>
										<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>건물</Col>
										<Col xs={9}>
											<Select
												name='building'
												classNamePrefix={'select'}
												className="react-select"
												value={building}
												options={buildingList}
												onChange={handleSearchObj}/>
										</Col>
									</Row>
								</Col>
								<Col className='mb-1' md={4} xs={12}>
									<Row>
										<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>층</Col>
										<Col xs={9}>
											<Select
												name='floor'
												classNamePrefix={'select'}
												className="react-select"
												isDisabled={floorList.length <= 0}
												value={floorList.length <= 0 ? noneValue : floor}
												options={floorList}
												onChange={handleSearchObj}/>
										</Col>
									</Row>
								</Col>
								<Col className='mb-1' md={4} xs={12}>
									<Row>
										<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>실</Col>
										<Col xs={9}>
											<Select
												name='room'
												classNamePrefix={'select'}
												className="react-select"
												isDisabled={roomList.length <= 1}
												value={roomList.length <= 1 ? noneValue : room}
												options={roomList}
												onChange={handleSearchObj}/>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row>
								<Col className='mb-1'xs={12}>
									<Row>
										<Col xs={1} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}></Col>
										<Col xs={11}>
											<InputGroup>
												<Input
													name='location'
													placeholder='위치를 검색해보세요.'
													onChange={(e) => handleSearchObj(e.target.value, e.target)}
													value={location}
													onKeyDown={e => {
														if (e.key === 'Enter') {
															const params = {
																property: cookies.get('property').value,
																range: pickr,
																code: code,
																status: status.value,
																building: building.value,
																floor: floor.value,
																room: room.value,
																location: location,
																currentPage: 1
															}
															setSearchObj({
																...searchObj,
																currentPage:0
															})
															getTableData(selectListAPI[`${asset}_history`], params, setDataList, setTotalCount)
														}
													}}/>
												<Button style={{zIndex:0}}
													onClick={() => {
														const params = {
															property: cookies.get('property').value,
															range: pickr,
															code: code,
															status: status.value,
															building: building.value,
															floor: floor.value,
															room: room.value,
															location: location,
															currentPage: 1
														}
														setSearchObj({
															...searchObj,
															currentPage:0
														})
														getTableData(selectListAPI[`${asset}_history`], params, setDataList, setTotalCount)
													}}
												>검색</Button>
											</InputGroup>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
					<TotalLabel 
						num={3}
						data={dataList.length}
					/>
					<div className='react-dataTable'>
						<DataTable
							noHeader
							pagination
							data={dataList}	
							columns={columns}
							className='react-dataTable'
							sortIcon={<ChevronDown size={10}/>}
							paginationPerPage={15}
							paginationComponent={CustomPagination}
							paginationDefaultPage={currentPage + 1}
							// paginationRowsPerPageOptions={[10, 25, 50, 100]}
							paginationRowsPerPageOptions={5}
							// onRowClicked={handleRowClick}
							customStyles={customStyles}
							noDataComponent={<NoData/>}
							persistTableHead
						/>
					</div>
				</CardBody>
			</Card>
			<HistoryModal
				type={asset}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				row={row}
				setRow={setRow}
				callback={workingDatetime}/>
		</Fragment>
	)
}

export default History