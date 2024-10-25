import * as yup from 'yup'
import * as moment from 'moment'
import { getCommaDel, primaryHeaderColor, resultCheckFunc } from '../../../utility/Utils'

const now = moment().format('YYYY-MM-DD')

// 전력 초기 변수값
export const dayDefaultValues = {
    picker: now, // 검색 선택일
    building : {value : 0, label : '건물 선택'}, // 검색 빌딩
    into_create_datetime : '', // 생성일
    before_create_datetime : '', // 최종 입력 일자
    apply_rate : 1.0, // 일반 적용 배율
    its_apply_rate : 1.0, // 빙축열 적용 비율
    before_id : 0,
    id : 0,
    code_id: '',
    year: 0,
    month: 0,
    day: 0,

    // 전일
    before_valid_middle_load : 0.0, // 전일 지침 일
    before_valid_max_load : 0.0, // 전일 지침 첨
    before_valid_min_load : 0.0, // 전일 지침 경

    before_invalid_middle_load : 0.0, // 무효 전일 지침 일
    before_invalid_max_load : 0.0, // 무효 전일 지침 첨

    before_its_middle_load : 0.0, // 빙축열 전일 지침 일
    before_its_min_load : 0.0, // 빙축열 전일 지침 경
    
    // 금일
    valid_middle_load : 0.0, // 금일 지침 일
    valid_max_load : 0.0, // 금일 지침 첨
    valid_min_load : 0.0, // 금일 지침 경

    invalid_middle_load : 0.0, // 무효 금일 지침 일
    invalid_max_load : 0.0, // 무효 금일 지침 첨

    its_middle_load : 0.0, // 빙축열 금일 지침 일
    its_min_load : 0.0, // 빙축열 금일 지침 경

    // 발전량
    generate_capacity : 0.0, // 발전량
    operation_time : 0.0, // 가동시간
    fuel_consumption : 0.0, // 연료소모량

    max_electric_power : 0.0, // 최대 전력

    // 계산
    middle_today_usage : 0.0, // 금일 사용량 일
    max_today_usage : 0.0, // 금일 사용량 첨
    min_today_usage : 0.0, // 금일 사용량 경

    invalid_middle_today_usage : 0.0, // 무효 금일 사용량 일
    invalid_max_today_usage : 0.0, // 무효 금일 사용량 첨

    middle_month_total_input : 0.0, // 월 누적 사용량 일
    max_month_total_input : 0.0, // 월 누적 사용량 첨
    min_month_total_input : 0.0, // 월 누적 사용량 경

    middle_month_total : 0.0, // 월 누적 사용량 일 backend
    max_month_total : 0.0, // 월 누적 사용량 첨 backend
    min_month_total : 0.0, // 월 누적 사용량 경 backend

    invalid_middle_month_total_input : 0.0, // 무효 월 누계 일
    invalid_max_month_total_input : 0.0, // 무효 월 누계 경

    invalid_middle_month_total : 0.0, // 무효 월 누계 일 backend
    invalid_max_month_total : 0.0, // 무효 월 누계 경 backend

    middle_factor : 0.0, // 역률 일
    max_factor : 0.0, // 역률 첨
    total_factor : 0.0, // 역률 집계

    month_total_factor : 0.0, // 역률 월 집계

    avg_electric_power : 0.0, // 평균 전력
    total_load_rate : 0.0, // 부하율

    today_total_usage : 0.0, // 금일 총 사용량

    month_total_usage_input : 0.0, // 총 사용량 월 누계
    year_total_usage_input : 0.0, //  총 사옹량 년 누계

    month_total_usage : 0.0, // 총 사용량 월 누계 backend
    year_total_usage : 0.0, //  총 사옹량 년 누계 backend

    its_middle_today_usage : 0.0, // 빙축열 금일 사용량 일
    its_max_today_usage : 0.0, // 빙축열 금일 사용량 경

    its_middle_month_total_input : 0.0, // 월 누적 사용량 일
    its_max_month_total_input : 0.0, // 월 누적 사용량 경

    its_middle_month_total : 0.0, // 월 누적 사용량 일 backend
    its_max_month_total : 0.0, // 월 누적 사용량 경 backend

    its_today_total_usage : 0.0, // 빙축열 금일총사용량

    its_month_total_usage_input : 0.0, // 빙축열 총사용량 월 누계
    its_year_total_usage_input : 0.0, // 빙축열 총사용량 년 누계

    its_month_total_usage : 0.0, // 빙축열 총사용량 월 누계 backend
    its_year_total_usage : 0.0, // 빙축열 총사용량 년 누계 backend

    year_generate_capacity_input : 0.0, // 발전량 년 누계
    year_operation_time_input : 0.0, // 가동시간 년 누계
    year_fuel_consumption_input : 0.0, // 연료소모량 년 누계

    year_generate_capacity : 0.0, // 발전량 년 누계 backend
    year_operation_time : 0.0, // 가동시간 년 누계 backend
    year_fuel_consumption : 0.0 // 연료소모량 년 누계 backend
}

