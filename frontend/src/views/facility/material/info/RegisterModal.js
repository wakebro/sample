import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button, Col, Form, FormFeedback, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import { API_FACILITY_MATERIAL_INFO_DETAIL_ATTACHMENT, API_FACILITY_MATERIAL_INFO_DETAIL_MODAL, API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT, API_FACILITY_MATERIAL_INFO_STOCK, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL } from "../../../../constants"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { AddCommaOnChange, getTableData, primaryColor, getCommaDel } from "../../../../utility/Utils"
import Cookies from "universal-cookie"
import Swal from 'sweetalert2'
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import winLogoImg from '@src/assets/images/winlogo.png'


const MaterialInfoDetailModal = (props) => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const { modal, toggle, navActive, id, picker, setTableSelect, material, unit, navigate }  = props
    const [file, setFile] = useState()
    const [data, setData] = useState([])
    const [unitPrice, setUnitPrice] = useState('')

    const defaultValues = {
        quantity: '',
        content: ''
    }

    const validationSchema = yup.object().shape({
        quantity: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').required('출고수량을 입력해주세요.').transform((value, originalValue) => {
            if (originalValue === "") return '0'
            return value
        }).matches(/^[^0]/, '1 이상 값을 입력해주세요.'),
        content: yup.string().required('내용을 입력하세요.')
	})

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors },
        reset
    } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const handleClick = () => {
        toggle()
    }

    let API = ''
    if (navActive === '자재이력') {
        API = `${API_FACILITY_MATERIAL_INFO_DETAIL_MODAL}/${id}`
    } else if (navActive === '첨부파일' || navActive === '자재사진') {
        API = `${API_FACILITY_MATERIAL_INFO_DETAIL_ATTACHMENT}/${id}`
    } else {
        API = `${API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT}/${id}`
    }

    const onSubmit = (data) => {
        const formData = new FormData()
        formData.append('content', data.content)
        formData.append('file', file)
        formData.append('user', cookies.get('userId'))
        
        if (navActive === '첨부파일') {
            formData.append('type', 'attachment')
        } else if (navActive === '자재사진') {
            formData.append('type', 'photo')
        } else if (navActive === '자재이력') {
            formData.append('quantity', getCommaDel(data.quantity))
            formData.append('unitPrice', JSON.stringify(unitPrice))
            formData.append('property_id', cookies.get('property').value)
        }

        axios.post(API, formData, {params: {start_date: picker[0], end_date: picker[1]}})
        .then(res => {
            if (res.status === 200) {
                Swal.fire({
                    title: '',
                    html: `${navActive} 등록되었습니다.`,
                    icon: 'success',
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        actions: `sweet-alert-custom center`
                    }
                }).then(res => {
                    if (res.isConfirmed === true) {
                        toggle()
                        setTableSelect([])
                        navigate(`${ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL}/${id}`, {state: navActive})
                    }
                })
            }
        })
    }

    const handleFileClick = () => {
		const fileInput = document.getElementById(`file`)
		if (fileInput) {
		  fileInput.click()
		}
	}

    useEffect(() => {
        setFile()
        reset()
    }, [modal])

    useEffect(() => {
        if (navActive === '자재이력') {
            if (material[0]) {
                if (getCommaDel(watch('quantity')) > material[0].total_quantity) {
                    Swal.fire({
                        title: '',
                        html: '재고수량보다 출고수량이 많을 수 없습니다.',
                        icon: 'warning',
                        customClass: {
                            confirmButton: 'btn btn-primary',
                            actions: `sweet-alert-custom center`
                        }
                    }).then(() => {
                        setValue('quantity', '')
                        return false
                    })
                }
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
                        console.log(res.data)
                        setValue('quantity', '')
                    })
                    return ''
                }
            }
            setUnitPrice(modifiedData)
        }
    }, [watch('quantity')])

    useEffect(() => {
        getTableData(API_FACILITY_MATERIAL_INFO_STOCK, {property_id: cookies.get('property').value, material_id: id}, setData)
    }, [])

    return (
        <Modal isOpen={modal} toggle={toggle} className='modal-dialog-centered'>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
                    <Row className='mb-1' style={{display: 'flex', alignItems: 'center'}}>
                        <Col className='mt-1' style={{width: '-webkit-fill-available', paddingLeft: '6%'}}>
                            <Row>
                                <span style={{color: 'white', fontSize: '20px'}}>
                                    {navActive} 등록<br />
                                </span>
                            </Row>
                            <Row>
                                <span style={{color: 'white', whiteSpace:'pre-wrap'}}>
                                    {material && material.length > 0 ? '빈칸에 맞춰 양식을 작성해 주세요.' : '등록된 재고가 없습니다.\n입고 내역을 확인해 주세요.'}
                                </span>
                            </Row>
                        </Col>
                        <Col style={{display: 'flex', justifyContent: 'end', paddingRight: '6%'}}>
                            <img src={winLogoImg} style={{maxHeight: '85px'}}/> 
                        </Col>
                    </Row>
                </ModalHeader>
                <ModalBody>
                    <Row style={{margin: 0}}>
                        <Col className='card_table col text start'>
                            <div>출고수량</div>&nbsp;
                            <div className='essential_value'/>
                        </Col>
                    </Row>
                    <Controller
                        id='quantity'
                        name='quantity'
                        control={control}
                        render={({ field : {onChange, value}}) => (
                            <Input 
                                type="text"
                                invalid={errors.quantity && true}
                                value={value}
                                disabled={material && material.length === 0} 
                                placeholder={material && material.length > 0 ?  `현재 재고: ${(material[0].total_quantity).toLocaleString('ko-KR')}${unit}` : ''}
                                onChange={ e => {
                                    AddCommaOnChange(e, onChange, true)
                                    trigger('quantity')
                                }}
                            />
                        )}
                    />
                    {errors.quantity && <FormFeedback>{errors.quantity.message}</FormFeedback>}
                    <Row style={{margin: 0, marginTop:'1rem'}}>
                        <Col className='card_table col text start'>
                            <div>수리 및 기타내역</div>&nbsp;
                            <div className='essential_value'/>
                        </Col>
                    </Row>
                    <Controller
                        id='content'
                        name='content'
                        control={control}
                        render={({ field }) => (
                            <Input type="textarea" disabled={material && material.length === 0} invalid={errors.content && true} {...field} />
                        )}
                    />
                    {errors.content && <FormFeedback>{errors.content.message}</FormFeedback>}
                    <Row style={{margin: 0, marginTop:'1rem'}}>
                        첨부 파일
                    </Row>
                    <Row style={{display: 'flex'}}>
                        <Col md='4' style={{width: 'auto'}}>
                            <Button color='primary' disabled={material && material.length === 0} outline onClick={() => handleFileClick()}>파일 선택</Button>
                        </Col>
                        <Input id='file' type="file" disabled={material && material.length === 0} onChange={(e) => setFile(e.target.files[0])} style={{display: 'none'}}/>
                        <Col style={{paddingLeft: 0}}>
                            <div style={{border: '0.5px solid #B9B9C3', borderRadius: '3px', height: '100%', paddingLeft: '2%', display: 'flex', alignItems: 'center'}}>
                                {file ? file.name : ''}
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className='mt-1' style={{display:'flex', justifyContent:'end', alignItems:'center', borderTop: '1px solid #B9B9C3'}}>
                    <Button color='report' className="mx-1" onClick={() => handleClick()}>취소</Button>
                   { material && material.length > 0 && <Button type='submit' color='primary'>확인</Button> } 
                </ModalFooter>
            </Form>
        </Modal>
    )
}

export default MaterialInfoDetailModal