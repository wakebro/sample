/* eslint-disable */
import Cookies from 'universal-cookie'
import { Fragment, useState, useEffect, useRef } from "react"
import { setTabTempSaveCheck, setEducationId, setPageType, setModalName, setEducationParticipantMan, setEducationParticipantWoman } from '@store/module/criticalDisaster'
import { Controller, useForm } from "react-hook-form"
import { Card, CardBody, CardFooter, Col, Form, FormFeedback, Input, Row, Label, Button, CardHeader } from "reactstrap"
import * as moment from 'moment'
// summernote
import { SummernoteLite } from "react-summernote-lite"
import 'react-summernote-lite/dist/glob'
import '@views/apps/summernote-ko-KR'

import { 
    educationProcess, 
    eduDefaultValues,
    handleAttendTarget
} from '../../data'
import { 
    // AddCommaOnChange, 
    addCommaNumber,
    axiosPostPutCallback,
    getCommaDel,
    getTableDataCallback,
    resultCheckFunc,
    AddCommaOnChange
} from "../../../../../../../utility/Utils"
import EmployeeTable from './component/EmployeeTable'
import { useDispatch, useSelector } from 'react-redux'
import { FooterLine } from '../EvaluationForm'
import EduSignModal from './component/EduSignModal'
import { useLocation } from 'react-router-dom'
import { API_DISASTER_EDUCATION_DETAIL, API_DISASTER_EDUCATION_REGISTER } from '../../../../../../../constants'
import ImageFileUploaderMulti from '../../../../../../apps/customFiles/ImageFileUploaderMulti'
import ModalSign from '../ModalSign'
import { useAxiosIntercepter } from '../../../../../../../utility/hooks/useAxiosInterceptor'
import PartnerFile from '../categoryMeeting/form/PartnerFile'

