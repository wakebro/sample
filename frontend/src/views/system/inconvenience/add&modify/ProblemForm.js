/* eslint-disable */
import axios from 'axios'
import { Fragment, useState, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { isEmptyObject } from 'jquery'
import { Button, CardBody, Col, Form, FormFeedback, Input, InputGroup, Row, CardFooter } from "reactstrap"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import {API_INCONV_PROBLEM, ROUTE_INCONV, ROUTE_SYSTEMMGMT_INCONV_PROBLEM_DETAIL } from '../../../../constants'
import { checkSelectValue, checkSelectValueObj, axiosPostPut, compareCodeWithEmployeeClass, sweetAlert } from '../../../../utility/Utils'
import { environmentTable } from '../InconData'
import Cookies from 'universal-cookie'


const Problem = (props) => {
	const { state, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue} = props
	const [selectTableList, setSelectTableList] = useState([{label: '직종', value:''}])
	const [selectEmployeeClass, setSelectEmployeeClass] = useState()
	const [detailData, setDetailData] = useState()
	// const [selectenvironment, setSelectEnvironment] = useState({label:'없음', value:''})
	const [selectError, setSelectError] = useState({emp_class: false})
	const {emp_class} = selectError
	const [submitResult, setSubmitResult] = useState(false)
	const [oldCode, setOldCode] = useState()
	const cookies = new Cookies()
	useAxiosIntercepter()

	const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
		setSelectEmployeeClass(e.value)
	}

	const onSubmit = (data) => {
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }
		if ((!checkCode) && (data.code !==  oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
		const pageType = state.type
		const formData = new FormData()
		formData.append('code', data.code)
		formData.append('description', data.description === null ? '' : data.description)
		formData.append('employee_class', data.emp_class.value)
		// formData.append('environment_type', data.environment_type.value)
		formData.append('property', cookies.get('property').value)
		const API = pageType === 'register' ? API_INCONV_PROBLEM
										: `${API_INCONV_PROBLEM}/${state.id}`

		axiosPostPut(pageType, "문제유형", API, formData, setSubmitResult)
	}
	useEffect(() => {
		if (state.type === 'register') {
			axios.get(API_INCONV_PROBLEM, {params:{property:cookies.get('property').value, search: '', select_employee_class: ''}})
			.then(res => {
				const empClassList = []
				for (let i = 0; i < res.data.emp_class_list.length; i++) {
					empClassList.push({value:res.data.emp_class_list[i].id, label:res.data.emp_class_list[i].code})
				  }
				setSelectTableList(prevList => [...prevList, ...empClassList])
			})
		} else {
			axios.get(`${API_INCONV_PROBLEM}/${state.id}`, {params:{property:cookies.get('property').value}})
			.then(res => {
				const empClassList = []
				for (let i = 0; i < res.data.emp_class_list.length; i++) {
					empClassList.push({value:res.data.emp_class_list[i].id, label:res.data.emp_class_list[i].code})
				}
				setSelectTableList(prevList => [...prevList, ...empClassList])
				setDetailData(res.data.problem)
				setOldCode(res.data.problem.code)
			})
		}
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
				window.location.href = `${ROUTE_SYSTEMMGMT_INCONV_PROBLEM_DETAIL}/${state.id}`
			} else {
				window.location.href = ROUTE_INCONV
			}
		}
	}, [submitResult])

	useEffect(() => {
		if (detailData) {
			setValue("code", detailData.code)
			setValue("emp_class", selectTableList.find(item => item.value === detailData.employee_class))
			setValue("environment_type", environmentTable.find(item => item.value === detailData.environment_type))
			setValue("description", detailData.description)
			setSelectEmployeeClass(detailData.employee_class)
		}
	}, [detailData])

	return (
		<CardBody>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row className='mx-0' style={{marginTop: '1%'}} >
					<Col md='6' xs='12' className='card_table top'>
                        <Row className='card_table table_row'>
							<Col lg='4' md='4' xs='3' className='card_table col col_color text center'>
								<div>직종</div>&nbsp;
								<div className='essential_value'/>
							</Col>
							{ selectTableList && 
							<Controller
								name='emp_class'
								control={control}
								render={({ field: { value } }) => (
									<Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
										<Select
											name='emp_class'
											classNamePrefix={'select'}
											className="react-select custom-select-emp_class custom-react-select"
											options={selectTableList}
											value={value}
											onChange={ handleSelectValidation }/>
										{emp_class && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
									</Col>
								)}/>
							}
						</Row>
					</Col>
                    <Col md='6' xs='12' className='card_table top'>
                        <Row className='card_table table_row'>
							<Col lg='4' md='4' xs='3' className='card_table col col_color text center px-0'>
								<div>문제유형</div>&nbsp;
								<div className='essential_value'/>
							</Col>
							<Controller
								name='code'
								control={control}
								render={({ field }) => (
									<Col className='card_table col text'>
										<InputGroup>
											<Input maxLength="60" invalid={errors.code && true} {...field}/>
											<Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem'}} onClick={() => compareCodeWithEmployeeClass(field.value, cookies.get('property').value, oldCode, API_INCONV_PROBLEM, setCheckCode, selectEmployeeClass)}>중복검사</Button>
							 				{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
										</InputGroup>
									</Col>
								)}/>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' style={{marginBottom: '1%'}}> 
					<Col lg='6' md='6' xs='12'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='3' className='card_table col col_color text center'>설명</Col>
							<Controller
								name='description'
								control={control}
								render={({ field }) => (
									<Col className='card_table col text center' style={{flexDirection:'column'}}>
										<Input maxLength="100" style={{width:'100%'}} bsSize='sm' invalid={errors.description && true} {...field} />
										{errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
									</Col>
								)}/>
						</Row>
					</Col>
				</Row>
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
					<Fragment >
						{ state.type === 'modify' &&
							<Button color='report' 
								className="ms-1"
								tag={Link} 
								to={`${ROUTE_SYSTEMMGMT_INCONV_PROBLEM_DETAIL}/${state.id}`} 
								state={{
									key: 'problem'
								}} >취소</Button>
						}
						<Button type='submit' color='primary' className="ms-1">{state.type === 'register' ? '저장' : '수정'}</Button>
						<Button
							className="ms-1" 
							tag={Link} 
							to={ROUTE_INCONV} 
							state={{
								key: 'problem'
							}} >목록</Button>
					</Fragment>
				</CardFooter>
			</Form>
		</CardBody>
	)
}

export default Problem