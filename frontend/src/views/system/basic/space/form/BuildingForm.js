import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useAxiosIntercepter } from '@utility/hooks/useAxiosInterceptor'
import {
	axiosPostPut,
	compareCode,
	setFormData,
	setValueFormat, sweetAlert
} from "@utils"
import { Fragment } from "react"
import { Controller } from 'react-hook-form'
import { Link } from "react-router-dom"
import { Button, CardBody, CardFooter, Col, Form, FormFeedback, Input, InputGroup, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_SPACE_BUILDING, ROUTE_SYSTEMMGMT_BASIC_SPACE } from '../../../../../constants'
import { apiObj, labelObj } from '../data'

const BuildingForm = (props) => {
	useAxiosIntercepter()
	const { pageType, setPageType, control, handleSubmit, errors, oldCode, checkCode, setCheckCode, setValue, setSubmitResult, rowId, detailBackUp } = props
	const cookies = new Cookies()

	const onSubmit = (data) => {
		if (!checkCode && (data.code !== oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
		const formData = new FormData()
		setFormData(data, formData)
		formData.append('prop', cookies.get('property').value)

		const API = pageType === 'register' ? `${apiObj['building']}/-1`
										: `${apiObj['building']}/${rowId}`

		axiosPostPut(pageType, labelObj['building'], API, formData, setSubmitResult)
	}
	return (
		<Fragment>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row className='mx-0' >
					<Col md='6' xs='12' className="card_table top">
						<Row className='card_table table_row'>
							<Col md='4' xs='3'  className='card_table col_input col_color text center' style={{paddingLeft:'1%', paddingRight:'1%'}}>
								건물코드&nbsp;
								<div className='essential_value'/>
							</Col>
							<Col md='8' xs='9' className='card_table text' style={{paddingTop:'1%', paddingBottom:'1%', textAlign:'start'}}>
								<Controller
									id='code'
									name='code'
									control={control}
									render={({ field }) => (
										<Fragment>
											<InputGroup>
												<Input bsSize='sm' placeholder={'건물코드를 입력해주세요.'} invalid={errors.code && true} {...field} />
												<Button size='sm' onClick={() => compareCode(field.value, oldCode, API_SPACE_BUILDING, setCheckCode)}>중복검사</Button>
											</InputGroup>
											{errors.code && <div className='custom-form-feedback'>{errors.code.message}</div>}
										</Fragment>
									)}/>
							</Col>
						</Row>
					</Col>
					<Col md='6' xs='12' className="card_table top">
						<Row className='card_table table_row'>
							<Col md='4' xs='3' className='card_table col_input col_color text center' style={{paddingLeft:'1%', paddingRight:'1%'}}>
								건물명&nbsp;
								<div className='essential_value'/>
							</Col>
							<Col md='8' xs='9' className='card_table text start' style={{paddingTop:'1%', paddingBottom:'1%'}}>
								<Controller
									id='name'
									name='name'
									control={control}
									render={({ field }) => <Input bsSize='sm' placeholder={'건물명을 입력해주세요.'} invalid={errors.name && true} {...field} />}
								/>
								{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='12'>
						<Row className='card_table table_row'>
							<Col md='2' xs='3' className='card_table col_input col_color text center '>비고</Col>
							<Col md='10' xs='9' className='card_table text start' style={{paddingTop:'1%', paddingBottom:'1%'}}>
								<Controller
									id='comments'
									name='comments'
									control={control}
									render={({ field }) => <Input type='textarea' bsSize='sm'  invalid={errors.comments && true} {...field} />}
								/>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
			<CardFooter className="px-1" style={{marginTop:'2rem'}}>
				<Col style={{display:'flex', justifyContent:'flex-end'}}>
					{pageType === 'modify' && <Button color='report' onClick={() => setValueFormat(detailBackUp, control._formValues, setValue, setPageType)}>취소</Button>}
					<Button className='ms-1' onClick={handleSubmit(onSubmit)} color='primary'>{pageType === 'register' ? '저장' : '수정'}</Button>
					<Button className='ms-1' tag={Link} to={ROUTE_SYSTEMMGMT_BASIC_SPACE}>목록</Button>						
				</Col>
			</CardFooter>
		</Fragment>
	)
}

export default BuildingForm