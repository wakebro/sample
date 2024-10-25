import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setBuildingList, setCostType, setDataList, setId, setModalIsOpen, setModalPageType } from '@store/module/businessCost'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { axiosDeleteRedux, getTableDataRedux, pickerDateChange } from '@utils'
import CustomDataTable from '@views/business/CustomDataTable'
import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import Flatpickr from 'react-flatpickr'
import { useDispatch, useSelector } from "react-redux"
import { useParams } from 'react-router'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { FileText } from "react-feather"
import { API_BUSINESS_COST_MAINTENANCES_EXPORT } from '../../../constants'
import axios from "axios"
import { BUILDING_TYPE, apiObj, costTypeVal, defaultValues, stateCodeObj, stateObj, validationSchemaObj } from '../data'
import AddLineModal from './AddLineModal'
import { checkOnlyView } from '../../../utility/Utils'
import { Korean } from 'flatpickr/dist/l10n/ko'
import TotalLabel from '../../../components/TotalLabel'

const MaintenanceIndex = () => {
	useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
	const { costType } = useParams()
	const cookies = new Cookies()
	const dispatch = useDispatch()
	const first = moment().startOf('month')
	const last = moment().endOf('month')
	const [picker, setPicker] = useState([])
	const [searchValue, setSearchValue] = useState('')
	const [priceList, setPriceList] = useState([])
	const costRedux = useSelector((state) => state.businessCost)

	const handleSearchWord = (e) => {
		const value = e.target.value
		setSearchValue(value)
	}

	const handleModal = () => {
		dispatch(setModalPageType('register'))
		dispatch(setModalIsOpen(true))
	}

	const getDatas = () => {
		const params = {
			property: cookies.get('property').value,
			date: picker,
			title: '',
			cost_type: costRedux.costType
		}
		getTableDataRedux(apiObj.cost, params, dispatch, setDataList)
	}
	const reset = () => {
		dispatch(setCostType(costTypeVal[`${costType}`]))
		dispatch(setId(null))
		dispatch(setDataList([]))
		dispatch(setBuildingList([]))
		dispatch(setModalPageType(''))
		getDatas()
	}

	const handelDelete = (id) => {
		axiosDeleteRedux('유지보수 내역', `${apiObj.cost}/${id}`, reset, null, null)
	}

	const handleExport = () => {
        axios.get(API_BUSINESS_COST_MAINTENANCES_EXPORT, {params: {property: cookies.get('property').value, date: picker, title: searchValue, cost_type: costRedux.costType}})
        .then((res) => {
            axios({
                url: res.data.url,
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${res.data.name}`)
                document.body.appendChild(link)
                link.click()
            }).catch((res) => {
                console.log(res)
            })
        })
        .catch(res => {
            console.log(res)
        })
	}

	useEffect(() => {
		if (costType !== null) {
			dispatch(setCostType(costTypeVal[`${costType}`]))
			setPicker(pickerDateChange([first.format('YYYY-MM-DD'), last.format('YYYY-MM-DD')]))
		}
	}, [])

	useEffect(() => {
		const params = {
			property: cookies.get('property').value,
			date: pickerDateChange([first.format('YYYY-MM-DD'), last.format('YYYY-MM-DD')]),
			title: '',
			cost_type: costTypeVal[`${costType}`]
		}
		getTableDataRedux(apiObj.cost, params, dispatch, setDataList)
	}, [costType])

	useEffect(() => {
		if (costRedux.dataList.length !== 0) {
			let oldPrice = 0
			let newPrice = 0
	
			costRedux.dataList.map(data => {
				if (data.building_type === false) oldPrice += data.price
				else newPrice += data.price
			})
			const tempList = []
			if (costRedux.costType === 0) {
				tempList.push({label:'기존건물 유지보수비용', value:oldPrice})
				tempList.push({label:'신건물 유지보수비용', value:newPrice})
				tempList.push({label:'총 유지보수비용', value:oldPrice + newPrice})
			} else {
				tempList.push({label:'기존건물 수선충당금비용', value:oldPrice})
				tempList.push({label:'신건물 수선충당금비용', value:newPrice})
				tempList.push({label:'총 수선충당금비용', value:oldPrice + newPrice})
			}
			setPriceList(tempList)
		}
	}, [costRedux.dataList])

	useEffect(() => {
		if (costRedux.modalIsOpen === false) reset()
	}, [costRedux.modalIsOpen])

	const columns = [
		{
			name:'날짜',
			sortable: true,
			sortField: 'date',
			cell: row => row.date,
			width: '130px'
		},
		{
			name:'공사명',
			cell: row => row.title,
			width: '400px'
		},
		{
			name:'업체명',
			cell: row => row.company
		},
		{
			name:'건물구분',
			cell: row => BUILDING_TYPE[row.building_type],
			width: '130px'
		},
		{
			name:'건물명',
			cell: row => row.building.name,
			width: '130px'
		},
		{
			name:'금액',
			cell: row => <div style={{ width:'100%', textAlign:'right' }}><span>{row.price.toLocaleString('ko-KR')} 원</span></div>
		},
		{
			name:'편집',
			cell: row => { 
				return (
					<Fragment key={row.id}>
						<Row style={{width:'100%', padding:0}}>
							<Col xs={12} lg={6} style={{textAlign:'center'}}>
								<Row>
									<Button hidden={checkOnlyView(loginAuth, stateCodeObj[`${costType}`], 'available_update')}
                                        size='sm' color='primary' outline onClick={() => dispatch(setId(row.id))}>수정</Button>
								</Row>
							</Col>
							<Col xs={12} lg={6} style={{textAlign:'center'}}>
								<Row>
									<Button hidden={checkOnlyView(loginAuth, stateCodeObj[`${costType}`], 'available_delete')}
                                        size='sm' outline onClick={() => handelDelete(row.id)}>삭제</Button>
								</Row>
							</Col>
						</Row>
					</Fragment> 
				)
			},
			width: '150px'
		}
	]
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle={stateObj[`${costType}`]} breadCrumbParent='사업관리' breadCrumbActive={stateObj[`${costType}`]} />
					<Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
						<FileText size={14}/>
						문서변환
					</Button.Ripple>
				</div>
			</Row>
			<Row>
				<Col>
					<Card>
						<CardHeader>
							<CardTitle>{stateObj[`${costType}`]}</CardTitle>
							<Button hidden={checkOnlyView(loginAuth, stateCodeObj[`${costType}`], 'available_create')}
                                color='primary' onClick={() => handleModal()}>등록</Button>
						</CardHeader>
						<CardBody style={{paddingTop:'0'}}>
							<Row>
								<Col lg={8} md={12} sm={12} xs={12}>
									<Row>
										<Col className='mb-1'md={6} xs={12}>
											<Row>
												<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>기간</Col>
												<Col xs={9}>
													<Flatpickr
														style={{width:'100%'}}
														value={picker}
														id='range-picker'
														className='form-control'
														onChange={date => { 
															if (date.length === 2) {
																const tempPickerList = pickerDateChange(date)
																setPicker(tempPickerList)
															}
														}}
														options={{
															mode: 'range',
															ariaDateFormat:'Y-m-d',
															locale: Korean,
															locale: {
																rangeSeparator: ' ~ '
															}
														}}
													/>
												</Col>
											</Row>
										</Col>
										<Col className='mb-1'md={6} xs={12}>
											<Row>
												<Col>
													<InputGroup>
														<Input
															maxLength={90}
															value={searchValue}
															onChange={handleSearchWord}
															onKeyDown={e => {
																if (e.key === 'Enter') {
																	getTableDataRedux(apiObj.cost, {
																		property: cookies.get('property').value,
																		date: picker,
																		title: searchValue,
																		cost_type: costRedux.costType // check
																	}, dispatch, setDataList)
																}
															}}
															placeholder='공사명으로 검색해주세요.'
														/>
														<Button 
															onClick={() => {
																getTableDataRedux(apiObj.cost, {
																	property: cookies.get('property').value,
																	date: picker,
																	title: searchValue,
																	cost_type: costRedux.costType // check
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
								data={costRedux.dataList.length}
							/>
							<CustomDataTable
								columns={columns}
								tableData={costRedux.dataList}
								selectType={false}
								setTabelData={setDataList}
								footer={priceList}
								dispatch={dispatch}
							/>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<AddLineModal
				modalTitle={stateObj[`${costType}`]}
				redux={costRedux}
				isOpen={setModalIsOpen}
				modalType={setModalPageType}
				defaultValues={JSON.parse(JSON.stringify(defaultValues.cost))}
				resolver={validationSchemaObj.cost}
				setBuildingList={setBuildingList}
				api={apiObj.cost}
			/>
		</Fragment>
	)
}

export default MaintenanceIndex