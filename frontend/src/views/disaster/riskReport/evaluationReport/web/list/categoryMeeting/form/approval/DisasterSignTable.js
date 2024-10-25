import Cookies from 'universal-cookie'
import { Fragment, useEffect, useState } from 'react'
import { Col, Row, InputGroup, Input, Button, Table, Label } from 'reactstrap'
import Select from 'react-select'
import { NoDataComponent, TableNoDataComponent } from '../../../../../../../../Report/ReportData'
import { API_REPORT_APPROVAL_LIST, API_SYSTEMMGMT_PROPERTY_EMPLOYEE_CLASS } from '../../../../../../../../../constants'
import Swal from "sweetalert2"
import { signIndex } from '../../../../data'
import { getTableDataCallback, primaryColor } from '../../../../../../../../../utility/Utils'
import { useDispatch } from 'react-redux'
import { setTabTempSaveCheck } from '@store/module/criticalDisaster'


const DisasterSignTable = (props) => {
    const {
        setIsOpen, id, userSign, 
        setUserSign, signType, setSignType, 
        setActiveIndex, 
        oldUserSign, setOldUserSign, setSignUserData
        } = props

    const cookies = new Cookies()
    const [data, setData] = useState([])
    const [selectTableList, setSelectTableList] = useState([{label: '선택', value:''}])
    const [selectedEmployeeClass, setSelectedEmployeeClass] = useState(selectTableList[0])
    const [searchValue, setSearchValue] = useState('')
    const [showUser, setShowUser] = useState({name:'결재자 미지정'})
    const dispatch = useDispatch()

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

    const handleCancel = () => {
        setUserSign([...oldUserSign])
        setActiveIndex(0)
        setSearchValue('')
        setIsOpen(false)
    }

    // 선택한 유저는 사용 못하게 처리
    const handleDisabled = (user) => {
        const copyUserSign = [...userSign]
        const tableIndex = id
        if (user.id === 0) return false // 0은 미지정
        if (typeof user.id === 'number' && (user.id.toString() === copyUserSign[0]) && signIndex[tableIndex] === 0) { // 첫 페이지 담당자는 abled 표시
            return false
        } else if (typeof user.id === 'number' && (user.id.toString() === copyUserSign[0]) && signIndex[tableIndex] !== 0) { // 1, 2, 3 페이지 에서는 disabled 표시
            return true
        } // if end
        return (copyUserSign.includes(user.id) && !user.checked) //  담당자 1차 2차 최종 선택시 
    }

    const handleCheckbox = (user) => {
        const copyUserSign = [...userSign]
        const copySignType = [...signType]
        const copyData = [...data]
        const index = signIndex[id]
        // if (index === 0) {
        //     copySignType[index] = 0
        // } else {
        //     if (userSign[index] !== 0) {
        //         copySignType[index] = 3
        //     } else {
        //         copySignType[index] = 0
        //     }
        // }
        copySignType[index] = 0
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
        const copyUserSign = [...userSign]
        const copySignType = [...signType]
        const index = signIndex[id]
        const copyData = [...data]

        if (index === 0) {
            if (userSign[0] !== '') {
                setActiveIndex(index + 1)
            } else {
                Swal.fire({
                    icon: "info",
                    html: "담당자를 추가해주세요.",
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
        } else {
            // if ((copyUserSign[0] !== '' && copyUserSign[0] !== 0) && (copyUserSign[1] !== '' && copyUserSign[1] !== 0)) {
            if ((copyUserSign[0] !== '' && copyUserSign[0] !== 0) && (copySignType[1] !== 3 && copyUserSign[1] !== 0)) {
                setUserSign(copyUserSign)
                setOldUserSign(copyUserSign)

                //
                const tempList = []
                for (const userId of copyUserSign) {
                    const userData = copyData.find(row => row.id === userId)
                    
                    tempList.push(userData)
                }
                if (copySignType[1] === 4) tempList[1] = ''
                setSignUserData(tempList)
                //

                setSignType(copySignType)
                setActiveIndex(0)
                dispatch(setTabTempSaveCheck(false))
                setIsOpen(false)
            } else {
                Swal.fire({
                    icon: "info",
                    html: "책임자를 선택해주세요.",
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

    const handleCheckboxNone = () => {
        const copySignType = [...signType]
        const copyUserSign = [...userSign]
        copySignType[1] = 4
        copyUserSign[1] = ''
        const copyData = [...data]
        copyData.map(copyUser => { copyUser.checked = false })
        setData(copyData)
        setSignType(copySignType)
        setUserSign(copyUserSign)
        setShowUser({name:'결재자 미지정'})
    }

    const getUserListInit = (isSearch = false) => {
        const param = {
            propertyId:cookies.get('property').value, search:searchValue, employeeClass:selectedEmployeeClass.value
        }
        getTableDataCallback(API_REPORT_APPROVAL_LIST, param, (data) => {
            const copyData = [...data]
            let selectUser = ''
            const index = signIndex[id]
            const copyOldUserSign = [...oldUserSign]
            const checkUserIndex = !copyOldUserSign.includes('') ? String(copyOldUserSign[index]) : String(userSign[index])
            copyData.forEach(user => {
                if (String(user.id) === checkUserIndex) {
                    user.checked = true
                    selectUser = user
                }
            })
            if (!isSearch) setShowUser(selectUser)
            setData(copyData)
        })
    }

    useEffect(() => {
        getUserListInit()
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
                { id === 'manager2' &&
                    <Col className='mb-1'>
                        <div style={{marginTop:'1.5%'}}>
                            <div className='form-check form-check-danger'>
                                <Input type='checkbox' id='danger-checkbox' checked={userSign[1] === ''} onClick={() => handleCheckboxNone()}/>
                                <Label className='form-check-label' for='danger-checkbox'>
                                    미지정(없음)
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
                                    getUserListInit(true)
                                }
                            }}
                            />
                        <Button
                            type='button'
                            onClick={() => getUserListInit(true)}
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
                                                                    <Input type='radio' id={`basic-cb-checked-${index + 1}`} checked={user.checked} readOnly  disabled={handleDisabled(user)} value={user.checked || ''} onClick={() => handleCheckbox(user)} style={{marginRight:'2%'}}/>
                                                                    {user.name}

                                                                </div>
                                                            </td>
                                                            <td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.position}</td>
                                                            <td className="px-0" style={{width:'10%', textAlign:'center'}}>{user.employee_class}</td>
                                                            { data[index + count2] !== undefined ? (
                                                                <>
                                                                    <td style={{width:'30%', padding:'1rem'}}>
                                                                        <div className='form-check'>
                                                                            <Input type='radio' id={`basic-cb-checked-${index + count2}`} checked={data[index + count2].checked} readOnly disabled={handleDisabled(data[index + count2])} value={data[index + count2].checked || ''} onClick={() => handleCheckbox(data[index + count2])} style={{marginRight:'2%'}}/>
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
                                                    <Input type='radio' id={`basic-cb-checked-${index}`} checked={user.checked} readOnly disabled={handleDisabled(user)} value={user.checked || ''} onClick={() => handleCheckbox(user)}/>
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
                    {id === 'manager2' ? '완료' : '다음'}
                </Button>
            </div>
        </Fragment>
    )
}
export default DisasterSignTable