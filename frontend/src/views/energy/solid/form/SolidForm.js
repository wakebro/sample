import Swal from "sweetalert2"
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState, useRef } from 'react'
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Card, CardBody, CardHeader, CardTitle, Col, Form, Row, FormFeedback, Input, CardFooter, Button } from 'reactstrap'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import {selectThemeColors} from '@utils'
import { useNavigate } from "react-router-dom"
import {
    API_EDUCATION_EMPLOYEE_LIST, 
    API_ENERGY_SOLID_FORM, 
    ROUTE_ENERGY_SOLID, 
    API_ENERGY_SOLID, 
    API_ENERGY_SOLID_DETAIL, 
    API_ENERGY_BASIC_MAGNIFICATION_LIST,
    API_ENERGY_BASIC_MAGNIFICATION_BUILDINGS,
    ROUTE_ENERGY_CODE
} from '../../../../constants' 
import { solidValues, solidValidation, axiosObj, alertObj, removeFormat } from '../../data'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { 
    checkSelectValue, formatDateTime, getTableData, 
    resultCheckFunc, getCommaDel, getObjectKeyCheck,
    axiosSweetAlert,
    addCommaReturnValue,
    primaryColor,
    checkOnlyView,
    sweetAlert,
    AddCommaOnChange,
    getTableDataCallback,
    setStringDate
} from '../../../../utility/Utils'
import { useSelector } from "react-redux"
import { ENERGY_GAS_REGISTER } from "../../../../constants/CodeList"
import { Korean } from "flatpickr/dist/l10n/ko.js"

// //첫 랜더링에서 effect 효과 막기
const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false)
  
    useEffect(() => {
      if (didMount.current) func()
      else didMount.current = true
    }, deps)
}// useDidMountEffect end

