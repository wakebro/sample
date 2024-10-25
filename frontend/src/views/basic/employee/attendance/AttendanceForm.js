import Breadcrumbs from '@components/breadcrumbs'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import axios from "axios"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import Flatpickr from 'react-flatpickr'
import { Controller, useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import Select from 'react-select'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, Input, InputGroup, Label, Row } from "reactstrap"
import Cookies from "universal-cookie"
import { API_EMPLOYEE_ATTENDANCE_FORM, API_EMPLOYEE_CLASS_LIST, API_EMPLOYEE_LEVEL_LIST, ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_FORM, ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_LIST } from "../../../../constants"
import { axiosPostPut, checkRealDoing, getTableDataModifyFirstIdx } from "../../../../utility/Utils"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { attendanceArr, attendanceEng2Kor } from "../../data"
import AttendanceDataFooterTable from "./AttendanceDataFooterTable"

const AttendanceForm = () => {
	useAxiosIntercepter()
	const navigate = useNavigate()
	const { state } = useLocation()
	const [date, setDate] = useState(state.date)
	const [submitResult, setSubmitResult] = useState()
	const [employeeClass, setEmployeeClass] = useState({value: '', label: '전체'})
	const [employeeClassArray, setEmployeeClassArray] = useState([{value: '', label: '전체'}])
	const [employeeLevel, setEmployeeLevel] = useState({value: '', label: '전체'})
	const [employeeLevelArray, setEmployeeLevelArray] = useState([{value: '', label: '전체'}])
	const [check, setCheck] = useState(false)
	const [employeeCount, setEmployeeCount] = useState(0)
	const cookies = new Cookies()
	const defaultValues = {date: date}
	
	const [data, setData] = useState([])
	const [search, setSearch] = useState('')
	const [searchValue, setSearchValue] = useState('')
	const [keySelectedList, setKeySelectedList] = useState({}) // 필터 적용한 사용자
	const [showOri, setShowOri] = useState(true)

	const {
		control,
		handleSubmit,
		setValue
	} = useForm({defaultValues})

	const [count, setCount] = useState({})

	const handleCount = (attendance, index) => {
		const updatedTemp = {...count}
		updatedTemp[`${attendance},${index}`] = !updatedTemp[`${attendance},${index}`]
		setCount(updatedTemp)
	}

	const conditionalCellStyles = [
		{
			when: (row) => row,
			style: {
				'&:first-child': {
					minWidth: '90px'
				}
			}
		},
		{
			when: (row) => row.주간_footer, // 마지막 행인 경우
			style: {
				backgroundColor: '#E2E2E2',
				'&:first-child': {
					borderLeft: '0.5px solid #B9B9C3',
					justifyContent: 'end',
					borderBottom: '0.5px solid #B9B9C3',
					minWidth: '90px'
				},
				'&:nth-child(2)': {
					borderBottom: '0.5px solid #B9B9C3'
				},
				'&:nth-child(3)': {
					justifyContent: 'flex-start',
					borderBottom: '0.5px solid #B9B9C3',
					borderRight: '0.5px solid #B9B9C3'
				},
				borderBottom: '0.5px solid #B9B9C3',
				borderTop: 'none',
				border: 'none'
			}
		}
	]

	const columns = [
		{
			name: '직종',
			cell: row => { return (row.주간_footer) ? <div>{row.footer1}</div> : <div>{row.employee_class}</div> },
			conditionalCellStyles : conditionalCellStyles,
			width: '90px'
		},
		{
			name: '직급',
			cell: row => { return (row.주간_footer) ? <div>{row.footer2}</div> : <div>{row.employee_level}</div> },
			conditionalCellStyles : conditionalCellStyles,
			width: '75px'
		},
		{
			name: '이름',
			cell: row => { return (row.주간_footer) ? <div>{row.footer3}</div> : <div>{row.name}</div> },
			conditionalCellStyles : conditionalCellStyles,
			width: '75px'
		},
		{
			name: '주간',
			cell: (row) => { 
				if (row.주간_footer) {
					return <div>{row.주간_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('주간')) {
						useEffect(() => {
							setValue(`주간${row.id}`, true)
						}, [data])
					}
					return <div>
								<Controller
									id={`주간${row.id}`}
									name={`주간${row.id}`}
									control={control}
									render={({ field }) => <Input 
										type="checkbox"
										name={`주간${row.id}`}
										checked={count[`주간,${row.id}`]}
										{...field}
										onChange={() => { handleCount('주간', row.id) }}
									/> }
								/>
							</div>
				}
			},
			minWidth: '75px'
		},
		{
			name: '지각',
			cell: (row) => { 
				if (row.지각_footer) {
					return <div>{row.지각_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('지각')) {
						useEffect(() => {
							setValue(`지각${row.id}`, true)
						}, [data])
					}
					return <div>
								<Controller
									id={`지각${row.id}]}`}
									name={`지각${row.id}`}
									control={control}
									render={({ field: {value} }) => <Input
										type="checkbox"
										name={`지각${row.id}`}
										value={value}
										checked={count[`지각,${row.id}`]}
										// {...field}
										onChange={() => { handleCount('지각', row.id) }}
									/>}
								/>
							</div>
				}
			},
			minWidth: '75px'
		},
		{
			name: '조퇴',
			cell: (row) => { 
				if (row.주간_footer) {
					return <div>{row.조퇴_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('조퇴')) {
						useEffect(() => {
							setValue(`조퇴${row.id}`, true)
						}, [data])
					}
					return <div>
								<Controller
									id={`조퇴${row.id}`}
									name={`조퇴${row.id}`}
									control={control}
									render={({ field: {value} }) => <Input
										type="checkbox"
										name={`조퇴${row.id}`}
										value={value}
										checked={count[`조퇴,${row.id}`]}
										// {...field}
										onChange={() => { handleCount('조퇴', row.id) }}
									/>}
								/>
							</div>
				}
			},
			minWidth: '75px'
		},
		{
			name: '야간',
			cell: (row) => { 
				if (row.주간_footer) {
					return <div>{row.야간_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('야간')) {
						useEffect(() => {
							setValue(`야간${row.id}`, true)
						}, [data])
					}
					return <div>
								<Controller
									id={`야간${row.id}`}
									name={`야간${row.id}`}
									control={control}
									render={({ field: {value} }) => <Input
										type="checkbox"
										name={`야간${row.id}`}
										value={value}
										checked={count[`야간,${row.id}`]}
										// {...field}
										onChange={() => { handleCount('야간', row.id) }}
									/>}
								/>
							</div>
				}
			},
			minWidth: '75px'
		},
		{
			name: '당직',
			cell: (row) => { 
				if (row.주간_footer) {
					return <div>{row.당직_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('당직')) {
						useEffect(() => {
							setValue(`당직${row.id}`, true)
						}, [data])
					}
					return <div>
								<Controller
									id={`당직${row.id}`}
									name={`당직${row.id}`}
									control={control}
									render={({ field: {value} }) => <Input
										type="checkbox"
											name={`당직${row.id}`}
											value={value}
											checked={count[`당직,${row.id}`]}
											onChange={() => { handleCount('당직', row.id) }}
									/>}
								/>
							</div>
				}
			},
			minWidth: '75px'
		},
		{
			name: '비번',
			cell: (row) => { 
				if (row.주간_footer) {
					return <div>{row.비번_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('비번')) {
						useEffect(() => {
							setValue(`비번${row.id}`, true)
						}, [data])
					}
					return <div>
								<Controller
									id={`비번${row.id}`}
									name={`비번${row.id}`}
									control={control}
									render={({ field: {value} }) => <Input
										type="checkbox"
										name={`비번${row.id}`}
										value={value}
										checked={count[`비번,${row.id}`]}
										onChange={() => { handleCount('비번', row.id) }}
									/>}
								/>
							</div>
				}
			},
			minWidth: '75px'
		},
		{
			name: '연차',
			cell: (row) => { 
				if (row.주간_footer) {
					return <div>{row.월차_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('월차')) {
						useEffect(() => {
							setValue(`월차${row.id}`, true)
						}, [data])
					}
					return <div>
								<Controller
									id={`월차${row.id}`}
									name={`월차${row.id}`}
									control={control}
									render={({ field: {value} }) => <Input
										type="checkbox"
										name={`월차${row.id}`}
										value={value}
										checked={count[`월차,${row.id}`]}
										onChange={() => { handleCount('월차', row.id) }}
									/>}
								/>
							</div>
				}
			},
			minWidth: '75px'
		},
		{
			name: '생리휴가',
			cell: (row) => { 
				if (row.주간_footer) {
					return <div>{row.생리휴가_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('생리휴가')) {
						useEffect(() => {
							setValue(`생리휴가${row.id}`, true)
						}, [data])
					}
					return <div>
								<Controller
									id={`생리휴가${row.id}`}
									name={`생리휴가${row.id}`}
									control={control}
									render={({ field: {value} }) => <Input
										type="checkbox"
										name={`생리휴가${row.id}`}
										value={value}
										checked={count[`생리휴가,${row.id}`]}
										onChange={() => { handleCount('생리휴가', row.id) }}
									/>}
								/>
							</div>
				}
			},
			minWidth: '100px'
		},
		{
			name: '정기휴가',
			cell: (row) => { 
				if (row.주간_footer) {
					return <div>{row.정기휴가_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('정기휴가')) {
						useEffect(() => {
							setValue(`정기휴가${row.id}`, true)
						}, [data])
					}
					return <div>
								<Controller
									id={`정기휴가${row.id}`}
									name={`정기휴가${row.id}`}
									control={control}
									render={({ field: {value} }) => <Input
										type="checkbox"
										name={`정기휴가${row.id}`}
										value={value}
										checked={count[`정기휴가,${row.id}`]}
										onChange={() => { handleCount('정기휴가', row.id) }}
									/>}
								/>
							</div>
					
				}
			},
			minWidth: '100px'
		},
		{
			name: '사고',
			cell: (row) => { 
				if (row.주간_footer) {
					return <div>{row.사고_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('사고')) {
						useEffect(() => {
							setValue(`사고${row.id}`, true)
						}, [data])
					}
				return <div>
							<Controller
								id={`사고${row.id}`}
								name={`사고${row.id}`}
								control={control}
								render={({ field: {value} }) => <Input
									type="checkbox"
									name={`사고${row.id}`}
									value={value}
									checked={count[`사고,${row.id}`]}
									onChange={() => { handleCount('사고', row.id) }}
								/>}
							/>
						</div>
					
				}
			},
			minWidth: '75px'
		},
		{
			name: '교육',
			cell: (row) => { 
				if (row.주간_footer) {
					return <div>{row.교육_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('교육')) {
						useEffect(() => {
							setValue(`교육${row.id}`, true)
						}, [data])
					}
					return <div>
								<Controller
									id={`교육${row.id}`}
									name={`교육${row.id}`}
									control={control}
									render={({ field: {value} }) => <Input
										type="checkbox"
										name={`교육${row.id}`}
										value={value}
										checked={count[`교육,${row.id}`]}
										onChange={() => { handleCount('교육', row.id) }}
									/>}
								/>
							</div>

				}
			},
			minWidth: '75px'
		},
		{
			name: '기타',
			cell: (row) => { 
				if (row.기타_footer) {
					return <div>{row.기타_footer}</div>
				} else {
					if (row.attendance_type && row.attendance_type.includes('기타')) {
						useEffect(() => {
							setValue(`기타${row.id}`, true)
						}, [data])
					}
					return <div>
								<Controller
									id={`기타${row.id}`}
									name={`기타${row.id}`}
									control={control}
									render={({ field: { value }}) => <Input
										type="checkbox"
										name={`기타${row.id}`}
										value={value}
										checked={count[`기타,${row.id}`]}
										onChange={() => { handleCount('기타', row.id) }}
									/>}
								/>
							</div>
				}
			},
			minWidth: '75px'
		}
	]

	const realSubmit = () => {
		const API = `${API_EMPLOYEE_ATTENDANCE_FORM}/${date}`
		const attendanceResult = {}
		Object.keys(count).map(key => {
			const user = key.split(',')[1]
			if (user in attendanceResult) attendanceResult[user].push(count[key])
			else {
				attendanceResult[user] = []
				attendanceResult[user].push(count[key])
			}
		})
		const formData = new FormData()
		formData.append('property_id', cookies.get('property').value)
		formData.append('include_left', check)
		formData.append('attendance_result', JSON.stringify(attendanceResult))

		axiosPostPut('modify', '근태 현황', API, formData, setSubmitResult)
	}

	const onSubmit = () => {
		if (check) checkRealDoing('퇴직한 직원의 기록도 같이 저장하시겠습니까?', realSubmit)
		else realSubmit()
	}

	const handlePicker = (picker) => {
		setDate(moment(picker[0]).format('YYYY-MM-DD'))
		navigate(ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_FORM, {state: {type: 'modify', date: moment(picker[0]).format('YYYY-MM-DD')}})
	}

	const handleResetButton = () => {
		setSearch('')
		setEmployeeClass({value: '', label: '직종'})
		setEmployeeLevel({value: '', label: '직급'})
		setCheck(false)
	}

	const footer = {
		footer1: `${moment(date).format('YYYY-MM-DD')}`,
		footer2: '근태 현황',
		footer3: `직원 수: ${employeeCount}`,
		주간_footer: Object.keys(count).filter(value => value.includes('주간') && count[value] === true).length,
		지각_footer: Object.keys(count).filter(value => value.includes('지각') && count[value] === true).length,
		조퇴_footer: Object.keys(count).filter(value => value.includes('조퇴') && count[value] === true).length,
		야간_footer: Object.keys(count).filter(value => value.includes('야간') && count[value] === true).length,
		당직_footer: Object.keys(count).filter(value => value.includes('당직') && count[value] === true).length,
		비번_footer: Object.keys(count).filter(value => value.includes('비번') && count[value] === true).length,
		월차_footer: Object.keys(count).filter(value => value.includes('월차') && count[value] === true).length,
		생리휴가_footer: Object.keys(count).filter(value => value.includes('생리휴가') && count[value] === true).length,
		정기휴가_footer: Object.keys(count).filter(value => value.includes('정기휴가') && count[value] === true).length,
		사고_footer: Object.keys(count).filter(value => value.includes('사고') && count[value] === true).length,
		교육_footer: Object.keys(count).filter(value => value.includes('교육') && count[value] === true).length,
		기타_footer: Object.keys(count).filter(value => value.includes('기타') && count[value] === true).length
	}

	/** 이름 검색 */
	const handleSearch = (value) => {
		// new Search Value 추출
		let filterDataTable = []

		// new Search Value에 해당하는 FilterDataTable 추출
		filterDataTable = data.filter(user => {
			const includes = 
			user.name.toLowerCase().includes(value.toLowerCase())
			return includes
		})

		if (employeeClass.value !== '') {
			filterDataTable = filterDataTable.filter(user => {
				const correct = user.employee_class !== null && user.employee_class.includes(employeeClass.label)
				return correct
			})
		}

		if (employeeLevel.value !== '') {
			filterDataTable = filterDataTable.filter(user => {
				const correct = user.employee_level !== null && user.employee_level.includes(employeeLevel.label)
				return correct
			})
		}

		setKeySelectedList({
			...keySelectedList,
			[value !== '' ? value : 'temp']: {
				dataTable: filterDataTable
			}
		})
		setSearchValue(value)
		if (searchValue.length === 0 && employeeClass.value === '' && employeeLevel.value === '') setShowOri(true)
		else setShowOri(false)
	}

	useEffect(() => {
		getTableDataModifyFirstIdx(API_EMPLOYEE_CLASS_LIST, {}, setEmployeeClassArray, '전체')
		getTableDataModifyFirstIdx(API_EMPLOYEE_LEVEL_LIST, {}, setEmployeeLevelArray, '전체')
	}, [date])

	useEffect(() => {
		setCount({})
		setData([])

		axios.get(`${API_EMPLOYEE_ATTENDANCE_FORM}/${date}`, {
			params: {property_id: cookies.get('property').value, picker: date, employee_class: employeeClass.value, employee_level: employeeLevel.value, search: search, check: check}
		})
		.then(res => {
			setData(res.data[0].data)
			setEmployeeCount(res.data[0].employee_count)
		})
		.catch(res => console.log(`${API_EMPLOYEE_ATTENDANCE_FORM}/${date}`, res))
	}, [check])

	useEffect(() => {
		if (data.length !== 0) {
			const tempCount = {...count}
			data.forEach((value) => { // value: [7, '직원7', '주간, 조퇴, 야간, 당직']
				attendanceArr.forEach((attendance) => {
					if (value[attendance]) tempCount[`${attendanceEng2Kor[attendance]},${value.id}`] = true
					else tempCount[`${attendanceEng2Kor[attendance]},${value.id}`] = false
				})
			})
			setCount(tempCount)
		}
	}, [data])

	useEffect(() => {
		if (submitResult) {
			navigate(ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_LIST)
		}
	}, [submitResult])

	return (
		<Fragment>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='근태현황' breadCrumbParent='기본정보' breadCrumbParent2='직원정보관리' breadCrumbActive='근태현황' />
					</div>
				</Row>
				<Card>
					<CardHeader>
						<CardTitle>근태 현황 등록</CardTitle>
					</CardHeader>
					<CardBody>
						<Row className="mb-1">
							<Col>
								<InputGroup style={{display: 'flex', justifyContent: 'flex-end', boxShadow:'none'}}>
									<Input type="checkbox" value={check} onChange={() => setCheck(!check)} />
									<Label className='mb-0' style={{display: 'flex', alignItems: 'center', marginLeft: '1%'}}>기록은 있으나 현재 없는 직원</Label>
								</InputGroup>
							</Col>
						</Row>
						<Row className="card_table" style={{width: '100%', margin: 0, display: 'flex', justifyContent:'end'}}>
							<Col lg='2' md='4' sm='4' className="mb-1">
								<Row>
									<Col xs='4' className='pe-0' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
										<Label className="mb-0">직종</Label>
									</Col>
									<Col xs='8'>
										<Select 
											id='status-select'
											autosize={true}
											className='react-select'
											classNamePrefix='select'
											options={employeeClassArray}
											onChange={(e) => setEmployeeClass(e)}
											value={employeeClass}
										/>
									</Col>
								</Row>
							</Col>
							<Col lg='2' md='4' className="mb-1">
								<Row>
									<Col xs='4' className='pe-0' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
										<Label className="mb-0">직급</Label>
									</Col>
									<Col xs='8'>
										<Select
											style={{display: 'inherit'}}
											id='status-select'
											autosize={true}
											className='react-select'
											classNamePrefix='select'
											options={employeeLevelArray}
											onChange={(e) => setEmployeeLevel(e)}
											value={employeeLevel}
										/>                                                
									</Col>
								</Row>
							</Col>
							<Col lg='3' md='4' className="mb-1">
								<Row>
									<Col xs='4' className='pe-0' style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
										<Label className="mb-0">등록 기준일</Label>
									</Col>
									<Col xs='8'>
										<Controller
											id='date'
											name='date'
											control={control}
											render={() => <Flatpickr
												value={date}
												id='default-picker'
												className="form-control"
												onChange={picker => handlePicker(picker)}
												options={{
													mode: 'single',
													ariaDateFormat: 'Y-m-d',
														locale: Korean
												}} />
											}/>                                      
									</Col>
								</Row>
							</Col>
							<Col lg='5' md='12' className="mb-1">
								<Row>
									<Col xl='8' lg='7' md='8' xs='7'>
										<InputGroup>
											<Input value={search}
												placeholder='이름을 검색해 보세요.'
												onChange={(e) => setSearch(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === 'Enter') handleSearch(search)
												}}/>
											<Button style={{zIndex:0}} color="primary" onClick={() => handleSearch(search)}>검색</Button>
										</InputGroup>
									</Col>
									<Col xl='4' lg='5' md='4' xs='5'>
										<Button outline color='primary' style={{width: '100%'}} onClick={() => handleResetButton()}>검색초기화</Button>
									</Col>
								</Row>
								
							</Col>
						</Row>
						<Row style={{display: 'flex'}}>
							<Col>{moment(date).format('YYYY-MM-DD')}일자 근태현황</Col>
						</Row>
						<AttendanceDataFooterTable
							tableData={showOri ? data : searchValue !== '' ? keySelectedList[searchValue]['dataTable'] : keySelectedList['temp']['dataTable']}
							columns={columns}
							customFooter={footer}
						/>
					</CardBody>
					<CardFooter style={{display:'flex', justifyContent:'end', alignItems:'center'}}>
						<Col style={{display: 'flex', alignItems: 'center', color: 'red', justifyContent: 'start', padding: 0}}>근무타입이 한개도 없는 직원의 경우 근무자 현황에서 삭제됩니다.</Col>
						<Button className="mx-1" color="report" onClick={() => navigate(ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_LIST)}>취소</Button>
						<Button color='primary' onClick={handleSubmit(onSubmit)}>확인</Button>
					</CardFooter>
				</Card>
			</Form>
		</Fragment>
	)
}

export default AttendanceForm
