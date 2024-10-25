import axios from 'axios'
import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, TabContent, TabPane, InputGroup } from "reactstrap"
import { API_INTRANET_ARCHIVE, ROUTE_INTRANET_ARCHIVE_FORM, ROUTE_INTRANET_ARCHIVE_DETAIL } from "../../../../constants"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import TenantCustomDataTable from '../../../basic/area/tenant/list/TenantCustomTable'
import { ArchiveColumn } from '../ArchiveData'
import { pickerDateChange, getTableData, getObjectKeyCheck, checkOnlyView } from '../../../../utility/Utils'
import * as moment from 'moment'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useSelector } from 'react-redux'
import { INTRANET_ARCHIVES } from '../../../../constants/CodeList'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from '../../../../components/TotalLabel'

const ArchiveList = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const loginAuth = useSelector((state) => state.loginAuth)
    const [data, setData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [selectList, setSelectList] = useState([{label: '전체', value:''}])
    const [selected, setSelected] = useState(selectList[0])
    const now = moment().subtract(0, 'days').format('YYYY-MM-DD')
    const beforeDay = moment().subtract(30, 'days').format('YYYY-MM-DD')
	const [picker, setPicker] = useState([])
    // const [isPicker, setIsPicker] = useState(true)

    useEffect(() => {
        axios.get(API_INTRANET_ARCHIVE, {
            params: {type: true, property:cookies.get('property').value}
        })
        .then(res => {
            setSelectList(prevList => [...prevList, ...res.data])
        })
    }, [])

    const getArchiveList = () => {
        getTableData(
            API_INTRANET_ARCHIVE, 
            {
                property:cookies.get('property').value, 
                search:searchValue, 
                // picker: isPicker ? pickerDateChange(picker) : '', 
                picker: picker.length > 0 ? pickerDateChange(picker) : [], 
                selected: getObjectKeyCheck(selected, 'value')
            }, 
            setData
        )
    }

    useEffect(() => {
        // getTableData(API_REPORT_TABLE_TOTAL_COUNT, {model:'archive', condition:`property_id=${cookies.get('property').value} AND delete_datetime is null`}, setTotalCount)
        getArchiveList()
    }, [])
    return (
        <Fragment>
			<Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='자료실' breadCrumbParent='인트라넷' breadCrumbActive='자료실' />
                </div>
			</Row>
            <Card>
                <CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                    <CardTitle className="title">
                        자료실
                    </CardTitle>
                    <Row>
                        <Button color='primary'
                            hidden={checkOnlyView(loginAuth, INTRANET_ARCHIVES, 'available_create')}
                            style={{marginLeft: '-22%'}}
                            tag={Link} 
                            to={ROUTE_INTRANET_ARCHIVE_FORM} 
                            state={{
                                API: API_INTRANET_ARCHIVE,
                                type:'register'
                            }}
                            >등록</Button>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md={8}>
                            <Row>
                                <Col className='mb-1'md={3} xs={12}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col md='3' className='d-flex align-items-center justify-content-center' style={{paddingRight: 0 }}>직종</Col>
                                        <Col style={{ paddingLeft: '1%' }}>
                                            <Select
                                                classNamePrefix={'select'}
                                                className="react-select"
                                                options={selectList}
                                                value={selected}
                                                onChange={(e) => setSelected(e)}
                                            />
                                        </Col>
                                    </div>
                                </Col>
                                <Col className='mb-1'md={4} xs={12}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col md='2' className='d-flex align-items-center justify-content-center'>
                                            {/* <Input type='checkbox' onChange={() => { setIsPicker(!isPicker) }}/>&nbsp; */}
                                            기간
                                        </Col>
                                        <Col style={{ paddingLeft: '1%' }}>
                                            <Flatpickr
                                                value={picker}
                                                id='range-picker'
                                                // className={`form-control ${isPicker ? 'risk-report background-color-disabled' : ''}`}
                                                className={`form-control`}
                                                onChange={date => { if (date.length === 2) setPicker(date) } }
                                                // disabled={isPicker}
                                                // readOnly={isPicker}
                                                placeholder={`${beforeDay} ~ ${now}`}
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
                                <Col className='mb-1'md={5} xs={12}>
                                    <InputGroup>
                                        <Input 
                                            value={searchValue}
                                            placeholder='자료의 제목으로 검색해주세요.' 
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    getArchiveList()
                                                }
                                            }}
                                            maxLength={250}
                                            />
                                        <Button 
                                            style={{zIndex:0}}
                                            onClick={() => {
                                                getArchiveList()
                                                }}
                                        >검색</Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <TotalLabel 
                            num={3}
                            data={data.length}
                        />
                    </Row>
                {data &&
                    <TenantCustomDataTable
                        columns={ArchiveColumn} 
                        tableData={data} 
                        setTabelData={setData} 
                        // setTableSelect={setTableSelect}
                        selectType={false}
                        onRowClicked
                        detailAPI={!checkOnlyView(loginAuth, INTRANET_ARCHIVES, 'available_read') ? ROUTE_INTRANET_ARCHIVE_DETAIL : undefined}
                        noDataComponent
                    />
                }
                </CardBody>
            </Card>
                   
        </Fragment>
    )

}
export default ArchiveList