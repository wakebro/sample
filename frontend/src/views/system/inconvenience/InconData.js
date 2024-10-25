import * as yup from 'yup'
import axios from 'axios'
import { API_INCONV_CAUSE, API_INCONV_REPAIR, 
    API_INCONV_PROBLEM, API_INCONV_NORMAL, 
   ROUTE_SYSTEMMGMT_INCONV_CAUSE_DETAIL, ROUTE_SYSTEMMGMT_INCONV_REPAIR_DETAIL, ROUTE_SYSTEMMGMT_INCONV_PROBLEM_DETAIL, ROUTE_SYSTEMMGMT_INCONV_NORMAL_DETAIL, API_INCONV_EMPLOYEE_CLASS, ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS_DETAIL, API_INCONV_EMPLOYEE_LEVEL, ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL_DETAIL, API_INCONV_LICENSE, ROUTE_SYSTEMMGMT_INCONV_LICENSE_DETAIL } from "../../../constants"
import { Col } from 'reactstrap'

export const defaultSystemTable = [{value: '', label: '직종 전체'}]

export const environmentTable = [
    {value: '', label: '없음'},
    {value: '환기', label: '환기'},
    {value: '냉난방', label: '냉난방'}
]

export const tabNameList = [
    {cause: "원인 유형"},
    {repair: "처리 유형"}, 
    {problem: "문제 유형"},
    {normal: "표준 자재"}
]

export const StandardTabList = [
	{label : '원인유형', value : 'cause'},
	{label : '처리유형', value : 'repair'},
	{label : '문제유형', value : 'problem'}
]

export const InconvInfoColumn = {
    cause: [
        {
            name:'원인 유형',
            style: {
                justifyContent:'left'
            },
            cell: row => row.code
        },
        {
            name: '직종',
            style: {
                justifyContent:'left'
            },
            cell: row => row.employee_class
        }
    ],
    repair: [
        {
            name:'처리 유형',
            style: {
                justifyContent:'left'
            },
            // cell: row => <div id={row.id} style={{ width:'100%', textAlign: 'left' }}>{row.code}</div>
            cell: row => row.code
        },
        {
            name: '직종',
            style: {
                justifyContent:'left'
            },
            cell: row => row.employee_class
        }
    ],
    problem: [
        {
            name:'문제 유형',
            minWidth: "10rem",
            style: {
                justifyContent:'left'
            },
            cell: row => row.code
        },
        {
            name: '직종',
            style: {
                justifyContent:'left'
            },
            width: "7rem",
            cell: row => row.employee_class
        },
        {
            name: '설명',
            minWidth: "30rem",
            style: {
                justifyContent:'left'
            },
            cell : row => row.description
        }
    ],
    normal: [
        {
            name:'표준 자재 관리',
            style: {
                justifyContent:'left'
            },
            cell : row => row.code
        },
        {
            name: '표준 단위',
            style: {
                justifyContent:'left'
            },
            cell : row => row.unit
        }
    ],
    employee_class: [
        {
            name: '직종 코드',
            cell: row => row.code
        },
        {
            name: '업무 내용',
            cell: row => row.description
        },
        {
            name: '보기 순서',
            width: "10rem",
            style: {
                justifyContent:'right'
            },
            cell: row => row.view_order
        }
    ],
    employee_level: [
        {
            name: '직급 코드',
            selector: row => row.code
        },
        {
            name: '업무 내용',
            selector: row => row.description
        },
        {
            name: '보기 순서',
            width: "10rem",
            style: {
                justifyContent:'right'
            },
            cell: row => row.view_order
        }
    ],
    license: [
        {
            name: '직종',
            selector: row => row.emp_class.code
        },
        {
            name: '자격명',
            selector: row => row.code
        },
        {
            name: '법규 코드',
            selector: row => row.legal_code
        },
        {
            name: '발급처',
            selector: row => row.issuer
        },
        {
            name: '비고',
            selector: row => row.description
        }
    ]
}

export const InconvInfoUrlObj = {
	cause : API_INCONV_CAUSE,
	repair : API_INCONV_REPAIR,
	problem : API_INCONV_PROBLEM,
    normal: API_INCONV_NORMAL,
    employee_class: API_INCONV_EMPLOYEE_CLASS,
    employee_level: API_INCONV_EMPLOYEE_LEVEL,
    license: API_INCONV_LICENSE
}

export const DetailUrlObj = {
    cause : ROUTE_SYSTEMMGMT_INCONV_CAUSE_DETAIL,
	repair : ROUTE_SYSTEMMGMT_INCONV_REPAIR_DETAIL,
	problem : ROUTE_SYSTEMMGMT_INCONV_PROBLEM_DETAIL,
    normal: ROUTE_SYSTEMMGMT_INCONV_NORMAL_DETAIL,
    employee_class: ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_CLASS_DETAIL,
    employee_level: ROUTE_SYSTEMMGMT_INCONV_EMPLOYEE_LEVEL_DETAIL,
    license: ROUTE_SYSTEMMGMT_INCONV_LICENSE_DETAIL
}

export const legalCodeOptions = [{value:'', label: '법규 코드 선택'}]

