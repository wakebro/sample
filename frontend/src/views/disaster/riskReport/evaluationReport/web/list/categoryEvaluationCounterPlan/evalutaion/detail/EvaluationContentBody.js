/* eslint-disable */
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { CHECKLIST, FREQUENCY_3X3, FREQUENCY_5X5, STEP_3, getMultiResult, getStrGrade } from "../../../../data"
import { Circle } from 'react-feather'
import { Col, Row } from 'reactstrap'

const EvaluationContentBody = (props) => {
	const { body, type } = props
	return (
		<>
			{ (type === FREQUENCY_3X3 || type === FREQUENCY_5X5) ?
				<tbody>
				{
					body && Array.isArray(body) && body.map((row, idx) => {
						return (
							<tr key={idx}>
								<td style={{height:'50px', padding:'1em', textAlign:'center'}}>{row.inputDetail}</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.selectDanger.label}</td>
								<td style={{padding:'1em'}}>{row.inputResult}</td>
								<td style={{padding:'1em'}}>{row.nowAction}</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.frequency.value}</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.strength.value}</td>
								<td style={{padding:'1em', textAlign:'center'}}>
									{
										!Number.isNaN(parseInt(row.frequency.value) * parseInt(row.strength.value)) 
										&& parseInt(row.frequency.value) * parseInt(row.strength.value)
									}
									{
										!Number.isNaN(parseInt(row.frequency.value) * parseInt(row.strength.value)) 
										&& getStrGrade(type, getMultiResult(type, parseInt(row.frequency.value) * parseInt(row.strength.value)))
									}
								</td>
								<td style={{padding:'1em'}}>{row.inputReason}</td>
								<td style={{padding:'1em'}}>{row.counterplan}</td>
								<td style={{padding:'1em', textAlign:'center'}}>
									{(row.dangerousness !== undefined && row.dangerousness !== '') ? 
										getStrGrade(type, getMultiResult(type, row.dangerousness.value))
										:
										<></>
									}
								</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.schedule ? row.schedule : ''}</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.complete ? row.complete : ''}</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.manager !== null ? row.manager.label : ''}</td>
							</tr>
						)
					})
				}
				</tbody>
				:
				(type === STEP_3 || type === CHECKLIST) ?
				<tbody>
					{
						body && Array.isArray(body) && body.map((row, idx) =>{
							// console.log(row)
							return (
								<tr key={idx}>
									<td style={{height:'50px', padding:'1em', textAlign:'center'}}>{idx + 1}</td>
									<td style={{padding:'1em', textAlign:'center'}}>{row.inputResult}</td>
									<td style={{padding:'1em'}}>{row.nowAction}</td>
									{
										type === STEP_3 ? 
											<>
												<td style={{padding:'1em', textAlign:'center'}}>{row.frequency.value === 3 ? <Circle /> : ''}</td>
												<td style={{padding:'1em', textAlign:'center'}}>{row.frequency.value === 2 ? <Circle /> : ''}</td>
												<td style={{padding:'1em', textAlign:'center'}}>{row.frequency.value === 1 ? <Circle /> : ''}</td>
											</>
										:
											<>
												<td style={{padding:'1em', textAlign:'center'}}>{row.frequency.value === 1 ? <Circle /> : ''}</td>
												<td style={{padding:'1em', textAlign:'center'}}>{row.frequency.value === 2 ? <Circle /> : ''}</td>
												<td style={{padding:'1em', textAlign:'center'}}>{row.frequency.value === 0 ? <Circle /> : ''}</td>
											</>
									}
									<td style={{padding:'1em'}}>{row.inputReason}</td>
									<td style={{padding:'1em'}}>{row.counterplan}</td>
									<td style={{padding:'1em', textAlign:'center'}}>{row.schedule ? row.schedule : ''}</td>
									<td style={{padding:'1em', textAlign:'center'}}>{row.complete ? row.complete : ''}</td>
									<td style={{padding:'1em', textAlign:'center'}}>{row.manager !== null ? row.manager.label : ''}</td>
								</tr>
							)
						})
					}
				</tbody>
				:
				<tbody>
					<tr style={{border:'none'}}>
						<td className='px-0' style={{border:'none'}}>
							<Row className='mx-0'>
								<Col className='py-3 border-left card_table text center risk-report text-bold border-all'>
									평가 내용 미등록
								</Col>
							</Row>
						</td>
					</tr>
				</tbody>
			}
		</>
	)
}
//EvaluationContentBodyend
export default EvaluationContentBody