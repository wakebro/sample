import {yupResolver} from "@hookform/resolvers/yup"
import {Fragment, useState, useEffect} from "react"
import {Controller, useForm} from "react-hook-form"
import { Col, Form, Input, Row, Button, FormFeedback, CardTitle, InputGroup } from "reactstrap"
import * as yup from 'yup'
import {Link, useNavigate, useParams} from "react-router-dom"
import {ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT, API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, API_BASICINFO_FACILITY_TOOLEQUIPMENT_REGISTER, ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL} from "../../../../constants"
import axios from '../../../../utility/AxiosConfig'
import {useAxiosIntercepter} from '../../../../utility/hooks/useAxiosInterceptor'
import FileUploader from "./FileUploader"
import Cookies from 'universal-cookie'
import Select from "react-select"
import {
    makeSelectList,
    setStringDate,
    sweetAlert,
    axiosPostPut,
    compareCodeWithValueProperty,
    AddCommaOnChange,
    getCommaDel
} from "../../../../utility/Utils"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Flatpickr from "react-flatpickr"
import * as moment from 'moment'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const BasicInfoFix = (props) => {
    useAxiosIntercepter()
    const {data, log} = props
    const id = useParams()
    const tool_id = id.id
    const navigate = useNavigate()
    const cookies = new Cookies()
    const property_id = cookies.get('property').value
    const {
        code,
        capacity,
        maker,
        qty,
        unit,
        employee_class,
        stored_date,
        type,
        purchase_price,
        status,
        depreciation_rate,
        location,
        dispose_date,
        description,
        file_name
    } = data
    const {
        basic_remain_price = '',
        remain_price = ''
    } = log || {}
    const [files, setFiles] = useState([])
    const [checkCode, setCheckCode] = useState(false)
    const [employeeClassList, setEmployeeClassList] = useState([])
    const [employeeClass, setEmployeeClass] = useState(employee_class ? {label: employee_class.code, value: employee_class.id} : {label: '', value: null})
    const [click_delete_origin_file, setClickDeleteOriginFile] = useState(false)
    const [submitResult, setSubmitResult] = useState(false)

    const defaultValues = {
        code: code,
        capacity: capacity, // 규격
        maker: maker, // 제작사
        quantity: qty, //수량
        unit: unit,
        stored_date: stored_date ? moment(stored_date).format('YYYY-MM-DD') : '',
        type: type, //구분
        purchase_price: purchase_price, // 구매가
        status: status, // 상태
        depreciation_rate: depreciation_rate, //감가율
        location: location, //위치
        basic_remain_price: basic_remain_price, //기초 잔존가
        dispose_date: dispose_date ? moment(dispose_date).format('YYYY-MM-DD') : '', //폐기일
        remain_price: remain_price, // 잔존가
        description: description // 비고
    }

    const validationSchema = yup.object().shape({
        code: yup
            .string()
            .required('공구비품코드를 입력해주세요.')
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

    const {control, handleSubmit, formState: {errors}, trigger} = useForm({defaultValues, resolver: yupResolver(validationSchema)})

    const onSubmit = (data) => {
        if ((!checkCode) && (data.code !== code)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}
        const formData = new FormData()
        formData.append('id', property_id) // 사업소 아이디
        formData.append('tool_id', tool_id)
        formData.append('code', data.code)
        formData.append('capacity', data.capacity)
        formData.append('maker', data.maker)
        formData.append('quantity', getCommaDel(data.quantity))
        formData.append('unit', data.unit)
        formData.append('employee_class', employeeClass.value)
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
        formData.append('click_delete_origin_file', click_delete_origin_file)

        axiosPostPut('modify', "공구비품", API_BASICINFO_FACILITY_TOOLEQUIPMENT_REGISTER, formData, setSubmitResult)
    }

    useEffect(() => {
        axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, {params: {property_id: property_id}})
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
        if (submitResult) {
            navigate(`${ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL}/${tool_id}`, {state: 'record'})
        }
    }, [submitResult])

    useEffect(() => {
        console.log("checkCode", checkCode)
    }, [checkCode])

    return (
        <Fragment>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col md='5' className="mb-2">
                        <div className='mt-4'>
                            <FileUploader
                                setFiles={setFiles}
                                files={files}
                                updatedfilename={file_name}
                                setClickDeleteOriginFile={setClickDeleteOriginFile}/>
                        </div>
                    </Col>
                    <Col md='7'>
                        <CardTitle className="mb-1">기본정보</CardTitle>
                        <div>
                            <Row className="card_table top" style={{borderBottom: 'none'}}>
                                <Col xs='12'>
                                    <Row className='card_table table_row' style={{borderBottom: '1px solid #B9B9C3'}}>
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
                                                                onClick={() => compareCodeWithValueProperty(
                                                                    field.value,
                                                                    property_id,
                                                                    code,
                                                                    API_BASICINFO_FACILITY_TOOLEQUIPMENT_REGISTER,
                                                                    setCheckCode
                                                                )}>중복검사</Button>
                                                            {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                                                        </InputGroup>
                                                    </Col>
                                                )}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{ borderBottom: 'none'}}>
                                <Col xs='12'>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='2' className='card_table col col_color text center' style={{ whiteSpace: 'nowrap' }}>규격(모델)</Col>
                                        <Col xs='9' md='10' className='card_table col text start '>
                                            <Controller
                                                id='capacity'
                                                name='capacity'
                                                control={control}
                                                render={({field}) => <Input
                                                    bsSize='sm'
                                                    maxLength={254}
                                                    invalid={errors.capacity && true}
                                                    {...field}/>
                                                }
                                            /> {errors.capacity && <FormFeedback>{errors.capacity.message}</FormFeedback>}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{ borderBottom: 'none' }}>
                                <Col xs='12' md='6'>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>제작사</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='maker'
                                                name='maker'
                                                control={control}
                                                render={({field}) => <Input bsSize='sm' maxLength={254} invalid={errors.maker && true} {...field}/>
                                                }
                                            /> {errors.maker && <FormFeedback>{errors.maker.message}</FormFeedback>}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='4' className='card_table col col_color text center px-0'>
                                            <div>수량/단위</div>&nbsp;
                                            <div className='essential_value'/>
                                        </Col>                                       
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ marginRight: '5px' }}>
                                                    <Controller
                                                        id='quantity'
                                                        name='quantity'
                                                        control={control}
                                                        render={({ field: {onChange, value} }) => (
                                                            <Input
                                                                bsSize='sm'
                                                                maxLength={50}
                                                                placeholder="1"
                                                                value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                                invalid={errors.quantity && true}
                                                                onChange={(e) => {
                                                                    AddCommaOnChange(e, onChange)
                                                                    trigger('quantity')
                                                                }}/>
                                                        )}
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
                            <Row className="card_table mid" style={{ borderBottom: 'none'}}>
                                <Col xs='12' md='6'>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>직종</Col>
                                        <Col xs='9' md='8' className='card_table col text center' style={{ flexDirection: 'column', alignItems: 'start' }}>
                                            <div style={{ width: '100%' }}>
                                                <Select
                                                    id='employee_class'
                                                    autosize={true}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    options={employeeClassList}
                                                    value={employeeClass}
                                                    onChange={(e) => setEmployeeClass(e)}/>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>입고일</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='stored_date'
                                                name='stored_date'
                                                control={control}
                                                render={({ field: {onChange, value} }) => <Flatpickr
                                                    value={value}
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
                                                    }}/>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{borderBottom: 'none'}}>
                                <Col xs='12' md='6'>
                                    <Row className='card_table table_row' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>구분</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='type'
                                                name='type'
                                                control={control}
                                                render={({field}) => <Input bsSize='sm' maxLength={254} invalid={errors.type && true} {...field}/>
                                                }
                                            /> {errors.type && <FormFeedback>{errors.type.message}</FormFeedback>}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
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
                                                    render={({ field: {onChange, value} }) => <Input
                                                        bsSize='sm'
                                                        value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                        invalid={errors.purchase_price && true}
                                                        onChange={(e) => {
                                                            AddCommaOnChange(e, onChange)
                                                            trigger('purchase_price')
                                                        }}/>
                                                    }
                                                /> {errors.purchase_price && <FormFeedback>{errors.purchase_price.message}</FormFeedback>}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{borderBottom: 'none'}}>
                                <Col xs='12' md='6'>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>상태</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='status'
                                                name='status'
                                                control={control}
                                                render={({field}) => <Input bsSize='sm' maxLength={50} invalid={errors.status && true} {...field}/>
                                                }
                                            /> {errors.status && <FormFeedback>{errors.status.message}</FormFeedback>}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>감가율</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='depreciation_rate'
                                                name='depreciation_rate'
                                                control={control}
                                                render={({field}) => <Input
                                                    bsSize='sm'
                                                    readOnly="readOnly"
                                                    invalid={errors.depreciation_rate && true}
                                                    {...field}/>
                                                }
                                            /> {errors.depreciation_rate && <FormFeedback>{errors.depreciation_rate.message}</FormFeedback>}
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
                                                render={({field}) => <Input
                                                    bsSize='sm'
                                                    maxLength={254}
                                                    invalid={errors.location && true}
                                                    {...field}/>
                                                }
                                            /> {errors.location && <FormFeedback>{errors.location.message}</FormFeedback>}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>
                                            <div>기초잔존가</div>&nbsp;
                                            <div className='essential_value'/>
                                        </Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <div style={{width: '100%'}}>
                                                <Controller
                                                    id='basic_remain_price'
                                                    name='basic_remain_price'
                                                    control={control}
                                                    render={({ field: {onChange, value} }) => (
                                                        <Input
                                                            bsSize='sm'
                                                            invalid={errors.basic_remain_price && true}
                                                            value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                            onChange={(e) => {
                                                                AddCommaOnChange(e, onChange)
                                                                trigger('basic_remain_price')
                                                            }}/>
                                                    )}/> {errors.basic_remain_price && <FormFeedback>{errors.basic_remain_price.message}</FormFeedback>}
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="card_table mid" style={{borderBottom: 'none'}}>
                                <Col xs='12' md='6'>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
                                        <Col xs='3' md='4' className='card_table col col_color text center '>페기일</Col>
                                        <Col xs='9' md='8' className='card_table col text start '>
                                            <Controller
                                                id='dispose_date'
                                                name='dispose_date'
                                                control={control}
                                                render={({ field: {onChange, value} }) => <Flatpickr
                                                    value={value}
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
                                                    }}/>
                                                }
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row className='card_table table_row' style={{ borderBottom: '1px solid #B9B9C3' }}>
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
                                                    render={({ field: {onChange, value} }) => (
                                                        <Input
                                                            bsSize='sm'
                                                            invalid={errors.remain_price && true}
                                                            value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                            onChange={(e) => {
                                                                AddCommaOnChange(e, onChange)
                                                                trigger('remain_price')
                                                            }}/>
                                                    )}/> {errors.remain_price && <FormFeedback>{errors.remain_price.message}</FormFeedback>}
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
                                                render={({field}) => <Input bsSize='sm' invalid={errors.description && true} {...field}/>
                                                }
                                            /> {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Row>
                        <Col className='d-flex justify-content-end mt-3 mb-1'>
                            <Button 
                                color="report"
                                tag={Link}
                                to={`${ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL}/${tool_id}`}>취소</Button>
                            <Button
                                className="ms-1"
                                type='submit'
                                color='primary'
                                >수정</Button>
                            <Button
                                className="ms-1"
                                tag={Link}
                                to={`${ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT}`}>목록</Button>
                        </Col>
                    </Row>
                </Row>
            </Form>
        </Fragment>
    )
}
export default BasicInfoFix