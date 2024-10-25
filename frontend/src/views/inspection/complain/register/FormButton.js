import { Button, Card, CardBody, Row } from "reactstrap"
import { useNavigate } from "react-router-dom"
import { ROUTE_INSPECTION_COMPLAIN, ROUTE_INSPECTION_COMPLAIN_DETAIL } from '../../../../constants'
import '../../../../assets/scss/style.scss'

const FormButton = (props) => {
	const { type, complainId } = props
	const navigate = useNavigate()
	return (
		<Card className="formButton-fixed-container mb-0" style={{zIndex:0}}>
			<CardBody>
				<Row>
					<div style={{display:'flex', justifyContent:'flex-end'}}>
						<div style={{border:'1px solid white'}}>
							{type !== 'detail' 
								? <Button onClick={() => navigate(ROUTE_INSPECTION_COMPLAIN)} color='primary'>취소</Button> 
								: <Button onClick={() => navigate(`${ROUTE_INSPECTION_COMPLAIN_DETAIL}/${complainId}`)} color='primary'>취소</Button>
							}
						</div>
						<div style={{backgroundColor:'white', border:'1px solid white'}}><Button color='primary' outline type='submit'>{type !== 'detail' ? '저장' : '수정'}</Button></div>
					</div>
				</Row>
			</CardBody>
		</Card>
	)
}

export {FormButton}