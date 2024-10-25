import { CardHeader, Row, Col, Label, CardBody, Table } from "reactstrap"
import { FREQUENCY_3X3, FREQUENCY_5X5, getStrGrade, getMultiResult, STEP_3, CHECKLIST } from "../../../../disaster/riskReport/evaluationReport/web/data"
import { getObjectKeyCheck } from "../../../../../utility/Utils"
import { Circle } from "react-feather"

const EvaluationForm = (props) => {
    const { data, type, lastPage, index, lastIndex } = props

    const EvaluationInfo = (props) => {
        const { data } = props
        return (
            <CardBody>
                <Label className='risk-report text-lg-bold'>평가 정보</Label>
                <Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                    <Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4' className='card_table col col_color text center'>현장명</Col>
                            <Col xs='8' className='card_table col text start'>
                                <div>{data.scene}</div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4' className='card_table col col_color text center'>작업명(평가대상)</Col>
                            <Col xs='8' className='card_table col text start'>
                                <div>{data.target}</div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4' className='card_table col col_color text center'>평가일자</Col>
                            <Col xs='8' className='card_table col text start'>
                                <div>{data.date}</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
    
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center'>평가자<br/>(관리자)</Col>
                            <Col xs='8' className='card_table col text start'>
                                <Row style={{width:'100%'}}>
                                    <Col xs='12'>
                                        <div>{data.manager_name}</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col md='4' sm='12' xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center'>부서</Col>
                            <Col xs='8' className='card_table col text start'>
                                <div>{data.department}</div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md='4' sm='12' xs='12' className="disaster-info" />
                </Row>
            </CardBody>
        )
    }

    const EvaluationContentHead = (props) => {
        const {type} = props
        const Header = ({type}) => {
            if (type === FREQUENCY_3X3 || type === FREQUENCY_5X5) {
                return (
                    <thead className="export-table" style={{fontSize: '12px'}}>
                        <tr>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1em', paddingLeft:'1em'}}>세부작업명</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1em', paddingLeft:'1em'}}>위험분류</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1em', paddingLeft:'1em'}}>위험발생 상황 및 결과</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px'}}>
                                <div>현재의</div>
                                <div>안전보건 조치</div>
                            </th>
                            <th className="label" colSpan="3" style={{verticalAlign:'middle', width:'3%'}}>현재 위험성</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1em', paddingLeft:'1em'}}>
                                <div>관련근거</div>
                                <div>(선택 사항)</div>
                            </th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'2em', paddingLeft:'2em', width:'50%'}}>위험성 감소대책</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1em', paddingLeft:'1em', width:'3%'}}>
                                <div>개선후</div>
                                <div>위험성</div>
                            </th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1em', paddingLeft:'1em', width:'4%'}}>
                                <div>개선</div>
                                <div>예정일</div>
                            </th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1em', paddingLeft:'1em', width:'4%'}}>
                                <div>개선</div>
                                <div>완료일</div>
                            </th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1em', paddingLeft:'1em', width:'4%'}}>담당자</th>
                        </tr>
                        <tr>
                            <th className="label" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px', borderBottom:'1px solid #B9B9C3', width:'3%'}}>
                                <div>가능성</div>
                                <div>(빈도)</div>
                            </th>
                            <th className="label" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px', borderBottom:'1px solid #B9B9C3', width:'3%'}}>
                                <div>중대성</div>
                                <div>(강도)</div>
                            </th>
                            <th className="label" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px', borderBottom:'1px solid #B9B9C3', width:'3%'}}>위험성</th>
                        </tr>
                    </thead>
                )
            } else if (type === STEP_3) {
                return (
                    <thead className="export-table">
                        <tr>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px'}}>번호</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1em', paddingLeft:'1em'}}>
                                <div>유해 위험요인파악</div>
                                <div>(위험한 상황과 결과)</div>
                            </th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'2em', paddingLeft:'2em', width:'1%'}}>현재의 안전보건 조치</th>
                            <th className="label" colSpan="3" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px'}}>위험성의 수준</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1em', paddingLeft:'1em', width:'1%'}}>
                                <div>관련근거</div>
                                <div>(선택 사항)</div>
                            </th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'8em', paddingLeft:'8em'}}>개선대책</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px'}}>
                                <div>개선</div>
                                <div>예정일</div>
                            </th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px'}}>
                                <div>개선</div>
                                <div>완료일</div>
                            </th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px'}}>담당자</th>
                        </tr>
                        <tr>
                            <th className="label" style={{verticalAlign:'middle', paddingRight:'1px', paddingLeft:'1px'}}>상</th>
                            <th className="label" style={{verticalAlign:'middle', paddingRight:'1px', paddingLeft:'1px'}}>중</th>
                            <th className="label" style={{verticalAlign:'middle', paddingRight:'1px', paddingLeft:'1px'}}>하</th>
                        </tr>
                    </thead>
                )
            } else if (type === CHECKLIST) {
                return (
                    <thead className="export-table">
                        <tr>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px'}}>번호</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1rem', paddingLeft:'1rem'}}>유해 위험요인파악(위험한 상황과 결과)</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px'}}>현재의 안전보건 조치</th>
                            <th className="label" colSpan="3" style={{verticalAlign:'middle'}}>위험성 확인결과</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'1em', paddingLeft:'1em', width:'1%'}}>
                                <div>관련근거</div>
                                <div>(선택 사항)</div>
                            </th>                            
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'10em', paddingLeft:'10em', width:'40%'}}>개선대책</th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px'}}>
                                <div>개선</div>
                                <div>예정일</div>
                            </th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px'}}>
                                <div>개선</div>
                                <div>완료일</div>
                            </th>
                            <th className="label" rowSpan="2" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px'}}>담당자</th>
                        </tr>
                        <tr>
                            <th className="label" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px', width:'3%'}}>적정</th>
                            <th className="label" style={{verticalAlign:'middle', paddingRight:'7px', paddingLeft:'7px', width:'3%'}}>보완</th>
                            <th className="label" style={{verticalAlign:'middle', paddingRight:'2px', paddingLeft:'2px'}}>해당없음</th>
                        </tr>
                    </thead>
                )
    
            }
        }
    
        return (
            <Header type={type !== undefined ? type : 0}/>
        )
    }

    const EvaluationContentBody = (props) => {
        const { body, type } = props
        console.log("type", type)
	return (
		<>
			{ (Number(type) === FREQUENCY_3X3 || Number(type) === FREQUENCY_5X5) ?
				<tbody>
				{
					body && Array.isArray(body) && body.map((row, idx) => {
						return (
							<tr key={idx}>
								<td style={{height:'50px', padding:'1em', textAlign:'center'}}>{row.inputDetail}</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.selectDanger.label}</td>
								<td style={{padding:'1em'}}>{row.inputResult}</td>
								<td style={{padding:'1em'}}>{row.nowAction}</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.frequency.value}</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.strength.value}</td>
								<td style={{padding:'1em', textAlign:'center'}}>
									{
										!Number.isNaN(parseInt(row.frequency.value) * parseInt(row.strength.value)) 
										&& parseInt(row.frequency.value) * parseInt(row.strength.value)
									}
									{
										!Number.isNaN(parseInt(row.frequency.value) * parseInt(row.strength.value)) 
										&& getStrGrade(type, getMultiResult(type, parseInt(row.frequency.value) * parseInt(row.strength.value)))
									}
								</td>
								<td style={{padding:'1em'}}>{row.inputReason}</td>
								<td style={{padding:'1em'}}>{row.counterplan}</td>
								<td style={{padding:'1em', textAlign:'center'}}>
									{(row.dangerousness !== undefined && row.dangerousness !== '') ? 
										getStrGrade(type, getMultiResult(type, row.dangerousness.value))
										:
										<></>
									}
								</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.schedule ? row.schedule : ''}</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.complete ? row.complete : ''}</td>
								<td style={{padding:'1em', textAlign:'center'}}>{row.manager !== null ? row.manager.label : ''}</td>
							</tr>
						)
					})
				}
				</tbody>
				:
				(Number(type) === STEP_3 || Number(type) === CHECKLIST) &&
				<tbody>
					{
						body && Array.isArray(body) && body.map((row, idx) => {
							// console.log(row)
							return (
								<tr key={idx}>
									<td style={{height:'50px', padding:'1em', textAlign:'center'}}>{idx + 1}</td>
									<td style={{padding:'1em', textAlign:'center'}}>{row.inputResult}</td>
									<td style={{padding:'1em'}}>{row.nowAction}</td>
									{
										type === STEP_3 ? 
											<>
												<td style={{padding:'1em', textAlign:'center', width:`${row.frequency.value === 3 ? '1rem' : '2rem'}`}}>{row.frequency.value === 3 ? <Circle /> : ''}</td>
												<td style={{padding:'1em', textAlign:'center', width:`${row.frequency.value === 2 ? '1rem' : '2rem'}`}}>{row.frequency.value === 2 ? <Circle /> : ''}</td>
												<td style={{padding:'1em', textAlign:'center', width:`${row.frequency.value === 1 ? '1rem' : '3rem'}`}}>{row.frequency.value === 1 ? <Circle /> : ''}</td>
											</>
										:
											<>
												<td style={{padding:'1em', textAlign:'center'}}>{row.frequency.value === 1 ? <Circle /> : ''}</td>
												<td style={{padding:'1em', textAlign:'center'}}>{row.frequency.value === 2 ? <Circle /> : ''}</td>
												<td style={{padding:'1em', textAlign:'center'}}>{row.frequency.value === 0 ? <Circle /> : ''}</td>
											</>
									}
									<td style={{padding:'1em'}}>{row.inputReason}</td>
									<td style={{padding:'1em'}}>{row.counterplan}</td>
									<td style={{padding:'1em', textAlign:'center'}}>{row.schedule ? row.schedule : ''}</td>
									<td style={{padding:'1em', textAlign:'center'}}>{row.complete ? row.complete : ''}</td>
									<td style={{padding:'1em', textAlign:'center'}}>{row.manager !== null ? row.manager.label : ''}</td>
								</tr>
							)
						})
					}
				</tbody>
				
			}
            { type === null && 
                <tbody>
                    <tr style={{border:'none'}}>
                        <td className='px-0' style={{border:'none'}}>
                            <Row className='mx-0'>
                                <Col className='py-3 border-left card_table text center risk-report text-bold border-all'>
                                    평가 내용 미등록
                                </Col>
                            </Row>
                        </td>
                    </tr>
                </tbody>
            }
		</>
        )
    }

    console.log("data", data)
    return (
        data && 
        <>
            <CardHeader>
                <Row className='w-100'>
                    <Col md={9} xs={9}>
                        <Label className="risk-report title-bold d-flex align-items-center">
                            {data.info.evaluation_title}
                        </Label>
                    </Col>
                </Row>
            </CardHeader>
            <EvaluationInfo 
                data={data.info}
                workerData={data.worker_list}
            />
            <br/>
            <br/>
            <CardBody>
                <Col style={{display:'flex', alignItems:'end'}}>
                    <Label className='risk-report text-lg-bold'>평가 내용</Label>
                </Col>
                <Table responsive className="electric-table" style={{marginTop:'0px', fontSize:'12px'}}>
                    <EvaluationContentHead
                        type={data.info.form_type}
                    />
                    <EvaluationContentBody body={data.contents} type={data.info.form_type}/>
                </Table>
            </CardBody>
            < div className = 'page-break' /> 
            <CardBody>
                <Row className = 'mb-2'> 
                    <Col className="mx-0">
                        <Row>
                            <Col>
                                <Label className='risk-report text-lg-bold'>작업자 명단</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6} xs={12} className="pe-1" style={{ paddingTop: '5px' }}>
                                <Row className="card_table mx-0" style={{ borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3' }}>
                                    <Col lg='2' md='2' xs='3' className='card_table col col_color text center border-b risk-report text-normal' style={{ backgroundColor: 'report' }}>번호</Col>
                                    <Col lg='3' md='3' xs='3' className='card_table col text center col_b risk-report text-normal'>직책</Col>
                                    <Col lg='4' md='4' xs='3' className='card_table col col_color text center border-b risk-report text-normal'>서명</Col>
                                    <Col lg='3' md='3' xs='3' className='card_table col text center col_b risk-report text-normal'>사인</Col>
                                </Row>
                                { data && 
                                    (data.worker_list).map((user, index) => {
                                        if (index <= Math.floor((data.worker_list).length / 2)) {
                                            return (
                                                <Row className="card_table mx-0" key={`partner${user.name}_${user.id}`} style={{ borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3' }}>
                                                    <Col lg='2' md='2' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>{index + 1}</Col>
                                                    <Col lg='3' md='3' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>{user.position}</Col>
                                                    <Col lg='4' md='4' xs='3' className='card_table col text center border-b border-left risk-report text-normal' style={{ wordBreak: 'break-all' }}>{user.name}</Col>
                                                    <Col lg='3' md='3' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>
                                                        { getObjectKeyCheck(user, 'is_final') !== false
                                                            ? getObjectKeyCheck(user, 'is_attend') !== false
                                                                ? user.signature 
                                                                    ? <img src={`/static_backend/${user.signature}`} alt="User Signature" style={{width:'100%', height:'33px', objectFit:'scale-down'}}/>
                                                                    : <>{'참석'}</>
                                                                : <> {'불참석'}</>
                                                            : <></>
                                                        }
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                    })
                                }
                            </Col>
                            <Col md={6} xs={12} className="pe-1" style={{ paddingTop: '5px' }}>
                                <Row className="card_table mx-0" style={{ borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3' }}>
                                    <Col lg='2' md='2' xs='3' className='card_table col col_color text center border-b risk-report text-normal' style={{ backgroundColor: 'report' }}>번호</Col>
                                    <Col lg='3' md='3' xs='3' className='card_table col text center col_b risk-report text-normal'>직책</Col>
                                    <Col lg='4' md='4' xs='3' className='card_table col col_color text center border-b risk-report text-normal'>서명</Col>
                                    <Col lg='3' md='3' xs='3' className='card_table col text center col_b risk-report text-normal'>사인</Col>
                                </Row>
                                { data && 
                                    (data.worker_list).map((user, index) => {
                                        if (index > Math.floor((data.worker_list).length / 2)) {
                                            return (
                                                <Row className="card_table mx-0" key={`partner2${user.name}_${user.id}`} style={{ borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3' }}>
                                                    <Col lg='2' md='2' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>{index + 1}</Col>
                                                    <Col lg='3' md='3' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>{user.position}</Col>
                                                    <Col lg='4' md='4' xs='3' className='card_table col text center border-b border-left risk-report text-normal' style={{ wordBreak: 'break-all' }}>{user.name}</Col>
                                                    <Col lg='3' md='3' xs='3' className='card_table col text center border-b border-left risk-report text-normal'>
                                                        { getObjectKeyCheck(user, 'is_final') !== false
                                                            ? getObjectKeyCheck(user, 'is_attend') !== false
                                                                ? user.signature
                                                                    ? <img src={`/static_backend/${user.signature}`} alt="User Signature" style={{width:'100%', height:'33px', objectFit:'scale-down'}}/> 
                                                                    : <> {'참석'}</>
                                                                : <> {'불참석'}</>
                                                            : <></>
                                                        }
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                    })
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </CardBody>
            { lastPage !== '' && lastPage !== type && 
                < div className = 'page-break' /> 
            }        
            { lastPage === type && index !== lastIndex &&
                <div className='page-break'/>
            }
        </>
    )
}

export default EvaluationForm