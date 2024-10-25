import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setBuilding, setBuildings, setDetailBackUp, setFloor, setFloors, setPageType, setRooms, setId, setSubmitResult } from '@store/module/basicRoom'
import { getTableDataRedux, selectListType } from '@utils'
import RoomCustomDataTable from '../room/RoomTable'
import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_SPACE_BUILDING, API_SPACE_FLOOR, API_SPACE_ROOM, ROUTE_BASICINFO_AREA_ROOM, ROUTE_BASICINFO_AREA_ROOM_REGISTER, ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD } from '../../../../constants'
import { columns } from '../data'
import CustomHelpCircle from '../../../apps/CustomHelpCircle'
import { sweetAlert } from '../../../../utility/Utils'
import TotalLabel from '../../../../components/TotalLabel'

const keyObj = {
	buildingsAPI: API_SPACE_BUILDING,
	buildings: setBuildings,
	building: setBuilding,
	floorsAPI: API_SPACE_FLOOR,
	floors: setFloors,
	floor: setFloor,
	roomsAPI: API_SPACE_ROOM,
	rooms: setRooms
}

const defaultValue = {label:'전체', value:''}

const RoomIndex = () => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const basicRoom = useSelector((state) => state.basicRoom)
	const dispatch = useDispatch()
	const [searchValue, setSearchValue] = useState('')
	const navigate = useNavigate()

	const reset = () => {
		dispatch(setBuildings([]))
		dispatch(setBuilding(defaultValue))
		dispatch(setFloors([]))
		dispatch(setFloor(defaultValue))
		dispatch(setRooms([]))
		dispatch(setPageType(''))
		dispatch(setDetailBackUp(null))
		dispatch(setId(null))
		dispatch(setSubmitResult(false))
	}

	const handleSelectValidation = (e, event) => {
		if (event.name === 'building') {
			dispatch(setFloors([]))
			dispatch(setFloor(defaultValue))
		}
		dispatch(keyObj[event.name](e))
	}

	const handleSearchWord = (e) => {
		const value = e.target.value
		setSearchValue(value)
	}

	// 등록 버튼 클릭 이벤트 처리
	const handleRegisterClickBtn = () => {
		if (!basicRoom.buildings || basicRoom.buildings.length <= 1) {
			sweetAlert('', '등록된 건물이 없습니다.<br/> 건물을 먼저 등록해주세요.', 'warning', 'center')
			// navigate(ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD, {state: {pageType:'register', key: 'building'}})
			return
		}
		// 아직은 지우지 말아주세요 bill
		// if (!basicRoom.floors || basicRoom.floors.length <= 0) {
		// 	sweetAlert('', '등록된 층정보가 없습니다.<br/> 층정보를 먼저 등록해주세요.', 'warning', 'center')
		// 	// navigate(ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD, {state: {pageType:'register', key: 'floor'}})
		// 	return
		// }
		navigate(ROUTE_BASICINFO_AREA_ROOM_REGISTER, {state: {pageType:'register'}})
	}

	const getSelectList = (key, params) => {
		axios.get(keyObj[`${key}sAPI`], {params:params})
		.then(res => {
			const tempList = [{label: '건물전체', value:''}]
			res.data.map(row => tempList.push(selectListType('custom1', row, ['code', 'name'], 'id')))
			dispatch(keyObj[`${key}s`](tempList))
			dispatch(keyObj[`${key}`](tempList[0]))
		})
	}

	useEffect(() => {
		reset()
	}, [])

	useEffect(() => {
		const params = {
			property: cookies.get('property').value,
			building: '',
			floor: '',
			description: ''
		}
		getTableDataRedux(keyObj.roomsAPI, params, dispatch, keyObj.rooms)
	}, [])
	
	useEffect(() => {
		if (basicRoom.buildings.length === 0) {
			const params = {property :  cookies.get('property').value}
			getSelectList('building', params)
		}
	}, [basicRoom.buildings])

	useEffect(() => {
		if (basicRoom.building.value !== '') {
			const params = {
				property: cookies.get('property').value,
				building: basicRoom.building.value
			}
			getSelectList('floor', params)
		}
	}, [basicRoom.building])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='실정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='실정보' />
				</div>
			</Row>
			<Row>
				<Col>
					<Card>
						<CardHeader>
							<CardTitle>
								실정보
								<CustomHelpCircle
									id={'roomHelp'}
									content={'실정보는 건물과 층정보를 먼저 등록 해야합니다.'}
								/>
							</CardTitle>
							<Button color='primary'
								onClick={handleRegisterClickBtn}
								>등록</Button>
						</CardHeader>
						<CardBody style={{paddingTop:'0'}}>
							<Row>
								<Col lg={10} md={12} sm={12} xs={12}>
									<Row>
										<Col className='mb-1'md={3} xs={12}>
											<Row>
												<Col xs={3}className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }} htmlFor='jobSelect'>건물</Col>
												<Col xs={9}>
												<Select
													name='building'
													classNamePrefix={'select'}
													className="react-select"
													options={basicRoom.buildings}
													value={basicRoom.building}
													onChange={ handleSelectValidation }
												/>
												</Col>
											</Row>
										</Col>
										<Col className='mb-1'md={3} xs={12}>
											<Row>
												<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>층</Col>
												<Col xs={9}>
												<Select
													name='floor'
													classNamePrefix={'select'}
													className="react-select"
													options={basicRoom.floors}
													value={basicRoom.floor}
													onChange={ handleSelectValidation }
												/>
												</Col>
											</Row>
										</Col>

										<Col className='mb-1'md={4} xs={12}>
											<Row>
												<Col>
													<InputGroup>
														<Input
															value={searchValue}
															onChange={handleSearchWord}
															placeholder='실번호, 이름, 입주사를 입력해주세요.'
															onKeyDown={e => {
																if (e.key === 'Enter') {
																	getTableDataRedux(keyObj.roomsAPI, {
																		property: cookies.get('property').value,
																		building: basicRoom.building.value,
																		floor: basicRoom.floor.value,
																		description: searchValue
																	}, dispatch, keyObj.rooms)
																}
															}}
														/>
														<Button 
															style={{zIndex:0}}
															onClick={() => {
																getTableDataRedux(keyObj.roomsAPI, {
																	property: cookies.get('property').value,
																	building: basicRoom.building.value,
																	floor: basicRoom.floor.value,
																	description: searchValue
																}, dispatch, keyObj.rooms)
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
								data={basicRoom.rooms.length}
							/>
							<RoomCustomDataTable
								columns={columns.room}
								tableData={basicRoom.rooms} 
								selectType={false}
								detailAPI={ROUTE_BASICINFO_AREA_ROOM}
							/>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
}

export default RoomIndex