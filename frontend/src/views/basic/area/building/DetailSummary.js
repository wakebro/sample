import { Fragment } from "react"
import { CardBody, Col, Row } from 'reactstrap'
import { BuildingSummaryList } from "../data"

// import {  } from "react-router-dom"

const DetailSummary = (props) => {
	const { data } = props
	return (
		<Fragment>
				<CardBody>
					{data.image !== null ?
						<Col className="card_table col text center" style={{height : '265px'}}>
							<img src={`/static_backend/${data.image}`} style={{height:"100%", width: '100%', objectFit:'contain'}}></img>
						</Col>
						:
						<Col className="card_table col text center" style={{height : '265px', backgroundColor: '#ECE9E9'}}>
							건물 사진을 등록해 주세요.
						</Col>
					}
					{
						BuildingSummaryList.map((tab, idx) => {
							const title = tab.value
							return (
								<Row key={idx} className={idx === 0 ? "card_table top mt-3" : (idx + 1 === BuildingSummaryList.length ? 'card_table mid mb-2' : 'card_table mid')}>
									<Col>	
										<Row className="card_table row">
											<Col xs = '3' className="card_table col_color col text word-normal center px-0">
												{tab.label}
											</Col>
											<Col xs = '9' className="card_table col">
												{data[title]}
											</Col>
										</Row>
									</Col>
								</Row>
							)
						})
					}	
				</CardBody>
				{/* <CardFooter style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
					<Button color="primary" onClick={() => setUpdate(!update)}>
						수정
					</Button>
				</CardFooter>		 */}
			
		</Fragment>
	)
}

export default DetailSummary
