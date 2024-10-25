import { ReactComponent as Logo } from '@src/assets/images/NFCScan.svg'
import axios from '@utility/AxiosConfig'
import { getKorAmPmHHMMSS, getKorYYMMDD, sweetAlert } from '@utils'

import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Modal, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_EMPLOYEE_DETAIL, API_FACILITY_GUARD_SCAN } from "../../../../constants"

const Scanning = () => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const [scanInfo, setScanInfo] = useState({
		nfc: undefined,
		resultOpen: false,
		datetime: '',
		location: ''
	})
	const {nfc, resultOpen, datetime, location} = scanInfo

	function reset() {
		setScanInfo({
			...scanInfo,
			nfc: undefined,
			resultOpen: false,
			datetime: '',
			location: ''
		})
	}

	function toggleModal (modal, isOpen) {
		setScanInfo({
			...scanInfo,
			[`${modal}Open`]: isOpen
		})
		reset()
	}

	function handleSaveBtn() {
		const formData = new FormData()
		formData.append('user', cookies.get('userId'))
		formData.append('nfc', nfc)
		formData.append('tag_datetime', datetime)
		axios.put(`${API_FACILITY_GUARD_SCAN}/scanning/${nfc}`, formData)
			.then(res => {
				if (res.status === 200 && res.data === '') {
					sweetAlert(`스캔 저장 완료`, `스캔 저장이 완료되었습니다.`, 'success')
				} else if (res.status === 200 && Object.keys(res.data).includes('done')) {
					sweetAlert(`스캔 저장 실패`, `NFC 스캔 이력이 있습니다.`, 'warning')
				}
				toggleModal('scan', false)
				toggleModal('result', false)
			})
			.catch(() => {
				sweetAlert(`스캔 저장 실패`, `스캔 저장 이 실패헀습니다.<br/>다시한번 확인 해주세요.`, 'warning')
				toggleModal('scan', false)
				toggleModal('result', false)
			})
	}

	/*eslint-disable */
	const proxyNfc = async (event) =>{
		console.log('!!!!!!!!!!!!!!!! '+event.detail.data)
		setScanInfo({
			...scanInfo,
			nfc: event.detail.data
		})
	}

	useEffect(() => {
		reset()
		window.addEventListener('nfcEvent',proxyNfc)

		return () => {
			window.removeEventListener('nfcEvent',proxyNfc)
		}
	}, [])

	useEffect(() => {
		console.log('???????????????????',nfc)
		if (nfc !== undefined) {
			axios.get(`${API_FACILITY_GUARD_SCAN}/scanning/${nfc}`)
			.then(res => {
				setScanInfo({
					...scanInfo,
					location: res.data,
					datetime:  moment().format(),
					resultOpen: true
				})
				handleSaveBtn()
			})
		} else {
			setScanInfo({
				...scanInfo,
				location: '',
				datetime:  ''
			})
		}
	}, [nfc])

	useEffect(() => {
		if (!resultOpen) toggleModal('scan', false)
	}, [resultOpen])

	return (
		<Fragment>
			<Card style={{textAlign:'center', height:'90vh'}}>
				{/* <CardTitle style={{marginTop:'5em'}} tag='h4'>
					기기 뒷면에 NFC칩을 태그 해주세요
				</CardTitle> */}
				<CardBody style={{height:'100%', alignItems:'center', justifyContent:'center', display:'flex'}}>
					<Logo/>
					{/* <Row style={{marginBottom:'2em'}}><Logo/></Row> */}
					{/* <Row style={{marginBottom:'2em', padding:'0 1em'}}><Button color="primary" style={{fontSize:'21px', fontFamily:'Montserrat', fontWeight:'bold'}} onClick={() => toggleModal('scan', true)}>NFC 스캔</Button></Row> */}
					{/* <Row style={{marginBottom:'2em', padding:'0 1em'}}><Button color="primary" style={{fontSize:'21px', fontFamily:'Montserrat', fontWeight:'bold'}} tag={Link} to={`${ROUTE_FACILITYMGMT_GUARD}/scan/list`}>스캔 목록 조회</Button></Row> */}
				</CardBody>
			</Card>

			{/* <Offcanvas direction={'bottom'} isOpen={scanOpen} toggle={() => toggleModal('scan', false)} style={{height:'60%', borderRadius:'10px 10px 0 0'}}>
				<OffcanvasHeader tag='h1' toggle={() => toggleModal('scan', false)} style={{display:'flex', justifyContent:'center'}}><font color='#B9B9C3'>스캔 준비 완료</font></OffcanvasHeader>
				<OffcanvasBody>
					<Row style={{justifyContent:'center', paddingLeft:'1em'}}>
						<img src={scanning} style={{height: '45%', width: '45%'}}/>
					</Row>
					<Row style={{marginTop:'2em'}}><Col style={{width:'100%', textAlign:'center', fontFamily:'Montserrat', fontSize:'18px'}}><font>기기 뒷면에 NFC카드를 대주세요.</font></Col></Row>
					<Row style={{marginTop:'1em', padding: '0 2em'}}>
						<Button
							outline
							color='primary'
							style={{fontSize:'21px', fontFamily:'Montserrat', fontWeight:'bold'}}
							onClick={() => toggleModal('scan', false)}>취소</Button>
					</Row>
				</OffcanvasBody>
			</Offcanvas> */}

			<Modal
				isOpen={resultOpen}
				toggle={() => toggleModal('result', false)}
				className={'modal-xs modal-dialog-centered'}
				>
				<Card style={{margin:0}}>
					<CardHeader>
						<CardTitle tag='h1' style={{fontWeight:900, width:'100%', textAlign:'center'}}>스캔 목록을 저장하시겠습니까?</CardTitle>
					</CardHeader>
					<CardBody style={{padding:'0 5em'}}>
						{
							datetime !== '' &&
								<>
									<Row>{getKorYYMMDD(datetime.split('T')[0])}</Row>
									<Row>{getKorAmPmHHMMSS(datetime.split('T')[1])}</Row>
								</>
						}
						<Row>{location}</Row>
					</CardBody>
					<CardFooter>
						<Row><Col className='d-flex justify-content-end' style={{paddingRight: '3%'}}>
							<Button color='report' onClick={() => toggleModal('result', false)}>취소</Button>
							&nbsp;&nbsp;&nbsp;
							<Button color='primary' onClick={() => handleSaveBtn()}>저장</Button>
						</Col></Row>
					</CardFooter>
				</Card>
			</Modal>
		</Fragment>
	)
}

export default Scanning