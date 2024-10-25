import winLogoImg from '@src/assets/images/winlogo.png'
import moment from 'moment'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { Card, CardTitle, Col, Input, Label, Modal, ModalBody, Row } from "reactstrap"
import { ROUTE_FACILITYMGMT_ALARM } from '../../../../constants'
import { primaryColor } from '../../../../utility/Utils'
import { DANGER, historyIotDanger, historyIotStatus, historyStatus } from '../data'

const HistoryModal = (props) => {
	const { type, isOpen, setIsOpen, row, setRow } = props
	const [fullLocation, setFullLocation] = useState('')
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()

	function closeModal() {
		setIsOpen(!isOpen)
		setRow()
		if (searchParams.get('id')) {
			searchParams.delete('id')
			navigate(`${ROUTE_FACILITYMGMT_ALARM}/history`)
		}
	}

	useEffect(() => {
		if (row !== undefined) setFullLocation(`${row[type].building.name}${(row[type].floor) ? ` > ${row[type].floor.name}` : ''}${(row[type].room) ? ` > ${row[type].room.name}` : ''}`)
	}, [row])

	return (
		<Fragment>
			{
				row !== undefined &&
				<Modal isOpen={isOpen} toggle={() => closeModal()} className='modal-dialog-centered modal-lg'>
					<ModalBody style={{backgroundColor:primaryColor, borderTopLeftRadius : '0.357rem', borderTopRightRadius : '0.357rem'}}>
						<Row className='ms-1' style={{width:'100%', margin:'inherit'}}>
							<Col xs='10' className='custom-modal-header' style={{display: 'flex', flexDirection : 'column', justifyContent : 'center'}}>
								<Row style={{fontSize: '20px', color:'white'}}>
									히스토리
								</Row>
							</Col>

							<Col xs='2' className='custom-modal-header'>
								<Card style={{marginBottom:0, boxShadow:'none', backgroundColor:'transparent'}}>
									<img src={winLogoImg} style={{display:'flex', position:'relative', flexDirection:'column', height: "82px", width: '89px' }}/>
								</Card>
							</Col>
						</Row>
					</ModalBody>

					<ModalBody className='ms-1 me-1' style={{ backgroundColor:'#fff', borderBottomLeftRadius : '0.357rem', borderBottomRightRadius : '0.357rem', height:'auto'}}>
						<CardTitle tag={'h2'}>{row[`${type}`].location}</CardTitle>
						<Row >
							<Col xs={12} md={6} style={{marginTop:'15px'}}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>일시</div>
									</Col></Row>
								</Label>
								<Input style={{width:'100%'}} readOnly value={moment(row.create_datetime).format('YYYY-MM-DD HH:mm:ss')}/>
							</Col>
							<Col xs={12} md={6} style={{marginTop:'15px'}}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>상태</div>
									</Col></Row>
								</Label>
								<Input style={{width:'100%'}} readOnly value={type === 'camera' ? historyStatus[row.status] : 
																								parseInt(row.status) === DANGER ? historyIotDanger[row.iot.iot_type][row.status] 
																								: historyIotStatus[row.status]}/>
							</Col>
						</Row>
						<Row >
							<Col xs={12} style={{marginTop:'15px'}}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>위치</div>
									</Col></Row>
								</Label>
								<Input style={{width:'100%'}} readOnly value={fullLocation}/>
							</Col>
						</Row>
						<Row >
							<Col xs={12} style={{marginTop:'15px'}}>
								<Label className="form-check-label custom_label">
									<Row><Col style={{display:'flex', alignItems:'center'}}>
										<div>사진</div>
									</Col></Row>
								</Label>
								<img src={`/static_backend/${row.photo_path}`} style={{height:"100%", width: '100%', objectFit:'contain'}}></img>
							</Col>
						</Row>
						{/* <Row style={{height:'300px'}}>
							<Col className="card_table col text center" style={{height : 'auto', backgroundColor: '#ECE9E9'}}>
							</Col>
						</Row> */}
						<br/>
					</ModalBody>
				</Modal>
			}
		</Fragment>
	)
}

export default HistoryModal