import axios from 'axios'
import { Fragment, useState, useEffect } from "react"
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Button } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { API_EMPLOYEE_DETAIL } from '../../../constants'
import Cookies from 'universal-cookie'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import * as moment from 'moment'
import Swal from 'sweetalert2'
import { signAuthCheck, signNotNullCheck, signPreCheck } from '../../../utility/Utils'


const Sign = (props) => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const {userSign, setUserSign, signList, setSignList, completable, signNameList, update, signListObj} = props
	const temp = ['담당자', '1차 결재자', '2차 결재자', '최종 결재자']
	const [tempSign, setTempSign] = useState("")
	const activeUser = Number(cookies.get('userId'))

	const userSignGet = () => {
		axios.get(API_EMPLOYEE_DETAIL, {
			params: {userId : cookies.get('userId')}
		}).then(res => {
			if (res.status === 200) {
				if (res.data['signature'] !== null && res.data['signature'] !== "") {
					const url  = `/static_backend/${res.data['signature']}`
					setTempSign(url)
				}
			}
		}).catch(res => {
			console.log(res, "!!!!!!!!error")
		})
		
	}

	const clickSign = (index) => {
		if (update !== 1) return

		const nowDate = moment()
		const copySignType = [...signList]
		const copyUserSign = [...userSign]

		// 결재 박스를 클릭할 권한이 있는지 체크
		// error 발생한 이유는 해당 예외처리 안해서
		if (!signAuthCheck(activeUser, copyUserSign)) return

		const previousUserSigns = [
			userSign[index - 1],
			userSign[index - 2],
			userSign[index - 3]
		]

		if (copySignType[index] === 3 || userSign[index].is_final === true) return
		// 이전 결재가 진행 하지 않았다면 리턴 / 해당 결재 칸이 미지정이면 리턴 / 해당 칸의 결재가 완료 되었다면 리턴

		// type 0 1 2 3
		if (index === 0) {
			if (copyUserSign[0].user !== activeUser) return
			if (copySignType[index] === 1) {
				copySignType[index] = 0
			} else {
				copySignType[index] = 1
			}
			copyUserSign[index].url = tempSign
			copyUserSign[index].create_datetime = nowDate
			setUserSign(copyUserSign)
			setSignList(copySignType)
			return
		}// 담당자

		// 이전 결재 검색
		const preSignCheckResult = signPreCheck(activeUser, previousUserSigns)

		if (!preSignCheckResult.result) {
			if (activeUser === userSign[index].user) {
				Swal.fire({
					title: '결재 불가',
					text: `${signListObj[preSignCheckResult.index]} 결재가 진행 되지 않았습니다.`,
					customClass: {
					confirmButton: 'btn btn-success',
					actions: 'sweet-alert-custom right'
					}
				})
			}
			return
		} // if end

		if (copySignType[index] === 2 && (signNotNullCheck(activeUser, previousUserSigns) || activeUser === userSign[index].user)) { // 현재 결재가 전결 처리 되어 있다면 
			copySignType[index] = 0 // 결재 안함 처리
			copyUserSign[index].create_datetime = nowDate
			setUserSign(copyUserSign)
			setSignList(copySignType)
			return
		} // if end

		// 현재가 결재, 미결재 상태라면 
		if (activeUser === userSign[index].user) { // 해당 칸의 결재 권한이 있는지
			copySignType[index] += 1 // 사실상 0 1 2 를 순회함
			copyUserSign[index].url = tempSign
			copyUserSign[index].create_datetime = nowDate
			setUserSign(copyUserSign)
			setSignList(copySignType)
			// return
		}

		// 전결권 검색
		// if (!signNotNullCheck(activeUser, previousUserSigns)) return

		// copySignType[index] = 2
		// copyUserSign[index].create_datetime = nowDate
		// setUserSign(copyUserSign)
		// setSignList(copySignType)
	} // clickSign end

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
			if (signList[index] === 0) {
				return <div>
							<Row style={{height: '80px'}}>
							</Row>
							<Row>
								<span style={{display:'flex', aligItems:'center', justifyContent:'center', color:'#ACACAC'}}>{signNameList[index]}</span>
							</Row>
						</div>
			} else if (signList[index] === 1) {
				return (
					<div >
						{
							(userSign[index]['url'] !== "") ? <img src={userSign[index]['url']} style={{height:"80px", width: '100%', objectFit:'contain'}}></img>
							:
							<div style={{height:"80px", width: '100%', display: 'flex',  alignItems: 'center'}}>
								<span>이미지 없음</span>
							</div>
						}
						<span style={{display:'flex', aligItems:'center', justifyContent:'center'}}>{signNameList[index]}</span>
					</div>
				)
			} else if (signList[index] === 3 || update === 0 || update === 2) {
				return (
					<div>
					</div>
				)
			} else {
				return (
					<Col>
						<Row style={{height: '80px', margin: 0, display: 'flex',  alignItems: 'center'}}>
							<hr style={{ border: '1px solid black', width : '100%', margin: 0}}/>
						</Row>
						<Row>
							<span style={{display:'flex', aligItems:'center', justifyContent:'center'}}>{signNameList[index]}</span>
						</Row>
					</Col>
				)
			}
		}
		const dateCheck = (index) => {
			if (signList[index] === 1) {
				return <div style={{ fontSize: '10px' }}>
							{userSign[index]['completabled_datetime'] ? (
								moment(userSign[index]['completabled_datetime']).format('YY-MM-DD HH:mm')
							) : (
								moment(userSign[index]['create_datetime']).format('YY-MM-DD HH:mm')
							)}
			  			</div>
			} else if (signList[index] === 2) {
				return <div style={{fontSize :'10px'}}>전결</div>
			} else if (signList[index] === 3 || update === 0 || update === 2) {
				return <div style={{fontSize :'10px'}}>미지정</div>
			} else {
				return <br/>
			}
		}
		
		return (
			<Fragment>

				<Row className='card_table mid ms-1'  style={{height : '100px'}}>
					{temp.map((v, i) => {
							return (
								<Col key={v + i} xs='3' >
									<Row className='card_table table_row' >
										<Col className='card_table col text center ' style={completable ? {borderLeft: '1px solid #B9B9C3', padding:0} : {borderLeft: '1px solid #B9B9C3', cursor :'pointer', padding:0}} onClick={() => clickSign(i)}>
											{signCheck(i)}
										</Col>
									</Row>
								</Col>
							)
						})
					}
				</Row>
				<Row className='card_table mid ms-1' style={{borderTop : '2px solid black'}}>
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

	useEffect(() => {
		userSignGet()
	}, [])
	// certificate
	return (
		<Fragment>
			<Row className='card_table top ms-1 mt-1'>
				{title()}
			</Row>
			{img()}
		</Fragment>
	)
}
export default Sign