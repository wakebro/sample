import { dateFormat, getTableData } from "@utils"

import Breadcrumbs from '@components/breadcrumbs'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import Flatpickr from 'react-flatpickr'
import { Link } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"
import Cookies from "universal-cookie"
import { Korean } from "flatpickr/dist/l10n/ko.js"

import { API_EMPLOYEE_ATTENDANCE_LIST, ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_FORM } from "../../../../constants"
import AttendanceDataFooterTable from "./AttendanceDataFooterTable"
import { checkOnlyView } from "../../../../utility/Utils"
import { useSelector } from "react-redux"
import { BASIC_INFO_EMPLOYEE_ATTENDANCE } from "../../../../constants/CodeList"
import TotalLabel from "../../../../components/TotalLabel"

const conditionalCellStyles = [
	{
		when: (row) => row.date_footer, // 마지막 행인 경우
		style: {
			// 첫번째 cell에만 좌측 테두리 출력
			'&:first-child': {
				borderLeft: '0.5px solid #B9B9C3',
                backgroundColor: '#E2E2E2',
                minWidth: '330px'
			},
			'&:last-child': {
				borderRight: '0.5px solid #B9B9C3',
                color: 'red'
			},
			display : 'flex',
			// justifyContent : 'flex-end',
			border: '0.5px solid #B9B9C3',
			borderTop: 'none', // 상단 테두리 제거
			borderLeft: 'none' // 좌측 테두리 제거
		}
	}
]

const sum1 = (row, type) => {
    if (type === 'footer') {
        const arr = ['주간_footer', '지각_footer', '조퇴_footer', '야간_footer']
        let x = 0
        arr.forEach((value) => {
            if (row[value]) {
                x += Number(row[value].props.children)
            }
        })
        return x
    } else {
        const arr = ['daytime', 'late', 'leave_early', 'nighttime']
        let x = 0
        arr.forEach((value) => {
            if (row[value]) {
                x += row[value]
            }
        })
        return x
    }
}

const sum2 = (row, type) => {
    if (type === 'footer') {
        const arr = ['당직_footer', '비번_footer', '월차_footer', '생리휴가_footer', '정기휴가_footer', '사고_footer', '교육_footer', '기타_footer']
        let x = 0
        arr.forEach((value) => {
            if (row[value]) {
                x += Number(row[value].props.children)
            }
        })
        return x

    } else {
        const arr = ['watch', 'off_duty', 'day_off', 'menstruation_leave', 'regular_vacation', 'accident', 'education', 'etc']
        let x = 0
        arr.forEach((value) => {
            if (row[value]) {
                x += row[value]
            }
        })
        return x
    }
}

