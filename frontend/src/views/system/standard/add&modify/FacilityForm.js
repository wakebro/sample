import axios from 'axios'
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import { Button, CardBody, Col, Form, FormFeedback, Input, Label, Row, CardFooter } from "reactstrap"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { ROUTE_STANDARD, API_STANDARD_FACILITY, ROUTE_STANDARD_FACILITY_DETAIL } from '../../../../constants'
import { axiosPostPut, compareCode, sweetAlert } from '../../../../utility/Utils'


const Facility = (props) => {
    const { state, control, handleSubmit, errors, checkCode, setCheckCode, watch, setValue} = props
    const [submitResult, setSubmitResult] = useState(false)
	const [detailData, setDetailData] = useState()
	const [oldCode, setOldCode] = useState()
	useAxiosIntercepter()

    const onSubmit = (data) => {
		if ((!checkCode) && (data.code !==  oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
		const pageType = state.type
		const formData = new FormData()
		formData.append('code', data.code)
		formData.append('description', data.description)
		formData.append('view_order', data.view_order)
		const API = pageType === 'register' ? API_STANDARD_FACILITY
										: `${API_STANDARD_FACILITY}/${state.id}`

		axiosPostPut(pageType, "장비분류", API, formData, setSubmitResult)

	}

    useEffect(() => {
		setCheckCode(false)
	}, [watch])

	useEffect(() => {
		if (state.type === 'modify') {
			axios.get(`${API_STANDARD_FACILITY}/${state.id}`)
			.then(res => {
				setDetailData(res.data)
				setOldCode(res.data.code)
			})
		}
    }, [])

    useEffect(() => {
		if (submitResult) {
			if (state.type === 'modify') {
				window.location.href = `${ROUTE_STANDARD_FACILITY_DETAIL}/${state.id}`
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
                <Row className='card_table top' style={{marginTop: '1%'}} >
					<Col md='6' xs='12'>
						<Row className='card_table table_row'>
							<Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
								<div>장비 분류명</div>&nbsp;
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
													<Button size='sm' onClick={() => compareCode(field.value, oldCode, API_STANDARD_FACILITY, setCheckCode)}>중복검사</Button>
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
							tag={Link} 
							to={ROUTE_STANDARD} 
							state={{
								key: 'facility'
							}} >목록보기</Button> */}
					</Fragment>
				</CardFooter>
			</Form>
		</CardBody>
	)
    

}
export default Facility