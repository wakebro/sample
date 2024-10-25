import axios from 'axios'
import { Fragment, useState, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { isEmptyObject } from 'jquery'
import { Button, CardBody, CardFooter, Col, Form, FormFeedback, Input, InputGroup, Row } from "reactstrap"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import {API_INCONV_LICENSE, ROUTE_SYSTEMMGMT_INCONV_LICENSE, ROUTE_SYSTEMMGMT_INCONV_LICENSE_DETAIL, API_INCONV_LICENSE_LEGAL } from '../../../../constants'
import { checkSelectValue, checkSelectValueObj, axiosPostPut, compareCodeWithValueProperty, sweetAlert, getTableDataCallback } from '../../../../utility/Utils'
import Cookies from 'universal-cookie'
import { InconvInfoUrlObj, legalCodeOptions } from '../InconData'

const License = (props) => {
	const { state, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue} = props
	const [selectEmployeeClassList, setSelectEmployeeClassList] = useState([{value:'', label: '선택'}]) //eslint-disable-line no-unused-vars
	const [detailData, setDetailData] = useState()
    const [legalCode, setLegalCode] = useState([{value:'', label: '법규 코드 선택'}])
    const [legalCodeList, setLegalCodeList] = useState(legalCodeOptions)
	const [selectError, setSelectError] = useState({emp_class: false})
	const {emp_class} = selectError
	const [submitResult, setSubmitResult] = useState(false)
	const cookies = new Cookies()
    const [oldCode, setOldCode] = useState()

	useAxiosIntercepter()

	const handleSelectValidation = (e, event) => { 
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

	const onSubmit = (data) => {
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { 
			sweetAlert('', '저장할수 없습니다.<br/>다시 확인해 주세요.', 'warning')
            return false 
        }
		if ((!checkCode) && (data.code !== oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
		const pageType = state.type
		const formData = new FormData()
        
		formData.append('code', data.code)
		formData.append('legal_code', data.legal_code.value)
		formData.append('emp_class', data.emp_class.value)
		formData.append('issuer', data.issuer)
        formData.append('description', data.description)
		formData.append('property', cookies.get('property').value)
		const API = pageType === 'register' ? API_INCONV_LICENSE
										: `${API_INCONV_LICENSE}/${state.id}`
		axiosPostPut(pageType, "자격증 정보", API, formData, setSubmitResult)
	}

    const handleLegalArray = (data) => {
        setLegalCodeList(prevList => [...prevList, ...data])
    }

    useEffect(() => {
        console.log(state.type)
        if (state.type === 'register') {
            axios.get(API_INCONV_LICENSE, {params:{property:cookies.get('property').value, search: '', select_employee_class: ''}})
			.then(res => {
                const empClassList = []
				for (let i = 0; i < res.data.emp_class_list.length; i++) {
                    empClassList.push({value:res.data.emp_class_list[i].id, label:res.data.emp_class_list[i].code})
                }
				setSelectEmployeeClassList(prevList => [...prevList, ...empClassList])
			})
		} else {
            axios.get(`${API_INCONV_LICENSE}/${state.id}`, {params:{property:cookies.get('property').value}})
			.then(res => {
                const empClassList = []
				for (let i = 0; i < res.data.emp_class_list.length; i++) {
					empClassList.push({value:res.data.emp_class_list[i].id, label:res.data.emp_class_list[i].code})
				}
				setSelectEmployeeClassList(prevList => [...prevList, ...empClassList])
				setDetailData(res.data.data)
                setOldCode(res.data.data.code)
			})
		}
    }, [])

    useEffect(() => {
        getTableDataCallback(API_INCONV_LICENSE_LEGAL, {}, handleLegalArray)
    }, [])

	useEffect(() => {
		setCheckCode(false)
	}, [watch])

	useEffect(() => {
		if (state.type === 'register') {
			if (!isEmptyObject(errors)) {
				checkSelectValueObj(control, selectError, setSelectError)
			}
		}
	}, [errors])

	useEffect(() => {
		if (submitResult) {
			if (state.type === 'modify') {
				window.location.href = `${ROUTE_SYSTEMMGMT_INCONV_LICENSE_DETAIL}/${state.id}`
			} else {
				window.location.href = ROUTE_SYSTEMMGMT_INCONV_LICENSE
			}
		}
	}, [submitResult])

	useEffect(() => {
		if (state.type !== 'register' && detailData) {
            console.log(detailData)
			setValue("emp_class", selectEmployeeClassList.find(item => item.label === detailData.emp_class.code))
			setValue("code", detailData.code)
            setValue("legal_code", legalCodeList.find(item => item.value === detailData.legal_code_id))
            setValue("issuer", detailData.issuer)
			setValue("description", detailData.description)
		}
	}, [detailData])

    useEffect(() => {
        setValue("legal_code", legalCode)
    }, [legalCode])

	return (
        <Fragment>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <CardBody>
                    <Row className='mx-0'>
                        <Col lg='6' md='6' xs='12' className='card_table top'>
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4'  className='card_table col col_color text center '>
                                    자격명&nbsp;
								    <div className='essential_value'/>
                                </Col>
                                <Controller
                                    name='code'
                                    control={control}
                                    render={({ field }) => (
                                        <Col className='card_table col text'>
                                            <InputGroup>
                                                <Input maxLength='30' invalid={errors.code && true} {...field}/>
                                                <Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem'}} onClick={() => compareCodeWithValueProperty(field.value, cookies.get('property').value, oldCode, InconvInfoUrlObj.license, setCheckCode)}>중복검사</Button>
                                                {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                                            </InputGroup>
                                        </Col>
                                )}/>
                            </Row>
                        </Col>
                        <Col lg='6' md='6' xs='12' className='card_table top'>
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>법규 코드</Col>
                                <Controller
                                    name='legal_code'
                                    control={control}
                                    render={({ field: { value } }) => (
                                    <Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
                                        <Select
                                            name='legal_code'
                                            classNamePrefix={'select'}
                                            className="react-select custom-select-environment_type custom-react-select"
                                            options={legalCodeList}
                                            value={value}
                                            onChange={(e) => setLegalCode(e)}/>
                                    </Col>
                                )}/>
                            </Row>
                        </Col>
                    </Row>
                    { selectEmployeeClassList && state.type === 'register' &&
                    <Row className='mx-0'>
                        <Col lg='6' md='6' xs='12' className='card_table mid'>
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                    직종 코드&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <Controller
                                    name='emp_class'
                                    control={control}
                                    render={({ field: { value } }) => (
                                    <Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                        <Select
                                            name='emp_class'
                                            classNamePrefix={'select'}
                                            className="react-select custom-select-emp_class custom-react-select"
                                            options={selectEmployeeClassList}
                                            value={value}
                                            onChange={ handleSelectValidation }/>
                                        {emp_class && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
                                    </Col>
                                )}/>
                            </Row>
                        </Col>
                        <Col lg='6' md='6' xs='12' className='card_table mid'>
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                    발급처&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <Controller
                                    name='issuer'
                                    control={control}
                                    render={({ field }) => (
                                    <Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
                                        <Input maxLength='30' bsSize='sm' invalid={errors.issuer && true} {...field}/>
                                        {errors.issuer && <FormFeedback>{errors.issuer.message}</FormFeedback>}
                                    </Col>
                                )}/>
                            </Row>
                        </Col>
                    </Row>
                    }
                    { detailData &&
                    <Row className='mx-0'>
                        <Col lg='6' md='6' xs='12' className='card_table mid'>
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                    직종 코드&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <Controller
                                    name='emp_class'
                                    control={control}
                                    render={({ field: { value } }) => (
                                    <Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                        <Select
                                            name='emp_class'
                                            classNamePrefix={'select'}
                                            className="react-select custom-select-emp_class custom-react-select"
                                            options={selectEmployeeClassList}
                                            value={value}
                                            onChange={ handleSelectValidation }/>
                                        {emp_class && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
                                    </Col>
                                )}/>
                            </Row>
                        </Col>
                        <Col lg='6' md='6' xs='12' className='card_table mid'>
                            <Row className='card_table table_row'>
                                <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                    발급처&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <Controller
                                    name='issuer'
                                    control={control}
                                    render={({ field }) => (
                                    <Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
                                        <Input bsSize='sm' invalid={errors.issuer && true} {...field}/>
                                        {errors.issuer && <FormFeedback>{errors.issuer.message}</FormFeedback>}
                                    </Col>
                                )}/>
                            </Row>
                        </Col>
                    </Row>
                    }
                    <Row className='mb-1 card_table mid'>
                        <Col lg='12' md='12' xs='12'>
                            <Row className='card_table table_row'>
                                <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>비고</Col>
                                <Controller
                                    name='description'
                                    control={control}
                                    render={({ field }) => (
                                    <Col lg='10' md='10' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
                                        <Input maxLength='100' bsSize='sm' invalid={errors.description && true} {...field}/>
                                        {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                                    </Col>
                                )}/>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                    {state.type === 'modify' &&
						<Button color='report' 
							className="ms-1"
							tag={Link} 
							to={`${ROUTE_SYSTEMMGMT_INCONV_LICENSE_DETAIL}/${state.id}`} 
							state={{
								key: 'normal'
							}} >취소</Button>
					}
                    <Button type='submit' className="ms-1" color='primary'>{state.type === 'register' ? '저장' : '수정'}</Button>
                    <Button className='ms-1' tag={Link} to={ROUTE_SYSTEMMGMT_INCONV_LICENSE}>목록</Button>
                </CardFooter>
            </Form>
        </Fragment>
	)
}

export default License