// 데이터 새로 받을때 리셋용
export const initDayDefaultValues = {
    apply_rate : 1.0, // 일반 적용 배율
    its_apply_rate : 1.0, // 빙축열 적용 비율
    before_id : 0,
    id : 0,
    code_id: '',
    before_create_datetime : '', // 최종 입력 일자
    year: 0,
    month: 0,
    day: 0,
    
    // 전일
    before_valid_middle_load : 0.0, // 전일 지침 일
    before_valid_max_load : 0.0, // 전일 지침 첨
    before_valid_min_load : 0.0, // 전일 지침 경

    before_invalid_middle_load : 0.0, // 무효 전일 지침 일
    before_invalid_max_load : 0.0, // 무효 전일 지침 첨

    before_its_middle_load : 0.0, // 빙축열 전일 지침 일
    before_its_min_load : 0.0, // 빙축열 전일 지침 경
    
    // 금일
    valid_middle_load : 0.0, // 금일 지침 일
    valid_max_load : 0.0, // 금일 지침 첨
    valid_min_load : 0.0, // 금일 지침 경

    invalid_middle_load : 0.0, // 무효 금일 지침 일
    invalid_max_load : 0.0, // 무효 금일 지침 첨

    its_middle_load : 0.0, // 빙축열 금일 지침 일
    its_min_load : 0.0, // 빙축열 금일 지침 경

    // 발전량
    generate_capacity : 0.0, // 발전량
    operation_time : 0.0, // 가동시간
    fuel_consumption : 0.0, // 연료소모량

    max_electric_power : 0.0, // 최대 전력

    // 계산
    middle_today_usage : 0.0, // 금일 사용량 일
    max_today_usage : 0.0, // 금일 사용량 첨
    min_today_usage : 0.0, // 금일 사용량 경

    invalid_middle_today_usage : 0.0, // 무효 금일 사용량 일
    invalid_max_today_usage : 0.0, // 무효 금일 사용량 첨

    middle_month_total_input : 0.0, // 월 누적 사용량 일
    max_month_total_input : 0.0, // 월 누적 사용량 첨
    min_month_total_input : 0.0, // 월 누적 사용량 경

    middle_month_total : 0.0, // 월 누적 사용량 일 backend
    max_month_total : 0.0, // 월 누적 사용량 첨 backend
    min_month_total : 0.0, // 월 누적 사용량 경 backend

    invalid_middle_month_total_input : 0.0, // 무효 월 누계 일
    invalid_max_month_total_input : 0.0, // 무효 월 누계 경

    invalid_middle_month_total : 0.0, // 무효 월 누계 일 backend
    invalid_max_month_total : 0.0, // 무효 월 누계 경 backend

    middle_factor : 0.0, // 역률 일
    max_factor : 0.0, // 역률 첨
    total_factor : 0.0, // 역률 집계

    month_total_factor : 0.0, // 역률 월 집계

    avg_electric_power : 0.0, // 평균 전력
    total_load_rate : 0.0, // 부하율

    today_total_usage : 0.0, // 금일 총 사용량

    month_total_usage_input : 0.0, // 총 사용량 월 누계
    year_total_usage_input : 0.0, //  총 사옹량 년 누계

    month_total_usage : 0.0, // 총 사용량 월 누계 backend
    year_total_usage : 0.0, //  총 사옹량 년 누계 backend

    its_middle_today_usage : 0.0, // 빙축열 금일 사용량 일
    its_max_today_usage : 0.0, // 빙축열 금일 사용량 경

    its_middle_month_total_input : 0.0, // 월 누적 사용량 일
    its_max_month_total_input : 0.0, // 월 누적 사용량 경

    its_middle_month_total : 0.0, // 월 누적 사용량 일 backend
    its_max_month_total : 0.0, // 월 누적 사용량 경 backend

    its_today_total_usage : 0.0, // 빙축열 금일총사용량

    its_month_total_usage_input : 0.0, // 빙축열 총사용량 월 누계
    its_year_total_usage_input : 0.0, // 빙축열 총사용량 년 누계

    its_month_total_usage : 0.0, // 빙축열 총사용량 월 누계 backend
    its_year_total_usage : 0.0, // 빙축열 총사용량 년 누계 backend

    year_generate_capacity_input : 0.0, // 발전량 년 누계
    year_operation_time_input : 0.0, // 가동시간 년 누계
    year_fuel_consumption_input : 0.0, // 연료소모량 년 누계

    year_generate_capacity : 0.0, // 발전량 년 누계 backend
    year_operation_time : 0.0, // 가동시간 년 누계 backend
    year_fuel_consumption : 0.0 // 연료소모량 년 누계 backend
}

