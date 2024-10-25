import Cookies from 'universal-cookie'
import { Fragment, useEffect, useState } from 'react'
import { Col, Row, InputGroup, Input, Button, Label, Table } from 'reactstrap'
import Select from 'react-select'
import { reportTypeList, signIndex, NoDataComponent, TableNoDataComponent } from '../ReportData'
import { API_REPORT_APPROVAL_LIST, API_SYSTEMMGMT_PROPERTY_EMPLOYEE_CLASS } from '../../../constants'
import {axiosPostPut, getTableDataCallback, primaryColor} from '../../../utility/Utils'
import Swal from "sweetalert2"

const SignTable = (props) => {
    
    const {
        setIsOpen, id, userSign, setUserSign, signType, setSignType, 
        inputData, setSubmitResult, setActiveIndex, state, API, 
        orignUserSign, orignSignType
    } = props

    const cookies = new Cookies()
    const [data, setData] = useState([])
    const [selectTableList, setSelectTableList] = useState([{label: '선택', value:''}])
    const [selectedEmployeeClass, setSelectedEmployeeClass] = useState(selectTableList[0])
    const [searchValue, setSearchValue] = useState('')
    const [showUser, setShowUser] = useState({name:'결재자 미지정'})
    const [checked, setChecked] = useState(false)

    // 화면크기
    const [width, setWidth] = useState(window.innerWidth)
    const [throttle, setThrottle] = useState(false) // 성능 문제 throttle

    const handleResize = () => { // width
        if (throttle) return
        if (!throttle) {
            setThrottle(true)
            setTimeout(async () => {
                setWidth(window.innerWidth)
                setThrottle(false)
            }, 300)
        }
    }
    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => {
            // cleanup
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    // 선택한 유저는 사용 못하게 처리
    const handleDisabled = (user) => {
        if (user.id === 0) return false // 0은 미지정
        if (typeof user.id === 'number' && (user.id.toString() === userSign[0])) { // 담당자
            return true
        }
        return (userSign.includes(user.id) && !user.checked) // 1차 2차 최종 선택시 
    }
    
    const handleCheckbox = (user) => {
        const copyUserSign = [...userSign]
        const copySignType = [...signType]
        const copyData = [...data]
        const index = signIndex[id]
       
        if (index === 0) {
            copySignType[index] = 0
        } else {
            copySignType[index] = 0
            if (user.id === 0) {
                copySignType[index] = 3
            } else if (checked) {
                copySignType[index] = 2
            }
        }
        setSignType(copySignType)
        copyUserSign[index] = user.id
        setUserSign(copyUserSign)
        setShowUser(user)
        copyData.map(copyUser => {
            if (copyUser.id === user.id) {
                copyUser.checked = true
            } else {
                copyUser.checked = false
            }
        })
        setData(copyData)
    }

    const handlePrevious = () => {
        const index = signIndex[id]
        setActiveIndex(index - 1)
    }

    const handleNext = () => {
        const copySignType = [...signType]
        const index = signIndex[id]
        if (index === 0) {
            if (userSign[0] !== '') {
                setActiveIndex(index + 1)
            }
        } else if (index === 1 || index === 2) {
            if (userSign[index] === '') {
                Swal.fire({
                    icon: "info",
                    html: "결재자를 추가해주세요.",
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "확인",
                    cancelButtonColor : primaryColor,
                    reverseButtons :true,
                    customClass: {
                        actions: 'sweet-alert-custom right'
                    }
                })
            } else {
                setActiveIndex(index + 1)
            }
        } else if (index === 3) {
            if (userSign[3] !== '' && userSign[3] !== 0) {
                const resultData = userSign.map(value => {
                    if (value === 0) {
                        return ''
                    } else { return value }
                })
                copySignType[3] = 0
                setSignType(copySignType)
                const pageType = state.type === 'register' ? 'register' : 'modify'
                inputData.append('sign_list', resultData)
                inputData.append('sign_type_list', copySignType)
                const url = API
                axiosPostPut(pageType, state.reportType === 'outsourcing' ?  reportTypeList[state.reportType] : `${reportTypeList[state.reportType]}보고서`, url, inputData, setSubmitResult)
                setIsOpen(false)
            } else {
                Swal.fire({
                    icon: "info",
                    html: "최종 결재자를 추가해주세요.",
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "확인",
                    cancelButtonColor : primaryColor,
                    reverseButtons :true,
                    customClass: {
                        actions: 'sweet-alert-custom right'
                    }
                })
            }
        }
    }
    
    const handleCancel = () => {
        setSearchValue('')
        setUserSign(orignUserSign)
        setSignType(orignSignType)
        setIsOpen(false)
    }

    const getListInit = (isSearch = false) => {
        getTableDataCallback(
            API_REPORT_APPROVAL_LIST, 
            {propertyId:cookies.get('property').value, search:searchValue, employeeClass:selectedEmployeeClass.value}, 
            (data) => {
                const copyData = [...data]
                const tableIndex = signIndex[id]
                if (id !== 'manager') {
                    copyData.unshift({position: '', department: '', employee_class: '', checked:false, name:'결재자 미지정', id:0})
                }
                let selectUser = ''
                copyData.forEach(user => {
                    const tempSignId = userSign[tableIndex] ? String(userSign[tableIndex]) : String(0)
                    if (String(user.id) === tempSignId) {
                        user.checked = true
                        selectUser = user
                    }
                })
                if (!isSearch) setShowUser(selectUser)
                setData(copyData)
            }
        )
    }

    useEffect(() => {
        getListInit()
		getTableDataCallback(
			API_SYSTEMMGMT_PROPERTY_EMPLOYEE_CLASS, 
			{property:cookies.get('property').value, search:'', select_employee_class:''},
			(data) => {
				const tempEmpClassList = data?.emp_class_list // 키값 체크
				if (Array.isArray(tempEmpClassList)) { // 배열인지 체크
					const empList = tempEmpClassList.map(row => ({value:row.id, label: row.code})) // 배열 재가공
					empList.unshift({label: '선택', value:''})
					setSelectTableList(empList)
				}
			}
		)
    }, [])

    function handleCheckboxPreSign(e) { // 전결 체크 박스 이벤트 처리
        const currentCheck = e.target.checked
        setChecked(currentCheck)
        const index = signIndex[id]
        const copySignType = [...signType]

        if (userSign[index] === 0) {
            copySignType[index] = 3
            setSignType(copySignType)
            return
        }

        if (!currentCheck) {
            copySignType[index] = 0
            setSignType(copySignType)
            return
        }

        copySignType[index] = 2
        setSignType(copySignType)
    }

    return (
        <Fragment>
            <Row style={{justifyContent:'space-between'}}>
                <Col className='mb-1' xs={12} md={6} lg={4}>
                    <Row>
                        <Col md={3} xs={2} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>직종</Col>
                        <Col md={9} xs={10}>
                            <Select
                                classNamePrefix={'select'}
                                className="react-select"
                                options={selectTableList}
                                value={selectedEmployeeClass}
                                onChange={(e) => {
                                    setSelectedEmployeeClass(e)
                                }}
                                styles={{menu: provided => ({ ...provided, zIndex: 9999 })}}
                            />
                        </Col>
                    </Row>
                </Col>
                { id !== 'manager' && id !== 'manager4' &&
                    <Col className='mb-1'>
                        <div style={{marginTop:'1.5%'}}>
                            <div className='form-check form-check-danger'>
                                <Input type='checkbox' id='danger-checkbox' onClick={(e) => {
                                    handleCheckboxPreSign(e)
                                }} />
                                <Label className='form-check-label' for='danger-checkbox'>
                                    전결
                                </Label>
                            </div>
                        </div>
                    </Col>
                }
                <Col className='mb-1' md={6} lg={5}>
                    <InputGroup>
                        <Input 
                            value={searchValue} 
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder= '사용자명 혹은 아이디를 입력해주세요'
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    getListInit(true)
                                }
                            }}
                            />
                        <Button
                            style={{zIndex:0}}
                            onClick={() => {
                                getListInit(true)
                            }}
                        >검색</Button>
                    </InputGroup>
                </Col>
            </Row>
                {
                    width >= 1200 ? 
                    <>
                        <div style={{height:'400px', overflow:'auto'}}>
                            <Table className="mb-0">
                                <thead className="test-border">
                                    <tr style={{textAlign:'center', position:'sticky', top:0, width:'100%', zIndex:10}}>
                                        <th style={{width:'30%'}}>사용자명(ID)</th>
                                        <th style={{width:'10%'}}>직급</th>
                                        <th style={{width:'10%'}}>직종</th>
                                        <th style={{width:'30%', minWidth:'92px'}}>사용자명(ID)</th>
                                        <th style={{width:'10%'}}>직급</th>
                                        <th style={{width:'10%'}}>직종</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data && 
                                        data.length === 0 ?
                                            <tr>
                                                <th colSpan={6}>
                                                    <TableNoDataComponent/>
                                                </th>
                                            </tr>
                                        :
                                        data.map((user, index) => {
                                            const count = Math.floor((data.length % 2)) === 0 ? Math.floor((data.length / 2) - 1) : Math.ceil((data.length / 2)) - 1
                                            const count2 =  Math.floor((data.length % 2)) === 0 ? Math.floor((data.length / 2)) : Math.ceil((data.length / 2))
                                            return (
                                                index <= count && (
                                                    <>
                                                        <tr style={{ width:'100%'}}>
                                                            <td style={{width:'30%', padding:'1rem'}}>
                                                                <div className='form-check'>
                                                                    {id === 'manager' ? (
                                                                        <Input type='radio' id={`basic-cb-checked-${index + 1}`} checked={user.checked} disabled value={user.checked || ''} onclick='return(false)' style={{marginRight:'2%'}}/>
                                                                    ) : (
                                                                        <Input type='radio' id={`basic-cb-checked-${index + 1}`} checked={user.checked} readOnly disabled={handleDisabled(user)} value={user.checked || ''} style={{marginRight:'2%'}} onClick={() => handleCheckbox(user)}/>
                                                                    )}                                                        
                                                                    {user.name}
                                                                </div>
                                                            </td>
                                                            <td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.position}</td>
                                                            <td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.employee_class}</td>
                                                            { data[index + count2] !== undefined ? (
                                                                <>
                                                                    <td style={{width:'30%', padding:'1rem'}}>
                                                                        <div className='form-check'>
                                                                            {id === 'manager' ? (
                                                                                <Input type='radio' id={`basic-cb-checked-${index + count2}`} checked={data[index + count2].checked} disabled value={data[index + count2].checked || ''} onclick='return(false)' style={{marginRight:'2%'}}/>
                                                                            ) : (
                                                                                <Input type='radio' id={`basic-cb-checked-${index + count2}`} checked={data[index + count2].checked} readOnly disabled={handleDisabled(data[index + count2])} value={data[index + count2].checked || ''} onClick={() => handleCheckbox(data[index + count2])} style={{marginRight:'2%'}}/>
                                                                            )}
                                                                            {data[index + count2].name}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-0" style={{width:'10%', textAlign:'center'}}>{data[index + count2].position}</td>
                                                                    <td className="px-0" style={{width:'10%', textAlign:'center'}}>{data[index + count2].employee_class}</td>
                                                                </>
                                                                ) 
                                                            : <>
                                                                <td style={{width:'30%'}}></td>
                                                                <td style={{width:'10%'}}></td>
                                                                <td style={{width:'10%'}}></td>
                                                            </>
                                                            }
                                                        </tr>
                                                    </>
                                                )
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </> 
                    : 
                    <>
                        <div style={{height:'400px', overflow:'auto'}}>
							<Table className="mb-0">
								<thead className="test-border">
									<tr style={{textAlign:'center', position:'sticky', top:0, width:'100%', zIndex:999}}>
										<th style={{width:'30%'}}>사용자명(ID)</th>
										<th style={{width:'10%'}}>직급</th>
										<th style={{width:'10%'}}>직종</th>
									</tr>
								</thead>
								<tbody>
									{ data?.map((user, index) => (
										<tr style={{ width:'100%'}}>
											<td style={{width:'30%', padding:'1rem'}}>
                                                <div className='form-check'>
                                                    {id === 'manager' ? (
                                                        <Input type='radio' id={`basic-cb-checked-${index}`} checked={user.checked} disabled value={user.checked || ''} onclick='return(false)'/>
                                                    ) : (
                                                        <Input type='radio' id={`basic-cb-checked-${index}`} checked={user.checked} readOnly disabled={handleDisabled(user)} value={user.checked || ''} onClick={() => handleCheckbox(user)}/>
                                                    )}
                                                    <span className='card_table text number'>{user.name}</span>
                                                </div>
											</td>
											<td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.position}</td>
											<td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.employee_class}</td>
										</tr>
									))}
									{ data?.length === 0 ? 
										<tr>
											<th colSpan={3}>
												<TableNoDataComponent/>
											</th>
										</tr>
										: 
										''
									}
								</tbody>
							</Table>
						</div>
                    </>
                }
            <div className="mt-1">
                <div className='form-control hidden-scrollbar' style={{ display: 'flex', alignItems: 'center', height:'3.1rem' }}>
                    <div key={`file`} style={{ position: 'relative', paddingRight: '10px' }}>
                        {showUser &&
                            // <span>{showUser.name}  <XCircle size={21} onClick={() => onRemoveUser(showUser)} style={{ cursor: 'pointer' }} /></span>
                            <span>{showUser.name}</span>

                        }
                    </div>
                </div>
            </div>
            <div className='d-flex mt-2' style={{justifyContent:'end'}}>
                <Button color='report' onClick={() => handleCancel()} >
                    취소
                </Button>
                {id !== 'manager' && 
                <Button color='secondary' className="ms-1" outline onClick={() => handlePrevious()}>
                    이전
                </Button>
                }
                <Button color='primary' className="ms-1" onClick={() => handleNext()}>
                    {id === 'manager4' ? '완료' : '다음'}
                </Button>
            </div>
        </Fragment>
    )
}

export default SignTable