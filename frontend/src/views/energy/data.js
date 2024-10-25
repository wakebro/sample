import * as yup from 'yup'
import axios from 'axios'
import {API_ENERGY_BASIC_UTILITY_FORM, API_ENERGY_BASIC_UTILITY, API_ENERGY_BASIC_UTILITY_DETAIL,
    API_ENERGY_BASIC_MAGNIFICATION_FORM, API_ENERGY_BASIC_MAGNIFICATION_LIST, API_ENERGY_BASIC_MAGNIFICATION_DETAIL,
    API_ENERGY_BASIC_UTILITY_ENTRY, API_ENERGY_BASIC_UTILITY_ENTRY_FORM, API_ENERGY_BASIC_UTILITY_ENTRY_DETAIL,
    API_ENERGY_SOLID, API_ENERGY_SOLID_COUNT_LIST
} from '../../constants'
import Swal from 'sweetalert2'
import { primaryColor, sweetAlert } from '../../utility/Utils'
import { ENERGY_BASIC_MAGIFICATION, ENERGY_BASIC_UTILITY_CODE, ENERGY_BASIC_UTILITY_ENTRY } from '../../constants/CodeList'

export const typeObj = {
    magnification : '배율관리',
    utilitycode: '수광비코드관리',
    utilityentry:'수광비항목관리'
}
export const typeCodeObj = {
    magnification : ENERGY_BASIC_MAGIFICATION, // '배율관리',
    utilitycode: ENERGY_BASIC_UTILITY_CODE, //'수광비코드관리',
    utilityentry: ENERGY_BASIC_UTILITY_ENTRY //'수광비항목관리'
}

export const defaultValues = {
    utilitycode: {
        code : '',
        codeDisabled : '',
        description: ''
    },
    magnification: {
        building: {value:'', label: '건물 선택해주세요.'},
        general: '',
        iceStorage: '',
        pressure: '',
        cooking: '',
        buildingCode: ''
    },
    utilityentry: {
        building: {value:'', label: '건물을 선택해주세요.'},
        entryCode: ''
    }
}

export const validationSchema = {
    utilitycode: yup.object().shape({ 
        code: yup.string().required('코드를 입력해주세요'),
		description: yup.string().required('수광비 코드를 입력해주세요')
    }),
    magnification: yup.object().shape({ 
        // general: yup.number().typeError("숫자를 입력해주세요").required('일반전력을 입력해주세요.').positive('양수만 입력해주세요.').min(1, '1이상 값을 입력해주세요.').integer('정수만 입력해주세요.'),
        // iceStorage: yup.number().typeError("숫자를 입력해주세요").required('빙축열을 입력해주세요.').positive('양수만 입력해주세요.').min(1, '1이상 값을 입력해주세요.').integer('정수만 입력해주세요.'),
        // pressure: yup.number().typeError("숫자를 입력해주세요").required('중, 저압을 입력해주세요.').positive('양수만 입력해주세요.').min(1, '1이상 값을 입력해주세요.').integer('정수만 입력해주세요.'),
        // cooking: yup.number().typeError("숫자를 입력해주세요").required('취사를 입력해주세요.').positive('양수만 입력해주세요.').min(1, '1이상 값을 입력해주세요.').integer('정수만 입력해주세요.')
        general: yup.string().matches(/^[\d,\.]+$/g, '양수의 숫자 형태로 입력해주세요'),
        iceStorage: yup.string().matches(/^[\d,\.]+$/g, '양수의 숫자 형태로 입력해주세요'),
        pressure: yup.string().matches(/^[\d,\.]+$/g, '양수의 숫자 형태로 입력해주세요'),
        cooking: yup.string().matches(/^[\d,\.]+$/g, '양수의 숫자 형태로 입력해주세요')
    })
}

export const formUrlObj = {
    utilitycode: API_ENERGY_BASIC_UTILITY_FORM,
    magnification: API_ENERGY_BASIC_MAGNIFICATION_FORM,
    utilityentry: API_ENERGY_BASIC_UTILITY_ENTRY_FORM
}

export const listUrlObj = {
    utilitycode: API_ENERGY_BASIC_UTILITY,
    magnification: API_ENERGY_BASIC_MAGNIFICATION_LIST,
    utilityentry: API_ENERGY_BASIC_UTILITY_ENTRY
}

export const detailUrlObj = {
    utilitycode : API_ENERGY_BASIC_UTILITY_DETAIL,
    magnification: API_ENERGY_BASIC_MAGNIFICATION_DETAIL,
    utilityentry: API_ENERGY_BASIC_UTILITY_ENTRY_DETAIL
}

