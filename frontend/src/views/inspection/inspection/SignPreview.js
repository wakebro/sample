import { Fragment} from "react"
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Button } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'

const SignPreview = (props) => {
	useAxiosIntercepter()
	const {userName} = props
	const temp = ['담당자', '1차결재자', '2차결재자', '최종결재자']
	
	const title = () => {
		return (
			temp.map((v, i) => {
				return (
					<Col key={v + i} xs='3'>
						<Row className='card_table table_row'>
							<Col className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
								{v}
							</Col>
						</Row>
					</Col>
				)
			})
		)
	}

	const img = () => {
		const signCheck = (index) => {
			return (
				<div >
					<Row style={{height: '80px'}}/>
					<span style={{display:'flex', aligItems:'center', justifyContent:'center'}}>{userName[index]}</span>
				</div>
			)
		}
		const dateCheck = (index) => {
			if (userName[index] !== '') {
				return <br/>
			} else {
				return (
					<div >
						<span style={{display:'flex', aligItems:'center', justifyContent:'center'}}>미지정</span>
					</div>
				)
			}
		}
	
		
		return (
			<Fragment>

				<Row className='card_table mid ms-1 me-1'  style={{height : '100px'}}>
					{temp.map((v, i) => {
							return (
								<Col key={v + i} xs='3' >
									<Row className='card_table table_row' >
										<Col className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3', cursor :'pointer', padding:0}}>
											{signCheck(i)}
										</Col>
									</Row>
								</Col>
							)
						})
					}
				</Row>
				<Row className='card_table mid ms-1 me-1' style={{borderTop : '2px solid black'}}>
					{temp.map((v, i) => {
							return (
								<Col key={v + i} xs='3' >
									<Row className='card_table table_row'>
										<Col className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
											{dateCheck(i)}
										</Col>
									</Row>
								</Col>
							)
						})
					}
				</Row>
			</Fragment>
			
		)
	}

	// certificate
	return (
		<Fragment>
			<Row className='card_table top ms-1 mt-1 me-1'>
				{title()}
			</Row>
			{img()}
		</Fragment>
	)
}
export default SignPreview