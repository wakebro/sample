import axios from '@utility/AxiosConfig'
import * as moment from 'moment'
import { Col, Row } from "reactstrap"
import Swal from "sweetalert2"
import * as yup from 'yup'
import { ROUTE_INSPECTION_INSPECTION_LIST, ROUTE_CRITICAL_DISASTER_LIST } from '../../constants'
import { primaryColor, primaryHeaderColor } from '../../utility/Utils'

export const timeListOption = [
	{label : '00시', value : 0},
	{label : '01시', value : 1},
	{label : '02시', value : 2},
	{label : '03시', value : 3},
	{label : '04시', value : 4},
	{label : '05시', value : 5},
	{label : '06시', value : 6},
	{label : '07시', value : 7},
	{label : '08시', value : 8},
	{label : '09시', value : 9},
	{label : '11시', value :11},
	{label : '12시', value :12},
	{label : '13시', value :13},
	{label : '14시', value :14},
	{label : '15시', value :15},
	{label : '16시', value :16},
	{label : '17시', value :17},
	{label : '18시', value :18},
	{label : '19시', value :19},
	{label : '20시', value :20},
	{label : '21시', value :21},
	{label : '22시', value :22},
	{label : '23시', value :23},
	{label : '24시', value :24}
]
export const multiChoiceList = [
	{label : '점수(1~10)', value : 0},
	{label : 'O/X', value : 1},
	{label : '5지선다형(A-E)', value : 2}
]

export const signListObj = {
	0: '담당자',
	1: '1차결재자',
	2: '2차 결재자',
	3: '최종 결재자'
}

export const scoreChoiceList = [
	{label : '1', value : 1},
	{label : '2', value : 2},
	{label : '3', value : 3},
	{label : '4', value : 4},
	{label : '5', value : 5},
	{label : '6', value : 6},
	{label : '7', value : 7},
	{label : '8', value : 8},
	{label : '9', value : 9},
	{label : '10', value : 10}
]
export const OXChoiceList = [
	{label : 'O', value : 0},
	{label : 'X', value : 1}
]

export const fiveSelectList = [
	{label : 'A', value : 1},
	{label : 'B', value : 2},
	{label : 'C', value : 3},
	{label : 'D', value : 4},
	{label : 'E', value : 5}	
]

export const warningAlert = () => {
	Swal.fire({
		icon: "warning",
		html: "질문에 답하지 않은 항목이 있습니다.<br/> 확인 후 다시 저장해 주세요.",
		showCancelButton: true,
		showConfirmButton: false,
		cancelButtonText: "확인",
		cancelButtonColor : primaryColor,
		reverseButtons :true,
		customClass: {
			actions: 'sweet-alert-custom right'
		}
	})
}

export const completeAlert = (callback) => {
	Swal.fire({
		icon: "warning",
		html: "저장 후에는 양식을 수정할 수 없습니다. <br/> 저장하시겠습니까?",
		showCancelButton: true,
		showConfirmButton: true,
		cancelButtonText: "취소",
		// cancelButtonColor : primaryColor,
		confirmButtonText: '확인',
		confirmButtonColor : primaryColor,
		reverseButtons :true,
		customClass: {
			actions: 'sweet-alert-custom right',
			cancelButton: 'me-1'
		}
	}).then((result) => {
		if (result.isConfirmed) {
			callback()
		} else if (result.dismiss) {
			Swal.fire({
				icon: "info",
				html: "취소하였습니다.",
				showCancelButton: true,
				showConfirmButton: false,
				cancelButtonText: "확인",
				cancelButtonColor : primaryColor,
				reverseButtons :true,
				customClass: {
					actions: 'sweet-alert-custom right'
				}
			})
		}
	})
}

export const completeResultAlert = (data, navigate, templeteCode, state) => {
	Swal.fire({
		icon: "success",
		html: `${data} 성공적으로 완료하였습니다.!`,
		showCancelButton: true,
		showConfirmButton: false,
		cancelButtonText: "확인",
		cancelButtonColor : primaryColor,
		reverseButtons :true,
		customClass: {
			actions: 'sweet-alert-custom right'
		}
	}).then(() => {
		if (data === '삭제를') {
			navigate(`${state.state.type === undefined ? ROUTE_INSPECTION_INSPECTION_LIST : ROUTE_CRITICAL_DISASTER_LIST}/${templeteCode}`, {state:{type: state.state.type, scheduleId: state.state.scheduleId}})
		}
	})
}

