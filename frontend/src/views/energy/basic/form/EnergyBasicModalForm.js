import { useEffect, useState } from "react"
import { Controller, useForm } from 'react-hook-form'
import { Modal, ModalBody, ModalHeader, Row, Col, Label, Input, Button, ModalFooter, Form, FormFeedback, InputGroup } from 'reactstrap'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate } from "react-router-dom"
import winLogoImg from '@src/assets/images/winlogo.png'
import { 
    axiosPostPut, checkSelectValue, 
    checkSelectValueObj, sweetAlert, AddCommaOnChange, 
    getCommaDel, handleCheckCodeWithProperty, getObjectKeyCheck, resultCheckFunc, primaryColor, getTableDataCallback
} from '../../../../utility/Utils'
import {
    API_FIND_BUILDING,
    ROUTE_ENERGY_CODE, 
    API_ENERGY_BASIC_UTILITY_FORM_CHECK, 
    API_ENERGY_BASIC_MAGNIFICATION_BUILDINGS,
    API_ENERGY_BASIC_UTILITY_ENTRY_BUILDINGS
} from '../../../../constants'
import {typeObj, defaultValues, validationSchema, formUrlObj, detailUrlObj} from '../../data'
import Select from 'react-select'
import { isEmptyObject } from 'jquery'

