import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setDataList, setDetailBackUp, setId, setPageType, setSubmitResult } from '@store/module/businessEevaluationItems'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { getTableDataRedux } from '@utils'
import CustomDataTable from '@views/system/basic/company/list/CustomDataTable'
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_BUSINESS_COST, ROUTE_BUSINESS_COST, ROUTE_BUSINESS_EVALUATION } from '../../../../constants'
import { columns } from '../../data'

const ItemMgmtIndex = () => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const dispatch = useDispatch()
	const [searchValue, setSearchValue] = useState('')
	const businessEevaluationItems = useSelector((state) => state.businessEevaluationItems)

	const reset = () => {
		dispatch(setId(null))
		dispatch(setPageType(''))
		dispatch(setSubmitResult(false))
		dispatch(setDataList([]))
		dispatch(setDetailBackUp(null))
	}

	const handleSearchWord = (e) => {
		const value = e.target.value
		setSearchValue(value)
	}

	useEffect(() => {
		reset()
	}, [])

	// useEffect(() => {
	// 	const params = {
	// 		property: cookies.get('property').value,
	// 		date: picker,
	// 		title: searchValue
	// 	}
	// 	getTableDataRedux(API_BUSINESS_COST, params, dispatch, setDataList)
	// }, [])
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='평가항목관리' breadCrumbParent='사업관리' breadCrumbParent2='성과평가' breadCrumbActive='평가항목관리'/>
				</div>
			</Row>
			<Row>
				<Col>
					<Card>
						<CardHeader>
							<CardTitle>평가항목관리</CardTitle>
							<Button color='primary'
								tag={Link}
								to={`${ROUTE_BUSINESS_EVALUATION}/items-mgmt/register`}
								state={{pageType:'register'}}
							>등록</Button>
						</CardHeader>
						<CardBody style={{paddingTop:'0'}}>
							<Row style={{marginBottom:'1%'}}>
								<Col lg={8} md={12} sm={12} xs={12}>
									<Row>
										<Col className='mb-1'md={6} xs={12}>
											<Row>
												<Col>
													<InputGroup>
														<Input
															value={searchValue}
															onChange={handleSearchWord}
															onKeyDown={e => {
																if (e.key === 'Enter') {
																	getTableDataRedux(API_BUSINESS_COST, {
																		property: cookies.get('property').value,
																		date: picker,
																		title: searchValue
																	}, dispatch, setDataList)
																}
															}}
															placeholder='제목을 검색해보세요.'
														/>
														<Button 
															onClick={() => {
																getTableDataRedux(API_BUSINESS_COST, {
																	property: cookies.get('property').value,
																	date: picker,
																	title: searchValue
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
							<CustomDataTable
								columns={columns.itemsMgmt}
								tableData={businessEevaluationItems.dataList}
								selectType={false}
								detailAPI={`${ROUTE_BUSINESS_COST}/maintenance`}
							/>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
}

export default ItemMgmtIndex