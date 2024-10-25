/* eslint-disable */
import { Card, CardBody, Row, Col, FormFeedback, Input, CardFooter, CardTitle, CardHeader } from "reactstrap"
import { Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'

import { setStringDate } from "../../../../../../../../utility/Utils"
import ApprovalModal from "./approval/ApprovalModal"
import { FooterLine } from "../../EvaluationForm"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import * as moment from 'moment'
import { useDispatch } from "react-redux"
import { setTabTempSaveCheck } from '@store/module/criticalDisaster'
import PartnerFile from "./PartnerFile"

const MeetingForm = (props) => {
    const {
        control, errors, SummernoteLite,
        handleSubmit, reset, handleTemporary, isOpen, setIsOpen,
        minutesRef, userSign, setUserSign, signType, setSignType,
        oldUserSign, setOldUserSign, setSignUserData, setPartnerFiles,
        partnerFiles, showNames, criticalDisaster, setShowNames
    } = props

    const now = moment().format('YYYY-MM-DD')
    const dispatch = useDispatch()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="risk-report title-bold d-flex align-items-center mb-1">
                    회의록
                </CardTitle>
                <Row className='w-100'>
                    <Col md={9} xs={9}>
                        <Controller
                            name='minutes_title'
                            control={control}
                            render={({ field: {value, onChange} }) => (
                                <Input 
                                    style={{width: '100%', minHeight: '4rem'}} 
                                    bsSize='lg' 
                                    maxLength={98}
                                    invalid={errors.title && true} 
                                    placeholder='회의록 제목을 입력하세요.'
                                    onChange={ e => {
                                        onChange(e)
                                        dispatch(setTabTempSaveCheck(false))
                                    }}
                                    value={value}
                                />
                            )
                        }/>
                        {errors.minutes_title && <FormFeedback>{errors.minutes_title.message}</FormFeedback>}
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>
                <Row className='card_table table_row border-te mx-0 border-b'>
                    <Col lg='1' md='2' xs='2'  className='card_table col_disaster text center border-left risk-report text-normal' style={{minHeight:'45px'}}>일시</Col>
                    <Col lg='3' md='2' xs='10'  className='card_table col_disaster text center border-x'>
                        <Controller
                            id='minutes_date'
                            name='minutes_date'
                            control={control}
                            render={({field : {onChange, value}}) => (
                                <Row style={{width: '100%'}}>
                                    <Flatpickr
                                        value={value}
                                        id='default-picker'
                                        className="form-control"
                                        onChange={(data) => {
                                            const newData = setStringDate(data)
                                            onChange(newData)
                                            dispatch(setTabTempSaveCheck(false))
                                        }}
                                        options={{
                                            mode: 'single',
                                            ariaDateFormat: 'Y-m-d',
                                            locale: Korean
                                        }}
                                        placeholder={now}
                                    />
                                    {errors.minutes_date && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.minutes_date.message}</div>}
                                </Row>
                            )}
                        />
                    </Col>
                    <Col lg='1' md='2' xs='2'  className='card_table col_disaster text center risk-report text-normal'>부서</Col>
                    <Col lg='3' md='2' xs='10'  className='card_table col_disaster text center border-x'>
                        <Controller
                            name='minutes_department'
                            control={control}
                            render={({ field: {value, onChange} }) => (
                                <Input 
                                    style={{width: '100%'}} 
                                    bsSize='sm'
                                    maxLength={98}
                                    invalid={errors.minutes_department && true} 
                                    onChange={ e => {
                                        onChange(e)
                                        dispatch(setTabTempSaveCheck(false))
                                    }}
                                    value={value}
                                />
                            )
                        }/>
                    </Col>
                    <Col lg='1' md='2' xs='2'  className='card_table col_disaster text center risk-report text-normal'>작성자</Col>
                    <Col lg='3' md='2' xs='10' className='card_table col_disaster text border-x risk-report text-normal'>
                        <Controller 
                        name='minutes_writer'
                        control={control}
                        render={({field: {value}}) => <div>{value}</div>}
                        />
                    </Col>
                </Row>
                <Row className='card_table border-right mx-0 border-b'>
                    <Col>
                        <Row className='card_table table_row'>
                            <Col lg='1' md='1' xs='2'  className='card_table text center col_input border-left risk-report text-normal' style={{minHeight:'45px'}}>참석자</Col>
                            <Col lg='11' md='11' xs='10'  className='card_table text col_input center border-left'>
                                <Controller
                                    name='minutes_participant'
                                    control={control}
                                    render={({ field: {value, onChange} }) => (
                                        <Input 
                                            style={{width: '100%'}} 
                                            bsSize='sm'
                                            maxLength={248}
                                            invalid={errors.minutes_participant && true} 
                                            onChange={ e => {
                                                onChange(e)
                                                dispatch(setTabTempSaveCheck(false))
                                            }}
                                            value={value}
                                        />
                                    )
                                }/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='card_table mx-0 pt-2 border-b'>
                    <Col>
                        <Row className='card_table table_row border-right'>
                            <Col lg='1' md='1' xs='2'  className='card_table col_disaster text center border-left risk-report text-normal' style={{minHeight:'92px'}}>회의 주제</Col>
                            <Col lg='11' md='11' xs='10'  className='card_table col_disaster text center border-left'>
                                <Controller
                                    name='minutes_topic'
                                    control={control}
                                    render={({ field }) => (
                                        <Input 
                                            style={{width: '100%', height:'85%'}} 
                                            bsSize='lg'
                                            maxLength={98}
                                            invalid={errors.minutes_topic && true} 
                                            {...field}/>
                                    )
                                }/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='card_table mx-0 pt-2 border-b'>
                    <Col>
                        <Row className='card_table table_row border-right'>
                            <Col lg='1' md='1' xs='2'  className='card_table col_disaster text center border-left risk-report text-normal' style={{minHeight:'92px'}}>회의 내용</Col>
                            <Col lg='11' md='11' xs='10' className='card_table col_disaster text center border-left p-0' style={{textAlign:'start'}}>
                                <Row style={{width:'100%'}}>
                                    <Col md={12} className="noteTwo p-0">
                                        <SummernoteLite 
                                            lang={'ko-KR'}
                                            ref={minutesRef}
                                            placeholder="회의내용을 작성해주세요."
                                            toolbar={[
                                                ['style', ['style']],
                                                ['font', ['bold', 'underline', 'clear', 'strikethrough', 'superscript', 'subscript']],
                                                ['fontsize', ['fontsize']],
                                                ['fontname', ['fontname']],
                                                ['color', ['color']],
                                                ['para', ['ul', 'ol', 'paragraph']],
                                                ['table', ['table']],
                                                ['insert', ['link', 'picture', 'video', 'hr']],
                                                ['view', ['fullscreen', 'codeview', 'help']]
                                            ]}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='card_table pt-2 mx-0 border-b'>
                    <Col>
                        <Row className='card_table table_row border-right'>
                            <Col lg='1' md='1' xs='2'  className='card_table col_disaster text center border-left risk-report text-normal' style={{minHeight:'92px'}}>전달 사항</Col>
                            <Col lg='11' md='11' xs='10'  className='card_table col_disaster text center border-left'>
                                <Controller
                                    name='minutes_infomation'
                                    control={control}
                                    render={({ field: {value, onChange} }) => (
                                        <Input 
                                            style={{width: '100%', height:'85%'}} 
                                            bsSize='lg'
                                            invalid={errors.minutes_infomation && true} 
                                            onChange={ e => {
                                                onChange(e)
                                                dispatch(setTabTempSaveCheck(false))
                                            }}
                                            value={value}
                                        />
                                    )
                                }/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='mb-2 card_table border-right mx-0 border-b'>
                    <Col>
                        <Row className='card_table table_row'>
                            <Col lg='1' md='1' xs='2'  className='card_table col_disaster text center border-left risk-report text-normal' style={{minHeight:'45px'}}>기타 사항</Col>
                            <Col lg='11' md='11' xs='10'  className='card_table col_disaster text center border-left'>
                                <Controller
                                    name='minutes_etc'
                                    control={control}
                                    render={({ field: {value, onChange} }) => (
                                        <Input 
                                            style={{width: '100%'}} 
                                            bsSize='sm'
                                            invalid={errors.minutes_etc && true} 
                                            onChange={ e => {
                                                onChange(e)
                                                dispatch(setTabTempSaveCheck(false))
                                            }}
                                            value={value}
                                        />
                                    )
                                }/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <PartnerFile 
                    partnerFiles={partnerFiles}
                    setPartnerFiles={setPartnerFiles}
                    showNames={showNames}
                    setShowNames={setShowNames}
                    criticalDisaster={criticalDisaster.meetingId} //해당 사전회의 Id 전달
                    />
                <ApprovalModal 
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    userSign={userSign}
                    setUserSign={setUserSign}
                    signType={signType}
                    setSignType={setSignType}
                    oldUserSign={oldUserSign}
                    setOldUserSign={setOldUserSign}
                    setSignUserData={setSignUserData}
                />
            </CardBody>
            <CardFooter>
                <FooterLine 
                    handleSubmit={handleSubmit}
                    reset={reset}
                    tempSave={handleTemporary}
                />
            </CardFooter>
        </Card>
    )
}
export default MeetingForm