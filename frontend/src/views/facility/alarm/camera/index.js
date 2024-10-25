import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import NoData from '@src/components/NoData'
import { setBuildingList, setContactList, setDataList, setFloorList, setId, setLoad, setManagerList, setModalIsOpen, setModalPageType, setRoomList } from '@store/module/camera'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import axios from "@utility/AxiosConfig"

import React, { Fragment, useEffect, useState } from 'react'
import { useInView } from "react-intersection-observer"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import Cookies from 'universal-cookie'

import { API_FACILITY_ALARM_CAMERA, API_FACILITY_ALARM_IOT } from '../../../../constants'
import { FACILITY_CAMERA } from '../../../../constants/CodeList'
import { checkOnlyView, gotoErrPage } from '../../../../utility/Utils'
import { assetTypeKor, defaultValues, selectListAPI, validationSchemaObj } from '../data'
import AddCameraModal from './AddCameraModal'
import CameraList from './CameraList'

const defaultValue = {label:'전체', value:''}
const noneValue = {label:'', value:''}

const CameraIndex = () => {
	useAxiosIntercepter()
	const { asset } = useParams()
	const cookies = new Cookies()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const cameraRedux = useSelector((state) => state.camera)
	const loginAuth = useSelector((state) => state.loginAuth)

	const [page, setPage] = useState()
	const [total, setTotal] = useState()
	const [ref, inView] = useInView()
	
	const [searchObj, setSearchObj] = useState({
		building: {label:'전체', value:''},
		floor: {label:'전체', value:''},
		room: {label:'전체', value:''},
		searchValue: ''
	})

	const [list, setList] = useState({
		buildingList: [],
		floorList: [],
		roomList: []
	})
	const { building, floor, room, searchValue } = searchObj
	const { buildingList, floorList, roomList } = list

	const selectParam = {
		building: {prop_id: cookies.get('property').value},
		floor: {building_id: building.value},
		room: {floor_id: floor.value}
	}

	function handleModal () {
		dispatch(setModalPageType('register'))
		dispatch(setModalIsOpen(true))
	}

	function initSelectList (key) {
		axios.get(selectListAPI[key], {params: selectParam[key]})
		.then(res => {
			const tempList = []
			res.data.map((data, idx) => {
				if (key === 'building' && idx === 0) data.label = '전체'
				if (key !== 'building' && idx === 0) tempList.push({label:'전체', value:''})
				tempList.push(data)
			})
			setList({
					...list,
					[`${key}List`]: tempList
			})
		})
	}

	function getDatas (params) {
		dispatch(setLoad(true))
		const API = asset === 'camera' ? API_FACILITY_ALARM_CAMERA : API_FACILITY_ALARM_IOT
		axios.get(API, {
			params: params
		})
		.then(res => {
			setTotal(res.data.total)
			dispatch(setDataList(res.data.data))
			dispatch(setLoad(false))
		})
		.catch(res => {
			console.error(API, res)
		})
	}

	// 서버에서 아이템을 가지고 오는 함수
	const getItems = () => {
		if (total <= cameraRedux.dataList.length) {
			return false
		} else {
			const API = asset === 'camera' ? API_FACILITY_ALARM_CAMERA : API_FACILITY_ALARM_IOT
			axios.get(API, {
				params: {
					property: cookies.get('property').value,
					building: building.value,
					floor: floor.value,
					room: room.value,
					searchValue: searchValue,
					page: page
				}
			}).then((res) => {
				setTotal(res.data.total)
				const temp = []
				cameraRedux.dataList.map(item => temp.push(item))
				res.data.data.map(data => temp.push(data))
				dispatch(setDataList(temp))
				dispatch(setLoad(false))
			})
		}
	}

	function reset () {
		dispatch(setId(null))
		dispatch(setDataList([]))
		dispatch(setBuildingList([]))
		dispatch(setFloorList([]))
		dispatch(setRoomList([]))
		dispatch(setModalPageType(''))
		getDatas({
			property: cookies.get('property').value,
			building: '',
			floor: '',
			room: '',
			searchValue: '',
			page: 1
		})
	}

	function handleSearchObj (e, event) {
		switch (event.name) {
			case 'building':
				setSearchObj({
					...searchObj,
					[event.name]: e,
					floor: defaultValue,
					room: defaultValue
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
					room: defaultValue
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

	/** 사용자가 마지막 요소를 봄*/
	const checkInView = async () => {
		if (cameraRedux.dataList.length >= total) return false
		else setPage(page !== undefined ? (prevState => prevState + 1) : 1)
	}

	useEffect(() => {
		if (asset !== 'camera' && asset !== 'iot') gotoErrPage(navigate)
		dispatch(setDataList([]))
		initSelectList('building')
	}, [])

	useEffect(() => {
		if (inView) checkInView()
	}, [inView])

	useEffect(() => {
		if (page) getItems()
	}, [page])

	useEffect(() => {
		if (cameraRedux.modalIsOpen === false) reset()
	}, [cameraRedux.modalIsOpen])

	useEffect(() => {
		if (building.value !== '') initSelectList('floor')
	}, [building])

	useEffect(() => {
		if (floor.value !== '') initSelectList('room')
	}, [floor])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle={`${assetTypeKor[asset]} 관리`} breadCrumbParent='시설관리' breadCrumbParent2='경보관리' breadCrumbActive={`${assetTypeKor[asset]} 관리`} />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle>{assetTypeKor[asset]} 관리</CardTitle>
					<Button hidden={checkOnlyView(loginAuth, FACILITY_CAMERA, 'available_create')}
						color='primary' onClick={() => handleModal()}>등록</Button>
				</CardHeader>
				<CardBody style={{paddingTop:'0'}}>
					<Row style={{marginBottom:'1%'}}>
						<Col xs={12}>
							<Row>
								<Col className='mb-1'md={3} xs={12}>
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
								<Col className='mb-1'md={3} xs={12}>
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
								<Col className='mb-1'md={3} xs={12}>
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
								<Col className='mb-1'lg={9} xs={12}>
									<Row>
										<Col xs={12} className="d-flex align-items-center justify-content-center">
											<InputGroup>
												<Input
													name='searchValue'
													placeholder='위치를 검색해보세요.'
													onChange={(e) => handleSearchObj(e.target.value, e.target)}
													onKeyDown={e => {
														if (e.key === 'Enter') {
															getDatas({
																property: cookies.get('property').value,
																building: building.value,
																floor: floor.value,
																room: room.value,
																searchValue: searchValue,
																page: 1
															})
														}
													}}
													/>
												<Button 
													style={{zIndex:0}}
													onClick={() => {
														getDatas({
															property: cookies.get('property').value,
															building: building.value,
															floor: floor.value,
															room: room.value,
															searchValue: searchValue,
															page: 1
														})
													}}
												>검색</Button>
											</InputGroup>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
				</CardBody>
				</Card>
					{
						page === undefined ? <div ref={ref}/>
						:
						cameraRedux.dataList.length !== 0 && !checkOnlyView(loginAuth, FACILITY_CAMERA, 'available_read') ? <CameraList type={asset} reset={reset} ref={ref} total={total}/>
						: 
						<Card>
							<CardBody>
								<Row><Col style={{display:'flex', justifyContent:'center'}}><NoData/></Col></Row>
							</CardBody>
						</Card>
					}
			{
				(asset !== undefined && asset !== 'undefined') ?
				<AddCameraModal
					type={asset}
					modalTitle={`${assetTypeKor[asset]} 등록`}
					redux={cameraRedux}
					isOpen={setModalIsOpen}
					modalType={setModalPageType}
					defaultValues={JSON.parse(JSON.stringify(defaultValues))}
					resolver={validationSchemaObj}
					setBuildingList={setBuildingList}
					setFloorList={setFloorList}
					setRoomList={setRoomList}
					setContactList={setContactList}
					setManagerList={setManagerList}
				/>
				: ''
			}
		</Fragment>
	)
}

export default CameraIndex