import { Fragment, useState, useEffect } from "react"
import { Col, Form, Input, Row, Button, FormFeedback, CardTitle, CardBody, Card, CardHeader } from "reactstrap"
import { Link, useNavigate } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import * as yup from 'yup'
import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from "@hookform/resolvers/yup"
import { ROUTE_MANUAL, API_MANUAL_REGISTER, API_MANUAL_LIST  } from "../../../constants"
import axios from '../../../utility/AxiosConfig'
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import Cookies from "universal-cookie"
import { axiosPostPutNavi, handleFileInputLimitedChange } from "../../../utility/Utils"
import FileIconImages from "../../apps/customFiles/FileIconImages"

const Manual_register = () => {
    useAxiosIntercepter()
    const [files, setFiles] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [writer, setWriter] = useState('')
    const cookies = new Cookies()
    const userid = cookies.get('userId')
	const property_id = cookies.get('property').value
    const navigate = useNavigate()

    const defaultValues = {
        title: ''
    }

    const validationSchema = yup.object().shape({
        title: yup.string().required('제목을 입력해주세요.').min(1, '1자 이상 입력해주세요')
    })

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = (data) => {
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('content', data.content)
        formData.append('user_id', userid)
        formData.append('property_id', property_id)
        
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])
        }
        axiosPostPutNavi('register', '유지관리매뉴얼', API_MANUAL_REGISTER, formData, navigate, ROUTE_MANUAL)
    }

    const handleChangeFile = (e) => {
        handleFileInputLimitedChange(e, files, setFiles, 6, undefined, undefined, setSelectedFiles)
    }
    
    const onRemoveFile = (file) => {
        const updatedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file)
        setSelectedFiles(updatedFiles)
        setFiles(updatedFiles)
    }

    useEffect(() => {
        axios.get(API_MANUAL_REGISTER, { params: {user_id: userid } })
        .then(res => {
            setWriter(res.data.username)
        })
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

	return (
        <Fragment>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <div className='d-flex justify-content-start'>
                        <Breadcrumbs breadCrumbTitle='유지관리매뉴얼' breadCrumbParent='점검관리' breadCrumbActive='유지관리매뉴얼' />
                    </div>
                </Row>
                <Card>
                    <CardHeader>
                            <CardTitle>유지관리매뉴얼</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row className="card_table mx-0 border-right border-top">
                            <Col md='6' xs='12' className="border-b">
                                <Row className='card_table table_row'>
                                    <Col md='4' xs='2'  className='card_table col col_color text center '>
                                        제목&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Col md='8' xs='10' className='card_table col text start '>
                                    <Controller
                                            id='title'
                                            name='title'
                                            control={control}
                                            render={({ field }) => (
                                                <Col className='card_table col text' style={{flexDirection:'column'}}>
                                                    <Input maxLength={498} bsSize='sm' invalid={errors.title && true} {...field} />
                                                    {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                                                </Col>
                                            )}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md='6' xs='12' className="border-b">
                                <Row className='card_table table_row'>
                                    <Col md='4' xs='2'  className='card_table col col_color text center '>작성자</Col>
                                    <Col md='8' xs='10' className='card_table col text start '>
                                    <div>{writer}</div>       
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="card_table mid">
                            <Col>
                                <Row className='card_table table_row' >
                                    <Col xs='2'  className='card_table col col_color text center' style={{whiteSpace: 'nowrap'}}>첨부파일</Col>
                                    <Col xs='10' className='card_table col text start'>
                                        <div className='d-flex flex-column' style={{width:'100%'}}>
                                            <Input type='file' id='doc_file' name='doc_file' multiple onChange={handleChangeFile}/>      
                                            <div className='form-control hidden-scrollbar mt-1' style={{ height: '46.2px', display: 'flex', alignItems: 'center', whiteSpace:'nowrap', overflow:'auto' }}>
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
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="card_table mid">
                            <Col>
                                <Row className='card_table table_row'>
                                    <Col xs='2'  className='card_table col col_color text center' style={{whiteSpace: 'nowrap'}}>내용</Col>
                                    <Col xs='10' className='card_table col text start '>
                                        <Controller
                                            id='content'
                                            name='content'
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <Input bsSize='sm' type="textarea" invalid={errors.code && true} {...field} style={{ minHeight: '300px' }} />
                                                    {errors.content && <FormFeedback>{errors.code.content}</FormFeedback>}
                                                </>
                                            )}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%', borderTop: '1px solid #B9B9C3'}}>
                            <Button 
                                color='report'
                                style={{marginTop: '1%', marginRight: '1%'}} 
                                tag={Link}
                                to={ROUTE_MANUAL}
                            >취소</Button>
                            <Button 
                                type='submit' color='primary' style={{marginTop: '1%'}}
                            >확인</Button>
                        </Col>
                    </CardBody>
                </Card>
            </Form>
        </Fragment>
    )
    }
export default Manual_register