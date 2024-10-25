import { Controller, useForm } from "react-hook-form"
import { Button, Col, Form, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import { API_FACILITY_MATERIAL_INFO_DETAIL_ATTACHMENT, API_FACILITY_MATERIAL_INFO_DETAIL_MODAL, API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT, API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT_SELECT_OPTIONS } from "../../../../constants"
import { checkSelectValue, getTableDataCallback, primaryColor, sweetAlert } from "../../../../utility/Utils"
import { Fragment, useEffect, useState } from "react"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import Cookies from "universal-cookie"
import Select from 'react-select'
import axios from "axios"
import winLogoImg from '@src/assets/images/winlogo.png'

const ReplacementMaterialModifyModal = (props) => {
    useAxiosIntercepter()
    const { 
        modifyModal, toggleModify, rowId, detailData, 
        navActive, id, setRowId, subId, subName, setSubId, 
        setDetailData, picker, setTableSelect, setReplacementModifyModal 
    } = props
    const cookies = new Cookies()
    const [materialOptions, setMaterialOptions] = useState([])
    const description = rowId ? ((detailData.filter(value => value.id === rowId))[0] ? detailData.filter(value => value.id === rowId)[0].description : '') : ''
    const [selectError, setSelectError] = useState({replacementMaterial: false})
    const defaultValues = subId ? {
        replacementMaterial: {value: subId, label: subName},
        description: description
    } : undefined
    const {
        handleSubmit,
        control,
        setValue
    } = useForm({
        defaultValues
    })

    const handleClick = () => {
        toggleModify()
        setRowId()
        setSubId()
        setSelectError({replacementMaterial:false})
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
        formData.append('property', cookies.get('property').value)
        formData.append('name', data.replacementMaterial.value)
        formData.append('description', data.description)
        formData.append('row_id', rowId)
        formData.append('sub_id', subId)
        
        axios.put(API, formData, {params: {start_date: picker[0], end_date: picker[1]}})
        .then(res => {
            setDetailData(res.data)
        })
        .catch(res => {
            console.log(API, res)
        })
        
        setTableSelect([])
        toggleModify()
    }

    const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

    const getMaterialOptions = (data) => {
        if (Array.isArray(data)) {
            data.shift()
            data = data.filter(row => !detailData.find(detatilRow => String(row.value) === String(detatilRow.replacement_material?.id)))
            data.unshift({value: '', label: '선택'})
        }
        setMaterialOptions(data)
    }

    useEffect(() => {
        getTableDataCallback(API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT_SELECT_OPTIONS, {property_id: cookies.get('property').value}, getMaterialOptions)
    }, [detailData])

    useEffect(() => {
        if (modifyModal && materialOptions?.length <= 1) {
            sweetAlert('대체자재 수정', '수정할 자재가 없습니다.', 'warning')
            setReplacementModifyModal(false)
        }
    }, [modifyModal])

    return (
        <Fragment>
            {defaultValues !== undefined &&
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
                                    <Input {...field} />
                                )}
                            />
                        </ModalBody>
                        <ModalFooter className='mt-1' style={{display:'flex', justifyContent:'end', alignItems:'center', borderTop: '1px solid #B9B9C3'}}>
                            <Button color='report' className="mx-1" onClick={() => handleClick()}>취소</Button>
                            <Button type='submit' color='primary'>확인</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            }
        </Fragment>
    )
}

export default ReplacementMaterialModifyModal