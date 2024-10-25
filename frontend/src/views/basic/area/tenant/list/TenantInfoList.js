import axios from 'axios'
import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, TabContent, TabPane, InputGroup } from "reactstrap"
import { API_BASICINFO_AREA_TENANT, ROUTE_BASICINFO_AREA_TENANT_FORM } from "../../../../../constants"
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import TenantCustomDataTable from '../list/TenantCustomTable'
import { TenantColumn } from '../TenantData'
import { getTableData } from '@utils'

const TenantInfoList = () => {
    const cookies = new Cookies()
    const [data, setData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [buildingList, setBuildingList] = useState([{ value:'', label: '건물전체'}])
    const [floorList, setFloorList] = useState([{ value:'', label: '층전체'}])
    const [selectedBuilding, setSelectedBuilding] =  useState(buildingList[0])
    const [selectedFloor, setSelectedFloor] =  useState(floorList[0])
    useAxiosIntercepter()
    console.log("빌딩리스트", buildingList)
    console.log("층리스트", floorList)
    console.log("data", data)

    useEffect(() => {
        // 전체리스트
        getTableData(API_BASICINFO_AREA_TENANT, {property:cookies.get('property').value, search:'', floor:'', building:''}, setData, setBuildingList)
    }, [])
    useEffect(() => {
        if (selectedBuilding.value !== '') {
            axios.get(API_BASICINFO_AREA_TENANT, {
                params:{property:cookies.get('property').value, search:'', floor:'', building:selectedBuilding.value}
            })
            .then(res => {
				setData(res.data.data)
                if (res.data.floor_list) {
                    const floorList = []
                    for (let i = 0; i < res.data.floor_list.length; i++) {
                        floorList.push({value:res.data.floor_list[i].id, label: res.data.floor_list[i].name})
                    }
                    setFloorList(floorList)
                }
			}) 
        } else {
            setFloorList([{ value:'', label: '층전체'}])
        }
    }, [searchValue, selectedFloor, selectedBuilding])

    return (
        <Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
                	<Breadcrumbs breadCrumbTitle='건물정보' breadCrumbParent='기본정보' breadCrumbActive='건물정보' />
				</div>
			</Row>
            <Card>
                <CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                    <CardTitle className="title">
                        입주사정보
                    </CardTitle>
                    <Row>
                        <Button color='primary' 
                            style={{marginLeft: '-22%'}}
                            tag={Link} 
                            to={ROUTE_BASICINFO_AREA_TENANT_FORM} 
                            state={{
                                API: API_BASICINFO_AREA_TENANT,
                                type:'register'
                            }}
                            >등록</Button>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col className='d-flex align-items-center mt-sm-0 mt-1' sm='7' md={10} style={{justifyContent: 'space-between', marginBottom:'1%'}}>
                            <Row  style={{ display: 'flex', alignItems: 'center' }}>
                                <Col md='1' style={{paddingRight: 'inherit'}}>
                                    <Col>건물</Col>
                                </Col>
                                <Col  md='3' sm='4' style={{padding: 'inherit'}}>
                                    <Select
                                        classNamePrefix={'select'}
                                        className="react-select"
                                        options={buildingList}
                                        value={selectedBuilding}
                                        onChange={(e) => setSelectedBuilding(e)}
                                    />
                                </Col>
                                <Col md='1' style={{paddingRight: 'inherit', alignItems: 'right'}}>
                                    <Col>층</Col>
                                </Col>
                                <Col md='2' sm='4' style={{paddingLeft: 'inherit'}}>
                                    <Select
                                        classNamePrefix={'select'}
                                        className="react-select"
                                        options={floorList}
                                        value={selectedFloor}
                                        onChange={(e) => setSelectedFloor(e)}
                                    />
                                </Col>
                                <Col md='4' sm='10' style={{padding: 'inherit'}}>
                                    <InputGroup>
                                        <Input 
                                            value={searchValue} 
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            // placeholder= {StandardtabNameList.find(item => activeTab in item)[activeTab]} 
                                            />
                                        <Button>검색</Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                {/* { data &&  */}
                    <TenantCustomDataTable
                        columns={TenantColumn} 
                        // tableData={data} 
                        // setTabelData={setData} 
                        // setTableSelect={setTableSelect}
                        selectType={false}
                        onRowClicked
                        // detailAPI={StandadDetailUrlObj[activeTab]}
                        noDataComponent
                    />
                {/* } */}
                </CardBody>
            </Card>
                   
        </Fragment>
    )

}
export default TenantInfoList