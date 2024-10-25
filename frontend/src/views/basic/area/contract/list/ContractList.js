import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import Flatpickr from 'react-flatpickr'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, TabContent, TabPane, InputGroup } from "reactstrap"
import { API_BASICINFO_AREA_CONTRACT, ROUTE_BASICINFO_AREA_CONTRACT_FORM, ROUTE_BASICINFO_AREA_CONTRACT_DETAIL } from "../../../../../constants"
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import TenantCustomDataTable from '../../tenant/list/TenantCustomTable'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import { getTableData } from '../../../../../utility/Utils'
import { ContractColumn, SearchGetTableData, pickerDateChangeCustom } from '../ContractData'
import * as moment from 'moment'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import TotalLabel from '../../../../../components/TotalLabel'

const ContractList = () => {
    const cookies = new Cookies()
    const [data, setData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const now = moment().subtract(0, 'days')
    const yesterday = moment().subtract(7, 'days')
	const [picker, setPicker] = useState([yesterday.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')])
    useAxiosIntercepter()
 
    useEffect(() => {
        getTableData(API_BASICINFO_AREA_CONTRACT, {search:searchValue, picker:pickerDateChangeCustom(picker)}, setData)
    }, [])

    return (
        <Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
                	<Breadcrumbs breadCrumbTitle='사업소별계약관리' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='사업소별계약관리' />
				</div>
			</Row>
            <Card>
                <CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                    <CardTitle className="title">
                        사업소별계약관리
                    </CardTitle>
                    <Row>
                        <Button color='primary' 
                            style={{marginLeft: '-22%'}}
                            tag={Link} 
                            to={ROUTE_BASICINFO_AREA_CONTRACT_FORM} 
                            state={{
                                API: API_BASICINFO_AREA_CONTRACT,
                                type:'register'
                            }}
                            >등록</Button>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md={7}>
                            <Row>
                                <Col className='mb-1'md={6} xs={12}>
                                    <Row>
                                        <Col xs={3}className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }} htmlFor='jobSelect'>기간</Col>
                                        <Col xs={9}>
                                            <Flatpickr
                                                value={picker}
                                                id='range-picker'
                                                className='form-control'
                                                onChange={date => { if (date.length === 2) setPicker(date) } }
                                                options={{
                                                    mode: 'range',
                                                    ariaDateFormat:'Y-m-d',
                                                    locale: {
                                                        rangeSeparator: ' ~ '
                                                    },
                                                    locale: Korean
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className='mb-1' md='6' sm='12'>
                                    <InputGroup>
                                        <Input 
                                            value={searchValue} 
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            placeholder= '건물코드 또는 현장명을 입력해주세요.'
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    SearchGetTableData(API_BASICINFO_AREA_CONTRACT, { property:cookies.get('property').value, search:searchValue, picker:pickerDateChangeCustom(picker)}, setData)
                                                }
                                            }}
                                            />
                                            
                                        <Button
                                            onClick={() => {
                                                SearchGetTableData(API_BASICINFO_AREA_CONTRACT, { property:cookies.get('property').value, search:searchValue, picker:pickerDateChangeCustom(picker)}, setData)
                                                }}
                                        >검색</Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <TotalLabel 
                        num={3}
                        data={data.length}
                    />
                { data && 
                    <TenantCustomDataTable
                        columns={ContractColumn} 
                        tableData={data} 
                        setTabelData={setData} 
                        selectType={false}
                        onRowClicked
                        detailAPI={ROUTE_BASICINFO_AREA_CONTRACT_DETAIL}
                        noDataComponent
                    />
                }
                </CardBody>
            </Card>
                   
        </Fragment>
    )

}
export default ContractList