// input 숫자 콤마 소숫점 체크
export const validationSchema = yup.object().shape({
    valid_middle_load: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),
    valid_max_load: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),
    valid_min_load: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),

    invalid_middle_load: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),
    invalid_max_load: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),

    max_electric_power: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),

    its_middle_load: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),
    its_min_load: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),

    generate_capacity: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),
    operation_time: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),
    fuel_consumption: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
})

// 소숫점 처리
const roundToFix = (value) => {
    return (Math.round((value * 100).toPrecision(15)) / 100).toLocaleString('ko-KR')
}

// 역률 계산
const powerFactor = (validElectric, invalidElectric) => {
    return Number(((validElectric) / Math.sqrt((validElectric ** 2) + (invalidElectric ** 2))) * 100)
}

// 사용량 계산
export const electricFunc = (setValue, getValues) => {
    
    // 유효 금일 사용량
    const middle_today_usage = resultCheckFunc((getCommaDel(getValues('valid_middle_load')) - getCommaDel(getValues('before_valid_middle_load'))) * getValues('apply_rate'), true) // 일
    setValue('middle_today_usage', roundToFix(middle_today_usage))

    const max_today_usage = resultCheckFunc((getCommaDel(getValues('valid_max_load')) - getCommaDel(getValues('before_valid_max_load'))) * getValues('apply_rate'), true) // 첨
    setValue('max_today_usage', roundToFix(max_today_usage))

    const min_today_usage = resultCheckFunc((getCommaDel(getValues('valid_min_load')) - getCommaDel(getValues('before_valid_min_load'))) * getValues('apply_rate'), true) // 경
    setValue('min_today_usage', roundToFix(min_today_usage))

    // 무효 금일 사용량
    const invalid_middle_today_usage = resultCheckFunc((getCommaDel(getValues('invalid_middle_load')) - getCommaDel(getValues('before_invalid_middle_load'))) * getValues('apply_rate'), true) // 일
    setValue('invalid_middle_today_usage', roundToFix(invalid_middle_today_usage))

    const invalid_max_today_usage = resultCheckFunc((getCommaDel(getValues('invalid_max_load')) - getCommaDel(getValues('before_invalid_max_load'))) * getValues('apply_rate'), true) // 첨
    setValue('invalid_max_today_usage', roundToFix(invalid_max_today_usage))

    // 금일 사용량
    const today_total_usage = resultCheckFunc(middle_today_usage + max_today_usage + min_today_usage, true)
    setValue('today_total_usage', roundToFix(today_total_usage))

    // 빙축열 사용량
    const its_middle_today_usage = resultCheckFunc((getCommaDel(getValues('its_middle_load')) - getCommaDel(getValues('before_its_middle_load'))) * getValues('its_apply_rate'), true) // 일
    setValue('its_middle_today_usage', roundToFix(its_middle_today_usage))

    const its_max_today_usage = resultCheckFunc((getCommaDel(getValues('its_min_load')) - getCommaDel(getValues('before_its_min_load'))) * getValues('its_apply_rate'), true) // 첨
    setValue('its_max_today_usage', roundToFix(its_max_today_usage))

    // 빙축열 금일 사용량
    const its_today_total_usage = resultCheckFunc(its_middle_today_usage + its_max_today_usage, true)
    setValue('its_today_total_usage', roundToFix(its_today_total_usage))

    // 유효 월 누계
    const middle_month_total_input = resultCheckFunc(getCommaDel(getValues('middle_month_total')) + getCommaDel(getValues('middle_today_usage')), true)
    setValue('middle_month_total_input', roundToFix(middle_month_total_input))
    const max_month_total_input = getCommaDel(getValues('max_month_total')) + getCommaDel(getValues('max_today_usage'))
    setValue('max_month_total_input', roundToFix(max_month_total_input))
    const min_month_total_input = getCommaDel(getValues('min_month_total')) + getCommaDel(getValues('min_today_usage'))
    setValue('min_month_total_input', roundToFix(min_month_total_input))

    // 무효 월 누계
    const invalid_middle_month_total_input = resultCheckFunc(getCommaDel(getValues('invalid_middle_month_total')) + getCommaDel(getValues('invalid_middle_today_usage')), true)
    setValue('invalid_middle_month_total_input', roundToFix(invalid_middle_month_total_input))
    const invalid_max_month_total_input = resultCheckFunc(getCommaDel(getValues('invalid_max_month_total')) + getCommaDel(getValues('invalid_max_today_usage')), true)
    setValue('invalid_max_month_total_input', roundToFix(invalid_max_month_total_input))

    // 빙축열 월 누계
    const its_middle_month_total_input = resultCheckFunc(getCommaDel(getValues('its_middle_month_total')) + getCommaDel(getValues('its_middle_today_usage')), true)
    setValue('its_middle_month_total_input', roundToFix(its_middle_month_total_input))
    const its_max_month_total_input = resultCheckFunc(getCommaDel(getValues('its_max_month_total')) + getCommaDel(getValues('its_max_today_usage')), true)
    setValue('its_max_month_total_input', roundToFix(its_max_month_total_input))

    // 일반 전기 사용량 집계
    const month_total_usage_input = resultCheckFunc(getCommaDel(getValues('month_total_usage')) + today_total_usage, true)
    setValue('month_total_usage_input', roundToFix(month_total_usage_input))
    const year_total_usage_input = resultCheckFunc(getCommaDel(getValues('year_total_usage')) + today_total_usage, true)
    setValue('year_total_usage_input', roundToFix(year_total_usage_input))

    // 빙축열 전기 사용량 집계
    const its_month_total_usage_input = resultCheckFunc(getCommaDel(getValues('its_month_total_usage')) + its_today_total_usage, true)
    setValue('its_month_total_usage_input', roundToFix(its_month_total_usage_input))
    const its_year_total_usage_input = resultCheckFunc(getCommaDel(getValues('its_year_total_usage')) + its_today_total_usage, true)
    setValue('its_year_total_usage_input', roundToFix(its_year_total_usage_input))

    // 역률
    let middle_factor = powerFactor(middle_today_usage, invalid_middle_today_usage) // 일
    let max_factor = powerFactor(max_today_usage, invalid_max_today_usage) // 첨
    const temp_total_usage = middle_today_usage + max_today_usage
    const temp_invalid_total_usage = invalid_middle_today_usage + invalid_max_today_usage
    let total_factor = powerFactor(temp_total_usage, temp_invalid_total_usage) // 종합

    if (middle_factor > 100) middle_factor = 0
    if (max_factor > 100) max_factor = 0
    if (total_factor > 100) total_factor = 0

    middle_factor = resultCheckFunc(middle_factor, true)
    max_factor = resultCheckFunc(max_factor, true)
    total_factor = resultCheckFunc(total_factor, true)

    setValue('middle_factor', roundToFix(middle_factor))
    setValue('max_factor', roundToFix(max_factor))
    setValue('total_factor', roundToFix(total_factor))

    const valid_month = middle_month_total_input + max_month_total_input
    const invalid_month = invalid_middle_month_total_input + invalid_max_month_total_input
    let month_total_factor = resultCheckFunc(powerFactor(valid_month, invalid_month), true)
    if (month_total_factor > 100) month_total_factor = 0

    setValue('month_total_factor', roundToFix(month_total_factor))

    // 최대 전력 : 입력 값
    // 평균 전력 : 금일 사용량 / 24
    const avg_electric_power = resultCheckFunc(today_total_usage / 24, true)
    setValue('avg_electric_power', roundToFix(avg_electric_power))

    // 부하율 : (평균전력 / 최대 전력) * 100
    let total_load_rate = resultCheckFunc((avg_electric_power / getCommaDel(getValues('max_electric_power'))) * 100, true)
    if (total_load_rate > 100) total_load_rate = 0
    setValue('total_load_rate', roundToFix(total_load_rate))

    // 발전량 누계
    const year_generate_capacity_input = resultCheckFunc(Number(getCommaDel(getValues('year_generate_capacity')) + getCommaDel(getValues('generate_capacity'))), true)
    setValue('year_generate_capacity_input', roundToFix(year_generate_capacity_input))
    const year_operation_time_input = resultCheckFunc(Number(getCommaDel(getValues('year_operation_time')) + getCommaDel(getValues('operation_time'))), true) 
    setValue('year_operation_time_input', roundToFix(year_operation_time_input))
    const year_fuel_consumption_input = resultCheckFunc(Number(getCommaDel(getValues('year_fuel_consumption')) + getCommaDel(getValues('fuel_consumption'))), true) 
    setValue('year_fuel_consumption_input', roundToFix(year_fuel_consumption_input))

} // electricFunc end

