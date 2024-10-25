import * as yup from 'yup'
import { API_SPACE_BUILDING, API_SYSTEMMGMT_BASIC_INFO_FLOOR } from "../../../../constants"

export const BasicInfoTabList = [
	{label : '건물정보', value : 'building'},
	{label : '층정보', value : 'floor'}
]

export const labelObj = {
	building : '건물정보',
	floor : '층정보'
}

export const spacePlaceHolder = {
	building: '건물의 코드, 이름을 입력해주세요.',
	floor: '층의 코드, 층명을 입력해주세요.'
}

export const apiObj = {
	building : API_SPACE_BUILDING,
	floor : API_SYSTEMMGMT_BASIC_INFO_FLOOR
}

export const basicInfoColumn = {
	building : [
		{
			name: '코드',
			cell: row => row.code
		},
		{
			name: '건물명',
			cell: row => row.name
		}
	],
	floor : [
		{
			name: '사업소 코드',
			cell: row => `${row.property.name}(${row.property.code})`
		},
		{
			name: '건물 코드',
			cell: row => `${row.building.name}(${row.building.code})`
		},
		{
			name: '층 코드',
			cell: row => row.code
		},
		{
			name: '층명',
			// selector: row => (row.city !== null ? row.city.name : '')
			cell: row => row.name
		}
	]
}

export const defaultValues = {
	building: {
		code: '',
		name: '',
		comments : ""
	},
	floor: {
		code: '',
		name: '',
		property: {label:'선택', value:''},
		building: {label:'선택', value:''}
	}
}

export const validationSchemaObj = {
	building: yup.object().shape({
		code: yup.string().required('코드를 입력해주세요.'),
		name: yup.string().required('이름을 입력해주세요.')
	}),
	floor: yup.object().shape({
		code: yup.string().required('코드를 입력해주세요.'),
		name: yup.string().required('이름을 입력해주세요.')
	})
}

export const pageTypeKor = {
	register : ' 등록',
	detail : ' 상세',
	modify : ' 수정'
}