const CategoryEducation = () => {
    useAxiosIntercepter()
    const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const evaluationId = criticalDisaster.evaluationId
    const totlaTitle = criticalDisaster.cdTotalTitle
    const dispatch = useDispatch()
    const pageType = criticalDisaster.pageType
    const { state } = useLocation()

    const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		getValues,
		watch
	} = useForm({
		defaultValues : eduDefaultValues,
		resolver: ''
	})

    // 사업소, 유저 정보를 위한 쿠키
    const cookies = new Cookies()
    const property = cookies.get('property').value

    // file
    const [files, setFiles] = useState([])
    // 비직원 참석자 첨부파일
    const [partnerFiles, setPartnerFiles] = useState([])
    const [showNames, setShowNames] = useState([])

    // summernote
    const noteRef = useRef()

    // modal
    const [isOpen, setIsOpen] = useState(false)

    const [isSignOpen, setIsSignOpen] = useState(false)
    const [userSign, setUserSign] = useState(['', ''])
    const [oldUserSign, setOldUserSign] = useState(['', ''])
    const [signUserData, setSignUserData] = useState(['',''])
    const [signType, setSignType] = useState([0, 4])

    // 교육 참석 유저 state
    const [attendUser, setAttendUser] = useState([])
    const [attendState, setAttendState] = useState(false)

    const saveCheckFunc = (boolean) => {
        dispatch(setTabTempSaveCheck(boolean))
    }

	function reset() {
		setValue('educationTitle', '') // title
        // 교육인원
        setValue('educationTargetMan', 0)
        setValue('educationTargetWoman', 0)
        setValue('educationParticipantMan', 0)
        setValue('educationParticipantWoman', 0)
        setValue('eduAbsenceContent', '')
        // 교육 내용
        noteRef.current.summernote('code', '') // summernote
        // 교육사진
        setFiles([])
        setPartnerFiles([])
        setShowNames([])
        // 교육실시자 및 장소
        setValue('educationManagerName', '')
        setValue('educationManagerLevel', '')
        setValue('educationLocation', '')
        setValue('educationDescription', '')
        setAttendUser([])
        dispatch(setEducationParticipantMan(0))
        dispatch(setEducationParticipantWoman(0))
	}
    // reset end

    const regModCallback = (data) => {
        dispatch(setEducationId(data))
        if (criticalDisaster.pageType === 'modify') dispatch(setPageType('detail')) // 현재 페이지 타입이 수정일때는 상세페이지로 이동
    }

	function handleTempSave(data) {
        saveCheckFunc(true)

        const formData = new FormData()

        formData.append('property_id', property)
        formData.append('title', data.educationTitle === '' ? `임시저장_안전교육_${evaluationId}` : data.educationTitle)
        formData.append('type', true)
        
        formData.append('target_total', resultCheckFunc(getCommaDel(data.educationTargetTotal)))
        formData.append('target_man', resultCheckFunc(getCommaDel(data.educationTargetMan)))
        formData.append('target_woman', resultCheckFunc(getCommaDel(data.educationTargetWoman)))

        formData.append('participant_total', resultCheckFunc(getCommaDel(data.educationParticipantTotal)))
        formData.append('participant_man', resultCheckFunc(getCommaDel(data.educationParticipantMan)))
        formData.append('participant_woman', resultCheckFunc(getCommaDel(data.educationParticipantWoman)))

        formData.append('absence_content', data.eduAbsenceContent)

        formData.append('content', noteRef.current.summernote('code'))

        // 첨부 이미지
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                if (files[i].type !== undefined) {
                    formData.append('images', files[i])
                } else {
                    formData.append('images', JSON.stringify(files[i]))
                }
            }
        } else {
            formData.append('images', JSON.stringify(['']))
        } // if end

        for (const user of oldUserSign) {
            formData.append('report_line', user)
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
        
        formData.append('manager', data.educationManagerName)
        formData.append('position', data.educationManagerLevel)
        formData.append('location', data.educationLocation)
        formData.append('description', data.educationDescription)
        formData.append('critical_disaster_id', evaluationId)

        if (attendUser.length > 0) { // 참석 인원
            for (const emp of attendUser) {
                formData.append('attend_emp_list', emp.id)
            }
        } else {
            formData.append('attend_emp_list', [''])
        } 

        const educationId = criticalDisaster.educationId
        const regMod = educationId === '' ? 'register' : 'modify'
        const API = regMod === 'register' ? API_DISASTER_EDUCATION_REGISTER : `${API_DISASTER_EDUCATION_DETAIL}/${educationId}`
        // if end
        axiosPostPutCallback(regMod, '안전교육', API, formData, regModCallback)
	} 
    // handleTempSave end

    // 직원 선택 모달
    function handleModal() {
        setIsOpen(true)
    }

    // 서명 결재자 선택 모달
    function handleSignModal() {
        setIsSignOpen(true)
    }

    const getModifyData = (data) => {
        const singLine = [...data.sign_line]
        const tempSign = []
        setValue('educationTitle', data.title)
        
        setValue('educationTargetMan', data.target_man)
        setValue('educationTargetWoman', data.target_woman)

        setValue('educationParticipantMan', data.participant_man)
        setValue('educationParticipantWoman', data.participant_woman)

        setValue('eduAbsenceContent', data.absence_content)

        noteRef.current.summernote('code', data.content)

        setAttendUser(data.emp_list)

        for (const sign of singLine) tempSign.push(sign.id)
        setUserSign(tempSign.length <= 0 ? ['',''] : tempSign)
        setOldUserSign(tempSign.length <= 0 ? ['',''] : tempSign)
        setSignUserData(singLine.length <= 0 ? ['',''] : singLine)

        const fileTemp = []
        const partnerFileTemp = []
        data.cd_images.map(image => {
            if (image.partner_status === false) {
                fileTemp.push(image)
            } else partnerFileTemp.push({id: image.id, name: image.original_file_name})
        })
        setFiles(fileTemp)
        setShowNames(partnerFileTemp)

        setValue('educationManagerName', data.manager)
        setValue('educationManagerLevel', data.position)
        setValue('educationLocation', data.location)
        setValue('educationDescription', data.description)

        useObserver('div.noteOne .note-editable', () => {
            saveCheckFunc(false)
        })
    }

    useEffect(() => {
        if (pageType === 'register') {
            reset()
            return
        }
	}, [pageType])

    // test
    useEffect(() => {
        educationProcess(setValue, getValues)
	}, [
        watch([
            'educationTargetMan',
            'educationTargetWoman',
            'educationParticipantMan',
            'educationParticipantWoman'
        ])
    ])

    useEffect(() => {
        const educationId = criticalDisaster.educationId
        if (educationId !== '' && typeof educationId === 'number') {
            getTableDataCallback(`${API_DISASTER_EDUCATION_DETAIL}/${educationId}`,{}, getModifyData)
        }
    }, [criticalDisaster.educationId])

    useEffect(() => {
        dispatch(setModalName('안전교육 결재'))
        const educationId = criticalDisaster.educationId
        if (educationId === '') {
            setValue('educationTitle', `${totlaTitle}-안전교육-${moment().format('YYYY-MM-DD')}`)
            handleAttendTarget(property, 'educationTargetMan', 'educationTargetWoman', setValue)
        }
    }, [])

    useEffect(() => {
        let mCount = 0
        let fCount = 0
        if (attendState && attendUser.length > 0) {
            attendUser.filter(user => user.gender === 'male' && mCount++)
            attendUser.filter(user => user.gender === 'female' && fCount++)
            setValue('educationParticipantMan', mCount)
            setValue('educationParticipantWoman', fCount)
        } else if (attendState && attendUser.length === 0) {
            setValue('educationParticipantMan', mCount)
            setValue('educationParticipantWoman', fCount)
        }
    }, [attendState, attendUser])

	return (
		<Fragment>
			<Form onSubmit={handleSubmit(handleTempSave)}>
				<Card>
                    {/* 제목 */}
                    <CardHeader>
                        <Row className='w-100'>
                            <Col md={9} xs={9}>
                                <Controller
                                    name="educationTitle"
                                    control={control}
                                    render={({ field: {onChange, value} }) => (
                                        <>
                                            <Input
                                                className='risk-report title-input'
                                                invalid={errors.educationTitle && true}
                                                placeholder='안전 교육 제목을 입력해주세요.'
                                                bsSize='lg'
                                                onChange={e => {
                                                    onChange(e)
                                                    saveCheckFunc(false)
                                                }}
                                                value={value}
                                            />
                                            {errors.educationTitle && <FormFeedback>{errors.educationTitle.message}</FormFeedback>}
                                        </>
                                )}/>
                            </Col>
                        </Row>
                    </CardHeader>

                    <CardBody className='risk-report'>
                        {/* 교육 인원 */}
                        <Row className='mb-2 pe-0' style={{display:'flex'}}>
                            <Label className='risk-report text-lg-bold'>교육 인원</Label>
                            <Col md={8} xs={12} className="pe-0">
                                <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                    <Col lg='6' md='6' xs='3'  className='card_table col col_color text center border-b risk-report text-normal'>구분</Col>
                                    <Col lg='2' md='2' xs='3'  className='card_table col text center col_b risk-report text-normal'>계</Col>
                                    <Col lg='2' md='2' xs='3'  className='card_table col col_color text center border-b risk-report text-normal'>남</Col>
                                    <Col lg='2' md='2' xs='3'  className='card_table col text center col_b risk-report text-normal'>여</Col>
                                </Row>
                                <Row className="card_table mx-0 border-right border-b">
                                    <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>교육 대상자 수</Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name="educationTargetTotal"
                                            control={control}
                                            render={({ field: {value} }) => (
                                                <div>{addCommaNumber(value)}</div>
                                        )}/>
                                    </Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center border-x' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        {/* <Controller
                                            name="educationTargetMan"
                                            control={control}
                                            render={({ field: {value} }) => (
                                                <div>{addCommaNumber(value)}</div>
                                        )}/> */}
                                        <Controller
                                            name="educationTargetMan"
                                            control={control}
                                            render={({ field: {value, onChange} }) => (
                                                <Input 
                                                    maxLength={15}
                                                    invalid={errors.educationTargetMan && true}
                                                    placeholder='0'
                                                    value={value}
                                                    onChange={e => {
                                                        AddCommaOnChange(e, onChange)
                                                        saveCheckFunc(false)
                                                    }}
                                                />
                                        )}/>
                                        {errors.educationTargetMan && <FormFeedback>{errors.educationTargetMan.message}</FormFeedback>}
                                    </Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name="educationTargetWoman"
                                            control={control}
                                            render={({ field: {value, onChange} }) => (
                                                <Input 
                                                    maxLength={15}
                                                    invalid={errors.educationTargetWoman && true}
                                                    placeholder='0'
                                                    value={value}
                                                    onChange={e => {
                                                        AddCommaOnChange(e, onChange)
                                                        saveCheckFunc(false)
                                                    }}
                                                />
                                        )}/>
                                        {errors.educationTargetWoman && <FormFeedback>{errors.educationTargetWoman.message}</FormFeedback>}
                                    </Col>
                                </Row>
                                <Row className="card_table mx-0 border-right border-b">
                                    <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>교육 실시자 수</Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name="educationParticipantTotal"
                                            control={control}
                                            render={({ field: {value} }) => (
                                                <div>{addCommaNumber(value)}</div>
                                        )}/>
                                    </Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center border-x' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name="educationParticipantMan"
                                            control={control}
                                            render={({ field: {value, onChange} }) => (
                                                <Input 
                                                    maxLength={15}
                                                    invalid={errors.educationParticipantMan && true}
                                                    placeholder='0'
                                                    value={value}
                                                    onChange={e => {
                                                        AddCommaOnChange(e, onChange)
                                                        saveCheckFunc(false)
                                                    }}
                                                />
                                        )}/>
                                        {errors.educationParticipantMan && <FormFeedback>{errors.educationParticipantMan.message}</FormFeedback>}
                                    </Col>
                                    <Col lg='2' md='2' xs='3' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name="educationParticipantWoman"
                                            control={control}
                                            render={({ field: {value, onChange} }) => (
                                                <Input 
                                                    maxLength={15}
                                                    invalid={errors.educationParticipantWoman && true}
                                                    placeholder='0'
                                                    value={value}
                                                    onChange={e => {
                                                        AddCommaOnChange(e, onChange)
                                                        saveCheckFunc(false)
                                                    }}
                                                />
                                        )}/>
                                        {errors.educationParticipantWoman && <FormFeedback>{errors.educationParticipantWoman.message}</FormFeedback>}
                                    </Col>
                                </Row>
                                <Row className="card_table mx-0 border-right border-b">
                                    <Col lg='6' md='6' xs='3' className='card_table col text center border-x risk-report text-normal'>교육 미참석 사유</Col>
                                    <Col lg='6' md='6' xs='9' className='card_table col text center' style={{paddingRight:'6px', paddingLeft:'6px'}}>
                                        <Controller
                                            name="eduAbsenceContent"
                                            control={control}
                                            render={({ field: {onChange, value} }) => (
                                                <Input
                                                    rows={4}
                                                    type='textarea'
                                                    invalid={errors.eduAbsenceContent && true}
                                                    placeholder='교육 미참석 사유에 대해서 입력해주세요.'
                                                    onChange={e => {
                                                        onChange(e)
                                                        saveCheckFunc(false)
                                                    }}
                                                    value={value}
                                                />
                                        )}/>
                                        {errors.eduAbsenceContent && <FormFeedback>{errors.eduAbsenceContent.message}</FormFeedback>}
                                    </Col>
                                </Row>
                            </Col>
                            {/* 서명 */}
                            <Col lg={4} xs={12} className='ps-3'>
                                <div style={{position:'relative', width:'100%'}}>
                                    <Row className='d-flex justify-constent-center'>
                                        <ModalSign 
                                            criticalDisasterRedux={criticalDisaster}
                                            userSign={signUserData}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'center', width:'100%', position:'absolute', top:'72px'}}>
                                            <Button type='button' color='primary' className='px-2 py-2' onClick={handleSignModal} style={{position:'absolute'}}>
                                                결재 {oldUserSign[0] === '' ? '등록' : '수정'}
                                            </Button>
                                        </div>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        {/* 교육 내용 */}
                        <Row className='mb-2'>
                            <Col>
                                <Label className='risk-report text-lg-bold'>교육 내용</Label>
                                <div className='noteOne'>
                                    <SummernoteLite
                                        ref={noteRef}
                                        placeholder='교육 내용을 입력해주세요.'
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
                        {/* 교육 사진 */}
                        <Row className='mb-2'>
                            <Label className='risk-report text-lg-bold'>교육 사진</Label>
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
                        {/* 교육 실시자 및 장소 */}
                        <Row className='mb-2'>
                            <Label className='risk-report text-lg-bold'>교육 실시자 및 장소</Label>
                            <Col lg={12}>
                                <Row className='mx-0'>
                                    <Col lg={3} xs={12}>
                                        <Row>
                                            <Col className='card_table col top col_color text center risk-report text-normal col-h-rem'>담당</Col>
                                        </Row>
                                        <Row>
                                            <Col className='card_table col top text center border-left risk-report col-h-rem'>
                                                <Controller
                                                    name="educationManagerName"
                                                    control={control}
                                                    render={({ field: {value, onChange} }) => (
                                                        <Input 
                                                            invalid={errors.educationManagerName && true}
                                                            placeholder='담당자 성함을 작성해주세요.'
                                                            value={value}
                                                            onChange={e => {
                                                                onChange(e)
                                                                saveCheckFunc(false)
                                                            }}
                                                        />
                                                )}/>
                                                {errors.educationManagerName && <FormFeedback>{errors.educationManagerName.message}</FormFeedback>}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={3} xs={12}>
                                        <Row>
                                            <Col className='card_table col top col_color text center risk-report text-normal col-h-rem'>직책</Col>
                                        </Row>
                                        <Row>
                                            <Col className='card_table col top text center border-left risk-report col-h-rem'>
                                                <Controller
                                                    name="educationManagerLevel"
                                                    control={control}
                                                    render={({ field: {value, onChange} }) => (
                                                        <Input 
                                                            invalid={errors.educationManagerLevel && true}
                                                            placeholder='담당자 직책을 작성해주세요.'
                                                            value={value}
                                                            onChange={e => {
                                                                onChange(e)
                                                                saveCheckFunc(false)
                                                            }}
                                                        />
                                                )}/>
                                                {errors.educationManagerLevel && <FormFeedback>{errors.educationManagerLevel.message}</FormFeedback>}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={3} xs={12}>
                                        <Row>
                                            <Col className='card_table col top col_color text center risk-report text-normal col-h-rem'>교육 장소</Col>
                                        </Row>
                                        <Row>
                                            <Col className='card_table col top text center border-left risk-report col-h-rem'>
                                                <Controller
                                                    name="educationLocation"
                                                    control={control}
                                                    render={({ field: {value, onChange} }) => (
                                                        <Input 
                                                            invalid={errors.educationLocation && true}
                                                            placeholder='교육 장소를 입력해주세요.'
                                                            value={value}
                                                            onChange={e => {
                                                                onChange(e)
                                                                saveCheckFunc(false)
                                                            }}
                                                        />
                                                )}/>
                                                {errors.educationLocation && <FormFeedback>{errors.educationLocation.message}</FormFeedback>}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg={3} xs={12}>
                                        <Row>
                                            <Col className='card_table col top col_color text center risk-report text-normal col-h-rem'>비고</Col>
                                        </Row>
                                        <Row>
                                            <Col className='card_table col top text center border-left risk-report col-h-rem'>
                                                <Controller
                                                    name="educationDescription"
                                                    control={control}
                                                    render={({ field: {value, onChange} }) => (
                                                        <Input 
                                                            invalid={errors.educationDescription && true}
                                                            placeholder='비고 내용을 입력해주세요.'
                                                            value={value}
                                                            onChange={e => {
                                                                onChange(e)
                                                                saveCheckFunc(false)
                                                            }}
                                                        />
                                                )}/>
                                                {errors.educationDescription && <FormFeedback>{errors.educationDescription.message}</FormFeedback>}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {/* 교육 참석자 명단 */}
                        <EmployeeTable
                            pageType={pageType}
                            handleModal={handleModal}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            cookies={cookies}
                            attendUser={attendUser}
                            setAttendUser={setAttendUser}
                            setAttendState={setAttendState}
                        />
                        <EduSignModal
                            cookies={cookies}
                            isOpen={isSignOpen}
                            setIsOpen={setIsSignOpen}
                            userSign={userSign}
                            setUserSign={setUserSign}
                            signType={signType}
                            setSignType={setSignType}
                            oldUserSign={oldUserSign}
                            setOldUserSign={setOldUserSign}
                            setSignUserData={setSignUserData}
                            state={state}
                        />
                        <PartnerFile 
                            partnerFiles={partnerFiles}
                            setPartnerFiles={setPartnerFiles}
                            showNames={showNames}
                            setShowNames={setShowNames}
                            criticalDisaster={criticalDisaster.educationId} //해당 사전회의 Id 전달
                        />
                    </CardBody>
					<CardFooter>
                        <FooterLine
                            handleSubmit={handleSubmit}
                            reset={reset}
                            tempSave={handleTempSave}
                        />
					</CardFooter>
				</Card>
			</Form>
		</Fragment>
	)
}

export default CategoryEducation