const AttendanceList = () => {
    const cookies = new Cookies()
    const loginAuth = useSelector((state) => state.loginAuth)
    const now = moment().format('YYYY-MM-DD')
	const [picker, setPicker] = useState([moment().startOf('month').format('YYYY-MM-DD 00:00:00'), moment().endOf('month').format('YYYY-MM-DD 23:59:59')])
    const [data, setData] = useState()
    const columns = [
		{
			name: '일자',
            selector: '일자',
            cell: row => { return (row.date_footer) ? <Fragment>{row.date_footer}</Fragment> : <Fragment>{dateFormat(row.create_datetime)}</Fragment> },
			conditionalCellStyles : conditionalCellStyles
            // minWidth: '330px'
		},
		{
			name: '직원수',
            selector: '직원수',
            cell: row => { return (row.date_footer) ? <Fragment>{row.직원수_footer}</Fragment> : <Fragment>{row.employee_count}</Fragment> },
            conditionalCellStyles: [
                {
                    when: (row) => row,
                    style: {
                        color: 'red'
                    }
                }
            ],
            width: '90px'
		},
		{
			name: '주간',
            selector: '주간',
            cell: row => { return (row.date_footer) ? <Fragment>{row.주간_footer}</Fragment> : (row.daytime) },
            width: '90px'
		},
        {
			name: '지각',
            selector: '지각',
            cell: row => { return (row.date_footer) ? <Fragment>{row.지각_footer}</Fragment> : (row.late) },
            width: '90px'
		},
        {
			name: '조퇴',
            selector: '조퇴',
            cell: row => { return (row.date_footer) ? <Fragment>{row.조퇴_footer}</Fragment> : (row.leave_early) },
            width: '90px'
		},
        {
			name: '야간',
            selector: '야간',
            cell: row => { return (row.date_footer) ? <Fragment>{row.야간_footer}</Fragment> : (row.nighttime) },
            width: '90px'
		},
		{
			name: '소계',
			selector: '소계1',
            cell: row => { return (row.date_footer) ? <Fragment>{sum1(row, 'footer')}</Fragment> : <Fragment>{sum1(row)}</Fragment> },
            conditionalCellStyles: [
                {
                    when: (row) => row,
                    style: {
                        color: 'red'
                    }
                }
            ],
            width: '90px'
		},
        {
			name: '당직',
            selector: '당직',
            cell: row => { return (row.date_footer) ? <Fragment>{row.당직_footer}</Fragment> : (row.watch) },
            width: '90px'
		},
        {
			name: '비번',
            selector: '비번',
            cell: row => { return (row.date_footer) ? <Fragment>{row.비번_footer}</Fragment> : (row.off_duty) },
            width: '90px'
		},
        {
			name: '연차',
            selector: '연차',
            cell: row => { return (row.date_footer) ? <Fragment>{row.월차_footer}</Fragment> : (row.day_off) },
            width: '90px'
		},
        {
			name: '생리휴가',
            selector: '생리휴가',
            cell: row => { return (row.date_footer) ? <Fragment>{row.생리휴가_footer}</Fragment> : (row.menstruation_leave) },
            width: '90px'
		},
        {
			name: '정기휴가',
            selector: '정기휴가',
            cell: row => { return (row.date_footer) ? <Fragment>{row.정기휴가_footer}</Fragment> : (row.regular_vacation) },
            width: '90px'
		},
        {
			name: '사고',
            selector: '사고',
            cell: row => { return (row.date_footer) ? <Fragment>{row.사고_footer}</Fragment> : (row.accident) },
            width: '90px'
		},
        {
			name: '교육',
            selector: '교육',
            cell: row => { return (row.date_footer) ? <Fragment>{row.교육_footer}</Fragment> : (row.education) },
            width: '90px'
		},
        {
			name: '기타',
            selector: '기타',
            cell: row => { return (row.date_footer) ? <Fragment>{row.기타_footer}</Fragment> : (row.etc) },
            width: '90px'
		},
		{
			name: '소계',
            selector: '소계2',
            cell: row => { return (row.date_footer) ? <Fragment>{sum2(row, 'footer')}</Fragment> : <Fragment>{sum2(row)}</Fragment> },
            conditionalCellStyles: [
                {
                    when: (row) => row,
                    style: {
                        color: 'red'
                    }
                }
            ],
            width: '90px'
		}
	]

    const dataSum = (p) => {
		let x = 0
		if (data !== undefined) {
			data.map((item) => {
				if (item[p] !== undefined) {
                    x += item[p]
                }
			}) 
		}
		return x 
	}

    const footer = {
        date_footer: <div>{moment(picker[0]).format('YYYY-MM-DD')}부터 {moment(picker[1]).format('YYYY-MM-DD')}까지 근태현황 합계</div>,
        주간_footer: `${dataSum('daytime').toLocaleString('ko-KR')}`,
        지각_footer: `${dataSum('late').toLocaleString('ko-KR')}`,
        조퇴_footer: `${dataSum('leave_early').toLocaleString('ko-KR')}`,
        야간_footer: `${dataSum('nighttime').toLocaleString('ko-KR')}`,
        당직_footer: `${dataSum('watch').toLocaleString('ko-KR')}`,
        비번_footer: `${dataSum('off_duty').toLocaleString('ko-KR')}`,
        월차_footer: `${dataSum('day_off').toLocaleString('ko-KR')}`,
        생리휴가_footer: `${dataSum('menstruation_leave').toLocaleString('ko-KR')}`,
        정기휴가_footer: `${dataSum('regular_vacation').toLocaleString('ko-KR')}`,
        사고_footer: `${dataSum('accident').toLocaleString('ko-KR')}`,
        교육_footer: `${dataSum('education').toLocaleString('ko-KR')}`,
        기타_footer: `${dataSum('etc').toLocaleString('ko-KR')}`,
        소계1_footer: `${dataSum('소계1').toLocaleString('ko-KR')}`,
        소계2_footer: `${dataSum('소계2').toLocaleString('ko-KR')}`,
        직원수_footer: `${dataSum('employee_count').toLocaleString('ko-KR')}`
    }

    useEffect(() => {
        getTableData(API_EMPLOYEE_ATTENDANCE_LIST, {property_id: cookies.get('property').value, start_date: dateFormat(picker[0]), end_date: dateFormat(picker[1])}, setData)
    }, [picker])

    return (
        <Fragment>
            {
                data &&
                <>
                    <Row>
                        <div className='d-flex justify-content-start'>
                            <Breadcrumbs breadCrumbTitle='근태현황' breadCrumbParent='기본정보' breadCrumbParent2='직원정보관리' breadCrumbActive='근태현황' />
                        </div>
                    </Row>
                    <Card>
                        <CardHeader>
                            <CardTitle>근태 현황</CardTitle>
                            <Button hidden={checkOnlyView(loginAuth, BASIC_INFO_EMPLOYEE_ATTENDANCE, 'available_create')}
                                color='primary' tag={Link} to={ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_FORM} state={{type: 'register', date: now}}>등록</Button>
                        </CardHeader>
                        <CardBody>
                            <Row className="mb-1" style={{display: 'flex', width: '100%', margin: 0}}>
                                <Col md='3' style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                    <Row style={{width: '100%', display: 'contents'}}>
                                        <Col style={{ display: 'contents' }}>기간</Col>
                                        <Col className='pe-0' style={{ paddingLeft: '1%', width: '100%'}}>
                                            <Flatpickr
                                                value={picker}
                                                id='range-picker'
                                                className='form-control'
                                                onChange={date => { if (date.length === 2) setPicker(date) } }
                                                options={{
                                                    mode: 'range',
                                                    ariaDateFormat:'Y-m-d',
                                                    locale: {
                                                        rangeSeparator: ' ~ '
                                                    },
                                                    locale: Korean
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>{moment(picker[0]).format('YYYY-MM-DD')}부터 {moment(picker[1]).format('YYYY-MM-DD')}까지 일자별 등록현황 입니다.</Col>
                            </Row>
                            <TotalLabel 
                                num={3}
                                data={data.length}
                            />
                            <AttendanceDataFooterTable
                                tableData={data}
                                columns={columns}
                                detailAPI={checkOnlyView(loginAuth, BASIC_INFO_EMPLOYEE_ATTENDANCE, 'available_update') ? undefined : ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_FORM}
                                customFooter={footer}
                            />
                        </CardBody>
                    </Card>
                </>
            }
        </Fragment>
    )
}

export default AttendanceList