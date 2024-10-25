import {yupResolver} from "@hookform/resolvers/yup"
import {Fragment, useState, useEffect} from "react"
import {Controller, useForm} from "react-hook-form"
import {
    Col, Form, Input,
    Row, Button, FormFeedback,
    CardTitle, InputGroup
} from "reactstrap"
import * as yup from 'yup'
import {Link, useNavigate} from "react-router-dom"
import {ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT, API_BASICINFO_FACILITY_TOOLEQUIPMENT_REGISTER, API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS} from "../../../../constants"
import axios from '../../../../utility/AxiosConfig'
import {useAxiosIntercepter} from '../../../../utility/hooks/useAxiosInterceptor'
import FileUploader from "./FileUploader"
import Cookies from 'universal-cookie'
import Select from "react-select"
import {
    makeSelectList, setStringDate, checkSelectValueObj, 
    checkSelectValue, sweetAlert, compareCodeWithValueProperty, 
    axiosPostPut, AddCommaOnChange, getCommaDel
} from "../../../../utility/Utils"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Flatpickr from "react-flatpickr"
import {isEmptyObject} from 'jquery'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import * as moment from 'moment'

const BasicInfoAdd = () => {
    useAxiosIntercepter()
    const navigate = useNavigate()
    const now = moment().format('YYYY-MM-DD')
    const [files, setFiles] = useState([])
    const [checkCode, setCheckCode] = useState(false)
    const cookies = new Cookies()
    const property_id = cookies.get('property').value
    const [employeeClassList, setEmployeeClassList] = useState([])
    const [submitResult, setSubmitResult] = useState(false)
    const [selectError, setSelectError] = useState({emp_class: false})
    const {emp_class} = selectError

    const defaultValues = {
        emp_class: {
            value: '',
            label: '직종'
        },
        code: '', // 공구비품코드
        capacity: '', // 규격
        maker: '', // 제작사
        quantity: '', //수량
        employee_class: '', // 직종
        stored_date: '', // 입고일
        type: '', //구분
        purchase_price: '', // 구매가
        status: '', // 상태
        unit: '',
        depreciation_rate: '', //감가율
        location: '', //위치
        basic_remain_price: '', //기초 잔존가
        dispose_date: '', //폐기일
        remain_price: '', // 잔존가
        description: '' // 비고
    }

    const validationSchema = yup.object().shape({
            code: yup
                .string()
                .required('공구비품코드를 입력해주세요.')
                .min(1, '1자 이상 입력해주세요'),
            capacity: yup
                .string()
                .required('규격을 입력해주세요.')
                .min(1, '1자 이상 입력해주세요'),
            quantity: yup
                .string()
                .matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
                .transform((value, originalValue) => {
                    if (originalValue === "") return '0'
                    return value
                    })  
                .matches(/^[^0]/, '1 이상 값을 입력해주세요.'),
            purchase_price: yup
                .string()
                .matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
                .transform((value, originalValue) => {
                    if (originalValue === "") return '0'
                    return value
                    })  
                .matches(/^[^0]/, '1 이상 값을 입력해주세요.'),
            basic_remain_price: yup
                .string()
                .matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
                .transform((value, originalValue) => {
                    if (originalValue === "") return '0'
                    return value
                    })  
                .matches(/^[^0]/, '1 이상 값을 입력해주세요.'),
            remain_price: yup
                .string()
                .matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
                .transform((value, originalValue) => {
                    if (originalValue === "") return '0'
                    return value
                    })  
                .matches(/^[^0]/, '1 이상 값을 입력해주세요.')
        })

    const {
        control
        , handleSubmit
        , setValue
        , trigger
        , formState: {errors}} 
        = useForm({
            defaultValues, 
            resolver: yupResolver(validationSchema)
        })

    const handleSelectValidation = (e, event) => {
        checkSelectValue(e, event, selectError, setSelectError, setValue)
    }

    const onSubmit = (data) => {
        if ((!checkCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}

        const formData = new FormData()
        formData.append('id', property_id) // 사업소 아이디
        formData.append('code', data.code)
        formData.append('capacity', data.capacity)
        formData.append('maker', data.maker)
        formData.append('quantity', getCommaDel(data.quantity))
        formData.append('unit', data.unit)
        formData.append('employee_class', data.emp_class.value)
        formData.append('stored_date', data.stored_date)
        formData.append('type', data.type)
        formData.append('purchase_price', getCommaDel(data.purchase_price))
        formData.append('status', data.status)
        formData.append('depreciation_rate', data.depreciation_rate)
        formData.append('location', data.location)
        formData.append('basic_remain_price', getCommaDel(data.basic_remain_price))
        formData.append('dispose_date', data.dispose_date)
        formData.append('remain_price', getCommaDel(data.remain_price))
        formData.append('description', data.description)
        formData.append('file', files[0])

        axiosPostPut('register', "공구비품", API_BASICINFO_FACILITY_TOOLEQUIPMENT_REGISTER, formData, setSubmitResult)
    }

    useEffect(() => {
        axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, {
                params: {property_id: property_id}
            })
            .then(resEmployeeClass => {
                makeSelectList(
                    true,
                    '',
                    resEmployeeClass.data,
                    employeeClassList,
                    setEmployeeClassList,
                    ['name'],
                    'id'
                )
            })

    }, [])

    useEffect(() => {
        if (!isEmptyObject(errors)) {
            checkSelectValueObj(control, selectError, setSelectError)
        }
    }, [errors])

    useEffect(() => {
		if (submitResult) {
            navigate(ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT)
		}
	}, [submitResult])

    return (
        <Fragment>
            <Row>
                <Col md='5' className="mb-2">
                    <div className='mt-4'>
                        <FileUploader setFiles={setFiles} files={files}/>
                    </div>
                </Col>
                <Col md='7'>
                    <CardTitle className="mb-1">기본정보</CardTitle>
                    <div>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row className="card_table top" style={{ borderBottom: 'none' }}>
                                <Col xs='12'>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
                                        <Col xs='3' md='2' className='card_table col col_color center px-0' style={{justifyContent:'center'}}>
                                            <div>공구비품코드</div>&nbsp;
                                            <div className='essential_value'/>
                                        </Col>
                                        <Col xs='9' md='10' className='card_table col text start '>
                                            <Controller
                                                id='code'
                                                name='code'
                                                control={control}
                                                render={({field}) => (
                                                    <Col className='card_table col text'>
                                                        <InputGroup>
                                                            <Input bsSize='sm' maxLength={254} invalid={errors.code && true} {...field}/>
                                                            <Button
                                                                style={{
                                                                    borderTopRightRadius: '0.358rem',
                                                                    borderBottomRightRadius: '0.358rem'
                                                                }}
                                                                size="sm"
                                                                onClick={() => compareCodeWithValueProperty(field.value, property_id, undefined, API_BASICINFO_FACILITY_TOOLEQUIPMENT_REGISTER, setCheckCode)}>중복검사</Button>
                                                            {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                                                        </InputGroup>
                                                    </Col>
                                                )}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{ borderBottom: 'none' }}>
                                <Col xs='12'>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='2'
                                            className='card_table col col_color text center'
                                            style={{ whiteSpace: 'nowrap' }}>
                                            <div>규격(모델)</div>&nbsp;
                                            <div className='essential_value'/>
                                        </Col>
                                        <Col xs='9' md='10' className='card_table col text start '>
                                            <Controller
                                                id='capacity'
                                                name='capacity'
                                                control={control}
                                                render={({field}) => (
                                                    <Col className='card_table col text' style={{ flexDirection: 'column'}}>
                                                        <Input
                                                            bsSize='sm'
                                                            maxLength={254}
                                                            invalid={errors.capacity && true}
                                                            {...field}/> {errors.capacity && <FormFeedback>{errors.capacity.message}</FormFeedback>}
                                                    </Col>
                                                )}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{borderBottom: 'none'}}>
                                <Col xs='12' md='6'>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>제작사</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='maker'
                                                name='maker'
                                                control={control}
                                                render={({field}) => <Input bsSize='sm' maxLength={254} {...field}/> }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
                                        <Col xs='3' md='4' className='card_table col col_color text center padding-0'>
                                            <div title="필수값">수량/단위</div>&nbsp;
                                            <div className='essential_value'/>
                                        </Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <div style={{display: 'flex'}}>
                                                <div style={{ marginRight: '5px' }}>
                                                    <Controller
                                                        id='quantity'
                                                        name='quantity'
                                                        control={control}
                                                        render={({field: {onChange, value} }) => <Input
                                                            bsSize='sm'
                                                            maxLength={50}
                                                            placeholder="1"
                                                            invalid={errors.quantity && true}
                                                            value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                            onChange={(e) => {
                                                                AddCommaOnChange(e, onChange)
                                                                trigger('quantity')
                                                            }}/>
                                                        }
                                                    /> {errors.quantity && <FormFeedback>{errors.quantity.message}</FormFeedback>}
                                                </div>
                                                <div>
                                                    <Controller
                                                        id='unit'
                                                        name='unit'
                                                        control={control}
                                                        render={({field}) => <Input
                                                            bsSize='sm'
                                                            maxLength={50}
                                                            placeholder="EA"
                                                            invalid={errors.unit && true}
                                                            {...field}/>
                                                        }
                                                    /> {errors.unit && <FormFeedback>{errors.unit.message}</FormFeedback>}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{borderBottom: 'none'}}>
                                <Col xs='12' md='6'>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>
                                            <div>직종</div>&nbsp;
                                            <div className='essential_value'/>
                                        </Col>
                                        <Col xs='9' md='8' className='card_table col'>
                                            <div style={{ width: '100%' }}>
                                                <Controller
                                                    id='emp_class'
                                                    name='emp_class'
                                                    control={control}
                                                    render={({field: {value} }) => (
                                                        <Col
                                                            xs={12}
                                                            md={12}
                                                            className='card_table col text center'
                                                            style={{
                                                                flexDirection: 'column',
                                                                alignItems: 'start'
                                                            }}>
                                                            <Select
                                                                id='emp_class'
                                                                name='emp_class'
                                                                autosize={true}
                                                                className="react-select custom-select-emp_class custom-react-select"
                                                                classNamePrefix='select'
                                                                options={employeeClassList}
                                                                value={value}
                                                                onChange={handleSelectValidation}/> 
                                                                { emp_class && <div style={{ color: '#ea5455', fontSize: '0.857rem' }}>직종을 선택해주세요.</div> }
                                                        </Col>
                                                    )}/>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>입고일</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='stored_date'
                                                name='stored_date'
                                                control={control}
                                                render={({field: {onChange, stored_date} }) => (
                                                    <Flatpickr
                                                        value={stored_date}
                                                        id='range-picker'
                                                        className='form-control'
                                                        onChange={(data) => {
                                                            const newData = setStringDate(data)
                                                            onChange(newData)
                                                        }}
                                                        options={{
                                                            mode: 'single',
                                                            // maxDate: now,
                                                            ariaDateFormat: 'Y-m-d',
                                                            locale: Korean
                                                        }}
                                                        placeholder={`${now}`}
                                                    />
                                                )}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{ borderBottom: 'none'}}>
                                <Col xs='12' md='6'>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3'}}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>구분</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='type'
                                                name='type'
                                                control={control}
                                                render={({field}) => <Input bsSize='sm' maxLength={254} {...field}/>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='4' className='card_table col col_color text center px-0'>
                                            <div>구매가</div>&nbsp;
                                            <div className='essential_value'/>
                                        </Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <div style={{ width: '100%' }}>
                                                <Controller
                                                    id='purchase_price'
                                                    name='purchase_price'
                                                    control={control}
                                                    render={({field : {onChange, value} }) => <Input
                                                        bsSize='sm'
                                                        value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                        invalid={errors.purchase_price && true}
                                                        onChange={(e) => {
                                                            AddCommaOnChange(e, onChange, true)
                                                            trigger('purchase_price')
                                                        }}/>
                                                    }
                                                /> {errors.purchase_price && <FormFeedback>{errors.purchase_price.message}</FormFeedback>}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{ borderBottom: 'none' }}>
                                <Col xs='12' md='6'>
                                    <Row className='card_table table_row' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Col xs='3' md='4' className='card_table col col_color text center'>상태</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='status'
                                                name='status'
                                                control={control}
                                                render={({field}) => <Input bsSize='sm' maxLength={50} {...field}/>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>감가율</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Input
                                                id='depreciation_rate'
                                                name='depreciation_rate'
                                                placeholder='자동으로 계산'
                                                bsSize='sm'
                                                readOnly="readOnly"/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{borderBottom: 'none'}}>
                                <Col xs='12' md='6'>
                                    <Row className='card_table table_row' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>위치</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='location'
                                                name='location'
                                                control={control}
                                                render={({field}) => <Input bsSize='sm' maxLength={254} {...field}/>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Col xs='3' md='4' className='card_table col col_color text center px-0'>
                                            <div>기초잔존가</div>&nbsp;
                                            <div className='essential_value'/>
                                        </Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <div style={{width: '100%'}}>
                                                <Controller
                                                    id='basic_remain_price'
                                                    name='basic_remain_price'
                                                    control={control}
                                                    render={({field: {onChange, value} }) => (
                                                        <Input 
                                                            bsSize='sm' 
                                                            invalid={errors.basic_remain_price && true} 
                                                            value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                            onChange={(e) => {
                                                                AddCommaOnChange(e, onChange, true)
                                                                trigger('basic_remain_price')
                                                            }}/>
                                                    )}
                                                /> {errors.basic_remain_price && <FormFeedback>{errors.basic_remain_price.message}</FormFeedback>}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{borderBottom: 'none'}}>
                                <Col xs='12' md='6'>
                                    <Row className='card_table table_row' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>페기일</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='dispose_date'
                                                name='dispose_date'
                                                control={control}
                                                render={({field: {onChange, dispose_date} }) => (
                                                    <Flatpickr
                                                        value={dispose_date}
                                                        id='range-picker'
                                                        className='form-control'
                                                        onChange={(data) => {
                                                            const newData = setStringDate(data)
                                                            onChange(newData)
                                                        }}
                                                        options={{
                                                            mode: 'single',
                                                            // maxDate: now,
                                                            ariaDateFormat: 'Y-m-d',
                                                            locale: Korean
                                                        }}
                                                        placeholder={`${now}`}
                                                    />
                                                )}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='4' className='card_table col col_color text center px-0'>
                                            <div>잔존가</div>&nbsp;
                                            <div className='essential_value'/>
                                        </Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <div style={{width: '100%'}}>
                                                <Controller
                                                    id='remain_price'
                                                    name='remain_price'
                                                    control={control}
                                                    render={({field: {onChange, value}}) => (
                                                        <Input 
                                                            bsSize='sm' 
                                                            invalid={errors.remain_price && true} 
                                                            value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                            onChange={(e) => {
                                                                AddCommaOnChange(e, onChange, true)
                                                                trigger('remain_price')
                                                            }}
                                                        />
                                                    )}
                                                /> {errors.remain_price && <FormFeedback>{errors.remain_price.message}</FormFeedback>}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid">
                                <Col>
                                    <Row className='card_table table_row'>
                                        <Col xs='3' md='2' className='card_table col col_color text center '>비고</Col>
                                        <Col xs='9' md='10' className='card_table col text start '>
                                            <Controller
                                                id='description'
                                                name='description'
                                                control={control}
                                                render={({field}) => <Input bsSize='sm' {...field}/>}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%'}}>
                                    <Button
                                        type='submit'
                                        color='primary'
                                        onClick={handleSubmit(onSubmit)}>저장</Button>
                                    <Button
                                        className="ms-1"
                                        color='report'
                                        tag={Link}
                                        to={`${ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT}`}>목록</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Fragment>
    )
}
export default BasicInfoAdd