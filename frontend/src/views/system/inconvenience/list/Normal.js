import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { Button, Col, Row, Card, CardBody, CardTitle, CardHeader, Input, InputGroup } from "reactstrap"
import { API_INCONV_NORMAL, ROUTE_SYSTEMMGMT_INCONV_NORMAL, ROUTE_SYSTEMMGMT_INCONV_NORMAL_DETAIL } from "../../../../constants"
import CustomDataTable from '../../../../components/CustomDataTable'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { InconvInfoColumn, SearchGetTableData } from '../InconData'
import { checkOnlyView } from '../../../../utility/Utils'
import { SYSTEM_INCONVENIENCE_NORMAL } from '../../../../constants/CodeList'
import { useSelector } from 'react-redux'

// 안쓰는 컴포넌트
const FacilityInfo = () => {
	useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
	const [data, setData] = useState([])
    const column = InconvInfoColumn['normal']
	const [searchParams, setSearchParams] = useState('')
	const cookies = new Cookies()

	useEffect(() => {
        axios.get(API_INCONV_NORMAL, {params: {property:cookies.get('property').value, search: searchParams, select_employee_class: ''}})
        .then(res => {
            setData(res.data.data)
        })
    }, [])

    return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='표준 자재' breadCrumbParent='시스템관리' breadCrumbParent2='시설표준정보' breadCrumbActive='표준 자재' />
				</div>
			</Row>
			<Col>		
				<Card>
					<CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                        <CardTitle tag='h4'>표준 자재 관리</CardTitle>
						<Row>	
                            <Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_NORMAL, 'available_delete')}
                                color='primary' 
                                style={{marginLeft: '-22%'}}
                                tag={Link} 
                                to={`${ROUTE_SYSTEMMGMT_INCONV_NORMAL}/add`} 
                                state={{
                                    title: '표준 자재',
                                    key: 'normal',
                                    API: API_INCONV_NORMAL,
                                    type:'register'
                                }}>등록</Button>                 
						</Row>
					</CardHeader>
						<CardBody>
							<Row className='d-flex align-items-center mt-sm-0 mt-1' style={{justifyContent: 'space-between'}}>
								<Col md='6' sm='12'>
									<CardTitle tag='h6' style={{marginBottom: '1%'}}>{cookies.get('property').label}</CardTitle>
								</Col>
								<Col style={{display:'flex-end'}}>
									<Row>
										<Col md={2}/>
										<Col className='mb-1' md='4' sm='4' />
                                        <Col className='mb-1' md='6' sm='10'>
                                            <InputGroup>
                                                <Input 
                                                    value={searchParams} 
                                                    onChange={(e) => setSearchParams(e.target.value)} 
													onKeyDown={e => {
														if (e.key === 'Enter') {
															SearchGetTableData(API_INCONV_NORMAL, { property:cookies.get('property').value, search: searchParams, select_employee_class:''}, setData)
														}
													}}
                                                    placeholder='표준 자재'
                                                    />
                                                <Button
                                                    onClick={() => {
                                                        SearchGetTableData(API_INCONV_NORMAL, { property:cookies.get('property').value, search: searchParams, select_employee_class:''}, setData)
                                                    }}
												>
                                                	검색
                                                </Button>
                                            </InputGroup>
                                        </Col>
									</Row>
								</Col>
							</Row>

							<CustomDataTable 
								columns={column} 
								tableData={data}
								setTabelData={setData} 
								selectType={false} 
								onRowClicked
								detailAPI={ROUTE_SYSTEMMGMT_INCONV_NORMAL_DETAIL}
								noDataComponent
							/>
						</CardBody>
				</Card>
			</Col>
		</Fragment>
	)
}

export default FacilityInfo