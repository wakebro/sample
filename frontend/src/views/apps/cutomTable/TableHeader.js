/* eslint-disable */
import { Fragment } from "react"
import { Col, Input, Label, Row } from "reactstrap"

const TableHeader = ({purpose, check, setCheck}) => {
	if (purpose === 'auth') {
		return (
			<Fragment>
				<Col xs={3} md={3} className="card_table p-half-one-y top border-top-left-radius col-h-backcolor text center border-left risk-report text-bold"
					style={{display:'flex', alignItems:'center'}}>
					사업소 그룹
				</Col>
				<Col xs={3} md={3} className="card_table p-half-one-y top border-top-right col-h-backcolor text center risk-report text-bold"
					style={{display:'flex', alignItems:'center'}}>
					사업소
				</Col>
				<Col xs={3} md={3} className="card_table p-half-one-y top border-top-right col-h-backcolor text center risk-report text-bold"
					style={{display:'flex', flexDirection:'column'}}>
					<Col>권한</Col>
					<Row>
						<Col>
							<Input id='isOnlyViewTrue' type='radio' 
								checked={check.isOnlyView === true}
								onChange={() => {
									setCheck({
										...check,
										isOnlyView:!check.isOnlyView,
										detect: true
									})
								}}
							/>
							<Label className='form-check-label' for='isOnlyViewTrue' style={{paddingLeft:'1rem'}}>내용 조회</Label>
						</Col>
						<Col>
							<Input id='isOnlyViewFalse' type='radio' 
								checked={check.isOnlyView === false}
								onChange={() => {
									setCheck({
										...check,
										isOnlyView:!check.isOnlyView,
										detect: true
									})
								}}
							/>
							<Label className='form-check-label' for='isOnlyViewFalse' style={{paddingLeft:'1rem'}}>모든 기능</Label>
						</Col>
					</Row>
				</Col>
				<Col xs={3} md={3} className="card_table p-half-one-y top border-top-right-radius col-h-backcolor text center risk-report text-bold"
					style={{display:'flex', alignItems:'center'}}>
					주소
				</Col>
			</Fragment>
		)
	} else {
		return (
			<Fragment>
				<Col xs={3} md={3} className="card_table p-half-one-y top border-top-left-radius col-h-backcolor text center border-left risk-report text-bold">
					사업소 그룹
				</Col>
				<Col xs={9} md={9} className="card_table p-half-one-y top border-top-right-radius col-h-backcolor text center risk-report text-bold">
					사업소
				</Col>
			</Fragment>

		)
	}
}

export default TableHeader