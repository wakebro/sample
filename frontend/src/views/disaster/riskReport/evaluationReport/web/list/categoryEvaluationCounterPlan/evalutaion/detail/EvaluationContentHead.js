import { useSelector } from "react-redux"
import { CHECKLIST, FREQUENCY_3X3, FREQUENCY_5X5, STEP_3 } from "../../../../data"

const EvaluationContentHead = () => {
	const criticalDisaster = useSelector((state) => state.criticalDisaster)

	const Header = ({type}) => {
		if (type === FREQUENCY_3X3 || type === FREQUENCY_5X5) {
			return (
				<thead>
					<tr>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'2em', paddingLeft:'2em'}}>세부작업명</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>위험분류</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'5em', paddingLeft:'5em'}}>위험발생 상황 및 결과</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>현재의 안전보건 조치</th>
						<th className="label" colSpan="3" style={{verticalAlign:'middle'}}>현재 위험성</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'4em', paddingLeft:'4em'}}>관련근거(선택 사항)</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'6em', paddingLeft:'6em'}}>위험성 감소대책</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'2.5em', paddingLeft:'2.5em'}}>
							<div>개선후</div>
							<div>위험성</div>
						</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>
							<div>개선</div>
							<div>예정일</div>
						</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>
							<div>개선</div>
							<div>완료일</div>
						</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>담당자</th>
					</tr>
					<tr>
						<th className="label" style={{verticalAlign:'middle', paddingRight:'2.5em', paddingLeft:'2.5em', borderBottom:'1px solid #B9B9C3'}}>
							<div>가능성</div>
							<div>(빈도)</div>
						</th>
						<th className="label" style={{verticalAlign:'middle', paddingRight:'2.5em', paddingLeft:'2.5em', borderBottom:'1px solid #B9B9C3'}}>
							<div>중대성</div>
							<div>(강도)</div>
						</th>
						<th className="label" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em', borderBottom:'1px solid #B9B9C3'}}>위험성</th>
					</tr>
				</thead>
			)
		} else if (type === STEP_3) {
			return (
				<thead>
					<tr>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle'}}>번호</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'5em', paddingLeft:'5em'}}>유해 위험요인파악(위험한 상황과 결과)</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>현재의 안전보건 조치</th>
						<th className="label" colSpan="3" style={{verticalAlign:'middle'}}>위험성의 수준</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'6em', paddingLeft:'6em'}}>관련근거(선택 사항)</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'10em', paddingLeft:'10em'}}>개선대책</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'5em', paddingLeft:'5em'}}>
							<div>개선</div>
							<div>예정일</div>
						</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'5em', paddingLeft:'5em'}}>
							<div>개선</div>
							<div>완료일</div>
						</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>담당자</th>
					</tr>
					<tr>
						<th className="label" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>상</th>
						<th className="label" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>중</th>
						<th className="label" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>하</th>
					</tr>
				</thead>
			)
		} else if (type === CHECKLIST) {
			return (
				<thead>
					<tr>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle'}}>번호</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'5em', paddingLeft:'5em'}}>유해 위험요인파악(위험한 상황과 결과)</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>현재의 안전보건 조치</th>
						<th className="label" colSpan="3" style={{verticalAlign:'middle'}}>위험성 확인결과</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'6em', paddingLeft:'6em'}}>관련근거(선택 사항)</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'10em', paddingLeft:'10em'}}>개선대책</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'5em', paddingLeft:'5em'}}>
							<div>개선</div>
							<div>예정일</div>
						</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'5em', paddingLeft:'5em'}}>
							<div>개선</div>
							<div>완료일</div>
						</th>
						<th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>담당자</th>
					</tr>
					<tr>
						<th className="label" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>적정</th>
						<th className="label" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>보완</th>
						<th className="label" style={{verticalAlign:'middle', paddingRight:'3em', paddingLeft:'3em'}}>해당없음</th>
					</tr>
				</thead>
			)

		}
	}

	return (
		<Header type={criticalDisaster.registerFormType.value}/>
	)
}

export default EvaluationContentHead