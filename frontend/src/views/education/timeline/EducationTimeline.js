import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from 'react'
import { List } from 'react-feather'
import { API_EDUCATION_TIMELINE, API_EDUCATION_EMPLOYEE_LIST } from "../../../constants"
import { Row, Col, Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import LegalTimeline from './LegalTimeline'
import GeneralTimeline from './GeneralTimeline'
import SafetyTimeline from './SafetyTimeline'
import CooperatorTimeline from './CooperatorTimeline'
import * as moment from 'moment'
import { getTableData } from '../../../utility/Utils'

const EducationTimeline = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const [userData, setUserData] = useState([])
    const [cooperatorUserData, setCooperatorUserData] = useState([])
    const [legalData, setLegalData] = useState([])
    const [generalData, setGeneralData] = useState([])
    const [safetyData, setSafetyData] = useState([])
    const [cooperatorData, setCooperatorData] = useState([])
    const now = moment().subtract(0, 'days').format('YYYY-MM-DD 00:00:00')

    useEffect(() => {
        getTableData(API_EDUCATION_TIMELINE, {
            propertyId: cookies.get("property").value,
            type:'legal',
            today: now
        }, setLegalData)
        getTableData(API_EDUCATION_TIMELINE, {
            propertyId: cookies.get("property").value,
            type:'general',
            today: now
        }, setGeneralData)
        getTableData(API_EDUCATION_TIMELINE, {
            propertyId: cookies.get("property").value,
            type:'safety',
            today: now
        }, setSafetyData)
        getTableData(API_EDUCATION_TIMELINE, {
            propertyId: cookies.get("property").value,
            type:'cooperate',
            today: now
        }, setCooperatorData)

        getTableData(API_EDUCATION_EMPLOYEE_LIST, {
            propId: cookies.get("property").value
        }, setUserData)
        getTableData(API_EDUCATION_EMPLOYEE_LIST, {
            propId: cookies.get("property").value,
            companyType:'cooperate',
            cooperate: true
        }, setCooperatorUserData)
    }, [])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='교육일정현황' breadCrumbParent='교육관리' breadCrumbActive='교육일정현황' />
                </div>
            </Row>
            <Row className='match-height'>
                <Col lg='3' xs='12'>
                    <Card className='card-user-timeline'>
                        <CardHeader >
                            <div className='d-flex align-items-center'>
                                <List className='user-timeline-title-icon' />
                                <CardTitle tag='h4'>법정 교육 리스트</CardTitle>
                            </div>
                        </CardHeader>
                        <CardBody style={{paddingBottom: '7%'}}>
                            <LegalTimeline 
                                legalData={legalData}
                                userData = {userData}
                            />
                        </CardBody>
                    </Card>
                </Col>
                <Col lg='3' xs='12'>
                    <Card className='card-user-timeline'>
                        <CardHeader>
                            <div className='d-flex align-items-center'>
                                <List className='user-timeline-title-icon' />
                                <CardTitle tag='h4'>일반 교육 리스트</CardTitle>
                            </div>
                        </CardHeader>
                        <CardBody style={{paddingBottom: '7%'}}>
                            <GeneralTimeline 
                                generalData={generalData}
                                userData = {userData}
                            />
                        </CardBody>
                    </Card>
                </Col>
                <Col lg='3' xs='12'>
                    <Card className='card-user-timeline'>
                        <CardHeader>
                            <div className='d-flex align-items-center'>
                                <List className='user-timeline-title-icon' />
                                <CardTitle tag='h4'>안전 교육 리스트</CardTitle>
                            </div>
                        </CardHeader>
                        <CardBody style={{paddingBottom: '7%'}}>
                            <SafetyTimeline 
                                safetyData={safetyData}
                                userData = {userData}
                            />
                        </CardBody>
                    </Card>
                </Col>
                <Col lg='3' xs='12'>
                    <Card className='card-user-timeline'>
                        <CardHeader>
                            <div className='d-flex align-items-center'>
                                <List className='user-timeline-title-icon' />
                                <CardTitle tag='h4'>외주 교육 리스트</CardTitle>
                            </div>
                        </CardHeader>
                        <CardBody style={{paddingBottom: '7%'}}>
                            <CooperatorTimeline 
                                cooperatorData={cooperatorData}
                                userData = {cooperatorUserData}
                            />
                        </CardBody>
                    </Card>
                </Col>
                
            </Row>
        </Fragment>
    )

}
export default EducationTimeline