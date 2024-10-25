import axios from 'axios'
import * as yup from 'yup'
import { Fragment } from 'react'
import * as moment from 'moment'
import {ROUTE_REPORT_GENERAL, ROUTE_REPORT_WEEKLY, ROUTE_REPORT_MONTHLY} from '../../constants'

export const reportTypeList = {
    total:'전체',
    general: '일반',
    weekly: '주간',
    monthly: '월간',
    accident:'사고',
    temporary: '임시 보관',
    outsourcing: '외주점검'
}

export const ReportUrlObj = {
    general: ROUTE_REPORT_GENERAL,
    weekly: ROUTE_REPORT_WEEKLY,
    monthly: ROUTE_REPORT_MONTHLY 
}

export const quarterList = [
    {label: '선택', value:''},
    {label: '1분기', value:3},
    {label: '2분기', value:6},
    {label: '3분기', value:9},
    {label: '4분기', value:12}
]

export const manageFilterList = {
    report: '보고서',
    schedule: '일정',
    basicInfo: '기본정보',
    inspection: '점검현황',
    safety: '중대재해관리',
    facility: '시설관리',
    education: '교육관리',
    energy: '에너지관리',
    business: '사업관리'
}

export const ReportColumn = [
    {
        name:'작성일자',
        with:'15%',
        cell: row => <Fragment key={row.id}>{moment(row.create_datetime).format('YYYY/MM/DD')}</Fragment>
    },
    {
        name:'종류',
        with:'5%',
        cell: row => <Fragment key={row.id}>{reportTypeList[row.main_purpose]}</Fragment>
    },
    {
        name:'현장명',
        with:'30%',
        cell: row => <Fragment>{row.accident_title}</Fragment>
    },
    {
        name:'보고서명',
        width:'40%',
        cell: row =>  { 
            return (
                <Fragment key={row.id}>
                    <span style={{ width:'100%', textAlign: 'left' }} >{row.title}</span>
                </Fragment>) 
        }
    },
    {
        name:'작성자',
        with:'10%',
        cell: row => <Fragment key={row.id}>{row.user}</Fragment>
    }
]

export const pageTypeKor = {
    register : '등록',
    modify : ' 수정',
    temporary: '임시저장'
}

export const tabTatleList = [
    {total: "보고서 전체 목록"},
    {general: "일반 보고서"}, 
    {weekly: "주간 보고서"}, 
    {monthly: "월간 보고서"},
    {accident: '사고 보고서'},
    {temporary: '임시보관함'}
]

export const reportNumberList = {
    general: "2154", 
    weekly: "3154", 
    monthly: "4154",
    accident: '5100'
}

export const signIndex = {
    manager: 0,
    manager2: 1,
    manager3: 2,
    manager4: 3
}

export const signListObj = {
    1: '1차결재자',
    2: '2차 결재자'
}

export const reportType = [
    {value:'', label:'선택'},
    {value:'general', label:'일반 보고서'},
    {value:'weekly', label:'주간 보고서'},
    {value:'monthly', label:'월간 보고서'},
    {value:'accident', label:'사고 보고서'}
]

export const CustomUserGetTableData = (API, param, setData, userEmployeeLevel, setUserCompany, setUserDepartment) => {
    axios.get(API, {
        params: param
    })
    .then(res => {
        setData(res.data)
        userEmployeeLevel(res.data.employee_level)
        setUserCompany(res.data.company)
        setUserDepartment(res.data.employee_class)
    })
    .catch(res => {
        console.log(API, res)
    })
}

export const CustomGetTableData = (API, param, setData) => {
    axios.get(API, {
        params: param
    })
    .then(res => {
        setData(res.data)
    })
    .catch(res => {
        console.log(API, res)
    })
}

export const CustomGetSignTableData = (API, param, setData) => {
    axios.get(API, {
        params: param
    })
    .then(res => {
        const newData = {position: '', department: '', employee_class: '', checked:true, name:'결재자 미지정', id:0, position:''}
        const originData = [...res.data]
        const data = [newData, ...originData]
        setData(data)

    })
    .catch(res => {
        console.log(API, res)
    })
}

export const PaperNumberGetData = (API, param, setData) => {
    axios.get(API, {
        params: param
    })
    .then(res => {
        const reportIdList = []
        res.data.map(data => reportIdList.push(data.id))
        if (reportIdList.length > 0) {
            const maxId = Math.max(...reportIdList) + 1
            setData(maxId)
            return
        }
        setData(1)
    })
    .catch(res => {
        console.log(API, res)
    })
}

export const validationSchemaReport =  
    yup.object().shape({
        title: yup.string().required('제목을 입력해주세요.'),
        accident_title: yup.string().required('현장명을 입력해주세요.').nullable(),
        section_1: yup.string().required('내용을 입력해주세요.').nullable()
})

export const validationSchemaAccident =  
    yup.object().shape({
        title: yup.string().required('제목을 입력해주세요.'),
        accident_title: yup.string().required('현장명을 입력해주세요.').nullable(),
        employees: yup.string().required('근무자를 입력해주세요.').nullable(),
        event_outline: yup.string().required('사건 개요를 입력해주세요.').nullable(),
        section_1: yup.string().required('진행 경과를 입력해주세요.').nullable(),
        section_2: yup.string().required('처리 예정을 입력해주세요.').nullable(),
        section_3: yup.string().required('조치 결과를 입력해주세요.').nullable(),
        confirm_employee: yup.string().required('조치 확인자를 입력해주세요.').nullable()
})

export const validationRejectModal = 
    yup.object().shape({
        reason: yup.string().required('반려 사유를 작성해주세요.')
    })

export const defaultValues = {
    title : '',
    accidentTitle: '',
    section_1: ''
}

export const reportFormDefaultValues = {
    title : '',
    reportNumber: '',
    accident_title: '',
    section_1: ''
}

// no data row
export const NoDataComponent = () => (
	<div style={{margin:'3%'}} className="hand-no-data">데이터가 없습니다.</div>
)
export const TableNoDataComponent = () => (
	<div className="hand-no-data">데이터가 없습니다.</div>
)