export const deleteAlert = (callback) => {
	
	Swal.fire({
		icon: "warning",
		html: "정말 삭제하시겠습니까?",
		showCancelButton: true,
		showConfirmButton: true,
		cancelButtonText: "취소",
		// cancelButtonColor : primaryColor,
		confirmButtonText: '확인',
		confirmButtonColor : primaryColor,
		reverseButtons :true,
		customClass: {
			actions: 'sweet-alert-custom right',
			cancelButton: 'me-1'
		}
	}).then((result) => {
		if (result.isConfirmed) {
			callback()
		} else if (result.dismiss) {
			Swal.fire({
				icon: "info",
				html: "취소하였습니다.",
				showCancelButton: true,
				showConfirmButton: false,
				cancelButtonText: "확인",
				cancelButtonColor : primaryColor,
				reverseButtons :true,
				customClass: {
					actions: 'sweet-alert-custom right'
				}
			})
		}
	})
}

export const temporaryResultAlert = (callback) => {
	Swal.fire({
		icon: "warning",
		html: "임시저장 하시겠습니까?. <br/> 작성한 정보가 임시저장됩니다.",
		showCancelButton: true,
		showConfirmButton: true,
		cancelButtonText: "취소",
		// cancelButtonColor : '#FF9F43',
		confirmButtonText: '확인',
		confirmButtonColor : primaryColor,
		reverseButtons :true,
		customClass: {
			actions: 'sweet-alert-custom right',
			cancelButton: 'me-1'
		}
	}).then((result) => {
		if (result.isConfirmed) {
			callback()
		} else if (result.dismiss) {
			Swal.fire({
				icon: "info",
				html: "취소하였습니다.",
				showCancelButton: true,
				showConfirmButton: false,
				cancelButtonText: "확인",
				cancelButtonColor : primaryColor,
				reverseButtons :true,
				customClass: {
					actions: 'sweet-alert-custom right'
				}
			})
		}
	})
}
const conditionalPerCellStyles = [
	{
		when: (row) => row.class === '합계', // 마지막 행인 경우
		style: {
			borderRight : '0px',
			paddingRight : '0px',
			paddingLeft : '42px',
			justifyContent : 'flex-end'
			
		}
	}
]
const conditionalBlankCellStyles = [
	{
		when: (row) => row.class === '합계', // 마지막 행인 경우
		style: {
			minWidth : '0px',
			paddingRight : '42px',
			paddingLeft : '0px',
			justifyContent : 'flex-start'
		}
	}
]
export const conditionalRowStyles = [
	{
		when: (row) => row.class === '합계', // 마지막 행인 경우
		style: {
			backgroundColor : '#FFF8F2'
		}
	}
]
const customRowUnit = (data, type) => {
	if (data.class === '합계') {
		return `${data[type]}${data.per}`
	} else {
		return data[type]
	}
}


