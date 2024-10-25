/* eslint-disable */
import { setAppEvaluationList, setEvaluationEvaluatorId, setTabTempSaveCheck } from '@store/module/criticalDisaster'
import moment from "moment"
import { Fragment, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import { Button, Card, Col, Form, Row } from "reactstrap"
import Swal from 'sweetalert2'
import Cookies from "universal-cookie"
import { API_DISASTER_EVALUATION_CONTENT, API_DISASTER_EVALUTION_SIGN } from '../../../../../../../constants'
import { axiosPostPutCallback, sweetAlert } from '../../../../../../../utility/Utils'
import { handleEvaluationTempSave } from "../../../web/data"
import { initList } from '../../../web/list/categoryEvaluationCounterPlan/data'
import EvaluationContentCard from "./EvaluationContentCard"
import EvaluationWholeListModal from './EvaluationWholeListModal'
import { NEXT, PREV } from "./data"

const EvaluationContents = (props) => {
	const { control, unregister, setValue, watch, errors, managerList, dataInfo, body, handleSubmit, files, setFiles
		// , itemsYup, setItemsYup 
	} = props
	const cookies = new Cookies()
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const loginAuth = useSelector((state) => state.loginAuth)
	const dispatch = useDispatch()
	const [contentIdx, setContentIdx] = useState(0)
	const [load, setLoad] = useState(false)
	const [isNotWorker, setIsNotWorker] = useState(true)
	const selectList = ['selectDanger', 'dangerousness', 'manager']

	const inputName = {
		inputDetail: 'element_first',
		selectDanger: 'element_second',
		inputResult: 'required_description',
		inputReason: 'option_description'
	}

	function handleBtn(key) {
		setLoad(true)
		switch (key) {
			case PREV:
				setContentIdx(contentIdx - 1)
				break
			case NEXT:
				setContentIdx(contentIdx + 1)
				break
		}
	}

	function regModCallback(data) {
		// setCheckTempSave(true)
		dispatch(setEvaluationEvaluatorId(data))
		if (criticalDisaster.pageType === 'modify') dispatch(setPageType('detail')) // 현재 페이지 타입이 수정일때는 상세페이지로 이동
	}

	function handleTempSave(data) {
		const formData = new FormData()
		handleEvaluationTempSave(formData, data, files, criticalDisaster, cookies)
		const tempTotal= [...body]

		tempTotal.forEach((_, index) => {
			const tempItem = {}
			for (const row of Object.entries(data)) { // index를 찾고 달라지면 break 걸면 성능이 좀더 좋아짐.
				const tempLabel = row[0].split('_')[0]
				const tempIndex = row[0].split('_')[1]
				const tempValue = row[1]
				if (tempIndex !== String(index)) continue // 검색을 위한 조건문
				if (selectList.includes(tempLabel)) {
					if (tempLabel in inputName) tempItem[inputName[tempLabel]] = tempValue ? tempValue.value : ''
					else tempItem[tempLabel] = tempValue ? tempValue.value : ''
					continue
				}
				if (tempLabel in inputName) {
					tempItem[inputName[tempLabel]] = tempValue ? tempValue : ''
					continue
				}
				tempItem[tempLabel] = tempValue ? tempValue : ''
			}

			tempItem['view_order'] = index // 입력순서 지키기 위한 변수
			formData.append('contents', JSON.stringify(tempItem))
			
			// 첨부파일
			for (const filerow of Object.entries(files)) {
				if (filerow[0] !== String(index)) continue
				if (filerow[1]['evaluation'].length === 0) formData.append(`images_${filerow[0]}_evaluation`, [])
				else {
					for (const file of filerow[1]['evaluation']) {
						formData.append(`images_${filerow[0]}_evaluation`, file instanceof File ? file : JSON.stringify(file))
					}
				}
				if (filerow[1]['counterplan'].length === 0) formData.append(`images_${filerow[0]}_counterplan`, [])
				else {
					for (const file of filerow[1]['counterplan']) {
						formData.append(`images_${filerow[0]}_counterplan`, file instanceof File ? file : JSON.stringify(file))
					}
				}
			}
		})
		initList(control, unregister)
		const regMod = criticalDisaster.evaluationEvaluatorId === '' ? 'register' : 'modify'
		formData.append('page_type', regMod)
		const API = regMod === 'register' ? `${API_DISASTER_EVALUATION_CONTENT}/-1` : `${API_DISASTER_EVALUATION_CONTENT}/${criticalDisaster.evaluationEvaluatorId}`
		axiosPostPutCallback(regMod, '위험성평가', API, formData, regModCallback)
		dispatch(setTabTempSaveCheck(true))
	}

	function handleSetReduxSignLine(data) {
		const formData = new FormData()
		handleEvaluationTempSave(formData, control._formValues, files, criticalDisaster, cookies)
		formData.append('worker_list', JSON.stringify(data))

		const tempTotal= [...body]

		tempTotal.forEach((_, index) => {
			const tempItem = {}
			for (const row of Object.entries(control._formValues)) { // index를 찾고 달라지면 break 걸면 성능이 좀더 좋아짐.
				const tempLabel = row[0].split('_')[0]
				const tempIndex = row[0].split('_')[1]
				const tempValue = row[1]
				if (tempIndex !== String(index)) continue // 검색을 위한 조건문
				if (selectList.includes(tempLabel)) {
					if (tempLabel in inputName) tempItem[inputName[tempLabel]] = tempValue ? tempValue.value : ''
					else tempItem[tempLabel] = tempValue ? tempValue.value : ''
					continue
				}
				if (tempLabel in inputName) {
					tempItem[inputName[tempLabel]] = tempValue ? tempValue : ''
					continue
				}
				tempItem[tempLabel] = tempValue ? tempValue : ''
			}

			tempItem['view_order'] = index // 입력순서 지키기 위한 변수
			formData.append('contents', JSON.stringify(tempItem))
			
			// 첨부파일
			for (const filerow of Object.entries(files)) {
				if (filerow[0] !== String(index)) continue
				if (filerow[1]['evaluation'].length === 0) formData.append(`images_${filerow[0]}_evaluation`, [])
				else {
					for (const file of filerow[1]['evaluation']) {
						formData.append(`images_${filerow[0]}_evaluation`, file instanceof File ? file : JSON.stringify(file))
					}
				}
				if (filerow[1]['counterplan'].length === 0) formData.append(`images_${filerow[0]}_counterplan`, [])
				else {
					for (const file of filerow[1]['counterplan']) {
						formData.append(`images_${filerow[0]}_counterplan`, file instanceof File ? file : JSON.stringify(file))
					}
				}
			}
		})

		initList(control, unregister)
		const regMod = criticalDisaster.evaluationEvaluatorId === '' ? 'register' : 'modify'
		formData.append('page_type', regMod)
		const API = regMod === 'register' ? `${API_DISASTER_EVALUATION_CONTENT}/-1` : `${API_DISASTER_EVALUATION_CONTENT}/${criticalDisaster.evaluationEvaluatorId}`
		axiosPostPutCallback(regMod, '위험성평가', API, formData, regModCallback)
		dispatch(setTabTempSaveCheck(true))
	}

	function handleSign() {
		const filterData = criticalDisaster.evaluationSelectWorker.find(worker => worker.id === parseInt(cookies.get('userId')))
		const formData = new FormData()
		formData.append('line_id', filterData.row_id)
		formData.append('type', criticalDisaster.tab)
		formData.append('pk_id', filterData.content_schedule ? filterData.content_schedule : filterData.critical_disaster)
		Swal.fire({
			title: '알림',
			text: "확인을 클릭하면 더는 수정하실 수 없습니다.\n 해당 결재 내역을 저장하시겠습니까?",
			icon: 'info',
			showCancelButton: true,
			cancelButtonText: '취소',
			confirmButtonText: '결재',
			customClass: {
				cancelButton: 'btn btn-report ms-1',
				confirmButton: 'btn btn-primary',
				container: 'space',
				actions: 'sweet-alert-custom right'
			}
			}).then(function (result) {
				if (result.value) {
					axiosPostPutCallback('modify', `위험성평가 결재`, API_DISASTER_EVALUTION_SIGN, formData, handleSetReduxSignLine)
				} else {
					sweetAlert('결재 취소', '결재가 취소 되었습니다. 재 확인 해주세요.', 'info')
				}
		})
	}

	function checkWorker() {
		let isWorker = false
		criticalDisaster.evaluationSelectWorker.map(worker => {
			if (worker.id === parseInt(cookies.get('userId'))) isWorker = true
		})
		return isWorker
	}

	function isSign() {
		let isSign = false
		criticalDisaster.evaluationSelectWorker.map(worker => {
			if (worker.id === parseInt(cookies.get('userId')) && worker.is_final) isSign = true
		})
		return isSign
	}

	
	useEffect(() => {
		window.scroll({ top: 0, behavior: 'smooth' })
		setLoad(false)
	}, [contentIdx])
	
	useEffect(() => {
		if (criticalDisaster.evaluationSelectWorker.length !== 0) {
			if (loginAuth.isManager) setIsNotWorker(false)
			criticalDisaster.evaluationSelectWorker.map(worker => {
				if (worker.id === parseInt(cookies.get('userId'))) setIsNotWorker(false)
			})
		}
	}, [criticalDisaster.evaluationSelectWorker])

    useEffect(() => {
        if (criticalDisaster.appEvaluationList) document.body.style = `overflow: hidden`
        else document.body.style = `overflow: auto`
    }, [criticalDisaster.appEvaluationList])

	return (
		<Fragment>
			<Row style={{textAlign:'end', marginTop:'10px', color:'#ACACAC'}}>
				<Col xs={12}>마지막 저장 일시 ({moment(dataInfo.info.create_datetime).format('YYYY-MM-DD HH:mm:ss')})</Col>
			</Row>
			<Form onSubmit={handleSubmit(handleTempSave)}>
				<Card style={{marginTop:'10px', marginBottom:'10px', boxShadow:'none', backgroundColor:'transparent'}}>
					<Row style={{justifyContent:'space-between'}}>
						<Col xs={6} style={{display:'flex', justifyContent:'start'}}>
							<Button outline color='primary' onClick={() => dispatch(setAppEvaluationList(true))} >전체 항목 보기</Button>
						</Col>
						<Col xs={6} style={{display:'flex', justifyContent:'end'}}>
							<Button hidden={isNotWorker} onClick={handleSubmit(handleTempSave)} color='primary'>임시저장</Button>
						</Col>
					</Row>
				</Card>
				{
					!load && 
						<EvaluationContentCard
							control={control}
							unregister={unregister}
							setValue={setValue}
							watch={watch}
							errors={errors}
							files={files}
							setFiles={setFiles}
							managerList={managerList}
							data={body[contentIdx]}
							dataIdx={contentIdx}
							dataLen={body.length}
							isNotWorker={isNotWorker}/>
				}
			</Form>

			<Row style={{justifyContent:'space-between'}}>
				<Col xs={6} style={{display:'flex', justifyContent:'center'}}>
					<Button onClick={() => handleBtn(PREV)} hidden={contentIdx === 0} style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}} color='primary' outline >
						<ChevronLeft size={30} />
						<span className='align-middle ms-25' style={{fontSize:'20px'}}>뒤로가기</span>
					</Button>
				</Col>
				<Col xs={6} style={{display:'flex', justifyContent:'center'}}>
					<Button onClick={() => handleBtn(NEXT)} hidden={contentIdx === body.length - 1} style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}} color='primary'>
						<span className='align-middle ms-25' style={{fontSize:'20px'}}>다음으로</span>
						<ChevronRight size={30} />
					</Button>
					<Button onClick={() => handleSign()} hidden={checkWorker() ? isSign() ? true : contentIdx !== body.length - 1 : true} style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}} color='primary'>
						<span className='align-middle ms-25' style={{fontSize:'20px'}}>서명하기</span>
					</Button>
				</Col>
			</Row>

			{
				!load &&
				<EvaluationWholeListModal
					dataList={body}
					setLoad={setLoad}
					setContentIdx={setContentIdx}/>
			}
		</Fragment>
	)
}

export default EvaluationContents