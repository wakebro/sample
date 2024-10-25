/* eslint-disable */
import { setTab } from '@store/module/criticalDisaster'
import { sweetAlert } from '@utils'

import { Fragment} from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Row } from "reactstrap"

import { handleResetNToListBTN, tabList } from "../data"
import EvaluationCounterplanForm from './categoryEvaluationCounterPlan/EvaluationCounterplanForm'
import CategoryNoticeForm from './categoryNotice/CategoryNoticeForm'
import CategoryEducation from './categoryEducation'
import CategoryMeetingForm from './categoryMeeting'
import CategoryReportForm from './categoryReport/CategoryReportForm'

import { useAxiosIntercepter } from '../../../../../../utility/hooks/useAxiosInterceptor'
import EvaluationTitle from './categoryTitle'

const FooterLine = (props) => {
	const { handleSubmit, reset, tempSave} = props
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const dispatch = useDispatch()

	/** 현재 작정중인 Tab의 내용 초기화 */
	function handleReset() {
		handleResetNToListBTN(
			'작성 내용을 초기화하시겠습니까?',
			'입력하신 내용이 모두 삭제됩니다.', 
			reset
		)
	}

	/** 결과 보고서 외의 Tab으로 이동시 임시 저장 되었는지 확인 */
	function handleCheckSave() {
		if (criticalDisaster.tabTempSaveCheck) {
			const idx = tabList.indexOf(criticalDisaster.tab)
			dispatch(setTab(tabList[idx + 1]))
		}
		else sweetAlert('임시 저장이 안되었습니다.', '임시 저장 후 다시 클릭해 주세요.', 'warning', 'center')
	}

	return (
		<Row>
			<Col xs={6}><Row>
				<Col><Button type='button' color='report' onClick={() => handleReset()}>작성 내용 초기화</Button></Col>
			</Row></Col>
			<Col xs={6}>
				<Col style={{display:'flex', justifyContent:'flex-end'}}>
					{criticalDisaster.tab !== 'report' && <Button color='primary' outline onClick={handleSubmit(tempSave)}>임시 저장</Button>}
					&nbsp;&nbsp;
					{criticalDisaster.tab !== 'report' && <Button type='button' color='primary' onClick={() => handleCheckSave()}>다음</Button>}
					{criticalDisaster.tab === 'report' && <Button color='primary' onClick={handleSubmit(tempSave)}>저장</Button>}
				</Col>
			</Col>
		</Row>
	)
}

const EvaluationForm = () => {
	useAxiosIntercepter()
	const criticalDisaster = useSelector((state) => state.criticalDisaster)

	return (
		<Fragment>
			<EvaluationTitle/>
			{
				criticalDisaster.tab === 'notice' &&
				<CategoryNoticeForm
					criticalDisaster={criticalDisaster}
					pageType={'register'}
				/>
			}
			{
				criticalDisaster.tab === 'meeting' &&
				<CategoryMeetingForm 
					criticalDisaster={criticalDisaster}	
				/>
			}
			{
				(criticalDisaster.tab === 'evaluation' || criticalDisaster.tab === 'counterplan') &&
				<EvaluationCounterplanForm/>
			}
			{
				criticalDisaster.tab === 'education' &&
				<CategoryEducation/>
			}
			{
				criticalDisaster.tab === 'report' &&
				<CategoryReportForm/>
			}
		</Fragment>
	)
}

export { EvaluationForm, FooterLine }
