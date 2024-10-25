import { yupResolver } from "@hookform/resolvers/yup"
import { isEmptyObject } from 'jquery'
import { Fragment, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import Select from "react-select"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, Input, InputGroup, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import * as yup from 'yup'
import { API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, API_GAUGE_GROUP_DETAIL, API_GAUGE_GROUP_REGISTER, ROUTE_ENERGY_GAUGE_GROUP, ROUTE_ENERGY_GAUGE_GROUP_DETAIL } from "../../../constants"
import axios from '../../../utility/AxiosConfig'
import { axiosPostPutNavi, checkSelectValue, checkSelectValueObj, compareCodeWithEmployeeClass, makeSelectList, sweetAlert } from "../../../utility/Utils"
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'


const Gauge_Register = () => {
	useAxiosIntercepter()
	const navigate = useNavigate()
	const params = useParams()
	const cookies = new Cookies()
	const property_id = cookies.get('property').value
	const [employeeClassList, setEmployeeClassList] = useState([])
	const [checkCode, setCheckCode] = useState(false)
	const [oldCode, setOldCode] = useState()
	const [selectError, setSelectError] = useState({emp_class: false})
	const {emp_class} = selectError

	const defaultValues = {
		code: '', // 계량기명
		emp_class: {value:'', label:'선택'},
		description: ''  // 비고      
	}

	const validationSchema = yup.object().shape({
		code: yup.string().required('계량기명을 입력해주세요.').min(1, '1자 이상 입력해주세요')
	})

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		watch
	} = useForm({
		defaultValues,
		resolver: yupResolver(validationSchema)
	})
 
	const handleSelectValidation = (e, event) => { 
		setCheckCode(false)
		checkSelectValue(e, event, selectError, setSelectError, setValue) 
	}

	const handleCustomCompareCode = (newValue) => {
		if (watch('emp_class').value === '') sweetAlert('', '직종을 선택해주세요.', 'warning', 'center')
		compareCodeWithEmployeeClass(newValue, property_id, oldCode, API_GAUGE_GROUP_DETAIL, setCheckCode, watch('emp_class').value)
	}

	const onSubmit = (data) => {
		const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }
		if (!checkCode && (data.code !== oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}

		const modify = Object.keys(params).includes('id')

		const formData = new FormData()
		formData.append('code', data.code)
		formData.append('description', data.description)
		formData.append('emp_class', data.emp_class.value)

		if (modify) formData.append('gauge_id', params.id)
		else formData.append('property_id', property_id) // 사업소 아이디

		const API = modify ? API_GAUGE_GROUP_DETAIL : API_GAUGE_GROUP_REGISTER
		axiosPostPutNavi(modify ? 'modify' : 'register', '계량기', API, formData, navigate, ROUTE_ENERGY_GAUGE_GROUP)
	}


	useEffect(() => {
		axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, { params: {property_id: property_id} })
		.then(
			resEmployeeClass => {
			makeSelectList(true, '', resEmployeeClass.data, employeeClassList, setEmployeeClassList, ['name'], 'id')
		})

		if (Object.keys(params).includes('id')) {
			axios.get(API_GAUGE_GROUP_DETAIL, { params: {gauge_id: params.id} })
				.then((response) => {
					setOldCode(response.data.code)
					setValue('code', response.data.code)
					setValue('description', response.data.description)
					setValue('emp_class', {value:response.data.employee_class.id, label:response.data.employee_class.code})
				}).catch((error) => console.error(error))
		}
	}, [])
	
	useEffect(() => {
		if (!isEmptyObject(errors)) checkSelectValueObj(control, selectError, setSelectError)
	}, [errors])

	useEffect(() => setCheckCode(false), [watch['code']])

	return (
	<Fragment>
		<Card>
			<CardHeader>
				<CardTitle className="mb-1">계량기 정보 등록</CardTitle>
			</CardHeader>

			<CardBody>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Row className="card_table mx-0 border-right" style={{borderTop: '1px solid #B9B9C3'}}>
						<Col md={6} xs={12} className="border-b">
						{ employeeClassList &&
							<Row style={{height:'100%'}}>
								<Col xs='4' md='4'  className='card_table col col_color text center '>
									<div>직종</div>&nbsp;
									<div className="essential_value"/>
								</Col>
								<Col xs='8' md='8' className='card_table col'>
									<Controller
										id='emp_class'
										name='emp_class'
										control={control}
										render={({ field: { value } }) => (
										<Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
											<Select 
												id='emp_class'
												name='emp_class'
												autosize={true}
												className="react-select custom-select-emp_class custom-react-select"
												classNamePrefix='select'
												options={employeeClassList}
												value={value}
												onChange={handleSelectValidation}
												styles={{ menu: base => ({...base, zIndex:9999 })}}
											/>
											{emp_class && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
										</Col>
									)}/>
								</Col>
							</Row>
						}
						</Col>
						<Col md={6} xs={12} className="border-b">
							<Row style={{height:'100%'}}>
								<Col xs='4' md='4'  className='card_table col col_color text center '>
									<div>계량기명</div>&nbsp;
									<div className="essential_value"/>
								</Col>
								<Col xs='8' md='8' className='card_table col text start '>
									<Controller
										id='code'
										name='code'
										control={control}
										render={({ field }) => (
											<>
												<InputGroup>
													<Input bsSize='sm' maxLength={254} placeholder="가스(냉온수기)" invalid={errors.code && true} {...field} />
													<Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem'}} size='sm' 
														onClick={() => handleCustomCompareCode(field.value)}>중복검사</Button>
													{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
												</InputGroup>
											</>
										)}
									/>
								</Col>

							</Row>
						</Col>
					</Row>
					<Row className="card_table mid mb-3">
						<Col>
							<Row md='6' className='card_table table_row'>
								<Col xs='4' md='2'  className='card_table col col_color text center '>비고</Col>
								<Col xs='8' md='10' className='card_table col text start '>
									<Controller
										id='description'
										name='description'
										control={control}
										render={({ field }) => <Input bsSize='sm' invalid={errors.description && true} {...field} />}
									/>
									{errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
					</Row>

					<Row>
						<Col className='d-flex justify-content-end mb-1' style={{paddingRight: '3%'}}>
							<Button 
								style={{marginTop: '1%', marginRight: '1%'}} 
								tag={Link}
								to={`${Object.keys(params).includes('id') ? `${ROUTE_ENERGY_GAUGE_GROUP_DETAIL}/${params.id}` : ROUTE_ENERGY_GAUGE_GROUP}`}
								color='report'
								>취소</Button>
							<Button type='submit' color='primary' style={{marginTop: '1%'}}>확인</Button>
						</Col>
					</Row>
				</Form>
			</CardBody>
		</Card>
	</Fragment>
	)
}

export default Gauge_Register