import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setPageType } from '@store/module/nfcWorker'

import { getKorAmPmHHMMSS, getKorYYMMDD } from '@utils/'
import { Fragment } from "react"
import { Edit } from "react-feather"
import { useDispatch } from "react-redux"
import { Button, Card, CardBody, Col, Row } from "reactstrap"
import { NFC_COMPLETE, NFC_NOMAL, NFC_REFUSE, NFC_REQUEST } from '../data'

const ScanDetail = ({control}) => {
	useAxiosIntercepter()
	const dispatch = useDispatch()

	const WorkingTime = (status, tagTime, modifyTime) => {
		switch (status) {
			case NFC_COMPLETE:
				return <div>{getKorAmPmHHMMSS(modifyTime.split('T')[1])}</div>
			default:
				return <div>{getKorAmPmHHMMSS(tagTime.split('T')[1])}</div>
		}
	}

	return (
		<Fragment>
			<Card style={{cursor:'default'}}>
				<CardBody>
					<Row>
						<Col xs={3}>
							<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
								<Col xs={12}>위치</Col>
							</Row>
						</Col>
						<Col xs={9}>
							<Row>
								<Col xs={12} style={{color:'#6E6B7B', fontSize:'16px', fontWeight:500}}>{control._formValues.location}</Col>
							</Row>
						</Col>
					</Row>
				</CardBody>
				<hr style={{margin:0}}/>
				<CardBody>
					<Row>
						<Col xs={3}>
							<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
								<Col xs={12}>날짜</Col>
							</Row>
						</Col>
						<Col xs={9}>
							<Row>
								<Col xs={12} style={{color:'#5E5873', fontSize:'15px', fontWeight:600}}>{getKorYYMMDD(control._formValues.tagTime.split('T')[0])}</Col>
							</Row>
						</Col>
					</Row>
				</CardBody>
				<hr style={{margin:0}}/>
				<CardBody>
					<Row>
						<Col xs={3}>
							<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
								<Col xs={12}>시간</Col>
							</Row>
						</Col>
						<Col xs={9}>
							<Row>
								<Col xs={12} style={{color:'#5E5873', fontSize:'15px', fontWeight:600}}>
									{WorkingTime(control._formValues.status, control._formValues.tagTime, control._formValues.modifyTime)}
								</Col>
							</Row>
						</Col>
					</Row>
				</CardBody>
				<hr style={{margin:0}}/>
				<CardBody>
					<Row>
						<Col xs={3}>
							<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
								<Col xs={12}>직종</Col>
							</Row>
						</Col>
						<Col xs={9}>
							<Row>
								<Col xs={12} style={{color:'#6E6B7B', fontSize:'16px', fontWeight:500}}>{control._formValues.employeeClass}</Col>
							</Row>
						</Col>
					</Row>
				</CardBody>
				<hr style={{margin:0}}/>
				<CardBody>
					<Row>
						<Col xs={3}>
							<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
								<Col xs={12}>직원</Col>
							</Row>
						</Col>
						<Col xs={9}>
							<Row>
								<Col xs={12} style={{color:'#6E6B7B', fontSize:'16px', fontWeight:500}}>{control._formValues.user}</Col>
							</Row>
						</Col>
					</Row>
				</CardBody>
				<CardBody>
					<Row>
						<Col className='d-flex justify-content-end' style={{paddingRight: '3%'}}>
							<Button disabled={control._formValues.status === NFC_COMPLETE} color="primary" outline onClick={() => dispatch(setPageType('modify'))}>
								<Edit size={14} />
								<span className='align-middle ms-20'>수정</span>
							</Button>
						</Col>
					</Row>
				</CardBody>
			</Card>
		</Fragment>
	)
}

export default ScanDetail