import * as yup from 'yup'
import * as moment from 'moment'

export const levelList = ['D', 'C', 'B', 'A', 'S']

export const cooperatorColumns = [
    {
        name: '등록일자',
        width: '180px',
        cell: row => moment(row.create_datetime).format('YYYY-MM-DD')
    },
    {
        name: '업체명',
        minWidth: '200px',
        style: {justifyContent: 'left'},
        cell: row => row.corperation_name
    },
    {
        name: '평가일자',
        width: '180px',
        cell: row => moment(row.evaluation_date).format('YYYY-MM-DD')
    },
    {
        name: '평가등급',
        width: '110px',
        cell: row => row.evaluation_level
    },
    {
        name: '평가점수',
        width: '110px',
        cell: row => row.total_score
    },
    {
        name: '적격여부',
        width: '110px',
        cell: row => {
            const inputLevleIdx = levelList.indexOf(row.work_level)
            const evaluationIdx = levelList.indexOf(row.evaluation_level)
            let state = '부적격'
            if (evaluationIdx >= inputLevleIdx) state = '적격'
            return (
                state
            )
        }
    },
    {
        name: '평가자',
        width: '170px',
        cell: row => row.user
    }
]

export const selectLevelList = [
    {label:'선택', value: ''},
    {label:'S', value:'S'},
    {label:'A', value:'A'},
    {label:'B', value:'B'},
    {label:'C', value:'C'},
    {label:'D', value:'D'}
]

export const sectionA = {
    C01: 1, //원칙
    C02: { value: 1, label: '1' }, //계획
    C03: { value: 1, label: '1' } // 역할및책임
}

export const sectionB = {
    C04: { value: 1, label: '1' },
    C05: { value: 1, label: '1' },
    C06: { value: 1, label: '1점' },
    C07: { value: 1, label: '1점' },
    C08: { value: 1, label: '1점' }
}

export const sectionC = {
    C09: { value: 1, label: '1점' },
    C10: { value: 1, label: '1점' },
    C11: { value: 1, label: '1점' }
}

export const sectionAll = {
    C01: 1,
    C02: 1, 
    C03: 1,
    C04: 1,
    C05: 1,
    C06: 1,
    C07: 1,
    C08: 1,
    C09: 1,
    C10: 1,
    C11: 1,
    C12: 1
}

export const defaultValues = {
    corperation_name: '',
    control_state : true,
    contract_work: '',
    haed_office: '',
    department: '',
    employee_level: '',
    work_level: {label:'선택', value: ''},
    C01: Number(1),
    C02: Number(1),
    C03: Number(1),
    C04: Number(1),
    C05: Number(1),
    C06: Number(1),
    C07: Number(1),
    C08: Number(1),
    C09: Number(1),
    C10: Number(1),
    C11: Number(1),
    C12: Number(1)
}

export const validationSchema = yup.object().shape({
    corperation_name: yup.string().required('업체명을 입력해주세요.'),
    haed_office: yup.string().required('본부를 입력해주세요.'),
    department: yup.string().required('부서를 입력해주세요.'),
    employee_level: yup.string().required('직급을 입력해주세요.'),
    contract_work: yup.string().required('계약업무를 입력해주세요.'),
    C01: yup.number().required('1이상 입력해주세요.').max(5, '5 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable(),
    C02: yup.number().required('1이상 입력해주세요.').max(10, '10 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable(),
    C03: yup.number().required('1이상 입력해주세요.').max(5, '5 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable(),
    C04: yup.number().required('1이상 입력해주세요.').max(5, '5 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable(),
    C05: yup.number().required('1이상 입력해주세요.').max(10, '10 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable(),
    C06: yup.number().required('1이상 입력해주세요.').max(10, '10 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable(),
    C07: yup.number().required('1이상 입력해주세요.').max(5, '5 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable(),
    C08: yup.number().required('1이상 입력해주세요.').max(10, '10 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable(),
    C09: yup.number().required('1이상 입력해주세요.').max(5, '5 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable(),
    C10: yup.number().required('1이상 입력해주세요.').max(10, '10 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable(),
    C11: yup.number().required('1이상 입력해주세요.').max(5, '5 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable(),
    C12: yup.number().required('1이상 입력해주세요.').max(20, '20 이하로 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return null
        return value
    }).min(1, '1이상 값을 입력해주세요.').nullable()
})