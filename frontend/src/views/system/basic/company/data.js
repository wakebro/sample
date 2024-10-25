import axios from '@utility/AxiosConfig'
import 'cleave.js/dist/addons/cleave-phone.us'
import { Fragment } from "react"
import * as yup from 'yup'
import { API_SYSTEMMGMT_BASIC_INFO_CITY, API_SYSTEMMGMT_BASIC_INFO_COMPANY, API_SYSTEMMGMT_BASIC_INFO_DEPARTMENT, API_SYSTEMMGMT_BASIC_INFO_PROPERTY, API_SYSTEMMGMT_BASIC_INFO_PROPERTY_GROUP } from "../../../../constants"

export const BasicInfoTabList = [
	{label : '지역별 번호', value : 'city'},
	{label : '사업소 그룹 정보', value : 'propertyGroup'},
	{label : '사업소 정보', value : 'property'},
	{label : '회사 정보', value : 'company'},
	{label : '부서 정보', value : 'department'}
]
export const BasicInfoAPIObj = {
	city : API_SYSTEMMGMT_BASIC_INFO_CITY,
	propertyGroup : API_SYSTEMMGMT_BASIC_INFO_PROPERTY_GROUP,
	property : API_SYSTEMMGMT_BASIC_INFO_PROPERTY,
	company : API_SYSTEMMGMT_BASIC_INFO_COMPANY,
	department: API_SYSTEMMGMT_BASIC_INFO_DEPARTMENT
}
export const BasicInfoLabelObj = {
	city : '지역별 번호',
	propertyGroup : '사업소 그룹 정보',
	property : '사업소 정보',
	company : '회사 정보',
	department: '부서 정보'
}
export const BasicInputPlaceholder = {
	city : '지역의 코드, 이름을 입력해주세요.',
	propertyGroup : '사업소 그룹의 코드, 이름, 그룹을 입력해주세요.',
	property : '사업소의 코드, 이름을 입력해주세요.',
	company : '회사의 코드, 이름을 입력해수제요.',
	department: '부서의 코드, 이름을 입력해수제요.'
}
export const basicInfoColumn = {
	city : [
		{
			name: '지역코드',
			style: {
				justifyContent:'left'
			},
			cell: row => row.code
		},
		{
			name: '지역이름',
			style: {
				justifyContent:'center'
			},
			cell: row => row.name
		}
	],
	propertyGroup : [
		{
			name: '사업소 그룹 코드',
			style: {
				justifyContent:'left'
			},
			cell: row => row.code
		},
		{
			name: '사업소 그룹 이름',
			cell: row => row.name
		}
	],
	property : [
		{
			name: '사업소 코드',
			cell: row => row.code
		},
		{
			name: '사업소 이름',
			cell: row => row.name
		},
		{
			name: '사업소 그룹',
			cell: (row) => (row.property_group ? row.property_group.name : '')
		},
		{
			name: '지역',
			selector: row => (row.city !== null ? row.city.name : '')
		},
		{
			name: '비고',
			cell: row => row.description
		}
	],
	company : [
		{
			name: '회사구분',
			cell: row => row.type
		},
		{
			name: '회사명(코드)',
			cell: row => <Fragment>{row.name}<br/>({row.code})</Fragment>,
			style: {
				width:'100%',
				textAlign: 'center'
			}
		},
		{
			name: '대표자',
			cell: row => row.ceo
		},
		{
			name: '전화',
			cell: row => row.contact_mobile
		},
		{
			name: '핸드폰',
			cell: row => row.phone
		},
		{
			name: '팩스',
			cell: row => row.fax
		},
		{
			name: '비고',
			cell: row => row.description
		}
	],
	department : [
		{
			name: '회사명',
			cell: row => row.company.name
		},
		{
			name: '부서명',
			cell: row => <Fragment>{row.name}<br/>({row.code})</Fragment>,
			style: {
				width:'100%',
				textAlign: 'center'
			}
		}
		// {
		// 	name: '보기 순서',
		// 	cell: row => row.view_order
		// }
	]
}

