import { primaryHeaderColor } from "../../../utility/Utils"

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
			cursor: 'defalut', // 마우스 포인터를 원하는 형태로 변경합니다.
			minHeight: '35px'
		}
	}
}