export const solidValues = {
    building: {},
    target_datetime: '',
    boiler_1: 0,
    boiler_2: 0,
    boiler_3: 0,
    boiler_4: 0,
    low_temp: 0,
    high_temp: 0,
    middle_press: 0,
    low_press: 0,
    cook: 0,
    water_supply: 0
}

export const solidValidation = yup.object().shape({
    target_datetime : yup.array().test('isNonEmpty', '입력일자를 입력해주세요.', function(value) {
        return value
    }).nullable(),
    boiler_1: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'), //yup.number().typeError("숫자를 입력해주세요").positive('양수만 입력해주세요.').min(0, '0이상 값을 입력해주세요.'),
    boiler_2: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'), //yup.number().typeError("숫자를 입력해주세요").positive('양수만 입력해주세요.').min(0, '0이상 값을 입력해주세요.'),
    boiler_3: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'), //yup.number().typeError("숫자를 입력해주세요").positive('양수만 입력해주세요.').min(0, '0이상 값을 입력해주세요.'),
    boiler_4: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'), //yup.number().typeError("숫자를 입력해주세요").positive('양수만 입력해주세요.').min(0, '0이상 값을 입력해주세요.'),
    low_temp: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'), //yup.number().typeError("숫자를 입력해주세요").nullable(true),
    high_temp: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'), //yup.number().typeError("숫자를 입력해주세요").nullable(true),
    middle_press : yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'), //yup.number().typeError("숫자를 입력해주세요").positive('양수만 입력해주세요.').min(1, '1이상 값을 입력해주세요.').required('금일 사용량을 입력해주세요.'),
    low_press: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'), //yup.number().typeError("숫자를 입력해주세요").positive('양수만 입력해주세요.').min(1, '1이상 값을 입력해주세요.').required('금일 사용량을 입력해주세요.'),
    cook: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'), //yup.number().typeError("숫자를 입력해주세요").positive('양수만 입력해주세요.').min(1, '1이상 값을 입력해주세요.').required('금일 사용량을 입력해주세요.'),
    water_supply: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요') //yup.number().typeError("숫자를 입력해주세요").positive('양수만 입력해주세요.').min(1, '1이상 값을 입력해주세요.').required('금일 사용량을 입력해주세요.')
})

//yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),
export const removeFormat = (num) => {
    try {
        return num.replace(/,/g, '')

    } catch (e) {
       return num
    }
}

export const axiosObj = {
    register : axios.post,
    modify : axios.put
}

export const alertObj = {
    register : '등록',
    modify : '수정'
}

export const solidTypeObj = {
    day : '보일러 및 가스사용량',
    monthly: '월별 사용량',
    compare:'지정월 사용량',
    year : '년도별 사용량'
}

export const monthlyList = [
    {value:'', label:'월'},
    {value:1, label:'1월'},
    {value:2, label:'2월'},
    {value:3, label:'3월'},
    {value:4, label:'4월'},
    {value:5, label:'5월'},
    {value:6, label:'6월'},
    {value:7, label:'7월'},
    {value:8, label:'8월'},
    {value:9, label:'9월'},
    {value:10, label:'10월'},
    {value:11, label:'11월'},
    {value:12, label:'12월'}
]

export const solidApiObj = {
    day: API_ENERGY_SOLID,
    monthly: API_ENERGY_SOLID_COUNT_LIST,
    compare: API_ENERGY_SOLID_COUNT_LIST,
    year:API_ENERGY_SOLID_COUNT_LIST
}

export const axiosDeletCallBack = (page, API, parm, callback) => {
	Swal.fire({
		icon: "warning",
		html: "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
		showCancelButton: true,
		showConfirmButton: true,
		cancelButtonText: "취소",
		confirmButtonText: '확인',
		confirmButtonColor : primaryColor,
		reverseButtons :true,
		customClass: {
			actions: 'sweet-alert-custom right',
			cancelButton: 'me-1'
		}
	}).then((res) => {
		if (res.isConfirmed) {
			axios.delete(API, parm)
			.then(res => {
				if (res.status === 200) {
					Swal.fire({
						title: `${page} 삭제 완료`,
						html: `${page} 삭제가 완료되었습니다.`,
						icon: 'success',
						customClass: {
							confirmButton: 'btn btn-primary',
							actions: `sweet-alert-custom center`
						}
					}).then(res => {
						if (res.isConfirmed === true || res.dismiss === 'backdrop') {
							callback()
						}
					})
					
				} else {
					sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
				}
			})
			.catch(() => {
				sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
			})
		} else {
			Swal.fire({
				icon: "info",
				html: "취소하였습니다.",
				showCancelButton: true,
				showConfirmButton: false,
				cancelButtonText: "확인",
				cancelButtonColor : primaryColor,
				reverseButtons :true,
				customClass: {
					actions: 'sweet-alert-custom right'
				}
			})
		}
	})
}