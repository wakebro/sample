import axios from 'axios'
import * as yup from 'yup'
import { Fragment } from 'react'
import * as moment from 'moment'

export const reportTypeList = {
    total:'전체',
    general: '일반',
    weekly: '주간',
    monthly: '월간',
    accident:'사고',
    temporary: '임시 보관'
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
    modify : ' 수정'
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

export const PaperNumberGetData = (API, param, setData) => {
    axios.get(API, {
        params: param
    })
    .then(res => {
        const reportIdList = []
        res.data.map(data => reportIdList.push(data.id))
        const maxId = Math.max(...reportIdList) + 1
        setData(maxId)
    })
    .catch(res => {
        console.log(API, res)
    })
}

export const validationSchemaReport =  
    yup.object().shape({
        title: yup.string().required('제목을 입력해주세요.'),
        accidentTitle: yup.string().required('현장명을 입력해주세요.').nullable(),
        section1: yup.string().required('내용을 입력해주세요.')
})

export const validationSchemaAccident =  
    yup.object().shape({
        title: yup.string().required('제목을 입력해주세요.'),
        accidentTitle: yup.string().required('현장명을 입력해주세요.').nullable(),
        employees: yup.string().required('근무자를 입력해주세요.').nullable(),
        eventOutline: yup.string().required('사건 개요를 입력해주세요.'),
        section1: yup.string().required('진행 경과를 입력해주세요.'),
        section2: yup.string().required('처리 예정을 입력해주세요.'),
        section3: yup.string().required('조치 결과를 입력해주세요.'),
        confirmEmployee: yup.string().required('조치 확인자를 입력해주세요.').nullable()
})

export const defaultValues = {
    title : '',
    accidentTitle: '',
    section_1: ''
}