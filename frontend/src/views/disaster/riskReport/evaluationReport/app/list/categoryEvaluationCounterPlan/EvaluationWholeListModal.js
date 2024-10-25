import { setAppEvaluationList } from '@store/module/criticalDisaster'
import { primaryColor } from "@utils"
import { Fragment, useEffect, useState } from "react"
import { Check, X } from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import { Button, Col, Input, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import { CustomBadge } from "../../../web/Component"
import { FREQUENCY_3X3, FREQUENCY_5X5, NOMAL, getMultiResult } from '../../../web/data'

const EvaluationWholeListModal = (props) => {
	const { dataList, setLoad, setContentIdx } = props
	const criticalDisasterRedux = useSelector((state) => state.criticalDisaster)
	const dispatch = useDispatch()
	const [type, setType] = useState()
	const [check, setCheck] = useState(false)

	function closeModal () {
		setCheck(false)
		dispatch(setAppEvaluationList(false))
	}

	function handleContentCardView(idx) {
		setLoad(true)
		setContentIdx(idx)
		closeModal()
	}

	function checkIsComplete(data) {
		// 현재 안전보건조치 확인
		if (data.nowAction === '' || data.nowAction === undefined || data.nowAction === null) return false
		// 위험성 확인 결과
		if (typeof data.frequency === String) return false
		else {
			let result = null
			if (type === FREQUENCY_3X3 || type === FREQUENCY_5X5) {
				if (Number.isNaN(parseInt(data.frequency.value) * parseInt(data.strength.value))) return false
				result = getMultiResult(type, parseInt(data.frequency.value) * parseInt(data.strength.value))
			} else {
				result = getMultiResult(type, data.frequency.value)
			}
			if (result < NOMAL) return true
			else {
				if (data.counterplan === '' || data.counterplan === undefined || data.counterplan === null) return false
				if (data.schedule === '' || data.schedule === undefined || data.schedule === null) return false
				if (data.manager === '' || data.manager === undefined || data.manager === null) return false
				if (data.complete === '' || data.complete === undefined || data.complete === null) return false
				if (data.dangerousness === '' || data.dangerousness === undefined || data.dangerousness === null) return false
				if (data.images.evaluation.length === 0) return false
				if (data.images.counterplan.length === 0) return false
				return true
			}
		}
	}

	useEffect(() => {
		setType(criticalDisasterRedux.registerFormType.value)
	}, [dataList])
	return (
		<Fragment>
			{
				criticalDisasterRedux.appEvaluationList &&
				<Modal isOpen={criticalDisasterRedux.appEvaluationList}
					toggle={() => closeModal()} className='modal-dialog-centered modal-xl'>
					<ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
						<div className='mb-1 px-1' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
							<div>
								<Row>
									<span style={{color: 'white', fontSize: '20px', paddingLeft:'23px', paddingTop:'4%'}}>전체 문항 조회</span>
								</Row>
								<Row>
									<span style={{color: 'white', fontSize: '15px', paddingLeft:'23px', paddingTop:'1%'}}>클릭시 해당 페이지로 이동합니다.</span>
								</Row>
							</div>
						</div>
					</ModalHeader>
					<ModalBody className='ms-1 me-1' style={{ backgroundColor:'#fff', borderBottomLeftRadius : '0.357rem', borderBottomRightRadius : '0.357rem', height:'auto'}}>
						<Row>
							<Col xs={12} style={{display:'flex'}}>
								<Input 
									type='checkbox' 
									color='#FF922A' 
									onChange={(e) => { setCheck(e.target.checked) }}
								/>
								&nbsp;&nbsp;
								<div style={{color:'#FF922A'}}>미완료 항목보기</div>
							</Col>
						</Row>
						<hr/>
						<Row style={{maxHeight:'450px', overflowY:'auto'}}>
							{
								dataList.map((data, idx) => {
									if (check) {
										const checkResult = checkIsComplete(data)
										if (checkResult) return
									}
									return (
										<Row key={idx} onClick={() => handleContentCardView(idx)}>
											<Col xs={12} style={{display:'flex', alignItems:'center'}}>
												<div style={{color:'#9591A1', fontSize:'20px'}}>{idx + 1}번 문항</div>
												&nbsp;&nbsp;
												{
													checkIsComplete(data) ? 
														<CustomBadge color='light-success'>완료 <Check /></CustomBadge>
													:
														<CustomBadge color='light-danger'>미완료 <X /></CustomBadge>
												}
											</Col>
											<Col xs={12}><div>{data.inputResult}</div></Col>
											<hr/>
										</Row>
									)
								})
							}
						</Row>
						<Row>
							<Col xs={12}>
								<Button style={{width:'100%', margin:'10px 0'}} color='primary' outline onClick={() => closeModal()}>닫기</Button>
							</Col>
						</Row>

					</ModalBody>
				</Modal>
			}
		</Fragment>
	)
}

export default EvaluationWholeListModal