/* eslint-disable */
import React, { Fragment, useEffect, useState, useRef } from "react"
import { Controller, useForm } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import { FooterLine } from "../EvaluationForm"
import { Card, CardBody, CardFooter, Col, Input, Row, Label, Form, CardHeader } from "reactstrap"
import { axiosPostPutCallback, getObjectKeyCheck, getTableDataCallback, useObserver } from '../../../../../../../utility/Utils'
import * as moment from 'moment'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { SummernoteLite } from "react-summernote-lite"
import 'react-summernote-lite/dist/glob'
import '@views/apps/summernote-ko-KR'
import { ROUTE_CRITICAL_DISASTER_EVALUATION, API_CRITICAL_DISASTER_BOARD_FORM, API_CRITICAL_DISASTER_BOARD_DETAIL } from '../../../../../../../constants'
import { useAxiosIntercepter } from '../../../../../../../utility/hooks/useAxiosInterceptor'
import { setTabTempSaveCheck, setPageType, setNoticeId } from '@store/module/criticalDisaster'
import { customPickerDateChange, defaultValues } from '../../data'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import Cookies from "universal-cookie"
import { Korean } from "flatpickr/dist/l10n/ko.js"

const CategoryNoticeForm = () => {
    const cookies = new Cookies()
    const activeUser = Number(cookies.get('userId'))
    useAxiosIntercepter()
    const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const evaluationId = criticalDisaster.evaluationId
    const totlaTitle = criticalDisaster.cdTotalTitle
    const now = moment().format('YYYY-MM-DD')
    const noteRef = useRef()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {
		control,
		formState: { errors },
		handleSubmit,
		setValue
	} = useForm({defaultValues : defaultValues.notice})

    function reset() {
		setValue('title', '')
        setValue('range', '')
        setValue('location', '')
        noteRef.current.summernote('code', '')
	}

    const regModCallback = (data) => {
        dispatch(setNoticeId(data))
        if (criticalDisaster.pageType === 'modify') dispatch(setPageType('detail'))
    }

    function handleTempSave(data) {
        dispatch(setTabTempSaveCheck(true))

        const formData = new FormData()
        const content = noteRef.current.summernote('code')
        
        formData.append('critical_disaster', evaluationId)
        formData.append('title', data.title ? data.title : '')
        if (data.range && getObjectKeyCheck(data, 'range') !== '') {
            formData.append('start_datetime', data.range[0]) 
            formData.append('end_datetime', data.range[1]) 
        } else {
            formData.append('start_datetime', '')
            formData.append('end_datetime', '')
        }
        formData.append('location', data.location ? data.location : '')
        formData.append('type', false)
        formData.append('content', content ? content : '')
        formData.append('writer', activeUser)
        formData.append('evaluator', '')
        //writer

        const noticeId = criticalDisaster.noticeId
        const regMod = noticeId === '' ? 'register' : 'modify'
        const API = regMod === 'register' ? API_CRITICAL_DISASTER_BOARD_FORM : `${API_CRITICAL_DISASTER_BOARD_DETAIL}/${noticeId}`
        axiosPostPutCallback(regMod, '실시공고', API, formData, regModCallback)
	}

    useEffect(() => {
        const MySwal = withReactContent(Swal)
        if (criticalDisaster.pageType === 'register' && evaluationId === '') {
            MySwal.fire({
                title: '위험성 평가 등록 실패',
                html: '위험성 평가 등록 실패했습니다.<br/>위험성 평가를 다시 등록해주세요.',
                icon: 'warning',
                heightAuto: false,
                customClass: {
                    confirmButton: 'btn btn-primary',
                    actions: 'sweet-alert-custom center'
                }
            }).then(res => {
                if (res.isConfirmed === true) {
                    navigate(`${ROUTE_CRITICAL_DISASTER_EVALUATION}/list`)
                }}
            )
        }
        const noticeId = criticalDisaster.noticeId
        if (noticeId === '') {
            setValue('title', `${totlaTitle}-실시공고-${moment().format('YYYY-MM-DD')}`)
        }
        if (criticalDisaster.pageType === 'register' && noticeId === '') {
            dispatch(setTabTempSaveCheck(false))
        }
    }, [])

    const getModifyData = (data) => {
        setValue('title', data.title)
        setValue('location', data.location)
        noteRef.current.summernote('code', data.content)
        setValue('range', [data.start_datetime, data.end_datetime])

        useObserver('div.noteOne .note-editable', () => {
            dispatch(setTabTempSaveCheck(false))
        })
    }

    useEffect(() => {
        const noticeId = criticalDisaster.noticeId
        if (noticeId !== '') {
            getTableDataCallback(`${API_CRITICAL_DISASTER_BOARD_DETAIL}/${noticeId}`,{}, getModifyData)
        }
    }, [criticalDisaster.noticeId])

    return (
        <Fragment>
            <Form onSubmit={handleSubmit(handleTempSave)}>
                <Card>
                    <CardHeader>
                        <Controller
                            name='title'
                            control={control}
                            render={({ field: {onChange, value} }) => (
                                <Row className='w-100' style={{alignItems:'center'}}>
                                    <Col md={9} xs={8}>
                                        <Input placeholder='실시 공고 제목을 입력해주세요.'
                                            bsSize='lg'
                                            invalid={errors.title && true}
                                            onChange={e => {
                                                onChange(e)
                                                dispatch(setTabTempSaveCheck(false))
                                            }}
                                            value={value}
                                        />
                                    </Col>
                                </Row>
                            )
                        }/>
                    </CardHeader>

                    <CardBody>
                        <Row className='mb-2 card_table mid'>
                            <Col lg='6' md='6' xs='12'>
                                <Row className='border-top'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center risk-report text-normal'>
                                        공고기간
                                    </Col>
                                    <Controller
                                        id = 'range'
                                        name='range'
                                        control={control}
                                        render={({ field : {onChange, value}}) => (
                                            <Col lg='8' xs='8' md='8' className='card_table col text center'>
                                                <Row style={{width:'100%', height:'100%'}}>
                                                    <Flatpickr
                                                        style={{height:'45.99px'}}
                                                        id='range-picker'
                                                        className= {`form-control ${errors.range ? 'is-invalid' : ''}`}
                                                        value={value}
                                                        placeholder={`${now} ~ ${now}`}
                                                        onChange={(date) => {
                                                            if (date.length === 2) { 
                                                                dispatch(setTabTempSaveCheck(false))
                                                                onChange(customPickerDateChange(date, false)) 
                                                            }
                                                        }}
                                                        options={{
                                                            mode: 'range',
                                                            dateFormat: 'Y-m-d',
                                                            locale: Korean
                                                        }}
                                                    />
                                                    {errors.range && <div style={{color:'#ea5455', fontSize:'0.857rem', paddingLeft:0, marginTop:'0.25rem'}}>{errors.range.message}</div>}
                                                </Row>
                                            </Col>
                                        )
                                    }/>
                                </Row>
                            </Col>
                            <Col lg='6' md='6' xs='12'>
                                <Row className='border-top' style={{height:'100%'}}>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center risk-report text-normal'>
                                        공고장소
                                    </Col>
                                    <Controller
                                        name='location'
                                        control={control}
                                        render={({ field :{onChange, value} }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                                <Input
                                                    style={{width:'100%', height:'45.99px'}}
                                                    bsSize='md'
                                                    invalid={errors.location && true}
                                                    onChange={e => {
                                                        dispatch(setTabTempSaveCheck(false))
                                                        onChange(e)
                                                    }}
                                                    value={value}
                                                    placeholder='공고 장소를 입력해주세요.'
                                                    />
                                            </Col>
                                        )
                                    }/>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='mb-2'>
                            <Col className='card_table col text' style={{paddingBottom:0}}>
                                <Label className='risk-report text-lg-bold'>
                                    공고 내용
                                </Label>
                            </Col>
                            <div className="noteOne">
                                <SummernoteLite
                                    name='content'
                                    lang={'ko-KR'}
                                    ref={noteRef}
                                    height={'400px'}
                                    placeholder="실시 공고 내용을 입력해주세요."
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
                            </div>
                        </Row>
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
export default CategoryNoticeForm