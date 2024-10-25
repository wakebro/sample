/* eslint-disable */
import { Fragment, useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Row, Col, Input, Badge, CardFooter } from "reactstrap"
import Breadcrumbs from '@components/breadcrumbs'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import * as moment from 'moment'
import { API_REPORT_MANAGE_XLSX, ROUTE_REPORT_MANAGE_INSPECTION_DETAIL_PDF, 
    ROUTE_REPORT_MANAGE_OUTSOURCING_DETAIL_PDF, ROUTE_REPORT_OPERATE_EXPORT, 
    API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, ROUTE_REPORT_MANAGE_DISASTER_DETAIL_PDF,
    ROUTE_CRITICAL_CORPERATION_EVALUATION_EXPORT, ROUTE_REPORT_MANAGE_DISASTER_REPORT_PDF
} from "../../../constants"
import {quarterList} from '../ReportData'
import axios from "axios"
import Cookies from "universal-cookie"
import SearchFilter from "./SearchFilter"
import ReportTalbe from "./table/ReportTable"
import ScheduleTalbe from "./table/ScheduleTable"
import BasicInfoTable from "./table/BasicInfoTable"
import InspectionTable from "./table/InspectionTable"
import SafetyTable from './table/SafetyTable'
import FacilityTable from "./table/FacilityTable"
import EducationTable from "./table/EducationTable"
import EnergyTable from "./table/EnergyTable"
import BusinessTable from "./table/BusinessTable"
import { sweetAlert } from "../../../utility/Utils"

const yearList = []
const currentYear = new Date().getFullYear()
// 1970으로 고정
const startYear = 1970
for (let year = currentYear; year >= startYear; year--) {
    yearList.push({ label: `${year}년`, value: `${year}` })
}

