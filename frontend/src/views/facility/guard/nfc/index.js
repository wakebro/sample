import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setBuildingList, setDataList, setFloorList, setId, setModalIsOpen, setModalPageType, setRoomList } from '@store/module/nfc'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { axiosDeleteRedux, getTableDataRedux, pickerDateChange } from '@utils'
import CustomDataTable from '@views/system/basic/company/list/CustomDataTable'
import * as moment from 'moment'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_FACILITY_GUARD_NFC } from '../../../../constants'
import { defaultValues, validationSchemaObj } from '../data'
import AddNFCModal from './AddNFCModal'
import { checkOnlyView } from '../../../../utility/Utils'
import { FACILITY_NFC_MGMT } from '../../../../constants/CodeList'
import TotalLabel from '../../../../components/TotalLabel'

const NFCIndex = () => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const dispatch = useDispatch()
	const first = moment().startOf('month')
	const last = moment().endOf('month')
	const [picker, setPicker] = useState([])
	const [searchValue, setSearchValue] = useState('')
	const nfcRedux = useSelector((state) => state.nfc)
    const loginAuth = useSelector((state) => state.loginAuth)

	const handleModal = () => {
		dispatch(setModalPageType('register'))
		dispatch(setModalIsOpen(true))
	}

	const getDatas = () => {
		const params = {
			property: cookies.get('property').value,
			searchValue: ''
		}
		getTableDataRedux(API_FACILITY_GUARD_NFC, params, dispatch, setDataList)
	}

	const reset = () => {
		dispatch(setId(null))
		dispatch(setDataList([]))
		dispatch(setBuildingList([]))
		dispatch(setFloorList([]))
		dispatch(setRoomList([]))
		dispatch(setModalPageType(''))
		getDatas()
	}

	const handelDelete = (id) => axiosDeleteRedux('NFC', `${API_FACILITY_GUARD_NFC}/${id}`, reset, null, null)

	useEffect(() => {
		setPicker(pickerDateChange([first.format('YYYY-MM-DD'), last.format('YYYY-MM-DD')]))
	}, [])

	useEffect(() => {
		if (picker.length !== 0) getDatas()
	}, [picker])

	useEffect(() => {
		if (nfcRedux.modalIsOpen === false) reset()
	}, [nfcRedux.modalIsOpen])

	const columns = [
		{
			name:'Code',
			width: '140px',
			selector: row => row.code
		},
		{
			name:'장소',
			selector: row => row.location
		},
		{
			name:'건물',
			selector: row => row.building.name
		},
		{
			name:'층',
			width: '140px',
			selector: (row) => (row.floor ? row.floor.name : '')
		},
		{
			name:'실',
			width: '140px',
			selector: (row) => (row.room ? row.room.name : '')
		},
		{
			name:'편집',
			width: '160px',
			selector: row => { 
				return (
					<Fragment key={row.id}>
						<Row><Col xs={12}>
							<Button hidden={checkOnlyView(loginAuth, FACILITY_NFC_MGMT, 'available_update')}
                                size='sm' color='primary' outline onClick={() => dispatch(setId(row.id))}>수정</Button>
							&nbsp;
							<Button hidden={checkOnlyView(loginAuth, FACILITY_NFC_MGMT, 'available_delete')}
                                size='sm' outline onClick={() => handelDelete(row.id)}>삭제</Button>
						</Col></Row>
					</Fragment> 
				)
			}
		}
	]
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='NFC관리' breadCrumbParent='시설관리' breadCrumbParent2='경비업무' breadCrumbActive='NFC관리' />
				</div>
			</Row>
			<Card>
				<CardHeader>
					<CardTitle>{'NFC관리'}</CardTitle>
					<Button hidden={checkOnlyView(loginAuth, FACILITY_NFC_MGMT, 'available_create')}
                        color='primary' onClick={() => handleModal()}>등록</Button>
				</CardHeader>
				<CardBody style={{paddingTop:'0'}}>
					<Row>
						<Col lg={8} md={12} sm={12} xs={12}>
							<Row>
								<Col className='mb-1'md={6} xs={12}>
									<Row>
										<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>장소</Col>
										<Col xs={9}>
											<InputGroup>
												<Input
													value={searchValue}
													onChange={(e) => setSearchValue(e.target.value)}
													onKeyDown={e => {
														if (e.key === 'Enter') {
															getTableDataRedux(API_FACILITY_GUARD_NFC, {
																property: cookies.get('property').value,
																searchValue: searchValue
															}, dispatch, setDataList)
														}
													}}
													placeholder='장소를 검색해보세요.'
												/>
												<Button 
													onClick={() => {
														getTableDataRedux(API_FACILITY_GUARD_NFC, {
															property: cookies.get('property').value,
															searchValue: searchValue
														}, dispatch, setDataList)
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
						data={nfcRedux.dataList.length}
					/>
					<CustomDataTable
						columns={columns}
						tableData={nfcRedux.dataList}
						selectType={false}
					/>
				</CardBody>
			</Card>
			<AddNFCModal
				modalTitle={'NFC'}
				redux={nfcRedux}
				isOpen={setModalIsOpen}
				modalType={setModalPageType}
				defaultValues={JSON.parse(JSON.stringify(defaultValues.guard))}
				resolver={validationSchemaObj.guard}
				setBuildingList={setBuildingList}
				setFloorList={setFloorList}
				setRoomList={setRoomList}
			/>
		</Fragment>
	)
}

export default NFCIndex