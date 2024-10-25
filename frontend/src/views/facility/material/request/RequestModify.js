import { Fragment, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, Input, Row } from "reactstrap"
import CustomDataTable from "./CustomDataTable"
import { Controller, useForm } from "react-hook-form"
import Select from 'react-select'
import { yupResolver } from "@hookform/resolvers/yup"
import { addCommaReturnValue, axiosPostPut, getTableData, primaryColor, setStringDate, sweetAlert, primaryHeaderColor, getCommaDel, resultCheckFunc, AddCommaOnChange } from "../../../../utility/Utils"
import { API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, API_FACILITY_MATERIAL_REQUEST_FORM, ROUTE_FACILITYMGMT_MATERIAL_REQUEST_DETAIL, API_FACILITY_MATERIAL_REQUEST_DETAIL } from "../../../../constants"
import Cookies from "universal-cookie"
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import * as yup from 'yup'
import FormModal from "./FormModal"
import axios from "axios"
import Swal from 'sweetalert2'
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import * as moment from 'moment'

const NumericInput = (props) => {
    const { row, defaultValue, handleCalculate } = props

    const [inputValue, setInputValue] = useState(defaultValue)

    const handleOnchange = (e) => {
        const result = handleCalculate(e)
        setInputValue(result)
    }

    return (
        <Input
            id={row.id}
            onChange={handleOnchange}
            value={inputValue} 
            style={{textAlign: 'end'}}
        />
    )
}

