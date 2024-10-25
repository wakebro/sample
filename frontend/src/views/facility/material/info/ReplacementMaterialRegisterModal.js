import { yupResolver } from "@hookform/resolvers/yup"
import { Fragment, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button, Col, Form, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import Cookies from "universal-cookie"
import { API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT, API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT_SELECT_OPTIONS } from "../../../../constants"
import { checkSelectValue, checkSelectValueObj, getTableDataCallback, primaryColor, sweetAlert } from "../../../../utility/Utils"
import * as yup from 'yup'
import Select from 'react-select'
import { isEmptyObject } from "jquery"
import winLogoImg from '@src/assets/images/winlogo.png'
import axios from "axios"

const MaterialInfoDetailSubMaterialModal = (props) => {
    const { modal, toggle, navActive, id, detailData, setDetailData, setTableSelect, setSubMaterialModal }  = props
    const cookies = new Cookies()
    const [materialOptions, setMaterialOptions] = useState([])
    const [selectError, setSelectError] = useState({replacementMaterial:false})
    const defaultValues = {
        replacementMaterial: {value: '', label: '선택'},
        description: ''
    }
    const validationSchema = {
        name: yup.string().required('대체자재를 선택하세요.')
    }
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues,
        yupresolver: yupResolver(validationSchema)
    })

    const handleClick = () => {
        toggle()
        reset()
        setSelectError({replacementMaterial:false})
    }

    const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

    const onSubmit = (data) => {
        const check = checkSelectValueObj(control, selectError, setSelectError)
        if (!check) { return false }

        const formData = new FormData()
        formData.append('property', cookies.get('property').value)
        formData.append('name', data?.replacementMaterial?.value)
        formData.append('description', data.description)

        axios.post(`${API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT}/${id}`, formData)
        .then(res => {
            setDetailData(res.data)
        })
        .catch(res => {
            console.log(`${API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT}/${id}`, res)
        })

        toggle()
        setTableSelect([])
    }

    useEffect(() => {
        getTableDataCallback(
            API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT_SELECT_OPTIONS, 
            {
                property_id:cookies.get('property').value,
                material_id:id
            }, 
            (data) => {
                if (Array.isArray(data)) {
                    data.shift()
                    data = data.filter(row => !detailData.find(detatilRow => String(row.value) === String(detatilRow.replacement_material?.id)))
                    data.unshift({value: '', label: '선택'})
                }
                setMaterialOptions(data)
            }
        )
    }, [detailData])

    useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])

    useEffect(() => {
        if (modal && materialOptions?.length <= 1) {
            sweetAlert('대체자재 등록', '등록할 자재가 없습니다.', 'warning')
            setSubMaterialModal(false)
        }
    }, [modal])

    return (
        <Fragment>
            {materialOptions &&
                <>
                    <Modal isOpen={modal} toggle={toggle}>
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
                                    <Col xs={12} className="px-0 card_table col text">
                                        대체자재&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                </Row>
                                <Controller
                                    id='replacementMaterial'
                                    name='replacementMaterial'
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <>
                                            <Select
                                                name='replacementMaterial'
                                                classNamePrefix={'select'}
                                                className="react-select custom-select-replacementMaterial custom-react-select"
                                                options={materialOptions}
                                                value={value}
                                                defaultValue={materialOptions[0]}
                                                onChange={ handleSelectValidation }
                                            />
                                            {selectError.replacementMaterial && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>대체자재를 선택해주세요.</div>}
                                        </>
                                )}/>
                                <Row className='mt-1' style={{margin: 0}}>
                                    비고
                                </Row>
                                <Controller
                                    id='description'
                                    name='description'
                                    control={control}
                                    render={({ field }) => (
                                        <Input type='textarea' {...field} />
                                    )}
                                />
                            </ModalBody>
                            <ModalFooter className='mt-1' style={{display:'flex', justifyContent:'end', alignItems:'center', borderTop: '1px solid #B9B9C3'}}>
                                <Button color='report' className="mx-1" onClick={() => handleClick()}>취소</Button>
                                <Button type='submit' color='primary'>확인</Button>
                            </ModalFooter>
                        </Form>
                    </Modal>
                </>
            }
        </Fragment>
    )
}

export default MaterialInfoDetailSubMaterialModal