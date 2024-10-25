import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState, useRef } from "react"
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, FormFeedback, Form, CardFooter } from "reactstrap"
import { API_INTRANET_ANOUNCEMENT, ROUTE_INTRANET_ANNOUNCEMENT, ROUTE_INTRANET_ANNOUNCEMENT_DETAIL, API_INTRANET_ANOUNCEMENT_FORM, API_SYSTEMMGMT_BASIC_INFO_PROPERTY } from "../../../../constants"
import { axiosPostPut, getTableDataCallback, handleFileInputLimitedChange, sweetAlert, useObserver } from '../../../../utility/Utils'
import { defaultValues, validationSchemaInconv } from '../AnnouncementData'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import FileIconImages from '../../../apps/customFiles/FileIconImages'

import { SummernoteLite } from "react-summernote-lite"
import 'react-summernote-lite/dist/glob'
import '@views/apps/summernote-ko-KR'
import PropertyGroupCheckTable from '../../../apps/cutomTable/PropertyGroupCheckTable'

// 첫 랜더링에서 effect 효과 막기
const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false)
  
    useEffect(() => {
      if (didMount.current) func()
      else didMount.current = true
    }, deps)
}// useDidMountEffect end

const AnnouncementForm = () => {
    useAxiosIntercepter()
    const { state } = useLocation()
    const cookies = new Cookies()
    const property_id = cookies.get("property").value
    const [files, setFiles] = useState([])
    const [detailData, setDetailData] = useState()
    const [selectedFiles, setSelectedFiles] = useState([])
    const [submitResult, setSubmitResult] = useState(false)
    const [showNames, setShowNames] = useState([])
    
    const noteRef = useRef()
    const [selectError, setSelectError] = useState({contants: false})
    const {contants} = selectError
    const [checkList, setCheckList] = useState(new Set()) 
    const [isHighProperty, setIsHighProperty] = useState(false)
    
    const [isNotice, setIsNotice] = useState(false)

    const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues)),
		resolver: yupResolver(validationSchemaInconv)
	})

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
        if (isHighProperty && checkList?.size <= 0) {
            sweetAlert('사업소 미선택', '해당 공지사항을 등록할 사업소를 선택해주세요.', 'warning', 'center')
            return
        }

        const inputContants = noteRef.current.summernote('code')
        if (inputContants === '' || inputContants === '<p>&nbsp;</p>' || inputContants === '<p><br></p>') {
            setSelectError({contants: true})
            const temp = document.querySelector('.noteOne')
            temp.style.border = '1px solid red'
            return
        }

        if (contants) {
            return
        }

        let matchingIds = []
        if (state.type === 'modify') {
            matchingIds = showNames.map((id) => id.id)
        }

        const pageType = state.type
		const formData = new FormData()

        formData.append('subject', data.subject)
        formData.append('contents', noteRef.current.summernote('code'))
        formData.append('is_notice', isNotice)

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append('doc_files', files[i])
              }
        } else {
            formData.append('doc_files', [''])
        }
        
        formData.append('user_id', cookies.get("userId"))
        formData.append('property', cookies.get("property").value)

        if (isHighProperty) {
            for (const prop of checkList) { // 사업소
                formData.append('property_list', prop)
            }
        } else {
            formData.append('property_list', cookies.get("property").value)
        }

        formData.append('old_files_id', matchingIds)
        const API = pageType === 'register' ? API_INTRANET_ANOUNCEMENT_FORM
										: `${API_INTRANET_ANOUNCEMENT}/${state.id}`

        axiosPostPut(pageType, "공지사항", API, formData, setSubmitResult)

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

    useEffect(() => {
        if (submitResult) {
            if (state.type === 'modify') {
                window.location.href = `${ROUTE_INTRANET_ANNOUNCEMENT_DETAIL}/${state.id}`
			} else {
                window.location.href = ROUTE_INTRANET_ANNOUNCEMENT
			}
		}
	}, [submitResult])

    useEffect(() => {
        getTableDataCallback(`${API_SYSTEMMGMT_BASIC_INFO_PROPERTY}/${property_id}`, {}, (data) => {
            const tempIsHighProperty = data?.high_property
            if (typeof tempIsHighProperty === 'boolean') setIsHighProperty(tempIsHighProperty)
        })
        if (state.type === 'modify') {
            getTableDataCallback(`${API_INTRANET_ANOUNCEMENT}/${state.id}`, {}, (data) => {
                setDetailData(data)
                setIsNotice(data?.is_notice !== null ? data?.is_notice : false)
                setCheckList(new Set(data?.property_list))
                setShowNames(data.announcement_files.map((file) => ({id: file.id, name: file.original_file_name})))
            })
        }
	}, [])

    useEffect(() => {
        if (detailData) {
            setValue('subject', detailData.subject)
            noteRef.current.summernote('code', detailData.contents)
        }
	}, [detailData])

    useDidMountEffect(() => {
        const inputContants = noteRef.current.summernote('code')
        if (inputContants === '' || inputContants === '<p>&nbsp;</p>' || inputContants === '<p><br></p>') {
            setSelectError({contants: true})
            const temp = document.querySelector('.noteOne')
            temp.style.border = '1px solid red'
        }
        useObserver('.noteOne', () => {
            const inputContants = noteRef.current.summernote('code')
            if (inputContants === '' || inputContants === '<p>&nbsp;</p>' || inputContants === '<p><br></p>') {
                setSelectError({contants: true})
                const temp = document.querySelector('.noteOne')
                temp.style.border = '1px solid red'
                return
            }
            const temp = document.querySelector('.noteOne')
            temp.style.border = ''
            setSelectError({contants: false})
        })
	}, [errors])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='공지사항' breadCrumbParent='인트라넷' breadCrumbActive={'공지사항'} />
                </div>
            </Row>
			<Card>
				<CardHeader className='pb-0'>
					<CardTitle className="title">
						공지사항&nbsp;{state.type === 'register' ? '등록' : '수정'}
					</CardTitle>
				</CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className='card_table'>
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
                                            <Input maxLength='250' style={{width:'100%'}} bsSize='lg' invalid={errors.subject && true} {...field}/>
                                            {errors.subject && <FormFeedback>{errors.subject.message}</FormFeedback>}
                                        </Row>
                                    </Col>
                                )}/>
                            </div>
                        </Row>
                        { isHighProperty && 
                            <Row className='mb-3'>
                                <Col>
                                    <div className='mb-1'>사업소 선택</div>
                                    <PropertyGroupCheckTable
                                        checkList={checkList}
                                        setCheckList={setCheckList}
                                        purpose='highProperty'
                                    />
                                </Col>
                            </Row>
                        }
                        <Row className='card_table'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{ paddingTop:0, paddingBottom:'1%'}}>
                                    첨부파일
                                </Col>
                                <Input type="file" id="doc_file" name="doc_file"  bsSize='lg' multiple onChange={handleFileInputChange}/>
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
                                    { state.type === 'modify' && detailData && detailData.announcement_files.length > 0 && 
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
                        { isHighProperty && 
                            <Row className='my-1'>
                                <Col>
                                    <div className>
                                        <span className='font-weight-bold'>공지사항 고정</span>&nbsp;
                                        <Input 
                                            type='checkbox'
                                            id='idIsNotice'
                                            name='idIsNotice'
                                            onChange={ (e) => {
                                                setIsNotice(e.target.checked)
                                            }}
                                            checked={isNotice}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        }

                        <Row className='card_table'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div>내용</div>&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <div className='noteOne'>
                                    <SummernoteLite 
                                        lang={'ko-KR'}
                                        ref={noteRef}
                                        placeholder="내용을 작성해주세요."
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
                                {contants && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>내용을 작성해주세요.</div>}
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
                                        to={`${ROUTE_INTRANET_ANNOUNCEMENT_DETAIL}/${state.id}`} 
                                        state={{
                                            key: 'anouncement'
                                        }} >취소</Button>
                                }
                                <Button
                                    className="ms-1"
                                    tag={Link} 
                                    to={ROUTE_INTRANET_ANNOUNCEMENT}
                                    state={{
                                        key: 'anouncement'
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