import axios from 'axios'
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { isEmptyObject } from 'jquery'
import { Controller } from 'react-hook-form'
import { Button, CardBody, Col, Form, FormFeedback, Input, Label, Row, CardFooter } from "reactstrap"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { ROUTE_STANDARD, API_STANDARD_COSTCATEGORY, ROUTE_STANDARD_COSTCATEGORY_DETAIL } from '../../../../constants'
import { checkSelectValue, checkSelectValueObj, axiosPostPut, compareCode, sweetAlert } from '../../../../utility/Utils'
import Cookies from 'universal-cookie'


const CostCategoryType = (props) => {
    const { state, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue} = props
    const [submitResult, setSubmitResult] = useState(false)
	const [selectCostTypeList, setSelectCostTypeList] = useState([{ value:'', label: '인덱스타입'}])
    const [selectError, setSelectError] = useState({cost_type: false})
	const {cost_type} = selectError
	const [detailData, setDetailData] = useState()
	const [oldCode, setOldCode] = useState()
	const cookies = new Cookies()
	useAxiosIntercepter()

    const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
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
		formData.append('description', data.description)
		formData.append('view_order', data.view_order)
        formData.append('cost_type', data.cost_type.value)
		formData.append('property', cookies.get('store').value)
        console.log(formData)
		const API = pageType === 'register' ? API_STANDARD_COSTCATEGORY
										: `${API_STANDARD_COSTCATEGORY}/${state.id}`

		axiosPostPut(pageType, "장비분류", API, formData, setSubmitResult)

	}

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
		if (detailData) {
			setValue('code', detailData.code)
			setValue("cost_type", selectCostTypeList.find(item => item.value === detailData.cost_type))
			setValue("description", detailData.description)
		}
	}, [detailData])

	useEffect(() => {
		if (state.type === 'register') {
			console.log(cookies.get('store').value)
			axios.get(API_STANDARD_COSTCATEGORY, {params:{property:cookies.get('store').value, search: '', select_cost_type: ''}})
			.then(res => {
				console.log(res.data)
				const costTypeList = []
				for (let i = 0; i < res.data.cost_type_list.length; i++) {
					costTypeList.push({value:res.data.cost_type_list[i].id, label:res.data.cost_type_list[i].code})
				  }
				setSelectCostTypeList(prevList => [...prevList, ...costTypeList])
			})
		} else {
			axios.get(`${API_STANDARD_COSTCATEGORY}/${state.id}`, {params:{property:cookies.get('store').value}})
			.then(res => {
				const costTypeList = []
				for (let i = 0; i < res.data.cost_type_list.length; i++) {
					costTypeList.push({value:res.data.cost_type_list[i].id, label:res.data.cost_type_list[i].code})
				}
				setSelectCostTypeList(prevList => [...prevList, ...costTypeList])
				setDetailData(res.data.data)
				setOldCode(res.data.data.code)
			})
		}
    }, [])

    useEffect(() => {
		if (submitResult) {
			if (state.type === 'modify') {
				window.location.href = `${ROUTE_STANDARD_COSTCATEGORY_DETAIL}/${state.id}`
			} else {
				window.location.href = ROUTE_STANDARD
			}
		}
	}, [submitResult])

	useEffect(() => {
		if (detailData) {
			setValue("code", detailData.code)
			setValue("description", detailData.description)
			setValue("view_order", detailData.view_order)
		}
	}, [detailData])

    return (
		<CardBody style={{marginBottom: '1%'}}>
			<Form onSubmit={handleSubmit(onSubmit)}>
                <Row className='card_table top'>
					<Col md='6' xs='12'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                <div>인덱스타입명</div>&nbsp;
								<div className='essential_value'/>
                            </Col>
							<Controller
								name='code'
								control={control}
								render={({ field }) => (
									<Col lg='8' md='8' xs='8' className='card_table col text center'>
										<Row style={{width:'100%'}}>
											<Col lg='8' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
												<Row style={{width:'100%'}}>
													<Input style={{width:'100%'}} bsSize='sm' invalid={errors.code && true} {...field}/>
													{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
												</Row>
											</Col>
											<Col lg='4' xs='12'className='card_table col text center border_none' style={{paddingLeft:'0', paddingRight:'0'}}>
												<Row style={{width:'100%'}}>
													<Button size='sm' onClick={() => compareCode(field.value, oldCode, API_STANDARD_COSTCATEGORY, setCheckCode)}>중복검사</Button>
													{errors.code && <div>&nbsp;</div>}
												</Row>
											</Col>
										</Row>
									</Col>
								)}/>
						</Row>
					</Col>
                    <Col md='6' xs='12'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>장비분류코드</Col>
							<Controller
								name='name'
								control={control}
								render={({ field }) => (
									<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
										<Input style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field} placeholder='자동부여'/>
										{/* {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>} */}
									</Col>
								)}/>
						</Row>
					</Col>
				</Row>
                <Row className='card_table top'>
                    <Col lg='6' md='6' xs='12'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								<div>인덱스타입(코드)</div>&nbsp;
								<div className='essential_value'/>
							</Col>
							{ selectCostTypeList && 
							<Controller
								name='cost_type'
								control={control}
								render={({ field: { value } }) => (
									<Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
										<Select
											name='cost_type'
											classNamePrefix={'select'}
											className="react-select custom-select-cost_type custom-react-select"
											options={selectCostTypeList}
											value={value}
											onChange={ handleSelectValidation }/>
										{cost_type && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
									</Col>
								)}/>
							}
						</Row>
					</Col>
					<Col lg='6' md='6' xs='12'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>보기 순서</Col>
							<Controller
								name='view_order'
								control={control}
								render={({ field }) => (
									<Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
										<Input style={{width:'100%'}} bsSize='sm' invalid={errors.view_order && true} {...field}/>
										{errors.view_order && <FormFeedback>{errors.view_order.message}</FormFeedback>}
									</Col>
								)}/>
						</Row>
					</Col>
				</Row>
                <Row className='card_table top'>
					<Col xs='12'>
						<Row className='card_table table_row'>
							<Col xs='2' className='card_table col col_color text center'>설명</Col>
							<Col xs='10' className='card_table col text center' style={{justifyContent:'space-between'}}>
							<Controller
								name='description'
								control={control}
								render={({ field }) => (
									<Fragment>
										<Input type='textarea' rows='10' {...field}/>
									</Fragment>
								)}/>
							</Col>
						</Row>
					</Col>
				</Row>
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
					<Fragment >
						<Button type='submit' color='primary'>{state.type === 'register' ? '저장' : '수정'}</Button>
						{/* <Button color='primary' 
							className="ms-1"
							tag={Link} 
							to={ROUTE_STANDARD} 
							state={{
								key: 'costCategory'
							}} >목록보기</Button> */}
					</Fragment>
				</CardFooter>
			</Form>
		</CardBody>
	)
    

}
export default CostCategoryType