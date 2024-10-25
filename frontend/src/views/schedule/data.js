import Swal from "sweetalert2"
import { ROUTE_INSPECTION_INSPECTION_LIST, 
		ROUTE_INSPECTION_COMPLAIN_DETAIL, 
		ROUTE_INSPECTION_DEFECT_DETAIL,
		ROUTE_EDUCATION
} from '../../constants'
import { primaryColor, primaryHeaderColor } from "../../utility/Utils"

export const warningAlert = () => {
	Swal.fire({
		icon: "warning",
		html: "질문에 답하지 않은 항목이 있습니다.<br/> 확인 후 다시 저장해 주세요.",
		showCancelButton: true,
		showConfirmButton: false,
		cancelButtonText: "확인",
		// cancelButtonColor : '#FF9F43',
		cancelButtonColor : primaryColor,
		//#3f90e8
		reverseButtons :true,
		customClass: {
			actions: 'sweet-alert-custom right'
		}
	})
}


export const completeAlert = (callback) => {
	Swal.fire({
		icon: "warning",
		title : '업무 일정을 등록하시겠습니까?',
		text: "기간 내 문서 중 결재 내역이 없는 경우 해당 일지가 초기화되며 이는 작성이 완료된 문서에는 영향을 끼치지 않습니다.",
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
		}
	})
}

export const modifyCompleteAlert = (callback) => {
	Swal.fire({
		icon: "warning",
		titleText : '업무 일정을 수정하시겠습니까?',
		text: "기간 내 문서 중 결재 내역이 없는 경우 해당 일지가 초기화되며 이는 작성이 완료된 문서에는 영향을 끼치지 않습니다.",
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
		}
	})
}

export const completeResultAlert = (data, navigate, templeteCode) => {
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
			navigate(`${ROUTE_INSPECTION_INSPECTION_LIST}/${templeteCode}`)
		}
	})
}

export const completeResultToListAlert = (data, navigate, URL) => {
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
		// if (data === '등록을') {
			navigate(URL)
		// }
	})
}

