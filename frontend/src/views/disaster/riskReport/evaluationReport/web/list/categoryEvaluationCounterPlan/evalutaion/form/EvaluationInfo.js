import { setTabTempSaveCheck } from '@store/module/criticalDisaster'
import { setStringDate } from '@utils'

import * as moment from 'moment'
import Flatpickr from 'react-flatpickr'
import { Controller } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { CardBody, Col, Input, Label, Row } from "reactstrap"
import Cookies from 'universal-cookie'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import EvaluationModal from './modal/EvaluationModal'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const EvaluationInfo = (props) => {
	const {control} = props
	const cookies = new Cookies()
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const dispatch = useDispatch()

	return (
		<CardBody>
			<Label className='risk-report text-lg-bold'>평가 정보</Label> 
			<Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
				<Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
					<Row className='card_table table_row'>
						<Col xs='4' className='card_table col col_color text center risk-report text-normal'>현장명</Col>
						<Col xs='8' className='card_table col text start'>
							<Controller
								name='scene'
								control={control}
								render={({ field: {onChange, value}  }) => <Input className='risk-report button-h' placeholder='현장명을 입력해주세요.'
									onChange={e => {
										onChange(e)
										dispatch(setTabTempSaveCheck(false))
									}}
									value={value}
								/>}
							/>
						</Col>
					</Row>
				</Col>
				<Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
					<Row className='card_table table_row'>
						<Col xs='4' className='card_table col col_color text risk-report text-normal center'>작업명<br/>(평가대상)</Col>
						<Col xs='8' className='card_table col text start'>
							<Controller
								name='target'
								control={control}
								render={({ field: {onChange, value}  }) => <Input className='risk-report button-h' placeholder='작업명을 입력해주세요.'
									onChange={e => {
										onChange(e)
										dispatch(setTabTempSaveCheck(false))
									}}
									value={value}
								/>}
							/>
						</Col>
					</Row>
				</Col>
				<Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
					<Row className='card_table table_row'>
						<Col xs='4' className='card_table col col_color text center risk-report text-normal'>평가일자</Col>
						<Col xs='8' className='card_table col text start'>
							<Controller
								name='date'
								control={control}
								render={({ field : {onChange, value}}) => (
									<Flatpickr
										id='range-picker'
										className= {`form-control`}
										placeholder={moment().format('YYYY-MM-DD')}
										value={value}
										onChange={(data) => {
											const newData = setStringDate(data)[0]
											onChange(newData)
											dispatch(setTabTempSaveCheck(false))
										}}
										options={{
											mode: 'single',
											dateFormat: 'Y-m-d',
											locale: Korean
										}}/>
								)}
							/>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
				<Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
					<Row className='card_table table_row'>
						<Col xs='4'  className='card_table col col_color text center risk-report text-normal'>평가자<br/>(관리자)</Col>
						<Col xs='8' className='card_table col text start'>
							<div>{cookies.get('username')}</div>
						</Col>
					</Row>
				</Col>
				<Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
					<Row className='card_table table_row'>
						<Col xs='4'  className='card_table col col_color text center risk-report text-normal'>부서</Col>
						<Col xs='8' className='card_table col text start'>
							<Controller
								name='department'
								control={control}
								render={({ field: {onChange, value}  }) => <Input className='risk-report button-h' placeholder='부서를 입력해주세요.'
									onChange={e => {
										onChange(e)
										dispatch(setTabTempSaveCheck(false))
									}}
									value={value}
								/>}
							/>
						</Col>
					</Row>
				</Col>
				<Col md='4' sm='12' xs='12' className='disaster-info'/>
			</Row>
			{/* <Row><Col>(양식명 : {criticalDisaster.registerFormType.label})</Col></Row> */}
			{/* <EvaluationModal 
				isOpen={criticalDisaster.evaluationWorkerModalIsOpen}
				list={criticalDisaster.evaluationWorkerList}
				select={criticalDisaster.evaluationSelectWorker ? criticalDisaster.evaluationSelectWorker : []}
				name='worker'/> */}
			<EvaluationModal 
				isOpen={criticalDisaster.evaluationEvaluatorModalIsOpen}
				list={criticalDisaster.evaluationEvaluatorList}
				select={criticalDisaster.evaluationSelectEvaluator}
				name='evaluator'/>
		</CardBody>
	)
}

export default EvaluationInfo