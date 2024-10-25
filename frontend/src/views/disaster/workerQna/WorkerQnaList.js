import { Fragment, useEffect, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import CustomDataTable from '@views/system/basic/company/list/CustomDataTable'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, InputGroupText, Label, Row } from "reactstrap"
import Cookies from "universal-cookie"
import { customStyles, workerQnaListColumns } from "./data"
import { Calendar } from 'react-feather'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { pickerDateChange } from '@utils'
import Flatpickr from 'react-flatpickr'
import * as moment from 'moment'
import PropertyGroupCheckTable from "../../apps/cutomTable/PropertyGroupCheckTable"
import { useNavigate } from "react-router-dom"
import { API_DISASTER_WORKER_QNA_LIST, API_FIND_PROPERTY, ROUTE_CRITICAL_DISASTER_WORKER_QNA } from "../../../constants"
import { checkOnlyView, getTableData, getTableDataCallback } from "../../../utility/Utils"
import { useSelector } from "react-redux"
import { CRITICAL_QNA } from "../../../constants/CodeList"

import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from "../../../components/TotalLabel"

const WorkerQnaList = () => {
    const loginAuth = useSelector((state) => state.loginAuth)
	const cookies = new Cookies()
    const activeUser = Number(cookies.get('userId'))
    const property = cookies.get('property').value
	// const isManager = cookies.get('isManager') === 'true'
    const [isManager, setIsManager] = useState(false)
    const navigate = useNavigate()

    // state
    const today = moment()
    const past = moment().subtract(7, 'days')
    const [search, setSearch] = useState('')
	const [picker, setPicker] = useState([past.format('YYYY-MM-DD 00:00:00'), today.format('YYYY-MM-DD 23:59:59')])
    const [checkList, setCheckList] = useState(new Set())
    const [dataList, setDataList] = useState([])

	const handleRegisterBtn = () => {
        navigate(`${ROUTE_CRITICAL_DISASTER_WORKER_QNA}/form`, {state:{type:'register'}})
	}

    const getList = () => {
        const param = {
            picker: picker,
            search: search,
            is_manager: isManager
        }
        if (isManager) {
            param['property'] = [...checkList]
            getTableData(API_DISASTER_WORKER_QNA_LIST, param, setDataList)
            return
        }
        param['user_id'] = activeUser
        param['property'] = property
        getTableData(API_DISASTER_WORKER_QNA_LIST, param, setDataList)
    }

    const setPropList = (data) => {
        const propList = [...data.propList]
        const propIdSet = new Set()
        for (const prop of propList) {
            propIdSet.add(prop.value)
        }
        setCheckList(propIdSet)
        const param = {
            search: '',
            picker: [past.format('YYYY-MM-DD 00:00:00'), today.format('YYYY-MM-DD 23:59:59')],
            is_manager: isManager
        }
        if (isManager) {
            param['property'] = [...propIdSet]
            getTableData(API_DISASTER_WORKER_QNA_LIST, param, setDataList)
            return
        }
        param['user_id'] = activeUser
        param['property'] = property
        getTableData(API_DISASTER_WORKER_QNA_LIST, param, setDataList)
    }

    useEffect(() => {
        setIsManager(loginAuth.isManager)
        getTableDataCallback(API_FIND_PROPERTY, {list: true, user:activeUser}, setPropList)
    }, [])

    return (
        <Fragment>
            <Row>
				<div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='종사자의견목록' breadCrumbParent='종사자의견청취' breadCrumbActive={ isManager ? '종사자의견목록' : '나의 의견목록'} />
				</div>
			</Row>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                { isManager ? '종사자의견목록' : '나의 의견목록'}
                            </CardTitle>
							<Button hidden={checkOnlyView(loginAuth, CRITICAL_QNA, 'available_create')}
                                color='primary' onClick={() => { handleRegisterBtn() }}>등록</Button>
                        </CardHeader>
                        <CardBody>
                            <Row className="mb-1">
                                <Col md={4} xs={12} className="mb-1">
                                    <Row>
                                        <Col xs={2} className="d-flex align-items-center justify-content-start">
                                            기간
                                        </Col>
                                        <Col xs={10} className="px-0 d-flex align-items-center justify-content-start">
                                            <InputGroup>
                                                <Flatpickr
                                                    name='pickr'
                                                    className='form-control'
                                                    value={picker}
                                                    onChange={date => {
                                                        if (date.length === 2) { setPicker(pickerDateChange(date)) }
                                                    }}
                                                    style={{height: '42px'}}
                                                    options={{
                                                        mode: 'range',
                                                        ariaDateFormat:'Y-m-d',
                                                        locale: {
                                                            rangeSeparator: ' ~ '
                                                        },
                                                        locale: Korean
                                                    }}/>
                                                <InputGroupText>
                                                    <Calendar color='#B9B9C3'/>
                                                </InputGroupText>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={4} xs={12} className="mb-1">
                                    <Row>
                                        <Col xs={12} className="d-flex align-items-center justify-content-start">
                                            <InputGroup>
                                                <Input
                                                    name='name'
                                                    placeholder='의견 제목을 입력해주세요.'
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    value={search}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            getList()
                                                        }
                                                    }}
                                                    style={{height: '42px'}}
                                                    />
                                                <Button style={{zIndex:0}}
                                                    onClick={() => {
                                                        getList()
                                                    }}>검색</Button>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            { isManager ? 
                                <Row className="mb-2">
                                    <Col>
                                        사업소 선택
                                        <PropertyGroupCheckTable
                                            checkList={checkList}
                                            setCheckList={setCheckList}
                                            purpose='list'
                                        />
                                    </Col>
                                </Row>
                                : 
                                <></>
                            }
                            <TotalLabel 
                                num={3}
                                data={dataList.length}
                            />
                            <CustomDataTable
                                columns={workerQnaListColumns}
                                tableData={dataList}
                                selectType={false}
                                styles={customStyles}
                                detailAPI={`${ROUTE_CRITICAL_DISASTER_WORKER_QNA}/detail`}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default WorkerQnaList