export const deleteAlert = (callback) => {
	
	Swal.fire({
		icon: "warning",
		html: "정말 삭제하시겠습니까?",
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

export const customQaStyles = {
	headCells: {
		style: {
			backgroundColor: primaryHeaderColor,
			border: '0.5px solid #B9B9C3',
			height : 'auto'
			// display: 'flex',
			// justifyContent: 'center',
			// fontSize: '18px'
		}
	},
	cells: {
		style: {
			// 첫번째 cell에만 좌측 테두리 출력
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3'
				// minWidth: 'auto'
			},
			border: '0.5px solid #B9B9C3',
			borderTop: 'none', // 상단 테두리 제거
			borderLeft: 'none', // 좌측 테두리 제거
			display: 'flex',
			justifyContent: 'left',
			fontSize: '16px',
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

export const maintenanceList = [
	{label : "(선택)", value : ""},
	{label : "일마다", value : "everyday"},
	{label : "주마다", value : "everyWeek"},
	{label : "개월마다(요일)", value : "everyMonthDay"},
	{label : "개월마다(날짜)", value : "everyMonthDate"}
]
export const dayFormatList = [
	{label : "(선택)", value : ""},
	{label : "주말/공휴일의 경우 그대로 생성", value : "default"},
	{label : "주말/공휴일의 경우 이전 평일에 생성", value : "before"},
	{label : "주말/공휴일의 경우 다음 평일에 생성", value : "after"}
]

export const weekdaysData = {
	// 0일때 클릭x || 1일때 클릭상태
	Sun : false,
	Mon : false,
	Tue : false,
	Wed : false,
	Thu : false,
	Fri : false,
	Sat : false
}

export const weekdayKr = {
	Sun : '일',
	Mon : '월',
	Tue : '화',
	Wed : '수',
	Thu : '목',
	Fri : '금',
	Sat : '토'
}

export const numToWeek = {
	0 : 'Sun',
	1 : 'Mon',
	2 : 'Tue',
	3 : 'Wed',
	4 : 'Thu',
	5 : 'Fri',
	6 : 'Sat'
}

// export const weekdayNumberKr = {
// 	0 : '월',
// 	1 : '화',
// 	2 : '수',
// 	3 : '목',
// 	4 : '금',
// 	5 : '토',
// 	6 : '일'
// }

// export const weekMonthKr = {
// 	5 : '마지막',
// 	1 : '첫번째',
// 	2 : '두번째',
// 	3 : '세번째',
// 	4 : '네번째'
// }

export const dayOptionKr = {
	0 : '(주말/공휴일의 경우 그대로 생성)',
	'-1' : '(주말/공휴일의 경우 이전 평일에 생성)',
	1 : '(주말/공휴일의 경우 다음 평일에 생성)'
}

export const numberToChangeKr = {
	0 : 'default',
	'-1' : 'before',
	1 : 'after'
}

export const detailPageUrl = {
	불편신고: ROUTE_INSPECTION_COMPLAIN_DETAIL,
	하자관리: ROUTE_INSPECTION_DEFECT_DETAIL,
	safety: `${ROUTE_EDUCATION}/safety/detail`,
	general: `${ROUTE_EDUCATION}/general/detail`,
	legal: `${ROUTE_EDUCATION}/legal/detail`,
	cooperator:`${ROUTE_EDUCATION}/cooperator/detail`
}

export const checkSelectValueObj = (control, selectError, setSelectError, type) => {
	const tempObj = {}
	Object.keys(selectError).map((data) => {
		if (type) {
			if (control._formValues[data].value === '') {
				tempObj[data] = true
				const parentElement = document.querySelector(`.custom-select-${data}`)
				if (parentElement) { // Check if parentElement exists (is not null)
				const childElement = parentElement.querySelector('.select__control')
				childElement.style.borderColor = 'red'
				}
			} else {
				tempObj[data] = false
			}
		} else {
			if (data !== 'choice_format') {
				if (control._formValues[data].value === '') {
					tempObj[data] = true
					const parentElement = document.querySelector(`.custom-select-${data}`)
					if (parentElement) { // Check if parentElement exists (is not null)
					const childElement = parentElement.querySelector('.select__control')
					childElement.style.borderColor = 'red'
					}
				} else {
					tempObj[data] = false
				}
			}
		}
	})
	setSelectError(tempObj)
	  const checkTrueFalse = Object.keys(tempObj).every(key => tempObj[key] === false)
	  return checkTrueFalse
}
export const checkBorderColor = (e, name, selectError, setSelectError, setValue) => {
	const parentElement = document.querySelector(`.custom-select-${name}`)
	if (parentElement) { // Check if parentElement exists (is not null)
		const childElement = parentElement.querySelector('.select__control')
		setSelectError({
			...selectError,
			[name]: false
		})
		childElement.style.borderColor = '#d8d6de'
	}
	setValue(name, e)
}

export const WeeklyDaysButton = (props) => {
	const {weekdays, setWeekdays, state} = props
	const weekTemp = {
		Sun : '일',
		Mon : '월',
		Tue : '화',
		Wed : '수',
		Thu : '목',
		Fri : '금',
		Sat : '토'
	}
	const onClickWeekDays = (name) => {
		console.log("!!!!!!!", name)
		let clickState = 0
		Object.values(weekdays).map((value) => {
			if (value) {
				clickState += 1
			} 
		})
		if (clickState > 1) {
			setWeekdays({
				...weekdays,
				[name] : !weekdays[name]
			})
		} else if (clickState === 1) {
			if (!weekdays[name]) {
				setWeekdays({
					...weekdays,
					[name] : !weekdays[name]
				})	
			}
		}
	}
	return (
		
		<div style={{display : 'flex', marginTop : '0.5rem'}}>
			{Object.entries(weekTemp).map(([key, value]) => {
				let clickState = ''
				if (weekdays[key]) {
					clickState = 'click'
				}
				return (
					<div key={key} className={`custom-button-date ${state} ${clickState}`} onClick={() => onClickWeekDays(key)}>{value}</div>
					)
				})
			}
		</div>
		
	)
}