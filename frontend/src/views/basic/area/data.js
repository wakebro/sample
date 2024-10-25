import { Fragment } from "react"
import * as yup from 'yup'

const returnRowValue = (row, unit = null) => {
	if (row === undefined) return
	if (row !== null && Object.keys(row).includes('name')) {
		return (
			<Fragment>{row.name}{unit}</Fragment>
		)
	} else if (row !== null) {
		return (
			<Fragment>{row}{unit}</Fragment>
		)
	} else {
		return false
	}
}

export const BuildingSummaryList = [
	{label : '건물이름', value : 'name'},
	{label : '지역', value : 'district'},
	{label : '용도', value : 'main_purpose'},
	// {label : '담당자', value : 'contact_name'},
	// {label : '연락처', value : 'contact_phone'},
	// {label : '건물 수', value : 'prop_group'},
	{label : '주소', value : 'address'}
]

export const defaultValues = {
	property: {
		address: '',
		city: {label:'전체', value:''},
		code: '',
		contact_name: '',
		contact_phone: '',
		description: '',
		name: '',
		prop_group: '',
		main_purpose: '',
		overdue_daily_rate: '',
		overdue_monthly_rate: ''
	},
	floor: {
		property: '',
		building: '',
		code: '',
		name: '',
		fl_area: '',
		description: ''
	},
	room: {
		building: {label:'등록된 건물이 없습니다.', value:''},
		floor: {label:'등록된 층이 없습니다.', value:''},
		code: '',
		name: '',
		description: ''
	}
}

export const validationSchemaObj = {
	property: yup.object().shape({
		name: yup.string().required('사업소를 입력해주세요.'), 
		fl_area: ''
	}),
	floor: yup.object().shape({
		name: yup.string().required('층 이름을 입력해주세요.'),
		fl_area: yup.string()
			.matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
			.transform((value, originalValue) => {
				if (originalValue === "") return '0'
				return value
				})  
			.matches(/^[^0]/, '1 이상 값을 입력해주세요.')
	}),
	room: yup.object().shape({
		name: yup.string().required('실 이름을 입력해주세요.'),
		code: yup.string().required('실 번호를 입력해주세요.')
	})
}

const conditionalCellStyles = [
	{
		when: (row) => row.name === undefined, // 마지막 행인 경우
		style: {
			// 첫번째 cell에만 좌측 테두리 출력
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3'
			},
			'&:last-child': {
				borderRight: '0.5px solid #B9B9C3'
			},
			display : 'flex',
			justifyContent : 'flex-end',
			border: '0.5px solid #B9B9C3',
			borderTop: 'none', // 상단 테두리 제거
			borderLeft: 'none', // 좌측 테두리 제거
			borderRight :'none'
		}
	}
]

export const columns = {
	property: [
		{
			name: '지역',
			sortable: true,
			selector: 'city',
			cell: row => { return <Fragment>{(row.city)}</Fragment> },
			conditionalCellStyles : conditionalCellStyles
		},
		{
			name: '사업소',
			sortable: true,
			selector: 'name',
			cell: row => { return <Fragment>{(row.name)}</Fragment> },
			conditionalCellStyles : conditionalCellStyles
		},
		{
			name: '주소',
			sortable: true,
			selector: 'address',
			cell: row => { return <Fragment>{(row.address)}</Fragment> },
			conditionalCellStyles : conditionalCellStyles
		},
		{
			name: '담당자',
			sortable: true, 
			selector: 'contact_name',
			cell: row => { return <Fragment>{(row.contact_name)}</Fragment> },
			conditionalCellStyles : conditionalCellStyles
		},
		{
			name: '건물수',
			sortable: true,
			selector: 'prop_group',
			cell: row => { return (row.name !== undefined) ? <Fragment>{(row.prop_group).toLocaleString('ko-KR')}</Fragment> : <Fragment>{(row.prop_group)}</Fragment> },
			conditionalCellStyles : conditionalCellStyles
		}
	],
	floor: [
		{
			name: '사업소',
			selector: 'property',
			selector: row => returnRowValue(row.property),
			conditionalCellStyles : conditionalCellStyles
		},
		{
			name: '건물',
			selector: 'building',
			cell: row => returnRowValue(row.building),
			conditionalCellStyles : conditionalCellStyles
		},
		{
			name: '층',
			selector: 'name',
			cell: row => { return (row.name) },
			conditionalCellStyles : conditionalCellStyles
		},
		{
			name: '층면적',
			selector: 'fl_area',
			cell: row => returnRowValue(row.fl_area, <Fragment>m<sup>2</sup></Fragment>),
			conditionalCellStyles : conditionalCellStyles
		},
		{
			name: '입주사현황',
			selector: 'description',
			cell: row => { return <Fragment >{(row.description)}</Fragment> },
			conditionalCellStyles : conditionalCellStyles
		}
	],
	room: [
		{
			name:'사업소',
			cell: row => row.property.name
		},
		{
			name:'건물',
			cell: row => row.building.name
		},
		{
			name:'층',
			cell: row => row.floor.name
		},
		{
			name:'실번호',
			cell: row => row.code
		},
		{
			name:'실이름',
			cell: row => row.name
		},
		{
			name:'입주사',
			cell: row => { return <Fragment >{(row.description)}</Fragment> }
		}
	]
}