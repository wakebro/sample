import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import Select from 'react-select'
import Cookies from "universal-cookie"

import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from 'reactstrap'
import CustomDataTable from '../../../../../components/CustomDataTable'
import {
    API_BASICINFO_AREA_BUILDING_DRAWING_LIST,
    API_BASICINFO_AREA_BUILDING_DRAWING_SELECT_ARRAY,
    API_SPACE_BUILDING,
    ROUTE_BASICINFO_AREA_DRAWING_DETAIL,
    ROUTE_BASICINFO_AREA_DRAWING_FORM
} from '../../../../../constants'
import CustomHelpCircle from '../../../../apps/CustomHelpCircle'

import axios from 'axios'
import { useSelector } from 'react-redux'
import { BASIC_INFO_AREA_DRAWING } from '../../../../../constants/CodeList'
import { checkOnlyView, getTableData, selectListType, sweetAlert } from "../../../../../utility/Utils"
import { drawingColumns } from '../data'
import TotalLabel from '../../../../../components/TotalLabel'


const DrawingIndex = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const navigate = useNavigate()
    const loginAuth = useSelector((state) => state.loginAuth)

    const [searchValue, setSearchValue] = useState('')
    const [buildingList, setbuildingList] = useState([{ value: '', label: '건물전체' }])
    const [selectBuilding, setSelectBuilding] = useState({value: '', label: '건물전체'})
    const [employeeClassOptions, setEmployeeClassOptions] = useState([{ value: '', label: '전체' }])
    const [employeeClass, setEmployeeClass] = useState({value: '', label: '전체'})
    const [data, setData] = useState([])
    const id = undefined

    const handleSearchWord = (e) => {
		const value = e.target.value
		setSearchValue(value)
	}

    // 등록 버튼 클릭 이벤트 처리
	const handleRegisterClickBtn = () => {
		if (!buildingList || buildingList.length <= 1) {
			sweetAlert('', '등록된 건물이 없습니다.<br/> 건물을 먼저 등록해주세요.', 'warning', 'center')
			// navigate(ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD, {state: {pageType:'register', key: 'building'}})
			return
		}
		navigate(`${ROUTE_BASICINFO_AREA_DRAWING_FORM}/${id}`, {state: {pageType:'register'}})
	}

    useEffect(() => {
        axios.get(API_SPACE_BUILDING, {params: {property: cookies.get('property').value}})
        .then(res => {
            const tempList = [{label: '건물전체', value:''}]
			res.data.map(row => tempList.push(selectListType('custom1', row, ['code', 'name'], 'id')))
            setbuildingList(tempList)
        })
        getTableData(API_BASICINFO_AREA_BUILDING_DRAWING_SELECT_ARRAY, {property_id: cookies.get('property').value, type: 'list'}, setEmployeeClassOptions)
    }, [])

    useEffect(() => {
		getTableData(API_BASICINFO_AREA_BUILDING_DRAWING_LIST, {property: cookies.get('property').value, building: selectBuilding.value, select: employeeClass.value, search: searchValue}, setData)
    }, [])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='도면정보관리' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='도면정보관리' />
				</div>
            </Row>
            <Card>
                <CardHeader>
                    <CardTitle>
                        도면정보관리
                            <CustomHelpCircle
                                id={'drawingHelp'}
                                content={'도면정보관리는 건물를 먼저 등록 해야합니다.'}
                            />
                    </CardTitle>
                    <Button 
                        color='primary'
                        hidden={checkOnlyView(loginAuth, BASIC_INFO_AREA_DRAWING, 'available_create')}
                        onClick={handleRegisterClickBtn}
                    > 등록
                    </Button>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col lg={10} md={12} sm={12} xs={12}>
                            <Row>
                                <Col className='mb-1'md={3} xs={12}>
                                    <Row>
                                        <Col xs={3}className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }} htmlFor='jobSelect'>건물</Col>
                                        <Col xs={9}>
                                        <Select
                                            name='building'
                                            classNamePrefix={'select'}
                                            className="react-select"
                                            options={buildingList}
                                            value={selectBuilding}
                                            onChange={(e) => setSelectBuilding(e)}
                                        />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className='mb-1'md={3} xs={12}>
                                    <Row>
                                        <Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>직종</Col>
                                        <Col xs={9}>
                                        <Select
                                            name='employeeClass'
                                            classNamePrefix={'select'}
                                            className="react-select"
                                            options={employeeClassOptions}
                                            onChange={(e) => setEmployeeClass(e)}
                                            value={employeeClass}

                                        />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className='mb-1'md={4} xs={12}>
                                    <Row>
                                        <Col>
                                            <InputGroup>
                                                <Input
                                                    value={searchValue}
                                                    onChange={handleSearchWord}
                                                    placeholder='도면명을 입력해주세요.'
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            getTableData(API_BASICINFO_AREA_BUILDING_DRAWING_LIST, {
                                                                property: cookies.get('property').value, 
                                                                building: selectBuilding.value, 
                                                                select: employeeClass.value, 
                                                                search: searchValue
                                                            }, setData)
                                                        }
                                                    }}
                                                />
                                                <Button 
                                                    style={{zIndex:0}}
                                                    onClick={() => {
                                                        getTableData(API_BASICINFO_AREA_BUILDING_DRAWING_LIST, {
                                                            property: cookies.get('property').value, 
                                                            building: selectBuilding.value, 
                                                            select: employeeClass.value, 
                                                            search: searchValue
                                                        }, setData)
                                                    }}
                                                >검색</Button>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <TotalLabel 
                        num={3}
                        data={data.length}
                    />
                    <CustomDataTable 
                        columns={drawingColumns}
                        tableData={data} 
                        selectType={false}
                        detailAPI={ROUTE_BASICINFO_AREA_DRAWING_DETAIL}
                    />
                </CardBody>
            </Card>
        </Fragment>
    )

}

export default DrawingIndex