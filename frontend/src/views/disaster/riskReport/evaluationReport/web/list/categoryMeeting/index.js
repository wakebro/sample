/* eslint-disable */
import Cookies from 'universal-cookie'
import { useDispatch } from 'react-redux'
import { Fragment, useState, useRef, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Card, CardBody, Form, Row, Col, Input, FormFeedback, Button, Label, CardHeader } from "reactstrap"

import { SummernoteLite } from "react-summernote-lite"
import 'react-summernote-lite/dist/glob'
import '@views/apps/summernote-ko-KR'

import { axiosPostPutCallback, getCommaDel, getTableDataCallback, resultCheckFunc, setFormData, useObserver, addCommaNumber, AddCommaOnChange } from '../../../../../../../utility/Utils'
import MeetingForm from "./form/DetailForm"
import EmployeeTable from "./form/EmployeeTable"
import { meetingCountFunc, meetingDefaultValues } from './temp/temp'
import { API_DISASTER_MEETING_REGISTER, API_DISASTER_MEETING_DETAIL } from '../../../../../../../constants'
import { setTabTempSaveCheck, setMeetingId, setModalName, setPageType } from '@store/module/criticalDisaster'
import ModalSign from '../ModalSign'
import ImageFileUploaderMulti from '../../../../../../apps/customFiles/ImageFileUploaderMulti'
import * as moment from 'moment'
import { handleAttendTarget } from '../../data'