// electric list 
// electric list Table style
export const electricListCustomStyles = {
    tableWrapper: {
        style: {
            display: 'table',
            height: '100%',
            width: '100%',
            maxWidth: '100%',
            minWidth: '100%',
            overScrollX: 'scroll'
        }
    },
    headCells: {
        style: {
            backgroundColor: primaryHeaderColor,
            border: '0.5px solid #B9B9C3',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '14px',
            fontFamily: 'Pretendard-Regular',
            paddingTop: '3px',
            paddingBottom: '3px',
            paddingLeft: '0px',
            paddingRight: '0px'
        }
    },
    cells: {
        style: {
            border: '0.5px solid #B9B9C3',
            display: 'flex',
            fontSize: '14px',
            fontFamily: 'Pretendard-Regular',
            paddingTop: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
            paddingRight: '0px',
            marginTop: '0px',
            marginBottom: '0px',
            marginLeft: '0px',
            marginRight: '0px',
            justifyContent: 'center',
            width: '100%'
        }
    },
    rows: {
        style: {
            cursor: 'default'
        }
    }
}

// 일 전력 컬럼 조회 
export const electricListColumns = [
    {
      name: '날짜',
      selector: row => moment(row.create_datetime).format('YYYY-MM-DD'),
      sortable: true
    },
    {
      name: (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{"유효(일)"}</div>
            <div className='row-bottom-1 main'>{"사용량(일)"}</div>
        </div>
      ),
      cell: row => (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{roundToFix(row.valid_middle_load)}</div>
            <div className='row-bottom-1 main'>{roundToFix(row.middle_today_usage)}</div>
        </div>
      )
    },
    {
      name: (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{"유효(첨)"}</div>
            <div className='row-bottom-1 main'>{"사용량(첨)"}</div>
        </div>
      ),
      cell: row => (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{roundToFix(row.valid_max_load)}</div>
            <div className='row-bottom-1 main'>{roundToFix(row.max_today_usage)}</div>
        </div>
      )
    },
    {
      name: (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{"유효(경)"}</div>
            <div className='row-bottom-1 main'>{"사용량(경)"}</div>
        </div>
      ),
      cell: row => (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{roundToFix(row.valid_min_load)}</div>
            <div className='row-bottom-1 main'>{roundToFix(row.min_today_usage)}</div>
        </div>
      )
    },    
    {
      name: (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{"무효(일)"}</div>
            <div className='row-bottom-1 main'>{"무용량(일)"}</div>
        </div>
      ),
      cell: row => (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{roundToFix(row.invalid_middle_load)}</div>
            <div className='row-bottom-1 main'>{roundToFix(row.invalid_middle_today_usage)}</div>
        </div>
      )
    },    
    {
      name: (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{"유효(경)"}</div>
            <div className='row-bottom-1 main'>{"사용량(경)"}</div>
        </div>
      ),
      cell: row => (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{roundToFix(row.invalid_max_load)}</div>
            <div className='row-bottom-1 main'>{roundToFix(row.invalid_max_today_usage)}</div>
        </div>
      )
    },    
    {
      name: (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{"역률(일)"}</div>
            <div className='row-bottom-1 main'>{"종합역률"}</div>
        </div>
      ),
      cell: row => (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{row.middle_factor}</div>
            <div className='row-bottom-1 main'>{row.total_factor}</div>
        </div>
      )
    },    
    {
      name: (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{"역률(경)"}</div>
            <div className='row-bottom-1 main'>{"월누계"}</div>
        </div>
      ),
      cell: row => (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{row.max_factor}</div>
            <div className='row-bottom-1 main'>{row.month_total_factor}</div>
        </div>
      )
    },    
    {
      name: (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{"최대전력"}</div>
            <div className='row-bottom-1 main'>{"평균전력"}</div>
        </div>
      ),
      cell: row => (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{roundToFix(row.max_electric_power)}</div>
            <div className='row-bottom-1 main'>{roundToFix(row.avg_electric_power)}</div>
        </div>
      )
    },    
    {
      name: '부하율',
      selector: row => row.total_load_rate,
      sortable: true
    },    
    {
      name: (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{"발전량"}</div>
            <div className='row-bottom-1 main'>{"년누계"}</div>
        </div>
      ),
      cell: row => (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{roundToFix(row.generate_capacity)}</div>
            <div className='row-bottom-1 main'>{roundToFix(row.year_generate_capacity)}</div>
        </div>
      )
    },    
    {
      name: (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{"일사용량"}</div>
            <div className='row-bottom-1 main'>{"월누계"}</div>
        </div>
      ),
      cell: row => (
        <div className='electric-data-table flex-grow-1'>
            <div className='row-top-1 main'>{roundToFix(row.today_total_usage_list)}</div>
            <div className='row-bottom-1 main'>{roundToFix(row.month_total_usage_list)}</div>
        </div>
      )
    }
    
]