export const performanceColumn = [
	{
		name: '직종',
		sortable: false,
		sortField: 'class',
		selector: row => row.class
	},
	{
		name: '일지명',
		sortable: false,
		sortField: 'name',
		// conditionalCellStyles : conditionalCellStyles,
		selector: row => row.name
		// cell: row => { return row.name }
	},
	{
		name: '1월',
		sortable: false,
		sortField: 'Jan',
		selector: row => customRowUnit(row, 'Jan')
	},
	{
		name: '2월',
		sortable: false,
		sortField: 'Feb',
		selector: row => customRowUnit(row, 'Feb')
	},
	{
		name: '3월',
		sortable: false,
		sortField: 'Mar',
		selector: row => customRowUnit(row, 'Mar')
	},
	{
		name: '4월',
		sortable: false,
		sortField: 'Apr',
		selector: row => customRowUnit(row, 'Apr')
	},
	{
		name: '5월',
		sortable: false,
		sortField: 'May',
		selector: row => customRowUnit(row, 'May')
	},
	{
		name: '6월',
		sortable: false,
		sortField: 'Jun',
		selector: row => customRowUnit(row, 'Jun')
	},
	{
		name: '7월',
		sortable: false,
		sortField: 'Jul',
		selector: row => customRowUnit(row, 'Jul')
	},
	{
		name: '8월',
		sortable: false,
		sortField: 'Aug',
		selector: row => customRowUnit(row, 'Aug')
	},
	{
		name: '9월',
		sortable: false,
		sortField: 'Sep',
		selector: row => customRowUnit(row, 'Sep')
	},
	{
		name: '10월',
		sortable: false,
		sortField: 'Oct',
		selector: row => customRowUnit(row, 'Oct')
	},
	{
		name: '11월',
		sortable: false,
		sortField: 'Nov',
		selector: row => customRowUnit(row, 'Nov')
	},
	{
		name: '12월',
		sortable: false,
		sortField: 'Dec',
		selector: row => customRowUnit(row, 'Dec')
	},
	{
		name: '합계',
		sortable: false,
		sortField: 'total',
		conditionalCellStyles : conditionalPerCellStyles,
		selector: row => row.total
	},
	{
		name: '완료율',
		sortable: true,
		sortField: 'per',
		conditionalCellStyles : conditionalBlankCellStyles,
		cell: row => { return (row.class === '합계' ? row.per : `${row.per}%`) } 
	}
]

export const customStyles = {
	headCells: {
		style: {
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3'
			},
			'&:nth-child(2)': {
				minWidth : '150px !important'
			},
			// backgroundColor: '#FF9F4333',
			backgroundColor: primaryHeaderColor,
			border: '0.5px solid #B9B9C3',
			display: 'flex',
			justifyContent: 'center',
			fontSize: '12px'
		}
	},
	cells: {
		style: {
			// 첫번째 cell에만 좌측 테두리 출력
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3'
			},
			'&:nth-child(2)': {
				minWidth : '150px !important'
				// whiteSpace : 'nowrap'
				// minWidth: 'auto'
			},
			border: '0.5px solid #B9B9C3',
			borderTop: 'none', // 상단 테두리 제거
			borderLeft: 'none', // 좌측 테두리 제거
			display: 'flex',
			justifyContent: 'center',
			fontSize: '16px',
			fontFamily: 'Pretendard-Regular'
		}
	}
}

export const columnHeader = ['직종', '일지명', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '합계', '완료율']
export const columnWidths = ['70px', '180px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px']

export const descriptionTemp = (data) => {
	if (data !== undefined) {
		if (data['questions'] !== undefined) {
			let check = false
			data['questions'].forEach((v) => {
				if (v['use_description']) {
					check = true
				}
			})
			if (check) {
				return (
					<Col>
						비고
					</Col>
				)
			}
		}
	}
}

export const QaListTemp = (data) => {
	let check = false
	data['questions'].forEach((v) => {
		if (v['use_description']) {
			check = true
		}
	})
	return (
		data['questions'].map((v, i) => {
			let answer = ""
			if (v['is_choicable']) {
				answer = v['answer']
			} else {
				if (v['choice_type'] === 0) {
					if (v['answer'] !== null && v['answer'] !== "") {
						answer = scoreChoiceList.find(item => item.value === parseInt(v['answer'])).label
					}
				} else if (v['choice_type'] === 1) {
					if (v['answer'] !== null && v['answer'] !== "") {
						answer = OXChoiceList.find(item => item.value === parseInt(v['answer'])).label
					}
				} else if (v['choice_type'] === 2) {
					if (v['answer'] !== null && v['answer'] !== "") {
						answer = fiveSelectList.find(item => item.value === parseInt(v['answer'])).label
					}
				}
			}
			return (
				<Row style={{borderBottom : '1px solid #D8D6DE'}} key={v['title'] + i} >
					<Col className='mt-1 mb-1' lg={check ? 4 : 6} xs={check ? 4 : 6} style={{display:"flex", alignItems : 'center'}}>
						{v['title']}
					</Col>
					<Col className='mt-1 mb-1' lg={check ? 4 : 6} xs={check ? 4 : 6} style={{display:"flex", alignItems : 'center'}}>
						{answer}
					</Col>
					{v['use_description'] && 
					<Col className='mt-1 mb-1' lg={4} xs={4}>
						{v['description']}
					</Col>
					}
				</Row>		
			)
		})
	)
}

