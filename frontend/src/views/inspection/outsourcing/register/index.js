import Cookies from 'universal-cookie'
import * as moment from 'moment'
import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, Col, Input, Row, FormFeedback, Form, CardFooter } from "reactstrap"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { validationSchemaReport, reportNumberList } from './ReportData'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { ROUTE_INSPECTION_OUTSOURCING, API_EMPLOYEE_DETAIL, API_INSPECTION_OUTSOURCING_REGISTER, API_INSPECTION_OUTSOURCING_DETAIL, ROUTE_INSPECTION_OUTSOURCING_DETAIL, API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS } from '../../../../constants'
import ReportSignModal from '../../../Report/form/ReportSignModal'
import { getTableData, formatDateTimeWithDay, checkSelectValue, makeSelectList, checkSelectValueObj, axiosPostPutNavi, handleFileInputLimitedChange, getTableDataCallback } from '../../../../utility/Utils'
import Select from 'react-select'
import { isEmptyObject } from 'jquery'
import FileIconImages from '../../../apps/customFiles/FileIconImages'

const OutSourcingRegister = () => {
    useAxiosIntercepter()
    const navigate = useNavigate()
    const cookies = new Cookies()
    const { state } = useLocation()
    require('moment/locale/ko')
    const now = moment().subtract(0, 'days')
    const [userData, setUserData] = useState([])
    const [detailData, setDetailData] = useState()
    const [paperNumber, setPaperNumber] = useState('')

    const [files, setFiles] = useState([])
    const [showNames, setShowNames] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [submitResult, setSubmitResult] = useState(false)
    
    const [employeeClassList, setEmployeeClassList] = useState([])
	const [selectError, setSelectError] = useState({emp_class: false})
	const {emp_class} = selectError
    
    const [isCollect, setIsCollect] = useState(false)
    const [orignUserSign, setOrignUserSign] = useState([cookies.get("userId"), 0, 0, 0])
    const [orignSignType, setOrignSignType] = useState([1, 3, 3, ''])
    const [userSign, setUserSign] = useState([cookies.get("userId"), 0, 0, 0])
    const [signType, setSignType] = useState([1, 3, 3, ''])
    const [isOpen, setIsOpen] = useState(false)
    const [inputData, setInputData] = useState([])

    const defaultValues = {
        emp_class: {label:'선택', value:''},
        accidentTitle: '',
        title: '',
        section1:''
    }

    const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm({
        defaultValues,
        resolver: yupResolver(validationSchemaReport)
	})

    const handleSelectValidation = (e, event) => { 
		checkSelectValue(e, event, selectError, setSelectError, setValue) 
	}

    const handleFileInputChange = (e) => {
		handleFileInputLimitedChange(e, files, setFiles, 6, showNames, setShowNames, setSelectedFiles)
    }

    const handleButtonClick = (inputId) => {
		const fileInput = document.getElementById(`${inputId}`)
		if (fileInput) {
		  fileInput.click()
		}
	}

    const onRemoveFile = (file) => {
        const updatedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file)
        setSelectedFiles(updatedFiles)
        setFiles(updatedFiles)
    }

    const onPastRemoveFile = (file) => {
        setShowNames(showNames.filter((element) => element !== file))
    }

    const onSubmit = (data) => {
        const formData = new FormData()
        //후에 양식 번호 추가해야함
        const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }

        formData.append('title', data.title)
        formData.append('prop_id', cookies.get('property').value)
        formData.append('user_id', cookies.get("userId"))
        formData.append('emp_class_id', data.emp_class.value)
        formData.append('site_name', data.accidentTitle)
        formData.append('create_datetime', now.format('YYYY-MM-DDTHH:mm:ss.SSSZ'))
        formData.append('report_content', data.section1)
        formData.append('is_rejected', 0)
        
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i])
              }
        } else {
            formData.append('files', [''])
        }

        if (state.type === 'modify' || isCollect) {
            let matchingIds = []
            formData.append('outsourcing_id', state.id)
            matchingIds = showNames.map((id) => id.id)
            formData.append('old_files_id', matchingIds)
            if (!isCollect) {
                axiosPostPutNavi('modify', '외주점검', API_INSPECTION_OUTSOURCING_DETAIL, formData, navigate, ROUTE_INSPECTION_OUTSOURCING)
                return
            }
        }

        if (state.type === 'register' || isCollect) {
            setInputData(formData)
            setIsOpen(true)
        }
    }        
    useEffect(() => {
        const inputElement = document.getElementById("doc_file")
        inputElement.value = ""
        
        const dataTransfer = new DataTransfer()
        for (let i = 0; i < files.length; i++) {
            dataTransfer.items.add(files[i])
        }
        inputElement.files = dataTransfer.files
    }, [files])

    //select options make
    const getSelectList = (data) => {
        makeSelectList(true, '', data, employeeClassList, setEmployeeClassList, ['name'], 'id')
    }

    const getModifyDetailData = (data) => {
        setDetailData(data)
        setShowNames(data.report_files.map((file) => ({id: file.id, name: file.original_file_name})))

        setIsCollect(data?.is_rejected === 2)
        state['reportType'] = 'outsourcing'
        const tempSignList = data?.sign_lines
        const tempSignType = []
        const tempSignIdList = []
        if (Array.isArray(tempSignList)) {
            tempSignList.forEach(user => {
                tempSignType.push(user.type)
                tempSignIdList.push(user.user)
            })
            setSignType(tempSignType)
            setUserSign(tempSignIdList)
            setOrignUserSign(tempSignType)
            setOrignSignType(tempSignIdList)
        }
    }

    useEffect(() => {
        getTableDataCallback(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, {property_id: cookies.get('property').value}, getSelectList)
        if (state.type === 'register') {
            setValue('accidentTitle', cookies.get('property').label)
            getTableData(API_EMPLOYEE_DETAIL, {userId:cookies.get('userId')}, setUserData)
            getTableData(API_INSPECTION_OUTSOURCING_REGISTER, {prop_id : cookies.get('property').value }, setPaperNumber)
        } 
        if (state.type === 'modify') {
            getTableDataCallback(API_INSPECTION_OUTSOURCING_DETAIL, {outsourcing_id : state.id}, getModifyDetailData)
        } 
    }, [])

    useEffect(() => {
        if (!isEmptyObject(errors)) {
            checkSelectValueObj(control, selectError, setSelectError)
        }
    }, [errors])

    useEffect(() => {
        if (submitResult && (state.type === 'register' || isCollect)) {
            window.location.href = ROUTE_INSPECTION_OUTSOURCING
        } 
	}, [submitResult])

    useEffect(() => {
        if (detailData) {
            setValue('title', detailData.title)
            setValue('accidentTitle', detailData.site_name)
            setValue('section1', detailData.report_content)
            setValue('emp_class', {label: detailData.emp_class && detailData.emp_class.code, value: detailData.emp_class && detailData.emp_class.id})
        }
	}, [detailData])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='외주점검' breadCrumbParent='점검관리' breadCrumbActive='외주점검'/>
                </div>
            </Row>
            <Card>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <CardBody>
                        <Row className='mb-1'>
                            <Col xs='12'>
                                <Row className='card_table table_row'>
                                    <Controller
                                        name='title'
                                        control={control}
                                        render={({ field }) => (
                                        <Col className='card_table col text' style={{flexDirection:'column'}}>
                                            <Row style={{width:'100%'}}>
                                                <Input 
                                                    style={{width: '100%', minHeight: '4rem'}} 
                                                    bsSize='lg' 
                                                    maxLength={498}
                                                    invalid={errors.title && true} 
                                                    {...field}
                                                    placeholder='제목을 입력해주세요.'/>
                                                {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                                            </Row>
                                        </Col>
                                    )}/>
                                </Row>
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
                                                                        <Input style={{width:'100%'}} bsSize='sm' invalid={errors.paperNumber && true} readOnly defaultValue={paperNumber}/>
                                                                    }
                                                                    { (state.type === 'modify') && detailData &&
                                                                        <Input style={{width:'100%'}} bsSize='sm' invalid={errors.paperNumber && true} readOnly defaultValue={detailData.id}/>
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
                                                    <Controller
                                                        name='reportNumber'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                                <Row style={{width:'100%'}}>
                                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                        <Row style={{width:'100%'}}>
                                                                            <Input style={{width:'100%'}} bsSize='sm' invalid={errors.reportNumber && true} {...field} defaultValue={reportNumberList[state.reportType]} readOnly/>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                    )}/>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md='12' xs='12' className="mb-1">
                                        <Row className='card_table top' style={{borderTop:0, borderBottom:0}}>
                                            <Col md='6' xs='12'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3', borderTop:'1px solid #B9B9C3'}}>
                                                        <div>작성일자</div>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text center' style={{borderTop: '1px solid #B9B9C3'}}>
                                                        <Row style={{width:'100%'}}>
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width:'100%'}}>
                                                                    {}
                                                                    {state.type === 'register' &&
                                                                        now.format('YYYY-MM-DD (dddd)')
                                                                    }
                                                                    {state.type === 'modify' && detailData && detailData.create_datetime &&
                                                                       formatDateTimeWithDay(detailData.create_datetime) 
                                                                    }
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md='6' xs='12'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3', borderTop:'1px solid #B9B9C3'}}>
                                                        <div>작성자</div>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text center'  style={{borderTop:'1px solid #B9B9C3'}}>
                                                        <Row style={{width:'100%'}}>
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width:'100%'}}>
                                                                    {state.type === 'register' && userData && userData.username &&
                                                                        `${userData.username}(${userData.name})`
                                                                    }
                                                                    { state.type === 'modify' && detailData && 
                                                                        `${detailData.username}(${detailData.user})`
                                                                    }
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className='card_table mid' style={{borderTop:0}}>
                                            <Col md='6' xs='12'>
                                                <Row className='card_table table_row' style={{justifyContent:'center'}}>
                                                    <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3', borderTop: '1px solid #B9B9C3'}}>
                                                        <div>현장명</div>&nbsp;
							                            <div className='essential_value'/>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text center p-0 ' style={{borderTop: '1px solid #B9B9C3'}}>
                                                        <Row style={{width:'100%'}}>
                                                            <Controller
                                                                name='accidentTitle'
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Col lg='10' md='10' xs='10' className='card_table col text center' style={{width:'100%'}}>
                                                                        <Row style={{width:'100%'}}>
                                                                            <Col lg='12' xs='12'className='card_table col text start border_none text-start' style={{flexDirection:'column', alignItems:'center', padding:0, width:'100%'}}>
                                                                                <Input 
                                                                                    style={{width:'100%'}} 
                                                                                    maxLength={48}
                                                                                    bsSize='sm' 
                                                                                    invalid={errors.accidentTitle && true} 
                                                                                    {...field}
                                                                                    />
                                                                                {errors.accidentTitle && <FormFeedback>{errors.accidentTitle.message}</FormFeedback>}
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                )}
                                                            />
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md='6' xs='12'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3', borderTop:'1px solid #B9B9C3'}}>
                                                        <div>직종</div>&nbsp;
							                            <div className='essential_value'/>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text center p-0' style={{borderTop:'1px solid #B9B9C3'}}>
                                                        <Row style={{width:'100%'}}>
                                                            <Controller
                                                                id='emp_class'
                                                                name='emp_class'
                                                                control={control}
                                                                render={({ field: { value } }) => (
                                                                <Col xs={12} md={12} className='card_table col text start text-start' style={{flexDirection:'column', alignItems:'start'}}>
                                                                    <Select 
                                                                        id='emp_class'
                                                                        name='emp_class'
                                                                        autosize={true}
                                                                        className="react-select custom-select-emp_class custom-react-select"
                                                                        classNamePrefix='select'
                                                                        options={employeeClassList}
                                                                        defaultValue={employeeClassList[0]}
                                                                        value={value}
                                                                        onChange={handleSelectValidation}
                                                                    />
                                                                    {emp_class && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
                                                                </Col>
                                                            )}/>
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
                                    <div style={{fontSize:'21px'}}>보고 내용</div>&nbsp;
							        <div className='essential_value'/>
                                </Col>
                                <Controller
                                    name='section1'
                                    control={control}
                                    render={({ field }) => (
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%'}}>
                                            <Input 
                                                type="textarea" 
                                                style={{minHeight: '35em', width: '100%' }} 
                                                invalid={errors.section1 && true} 
                                                {...field}
                                            />
                                            {errors.section1 && <FormFeedback>{errors.section1.message}</FormFeedback>}
                                        </Row>
                                    </Col>
                                )}/>
                            </div>
                        </Row>
                        <Row className='card_table'>
                            <div>
                                <Col className='card_table col text'>
                                    <div style={{fontSize:'21px'}}>첨부 자료</div>
                                </Col>
                            </div>
                            <div className="mb-1">
                                <div className='form-control hidden-scrollbar' style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',  overflow:'auto' }}>
                                    <Input type="file" id="doc_file" name="doc_file"  multiple onChange={handleFileInputChange} style={{ display: 'none'}}/>
                                    <Button color='primary' onClick={() => handleButtonClick('doc_file')} style={{ transform: 'rotate(0deg)', whiteSpace: 'nowrap', marginRight:'1%' }}>파일 선택</Button>
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
                                    { (state.type === 'modify') && detailData  && 
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
                            setSubmitResult={setSubmitResult}
                            state={state}
                            API = {!isCollect ? API_INSPECTION_OUTSOURCING_REGISTER : API_INSPECTION_OUTSOURCING_DETAIL}
                            orignUserSign={orignUserSign}
                            orignSignType={orignSignType}
                        />
                        <CardFooter style={{display : 'flex', justifyContent:'end', borderTop: '1px solid #dae1e7', paddingRight: 0}}>
                            <Fragment >
                                <Col md='7' style={{display:'flex', justifyContent:'end'}}>
                                    { state.type === 'modify' &&
                                        <Button color='report' 
                                        className="ms-1"
                                        tag={Link} 
                                        to={`${ROUTE_INSPECTION_OUTSOURCING_DETAIL}/${state.id}`} 
                                        state={{
                                            key: 'anouncement'
                                        }} >취소</Button>
                                    }
                                    <Button className="ms-1" type='submit' color='primary'>{ (state.type === 'register') ? '저장' : '수정'}</Button>
                                    <Button 
                                        className="ms-1"
                                            tag={Link} 
                                            to={ROUTE_INSPECTION_OUTSOURCING}
                                            state={{
                                                key: 'dailyReport'
                                            }} >목록</Button>
                                </Col>
                            </Fragment>
                        </CardFooter>
                    </CardBody>
                </Form>
            </Card>
        </Fragment>
    )

}
export default OutSourcingRegister