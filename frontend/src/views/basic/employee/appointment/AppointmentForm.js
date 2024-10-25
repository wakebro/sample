import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { API_EMPLOYEE_APPOINTMENT_DETAIL, API_EMPLOYEE_LICENSE_LIST, API_EMPLOYEE_SELECT_ARRAY, ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT, ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_DETAIL } from '../../../../constants'
import { axiosPostPut, dataTableClickStyle, dateFormat, getTableData, setStringDate } from '../../../../utility/Utils'
import Flatpickr from "react-flatpickr"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import Select from 'react-select'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import * as yup from 'yup' 
import { yupResolver } from '@hookform/resolvers/yup'
import AppointmentDataTable from './AppointmentDataTable'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const AppointmentForm = () => {
    useAxiosIntercepter()
    const now = moment().format('YYYY-MM-DD')
    const navigate = useNavigate()
    const cookies = new Cookies()
    const { state } = useLocation()
    const [buildingArray, setBuildingArray] = useState([{value: '', label: '선임건물'}])
    const [legalArray, setLegalArray] = useState([{value: '', label: '관련법규'}])
    const [modal, setModal] = useState(false)
    const [licenseData, setLicenseData] = useState()
    const [rowId, setrowId] = useState(0)
    const [userId, setUserId] = state.type === 'register' ? useState(0) : useState(state.data.user.id)
    const [licenseId, setLicenseId] = state.type === 'register' ? useState(0) : useState(state.data.license.id)
    const [photo, setPhoto] = state.type === 'register' ? useState('') : useState(state.data.photo)
    const [submitResult, setSubmitResult] = useState()
    const columns = [
        {
			name: '직종',
			selector: row => row.license.emp_class.code,
            conditionalCellStyles: dataTableClickStyle(rowId)
		},
		{
            name: '이름(코드)',
			selector: row => `${row.user.name}(${row.user.username})`,
            conditionalCellStyles: dataTableClickStyle(rowId)
		},
		{
            name: '자격증',
			selector: row => row.license.code,
            conditionalCellStyles: dataTableClickStyle(rowId)
		}
	]

    const validationSchema = yup.object().shape({
        name_code: yup.string().required('이름(코드)를 선택해주세요.')
	})
    
    const toggle = () => setModal(!modal)
    
    const defaultValues = state.type === 'register' ? {
        name_code: '',
        license: '',
        acquisition_date: '',
        building: {value: '', label: '선임건물'},
        legal: {value: '', label: '관련법규'}
    } : {
        name_code: `${state.data.user.name}(${state.data.user.username})`,
        license: state.data.license.code,
        building: state.data.building ? {value: state.data.building.id, label:state.data.building.name} : {value: '', label:'전체'},
        legal: state.data.legal ? {value: state.data.legal.id, label: state.data.legal.name} : {value: '', label: '관련법규'},
        create_datetime: state.data.create_datetime,
        start_date: state.data.start_date,
        renewal_date: state.data.renewal_date,
        end_date: state.data.end_date,
        status: state.data.status,
        acquisition_date: state.data.acquisition_date ? dateFormat(state.data.acquisition_date) : state.data.acquisition_date,
        description: state.data.description
    }
    
    const {
        control,
        handleSubmit,
        setValue,
		formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })
    
    const onModalButton = () => {
        toggle()
        
        const data = licenseData.find(item => item.id === rowId)
        if (data === undefined) return 

        setUserId(data.user.id)
        setLicenseId(data.license.id)
        setValue('name_code', `${data.user.name} (${data.user.username})`)
        setValue('license', data.license.code)
        setValue('acquisition_date', moment(data.acquisition_date).format('YYYY-MM-DD'))
        setPhoto(data.photo)
    }
    
    const onSubmit = (data) => {
        const formData = new FormData()

        formData.append('property_id', cookies.get('property').value)
        formData.append('user_id', userId)

        formData.append('name_code', data.name_code)
        formData.append('license', licenseId)
        formData.append('acquisition_date', data.acquisition_date)
        formData.append('building', data.building.value)
        formData.append('legal', data.legal.value)
        formData.append('create_datetime', data.create_datetime)
        formData.append('start_date', data.start_date)
        formData.append('renewal_date', data.renewal_date)
        formData.append('end_date', data.end_date)
        formData.append('status', data.status)
        formData.append('description', data.description)

        const API = state.type === 'register' ? `${API_EMPLOYEE_APPOINTMENT_DETAIL}/-1`
                                : `${API_EMPLOYEE_APPOINTMENT_DETAIL}/${state.id}`
        axiosPostPut(state.type, "자격증선임현황", API, formData, setSubmitResult)
    }

    useEffect(() => {
        axios.get(API_EMPLOYEE_SELECT_ARRAY, {params: {property_id: cookies.get('property').value}})
        .then(res => {
            setBuildingArray(res.data.building_array)
            setLegalArray(res.data.legal_array)
        })
        .catch(res => {
            console.log(API_EMPLOYEE_SELECT_ARRAY, res)
        })
        getTableData(API_EMPLOYEE_LICENSE_LIST, {property : cookies.get('property').value}, setLicenseData)
    }, [])

    useEffect(() => {
		if (submitResult) {
			if (state.type === 'register') {
				navigate(ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT)
            } else {
				navigate(`${ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_DETAIL}/${state.id}`)
			}
		}
	}, [submitResult])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='선임관리' breadCrumbParent='기본정보' breadCrumbParent2='직원정보관리' breadCrumbActive='선임관리' />
                </div>
            </Row>
            <Card>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>자격증선임현황</CardTitle>
                    </CardHeader>
                    <CardBody className='mb-1'>
                        <Row>
                            {userId !== 0 && photo !== null ?
                                <Col className="card_table col text center" md='5'style={{height : 'auto'}}>
                                    <img src={`/static_backend/${photo}`} style={{height:"100%", width: '100%', objectFit:'contain'}}></img>
                                </Col>
                                :
                                <Col className="card_table col text center" md='5' style={{height : 'auto', backgroundColor: '#ECE9E9'}}>                                        
                                        자격증 이미지를 등록해 주세요.
                                </Col>
                            }
                            <Col md='7'>
                                <CardTitle style={{marginBottom: 0}}>기본정보</CardTitle>
                                <Row className='card_table top'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>
                                                <div>이름(코드)</div> &nbsp;
                                                <div className='essential_value'/>
                                            </Col>
                                            <Controller
                                                id='name_code'
                                                name='name_code'
                                                control={control}
                                                render={({ field }) => (
                                                    <Col lg='10' md='10' xs='8' className='card_table col text center'>
                                                        <Row style={{width: '100%'}}>
                                                            <Col md='9' xs='12' className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width: '100%'}}>
                                                                    <Input style={{width: '100%'}} disabled invalid={errors.name_code && true} {...field} />
                                                                    {errors.name_code && <FormFeedback>{errors.name_code.message}</FormFeedback>}
                                                                </Row>
                                                            </Col>
                                                            <Col md='3' xs='12' className='card_table col text center border_none' style={{paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width: '100%', height: '100%'}}>
                                                                    <Button outline size='sm' style={{height: '100%', width: '100%'}} onClick={toggle}>코드보기</Button>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                )}
                                            />
                                            <Modal isOpen={modal} toggle={toggle}>
                                                <ModalHeader>자격증선임</ModalHeader>
                                                <ModalBody style={{padding: 0}}>
                                                    <AppointmentDataTable
                                                        tableData={licenseData}
                                                        columns={columns}
                                                        setClick={setrowId}
                                                    />
                                                </ModalBody>
                                                <ModalFooter className='mt-1' style={{display:'flex', justifyContent:'end', alignItems:'center', borderTop: '1px solid #B9B9C3'}}>
                                                    <Button className="mx-1" color="report" onClick={() => toggle()}>취소</Button>
                                                    <Button color='primary' onClick={() => onModalButton()}>확인</Button>
                                                </ModalFooter>
                                            </Modal>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>자격증이름</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='license'
                                                    name='license'
                                                    control={control}
                                                    render={({ field }) => <Input disabled {...field}/>}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>취득일자</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='acquisition_date'
                                                    name='acquisition_date'
                                                    control={control}
                                                    render={({ field }) => <Input disabled {...field}/>}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>선임대상</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text center' style={{paddingTop: '0.5%', paddingBottom: '0.5%'}}>
                                                <Col>
                                                    <Row style={{paddingBottom: '0.5%', borderBottom: '1px solid #B9B9C3'}}>
                                                        <Controller
                                                            id='building'
                                                            name='building'
                                                            control={control}
                                                            render={({ field: { value } }) => (
                                                            <Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column', alignItems:'center', padding: 0}}>
                                                                <Row style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                                    <Select
                                                                        name='building'
                                                                        classNamePrefix={'select'}
                                                                        className="react-select custom-select-building custom-react-select"
                                                                        options={buildingArray}
                                                                        value={value}
                                                                        defaultValue={buildingArray[0]}
                                                                        onChange={(e) => setValue('building', e) }
                                                                    />
                                                                </Row>
                                                            </Col>
                                                        )}/>
                                                    </Row>
                                                    <Row style={{paddingTop: '0.5%'}}>
                                                        <Controller
                                                            id='legal'
                                                            name='legal'
                                                            control={control}
                                                            render={({ field: { value } }) => (
                                                            <Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column', alignItems:'center', padding: 0}}>
                                                                <Row style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                                    <Select
                                                                        name='legal'
                                                                        classNamePrefix={'select'}
                                                                        className="react-select custom-select-legal custom-react-select"
                                                                        options={legalArray}
                                                                        value={value}
                                                                        defaultValue={legalArray[0]}
                                                                        onChange={(e) => setValue('legal', e) }
                                                                    />
                                                                </Row>
                                                            </Col>
                                                        )}/>
                                                    </Row>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>선임일</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='create_datetime'
                                                    name='create_datetime'
                                                    control={control}
                                                    render={({field : {onChange, value}}) => <Flatpickr
                                                        value={value}
                                                        id='default-picker'
                                                        className="form-control"
                                                        placeholder={now}
                                                        onChange={(data) => {
                                                            const newData = setStringDate(data)
                                                            onChange(newData)
                                                        }}
                                                        options={{
                                                            mode: 'single',
                                                            ariaDateFormat: 'Y-m-d',
                                                            locale: Korean
                                                        }} />
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>갱신일</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='renewal_date'
                                                    name='renewal_date'
                                                    control={control}
                                                    render={({field : {onChange, value}}) => <Flatpickr
                                                        value={value}
                                                        id='default-picker'
                                                        className="form-control"
                                                        placeholder={now}
                                                        onChange={(data) => {
                                                            const newData = setStringDate(data)
                                                            onChange(newData)
                                                        }}
                                                        options={{
                                                            mode: 'single',
                                                            ariaDateFormat: 'Y-m-d',
                                                            locale: Korean
                                                        }} />
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>선임시작일</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='start_date'
                                                    name='start_date'
                                                    control={control}
                                                    render={({field : {onChange, value}}) => <Flatpickr
                                                        value={value}
                                                        id='default-picker'
                                                        className="form-control"
                                                        placeholder={now}
                                                        onChange={(data) => {
                                                            const newData = setStringDate(data)
                                                            onChange(newData)
                                                        }}
                                                        options={{
                                                            mode: 'single',
                                                            ariaDateFormat: 'Y-m-d',
                                                            locale: Korean
                                                        }} />
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>선임종료일</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='end_date'
                                                    name='end_date'
                                                    control={control}
                                                    render={({field : {onChange, value}}) => <Flatpickr
                                                        value={value}
                                                        id='default-picker'
                                                        className="form-control"
                                                        placeholder={now}
                                                        onChange={(data) => {
                                                            const newData = setStringDate(data)
                                                            onChange(newData)
                                                        }}
                                                        options={{
                                                            mode: 'single',
                                                            ariaDateFormat: 'Y-m-d',
                                                            locale: Korean
                                                        }} />
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row' style={{minHeight: '45px'}}>
                                            <Col lg='2' md='4' xs='4' className='card_table col col_color text center'>선임상태</Col>
                                                {
                                                    state.type === 'register' ? (
                                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                                            <Controller
                                                                name='status'
                                                                control={control}
                                                                render={({ field : {onChange, value} }) => (
                                                                    <Col className='form-check'>
                                                                        <Label className='form-check-label' for='application'>
                                                                            선임
                                                                        </Label>
                                                                        <Input id='application'  type='radio' checked={value === '선임'} onChange={() => onChange('선임')}/>
                                                                    </Col>
                                                            )}/>
                                                        </Col>
                                                    ) : (
                                                        <Col lg='10' md='8' xs='8' className='card_table col text start'>
                                                            <Row style={{paddingLeft: '3%'}}>
                                                                <Controller
                                                                    name='status'
                                                                    control={control}
                                                                    render={({ field : {onChange, value} }) => (
                                                                        <Col md='3' xs='6' className='form-check'>
                                                                            <Label className='form-check-label' for='application1'>
                                                                                선임
                                                                            </Label>
                                                                            <Input id='application1'  type='radio' checked={value === '선임'} onChange={() => onChange('선임')}/>
                                                                        </Col>
                                                                )}/>
                                                                <Controller
                                                                    name='status'
                                                                    control={control}
                                                                    render={({ field : {onChange, value} }) => (
                                                                        <Col md='3' xs='6' className='form-check'>
                                                                            <Label className='form-check-label' for='application2'>
                                                                                만료
                                                                            </Label>
                                                                            <Input id='application2' type='radio' checked={value === '만료'} onChange={() => onChange('만료')}/>
                                                                        </Col>
                                                                )}/>
                                                                <Controller
                                                                    name='status'
                                                                    control={control}
                                                                    render={({ field : {onChange, value} }) => (
                                                                        <Col md='3' xs='6' className='form-check'>
                                                                            <Label className='form-check-label' for='application3'>
                                                                                취소
                                                                            </Label>
                                                                            <Input id='application3'  type='radio' checked={value === '취소'} onChange={() => onChange('취소')}/>
                                                                        </Col>
                                                                )}/>
                                                                <Controller
                                                                    name='status'
                                                                    control={control}
                                                                    render={({ field : {onChange, value} }) => (
                                                                        <Col md='3' xs='6' className='form-check'>
                                                                            <Label className='form-check-label' for='application4'>
                                                                                중지
                                                                            </Label>
                                                                            <Input id='application4'  type='radio' checked={value === '중지'} onChange={() => onChange('중지')}/>
                                                                        </Col>
                                                                )}/>
                                                            </Row>
                                                        </Col>
                                                    )
                                                }
                                            {/* </Col> */}
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='4' xs='4' className='card_table col col_color text center'>비고</Col>
                                            <Col lg='10' md='8' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='description'
                                                    name='description'
                                                    control={control}
                                                    render={({ field }) => <Input style={{height : '100%'}} type="textarea" {...field} />}
                                                />
                                            </Col>
                                            <Col></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter style={{display:'flex', justifyContent:'end', alignItems:'center'}}>
                        <Button className="mx-1" color="report" onClick={() => navigate(-1)}>취소</Button>
                        <Button type='submit' color='primary'>확인</Button>
                    </CardFooter>
                </Form>
            </Card>
        </Fragment>
    )
}

export default AppointmentForm