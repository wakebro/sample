import axios from 'axios'
import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link } from 'react-router-dom'
import { Fragment, useEffect, useState } from "react"
import { Send } from 'react-feather'
import Select from 'react-select'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Spinner, FormFeedback, Form, CardFooter } from "reactstrap"
import {ROUTE_INTRANET_NOTIFICATION, API_INTRANET_NOTIFICATION_FORM, API_INTRANET_NOTIFICATION_SELECT_LIST_FORM} from "../../../../constants"
import { defaultValues, selectList, validationSchemaInconv } from '../NotificationData'
import NotificationDataTable from '../NotificationDataTable'
import AddModal from '../../document/send/AddModal'
import GroupListModal from './GroupListModal'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import {sweetAlert, axiosSweetAlert, handleFileInputLimitedChange, getTableData} from '../../../../utility/Utils'
import FileIconImages from '../../../apps/customFiles/FileIconImages'


const NotificaionForm = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const [userData, setUserData] = useState([])
    const [files, setFiles] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])

    const [selected, setSelected] = useState({value:'직원', label:'직원'})

    const [show, setShow] = useState(false)
    const [showGroup, setShowGroup] = useState(false)
    const [load, setLoad] = useState(false)
    const [tempCheck, setTempCheck] = useState(true)
    const [rowSelect, setRowSelect] = useState([])
    const [participantSelect, setParticipantSelect] = useState([])

    const [isOpen, setIsOpen] = useState(false)
    const [isOpen_list, setIsOpenList] = useState(false)
    const [group_receivers, setGroupReceivers] = useState([])
    const [submitResult, setSubmitResult] = useState(false)

    const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues)),
		resolver: yupResolver(validationSchemaInconv)
	})

    const handleCheckboxClick = (user, row) => {
		setLoad(false)
		setShow(false)
		setTempCheck(false)
		const copyUserData = [...userData]
		const tempRowSelectList = []
		const tempSelectUserList = []

		copyUserData.map(data => {
			if (data.id === row.id) {
				data.employee.map(employee => {
					if (employee.id === user.id) {
						employee.default = !employee.default
					}
				})
			}
		})

		copyUserData.map(data => {
			let isFalse = false
			data.employee.map(employee => {
				if (employee.default === false) isFalse = true
				else tempSelectUserList.push(employee.id)
			})
			if (!isFalse) {
				tempRowSelectList.push(data.id)
				data.checked = true
			} else {
				data.checked = false
			}
		})
		setUserData(copyUserData)
		
		const check1 = tempRowSelectList.every(id => rowSelect.includes(id))
		const check2 = rowSelect.every(id => tempRowSelectList.includes(id))
		if (!check1 || !check2) {
			setRowSelect(tempRowSelectList)
		}
		setParticipantSelect(tempSelectUserList)
		setShow(true)
	}

    const dataTableColumn = {
        직원: [
            {
                name:'직종',
                width:'80px',
                cell: row => <div key={row.id} id={row.class} style={{ width:'100%', textAlign: 'center' }}>{row.class}</div>
            },
            {
                name:'이름(아이디)',
                style: {
                    justifyContent:'flex-start',
                    flexWrap: 'wrap',   
                    display:'flex',
                    width:'100%'
                },
                cell: row => {
                    return row.employee.map((user, index) => (
                        <Col md='3' className='form-check form-check-inline' key={index}>
                            <Input
                            type='checkbox' 
                            id='basic-cb-checked' 
                            checked={user.default}
                            readOnly
                            value={user.default || ''}
                            onClick={() => handleCheckboxClick(user, row)}/> 
                            {user.username !== null ? 
                                <span key={user.id} id={user.id} style={{ textAlign: 'left'}}>
                                {user.name}({user.username})
                                </span>
                            :
                                <span key={user.id} id={user.id} style={{ textAlign: 'left'}}>
                                {user.name}({user.belong})
                                </span>
                            }
                        </Col>
                        ))
                    }
            }
        ],
        건물: [
            {
                name:'건물(코드)',
                cell: row => <div key={row.company} id={row.id} style={{ width:'100%', textAlign: 'left' }}>{row.company}</div>
            }
        ]
    } 

    const handleFileInputChange = (e) => {
        handleFileInputLimitedChange(e, files, setFiles, 1, undefined, undefined, setSelectedFiles)
    }

    const onRemoveFile = (file) => {
        const updatedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file)
        setSelectedFiles(updatedFiles)
        setFiles(updatedFiles)
    }

    const openModal = () => {
        setIsOpen(true)
    }
    const openModalList = () => {
        setIsOpenList(true)
    }

    const onSubmit = (data) => {
        const employeeList = []
        userData.map(data => {
            data.employee.map(employee => {
                if (employee.default === true) {
                    employeeList.push(employee.id)
                }
            })
        })
        if (!employeeList.length > 0) {
            sweetAlert(``, '알림 수신자를 선택해 주세요.', 'warning', 'center')
        } else {
            const formData = new FormData()
            formData.append('subject', data.subject)
            formData.append('contents', data.body)
            formData.append('sender_id', cookies.get('userId'))
            formData.append('property_id', cookies.get('property').value)
            formData.append('employee_list', employeeList)
            formData.append('doc_file', files[0])
            formData.append('where_to_start', 'notification')

            axios.post(API_INTRANET_NOTIFICATION_FORM, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then(res => {
                if (res.status === 200) {
                    axiosSweetAlert(`알림 전송 성공`, `알림 전송 되었습니다.`, 'success', 'center', setSubmitResult)
                } else {
                    sweetAlert(`알림 전송 실패`, '알림 전송 실패하였습니다.<br/>다시한번 확인 해주세요.', 'warning', 'center')
                }
            })
        }
    }

    useEffect(() => {
        if (submitResult) {
            window.location.href = ROUTE_INTRANET_NOTIFICATION
        }
    }, [submitResult])

    useEffect(() => {
        getTableData(API_INTRANET_NOTIFICATION_SELECT_LIST_FORM, {
            propId: cookies.get("property").value,
            type: selected['value']
        }, setUserData)
        setShow(true)
        setShowGroup(true)
    }, [selected])
    
    useEffect(() => {
        if (group_receivers) {
            if (userData) {
                const checkList = [] //전체선택
                const temp = [] //개별
                group_receivers.map(row => temp.push(row.id))
                const copyUserData = [...userData]
                
                copyUserData.forEach((data) => {
                    data.employee.forEach((user) => {
                        if (temp.includes(user.id)) {
                            user.default = true
                            if (!checkList.includes(data.id)) {
                                checkList.push(data.id)
                            }
                        }
                    })
                    
                })

                const rowResult = []
                copyUserData.map(data => {
                    checkList.map(id => {
                        if (data.id === id) {
                            const count = data.employee.filter(data => data.default === true).length
                            if (count === data.employee.length) {
                                rowResult.push(data.id)
                                data.checked = true
                            }
                        }
                        setShowGroup(true)
                    })
                })
                setParticipantSelect(temp)
                setRowSelect(rowResult)
                setTempCheck(false)
                setShow(true)
            }
        }
    }, [group_receivers])

    useEffect(() => {
        const inputElement = document.getElementById("doc_file")
        inputElement.value = ""
        
        const dataTransfer = new DataTransfer()
        for (let i = 0; i < files.length; i++) {
            dataTransfer.items.add(files[i])
        }
        inputElement.files = dataTransfer.files
    }, [files])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='알림함' breadCrumbParent='인트라넷' breadCrumbActive='알림함' />
                </div>
            </Row>
            <Card>
                <CardHeader>
					<CardTitle className="title">
                        알림 발송
					</CardTitle>
				</CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className='card_table'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div>알림명</div>&nbsp;
                                    <div className='essential_value'/> 
                                </Col>
                                <Controller
                                name='subject'
                                control={control}
                                render={({ field }) => (
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%'}}>
                                            <Input style={{width:'100%'}} bsSize='lg' maxLength={250} invalid={errors.subject && true} {...field}/>
                                            {errors.subject && <FormFeedback>{errors.subject.message}</FormFeedback>}
                                        </Row>
                                    </Col>
                                )}/>
                            </div>
                        </Row>
                        <Row className='card_table'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div>알림 내용</div>&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <Controller
                                name='body'
                                control={control}
                                render={({ field }) => (
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%'}}>
                                            <Input style={{width:'100%'}} bsSize='lg' invalid={errors.body && true} {...field}/>
                                            {errors.body && <FormFeedback>{errors.body.message}</FormFeedback>}
                                        </Row>
                                    </Col>
                                )}/>
                            </div>
                        </Row>
                        <Row className='card_table'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{ paddingTop:0, paddingBottom:'1%'}}>
                                    첨부 사진
                                </Col>
                                <Input type="file" id="doc_file" name="doc_file" accept="image/*" bsSize='lg' onChange={handleFileInputChange}  />
                            </div>
                            <div className="mb-1">
                                <div className='form-control hidden-scrollbar' style={{ height: '46.2px', display: 'flex', alignItems: 'center' }}>
                                    {selectedFiles && selectedFiles.length > 0 &&
                                        selectedFiles.map((file, idx) => {
                                            const ext = file.name.split('.').pop()
                                            return (
                                              <span key={`file_${idx}`} className="mx-0 px-0">
                                                <FileIconImages
                                                  ext={ext}
                                                  file={file}
                                                  filename={file.name}
                                                  removeFunc={onRemoveFile}
                                                />
                                              </span>
                                            )
                                          })} 
                                </div>
                            </div>
                        </Row>
                        <CardHeader style={{paddingLeft:'0'}}>
                            <CardTitle className="title">
                                수신
                            </CardTitle>
                        </CardHeader>
                        <Row style={{marginBottom:'1%', justifyContent:'space-between'}}>
                            <Col md='2'>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom:'1%'}}>
                                    <Col md='4' className='d-flex align-items-center justify-content-center' style={{paddingRight: 0 }}>수신 선택</Col>
                                    <Col style={{ paddingLeft: '1%', zIndex:'99' }}>
                                        <Select
                                            classNamePrefix={'select'}
                                            className="react-select"
                                            options={selectList}
                                            value={selected}
                                            onChange={(e) => {
                                                setUserData([])
                                                setSelected(e)
                                            }}
                                            />
                                    </Col>
                                </div>
                            </Col>
                            <Col md='3' style={{textAlign:'end'}}>
                                <Button color='white' style={{borderColor: 'gray', whiteSpace:'nowrap'}} onClick={openModal} className="ms-1" >수신자 그룹 추가</Button> 
                                <Button color='white' style={{borderColor: 'gray', whiteSpace:'nowrap'}} onClick={openModalList} className="ms-1" >그룹 선택</Button> 
                            </Col>
                        </Row>
                        <Row className='card_table'>
                        {/* { show ? */}
                        { show && showGroup ? 
                            <NotificationDataTable 
                                selectType={true}
                                columns={dataTableColumn[selected.value]}
                                tableData={userData}
                                setTabelData={setUserData}
                                rowSelect={rowSelect}
                                setRowSelect={setRowSelect}
                                participantSelect={participantSelect}
                                setParticipantSelect={setParticipantSelect}
                                setShow={setShow}
                                tempCheck={tempCheck}
                                load={load}
                                setTempCheck={setTempCheck}
                            />
                            : 
                            <Spinner color='primary'/> 
                        } 
                        </Row>
                        <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                            <Fragment >
                                <Button type='submit' className="ms-1" id='notification' color='primary'><Send style={{width:'14px', height:'14px'}}/>알림 발송</Button>
                                <Button
                                    className="ms-1"
                                    tag={Link} 
                                    to={ROUTE_INTRANET_NOTIFICATION}
                                    state={{
                                        key: 'safetyEducation'
                                    }} >목록</Button>
                            </Fragment>
                        </CardFooter>
                    </Form>
                    <AddModal 
                        formModal={isOpen} 
                        setFormModal={setIsOpen} 
                        receivers={participantSelect} 
                    />
                    <GroupListModal
                        formModal={isOpen_list}
                        setFormModal={setIsOpenList}
                        setGroupReceivers={setGroupReceivers} 
                    />
                </CardBody>
            </Card>
        </Fragment>

    )
}
export default NotificaionForm