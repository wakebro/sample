/* eslint-disable */
import { Fragment, useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Card, CardBody, CardFooter, CardHeader, Col, Label, Row } from "reactstrap"
import { useAxiosIntercepter } from '../../../../../../../utility/hooks/useAxiosInterceptor'
import { API_CRITICAL_DISASTER_BOARD_DETAIL } from '../../../../../../../constants'
import { CustomBadge } from "../../Component"
import { FooterLineDetail } from "../EvaluationDetail"
import { getTableDataCallback } from '../../../../../../../utility/Utils'
import * as moment from 'moment'

const CategoryReportDetail = () => {
    useAxiosIntercepter()
    const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const loginAuth = useSelector((state) => state.loginAuth)
    const pageType = criticalDisaster.pageType
    const reportId = criticalDisaster.reportId
	// const isManager = cookies.get('isManager') === 'true'
    const [isManager, setIsManager] = useState(false)
    const [data, setData] = useState([])
    const [completedPage, setCompletedPage] = useState(false)

    // button auth
	const [isSign, setIsSign] = useState(false) // 결재 버튼을 보여줄건지

    const setDetailData = (data) => {
        // console.log(data)
        const tempData = { ...data }
        tempData.start_datetime = tempData.start_datetime ? moment(tempData.start_datetime).format('YYYY-MM-DD HH:mm') : ''
        tempData.end_datetime = tempData.end_datetime ? moment(tempData.end_datetime).format('YYYY-MM-DD HH:mm') : ''
        setCompletedPage(data.is_completed)
        setData(tempData)
    }
    useEffect(() => {
        setIsManager(loginAuth.isManager)
        if (pageType === 'detail' && reportId !== ''){
            getTableDataCallback(`${API_CRITICAL_DISASTER_BOARD_DETAIL}/${reportId}`, {}, setDetailData)
        }
    }, [])

    return (
        <Fragment>
            {data &&
            <Card>
                <CardHeader>
                    <Row className='w-100'>
                        <Col md={9} xs={9}>
                            <Label className="risk-report title-bold d-flex align-items-center">
                                {data.title}&nbsp;
                                { 
                                    completedPage ? 
                                    isManager && 
                                    <CustomBadge color='light-success'>작성완료</CustomBadge>
                                    :
                                    isManager && 
                                    <CustomBadge color='light-danger'>작성중</CustomBadge>
                                }
                            </Label>
                        </Col>
                    </Row>
				</CardHeader>

                <CardBody>
                    <Row className='mb-2 card_table mid'>
                        <Col lg='6' md='6' xs='12'>
                            <Row className='border-top'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center risk-report text-normal' style={{minHeight:'3rem'}}>
                                    시행 일시
                                </Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text center risk-report text-normal'>
                                    {data.start_datetime} ~ {data.end_datetime}
                                </Col>
                            </Row>
                        </Col>
                        <Col lg='6' md='6' xs='12'>
                            <Row className='border-top' style={{height:'100%'}}>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center risk-report text-normal' style={{minHeight:'3rem'}}>
                                    평가자
                                </Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text center risk-report text-normal'>
                                    {data.evaluator}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col>
                            <Label className='risk-report text-lg-bold'>
                                평가 결과
                            </Label>
                            <Row className='card_table mx-0'>
                                <Col className='border-all risk-report content-h px-2 py-2' style={{overflowX: 'scroll'}} dangerouslySetInnerHTML={{__html:data.content}}></Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col>
                            <Label className='risk-report text-lg-bold'>
                                기타 특이사항
                            </Label>
                            <Row className='card_table mx-0'>
                                <Col className='border-all risk-report content-h px-2 py-2'>
                                    <div className='risk-report text-normal'>
                                        {data.description}
                                        {/* {data.description.split('\n').map((line, idx)=> ( //split 하는 문자열 자체는 나중에 db에 저장되는 형태 체크하시고 변경해야해요.
                                            <span key={idx}>
                                                {line}
                                                <br/>
                                            </span>
                                        ))} */}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                    <FooterLineDetail
                        isSign={isSign}
                        setIsSign={setIsSign}
                        isChargeSign={false}
                        isReject={true}
                    />
                </CardFooter>
            </Card>
            }
        </Fragment>
    )
}
export default CategoryReportDetail