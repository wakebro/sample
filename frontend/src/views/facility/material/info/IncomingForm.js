/* eslint-disable */
import { Fragment, useEffect, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Row } from "reactstrap"
import { useNavigate } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import Select from 'react-select'
import { sweetAlert, AddCommaOnChange, getCommaDel, axiosSweetAlert, getTableDataCallback, checkSelectValueObj, checkSelectValue } from '../../../../utility/Utils'
import { API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT_SELECT_OPTIONS, API_FACILITY_MATERIAL_INFO_STOCK, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST } from "../../../../constants"
import Cookies from "universal-cookie"
import axios from "axios"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'
import { isEmptyObject } from 'jquery'

const inputUnregister = (id, unregister, inputListYup, setInputListYup, selectError, setSelectError) => {
    unregister(`code${id}`)
    unregister(`incomingQty${id}`)
    unregister(`unitPrice${id}`)
    const copyInputListYup = yup.object().shape({
        ...inputListYup.fields
    })
    delete copyInputListYup.fields[`code${id}`]
    delete copyInputListYup.fields[`incomingQty${id}`]
    delete copyInputListYup.fields[`unitPrice${id}`]
    setInputListYup(copyInputListYup)
    const copyError = {...selectError}
    delete copyError[`code${id}`]
    setSelectError(copyError)
}