// electric ITSS
// electric ITSS Table style
export const electricITSSCustomStyles = {
    tableWrapper: {
        style: {
            display: 'table',
            height: '100%',
            width: '100%',
            maxWidth: '100%',
            minWidth: '100%'
        }
    },
    headCells: {
        style: {
            backgroundColor: primaryHeaderColor,
            border: '0.5px solid #B9B9C3',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '14px',
            fontFamily: 'Pretendard-Regular',
            paddingTop: '3px',
            paddingBottom: '3px',
            paddingLeft: '0px',
            paddingRight: '0px'
        }
    },
    cells: {
        style: {
            border: '0.5px solid #B9B9C3',
            display: 'flex',
            fontSize: '14px',
            fontFamily: 'Pretendard-Regular',
            paddingTop: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
            paddingRight: '0px',
            marginTop: '0px',
            marginBottom: '0px',
            marginLeft: '0px',
            marginRight: '0px',
            justifyContent: 'center',
            width: '100%'
        }
    },
    rows: {
        style: {
            cursor: 'default'
        }
    }
}

// 빙축열 컬럼
export const electricITSSColumns = [
    {
        name: '날짜',
        selector: row => moment(row.create_datetime).format('YYYY-MM-DD'),
        sortable: true
    },
    {
        name: "유효(일)",
        cell: row => roundToFix(row.its_middle_load)
    },
    {
        name: "사용량(일)",
        cell: row => roundToFix(row.its_middle_today_usage)
    },
    {
        name: "유효(경)",
        cell: row => roundToFix(row.its_min_load)
    },    
    {
        name: "사용량(경)",
        cell: row => roundToFix(row.its_max_today_usage)
    },    
    {
        name: "일사용량",
        cell: row => roundToFix(row.its_middle_today_usage + row.its_max_today_usage)
    },    
    {
        name: "월누계",
        cell: row => roundToFix(row.its_month_total_usage_list)
    },    
    {
        name: "년누계",
        cell: row => roundToFix(row.its_year_total_usage_list)
    }
]

