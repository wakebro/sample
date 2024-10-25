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

const CategoryNoticeDetail = () => {
    useAxiosIntercepter()
    const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const loginAuth = useSelector((state) => state.loginAuth)
    const pageType = criticalDisaster.pageType
    const noticeId = criticalDisaster.noticeId
	// const isManager = cookies.get('isManager') === 'true'
    const [isManager, setIsManager] = useState(false)
    const [data, setData] = useState([])
    const [completedPage, setCompletedPage] = useState(false)

    // button auth
	const [isSign, setIsSign] = useState(false) // 결재 버튼을 보여줄건지

    const setDetailData = (data) => {
        const tempData = { ...data }
        tempData.start_datetime = tempData.start_datetime ? moment(tempData.start_datetime).format('YYYY-MM-DD') : ''
        tempData.end_datetime = tempData.end_datetime ? moment(tempData.end_datetime).format('YYYY-MM-DD') : ''
        setCompletedPage(data.is_completed)
        setData(tempData)
    }

    useEffect(() => setIsManager(loginAuth.isManager), [])

    useEffect(() => {
        if (pageType === 'detail' && noticeId !== ''){
            getTableDataCallback(`${API_CRITICAL_DISASTER_BOARD_DETAIL}/${noticeId}`, {}, setDetailData)
        }
    }, [pageType])

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
                                    공고 기간
                                </Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text center risk-report text-normal'>
                                    {data.start_datetime} ~ {data.end_datetime}
                                </Col>
                            </Row>
                        </Col>
                        <Col lg='6' md='6' xs='12'>
                            <Row className='border-top'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center risk-report text-normal' style={{minHeight:'3rem'}}>
                                    공고장소
                                </Col>
                                <Col lg='8' md='8' xs='8' className='card_table col text center risk-report text-normal'>
                                    {data.location}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col>
                            <Label className='risk-report text-lg-bold'>
                                공고 내용
                            </Label>
                            <Row className='card_table mx-0'>
                                <Col className='border-all risk-report content-h px-2 py-2' style={{overflowX: 'scroll'}} dangerouslySetInnerHTML={{__html:data.content}}></Col>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter style={{display: 'flex', justifyContent: 'end', alignItems: 'end', borderTop: '1px solid #dae1e7'}}>
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
export default CategoryNoticeDetail