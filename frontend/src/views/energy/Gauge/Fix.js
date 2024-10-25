import { yupResolver } from "@hookform/resolvers/yup"
import { Fragment, useState, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Col, Form, Input, Row, Button, FormFeedback, CardTitle, CardBody, Card, CardHeader } from "reactstrap"
import * as yup from 'yup'
import { Link, useNavigate, useParams } from "react-router-dom"
import {  API_GAUGE_REGISTER, API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, ROUTE_ENERGY_GAUGE_GROUP, ROUTE_ENERGY_GAUGE_GROUP_DETAIL, API_GAUGE_GROUP_DETAIL } from "../../../constants"
import axios from '../../../utility/AxiosConfig'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import Cookies from 'universal-cookie'
import Select from "react-select"
import { makeSelectList, checkSelectValueObj, checkSelectValue, axiosPostPutNavi } from "../../../utility/Utils"
import { isEmptyObject } from 'jquery'


const Gauge_Fix = () => {
    useAxiosIntercepter()
    const navigate = useNavigate()
    const params = useParams()
    const gauge_id = params.id
    const cookies = new Cookies()
    const property_id = cookies.get('property').value
    const [employeeClassList, setEmployeeClassList] = useState([])
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
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })
 
    const handleSelectValidation = (e, event) => { 
		checkSelectValue(e, event, selectError, setSelectError, setValue) 
	}

    const onSubmit = (data) => {

		const formData = new FormData()
		formData.append('gauge_id', gauge_id) // 사업소 아이디
        formData.append('code', data.code)
        formData.append('description', data.description)
		formData.append('emp_class', data.emp_class.value)
        
        axiosPostPutNavi('modify', '계량기', API_GAUGE_GROUP_DETAIL, formData, navigate, ROUTE_ENERGY_GAUGE_GROUP)
	}

    useEffect(() => {
        axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, { params: {property_id: property_id} })
        .then(
            resEmployeeClass => {
			makeSelectList(true, '', resEmployeeClass.data, employeeClassList, setEmployeeClassList, ['name'], 'id')
        })

        axios.get(API_GAUGE_GROUP_DETAIL, { params: {gauge_id: gauge_id} })
        .then((response) => {
            setValue('code', response.data.code)
            setValue('description', response.data.description)
            setValue('emp_class', {value:response.data.employee_class.id, label:response.data.employee_class.code})
        }).catch((error) => console.error(error))
		
	}, [])
	
    useEffect(() => {
        if (!isEmptyObject(errors)) {
            checkSelectValueObj(control, selectError, setSelectError)
        }
	}, [errors])

	return (
    <Fragment>
        <Card>
            <CardHeader>
                <CardTitle className="mb-1">계량기정보 수정</CardTitle>
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
                                        name='emp_class'
                                        control={control}
                                        render={({ field: { value } }) => (
                                        <Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                            <Select 
                                                name='emp_class'
                                                autosize={true}
                                                className="react-select custom-select-emp_class custom-react-select"
                                                classNamePrefix='select'
                                                options={employeeClassList}
                                                defaultValue={employeeClassList[0]}
                                                value={value}
                                                onChange={handleSelectValidation}
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
                                                <Input bsSize='sm' maxLength={254} placeholder="가스(냉온수기)" invalid={errors.code && true} {...field} />
                                                {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
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
                                        render={({ field }) => <Input bsSize='sm' placeholder="일일검침" invalid={errors.description && true} {...field} />}
                                    />
                                    {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row>            
                        <Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%'}}>
                            <Button 
                                color='report'
                                style={{marginTop: '1%', marginRight: '1%'}} 
                                tag={Link}
                                to={`${ROUTE_ENERGY_GAUGE_GROUP_DETAIL}/${gauge_id}`}
                                >취소</Button>
                            <Button type='submit' color='primary' style={{marginTop: '1%'}} >수정</Button>
                        </Col>
                    </Row>
                </Form>
            </CardBody>
        </Card>
    </Fragment>
	)
}

export default Gauge_Fix