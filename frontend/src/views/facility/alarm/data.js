import { ReactComponent as Fire } from '@src/assets/images/alarm/fire.svg'
import { ReactComponent as Power } from '@src/assets/images/alarm/power.svg'
import { ReactComponent as Boiler } from '@src/assets/images/alarm/boiler.svg'
import { ReactComponent as Leak } from '@src/assets/images/alarm/leak.svg'
import { ReactComponent as Gas } from '@src/assets/images/alarm/gas.svg'
import * as yup from 'yup'
import { API_FACILITY_ALARM_CAMERA, API_FACILITY_ALARM_HISTORY, API_FACILITY_ALARM_IOT, API_FIND_BUILDING, API_FIND_FLOOR, API_FIND_ROOM } from '../../../constants'
import { primaryHeaderColor } from '../../../utility/Utils'

export const defaultValues = {
	camera: {
		code: '',
		location: '',
		building: {label:'건물을 선택해주세요', value:''},
		floor: {label:'층을 선택해주세요', value:''},
		room: {label:'실을 선택해주세요', value:''},
		contact: {label:'담당자를 선택해주세요', value:''},
		manager: {label:'관리자를 선택해주세요', value:''}
	},
	iot: {
		code: '',
		location: '',
		iotType: {label:'타입을 선택해주세요', value:''},
		building: {label:'건물을 선택해주세요', value:''},
		floor: {label:'층을 선택해주세요', value:''},
		room: {label:'실을 선택해주세요', value:''},
		contact: {label:'담당자를 선택해주세요', value:''},
		manager: {label:'관리자를 선택해주세요', value:''},
		nomalMin: 0.0,
		nomalMax: 0.0
	}
}

export const validationSchemaObj = {
	camera: yup.object().shape({
		code: yup.string().required('코드를 입력해주세요.'),
		location: yup.string().required('장소를 입력해주세요.'),
		building: yup.object().shape({
			value: yup.string().required('빌딩을 선택해주세요.')
		}),
		contact: yup.object().shape({
			value: yup.string().required('담당자를 선택해주세요.')
		})
	}),
	iot: yup.object().shape({
		code: yup.string().required('코드를 입력해주세요.'),
		location: yup.string().required('장소를 입력해주세요.'),
		iotType: yup.object().shape({
			value: yup.string().required('타입을 선택해주세요.')
		}),
		building: yup.object().shape({
			value: yup.string().required('빌딩을 선택해주세요.')
		}),
		contact: yup.object().shape({
			value: yup.string().required('담당자를 선택해주세요.')
		}),
		nomalMin: yup.string().required('값을 입력해주세요.').matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),
		nomalMax: yup.string().required('값을 입력해주세요.').matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
	})
}

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

export const selectListAPI = {
	building : API_FIND_BUILDING,
	floor : API_FIND_FLOOR,
	room : API_FIND_ROOM,
	camera_history: `${API_FACILITY_ALARM_HISTORY}/camera`,
	iot_history: `${API_FACILITY_ALARM_HISTORY}/iot`
}

export const historyStatus = {
	0: '정상',
	1: '끊김',
	2: '화재',
	3: '연기'
}
const LOST = 1 // 끊김
const NORMAL = 0 // 정상
// const WARNING = 1 // 경고
export const DANGER = 2 // 위험

export const LEAK = 1
export const POWER = 2
export const BOILER = 3
export const GAS = 4

export const historyIotStatus = {
	[NORMAL]: '정상',
	// [WARNING]: '경고',
	[DANGER]: '위험',
	[LOST]: '끊김'
}
export const historyIotDanger = {
	[LEAK]: {
		[DANGER]: '누수'
	},
	[POWER]: {
		[DANGER]: '정전'
	},
	[BOILER]: {
		[DANGER]: '미작동'
	},
	[GAS]: {
		[DANGER]: '누수'
	}
}

export const historyStatusSelect = {
	camera: [
		{value: '', label: '전체'},
		{value: 0, label: '정상'},
		// {value: 1, label: '끊김'},
		{value: 2, label: '화재'}
		// {value: 3, label: '연기'}
	],
	iot: [
		{value: '', label: '전체'},
		{value: 0, label: '정상'},
		// {value: 1, label: '경고'},
		{value: 2, label: '위험'}
		// {value: 3, label: '끊김'}
	]
}

export const searchObjDefault = {
	building: {label:'건물선택', value:''},
	floor: {label:'층선택', value:''},
	room: {label:'살선택', value:''}
}

export const statusImgObj = {
	[DANGER]: <Fire/>
}

export const statusIotImgObj = {
	[LEAK]: <Leak/>,
	[POWER]: <Power/>,
	[BOILER]: <Boiler/>,
	[GAS]: <Gas/>
}

export const statusBackColor = {
	[NORMAL]: '',
	// [WARNING]: '',
	[DANGER]: '#FFF7F6',
	3: ''
}

export const statusBorder = {
	[NORMAL]: '',
	// [WARNING]: '',
	[DANGER]: '1px solid #FE2415',
	3: ''
}

export const statusFontColor = {
	[NORMAL]: '',
	// [WARNING]: '',
	[DANGER]: '#C50607',
	3: ''
}

export const statusBadgeKor = {
	[NORMAL]: '정상',
	// [WARNING]: '경고',
	[DANGER]: '위험',
	[LOST]: '끊김'
}

export const statusBadgeColor = {
	[NORMAL]: 'light-success',
	// [WARNING]: 'light-warning',
	[DANGER]: 'danger',
	[LOST]: 'light-danger'
}

export const assetTypeKor = {
	camera: 'CCTV',
	iot: '자산'
}

export const assetTypeAPI = {
	camera: API_FACILITY_ALARM_CAMERA,
	iot: API_FACILITY_ALARM_IOT
}

export const iotTypeSelect = [
	{value: 1, label: '수위'},
	{value: 2, label: '온도'},
	{value: 3, label: '가스'}
]

export const iotTypeObj = {
	1: '수위',
	2: '온도',
	3: '가스'
}