const IncomingForm = () => {
    useAxiosIntercepter()
    const navigate = useNavigate()
    const cookies = new Cookies()
    // const [rowIndex, setRowIndex] = useState([0])
    const [materialOptions, setMaterialOptions] = useState([{value: '', label: '선택'}])
    const [submitResult, setSubmitResult] = useState(false)

    const [inputListYup, setInputListYup] = useState(yup.object().shape({}))
    const [selectError, setSelectError] = useState({})

    const {
        control,
        unregister,
        setValue,
        handleSubmit,
        trigger,
        formState: { errors }
    } = useForm({
        defaultValues : {},
		resolver: yupResolver(inputListYup)
    })

    const [input, setInput] = useState([{id: 1, code: '', incomingQty: 0, unitPrice: 0, incomingPrice: 0, description: ''}])

    const onSubmit = () => {
        const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }

        axios.post(API_FACILITY_MATERIAL_INFO_STOCK, {data: JSON.stringify(input)}, {params: {type: 'incoming', user: cookies.get('userId'), property_id: cookies.get('property').value}})
        .then(res => {
            if (res.status === 200) {
                axiosSweetAlert(`자재입고 등록 완료`, `자재입고가 등록 되었습니다.`, 'success', 'center', setSubmitResult)
            } else {
                sweetAlert(`자재입고 실패`, `자재입고 등록이 실패헀습니다.<br/>다시한번 확인 해주세요.`, 'warning')
            }
        })
        .catch(res => {
            console.log(API_FACILITY_MATERIAL_INFO_STOCK, res)
        })
    }
    
    const handleDelete = (id) => {
        if (input.length !== 1) {
            const temp = input.filter(item => item.id !== id)
            inputUnregister(id, unregister, inputListYup, setInputListYup, selectError, setSelectError)
            setInput(temp)
        }
    }

    const handleAdd = () => {
        const temp = [...input, {id: (input[input.length - 1]).id + 1, incomingQty: 0, unitPrice: 0, incomingPrice: 0, description: '', code: ''}]
        setInput(temp)
    }

    const handleInput = (id, field, value, event) => {
        if (field === 'code') {
            if (input.some(item => item.code === value.value)) {
                sweetAlert('', '이미 선택된 자재입니다.', 'warning', 'center')
                setValue(`code${id}`, {value: '', label: '선택'})
                value = {value: '', label: '선택'}
                const temp = input.map(item => {
                    if (item.id === id) {
                        return { ...item, ['code']: '' }
                    }
                    return item
                })
                setInput(temp)
                return false
            }
            setValue(`code${id}`, value)
            checkSelectValue(value, event, selectError, setSelectError, setValue)
            const temp = input.map(item => {
                if (item.id === id) {
                    return { ...item, ['code']: value.value }
                }
                return item
            })
            setInput(temp)
        } else {
            const validation = /^[\d,\.]+$/g
            if (field !== 'description' && value !== '' && !value.match(validation)) {
                sweetAlert('', '숫자형태로 입력해주세요', 'warning', 'center')
                return false
            }
            const temp = input.map(item => {
                if (item.id === id) {
                    return { ...item, [field]: getCommaDel(value), ['incomingPrice']: item.incomingQty * item.unitPrice }
                }
                return item
            })
            setInput(temp)
        }
    }

    useEffect(() => {
        if (!isEmptyObject(errors)) {
            checkSelectValueObj(control, selectError, setSelectError)
        }
	}, [errors]) // select error 처리

    useEffect(() => {
        let currInputListYup = yup.object().shape({
            ...inputListYup.fields
        })
        const copyError = {...selectError}
        for (const rowInput of input) {
            currInputListYup = yup.object().shape({
                ...currInputListYup.fields,
                [`incomingQty${rowInput.id}`]: yup.string().required('입고수량을 입력해주세요.'),
                [`unitPrice${rowInput.id}`]: yup.string().required('단가를 입력해주세요.')
            })
            copyError[`code${rowInput.id}`] = copyError[`code${rowInput.id}`] !== undefined && copyError[`code${rowInput.id}`]
        }
        setSelectError(copyError)
        setInputListYup(currInputListYup)
    }, [input])

    const getMaterialOptions = (data) => {
        if (Array.isArray(data)) {
            data.shift()
            data.unshift({value: '', label: '선택'})
        }
        setMaterialOptions(data)
    }

    useEffect(() => {
        getTableDataCallback(API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT_SELECT_OPTIONS, {property_id: cookies.get('property').value}, getMaterialOptions)
    }, [])

    useEffect(() => {
        if (submitResult) navigate(ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST)
    }, [submitResult])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='자재정보' breadCrumbParent='시설관리' breadCrumbParent2='자재관리' breadCrumbActive='자재정보' />
                    <Button className='mb-2' outline onClick={() => navigate(ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST)} style={{minWidth: '100px'}}>목록보기</Button>
                </div>
            </Row>
            <Card>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>입고 등록</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {
                            input.map((item, index) => {
                                return (
                                    <div key={item.id} className='mb-1'>
                                        <Row style={{fontSize: '20px', margin: 0}}>{index + 1}.</Row>
                                        <Row className='card_table top'>
                                            <Col md='6' xs='12'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                                        자재 &nbsp;
                                                        <div className='essential_value'/>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='risk-report select-p-y d-flex justify-content-center flex-column'>
                                                        <Controller
                                                            id={`code${item.id}`}
                                                            name={`code${item.id}`}
                                                            control={control}
                                                            render={({ field: { value } }) => (
                                                                <Select
                                                                    name={`code${item.id}`}
                                                                    classNamePrefix='select'
                                                                    className={`react-select custom-react-select custom-react-select custom-select-code${item.id}`}
                                                                    value={value}
                                                                    options={materialOptions}
                                                                    defaultValue={materialOptions[0]}
                                                                    onChange={(e, event) => {
                                                                        handleInput(item.id, 'code', e, event)
                                                                    }}
                                                                />
                                                            )}
                                                        />
		                                				{selectError[`code${item.id}`] && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>{'자재를 선택해주세요.'}</div>}
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md='6' xs='12'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                                        입고수량 &nbsp;
                                                        <div className='essential_value'/>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='risk-report select-p-y d-flex justify-content-center flex-column'>
                                                        <Controller 
                                                            id={`incomingQty${item.id}`}
                                                            name={`incomingQty${item.id}`}
                                                            control={control}
                                                            render={({field: {onChange, value}}) => (
                                                                <>
                                                                <Input 
                                                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                                    invalid={errors[`incomingQty${item.id}`] && true}
                                                                    onChange={ e => {
                                                                        AddCommaOnChange(e, onChange)
                                                                        handleInput(item.id, 'incomingQty', e.target.value)
                                                                        trigger(`incomingQty${item.id}`)
                                                                    }}
                                                                    disabled={input.filter(data => data.id === item.id)[0].code === ''}
                                                                />
                                                                {errors[`incomingQty${item.id}`]&& <FormFeedback>{errors[`incomingQty${item.id}`].message}</FormFeedback>}
                                                                </>
                                                            )}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className='card_table mid'>
                                            <Col md='6' xs='12'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                                        단가 &nbsp;
                                                        <div className='essential_value'/>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='risk-report select-p-y d-flex justify-content-center flex-column'>
                                                        <Controller 
                                                            id={`unitPrice${item.id}`}
                                                            name={`unitPrice${item.id}`}
                                                            control={control}
                                                            render={({field: {onChange, value}}) => (
                                                                <>
                                                                    <Input 
                                                                        value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                                        invalid={errors[`unitPrice${item.id}`] && true}
                                                                        onChange={ e => {
                                                                            AddCommaOnChange(e, onChange)
                                                                            handleInput(item.id, 'unitPrice', e.target.value)
                                                                            trigger(`unitPrice${item.id}`)
                                                                        }}
                                                                        disabled={input.filter(data => data.id === item.id)[0].code === ''} 
                                                                    />
                                                                    {errors[`unitPrice${item.id}`]&& <FormFeedback>{errors[`unitPrice${item.id}`].message}</FormFeedback>}
                                                                </>

                                                            )}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md='6' xs='12'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>입고금액</Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                                        <Input 
                                                            disabled 
                                                            value={!isNaN(input.filter(data => data.id === item.id)[0].incomingQty * input.filter(data => data.id === item.id)[0].unitPrice) ? `\u{20A9}${(input.filter(data => data.id === item.id)[0].incomingQty * input.filter(data => data.id === item.id)[0].unitPrice).toLocaleString('KO-kr')}` : 0} />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row className='card_table mid'>
                                            <Col md='12' xs='12'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>비고</Col>
                                                    <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                        <Input onChange={(e) => handleInput(item.id, 'description', e.target.value)} />
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        {item !== input[input.length - 1] && (
                                            <Col style={{display: 'flex', justifyContent: 'end'}}>
                                                {/* <Button outline className='mt-1' onClick={() => setRowIndex(rowIndex.filter(number => number !== item))}>삭제</Button> */}
                                                <Button outline className='mt-1' onClick={() => handleDelete(item.id)}>삭제</Button>
                                            </Col>
                                        )}
                                        {item === input[input.length - 1] && (
                                            <Col style={{display: 'flex', justifyContent: 'end'}}>
                                                {/* <Button outline className='m-1' onClick={() => setRowIndex(rowIndex.filter(number => number !== item))}>삭제</Button> */}
                                                <Button outline className='m-1' onClick={() => handleDelete(item.id)}>삭제</Button>
                                                {/* <Button outline className='my-1' onClick={() => setRowIndex([...rowIndex, rowIndex[rowIndex.length - 1] + 1])}>추가</Button> */}
                                                <Button outline className='my-1' onClick={() => handleAdd()}>추가</Button>
                                            </Col>
                                        )}
                                    </div>
                                )
                            })
                        }
                    </CardBody>
                    <CardFooter style={{display:'flex', justifyContent:'end'}}>
                        <Button className="mx-1" onClick={() => navigate(-1)}>취소</Button>
                        <Button type='submit' color='primary'>저장</Button>
                    </CardFooter>
                </Form>
            </Card>
        </Fragment>
    )
}

export default IncomingForm