import axios from 'axios'
import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { useLocation } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Label, FormFeedback, InputGroup, Form, CardFooter } from "reactstrap"
import { API_INTRANET_ARCHIVE, ROUTE_INTRANET_ARCHIVE, ROUTE_INTRANET_ARCHIVE_DETAIL, API_INTRANET_ARCHIVE_FORM } from "../../../../constants"
import { axiosPostPut, getObjectKeyCheck, handleFileInputLimitedChange, setFormData } from '../../../../utility/Utils'
import { defaultValues, validationSchemaInconv } from '../ArchiveData'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import FileIconImages from '../../../apps/customFiles/FileIconImages'

const AnnouncementForm = () => {
    useAxiosIntercepter()
    const { state } = useLocation()
    const cookies = new Cookies()
    const [files, setFiles] = useState([])
    const [detailData, setDetailData] = useState()
    const [selectedFiles, setSelectedFiles] = useState([])
    const [selectList, setSelectList] = useState([{label: '선택', value:''}])
    const [selected, setSelected] = useState(selectList[0])
    const [submitResult, setSubmitResult] = useState(false)
    const [showNames, setShowNames] = useState([])

    const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues)),
		resolver: yupResolver(validationSchemaInconv)
	})

    const handleSelect = (e) => {
        setSelected(e)
        setValue('employee_class', selectList.find(item => item.label === e.label))
    }

    const handleFileInputChange = (e) => {
        handleFileInputLimitedChange(e, files, setFiles, 6, showNames, setShowNames, setSelectedFiles)
    }

    // 새로 업로드한 부분 삭제
    const onRemoveFile = (file) => {
        const updatedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file)
        setSelectedFiles(updatedFiles)
        setFiles(updatedFiles)
    }

    const onPastRemoveFile = (file) => {
        setShowNames(showNames.filter((element) => element !== file))
    }

    const onSubmit = (data) => {
        let matchingIds = []
        if (state.type === 'modify') {
            matchingIds = showNames.map((id) => id.id)
        }
        const pageType = state.type
		const formData = new FormData()
        setFormData(data, formData)

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append('doc_files', files[i])
              }
        } else {
            formData.append('doc_files', [''])
        }
        
        formData.append('user_id', cookies.get("userId"))
        formData.append('property', cookies.get("property").value)
        formData.append('employee_class', getObjectKeyCheck(selected, 'value')) //selected.value
        formData.append('old_files_id', matchingIds)
        const API = pageType === 'register' ? API_INTRANET_ARCHIVE_FORM
										: `${API_INTRANET_ARCHIVE}/${state.id}`

        axiosPostPut(pageType, "자료실", API, formData, setSubmitResult)

    }

    useEffect(() => {
        axios.get(API_INTRANET_ARCHIVE, {
            params: {type: true, property:cookies.get('property').value}
        })
        .then(res => {
            setSelectList(prevList => [...prevList, ...res.data])
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

    useEffect(() => {
        if (submitResult) {
            if (state.type === 'modify') {
                window.location.href = `${ROUTE_INTRANET_ARCHIVE_DETAIL}/${state.id}`
			} else {
                window.location.href = ROUTE_INTRANET_ARCHIVE
			}
		}
	}, [submitResult])

    useEffect(() => {
        if (state.type === 'modify') {
            axios.get(`${API_INTRANET_ARCHIVE}/${state.id}`)
            .then(res => {
                setDetailData(res.data)
                setShowNames(res.data.archive_files.map((file) => ({id: file.id, name: file.original_file_name})))
            })
        }
	}, [])

    useEffect(() => {
        if (detailData) {
            setValue('subject', detailData.subject)
            setValue('contents', detailData.contents)
            setValue('employee_class', selectList.find(item => item.label === detailData.employee_class))
            setSelected(selectList.find(item => item.label === detailData.employee_class))
        }
	}, [detailData])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='자료실' breadCrumbParent='인트라넷' breadCrumbActive={'자료실'} />
                </div>
            </Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
						자료 &nbsp;{state.type === 'register' ? '등록' : '수정'}
					</CardTitle>
				</CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className='card_table'>
                            <Col md='10'>
                                <div className="mb-1">
                                    <Col className='card_table col text' style={{paddingBottom:0}}>
                                        <div>제목</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                    name='subject'
                                    control={control}
                                    render={({ field }) => (
                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                            <Row style={{width:'100%'}}>
                                                <Input maxLength='250' style={{width:'100%'}} bsSize='lg' invalid={errors.subject && true} placeholder='제목을 입력해주세요.' {...field}/>
                                                {errors.subject && <FormFeedback>{errors.subject.message}</FormFeedback>}
                                            </Row>
                                        </Col>
                                    )}/>
                                </div>
                            </Col>
                            <Col md='2'>
                                <div className="mb-1">
                                    <Col className='card_table col text archive' style={{paddingTop:'8%'}}>
                                        직종
                                    </Col>
                                    <Controller
                                        name='employee_class'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start', paddingTop:'2%'}}>
                                                <Select
                                                    name='employee_class'
                                                    height='45.99px'
                                                    classNamePrefix={'select'}
                                                    className="react-select custom-select-employee_class custom-react-select"
                                                    options={selectList}
                                                    value={value}
                                                    onChange={handleSelect}/>
                                            </Col>
                                        )}/>
                                </div>
                            </Col>
                        </Row>
                        <Row className='card_table'>
                            <Col md='12'>
                                <div className="mb-1">
                                    <Col className='card_table col text' style={{ paddingTop:0, paddingBottom:'1%'}}>
                                        첨부파일
                                    </Col>
                                    <Input type="file" id="doc_file" name="doc_file"  bsSize='lg' multiple onChange={handleFileInputChange}  />
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
                                        { state.type === 'modify' && detailData && detailData.archive_files.length > 0 && 
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
                            </Col>
                        </Row>
                        <Row className='card_table'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div>내용</div>&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <Controller
                                name='contents'
                                control={control}
                                render={({ field }) => (
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%'}}>
                                            <Input type="textarea" style={{minHeight: '45em', width: '100%' }} invalid={errors.contents && true} {...field}/>
                                            {errors.contents && <FormFeedback>{errors.contents.message}</FormFeedback>}
                                        </Row>
                                    </Col>
                                )}/>
                            </div>
                        </Row>
                        <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                            <Fragment >
                                <Button type='submit' color='primary'>{state.type === 'register' ? '저장' : '수정'}</Button>
                                { state.type === 'modify' &&
                                    <Button 
                                        color='report' 
                                        className="ms-1"
                                        tag={Link} 
                                        to={`${ROUTE_INTRANET_ARCHIVE_DETAIL}/${state.id}`} 
                                        state={{
                                            key: 'archive'
                                        }} >취소</Button>
                                }
                                <Button
                                    className="ms-1"
                                    tag={Link} 
                                    to={ROUTE_INTRANET_ARCHIVE}
                                    state={{
                                        key: 'archive'
                                    }} >목록</Button>
                            </Fragment>
                        </CardFooter>
                    </Form>
                </CardBody>
			</Card>
		</Fragment>
        
    )

}
export default AnnouncementForm