import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import CustomDataFooterTable from '@views/basic/area/property/CustomDataFooterTable'
import axios from 'axios'
import { Fragment, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import Cookies from 'universal-cookie'
import { API_SPACE_BUILDING, API_SPACE_FLOOR, ROUTE_BASICINFO_AREA_FLOOR, ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD } from '../../../../constants'
import { setDataTable, setDetailBackUp, setId, setPageType, setSelectList, setSubmitResult, setbuilding, sumTotal } from '../../../../redux/module/basicFloor'
import { selectListType } from '../../../../utility/Utils'
import { columns } from '../data'
import CustomHelpCircle from '../../../apps/CustomHelpCircle'
import TotalLabel from '../../../../components/TotalLabel'
// import { useNavigate } from 'react-router-dom'

const FloorIndex = () => {
	useAxiosIntercepter()
	const basicFloor = useSelector((state) => state.basicFloor)
	const dispatch = useDispatch()
	const cookies = new Cookies()
	// const navigate = useNavigate()

	const reset = () => {
		dispatch(setbuilding(null))
		dispatch(setSelectList([]))
		dispatch(setDataTable([]))
		dispatch(sumTotal(null))
		dispatch(setDetailBackUp(null))
		dispatch(setPageType('detail'))
		dispatch(setId(null))
		dispatch(setSubmitResult(false))
	}

	// 아직은 지우지 말아주세요 bill
	// const handleClickBtn = () => {
	// 	if (!basicFloor.buildings || basicFloor.buildings.length <= 1) {
	// 		sweetAlert('', '등록된 건물이 없습니다.<br/> 건물을 먼저 등록해주세요.<br/>해당 등록 페이지로 이동합니다.', 'warning', 'center')
	// 		navigate(ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD, {state: {pageType:'register', key: 'building'}})
	// 		return
	// 	}
	// 	navigate(ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD, {state: {pageType:'register', key: 'floor'}})
	// }

	const getBuildings = () => {
		axios.get(API_SPACE_BUILDING, {
			params:{
				property :  cookies.get('property').value
			}
		})
		.then(res => {
			const tempList = [{label: '건물전체', value:''}]
			res.data.map(row => tempList.push(selectListType('custom1', row, ['code', 'name'], 'id')))
			dispatch(setSelectList(tempList))
			dispatch(setbuilding(tempList[0]))
		})
	}

	const getFloors = (id) => {
		axios.get(API_SPACE_FLOOR, {
			params:{
				property: cookies.get('property').value,
				building: id
			}
		})
		.then(res => {
			dispatch(setDataTable(res.data))
			dispatch(sumTotal({description: `합계 : ${(res.data.length).toLocaleString('ko-KR')}`}))
		})
	}

	useEffect(() => {
		reset()
	}, [])
	
	useEffect(() => {
		if (basicFloor.buildings.length === 0) {
			getBuildings()
		}
	}, [basicFloor.buildings])

	useEffect(() => {
		if (basicFloor.building !== null) {
			getFloors(basicFloor.building.value)
		}
	}, [basicFloor.building])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='층정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='층정보' />
				</div>
			</Row>
			<Row>
				<Col>
					<Card>
						<CardHeader>
							<CardTitle>
								층정보
								<CustomHelpCircle
									id={'floorHelp'}
									content={'층정보는 시스템관리에서 등록 가능합니다.'}
								/>
							</CardTitle>
							{/* <Button color='primary'
								onClick={handleClickBtn}
							>등록</Button> */}
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
                                                        classNamePrefix={'select'}
                                                        className="react-select"
                                                        options={basicFloor.buildings}
                                                        value={basicFloor.building}
                                                        onChange={(e) => {
                                                            dispatch(setbuilding(e))
                                                        }}/>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
							<TotalLabel 
								num={3}
								data={basicFloor.dataTable.length}
							/>
							<Row>
								<CustomDataFooterTable
									columns={columns.floor}
									tableData={basicFloor.dataTable}
									sortAble={false}
									// customFooter ={basicFloor.totalFloor}
									detailAPI={ROUTE_BASICINFO_AREA_FLOOR}
								/>
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
}

export default FloorIndex