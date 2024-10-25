/* eslint-disable */
import { Fragment, useEffect } from "react"
import { Row, Col, Input, Badge, Table } from "reactstrap"
import { primaryColor, primaryHeaderColor } from "../../../../utility/Utils"

const SafetyTable = (props) => {
    const {
        employeeClassData, employeeIds,
        disasterTotal, setDisasterTotal,
        safetyEmployeeClassChoice, setSafetyEmployeeClassChoice,
        riskFormType, setRiskFormType,
        riskDetailType, setRiskDetailType,
        riskFEmployeeClassChoice, setRiskFEmployeeClassChoice,
        xlsxList, setXlsxList,
        pdfList, setPdfList
    } = props

    const tableList = ['checklist', 'riskDetail', 'riskForm', 'crticalEvaulation', 'workerQnA']
    const riskTypeList = ['notice', 'meeting', 'evaluation', 'counterplan', 'education', 'riskReport']
    const setObjList = {
        checklist : setSafetyEmployeeClassChoice,
        riskForm :setRiskFEmployeeClassChoice
    }
    const empObjList = {
        checklistEmp : safetyEmployeeClassChoice,
        riskDetailEmp : riskFormType, 
        detailType: riskDetailType,
        riskFormEmp: riskFEmployeeClassChoice
    }
    const empSetObjList = {
        checklistEmp : setSafetyEmployeeClassChoice,
        riskDetailEmp : setRiskFormType, 
        detailType: setRiskDetailType,
        riskFormEmp: setRiskFEmployeeClassChoice
    }
    const connectionObjects= {
        checklistEmp : 'checklist',
        riskDetailEmp : 'riskDetail', 
        detailType: 'riskDetail',
        riskFormEmp: 'riskForm'
    }

    const handleCheckboxClick = (value, emp) => {
        //all version
        if (value === 'all') {
            if (disasterTotal.length === 5) {
                setDisasterTotal([])
                setSafetyEmployeeClassChoice([])
                setRiskFormType([])
                setRiskDetailType([])
                setRiskFEmployeeClassChoice([])
                const newFilter = xlsxList.filter(el => el !== 'riskForm' && el !== 'checklist' && el !== 'riskDetail' && el !== 'workerQnA')
                setXlsxList(newFilter)
                const newPdfFilter = pdfList.filter(el => el !== 'checklist' && el !== 'riskDetail' && el !== 'crticalEvaulation')
                setPdfList(newPdfFilter)
            } else {
                setDisasterTotal(tableList)
                setSafetyEmployeeClassChoice(employeeIds)
                setRiskFormType([0,1,2,3])
                setRiskDetailType(riskTypeList)
                setRiskFEmployeeClassChoice(employeeIds)
                setXlsxList([...xlsxList, 'riskForm', 'checklist', 'riskDetail', 'workerQnA'])
                setPdfList([...pdfList, 'checklist', 'riskDetail', 'crticalEvaulation'])
            }
        //첫번째 input
        } else if (value === 'risk') {
           if (!disasterTotal.includes('riskDetail') && !disasterTotal.includes('riskForm')) {
                setDisasterTotal([...disasterTotal, 'riskDetail', 'riskForm'])
                setRiskFormType([0,1,2,3])
                setRiskDetailType(riskTypeList)
                setRiskFEmployeeClassChoice(employeeIds)
                setXlsxList([...xlsxList, 'riskForm', 'riskDetail'])
                setPdfList([...pdfList, 'riskDetail'])
           } else {
                const newFilter = disasterTotal.filter(el => el !== 'riskDetail' && el !== 'riskForm')
                setDisasterTotal(newFilter)
                setRiskFormType([])
                setRiskDetailType([])
                setRiskFEmployeeClassChoice([])
                const newXlsxFilter = xlsxList.filter(el => el !== 'riskForm' && el !== 'riskDetail')
                setXlsxList(newXlsxFilter)
                const newPdfFilter = pdfList.filter(el => el !== 'riskDetail')
                setPdfList(newPdfFilter)
           }
        // 메뉴명 input
        } else if (tableList.includes(value)) {
            if (!disasterTotal.includes(value)) {
                if (value === 'riskDetail') {
                    setRiskFormType([0,1,2,3])
                    setRiskDetailType(riskTypeList)
                } else {
                    if (value !== 'crticalEvaulation' && value !== 'workerQnA') setObjList[value](employeeIds)
                }
                if (value !== 'riskForm' && value !== 'workerQnA') setPdfList([...pdfList, value])
                if (value !== 'crticalEvaulation') setXlsxList([...xlsxList, value])
                setDisasterTotal([...disasterTotal, value])
            } else {
                if (value === 'riskDetail') {
                    setRiskFormType([])
                    setRiskDetailType([])
                } else {
                    if (value !== 'crticalEvaulation' && value !== 'workerQnA') setObjList[value]([])
                }
                const newXlsxFilter = xlsxList.filter(el => el !== value)
                setXlsxList(newXlsxFilter)
                if (value !== 'riskForm') {
                    const newPdfFilter = pdfList.filter(el => el !== value)
                    setPdfList(newPdfFilter)
                }
                const newDisasterTotal = disasterTotal.filter(el => el !== value)
                setDisasterTotal(newDisasterTotal)
            }
        } else {
            // 선택 항목 input
            const index = empObjList[value].indexOf(emp.id)
            if (index >= 0) {
                const object = empObjList[value]
                const NewFilter = object.filter(el => el !== emp.id)
                empSetObjList[value](NewFilter)
                if (value === 'riskDetailEmp' || value === 'detailType' ? riskFormType.length + riskDetailType.length === 1 : object.length === 1) {
                    if (value !== 'riskFormEmp') {
                        const newPdfFilter = pdfList.filter(el => el !== connectionObjects[value])
                        setPdfList(newPdfFilter)
                    }
                    const newXlsxFilter = xlsxList.filter(el => el !== connectionObjects[value])
                    setXlsxList(newXlsxFilter)
                    const newDisasterTotal = disasterTotal.filter(el => el !== connectionObjects[value])
                    setDisasterTotal(newDisasterTotal)
                } 
            } else {
                empSetObjList[value]([...empObjList[value], emp.id])
                if (!disasterTotal.includes(connectionObjects[value])) setDisasterTotal([...disasterTotal, connectionObjects[value]])
                if (value !== 'riskFormEmp') if (!pdfList.includes(connectionObjects[value])) setPdfList([...pdfList, connectionObjects[value]])
                if (!xlsxList.includes(connectionObjects[value])) setXlsxList([...xlsxList, connectionObjects[value]])
                
            }
        }
    }

    useEffect(() => {
        console.log(riskFormType)
    }, [riskFormType])

    return (
        <Fragment>
            <Row className='top' style={{marginTop:'2rem', marginBottom:'0.8rem'}}>
                <Col className="manage-report-font">중대재해관리<span className="manage-sub-font ms-2">{disasterTotal.length}개 파일 선택됨</span></Col>
            </Row>
            <Table bordered responsive style={{minWidth: '1440px'}}>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`, backgroundColor:primaryHeaderColor, textAlign:'center'}}>
                        <td style={{width:'10%'}}>
                            <Input type="checkbox" id="disaster-total" checked={disasterTotal.length === 5} readOnly onClick={() => handleCheckboxClick('all', 'all')}/>
                        </td>
                        <td style={{width:'16%'}}>메뉴명</td>
                        <td style={{borderRadius:0}}>선택 항목</td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="disaster-check" checked={disasterTotal.includes('checklist')} readOnly onClick={() => handleCheckboxClick('checklist', 'checklist')}/>
                        </td>
                        <td>일일안전점검</td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}></td>
                        <td>
                            <Input type="checkbox" id="disaster-checklist" checked={disasterTotal.includes('checklist')} readOnly onClick={() => handleCheckboxClick('checklist', 'checklist')}/>&nbsp;
                            안전점검일지 &nbsp;
                            <Badge color='light-skyblue' pill>PDF</Badge>&nbsp;
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data, index) => (
                                        <Col key={`check_${data.id}`} md={1} xs={2} className="px-0">
                                            <Input 
                                                type="checkbox" 
                                                checked={safetyEmployeeClassChoice.includes(data.id)} 
                                                readOnly id={data.id} 
                                                onClick={() => handleCheckboxClick('checklistEmp', data)} 
                                            />
                                            &nbsp;<span>{data.name}</span>
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
                            <Input 
                                type="checkbox" 
                                id="disaster-risk" 
                                checked={disasterTotal.includes('riskDetail') || disasterTotal.includes('riskForm')} 
                                readOnly 
                                onClick={() => handleCheckboxClick('risk', 'risk')}/>
                        </td>
                        <td>
                            위험성평가 &nbsp;
                            <Badge color='light-secondary' pill>첨부파일</Badge>
                        </td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td rowSpan="2" style={{textAlign:'center'}}></td>
                        <td rowSpan="2">
                            <Input 
                                type="checkbox" 
                                id="disaster-detail" 
                                checked={disasterTotal.includes('riskDetail')} 
                                readOnly 
                                onClick={() => handleCheckboxClick('riskDetail', 'riskDetail')}
                            />&nbsp;
                            작업현황 상세 &nbsp;
                            <Badge color='light-skyblue' pill>PDF</Badge>
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="disaster-notice" checked={riskFormType.includes(0)} readOnly onClick={() => handleCheckboxClick('riskDetailEmp', {id: 0})}/>&nbsp;<span>빈도강도(3x3)</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="disaster-notice" checked={riskFormType.includes(1)} readOnly onClick={() => handleCheckboxClick('riskDetailEmp', {id: 1})}/>&nbsp;<span>빈도강도(5x5)</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="disaster-notice" checked={riskFormType.includes(2)} readOnly onClick={() => handleCheckboxClick('riskDetailEmp', {id:2})}/>&nbsp;<span>3단계</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="disaster-notice" checked={riskFormType.includes(3)} readOnly onClick={() => handleCheckboxClick('riskDetailEmp', {id:3})}/>&nbsp;<span>체크리스트</span>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td>
                            <Row style={{display:'flex'}}>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="disaster-notice" checked={riskDetailType.includes('notice')} readOnly onClick={() => handleCheckboxClick('detailType', {id:'notice'})}/>&nbsp;<span>실시 공고</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="disaster-meeting" checked={riskDetailType.includes('meeting')} readOnly onClick={() => handleCheckboxClick('detailType', {id:'meeting'})}/>&nbsp;<span>사전 회의</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="disaster-evaluation" checked={riskDetailType.includes('evaluation')} readOnly onClick={() => handleCheckboxClick('detailType', {id:'evaluation'})}/>&nbsp;<span>위험성평가</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="disaster-counterplan" checked={riskDetailType.includes('counterplan')} readOnly onClick={() => handleCheckboxClick('detailType', {id:'counterplan'})}/>&nbsp;<span>예방대책</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="disaster-education" checked={riskDetailType.includes('education')} readOnly onClick={() => handleCheckboxClick('detailType', {id:'education'})}/>&nbsp;<span>안전 교육</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="disaster-report" checked={riskDetailType.includes('riskReport')} readOnly onClick={() => handleCheckboxClick('detailType', {id:'riskReport'})}/>&nbsp;<span>결과 보고서</span>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}></td>
                        <td>
                            <Input type="checkbox" id="disaster-form" checked={disasterTotal.includes('riskForm')} readOnly onClick={() => handleCheckboxClick('riskForm', 'riskForm')}/>&nbsp;
                            위험성평가 양식
                        </td>
                        <td>
                            {/* <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data, index) => (
                                        <Col key={`risk_${data.id}`} md={1} xs={2} className="px-0">
                                            <Input 
                                                type="checkbox" 
                                                checked={riskFEmployeeClassChoice.includes(data.id)} 
                                                readOnly id={data.id} 
                                                onClick={() => handleCheckboxClick('riskFormEmp', data)} 
                                            />
                                            &nbsp;<span>{data.name}</span>
                                        </Col>
                                    ))
                                }   
                            </Row> */}
                        </td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input 
                                type="checkbox" 
                                id="disaster-risk" 
                                checked={disasterTotal.includes('workerQnA')} 
                                readOnly 
                                onClick={() => handleCheckboxClick('workerQnA', 'workerQnA')}/>
                        </td>
                        <td>
                            종사자 의견청취
                        </td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input 
                                type="checkbox" 
                                id="disaster-risk" 
                                checked={disasterTotal.includes('crticalEvaulation')} 
                                readOnly 
                                onClick={() => handleCheckboxClick('crticalEvaulation', 'crticalEvaulation')}/>
                        </td>
                        <td>
                            협력업체평가 &nbsp;
                            <Badge color='light-skyblue' pill>PDF</Badge>
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
        </Fragment>
    )
}
export default SafetyTable
