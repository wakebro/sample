/* eslint-disable */
import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import Flatpickr from 'react-flatpickr'
import { useLocation } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, InputGroupText, FormFeedback, InputGroup, Form, CardFooter, Spinner } from "reactstrap"
import { API_EDUCATION, API_EDUCATION_FORM, ROUTE_EDUCATION, API_EDUCATION_EMPLOYEE_LIST, API_EDUCATION_DETIAL_MODIFY } from "../../../../constants"
import { validationSchemaInconv, defaultValues, bigTitleObj, titleObj } from '../../EducationData'
import { axiosPostPut, getTableDataCallback, handleFileInputLimitedChange, setFormData, setStringDate } from '../../../../utility/Utils'
import  EducationDataTable  from '../../EducationDataTable'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import AddModal from '../../AddModal'
import FileIconImages from '../../../apps/customFiles/FileIconImages'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import * as moment from 'moment'

const LegalEducationForm = () => {
    useAxiosIntercepter()
    const { state } = useLocation()
    const { type } = useParams()

    const cookies = new Cookies()
    // 데이터
    const [userData, setUserData] = useState([])
    const [detailData, setDetailData] = useState()
    const [dataBaseUserList, setDataBaseUserList] = useState([])
    // 파일, 사진
    const [files, setFiles] = useState([])
    const [pictures, setPictures] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [selectedPictures, setSelectedPictures] = useState([])
    const [submitResult, setSubmitResult] = useState(false)
    const [fileNames, setFileNames] = useState([])
    const [pictureNames, setPictureNames] = useState([])

    const [participantSelect, setParticipantSelect] = useState([])
    const [rowSelect, setRowSelect] = useState([])
    const [load, setLoad] = useState(false)
    const [tempCheck, setTempCheck] = useState(true)
    const [show, setShow] = useState(false)
    const [showTemp, setShowTemp] = useState(false)
    const [modal, setModal] = useState(false)
    const now = moment().format('YYYY-MM-DD')

    const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
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

    const participantColumn = [
        {
            name:'직종',
            width:'25%',
            cell: row => <div key={row.id} id={row.id} style={{ width:'100%', textAlign: 'left' }}>{row.class}</div>
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
                    <Col md='3' className='form-check form-check-inline' key={`user__${user}${index}`}>
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
    ] 

    const handleFileInputChange = (e) => {
        handleFileInputLimitedChange(e, files, setFiles, 6, fileNames, setFileNames, setSelectedFiles)
    }

    const handlePictureInputChange = (e) => {
        handleFileInputLimitedChange(e, pictures, setPictures, 2, pictureNames, setPictureNames, setSelectedPictures, '이미지 파일', 20000000, '20MB 이하의 이미지를 업로드 하세요.')
    }

    const onRemoveFile = (file) => {
        const updatedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file)
        setSelectedFiles(updatedFiles)
        setFiles(updatedFiles)
    }

    const onRemovePicture = (file) => {
        const updatedPictures = selectedPictures.filter((selectedFile) => selectedFile !== file)
        setSelectedPictures(updatedPictures)
        setPictures(updatedPictures)
    }

    const onPastRemoveFile = (file) => {
        setFileNames(fileNames.filter((element) => element !== file))
    }

    const onPastRemovePicture = (file) => {
        setPictureNames(pictureNames.filter((element) => element !== file))
    }

    const onSubmit = (data) => {
        const matchingFileIds = []
        if (state.type === 'modify') {
            fileNames.map((id) => matchingFileIds.push(id.id))
            pictureNames.map((id) => matchingFileIds.push(id.id))
        }
        const pageType = state.type
		const formData = new FormData()
        setFormData(data, formData)

        const employeeList = []
        userData.map(data => {
            data.employee.map(employee => {
                if (employee.default === true) {
                    employeeList.push(employee)
                }
            })
        })

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append('doc_files', files[i])
              }
        } else {
            formData.append('doc_files', [''])
        }

        if (pictures.length > 0) {
            for (let i = 0; i < pictures.length; i++) {
                formData.append('doc_pictures', pictures[i])
              }
        } else {
            formData.append('doc_pictures', [''])
        }
        
        formData.append('user_id', cookies.get("userId"))
        formData.append('property', cookies.get("property").value)
        formData.append('old_files_id', matchingFileIds)
        formData.append('start_date', data.date[0])
        formData.append('end_date', data.date[1])
        formData.append('employee_list', JSON.stringify(employeeList))
        formData.append('type', type)
        const API = pageType === 'register' ? API_EDUCATION_FORM
										: `${API_EDUCATION}/${state.id}`
        axiosPostPut(pageType, titleObj[type], API, formData, setSubmitResult)
    }
    const toggle = () => setModal(!modal)

    
    useEffect(() => {
        const paramCooperator = {
            propId: cookies.get("property").value,
            companyType:'cooperate',
            //companyType:'협력',
            cooperate: true
        }
        const param = {
            propId: cookies.get("property").value
        }
        const selectParam = type !== 'cooperator' ? param : paramCooperator
        if (type !== undefined) {
            getTableDataCallback(API_EDUCATION_EMPLOYEE_LIST, selectParam, (data) => {
                const tempUserList = []
                data.map(data => data.employee.map(employee => tempUserList.push(employee.id)))
                setDataBaseUserList(tempUserList)
                setUserData(data)
            })
            setShow(true)
            if (state.type === 'register') {
                setShowTemp(true)
            }
        }
    }, [])

    useEffect(() => {
        if (state.type === 'modify') {
            getTableDataCallback(`${API_EDUCATION_DETIAL_MODIFY}/${state.id}`, {}, (data) => {
                setDetailData(data)
                const fileNamesList = []
                const pictureNamesList = []
                data[0].education.education_files.map((file) => {
                if (file.type === 'file') {
                    fileNamesList.push({id: file.id, name: file.original_file_name})
                } else {
                    pictureNamesList.push({id: file.id, name: file.original_file_name})
                }
                })
                setFileNames(fileNamesList)
                setPictureNames(pictureNamesList)
            })
        }
    }, [])

    useEffect(() => {
        let count = 0
        userData.map(data => {
            data.employee.map(employee => {
                if (employee.default === true) {
                    count++
                }
            })
        })
        setValue("target_count", count)
	}, [userData, rowSelect, participantSelect])

    useEffect(() => {
        // 파일
        const inputFileElement = document.getElementById("doc_file")
        inputFileElement.value = ""
        
        const dataFileTransfer = new DataTransfer()
        for (let i = 0; i < files.length; i++) {
            dataFileTransfer.items.add(files[i])
        }
        inputFileElement.files = dataFileTransfer.files
        // 사진
        const inputElement = document.getElementById("doc_picture")
        inputElement.value = ""
        
        const dataTransfer = new DataTransfer()
        for (let i = 0; i < pictures.length; i++) {
            dataTransfer.items.add(pictures[i])
        }
        inputElement.files = dataTransfer.files
    }, [files, pictures])

    useEffect(() => {
        if (submitResult) {
            if (state.type === 'modify') {
                window.location.href = `${ROUTE_EDUCATION}/${type}/detail/${state.id}`
			} else {
                window.location.href = `${ROUTE_EDUCATION}/${type}`
			}
		}
	}, [submitResult])

    useEffect(() => {
        if (detailData) {
            const date = detailData[0].education.start_date.split('~')
            setValue('subject', detailData[0].education.subject)
            setValue("date", [date[0], date[1]])
            setValue("training_time", detailData[0].education.training_time)
            setValue('target_count', detailData[0].education.target_count)
            setValue("comment", detailData[0].education.comment)
            if (userData) {
                const participants = detailData[0].participants
                const copyUserData = [...userData]
                const checkList = [] //전체선택
                const userTrueList = [] //개별선택

                copyUserData.map((data, index) => {
                    participants.map(participant => {
                        if (participant.belong === null) {
                            if (data.class === participant.employee_class) {
                                data.employee.map(user => {
                                    const name = participant.participant_name.split('(')
                                    if (user.name === name[0]) {
                                        user.default = true
                                        user.base_id = participant.id
                                        userTrueList.push(user.id)
                                        if (!checkList.includes(data.id)) {
                                            checkList.push(data.id)
                                        }
                                    }
                                })
                            }
                        } else {
                            if (!copyUserData.find(data => data.class === participant.employee_class)) {
                                const id = Math.max(...copyUserData.map(data => data.id)) + 1
                                const nonmember = {
                                    id: id,
                                    type: 'nonmember',
                                    class: participant.employee_class,
                                    checked: false,
                                    employee: []
                                }
                                copyUserData.push(nonmember)
                            }
                        }
                    })
                })
                if (copyUserData.length > 0) {
                    let userId = Math.max(...dataBaseUserList) + 1
                    participants.map(participant => {
                        if (participant.belong !== null) {
                            if (copyUserData.find(data => data.class === participant.employee_class)) {
                                const filterTemp = copyUserData.find(data => data.class === participant.employee_class)
                                // 수정시 비회원 등록할때 이미등록된 데이터가 또 등록되는걸 막기 위해
                                if ((filterTemp.employee.length === 0) || (!filterTemp.employee.find(user => user.base_id === participant.id))) {
                                    filterTemp['employee'].push({
                                        id: userId,
                                        base_id: participant.id,
                                        name: participant.participant_name,
                                        username: null,
                                        default: true,
                                        employee_level: participant.employee_level,
                                        employee_class: participant.employee_class,
                                        belong: participant.belong
                                    })
                                    userId+=1
                                    if (!checkList.includes(filterTemp.id)) {
                                        checkList.push(filterTemp.id)
                                    }
                                }
                            }
                        }
                    })
                }
                const rowResult = []
                copyUserData.map(data => {
                    checkList.map(id => {
                        if (data.id === id) {
                            console.log("data", data)
                            const count = data.employee.filter(data => data.default === true).length
                            if (count === data.employee.length) {
                                rowResult.push(data.id)
                                data.checked = true
                            }
                        }
                        setShowTemp(true)
                    })
                })
                setUserData(copyUserData)
                setRowSelect(rowResult)
                setParticipantSelect(userTrueList)
                setShow(true)
            }
        }
    }, [detailData, dataBaseUserList])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle={`${bigTitleObj[type]}`} breadCrumbParent='교육관리' breadCrumbParent2='교육' breadCrumbActive={`${titleObj[type]}`} />
                </div>
            </Row>
            <Card>
                <CardHeader>
					<CardTitle className="title">
                        {bigTitleObj[type]}&nbsp;{state.type === 'register' ? '등록' : '수정'}
					</CardTitle>
				</CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className='card_table'>
                            <Col md='6'>
                                <div className="mb-1">
                                    <Col className='card_table col text' style={{paddingBottom:0}}>
                                        <div>교육명</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                    name='subject'
                                    control={control}
                                    render={({ field }) => (
                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                            <Row style={{width:'100%'}}>
                                                <Input maxLength={98} style={{width:'100%'}} bsSize='lg' invalid={errors.subject && true} {...field}/>
                                                {errors.subject && <FormFeedback style={{paddingLeft:0}}>{errors.subject.message}</FormFeedback>}
                                            </Row>
                                        </Col>
                                    )}/>
                                </div>
                            </Col>
                            <Col md='6'>
                                <div className="mb-1">
                                    <Col className='card_table col text' style={{paddingBottom:0}}>
                                        <div>교육일자</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                        id = 'date'
                                        name='date'
                                        control={control}
                                        render={({ field : {onChange, value}}) => (
                                            <Col lg='12' xs='12' md='12' className='card_table col text' style={{flexDirection:'column'}}>
                                                <Row style={{width:'100%', height:'100%'}}>
                                                    <Flatpickr
                                                        style={{height:'45.99px'}}
                                                        id='range-picker'
                                                        className= {`form-control ${errors.date ? 'is-invalid' : ''}`}
                                                        value={value}
                                                        onChange={(data) => {
                                                            onChange(setStringDate(data))
                                                        }}
                                                        options={{
                                                        mode: 'range',
                                                        dateFormat: 'Y-m-d',
                                                        locale: Korean
                                                        }}
                                                        placeholder={`${now} ~ ${now}`}
                                                    />
                                                    {errors.date && <div  style={{color:'#ea5455', fontSize:'0.857rem', paddingLeft:0, marginTop:'0.25rem'}}>{errors.date.message}</div>}
                                                </Row>
                                            </Col>
                                        )}/>
                                </div>
                            </Col>
                        </Row>
                        <Row className='card_table'>
                            <Col md='6'>
                                <div className="mb-1">
                                    <Col className='card_table col text' style={{paddingBottom:0}}>
                                        <div>교육시간</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                    name='training_time'
                                    control={control}
                                    render={({ field }) => (
                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                            <Row style={{width:'100%'}}>
                                                <InputGroup size='lg'  style={{padding: 'inherit'}}>
                                                    <Input bsSize='lg' invalid={errors.training_time && true} {...field}/>
                                                    <InputGroupText style={{borderTopRightRadius:'0.357rem', borderBottomRightRadius:'0.357rem', borderLeft:'none'}}>{'시간'}</InputGroupText>
                                                    {errors.training_time && <FormFeedback>{errors.training_time.message}</FormFeedback>}
                                                </InputGroup>
                                            </Row>
                                        </Col>
                                    )}/>
                                </div>
                            </Col>
                            <Col md='6'>
                                <div className="mb-1">
                                    <Col className='card_table col text' style={{paddingBottom:0}}>
                                        <div>교육인원</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                    name='target_count'
                                    control={control}
                                    render={({ field }) => (
                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                            <Row style={{width:'100%'}}>
                                                <InputGroup size='lg'  style={{padding: 'inherit'}}>
                                                    <Input bsSize='lg' invalid={errors.target_count && true} {...field} disabled/>
                                                    <InputGroupText style={{borderTopRightRadius:'0.357rem', borderBottomRightRadius:'0.357rem', borderLeft:'none'}}>{'명'}</InputGroupText>
                                                    {errors.target_count && <FormFeedback>{errors.target_count.message}</FormFeedback>}
                                                </InputGroup>
                                            </Row>
                                        </Col>
                                    )}/>
                                </div>
                            </Col>
                        </Row>
                        <Row className='card_table'>
                            <Col md='6'>
                                <div className="mb-1">
                                    <Col className='card_table col text' style={{ paddingTop:0, paddingBottom:'1%'}}>
                                        첨부파일
                                    </Col>
                                    <Input type="file" id="doc_file" name="doc_file" accept=".pdf,.hwp,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv,.txt"  bsSize='lg' multiple onChange={handleFileInputChange}  />
                                </div>
                                <div className="mb-1">
                                    <div className='form-control hidden-scrollbar' style={{ height: '46.2px', display: 'flex', alignItems: 'center', whiteSpace:'nowrap', overflow:'auto' }}>
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
                                            })
                                        }
                                        { state.type === 'modify' && detailData && detailData[0].education.education_files.length > 0 && 
                                            fileNames.map((file, idx) => {
                                                const ext = file.name.split('.').pop()
                                                return (
                                                    <span key={idx} className="mx-0 px-0">
                                                        <FileIconImages
                                                            ext={ext}
                                                            file={file}
                                                            filename={file.name}
                                                            removeFunc={onPastRemoveFile}
                                                        />
                                                    </span>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </Col>
                            <Col md='6'>
                                <div className="mb-1">
                                    <Col className='card_table col text' style={{ paddingTop:0, paddingBottom:'1%'}}>
                                        첨부사진
                                    </Col>
                                    <Input type="file" id="doc_picture" name="doc_picture" accept="image/*" bsSize='lg' multiple onChange={handlePictureInputChange}  />
                                </div>
                                <div className="mb-1">
                                    <div className='form-control hidden-scrollbar' style={{ height: '46.2px', display: 'flex', alignItems: 'center', whiteSpace:'nowrap', overflow:'auto' }}>
                                        {selectedPictures && selectedPictures.length > 0 &&
                                            selectedPictures.map((file, idx) => {
                                                const ext = file.name.split('.').pop()
                                                return (
                                                    <span key={`file_${idx}`} className="mx-0 px-0">
                                                        <FileIconImages
                                                            ext={ext}
                                                            file={file}
                                                            filename={file.name}
                                                            removeFunc={onRemovePicture}
                                                        />
                                                    </span>
                                                )
                                            })
                                        } 
                                        { state.type === 'modify' && detailData && detailData[0].education.education_files.length > 0 && 
                                            pictureNames.map((file, idx) => {
                                                const ext = file.name.split('.').pop()
                                                return (
                                                    <span key={idx} className="mx-0 px-0">
                                                        <FileIconImages
                                                            ext={ext}
                                                            file={file}
                                                            filename={file.name}
                                                            removeFunc={onPastRemovePicture}
                                                        />
                                                    </span>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className='card_table'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div>교육 내용</div>&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <Controller
                                name='comment'
                                control={control}
                                render={({ field }) => (
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%'}}>
                                            <Input type="textarea" style={{minHeight: '6em', width: '100%' }} invalid={errors.comment && true} {...field}/>
                                            {errors.comment && <FormFeedback>{errors.comment.message}</FormFeedback>}
                                        </Row>
                                    </Col>
                                )}/>
                            </div>
                        </Row>
                        <CardHeader>
                            <CardTitle className="title">
                                수강자 목록 
                            </CardTitle>
                            <Button color='primary' className="ms-1" onClick={toggle}>비직원등록</Button>
                        </CardHeader>
                            <Row className='card_table'>
                            { show && showTemp ? 
                                <EducationDataTable 
                                    selectType={true}
                                    columns={participantColumn}
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
                                { state.type === 'modify' &&
                                    <Button color='report' 
                                        className="ms-1"
                                        tag={Link} 
                                        to={`${ROUTE_EDUCATION}/${type}/detail/${state.id}`} 
                                        >취소</Button>
                                }
                                <Button type='submit' className="ms-1" color='primary'>{state.type === 'register' ? '저장' : '수정'}</Button>
                                <Button //color='primary' 
                                    className="ms-1"
                                    tag={Link} 
                                    to={`${ROUTE_EDUCATION}/${type}`}
                                    >목록</Button>
                            </Fragment>
                        </CardFooter>
                    </Form>
                    <AddModal 
                        formModal={modal}
                        setFormModal={setModal}
                        userData={userData}
                        setUserData={setUserData}
                        dataBaseUserList={dataBaseUserList}
                        setDataBaseUserList={setDataBaseUserList}
                        rowSelect={rowSelect}
                        setRowSelect={setRowSelect}
                        />
                </CardBody>
            </Card>
        </Fragment>
    )
}
export default LegalEducationForm