const EnergyBasicModalForm = (props) => {
    useAxiosIntercepter()
    const {isOpen, setIsOpen, typecode, cookies, pageType, setPageType, detailData} = props
    const [checkCode, setCheckCode] = useState(false)
    const [selectError, setSelectError] = useState({building:false})
    const {building} = selectError
    const [selectEntryError, setSelectEntryError] = useState({entryCode:false})
    const {entryCode} = selectEntryError
    const navigate = useNavigate()
    const [buildingList, setBuildingList] = useState([{ value:'', label: '건물선택'}])
    const [codeList, setCodeList] = useState([{ value:'', label: '전체'}])
    const [submitResult, setSubmitResult] = useState(false)
    const oldCode = pageType === 'modify' ? detailData.code : ''
    const API = typecode === 'magnification' ? API_ENERGY_BASIC_MAGNIFICATION_BUILDINGS : API_FIND_BUILDING
    const [buildingCode, setBuildingCode] = useState('')
    // const [disableCode, setDisableCode] = useState('')
    const [selectBoolean, setSelectBoolean] = useState(true)

    const {
        control,
        setValue,
        handleSubmit,
		reset,
        trigger, //watch 를 선언하고
        watch,
        getValues,
        formState: { errors }
    } = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues[typecode])),
        resolver: typecode === 'utilityentry' ? '' : yupResolver(validationSchema[typecode]) // select validation만 사용
    })

    // select error handle
    const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

    // select error handle entry code
    const handleSelectEntryValidation = (e, event) => {
		checkSelectValue(e, event, selectEntryError, setSelectEntryError, setValue)
	}

    const customToggle = () => { // 모달 종료시 초기화
		setIsOpen(!isOpen)
        setPageType('')
		reset()
        setSelectError({building: false})
        setSelectEntryError({entryCode: false})
        setSelectBoolean(true)
	}

    // 데이터 등록 / 수정시 submit 함수
    const onSubmit = (data) => {
        if (typecode === 'magnification' && pageType !== 'modify') {
            const check = checkSelectValueObj(control, selectError, setSelectError)
            if (!check) { return false }
        } else if (typecode === 'utilityentry') {
            if (pageType !== 'modify') {
                const checkBuilding = checkSelectValueObj(control, selectError, setSelectError)
                if (!checkBuilding) { return false }
            }
            const check2 = checkSelectValueObj(control, selectEntryError, setSelectEntryError)
            if (!check2) { return false }
        }
        if (typecode === 'utilitycode') {
            if ((!checkCode) && (data.code !== oldCode)) {
                sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
                return false
            }
        }
        const formData = new FormData()
        if (typecode === 'utilitycode') {
            formData.append('code', data.code)
            formData.append('description', data.description)
        } 
        if (typecode === 'magnification') {
            formData.append('building', pageType !== 'modify' ? data.building.value : data.building)
            formData.append('general_electric', getCommaDel(data.general))
            formData.append('ice_storage', getCommaDel(data.iceStorage))
            formData.append('pressure', getCommaDel(data.pressure))
            formData.append('cooking', getCommaDel(data.cooking))
        }
        if (typecode === 'utilityentry') {
            formData.append('building', pageType !== 'modify' ? data.building.value : data.building)
            formData.append('code', data.entryCode.value)
        }
        formData.append('property', cookies.get("property").value)
        const API = pageType === 'register' ? formUrlObj[typecode]
                                    : `${detailUrlObj[typecode]}/${detailData.id}`
        axiosPostPut(pageType, typeObj[typecode], API, formData, setSubmitResult)
    }

    // 등록 시 이동
    useEffect(() => {
		if (submitResult) {
            navigate(`${ROUTE_ENERGY_CODE}/${typecode}`)
		}
	}, [submitResult])

    // 첫 랜더링시 건물리스트 받아옴
    useEffect(() => {
        const param = {
            prop_id : cookies.get('property').value,
            register: true
        }
        getTableDataCallback(API, param, function(data) {
            const tempBuildList = data
            if (Array.isArray(tempBuildList)) { // 배열인지 체크
                tempBuildList.shift() // shift
                setBuildingList(tempBuildList)
            }
        })
    }, [])

    // 수정시 데이터를 setting
    useEffect(() => {
        if (detailData && pageType === 'modify') {
            if (typecode === 'utilitycode') {
                setValue('code', detailData.code)
                // setDisableCode(detailData.code)
                setValue('description', detailData.description)
            } else if (typecode === 'magnification') {
                setBuildingCode(detailData.building_code)
                setValue('building', detailData.building) // 문제
                setValue('general', detailData.general_electric)
                setValue('iceStorage', detailData.ice_storage)
                setValue('pressure', detailData.pressure)
                setValue('cooking', detailData.cooking)
            } else if (typecode === 'utilityentry') {
                setValue('building', detailData.building) // 문제
                setValue('entryCode', {value:detailData.code, label:detailData.code_description}) // 문제
                setBuildingCode(detailData.building_code)
            }
        } // if end
    }, [detailData])// useEffect end

    // select error 처리를 위한 useEffect
    useEffect(() => {
		if (!isEmptyObject(errors)) { 
            checkSelectValueObj(control, selectError, setSelectError)
            checkSelectValueObj(control, selectEntryError, setSelectEntryError)
        } 
	}, [errors])

    //effect를 선언해서 해당 building value 변화하면 배율 받아옴. utilityentry page에서만 작동.
    useEffect(() => {
		if (typecode === 'utilityentry' && isOpen) {
            const buildingValue = resultCheckFunc(getObjectKeyCheck(getValues('building'), 'value'))
            const param = {
                prop_id : cookies.get('property').value,
                register: true,
                building: pageType !== 'modify' ? buildingValue : typeof getValues('building') !== 'object' ? getValues('building') : detailData.building
            }
            getTableDataCallback(API_ENERGY_BASIC_UTILITY_ENTRY_BUILDINGS, param, function(data) {
                const tempList = data
                if (tempList.length > 0) {
                    setSelectBoolean(false)
                    setCodeList(tempList)
                    setValue('entryCode', {value:'', label:'수광비 코드를 선택해주세요.'})
                    return
                }
                setValue('entryCode', {value:'', label:'입력가능한 코드가 없습니다.'})
                setSelectBoolean(true)
            })
        }
	}, [watch('building'), detailData])
    return (
        <Modal isOpen={isOpen} toggle={() => customToggle()} className='modal-dialog-centered'>
            <ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
                <div className='mb-1' style={{display: 'flex', alignItems: 'center', paddingLeft: '7%'}}>
                    <div className='mt-1' style={{width: '74%'}}>
                        <Row>
                            <span style={{color: 'white', fontSize: '20px'}}>
                                {typeObj[typecode]}  {pageType === 'modify' ? '수정' : '등록'}<br />
                            </span>
                        </Row>
                        <Row>
                            <span style={{color: 'white'}}>
                                빈칸에 맞춰 양식을 작성해 주세요.
                            </span>
                        </Row>
                    </div>
                    <div>
                        <img src={winLogoImg} style={{maxHeight: '85px'}}/> 
                    </div>
                </div>
            </ModalHeader>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    {typecode === 'utilitycode' &&
                        <>
                            <Row>
                                <Label className="form-check-label custom_label d-flex align-items-center">
                                    코드&nbsp;
                                    <div className='essential_value'/>
                                </Label>
                                <Controller
                                    id='code'
                                    name ='code'
                                    control={control}
                                    render={({field: {value, onChange}}) => (
                                        <Col>
                                            <InputGroup>
                                                <Input 
                                                    // readOnly={pageType === 'modify'} 
                                                    invalid={errors.code && true} 
                                                    value={value} 
                                                    maxLength={250}
                                                    onChange={(e) => {
                                                        onChange(e)
                                                        setCheckCode(false)
                                                    }}
                                                />
                                                <Button 
                                                    onClick={() => handleCheckCodeWithProperty(value, cookies.get("property").value, API_ENERGY_BASIC_UTILITY_FORM_CHECK, setCheckCode)}>
                                                    중복검사
                                                </Button>
                                                {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                                            </InputGroup>
                                        </Col>
                                    )}
                                />
                            </Row>
                            <br/>
                            <Row>
                                <Col className="form-check-label custom_label">
                                    <Label className="form-check-label custom_label d-flex align-items-center">
                                        수광비코드&nbsp;
                                        <div className='essential_value'/>
                                    </Label>
                                    <Controller 
                                        id = 'description'
                                        name = 'description'
                                        control={control}
                                        render={({field}) => (
                                            <>
                                                <Input maxLength={250} invalid={errors.description && true} {...field}/>
                                                {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                                            </>
                                        )}
                                    />
                                </Col>
                            </Row>
                        </>
                    }
                    { typecode === 'magnification' &&
                        <>
                            <Row>
                                <Col className="form-check-label custom_label">
                                    <Label className="form-check-label custom_label" style={{display:'flex', alignItems: 'center'}}>
                                        <div>건물</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Label>
                                    <Controller 
                                        name = 'building'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                                {   pageType !== 'modify' ?
                                                    <Select 
                                                        name = 'building'
                                                        classNamePrefix={'select'}
                                                        className="react-select custom-select-building custom-react-select"
                                                        options={buildingList.length > 0 ? buildingList : [{ value:'', label: '건물이 없습니다.'}]}
                                                        value={value}
                                                        onChange={ handleSelectValidation }/>
                                                    :
                                                    <Input 
                                                        name = 'buildingCode'
                                                        value={buildingCode}
                                                        disabled={true}/>
                                                }
                                                {building && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>건물을 선택해주세요.</div>}
                                            </Col>
                                        )}
                                    />
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col md='6' xs='12' className="form-check-label custom_label">
                                    <Label className="form-check-label custom_label d-flex align-items-center">
                                        <div>적용배율(일반전력)</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Label>
                                    <Controller 
                                        id = 'general'
                                        name = 'general'
                                        control={control}
                                        render={({field: {onChange, value}}) => (
                                            <>
                                                <Input 
                                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                    invalid={errors.general && true}
                                                    onChange={e => {
                                                        AddCommaOnChange(e, onChange)
                                                        trigger('general')
                                                    }}
                                                />
                                                {errors.general && <FormFeedback>{errors.general.message}</FormFeedback>}
                                            </>
                                        )}
                                    />
                                </Col>
                                <Col md='6' xs='12' className="form-check-label custom_label">
                                    <Label className="form-check-label custom_label d-flex align-items-center">
                                        <div>적용배율(빙축열)</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Label>
                                    <Controller 
                                        id = 'iceStorage'
                                        name = 'iceStorage'
                                        control={control}
                                        render={({field: {onChange, value}}) => (
                                            <>
                                                <Input 
                                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                    invalid={errors.iceStorage && true} 
                                                    onChange={e => {
                                                        AddCommaOnChange(e, onChange)
                                                        trigger('iceStorage')
                                                    }}
                                                />
                                                {errors.iceStorage && <FormFeedback>{errors.iceStorage.message}</FormFeedback>}
                                            </>
                                        )}
                                    />
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col md='6' xs='12' className="form-check-label custom_label">
                                    <Label className="form-check-label custom_label d-flex align-items-center">
                                        <div>적용단가(중, 저압)</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Label>
                                    <Controller 
                                        id = 'pressure'
                                        name = 'pressure'
                                        control={control}
                                        render={({field: {onChange, value}}) => (
                                            <>
                                                <Input 
                                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                    invalid={errors.pressure && true}
                                                    onChange={e => {
                                                        AddCommaOnChange(e, onChange)
                                                        trigger('pressure')
                                                    }}
                                                />
                                                {errors.pressure && <FormFeedback>{errors.pressure.message}</FormFeedback>}
                                            </>
                                        )}
                                    />
                                </Col>
                                <Col md='6' xs='12' className="form-check-label custom_label">
                                    <Label className="form-check-label custom_label d-flex align-items-center">
                                        <div>적용단가(취사)</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Label>
                                    <Controller 
                                        id = 'cooking'
                                        name = 'cooking'
                                        control={control}
                                        render={({field: {onChange, value}}) => (
                                            <>
                                                <Input
                                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                    invalid={errors.cooking && true}
                                                    onChange={e => {
                                                        AddCommaOnChange(e, onChange)
                                                        trigger('cooking')
                                                    }}
                                                />
                                                {errors.cooking && <FormFeedback>{errors.cooking.message}</FormFeedback>}
                                            </>
                                        )}
                                    />
                                </Col>
                            </Row>
                        </>
                    }
                    { typecode === 'utilityentry' && 
                        <>
                            <Row>
                                <Col md='6' xs='12' className="form-check-label custom_label">
                                    <Label className="form-check-label custom_label d-flex align-items-center">
                                        <div>건물</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Label>
                                    <Controller 
                                        name = 'building'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                                {   pageType !== 'modify' ?
                                                        <Select 
                                                        name = 'building'
                                                        classNamePrefix={'select'}
                                                        className="react-select custom-select-building custom-react-select"
                                                        options={buildingList.length > 0 ? buildingList : [{ value:'', label: '건물이 없습니다.'}]}
                                                        value={value}
                                                        onChange={ handleSelectValidation }
                                                        placeholder={'건물을 선택해주세요.'}
                                                        />
                                                    :
                                                    <Input 
                                                        name = 'buildingCode'
                                                        value={buildingCode}
                                                        disabled={true}/>
                                                }
                                                {building && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>건물을 선택해주세요.</div>}
                                            </Col>
                                        )}
                                    />
                                </Col>
                                <Col md='6' xs='12' className="form-check-label custom_label">
                                    <Label className="form-check-label custom_label d-flex align-items-center">
                                        <div>코드명</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Label>
                                    <Controller 
                                        name = 'entryCode'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                                <Select 
                                                    name = 'entryCode'
                                                    classNamePrefix={'select'}
                                                    className="react-select custom-select-entryCode custom-react-select"
                                                    options={codeList}
                                                    value={value}
                                                    isDisabled={selectBoolean}
                                                    placeholder={`${selectBoolean ? '건물을 먼저 선택해주세요.' : '수광비 코드를 선택해주세요.'}`}
                                                    onChange={ handleSelectEntryValidation }/>   
                                                {entryCode && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>코드명 선택해주세요.</div>}
                                            </Col>
                                        )}
                                    />
                                </Col>
                            </Row>
                        </>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color='report' onClick={() => customToggle()} >취소</Button>
                    <Button type='submit' color='primary'>{pageType === 'modify' ? '수정' : '등록'}</Button>
                </ModalFooter>
            </Form>

        </Modal>
    )
}

export default EnergyBasicModalForm