const SolidForm = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const cookies = new Cookies()
    const navigate = useNavigate()

    // today
    const today = moment().format('YYYY-MM-DD')
    const [detailData, setDetailData] = useState([])
    const [pastData, setPastData] = useState([])
    const [price, setPrice] = useState([])
    const [buildingList, setBuildingList] = useState([])
    const [selectedBuilding, setSelectedBuilding] = useState({})
    const [partners, setPartners] = useState([])
    const [guests, setGuests] = useState([])
    const [date, setDate] = useState()
    const [selectError, setSelectError] = useState({building: false})
    const {building} = selectError
    // codeError
    const [codeError, setCodeError] = useState(false)

    const [boiler1, setBoiler1]  = useState('')
    const [boiler2, setBoiler2]  = useState('')
    const [boiler3, setBoiler3]  = useState('')
    const [boiler4, setBoiler4]  = useState('')

    const [middlePress, setMiddlePress] = useState('')
    const [lowPress, setLowPress] = useState('')
    const [cook, setCook] = useState('')
    const [waterSupply, setWaterSupply] = useState('')
    
    const middleUsed = (removeFormat(middlePress) || 0) - (pastData && pastData.middle_press ? pastData.middle_press : 0)
    const lowUsed = (removeFormat(lowPress) || 0) - (pastData && pastData.low_press ? pastData.low_press : 0)
    const cookUsed = (removeFormat(cook) || 0) - (pastData && pastData.cook ? pastData.cook : 0)
    const waterSupplyUsed = (removeFormat(waterSupply) || 0) - (pastData && pastData.water_supply ? pastData.water_supply : 0)

    const middlePrice = resultCheckFunc((pastData && pastData.middle_press && price.length > 0) ? (removeFormat(middlePress) - pastData.middle_press) * price[0].pressure : removeFormat(middlePress) * (price.length > 0 ? price[0].pressure : 0))
    const lowPrice = resultCheckFunc((pastData && pastData.low_press && price.length > 0) ? (removeFormat(lowPress) - pastData.low_press) * price[0].pressure : removeFormat(lowPress) * (price.length > 0 ? price[0].pressure : 0))
    const cookPrice = resultCheckFunc((pastData && pastData.cook && price.length > 0) ? (removeFormat(cook) - pastData.cook) * price[0].cooking : removeFormat(cook) * (price.length > 0 ? price[0].cooking : 0))

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: solidValues,
        resolver: yupResolver(solidValidation)
    })

    const handleSelectValidation = (e, event) => {
        setSelectedBuilding(e)
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

    const handleWorkers = (e, event) => {
        if (event.action === "select-option" && guests.length >= 2) {
            sweetAlert('근무자 인원초과', '근무자는 2명까지 선택할 수 있습니다.', 'warning', 'center')
            return
        }
        setGuests([...e])
    }

    const onSubmit = (data) => {
        let state = 'register'
        let API = API_ENERGY_SOLID_FORM

        let userIdList = []
        if (guests.length > 0) {
            if (guests.length > 2) {
                sweetAlert('근무자 인원초과', '근무자는 2명까지 선택할 수 있습니다.', 'warning', 'center')
                return
            }
            guests.map(data => userIdList.push(data.value))
        } else {
            userIdList = null
        }

        const formData = new FormData()
        
        formData.append('boiler_1', getCommaDel(data.boiler_1))
        formData.append('boiler_2', getCommaDel(data.boiler_2))
        formData.append('boiler_3', getCommaDel(data.boiler_3))
        formData.append('boiler_4', getCommaDel(data.boiler_4))
        formData.append('building', data.building.value)
        formData.append('cook', getCommaDel(data.cook))
        formData.append('high_temp', getCommaDel(data.high_temp))
        formData.append('low_press', getCommaDel(data.low_press))
        formData.append('low_temp', getCommaDel(data.low_temp))
        formData.append('middle_press', getCommaDel(data.middle_press))
        formData.append('water_supply', getCommaDel(data.water_supply))

        formData.append('partner',  userIdList)
        formData.append('middle_used', middleUsed)
        formData.append('low_used', lowUsed)
        formData.append('cook_used', cookUsed)
        formData.append('water_used', waterSupplyUsed)
        formData.append('target_datetime', formatDateTime(date))

        if (detailData.length > 0 && moment(detailData[0].target_datetime).format('YYYY-M-D') === date[0]) {
            state = 'modify'
            API = `${API_ENERGY_SOLID_DETAIL}/${detailData[0].id}`
        }
        if (state === 'register') {
            formData.append('year', Number(date[0].split('-')[0]))
            formData.append('month', Number(date[0].split('-')[1]))
            formData.append('day', Number(date[0].split('-')[2]))
        }
        
        axiosObj[state](API, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: `보일러 가동시간 및 가스 사용량 ${alertObj[state]}`,
                    html: `보일러 가동시간 및 가스 사용량</br> ${alertObj[state]}이 성공적으로 완료하였습니다.`,
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "확인",
                    cancelButtonColor : primaryColor,
                    reverseButtons :true,
                    customClass: {
                        actions: 'sweet-alert-custom right'
                    }
                })
                navigate(`${ROUTE_ENERGY_SOLID}/day`)
            }
        }).catch(res => {
            console.log(res, "!!!!!!!!error")
        })
    }

    useEffect(() => {
        const param = {
            prop_id : cookies.get('property').value
        }
        getTableDataCallback(API_ENERGY_BASIC_MAGNIFICATION_BUILDINGS, param, (data) => {
            const tempList = data
            if (Array.isArray(tempList)) { // 배열인지 체크
                tempList.shift() // shift
                setBuildingList(tempList)
                setSelectedBuilding(tempList[0])
                setValue('building', tempList[0])
            }
        })
        getTableDataCallback(API_EDUCATION_EMPLOYEE_LIST, {propId: cookies.get('property').value}, (data) => {
            const tempUserList = []
            data.map(row => {
                row.employee.map(employee => {
                    tempUserList.push({value: employee.id, label:employee.name})
                })
            })
            setPartners(tempUserList)
        })
    }, [])

    useDidMountEffect(() => {
        const buildCheck = getObjectKeyCheck(selectedBuilding, 'value')
        if (buildCheck === -1 || buildCheck === '') {
            axiosSweetAlert(``, `${buildCheck === -1 ? '건물에 배율을 등록해주세요.' : '등록된 배율이 없습니다.'} <br/>기본 정보에서 배율을 등록해주세요.`, 'warning', 'center', setCodeError)
            return
        }//if end
        if (date !== undefined) getTableData(API_ENERGY_SOLID, {propertyId:cookies.get('property').value, buildingId: selectedBuilding.value, picker:[formatDateTime(`${date[0].split('-')[0]}-01-01`), formatDateTime(date)]}, setDetailData)
        if (selectedBuilding.value !== undefined) getTableData(API_ENERGY_BASIC_MAGNIFICATION_LIST, { property: cookies.get('property').value, buildingId : selectedBuilding.value }, setPrice)
    }, [date, selectedBuilding])

    useEffect(() => {
        if (detailData.length > 0) {
            if (moment(detailData[0].target_datetime).format('YYYY-M-D') === date[0]) {
                setValue('boiler_1', detailData[0].boiler_1)
                setValue('boiler_2', detailData[0].boiler_2)
                setValue('boiler_3', detailData[0].boiler_3)
                setValue('boiler_4', detailData[0].boiler_4)
                setValue('low_temp', detailData[0].low_temp)
                setValue('high_temp', detailData[0].high_temp)
                setValue('middle_press', detailData[0].middle_press)
                setValue('low_press', detailData[0].low_press)
                setValue('cook', detailData[0].cook)
                setValue('water_supply', detailData[0].water_supply)
                setBoiler1(detailData[0].boiler_1)
                setBoiler2(detailData[0].boiler_2)
                setBoiler3(detailData[0].boiler_3)
                setBoiler4(detailData[0].boiler_4)
                setMiddlePress(detailData[0].middle_press)
                setLowPress(detailData[0].low_press)
                setCook(detailData[0].cook)
                setWaterSupply(detailData[0].water_supply)
                const result = []
                const data = detailData[0].partner.split(',')
                data.map(user => {
                    partners.find(partner => {
                        if (String(partner.value) === String(user)) {
                            result.push(partner)
                        }
                    })
                })
                setGuests(result)
                detailData[1] ? setPastData(detailData[1]) : setPastData([])
            } else {
                setPastData(detailData[0])
                setBoiler1('')
                setBoiler2('')
                setBoiler3('')
                setBoiler4('')
                setMiddlePress('')
                setLowPress('')
                setCook('')
                setWaterSupply('')
                setValue('high_temp', 0)
                setValue('middle_press', 0)
                setGuests([])
            }
        } else {
            setMiddlePress('')
            setLowPress('')
            setCook('')
            setWaterSupply('')
            setPastData([])
            setGuests([])
        }
    }, [detailData])

    // 등록된 배율이 없으면 이동
    useEffect(() => {
        if (codeError) {
            navigate(`${ROUTE_ENERGY_CODE}/magnification`)
        }
    }, [codeError])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='가스 사용량 관리' breadCrumbParent='에너지관리' breadCrumbParent2='가스사용관리' breadCrumbActive='가스 사용량 관리'/>
                </div>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <CardTitle>가스 사용량 관리</CardTitle>
                        </CardHeader>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <CardBody>
                                <Row className='mx-0' style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                    <Col  xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Row style={{height:'100%'}}>
                                            <Col xs='4' md='3'  className='card_table col col_color text center'>
                                                입력번호
                                            </Col>
                                            <Col xs='8' md='9' className='card_table col text start '  style={{justifyContent:'space-between'}}>
                                                {detailData.length > 0 && moment(detailData[0].target_datetime).format('YYYY-M-D') === date[0] ? detailData[0].id : ''}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col  xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Row style={{height:'100%'}}>
                                            <Col xs='4' md='3'  className='card_table col col_color text center'>
                                                건물&nbsp;
                                                <div className="essential_value"/>
                                            </Col>
                                            <Col xs='8' md='9' className='card_table col text start '  style={{justifyContent:'space-between'}}>
                                                <Controller 
                                                    name = 'building'
                                                    control={control}
                                                    render={({ field: { value } }) => (
                                                        <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                                            <Select 
                                                                name = 'building'
                                                                classNamePrefix={'select'}
                                                                className="react-select custom-select-building custom-react-select"
                                                                options={buildingList}
                                                                value={value}
                                                                onChange={ handleSelectValidation }/>   
                                                            {building && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>건물을 선택해주세요.</div>}
                                                        </Col>
                                                    )}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Row style={{height:'100%'}}>
                                            <Col xs='4' md='3'  className='card_table col col_color text center px-0'>
                                                입력일자&nbsp;
                                                <div className="essential_value"/>
                                            </Col>
                                            <Col xs='8' md='9' className='card_table col text start '  style={{justifyContent:'space-between'}}>
                                            <Controller
                                                id='target_datetime'
                                                name='target_datetime'
                                                control={control}
                                                render={({ field: {onChange, value} }) => (
                                                    <Col lg='12' md='12' xs='12' className='card_table col text center'>
                                                        <Row style={{width:'100%'}}>
                                                            <Flatpickr
                                                                className={`form-control ${errors.target_datetime ? 'is-invalid' : ''}`}
                                                                id='default-picker'
                                                                placeholder={`${today}`}
                                                                value={value}
                                                                onChange={(data) => { 
                                                                    const tempData = setStringDate(data)
                                                                    onChange(tempData)
                                                                    setDate(tempData)
                                                                }}
                                                                options = {{
                                                                    dateFormat: "Y-m-d",
                                                                    locale: Korean
                                                                }}
                                                                    />
                                                                {errors.target_datetime && <div style={{color:'#ea5455', fontSize:'0.857rem', paddingLeft:0 }}>{errors.target_datetime.message}</div>}
                                                        </Row>
                                                    </Col>
                                                )}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col  xs='12' md='3' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Row style={{height:'100%'}}>
                                            <Col xs='4' md='3'  className='card_table col col_color text center'>
                                                최근입력일
                                            </Col>
                                            <Col xs='8' md='9' className='card_table col text start '  style={{justifyContent:'space-between'}}>
                                                {pastData.target_datetime !== undefined && moment(pastData.target_datetime).format('YYYY-MM-DD')}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* //보일러// */}
                                <Row className='mx-0' style={{borderRight: '1px solid #B9B9C3'}}>
                                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Row>
                                            <Col xs='4' md='3'  className='card_table col col_color text center'>
                                                보일러(1호기)
                                            </Col>
                                            <Col xs='8' md='9' className='card_table col text start '  style={{justifyContent:'space-between'}}>
                                                <Controller
                                                    id='boiler_1'
                                                    name='boiler_1'
                                                    control={control}
                                                    render={({ field: {onChange, value} }) => (
                                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Input 
                                                                    bsSize='sm' 
                                                                    maxLength={20}
                                                                    invalid={errors.boiler_1 && true} 
                                                                    value={addCommaReturnValue(value) || ''}
                                                                    onChange={(e) => {
                                                                        AddCommaOnChange(e, onChange)
                                                                        setBoiler1(e.target.value)
                                                                }}/>
                                                                {errors.boiler_1 && <FormFeedback>{errors.boiler_1.message}</FormFeedback>}
                                                            </Row>
                                                        </Col>
                                                    )}         
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Row>
                                            <Col xs='4' md='3'  className='card_table col col_color text center'>
                                                보일러(2호기)
                                            </Col>
                                            <Col xs='8' md='9' className='card_table col text start '  style={{justifyContent:'space-between'}}>
                                                <Controller
                                                    name='boiler_2'
                                                    control={control}
                                                    render={({ field: {onChange, value} }) => (
                                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Input 
                                                                    bsSize='sm' 
                                                                    maxLength={20} 
                                                                    invalid={errors.boiler_2 && true} 
                                                                    //{...value} 
                                                                    value={addCommaReturnValue(value) || ''}
                                                                    onChange={(e) => {
                                                                        AddCommaOnChange(e, onChange)
                                                                        setBoiler2(e.target.value)
                                                                    }}
                                                                />
                                                                    {errors.boiler_2 && <FormFeedback>{errors.boiler_2.message}</FormFeedback>}
                                                            </Row>
                                                        </Col>
                                                    )}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mx-0' style={{borderRight: '1px solid #B9B9C3'}}>
                                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Row>
                                            <Col xs='4' md='3'  className='card_table col col_color text center'>
                                                보일러(3호기)
                                            </Col>
                                            <Col xs='8' md='9' className='card_table col text start '  style={{justifyContent:'space-between'}}>
                                                <Controller
                                                    id='boiler_3'
                                                    name='boiler_3'
                                                    control={control}
                                                    render={({ field: {onChange, value} }) => (
                                                        <Input bsSize='sm' maxLength={20} invalid={errors.boiler_3 && true} 
                                                            value={addCommaReturnValue(value) || ''} 
                                                            //{...value} 
                                                            onChange={(e) => {
                                                                AddCommaOnChange(e, onChange)
                                                                setBoiler3(e.target.value)
                                                        }}/>
                                                    )}
                                                />
                                                {errors.boiler_3 && <FormFeedback>{errors.boiler_3.message}</FormFeedback>}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Row>
                                            <Col xs='4' md='3'  className='card_table col col_color text center'>
                                                보일러(4호기)
                                            </Col>
                                            <Col xs='8' md='9' className='card_table col text start '  style={{justifyContent:'space-between'}}>
                                                <Controller
                                                    id='boiler_4'
                                                    name='boiler_4'
                                                    control={control}
                                                    render={({ field: {onChange, value} }) => (
                                                        <Input bsSize='sm' maxLength={20} invalid={errors.boiler_4 && true} 
                                                            value={addCommaReturnValue(value) || ''} 
                                                            //{...value}   
                                                            onChange={(e) => {
                                                                AddCommaOnChange(e, onChange)
                                                                setBoiler4(e.target.value)
                                                        }}/>
                                                    )}
                                                />
                                                {errors.boiler_4 && <FormFeedback>{errors.boiler_4.message}</FormFeedback>}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* 외기(온도) */}
                                <Row className='mx-0' style={{borderRight: '1px solid #B9B9C3'}}>
                                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Row>
                                            <Col xs='4' md='3'  className='card_table col col_color text center'>
                                                외기 온도(최저)
                                            </Col>
                                            <Col xs='8' md='9' className='card_table col text start '  style={{justifyContent:'space-between'}}>
                                                <Controller
                                                    id='low_temp'
                                                    name='low_temp'
                                                    control={control}
                                                    render={({ field }) => {
                                                        const formattedValue = field.value ? addCommaReturnValue(field.value) : ''
                                                        return (
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width:'100%'}}>
                                                                    <Input bsSize='sm' maxLength={20} invalid={errors.low_temp && true} {...field} value={formattedValue} />
                                                                    {errors.low_temp && <FormFeedback>{errors.low_temp.message}</FormFeedback>}
                                                                </Row>
                                                            </Col>
                                                        )
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                                        <Row>
                                            <Col xs='4' md='3'  className='card_table col col_color text center'>
                                                외기 온도(최고)
                                            </Col>
                                            <Col xs='8' md='9' className='card_table col text start '  style={{justifyContent:'space-between'}}>
                                                <Controller
                                                    id='high_temp'
                                                    name='high_temp'
                                                    control={control}
                                                    render={({ field }) => {
                                                        const formattedValue = field.value ? addCommaReturnValue(field.value) : ''
                                                        return (
                                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                                <Row style={{width:'100%'}}>
                                                                    <Input bsSize='sm' maxLength={20} invalid={errors.high_temp && true} {...field} value={formattedValue} />
                                                                    {errors.high_temp && <FormFeedback>{errors.high_temp.message}</FormFeedback>}
                                                                </Row>
                                                            </Col>
                                                        )
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* 가스 */}
                                <Row className='mx-0' style={{height:'100%', borderRight: '1px solid #B9B9C3'}}>
                                    <Col xs='12' md='1'  className='card_table col col_color text center'  style={{borderRight: 0, borderBottom: '1px solid #B9B9C3'}} >
                                        <div style={{textAlign:'center'}}>가스</div>
                                    </Col>
                                    <Col xs='12' md='11'>
                                        <Row style={{height:'100%'}}>
                                            <Col xs={12}>
                                                <Row>
                                                    <Col xs='12' md='1'  className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3', borderRight:0}} >
                                                        <div style={{textAlign:'center'}}>전일</div>
                                                    </Col>
                                                    <Col xs='12' md='4' className='card_table col text start' style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}>중압</div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center'}}>{pastData && pastData.middle_press !== undefined ? (pastData.middle_press).toLocaleString('ko-KR') : 0}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                    <Col xs='12' md='3' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none px-0' style={{alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}>저압</div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center'>
                                                                    <div style={{textAlign:'center'}}>{pastData && pastData.low_press !== undefined ? (pastData.low_press).toLocaleString('ko-KR') : 0}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                    <Col xs='12' md='4' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none px-0' style={{alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}>취사</div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center'>
                                                                    <div style={{textAlign:'center'}}>{pastData && pastData.cook !== undefined ? (pastData.cook).toLocaleString('ko-KR') : 0}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12}>
                                                <Row>
                                                    <Col xs='12' md='1'  className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3', borderRight:0}} >
                                                        <div style={{textAlign:'center'}}>금일</div>&nbsp;
                                                        <div className="essential_value"/>
                                                    </Col>
                                                    <Col xs='12' md='4' className='card_table col text start' style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Controller
                                                            name='middle_press'
                                                            control={control}
                                                            render={({ field: {onChange, value} }) => (
                                                                <Col lg='12' xs='12'className='card_table col text center border_none px-0' style={{alignItems:'center'}}>
                                                                    <Row style={{width:'100%'}}>
                                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                            <div style={{textAlign:'center', marginRight:'2%'}}>중압</div>
                                                                        </Col>
                                                                        <Col md='8' xs='8' className='px-0 ' >
                                                                            <Input 
                                                                                bsSize='sm' 
                                                                                invalid={errors.middle_press && true} 
                                                                                value={addCommaReturnValue(value) || ''} 
                                                                                maxLength={20} 
                                                                                onChange={(e) => {
                                                                                    AddCommaOnChange(e, onChange)
                                                                                    setMiddlePress(e.target.value)
                                                                            }}/>
                                                                            {errors.middle_press && <FormFeedback>{errors.middle_press.message}</FormFeedback>}
                                                                        </Col>
                                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                            <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            )}                                              
                                                        />
                                                    </Col>
                                                    <Col xs='12' md='3' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Controller
                                                            id='low_press'
                                                            name='low_press'
                                                            control={control}
                                                            render={({ field: {onChange, value} }) => (
                                                                <Col lg='12' xs='12'className='card_table col text center border_none px-0' style={{alignItems:'center'}}>
                                                                    <Row style={{width:'100%'}}>
                                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                            <div style={{textAlign:'center', marginRight:'2%'}}>저압</div>
                                                                        </Col>
                                                                        <Col md='8' xs='8' className='px-0' >
                                                                            <Input bsSize='sm' invalid={errors.low_press && true} value={addCommaReturnValue(value) || ''} 
                                                                                //{...value} 
                                                                                maxLength={20} 
                                                                                onChange={(e) => {
                                                                                    AddCommaOnChange(e, onChange)
                                                                                    setLowPress(e.target.value)
                                                                            }}/>
                                                                            {errors.low_press && <FormFeedback>{errors.low_press.message}</FormFeedback>}
                                                                        </Col>
                                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                            <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                        )}/>
                                                    </Col>
                                                    <Col xs='12' md='4' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Controller
                                                            id='cook'
                                                            name='cook'
                                                            control={control}
                                                            render={({ field: {onChange, value} }) => (
                                                                <Col lg='12' xs='12'className='card_table col text center border_none px-0' style={{alignItems:'center'}}>
                                                                    <Row style={{width:'100%'}}>
                                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                            <div style={{textAlign:'center', marginRight:'2%'}}>취사</div>
                                                                        </Col>
                                                                        <Col md='8' xs='8' className='px-0'>
                                                                            <Input 
                                                                                bsSize='sm' invalid={errors.cook && true} value={addCommaReturnValue(value) || ''} 
                                                                                maxLength={20} 
                                                                                onChange={(e) => {
                                                                                    AddCommaOnChange(e, onChange)
                                                                                    setCook(e.target.value)
                                                                            }}/>
                                                                            {errors.cook && <FormFeedback>{errors.cook.message}</FormFeedback>}
                                                                        </Col>
                                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                            <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                                        </Col>
                                                                        
                                                                    </Row>
                                                                </Col>

                                                        )}/>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12}>
                                                <Row>
                                                    <Col xs='12' md='1'  className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3', borderRight:0}} >
                                                        <div style={{textAlign:'center'}}>사용량</div>
                                                    </Col>
                                                    <Col xs='12' md='4' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none px-0' style={{alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}>중압</div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center'>
                                                                    <div style={{textAlign:'center'}}>{isNaN(middleUsed) ? 0 : middleUsed.toLocaleString('ko-KR')}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                    <Col xs='12' md='3' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none px-0' style={{alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}>저압</div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center'>
                                                                    <div style={{textAlign:'center'}}>{isNaN(lowUsed) ? 0 : lowUsed.toLocaleString('ko-KR')}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                    <Col xs='12' md='4' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none px-0' style={{alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}>취사</div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center'>
                                                                    <div style={{textAlign:'center'}}>{isNaN(cookUsed) ? 0 : cookUsed.toLocaleString('ko-KR')}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* 수도 */}
                                {/* <Row className='mx-0' style={{height:'100%', borderRight: '1px solid #B9B9C3'}}>
                                    <Col xs='12' md='1'  className='card_table col col_color text center'  style={{borderRight:0, borderBottom: '1px solid #B9B9C3'}} >
                                        <div style={{textAlign:'center'}}>수도</div>
                                    </Col>
                                    <Col xs='12' md='4' style={{height:'100%'}} >
                                        <Row>
                                            <Col xs='12' md='2'  className='card_table col col_color text center'  style={{borderRight: 0, borderBottom: '1px solid #B9B9C3'}} >
                                                <div style={{textAlign:'center'}}>전일</div>
                                            </Col>
                                            <Col xs='12' md='10' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginRight:'2%'}}></div>
                                                        </Col>
                                                        <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center'}}>{pastData && pastData.water_supply !== undefined ? (pastData.water_supply).toLocaleString('ko-KR') : 0}</div>
                                                        </Col>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='12' md='2'  className='card_table col col_color text center'  style={{borderRight:0, borderBottom: '1px solid #B9B9C3'}} >
                                                <div style={{textAlign:'center'}}>금일</div>&nbsp;
                                                <div className="essential_value"/>
                                            </Col>
                                            <Col xs='12' md='10' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                <Controller
                                                    id='water_supply'
                                                    name='water_supply'
                                                    control={control}
                                                    render={({ field: {onChange, value} }) => (
                                                        <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Input bsSize='sm' maxLength={30} invalid={errors.water_supply && true} value={addCommaReturnValue(value) || ''} 
                                                                    //{...value} 
                                                                    onChange={(e) => {
                                                                        AddCommaOnChange(e, onChange)
                                                                        setWaterSupply(e.target.value)
                                                                }}/>
                                                            {errors.water_supply && <FormFeedback>{errors.water_supply.message}</FormFeedback>}
                                                            </Row>
                                                        </Col>
                                                )}/>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='12' md='2'  className='card_table col col_color text center'  style={{borderRight:0, borderBottom: '1px solid #B9B9C3'}} >
                                                <div style={{textAlign:'center'}}>사용량</div>
                                            </Col>
                                            <Col xs='12' md='10' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginRight:'2%'}}></div>
                                                        </Col>
                                                        <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center'}}>{isNaN(waterSupplyUsed) ? 0 : waterSupplyUsed.toLocaleString('ko-KR')}</div>
                                                        </Col>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs='12' md='7' >   
                                        <Row style={{height:'100%'}}>
                                            <Col xs={12}>
                                                <Row style={{height:'100%'}}>
                                                    <Col xs='12' md='2'  className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3', borderRight:0}} >
                                                        <div style={{textAlign:'center'}}>가스</div>
                                                    </Col>
                                                    <Col xs='12' md='4' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}>중압</div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center'}}>{isNaN(middlePrice) ? 0 : middlePrice.toLocaleString('ko-KR')}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                    <Col xs='12' md='3' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}>저압</div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center'}}>{isNaN(lowPrice) ? 0 : lowPrice.toLocaleString('ko-KR')}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                    <Col xs='12' md='3' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}>취사</div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center'}}>
                                                                        {isNaN(cookPrice) ? 0 : cookPrice.toLocaleString('ko-KR')}
                                                                    </div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={12}>
                                                <Row style={{height:'100%'}}>
                                                    <Col xs='12' md='2'  className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3', borderRight:0}} >
                                                        <div style={{textAlign:'center'}}>금액</div>
                                                    </Col>
                                                    <Col xs='12' md='5' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}>단가</div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center'}}>{price.length > 0 ? (price[0].pressure).toLocaleString('ko-KR') : 0}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                    <Col xs='12' md='5' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}>취사</div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center'}}>{price.length > 0 ? (price[0].cooking).toLocaleString('ko-KR') : 0}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>                                   
                                    </Col>
                                </Row> */}
                                {/* 금액 */}
                                <Row className='mx-0' style={{borderRight: '1px solid #B9B9C3'}}>
                                    <Col xs='12' md='2'  className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3', borderRight:0}}>
                                        금액(단가)
                                    </Col>
                                    <Col xs='12' md='5' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                        <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                            <Row style={{width:'100%'}}>
                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                    <div style={{textAlign:'center', marginRight:'2%'}}>단가</div>
                                                </Col>
                                                <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                    <div style={{textAlign:'center'}}>{price.length > 0 ? (price[0].pressure).toLocaleString('ko-KR') : 0}</div>
                                                </Col>
                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                    <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Col>
                                    <Col xs='12' md='5' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                        <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                            <Row style={{width:'100%'}}>
                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                    <div style={{textAlign:'center', marginRight:'2%'}}>취사</div>
                                                </Col>
                                                <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                    <div style={{textAlign:'center'}}>{price.length > 0 ? (price[0].cooking).toLocaleString('ko-KR') : 0}</div>
                                                </Col>
                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                    <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Col>
                                </Row>
                                {/* 가스*금액 */}
                                <Row className='mx-0' style={{borderRight: '1px solid #B9B9C3'}}>
                                    <Col xs='12' md='2' className='card_table col col_color text center' style={{borderBottom: '1px solid #B9B9C3', borderRight:0}}>
                                        가스사용금액
                                    </Col>
                                    <Col xs='12' md='10'>
                                        <Row>
                                            <Col xs='12' md='4' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginRight:'2%'}}>중압</div>
                                                        </Col>
                                                        <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center'}}>{isNaN(middlePrice) ? 0 : middlePrice.toLocaleString('ko-KR')}</div>
                                                        </Col>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Col>
                                            <Col xs='12' md='4' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginRight:'2%'}}>저압</div>
                                                        </Col>
                                                        <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center'}}>{isNaN(lowPrice) ? 0 : lowPrice.toLocaleString('ko-KR')}</div>
                                                        </Col>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Col>
                                            <Col xs='12' md='4' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginRight:'2%'}}>취사</div>
                                                        </Col>
                                                        <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center'}}>
                                                                {isNaN(cookPrice) ? 0 : cookPrice.toLocaleString('ko-KR')}
                                                            </div>
                                                        </Col>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* 합계 */}
                                <Row className='mx-0' style={{borderRight: '1px solid #B9B9C3'}}>
                                    <Col xs='12' md='2' className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3', borderRight:0}}>
                                        합계
                                    </Col>
                                    <Col xs='12' md='10'>
                                        <Row>
                                            <Col xs='12' md='4' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginRight:'2%'}}>가동시간</div>
                                                        </Col>
                                                        <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center'}}>{resultCheckFunc(Number(removeFormat(boiler1)) + Number(removeFormat(boiler2)) + Number(removeFormat(boiler3)) + Number(removeFormat(boiler4))).toLocaleString('ko-KR')}</div>
                                                        </Col>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Col>
                                            <Col xs='12' md='4' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginRight:'2%'}}>가스 사용량</div>
                                                        </Col>
                                                        <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center'}}>{resultCheckFunc(Number(removeFormat(middlePress)) + Number(removeFormat(lowPress))).toLocaleString('ko-KR') || 0}</div>
                                                        </Col>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Col>
                                            <Col xs='12' md='4' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginRight:'2%'}}>취사</div>
                                                        </Col>
                                                        <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center'}}>{resultCheckFunc(cookUsed).toLocaleString('ko-KR')}</div>
                                                        </Col>
                                                        <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                            <div style={{textAlign:'center', marginLeft:'2%'}}>{'Nm\xB3'}</div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* 수도 */}
                                <Row className='mx-0' style={{borderRight: '1px solid #B9B9C3'}}>
                                    <Col xs='12' md='2'  className='card_table col col_color text center'  style={{borderRight:0, borderBottom: '1px solid #B9B9C3'}} >
                                        <div style={{textAlign:'center'}}>수도</div>
                                    </Col>
                                    <Col xs='12' md='10' style={{height:'100%'}} >
                                        <Row>
                                            <Col xs='12' md='4'>
                                                <Row>
                                                    <Col xs='12' md='12'  className='card_table col col_color text center'  style={{borderRight: 0, borderBottom: '1px solid #B9B9C3'}} >
                                                        <div style={{textAlign:'center'}}>전일</div>
                                                    </Col>
                                                    <Col xs='12' md='12' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center', minHeight:'3.4rem'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}></div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center'}}>{pastData && pastData.water_supply !== undefined ? (pastData.water_supply).toLocaleString('ko-KR') : 0}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs='12' md='4'>
                                                <Row>
                                                    <Col xs='12' md='12'  className='card_table col col_color text center'  style={{borderRight:0, borderBottom: '1px solid #B9B9C3'}} >
                                                        <div style={{textAlign:'center'}}>금일</div>&nbsp;
                                                        <div className="essential_value"/>
                                                    </Col>
                                                    <Col xs='12' md='12' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Controller
                                                            id='water_supply'
                                                            name='water_supply'
                                                            control={control}
                                                            render={({ field: {onChange, value} }) => (
                                                                <Col lg='12' xs='12'className='card_table col text center border_none px-0' style={{flexDirection:'column', alignItems:'center', minHeight:'3.4rem'}}>
                                                                    <Row style={{width:'100%'}}>
                                                                        <Input bsSize='sm' maxLength={20} invalid={errors.water_supply && true} value={addCommaReturnValue(value) || ''} 
                                                                            onChange={(e) => {
                                                                                AddCommaOnChange(e, onChange)
                                                                                setWaterSupply(e.target.value)
                                                                        }}/>
                                                                    {errors.water_supply && <FormFeedback>{errors.water_supply.message}</FormFeedback>}
                                                                    </Row>
                                                                </Col>
                                                        )}/>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs='12' md='4'>
                                                <Row>
                                                    <Col xs='12' md='12'  className='card_table col col_color text center'  style={{borderRight:0, borderBottom: '1px solid #B9B9C3'}} >
                                                        <div style={{textAlign:'center'}}>사용량</div>
                                                    </Col>
                                                    <Col xs='12' md='12' className='card_table col text start '  style={{borderBottom: '1px solid #B9B9C3', borderLeft: '1px solid #B9B9C3', justifyContent:'space-between'}}>
                                                        <Col lg='12' xs='12'className='card_table col text center border_none p-0 ' style={{alignItems:'center', minHeight:'3.4rem'}}>
                                                            <Row style={{width:'100%'}}>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginRight:'2%'}}></div>
                                                                </Col>
                                                                <Col md='8' xs='8' className='px-0 card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center'}}>{isNaN(waterSupplyUsed) ? 0 : waterSupplyUsed.toLocaleString('ko-KR')}</div>
                                                                </Col>
                                                                <Col md='2' xs='2' className='card_table col text center' style={{display:'flex', alignSelf:'center'}}>
                                                                    <div style={{textAlign:'center', marginLeft:'2%'}}></div>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                {/* 근무자 */}
                                <Row className='mx-0' style={{borderRight: '1px solid #B9B9C3'}}>
                                    <Col xs='12' md='2'  className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3', borderRight:0}}>
                                        근무자
                                    </Col>
                                    <Col xs='12' md='10' className='card_table col text start' style={{borderBottom: '1px solid #B9B9C3', justifyContent:'space-between', borderLeft: '1px solid #B9B9C3'}}>
                                        <Select
                                            isMulti
                                            id='guests'
                                            className='react-select'
                                            classNamePrefix='select'
                                            isClearable={false}
                                            placeholder='직원을 선택해주세요.'
                                            options={partners}
                                            theme={selectThemeColors}
                                            value={guests.length ? [...guests] : null}
                                            onChange={(e, event) => handleWorkers(e, event)}
                                            menuPortalTarget={document.body} 
                                            styles={{ 
                                                width:'100%', 
                                                menuPortal: base => ({ ...base, zIndex: 9999})
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                                <Fragment >
                                    <Button hidden={checkOnlyView(loginAuth, ENERGY_GAS_REGISTER, 'available_create')}
                                        type='submit' color='primary'>저장</Button>
                                </Fragment>
                            </CardFooter>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default SolidForm