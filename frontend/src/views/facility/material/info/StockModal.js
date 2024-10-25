import { Controller, useForm } from "react-hook-form"
import Swal from 'sweetalert2'
import { Button, Col, Form, FormFeedback, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import winLogoImg from '@src/assets/images/winlogo.png'
import axios from 'axios'
import Select from 'react-select'
import { AddCommaOnChange, checkSelectValue, checkSelectValueObj, getCommaDel, getTableData, primaryColor } from "../../../../utility/Utils"
import { useEffect, useState } from "react"
import { API_FACILITY_MATERIAL_INFO_DETAIL_STOCK, API_FACILITY_MATERIAL_INFO_STOCK, API_FACILITY_MATERIAL_STOCK_OUTGOING_FORM, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL } from "../../../../constants"
import Cookies from "universal-cookie"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { isEmptyObject } from "jquery"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'

const options = [
    {value: '', label: '(선택)'},
    {value: 'incoming', label: '입고'},
    {value: 'outgoing', label: '출고'}
]

const optionsIncom = [
    {value: '', label: '(선택)'},
    {value: 'incoming', label: '입고'}
]

const incomingValidation = yup.object().shape({
    quantity: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').required('입출고수량을 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return '0'
        return value
    }).matches(/^[^0]/, '1 이상 값을 입력해주세요.'),
    unitPrice: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').transform((value, originalValue) => {
        if (originalValue === "") return '0'
        return value
    }).matches(/^[^0]/, '1 이상 값을 입력해주세요.')
}) 

const outgoingValidation = yup.object().shape({
    quantity: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').required('입출고수량을 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return '0'
        return value
    }).matches(/^[^0]/, '1 이상 값을 입력해주세요.')
})

