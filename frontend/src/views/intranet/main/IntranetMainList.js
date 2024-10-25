import Breadcrumbs from '@components/breadcrumbs'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import {
    API_DASHBOARD_ANNOUNCE_LATEST,
    API_DOC_MAILBOX,
    API_EMPLOYEE_DETAIL,
    API_INTRANET_NOTIFICATION,
    ROUTE_BASICINFO_EMPLOYEE_REGISTER,
    ROUTE_INTRANET_ANNOUNCEMENT_DETAIL,
    ROUTE_INTRANET_DETAIL,
    ROUTE_INTRANET_NOTIFICATION
} from "../../../constants"
import { INTRANET_MAIN } from '../../../constants/CodeList'
import { checkOnlyView, getObjectKeyCheck, getTableData, pickerDateChange } from '../../../utility/Utils'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import IntranetMainCustomDataTable from '../main//IntranetMainCustomTable'
import { AnnouncementColumn, MailColumn, NoticeColumn } from '../main/IntranetMainData'

const IntranetMainList = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const loginAuth = useSelector((state) => state.loginAuth)
    const [announcementData, setAnnouncementData] = useState([])
    const [mailData, setMailData] = useState([])
    const [userData, setUserData] = useState([])
    const [notificaionData, setNotificationData] = useState([])
    const [userCompany, setUserCompany] = useState([])
    const [userEmployeeLevel, setUserEmployeeLevel] = useState([])
    const [userDepartment, setUserDepartment] = useState([])
    const now = moment().subtract(0, 'days')
    const yesterday = moment().subtract(10, 'days')
    const property = cookies.get('property').label ? cookies.get('property').label : ''

    useEffect(() => {
        getTableData(API_EMPLOYEE_DETAIL, {userId:cookies.get('userId')}, (data) => {
            setUserData(data)
            setUserEmployeeLevel(data?.employee_level)
            setUserCompany(data?.company)
            setUserDepartment(data?.department)
        })
        getTableData(API_DASHBOARD_ANNOUNCE_LATEST, {property:cookies.get('property').value}, setAnnouncementData)
        getTableData(API_DOC_MAILBOX, { type: true, page: 1, userid: cookies.get('userId'), selectedTab: 'inbox'}, (data) => {
            const tempData = []
            const tempList = data?.tableData
            if (!Array.isArray(tempList)) return setMailData(tempData)
            for (const index in tempList) {
                if (index > 6) break
                tempData.push(tempList[index])
            }
            setMailData(tempData)
        })
        getTableData(API_INTRANET_NOTIFICATION, {userId: cookies.get('userId'), date: pickerDateChange([yesterday.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')]), type: '', search: ''}, (data) => {
            const tempData = []
            if (Array.isArray(data)) {
                for (const index in data) {
                    if (index > 6) break
                    tempData.push(data[index])
                }
                setNotificationData(tempData)
            }
        })
    }, [])

    return (
        <Fragment>
			<Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='인트라넷 메인' breadCrumbParent='인트라넷' breadCrumbActive='인트라넷 메인' />
                </div>
			</Row>
            <Row>
                <Col md={6}>
                    <Card style={{height:'100%'}}>
                        <CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                            <CardTitle className="title">
                                개인정보
                            </CardTitle>
                            <Row>
                                <Button color='primary' 
                                    hidden={checkOnlyView(loginAuth, INTRANET_MAIN, 'available_update')}
                                    style={{marginLeft: '-22%'}}
                                    tag={Link} 
                                    to={ROUTE_BASICINFO_EMPLOYEE_REGISTER} 
                                    state={userData}
                                    >수정</Button>
                            </Row>
                        </CardHeader>
                        <CardBody style={{padding:'1.5rem 0rem 1.5rem 0rem'}}>
                                <Row className='card_table mx-0'>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>이름</Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center border-xt'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            { getObjectKeyCheck(userData, 'name')}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>회사</Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center border-xt'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            { getObjectKeyCheck(userCompany, 'name') }
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mx-0'>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>직급</Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center border-xt'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            { getObjectKeyCheck(userEmployeeLevel, 'code') }
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>사업소</Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center border-xt'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            {property}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mx-0'>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>부서</Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center border-xt'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            { getObjectKeyCheck(userDepartment, 'name') }
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>전화번호</Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center border-xt'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            { getObjectKeyCheck(userData, 'phone') }
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mx-0 border-b'>
                                    <Col md='6' xs='12' >
                                        <Row className='card_table table_row' style={{height:'50%'}}>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_top col_left text center'>이메일</Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center border-xt'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            { getObjectKeyCheck(userData, 'email') }
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className='card_table table_row'  style={{height:'50%'}}>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_top col_left text center'>생일</Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center border-xt'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            { getObjectKeyCheck(userData, 'birthday') !== null && moment(getObjectKeyCheck(userData, 'birthday')).format('YYYY-MM-DD') }
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row' style={{borderTop:'0'}}>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_left col_top col_left text center'>사인</Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text center border-xt' style={{borderTop: 'None'}}>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            
                                                            { (getObjectKeyCheck(userData, 'signature') !== '' && getObjectKeyCheck(userData, 'signature') !== null) ?
                                                                <img style={{maxWidth:'180px', maxHeight:'60px'}} src={`/static_backend/${getObjectKeyCheck(userData, 'signature')}`}/>
                                                                :
                                                                <span>이미지 없음</span>
                                                            }
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} className='top'>
                    <Card style={{height:'100%'}}>
                        <CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                            <CardTitle className="title">
                                공지사항
                            </CardTitle>
                        </CardHeader>
                        <CardBody style={{padding:'1.5rem 0rem 1.5rem 0rem'}}>
                            <IntranetMainCustomDataTable
                                columns={AnnouncementColumn} 
                                tableData={announcementData} 
                                // setTabelData={setData} 
                                // setTableSelect={setTableSelect}
                                selectType={false}
                                dataType={'announcement'}
                                onRowClicked
                                detailAPI={ROUTE_INTRANET_ANNOUNCEMENT_DETAIL}
                                noDataComponent
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row style={{paddingTop:'2%'}}>
                <Col md={6}>
                    <Card style={{height:'100%'}}>
                        <CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                            <CardTitle className="title">
                                알림
                            </CardTitle>
                        </CardHeader>
                        <CardBody style={{padding:'1.5rem 0rem 1.5rem 0rem'}}>
                            <IntranetMainCustomDataTable
                                columns={NoticeColumn} 
                                tableData={notificaionData} 
                                // setTabelData={setData} 
                                // setTableSelect={setTableSelect}
                                dataType={'notification'}
                                selectType={false}
                                onRowClicked
                                detailAPI={ROUTE_INTRANET_NOTIFICATION}
                                noDataComponent
                            />
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6} className='top' >
                    <Card style={{height:'100%'}}>
                        <CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                            <CardTitle className="title">
                                문서 수신함
                            </CardTitle>
                        </CardHeader>
                        <CardBody style={{padding:'1.5rem 0rem 1.5rem 0rem'}}>
                            <IntranetMainCustomDataTable
                                columns={MailColumn} 
                                tableData={mailData} 
                                // setTabelData={setData} 
                                // setTableSelect={setTableSelect}
                                selectType={false}
                                dataType={'document'}
                                onRowClicked
                                detailAPI={ROUTE_INTRANET_DETAIL}
                                noDataComponent
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )

}
export default IntranetMainList