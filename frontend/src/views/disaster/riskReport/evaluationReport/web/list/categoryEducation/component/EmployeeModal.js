import winLogoImg from '@src/assets/images/winlogo.png'
import { getTableDataCallback, primaryColor } from "@utility/Utils"
import { useAxiosIntercepter } from "@utility/hooks/useAxiosInterceptor"
import { Fragment, useEffect, useState } from "react"
import { Lock, XCircle } from 'react-feather'
import Select from 'react-select'
import { Button, Col, Input, InputGroup, Modal, ModalBody, ModalHeader, Row, Table } from "reactstrap"
import { API_REPORT_APPROVAL_LIST, API_SYSTEMMGMT_PROPERTY_EMPLOYEE_CLASS } from '../../../../../../../../constants'
import { getTableData, sweetAlertCallback } from '../../../../../../../../utility/Utils'
import { NoDataComponent, TableNoDataComponent } from '../../../../../../../Report/ReportData'
import { useDispatch } from 'react-redux'
import { setTabTempSaveCheck } from '@store/module/criticalDisaster'

const DisasterEmployeeModal = (props) => {
    useAxiosIntercepter()
    const {modalTitle, isOpen, setIsOpen, cookies, attendUser, setAttendUser, setAttendState = undefined} = props
    const [constData, setConstData] = useState([])
    const [data, setData] = useState([])
    const [selectTableList, setSelectTableList] = useState([{label: '선택', value:''}])
    const [selectedEmployeeClass, setSelectedEmployeeClass] = useState(selectTableList[0])
    const [searchValue, setSearchValue] = useState('')
    const [showUser, setShowUser] = useState([])
    const [width, setWidth] = useState(window.innerWidth)
    const [throttle, setThrottle] = useState(false)
    const [checkWhole, setCheckWhole] = useState(false) // 직원 전체 선택
    const [checkList, setCheckList] = useState([])
    const dispatch = useDispatch()

    const customToggle = () => {
        const temp = []
        const rollbackAttendUser = [... attendUser]
        rollbackAttendUser.map(user => temp.push({id: user.id, name: user.name, position: user.position, gender: user.gender, user_id: user.user_id ? user.user_id : ''}))
        
        if (modalTitle !== '작업자') {
            setIsOpen(false)
            setAttendUser(temp)
        } else {
            dispatch(setIsOpen(false))
            dispatch(setAttendUser(temp))
        }
        // 선택한 데이터 초기화
        setShowUser([])
        setSearchValue('')
        setCheckList([])
        setSelectedEmployeeClass({label: '선택', value:''})
        setData(constData)
	} // customToggle end

    const handleCheckbox = (user) => {
        const copyData = [...data]
        copyData.filter(copyUser => {
            if (copyUser.id === user.id) {
                if (!copyUser.checked) {
                    copyUser.checked = true
                } else  copyUser.checked = false
            }
        })
        setData(copyData)

        const copyCheckList = [...checkList]
        if (!copyCheckList.find(rowUser => rowUser.id === user.id)) {
            copyCheckList.push(user)
            setCheckList(copyCheckList)
        } else {
            setCheckList(copyCheckList.filter(rowUser => rowUser.id !== user.id))
        }

        const userList = [...showUser]

        function checkData(element) {
            if (element.id === user.id) return true
        }
        if (userList.some(checkData) === true) {
            const deleteData = userList.filter(data => data.id !== user.id)
            setShowUser(deleteData)
        } else {
            userList.push({id: user.id, name:user.name})
            setShowUser(userList)
        }
    }

    const handleDisabled = (user) => { // 참석 여부 입력한 유저는 삭제 불가
        const copyAttendUser = [...attendUser]
        for (const aUser of copyAttendUser) {
            if (aUser.id !== user.id) continue
            if (aUser.hasOwnProperty('is_attend') && aUser.is_attend === true) return true
        }
        return false
    }

    const onRemoveUser = (user) => {
        if (handleDisabled(user)) {
            return
        }
        const copyData = [...data]
        copyData.map(copyUser => {
            if (copyUser.id === user.id) {
                copyUser.checked = false
            }
        })
        setData(copyData)

        const copyCheckList = [...checkList]
        setCheckList(copyCheckList.filter(rowUser => rowUser.id !== user.id))

        const deleteData = showUser.filter(data => data.id !== user.id)
        setShowUser(deleteData)
    }

    const handleSelectUser = () => {
        const copyOldAttendUser = [...attendUser]
        const copyNewCheckUser = [...checkList]
        const temp = []
        for (const newUser of copyNewCheckUser) {
            const old = copyOldAttendUser.filter(aUser => aUser.id === newUser.id)
            if (old[0] !== undefined) {
                temp.push(old[0])
                continue
            }
            temp.push({id: newUser.id, name: newUser.name, position: newUser.position, gender: newUser.gender, user_id: newUser.user_id ? newUser.user_id : ''})
        }
        if (modalTitle !== '작업자') {
            setAttendUser(temp)
            setIsOpen(!isOpen)
        } else {
            dispatch(setIsOpen(!isOpen))
            dispatch(setAttendUser(temp))
        }
        if (setAttendState !== undefined) setAttendState(true)
        setSelectedEmployeeClass({label: '선택', value:''})
        // 선택한 데이터 초기화
        setShowUser([])
        setData(constData)
        dispatch(setTabTempSaveCheck(false))
    }
 
    const handleSubmit = () => {
        if (modalTitle !== '작업자') {
            sweetAlertCallback('회의 실시자 수 변경', '회의 실시자 수가 선택한 인원에 따라 변경됩니다.</br> 변경하시겠습니까?', 'info', 'right', handleSelectUser)
        } else handleSelectUser()
    } // handleSubmit end

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

    const getUserChecked = (data) => {
        const copyData = [...data]
        const copyCheckList = [...checkList]
        copyData.forEach(user => {
            for (const aUser of copyCheckList) {
                if (aUser.id === user.id) {
                    user.checked = true
                    break
                }
            }
        })

        let result = false
        if (selectedEmployeeClass.value === '' && constData.length === checkList.length) result = true
        if (selectedEmployeeClass.value !== '') {
            let cnt = 0
            for (const checkUser of copyData) {
                const targetUser = checkList.find(user => user.id === checkUser.id)
                if (targetUser === undefined) break
                cnt += 1
            }
            if (copyData.length === cnt) result = true
        }
        
        setCheckWhole(result)
        setShowUser(copyCheckList)
        setData(copyData)
    }

    function handleWholeSelect(e) {
        const checked = e.target.checked
        const isEmployeeClassNone = selectedEmployeeClass.value === ''

        const copyData = isEmployeeClassNone ? [...constData] : [...data]

        let tempCheckList = [...checkList]
        let tempShowUserList = [...showUser]
        copyData.map(copyUser => {
            const checkMach = checkList.find(user => user.id === copyUser.id)
            if (checked) {
                if (checkMach === undefined) {
                    tempCheckList.push({id: copyUser.id, name: copyUser.name, position: copyUser.position, gender: copyUser.gender, user_id: copyUser.user_id ? copyUser.user_id : ''})
                    tempShowUserList.push({id: copyUser.id, name:copyUser.name})
                }
            } else {
                copyUser.checked = false
                tempCheckList = tempCheckList.filter(user => user.id !== checkMach.id)
                tempShowUserList = tempShowUserList.filter(user => user.id !== checkMach.id)
            }
            for (const aUser of attendUser) {
                if (aUser.id === copyUser.id && aUser.is_attend) {
                    copyUser.checked = true
                    if (!checked) {
                        tempCheckList.push({id: copyUser.id, name: copyUser.name, position: copyUser.position, gender: copyUser.gender, user_id: copyUser.user_id ? copyUser.user_id : ''})
                        tempShowUserList.push({id: copyUser.id, name:copyUser.name})
                    }
                    break
                } else copyUser.checked = checked
            }
        })
        setData(copyData)
        setCheckList(tempCheckList)
        setShowUser(tempShowUserList)
        setCheckWhole(checked)
    }

    const getUserListInit = () => {
        const param = {
            propertyId:cookies.get('property').value, search:searchValue, employeeClass:selectedEmployeeClass.value
        }
        getTableDataCallback(API_REPORT_APPROVAL_LIST, param, getUserChecked)
    }

    useEffect(() => {
        if (isOpen) {
            const copyAttendUser = [...attendUser]
            const tempList = []
            for (const aUser of copyAttendUser) {
                tempList.push({id: aUser.id, name: aUser.name, position: aUser.position, gender: aUser.gender, user_id: aUser.user_id ? aUser.user_id : ''})
            }
            setCheckList(tempList)
            getUserChecked(data)
        }
    }, [isOpen])

    useEffect(() => {
        if (data.length !== 0) {
            getUserChecked(data)
        }
    }, [checkList])

    useEffect(() => {
        getUserListInit()
        getTableData(API_REPORT_APPROVAL_LIST, {propertyId:cookies.get('property').value, search:'', employeeClass:''}, setConstData)
        getTableDataCallback(API_SYSTEMMGMT_PROPERTY_EMPLOYEE_CLASS, {property:cookies.get('property').value, search:'', select_employee_class:''}, (data) => {
            const empClassList = []
            if (data.emp_class_list) {
                for (let i = 0; i < data.emp_class_list.length; i++) {
                    empClassList.push({value:data.emp_class_list[i].id, label: data.emp_class_list[i].code})
                }
                setSelectTableList(prevList => [...prevList, ...empClassList])
            }
        })
    }, [])

    return (
        <Modal isOpen={isOpen} toggle={() => customToggle()} className='modal-dialog-centered modal-xl'>
            <ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
                <div className='mb-1 px-1' style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div>
                        <Row>
                            <span style={{color: 'white', fontSize: '20px'}}>
                                {modalTitle} 참석자 지정<br />
                            </span>
                        </Row>
                        <Row>
                            <span style={{color: 'white'}}>
                                아래 창에서 해당되는 직원을 모두 선택해주세요.
                            </span>
                        </Row>
                    </div>
                    <div>
                        <img src={winLogoImg} style={{maxHeight: '85px'}}/> 
                    </div>
                </div>
            </ModalHeader>
            <ModalBody>
                <Row style={{justifyContent:'space-between'}}>
                    <Col className='mb-1' md='6' style={{display:'flex', justifyContent:'space-between'}}>
                        <Col xs={8} style={{display:'flex'}}>
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
                        </Col>
                        <Col className='d-flex align-items-center justify-content-start' xs={3}>
                            <Input type='checkbox' onClick={(e) => handleWholeSelect(e)} readOnly checked={checkWhole}/>
                            &nbsp;&nbsp;
                            <div>전체 선택</div>
                        </Col>
                    </Col>
                    <Col className='mb-1' md='6'>
                        <InputGroup>
                            <Input 
                                value={searchValue} 
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder= '사용자명 혹은 아이디를 입력해주세요'
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') getUserListInit()
                                }}
                                />
                            <Button
                                onClick={() => getUserListInit()}
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
                                    <tr style={{textAlign:'center', position:'sticky', top:0, width:'100%'}}>
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
                                                                    <Input type='checkbox' id={`disaster-checked-${index + 1}`} disabled={handleDisabled(user)} checked={user.checked} readOnly value={user.checked || ''} onClick={() => handleCheckbox(user)}/>
                                                                    <span>{user.name}{user.is_attend}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.position}</td>
                                                            <td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.employee_class}</td>
                                                            { data[index + count2] !== undefined ? (
                                                                <>
                                                                    <td style={{width:'30%', padding:'1rem'}}>
                                                                        <div className='form-check'>
                                                                            <Input type='checkbox' id={`disaster-checked-${index + count2}`} disabled={handleDisabled(data[index + count2])} checked={data[index + count2].checked} readOnly value={data[index + count2].checked || ''} onClick={() => handleCheckbox(data[index + count2])}/>
                                                                            <span>{data[index + count2].name}{data[index + count2].is_attend}</span>
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
									<tr style={{textAlign:'center', position:'sticky', top:0, width:'100%', zIndex:10}}>
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
                                                    <Input type='checkbox' key={`basic-cb-checked-edu-${index}`} disabled={handleDisabled(user)} id={`basic-cb-checked-${index}`} checked={user.checked} readOnly value={user.checked || ''} onClick={() => handleCheckbox(user)}/>
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
                    <div className='form-control hidden-scrollbar' style={{ display: 'flex', alignItems: 'center', height:'3.1rem', whiteSpace:'nowrap', overflowX:'scroll', overflowY:'hidden'}}>
                        {showUser && 
                            showUser.map(employee => (
                                <div key={employee.name}>
                                    {employee.name}
                                    { !handleDisabled(employee) ? 
                                        <XCircle className='me-1' size={21} onClick={() => onRemoveUser(employee)} style={{ cursor: 'pointer'}}/>
                                        :
                                        <Lock className='me-1' size={21} style={{ cursor: 'pointer'}}/>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='d-flex mt-1' style={{justifyContent:'end'}}>
                    <Button color='report' onClick={customToggle} >
                        취소
                    </Button>
                    <Button color='primary' className="ms-1" onClick={() => handleSubmit()}>
                        저장
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    )

}
export default DisasterEmployeeModal