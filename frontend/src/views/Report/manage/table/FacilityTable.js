import { Fragment } from "react"
import { Row, Col, Input, Badge, Table } from "reactstrap"
import { primaryColor, primaryHeaderColor } from "../../../../utility/Utils"

const FacilityTable = (props) => {
    const {employeeClassData, employeeIds,
        materialChoiceTotal, setMaterialChoiceTotal,
        materialInfoType, setMaterialInfoType,
        materialInfoChoice, setMaterialInfoChoice,
        materialLogChoice, setMaterialLogChoice,
        materialPerformanceChoice, setMaterialPerformanceChoice,
        materialTotalChoice, setMaterialTotalChoice,
        xlsxList, setXlsxList
    } = props

    const tabList = ['materialInfo', 'materialStockLog', 'materialPerformance', 'materialTotal']
    const typeList = ['list', 'replace']

    const setObjectList = {
        materialInfo: setMaterialInfoChoice,
        materialInfoEmp : setMaterialInfoChoice,
        materialType :setMaterialInfoType,
        materialStockLog: setMaterialLogChoice,
        materialPerformance: setMaterialPerformanceChoice,
        materialTotal: setMaterialTotalChoice
    }

    const objectList = {
        materialInfoEmp : materialInfoChoice,
        materialType : materialInfoType,
        materialStockLog: materialLogChoice,
        materialPerformance: materialPerformanceChoice,
        materialTotal: materialTotalChoice
    }

    const compareList = {
        materialInfo : employeeIds,
        materialType : typeList,
        materialStockLog: employeeIds,
        materialPerformance: employeeIds,
        materialTotal: employeeIds
    }

    const connectionObjects = {
        materialInfoEmp : "materialInfo",
        materialType : "materialInfo",
        materialStockLog: "materialStockLog",
        materialPerformance: "materialPerformance",
        materialTotal: "materialTotal"
    }

    const handleCheckboxClick = (value, emp) => {
        if (value === 'all') { 
            if (materialChoiceTotal.length === 4) {
                setMaterialChoiceTotal([])
                setMaterialInfoType([])
                setMaterialInfoChoice([])
                setMaterialLogChoice([])
                setMaterialPerformanceChoice([])
                setMaterialTotalChoice([])
                const newFilter = xlsxList.filter(el => el !== 'materialInfo' && el !== 'materialStockLog' && el !== 'materialPerformance' && el !== 'materialTotal')
                setXlsxList(newFilter)
            } else {
                setMaterialChoiceTotal(tabList)
                setMaterialInfoType(typeList)
                setMaterialInfoChoice(employeeIds)
                setMaterialLogChoice(employeeIds)
                setMaterialPerformanceChoice(employeeIds)
                setMaterialTotalChoice(employeeIds)
                setXlsxList([...xlsxList, 'materialInfo', 'materialStockLog', 'materialPerformance', 'materialTotal'])
            }
        } else if (tabList.includes(emp)) {
            if (materialChoiceTotal.includes(emp)) {
                if (emp === 'materialInfo') {
                    setMaterialInfoType([])
                }
                const newFilter = materialChoiceTotal.filter(el => el !== emp)
                setMaterialChoiceTotal(newFilter)
                const newXlsxFilter = xlsxList.filter(el => el !== emp)
                setXlsxList(newXlsxFilter)
                setObjectList[emp]([])
            } else {
                console.log("value", value)
                console.log("emp", emp)
                if (emp === 'materialInfo') {
                    setMaterialInfoType(typeList)
                }
                setMaterialChoiceTotal([...materialChoiceTotal, emp])
                setXlsxList([...xlsxList, emp])
                setObjectList[emp](compareList[emp])
            }
        } else {
            const index = objectList[value].indexOf(emp.id)
            if (index >= 0) {
                const object = objectList[value]
                const NewFilter = object.filter(el => el !== emp.id)
                setObjectList[value](NewFilter)
                if (connectionObjects[value] === 'materialInfo') {
                    if (materialInfoType.length + materialInfoChoice.length === 1) {
                        const newFilter = materialChoiceTotal.filter(el => el !== connectionObjects[value])
                        setMaterialChoiceTotal(newFilter)
                        const newXlsxFilter = xlsxList.filter(el => el !== connectionObjects[value])
                        setXlsxList(newXlsxFilter)
                    }
                } else {
                    if (objectList[value].length === 1) {
                        const newFilter = materialChoiceTotal.filter(el => el !== connectionObjects[value])
                        setMaterialChoiceTotal(newFilter)
                        const newXlsxFilter = xlsxList.filter(el => el !== connectionObjects[value])
                        setXlsxList(newXlsxFilter)
                    }
                }
            } else {
                setObjectList[value]([...objectList[value], emp.id])
                if (!materialChoiceTotal.includes(connectionObjects[value])) setMaterialChoiceTotal([...materialChoiceTotal, connectionObjects[value]])
                if (!xlsxList.includes(connectionObjects[value])) setXlsxList([...xlsxList, connectionObjects[value]])
            }
        }

    }
    
    return (
        <Fragment>
            <Row className='top' style={{marginTop:'2rem', marginBottom:'0.8rem'}}>
                <Col className="manage-report-font">시설관리<span className="manage-sub-font ms-2">{materialChoiceTotal.length}개 파일 선택됨</span></Col>
            </Row>
            <Table bordered responsive style={{minWidth: '1440px'}}>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`, backgroundColor:primaryHeaderColor, textAlign:'center'}}>
                        <td style={{width:'10%'}}></td>
                        <td style={{width:'16%'}}>메뉴명</td>
                        <td style={{borderRadius:0}}>선택 항목</td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total"checked={materialChoiceTotal.length > 0} readOnly onClick={() => handleCheckboxClick('all')}/>
                        </td>
                        <td>자재관리</td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td rowSpan="2" style={{textAlign:'center'}}></td>
                        <td rowSpan="2">
                            <Input type="checkbox" id="report-total" checked={materialChoiceTotal.includes('materialInfo')} readOnly onClick={() => handleCheckboxClick('materialInfo', 'materialInfo')}/>&nbsp;
                            작업현황 상세
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" id={data.id} checked={materialInfoChoice.includes(data.id)} readOnly onClick={() => handleCheckboxClick('materialInfoEmp', data)} />&nbsp;<span>{data.name}</span>
                                        </Col>
                                    ))
                                }   
                            </Row>
                        </td>
                    </tr>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td>
                            <Row style={{display:'flex'}}>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="report-total" checked={materialInfoType.includes('list')} readOnly onClick={() => handleCheckboxClick('materialType', {id:'list'})}/>&nbsp;<span>자재이력</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="report-total" checked={materialInfoType.includes('replace')} readOnly onClick={() => handleCheckboxClick('materialType', {id:'replace'})}/>&nbsp;<span>대체자재</span>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}></td>
                        <td>
                            <Input type="checkbox" id="report-total"  checked={materialChoiceTotal.includes('materialStockLog')} readOnly onClick={() => handleCheckboxClick('materialStockLog', 'materialStockLog')}/>&nbsp;
                            입출고현황
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" id={data.id}  checked={materialLogChoice.includes(data.id)} readOnly onClick={() => handleCheckboxClick('materialStockLog', data)} />&nbsp;<span>{data.name}</span>
                                        </Col>
                                    ))
                                }   
                            </Row>
                        </td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}></td>
                        <td>
                            <Input type="checkbox" id="report-total" checked={materialChoiceTotal.includes('materialPerformance')} readOnly onClick={() => handleCheckboxClick('materialPerformance', 'materialPerformance')}/>&nbsp;
                            자재실적조회
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" checked={materialPerformanceChoice.includes(data.id)} readOnly id={data.id} onClick={() => handleCheckboxClick('materialPerformance', data)} />&nbsp;<span>{data.name}</span>
                                        </Col>
                                    ))
                                }   
                            </Row>
                        </td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}></td>
                        <td>
                            <Input type="checkbox" id="report-total" checked={materialChoiceTotal.includes('materialTotal')} readOnly onClick={() => handleCheckboxClick('materialTotal', 'materialTotal')}/>&nbsp;
                            입출고집계표
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" id={data.id} checked={materialTotalChoice.includes(data.id)} readOnly onClick={() => handleCheckboxClick('materialTotal', data)} />&nbsp;<span>{data.name}</span>
                                        </Col>
                                    ))
                                }   
                            </Row>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Fragment>
    )
}
export default FacilityTable