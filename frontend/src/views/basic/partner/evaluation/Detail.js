import { Fragment, useState, useEffect } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, Form, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_FIX, API_BASICINFO_PARTNER_EVALUATION_DETAIL, API_BASICINFO_PARTNER_DETAIL, ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION, API_BASICINFO_PARTNER_EVALUATION_REGISTER  } from "../../../../constants"
import Select from "react-select"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { ScoreList_1, ScoreList_2, Selector_1, Selector_2 } from "./Scores"
import {
    CalculateTotalScore
    // getTableData
    //  makeSelectList 
    } from "../../../../utility/Utils"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import axios from '../../../../utility/AxiosConfig'
import { useParams, Link, useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"

const Partner_Management_Evaluation_Detail = () => {
		useAxiosIntercepter()
        const params = useParams()
        const evaluation_id = params.id
        const cookies = new Cookies()
        const navigate = useNavigate()
        const user_id = cookies.get('userId')
		const [question, setQuestion] = useState()
        const [scores_1, setScores_1] = useState(Selector_1) // 1번 항목에 대한 점수들(질문 5개) 
        const [scores_2, setScores_2] = useState(Selector_2) // 2번 항목에 대한 점수들(질문 5개) 
        const [totalScore_1, setTotalScore_1] = useState(5) //1번 항목 점수 총합
        const [totalScore_2, setTotalScore_2] = useState(5) //2번 항목 점수 총합
        const totalScore = totalScore_1 + totalScore_2 
        const [grade, setGrade] = useState('F')
        const [judgement, setJudgemet] = useState('불량')
        const [solution, setSolution] = useState('계약해지')

        const handleScoreChange_1 = (selectorName, selectedOption) => {
            const newScore = {
              value: selectedOption.value,
              label: selectedOption.label
            }
          
            setScores_1((prevScores) => ({
              ...prevScores,
              [selectorName]: newScore
            }))
        }

        const handleScoreChange_2 = (selectorName, selectedOption) => {
            const newScore = {
              value: selectedOption.value,
              label: selectedOption.label
            }
          
            setScores_2((prevScores) => ({
              ...prevScores,
              [selectorName]: newScore
            }))
        }
       
        useEffect(() => {
            setTotalScore_1(CalculateTotalScore(scores_1))
        }, [scores_1])

        useEffect(() => {
            setTotalScore_2(CalculateTotalScore(scores_2))
        }, [scores_2])

        useEffect(() => {
            if (totalScore >= 90) {
                setGrade('A')
                setJudgemet('최우수')
                setSolution('신규 및 퇴출업체 사업장 발생시 우선 계약권 부여')
    
            } else if (totalScore >= 80) {
                setGrade('B')
                setJudgemet('우수')
                setSolution('계약 유지')
    
            } else if (totalScore >= 70) {
                setGrade('C')
                setJudgemet('보통')
                setSolution('보통 계약유지, 업체경고(주의촉구)')
    
            } else if (totalScore >= 60) {
                setGrade('D')
                setJudgemet('미흡')
                setSolution('최근 2년 이해 2회 경고시 계약해지')
    
            } else {
                setGrade('F')
                setJudgemet('불량')
                setSolution('계약해지')
            }
        }, [totalScore])

        useEffect(() => {
            axios.get(API_BASICINFO_PARTNER_EVALUATION_DETAIL, { params: {evaluation_id: evaluation_id, user_id: user_id } })
            .then(
                res => {
                    setScores_1(res.data.question_1_scores)
                    setScores_2(res.data.question_2_scores)
                    setQuestion(res.data)
                })
        }, [])    

	return (
		<Fragment>
			<>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='협력업체 평가' breadCrumbParent='기본정보' breadCrumbParent2='협력업체관리' breadCrumbActive='협력업체평가' />
					</div>
				</Row>
			<Card>
					<CardHeader>
						<CardTitle>
							협력업체 평가 디테일 집계표
						</CardTitle>
					</CardHeader>

			<CardBody style={{ paddingTop: 0}}>

                    <Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='4'  className='card_table col col_color text center '>
                                업체명
                                </Col>
                                <Col xs='8' className='card_table col text start '>
                                    {question && question.data.code}
                                </Col>
                            </Row>
                        </Col>
                        <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='4'  className='card_table col col_color text center '>대표자</Col>
                                <Col xs='8' className='card_table col text start '>
                                {question && question.data.ceo}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='4'  className='card_table col col_color text center '>업종</Col>
                                <Col xs='8' className='card_table col text start '>
                                {question && question.data.business_item}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='4'  className='card_table col col_color text center '>
                                평가기간
                                </Col>
                                <Col xs='8' className='card_table col text start '>
                                {question && question.evaluate_duration}

                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className="mb-3" style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='4' md='2'  className='card_table col col_color text center '>
                                작성일
                                </Col>
                                <Col xs='8' md='10' className='card_table col text start '>
                                    <Col xs='3'>
                                    {question && question.writing_date && question.writing_date.split('T')[0]}
                                    </Col>
                                    <Col xs='9'></Col>
                                  
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginLeft: 0, marginRight: 0}}>
                        <Col  xs='12' style={{borderBottom: '1px solid #B9B9C3', borderTop: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text start'>
                                {question && question.title_question[0]}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    
                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>평가항목 및 배점</Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '> 평가내용 및 평가기준</Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>점수</Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>
                                    {question && question.evaluation_category[0]}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '> 
                                    {question && question.evaluation_creteria[0]}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                <Select
                                    id='score_select'
                                    autosize={true}
                                    className='react-select'
                                    classNamePrefix='select'
                                    options={ScoreList_1}
                                    value={scores_1.selector1}
                                    onChange={(selectedOption) => handleScoreChange_1('selector1', selectedOption)}
                                    isDisabled={true} 
                                />
                                </Col> 
                            </Row>
                        </Col>
                    </Row>

                    
                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>
                                {question && question.evaluation_category[1]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                {question && question.evaluation_creteria[1]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                    <Select
                                        id='score_select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={ScoreList_1}
                                        value={scores_1.selector2}
                                        onChange={(selectedOption) => handleScoreChange_1('selector2', selectedOption)}
                                        isDisabled={true} 

                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    
                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>
                                {question && question.evaluation_category[2]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '> 
                                {question && question.evaluation_creteria[2]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                    <Select
                                        id='score_select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={ScoreList_1}
                                        value={scores_1.selector3}
                                        onChange={(selectedOption) => handleScoreChange_1('selector3', selectedOption)}
                                        isDisabled={true} 

                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    
                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>
                                {question && question.evaluation_category[3]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                {question && question.evaluation_creteria[3]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                    <Select
                                        id='score_select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={ScoreList_1}
                                        value={scores_1.selector4}
                                        onChange={(selectedOption) => handleScoreChange_1('selector4', selectedOption)}
                                        isDisabled={true} 

                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    
                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{ borderRight: '1px solid #B9B9C3', borderBottom: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>
                                {question && question.evaluation_category[4]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{ borderRight: '1px solid #B9B9C3', borderBottom: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '> 
                                {question && question.evaluation_creteria[4]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2'  style={{ borderRight: '1px solid #B9B9C3', borderBottom: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                    <Select
                                        id='score_select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={ScoreList_1}
                                        value={scores_1.selector5}
                                        onChange={(selectedOption) => handleScoreChange_1('selector5', selectedOption)}
                                        isDisabled={true} 

                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className="mb-2" style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3'}}>
                        
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '> 합계</Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '> {totalScore_1} 점</Col>
                            </Row>
                        </Col>
                    </Row>


                    {/* 두번째 표 */}
                    <Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3'}}>
                        <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text start'>
                                {question && question.title_question[1]}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    
                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>평가항목 및 배점</Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '> 평가내용 및 평가기준</Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>점수</Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>
                                {question && question.evaluation_category[5]}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                {question && question.evaluation_creteria[5]}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                    <Select
                                        id='score_select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={ScoreList_2}
                                        value={scores_2.selector1}
                                        onChange={(selectedOption) => handleScoreChange_2('selector1', selectedOption)}
                                        isDisabled={true} 

                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    
                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>
                                {question && question.evaluation_category[6]}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                {question && question.evaluation_creteria[6]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                    <Select
                                        id='score_select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={ScoreList_2}
                                        value={scores_2.selector2}
                                        onChange={(selectedOption) => handleScoreChange_2('selector2', selectedOption)}
                                        isDisabled={true} 

                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    
                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>
                                {question && question.evaluation_category[7]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                {question && question.evaluation_creteria[7]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                    <Select
                                        id='score_select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={ScoreList_2}
                                        value={scores_2.selector3}
                                        onChange={(selectedOption) => handleScoreChange_2('selector3', selectedOption)}
                                        isDisabled={true} 

                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    
                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>
                                {question && question.evaluation_category[8]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '> 
                                {question && question.evaluation_creteria[8]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                    <Select
                                        id='score_select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={ScoreList_2}
                                        value={scores_2.selector4}
                                        onChange={(selectedOption) => handleScoreChange_2('selector4', selectedOption)}
                                        isDisabled={true} 

                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    
                    <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12'  className='card_table col text center '>
                                {question && question.evaluation_category[9]}

                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                {question && question.evaluation_creteria[9]}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '>
                                    <Select
                                        id='score_select'
                                        autosize={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        options={ScoreList_2}
                                        value={scores_2.selector5}
                                        onChange={(selectedOption) => handleScoreChange_2('selector5', selectedOption)}
                                        isDisabled={true} 

                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className="mb-3" style={{marginLeft: 0, marginRight: 0, borderLeft: '1px solid #B9B9C3'}}>
                        <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3'}}>
                        
                        </Col>
                        <Col xs='6' md='7' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '> 합계</Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='2' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row className='card_table table_row'>
                                <Col xs='12' className='card_table col text center '> {totalScore_2} 점</Col>
                            </Row>
                        </Col>
                    </Row>
                    
                    {/* 세 번쨰 표 */}
                    <Row className="mb-3" style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', borderTop: '1px solid #B9B9C3'}}>
                        <Col xs='6' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row >
                                <Col md='12' className='card_table col text center ' style={{borderBottom: '1px solid #B9B9C3'}}> 총점</Col>
                            </Row>
                            <Row  >
                                <Col md='12' className='card_table col text center '> {totalScore_1 + totalScore_2} </Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row>
                                <Col md='12' className='card_table col text center ' style={{borderBottom: '1px solid #B9B9C3'}}> 등급</Col>
                            </Row>
                            <Row  >
                                <Col md='12' className='card_table col text center '>{grade}</Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='3' style={{borderBottom: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Row>
                                <Col md='12' className='card_table col text center ' style={{borderBottom: '1px solid #B9B9C3'}}> 판정</Col>
                            </Row>
                            <Row  >
                                <Col md='12' className='card_table col text center '> {judgement}</Col>
                            </Row>
                        </Col>
                        <Col xs='6' md='3' style={{borderBottom: '1px solid #B9B9C3'}}>
                            <Row>
                                <Col md='12' className='card_table col text center ' style={{borderBottom: '1px solid #B9B9C3'}}> 조치사항</Col>
                            </Row>
                            <Row  >
                                <Col md='12' className='card_table col text center '> {solution}</Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col xs='12'>
                            <div>평가자 의견</div>
                            <div>
                            <Input bsSize='sm' value={question && question.memo} disabled={true}  />
                            </div>
                        </Col>
                    </Row>

                    <Row style={{justifyContent: 'end'}}>
                        <Col xs='6' md='2'>
                            <div>평가자</div>
                            <Input bsSize='sm' value={question && question.evaluator} disabled={true}  />
                        </Col>
                        <Col xs='6' md='2'>
                            <div>자산관리1본부</div>
                            <Input bsSize='sm' value={question && question.evaluator_employee_class} disabled={true}  />
                        </Col>
                    </Row>

                    <Row>     
                        <Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%'}}>

                            <Button color='primary' style={{marginTop: '1%'}} 
                            onClick={() => navigate(`${ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_FIX}/${evaluation_id}`)}
                            >수정</Button>
                        </Col>
                    </Row>
			</CardBody>
			</Card>
			</>
	</Fragment>
	)
}


export default Partner_Management_Evaluation_Detail