export const customStyles = {
	headRow: {
		style: {
			// backgroundColor: 'red',
			height: '20px'
		}
	},
	headCells: {
		style: {
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3'
			},
			// backgroundColor: '#FF9F4333',
			// backgroundColor: primaryHeaderColor,
			backgroundColor: '#bad8f7',
			border: '0.5px solid #B9B9C3',
			display: 'flex',
			justifyContent: 'center',
			fontSize: '14px',
			fontFamily: 'Pretendard-Regular'
		}
	},
	cells: {
		style: {
			// 첫번째 cell에만 좌측 테두리 출력
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3',
				justifyContent: 'center'
			},
			border: '0.5px solid #B9B9C3',
			borderTop: 'none', // 상단 테두리 제거
			borderLeft: 'none', // 좌측 테두리 제거
			display: 'flex',
			justifyContent: 'center',
			fontSize: '14px',
			fontWeight: '500',
			testAlign: 'center'
		}
	},
	rows: {
		style: {
			cursor: 'pointer', // 마우스 포인터를 원하는 형태로 변경합니다.
			minHeight: '35px'
		}
	}
}

export const defaultValues = {
	city: {
		code: '',
		name: ''
	},
	propertyGroup: {
		code: '',
		name: ''
	},
	property: {
		code: '',
		name: '',
		property_group: {label:'사업소그룹 선택', value:''},
		city: {label:'지역 선택', value:''},
		// city1: {label:'전체', value:''},
		// city2: {label:'전체', value:''},
		// city3: {label:'전체', value:''},
		use_intranet: false,
		use_alarm: false,
		employee_class_control: false,
		high_property: false,
		description: ''
	},
	company: {
		code: '',
		type: {label: '건물주', value:'건물주'},
		use_property_group: false,
		name: '',
		coporate_number: '',
		company_number: '',
		ceo: '',
		personal_number: '',
		business_type: '',
		business_item: '',
		address: '',
		contact_name: '',
		contact_mobile: '',
		phone: '',
		fax: '',
		email: '',
		description: ''
	},
	department: {
		code: '',
		company: {label: '선택', value:''},
		name: '',
		view_order: 1
	}
}

export const companyTypeList = [
	{label: '건물주', value:'건물주'},
	{label: '협력', value:'cooperate'}
]

const special_pattern = /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/

export const validationSchemaObj = {
	city: yup.object().shape({
		code: yup.string().required('지역 코드를 입력해주세요.').matches(
			special_pattern, "특수문자가 포함되면 안됩니다").max(5, '5자 이하로 입력해주세요.'),
		name: yup.string().required('지역 이름을 입력해주세요.').matches(
			special_pattern, "특수문자가 포함되면 안됩니다").max(10, '10자 이하로 입력해주세요.')
	}),
	propertyGroup: yup.object().shape({
		code: yup.string().required('사업소 그룹 코드를 입력해주세요.').matches(
			special_pattern, "특수문자가 포함되면 안됩니다").max(5, '5자 이하로 입력해주세요.'),
		name: yup.string().required('사업소 그룹 이름을 입력해주세요.').matches(
			special_pattern, "특수문자가 포함되면 안됩니다").max(10, '10자 이하로 입력해주세요.')
	}),
	property: yup.object().shape({
		code: yup.string().required('코드를 입력해주세요.'),
		name: yup.string().required('이름을 입력해주세요.')
	}),
	company: yup.object().shape({
		code: yup.string().required('코드를 입력해주세요.'),
		name: yup.string().required('이름을 입력해주세요.'),
		email: yup.string().email('email 형식에 맞춰주세요.')
	}),
	department: yup.object().shape({
		code: yup.string().required('코드를 입력해주세요.').max(30, '30자 이하로 입력해주세요.'),
		name: yup.string().required('이름을 입력해주세요.').max(30, '30자 이하로 입력해주세요.')
		// view_order: yup.string().required('순서를 입력해주세요.')
	})
}

export const AXIOS = {
	register: axios.post,
	modify: axios.put
}

// { phone: true, phoneRegionCode: 'US' }
export const cleaveFormat = {
	personal_number : { delimiter: '-', blocks: [6, 7], uppercase: true },
	// phone : { delimiter: '-', blocks: [3, 4, 4], uppercase: true }
	phone : { phone: true, phoneRegionCode: 'US' }
}

export const pageTypeKor = {
	register : ' 등록',
	detail : ' 상세',
	modify : ' 수정'
}

/** 문자열 있을 경우 Null처리 */
export const replaceStr2Null = (e, onChange) => {
	e.target.value = e.target.value
	// .replace(/[^0-9]/g, '')
	  .replace(/^(\d{2,3})(\d{4,4})(\d{4})$/, `$1-$2-$3`)
	onChange(e.target.value)
}