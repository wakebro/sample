import {API_STANDARD_FACILITY, API_STANDARD_COSTTYPE, 
    API_STANDARD_COSTCATEGORY, ROUTE_STANDARD_COSTCATEGORY_DETAIL, 
    ROUTE_STANDARD_COSTTYPE_DETAIL, ROUTE_STANDARD_FACILITY_DETAIL
} from "../../../constants"
import axios from 'axios'
import { Col } from "reactstrap"
import * as yup from 'yup'

export const StandardTabList = [
	{label : '장비분류', value : 'facility'},
	{label : '인덱스타입', value : 'costType'},
	{label : '인덱스캣', value : 'costCategory'}
]

export const StandardtabNameList = [{facility: "장비분류"}, {costType: "인덱스타입"}, {costCategory: "인덱스캣"}]

export const StandardColumn = {
    facility: [
        {
            name:'장비분류(코드)',
            selector: row => row.code
        },
        {
            name:'보기순서',
            selector: row => row.view_order,
            cell: (row) => <Col style={{ textAlign: 'end' }}>{row.view_order}</Col>
        }
    ],
    costType: [
        {
            name:'인덱스타입(코드)',
            selector: row => row.code
        },
        {
            name:'보기순서',
            selector: row => row.view_order,
            cell: (row) => <Col style={{ textAlign: 'end' }}>{row.view_order}</Col>
        }
    ],
    costCategory: [
        {
            name:'인덱스타입(코드)',
            selector: row => row.cost_type
        },
        {
            name:'인덱스캣(코드)',
            selector: row => row.code
        },
        {
            name:'보기순서',
            selector: row => row.view_order,
            cell: (row) => <Col style={{ textAlign: 'end' }}>{row.view_order}</Col>
        }
    ]
}

export const StandardUrlObj = {
    facility: API_STANDARD_FACILITY,
    costType: API_STANDARD_COSTTYPE,
    costCategory: API_STANDARD_COSTCATEGORY
}

export const StandadDetailUrlObj = {
    facility: ROUTE_STANDARD_FACILITY_DETAIL,
    costType: ROUTE_STANDARD_COSTTYPE_DETAIL,
    costCategory: ROUTE_STANDARD_COSTCATEGORY_DETAIL
}

export const defaultValues = {
    facility: {
        code: '',
        description: '',
        view_order: ''
    },
    costType: {
        code: '',
        description: '',
        view_order: ''
    },
    costCategory: {
        code: '',
        description: '',
        view_order: '',
        cost_type: {label:'없음', value:''}
    }
}
// 띄어쓰기 포함
// const special_pattern = /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/
// 띄어쓰기 제거
const special_pattern = /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/

export const validationSchemaInconv = {
    facility: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('장비 분류명을 입려해주세요.'),
        view_order: yup.number().transform((value, originalValue) => {
            if (originalValue === "") return null // 빈 문자열을 null로 처리
            return value // 그 외의 경우는 기본 변환을 수행
          }).min(1, '1이상 값을 입력해주세요.').nullable(true)
	}),
    costType: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('코드를 입력해주세요.!!!'),
        view_order: yup.number().transform((value, originalValue) => {
            if (originalValue === "") return null 
            return value
          }).min(1, '1이상 값을 입력해주세요.').nullable(true)
	}),
    costCategory: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('코드를 입력해주세요.!!!'),
        description: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다"),
        view_order: yup.number().transform((value, originalValue) => {
            if (originalValue === "") return null 
            return value
            }).min(1, '1이상 값을 입력해주세요.').nullable(true)
	})
}

export const EditValidationSchemaInconv = {
    facility: yup.object().shape({
        code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('장비 분류명을 입려해주세요.'),
        view_order: yup.number().transform((value, originalValue) => {
            if (originalValue === "") return null 
            return value
          }).min(1, '1이상 값을 입력해주세요.').nullable(true),
        description: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다")
	}),
    costType: yup.object().shape({
        code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다").required('장비 분류명을 입려해주세요.'),
        description: yup.string().matches(
            special_pattern, "특수문자가 포함되면 안됩니다"),
        view_order: yup.number().transform((value, originalValue) => {
            if (originalValue === "") return null 
            return value
          }).min(1, '1이상 값을 입력해주세요.').nullable(true)
	}),
    costCategory: yup.object().shape({
		code: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다"),
        description: yup.string().matches(
			special_pattern, "특수문자가 포함되면 안됩니다"),
        view_order: yup.number().transform((value, originalValue) => {
            if (originalValue === "") return null 
            return value
            }).min(1, '1이상 값을 입력해주세요.').nullable(true)    
	})
}

export const getCustomTableData = (API, param, setTableData, setSelectTableList) => {
    axios.get(API, {
        params: param
    })
    .then(res => {
        const costTypeList = []
        for (let i = 0; i < res.data.cost_type_list.length; i++) {
            costTypeList.push({value:res.data.cost_type_list[i].id, label:res.data.cost_type_list[i].code})
        }
        setSelectTableList(prevList => [...prevList, ...costTypeList])
        setTableData(res.data.data)
    })
    .catch(res => {
        console.log(API, res)
    })
}

export const pageTypeKor = {
	register : ' 등록',
	modify : ' 수정'
}

