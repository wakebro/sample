import { useAxiosIntercepter } from "@utility/hooks/useAxiosInterceptor"
import { Fragment, useEffect, useState } from "react"
import { API_EMPLOYEE_DETAIL } from '../../../../../../../../constants'
import { Col, Row } from "reactstrap"
import * as moment from 'moment'
//import axios from 'axios'


//const SingLine = (props) => {
const SingLine = () => {
    useAxiosIntercepter()
    //const {cookies} = props
    const tempTitle = ['담 당', '책임자']
    const [tempSign, setTempSign] = useState("")
    const completable = true

    const [signList, setSignList] = useState([0, 0])
    const [userSign] = useState([{url:`/static_backend/upload/sign_temp.jpeg`}, {url:`/static_backend/upload/sign_temp.jpeg`}])

    const signNameList = []
    //const [tempSignB, setTempSignB] = useState(true)

    const userSignGet = () => {
        // axios.get(API_EMPLOYEE_DETAIL, {
        //     params: {userId : cookies.get('userId')}
        // }).then(res => {
        //     if (res.status === 200) {
        //         if (res.data['signature'] !== null && res.data['signature'] !== "" && res.data['signature'] !== "None") {
        //             const url  = `/static_backend/upload/sign/${res.data['signature']}`
        //             setTempSign(url)
        //         }
        //     }
        // }).catch(res => {
        //     console.log(res, "!!!!!!!!error")
        // })
        const url  = `/static_backend/upload/sign_temp.jpeg`
        setTempSign(url)
    }

    const clickSign = (index) => {
        //임시 클릭이벤트
        const copySignType = [...signList]
        const copyUserSign = [...userSign]
        copySignType[index] = 1
        copyUserSign[index].url = tempSign
        setSignList(copySignType)
	}

    const title = () => {
        return (
            tempTitle.map((v, i) => {
                return (
                    <Col key={v + i} xs='6'>
                        <Row className='card_table table_row'>
                            <Col className='card_table col text center border-left'>
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
                return (
                    <div>
                        <Row style={{height: '80px'}} />
                        <Row>
                            <span style={{display:'flex', aligItems:'center', justifyContent:'center', color:'#ACACAC'}}>{signNameList[index]}</span>
                        </Row>
                    </div>
                )
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
            } else if (signList[index] === 3) {
                return (
                    <div />
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
			} else if (signList[index] === 3) {
				return <div style={{fontSize :'10px'}}>미지정</div>
			} else {
				return <br/>
			}
		}
        return (
            <Fragment>
				<Row className='card_table mid'  style={{height : '100px'}}>
					{tempTitle.map((v, i) => {
							return (
								<Col key={v + i} xs='6' >
									<Row className='card_table table_row' >
										<Col 
                                            className='card_table col text center ' 
                                            style={
                                                completable ? 
                                                {borderLeft: '1px solid #B9B9C3', padding:0} 
                                                : 
                                                {borderLeft: '1px solid #B9B9C3', cursor :'pointer', padding:0
                                            }}
                                            onClick={() => clickSign(i)}
                                        >
											{signCheck(i)}
										</Col>
									</Row>
								</Col>
							)
						})
					}
				</Row>
				<Row className='card_table mid' style={{borderTop : '2px solid black'}}>
					{tempTitle.map((v, i) => {
							return (
								<Col key={v + i} xs='6' >
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
        console.log(tempSign)
    }, [])

    return (
        <Fragment>
            <Row className="ps-1">
                <Col md={1} xs={1} className="card_table col_input border-left border-y px-0" style={{textAlign:'center', justifyContent:'center'}}>
                    결재
                </Col>
                <Col md={11} xs={11} className="ps-0">
                    <Row className='card_table top'>
                        {title()}
                    </Row>
                        {img()}
                </Col>
            </Row>
        </Fragment>
    )
}
export default SingLine