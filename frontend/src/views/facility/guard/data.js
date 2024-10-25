import * as yup from 'yup'
import { primaryHeaderColor } from '../../../utility/Utils'

export const defaultValues = {
	guard: {
		code: '',
		location: '',
		building: {label:'건물을 선택해주세요', value:''},
		floor: {label:'층을 선택해주세요', value:''},
		room: {label:'실을 선택해주세요', value:''}
	},
	scan: {
		location: '',
		tagTime: '',
		modifyTime: '',
		employeeClass: '',
		user: '',
		description: '',
		status: ''
	}
}

export const validationSchemaObj = {
	guard: yup.object().shape({
		code: yup.string().required('코드를 입력해주세요.'),
		location: yup.string().required('장소를 입력해주세요.'),
		building: yup.object().shape({
			value: yup.string().required('빌딩을 선택해주세요.')
		})
	})
}

export const listAmPm = ['오전', '오후']
export const AM = 0
export const PM = 1
export const selectAmPm = [
	{label:'오전', value:0},
	{label:'오후', value:1}
]

export const selectHour = [
	{label:'01', value:'01'},
	{label:'02', value:'02'},
	{label:'03', value:'03'},
	{label:'04', value:'04'},
	{label:'05', value:'05'},
	{label:'06', value:'06'},
	{label:'07', value:'07'},
	{label:'08', value:'08'},
	{label:'09', value:'09'},
	{label:'10', value:'10'},
	{label:'11', value:'11'},
	{label:'12', value:'12'}
]

export const selectHourFull = [
	{label:'00', value:'00'},
	{label:'01', value:'01'},
	{label:'02', value:'02'},
	{label:'03', value:'03'},
	{label:'04', value:'04'},
	{label:'05', value:'05'},
	{label:'06', value:'06'},
	{label:'07', value:'07'},
	{label:'08', value:'08'},
	{label:'09', value:'09'},
	{label:'10', value:'10'},
	{label:'11', value:'11'},
	{label:'12', value:'12'},
	{label:'13', value:'13'},
	{label:'14', value:'14'},
	{label:'15', value:'15'},
	{label:'16', value:'16'},
	{label:'17', value:'17'},
	{label:'18', value:'18'},
	{label:'19', value:'19'},
	{label:'20', value:'20'},
	{label:'21', value:'21'},
	{label:'22', value:'22'},
	{label:'23', value:'23'}
]

export const selectMinute = [
	{label:'00', value:'00'},
	{label:'01', value:'01'},
	{label:'02', value:'02'},
	{label:'03', value:'03'},
	{label:'04', value:'04'},
	{label:'05', value:'05'},
	{label:'06', value:'06'},
	{label:'07', value:'07'},
	{label:'08', value:'08'},
	{label:'09', value:'09'},
	{label:'10', value:'10'},
	{label:'11', value:'11'},
	{label:'12', value:'12'},
	{label:'13', value:'13'},
	{label:'14', value:'14'},
	{label:'15', value:'15'},
	{label:'16', value:'16'},
	{label:'17', value:'17'},
	{label:'18', value:'18'},
	{label:'19', value:'19'},
	{label:'20', value:'20'},
	{label:'21', value:'21'},
	{label:'22', value:'22'},
	{label:'23', value:'23'},
	{label:'24', value:'24'},
	{label:'25', value:'25'},
	{label:'26', value:'26'},
	{label:'27', value:'27'},
	{label:'28', value:'28'},
	{label:'29', value:'29'},
	{label:'30', value:'30'},
	{label:'31', value:'31'},
	{label:'32', value:'32'},
	{label:'33', value:'33'},
	{label:'34', value:'34'},
	{label:'35', value:'35'},
	{label:'36', value:'36'},
	{label:'37', value:'37'},
	{label:'38', value:'38'},
	{label:'39', value:'39'},
	{label:'40', value:'40'},
	{label:'41', value:'41'},
	{label:'42', value:'42'},
	{label:'43', value:'43'},
	{label:'44', value:'44'},
	{label:'45', value:'45'},
	{label:'46', value:'46'},
	{label:'47', value:'47'},
	{label:'48', value:'48'},
	{label:'49', value:'49'},
	{label:'50', value:'50'},
	{label:'51', value:'51'},
	{label:'52', value:'52'},
	{label:'53', value:'53'},
	{label:'54', value:'54'},
	{label:'55', value:'55'},
	{label:'56', value:'56'},
	{label:'57', value:'57'},
	{label:'58', value:'58'},
	{label:'59', value:'59'}
]

export const workStatus = [
	{label:'전체', value:''},
	{label:'정상', value:0},
	{label:'요청', value:1},
	{label:'처리완료', value:2},
	{label:'거절', value:3},
	{label:'누락', value:4}
]

export const workStatusObj = {
	0: '정상',
	1: '요청',
	2: '처리완료',
	3: '거절',
	4: '누락'
}

export const statusValue = {
	approval: 2,
	refuse: 3
}

export const statusIcon = {
	approval: 'warning',
	refuse: 'error'
}

export const statusTitle = {
	approval: '승인',
	refuse: '거절'
}

export const statusText = {
	approval: '요청된 시간으로 내역이 변경되며 더는 수정하실 수 없습니다.',
	refuse: '내역 변경이 되지 않으며, 수정을 위해서는 재요청해야 합니다. '
}

export const NFC_NOMAL = 0
export const NFC_REQUEST = 1
export const NFC_COMPLETE = 2
export const NFC_REFUSE = 3
export const NFC_OMISSION = 4

export const customStyles = {
	headCells: {
		style: {
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3'
			},
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
			'&:nth-child(7)':{
				justifyContent: 'start'
			},
			'&:nth-child(8)':{
				justifyContent: 'center'
			},
			border: '0.5px solid #B9B9C3',
			borderTop: 'none', // 상단 테두리 제거
			borderLeft: 'none', // 좌측 테두리 제거
			display: 'flex',
			justifyContent: 'center',
			fontSize: '16px',
			fontFamily: 'Pretendard-Regular',
			minWidth: ''
		}
	},
	rows: {
		style: {
			cursor: 'default', // 마우스 포인터를 원하는 형태로 변경합니다.
			minHeight: '35px'
		}
	}
}

export const statusBadge = [
	<span className='basic-badge nomal'>정상</span>,
	<span className='basic-badge request'>요청</span>,
	<span className='basic-badge complete'>처리완료</span>,
	<span className='basic-badge refuse'>거절</span>
]

export const DEFAULT_ROW_CNT = 15
export const MINIMUM_ROW_CNT = 5