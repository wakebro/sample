import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import { templatePageType } from "../data"
import { useSelector } from 'react-redux' //useDispatch
import { useEffect, useState } from "react"
import TenantCustomDataTable from "../../../../basic/area/tenant/list/TenantCustomTable"
import { API_DISASTER_TEMPLATE_EVALUATION_LIST } from "../../../../../constants"
import { checkOnlyView, getTableData, getTableDataCallback } from "../../../../../utility/Utils"
import TemplateCodeColumns from "./TemplateCodeColumns"
import { CRITICAL_EVALUATION_TEMPLATE } from "../../../../../constants/CodeList"
import TotalLabel from "../../../../../components/TotalLabel"

const EvaluationTemplateCode = () => {
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const loginAuth = useSelector((state) => state.loginAuth)
    const [dangerData, setDangerData] = useState([])
    // const [searchDetail, serSearchDetail] = useState('')
    const [searchDanger, serSearchDanger] = useState('')

    // 최상위 컴포넌트 아래로 컨트롤 되길 원해서 위에 추가
    // const handleDetailAddRowClick = () => {
    //     const copyDetailData = [...detailData]
    //     let tempId = Math.max.apply(Math, copyDetailData.map(row => row.id))
    //     tempId = Number.isFinite(tempId) ? tempId + 1 : 0
    //     copyDetailData.insert(0, {id: tempId, name:'', rowType:'register'})
    //     setDetailData(copyDetailData)
    // }
    const handleDangerAddRowClick = () => { 
        const copyDangerData = [...dangerData]
        let tempId = Math.max.apply(Math, copyDangerData.map(row => row.id))
        tempId = Number.isFinite(tempId) ? tempId + 1 : 0
        copyDangerData.insert(0, {id:tempId, name:'', rowType:'register'})
        setDangerData(copyDangerData)
    }

    const getDataInitCallback = (data) => {
        setDangerData(data.danger)
    }
    useEffect(() => {
        getTableDataCallback(API_DISASTER_TEMPLATE_EVALUATION_LIST, {search: ''}, getDataInitCallback)
    }, [])

    // 세부항목 검색
    // const getDetailListData = () => {
    //     getTableData(API_DISASTER_TEMPLATE_EVALUATION_LIST, {type: 0, search: searchDetail}, setDetailData)
    // }

    // 위험 분류 검색
    const getDangerListData = () => {
        getTableData(API_DISASTER_TEMPLATE_EVALUATION_LIST, {type: 1, search: searchDanger}, setDangerData)
    }

    return (
        <>
            <Row>
                {/* <Col lg={6} md={6} xs={12}>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {templatePageType[criticalDisaster.templateTab][0]}
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col lg={12} md={12} xs={12}>
                                    <Row>
                                        <Col lg={6} md={6} xs={12} className="mb-1">
                                            <InputGroup>
                                                <Input
                                                    value={searchDetail}
                                                    onChange={(e) => { serSearchDetail(e.target.value) }}
                                                    placeholder="세부 작업 명을 검색해보세요."
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            getDetailListData()
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    onClick={getDetailListData}
                                                >
                                                    검색
                                                </Button>
                                            </InputGroup>
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-1 d-flex justify-content-end">
                                            <Button hidden={checkOnlyView(loginAuth, CRITICAL_EVALUATION_TEMPLATE, 'available_create')}
                                                color="primary" onClick={handleDetailAddRowClick}>
                                                추가
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                {detailData &&
                                    <TenantCustomDataTable
                                        columns={
                                            TemplateCodeColumns({
                                                type:'detail', data:detailData, setData:setDetailData
                                            })
                                        } 
                                        tableData={detailData} 
                                        setTabelData={setDetailData} 
                                        selectType={false}
                                    />
                                }
                            </Row>
                        </CardBody>
                    </Card>
                </Col> */}
                <Col lg={12} md={12} xs={12}>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {templatePageType[criticalDisaster.templateTab][1]}
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col lg={12} md={12} xs={12}>
                                    <Row>
                                        <Col lg={6} md={6} xs={12} className="mb-1">
                                            <InputGroup>
                                                <Input
                                                    value={searchDanger}
                                                    onChange={(e) => { serSearchDanger(e.target.value) }}
                                                    placeholder="위험 분류 명을 검색해보세요."
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            getDangerListData()
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    onClick={getDangerListData}
                                                >
                                                    검색
                                                </Button>
                                            </InputGroup>
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-1 d-flex justify-content-end">
                                            <Button hidden={checkOnlyView(loginAuth, CRITICAL_EVALUATION_TEMPLATE, 'available_create')}
                                                color="primary" onClick={handleDangerAddRowClick}>
                                                추가
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <TotalLabel 
                                num={3}
                                data={dangerData.length}
                            />
                            <Row>
                                {dangerData &&
                                    <TenantCustomDataTable
                                        columns={
                                            TemplateCodeColumns({
                                                type:'danger', data:dangerData, setData:setDangerData
                                            })
                                        } 
                                        tableData={dangerData} 
                                        setTabelData={setDangerData} 
                                        selectType={false}
                                    />
                                }
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
export default EvaluationTemplateCode