export const defaultValues = {
    cause: {
        code: '',
        description: '',
        emp_class: {label:'선택', value:''}
    },
    repair: {
        code: '',
        description: '',
        emp_class: {label:'선택', value:''}
    },
    problem: {
        code: '',
        description: '',
        emp_class: {label:'선택', value:''},
        environment_type: {label:'없음', value:''}
    },
    normal: {
        code: '',
        unit: ''
    },
    employee_class: {
        code: '',
        view_order: '',
        description: ''
    },
    employee_level: {
        code: '',
        view_order: '',
        description: ''
    },
    license: {
        emp_class: {value:'', label:'선택'},
        code: '',
        legal_code: legalCodeOptions[0],
        issuer: '',
        description: ''
    }
}

const special_pattern = /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/
// const special_pattern = /^[^!@#$%^&*_+\-=\[\]{};':"\\|,.<>\/?\s]*$/ // () 부분 제외


export const validationSchemaInconv = {
    cause: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").max(60, '60자 이하로 입력해주세요.').required('원인 유형을 입력해주세요.')
		// description: yup.string().max(100, '100자 이하로 입력해주세요.')
	}),
    repair: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").max(60, '60자 이하로 입력해주세요.').required('처리 유형을 입력해주세요.')
        // description: yup.string().max(100, '100자 이하로 입력해주세요.')
	}),
    problem: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").max(60, '60자 이하로 입력해주세요.').required('문제 유형을 입력해주세요.')
        // description: yup.string().max(100, '100자 이하로 입력해주세요.')
	}),
    normal: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('자재 코드 입력해주세요.').max(60, '60자 이하로 입력해주세요.'),
		unit: yup.string().required('표준단위 입력해주세요.').max(10, '10자 이하로 입력해주세요.')
	}),
    employee_class: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('직종코드를 입력해주세요.'),
        view_order: yup.number().transform((value, originalValue) => {
            if (originalValue === "") return null 
            return value
          }).min(1, '1이상 값을 입력해주세요.').nullable(true).typeError('숫자만 입력이 가능합니다.'),
	    description: yup.string().required('업무 내용을 입력해주세요.').max(100, '100자 이하로 입력해주세요.')
	}),
    employee_level: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('직급코드를 입력해주세요.'),
        view_order: yup.number().transform((value, originalValue) => {
            if (originalValue === "") return null 
            return value
          }).min(1, '1이상 값을 입력해주세요.').nullable(true).typeError('숫자만 입력이 가능합니다.'),
	    description: yup.string().required('업무 내용을 입력해주세요.').max(100, '100자 이하로 입력해주세요.')
	}),
    license: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('자격명을 입력해주세요.'),
        issuer: yup.string().matches(
            special_pattern, "특수문자가 포함되면 안됩니다").required('발급처를 입력해주세요.')
	})
}

export const EditValidationSchemaInconv = {
    cause: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다"),
		description: yup.string()
	}),
    repair: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다"),
        description: yup.string()
	}),
    problem: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다"),
        description: yup.string()
	}),
    normal: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('자재 코드를 입력해주세요.'),
		unit: yup.string().required('표준 단위를 입력해주세요.')
	}),
    employee_class: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('직종 코드를 입력해주세요.'),
        view_order: yup.number().transform((value, originalValue) => {
            if (originalValue === "") return null 
            return value
            }).min(1, '1이상 값을 입력해주세요.').nullable(true).typeError('숫자만 입력이 가능합니다.'),
	    description: yup.string().required('직종 내용을 입력해주세요.')
	}),
    employee_level: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('직급 코드를 입력해주세요.'),
        view_order: yup.number().transform((value, originalValue) => {
            if (originalValue === "") return null 
            return value
            }).min(1, '1이상 값을 입력해주세요.').nullable(true).typeError('숫자만 입력이 가능합니다.'),
	    description: yup.string().required('직급내용을 입력해주세요.')
	}),
    license: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('자격명을 입력해주세요.'),
        issuer: yup.string().matches(
            special_pattern, "특수문자가 포함되면 안됩니다").required('발급처를 입력해주세요.')
	})
}

export const CustomGetTableData = (API, param, setTableData, setSelectTableList) => {
    axios.get(API, {
        params: param
    })
    .then(res => {
        setTableData(res.data.data)
        const empClassList = []
			if (res.data.emp_class_list) {
				for (let i = 0; i < res.data.emp_class_list.length; i++) {
					empClassList.push({value:res.data.emp_class_list[i].id, label: res.data.emp_class_list[i].code})
				}
				setSelectTableList(prevList => [...prevList, ...empClassList])
			}
    })
    .catch(res => {
        console.log(API, res)
    })
}

export const TabGetTableData = (API, param, setTableData) => {
    axios.get(API, {
        params: param
    })
    .then(res => {
        setTableData(res.data.data)
    })
    .catch(res => {
        console.log(API, res)
    })
}

export const SearchGetTableData = (API, param, setTableData) => {
    axios.get(API, {
        params: param
    })
    .then(res => {
        setTableData(res.data.data)
    })
    .catch(res => {
        console.log(API, res)
    })
}

export const pageTypeKor = {
	register : '등록',
	modify : ' 수정'
}