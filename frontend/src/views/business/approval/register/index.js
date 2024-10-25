import { yupResolver } from "@hookform/resolvers/yup"
import { Fragment, useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Cookies from 'universal-cookie'
import { Col, Form, Input, Row, Button, FormFeedback, CardTitle, CardBody, Card, CardHeader } from "reactstrap"
import { Link, useNavigate, useLocation, useParams } from "react-router-dom"
import { ROUTE_BUSINESS_REQUISITION, API_BUSINESS_APPROVAL_DETAIL, API_BUSINESS_APPROVAL_LIST } from "../../../../constants"
import axios from '../../../../utility/AxiosConfig'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Flatpickr from 'react-flatpickr'
import { defaultValues, validationSchema } from '../ApprovalData'
import ApprovalSignModal from "./ApprovalSignModal"
import * as moment from 'moment'
import { 
    formatDateTime,
    addCommaNumber,
    getCommaDel,
    AddCommaOnChange,
    resultCheckFunc,
    axiosSweetAlert
} from '@utils'
import { SIGN_COLLECT, getTableData, getTableDataCallback, handleFileInputLimitedChange, setStringDate } from "../../../../utility/Utils"
import FileIconImages from "../../../apps/customFiles/FileIconImages"
import { Korean } from "flatpickr/dist/l10n/ko.js"

// summernote
import { SummernoteLite } from "react-summernote-lite"
import 'react-summernote-lite/dist/glob'
import '../../../../views/apps/summernote-ko-KR'

const ApprovalLetterRegister = () => {
    useAxiosIntercepter()
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()
    const cookies = new Cookies()
    const property = cookies.get('property').value
    const prop = location.state.prop // BTL or 우리두리
    const type = location.state.type // 등록 or 수정
    const [checkDate, setCheckDate] = useState() // 점검일자
    const [files, setFiles] = useState([])
    const [showNames, setShowNames] = useState([])

    const [selectedFiles, setSelectedFiles] = useState([])

    const [isCollect, setIsCollect] = useState(false)
    const [orignUserSign, setOrignUserSign] = useState([cookies.get("userId"), 0, 0, 0])
    const [orignSignType, setOrignSignType] = useState([1, 3, 3, ''])
    const [userSign, setUserSign] = useState([cookies.get("userId"), 0, 0, 0])
    const [signType, setSignType] = useState([1, 3, 3, ''])
    const [isOpen, setIsOpen] = useState(false)
    const [inputData, setInputData] = useState([])

    const [pageNumber, setPageNumber] = useState(0)

    const [submitResult, setSubmitResult] = useState(false)

    // summernote
    const noteRef = useRef()

    const now = moment().format('YYYY-MM-DD')

    let code_name = ''
    if (prop === 'btl') {
        code_name = 'FM본-BTL-'
        
    } else if (prop === 'ouriduri') {
        code_name = 'FM본-우리두리-'
    }

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
        trigger
    } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    // 함수 중첩 품의서용 콤마
    const approvalCommaValue = (value) => { return addCommaNumber(resultCheckFunc(getCommaDel(value))) }

    const onSubmit = (data) => {
		const formData = new FormData()
        formData.append('property', cookies.get('property').value)
        formData.append('code', type === 'register' ? `${code_name}${property}-${pageNumber}` : getValues('code'))
        formData.append('preserve_year', data.preserve_year)
        formData.append('department', data.department)
        formData.append('report_date', formatDateTime(checkDate))
        formData.append('arbitary_cause', data.arbitary_cause)
        formData.append('agreement', data.agreement)
        formData.append('title', data.title)
        formData.append('purpose', data.purpose)
        formData.append('company_name', data.company_name)
        formData.append('execution_amount', getCommaDel(data.execution_amount))
        formData.append('content', noteRef.current.summernote('code'))
        formData.append('budget', getCommaDel(data.budget))
        formData.append('recently_total', getCommaDel(data.recently_total))
        formData.append('balance',  getCommaDel(data.balance))
        formData.append('processing_items', data.processing_items)
        formData.append('user', cookies.get('userId'))
        formData.append('is_rejected', 0)

        let matchingIds = []
        if (type === 'modify' || isCollect) {
            formData.append('approval_letter_id', id)
            matchingIds = showNames.map((id) => id.id)
            formData.append('old_files_id', matchingIds)
        }

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i])
              }
        } else {
            formData.append('files', [''])
        }

        //등록
        if (type === 'register' || isCollect) {
            setInputData(formData)
            setIsOpen(true)
        }
        //수정
        if (type === 'modify' && !isCollect) {
            axios.put(API_BUSINESS_APPROVAL_DETAIL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(res => {
                if (res.status === 200) {
					axiosSweetAlert(`품의서 수정 완료`, `품의서가 수정되었습니다.`, 'success', 'center', setSubmitResult)
                }
            }).catch(res => {
                console.log(res, "!!!!!!!!error")
            })
        }
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

    const getApprovalDetailData = (data) => {
        setValue('code', data.code)
        setValue('preserve_year', data.preserve_year)
        setValue('report_date', [data.report_date])
        setCheckDate(data.report_date ? formatDateTime(data.report_date) : null)
        setValue('arbitary_cause', data.arbitary_cause)
        setValue('agreement', data.agreement)
        setValue('title', data.title)
        setValue('purpose', data.purpose)
        setValue('company_name', data.company_name)
        setValue('execution_amount', data.execution_amount)
        noteRef.current.summernote('code', data.content)
        setValue('budget', data.budget)
        setValue('recently_total', data.recently_total)
        setValue('processing_items', data.processing_items)
        setValue('department', data.department)
        setShowNames(data.report_files.map((file) => ({id: file.id, name: file.original_file_name})))
        setIsCollect(data?.is_rejected === 2)

        const tempSignList = data?.line
        const tempSignType = []
        const tempSignIdList = []
        if (Array.isArray(tempSignList)) {
            tempSignList.forEach(user => {
                tempSignType.push(user.type)
                tempSignIdList.push(user.user)
            })
        }
        if (data?.is_rejected === SIGN_COLLECT) {
            setSignType(tempSignType)
            setUserSign(tempSignIdList)
            setOrignUserSign(tempSignType)
            setOrignSignType(tempSignIdList)
        }
    }

    useEffect(() => {
        if (type === 'modify') {
            getTableDataCallback(API_BUSINESS_APPROVAL_DETAIL, {approval_letter_id: id}, getApprovalDetailData)
        }
        if (type === 'register') {
            const params = {
                property: cookies.get('property').value,
                type: prop,
                pageNumber: true
            }
            getTableData(API_BUSINESS_APPROVAL_LIST, params, setPageNumber)
        }
    }, [])

    useEffect(() => {
        const inputElement = document.getElementById("doc_file")
        inputElement.value = ""
        
        const dataTransfer = new DataTransfer()
        for (let i = 0; i < files.length; i++) {
            dataTransfer.items.add(files[i])
        }
        inputElement.files = dataTransfer.files
    }, [files])

    useEffect(() => {
        const budget = getCommaDel(getValues('budget'))
        const recentlyTotal = getCommaDel(getValues('recently_total'))
        const executionAmount = getCommaDel(getValues('execution_amount'))

        setValue('balance', approvalCommaValue((budget) - (recentlyTotal) - (executionAmount)))
    }, [ 
        watch([
            'budget', 
            'recently_total', 
            'execution_amount'
        ])// watch end
    ])// effect end

    useEffect(() => {
        if (submitResult) {
            navigate(`${ROUTE_BUSINESS_REQUISITION}/${prop}/detail/${id}`, {state: prop})
        }
    }, [submitResult])

	return (
    <Fragment>
        <Card>
            <CardHeader>
                <CardTitle>품의서</CardTitle>
            </CardHeader>
     
            <CardBody>
                <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className='border-y mx-0 border-right'>
                    <Col  xs='12' md='8'>
                        <Row>
                            <Col xs='4' md='3'  className='card_table col col_color text center border-b'>
                                분류번호&nbsp;
                                <div className='essential_value'/>
                            </Col>
                            <Col xs='8' md='9' className='card_table col text start border-b'  style={{justifyContent:'space-between'}}>
                                <Col xs='4' md='3' style={{width: 'fit-content'}}>
                                    { type === 'register' ? `${code_name}${property}-${pageNumber}` : getValues('code')}
                                    {errors.code && <div>&nbsp;</div>}
                                </Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs='4' md='3'  className='card_table col col_color text center border-b'>
                                보존년한&nbsp;
                                <div className='essential_value'/>
                            </Col>
                            <Col xs='8' md='9' className='card_table col text start ' style={{borderBottom: '1px solid #B9B9C3'}}>
                                <Col xs='11'>
                                    <Controller
                                        id='preserve_year'
                                        name='preserve_year'
                                        control={control}
                                        render={({ field }) => <Input bsSize='sm' type="number" maxLength={254} invalid={errors.preserve_year && true} {...field} />}
                                    />
                                    {errors.preserve_year && <FormFeedback>{errors.preserve_year.message}</FormFeedback>}
                                </Col>
                                <Col xs='1' style={{textAlign: 'end'}}>
                                    년
                                    {errors.preserve_year && <div>&nbsp;</div>}

                                </Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs='4' md='3'  className='card_table col col_color text center '>
                                기안부서&nbsp;
                                <div className='essential_value'/>
                            </Col>
                            <Col xs='8' md='9' className='card_table col text start' style={{display:'block'}}> 
                                <Controller
                                    id='department'
                                    name='department'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={50} invalid={errors.department && true} {...field} />}
                                />
                                {errors.department && <FormFeedback>{errors.department.message}</FormFeedback>}
                            </Col>
                        </Row>
                     </Col>
                    <Col xs='12' md='4' className='border-left'>
                        <Row>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                                기안일자&nbsp;
                                <div className='essential_value'/>
                            </Col>
                            <Col xs='8' md='6' className='card_table col text start '>
                                <Controller
                                id='report_date'
                                name='report_date'
                                control={control}
                                render={({ field: {onChange, value} }) => (
                                    <Col lg='12' md='12' xs='12' className='card_table col text' style={{justifyContent:'center', alignItems:'center'}}>
                                        <Row style={{width:'100%'}}>
                                            <Flatpickr
                                                className={`form-control ${errors.report_date ? 'is-invalid' : ''}`}
                                                id='default-picker'
                                                placeholder={`${now}`}
                                                value={value}
                                                onChange={(data) => {
                                                    const newData = setStringDate(data)
                                                    onChange(newData)
                                                    setCheckDate(newData)
                                                }}
                                                options = {{
                                                    dateFormat: "Y-m-d",
                                                    locale: Korean
                                                }}
                                                    />
                                                {errors.report_date && <div  style={{color:'#ea5455', fontSize:'0.857rem', paddingLeft:0 }}>{errors.report_date.message}</div>}
                                        </Row>
                                    </Col>
                                )}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4' md='2' className='card_table col col_color text center px-0' style={{textAlign:'center'}}>
                                전결근거 및 전결권자&nbsp;
                                <div className='essential_value'/>
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                                <Col>
                                    <Controller
                                        id='arbitary_cause'
                                        name='arbitary_cause'
                                        control={control}
                                        render={({ field }) => <Input bsSize='sm' maxLength={250} invalid={errors.arbitary_cause && true} {...field} />}
                                    />
                                    {errors.arbitary_cause && <FormFeedback>{errors.arbitary_cause.message}</FormFeedback>} 
                                </Col>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                                합의
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                                <Controller
                                    id='agreement'
                                    name='agreement'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={250} invalid={errors.agreement && true} {...field} />}
                                />
                                {errors.agreement && <FormFeedback>{errors.agreement.message}</FormFeedback>}                              
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                                제목
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                                <Controller
                                    id='title'
                                    name='title'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.title && true} {...field} />}
                                />
                                {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}                              
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                                목적
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                                <Controller
                                    id='purpose'
                                    name='purpose'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={250} invalid={errors.purpose && true} {...field} />}
                                />
                                {errors.purpose && <FormFeedback>{errors.purpose.message}</FormFeedback>}                              
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                                업체명
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                                <Controller
                                    id='company_name'
                                    name='company_name'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.company_name && true} {...field} />}
                                />
                                {errors.company_name && <FormFeedback>{errors.company_name.message}</FormFeedback>}                              
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                                집행금액&nbsp;
                                <div className='essential_value'/>
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start' style={{display: 'block'}}>
                                <Controller
                                    id='execution_amount'
                                    name='execution_amount'
                                    control={control}
                                    render={({ field: {onChange, value}}) => <Input 
                                            bsSize='sm' 
                                            type='text' 
                                            style={{textAlign:'end'}} 
                                            maxLength={254} 
                                            invalid={errors.execution_amount && true} 
                                            onChange={(e) => {
                                                AddCommaOnChange(e, onChange, true)
                                                trigger('execution_amount')
                                            }}
                                            value={approvalCommaValue(value)}
                                            // value={value}
                                        />
                                    }
                                />
                                {errors.execution_amount && <FormFeedback>{errors.execution_amount.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12'>
                        <Row style={{height:'100%'}}>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                                집행내용
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start'>
                                <div className="w-100">
                                    <SummernoteLite
                                        ref={noteRef}
                                        placeholder='집행내용을 입력해주세요.'
                                        lang={'ko-KR'}
                                        toolbar={[
                                            ['style', ['style']],
                                            ['font', ['bold', 'underline', 'clear', 'strikethrough', 'superscript', 'subscript']],
                                            ['fontsize', ['fontsize']],
                                            ['fontname', ['fontname']],
                                            ['color', ['color']],
                                            ['para', ['ul', 'ol', 'paragraph']],
                                            ['table', ['table']],
                                            ['insert', ['link', 'picture', 'video', 'hr']],
                                            ['view', ['codeview', 'help']]
                                        ]}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%', minHeight:'7rem'}}>
                            <Col xs='4' md='2' className='card_table col col_color text center ps-0'  style={{borderTop: '1px solid #B9B9C3', textAlign:'center'}} >
                                예산대비 집행내역&nbsp;
                                <div className='essential_value'/>
                            </Col>
                            <Col xs='8' md='10'>
                                <Row style={{height:'100%'}}>
                                    <Col xs='6' md='3'  style={{borderRight: '1px solid #B9B9C3', borderTop: '1px solid #B9B9C3'}}>
                                        <Row xs='6' style={{borderBottom: '1px solid #B9B9C3', height:'40%', justifyContent:'center', alignItems: 'center'}}>
                                            예산
                                        </Row>
                                        <Row xs='6' style={{height:'60%'}}>
                                            <Col className='card_table col text' style={{width:'100%'}}>
                                                <Controller
                                                    id='budget'
                                                    name='budget'
                                                    control={control}
                                                    render={({ field : {onChange, value} }) => (
                                                        <Col lg='12' md='12' xs='12' className='card_table col text' style={{justifyContent:'center', alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Input 
                                                                    bsSize='sm' 
                                                                    type="text" 
                                                                    style={{textAlign:'end'}} 
                                                                    maxLength={254} 
                                                                    invalid={errors.budget && true} 
                                                                    onChange={(e) => {
                                                                        AddCommaOnChange(e, onChange, true)
                                                                        trigger('budget')
                                                                    }}
                                                                    value={approvalCommaValue(value)}/>
                                                                {errors.budget && <FormFeedback>{errors.budget.message}</FormFeedback>}
                                                            </Row>
                                                        </Col>
                                                )}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs='6' md='3'  style={{borderRight: '1px solid #B9B9C3', borderTop: '1px solid #B9B9C3'}}>
                                        <Row xs='6'  style={{borderBottom: '1px solid #B9B9C3', height:'40%', justifyContent:'center', alignItems: 'center'}}>
                                            기집행 금액
                                        </Row>
                                        <Row xs='6' style={{height:'60%'}}>
                                            <Col className='card_table col' style={{width:'100%'}}>
                                                <Controller
                                                    id='recently_total'
                                                    name='recently_total'
                                                    control={control}
                                                    render={({ field : {onChange, value}}) => (
                                                        <Col lg='12' md='12' xs='12' className='card_table col text' style={{justifyContent:'center', alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Input 
                                                                    bsSize='sm' 
                                                                    type="text" 
                                                                    style={{textAlign:'end'}} 
                                                                    maxLength={254} 
                                                                    invalid={errors.recently_total && true} 
                                                                    onChange={ (e) => {
                                                                        AddCommaOnChange(e, onChange, true)
                                                                        trigger('recently_total')
                                                                    } }
                                                                    value={approvalCommaValue(value)}/>
                                                                {errors.recently_total && <FormFeedback>{errors.recently_total.message}</FormFeedback>}
                                                            </Row>
                                                        </Col>
                                                )}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs='6' md='3'  style={{borderRight: '1px solid #B9B9C3', borderTop: '1px solid #B9B9C3'}}>
                                        <Row xs='6'  style={{borderBottom: '1px solid #B9B9C3', height:'40%', justifyContent:'center', alignItems: 'center'}}>
                                            금번 집행액
                                        </Row>
                                        <Row xs='6' style={{height:'60%'}}>
                                            <Col className='card_table col' style={{width:'100%'}}>
                                                <Controller
                                                    id='execution_amount'
                                                    name='execution_amount'
                                                    control={control}
                                                    render={({ field : {value} }) => <Input 
                                                        bsSize='sm' 
                                                        disabled 
                                                        style={{textAlign:'end'}} 
                                                        type="text"
                                                        value={approvalCommaValue(value)}
                                                        readOnly 
                                                    />}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs='6' md='3' style={{borderTop: '1px solid #B9B9C3'}}>
                                        <Row xs='6'  style={{ height:'40%', borderBottom: '1px solid #B9B9C3', justifyContent:'center', alignItems: 'center'}}>
                                            잔액
                                        </Row>
                                        <Row xs='6' style={{height:'60%'}}>
                                            <Col className='card_table col' style={{width:'100%'}}>
                                                <Controller
                                                    id='balance'
                                                    name='balance'
                                                    control={control}
                                                    render={({ field : {value} }) => <Input 
                                                        bsSize='sm' 
                                                        disabled 
                                                        style={{textAlign:'end'}} 
                                                        type="text" 
                                                        value={approvalCommaValue(value)}
                                                        readOnly />}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                                처리과목
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                                <Controller
                                    id='processing_items'
                                    name='processing_items'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.processing_items && true} {...field} />}
                                />
                                {errors.processing_items && <FormFeedback>{errors.processing_items.message}</FormFeedback>}                              
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className='card_table mt-1'>
                    <div>
                        <Col className='card_table col text'>
                            <div style={{fontSize:'21px'}}>첨부 자료</div>
                        </Col>
                    </div>
                    <div className="mb-1">
                        <div className='form-control hidden-scrollbar' style={{ display: 'flex', alignItems: 'center', whiteSpace:'nowrap', overflow:'auto'  }}>
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
                            { (type === 'modify') && 
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
                <Row>
                    <Col className='d-flex justify-content-end mb-1' style={{paddingRight: '3%'}}>
                        <Button 
                            color="report" 
                            style={{marginTop: '1%', marginRight: '1%'}} 
                            tag={Link}
                            to={`${ROUTE_BUSINESS_REQUISITION}/${prop}`}
                            >취소</Button>
                        <Button type='submit' color='primary' style={{marginTop: '1%'}}>확인</Button>
                    </Col>
                </Row>
                <ApprovalSignModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    userSign={userSign}
                    setUserSign={setUserSign}
                    signType={signType}
                    setSignType={setSignType}
                    inputData={inputData}
                    prop={prop}
                    navigate={navigate}
                    orignUserSign={orignUserSign}
                    orignSignType={orignSignType}
                    pageType={type}
                />
                </Form>
            </CardBody>
        </Card>
    </Fragment>
	)
}

export default ApprovalLetterRegister