// electric Total
// electric Total Table style
export const electricTotalCustomStyles = {
    tableWrapper: {
        style: {
            display: 'table',
            height: '100%',
            maxWidth: '100%'
        }
    },
    headCells: {
        style: {
            backgroundColor: primaryHeaderColor,
            border: '0.5px solid #B9B9C3',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '13px',
            fontFamily: 'Pretendard-Regular',
            paddingTop: '3px',
            paddingBottom: '3px',
            paddingLeft: '0px',
            paddingRight: '0px'
        }
    },
    cells: {
        style: {
            border: '0.5px solid #B9B9C3',
            fontSize: '12px',
            fontFamily: 'Pretendard-Regular',
            paddingTop: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
            paddingRight: '0px',
            marginTop: '0px',
            marginBottom: '0px',
            marginLeft: '0px',
            marginRight: '0px',
            justifyContent: 'center',
            width: '100%',
            display: 'flex'
        }
    },
    rows: {
        style: {
            cursor: 'default'
        }
    }
  }
// 집계 row 컴포넌트
const ElectricTotalDataRow = (props) => (
    <div className='electric-data-table flex-grow-1 '>
        <div className='d-flex flex-row justify-content-center'>
            <div className='col-right d-flex flex-column flex-grow-1'>
                <div className='row-top main'>{props.middle ? roundToFix(props.middle) : 0 }</div>
                <div className='row-bottom main'>{props.max ? roundToFix(props.max) : 0 }</div>
                <div className='row-final main'>{props.min ? roundToFix(props.min) : 0}</div>
            </div>
        </div>
        <div className='col-right row-mid main'>{props.power ? roundToFix(props.power) : 0}</div>
        <div className='d-flex flex-row justify-content-center'>
            <div className='col-right d-flex flex-column flex-grow-1'>
                <div className='row-top main'>{props.itsMiddle ? roundToFix(props.itsMiddle) : 0}</div>
                <div className='row-final main'>{props.itsMin ? roundToFix(props.itsMin) : 0}</div>
            </div>
        </div>
        <div className='col-right row-bottom main'>{props.itsTotal ? roundToFix(props.itsTotal) : 0}</div>
    </div>
)

