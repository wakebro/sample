/* eslint-disable */
import { useDispatch } from 'react-redux'
import { Button, Col, Row } from "reactstrap"
import { API_BASICINFO_FACILITY, API_BASICINFO_FACILITY_LOG } from "../../../constants"

import {
	setId as facilityId,
	setLogList as facilityLogList,
	setLogModalIsOpen as facilityLogModalIsOpen,
	setFacilityMaterialModalIsOpen as facilityMaterialModalIsOpen,
	setModalType as facilityModalType,
	setPageType as facilityPageType,
	setRowInfo as facilityRowInfo
} from "@store/module/facility"
import { primaryHeaderColor } from '../../../utility/Utils'

export const nameReduxObj = {
	facility: {
		setLogModalIsOpen: facilityLogModalIsOpen,
		setFacilityMaterialModalIsOpen: facilityMaterialModalIsOpen,
		setRowInfo: facilityRowInfo,
		setModalType: facilityModalType,
		setPageType: facilityPageType,
		setLogList: facilityLogList,
		setId: facilityId
	}
}

const ModalOpen = ({name, navActive, row}) => {
	const dispatch = useDispatch()

	function handleModalOpen (row) {
		if (navActive === 'log') dispatch(nameReduxObj[name].setLogModalIsOpen(true))
		else if (navActive === 'facilityMaterial') dispatch(nameReduxObj[name].setFacilityMaterialModalIsOpen(true))
		dispatch(nameReduxObj[name].setRowInfo(row))
		dispatch(nameReduxObj[name].setModalType('detail'))
	}

	return (
		<Button size='sm' color='primary' outline onClick={() => handleModalOpen(row)}>보기</Button>
	)
}

export const modalStyles = {width:'100%', backgroundColor:'white'}

export const BasicInfoTabList = [
	{label : '이력자료', value : 'log'},
	{label : '자재사용', value : 'useMaterial'},
	{label : '작업이력', value : 'workLog'},
	{label : '관련자재', value : 'facilityMaterial'}
]

export const BasicInfoAPIObj = {
	log : API_BASICINFO_FACILITY_LOG,
	useMaterial : `${API_BASICINFO_FACILITY}/use_material`,
	workLog : `${API_BASICINFO_FACILITY}/work_log`,
	facilityMaterial : `${API_BASICINFO_FACILITY}/facility_material`
}

const materialType = {
	false: '잉여',
	true: '재고',
}

export const basicInfoColumn = {
	detail: [
		{
			name: '구분',
			selector: row => row.subject
		},
		{
			name: '규격',
			selector: row => row.contents
		}
	],
	log : [
		{
			name: '등록일자',
			width: '140px',
			selector: row => row.regist_datetime.split('T')[0]
		},
		{
			name: '수리내용',
			selector: row => row.description
		},
		{
			name: '첨부파일',
			width: '14%',
			selector: (row) => (row.file_name ? row.file_name : '')
		},
		{
			name: '작성자',
			width: '14%',
			selector: row => row.writer.name
		},
		{
			name: '',
			width: '100px',
			selector: row => <ModalOpen
								name='facility'
								navActive='log'
								row={row}/>
		}
	],
	workLog: [
		{
			name: '접수일자',
			width: '140px',
			selector: row => row.request_datetime.split('T')[0]
		},
		{
			name: '접수 및 작업내용',
			selector: row => <Row>
								<Col style={{display:'flex'}} xs={12}><div>(접수)</div> &nbsp;{row.request_description}</Col>
								<Col style={{display:'flex'}} xs={12}><div>(작업)</div> &nbsp;{row.working_description}</Col>
							</Row>
		},
		{
			name: '완료 또는 민원여부',
			width:'150px',
			selector: row => <Row>
								<Col style={{display:'flex'}} xs={12}>
									{row.type} / {row.status}
								</Col>
							</Row>
		}
	],
	useMaterial: [
		{
			name: '사용일자',
			width: '140px',
			selector: row => row.use_date.split('T')[0]
		},
		{
			name: '자재명',
			width: '200px',
			selector: row => row.material.code
		},
		{
			name: '수량',
			width:'100px',
			selector: row => row.qty
		},
		{
			name: '구분',
			width:'100px',
			selector: row => materialType[row.is_rest]
		},
		{
			name: '접수내용',
			selector: row => row.description
		}
	],
	facilityMaterialDetail: [
		{
			name: '자재명',
			width:'140px',
			selector: row => row.material.code
		},
		{
			name: '비고',
			selector: row => row.description
		}
	],
	facilityMaterial: [
		{
			name: '자재명',
			width:'140px',
			selector: row => row.material.code
		},
		{
			name: '비고',
			selector: row => row.description
		},
		{
			name: '',
			width: '10%',
			selector: row => <ModalOpen
								name='facility'
								navActive='facilityMaterial'
								row={row}/>
		}
	]
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
			'&:nth-child(2)':{
				justifyContent: 'start'
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

export const basicColumns = [
	{
		name: '직종',
		selector: row => (row.employee_class ? row.employee_class.code : ''),
		width: '110px'
	},
	{
		name: '장비코드',
		selector: row => row.code,
		minWidth: '120px'
	},
	{
		name: '장비명',
		selector: row => row.name,
		minWidth: '150px'
	},
	{
		name: '용도',
		selector: row => row.use,
		minWidth: '150px'
	},
	{
		name: '규격',
		selector: row => row.capacity,
		width: '110px'
	},
	{
		name: '모델',
		selector: row => row.model_no,
		minWidth: '150px'
	},
	{
		name: '제작사',
		selector: row => row.maker,
		minWidth: '150px'
	},
	{
		name: '건물',
		selector: (row) => (row.building ? row.building.name : ''),
		minWidth: '150px'
	},
	{
		name: '층',
		selector: row => (row.floor ? row.floor.name : ''),
		width: '90px'
	},
	{
		name: '호실',
		selector: row => (row.room ? row.room.name : ''),
		width: '80px'
	},
	{
		name: '사진 유무',
		selector: row => {
			if (row.original_file_name !== '') return '유'
			else return '무'
		},
		width: '90px'
	}
]

export const toolEquipmentColumns = [
	{
		name: '공구비품코드',
		cell: row => row.code,
		minWidth:'120px'
	},
	{
		name: '직종',
		cell: (row) => (row.employee_class ? row.employee_class.code : ''),
		minWidth: '80px'
	},
	{
		name: '수량',
		cell: row => row.qty.toLocaleString('ko-KR'),
		minWidth: '100px'
	},
	{
		name: '단위',
		cell: row => row.unit,
		minWidth: '80px'
	},
	{
		name: '규격모델',
		minWidth:'100px',
		cell: row => row.capacity
	},
	{
		name: '위치',
		cell: row => row.location,
		minWidth:'100px'
	},
	{
		name: '입고일',
		cell: row => row.stored_date && row.stored_date.split('T')[0],
		minWidth: '120px'
	}
]