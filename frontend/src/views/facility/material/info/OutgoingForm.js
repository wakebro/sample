/* eslint-disable */
import { Fragment, useEffect, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Row } from "reactstrap"
import { getTableData, sweetAlert, AddCommaOnChange, getCommaDel, axiosSweetAlert, getTableDataCallback, checkSelectValueObj, checkSelectValue } from "../../../../utility/Utils"
import { API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT_SELECT_OPTIONS, API_FACILITY_MATERIAL_INFO_STOCK, API_FACILITY_MATERIAL_STOCK_OUTGOING_FORM, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST } from "../../../../constants"
import Cookies from "universal-cookie"
import Select from 'react-select'
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'
import { isEmptyObject } from 'jquery'

const inputUnregister = (id, unregister, inputListYup, setInputListYup, selectError, setSelectError) => {
    unregister(`code${id}`)
    unregister(`outgoingQty${id}`)
    const copyInputListYup = yup.object().shape({
        ...inputListYup.fields
    })
    delete copyInputListYup.fields[`code${id}`]
    delete copyInputListYup.fields[`outgoingQty${id}`]
    setInputListYup(copyInputListYup)
    const copyError = {...selectError}
    delete copyError[`code${id}`]
    setSelectError(copyError)
}

const OutgoingForm = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const navigate = useNavigate()
    const [materialOptions, setMaterialOptions] = useState([{value: '', label: '선택'}])
    const [data, setData] = useState([])
    const [material, setMaterial] = useState([])
    const [input, setInput] = useState([{id: 1, code: '', outgoingQty: 0, unitPrice: [], description: ''}])
    const [submitResult, setSubmitResult] = useState(false)

    const [inputListYup, setInputListYup] = useState(yup.object().shape({}))
    const [selectError, setSelectError] = useState({})

    const {
        control,
        handleSubmit,
        setValue,
        trigger,
        unregister,
        formState: { errors }
    } = useForm({
        defaultValues : {},
		resolver: yupResolver(inputListYup)
    })

    const handleDelete = (id) => {
        if (input.length !== 1) {
            const temp = input.filter(item => item.id !== id)
            inputUnregister(id, unregister, inputListYup, setInputListYup, selectError, setSelectError)
            setInput(temp)
        }
    }

    const handleAdd = () => {
        const temp = [...input, {id: (input[input.length - 1]).id + 1, outgoingQty: 0, unitPrice: [], description: '', code: ''}]
        setInput(temp)
    }

    const handleUnitPrice = (id, qty, code) => {
        let inputNumber = qty
        const modifiedData = []

        for (let i = 0; i < data.length && inputNumber > 0; i++) {
            try {
                const subtractAmount = Math.min(inputNumber, (data.filter(item => item.material === code))[i].quantity)
                modifiedData.push({ unit_price: (data.filter(item => item.material === code))[i].unit_price, quantity: subtractAmount })
                inputNumber -= subtractAmount
            } catch (err) {
                sweetAlert('', '재고수량보다 출고수량이 많을 수 없습니다.', 'warning', 'center')
                const outgoingQty = document.getElementById(`outgoingQty${id}`)
                outgoingQty.value = ''
                return ''
            }
        }
        return modifiedData
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
                return ''
            }
            checkSelectValue(value, event, selectError, setSelectError, setValue)
            const temp = input.map(item => {
                if (item.id === id) {
                    return { ...item, [field]: value.value }
                }
                return item
            })
            setInput(temp)
        } else if (field !== 'code') {
            const validation = /^[\d,\.]+$/g
            if (field !== 'description' && value !== '' && !value.match(validation)) {
                sweetAlert('', '숫자형태로 입력해주세요', 'warning', 'center')
                return false
            }
            if (field === 'outgoingQty') {
                if (material.filter(item => item.material_id === input.filter(item => item.id === id)[0].code)[0].total_quantity < getCommaDel(value)) {
                    sweetAlert('', '재고수량보다 출고수량이 많을 수 없습니다', 'warning', 'center')
                    setValue(`outgoingQty${id}`, '')
                    const temp = input.map(item => {
                        if (item.id === id) {
                            return { ...item, ['outgoingQty']: '', ['unitPrice']: [] }
                        }
                        return item
                    })
                    setInput(temp)
                    return ''
                }
            }
            const temp = input.map(item => {
                if (item.id === id) {
                    return { ...item, [field]: getCommaDel(value), ['unitPrice']: handleUnitPrice(id, getCommaDel(value), item.code) }
                }
                return item
            })
            setInput(temp)
        }
    }

    const onSubmit = () => {
        const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }

        axios.post(API_FACILITY_MATERIAL_INFO_STOCK, {data: JSON.stringify(input)}, {params: {type: 'outgoing', user: cookies.get('userId'), property_id: cookies.get('property').value}})
        .then(res => {
            if (res.status === 200) {
                axiosSweetAlert(`자재출고 등록 완료`, `자재출고 등록 되었습니다.`, 'success', 'center', setSubmitResult)
            } else {
                sweetAlert(`자재출고 실패`, `자재출고 등록이 실패헀습니다.<br/>다시한번 확인 해주세요.`, 'warning')
            }
        })
        .catch(res => {
            console.log(API_FACILITY_MATERIAL_INFO_STOCK, res)
        })
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
                [`outgoingQty${rowInput.id}`]: yup.string().required('출고수량을 입력해주세요.')
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
        getTableData(API_FACILITY_MATERIAL_INFO_STOCK, {property_id: cookies.get('property').value, material_id: ''}, setData)
        getTableData(API_FACILITY_MATERIAL_STOCK_OUTGOING_FORM, {property_id: cookies.get('property').value, material_id: ''}, setMaterial)
    }, [])

    useEffect(() => {
        if (submitResult) navigate(ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST)
    }, [submitResult])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='자재정보' breadCrumbParent='시설관리' breadCrumbParent2='자재관리' breadCrumbActive='자재정보' />
                </div>
            </Row>
            <Card>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>출고 등록</CardTitle>
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
                                                        자재&nbsp;
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
                                                                    onChange={(e, event) => handleInput(item.id, 'code', e, event)}
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
                                                        출고수량&nbsp;
                                                        <div className='essential_value'/>
                                                    </Col>
                                                    <Col lg='8' md='8' xs='8' className='risk-report select-p-y d-flex justify-content-center flex-column'>
                                                        <Controller 
                                                            id={`outgoingQty${item.id}`}
                                                            name={`outgoingQty${item.id}`}
                                                            control={control}
                                                            render={({field: {onChange, value}}) => (
                                                                <>
                                                                <Input 
                                                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                                    invalid={errors[`outgoingQty${item.id}`] && true}
                                                                    onChange={ e => {
                                                                        AddCommaOnChange(e, onChange)
                                                                        handleInput(item.id, 'outgoingQty', e.target.value)
                                                                        trigger(`outgoingQty${item.id}`)
                                                                    }}
                                                                    disabled={input.filter(data => data.id === item.id)[0].code === ''}
                                                                    placeholder={input.filter(data => data.id === item.id)[0].code !== '' ? (material.filter(data => data.material_id === input.filter(data => data.id === item.id)[0].code)[0] ? `현재 재고: ${material.filter(data => data.material_id === input.filter(data => data.id === item.id)[0].code)[0].total_quantity}개` : '현재 재고: 0개') : ''}
                                                                />
                                                                {errors[`outgoingQty${item.id}`]&& <FormFeedback>{errors[`outgoingQty${item.id}`].message}</FormFeedback>}
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
                                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>단가</Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                                        <Input 
                                                            disabled 
                                                            value={input.filter(data => data.id === item.id)[0].unitPrice.map(item => `₩${item.unit_price.toLocaleString('ko-KR')} (${item.quantity.toLocaleString('ko-KR')}EA)`).join(' / ')}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col md='6' xs='12'>
                                                <Row className='card_table table_row'>
                                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>출고금액</Col>
                                                    <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                                        <Input 
                                                            disabled 
                                                            value={`\u{20A9}${input.filter(data => data.id === item.id)[0].unitPrice.reduce((total, item) => total + (item.unit_price * item.quantity), 0).toLocaleString('ko-KR')}`}
                                                            />
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
                                                <Button outline className='mt-1' onClick={() => handleDelete(item.id)}>삭제</Button>
                                            </Col>
                                        )}
                                        {item === input[input.length - 1] && (
                                            <Col style={{display: 'flex', justifyContent: 'end'}}>
                                                <Button outline className='m-1' onClick={() => handleDelete(item.id)}>삭제</Button>
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

export default OutgoingForm