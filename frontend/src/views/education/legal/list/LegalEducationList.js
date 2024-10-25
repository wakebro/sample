import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState, useEffect } from "react"
import { Link, useParams } from 'react-router-dom'
import Flatpickr from 'react-flatpickr'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, InputGroup } from "reactstrap"
import { API_EDUCATION, ROUTE_EDUCATION } from "../../../../constants"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import TenantCustomDataTable from '../../../basic/area/tenant/list/TenantCustomTable'
import { SafetyEducationColumn, bigTitleObj, titleObj } from '../../EducationData'
import { pickerDateChange, getTableData, checkOnlyView } from '../../../../utility/Utils'
import * as moment from 'moment'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useSelector } from 'react-redux'
import { EDUCATION_LEGAL } from '../../../../constants/CodeList'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from '../../../../components/TotalLabel'

const LegalEducationList = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const cookies = new Cookies()
    const { type } = useParams()
    const [data, setData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const past = moment().subtract(7, 'days')
    const future = moment().add(7, 'days')
	const [picker, setPicker] = useState([past.format('YYYY-MM-DD'), future.format('YYYY-MM-DD')])

    useEffect(() => {
        getTableData(API_EDUCATION, {propertyId:cookies.get('property').value, type:type, search:searchValue, picker: pickerDateChange(picker)}, setData)
    }, [])

    return (
        <Fragment>
			<Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle={`${bigTitleObj[type]}`} breadCrumbParent='교육관리' breadCrumbParent2='교육' breadCrumbActive={`${titleObj[type]}`} />
                </div>
			</Row>
            <Card>
                <CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                    <CardTitle className="title">
                    {bigTitleObj[type]}
                    </CardTitle>
                    <Row>
                        <Button hidden={checkOnlyView(loginAuth, EDUCATION_LEGAL, 'available_create')}
                            color='primary' 
                            style={{marginLeft: '-22%'}}
                            tag={Link} 
                            to={ `${ROUTE_EDUCATION}/${type}/form`} 
                            state={{
                                type:'register'
                            }}
                            >등록</Button>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row >
                        <Col md={6}>
                            <Row>
                                <Col className='mb-1'md={6} xs={12}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col md='2' className='title_align' style={{textAlign: 'center'}}>기간</Col>
                                        <Col style={{ paddingLeft: '1%' }}>
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
                                    </div>
                                </Col>
                                <Col className='mb-1'md={6} xs={12}>
                                    <InputGroup>
                                        <Input 
                                            maxLength={98}
                                            placeholder='교육명으로 검색해주세요.'
                                            value={searchValue} 
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            />
                                        <Button
                                            onClick={() => {
                                                getTableData(API_EDUCATION, {propertyId:cookies.get('property').value, type:'legal', search:searchValue, picker:pickerDateChange(picker)}, setData)
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
                {data &&
                    <TenantCustomDataTable
                        columns={SafetyEducationColumn} 
                        tableData={data} 
                        setTabelData={setData} 
                        selectType={false}
                        onRowClicked
                        detailAPI={`${ROUTE_EDUCATION}/${type}/detail`}
                        noDataComponent
                    />
                }
                </CardBody>
            </Card>
        </Fragment>
    )
}
export default LegalEducationList