import { Fragment, useState, useEffect } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { API_BUSINESS_APPROVAL_LIST, ROUTE_BUSINESS_REQUISITION } from "../../../constants"
import { useNavigate, useLocation } from "react-router-dom"
import CustomDataTable from "../../../components/CustomDataTable"
import { SIGN_COLLECT, SIGN_REJECT, checkOnlyView, getTableDataCallback, primaryColor } from "../../../utility/Utils"
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import Flatpickr from "react-flatpickr"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { ApprovalDetailTypeObj } from "../data"
import { useSelector } from "react-redux"
import { BUSINESS_REQUISITION_BTL, BUSINESS_REQUISITION_OURIDURI } from "../../../constants/CodeList"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from "../../../components/TotalLabel"

const ApprovalLetter = () => {
	useAxiosIntercepter()
	const loginAuth = useSelector((state) => state.loginAuth)
	const cookies = new Cookies()
    const activeUser = Number(cookies.get('userId'))
	const [data, setData] = useState([])
	const navigate = useNavigate()
	const location = useLocation()
	const pathname = location.pathname 
	const pathnameParts = pathname.split('/')
	const type = pathnameParts[pathnameParts.length - 1]
	const [detailType, setDetailType] = useState('')
	const [searchitemParams, setSearchItemParams] = useState('')
	const [picker, setPicker] = useState([
		moment().subtract(7, 'days').format('YYYY-MM-DD'),
		moment().format('YYYY-MM-DD')
	]
	)
	const formatDate = (date) => {
		return moment(date).format("YYYY-MM-DD")
	}

	const basicColumns = [
		{
			name: '분류',
			cell: row => row.code && row.code.substring(4),
			minWidth: '80px',
			maxWidth: '160px'
		},
		{
			name: '사업소',
			cell: row => row?.property_name,
			minWidth: '80px',
			maxWidth: '160px'
		},
		{
			name: '제목',
			cell: row => {
				if (row.is_rejected === true) {
					return <Fragment key={row.id}><span style={{color:'red'}} >{row.title}</span></Fragment>
				} else {
					return row.title
				}
			},
			minWidth: '200px'
		},
		{
			name: '기안일자', // 작성일
			cell: row => row.report_date && row.report_date.split('T')[0],
			minWidth: '80px'
		},
		{
			name: '기안자',
			// cell: row => row.line[0].id,
			cell: row => row.line.map(user => {
				if (user.view_order === 0) {
					if (user.is_final === true && user.type === 1) {
						return (
							(user.url !== '') ? <img src={user.url} key={user.id} style={{height:"100%", width: '100%'}}></img>
							:
							<span key={user.id} >{user.username}</span>
						)
					} else {
						return <span key={user.id} style={{color:'darkgray'}} >{user.username}</span>
					}
				}
			}),
			width: '100px'
		},
		{
			name: '1차 결재자',
			cell: row => row.line.map(user => {
				if (user.view_order === 1) {
					if (user.is_final === true && user.type === 1) {
						return (
							(user.url !== '') ? <img src={user.url} key={user.id} style={{height:"100%", width: '100%'}}></img>
							:
							<span key={user.id} >{user.username}</span>
						)
					} else if (user.type === 2) {
						return 	<hr key={user.id} style={{ border: '1px solid black', width : '100%', margin: 0}}/>
					} else if (user.type === 3) {
						return <span key={user.id}>미지정</span>
					} else {
						return <span key={user.id} style={{color:'darkgray'}} >{user.username}</span>
					}
				}
			}),
			conditionalCellStyles: [
                {
                    when: row => row.line[1].type === 2,
                    style: {
                        paddingLeft:0,
						paddingRight:0
                    }
                }
            ],
			width: '100px'
		},
		{
			name: '2차 결재자',
			style: [{paddingRight:0, paddingLeft:0}],
			cell: row => row.line.map(user => {
				if (user.view_order === 2) {
					if (user.is_final === true && user.type === 1) {
						return (
							(user.url !== '') ? <img src={user.url} key={user.id} style={{height:"100%", width: '100%'}}></img>
							:
							<span key={user.id} >{user.username}</span>
						)
					} else if (user.type === 2) {
						return 	<hr key={user.id} style={{ border: '1px solid black', width : '100%', margin: 0}}/>

					} else if (user.type === 3) {
						return <span key={user.id}>미지정</span>
					} else {
						return <span key={user.id} style={{color:'darkgray'}} >{user.username}</span>
					}
				}
			}),
			conditionalCellStyles: [
                {
                    when: row => row.line[2].type === 2,
                    style: {
                        paddingLeft:0,
						paddingRight:0
                    }
                }
            ],
			width: '100px'
		},
		{
			name: '최종 결재자',
			cell: row => row.line.map(user => {
				if (user.view_order === 3) {
					if (user.is_final === true && user.type === 1) {
						return (
							(user.url !== '') ? <img src={user.url} key={user.id} style={{height:"100%", width: '100%'}}></img>
							:
							<span key={user.id} >{user.username}</span>
						)
					} else {
						return <span key={user.id} style={{color:'darkgray'}} >{user.username}</span>
					}
				}
			}),
			width: '105px'
		},
		{
			name: '결재',
			cell: row => {
				const signState = row?.is_rejected
				let count = 0
                row.line.map((user) => {
                    if (user.type === 1 || user.type === 2 || user.type === 3) {
                        count++
                    }
                })
				if (signState === SIGN_REJECT) {
					return (
						<>반려</>
					)
				} else if (signState === SIGN_COLLECT) {
					return (
						<>회수</>
					)
				} else if (count === 4) {
					return (
						<>완료</>
					)
				}
				return (
					<>결재대기</>
				)
			},
			conditionalCellStyles: [
                {
                    when: row => row?.is_rejected === SIGN_REJECT,
                    style: {
                        color: 'red'
                    }
                },
				{
                    when: row => row?.is_rejected === SIGN_COLLECT,
                    style: {
                        color: primaryColor
                    }
                },
				{
                    when: row => {
						let count = 0
						row.line.map((user) => {
							if (user.type === 1 || user.type === 2 || user.type === 3) {
								count++
							}
						})
						return count === 4
					},
                    style: {
                        color: 'green'
                    }
                }
            ],
			width: '105px'
		}
	]

	const getApprovalList = (data) => {
		if (Array.isArray(data)) {
			const tempData = data.filter(row => !(row?.user !== activeUser && row?.is_rejected === 2))
			setData(tempData)
			return	
		}
		setData(data)
	}
	
	const changeSearch = () => {
		getTableDataCallback(API_BUSINESS_APPROVAL_LIST, {property: cookies.get('property').value, type: type, date: picker, search: searchitemParams}, getApprovalList)
	}

	useEffect(() => {
        setDetailType(ApprovalDetailTypeObj[type])
		const params = {
			property: cookies.get('property').value,
			type: type,
			date: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
			search: searchitemParams
		}
		getTableDataCallback(API_BUSINESS_APPROVAL_LIST, params, getApprovalList)
	}, [type])

	return (
		<Fragment>
			<>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle={`${detailType}`} breadCrumbParent='사업관리' breadCrumbParent2='품의서' breadCrumbActive={`${detailType}`}/>
					</div>
				</Row>
				<Card>
					<CardHeader>
						<CardTitle>
                            {detailType}
						</CardTitle>
						<Button hidden={checkOnlyView(loginAuth, type === 'btl' ? BUSINESS_REQUISITION_BTL : BUSINESS_REQUISITION_OURIDURI, 'available_create')}
                            color='primary' onClick={() => { navigate(`${ROUTE_BUSINESS_REQUISITION}/${type}/register`, { state: { prop: type, type: 'register' } }) }}>등록</Button>
					</CardHeader>
					<CardBody style={{ paddingTop: 0}}>
						<Row style={{ display: 'flex'}}>
							<Col md='4' className="mb-1">
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
									<Col xs='2' md='2' className='card_table text facility-center' style={{paddingRight: 0}}>기간</Col>
									<Flatpickr
										value={picker}
										id='range-picker'
										className='form-control'
										placeholder='2022/02/09~2023/03/03'
										onChange={(dates) => setPicker(dates.map(formatDate))} // 날짜를 'yyyy-mm-dd' 형식으로 변환
										options={{
											mode: 'range',
											locale: Korean,
											ariaDateFormat:'Y-m-d',
											defaultValue: picker // 초기값 설정

										}}
									/>								
								</div>
							</Col>
							<Col className="mb-1" xs='12' md ='4'>
                                <InputGroup>
                                    <Input 
                                        value={searchitemParams}
										maxLength={200}
                                        onChange={(e) => setSearchItemParams(e.target.value)}
                                        placeholder= {'품의서의 제목으로 검색해주세요.'}
										onKeyDown={e => {
											if (e.key === 'Enter') {
												changeSearch()
											}
										}}/>
                                    <Button 
                                        onClick={() => {
                                            changeSearch()
                                        }}
                                    > 검색
                                    </Button>
                                </InputGroup>
                            </Col>
						</Row>
						<TotalLabel 
							num={3}
							data={data.length}
						/>
						<Row>
							<CustomDataTable
								tableData={data}
								columns={basicColumns}
								detailAPI={`${ROUTE_BUSINESS_REQUISITION}/${type}/detail`}
								state={type}
							/>
						</Row>
					</CardBody>
				</Card>
			</>
	</Fragment>
	)
}


export default ApprovalLetter