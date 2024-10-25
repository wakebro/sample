import winLogoImg from '@src/assets/images/winlogo.png'
import { API_REPORT_APPROVAL_LIST } from '@src/constants'
import { setEvaluationEvaluatorList, setEvaluationEvaluatorModalIsOpen, setEvaluationSelectEvaluator, setEvaluationSelectWorker, setEvaluationWorkerList, setEvaluationWorkerModalIsOpen, setTabTempSaveCheck } from '@store/module/criticalDisaster'
import { sweetAlert } from "@utility/Utils"
import { useAxiosIntercepter } from "@utility/hooks/useAxiosInterceptor"

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Button, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import Cookies from 'universal-cookie'

import ModalEmployeeList from './ModalEmployeeList'
import ModalSearchLow from './ModalSearchLow'
import ModalSelectEmployee from './ModalSelectEmployee'
import { getTableDataCallback, primaryColor } from '../../../../../../../../../../utility/Utils'
import { API_SYSTEMMGMT_PROPERTY_EMPLOYEE_CLASS } from '../../../../../../../../../../constants'

const EvaluationModal = (props) => {
	useAxiosIntercepter()
	const { isOpen, list, select, name } = props
	const cookies = new Cookies()
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const dispatch = useDispatch()
	const [data, setData] = useState([])
	const [backupData, setBackupData] = useState([])
	const [selectTableList, setSelectTableList] = useState([{label: '선택', value:''}])
	const [selectedEmployeeClass, setSelectedEmployeeClass] = useState(selectTableList[0])
	const [searchValue, setSearchValue] = useState('')
	const [width, setWidth] = useState(window.innerWidth)
	const [throttle, setThrottle] = useState(false)

	const keyObj = {
		workerName: '작업자 서명',
		workerSelectList: criticalDisaster.evaluationSelectWorker,
		workerSetModalOpen: setEvaluationWorkerModalIsOpen,
		workerSetList: setEvaluationWorkerList,
		workerSetSelectList: setEvaluationSelectWorker,
		evaluatorName: '평가자(관리자)',
		evaluatorSelectList: criticalDisaster.evaluationSelectEvaluator,
		evaluatorSetModalOpen: setEvaluationEvaluatorModalIsOpen,
		evaluatorSetList: setEvaluationEvaluatorList,
		evaluatorSetSelectList: setEvaluationSelectEvaluator
	}

	const handleDisabled = (user) => { // 참석 여부 입력한 유저는 삭제 불가
        const copySignWorker = [...keyObj[`${name}SelectList`]]
        for (const signWorker of copySignWorker) {
            if (signWorker.id !== user.id) continue
            if (signWorker.hasOwnProperty('is_other_final') && signWorker.is_other_final === true) return true
        }
        return false
    }

	function handleResize() { // width
		if (throttle) return
		if (!throttle) {
			setThrottle(true)
			setTimeout(async () => {
				setWidth(window.innerWidth)
				setThrottle(false)
			}, 300)
		}
	}

	function handleTogle(status = false) {
		if (!status) {
			const copyData = data.map(obj => ({ ...obj }))
			backupData.map(checkedWorker => {
				copyData.map(originWorker => {
					if (checkedWorker.id === originWorker.id) originWorker.checked = true
				})
			})
			dispatch(keyObj[`${name}SetList`](copyData))
			dispatch(keyObj[`${name}SetSelectList`](backupData))
		}
		dispatch(keyObj[`${name}SetModalOpen`](false))
	}

	function handleSubmit() {
        if (name === 'worker' && criticalDisaster.evaluationSelectWorker.length > 6) {
            sweetAlert('인원을 초과했습니다.', '선택할 수 있는 인원은 6명입니다.', 'warning')
            return
        }
		handleTogle(true)
		dispatch(setTabTempSaveCheck(false))
	}

	useEffect(() => {
		window.addEventListener("resize", handleResize)
		return () => {
			// cleanup
			window.removeEventListener("resize", handleResize)
		}
	}, [])

	const getListInit = () => {
		getTableDataCallback(
			API_REPORT_APPROVAL_LIST, 
			{propertyId:cookies.get('property').value, search:searchValue, employeeClass:selectedEmployeeClass.value}, 
			(data) => {
				setData(data)
				const copyData = data.map(obj => ({ ...obj }))
				const copyBackupData = [...criticalDisaster.evaluationSelectWorker]
				if (data.length !== 0 && criticalDisaster.pageType === 'modify') {
					select.map(checkedWorker => {
						copyData.map(originWorker => {
							if (checkedWorker.id === originWorker.id) originWorker.checked = true
						})
					})
				}
				setBackupData(copyBackupData)
				dispatch(keyObj[`${name}SetList`](copyData))
			}
		)
	}

	useEffect(() => {
		getTableDataCallback(
			API_SYSTEMMGMT_PROPERTY_EMPLOYEE_CLASS, 
			{property:cookies.get('property').value, search:'', select_employee_class:''},
			(data) => {
				const tempEmpClassList = data?.emp_class_list // 키값 체크
				if (Array.isArray(tempEmpClassList)) { // 배열인지 체크
					const empList = tempEmpClassList.map(row => ({value:row.id, label: row.code})) // 배열 재가공
					empList.unshift({label: '선택', value:''})
					setSelectTableList(empList)
				}
			}
		)
		getListInit()
	}, [])

	return (
		<Modal isOpen={isOpen} toggle={() => handleTogle()} className='modal-dialog-centered modal-xl'>
			<ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
				<div className='mb-1' style={{display: 'flex', alignItems: 'center', paddingLeft: '3%', justifyContent:'space-between'}}>
					<div className='mt-1' style={{justifyContent:'space-between'}}>
						<Row><span style={{color: 'white', fontSize: '20px'}}>{keyObj[`${name}Name`]} 지정</span></Row>
						<Row>
							<span style={{color: 'white'}}>아래 창에서 해당 작업자를 선택해주세요.</span>
						</Row>
					</div>
					<div className="pe-2">
						<img src={winLogoImg} style={{maxHeight: '85px'}}/> 
					</div>
				</div>
			</ModalHeader>

			<ModalBody>
				<ModalSearchLow
					selectTableList={selectTableList}
					selectedEmployeeClass={selectedEmployeeClass}
					setSelectedEmployeeClass={setSelectedEmployeeClass}
					getListInit={getListInit}
					searchValue={searchValue}
					setSearchValue={setSearchValue}/>
				<ModalEmployeeList
					width={width}
					list={list}
					setList={keyObj[`${name}SetList`]}
					selectList={keyObj[`${name}SelectList`]}
					setSelectList={keyObj[`${name}SetSelectList`]}
					handleDisabled={handleDisabled}/>
				<ModalSelectEmployee 
					list={list}
					setList={keyObj[`${name}SetList`]}
					selectList={keyObj[`${name}SelectList`]}
					setSelectList={keyObj[`${name}SetSelectList`]}
					handleDisabled={handleDisabled}/>
				<div className='d-flex mt-1' style={{justifyContent:'end'}}>
					<Button color='report' onClick={() => handleTogle()} >
						취소
					</Button>
					<Button color='primary' className="ms-1" onClick={() => handleSubmit()}>
						저장
					</Button>
				</div>
			</ModalBody>
		</Modal>
	)
}

export default EvaluationModal