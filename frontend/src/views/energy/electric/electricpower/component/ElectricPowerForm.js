import { 
    Row, Col, Input, CardHeader, CardBody, CardTitle, 
    Button, Form, Table, FormFeedback
} from "reactstrap"
import Cookies from 'universal-cookie'
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import { Controller, useForm } from "react-hook-form"
import Flatpickr from "react-flatpickr"
import Select from 'react-select'
import { 
    getTableData, 
    setStringDate, 
    setValueFormat,
    axiosPostPut,
    getObjectKeyCheck,
    axiosSweetAlert
} from '@utils' // setValueFormatTemp
import * as moment from 'moment'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from "react-router-dom"

import { 
    dayDefaultValues, 
    validationSchema,
    electricFunc,
    initDayDefaultValues
} from "../../data"

import { 
    API_ENERGY_BASIC_MAGNIFICATION_BUILDINGS,
    API_ENERGY_ELECTRIC_SHOW,
    API_ENERGY_ELECTRIC_REG_MOD,
    ROUTE_ENERGY_CODE
} from "@src/constants"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { AddCommaOnChange, checkOnlyView, getCommaDel } from "../../../../../utility/Utils"
import { ENERGY_ELECTRIC_REGISTER } from "../../../../../constants/CodeList"
import { Korean } from "flatpickr/dist/l10n/ko.js"

// //첫 랜더링에서 effect 효과 막기
const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false)
  
    useEffect(() => {
      if (didMount.current) func()
      else didMount.current = true
    }, deps)
}// useDidMountEffect end

