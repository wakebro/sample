import { setId } from '@store/module/camera'
import { axiosDeleteRedux, checkOnlyView } from '@utils'

import { Fragment, forwardRef, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"

import { API_FACILITY_ALARM_CAMERA, API_FACILITY_ALARM_IOT, ROUTE_FACILITYMGMT_ALARM } from '../../../../constants'
import { FACILITY_CAMERA } from '../../../../constants/CodeList'
import { CustomBadge } from '../../../disaster/riskReport/evaluationReport/web/Component'
import { DANGER, iotTypeObj, statusBackColor, statusBadgeColor, statusBadgeKor, statusBorder, statusFontColor, statusImgObj, statusIotImgObj } from '../data'

const CameraInfoCard = (props) => {
	const { cameraInfo, reset, dispatch, idx, total, type } = props
	const navigate = useNavigate()
	const loginAuth = useSelector((state) => state.loginAuth)
	const fullLocation = `${cameraInfo.building.name}${(cameraInfo.floor) ? ` > ${cameraInfo.floor.name}` : ''}${(cameraInfo.room) ? ` > ${cameraInfo.room.name}` : ''}`
	function handelDelete (id) {
		const API = type === 'camera' ? API_FACILITY_ALARM_CAMERA : API_FACILITY_ALARM_IOT
		axiosDeleteRedux('CCTV', `${API}/${id}`, reset, null, null)
	}

	function gotoHistory (info) {
		navigate(`${ROUTE_FACILITYMGMT_ALARM}/history/${type}`, {state:info})
	}

	return (
		<Row style={{height:'100%', padding:'0 1rem'}}>
			<Card style={{flexDirection:'row', backgroundColor:`${statusBackColor[cameraInfo.status]}`, border:`${statusBorder[cameraInfo.status]}`}}>
				<Col xs={8} style={{cursor:'pointer'}} onClick={() => gotoHistory(cameraInfo)}>
					<CardHeader style={{paddingBottom:'0', flexDirection:'column', alignItems:'flex-start'}}>
						<span className='basic-badge evaluation-app-index' style={{minWidth:'60px', marginBottom:'10px'}}>
							{idx + 1}/{total}
						</span>
						<Col xs={12} style={{display:'flex'}}>
							<CardTitle style={{color:`${statusFontColor[cameraInfo.status]}`}}>{cameraInfo.location}</CardTitle>
							&nbsp;
							<CustomBadge color={statusBadgeColor[cameraInfo.status]}>{statusBadgeKor[cameraInfo.status]}</CustomBadge>
						</Col>

					</CardHeader>
					<CardBody style={{paddingBottom:'1.5rem'}}>
						<Row>
							{
								type === 'iot' && <Col xs={12}>{`타입 : ${iotTypeObj[cameraInfo.iot_type]}`}</Col>
							}
							<Col xs={12}>{`위치 : ${fullLocation}`}</Col>
							<Col xs={12}>{`담당자 : ${cameraInfo.contact}`}</Col>
							<Col xs={12}>{`관리자 : ${cameraInfo.manager ? cameraInfo.manager : ''}`}</Col>
						</Row>
					</CardBody>
				</Col>
				<Col xs={4} style={{display:'flex', alignItems:'center'}}>
					<CardBody>
						<Row>{type === 'camera' ? statusImgObj[cameraInfo.status] : cameraInfo.status === DANGER && statusIotImgObj[cameraInfo.iot_type]}</Row>
						&nbsp;
						<Row><Col xs={12} style={{display:'flex', justifyContent:'center'}}>
							<Button hidden={checkOnlyView(loginAuth, FACILITY_CAMERA, 'available_update')}
								size='sm' color='primary' outline onClick={() => dispatch(setId(cameraInfo.id))}>수정</Button>
							&nbsp;
							<Button hidden={checkOnlyView(loginAuth, FACILITY_CAMERA, 'available_delete')}
								size='sm' outline onClick={() => handelDelete(cameraInfo.id)}>삭제</Button>
						</Col></Row>
					</CardBody>
				</Col>
			</Card>
		</Row>
	)

}
const CameraList = forwardRef((props, ref) => {
	const { type, reset, total } = props
	const cameraRedux = useSelector((state) => state.camera)
	const [length, setLength] = useState(0)
	const dispatch = useDispatch()

	useEffect(() => {
		if (cameraRedux.dataList.length !== 0) {
			const tempLength = cameraRedux.dataList.length % 2 === 0 ? (cameraRedux.dataList.length / 2) - 1 : parseInt((cameraRedux.dataList.length / 2))
			setLength(tempLength)
		}
	}, [cameraRedux.dataList])
	
	return (
		<Fragment>
			{
				cameraRedux.dataList.map((data, idx) => {
					if (idx > length) return
					const ODD = idx * 2
					const EVEN = (idx * 2) + 1
					return (
						<Row key={idx} style={{height:'100%'}}>
							<Col md={6} xs={12}>
								<CameraInfoCard cameraInfo={cameraRedux.dataList[ODD]} reset={reset} dispatch={dispatch} idx={ODD} total={total} type={type} />
							</Col>
							{
								cameraRedux.dataList[EVEN] !== undefined &&
								<Col md={6} xs={12}>
									<CameraInfoCard cameraInfo={cameraRedux.dataList[EVEN]} reset={reset} dispatch={dispatch} idx={EVEN} total={total} type={type} />
								</Col>
							}
							<div ref={ref}/>
						</Row>
					)
				})
			}
		</Fragment>
	)
})

export default CameraList