const CategoryMeetingForm = (props) => {
    const {criticalDisaster} = props
    const totlaTitle = criticalDisaster.cdTotalTitle
    const cookies = new Cookies()
    const property = cookies.get('property').value

    const dispatch = useDispatch()
    const [files, setFiles] = useState([])
    
    // 참석자
    const [isOpen, setIsOpen] = useState(false)
    const [selectPartner, setSelectPartner] = useState([])
    const [partnerFiles, setPartnerFiles] = useState([])
    const [showNames, setShowNames] = useState([])
    const [attendState, setAttendState] = useState(false)

    // 결제라인
    const [signOpen, setSignOpen] = useState(false)
    const [userSign, setUserSign] = useState(['', ''])
    const [oldUserSign, setOldUserSign] = useState(['', ''])
    const [signUserData, setSignUserData] = useState(['',''])
    const [signType, setSignType] = useState([0, 4])

    const noteRef = useRef()
    const minutesRef = useRef()

    const saveCheckFunc = (boolean) => {
        dispatch(setTabTempSaveCheck(boolean))
    }

    const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
        watch,
        trigger,
        getValues
	} = useForm({
		defaultValues : meetingDefaultValues,
		resolver: ''
	})

    function reset() {
        setValue('absence_content', '')
        setValue('manager', '')
        setValue('position', '')
        setValue('location', '')
        setValue('minutes_title', '')
        setValue('minutes_date', '')
        setValue('minutes_department', '')
        setValue('minutes_writer', criticalDisaster.minutesWriter)
        setValue('minutes_participant', '')
        setValue('minutes_topic', '')
        setValue('minutes_infomation', '')
        setValue('minutes_etc', '')
        setUserSign(['',''])
        setFiles([])
        setSelectPartner([])
        setPartnerFiles([])
        setShowNames([])
		setValue('title', '')
        setValue('target_total', 0)
        setValue('target_woman', 0)
        setValue('target_man', 0)
        setValue('participant_total', 0)
        setValue('participant_man', 0)
        setValue('participant_woman', 0)
        setValue('description', 0)
        noteRef.current.summernote('code', '')
        minutesRef.current.summernote('code', '')
	}

    const handleTemporary = (data) => {
        const regModData = {...data}
        const formData = new FormData()

        formData.append('disaster', criticalDisaster.evaluationId)
        formData.append('target_woman', resultCheckFunc(getCommaDel(regModData.target_woman)))
        formData.append('target_man', resultCheckFunc(getCommaDel(regModData.target_man)))
        formData.append('participant_man', resultCheckFunc(getCommaDel(regModData.participant_man)))
        formData.append('participant_woman', resultCheckFunc(getCommaDel(regModData.participant_woman)))
        formData.append('minutes_date', regModData.minutes_date)
        formData.append('position', regModData.position)

        formData.append('type', false)
        formData.append('content', noteRef.current.summernote('code'))
        formData.append('minutes_content', minutesRef.current.summernote('code'))
        formData.append('minutes_writer', cookies.get('userId'))
        formData.append('past_id', criticalDisaster.meetingId)
        formData.append('is_rejected', false)

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].type !== undefined) {
                    formData.append('images', files[i])
                } else {
                    formData.append('images', JSON.stringify(files[i]))
                }
            }
        } else {
            formData.append('images', [])
        }

        // 비직원 명단 사진
        if (partnerFiles.length > 0) {
            for (let i = 0; i < partnerFiles.length; i++) {
                if (partnerFiles[i].type !== undefined) {
                    formData.append('partner_images', partnerFiles[i])
                } else {
                    formData.append('partner_images', JSON.stringify(partnerFiles[i]))
                }
            }
        } else {
            formData.append('partner_images', JSON.stringify(showNames[0]))
        }
        
        formData.append('sign_line', JSON.stringify(oldUserSign))
        if (selectPartner.length > 0) {
            const tempSelectPartner = [...selectPartner]
            tempSelectPartner.map(row => {
                if (!Object.keys(row).includes('row_id')) row['row_id'] = ''
            })
            formData.append('attend_list', JSON.stringify(tempSelectPartner))
        } else {
            formData.append('attend_list', JSON.stringify(['']))
        }
        // delete
        delete regModData['target_woman']
        delete regModData['target_man']
        delete regModData['participant_man']
        delete regModData['participant_woman']

        delete regModData['minutes_date']
        delete regModData['position']
        delete regModData['minutes_writer']

        setFormData(regModData, formData)

        axiosPostPutCallback(
            criticalDisaster.meetingId !== '' ? 'modify' : 'register', 
            '사전 회의', 
            API_DISASTER_MEETING_REGISTER, 
            formData, 
            (data) => {
                dispatch(setMeetingId(data.id))
                dispatch(setTabTempSaveCheck(true))
                if (criticalDisaster.pageType === 'modify') dispatch(setPageType('detail')) // 현재 페이지 타입이 수정일때는 상세페이지로 이동
            }
        )
    }

    useEffect(() => {
        meetingCountFunc(setValue, getValues , selectPartner)
    }, [
        watch([
            'target_woman'
            , 'target_man'
            , 'participant_man'
            , 'participant_woman'
        ])
        , selectPartner
    ])

    useEffect(() => {
        const meetingId = criticalDisaster.meetingId
        if (meetingId === '') {
            setValue('title', `${totlaTitle}-사전회의-${moment().format('YYYY-MM-DD')}`)
            handleAttendTarget(property, 'target_man', 'target_woman', setValue)
        }
    }, [])

    useEffect(() => {
        dispatch(setModalName('사전회의 결재'))
        if (criticalDisaster.meetingId !== '' && typeof criticalDisaster.meetingId === 'number') {
            getTableDataCallback(`${API_DISASTER_MEETING_DETAIL}/${criticalDisaster.meetingId}`, {}, (data) => {
                setValue('title', data.title)
                setValue('target_woman', data.target_woman)
                setValue('target_man', data.target_man)
                setValue('participant_woman', data.participant_woman)
                setValue('participant_man', data.participant_man)
                setValue('absence_content', data.absence_content)
                noteRef.current.summernote('code', data.content)
                setValue('manager', data.manager)
                setValue('position', data.position)
                setValue('location', data.location)
                setValue('description', data.description)
                setValue('minutes_title', data.minutes_title)
                setValue('minutes_date', data.minutes_date)
                setValue('minutes_department', data.minutes_department)
                setValue('minutes_writer', data.minutes_writer)
                setValue('minutes_participant', data.minutes_participant)
                setValue('minutes_topic', data.minutes_topic)
                minutesRef.current.summernote('code', data.minutes_content)
                setValue('minutes_infomation', data.minutes_infomation)
                setValue('minutes_etc', data.minutes_etc)
                const signIdList = data.sign_line.length > 1 ? 
                    [...data.sign_line.map(data => data.id)] : ['', '']
                setUserSign(signIdList)
                setOldUserSign(signIdList)
                setSignUserData(data.sign_line.length <= 0 ? ['',''] : [...data.sign_line])
                setSelectPartner(data.participant_list)
                const letter = data.participant_woman + data.participant_man - 1 > 0 ? `${data.participant_list[0].name} 외 ${data.participant_woman + data.participant_man - 1}` : data.participant_list[0].name
                setValue('minutes_participant', letter)

                const fileTemp = []
                const partnerFileTemp = []
                data.images.map(image => {
                    if (image.partner_status === false) {
                        fileTemp.push(image)
                    } else partnerFileTemp.push({id: image.id, name: image.original_file_name})
                })
                setFiles(fileTemp)
                setShowNames(partnerFileTemp)

                useObserver('div.noteOne .note-editable', () => {
                    saveCheckFunc(false)
                })

                useObserver('div.noteTwo .note-editable', () => {
                    saveCheckFunc(false)
                })
            })
        }
    }, [criticalDisaster.meetingId])

    useEffect(() => {
        let mCount = 0
        let fCount = 0
        if (attendState && selectPartner.length > 0) {
            selectPartner.filter(user => user.gender === 'male' && mCount++)
            selectPartner.filter(user => user.gender === 'female' && fCount++)
            setValue('participant_man', mCount)
            setValue('participant_woman', fCount)
            const letter = mCount + fCount - 1 > 0 ? `${selectPartner[0].name} 외 ${mCount + fCount - 1}` : selectPartner[0].name
            setValue('minutes_participant', letter)
        } else if (attendState && selectPartner.length === 0) {
            setValue('participant_man', mCount)
            setValue('participant_woman', fCount)
            setValue('minutes_participant', '')
        }
    }, [attendState, selectPartner])

    return (
        <Fragment>
            <Form onSubmit={handleSubmit(handleTemporary)}>
                <Card>
                    <CardHeader>
                        <Row className='w-100'>
                            <Col md={9} xs={9}>
                                <Controller
                                    name='title'
                                    control={control}
                                    render={({ field: {onChange, value} }) => (
                                    <Input 
                                        className='risk-report title-input'
                                        bsSize='lg'
                                        value={value || ''}
                                        invalid={errors.title && true} 
                                        placeholder='사전 회의 제목을 입력해주세요.'
                                        onChange={e => {
                                            onChange(e)
                                            saveCheckFunc(false)
                                        }}
                                    />
                                    )
                                }/>
                                {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row className='mb-2 pe-0' style={{display:'flex'}}>
                            <Label className='risk-report text-lg-bold'>회의 인원</Label>
                            <Col md={8} xs={12} className="pe-0">
                                <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                    <Col lg='6' md='6' xs='3'  className='card_table col col_color text center border-b risk-report text-normal'>구분</Col>
                                    <Col lg='2' md='2' xs='3'  className='card_table col text center col_b risk-report text-normal'>계</Col>
                                    <Col lg='2' md='2' xs='3'  className='card_table col col_color text center border-b risk-report text-normal'>남</Col>
                                    <Col lg='2' md='2' xs='3'  className='card_table col text center col_b risk-report text-normal'>여</Col>
                                </Row>
                                <Row className="card_table mx-0 border-right border-b">
                                    <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>회의 대상자 수</Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name='target_total'
                                            control={control}
                                            render={({field: {value}}) => <div>{addCommaNumber(value)}</div>}
                                        />
                                    </Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center border-x' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        {/* <Controller
                                            name='target_man'
                                            control={control}
                                            render={({ field: {value} }) => (
                                                <div>{addCommaNumber(value)}</div>
                                            )}
                                        /> */}
                                        <Controller
                                            name='target_man'
                                            control={control}
                                            render={({ field: {value, onChange} }) => (
                                                <Row style={{width:'100%'}}>
                                                    <Input 
                                                        maxLength={15}
                                                        invalid={errors.target_man && true}
                                                        value={addCommaNumber(value)}
                                                        onChange={e => {
                                                            AddCommaOnChange(e, onChange)
                                                            trigger('target_man')
                                                        }}
                                                    />
                                                    {errors.target_man && <FormFeedback>{errors.target_man.message}</FormFeedback>}
                                                </Row>
                                            )}
                                        />
                                    </Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name='target_woman'
                                            control={control}
                                            render={({ field: {value, onChange} }) => (
                                                <Row style={{width:'100%'}}>
                                                    <Input 
                                                        maxLength={15}
                                                        invalid={errors.target_woman && true}
                                                        value={addCommaNumber(value)}
                                                        onChange={e => {
                                                            AddCommaOnChange(e, onChange)
                                                            trigger('target_woman')
                                                        }}
                                                    />
                                                    {errors.target_woman && <FormFeedback>{errors.target_woman.message}</FormFeedback>}
                                                </Row>
                                            )}
                                        />
                                    </Col>
                                </Row>
                                <Row className="card_table mx-0 border-right border-b">
                                    <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>회의 실시자 수</Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name='participant_total'
                                            control={control}
                                            render={({field: {value}}) => <div>{addCommaNumber(value)}</div>}
                                        />
                                    </Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center border-x' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name='participant_man'
                                            control={control}
                                            render={({ field: {value, onChange} }) => (
                                                <Row style={{width:'100%'}}>
                                                    <Input 
                                                        maxLength={15}
                                                        invalid={errors.participant_man && true}
                                                        value={addCommaNumber(value)}
                                                        onChange={e => {
                                                            AddCommaOnChange(e, onChange)
                                                            trigger('participant_man')
                                                        }}
                                                    />
                                                    {errors.participant_man && <FormFeedback>{errors.participant_man.message}</FormFeedback>}
                                                </Row>
                                            )}
                                        />
                                    </Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name='participant_woman'
                                            control={control}
                                            render={({ field: {value, onChange} }) => (
                                                <Row style={{width:'100%'}}>
                                                    <Input 
                                                        maxLength={15}
                                                        invalid={errors.participant_woman && true}
                                                        value={addCommaNumber(value)}
                                                        onChange={e => {
                                                            AddCommaOnChange(e, onChange)
                                                            trigger('participant_woman')
                                                        }}
                                                    />
                                                    {errors.participant_woman && <FormFeedback>{errors.participant_woman.message}</FormFeedback>}
                                                </Row>
                                            )}
                                            />
                                    </Col>
                                </Row>
                                <Row className="card_table mx-0 border-right border-b">
                                    <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>회의 미참석 사유</Col>
                                    <Col lg='6' md='6' xs='9' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name='absence_content'
                                            control={control}
                                            render={({ field: {value, onChange}  }) => (
                                                <Input 
                                                    rows={4}
                                                    type="textarea"
                                                    placeholder='회의 미참석 사유에 대해서 입력해주세요.'
                                                    onChange={e => {
                                                        onChange(e)
                                                        saveCheckFunc(false)
                                                    }}
                                                    value={value}
                                                />
                                            )}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={4} xs={12}>
                                <div style={{position:'relative', width:'100%'}}>
                                    <Row className='d-flex justify-constent-center'>
                                        <ModalSign 
                                            criticalDisasterRedux={criticalDisaster}
                                            userSign={signUserData}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'center', width:'100%', position:'absolute', top:'72px' }}>
                                            <Button type='button' color='primary' className='px-2 py-2' onClick={() => setSignOpen(true)} style={{position:'absolute'}}>
                                                결재 {oldUserSign[0] === '' ? '등록' : '수정'}
                                            </Button>
                                        </div>
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-2">
                            <Label className='risk-report text-lg-bold'>회의 내용</Label>
                            <div className='noteOne' style={{height:'100%', width:'100%'}}>
                                <SummernoteLite 
                                    lang={'ko-KR'}
                                    ref={noteRef}
                                    placeholder="회의 내용을 작성해주세요."
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
                        </Row>

                        <Row className="mb-2">
                            <Label className='risk-report text-lg-bold'>회의 사진</Label>
                            <Col>
                                <Row className='mx-0'>
                                    <Col className='px-2 py-2 border-x border-y'>
                                        <ImageFileUploaderMulti
                                            setFiles={setFiles} 
                                            files={files}
                                            fileNumLimit={3}
                                            fileMaxSize={20000000}
                                            sizeOverMessage={'20MB 이하의 이미지를 업로드 하세요.'}
                                            saveCheckFunc={saveCheckFunc}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className="mb-2 card_table">
                            <Label className='risk-report text-lg-bold'>회의 실시자 및 장소</Label>
                            <Col lg={12}>
                                <Row className='mx-0'>
                                    <Col lg={3} xs={12}>
                                        <Row>
                                            <Col className='card_table top col_color text center risk-report text-normal col-h-rem'>담당</Col>
                                        </Row>
                                        <Row>
                                            <Col className='card_table top text center border-left risk-report col-h-rem'>
                                                <Controller
                                                    name="manager"
                                                    control={control}
                                                    render={({ field: {value, onChange} }) => (
                                                        <Input 
                                                            maxLength={98}
                                                            invalid={errors.manager && true}
                                                            placeholder='담당자 성함을 작성해주세요.'
                                                            value={value}
                                                            onChange={e => {
                                                                onChange(e)
                                                                saveCheckFunc(false)
                                                            }}
                                                        />
                                                )}/>
                                                {errors.manager && <FormFeedback>{errors.manager.message}</FormFeedback>}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={3} xs={12}>
                                        <Row>
                                            <Col className='card_table top col_color text center risk-report text-normal col-h-rem'>직책</Col>
                                        </Row>
                                        <Row>
                                            <Col className='card_table top border-left risk-report col-h-rem'>
                                                <Controller
                                                    name="position"
                                                    control={control}
                                                    render={({ field: {value, onChange} }) => (
                                                        <Input 
                                                            maxLength={98}
                                                            invalid={errors.position && true}
                                                            placeholder='담당자 직책을 작성해주세요.'
                                                            value={value}
                                                            onChange={e => {
                                                                onChange(e)
                                                                saveCheckFunc(false)
                                                            }}
                                                        />
                                                )}/>
                                                {errors.position && <FormFeedback>{errors.position.message}</FormFeedback>}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={3} xs={12}>
                                        <Row>
                                            <Col className='card_table top col_color text center risk-report text-normal col-h-rem'>교육 장소</Col>
                                        </Row>
                                        <Row>
                                            <Col className='card_table top border-left risk-report col-h-rem'>
                                                <Controller
                                                    name="location"
                                                    control={control}
                                                    render={({ field: {value, onChange} }) => (
                                                        <Input 
                                                            maxLength={98}
                                                            invalid={errors.location && true}
                                                            placeholder='교육 장소를 입력해주세요.'
                                                            value={value}
                                                            onChange={e => {
                                                                onChange(e)
                                                                saveCheckFunc(false)
                                                            }}
                                                        />
                                                )}/>
                                                {errors.location && <FormFeedback>{errors.location.message}</FormFeedback>}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={3} xs={12}>
                                        <Row>
                                            <Col className='card_table top col_color text center risk-report text-normal col-h-rem'>비고</Col>
                                        </Row>
                                        <Row>
                                            <Col className='card_table top border-left risk-report col-h-rem'>
                                                <Controller
                                                    name="description"
                                                    control={control}
                                                    render={({ field: {value, onChange} }) => (
                                                        <Input 
                                                            invalid={errors.description && true}
                                                            placeholder='비고 내용을 입력해주세요.'
                                                            value={value}
                                                            onChange={e => {
                                                                onChange(e)
                                                                saveCheckFunc(false)
                                                            }}
                                                        />
                                                )}/>
                                                {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="card_table">
                            <Col className='card_table col text' style={{paddingBottom:0}}>
                                <Label className='risk-report text-lg-bold'>회의 참석자 명단</Label>
                                <Button color="skyblue" className='ms-1' size="sm" onClick={() => setIsOpen(true)}>직원 선택</Button>
                            </Col>
                        </Row>
                        <EmployeeTable
                            title='회의' 
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            cookies={cookies}
                            selectPartner={selectPartner}
                            setSelectPartner={setSelectPartner}
                            setAttendState={setAttendState}
                        />
                    </CardBody>
                </Card>
                <MeetingForm 
                    control={control}
                    errors={errors}
                    SummernoteLite={SummernoteLite}
                    handleSubmit={handleSubmit}
                    reset={reset}
                    handleTemporary={handleTemporary}
                    isOpen={signOpen}
                    setIsOpen={setSignOpen}
                    minutesRef={minutesRef}
                    userSign={userSign}
                    setUserSign={setUserSign}
                    signType={signType}
                    setSignType={setSignType}
                    oldUserSign={oldUserSign}
                    setOldUserSign={setOldUserSign}
                    setSignUserData={setSignUserData}
                    partnerFiles={partnerFiles}
                    setPartnerFiles={setPartnerFiles}
                    showNames={showNames}
                    setShowNames={setShowNames}
                    criticalDisaster={criticalDisaster}
                />
            </Form>
        </Fragment>
    )
}

export default CategoryMeetingForm