// 에너지 관리 전력 사용량 등록
const ElectricPowerForm = () => {
    // csrf
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)

    // nav
    const navigate = useNavigate()

    // moment
	const now = moment().format('YYYY-MM-DD')

    // dataset state
    const [electricDayData, setElectricDayData] = useState([])

    // date state
    const [dayElectric, setDayElectric] = useState(now)

    // building state
    const [selectBuild, setselectBuild] = useState({label: '선택', value:''})
    const [buildElectric, setBuildElectric] = useState([])

    // codeError
    const [codeError, setCodeError] = useState(false)

    const [submitResult, setSubmitResult] = useState(false)

    // useform을 통해서 validation 구현
    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        watch,
        trigger,
		formState: { errors }
    } = useForm({
        defaultValues : dayDefaultValues,
        resolver : yupResolver(validationSchema)
    })

    // property 위한 쿠키
    const cookies = new Cookies()

    // 받아온 데이터가 갱신될때 마다 새로 input에 입력
    useDidMountEffect(() => {
        setValueFormat(initDayDefaultValues, control._formValues, setValue, null)
        for (const dataSet of electricDayData) {
            setValueFormat(dataSet, control._formValues, setValue, null)
        }
        setValue('into_create_datetime', dayElectric)
	}, [electricDayData])

    // 지정된 input에 따라 계산식 작동
    useDidMountEffect(() => {
        electricFunc(setValue, getValues)
	}, [
        watch([
                'valid_middle_load', 
                'valid_max_load', 
                'valid_min_load', 
                'invalid_middle_load',
                'invalid_max_load',
                'its_middle_load',
                'its_min_load',
                'max_electric_power',
                'generate_capacity',
                'operation_time',
                'fuel_consumption'
            ])
        ])
    // useDidMountEffect end

    // select 선택시 데이터를 새로 받아옴
    useDidMountEffect(() => {
        const buildCheck = getObjectKeyCheck(selectBuild, 'value')
        if (buildCheck === -1 || buildCheck === '') {
            axiosSweetAlert(``, `${buildCheck === -1 ? '건물에 배율을 등록해주세요.' : '등록된 배율이 없습니다.'} <br/>기본 정보에서 배율을 등록해주세요.`, 'warning', 'center', setCodeError)
            return
        }//if end

        if (selectBuild && Object.keys(selectBuild).includes('value')) {
            const param = {
                property : cookies.get('property').value,
                targetDate : dayElectric,
                building : (selectBuild.value ? selectBuild.value : "")
            }
            // 차트에 들어갈 데이터 배열을 받아옴
            getTableData(API_ENERGY_ELECTRIC_SHOW, param, setElectricDayData)
        }// if end
    }, [dayElectric, selectBuild, buildElectric])

    // 화면 랜더링시 라벨과 사업소를 보내서 데이터를 받아옴
    useEffect(() => {
        const param = {
            prop_id : cookies.get('property').value
        }
        axios.get(API_ENERGY_BASIC_MAGNIFICATION_BUILDINGS, {
            params : param 
        }).then(
            (res) => {
                const tempList = res.data
                if (Array.isArray(tempList)) { // 배열인지 체크
                    tempList.shift() // shift
                    setBuildElectric(tempList)
                    setselectBuild(tempList[0])
                }
            }
        )
	}, [])

    // input value를 서버로 보내서 저장함
    const onSubmit = data => {

        // form data
        const formData = new FormData()

        formData.append('into_create_datetime', data.into_create_datetime) // 일반 

        formData.append('valid_middle_load', getCommaDel(data.valid_middle_load)) // 일반 일
        formData.append('valid_max_load', getCommaDel(data.valid_max_load)) // 일반 첨
        formData.append('valid_min_load', getCommaDel(data.valid_min_load)) // 일반 경

        formData.append('middle_today_usage', getCommaDel(data.middle_today_usage)) // 일반 일 사용량
        formData.append('max_today_usage', getCommaDel(data.max_today_usage)) // 일반 첨 사용량
        formData.append('min_today_usage', getCommaDel(data.min_today_usage)) // 일반 경 사용량

        formData.append('invalid_middle_load', getCommaDel(data.invalid_middle_load)) // 무효 일
        formData.append('invalid_max_load', getCommaDel(data.invalid_max_load)) // 무효 첨

        formData.append('invalid_middle_today_usage', getCommaDel(data.invalid_middle_today_usage)) // 무효 일 사용량
        formData.append('invalid_max_today_usage', getCommaDel(data.invalid_max_today_usage)) // 무효 첨 사용량

        formData.append('generate_capacity', getCommaDel(data.generate_capacity)) // 발전량
        formData.append('operation_time', getCommaDel(data.operation_time)) // 가동시간
        formData.append('fuel_consumption', getCommaDel(data.fuel_consumption)) // 연료 소모량

        formData.append('max_electric_power', getCommaDel(data.max_electric_power)) // 최대 전력

        formData.append('its_middle_load', getCommaDel(data.its_middle_load)) // 빙축열 일 
        formData.append('its_min_load', getCommaDel(data.its_min_load)) // 빙축열 경

        formData.append('its_middle_today_usage', getCommaDel(data.its_middle_today_usage)) // 빙축열 일 사용량
        formData.append('its_max_today_usage', getCommaDel(data.its_max_today_usage)) // 빙축열 경 사용량

        formData.append('middle_factor', getCommaDel(data.middle_factor)) // 역률 경
        formData.append('max_factor', getCommaDel(data.max_factor)) // 역률 첨
        formData.append('total_factor', getCommaDel(data.total_factor)) // 역률 종합
        
        //add
        formData.append('month_total_factor', getCommaDel(data.month_total_factor))
        formData.append('avg_electric_power', getCommaDel(data.avg_electric_power))
        formData.append('total_load_rate', getCommaDel(data.total_load_rate))
        formData.append('year_generate_capacity', getCommaDel(data.year_generate_capacity))
        formData.append('today_total_usage_list', getCommaDel(data.today_total_usage))
        formData.append('month_total_usage_list', getCommaDel(data.month_total_usage_input))

        formData.append('its_month_total_usage_list', getCommaDel(data.its_month_total_usage_input))
        formData.append('its_year_total_usage_list', getCommaDel(data.its_year_total_usage_input))

        formData.append('code_id', data.code_id)

        // id 가 존재하면 수정
        if (data.id && data.id > 0) {
            formData.append('id', data.id)
            axiosPostPut('modify', '전력', API_ENERGY_ELECTRIC_REG_MOD, formData)
            return
        } // if end

		axiosPostPut('register', '전력', API_ENERGY_ELECTRIC_REG_MOD, formData, setSubmitResult)
	} //  onSubmit end

    // 등록된 배율이 없으면 이동
    useEffect(() => {
        if (codeError) {
            navigate(`${ROUTE_ENERGY_CODE}/magnification`)
        }
    }, [codeError])

    useEffect(() => {
        if (submitResult) {
            if (selectBuild && Object.keys(selectBuild).includes('value')) {
                const param = {
                    property : cookies.get('property').value,
                    targetDate : dayElectric,
                    building : (selectBuild.value ? selectBuild.value : "")
                }
                // 차트에 들어갈 데이터 배열을 받아옴
                getTableData(API_ENERGY_ELECTRIC_SHOW, param, setElectricDayData)
            }// if end
        }
    }, [submitResult])

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className='pb-1'>
            <CardTitle>
                전력 사용량 및 발전량 관리
            </CardTitle>
            <Row>
                <Col xs={12} lg={1} className="mt-1 mx-0 pe-0 electric-label-7">일자:</Col>
                <Col xs={12} lg={3}>
                    <Controller
                        id='picker'
                        name='picker'
                        control={control}
                        render={({field : {onChange, value}}) => <Flatpickr
                            id='single-picker'
                            className='mt-1 form-control'
                            value={value}
                            onChange={ date => { 
                                if (date.length === 1) {
                                    const dateTemp = setStringDate(date)
                                    setDayElectric(dateTemp[0])
                                    onChange(dateTemp)
                                }
                            }}
                            options={{
                                mode: 'single',
                                ariaDateFormat:'Y-m-d',
                                maxDate: now,
                                locale: Korean
                            }}
                        />}
                    />
                </Col>
                <Col xs={12} lg={1} className="mt-1 mx-0 pe-0 electric-label-7">건물:</Col>
                <Col xs={12} lg={4}>
                    <Controller
                        id='building'
                        name='building'
                        control={control}
                        render={({field : {onChange}}) => <Select
                            className="react-select mt-1"
                            classNamePrefix={'select'}
                            value={selectBuild}
                            onChange={(e) => {
                                onChange(e)
                                setselectBuild(e)
                            }}
                            options={buildElectric}
                        />}
                    />
                </Col>
                <Col xs={12} lg={3}>
                    <Button hidden={checkOnlyView(loginAuth, ENERGY_ELECTRIC_REGISTER, 'available_create')}
                        className="mt-1" type="submit" color="primary">저장</Button>
                </Col>
            </Row>
        </CardHeader>
        <CardBody className='pt-0'>
{/* 일반 전력 테이블 */}
            <Table responsive className="my-1 electric-table">
                <tbody>
                    <tr className="head">
                        <th colSpan={6} style={{fontWeight:'800'}}>일 전력 사용량 및 발전량 등록</th>
                    </tr>
                    <tr className="top mid">
                        <th className="label">입력일자</th>
                        <td className="value">
                            <Controller
                                id='into_create_datetime'
                                name='into_create_datetime'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <th className="label ">최종입력일자</th>
                        <td className="value">
                            <Controller
                                id='before_create_datetime'
                                name='before_create_datetime'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <th className="label ">적용배율</th>
                        <td className="value">
                            <Controller
                                id='apply_rate'
                                name='apply_rate'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                    </tr>
                    <tr className="mid">
                        <th className="label">구분</th>
                        <th className="label">번호</th>
                        <th className="label">전일지침</th>
                        <th className="label">금일지침</th>
                        <th className="label">금일사용량</th>
                        <th className="label">월누계</th>
                    </tr>
{/* 유효 전력량 */}
                    <tr>
                        <th rowSpan={4} className="label">유효전력량<br/>(KWH)</th>
                    </tr>
                    <tr>
                        <td className="label">{"04(일)"}</td>
                        <td className="value">
                            <Controller
                                id='before_valid_middle_load'
                                name='before_valid_middle_load'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toLocaleString('ko-KR') : value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='valid_middle_load'
                                name='valid_middle_load'
                                control={control}
                                render={({field: {onChange, value}}) => <Input 
                                    type="text"
                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                    invalid={errors.valid_middle_load && true}
                                    onChange={e => {
                                        AddCommaOnChange(e, onChange)
                                        trigger('valid_middle_load')
                                    }}
                                    />}
                            />
                            {errors.valid_middle_load && <FormFeedback>{errors.valid_middle_load.message}</FormFeedback>}
                        </td>
                        <td className="value">
                            <Controller
                                id='middle_today_usage'
                                name='middle_today_usage'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='middle_month_total_input'
                                name='middle_month_total_input'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="label">{"05(첨)"}</td>
                        <td className="value">
                            <Controller
                                id='before_valid_max_load'
                                name='before_valid_max_load'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toLocaleString('ko-KR') : value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='valid_max_load'
                                name='valid_max_load'
                                control={control}
                                render={({field: {onChange, value}}) => <Input 
                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                    invalid={errors.valid_max_load && true}
                                    onChange={e => {
                                        AddCommaOnChange(e, onChange)
                                        trigger('valid_max_load')
                                    }}
                                    />}
                            />
                            {errors.valid_max_load && <FormFeedback>{errors.valid_max_load.message}</FormFeedback>}
                        </td>
                        <td className="value">
                            <Controller
                                id='max_today_usage'
                                name='max_today_usage'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='max_month_total_input'
                                name='max_month_total_input'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                    </tr>
                    <tr className="mid">
                        <td className="label">{"06(경)"}</td>
                        <td className="value">
                            <Controller
                                id='before_valid_min_load'
                                name='before_valid_min_load'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toLocaleString('ko-KR') : value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='valid_min_load'
                                name='valid_min_load'
                                control={control}
                                render={({field: {onChange, value}}) => <Input 
                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                    invalid={errors.valid_min_load && true}
                                    onChange={e => {
                                        AddCommaOnChange(e, onChange)
                                        trigger('valid_min_load')
                                    }}
                                    />}
                            />
                            {errors.valid_min_load && <FormFeedback>{errors.valid_min_load.message}</FormFeedback>}
                        </td>
                        <td className="value">
                            <Controller
                                id='min_today_usage'
                                name='min_today_usage'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='min_month_total_input'
                                name='min_month_total_input'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                    </tr>
{/* 무효 전력량 */}
                    <tr>
                        <th rowSpan={3} className="label">무효전력량<br/>(KVARH)</th>
                    </tr>
                    <tr>
                        <th className="label">{"07(일)"}</th>
                        <td className="value">
                            <Controller
                                id='before_invalid_middle_load'
                                name='before_invalid_middle_load'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toLocaleString('ko-KR') : value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='invalid_middle_load'
                                name='invalid_middle_load'
                                control={control}
                                render={({field: {onChange, value}}) => <Input 
                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                    invalid={errors.invalid_middle_load && true}
                                    onChange={e => {
                                        AddCommaOnChange(e, onChange)
                                        trigger('invalid_middle_load')
                                    }}
                                    />}
                            />
                            {errors.invalid_middle_load && <FormFeedback>{errors.invalid_middle_load.message}</FormFeedback>}
                        </td>
                        <td className="value">
                            <Controller
                                id='invalid_middle_today_usage'
                                name='invalid_middle_today_usage'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='invalid_middle_month_total_input'
                                name='invalid_middle_month_total_input'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                    </tr>
                    <tr className="mid">
                        <th className="label">{"08(첨)"}</th>
                        <td className="value">
                            <Controller
                                id='before_invalid_max_load'
                                name='before_invalid_max_load'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toLocaleString('ko-KR') : value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='invalid_max_load'
                                name='invalid_max_load'
                                control={control}
                                render={({field: {onChange, value}}) => <Input 
                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                    invalid={errors.invalid_max_load && true}
                                    onChange={e => {
                                        AddCommaOnChange(e, onChange)
                                        trigger('invalid_max_load')
                                    }}
                                    />}
                            />
                            {errors.invalid_max_load && <FormFeedback>{errors.invalid_max_load.message}</FormFeedback>}
                        </td>
                        <td className="value">
                            <Controller
                                id='invalid_max_today_usage'
                                name='invalid_max_today_usage'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='invalid_max_month_total_input'
                                name='invalid_max_month_total_input'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                    </tr>
{/* 역률 */}
                    <tr>
                        <th rowSpan={5} className="label">역률<br/>{'(PF)'}</th>
                    </tr>
                    <tr>
                        <th className="label">{'(일)'}</th>
                        <td className="value">
                            <Controller
                                id='middle_factor'
                                name='middle_factor'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toFixed(2) : Number(value).toFixed(2)}</div>}
                            />
                        </td>
                        <td rowSpan={2} className="label mid">{"최대전력"}<br/>{"(W)"}</td>
                        <td rowSpan={2} className="value mid">
                            <Controller
                                id='max_electric_power'
                                name='max_electric_power'
                                control={control}
                                render={({field: {onChange, value}}) => <Input 
                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                    invalid={errors.max_electric_power && true}
                                    onChange={e => {
                                        AddCommaOnChange(e, onChange)
                                        trigger('max_electric_power')
                                    }}
                                    />}
                            />
                            {errors.max_electric_power && <FormFeedback>{errors.max_electric_power.message}</FormFeedback>}
                        </td>
                        <td rowSpan={2} className="label mid">{"부하율"}<br/>{"(%)"}</td>
                    </tr>
                    <tr>
                        <th className="label">{'(첨)'}</th>
                        <td className="value">
                            <Controller
                                id='max_factor'
                                name='max_factor'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toFixed(2) : Number(value).toFixed(2)}</div>}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th className="label">{'(종합)'}</th>
                        <td className="value">
                            <Controller
                                id='total_factor'
                                name='total_factor'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toFixed(2) : Number(value).toFixed(2)}</div>}
                            />
                        </td>
                        <td rowSpan={2} className="label">{"평균전력"}<br/>{"(W)"}</td>
                        <td rowSpan={2} className="value">
                            <Controller
                                id='avg_electric_power'
                                name='avg_electric_power'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <td rowSpan={2} className="value">
                            <Controller
                                id='total_load_rate'
                                name='total_load_rate'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toFixed(2) : Number(getCommaDel(value)).toFixed(2)}</div>}
                            />
                        </td>
                    </tr>
                    <tr className="mid">
                        <th className="label">{'종합월누계'}</th>
                        <td className="value">
                            <Controller
                                id='month_total_factor'
                                name='month_total_factor'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toFixed(2) : Number(value).toFixed(2)}</div>}
                            />
                        </td>
                    </tr>
{/* 금일 총 사용량 */}
                    <tr className="bottom">
                        <th className="label">금일총사용량</th>
                        <td className="value">
                            <Controller
                                id='today_total_usage'
                                name='today_total_usage'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <th className="label">총사용량월누계</th>
                        <td className="value">
                            <Controller
                                id='month_total_usage_input'
                                name='month_total_usage_input'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <th className="label">총사용량년누계</th>
                        <td className="value">
                            <Controller
                                id='year_total_usage_input'
                                name='year_total_usage_input'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                    </tr>
                </tbody>
            </Table>
{/* 빙축열 테이블 */}
            <Table responsive className="my-1 electric-table">
                <tbody>
                    {/* 빙축열 */}
                    <tr className="head mid">
                        <th colSpan={5}>빙축열 전력 사용량 등록</th>
                        <th className="value">
                            <Controller
                                id='its_apply_rate'
                                name='its_apply_rate'
                                control={control}
                                render={({field: {value}}) => <div style={{fontSize:'14px'}}>적용배율 : {value}</div>}
                            />
                        </th>
                    </tr>
                    <tr className="mid">
                        <th className="label">구분</th>
                        <th className="label">번호</th>
                        <th className="label">전일지침</th>
                        <th className="label">금일지침</th>
                        <th className="label">금일사용량</th>
                        <th className="label">월누계</th>
                    </tr>
                    <tr>
                        <td rowSpan={2} className="label">
                            유효전력량<br/>{"(KWH)"}
                        </td>
                        <td className="label">{"04(일)"}</td>
                        <td className="value">
                            <Controller
                                id='before_its_middle_load'
                                name='before_its_middle_load'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toLocaleString('ko-KR') : value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='its_middle_load'
                                name='its_middle_load'
                                control={control}
                                render={({field: {onChange, value}}) => <Input 
                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                    invalid={errors.its_middle_load && true}
                                    onChange={e => {
                                        AddCommaOnChange(e, onChange)
                                        trigger('its_middle_load')
                                    }}
                                    />}
                            />
                            {errors.its_middle_load && <FormFeedback>{errors.its_middle_load.message}</FormFeedback>}
                        </td>
                        <td className="value">
                            <Controller
                                id='its_middle_today_usage'
                                name='its_middle_today_usage'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='its_middle_month_total_input'
                                name='its_middle_month_total_input'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                    </tr>
                    <tr className="mid">
                        <td className="label">{"06(경)"}</td>
                        <td className="value">
                            <Controller
                                id='before_its_min_load'
                                name='before_its_min_load'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toLocaleString('ko-KR') : value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='its_min_load'
                                name='its_min_load'
                                control={control}
                                render={({field: {onChange, value}}) => <Input 
                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                    invalid={errors.its_min_load && true}
                                    onChange={e => {
                                        AddCommaOnChange(e, onChange)
                                        trigger('its_min_load')
                                    }}
                                    />}
                            />
                            {errors.its_min_load && <FormFeedback>{errors.its_min_load.message}</FormFeedback>}
                        </td>
                        <td className="value">
                            <Controller
                                id='its_max_today_usage'
                                name='its_max_today_usage'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <td className="value">
                            <Controller
                                id='its_max_month_total_input'
                                name='its_max_month_total_input'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                    </tr>
                    <tr className="bottom">
                        <th className="label">금일총사용량</th>
                        <td className="value">
                            <Controller
                                id='its_today_total_usage'
                                name='its_today_total_usage'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <th className="label">총사용량월누계</th>
                        <td className="value">
                            <Controller
                                id='its_month_total_usage_input'
                                name='its_month_total_usage_input'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                        <th className="label">총사용량년누계</th>
                        <td className="value">
                            <Controller
                                id='its_year_total_usage_input'
                                name='its_year_total_usage_input'
                                control={control}
                                render={({field: {value}}) => <div>{value}</div>}
                            />
                        </td>
                    </tr>
                </tbody>
            </Table>
{/* 발전량 테이블 */}
            <Table responsive className="my-1 electric-table">
                <tbody>
                    <tr className="head">
                        <th colSpan={7} className="mid">발전량 등록</th>
                    </tr>
                    <tr className="mid">
                        <th className="label">발전량</th>
                        <td className="value">
                            <Controller
                                id='generate_capacity'
                                name='generate_capacity'
                                control={control}
                                render={({field: {onChange, value}}) => <Input 
                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                    invalid={errors.generate_capacity && true}
                                    onChange={e => {
                                        AddCommaOnChange(e, onChange)
                                        trigger('generate_capacity')
                                    }}
                                />}
                            />
                            {errors.generate_capacity && <FormFeedback>{errors.generate_capacity.message}</FormFeedback>}
                        </td>
                        <th className="label">가동시간</th>
                        <td className="value">
                            <Controller
                                id='operation_time'
                                name='operation_time'
                                control={control}
                                render={({field: {onChange, value}}) => <Input 
                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                    invalid={errors.operation_time && true}
                                    onChange={e => {
                                        AddCommaOnChange(e, onChange)
                                        trigger('operation_time')
                                    }}
                                />}
                            />
                            {errors.operation_time && <FormFeedback>{errors.operation_time.message}</FormFeedback>}
                        </td>
                        <th className="label">연료소모량</th>
                        <td className="value">
                            <Controller
                                id='fuel_consumption'
                                name='fuel_consumption'
                                control={control}
                                render={({field: {onChange, value}}) => <Input 
                                    value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                    invalid={errors.fuel_consumption && true}
                                    onChange={e => {
                                        AddCommaOnChange(e, onChange)
                                        trigger('fuel_consumption')
                                    }}
                                />}
                            />
                            {errors.fuel_consumption && <FormFeedback>{errors.fuel_consumption.message}</FormFeedback>}
                        </td>
                    </tr>
                    <tr>
                        <th className="label">발전량년누계</th>
                        <td className="value">
                            <Controller
                                id='year_generate_capacity_input'
                                name='year_generate_capacity_input'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toLocaleString('ko-KR') : value}</div>}
                            />
                        </td>
                        <th className="label">가동시간년누계</th>
                        <td className="value">
                            <Controller
                                id='year_operation_time_input'
                                name='year_operation_time_input'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toLocaleString('ko-KR') : value}</div>}
                            />
                        </td>
                        <th className="label">연료소모량년누계</th>
                        <td className="value">
                            <Controller
                                id='year_fuel_consumption_input'
                                name='year_fuel_consumption_input'
                                control={control}
                                render={({field: {value}}) => <div>{typeof value === 'number' ? value.toLocaleString('ko-KR') : value}</div>}
                            />
                        </td>
                    </tr>
                </tbody>
            </Table>
        </CardBody>
    </Form>
    )
}
export default ElectricPowerForm
