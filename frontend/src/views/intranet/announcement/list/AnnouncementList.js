import Breadcrumbs from '@components/breadcrumbs'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import Flatpickr from 'react-flatpickr'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Label, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_INTRANET_ANOUNCEMENT, ROUTE_INTRANET_ANNOUNCEMENT_DETAIL, ROUTE_INTRANET_ANNOUNCEMENT_FORM } from "../../../../constants"
import { INTRANET_ANNOUNCEMENT } from '../../../../constants/CodeList'
import { checkOnlyView, getTableData, pickerDateChange } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import TenantCustomDataTable from '../../../basic/area/tenant/list/TenantCustomTable'
import { AnnouncementColumn } from '../AnnouncementData'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from '../../../../components/TotalLabel'

const AnnouncementList = () => {
    useAxiosIntercepter()
    const [data, setData] = useState([])
    const loginAuth = useSelector((state) => state.loginAuth)
    const [searchValue, setSearchValue] = useState('')
    const cookies = new Cookies()
    const now = moment().subtract(0, 'days')
    const yesterday = moment().subtract(7, 'days')
	const [picker, setPicker] = useState([yesterday.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')])
    const [dataLength, setDataLength] = useState(0)

    const getListInit = () => {
        getTableData(
            API_INTRANET_ANOUNCEMENT, 
            {property:cookies.get('property').value, search:searchValue, picker:pickerDateChange(picker)}, 
            (data) => {
                setDataLength(data?.listLength)
                setData(data.data)
            }
        )// getTableData end
    }
    
    useEffect(() => {
        getListInit()
    }, [])

    return (
        <Fragment>
			<Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='공지사항' breadCrumbParent='인트라넷' breadCrumbActive='공지사항' />
                </div>     
			</Row>
            <Card>
                <CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                    <CardTitle className="title">
                        공지사항
                    </CardTitle>
                    <Row>
                        <Button color='primary'
                            hidden={checkOnlyView(loginAuth, INTRANET_ANNOUNCEMENT, 'available_create')}
                            style={{marginLeft: '-22%'}}
                            tag={Link} 
                            to={ROUTE_INTRANET_ANNOUNCEMENT_FORM} 
                            state={{
                                API: API_INTRANET_ANOUNCEMENT,
                                type:'register'
                            }}
                            >등록</Button>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md={7}>
                            <Row>
                                <Col className='mb-1' md={5} xs={12}>
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
                                <Col className='mb-1' md='7' sm='12'>
                                    <InputGroup>
                                        <Input 
                                            value={searchValue} 
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            maxLength={250}
                                            placeholder= '공지사항 제목을 검색해보세요.'
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    getListInit()
                                                }
                                            }}
                                            />
                                        <Button
                                            onClick={() => {
                                                getListInit()
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
                            data={dataLength}
                        />
                    </Row>
                {data &&
                    <TenantCustomDataTable
                        columns={AnnouncementColumn} 
                        tableData={data} 
                        setTabelData={setData} 
                        selectType={false}
                        onRowClicked
                        detailAPI={!checkOnlyView(loginAuth, INTRANET_ANNOUNCEMENT, 'available_read') ? ROUTE_INTRANET_ANNOUNCEMENT_DETAIL : undefined}
                        noDataComponent
                    />
                }
                </CardBody>
            </Card>
                   
        </Fragment>
    )

}
export default AnnouncementList