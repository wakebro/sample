import * as yup from 'yup'
import { dateFormat, primaryHeaderColor } from '../../../utility/Utils'
export const workerQnaDefaultValue = {
	title:'',
	currentProblem: '',
	improvement: ''
}
export const validationSchemaWorkerQna =  
    yup.object().shape({
        title: yup.string().required('제목을 입력해주세요.'),
        currentProblem: yup.string().required('현재 상황을 입력해주세요.').nullable(),
        improvement: yup.string().required('개선 및 건의 사항을 입력해주세요.').nullable()
})

export const customStyles = {
	headRow: {
		style: {
			// backgroundColor: 'red',
			height: '40px !important'
		}
	},
	headCells: {
		style: {
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3'
			},
			backgroundColor: primaryHeaderColor,
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
			cursor: 'default', // 마우스 포인터를 원하는 형태로 변경합니다.
			minHeight: '35px'
		}
	}
}

export const workerQnaListColumns = [
    {
        name:'사업소',
        style:{cursor:'pointer', padding:'0px !important'},
        width:'150px',
        cell: row => row.propertyName
    },
    {
        name:'성명',
        style:{cursor:'pointer', padding:'0px !important'},
        width:'150px',
        cell: row => row.workerName
    },
    {
        name:'작성일자',
        style:{cursor:'pointer', padding:'0px !important'},
        width:'150px',
        cell: row => dateFormat(row.createDatetime)
    },
    {
        name:'제목',
        style:{cursor:'pointer', padding:'0px !important'},
        cell: row => row.title
    }
]