// 점검일지 validation
export const validationChecklistResult =  
yup.object().shape({
	//comment: yup.string().required('교육 내용을 입력해주세요.')
})

// 점검 일지 필수 표시
export const RequiredCheck = () => {
	return (
		<div className='d-inline-block essential_value'/>
	)
}

// no data row
export const NoDataComponent = () => (
	<div style={{margin:'3%'}} className="hand-no-data">데이터가 없습니다.</div>
)

export const defaultWorkList = [
	{label: '업무 종류를 고르세요', value:''},
	{label: '공사', value:'공사'},
	{label: '민원업무', value:'민원업무'},
	{label: '서비스', value:'서비스'},
	{label: '순회점검', value:'순회점검'},
	{label: '위험성평가', value:'위험성평가'},
	{label: '이용자불편사항', value:'이용자불편사항'},
	{label: '작업', value:'작업'},
	{label: '작업/공사(기술팀)', value:'작업/공사(기술팀)'},
	{label: '작업/공사(외주)', value:'작업/공사(외주)'},
	{label: '작업/공사(현장소장)', value:'작업/공사(현장소장)'},
	{label: '점검', value:'점검'},
	{label: '점검(현장소장)', value:'점검(현장소장)'},
	{label: '지원요청', value:'지원요청'}
]

export const defaultWorkTypeList = [
	{label:'미지정', value:'미지정'},
	{label:'작업 수행', value:'작업 수행'},
	{label:'자재 불출', value:'자재 불출'},
	{label:'작업 준비', value:'작업 준비'},
	{label:'이동 시간', value:'이동 시간'},
	{label:'보안 대기', value:'보안 대기'},
	{label:'고객 대기', value:'고객 대기'}
]

export function customGetTableData(API, param, setState, key = null) {
	axios.get(API, {
		params: param
	})
	.then(res => {
		if (key) {
			setState(res.data[key])
		} else {
			res.data[0].label = `${res.data[0].label} 선택`
			setState(res.data)
		}
	})
	.catch(res => {
		console.log(API, res)
	})
}

export const columns = {
	workerForm : [
		{
			name: '작업자',
			cell: row => row.worker.name,
			minWidth: '100px'
		},
		{
			name: '직급',
			cell: row => row.worker.position,
			width: '80px'
		},
		{
			name: '직종',
			cell: row => row.worker.employee_class,
			width: '80px'
		},
		{
			name: '작업타입',
			cell: row => row.worktype,
			minWidth: '100px'
		},
		{
			name: '작업일시',
			cell: row => row.workerDate,
			minWidth: '160px'
		},
		{
			name: '작업시간',
			cell: row => row.workHour,
			minWidth: '100px'
		},
		{
			name: '비고',
			cell: row => row.description
		}
	],
	material: [
		{
			name: '구분',
			cell: row => (row.is_rest ? '재고' : '잉여'),
			width: '80px'
		},
		{
			name: '자재코드',
			cell: row => row.material.code,
			minWidth: '150px'
		},
		{
			name: '사용일',
			cell: row => moment(row.materialDate).format('YYYY-MM-DD'),
			minWidth: '150px'
		},
		{
			name: '사용량',
			cell: row => (row.is_rest ? row.price.quantity : row.usage),
			width: '80px'
		},
		{
			name: '발급단위',
			cell: row => (row.is_rest ? row.material.unit : row.unit),
			width: '100px'
		},
		{
			name: '단가',
			cell: row => <Col style={{textAlign: 'end'}}> {(row.is_rest ? row.price.unit_price.toLocaleString('ko-KR') : '-')} </Col>,
			minWidth: '100px'
		},
		{
			name: '금액',
			cell: row => <Col style={{textAlign: 'end'}}> {(row.is_rest ? (row.price.unit_price * row.price.quantity).toLocaleString('ko-KR') : '-')} </Col>,
			minWidth: '100px'
		},
		{
			name: '설명',
			cell: row => row.Instructions
		}
	],
	toolEquipment: [
		{
			name: '공구비품코드',
			cell: row => row.toolequipment.code,
			minWidth: '300px'
		},
		{
			name: '사용일시',
			cell: row => row.workToolDate,
			minWidth: '200px'
		},
		{
			name: '사용내역',
			cell: row => row.useHistory
		}
	]
}