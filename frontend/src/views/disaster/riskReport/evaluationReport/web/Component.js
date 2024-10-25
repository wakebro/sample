import { setModalIsOpen, setModalName, setRowData, setTab } from '@store/module/criticalDisaster'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'

import { Badge, Button, Col, Row } from 'reactstrap'
import { API_DISASTER_EVALUTION_SIGN, ROUTE_CRITICAL_DISASTER_EVALUATION, API_DISASTER_EVALUATION_SIGN_CHECK, API_INTRANET_NOTIFICATION_FORM } from '../../../../../constants'
import { Fragment, useEffect, useState } from 'react'
import { checkApp, getTableData, getTableDataCallback, sweetAlert } from '../../../../../utility/Utils'
import axios from 'axios'
import Cookies from 'universal-cookie'

const ComponentDiv = (props) => { // ????
	const {title, id, widthAlign = 'center', type = undefined} = props
	const dispatch = useDispatch()
	const navigate = useNavigate()

	function handleGotoDetail(id) {
		dispatch(setTab('notice'))
		if (type === undefined) navigate(`${ROUTE_CRITICAL_DISASTER_EVALUATION}/list/${id}`, {state:{pageType:'detail'}})
	}

	return (
		<div className={checkApp ? 'px-1' : ''} style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:[widthAlign]}} onClick={() => handleGotoDetail(id)}>{title}</div>
	)
}

const ComponentProgress = ({row}) => {
	const navigate = useNavigate()
	const progressList = [1, 2, 3, 4, 5, 6]
	function handleGotoDetail(id) {
		navigate(`${ROUTE_CRITICAL_DISASTER_EVALUATION}/list/${id}`, {state:{pageType:'detail'}})
	}
	const [progress, setProgress] = useState(0)
	useEffect(() => {
		const progress_data = [...row.progress_data]
		for (const index in progress_data) {
			const isCompleted = progress_data[index]
			if (isCompleted) continue
			setProgress(index)
			return
		}
		setProgress(6) // 모두 완료 했으면 6
	}, [])
	return (
		<div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}} onClick={() => handleGotoDetail(row.id)}>
			{ progressList.length > 0 &&
				progressList.map((data, idx) => {
					
					return (
						<div key={`process${idx}`} 
							className={`evaluation-progress ${idx === 0 ? 'first ' : ''}${idx === 5 ? 'end ' : ''}${data <= parseInt(progress) ? 'true' : 'false'}`}/>
					)
				})
			}
			&nbsp;
			{progress}/6
		</div>
	)
}

const ModalOpen = ({name, row}) => {
	const dispatch = useDispatch()
	const nameObj = {
		meeting: '사전회의 결재',
		education: '안전교육 결재',
		evaluation: '작업자 서명'
	}

	function getResultDisabled (row, key) {
		switch (key) {
			case 'meeting':
				if (row.is_meeting_sign) return true
				else return false
			case 'education':
				if (row.is_education_sign) return true
				else return false
			case 'evaluation':
				if (row.is_evaluation_sign) return true
				else return false
			default:
				return false
		}
	}
	
	function isSignResult(row, key) {
		return row[`is_${key}_sign`]
	}

	function getResultColor (row, key) {
		switch (key) {
			case 'meeting':
				if (row.is_meeting_sign) return {cursor:'pointer', borderRadius:'0.358rem', backgroundColor:'#EEEEEE', color:'#ACACAC', border:'0px', padding: '0.486rem 1rem', width:'65px'}
				else return {cursor:'pointer', borderRadius:'0.358rem', backgroundColor:'#FFEBD3', color:'#F48A25', border:'0px', padding: '0.486rem 1rem', width:'65px'}
			case 'education':
				if (row.is_education_sign) return {cursor:'pointer', borderRadius:'0.358rem', backgroundColor:'#EEEEEE', color:'#ACACAC', border:'0px', padding: '0.486rem 1rem', width:'65px'}
				else return {cursor:'pointer', borderRadius:'0.358rem', backgroundColor:'#FFEBD3', color:'#F48A25', border:'0px', padding: '0.486rem 1rem', width:'65px'}
			case 'evaluation':
				if (row.is_evaluation_sign) return {cursor:'pointer', borderRadius:'0.358rem', backgroundColor:'#EEEEEE', color:'#ACACAC', border:'0px', padding: checkApp ? '10px 5px 10px 5px' : '0.486rem 1rem', width:'65px'}
				else return {cursor:'pointer', borderRadius:'0.358rem', backgroundColor:'#ECF3FF', color:'#4994D2', border:'0px', padding: checkApp ? '10px 5px 10px 5px' : '0.486rem 1rem', width:'65px'}

		}
	}

	function handleModalOpen (row, name) {
		dispatch(setRowData(row))
		dispatch(setModalName(nameObj[name]))
		dispatch(setModalIsOpen(true))
	}
	return (
		<button
			disabled={getResultDisabled(row, name)} 
			style={getResultColor(row, name)}
			onClick={() => handleModalOpen(row, name)}>{isSignResult(row, name) ? '승인' : '진행중'}</button>
	)
}

