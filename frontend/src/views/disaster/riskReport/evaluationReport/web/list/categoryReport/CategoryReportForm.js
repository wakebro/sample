/* eslint-disable */
import React, { Fragment, useEffect, useState, useRef } from "react"
import { Controller, useForm } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import { FooterLine } from "../EvaluationForm"
import { Card, CardBody, CardFooter, Col, Input, Row, Label, Form, CardHeader } from "reactstrap"
import { axiosPostPutCallback, getTableDataCallback } from '../../../../../../../utility/Utils'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { SummernoteLite } from "react-summernote-lite"
import 'react-summernote-lite/dist/glob'
import '@views/apps/summernote-ko-KR'
import { API_CRITICAL_DISASTER_BOARD_FORM, API_CRITICAL_DISASTER_BOARD_DETAIL } from '../../../../../../../constants'
import { useAxiosIntercepter } from '../../../../../../../utility/hooks/useAxiosInterceptor'
import { setTabTempSaveCheck, setReportId, setPageType } from '@store/module/criticalDisaster'
import { defaultValues } from '../../data'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const CategoryReportForm = () => {
    const cookies = new Cookies()
    const activeUser = Number(cookies.get('userId'))
    useAxiosIntercepter()
    const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const evaluationId = criticalDisaster.evaluationId
    const totlaTitle = criticalDisaster.cdTotalTitle
    const noteRef = useRef()
    const [allDay] = useState(false)
    const [startPicker, setStartPicker] = useState(new Date())
    const [endPicker, setEndPicker] = useState(new Date())
    const dispatch = useDispatch()

    const {
		control,
		formState: { errors },
		handleSubmit,
		setValue
	} = useForm({defaultValues : defaultValues.report})

    const formatDateTime = (datetimeString) => {
        if (!datetimeString) {
            return false
        }
        const date = new Date(datetimeString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1)
        const day = String(date.getDate())
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        
        return `${year}-${month}-${day} ${hours}:${minutes}`
    }

    function reset() {
		setValue('title', '')
        setValue('evaluator', '')
        setValue('description', '')
        setStartPicker(new Date())
        setEndPicker(new Date())
        noteRef.current.summernote('code', '')
	}

    const regModCallback = (data) => {
        dispatch(setReportId(data))
        if (criticalDisaster.pageType === 'modify') dispatch(setPageType('detail'))
    }

    function handleTempSave(data) {
        dispatch(setTabTempSaveCheck(true))

        const formData = new FormData()
        const content = noteRef.current.summernote('code')
        
        formData.append('critical_disaster', evaluationId)
        formData.append('title', data.title ? data.title : '')
        formData.append('start_datetime', formatDateTime(startPicker))
        formData.append('end_datetime', formatDateTime(endPicker))
        formData.append('evaluator', data.evaluator ? data.evaluator : '')
        formData.append('type', true)
        formData.append('content', content ? content : '')
        formData.append('description', data.description ? data.description : '')
        formData.append('writer', activeUser)

        const reportId = criticalDisaster.reportId
        const regMod = reportId === '' ? 'register' : 'modify'
        const API = regMod === 'register' ? API_CRITICAL_DISASTER_BOARD_FORM : `${API_CRITICAL_DISASTER_BOARD_DETAIL}/${reportId}`
        axiosPostPutCallback(regMod, '결과보고서', API, formData, regModCallback)
	}

    const getModifyData = (data) => {
        setValue('title', data.title)
        setValue('evaluator', data.evaluator)
        noteRef.current.summernote('code', data.content)
        setStartPicker(data.start_datetime)
        setEndPicker(data.end_datetime)
        setValue('description', data.description)

        useObserver('div.noteOne .note-editable', () => {
            dispatch(setTabTempSaveCheck(false))
        })
    }

    useEffect(() => {
        const reportId = criticalDisaster.reportId
        if (reportId !== '') {
            getTableDataCallback(`${API_CRITICAL_DISASTER_BOARD_DETAIL}/${reportId}`,{}, getModifyData)
        }
    }, [criticalDisaster.reportId])

    useEffect(() => {
        const reportId = criticalDisaster.reportId
        if (reportId === '') {
            setValue('title', `${totlaTitle}-결과보고서-${moment().format('YYYY-MM-DD')}`)
        }
    }, [])

    return (
        <Fragment>
            <Form onSubmit={handleSubmit(handleTempSave)}>
                <Card>
                    <CardHeader>
                        <Controller
                            name='title'
                            control={control}
                            render={({ field: {onChange, value} }) => (
                                <Row style={{alignItems:'center', width:'100%'}}>
                                    <Col md={9} xs={8}>
                                        <Input placeholder='결과 보고서 제목을 입력해주세요.'
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
                                        시행 일시&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Col lg='4' md='4' xs='4' className='mb-1'>
                                        <Label className='form-label' for='startDate'>
                                            시작일/시간
                                        </Label>
                                        <Flatpickr
                                            required
                                            id='start_datetime'
                                            name='start_datetime'
                                            className='form-control'
                                            onChange={date => {
                                                setStartPicker(date[0])
                                                dispatch(setTabTempSaveCheck(false))
                                            }}
                                            value={startPicker}
                                            options={{
                                                enableTime: allDay === false,
                                                dateFormat: 'Y-m-d H:i',
                                                locale: Korean
                                            }}
                                        />
                                    </Col>
                                    <Col lg='4' md='4' xs='4' className='mb-1'>
                                        <Label className='form-label' for='endDate'>
                                            종료일/시간
                                        </Label>
                                        <Flatpickr
                                            required
                                            id='end_datetime'
                                            name='end_datetime'
                                            className='form-control'
                                            onChange={date => {
                                                setEndPicker(date[0])
                                                dispatch(setTabTempSaveCheck(false))
                                            }}
                                            value={endPicker}
                                            options={{
                                                enableTime: allDay === false,
                                                dateFormat: 'Y-m-d H:i',
                                                locale: Korean
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg='6' md='6' xs='12'>
                                <Row className='border-top' style={{height:'100%'}}>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center risk-report text-normal'>
                                        평가자&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                        name='evaluator'
                                        control={control}
                                        render={({ field: {onChange, value} }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                                <Input
                                                    bsSize='lg'
                                                    invalid={errors.evaluator && true}
                                                    placeholder='평가자를 입력해주세요.'
                                                    onChange={e => {
                                                        onChange(e)
                                                        dispatch(setTabTempSaveCheck(false))
                                                    }}
                                                    value={value}
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
                                    평가 결과
                                </Label>
                            </Col>
                            <div className="noteOne">
                                <SummernoteLite
                                    name='content'
                                    lang={'ko-KR'}
                                    ref={noteRef}
                                    placeholder="결과 보고서 내용을 입력해주세요."
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

                        <Row className='mb-2'>
                            <Label className='risk-report text-lg-bold'>
                                기타 특이사항
                            </Label>
                            <Col lg={12} style={{paddingBottom:0}}>
                                <Controller
                                    name='description'
                                    control={control}
                                    render={({ field: {onChange, value} }) => (
                                        <Input
                                            type='textarea'
                                            style={{width:'100%', minHeight:'10rem'}}
                                            bsSize='lg'
                                            invalid={errors.description && true}
                                            onChange={e => {
                                                onChange(e)
                                                dispatch(setTabTempSaveCheck(false))
                                            }}
                                            value={value}
                                        />
                                    )
                                }/>
                                {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                            </Col>
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
export default CategoryReportForm