// 집계 컬럼
export const electricTotalColumns = [
    {
        name: '년도',
        cell: row => (row.create_datetime),
        sortable: true,
        width: '40px'
    },
    {
        name: "전력구분",
        cell: row => (
            <div id={row.middle_today_usage} className='electric-data-table flex-grow-1'>
                <div className='d-flex flex-row justify-content-center '>
                    <div className='row-top align-self-center'>
                        한전
                    </div>
                    <div className='col-right d-flex flex-column flex-grow-1'>
                        <div className='row-top main'>(일)부하</div>
                        <div className='row-bottom main'>(첨)부하</div>
                        <div className='row-final main'>(경)부하</div>
                    </div>
                </div>
                <div className='row-mid main'>발전량</div>
                <div className='d-flex flex-row justify-content-center '>
                    <div className='row-top align-self-center'>
                        빙축열
                    </div>
                    <div className='col-right d-flex flex-column flex-grow-1'>
                        <div className='row-top main'>(일)부하</div>
                        <div className='row-final main'>(경)부하</div>
                    </div>
                </div>
                <div className='row-bottom main'>소계</div>
            </div>
          ),
          width: '80px'
    },
    {
        name: "1월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_1}
            max={row.month_max_usage_1}
            min={row.month_min_usage_1}
            power={row.month_generate_capacity_1}
            itsMiddle={row.month_its_middle_today_usage_1}
            itsMin={row.month_its_max_today_usage_1}
            itsTotal={row.month_total_1}
        />
    },
    {
        name: "2월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_2}
            //middle={100000000000}
            max={row.month_max_usage_2}
            min={row.month_min_usage_2}
            power={row.month_generate_capacity_2}
            itsMiddle={row.month_its_middle_today_usage_2}
            itsMin={row.month_its_max_today_usage_2}
            itsTotal={row.month_total_2}
        />
    },
    {
        name: "3월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_3}
            max={row.month_max_usage_3}
            min={row.month_min_usage_3}
            power={row.month_generate_capacity_3}
            itsMiddle={row.month_its_middle_today_usage_3}
            itsMin={row.month_its_max_today_usage_3}
            itsTotal={row.month_total_3}
        />
    },
    {
        name: "4월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_4}
            max={row.month_max_usage_4}
            min={row.month_min_usage_4}
            power={row.month_generate_capacity_4}
            itsMiddle={row.month_its_middle_today_usage_4}
            itsMin={row.month_its_max_today_usage_4}
            itsTotal={row.month_total_4}
        />
    },
    {
        name: "5월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_5}
            max={row.month_max_usage_5}
            min={row.month_min_usage_5}
            power={row.month_generate_capacity_5}
            itsMiddle={row.month_its_middle_today_usage_5}
            itsMin={row.month_its_max_today_usage_5}
            itsTotal={row.month_total_5}
        />
    },
    {
        name: "6월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_6}
            max={row.month_max_usage_6}
            min={row.month_min_usage_6}
            power={row.month_generate_capacity_6}
            itsMiddle={row.month_its_middle_today_usage_6}
            itsMin={row.month_its_max_today_usage_6}
            itsTotal={row.month_total_6}
        />
    },
    {
        name: "7월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_7}
            max={row.month_max_usage_7}
            min={row.month_min_usage_7}
            power={row.month_generate_capacity_7}
            itsMiddle={row.month_its_middle_today_usage_7}
            itsMin={row.month_its_max_today_usage_7}
            itsTotal={row.month_total_7}
        />
    },
    {
        name: "8월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_8}
            max={row.month_max_usage_8}
            min={row.month_min_usage_8}
            power={row.month_generate_capacity_8}
            itsMiddle={row.month_its_middle_today_usage_8}
            itsMin={row.month_its_max_today_usage_8}
            itsTotal={row.month_total_8}
        />
    },
    {
        name: "9월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_9}
            max={row.month_max_usage_9}
            min={row.month_min_usage_9}
            power={row.month_generate_capacity_9}
            itsMiddle={row.month_its_middle_today_usage_9}
            itsMin={row.month_its_max_today_usage_9}
            itsTotal={row.month_total_9}
        />
    },
    {
        name: "10월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_10}
            max={row.month_max_usage_10}
            min={row.month_min_usage_10}
            power={row.month_generate_capacity_10}
            itsMiddle={row.month_its_middle_today_usage_10}
            itsMin={row.month_its_max_today_usage_10}
            itsTotal={row.month_total_10}
        />
    },
    {
        name: "11월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_11}
            max={row.month_max_usage_11}
            min={row.month_min_usage_11}
            power={row.month_generate_capacity_11}
            itsMiddle={row.month_its_middle_today_usage_11}
            itsMin={row.month_its_max_today_usage_11}
            itsTotal={row.month_total_11}
        />
    },
    {
        name: "12월",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_12}
            max={row.month_max_usage_12}
            min={row.month_min_usage_12}
            power={row.month_generate_capacity_12}
            itsMiddle={row.month_its_middle_today_usage_12}
            itsMin={row.month_its_max_today_usage_12}
            itsTotal={row.month_total_12}
        />
    },
    {
        name: "계",
        cell: row => <ElectricTotalDataRow
            middle={row.month_middle_usage_13}
            max={row.month_max_usage_13}
            min={row.month_min_usage_13}
            power={row.month_generate_capacity_13}
            itsMiddle={row.month_its_middle_today_usage_13}
            itsMin={row.month_its_max_today_usage_13}
            itsTotal={row.month_total_13}
        />
    }
]