const StockModal = (props) => {
    const { modal, toggle, id, unit, picker, material, navigate } = props
    useAxiosIntercepter()
    const cookies = new Cookies()
    const [data, setData] = useState([])
    const [selectError, setSelectError] = useState({inOutType: false})
    const {inOutType} = selectError
    const [validation, setValidation] = useState(yup.object().shape({}))

    const defaultValues = {quantity: '', unitPrice: '', inOutType: {value: '', label: '(선택)'}, description: ''}
    const [unitPrice, setUnitPrice] = useState('')

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        trigger,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(validation)
    })

    const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

    const onSubmit = (data) => {
        const check = checkSelectValueObj(control, selectError, setSelectError)
        if (!check) { return false }
        const formData = new FormData()
        formData.append('quantity', getCommaDel(data.quantity))
        data.inOutType.value === 'incoming' ? formData.append('unitPrice', getCommaDel(data.unitPrice)) : formData.append('unitPrice', JSON.stringify(unitPrice))
        formData.append('description', data.description)

        axios.post(`${API_FACILITY_MATERIAL_INFO_DETAIL_STOCK}/${id}`, formData, {params: {type: data.inOutType.value, user: cookies.get('userId'), property_id: cookies.get('property').value, start_date: picker[0], end_date: picker[1]}})
        .then(res => {
            if (res.status === 200) {
                Swal.fire({
                    title: '',
                    html: `${data.inOutType.label} 등록되었습니다.`,
                    icon: 'success',
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        actions: `sweet-alert-custom center`
                    }
                }).then(res => {
                    if (res.isConfirmed === true) {
                        toggle()
                        navigate(`${ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL}/${id}`, {state: '입출고내역'})
                    }
                })
            }
        })
        .catch(res => {
            console.log(`${API_FACILITY_MATERIAL_INFO_DETAIL_STOCK}/${id}`, res)
        })
    }

    useEffect(() => {
        getTableData(API_FACILITY_MATERIAL_INFO_STOCK, {property_id: cookies.get('property').value, material_id: id}, setData)
    }, [])

    useEffect(() => {
        if (watch('inOutType').value === 'outgoing') {
            if (getCommaDel(watch('quantity')) > material[0].total_quantity) {
                Swal.fire({
                    title: '',
                    html: '재고수량보다 출고수량이 많을 수 없습니다.',
                    icon: 'warning',
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        actions: `sweet-alert-custom center`
                    }
                }).then(res => {
                    console.log(res)
                    setValue('quantity', '')
                })
            }
            let inputNumber = getCommaDel(watch('quantity'))
            const modifiedData = []
    
            for (let i = 0; i < data.length && inputNumber > 0; i++) {
                try {
                    const subtractAmount = Math.min(inputNumber, (data.filter(item => item.material === Number(id)))[i].quantity)
                    modifiedData.push({ unit_price: (data.filter(item => item.material === Number(id)))[i].unit_price, quantity: subtractAmount })
                    inputNumber -= subtractAmount
                } catch (err) {
                    Swal.fire({
                        title: '',
                        html: '재고수량보다 출고수량이 많을 수 없습니다.',
                        icon: 'warning',
                        customClass: {
                            confirmButton: 'btn btn-primary',
                            actions: `sweet-alert-custom center`
                        }
                    }).then(res => {
                        console.log(res)
                        setValue('quantity', '')
                    })
                    return ''
                }
            }
            setUnitPrice(modifiedData)
            setValue('unitPrice', unitPrice)
        }
    }, [watch('quantity')])

    useEffect(() => {
        const tempTypeValue = watch('inOutType').value
        setValue('unitPrice', '')
        setValue('quantity', '')

        if (tempTypeValue === 'incoming') {
            setValidation(incomingValidation)
            return
        } else if (tempTypeValue === 'outgoing') {
            setValidation(outgoingValidation)
            return
        }
        setValidation(yup.object().shape({}))
    }, [watch('inOutType')])

    useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])

    useEffect(() => {
        reset()
        setUnitPrice('')
    }, [toggle])

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
                    <Row className='mb-1' style={{display: 'flex', alignItems: 'center'}}>
                        <Col className='mt-1' style={{width: '-webkit-fill-available', paddingLeft: '6%'}}>
                            <Row>
                                <span style={{color: 'white', fontSize: '20px'}}>
                                    입출고 등록<br/>
                                </span>
                            </Row>
                            <Row>
                                <span style={{color: 'white'}}>
                                    빈칸에 맞춰 양식을 작성해 주세요.
                                </span>
                            </Row>
                        </Col>
                        <Col style={{display: 'flex', justifyContent: 'end', paddingRight: '6%'}}>
                            <img src={winLogoImg} style={{maxHeight: '85px'}}/> 
                        </Col>
                    </Row>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <div className="d-flex align-items-center">
                                구분&nbsp;
                                <div className='essential_value'/>
                            </div>
                            <Row>
                                <Controller
                                    id='inOutType'
                                    name='inOutType'
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                            <Select
                                                name='inOutType'
                                                classNamePrefix='select'
                                                className='react-select custom-select-inOutType custom-react-select'
                                                value={value}
                                                options={material && material.length > 0 ? options : optionsIncom}
                                                defaultValue={material && material.length > 0 ? options[0] : optionsIncom[0]}
                                                onChange={handleSelectValidation}
                                            />
                                            {inOutType && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>구분을 선택해주세요.</div>}
                                        </Col>
                                    )}
                                />
                            </Row>
                        </Col>
                        <Col>
                            <div className="d-flex align-items-center">
                                입출고수량&nbsp;
                                <div className='essential_value'/>
                            </div>
                            <Controller
                                id='quantity'
                                name='quantity'
                                control={control}
                                render={({ field : {onChange, value}}) => (
                                    <Input 
                                        type="text"
                                        value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                        invalid={errors.quantity && true}
                                        disabled={watch('inOutType') ? watch('inOutType').value === '' : ''} 
                                        placeholder={watch('inOutType').value === 'outgoing' ? `현재 재고: ${material[0].total_quantity}${unit}` : ''}
                                        onChange={e => {
                                            AddCommaOnChange(e, onChange, true)
                                            trigger('quantity')
                                        }}
                                    />
                                )}
                            />
                            {errors.quantity && <FormFeedback>{errors.quantity.message}</FormFeedback>}
                        </Col>
                    </Row>
                    <Row className="my-1">
                        <Col>
                            <div className="d-flex align-items-center">
                                단가
                                {watch('inOutType')?.value !== 'outgoing' ? <>&nbsp;<div className='essential_value'/></> : ''}
                            </div>
                            {
                                watch('inOutType')?.value === 'incoming' ? 
                                <Controller
                                    id='unitPrice'
                                    name='unitPrice'
                                    control={control}
                                    render={({ field : {onChange, value}}) => (
                                        <Input 
                                            type="text"
                                            value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                            invalid={errors.unitPrice && true}
                                            disabled={watch('inOutType') ? watch('inOutType').value === '' : ''}
                                            onChange={e => {
                                                AddCommaOnChange(e, onChange, true)
                                                trigger('unitPrice')
                                            }}
                                        />
                                    )}
                                /> :
                                <Controller
                                    id='unitPrice'
                                    name='unitPrice'
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} disabled value={unitPrice !== '' ? unitPrice.map(item => `₩${item.unit_price.toLocaleString('ko-KR')} (${item.quantity}EA)`).join(' / ') : ''}/>
                                    )}
                                />
                            }
                            {errors.unitPrice && <FormFeedback>{errors.unitPrice.message}</FormFeedback>}
                        </Col>
                        <Col>
                            <div>입출고금액</div>
                            {
                                watch('inOutType').value === 'incoming' ? 
                                <Input disabled value={`\u{20A9}${!isNaN(getCommaDel(watch('quantity')) * getCommaDel(watch('unitPrice'))) ? (getCommaDel(watch('quantity')) * getCommaDel(watch('unitPrice'))).toLocaleString('ko-KR') : 0 }`}></Input> :
                                <Input disabled value={unitPrice !== '' ? `₩${unitPrice.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0).toLocaleString('ko-KR')}` : ''} />
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div>비고</div>
                            <Controller
                                id='description'
                                name='description'
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} disabled={watch('inOutType').value === ''}/>
                                )}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className='mt-1' style={{display:'flex', justifyContent:'end', alignItems:'center', borderTop: '1px solid #B9B9C3'}}>
                    <Button color='report' className="mx-1" onClick={() => toggle()}>취소</Button>
                    <Button type='submit' color='primary'>확인</Button>
                </ModalFooter>
            </Form>
        </Modal>
    )
}

export default StockModal