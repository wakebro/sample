import { Fragment } from "react"
import { Row, Col, Input, Badge, Table } from "reactstrap"
import { primaryColor, primaryHeaderColor } from "../../../../utility/Utils"

const InspectionTable = (props) => {
    const {employeeClassData, employeeIds,
        inspectionTotal, setInspectionTotal, 
        inspectionChoice, setInspectionChoice,
        performanceChoice, setPerformanceChoice,
        outsourcingChoice, setOutsourcingChoice,
        complainChoice, setComplainChoice,
        complainTypeChoice, setComplainTypeChoice,
        defectChoice, setDefectChoice,
        xlsxList, setXlsxList,
        pdfList, setPdfList
    } = props

    const tableList = ['inspection', 'performance', 'outsourcing', 'manual', 'complain', 'defect']
    const employeeClassTabList = ['inspectionEmp', 'performanceEmp', 'outsourcingEmp', 'complainEmp', 'complainType', 'defectEmp']
    const complainTypeList = ['detail', 'work', 'material', 'tool']
    const includeEmpTabList = {
        inspection: 'inspectionEmp',
        performance: 'performanceEmp',
        outsourcing: 'outsourcingEmp',
        complain: 'complainEmp',
        defect: 'defectEmp'
    }
    const connectionObjects = {
        inspectionEmp: 'inspection',
        performanceEmp: 'performance',
        outsourcingEmp: 'outsourcing',
        complainEmp: 'complain',
        complainType: 'complain',
        defectEmp: 'defect'
    }
    const setObjectList = {
        inspectionEmp : setInspectionChoice,
        performanceEmp: setPerformanceChoice,
        outsourcingEmp: setOutsourcingChoice,
        complainEmp: setComplainChoice,
        complainType: setComplainTypeChoice,
        defectEmp: setDefectChoice
    }
    const objectList = {
        inspectionEmp : inspectionChoice,
        performanceEmp: performanceChoice,
        outsourcingEmp: outsourcingChoice,
        complainEmp: complainChoice,
        complainType: complainTypeChoice,
        defectEmp: defectChoice
    }
    const compareList = {
        inspectionEmp : employeeIds,
        performanceEmp: employeeIds,
        outsourcingEmp: employeeIds,
        complainEmp: employeeIds,
        complainType: complainTypeChoice,
        defectEmp: employeeIds
    }

    const pdfObjList = ['inspection', 'outsourcing']

    const handleCheckboxClick = (value, emp) => {
        if (value === 'all') { 
            if (inspectionTotal.length === 6) {
                setInspectionTotal([])
                setInspectionChoice([])
                setPerformanceChoice([])
                setOutsourcingChoice([])
                setComplainChoice([])
                setComplainTypeChoice([])
                setDefectChoice([])
                const newFilter = xlsxList.filter(el => el !== 'performance' && el !== 'manual' && el !== 'complain' && el !== 'defect' && el !== 'inspection' && el !== 'outsourcing')
                setXlsxList(newFilter)
                const newPdfFilter = pdfList.filter(el => el !== 'inspection' && el !== 'outsourcing')
                setPdfList(newPdfFilter)
            } else {
                setInspectionTotal(tableList)
                setInspectionChoice(employeeIds)
                setPerformanceChoice(employeeIds)
                setOutsourcingChoice(employeeIds)
                setComplainChoice(employeeIds)
                setComplainTypeChoice(complainTypeList)
                setDefectChoice(employeeIds)
                setXlsxList([...xlsxList, 'performance', 'manual', 'complain', 'defect', 'inspection', 'outsourcing'])
                setPdfList([...pdfList, 'inspection', 'outsourcing'])
            }
        } else if (value === 'inspect') {
            if (!inspectionTotal.includes('inspection') && !inspectionTotal.includes('performance')) {
                setInspectionTotal([...inspectionTotal, 'inspection', 'performance'])
                setXlsxList([...xlsxList, 'performance', 'inspection'])
                setPdfList([...pdfList, 'inspection'])
                setInspectionChoice(employeeIds)
                setPerformanceChoice(employeeIds)
            } else {
                const newFilter = inspectionTotal.filter(el => el !== 'inspection' && el !== 'performance')
                setInspectionTotal(newFilter)
                setInspectionChoice([])
                setPerformanceChoice([])
                const newXlsxFilter = xlsxList.filter(el => el !== 'performance' && el !== 'inspection')
                setXlsxList(newXlsxFilter)
                const newPdfFilter = pdfList.filter(el => el !== 'inspection')
                setPdfList(newPdfFilter)
            }
        } else if (tableList.includes(value)) {
            if (inspectionTotal.includes(value)) {
                if (employeeClassTabList.includes(includeEmpTabList[value])) {
                    const empTabName = includeEmpTabList[value]
                    setObjectList[empTabName]([])
                }
                if (value === 'complain') {
                    setComplainTypeChoice([])
                }
                const newFilter = inspectionTotal.filter(el => el !== value)
                setInspectionTotal(newFilter)
                if (pdfObjList.includes(value)) {
                    const newPdfFilter = pdfList.filter(el => el !== value)
                    setPdfList(newPdfFilter)
                    const newXlsxFilter = xlsxList.filter(el => el !== value)
                    setXlsxList(newXlsxFilter)
                } else {
                    const newXlsxFilter = xlsxList.filter(el => el !== value)
                    setXlsxList(newXlsxFilter)
                }
            } else {
                if (employeeClassTabList.includes(includeEmpTabList[value])) {
                    const empTabName = includeEmpTabList[value]
                    setObjectList[empTabName](compareList[empTabName])
                }
                if (value === 'complain') {
                    setComplainTypeChoice(complainTypeList)
                }
                setInspectionTotal([...inspectionTotal, value])
                if (pdfObjList.includes(value)) {
                    setPdfList([...pdfList, value])
                    setXlsxList([...xlsxList, value])
                } else {
                    setXlsxList([...xlsxList, value])
                }
            }
        } else if (employeeClassTabList.includes(value)) {
            const index = objectList[value].indexOf(emp.id)
            if (index >= 0) {
                const object = objectList[value]
                const NewFilter = object.filter(el => el !== emp.id)
                setObjectList[value](NewFilter)
                if (objectList[value].length === 1) {
                    const newFilter = inspectionTotal.filter(el => el !== connectionObjects[value])
                    setInspectionTotal(newFilter)
                    if (pdfObjList.includes(connectionObjects[value])) {
                        const newPdfFilter = pdfList.filter(el => el !== connectionObjects[value])
                        setPdfList(newPdfFilter)
                        const newXlsxFilter = xlsxList.filter(el => el !== connectionObjects[value])
                        setXlsxList(newXlsxFilter)
                    } else {
                        const newXlsxFilter = xlsxList.filter(el => el !== connectionObjects[value])
                        setXlsxList(newXlsxFilter)
                    }
                }
            } else {
                setObjectList[value]([...objectList[value], emp.id])
                if (!inspectionTotal.includes(connectionObjects[value])) setInspectionTotal([...inspectionTotal, connectionObjects[value]])
                if (pdfObjList.includes(connectionObjects[value])) {
                    if (!pdfList.includes(connectionObjects[value])) setPdfList([...pdfList, connectionObjects[value]])
                    if (!xlsxList.includes(connectionObjects[value])) setXlsxList([...xlsxList, connectionObjects[value]])
                } else {
                    if (!xlsxList.includes(connectionObjects[value])) setXlsxList([...xlsxList, connectionObjects[value]])
                }
            }
        }
    }

    return (
        <Fragment>
            <Row className='top' style={{marginTop:'2rem', marginBottom:'0.8rem'}}>
                <Col className="manage-report-font">점검현황<span className="manage-sub-font ms-2">{inspectionTotal.length}개 파일 선택됨</span></Col>
            </Row>
            <Table bordered responsive style={{minWidth: '1440px'}}>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`, backgroundColor:primaryHeaderColor, textAlign:'center'}}>
                        <td style={{width:'10%'}}>
                            <Input type="checkbox" id="report-total" checked={inspectionTotal.length === 6} readOnly onClick={() => handleCheckboxClick('all', 'all')}/>
                        </td>
                        <td style={{width:'16%'}}>메뉴명</td>
                        <td style={{borderRadius:0}}>선택 항목</td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={inspectionTotal.includes('inspection') || inspectionTotal.includes('performance')} readOnly onClick={() => handleCheckboxClick('inspect', 'inspect')}/>
                        </td>
                        <td>자체점검</td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}></td>
                        <td>
                            <Input type="checkbox" id="report-total" checked={inspectionTotal.includes('inspection')} readOnly onClick={() => handleCheckboxClick('inspection', 'inspection')}/>&nbsp;
                            점검일지 &nbsp;
                            <Badge color='light-skyblue' pill>PDF</Badge>&nbsp;
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" checked={inspectionChoice.includes(data.id)} readOnly id={data.id} onClick={() => handleCheckboxClick('inspectionEmp', data)} />&nbsp;<span>{data.name}</span>
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
                            <Input type="checkbox" id="report-total" checked={inspectionTotal.includes('performance')} readOnly onClick={() => handleCheckboxClick('performance')}/>&nbsp;
                            점검실적표
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0"> 
                                            <Input type="checkbox" checked={performanceChoice.includes(data.id)} readOnly id={data.id} onClick={() => handleCheckboxClick('performanceEmp', data)} />&nbsp;<span>{data.name}</span>
                                        </Col>
                                    ))
                                } 
                            </Row>
                        </td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={inspectionTotal.includes('outsourcing')} readOnly onClick={() => handleCheckboxClick('outsourcing')}/>&nbsp;
                        </td>
                        <td>
                            외주점검 &nbsp;
                            <Badge color='light-skyblue' pill>PDF</Badge>&nbsp;
                            <Badge color='light-secondary' pill>첨부파일</Badge>
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" id={data.id} checked={outsourcingChoice.includes(data.id)} readOnly onClick={() => handleCheckboxClick('outsourcingEmp', data)} />&nbsp;<span>{data.name}</span>
                                        </Col>
                                    ))
                                }   
                            </Row>
                        </td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={inspectionTotal.includes('manual')} readOnly onClick={() => handleCheckboxClick('manual')}/>&nbsp;
                        </td>
                        <td>
                            유지관리메뉴얼 &nbsp;
                            <Badge color='light-secondary' pill>첨부파일</Badge>
                        </td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={inspectionTotal.includes('complain')} readOnly onClick={() => handleCheckboxClick('complain')}/>&nbsp;
                        </td>
                        <td>불편신고 및 작업현황</td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td rowSpan="2" style={{textAlign:'center'}}></td>
                        <td rowSpan="2">
                            <Input type="checkbox" id="report-total" checked={inspectionTotal.includes('complain')} readOnly onClick={() => handleCheckboxClick('complain')}/>&nbsp;
                            작업현황 상세
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" id={data.id} checked={complainChoice.includes(data.id)} readOnly onClick={() => handleCheckboxClick('complainEmp', data)} />&nbsp;<span>{data.name}</span>
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
                                <Input type="checkbox" id="report-total" checked={complainTypeChoice.includes('detail')} readOnly onClick={() => handleCheckboxClick('complainType', {id:'detail'})}/>&nbsp;<span>진행현황</span>
                            </Col>
                            <Col md={1} xs={2} className="px-0">
                                <Input type="checkbox" id="report-total" checked={complainTypeChoice.includes('work')} readOnly onClick={() => handleCheckboxClick('complainType', {id:'work'})}/>&nbsp;<span>작업자</span>
                            </Col>
                            <Col md={1} xs={2} className="px-0">
                                <Input type="checkbox" id="report-total" checked={complainTypeChoice.includes('material')} readOnly onClick={() => handleCheckboxClick('complainType', {id:'material'})}/>&nbsp;<span>자재</span>
                            </Col>
                            <Col md={1} xs={2} className="px-0">
                                <Input type="checkbox" id="report-total" checked={complainTypeChoice.includes('tool')} readOnly onClick={() => handleCheckboxClick('complainType', {id:'tool'})}/>&nbsp;<span>공구비품</span>
                            </Col>
                        </Row>
                        </td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={inspectionTotal.includes('defect')} readOnly onClick={() => handleCheckboxClick('defect')}/>&nbsp;
                        </td>
                        <td>하자관리</td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" id={data.id} checked={defectChoice.includes(data.id)} readOnly onClick={() => handleCheckboxClick('defectEmp', data)} />&nbsp;<span>{data.name}</span>
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
export default InspectionTable