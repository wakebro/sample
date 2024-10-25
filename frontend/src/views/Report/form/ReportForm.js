import axios from 'axios'
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, Col, Input, Row, FormFeedback, Form, CardFooter, Badge } from "reactstrap"
import { API_EMPLOYEE_DETAIL, ROUTE_REPORT_TOTAL, API_REPORT_FORM, API_REPORT_LIST, ROUTE_REPORT_FORM, API_REPORT_DETAIL, ROUTE_REPORT_DETAIL } from "../../../constants"
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { setFormData, axiosPostPut, handleFileInputLimitedChange, primaryColor, getTableDataCallback, getTableData } from '../../../utility/Utils'
import { reportTypeList, validationSchemaReport, reportNumberList, PaperNumberGetData, reportFormDefaultValues } from '../ReportData'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import ReportSignModal from './ReportSignModal'
import Swal from "sweetalert2"
import { warningAlert } from '../../inspection/data'
import FileIconImages from '../../apps/customFiles/FileIconImages'

const InspectionReportForm = () => {
    useAxiosIntercepter()
    const navigate = useNavigate()
    const cookies = new Cookies()
    const { state } = useLocation()
    require('moment/locale/ko')
    const now = moment().subtract(0, 'days')
    const [userData, setUserData] = useState([])
    const [detailData, setDetailData] = useState([])
    const [paperNumber, setPaperNumber] = useState('')

    const [files, setFiles] = useState([])
    const [showNames, setShowNames] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [submitResult, setSubmitResult] = useState(false)
    
    const [inputTitle, setInputTitle] = useState('')
    const [inputAccidentTitle, setInputAccidentTitle] = useState('')
    const [inputSection1, setInputSection1] = useState('')

    const [orignUserSign, setOrignUserSign] = useState([cookies.get("userId"), 0, 0, 0])
    const [orignSignType, setOrignSignType] = useState([1, 3, 3, ''])
    const [userSign, setUserSign] = useState([cookies.get("userId"), 0, 0, 0])
    const [signType, setSignType] = useState([1, 3, 3, ''])
    const [isOpen, setIsOpen] = useState(false)
    const [inputData, setInputData] = useState([])

    const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm({
		defaultValues: reportFormDefaultValues,
		resolver: yupResolver(validationSchemaReport)
	})

    const handleFileInputChange = (e) => {
        handleFileInputLimitedChange(e, files, setFiles, 6, showNames, setShowNames, setSelectedFiles)
    }

    const handleButtonClick = (inputId) => {
		const fileInput = document.getElementById(`${inputId}`)
		if (fileInput) {
		  fileInput.click()
		}
	}

    // 새로 업로드한 부분 삭제
    const onRemoveFile = (file) => {
        const updatedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file)
        setSelectedFiles(updatedFiles)
        setFiles(updatedFiles)
    }
    // 과거의 파일 리스트중 삭제
    const onPastRemoveFile = (file) => {
        setShowNames(showNames.filter((element) => element !== file))
    }

    const handleResetConfirmation = (event) => {
        event.preventDefault()
        Swal.fire({
            html: `전체 내용을 초기화 하시겠습니까?`,
            icon: 'warning',
            customClass: {
                confirmButton: 'btn btn-primary',
                actions: `sweet-alert-custom center`
            }
        }).then(res => {
            if (res.isConfirmed === true) {
                navigate(ROUTE_REPORT_FORM, {state: {type:'register', reportType:state.reportType}})
            }
        })
    }

    const handleTemporarySubmit = (event) => {
        event.preventDefault()
        Swal.fire({
            icon: "warning",
            html: "임시저장 하시겠습니까?. <br/> 작성한 정보가 임시저장됩니다.",
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "취소",
            confirmButtonText: '확인',
            confirmButtonColor : primaryColor,
            reverseButtons :true,
            customClass: {
                actions: 'sweet-alert-custom right',
                cancelButton: 'me-1'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                let pageType = state.type 

                if (pageType === 'temporary') {
                    pageType = 'modify'
                }
                let matchingIds = []
                if (pageType === 'modify') {
                    matchingIds = showNames.map((id) => id.id)
                }
                const formData = new FormData()

                // 임시 저장이라도 필수 값은 체크?
                // 일단은 table에 저장시 제목이 필수 값이므로 임시 값을 만드는 형태로 변경
                formData.append('title', inputTitle ? inputTitle : `임시저장_${reportTypeList[state.reportType]}보고서_${paperNumber ? paperNumber : state.id}`)
                formData.append('accident_title', inputAccidentTitle ? inputAccidentTitle : '')
                formData.append('section_1', inputSection1 ? inputSection1 : '')

                formData.append('write_datetime', now.format('YYYY-MM-DDTHH:mm:ss.SSSZ'))
                if (files.length > 0) {
                    for (let i = 0; i < files.length; i++) {
                        formData.append('doc_files', files[i])
                    }
                } else {
                    formData.append('doc_files', [''])
                }
                formData.append('propertyId', cookies.get('property').value)
                formData.append('user_id', cookies.get("userId"))
                formData.append('main_purpose', state.reportType)
                formData.append('old_files_id', matchingIds)
                formData.append('sign_list', [])
                formData.append('sign_type_list', [])
                formData.append('is_final', false)
                
                const API = state.id === undefined ? API_REPORT_FORM : `${API_REPORT_DETAIL}/${state.id}`
                axios({
                    method: pageType === 'register' ? 'post' : 'put',
                    url: API,
                    data: formData
                }).then(res => {
                    if (res.status === 200) {
                        Swal.fire({
                            icon: "success",
                            html: "임시저장 성공적으로 완료하였습니다.!",
                            customClass: {
                                confirmButton: 'btn btn-primary',
                                actions: `sweet-alert-custom center`
                            }
                        }).then(res => {
                            if (res.isConfirmed === true) {
                                setSubmitResult(true)
                            }
                        })
                    } else {
                        warningAlert()
                    }
                })
            } else if (result.dismiss) {
                Swal.fire({
                    icon: "info",
                    html: "취소하였습니다.",
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
        }) // then end
    } // temp save end

    const onSubmit = (data) => {
        const formData = new FormData()
        console.log(data)
        setFormData(data, formData)
        formData.append('write_datetime', now.format('YYYY-MM-DDTHH:mm:ss.SSSZ'))
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append('doc_files', files[i])
                }
        } else {
            formData.append('doc_files', [''])
        }

        formData.append('propertyId', cookies.get('property').value)
        formData.append('user_id', cookies.get("userId"))
        formData.append('main_purpose', state.reportType)
        formData.append('is_final', true)
        formData.append('is_rejected', 0)

        if (state.type !== 'register') {
            let matchingIds = []
            matchingIds = showNames.map((id) => id.id)
            formData.append('old_files_id', matchingIds)
        }

        if (state.type === 'modify') { // 반려 후 수정
            const pageType = state.type
            let matchingIds = []
            matchingIds = showNames.map((id) => id.id)
            formData.append('old_files_id', matchingIds)

            const API = `${API_REPORT_DETAIL}/${state.id}`
            axiosPostPut(pageType, `${reportTypeList[state.reportType]}보고서`, API, formData, setSubmitResult)
            return
        }

        setInputData(formData)
        setIsOpen(true)

    } // submit end

    useEffect(() => {
        const inputElement = document.getElementById("doc_file")
        inputElement.value = ""
        
        const dataTransfer = new DataTransfer()
        for (let i = 0; i < files.length; i++) {
            dataTransfer.items.add(files[i])
        }
        inputElement.files = dataTransfer.files
    }, [files])

    const getReportDetailData = (data) => {
        setDetailData(data)
        setShowNames(data.report_files.map((file) => ({id: file.id, name: file.original_file_name})))

        // 회수 후 저장 페이지
        if (state.type === 'temporary' && data.is_rejected === 2) {
            const tempSignType = []
            const tempSignIdList = []
            data.sign_lines.map(user => {
                tempSignType.push(user.type)
                tempSignIdList.push(user.user)
            })
            if (tempSignType && tempSignType.length > 0) {
                setSignType(tempSignType)
                setUserSign(tempSignIdList)
                setOrignUserSign(tempSignIdList)
                setOrignSignType(tempSignType)
            }
        }

        // 반려 후 수정 페이지
        if (state.type === 'modify') {
            const tempSignType = []
            data.sign_lines.map(user => {
                tempSignType.push(user.type)
            })
            if (tempSignType && tempSignType.length > 0) {
                setSignType(tempSignType)
            }
        }
    }

    useEffect(() => {
        if (state.type === 'register') {
            getTableData(API_EMPLOYEE_DETAIL, {userId:cookies.get('userId')}, setUserData)
            PaperNumberGetData(API_REPORT_LIST, {property:cookies.get('property').value, total:true}, setPaperNumber)
        } 
        if (state.type === 'modify' || state.type === 'temporary') {
            getTableDataCallback(`${API_REPORT_DETAIL}/${state.id}`, {}, getReportDetailData)
        }
    }, [])

    useEffect(() => {
        if (submitResult) {
            if (state.type === 'modify') {
                window.location.href = `${ROUTE_REPORT_DETAIL}/${state.id}`
			} else {
                window.location.href = ROUTE_REPORT_TOTAL
			}
		}
	}, [submitResult])

    useEffect(() => {
        if (detailData) {
            setValue('title', detailData.title)
            setValue('accident_title', detailData.accident_title)
            setValue('section_1', detailData.section_1)
            setInputTitle(detailData.title)
            setInputAccidentTitle(detailData.accident_title)
            setInputSection1(detailData.section_1)
        }
	}, [detailData])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='보고서' breadCrumbParent='보고서 관리' breadCrumbActive='보고서' />
                </div>
            </Row>
            <Card>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <CardBody>
                        <Row className='mb-1'>
                            <Col md='11' xs='9'>
                                <Row className='card_table table_row'>
                                    <Col className='card_table col text' style={{flexDirection:'column'}}>
                                        <Row style={{width:'100%'}}>
                                            <Controller
                                                name='title'
                                                control={control}
                                                render={({ field: {onChange} }) => <Input 
                                                    maxLength={498}
                                                    style={{width: '100%', minHeight: '4rem'}} 
                                                    bsSize='lg' 
                                                    invalid={errors.title && true} 
                                                    value={inputTitle || ''} 
                                                    onChange={(e) => {
                                                        const newValue = e.target.value
                                                        onChange(newValue)
                                                        setInputTitle(newValue)
                                                        }} placeholder='제목을 입력해주세요.'/>
                                            }/>
                                            {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md='1' xs='3' style={{paddingLeft:'0'}} className='d-flex align-items-center'>
                                <Badge color='light-skyblue' style={{width:'55px', height:'25px', fontSize:'15px', display:'inline-block', verticalAlign:'middle'}}>{reportTypeList[state.reportType]}</Badge>
                            </Col>
                        </Row>
                        <Row>
                            <Col  md='8' xs='12' >
                                <Row>
                                    <Col md='6' xs='12' style={{paddingBottom:'1%'}}>
                                        <Row className='card_table top' style={{borderBottom:0, borderTop:0, borderRight:0}}>
                                            <Col md='6' xs='6'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight:'1px solid #B9B9C3'}}>
                                                        <div>문서 번호</div>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                        <Row style={{width:'100%'}}>
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width:'100%'}}>
                                                                    {state.type === 'register' && paperNumber && 
                                                                        <Input style={{width:'100%'}} bsSize='sm' value={paperNumber || ''} readOnly/>
                                                                    }
                                                                    { (state.type === 'modify' || state.type === 'temporary') && detailData &&
                                                                        <Input style={{width:'100%'}} bsSize='sm' readOnly value={detailData.id || ''}/>
                                                                    }
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md='6' xs='6'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col text center' style={{ borderRight:'1px solid #B9B9C3'}}>
                                                        <div>양식 번호</div>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                        <Row style={{width:'100%'}}>
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width:'100%'}}>
                                                                    <Controller
                                                                        name='reportNumber'
                                                                        control={control}
                                                                        render={({}) => <Input 
                                                                            style={{width:'100%'}} 
                                                                            bsSize='sm' 
                                                                            invalid={errors.reportNumber && true}
                                                                            value={reportNumberList[state.reportType] || ''}
                                                                            readOnly
                                                                    />}/>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md='12' xs='12' className="mb-1">
                                        <Row className='card_table top'>
                                            <Col md='6' xs='6'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                                        <Row>작성일자</Row>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text center report-form'>
                                                        <Row style={{width:'100%'}}>
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width:'100%'}}>
                                                                    {now.format('YYYY-MM-DD (dddd)')}
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md='6' xs='6'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                                        <div>작성자</div>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text center report-form'>
                                                        <Row style={{width:'100%'}}>
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width:'100%'}}>
                                                                    {state.type === 'register' && userData &&
                                                                        `${userData.username}(${userData.name})`
                                                                    }
                                                                    {(state.type === 'modify' || state.type === 'temporary') && detailData && 
                                                                        `${detailData.username}(${detailData.user})`
                                                                    }
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className='card_table top'>
                                            <Col>
                                                <Row className='card_table table_row'>
                                                    <Col lg='2' md='2' xs='2' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                                        <div>현장명</div>
                                                    </Col>
                                                    <Col lg='10' md='10' xs='10' className='card_table col text' style={{flexDirection:'column'}}>
                                                        <Row style={{width:'100%'}}>
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', padding:0}}>
                                                                <Row style={{width:'100%'}}>
                                                                    <Controller
                                                                        name='accident_title'
                                                                        control={control}
                                                                        render={({ field: {onChange} }) => <Input 
                                                                            style={{width:'100%'}} 
                                                                            maxLength={98}
                                                                            bsSize='sm' 
                                                                            invalid={errors.accident_title && true} 
                                                                            value={inputAccidentTitle || ''}
                                                                            onChange={(e) => {
                                                                                const newValue = e.target.value
                                                                                onChange(newValue)
                                                                                setInputAccidentTitle(newValue)
                                                                            }}/>
                                                                    }/>
                                                                    {errors.accident_title && <FormFeedback>{errors.accident_title.message}</FormFeedback>}
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='card_table'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div style={{fontSize:'21px'}}>보고 내용</div>
                                </Col>
                                <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                    <Row style={{width:'100%'}}>
                                        <Controller
                                            name='section_1'
                                            control={control}
                                            render={({ field : {onChange} }) => <Input 
                                                type="textarea" 
                                                style={{minHeight: '45em', width: '100%' }} 
                                                invalid={errors.section_1 && true} 
                                                value={inputSection1 || ''} 
                                                onChange={(e) => {
                                                    const newValue = e.target.value
                                                    onChange(newValue)
                                                    setInputSection1(newValue)
                                                }}/>
                                        }/>
                                        {errors.section_1 && <FormFeedback>{errors.section_1.message}</FormFeedback>}
                                    </Row>
                                </Col>
                            </div>
                        </Row>
                        <Row className='card_table'>
                            <div>
                                <Col className='card_table col text'>
                                    <div style={{fontSize:'21px'}}>첨부 자료</div>
                                </Col>
                            </div>
                            <div className="mb-1">
                                <div className='form-control hidden-scrollbar' style={{ display: 'flex', alignItems: 'center', whiteSpace:'nowrap', overflow:'auto' }}>
                                    <Input type="file" id="doc_file" name="doc_file"  multiple onChange={handleFileInputChange} style={{ display: 'none'}}/>
                                    <Button color='primary' onClick={() => handleButtonClick('doc_file')} style={{ transform: 'rotate(0deg)', whiteSpace: 'nowrap', marginRight:'1%' }}>파일 선택</Button>
                                    { selectedFiles && selectedFiles.length > 0 &&
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
                                    { (state.type === 'modify' ||  state.type === 'temporary') && detailData && 
                                        showNames.map((file, idx) => {
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
                        </Row>
                        <ReportSignModal
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            userSign={userSign}
                            setUserSign={setUserSign}
                            signType={signType}
                            setSignType={setSignType}
                            inputData={inputData}
                            API={state.id === undefined ? API_REPORT_FORM : `${API_REPORT_DETAIL}/${state.id}`}
                            setSubmitResult={setSubmitResult}
                            state={state}
                            orignUserSign={orignUserSign}
                            orignSignType={orignSignType}
                        />
                        <CardFooter style={{display : 'flex', borderTop: '1px solid #dae1e7', justifyContent:'space-between', flexWrap:'wrap'}}>
                            <div className='report-button-mobile'>
                                {state.type === 'register' &&
                                    <Button style={{width:'100%'}} type='submit' color='report' onClick={handleResetConfirmation}>작성 내용 초기화</Button>
                                }
                            </div>
                            <div>
                                { (state.type === 'register' || state.type === 'temporary') &&
                                    <Button color='primary' onClick={handleTemporarySubmit} outline >임시저장</Button>
                                }
                                { state.type === 'modify' &&
                                    <Button color='report' 
                                        className="ms-1"
                                        tag={Link} 
                                        to={`${ROUTE_REPORT_DETAIL}/${state.id}`} 
                                        state={{
                                            key: 'anouncement'
                                        }} 
                                    >취소</Button>
                                }
                                <Button className="ms-1" type='submit' color='primary'>
                                    {/* {state.type === 'register' ? '저장' : '수정'} */}
                                    {'저장'}
                                </Button>
                                <Button 
                                    className="ms-1"
                                    tag={Link} 
                                    to={ROUTE_REPORT_TOTAL}
                                    state={{
                                        type: state.reportType ? state.reportType : state.type 
                                    }}
                                >목록</Button>
                            </div>
                        </CardFooter>
                    </CardBody>
                </Form>
            </Card>
        </Fragment>
    )

}
export default InspectionReportForm