const CustomBadge = ({children, color}) => {
	return (
		<Badge color={color} style={{padding: '6px 10px', fontSize:'15px', display:'inline-block'}}>
			{children}
		</Badge>
	)
}

const ExporListSignCount = (props) => {
	const {row, type} = props
	const [signList, setSignList] = useState([])
	const [signDoneCount, setSignDoneCount] = useState(0)
	const [totalCount, setTotalCount] = useState(0)
	// const [totalCount, setTotalCount] = useState(2)

	useEffect(() => {
		getTableData(API_DISASTER_EVALUTION_SIGN, {form_id:row.id, type:type}, setSignList)
	}, [row])

	useEffect(() => {
		if (signList.length > 0) {
			let count = 0
			let totalCount = 0
			signList.forEach((user) => {
				if (user.is_other_final === true) {
					count++
				}
				if (user.id !== '') {
					totalCount++
				}
			})
			setSignDoneCount(count)
			setTotalCount(totalCount)
		}
		// if (type === 'evaluation') {
		// 	setTotalCount(signList.length)
		// }
	}, [signList])

	return (
		<div>완료 {signDoneCount}/{totalCount}</div>
	)
}

const ComponentSign = (props) => {
	const {row, name} = props
	const [signList, setSignList] = useState([])
	const [signDoneCount, setSignDoneCount] = useState(0)
	const [totalCount, setTotalCount] = useState(0)
	const [showButton, setshowButton] = useState(false)
	const cookies = new Cookies

	const nameObj = {
		meeting: '사전회의 결재',
		education: '안전교육 결재',
		evaluation: '작업자 서명'
	}

	const sendNotification = (data) => {
		if (data.state === 200) {
			const list = [signList.map(user => user.user)]
			const formData = new FormData()
			formData.append('subject', row.title)
			formData.append('contents', `${nameObj[name]} 진행되지 않았습니다. 확인 요청드립니다.`)
			formData.append('sender_id', cookies.get('userId'))
			formData.append('employee_list', list)
			formData.append('doc_file', 'undefined')
			formData.append('where_to_start', `${name}_${row.id}`)
			axios.post(API_INTRANET_NOTIFICATION_FORM, formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})
			.then(res => {
				if (res.status === 200) {
					sweetAlert('완료', '알림 발송 완료되었습니다!', 'success', 'right')
				} else {
					sweetAlert('실패', '다시한번 확인 해주세요.', 'warning', 'right')
				}
			})
		} else {
			sweetAlert('실패', `알림은 10분간격으로 전송이 가능합니다.<br/><br/>${10 - Math.floor(data.time)}후에 다시 시도해주세요.`, 'info', 'right')
		}
	}

	const handleNotificaionSend = () => {
		getTableDataCallback(API_DISASTER_EVALUATION_SIGN_CHECK, {form_id:row.id, type:name}, sendNotification)
	}

	const setList = (data) => {
		setSignList(data)
		if (data.length > 0) {
			let count = 0
			let totalCount = 0
			data.forEach((user) => {
				if (user.is_other_final === true) {
					count++
				}
				if (user.id !== '') {
					totalCount++
				}
			})
			if (count !== totalCount) setshowButton(true)
			setSignDoneCount(count)
			setTotalCount(totalCount)
		}
	}

	useEffect(() => {
		getTableDataCallback(API_DISASTER_EVALUTION_SIGN, {form_id:row.id, type:name}, setList)
	}, [row])

	return (
		<Fragment>
			<Col md={12} style={{textAlign:'center'}}>
				<div>완료 {signDoneCount}/{totalCount}</div>
			</Col>
			<Col className='px-0' md={12} style={{marginTop:'4px'}}>
				<Button 
					size='sm'
					color='primary' 
					outline 
					disabled={!showButton}
					onClick={() => handleNotificaionSend()}
				>
					알림 발송
				</Button>
			</Col>
		</Fragment>
	)

}

export { ComponentDiv, ComponentProgress, CustomBadge, ModalOpen, ExporListSignCount, ComponentSign }
