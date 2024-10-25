import { API_BASICINFO_FACILITY_LOG } from '@src/constants'
import { pickerDateChange, sweetAlert } from '@utils'
import axios from 'axios'
import { Fragment, forwardRef, useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, TabContent, TabPane } from "reactstrap"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import NoData from '@src/components/NoData'
import { useAxiosIntercepter } from '@utility/hooks/useAxiosInterceptor'
import * as moment from 'moment'
import DataTable from "react-data-table-component"
import Flatpickr from "react-flatpickr"
import { useDispatch, useSelector } from 'react-redux'
import NavTab from '../ToolEquipment/NavTab'
import { BasicInfoAPIObj, BasicInfoTabList, basicInfoColumn, customStyles, nameReduxObj } from '../data'
import AddLogModal from './AddLogModal'
import AddMaterialModal from './AddMaterialModal'
import { primaryColor } from '../../../../utility/Utils'

import { Korean } from "flatpickr/dist/l10n/ko.js"

const BootstrapCheckbox = forwardRef((props, ref) => (
	<div className='form-check' style={{justifyContent:'center'}}>
		<Input type='checkbox' ref={ref} {...props} />
	</div>
))

const FacilityLog = () => {
	useAxiosIntercepter()
	const dispatch = useDispatch()
	const facilityRedux = useSelector((state) => state.facility)
	const [navActive, setNavActive] = useState()
	const [tableSelect, setTableSelect] = useState([])
	const [pickr, setPickr] = useState(pickerDateChange([moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]))

	const handleAddLog = () => {
		dispatch(nameReduxObj.facility.setRowInfo(null))
		dispatch(nameReduxObj.facility.setModalType('register'))
		if (navActive === 'log') dispatch(nameReduxObj.facility.setLogModalIsOpen(true))
		else if (navActive === 'facilityMaterial') dispatch(nameReduxObj.facility.setFacilityMaterialModalIsOpen(true))
	}

	const rowSelectCritera = row => tableSelect.includes(row.id)

	const handleSelectedRowChange = ({selectedRows}) => {
		const tempList = []
		if (selectedRows.length < tableSelect.length) {
			selectedRows.map((row) => {
				if (tableSelect.includes(row.id)) {
					tempList.push(row.id)
				}
			})
			setTableSelect(tempList)
		} else if (selectedRows.length > tableSelect.length) {
			selectedRows.map((row) => {
				tempList.push(row.id)
			})
			setTableSelect(tempList)
		}
	}

	function getLogData () {
		axios.get(BasicInfoAPIObj[navActive], { params: {facility : facilityRedux.id, pickr: pickr} })
		.then(res => {
			dispatch(nameReduxObj.facility.setLogList(res.data))
		})
	}

	function handleDelete () {
		const MySwal = withReactContent(Swal)
		MySwal.fire({
			icon: "warning",
			html: "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonText: "취소",
			confirmButtonText: '확인',
			confirmButtonColor : primaryColor,
			reverseButtons :true,
			customClass: {
				actions: 'sweet-alert-custom right',
				cancelButton: 'me-1'
			}
		}).then(res => {
			if (res.isConfirmed) {
				axios.delete(`${BasicInfoAPIObj[navActive]}/-1`, {data: {delete: tableSelect}})
				.then((res) => {
					if (res.status === 200) {
						setTableSelect([])
						sweetAlert(`설비정보 이력 삭제 완료`, `설비정보 이력 삭제가 완료되었습니다.`, 'success')
						getLogData()
					}
				})
				.catch(error => console.error(error))
			} else {
				MySwal.fire({
					icon: "info",
					html: "취소하였습니다.",
					showCancelButton: true,
					showConfirmButton: false,
					cancelButtonText: "확인",
					cancelButtonColor : primaryColor,
					reverseButtons :true,
					customClass: {
						actions: 'sweet-alert-custom right'
					}
				})
			}
		})
	}

	useEffect(() => {
		if (window.location.pathname !== localStorage.getItem('pathname')) {
			localStorage.clear()
			localStorage.setItem('pathname', window.location.pathname)
			setNavActive(BasicInfoTabList[0].value)
		} else {
			setNavActive(localStorage.getItem('navTab'))
		}
	}, [])

	useEffect(() => {
		if (navActive !== undefined && facilityRedux[`${navActive}ModalIsOpen`] === false) getLogData()
	}, [facilityRedux[`${navActive}ModalIsOpen`]])

	useEffect(() => {
		if (navActive !== undefined) {
			dispatch(nameReduxObj.facility.setLogList([]))
			if (navActive !== localStorage.getItem('navTab')) localStorage.setItem('navTab', navActive)
			getLogData()
		}
	}, [navActive, pickr])

	return (
		<Fragment>
			<Row>
				<Col md={12}>
					<NavTab tabList={BasicInfoTabList} active={navActive} setActive={setNavActive}/>
				</Col>
			</Row>
			<TabContent activeTab={navActive} style={{border:'1px solid #D8D6DE'}}>
				{
					BasicInfoTabList.map((tab, idx) => {
						return (
							<TabPane tabId={tab.value} key={idx}>
								<Card>
									<CardHeader>
										<CardTitle>{tab.label}</CardTitle>
										{
											(navActive === 'log' || navActive === 'facilityMaterial') &&
											<Col className='d-flex justify-content-end'>
												<Button color='white' size='sm' style={{ marginTop: '1%', marginRight: '1%', borderColor: 'gray', whiteSpace:'nowrap' }} disabled={tableSelect.length === 0} onClick={() => handleDelete()}>삭제</Button>
												<Button color='white' size='sm' style={{ marginTop: '1%', borderColor: 'gray', whiteSpace:'nowrap', marginRight:'10px'}} onClick={() => handleAddLog()}>추가</Button>
											</Col>
										}
									</CardHeader>

									<CardBody style={{paddingTop:'0'}}>
										<Row style={{marginBottom:'1%'}}>
											{
												navActive !== 'facilityMaterial' &&
												<Col xl={6} md={7} sm={8} xs={12}>
													<Row>
														<Col md={2} sm={3} xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }} htmlFor='jobSelect'>등록일</Col>
														<Col md={10} sm={9} xs={9} style={{paddingLeft: 'inherit'}}>
															<Flatpickr
																id='range-pickr'
																name='pickr'
																className='form-control'
																value={pickr}
																onChange={(date) => {
																	if (date.length === 2) {
																		const tempPickerList = pickerDateChange(date)
																		setPickr(tempPickerList)
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
											}
										</Row>
										{
											facilityRedux.logList && (navActive === 'log' || navActive === 'facilityMaterial') ?
												<DataTable
													noHeader
													selectableRows
													data={facilityRedux.logList}
													columns={basicInfoColumn[navActive]}
													className='react-dataTable'
													selectableRowsComponent={BootstrapCheckbox}
													selectableRowSelected={rowSelectCritera}
													onSelectedRowsChange={handleSelectedRowChange}
													customStyles={customStyles}
													noDataComponent={<NoData/>}
													persistTableHead/>
											:
												<DataTable
													noHeader
													data={facilityRedux.logList}
													columns={basicInfoColumn[navActive]}
													className='react-dataTable'
													customStyles={customStyles}
													noDataComponent={<NoData/>}
													persistTableHead/>
										}
									</CardBody>
								</Card>
							</TabPane>
						)
					})
				}
			</TabContent>
			<AddLogModal
				name='facility'
				redux={facilityRedux}/>
			<AddMaterialModal
				name='facility'
				list={facilityRedux.logList}
				redux={facilityRedux}/>
		</Fragment>
	)
}

export default FacilityLog