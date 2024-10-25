/* eslint-disable */
import { useAxiosIntercepter } from '../../../../../../utility/hooks/useAxiosInterceptor'
import { Fragment } from 'react'
import { Row, Col } from 'reactstrap'
import * as moment from 'moment'
import { signAuthCheck } from '@utils'
import { checkApp, sweetAlert } from '../../../../../../utility/Utils'
import { preSignResult } from '../data'
import _ from 'lodash'



const ModalSign = (props) => {
	useAxiosIntercepter()
    const { activeUser, criticalDisasterRedux, type, userSign, setUserSign, isCompleted, position = 'center' } = props
	const signTabType = criticalDisasterRedux.modalName !== '작업자 서명'
    // const temp = signTabType ? ['담당자', '영업소장'] : [...userSign.map((_,i) => `작업자${i+1}`)]
    const temp = signTabType ? ['담당자', '책임자'] : ['작업자1', '작업자2', '작업자3', '작업자4', '작업자5', '작업자6']
    const signNameList = userSign && [...userSign.map(user => user.name)] 
	const signWidth = signTabType ? 6 : 2

	const clickSign = (index) => {
		if (type !== 'detail' || !isCompleted) return
		const nowDate = moment()
		const copyUserSign =  _.cloneDeep(userSign) // userobject array
		// console.log('?????들어오나요?1')

		if (!signAuthCheck(activeUser, copyUserSign)) return
		// console.log('?????들어오나요?2')

		// 해당 index 값이 결재 진행되어있는 상태면 리턴
		if (userSign[index].is_other_final === true) return
		// console.log('?????들어오나요?3')

		if (signTabType) {
			const preUserSignResult = preSignResult(index, copyUserSign)
			if (index !== 0 && !preUserSignResult.result) {
				if (activeUser === userSign[index].user) {
					sweetAlert('결재 불가', `${temp[index-1]} 결재가 진행 되지 않았습니다.`, 'warning')
				}
				return
			}
		}
		// console.log('?????들어오나요?4')
		if (activeUser === copyUserSign[index].user){
			if (!copyUserSign[index].is_final) {
				copyUserSign[index].is_final = true
				copyUserSign[index].completabled_datetime = nowDate
				setUserSign(copyUserSign)
				return
			}
			copyUserSign[index].is_final = false
		}
		setUserSign(copyUserSign)
	}

    const title = () => {
		return (
			temp.map((v, i) => {
				return (
					<Col key={`title${v + i}`} lg={signWidth} md={signWidth} xs={signWidth} className='card_table top' style={{minHeight:'2.5rem', maxWidth: '130px'}}>
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
			// if (type !== 'export' && typeof userSign[index] === 'object' && userSign[index].hasOwnProperty('is_final') && userSign[index]['is_final'] === true) {
			if (typeof userSign[index] === 'object' && userSign[index].hasOwnProperty('is_final') && userSign[index]['is_final'] === true && userSign[index]['is_other_final'] === true) {
			// if (userSign[index]['is_final'] === true) {
                return (
                    <div>
                        {
                            (userSign[index]['signature'] && userSign[index]['signature'] !== "") ? <img src={`/static_backend/${userSign[index]['signature']}`} style={{height:"80px", width: '100%', objectFit:'contain'}}></img>
                            :
                            <div style={{height:"80px", width: '100%', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                                <span>이미지 없음</span>
                            </div>
                        }
                        <span style={{display:'flex', aligItems:'center', justifyContent:'center'}}>{signNameList[index]}</span>
                    </div>
                )
            } else if (typeof userSign[index] === 'object' && userSign[index].hasOwnProperty('is_final') && userSign[index]['is_final'] === true && userSign[index]['is_other_final'] === false) {
				// 대각선
				return (
					<div className='sign-border'/>
				)
			} else {
                return (
					<div>
						<Row style={{height: '80px'}}/>
						<Row>
							<span style={{display:'flex', aligItems:'center', justifyContent:'center', color:'#ACACAC'}}>{signNameList[index]}</span>
						</Row>
					</div>
                )
            }
		}
		['', '']
		const dateCheck = (index) => {
			if (type !== 'export' && typeof userSign[index] === 'object' && userSign[index].hasOwnProperty('is_final') && userSign[index]['is_final'] === true && userSign[index]['is_other_final'] === true) {
			// if (userSign[index]['is_final'] === true) {
				return <div style={{ fontSize: '14px' }}>
                            {moment(userSign[index]['completabled_datetime']).format('YY-MM-DD HH:mm')}
			  			</div>
			} else if (userSign[index] === undefined || userSign[index] === '') {
				return <div style={{fontSize :'10px'}}>미지정</div>
			} else {
				return <br/>
			}
		}
		return (
			<Fragment>
				<Row className={`px-0 d-flex justify-content-${position}`} style={{height : '110px'}}>
					{ temp.map((v, i) => {
							return (
								<Col key={`img${v + i}`} lg={signWidth} md={signWidth} xs={signWidth} className='card_table mid' style={{maxWidth: '130px'}}>
									<Row className='card_table table_row' >
                                        <Col className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3', cursor :'pointer', padding:0}} onClick={() => clickSign(i)}>
											{signCheck(i)}
										</Col>
									</Row>
								</Col>
							)
						})
					}
				</Row>
				<Row className={`px-0 d-flex justify-content-${position}`}>
					{ temp.map((v, i) => {
							return (
								<Col key={`date${v + i}`} lg={signWidth} md={signWidth} xs={signWidth} className='card_table mid' style={{minHeight:'1.8rem', borderTop : '2px solid black', maxWidth: '130px'}} >
									<Row className='card_table table_row'>
										<Col className='card_table col text center px-0' style={{borderLeft: '1px solid #B9B9C3'}}>
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

	if(checkApp) {
		const signCheck = (index) => {
			const tempNameStr = signNameList[index]
			let nameList = ''
			if (typeof tempNameStr == 'string') {
				nameList = tempNameStr.split('(')
			}
			if (type !== 'export' && typeof userSign[index] === 'object' && userSign[index].hasOwnProperty('is_final') && userSign[index]['is_final'] === true && userSign[index]['is_other_final'] === true) {
			// if (userSign[index]['is_final'] === true) {
                return (
                    <div>
                        {
                            (userSign[index]['url'] && userSign[index]['url'] !== "") ? <img src={`/static_backend/${userSign[index]['signature']}`} style={{height:"80px", width: '100%', objectFit:'contain'}}></img>
                            :
                            <div style={{height:"80px", width: '100%', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                                <span>이미지 없음</span>
                            </div>
                        }
                        <span style={{display:'flex', aligItems:'center', justifyContent:'center'}}>{nameList[0]}<br/>{nameList[1] && '('}{nameList[1]}</span>
                    </div>
                )
            } else if (type !== 'export' && typeof userSign[index] === 'object' && userSign[index].hasOwnProperty('is_final') && userSign[index]['is_final'] === true && userSign[index]['is_other_final'] === false) {
				// 대각선
				return (
					<div className='m-sign-border'/>
				)
			} else {
                return (
					<div>
						<Row style={{height: '80px'}}/>
						<Row>
							<span style={{display:'flex', aligItems:'center', justifyContent:'center', color:'#ACACAC'}}>{nameList[0]}<br/>{nameList[1] && '('}{nameList[1]}</span>
						</Row>
					</div>
                )
            }
		}
		const dateCheck = (index) => {
            if (userSign[index] === undefined) return <div style={{fontSize :'10px'}}>미지정</div>
			if (type !== 'export' && userSign[index].hasOwnProperty('is_final') && userSign[index]['is_final'] === true && userSign[index]['is_other_final'] === true) {
			// if (userSign[index]['is_final'] === true) {
				return <div style={{ fontSize: '14px' }}>
                            {moment(userSign[index]['completabled_datetime']).format('YY-MM-DD HH:mm')}
			  			</div>
			} else if (userSign[index] === '') {
				return <div style={{fontSize :'10px'}}>미지정</div>
			} else {
				return <br/>
			}
		}
		return (
			<Row className={`mt-1 px-0 d-flex justify-content-${position}`}>
				{ temp.map((v, i) => {
						return (
							<Col key={`index_${i}`} xs={6}>
								<Row>
									<Col className='border-left card_table top text center sign-app title'>
										{v}
									</Col>
								</Row>
								<Row>
									<Col className='border-left card_table mid text center sign-app image'>
										{signCheck(i)}
									</Col>
								</Row>
								<Row>
									<Col className='border-bold border-left card_table mid text center sign-app date'>
										{dateCheck(i)}
									</Col>
								</Row>
							</Col>
						)
					})
				}
			</Row>
		)
	}

    return (
		<Fragment>
			{ (userSign && userSign.length > 0) ?
				<>
					<Row className={`mt-1 px-0 d-flex justify-content-${position}`}>
						{ title() }
					</Row>
						{ img()}
				</>
				:
				<>
					
				</>
			}
		</Fragment>
	)

}
export default ModalSign