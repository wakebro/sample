import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, useForm } from "react-hook-form"
import { Button, Col, Form, FormFeedback, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import { API_FACILITY_MATERIAL_INFO_DETAIL_ATTACHMENT, API_FACILITY_MATERIAL_INFO_DETAIL_MODAL, API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL, API_FACILITY_MATERIAL_INFO_STOCK } from "../../../../constants"
import * as yup from 'yup'
import { AddCommaOnChange, getTableData, primaryColor, getCommaDel } from "../../../../utility/Utils"
import Swal from 'sweetalert2'
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import winLogoImg from '@src/assets/images/winlogo.png'
import axios from "axios"
import { useEffect, useState } from "react"
import Cookies from "universal-cookie"

const ModifyModal = (props) => {
    useAxiosIntercepter()
    const { modifyModal, toggleModify, rowId, detailData, navActive, id, setRowId, setTableSelect, picker, navigate, material, cookies } = props
    const content = rowId ? ((detailData.filter(value => value.id === rowId))[0] ? (detailData.filter(value => value.id === rowId))[0].content : '') : ''
    const quantity = rowId ? ((detailData.filter(value => value.id === rowId))[0] ? (detailData.filter(value => value.id === rowId))[0].quantity : '') : ''
    const [fileName, setFileName] = rowId ? (detailData.filter(value => value.id === rowId)[0] ? useState(detailData.filter(value => value.id === rowId)[0].original_file_name) : useState('')) : useState('')
    const [file, setFile] = useState('')
    const [data, setData] = useState([])
    const [unitPrice, setUnitPrice] = useState()
    const validationSchema = yup.object().shape({
        quantity: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').required('출고수량을 입력해주세요.').transform((value, originalValue) => {
            if (originalValue === "") return '0'
            return value
        }).matches(/^[^0]/, '1 이상 값을 입력해주세요.'),
        content: yup.string().required('자재코드를 입력하세요.')
	})

    const defaultValues = {
        quantity: '',
        content: content
    }

    const {
        handleSubmit,
        control,
        trigger,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const handleClick = () => {
        toggleModify()
        setRowId()
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
        const cookies = new Cookies()
        const formData = new FormData()
        formData.append('property_id', cookies.get('property').value)
        formData.append('content', data.content)
        formData.append('row_id', rowId)
        if (getCommaDel(data.quantity) !== quantity) formData.append('quantity', getCommaDel(data.quantity))
        formData.append('unitPrice', JSON.stringify(unitPrice))
        formData.append('file', file)
        axios.put(API, formData, {params: {start_date: picker[0], end_date: picker[1], old_quantity: quantity}})
        .then(res => {
            if (res.status === 200) {
                Swal.fire({
                    title: '',
                    html: `${navActive} 수정되었습니다.`,
                    icon: 'success',
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        actions: `sweet-alert-custom center`
                    }
                }).then(res => {
                    if (res.isConfirmed === true) {
                        toggleModify()
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

    const fileUpload = (e) => {
        setFileName(e.name)
        setFile(e)
    }

    useEffect(() => {
        getTableData(API_FACILITY_MATERIAL_INFO_STOCK, {property_id: cookies.get('property').value, material_id: id}, setData)
    }, [])

    useEffect(() => {
        if (navActive === '자재이력') {
            if (getCommaDel(watch('quantity')) > material[0].total_quantity + quantity) {
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
            if (quantity < getCommaDel(watch('quantity'))) {
                let inputNumber = getCommaDel(watch('quantity')) - quantity
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
                console.log("modifiedData", modifiedData)
                setUnitPrice(modifiedData)
            }
        }
     }, [watch('quantity')])

    useEffect(() => {
        if (quantity) setValue('quantity', quantity)
    }, [detailData])

    return (
        <Modal isOpen={modifyModal} toggle={toggleModify}>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
                    <Row className='mb-1' style={{display: 'flex', alignItems: 'center'}}>
                        <Col className='mt-1' style={{width: '-webkit-fill-available', paddingLeft: '6%'}}>
                            <Row>
                                <span style={{color: 'white', fontSize: '20px'}}>
                                    {navActive} 수정<br />
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
                    <Row style={{margin: 0}}>
                        출고수량
                    </Row>
                    <Controller
                        id='quantity'
                        name='quantity'
                        control={control}
                        render={({ field : {onChange, value}}) => (
                            <Input 
                                type="text"
                                invalid={errors.quantity && true}
                                value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                onChange={ e => {
                                    AddCommaOnChange(e, onChange, true)
                                    trigger('quantity')
                                }}
                            />
                        )}
                    />
                    {errors.quantity && <FormFeedback>{errors.quantity.message}</FormFeedback>}
                    <Row style={{margin: 0, marginTop:'1rem'}}>
                        수리 및 기타내역
                    </Row>
                    <Controller
                        id='content'
                        name='content'
                        control={control}
                        render={({ field }) => (
                            <Input className='mb-1' type="textarea" invalid={errors.content && true} {...field} />
                        )}
                    />
                    {errors.content && <FormFeedback>{errors.content.message}</FormFeedback>}
                    <Row style={{margin: 0}}>
                        첨부 파일
                    </Row>
                    <Row style={{display: 'flex'}}>
                        <Col md='4' style={{width: 'auto'}}>
                            <Button color='primary' outline onClick={() => handleFileClick()}>파일 선택</Button>
                        </Col>
                        <Input id='file' type="file" onChange={(e) => fileUpload(e.target.files[0])} style={{display: 'none'}}/>
                        <Col style={{paddingLeft: 0}}>
                            <div style={{border: '0.5px solid #B9B9C3', borderRadius: '3px', height: '100%', paddingLeft: '2%', display: 'flex', alignItems: 'center'}}>
                                {fileName}
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter className='mt-1' style={{display:'flex', justifyContent:'end', alignItems:'center', borderTop: '1px solid #B9B9C3'}}>
                    <Button color='report' className="mx-1" onClick={() => handleClick()}>취소</Button>
                    <Button type='submit' color='primary'>확인</Button>
                </ModalFooter>
            </Form>
        </Modal>
    )
}

export default ModifyModal