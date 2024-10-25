import { AccordionBody, AccordionHeader, AccordionItem, CardTitle, Col, Label, Row, UncontrolledAccordion } from 'reactstrap'
import { evaluationTypeBadge } from '../../../web/data'

const EvaluationInfoAccordion = (props) => {
	const { dataInfo } = props
	return (
		<UncontrolledAccordion defaultOpen='1'>
			<AccordionItem>
				<AccordionHeader targetId='1'>
					<Row>
						<CardTitle style={{margin:'0'}}>{dataInfo.evaluation_title}</CardTitle>
						<CardTitle style={{margin:'0'}}>{evaluationTypeBadge[dataInfo.form_type]}</CardTitle>
					</Row>
				</AccordionHeader>
				<AccordionBody accordionId='1'>
					<Row>
						<Col xs={6}>
							<Label className='form-label' for='scene'>현장명</Label>
							<h4 id='scene'>{dataInfo.scene}</h4>
						</Col>
						<Col xs={6}>
							<Label className='form-label' for='date'>평가일자</Label>
							<h4 id='date'>{dataInfo.date}</h4>
						</Col>
					</Row>
					<hr/>
					<Row>
						<Col xs={12}>
							<Label className='form-label' for='target'>작업명(평가대상)</Label>
							<h4 id='target'>{dataInfo.target}</h4>
						</Col>
					</Row>
					<hr/>
					<Row>
						<Col xs={12}>
							<Label className='form-label' for='worker'>근무자</Label>
							<Col xs={12} style={{display:'flex'}}>
								{
									dataInfo.workerList.map((worker, idx) => {
										return (<h4 key={idx}>{worker.name}{idx !== dataInfo.workerList.length - 1 ? ', ' : ''}</h4>)
									})
								}
							</Col>
						</Col>
					</Row>
					<hr/>
					<Row>
						<Col xs={6}>
							<Label className='form-label' for='manager'>평가자</Label>
							<h4 id='manager'>{dataInfo.manager_name}</h4>
						</Col>
						<Col xs={6}>
							<Label className='form-label' for='department'>부서</Label>
							<h4 id='department'>{dataInfo.department}</h4>
						</Col>
					</Row>
					<hr/>
				</AccordionBody>
			</AccordionItem>
		</UncontrolledAccordion>
	)
}

export default EvaluationInfoAccordion
