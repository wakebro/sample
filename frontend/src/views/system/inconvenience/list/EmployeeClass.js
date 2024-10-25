import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { Button, Col, Row, Card, CardBody, CardTitle, CardHeader, Input, InputGroup } from "reactstrap"
import { API_INCONV_EMPLOYEE_CLASS, ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS, ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS_DETAIL } from "../../../../constants"
import CustomDataTable from '../../../../components/CustomDataTable'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { InconvInfoColumn, SearchGetTableData } from '../InconData'
import { useSelector } from 'react-redux'
import { checkOnlyView } from '../../../../utility/Utils'
import { SYSTEM_INCONVENIENCE_EMPLOYEE_CLASS } from '../../../../constants/CodeList'
import TotalLabel from '../../../../components/TotalLabel'

const FacilityInfo = () => {
	useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
	const [data, setData] = useState([])
	const column = InconvInfoColumn['employee_class']
	const [searchParams, setSearchParams] = useState('')
	const cookies = new Cookies()

	useEffect(() => {
        axios.get(API_INCONV_EMPLOYEE_CLASS, {params: {property_id:cookies.get('property').value, search: searchParams, select_employee_class: ''}})
        .then(res => {
            setData(res.data.data)
        })
    }, [])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='직종 관리' breadCrumbParent='시스템관리' breadCrumbParent2='시설표준정보' breadCrumbActive='직종 관리' />
				</div>
			</Row>
			<Col>		
				<Card>
					<CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                        <CardTitle tag='h4'>직종 관리</CardTitle>
						<Row>	
                            <Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_EMPLOYEE_CLASS, 'available_create')}
                                color='primary' 
                                style={{marginLeft: '-22%'}}
                                tag={Link} 
                                to={`${ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS}/add`} 
                                state={{
                                    title: '직종 관리',
                                    key: 'employee_class',
                                    API: API_INCONV_EMPLOYEE_CLASS,
                                    type:'register'
                                }}>등록</Button>                 
						</Row>
					</CardHeader>
						<CardBody>
							<Row>
								<Col className='d-flex align-items-center mt-sm-0 mt-1' sm='6' style={{justifyContent: 'space-between'}}>
									<Col>
										<CardTitle tag='h6' style={{marginBottom: '1%'}}>{cookies.get('property').label}</CardTitle>
									</Col>
									<Col style={{display:'flex-end'}}>
										<Row>
											<Col md={2}/>
											<Col className='mb-1' md='4' sm='4'>
											</Col>
												<Col className='mb-1' md='6' sm='10'>
													<InputGroup>
														<Input 
															value={searchParams} 
															onChange={(e) => setSearchParams(e.target.value)} 
															placeholder='직종 코드'
															onKeyDown={e => {
																if (e.key === 'Enter') {
																	SearchGetTableData(API_INCONV_EMPLOYEE_CLASS, { property_id:cookies.get('property').value, search: searchParams, select_employee_class:''}, setData)
																}
															}}
															/>
														<Button
															onClick={() => {
																SearchGetTableData(API_INCONV_EMPLOYEE_CLASS, { property_id:cookies.get('property').value, search: searchParams, select_employee_class:''}, setData)
																}}
														>
														검색
														</Button>
													</InputGroup>
												</Col>
										</Row>
									</Col>
								</Col>
							</Row>
							<TotalLabel 
								num={3}
								data={data.length}
							/>
							<CustomDataTable 
								columns={column} 
								tableData={data}
								setTabelData={setData} 
								selectType={false} 
								onRowClicked
								detailAPI={ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS_DETAIL}
								noDataComponent
							/>
						</CardBody>
				</Card>
			</Col>
		</Fragment>
	)
}

export default FacilityInfo