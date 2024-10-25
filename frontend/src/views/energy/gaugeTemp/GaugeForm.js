import { Fragment, useEffect, useState } from "react"
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, FormFeedback, Input, InputGroup, Row } from "reactstrap"
import Breadcrumbs from '@components/breadcrumbs'
import { Controller, useForm } from "react-hook-form"
import Select from 'react-select'
import { useLocation, useNavigate } from "react-router-dom"
import * as moment from 'moment'
import { isEmptyObject } from "jquery"
import axios from "axios"
import { 
    API_ENERGY_GAUGE_DETAIL, API_ENERGY_GAUGE_FORM_CHECK, API_ENERGY_GAUGE_FORM_SELECT_OPTIONS, 
    ROUTE_ENERGY_GAUGE_DETAIL, ROUTE_ENERGY_GAUGE_LIST } from "../../../constants"
import Cookies from "universal-cookie"
import { axiosPostPut, checkSelectValue, checkSelectValueObj, sweetAlert, handleCheckCodeWithProperty, primaryHeaderColor, AddCommaOnChange, getCommaDel } from "../../../utility/Utils"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"

const GaugeForm = () => {
    useAxiosIntercepter()
    const { state } = useLocation()
    const now = moment().format('YYYY-MM-DD')
    const cookies = new Cookies()
	const [checkCode, setCheckCode] = useState(false)
    const [guageGroupOptions, setGaugeGroupOptions] = useState([{value: '', label: '계량기명 선택'}])
    const [selectError, setSelectError] = useState({gaugeGroup: false, examinType: false})
    const pageType = state.type === 'register' ? '등록' : '수정'
    const oldCode = state.type === 'modify' ? state.data.code : ''
    const navigate = useNavigate()
    const [submitResult, setSubmitResult] = useState(false)
    // db 저장 type 변경
    const examinTypeOptions = [
        {value: '', label: '검침주기'},
        {value: 'm', label: '월간'},
        {value: 'd', label: '일일'}
    ]
    const validationSchema = yup.object().shape({
        name: yup.string().required('계기명을 입력해주세요.'),
        magnification: yup.string().required('배율을 입력해주세요.').transform((value, originalValue) => {
            if (originalValue === "") return null
            return value
        }).nullable().test({
            message: '유효한 양수값을 넣어주세요.',
            test: (additional) => {
                if (additional === '' || (parseInt(additional) >= 0 && parseFloat(additional) >= 0)) return true
                else return false
            }
        }),
        unit: yup.string().required('단위를 입력해주세요.')
    })

    const defaultValues = state.type === 'register' ? {
        name: '',
        unit: '',
        magnification: '',
        place: '',
        description: '',
        gaugeGroup: {value: '', label: '계량기명 선택'},
        examinType: {value: '', label: '검침주기'}
    } : {
        name: state.data.name,
        unit: state.data.unit,
        gaugeGroup: {value: state.data.gauge_group.id, label: state.data.gauge_group.code},
        examinType: {value: state.data.examin_type, label: state.data.examin_type},
        magnification: state.data.magnification,
        description: state.data.description,
        place: state.data.place
    }
    const {
        control,
        setValue,
        handleSubmit,
        watch,
        trigger,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

    const onSubmit = (data) => {
        const check = checkSelectValueObj(control, selectError, setSelectError)
        if (!check) { return false }

        if ((!checkCode) && (data.name !== oldCode)) { 
			sweetAlert('', '코드가 중복되는지 다시 한번 확인해주세요.', 'warning')
			return false
		}

        const formData = new FormData()
        formData.append('gauge_group', data.gaugeGroup.value)
        let examin_type = data.examinType.value
        // if (state.type !== 'register') examin_type = examinTypeOptions.find(row => row.label === state.data.examin_type).value
        if (examin_type !== 'd' && examin_type !== 'm') examin_type = examinTypeOptions.find(row => row.label === state.data.examin_type).value
        formData.append('examin_type', examin_type)
        formData.append('place', data.place)
        formData.append('name', data.name)
        formData.append('magnification', getCommaDel(data.magnification))
        formData.append('unit', data.unit)
        formData.append('description', data.description ? data.description : '')
        console.log(data.description ? data.description : '')

        const API = state.type === 'register' ? `${API_ENERGY_GAUGE_DETAIL}/-1`
                                            : `${API_ENERGY_GAUGE_DETAIL}/${state.id}`
        axiosPostPut(state.type, '계기정보', API, formData, setSubmitResult)
    }

    useEffect(() => {
        axios.get(API_ENERGY_GAUGE_FORM_SELECT_OPTIONS, {params: {property_id: cookies.get('property').value}})
        .then(res => {
            setGaugeGroupOptions(res.data.gauge_group_array)
        })
        .catch(res => {
            console.log(API_ENERGY_GAUGE_FORM_SELECT_OPTIONS, res)
        })
    }, [])

    useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])

    useEffect(() => {
		if (submitResult) {
			if (state.type === 'register') {
				navigate(ROUTE_ENERGY_GAUGE_LIST)
            } else {
				navigate(`${ROUTE_ENERGY_GAUGE_DETAIL}/${state.id}`)
			}
		}
	}, [submitResult])
    useEffect(() => {
		setCheckCode(false)
	}, [watch('name')])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='계기정보' breadCrumbParent='에너지관리' breadCrumbParent2='검침정보관리' breadCrumbActive='계기정보' />
                </div>
            </Row>
            <Card>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>{`계기정보 ${pageType}`}</CardTitle>
                    </CardHeader>
                    <CardBody className="mb-1">
                        {state.type === 'register' ? 
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>등록일자</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                            <Input disabled value={now}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor, padding: 0}}>설치장소</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <Controller
                                                id='place'
                                                name='place'
                                                control={control}
                                                render={({ field }) => (
                                                    <Input {...field} maxLength={250}/>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            :
                            <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>수정일자</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                            <Input disabled value={now}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg='6' md='6' xs='12'>
                                    <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                        <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor, padding: 0}}>설치장소</Col>
                                        <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                            <Controller
                                                id='place'
                                                name='place'
                                                control={control}
                                                render={({ field }) => (
                                                    <Input {...field}/>
                                                )}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        }
                        <Row style={{marginLeft: 0, marginRight: 0, borderLeft: '0.5px solid #B9B9C3'}}>
                            <Col lg='6' md='6' xs='12'>
                                <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                    <Col lg='4' md='4' xs='4' className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>
                                        <div>계량기명</div> &nbsp;
                                        <div className="essential_value"/>
                                    </Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                        <Controller
                                            id='gaugeGroup'
                                            name='gaugeGroup'
                                            control={control}
                                            render={({ field: { value } }) => (
                                                <Col md='12' className="card_table col text center" style={{flexDirection:'column', alignItems:'start'}}>
                                                    <>
                                                        <Select
                                                            name='gaugeGroup'
                                                            classNamePrefix={'select'}
                                                            className="react-select custom-select-gaugeGroup custom-react-select"
                                                            options={guageGroupOptions}
                                                            value={value}
                                                            defaultValue={guageGroupOptions[0]}
                                                            onChange={ handleSelectValidation }
                                                            styles={{ menu: base => ({...base, zIndex:9999 })}}
                                                        />
                                                    </>
                                                    {selectError.gaugeGroup && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>계량기를 선택해주세요.</div>}
                                                </Col>
                                        )}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg='6' md='6' xs='12'>
                                <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                    <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor, padding: 0}}>
                                        <div>검침주기</div> &nbsp;
                                        <div className="essential_value"/>
                                    </Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                        <Controller
                                            id='examinType'
                                            name='examinType'
                                            control={control}
                                            render={({ field: { value } }) => (
                                                <Col md='12' className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                                    <>
                                                        <Select
                                                            name='examinType'
                                                            classNamePrefix={'select'}
                                                            className="react-select custom-select-examinType custom-react-select"
                                                            options={examinTypeOptions}
                                                            value={value}
                                                            onChange={ handleSelectValidation }
                                                            styles={{ menu: base => ({...base, zIndex:9999 })}}
                                                        />
                                                        {selectError.examinType && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>검침주기를 선택해주세요.</div>}
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
                                        <div>계기명</div> &nbsp;
                                        <div className="essential_value"/>
                                    </Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                        <Controller
                                            id='name'
                                            name='name'
                                            control={control}
                                            render={({ field }) => (
                                                <>
                                                    <InputGroup>
                                                        <Input maxLength={250} invalid={errors.name && true} {...field} />
                                                        <Button style={{borderTopRightRadius: '0.358rem', borderBottomRightRadius: '0.358rem', zIndex:0}} 
                                                            onClick={() => handleCheckCodeWithProperty(field.value, cookies.get('property').value, API_ENERGY_GAUGE_FORM_CHECK, setCheckCode)}
                                                            >중복검사</Button>
                                                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                                                    </InputGroup>
                                                </>
                                            )}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg='6' md='6' xs='12'>
                                <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                    <Col lg='4' md='4' xs='4'  className='card_table col text center' style={{borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor, padding: 0}}>
                                        <div>배율</div> &nbsp;
                                        <div>/단위</div> &nbsp;
                                        <div className="essential_value"/>
                                    </Col>
                                    <Col>
                                        <Row style={{height: '100%'}}>
                                            <Col lg='5' md='5' xs='5' className='card_table col text start' style={{paddingRight: 0}}>
                                                <Controller
                                                    id='magnification'
                                                    name='magnification'
                                                    control={control}
                                                    render={({ field : {onChange, value} }) => (
                                                    <Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column'}}>
                                                        <Input 
                                                            invalid={errors.magnification && true} 
                                                            onChange={(e) => { 
                                                                AddCommaOnChange(e, onChange)
                                                                trigger('magnification')
                                                            }}
                                                            value={value}
                                                            />
                                                        {errors.magnification && <FormFeedback>{errors.magnification.message}</FormFeedback>}
                                                    </Col>
                                                    )}
                                                />
                                            </Col>
                                            <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0}}>
                                                /
                                            </Col>
                                            <Col lg='5' md='5' xs='5' className='card_table col text start' style={{paddingLeft: 0}}>
                                                <Controller
                                                    id='unit'
                                                    name='unit'
                                                    control={control}
                                                    render={({ field }) => (
                                                    <Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column'}}>
                                                        <Input maxLength={49} invalid={errors.unit && true} {...field} />
                                                        {errors.unit && <FormFeedback>{errors.unit.message}</FormFeedback>}
                                                    </Col>
                                                    )}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{marginLeft: 0, marginRight: 0, borderBottom: '0.5px solid #B9B9C3', minHeight: '70px'}}>
                            <Col lg='12' md='12' xs='12'>
                                <Row style={{borderTop: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', height: '100%'}}>
                                    <Col lg='2' md='2' xs='4' className='card_table col text center' style={{borderLeft: '0.5px solid #B9B9C3', borderRight: '0.5px solid #B9B9C3', backgroundColor: primaryHeaderColor}}>비고</Col>
                                    <Col lg='10' md='10' xs='8' className='card_table col text center'>
                                        <Controller
                                            id='description'
                                            name='description'
                                            control={control}
                                            render={({ field }) => (
                                                <Row style={{width: '100%'}}>
                                                    <Input type="textarea" invalid={errors.description && true} {...field}/>
                                                    {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
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
        </Fragment>
    )
}

export default GaugeForm