import Breadcrumbs from '@components/breadcrumbs'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { Fragment, useEffect, useState } from "react"
import { Button, Col, Row, Card, CardBody, CardTitle, CardHeader, Input, InputGroup } from "reactstrap"
import { API_INCONV_LICENSE, ROUTE_SYSTEMMGMT_INCONV_LICENSE, ROUTE_SYSTEMMGMT_INCONV_LICENSE_DETAIL } from "../../../../constants"
import CustomDataTable from '../../../../components/CustomDataTable'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { defaultSystemTable, InconvInfoColumn, InconvInfoUrlObj, CustomGetTableData, SearchGetTableData, TabGetTableData } from '../InconData'
import { useSelector } from 'react-redux'
import { checkOnlyView } from '../../../../utility/Utils'
import { SYSTEM_INCONVENIENCE_LICENSE } from '../../../../constants/CodeList'
import TotalLabel from '../../../../components/TotalLabel'

const FacilityInfo = () => {
	useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
	const [data, setData] = useState([])
    const activeTab = 'license'
	const column = InconvInfoColumn['license']
	const [searchParams, setSearchParams] = useState('')
	const [selectEmpColumn, setSelectEmpColumn] = useState(defaultSystemTable[0])
	const [selectTableList, setSelectTableList] = useState([{label: '직종 전체', value:''}])
	const cookies = new Cookies()

	useEffect(() => {
        if (selectTableList.length === 1) {
            CustomGetTableData(InconvInfoUrlObj[activeTab], {property:cookies.get('property').value, search:'', select_employee_class:''}, setData, setSelectTableList)
        } else {
            TabGetTableData(InconvInfoUrlObj[activeTab], {property:cookies.get('property').value, search:'', select_employee_class:''}, setData)
        }
    }, [])

	useEffect(() => {
		if (data !== undefined && selectTableList.length === 1 && selectTableList[1] !== undefined) {
			const tempList = []
			selectTableList.map(d => { tempList.push({label:d.code, value:d.id}) })
			setSelectTableList(prevList => [...prevList, ...tempList])
		}
	}, [data])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='자격증 정보' breadCrumbParent='시스템관리' breadCrumbParent2='시설표준정보' breadCrumbActive='자격증 정보' />
				</div>
			</Row>
			<Col>		
				<Card>
					<CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                        <CardTitle tag='h4'>자격증 정보</CardTitle>
						<Row>
                            <Button hidden={checkOnlyView(loginAuth, SYSTEM_INCONVENIENCE_LICENSE, 'available_create')}
                                color='primary' 
                                style={{marginLeft: '-22%'}}
                                tag={Link} 
                                to={`${ROUTE_SYSTEMMGMT_INCONV_LICENSE}/add`}
                                state={{
                                    title: '자격증',
                                    key: 'license',
                                    API: API_INCONV_LICENSE,
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
											<Select
												key={selectTableList}
												theme={selectThemeColors}
												className='react-select'
												classNamePrefix='select'
												value={selectEmpColumn}
												options={selectTableList}
												onChange={(e) => setSelectEmpColumn(e)}
												isClearable={false}
												styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
											/>
											</Col>
											<Col className='mb-1' md='6' sm='10'>
												<InputGroup>
													<Input 
														value={searchParams} 
														onChange={(e) => setSearchParams(e.target.value)} 
														placeholder= '자격명을 입력하세요.'
														onKeyDown={e => {
															if (e.key === 'Enter') {
																SearchGetTableData(API_INCONV_LICENSE, { property:cookies.get('property').value, search: searchParams, select_employee_class:selectEmpColumn.value}, setData)
															}
														}}
														/>
													<Button
														onClick={() => {
															SearchGetTableData(API_INCONV_LICENSE, { property:cookies.get('property').value, search: searchParams, select_employee_class:selectEmpColumn.value}, setData)
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
								detailAPI={ROUTE_SYSTEMMGMT_INCONV_LICENSE_DETAIL}
								noDataComponent
							/>
						</CardBody>
				</Card>
			</Col>
		</Fragment>
	)
}

export default FacilityInfo