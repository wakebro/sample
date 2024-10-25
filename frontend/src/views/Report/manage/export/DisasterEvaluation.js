import Cookies from "universal-cookie"
import { useEffect, useState } from "react"
import { getTableData } from "../../../../utility/Utils"
import { Card, Row, Col, CardHeader, CardTitle } from "reactstrap"
import * as moment from 'moment'
import { sectionA, sectionB, sectionC, levelList } from '../../../disaster/corperationEvaluation/data'

import { API_CRITICAL_DISASTER_EVALUATION_QUESTION, API_CRITICAL_CORPERATION_EVALUATION_EXPORT} from '../../../../constants'

const DisasterEvaluationExport = () => {
    const cookies = new Cookies()
    const startDate = localStorage.getItem('start_date')
    const endDate = localStorage.getItem('end_date')
    const id = localStorage.getItem('disaster_evaluation_id')
    const [data, setData] = useState([])
    const [question, setQuestion] = useState([])

    const calculateScore = (array, section) => {
        let totalScore = 0
        Object.values(array).forEach((selector) => {
            if (selector.label in section) {
                totalScore += selector.score
            }
        })
        return totalScore
    }

    const calculateTotalLevel = (score) => {
        let totalScore = 'D'
        if (score >= 90) {
			totalScore = 'S'
		} else if (score >= 80) {
            totalScore = 'A'
		} else if (score >= 70) {
			totalScore = 'B'
		} else if (score >= 60) {
			totalScore = 'C'
		}
        return totalScore
    }

    const checkJudgement = (selectValue, calculateValue) => {
        let judgement = '부적격'
        const inputLevleIdx = levelList.indexOf(selectValue)
		const evaluationIdx = levelList.indexOf(calculateValue)
		if (inputLevleIdx >= 0 && evaluationIdx >= inputLevleIdx) {
			judgement = '적격'
		}
        return judgement
    }


    useEffect(() => {
        getTableData(API_CRITICAL_CORPERATION_EVALUATION_EXPORT, {id:id, start_date: startDate, end_date: endDate, propertyId: cookies.get('property').value}, setData)
        getTableData(API_CRITICAL_DISASTER_EVALUATION_QUESTION, {}, setQuestion)
    }, [])

    useEffect(() => {
        if (data.length > 0) setTimeout(() => window.print(), 250)
    }, [data])

    return (
        <div id="print page">
            { data && data.length > 0 && 
                <Card className="shadow-none px-0 print">
                    {data.map((evaluation, index) => {
                        const totalScore_A = calculateScore(evaluation.answer, sectionA)
                        const totalScore_B = calculateScore(evaluation.answer, sectionB)
                        const totalScore_C = calculateScore(evaluation.answer, sectionC)
                        const totalScore = totalScore_A + totalScore_B  + totalScore_C + evaluation.answer[11].score
                        const evaluatioinLevel = calculateTotalLevel(totalScore)
                        const judgement = checkJudgement(evaluation.work_level, evaluatioinLevel)
                        const lastIndex = data.length - 1
                        const subTitle =  Number(moment(evaluation.evaluation_date).format('MM')) <= 6 ? '상반기' : '하반기'
                        return (
                            <div key={`corperation${evaluation.id}`}> 
                                <CardHeader className="pt-0">
                                    <CardTitle>협력업체평가 {moment(evaluation.evaluation_date).format('YYYY')}년 {subTitle}</CardTitle>
                                </CardHeader>
                                <Row className='mx-0' style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'>
                                            <Col xs='4' className='card_table col col_color text center'>업체명</Col>
                                            <Col xs='8' className='card_table col text start'>{evaluation.corperation_name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'>
                                            <Col xs='4' className='card_table col col_color text center'>계약업무</Col>
                                            <Col xs='8' className='card_table col text start'>{evaluation.contract_work}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'>
                                            <Col xs='4' className='card_table col col_color text center'>평가일자</Col>
                                            <Col xs='8' className='card_table col text start '>
                                                {moment(evaluation.evaluation_date).format('YYYY-MM-DD')}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'></Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'>
                                            <Col xs='4' className='card_table col col_color text center'>작업등급</Col>
                                            <Col xs='8' className='card_table col text start '>{evaluation.work_level}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'>
                                            <Col xs='4' className='card_table col col_color text center '>실질지배여부</Col>
                                            <Col xs='8' className='card_table col text start '>
                                                {evaluation.control_state === true ? '대상' : '비대상'}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3', fontSize:'16px', minHeight:'55.99px'}}>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'>
                                            <Col xs='4' className='card_table col col_color text center'>평가점수</Col>
                                            <Col xs='8' className='card_table col text start '>{totalScore} 점</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'>
                                            <Col xs='4' className='card_table col col_color text center'>평가자</Col>
                                            <Col xs='8' className='card_table col text start'>{evaluation.user_name}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'>
                                            <Col xs='4' className='card_table col col_color text center '>평가등급</Col>
                                            <Col xs='8' className='card_table col text start'>{evaluatioinLevel}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'>
                                            <Col xs='4' className='card_table col col_color text center'>본부 / 부서</Col>
                                            <Col xs='8' className='card_table col text start' style={{paddingTop:'4px', paddingBottom:'4px'}}>
                                                {`${evaluation.haed_office} / ${evaluation.department}`}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderTop: '1px solid #B9B9C3', borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'>
                                            <Col xs='4' className='card_table col col_color text center'>적격여부</Col>
                                            <Col xs='8' className='card_table col text start '>{judgement}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='6' md='6'>
                                        <Row className='card_table table_row'>
                                            <Col xs='4' className='card_table col text col_color center'>직급 / 성명</Col>
                                            <Col xs='8' className='card_table col text' style={{paddingTop:'4px', paddingBottom:'4px'}}>
                                                <Col md='6' className='card_table col text start'>{evaluation.employee_level}</Col>
                                                <Col md='6' className='card_table col text end'>
                                                    <div>(서명)</div>
                                                    &nbsp;
                                                    &nbsp;
                                                    {
                                                        (evaluation.signature !== '' && evaluation.signature !== null) ?
                                                            <img src={`/static_backend/${evaluation.signature}`} style={{height:"2rem", width: '100%', objectFit:'contain'}}/>
                                                        :
                                                            <span>이미지 없음</span>
                                                    }
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* 평가 시작 */}
                                <Row className='mx-0 mt-3 risk-report text-bold' style={{borderTop: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text center '>평가항목 및 배점</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '> 평가내용 및 평가기준</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '>배점</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '>득점</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* A 구간 */}
                                <Row className='mx-0 risk-report text-bold' style={{borderLeft: '1px solid #B9B9C3', backgroundColor:'#f1f1f1'}}>
                                    <Col xs='8' md='8' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text'>A. 안전보건관리체계</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '>40</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '>{totalScore_A} 점</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[0].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[0].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '>{question && question.length > 0 && question[0].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[0].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[1].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[1].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[1].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[1].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[2].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[2].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[2].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[2].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* B 질문 */}
                                <Row className='mx-0 risk-report text-bold' style={{borderLeft: '1px solid #B9B9C3', backgroundColor:'#f1f1f1'}}>
                                    <Col xs='8' md='8' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text'>B. 실행수준</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '>20</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '>{totalScore_B} 점</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[3].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[3].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[3].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[3].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[4].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[4].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[4].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[4].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[5].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row' style={{whiteSpace:'pre-wrap'}}>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[5].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[5].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[5].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[6].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[6].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[6].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[6].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[7].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[7].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[7].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[7].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* <div className='page-break'></div> */}
                                {/* C 질문 */}
                                <Row className='mx-0 risk-report text-bold' style={{borderTop: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', backgroundColor:'#f1f1f1'}}>
                                    <Col xs='8' md='8' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text'>C. 운영관리</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '>20</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '>{totalScore_C} 점</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[8].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[8].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[8].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[8].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[9].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[9].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[9].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[9].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[10].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row' style={{whiteSpace:'pre-wrap'}}>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[10].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[10].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[10].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0 risk-report text-bold' style={{borderLeft: '1px solid #B9B9C3', backgroundColor:'#f1f1f1'}}>
                                    <Col xs='8' md='8' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text'>D. 재해발생 수준</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '>20</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center '>{evaluation.answer[11].score} 점</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderLeft: '1px solid #B9B9C3', fontSize:'16px'}}>
                                    <Col xs='3' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12'  className='card_table col text '>{question && question.length > 0 && question[11].name}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='5' md='5' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text '>{question && question.length > 0 && question[11].type}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center'>{question && question.length > 0 && question[11].rate}</Col>
                                        </Row>
                                    </Col>
                                    <Col xs='2' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Row className='card_table table_row'>
                                            <Col xs='12' className='card_table col text center px-0'>{evaluation.answer[11].score}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {  index !== lastIndex &&
                                    <div className='page-break'/>
                                }   
                            </div>
                        )

                    })}
                </Card>
            }
        </div>
    )
}

export default DisasterEvaluationExport