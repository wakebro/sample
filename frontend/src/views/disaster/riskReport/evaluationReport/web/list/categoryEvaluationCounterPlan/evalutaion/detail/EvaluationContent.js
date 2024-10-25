/* eslint-disable */
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { CardBody, Col, Label, Table } from "reactstrap"
import EvaluationContentBody from "./EvaluationContentBody"
import EvaluationContentHead from "./EvaluationContentHead"
import { useSelector } from 'react-redux'

const EvaluationContent = (props) => {
	const { body } = props
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	
	return (
		<CardBody>
			<Col style={{display:'flex', alignItems:'end'}}>
				<Label className='risk-report text-lg-bold'>평가 내용</Label>
			</Col>
			<Table responsive className="electric-table" style={{marginTop:'0px'}}>
				<EvaluationContentHead/>
				<EvaluationContentBody body={body} type={criticalDisaster.registerFormType.value} />
			</Table>
		</CardBody>
	)
}

export default EvaluationContent