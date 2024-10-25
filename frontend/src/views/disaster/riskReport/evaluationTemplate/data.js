import moment from "moment"

/** 위험성 평가 양식 페이지 타입 ex) list, form, detail, templateCode
 * @var list 양식 목록
 * @var form 양식 등록
 * @var detail 양식 상세
 * @var templateCode 세부사항, 위험분류
 */
export const templatePageType = {
    list: '목록',
    form: '등록',
    detail: '상세',
    templateCode: ['세부작업명 목록', '위험분류 목록']
}

/** 위험성 평가 양식 탭 리스트 ex) 위험성평가 양식, 평가요소 설정
 * @var list 양식 목록
 * @var templateCode 세부사항, 위험분류
 */
export const tabList = [
	{label: '위험성평가 양식', value: 'list'},
	{label: '평가요소 설정', value: 'templateCode'}
]

export const templateTypeList = [
    {label:'빈도강도(3x3)', value:0},
    {label:'빈도강도(5x5)', value:1},
    {label:'3단계', value:2},
    {label:'체크리스트', value:3}
]

export const FREQUENCY_3X3 = 0
export const FREQUENCY_5X5 = 1
export const STEP_3 = 2
export const CHECKLIST = 3

export const evaluationTypeBadge = {
	[FREQUENCY_3X3]: <span className='basic-badge evaluation'>빈도•강도법(3x3)</span>,
	[FREQUENCY_5X5]: <span className='basic-badge evaluation'>빈도•강도법(5x5)</span>,
	[STEP_3]: <span className='basic-badge evaluation'>3단계 판단법</span>,
	[CHECKLIST]: <span className='basic-badge evaluation'>체크리스트</span>
}

// 사업소 그룹 선택 steps
export const evaluationModalSteps = [
    {
        id:'1',
        title: '1. 사업소그룹',
        content: <>임시</>
    }
]

// 사업소 그룹 steps index
export const evaluationModalStepIndex = {
    1: 0,
    2: 1
}

export const templateTypeObjList = [
    {label:'빈도강도(3x3)', value:0},
    {label:'빈도강도(5x5)', value:1},
    {label:'3단계', value:2},
    {label:'체크리스트', value:3}
]

export const templateStyles = {
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
			backgroundColor: '#FF9F4333',
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
// 위험성 평가 양식 리스트 컬럼
export const templateColumns = [
    {
        name: '등록일자',
        cell: row => moment(row.regDate).format('YYYY-MM-DD'),
        sortable: true,
        width: '175px'
    },
	{
        name: '수정일자',
        cell: row => (row.modDate !== '' ? moment(row.modDate).format('YYYY-MM-DD') : ''),
        sortable: true,
        width: '175px'
    },
    {
        name: '평가 방법',
        cell: row => row.type,
        sortable: false,
        width: '180px',
		style: {
			justifyContent:'left'
		}
    },
    {
        name: '제목',
        cell: row => row.title,
        sortable: false,
		style: {
			justifyContent:'left'
		}
    }
]

export const checkSelectValueCustom = (e, name, selectError, setSelectError, setValue) => {
	const parentElement = document.querySelector(`.custom-select-${name}`)
	if (parentElement) { // Check if parentElement exists (is not null)
	  const childElement = parentElement.querySelector('.select__control')
	  if (e.value === '') {
		childElement.style.borderColor = 'red'
		setSelectError({
		  ...selectError,
		  [name]: true
		})
	  } else {
		setSelectError({
		  ...selectError,
		  [name]: false
		})
		childElement.style.borderColor = '#d8d6de'
	  }
	}
	setValue(name, e)
}

