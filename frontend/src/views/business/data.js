import * as yup from 'yup'
import { API_BUSINESS_COST } from '../../constants'
import axios from "axios"
import { primaryHeaderColor } from '../../utility/Utils'
import { BUSINESS_MAINTENANCE, BUSINESS_PLAN } from '../../constants/CodeList'
export const CHANGE_ROW = 0
export const CHANGE_COL = 1
export const CHANGE_VALUE = 3
export const PRICE_OLD_BUILDING = 0
export const PRICE_NEW_BUILDING = 1
export const PRICE_TOTAL_BUILDING = 2
export const DELETE_BTN = 5

export const stateCodeObj = {
	maintenance: BUSINESS_MAINTENANCE, // '유지보수',
	plan: BUSINESS_PLAN //'장기수선충당금'
}
export const stateObj = {
	maintenance: '유지보수',
	plan: '장기수선충당금'
}

export const costTypeVal = {
	maintenance: 0,
	plan: 1
}

export const BUILDING_TYPE = {
	false: '기존건물',
	true: '신건물'
}

export const selectBuildingTypeList = [
	{label:'기존건물', value:0},
	{label:'신건물', value:1}
]


export const apiObj = {
	cost: API_BUSINESS_COST
}

export const customStyles = {
	tableWrapper: {
        style: {
            display: 'table',
            height: '100%',
            width: '100%'
        }
    },
	headCells: {
		style: {
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3'
			},
			backgroundColor: primaryHeaderColor,
			borderTop: '0.5px solid #B9B9C3',
			borderBottom: '0.5px solid #B9B9C3',
			borderRight: '0.5px solid #B9B9C3',
			justifyContent: 'center',
			fontSize: '14px',
			fontWeight: '700',
			width: '100%'
		}
	},
	cells: {
		style: {
			// 첫번째 cell에만 좌측 테두리 출력
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3'
			},
			border: '0.5px solid #B9B9C3',
			borderTop: 'none', // 상단 테두리 제거
			borderLeft: 'none', // 좌측 테두리 제거
			display: 'flex',
			justifyContent: 'center',
			fontSize: '14px',
			fontWeight: '400',
			color: '#5E5873',
			fontFamily: 'Pretendard-Regular'
		}
	},
	rows: {
		style: {
			cursor: 'default', // 마우스 포인터를 원하는 형태로 변경합니다.
			minHeight: '35px'
		}
	}
}

export const columns = {
	itemsMgmt: [
		{
			name:'건물',
			cell: row => row.title
		},
		{
			name:'등록일',
			cell: row => row.date
		}
	]
}

export const defaultValues = {
	cost: {},
	itemsMgmt: {
		title: ''
	},
	addItem: {
		code: '',
		additional: '',
		memo: ''
	}
}

export const validationSchemaObj = {
	cost: yup.object().shape({}),
	itemsMgmt: yup.object().shape({
		title: yup.string().required('제목을 입력해주세요.')
	}),
	addItem: yup.object().shape({
		code: yup.string().required('분류명을 입력해주세요.'),
		additional: yup.string()
			.test({
				message: '유효한 양수값을 넣어주세요.',
				test: (additional) => {
					if (additional === '' || (parseInt(additional) >= 0 && parseFloat(additional) >= 0)) return true
					else return false
				}
			})
	})
}

export const checkLongTermRepairPlanRowValidation = (type, value) => {
	switch (type) {
		case 'date':
			const format = /^(19[7-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
			return format.test(value)
			// return true

		case 'price':
			if (value === null || value === '') return false
			if (isNaN(value)) {
				return false
			} else return true
		case 'title':
			if (value !== '' && value !== null) return true
			return false
		case 'company':
			if (value !== '' && value !== null) return true
			return false
		case 'building':
			if (buildingType.includes(value)) return true
			return false
		default:
			return true
	}
}

export const cellTypeClass = {
	date: {
		true: [],
		false: ['htInvalid']
	},
	title: {
		true: ['htMiddle'],
		false: ['htInvalid']
	},
	company: {
		true: ['htMiddle'],
		false: ['htInvalid']
	},
	building : {
		true: ['htMiddle', 'htCenter', 'htAutocomplete', 'current', 'highlight'],
		false: ['htMiddle', 'htCenter', 'htInvalid', 'htAutocomplete', 'current', 'highlight']
	},
	price : {
		true: ['htMiddle', 'htRight', 'htNumeric', 'current', 'highlight'],
		false: ['htMiddle', 'htRight', 'htNumeric', 'htInvalid', 'current', 'highlight']
	}
}

// 빌딩용 
export const getSelectShiftRedux = (API, param, dispatch, callback) => {
	axios.get(API, {
		params: param
	})
	.then(res => {
		if (Array.isArray(res.data)) { // 배열인지 체크
			res.data.shift() // shift
			dispatch(callback(res.data))
		}
	})
	.catch(res => {
		console.log(API, res)
	})
}

export const ApprovalDetailTypeObj = {
    btl : 'BTL 사업소',
    ouriduri : '우리두리 사업소'
}