const ReportManage = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const [picker, setPicker] = useState([moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
    const [year, setYear] = useState(yearList[0])
    const [quarter, setQuarter] = useState(quarterList[0])
    const [radioValue, setRadioValue] = useState('period')
    const [filters, setFilters] = useState(['report', 'schedule', 'basicInfo', 'inspection', 'safety', 'facility', 'education', 'energy', 'business']) //중대재 포함
    // const [filters, setFilters] = useState(['report', 'schedule', 'basicInfo', 'inspection', 'facility', 'education', 'energy', 'business']) //중대재 미포함
    const [employeeClassData, setEmployeeClassData] = useState([])
    const [employeeIds, setEmployeeIds] = useState([])
    // 보고서
    const [reportType, setReportType] = useState([])
    // 일정
    const [dailyChoice, setDailyChoice] = useState([])
    const [dayEmployeeClassChoice, setDayEmployeeClassChoice] = useState([])
    const [disasterEmployeeClassChoice, setDisasterDayEmployeeClassChoice] = useState([])

    //기본정보
    const [basicChoice, setBasicChoice] = useState([])
    const [basicEmployeeClassChoice, setBasicEmployeeClassChoice] = useState([]) //공구비품
    //점검현황
    const [inspectionTotal, setInspectionTotal] = useState([]) //점검현황 전체 선택
    const [inspectionChoice, setInspectionChoice] = useState([]) // 점검일지
    const [performanceChoice, setPerformanceChoice] = useState([]) //점검실적표
    const [outsourcingChoice, setOutsourcingChoice] = useState([]) //외주점검
    const [complainChoice, setComplainChoice] = useState([]) //불편신고
    const [complainTypeChoice, setComplainTypeChoice] = useState([]) //불편신고 타입
    const [defectChoice, setDefectChoice] = useState([]) //하자관리
    //시설관리
    const [materialChoiceTotal, setMaterialChoiceTotal] = useState([])
    const [materialInfoType, setMaterialInfoType] = useState([]) //작업상세 타입
    const [materialInfoChoice, setMaterialInfoChoice] = useState([])
    const [materialLogChoice, setMaterialLogChoice] = useState([])
    const [materialPerformanceChoice, setMaterialPerformanceChoice] = useState([])
    const [materialTotalChoice, setMaterialTotalChoice] = useState([])

    const [educationType, setEducationType] = useState([]) //교육
    const [businessTotal, setBusinessTotal] = useState([]) //사업관리
    const [energyTotal, setEnergyTotal] = useState([]) //에너지
    const [energyDEmployeeClassChoice, setEnergyDEmployeeClassChoice] = useState([])
    const [energyMEmployeeClassChoice, setEnergyMEmployeeClassChoice] = useState([])
    //중대재
    const [disasterTotal, setDisasterTotal] = useState([]) //중대재전체
    const [safetyEmployeeClassChoice, setSafetyEmployeeClassChoice] = useState([]) // 안전점검일지 employee_class
    const [riskFormType, setRiskFormType] = useState([]) // 중-위험성평가 타입
    const [riskDetailType, setRiskDetailType] = useState([])
    const [riskFEmployeeClassChoice, setRiskFEmployeeClassChoice] = useState([]) // 중-양식 employee_class
    const [pdfList, setPdfList] = useState([])
    const [xlsxList, setXlsxList] = useState([])

    const paramsDict = {
        schedule: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1]},
        registration: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: dayEmployeeClassChoice, type: 'inspection'},
        disaster: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: disasterEmployeeClassChoice, type: 'disaster'},
        building: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1]},
        toolEquipment: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: basicEmployeeClassChoice},
        defect: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: defectChoice},
        manual: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1]},
        complain: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: complainChoice, selectPaper:complainTypeChoice},
        performance: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: performanceChoice},
        materialInfo: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: materialInfoChoice, selectPaper:materialInfoType},
        materialStockLog: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: materialLogChoice},
        materialPerformance: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: materialPerformanceChoice},
        materialTotal: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: materialTotalChoice},
        education: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], type: educationType},
        cost : {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1]},
        costLong : {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1]},
        daily: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: energyDEmployeeClassChoice},
        monthly: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: energyMEmployeeClassChoice},
        report: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], main_purpose: reportType},
        inspection: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: inspectionChoice, type:'inspection'},
        checklist : {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: safetyEmployeeClassChoice, type: 'disaster'},
        outsourcing: {property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], selectedEmployeeClass: outsourcingChoice},
        riskForm:{property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1]},
        workerQnA:{property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1]},
        riskDetail:{property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1], type:riskFormType, menuType:riskDetailType}
    }

    const exportXlsx = (array) => {
        axios.get(API_REPORT_MANAGE_XLSX, {params: {selected: array, param: paramsDict, property_id: cookies.get('property').value}})
        .then((res) => {
            axios({
                url: res.data.url,
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                console.log(response.data)
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${res.data.name}`)
                document.body.appendChild(link)
                link.click()
            }).catch((res) => {
                console.log(res)
            })
        })
        .catch(res => {
            console.log(res)
        })
    }

    const pdfDict = {
        report: ROUTE_REPORT_OPERATE_EXPORT,
        inspection: ROUTE_REPORT_MANAGE_INSPECTION_DETAIL_PDF,
        outsourcing: ROUTE_REPORT_MANAGE_OUTSOURCING_DETAIL_PDF,
        checklist: ROUTE_REPORT_MANAGE_DISASTER_DETAIL_PDF,
        crticalEvaulation: ROUTE_CRITICAL_CORPERATION_EVALUATION_EXPORT,
        riskDetail: ROUTE_REPORT_MANAGE_DISASTER_REPORT_PDF
    }

    const exportPDF = (array) => {
        localStorage.setItem('start_date', picker[0])
        localStorage.setItem('end_date', picker[1])
        localStorage.setItem('main_purpose', reportType)
        localStorage.setItem('employeeClassOutsourcing', outsourcingChoice)
        localStorage.setItem('employeeClassInspection', inspectionChoice)
        localStorage.setItem('disasterEmployeeClass', safetyEmployeeClassChoice)
        localStorage.setItem('inspectionType', 'inspection')
        localStorage.setItem('disasterType', 'disaster')
        localStorage.setItem('selectFormType', riskFormType)
        localStorage.setItem('riskPageType', riskDetailType)

        array.forEach(element => {
            window.open(pdfDict[element], '_blank')
        })
    }

    const handleExportTotal = () => {
        if (radioValue === 'year') {
            if (quarter.value === '') {
                sweetAlert("분기를 선택해주세요.", "분기가 선택되지 않았습니다. </br>재 시도해주세요.", 'warning')
                return false
            }
        }
        if (xlsxList.length > 0) exportXlsx(xlsxList)
        if (pdfList.length > 0) exportPDF(pdfList)
    }

    const handleChoiceCancel = () => {
        setReportType([])
        setDailyChoice([])
        setDayEmployeeClassChoice([])
        setDisasterDayEmployeeClassChoice([])
        setBasicChoice([])
        setBasicEmployeeClassChoice([])
        setInspectionTotal([])
        setInspectionChoice([])
        setPerformanceChoice([])
        setOutsourcingChoice([])
        setComplainChoice([])
        setComplainTypeChoice([])
        setDefectChoice([])
        setMaterialChoiceTotal([])
        setMaterialInfoType([])
        setMaterialInfoChoice([])
        setMaterialLogChoice([])
        setMaterialPerformanceChoice([])
        setMaterialTotalChoice([])
        setEducationType([])
        setBusinessTotal([])
        setEnergyTotal([])
        setEnergyDEmployeeClassChoice([])
        setEnergyMEmployeeClassChoice([])
        setDisasterTotal([])
        setSafetyEmployeeClassChoice([])
        setRiskFormType([])
        setRiskDetailType([])
        setRiskFEmployeeClassChoice([])
        setPdfList([])
        setXlsxList([])
    }

    const handleChoiceAll = () => {
        setReportType(['general', 'weekly', 'monthly', 'accident'])
        setDailyChoice(['registration', 'schedule', 'disaster'])
        setDayEmployeeClassChoice(employeeIds)
        setDisasterDayEmployeeClassChoice(employeeIds)
        setBasicChoice(['building', 'toolEquipment'])
        setBasicEmployeeClassChoice(employeeIds)
        setInspectionTotal(['inspection', 'performance', 'outsourcing', 'manual', 'complain', 'defect'])
        setInspectionChoice(employeeIds)
        setPerformanceChoice(employeeIds)
        setOutsourcingChoice(employeeIds)
        setComplainChoice(employeeIds)
        setComplainTypeChoice(['detail', 'work', 'material', 'tool'])
        setDefectChoice(employeeIds)
        setMaterialChoiceTotal(['materialInfo', 'materialStockLog', 'materialPerformance', 'materialTotal'])
        setMaterialInfoType(['list', 'replace'])
        setMaterialInfoChoice(employeeIds)
        setMaterialLogChoice(employeeIds)
        setMaterialPerformanceChoice(employeeIds)
        setMaterialTotalChoice(employeeIds)
        setEducationType(['legal', 'safety', 'general', 'cooperator'])
        setBusinessTotal(['cost', 'costLong'])
        setEnergyTotal(['daily', 'monthly'])
        setEnergyDEmployeeClassChoice(employeeIds)
        setEnergyMEmployeeClassChoice(employeeIds)
        setDisasterTotal(['checklist', 'riskDetail', 'riskForm'])
        setSafetyEmployeeClassChoice(employeeIds)
        setRiskFormType([0,1,2,3])
        setRiskDetailType(['notice', 'meeting', 'evaluation', 'counterplan', 'education', 'riskReport'])
        setRiskFEmployeeClassChoice(employeeIds)
        setPdfList(['report', 'inspection', 'outsourcing', 'riskDetail', 'checklist'])
        setXlsxList([
            'registration', 'schedule', 'disaster', 'building', 
            'toolEquipment', 'performance', 'manual', 'complain', 
            'defect', 'materialInfo', 'materialStockLog', 'materialPerformance', 
            'materialTotal', 'education', 'daily', 'monthly', 
            'cost', 'costLong', 'riskForm', 'riskDetail', 'checklist'
        ])
    }

    useEffect(() => {
        window.localStorage.removeItem('disaster_evaluation_id')
        axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, { params: {property_id: cookies.get('property').value} })
        .then(res => {
            const tempList = []
            const tempId = []
            res.data.map(employeeClass => {
                tempList.push({ id: employeeClass.id, name: employeeClass.name, checked:false})
                tempId.push(employeeClass.id)
            })
            setEmployeeClassData(tempList)
            setEmployeeIds(tempId)
        })
    }, [])

    useEffect(() => {
        console.log("pdfList", pdfList)
        console.log("xlsxList", xlsxList)
    }, [pdfList, xlsxList])
    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='운영보고서' breadCrumbParent='보고서 관리' breadCrumbActive='운영보고서' />
                </div>
            </Row>
            <Card>
                <CardHeader>
                    <CardTitle>운영보고서</CardTitle>
                </CardHeader>
                <CardBody>
                    <SearchFilter
                       picker={picker}
                       setPicker={setPicker}
                       year={year}
                       setYear={setYear}   
                       quarter={quarter} 
                       setQuarter={setQuarter}
                       yearList={yearList}
                       quarterList={quarterList} 
                       filters={filters}
                       setFilters={setFilters}
                       radioValue={radioValue}
                       setRadioValue={setRadioValue}
                    />
                    <div className='mt-1' style={{justifyContent:'start', display:'flex'}}>
                        <Button type="button" color="primary" onClick={() => handleChoiceAll()}>전체 선택</Button>
                    </div>
                    {filters.includes('report') &&
                        <ReportTalbe 
                            reportType={reportType}
                            setReportType={setReportType}
                            pdfList={pdfList}
                            setPdfList={setPdfList}
                            xlsxList={xlsxList}
                            setXlsxList={setXlsxList}
                        />
                    }
                    {filters.includes('schedule') &&
                        <ScheduleTalbe
                            employeeClassData={employeeClassData}
                            employeeIds={employeeIds}
                            dailyChoice={dailyChoice}
                            setDailyChoice={setDailyChoice}
                            dayEmployeeClassChoice={dayEmployeeClassChoice}
                            setDayEmployeeClassChoice={setDayEmployeeClassChoice}
                            xlsxList={xlsxList}
                            setXlsxList={setXlsxList}
                            disasterEmployeeClassChoice={disasterEmployeeClassChoice}
                            setDisasterDayEmployeeClassChoice={setDisasterDayEmployeeClassChoice}
                        />
                    }
                    {filters.includes('basicInfo') &&
                        <BasicInfoTable 
                            employeeClassData={employeeClassData}
                            employeeIds={employeeIds}
                            basicChoice={basicChoice}
                            setBasicChoice={setBasicChoice}
                            basicEmployeeClassChoice={basicEmployeeClassChoice}
                            setBasicEmployeeClassChoice={setBasicEmployeeClassChoice}
                            xlsxList={xlsxList}
                            setXlsxList={setXlsxList}
                        />
                    }
                    {filters.includes('inspection') &&
                        <InspectionTable
                            employeeClassData={employeeClassData}
                            employeeIds={employeeIds}
                            inspectionTotal={inspectionTotal}
                            setInspectionTotal={setInspectionTotal}
                            inspectionChoice={inspectionChoice}
                            setInspectionChoice={setInspectionChoice}
                            performanceChoice={performanceChoice}
                            setPerformanceChoice={setPerformanceChoice}
                            outsourcingChoice={outsourcingChoice}
                            setOutsourcingChoice={setOutsourcingChoice}
                            complainChoice={complainChoice}
                            setComplainChoice={setComplainChoice}
                            complainTypeChoice={complainTypeChoice}
                            setComplainTypeChoice={setComplainTypeChoice}
                            defectChoice={defectChoice}
                            setDefectChoice={setDefectChoice}
                            xlsxList={xlsxList}
                            setXlsxList={setXlsxList}
                            pdfList={pdfList}
                            setPdfList={setPdfList}
                        />
                    }
                    {filters.includes('safety') && 
                        <SafetyTable 
                            employeeClassData={employeeClassData}
                            employeeIds={employeeIds}
                            disasterTotal={disasterTotal}
                            setDisasterTotal={setDisasterTotal}
                            safetyEmployeeClassChoice={safetyEmployeeClassChoice}
                            setSafetyEmployeeClassChoice={setSafetyEmployeeClassChoice}
                            riskFormType={riskFormType}
                            setRiskFormType={setRiskFormType}
                            riskDetailType={riskDetailType}
                            setRiskDetailType={setRiskDetailType}
                            riskFEmployeeClassChoice={riskFEmployeeClassChoice}
                            setRiskFEmployeeClassChoice={setRiskFEmployeeClassChoice}
                            xlsxList={xlsxList}
                            setXlsxList={setXlsxList}
                            pdfList={pdfList}
                            setPdfList={setPdfList}
                        />
                    }
                    {filters.includes('facility') && 
                        <FacilityTable 
                            employeeClassData={employeeClassData}
                            employeeIds={employeeIds}
                            materialChoiceTotal={materialChoiceTotal}
                            setMaterialChoiceTotal={setMaterialChoiceTotal}
                            materialInfoType={materialInfoType}
                            setMaterialInfoType={setMaterialInfoType}
                            materialInfoChoice={materialInfoChoice}
                            setMaterialInfoChoice={setMaterialInfoChoice}
                            materialLogChoice={materialLogChoice}
                            setMaterialLogChoice={setMaterialLogChoice}
                            materialPerformanceChoice={materialPerformanceChoice}
                            setMaterialPerformanceChoice={setMaterialPerformanceChoice}
                            materialTotalChoice={materialTotalChoice}
                            setMaterialTotalChoice={setMaterialTotalChoice}
                            xlsxList={xlsxList}
                            setXlsxList={setXlsxList}
                        />
                    }
                    {filters.includes('education') &&
                        <EducationTable 
                            educationType={educationType}
                            setEducationType={setEducationType}
                            xlsxList={xlsxList}
                            setXlsxList={setXlsxList}
                        />
                    }
                    {filters.includes('energy') && 
                        <EnergyTable 
                            employeeClassData={employeeClassData}
                            employeeIds={employeeIds}
                            energyTotal={energyTotal} 
                            setEnergyTotal={setEnergyTotal}
                            energyDEmployeeClassChoice={energyDEmployeeClassChoice}
                            setEnergyDEmployeeClassChoice={setEnergyDEmployeeClassChoice}
                            energyMEmployeeClassChoice={energyMEmployeeClassChoice}
                            setEnergyMEmployeeClassChoice={setEnergyMEmployeeClassChoice}
                            xlsxList={xlsxList}
                            setXlsxList={setXlsxList}
                        />
                    }
                    {filters.includes('business') &&
                        <BusinessTable 
                            businessTotal={businessTotal}
                            setBusinessTotal={setBusinessTotal}
                            xlsxList={xlsxList}
                            setXlsxList={setXlsxList}
                        />
                    }
                    <CardFooter style={{display : 'flex', justifyContent:'space-between', borderTop: '1px solid #dae1e7', marginTop:'3rem', width:'100%'}}>
                        <Fragment>
                            <Button type="button" color="report" onClick={() => handleChoiceCancel()}>전체 선택해제</Button>
                            <Button type="button" color="primary" onClick={() => handleExportTotal()}>변환</Button>
                        </Fragment>
                    </CardFooter>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default ReportManage