const RequestModify = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const navigate = useNavigate()
    const now = moment().format('YYYY-MM-DD')
    const [user, setUser] = useState()
    const [data, setData] = useState()
    const [detailData, setDetailData] = useState([])
    const { id } = useParams()
	const [tableSelect, setTableSelect] = useState([])
    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal)
    const [employeeClassOptions, setEmployeeClassOptions] = useState([{value: '', label: '선택'}])
    const [requestQuantity, setRequestQuantity] = useState([])
    const [unitPrice, setUnitPrice] = useState([])
    const [requestPrice, setRequestPrice] = useState([])
    const [submitResult, setSubmitResult] = useState(false)
    const [materialIds, setMaterialIds] = useState([])
    const [originalIds, setOriginalIds] = useState([])
    const [done, setDone] = useState(false)

    const getComma = (value) => {
        return addCommaReturnValue(value)
    }

    const handleRequestQuantity = (e) => {
    	const id = Number(e.target.id)
        const requestQuantityTemp = {...requestQuantity}
        const requestPriceTemp = {...requestPrice}
        
        const result = AddCommaOnChange(e, undefined, true, requestQuantityTemp[id])
        requestQuantityTemp[id] = result
        requestPriceTemp[id] = unitPrice[id] ? getCommaDel(result) * getCommaDel(unitPrice[id]) : 0

        setRequestQuantity(requestQuantityTemp)
        setRequestPrice(requestPriceTemp)
        setDetailData((prev) => {
            const temp = prev.map(item => (item.id === id ? {...item, request_quantity: getCommaDel(result)} : item))
            return temp
        })
        return result
    }
    const handleUnitPrice = (e) => {
    	const id = Number(e.target.id)
        const requestPriceTemp = {...requestPrice}
        const unitPriceTemp = {...unitPrice}
        
        const result = AddCommaOnChange(e, undefined, true, unitPriceTemp[id])
        unitPriceTemp[id] = result
        requestPriceTemp[id] = getCommaDel(result) * getCommaDel(requestQuantity[id])
        
        setUnitPrice(unitPriceTemp)
        setRequestPrice(requestPriceTemp)
        setDetailData((prev) => {
            const temp = prev.map(item => (item.id === id ? {...item, unit_price: getCommaDel(result)} : item))
            return temp
        })
        return result
    }

    const columns = [
        {
            name: '자재코드',
            cell: row => (row.material.code ? row.material.code : '')
        },
        {
            name: '자재명',
            cell: row => (row.material.code ? row.material.model_no : '')
        },
        {
            name: '직종',
            cell: row => (row.material.employee_class ? row.material.employee_class?.code : '')
        },
        {
            name: '규격',
            cell: row => row.material.capacity
        },
        {
            name: '재고',
            cell: row => <Col style={{textAlign: 'end'}}>{row.material.stock ? row.material.stock.toLocaleString('ko-KR') : console.log(row)}</Col>
        },
        {
            name: '청구수량',
            cell : row => <NumericInput
                id={row.id}
                name={row.id}
                row={row}
                defaultValue={row.request_quantity ? row.request_quantity.toLocaleString('ko-KR') : ''}
                handleCalculate={handleRequestQuantity}
            />
        },
        {
            name: '단가',
            cell : row => <NumericInput
                id={row.id}
                name={row.id}
                row={row}
                defaultValue={row.unit_price ? row.unit_price.toLocaleString('ko-KR') : ''}
                handleCalculate={handleUnitPrice}
            />
        },
        {
            name: '청구금액',
            cell: row => { return <Col style={{textAlign: 'end'}}>{requestPrice[row.id] ? resultCheckFunc(requestPrice[row.id], true).toLocaleString('ko-KR') : 0}</Col> }
        }
    ]
    const defaultValues =  {
        employeeClass: data ? {value: data.employee_class?.id, label: data.employee_class?.code} : '',
        request_datetime: data ? [data.request_datetime] : '',
        receiving_datetime: data ? [data.receiving_datetime] : '',
        total_quantity: data ? data.total_request_quantity : '',
        total_price: data ? data.total_request_price : '',
        user: data ? data.user.name : '',
        description: data ? (data.description ? data.description : '') : ''
    }
    const validationSchema = yup.object().shape({
        request_datetime: yup.array().test('isNonEmpty', '청구일자를 입력해주세요.', function(value) {
			return value
		}).nullable(),
        receiving_datetime: yup.array().test('isNonEmpty', '입고희망일자을 입력해주세요.', function(value) {
			return value
		}).nullable()
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
    const totalRequestQuantity = Object.values(requestQuantity).reduce(function add(sum, currValue) {
        return sum + getCommaDel(currValue)
    }, 0)
    const totalRequestPrice = Object.values(requestPrice).reduce(function add(sum, currValue) {
        return sum + getCommaDel(currValue)
    }, 0)
    const onSubmit = (data) => {
        if (detailData.length === 0) {
			sweetAlert('', '자재를 하나 이상 등록해주세요.', 'warning')
			return false
        }

        if (detailData.filter(detail => (detail.request_quantity === '' || isNaN(detail.request_quantity))).length > 0) {
            sweetAlert('', '청구수량을 등록해주세요.', 'warning', 'center')
			return false
        }

        if (data.request_datetime[0] > data.receiving_datetime[0]) {
			sweetAlert('', '입고희망일자는 청구일자 이후로 선택하여주세요.', 'warning')
            return false
        }

        const formData = new FormData()
        formData.append('property_id', cookies.get('property').value)
        formData.append('employee_class', data.employeeClass?.value)
        formData.append('request_datetime', data.request_datetime[0])
        formData.append('receiving_datetime', data.receiving_datetime[0])
        formData.append('user', user.id)
        formData.append('description', data.description)
        formData.append('total_request_price', totalRequestPrice)
        formData.append('total_request_quantity', totalRequestQuantity)
        formData.append('material_ids', JSON.stringify(materialIds))
        formData.append('original_ids', originalIds)
        formData.append('detail_data', JSON.stringify(detailData))

        const API = `${API_FACILITY_MATERIAL_REQUEST_FORM}/${id}`
        axiosPostPut('modify', '자재청구', API, formData, setSubmitResult)
    }
    const handleDelete = () => {
        Swal.fire({
            icon: "warning",
            html: "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "취소",
            confirmButtonText: '확인',
            confirmButtonColor : primaryColor,
            reverseButtons :true,
            customClass: {
                actions: 'sweet-alert-custom right',
                cancelButton: 'me-1'
            }
        }).then((res) => {
            if (res.isConfirmed) {
                const checkedIds = tableSelect.map(item => item.id)
                const remainData = detailData.filter((item) => !checkedIds.includes(item.id))
                setDetailData(remainData)
                setRequestQuantity(prev => {
                    const requestQuantityTemp = {...prev}
                    checkedIds.forEach(key => delete requestQuantityTemp[key])
                    return requestQuantityTemp
                })
                setUnitPrice(prev => {
                    const unitPriceTemp = {...prev}
                    checkedIds.forEach(key => delete unitPriceTemp[key])
                    return unitPriceTemp
                })
                setRequestPrice(prev => {
                    const requestPriceTemp = {...prev}
                    checkedIds.forEach(key => delete requestPriceTemp[key])
                    return requestPriceTemp
                })
            } else {
                Swal.fire({
                    icon: "info",
                    html: "취소하였습니다.",
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "확인",
                    cancelButtonColor : primaryColor,
                    reverseButtons :true,
                    customClass: {
                        actions: 'sweet-alert-custom right'
                    }
                })
            }
        })
    }

    useEffect(() => {
        axios.get(`${API_FACILITY_MATERIAL_REQUEST_DETAIL}/${id}`)
        .then(res => {
            setData(res.data.request)
            setDetailData(res.data.request_detail)
            setDone(true)
        })
        .catch(res => {
            console.log(`${API_FACILITY_MATERIAL_REQUEST_DETAIL}/${id}`, res)
        })
    }, [])
    
    useEffect(() => {
        getTableData(API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, {property_id: cookies.get('property').value, type: 'form'}, setEmployeeClassOptions)
        axios.get(`${API_FACILITY_MATERIAL_REQUEST_FORM}/-1`, {params: {user_id: cookies.get('userId'), property_id: cookies.get('property').value}})
        .then(res => {
            setUser(res.data.user)
        })
    }, [])
    
    useEffect(() => {
        if (done) {
            setOriginalIds([detailData.map((item) => item.id)])
        }
    }, [done])
    
    useEffect(() => {
        if (detailData) {
            const materialIdsTemp = {}
            detailData.map((item) => {
                materialIdsTemp[item.id] = item.material.id
            })
            setMaterialIds(materialIdsTemp)

            const requestQuantityTemp = {}
            detailData.map((item) => {
                requestQuantityTemp[item.id] = item.request_quantity ? getComma(item.request_quantity) : 0
            })
            setRequestQuantity(requestQuantityTemp)

            const unitPriceTemp = {}
            detailData.map((item) => {
                unitPriceTemp[item.id] = item.unit_price ? getComma(item.unit_price) : 0
            })
            console.log(unitPriceTemp)
            setUnitPrice(unitPriceTemp)
        }
    }, [detailData])

    useEffect(() => {
        if (data) {
            setValue('employeeClass', data.employee_class ? {value: data.employee_class?.id, label: data.employee_class?.code} : {value: '', label: '선택'})
            setValue('request_datetime', [data.request_datetime])
            setValue('receiving_datetime', [data.receiving_datetime])
            setValue('user', data.user.name)
            setValue('description', data.description)
            const totalRequestQuantityTemp = {...totalRequestQuantity}
            detailData.forEach(item => {
                totalRequestQuantityTemp[item.id] = item.request_quantity
            })
            setRequestQuantity(totalRequestQuantityTemp)
            
            const unitPriceTemp = {...unitPrice}
            detailData.forEach(item => {
                unitPriceTemp[item.id] = item.unit_price
            })
            setUnitPrice(unitPriceTemp)

            const totalRequestPriceTemp = {...totalRequestPrice}
            detailData.forEach(item => {
                totalRequestPriceTemp[item.id] = item.request_quantity * item.unit_price
            })
            setRequestPrice(totalRequestPriceTemp)
        }
    }, [data])
    
    useEffect(() => {
        if (submitResult) {
            navigate(`${ROUTE_FACILITYMGMT_MATERIAL_REQUEST_DETAIL}/${id}`)
        }
    }, [submitResult])

    return (
        <Fragment>
            {user && data && detailData &&
            <>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='자재청구' breadCrumbParent='시설관리' breadCrumbParent2='자재관리' breadCrumbActive='자재청구' />
                </div>
            </Row>
            <Card>
                <CardHeader>
                    <CardTitle>자재청구 수정</CardTitle>
                </CardHeader>
                <FormModal
                    modal={modal}
                    toggle={toggle}
                    setDetailData={setDetailData}
                    state={'modify'}
                    setTableSelect={setTableSelect}
                    detailDataIds={detailData}
                />
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <CardBody className="mb-1">
                        <Row>
                            <Col md='6' xs='12' style={{display: 'flex', alignItems: 'center'}}>
                                자재를 추가 후 상세정보를 작성해 주세요.
                            </Col>
                            <Col style={{display: 'flex', justifyContent: 'end'}}>
                                <Button outline style={{marginRight: '1%'}} onClick={() => handleDelete()}>삭제</Button>
                                <Button outline onClick={toggle}>추가</Button>
                            </Col>
                        </Row>
                        <Row className='my-1'>
                            <CustomDataTable
                                tableData={detailData}
                                columns={columns}
                                setTableSelect={setTableSelect}
                                selectType={true}
                            />
                        </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>청구번호</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                            <Row style={{width: '100%'}}>
                                                <Input disabled value={id}/>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
                                            <div>직종</div>
                                        </Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <Controller
                                                id='employeeClass'
                                                name='employeeClass'
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                <Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column', alignItems:'start', paddingTop: 0, paddingBottom: 0}}>
                                                    <>
                                                        <Select
                                                            name='employeeClass'
                                                            classNamePrefix={'select'}
                                                            className="react-select custom-select-employeeClass custom-react-select"
                                                            options={employeeClassOptions}
                                                            onChange={onChange}
                                                            value={value}
                                                            defaultValue={employeeClassOptions[0]}
                                                        />
                                                    </>
                                                </Col>
                                            )}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
                                            <div>청구일자</div> &nbsp;
                                            <div className='essential_value'/>
                                        </Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                            <Controller
                                                id='request_datetime'
                                                name='request_datetime'
                                                control={control}
                                                render={({field : {onChange, value}}) => (
                                                    <Row style={{width: '100%'}}>
                                                        <Flatpickr
                                                            value={value}
                                                            id='default-picker'
                                                            className="form-control"
                                                            onChange={(data) => {
                                                                const newData = setStringDate(data)
                                                                onChange(newData)
                                                            }}
                                                            options={{
                                                                mode: 'single',
                                                                ariaDateFormat: 'Y-m-d',
                                                                locale: Korean
                                                            }}
                                                            placeholder={now}
                                                        />
                                                        {errors.request_datetime && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.request_datetime.message}</div>}
                                                    </Row>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
                                            <div>입고희망일자</div> &nbsp;
                                            <div className='essential_value'/>
                                        </Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                            <Controller
                                                id='receiving_datetime'
                                                name='receiving_datetime'
                                                control={control}
                                                render={({field : {onChange, value}}) => (
                                                    <Row style={{width: '100%'}}>
                                                        <Flatpickr
                                                            value={value}
                                                            id='default-picker'
                                                            className="form-control"
                                                            onChange={(data) => {
                                                                const newData = setStringDate(data)
                                                                onChange(newData)
                                                            }}
                                                            options={{
                                                                mode: 'single',
                                                                ariaDateFormat: 'Y-m-d',
                                                                locale: Korean
                                                            }}
                                                            placeholder={now}
                                                        />
                                                        {errors.receiving_datetime && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.receiving_datetime.message}</div>}
                                                    </Row>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>총 청구수량</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                            <Controller
                                                id='total_request_quantity'
                                                name='total_request_quantity'
                                                control={control}
                                                render={({ field }) => (
                                                    <Row style={{width: '100%'}}>
                                                        <Input disabled {...field} value={totalRequestQuantity.toLocaleString('ko-KR')}/>
                                                    </Row>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>총 청구금액</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                            <Controller
                                                id='total_request_price'
                                                name='total_request_price'
                                                control={control}
                                                render={({ field }) => (
                                                    <Row style={{width: '100%'}}>
                                                        <Input disabled {...field} value={resultCheckFunc(totalRequestPrice).toLocaleString('ko-KR')}/>
                                                    </Row>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='12' md='12' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='2' md='2' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>작성자</Col>
                                        <Col lg='10' md='10' xs='8' className='card_table col text center'>
                                            <Input disabled defaultValue={user.name}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginLeft: 0, marginRight: 0, borderBottom: '0.5px solid #B9B9C3', minHeight: '70px'}}>
                                <Col lg='12' md='12' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='2' md='2' xs='4' className='card_table col text center' style={{borderLeft: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>비고</Col>
                                        <Col lg='10' md='10' xs='8' className='card_table col text center' style={{borderLeft: '0.5px solid #B9B9C3'}}>
                                            <Controller
                                                id='description'
                                                name='description'
                                                control={control}
                                                render={({ field }) => (
                                                    <Row style={{width: '100%'}}>
                                                        <Input type="textarea" {...field}/>
                                                    </Row>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                    </CardBody>
                    <CardFooter style={{display:'flex', justifyContent:'end'}}>
                        <Button color='report' className="mx-1" onClick={() => navigate(-1)}>취소</Button>
                        <Button type='submit' color='primary'>확인</Button>
                    </CardFooter>
                </Form>
            </Card>
            </>
            }
        </Fragment>
    )
}

export default RequestModify