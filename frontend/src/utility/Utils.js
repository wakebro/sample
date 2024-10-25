import * as moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Jpeg from '../assets/images/icons/jpeg.png'
import Jpg from '../assets/images/icons/jpg.png'
import Txt from '../assets/images/icons/txt.png'
import Unknown from '../assets/images/icons/unknown.png'
import Xlsx from '../assets/images/icons/xlsx.png'
import { DefaultRoute } from "../router/routes"
import { AXIOS } from "../views/system/basic/company/data"
import axios from "./AxiosConfig"
import { UTILS_URL } from '../constants'

export const primaryColor = '#3f90e8'
export const primaryHeaderColor = '#bad8f7'

export const SIGN_CONFIRM = 0
export const SIGN_REJECT = 1
export const SIGN_COLLECT = 2

export const weekdayNumberKr = {
	0 : '월',
	1 : '화',
	2 : '수',
	3 : '목',
	4 : '금',
	5 : '토',
	6 : '일'
}

export const weekMonthKr = {
	5 : '마지막',
	1 : '첫번째',
	2 : '두번째',
	3 : '세번째',
	4 : '네번째'
}

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, "")

// ** Checks if the passed date is today
const isToday = (date) => {
	const today = new Date()
	return (
	/* eslint-disable operator-linebreak */
	date.getDate() === today.getDate() &&
	date.getMonth() === today.getMonth() &&
	date.getFullYear() === today.getFullYear()
	/* eslint-enable */
	)
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (
	value,
	formatting = { month: "short", day: "numeric", year: "numeric" }
) => {
	if (!value) return value
	return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
	const date = new Date(value)
	let formatting = { month: "short", day: "numeric" }

	if (toTimeForCurrentDay && isToday(date)) {
	formatting = { hour: "numeric", minute: "numeric" }
	}

	return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value))
}


export  const formatDateTime = (datetimeString) => {
	if (!datetimeString) {
		return false
	}
	const date = new Date(datetimeString)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1)
	const day = String(date.getDate())
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	
	return `${year}-${month}-${day} ${hours}:${minutes}`
  }


export const formatDateTimeWithDay = (datetimeString) => {
	if (!datetimeString) {
		return false
	}

	const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

	const date = new Date(datetimeString)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1)
	const day = String(date.getDate())

	const dayOfWeek = daysOfWeek[date.getDay()]

	return `${year}-${month}-${day} (${dayOfWeek})`
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *    ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem("userData")
export const getUserData = () => JSON.parse(localStorage.getItem("userData"))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
	if (userRole === "admin") return DefaultRoute
	if (userRole === "client") return "/access-control"
	return "/login"
}

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
	...theme,
	colors: {
	...theme.colors,
	primary25: "#7367f01a", // for option hover bg-color
	primary: "#7367f0", // for selected option bg-color
	neutral10: "#7367f0", // for tags bg-color
	neutral20: "#ededed", // for input border-color
	neutral30: "#ededed" // for input hover border-color
	}
})

export const getToken = () => localStorage.getItem('token')

/** obj의 키가 있는지 체크 하고 있다면 해당 값을 반환
 * @param {} obj data object
 * @param {} key object key
*/
export const getObjectKeyCheck = (obj, key) => {
	if (obj && obj.hasOwnProperty(key)) {
		return obj[key]
	}
	return ''
}

export const secondToDate = (seconds) => {
	//days 
	// let days = Math.floor(seconds/(24*3600)) 
	// seconds -= days*24*3600 
	//hours 
	let hours = Math.floor(seconds / 3600) 
	if (hours < 9) {
	hours = `0${String(hours)}`
	} else {
	hours = String(Math.abs(hours).toLocaleString('ko-KR'))
	}
	seconds -= hours * 3600 
	
	//minutes 
	let minutes = Math.floor(seconds / 60) 
	if (minutes < 10) {
	minutes = `0${String(minutes)}`
	} else {
	minutes = String(minutes)
	}
	
	seconds -= minutes * 60 
	if (seconds < 10) {
	seconds = `0${String(seconds)}`
	} else {
	seconds = String(seconds)
	}
	
	return `${hours}시간 ${minutes}분 ${seconds} 초`
}
// 데이터 조회
export const getTableData = (API, param, setTableData) => {
	axios.get(API, {
		params: param
	})
	.then(res => {
		setTableData(res.data)
	})
	.catch(res => {
		console.log(API, res)
	})
}
export const getTableDataModifyFirstIdx = (API, param, setTableData, label) => {
	axios.get(API, {
		params: param
	})
	.then(res => {
		res.data[0].label = label
		setTableData(res.data)
	})
	.catch(res => {
		console.log(API, res)
	})
}

export const getTableDataRedux = (API, param, dispatch, callback) => {
	axios.get(API, {
		params: param
	})
	.then(res => {
		dispatch(callback(res.data))
	})
	.catch(res => {
		console.log(API, res)
	})
}

export const handleKeyPress = (e, customFunction) => {
	if (e.key === 'Enter') {
		customFunction()
	}
}
// <Select /> validation Custom
export const checkSelectValue = (e, event, selectError, setSelectError, setValue) => {
	const name = event.name
	const parentElement = document.querySelector(`.custom-select-${name}`)
	if (parentElement) { // Check if parentElement exists (is not null)
	  const childElement = parentElement.querySelector('.select__control')
	  if (e.value === '') {
		childElement.style.borderColor = 'red'
		setSelectError({
		  ...selectError,
		  [name]: true
		})
	  } else {
		setSelectError({
		  ...selectError,
		  [name]: false
		})
		childElement.style.borderColor = '#d8d6de'
	  }
	}
	setValue(name, e)
  }

export const checkSelectValueObj = (control, selectError, setSelectError) => {
	const tempObj = {}
	Object.keys(selectError).map((data) => {
		if (getObjectKeyCheck(control._formValues[data], 'value') === '') { // control._formValues[data].value === ''
			tempObj[data] = true
			const parentElement = document.querySelector(`.custom-select-${data}`)
			if (parentElement) { // Check if parentElement exists (is not null)
				const childElement = parentElement.querySelector('.select__control')
				childElement.style.borderColor = 'red'
			}
		} else {
			tempObj[data] = false
		}
	})
	setSelectError(tempObj)
	const checkTrueFalse = Object.keys(tempObj).every(key => tempObj[key] === false)
	return checkTrueFalse
}

export const checkAsyncSelectValueObj = (control, selectError, setSelectError) => {
	const tempObj = {}
	Object.keys(selectError).map(data => {
		if (control._formValues[data] === undefined) {
			tempObj[data] = true
			const parentElement = document.querySelector(`.custom-select-${data}`)
			const childElement = parentElement.querySelector('.select__control')
			childElement.style.borderColor = 'red'
		} else {
			tempObj[data] = false
		}
	})
	setSelectError(tempObj)
	const checkTrueFalse = Object.keys(tempObj).every(key => tempObj[key] === false)
	return checkTrueFalse
}

export const sweetAlert = (title, html, icon, position = 'right') => {
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		title: title,
		html: html,
		icon: icon,
		heightAuto: false,
		customClass: {
			confirmButton: 'btn btn-primary',
			actions: `sweet-alert-custom ${position}`
		}
	})
}

export const sweetCancleAlert = () => {
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		icon: "info",
		html: "취소하였습니다.",
		showCancelButton: true,
		showConfirmButton: false,
		heightAuto: false,
		cancelButtonText: "확인",
		cancelButtonColor : primaryColor,
		reverseButtons :true,
		customClass: {
			actions: 'sweet-alert-custom right'
		}
	})
}

export const axiosSweetAlert = (title, html, icon, position = 'right', setSubmitResult) => {
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		title: title,
		html: html,
		icon: icon,
		heightAuto: false,
		customClass: {
			confirmButton: 'btn btn-primary',
			actions: `sweet-alert-custom ${position}`
		}
	}).then(res => {
		if (res.isConfirmed === true || res.dismiss === 'backdrop') {
			if (setSubmitResult !== null) {
				setSubmitResult(true)
			}
		}
	})
}

export const sweetAlertCallback = (title, html, icon, position = 'right', callback, confirm = false, confirmCancelHtml = '') => {
	if (confirm) {
		const MySwal = withReactContent(Swal)
		MySwal.fire({
			title: title,
			html: html,
			icon: icon,
			showCancelButton: true,
			showConfirmButton: true,
			heightAuto: false,
			cancelButtonText: "취소",
			confirmButtonText: '확인',
			confirmButtonColor : primaryColor,
			reverseButtons :true,
			customClass: {
				actions: 'sweet-alert-custom right',
				cancelButton: 'me-1'
			}
		}).then(res => {
			if (res.isConfirmed === true) {
				if (callback !== null) {
					callback()
				}
			} else {
				MySwal.fire({
					icon: "info",
					title: title,
					html: confirmCancelHtml,
					showCancelButton: true,
					showConfirmButton: false,
					heightAuto: false,
					cancelButtonText: "확인",
					cancelButtonColor : primaryColor,
					reverseButtons :true,
					customClass: {
						actions: 'sweet-alert-custom right'
					}
				})
			}
		})
		return
	}
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		title: title,
		html: html,
		icon: icon,
		heightAuto: false,
		customClass: {
			confirmButton: 'btn btn-primary',
			actions: `sweet-alert-custom ${position}`
		}
	}).then(res => {
		if (res.isConfirmed === true || res.dismiss === 'backdrop') {
			if (callback !== null) {
				callback()
			}
		}
	})
}

export const handleCheckCode = (inputCode, API, setCheckCode) => {
	if (inputCode === '') {
		sweetAlert('', '입력된 코드값이 없습니다.<br/> 다시 한번 확인해주세요.', 'warning', 'center')
	} else {
		axios.get(API, {
			params: {
				checkCode: true,
				code:inputCode
			}
		})
		.then(res => {
			if (res.data) {
				sweetAlert('', '사용 가능한 코드입니다.', 'info', 'center')
				setCheckCode(true)
			} else {
				sweetAlert('', '중복된 코드가 존재합니다.<br/> 다시 한번 확인해주세요.', 'warning', 'center')
				setCheckCode(false)
			}
		})
	}
}

export const compareCode = (newCode, oldCode, API, setCheckCode) => {
	if (newCode === oldCode) {
		sweetAlert('', '중복된 코드가 존재합니다.<br/> 다시 한번 확인해주세요.', 'info', 'center')
		return false
	}
	handleCheckCode(newCode, API, setCheckCode)
}

export const compareCodeWithValue = (newCode, oldCode, API, setCheckCode) => {
	const special_pattern = /^[^!@#$%^&*()+=\[\]{};':"\\|,.<>\/?\s]*$/
	if (newCode === oldCode) {
		sweetAlert('', '중복된 코드가 존재합니다.<br/> 다시 한번 확인해주세요.', 'info', 'center')
		return false
	}
	if (!special_pattern.test(newCode)) {
		sweetAlert('', `특수문자가 포함되어 있습니다.<br/> 사용가능한 특수문자는 '_'와 '-'`, 'warning', 'center')
		return false
	}
	if (newCode.length >= 1000) {
		sweetAlert('', '코드 길이가 1000자 이상입니다.<br/>길이를 줄여주세요.', 'warning', 'center')
		return false
	}
	handleCheckCode(newCode, API, setCheckCode)
}

export const handleCheckCodeWithProperty = (inputCode, property_id, API, setCheckCode) => {
	if (inputCode === '') {
		sweetAlert('', '입력된 코드값이 없습니다.<br/> 다시 한번 확인해주세요.', 'warning', 'center')
	} else {
		axios.get(API, {
			params: {
				checkCode: true,
				code:inputCode,
				property_id:property_id
			}
		})
		.then(res => {
			if (res.data) {
				sweetAlert('', '사용 가능한 코드입니다.', 'info', 'center')
				setCheckCode(true)
			} else {
				sweetAlert('', '중복된 코드가 존재합니다.<br/> 다시 한번 확인해주세요.', 'warning', 'center')
				setCheckCode(false)
			}
		})
	}
}

export const handleCheckCodeWithEmployeeClass = (inputCode, property_id, API, setCheckCode, emp_class) => {
	if (inputCode === '') {
		sweetAlert('', '입력된 코드값이 없습니다.<br/> 다시 한번 확인해주세요.', 'warning', 'center')
	} else {
		axios.get(API, {
			params: {
				checkCode: true,
				code:inputCode,
				property_id:property_id,
				employee_class:emp_class
			}
		})
		.then(res => {
			if (res.data) {
				sweetAlert('', '사용 가능한 코드입니다.', 'info', 'center')
				setCheckCode(true)
			} else {
				sweetAlert('', '중복된 코드가 존재합니다.<br/> 다시 한번 확인해주세요.', 'warning', 'center')
				setCheckCode(false)
			}
		})
	}
}

export const compareCodeWithProperty = (newCode, property_id, oldCode, API, setCheckCode) => {
	if (newCode === oldCode) {
		sweetAlert('', '중복된 코드가 존재합니다.<br/> 다시 한번 확인해주세요.', 'info', 'center')
		return false
	}
	if (newCode.length >= 1000) {
		sweetAlert('', '코드 길이가 1000자 이상입니다.<br/>길이를 줄여주세요.', 'warning', 'center')
		return false
	}
	handleCheckCodeWithProperty(newCode, property_id, API, setCheckCode)
}

export const compareCodeWithValueProperty = (newCode, property_id, oldCode, API, setCheckCode) => {
	const special_pattern = /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/
	if (newCode === oldCode) {
		sweetAlert('', '중복된 코드가 존재합니다.<br/> 다시 한번 확인해주세요.', 'info', 'center')
		return false
	}
	if (!special_pattern.test(newCode)) {
		sweetAlert('', '특수문자가 포함되어 있습니다.', 'warning', 'center')
		return false
	}
	if (newCode.length >= 1000) {
		sweetAlert('', '코드 길이가 1000자 이상입니다.<br/>길이를 줄여주세요.', 'warning', 'center')
		return false
	}
	handleCheckCodeWithProperty(newCode, property_id, API, setCheckCode)
}

export const compareCodeWithEmployeeClass = (newCode, property_id, oldCode, API, setCheckCode, emp_class) => {
	const special_pattern = /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/
	if (emp_class === undefined) {
		sweetAlert('', '직종을 선택해주세요.', 'warning', 'center')
		return false
	}
	if (newCode === oldCode) {
		sweetAlert('', '중복된 코드가 존재합니다.<br/> 다시 한번 확인해주세요.', 'info', 'center')
		return false
	}
	if (!special_pattern.test(newCode)) {
		sweetAlert('', '특수문자가 포함되어 있습니다.', 'warning', 'center')
		return false
	}
	if (newCode.length >= 1000) {
		sweetAlert('', '코드 길이가 1000자 이상입니다.<br/>길이를 줄여주세요.', 'warning', 'center')
		return false
	}
	handleCheckCodeWithEmployeeClass(newCode, property_id, API, setCheckCode, emp_class)
}

export const axiosPostPut = (pageType, page, API, formData, setSubmitResult = null) => {
	const actionType = pageType === 'register' ? '등록' : '수정'
	AXIOS[pageType](API, formData)
	.then(res => {
		if (res.status === 200) {
			axiosSweetAlert(`${page} ${actionType} 완료`, `${page} ${actionType}되었습니다.`, 'success', 'center', setSubmitResult)
		} else {
			sweetAlert(`${page} ${actionType} 실패`, `${page} ${actionType}이 실패했습니다.<br/>다시한번 확인 해주세요.`, 'warning', 'center')
		}
	})
	.catch(() => {
		sweetAlert(`${page} ${actionType} 실패`, `${page} ${actionType}이 실패했습니다.<br/>다시한번 확인 해주세요.`, 'warning', 'center')
	})
}

export const axiosPostPutRedux = (pageType, page, API, formData, dispatch, callback, isAbled = true) => {
	const actionType = pageType === 'register' ? '등록' : '수정'
	AXIOS[pageType](API, formData)
	.then(res => {
		if (res.status === 200) {
			sweetAlert(`${page} ${actionType} 완료`, `${page} ${actionType}이 완료되었습니다.`, 'success')
			dispatch(callback(isAbled))
		} else {
			sweetAlert(`${page} ${actionType} 실패`, `${page} ${actionType}이 실패했습니다.<br/>다시한번 확인 해주세요.`, 'warning')
		}
	})
	.catch(() => {
		sweetAlert(`${page} ${actionType} 실패`, `${page} ${actionType}이 실패했습니다.<br/>다시한번 확인 해주세요.`, 'warning')
	})
}

export const axiosDelete = (page, API, setSubmitResult = null) => {
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		icon: "warning",
		html: "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
		showCancelButton: true,
		showConfirmButton: true,
		heightAuto: false,
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
			axios.delete(API)
			.then(res => {
				if (res.status === 200) {
					axiosSweetAlert(`${page} 삭제 완료`, `${page} 삭제가 완료되었습니다.`, 'success', 'center', setSubmitResult)
				} else {
					sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
				}
			})
			.catch(() => {
				sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
			})
		} else {
			MySwal.fire({
				icon: "info",
				html: "취소하였습니다.",
				showCancelButton: true,
				showConfirmButton: false,
				heightAuto: false,
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

/**
 * 삭제시 parm이 필요한 삭제 통신
 * @param {*} page 
 * @param {*} API 
 * @param {*} parm 
 * @param {*} MOVEROUTER 
 * @param {*} navigator 
 */ 
export const axiosDeleteParm = (page, API, parm, MOVEROUTER, navigator, iconType = 'warning', etc = undefined) => {
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		icon: iconType,
		html: etc ?? "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
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
					const MySwal = withReactContent(Swal)
					MySwal.fire({
						title: `${page} 삭제 완료`,
						html: `${page} 삭제가 완료되었습니다.`,
						icon: 'success',
						customClass: {
							confirmButton: 'btn btn-primary',
							actions: `sweet-alert-custom center`
						}
					}).then(res => {
						if (res.isConfirmed === true || res.dismiss === 'backdrop') {
							navigator(MOVEROUTER)
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
			MySwal.fire({
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

export const axiosDeleteRedux = (page, API, reset = null, dispatch = null, callback = null, isAbled = true) => {
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		icon: "warning",
		html: "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
		showCancelButton: true,
		showConfirmButton: true,
		heightAuto: false,
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
			axios.delete(API)
			.then(res => {
				if (res.status === 200) {
					sweetAlert(`${page} 삭제 완료`, `${page} 삭제가 완료되었습니다.`, 'success')
					if (reset !== null) {
						reset()
					}
					if (dispatch !== null) {
						dispatch(callback(isAbled))
					}
				} else {
					sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
				}
			})
			.catch(() => {
				sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
			})
		} else {
			MySwal.fire({
				icon: "info",
				html: "취소하였습니다.",
				showCancelButton: true,
				showConfirmButton: false,
				heightAuto: false,
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

export const axiosManualHtmlDeleteRedux = (page, html, API, reset = null, dispatch = null, callback = null, isAbled = true) => {
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		icon: "warning",
		html: html,
		showCancelButton: true,
		showConfirmButton: true,
		heightAuto: false,
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
			axios.delete(API)
			.then(res => {
				if (res.status === 200) {
					sweetAlert(`${page} 삭제 완료`, `${page} 삭제가 완료되었습니다.`, 'success')
					if (reset !== null) {
						reset()
					}
					if (dispatch !== null) {
						dispatch(callback(isAbled))
					}
				} else {
					sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
				}
			})
			.catch(() => {
				sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
			})
		} else {
			MySwal.fire({
				icon: "info",
				html: "취소하였습니다.",
				showCancelButton: true,
				showConfirmButton: false,
				heightAuto: false,
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
export const setStringDate = (e, isHoursMinutes = false) => {
	const tempDateList = []
	const formatString = !isHoursMinutes ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"
	if (e.length === 1) {
		e.map((e) => {
			tempDateList.push(moment(e).format(formatString))
		})
		return tempDateList
	}
	if (e.length === 2) {
		e.map((e) => {
			tempDateList.push(moment(e).format(formatString))
		})
		return tempDateList
	}
}

export const selectListType = (keyword, row, label, value) => {
	let output = ''
	switch (keyword) {
		case 'custom1': // label: 이름(code), value:고유값
			output = {label: `${row[label[0]]}\n(${row[label[1]]})`, value: row[value]}
			break
		default: // label: 이름, value: 고유값
			output = {label: row[label[0]], value:row[value]}
			break
	}
	return output
}

// SelectList 만들기
export const makeSelectList = (emptyStart, type, dataList, list, setList, label, value) => {
	const tempList = []
	if (!emptyStart) {
		/* eslint-disable */
		list.length === 0 && tempList.push({label: '전체', value: ''})
	}
	dataList.map(row => tempList.push(selectListType(type, row, label, value)))

	if (list.length === 0) {
		setList(tempList)
	} else {
		setList(prevList => [...prevList, ...tempList])
	}
}

// getDetail Format
// 수정페이지 > 상세페이지 이동시 데이터 백업
export const setValueFormat = (detailBackUp, format, setValue, setPageType = null) => {
	Object.keys(detailBackUp).map(coulmn => {
		if (Object.keys(format).includes(coulmn)) {
			if (typeof (detailBackUp[coulmn]) === 'object' && detailBackUp[coulmn] !== null) {
				// 형태가 coulmn: {label: '', value: ''} 인 경우
				setValue(coulmn, {label: detailBackUp[coulmn].name, value: detailBackUp[coulmn].id})
			} else {
				// 형태가 coulmn: '' 인 경우
				setValue(coulmn, detailBackUp[coulmn] !== 'null' ? detailBackUp[coulmn] : '')
			}
		}
	})
	if (setPageType !== null) {
		setPageType('detail')
	}
}

// formData Setting
export const setFormData = (data, formData) => {
	Object.keys(data).map(coulmn => {
		if (typeof (data[coulmn]) === 'object' && data[coulmn] !== null) {
			// 형태가 coulmn: {label: '', value: ''} 인 경우
			formData.append(coulmn, data[coulmn].value)
		} else {
			// 형태가 coulmn: '' 인 경우
			formData.append(coulmn, data[coulmn])
		}
	})
}
export const dataTableClickStyle = (id) => {
	const temp = [
		{
			when: row => row.id === id, // 특정 조건을 확인
			style: {
			background: '#B9B9C31A', // 변경할 스타일
			color: 'black'
			}
		}
	]
	return temp
}

export const pickerDateChange = (picker) => {
	const pickerlist = []
	pickerlist.push(moment(picker[0]).format('YYYY-MM-DD 00:00:00'))
	pickerlist.push(moment(picker[1]).format('YYYY-MM-DD 23:59:59'))
	return pickerlist
}

export const pickerDateNullChange = (picker) => {
	const pickerlist = []
	if (picker[0]) {
		pickerlist.push(moment(picker[0]).format('YYYY-MM-DD 00:00:00'))
		pickerlist.push(moment(picker[1]).format('YYYY-MM-DD 23:59:59'))
	}
	return pickerlist
}

export const dateFormat = (data) => {
	if (data !== null && data !== undefined) {
		return moment(data).format('YYYY-MM-DD')
	}
}

export const renderFilePreview = (file) => {
	if (file !== null) {
		if (file.type !== undefined) {
			return (
			<img
				className='rounded'
				alt={file.name}
				src={URL.createObjectURL(file)}
				height='25'
				width='25'
			/>
			)
		} else {
			return (
			<img
				className='rounded'
				alt={file.name}
				src={file}
				height='25'
				width='25'
			/>
			)
		}
	}
}

export const customFileBadge = (data) => {
	if (data === 'xlsx') {
		return (
			<img src={Xlsx} height='25' width='25'/>
		)
	} else if (data === 'txt') {
		return (
			<img src={Txt} height='25' width='25'/>
		)
	} else if (data === 'jpg') {
		return (
			<img src={Jpg} height='25' width='25'/>
		)
	} else if (data === 'jpeg') {
		return (
			<img src={Jpeg} height='25' width='25'/>
		)
	} else {
		return (
			<img src={Unknown} height='25' width='25'/>
		)
	}
}

export const CalculateTotalScore = (scores) => {
	let totalScore = 0 // scores = {label:'', value: }
	Object.values(scores).forEach((selector) => {
		totalScore += selector.value
	})
	return totalScore
}


/** sweetAlert 출력후 바로 페이지 이동 */ 
export const axiosPostPutNavi = (pageType, page, API, formData, navigate, MOVEROUTER) => {
	const actionType = pageType === 'register' ? '등록' : '수정'
	AXIOS[pageType](API, formData)
	.then(res => {
		if (res.status === 200) {
			const MySwal = withReactContent(Swal)
			MySwal.fire({
				title: `${page} ${actionType} 완료`,
				html: `${page} ${actionType}이 완료되었습니다.`,
				icon: 'success',
				customClass: {
					confirmButton: 'btn btn-primary',
					actions: `sweet-alert-custom center`
				}
			}).then(res => {
				if (res.isConfirmed === true || res.dismiss === 'backdrop') {
					navigate(MOVEROUTER)
				}
			})
		}
	})
	.catch(() => {
		sweetAlert(`${page} ${actionType} 실패`, `${page} ${actionType}에 실패하였습니다.`, 'warning')
	})
}

export const axiosDeleteNavi = (page, API, navigate, MOVEROUTER) => {
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		icon: "warning",
		html: "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
		showCancelButton: true,
		showConfirmButton: true,
		heightAuto: false,
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
			axios.delete(API)
			.then(res => {
				if (res.status === 200) {
					sweetAlert(`${page} 삭제 완료`, `${page} 삭제가 완료되었습니다.`, 'success', 'center')
					navigate(MOVEROUTER)
				} else {
					sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
				}
			})
			.catch(() => {
				sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
			})
		} else {
			MySwal.fire({
				icon: "info",
				html: "취소하였습니다.",
				showCancelButton: true,
				showConfirmButton: false,
				heightAuto: false,
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

/** YYYY년 MM월 DD일 */
export function getKorYYMMDD (yymmdd) {
	return (`${yymmdd.substr(0, 4)}년 ${yymmdd.substr(5, 2)}월 ${yymmdd.substr(8, 2)}일`)
}

/** 오전 or 오후 HH시 MM분 */
export function getKorAmPmHHMMSS (hhmmss) {
	let hh = parseInt(hhmmss.substr(0, 2))
	const amPm = hh >= 12 ? '오후' : '오전'
	hh = hh > 12 ? hh - 12 : hh
	hh = hh < 10 ? `0${hh}` : hh
	return (`${amPm} ${hh}시 ${hhmmss.substr(3, 2)}분`)
}

/** input value 값에 Comma 추가
 * @param {} value number or str
 */ 
export const addCommaNumber = (value) => {
	return typeof value === 'number' ? value.toLocaleString('ko-KR') : value
}

/** input onChange 에 Comma 추가
 * @param {SyntheticEvent} e input event
 * @param {function} onChange input onChange 
 * @param {boolean} isInt input value type is int default false
 * @param {} before no useform input, use before numeric value
 * @returns current comma numeric input value
 */ 
export const AddCommaOnChange = (e, onChange = undefined, isInt = false, before) => {
	const value = e.target.value
	const caret = e.target.selectionEnd
	const tempValue = e.target.defaultValue
	const parts = value.toString().split(".")
	let commaNum = parts[0].replace(/,/g, '')
	const strList = Array.from(commaNum)

	if (strList.length > 1 && strList[0] === '0') { // 0으로 시작할때 예외처리
		if (strList[1] === '0') {
			e.target.value = 0
			if (onChange) onChange(e)
			return 0
		}
		e.target.value = strList[1] // 0을 지우고 입력한 숫자를 입력
		if (onChange) onChange(e)
		return strList[1]
	}

	// 문자열 입력방지 부분
	const inputData = e.nativeEvent.data 
	const notNum = !isInt ? /[^0-9\.]/gi : /[^0-9]/gi
	if (inputData !== null && notNum.test(inputData)) { // 입력한 데이터가 숫자인지 체크
		if (onChange) {
			e.target.value = tempValue
			e.target.selectionStart = caret === 0 ? 0 : caret-1
			e.target.selectionEnd = caret === 0 ? 0 : caret-1
			onChange(e)
			return tempValue
		}
		e.target.value = before
		e.target.selectionStart = caret === 0 ? 0 : caret-1
		e.target.selectionEnd = caret === 0 ? 0 : caret-1
		return before
	}

	// 소숫점 입력시
	if (!isInt && parts.length > 1) parts[1] = parts[1].replace(/,/g, '') // 소숫점 이하 쉼표제거
	parts[0] = commaNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	const result = parts.join(".")
	e.target.value = result

	const inputType = e.nativeEvent.inputType
	if (inputType !== 'deleteContentBackward' && value.length < result.length) { // 새로 쉼표가 들어가면
		e.target.selectionStart = caret+1
		e.target.selectionEnd = caret+1
		if (onChange) onChange(e)
		return result
	}

	if (inputType === 'deleteContentBackward' && value.length > result.length) {
		e.target.selectionStart = caret === 0 ? 0 : caret-1
		e.target.selectionEnd = caret === 0 ? 0 : caret-1
	} else {
		e.target.selectionStart = caret
		e.target.selectionEnd = caret
	}

	if (onChange) onChange(e)
	return result
}// AddCommaOnChange end

/** Comma add return value
 * @param {} e input event
 */ 
export const addCommaReturnValue = (value) => {
	if (value === '') {
		return 0
	}
	const parts = value.toString().split(".")
	parts[0] = parts[0].replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	return parts.join(".")
}// addCommaReturnValue end

/** value 값에 Comma 제거
 * @param {} value number or str
 */ 
export const getCommaDel = (value) => {
	if (typeof value === 'number') {
		return parseFloat(value.toString().replace(/,/g, ''))
	}
	return parseFloat(value.replace(/,/g, ''))
}

/** NaN infinite 검사해서 0 처리 하거나 해당 값을 반환
 * @param {} result number or str
 */ 
export const resultCheckFunc = (result, isOnlyNum = false) => {
	if (Number.isNaN(result) || !Number.isFinite(result)) {
		if (isOnlyNum) {
			return 0
		}
		return ''
	} 
	if (isOnlyNum && Number(result) < 0) return 0
	return Number(result)
}

export function checkOnlyView (redux, code, type) {
	if (redux.property.isOnlyView) return true
	else {
		const checkFunction = redux.menuList.filter(menu => menu.code === code)
		return !checkFunction[0][type]
	}
}

export function checkAuth (redux, code, type) {
    const checkFunction = redux.menuList.filter(menu => menu.code === code)
    return !checkFunction[0][type]
}

/** 자동으로 휴대폰 번호에 하이픈 삽입
 * @param {} e input event
 * @param {} onChange input onChange 
 */ 
export const autoPhoneNumberHyphen = (e, onChange) => {
	e.target.value = e.target.value
	  .replace(/[^0-9]/g, '')
	  .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
	onChange(e.target.value)
}

/**
 * (sign 관련 func) 현재 유저가 결재 라인에 등록된 유저 인지 체크
 * @param {*} activeUser 현재 접속 유저
 * @param {*} userList 결재라인 등록 유저리스트
 * @returns 결재권한이 있다면 true 결재 권한이 없다면 false
 */
export function signAuthCheck(activeUser, userList) {
	for (const user of userList) {
		if (user.user === activeUser) return true
	}
	return false
}

/**
 * (sign 관련 func) 현재 클릭한 박스의 전결권을 현재 접속 유저가 가지고 있는지 체크
 * @param {*} activeUser 현재 접속 유저
 * @param {*} preSigns 현재 클릭한 박스 기준으로 이전 결재라인 등록 유저리스트 ex) reportsgin 52line 참고
 * @returns 전결권이 있다면 true 없다면 false
 */
export function signNotNullCheck(activeUser, preSigns) { // 전결권 검색
	for (const sign of preSigns) {
		if ((sign.user && sign.user !== '')) {
			if (sign.user === activeUser) return true
			return false
		}
	} // for end
} // signNotNullCheck end

/**
 * (sign 관련 func) 현재 클릭된 박스의 이전의 결재가 진행됬는지 체크
 * @param {*} index 현재 클릭된 박스의 인덱스
 * @param {*} preSigns 현재 클릭한 박스 기준으로 이전 결재라인 등록 유저리스트
 * @returns result: true/false, index: sign.view_order
 */
export function signPreCheck(index, preSigns) { // 이전 결재 검색
	for (const sign of preSigns) {
		if (( getObjectKeyCheck(sign, 'user') !== '' && sign.user && sign.user !== '')) {
			if (sign.type !== 0 && sign.type !== 3) { // 0 1 2
				return {result: true, index: sign.view_order}
			}
			return {result: false, index: sign.view_order}
		}
	} // for end
}

/**
 * (sign 관련 func) 현재 유저가 결재 라인에 등록된 유저 일때 결재 버튼을 표시하는 로직
 * @param {*} activeUser 현재 접속 유저
 * @param {*} userList 결재라인 등록 유저리스트
 * @returns 결재 와 전결 중 진행해야 할 작업이 있다면 true를 반환
 */
export function isSignPreSignCheck(activeUser, userList, preSign=true) {
	// 결재 권한이 있는 유저가 접속했을때만 실행됨.
	let signUser = undefined
	let preSignUser = undefined
	for (const user of userList) { // 접속 유저의 결재 정보
		if (activeUser === user.user) {
			signUser = user
			break
		}
	} // for end
	if (preSign) {
		if (signUser.view_order !== 3) {
			for (const user of userList) { // 접속 유저의 전결권 결재 정보
				if ((user.view_order > signUser.view_order) && (user.user && user.user !== '')) {
					preSignUser = user
					break
				}
			}
		} //  if end
		if (preSignUser) { // 전결 정보가 있을때
			if(!preSignUser.is_final || !signUser.is_final) return true // 결재와 전결 중 해야할 것이 있다면 버튼 표시
			return false // 전결 정보가 있으나 결재와 전결 전부 했다면 미표시
		}
	}
	if (!signUser.is_final) { // 전결 정보가 없을때
		return true // 접속유저의 결재를 해야한다면 표시
	}
	return false //
}

export const handleDownload = (name, orangeName) => {
	axios({
		url: `${UTILS_URL}/static_backend/${(name)}`,
		method: 'GET',
		responseType: 'blob'
	}).then((response) => {
		const url = window.URL.createObjectURL(new Blob([response.data]))
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('download', `${orangeName}`)
		document.body.appendChild(link)
		link.click()
	})
}

/**
 * callback type 데이터 조회 함수
 * @param {*} API backend api url
 * @param {*} param backend send param
 * @param {*} callback callback func
 */
export const getTableDataCallback = (API, param, callback) => {
	axios.get(API, {
		params: param
	})
	.then(res => {
		callback(res.data)
	})
	.catch(res => {
		console.log(API)
		console.log(res)
	})
}

/** return id sweetAlert 출력후 바로 페이지 이동 */ 
export const axiosPostPutNaviCustom = (pageType, page, API, formData, navigate, MOVEROUTER) => {
	const actionType = pageType === 'register' ? '등록' : '수정'
	AXIOS[pageType](API, formData)
	.then(res => {
		const id = res.data
		const naviRouter = pageType === 'register' ? MOVEROUTER : `${MOVEROUTER}/${id}`
		if (res.status === 200) {
			const MySwal = withReactContent(Swal)
			MySwal.fire({
				title: `${page} ${actionType} 완료`,
				html: `${page} ${actionType}이 완료되었습니다.`,
				icon: 'success',
				customClass: {
					confirmButton: 'btn btn-primary',
					actions: `sweet-alert-custom center`
				}
			}).then(res => {
				if (res.isConfirmed === true || res.dismiss === 'backdrop') {
					navigate(naviRouter)
				}
			})
		}
	})
	.catch(() => {
		sweetAlert(`${page} ${actionType} 실패`, `${page} ${actionType}에 실패하였습니다.`, 'warning')
	})
}

/**
 * 비동기 통신 이후 callback형태의 func을 실행
 * @param {*} pageType 페이지 타입 register : modify
 * @param {*} page 페이지 명 alert에 출력
 * @param {*} API request url
 * @param {*} formData request data
 * @param {*} callback response 이후 callback형태로 실행
 */
export const axiosPostPutCallback = (pageType, page, API, formData, callback = undefined, isAlert = true, etc = undefined) => {
	const actionType = pageType === 'register' ? '등록' : '수정'
	AXIOS[pageType](API, formData)
	.then(res => {
		if (res.status === 200) {
			if (isAlert){
				sweetAlertCallback(`${page} ${etc !== undefined ? etc : actionType} 완료`, `${page} ${etc !== undefined ? etc : actionType}되었습니다.`, 'success', 'center', function () {
					if (callback) {
						callback(res.data)
					}
				})
				return
			}
			if (callback) {
				callback(res.data)
			}
		} else {
			if (isAlert) sweetAlert(`${page} ${etc !== undefined ? etc : actionType} 실패`, `${page} ${etc !== undefined ? etc : actionType}이 실패했습니다.<br/>다시한번 확인 해주세요.`, 'warning', 'center')
		}
	})
	.catch(() => {
		if (isAlert) sweetAlert(`${page} ${etc !== undefined ? etc : actionType} 실패`, `${page} ${etc !== undefined ? etc : actionType}이 실패했습니다.<br/>다시한번 확인 해주세요.`, 'warning', 'center')
	})
}

/**
 * 
 * @param {*} page 페이지 명 alert에 출력
 * @param {*} API request url
 * @param {*} callback response 이후 callback형태로 실행
 * @param {*} value response의 data가 아니라 지정된 값의 param을 사용 경우
 */
export const axiosDeleteCallback = (page, API, callback = undefined, value = undefined) => {
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		icon: "warning",
		html: "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
		showCancelButton: true,
		showConfirmButton: true,
		heightAuto: false,
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
			axios.delete(API)
			.then(res => {
				if (res.status === 200) {
					sweetAlert(`${page} 삭제 완료`, `${page} 삭제가 완료되었습니다.`, 'success', 'center')
					if (callback && value) {
						callback(value)
					} else if (callback) {
						callback(res.data)
					}
				} else {
					sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
				}
			})
			.catch(() => {
				sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
			})
		} else {
			MySwal.fire({
				icon: "info",
				html: "취소하였습니다.",
				showCancelButton: true,
				showConfirmButton: false,
				heightAuto: false,
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
/**
 * 파일의 갯수를 제한을 걸어서 files state handle func
 * @param {*} e event param
 * @param {*} files files state
 * @param {*} setFiles files set func
 * @param {*} limit files upload limit length
 * @param {*} showNames old files
 * @param {*} setShowNames old files set func
 * @param {*} setFileError files error set func
 * @param {*} setSelectedFiles files display state set func
 * @param {*} title sweeAlert title string
 */
export const handleFileInputLimitedChange = (e, files, setFiles, limit=6, showNames=undefined, setShowNames=undefined, setSelectedFiles=undefined, title='업로드 파일', fileMaxSize=undefined, sizeOverMessage=undefined) => {
	const inputFiles = Array.from(e.target.files)
	const copyFiles = [...files]
	const copyOldFiles = showNames ? [...showNames] : undefined
	const oldLFileLength = copyOldFiles ? copyOldFiles.length : 0
	if (fileMaxSize && e.target.files[0].size > fileMaxSize) {
		sweetAlert('', `${title}은 ${sizeOverMessage}`, 'warning')
		e.target.value = null
		return
	}
	let totalFilesLength = copyFiles.length + inputFiles.length + oldLFileLength
	if (totalFilesLength > limit) {
		sweetAlert('', `${title}은 ${limit}개 이하로만 등록이 가능합니다.`, 'warning')
		e.target.value = null
		return
	}
	const resultArray = [
		...copyFiles,
		...inputFiles.map(file => Object.assign(file))
	]
	if (setSelectedFiles !== undefined) setSelectedFiles(resultArray)
	setFiles(resultArray)
}

/** 
 * 표 높이 값 리턴 
 * @param {String} purpose date to format*/
export const getHeight = (purpose) => {
	switch (purpose) {
		case 'list':
		case 'template': return '200px'
		case 'auth': return '400px'
	}
}

/** return id sweetAlert 출력후 바로 페이지 이동 */ 
export const axiosPostPutNaviAlertCustom = (pageType, page, API, formData, navigate, MOVEROUTER, message) => {
	const actionType = pageType === 'register' ? '등록' : '수정'
	AXIOS[pageType](API, formData)
	.then(res => {
		if (res.status === 200) {
			const MySwal = withReactContent(Swal)
			MySwal.fire({
				title: `${message}`,
				html: `${page} ${actionType}이 완료되었습니다.`,
				icon: 'success',
				customClass: {
					confirmButton: 'btn btn-primary',
					actions: `sweet-alert-custom center`
				}
			}).then(res => {
				if (res.isConfirmed === true || res.dismiss === 'backdrop') {
					navigate(MOVEROUTER)
				}
			})
		}
	})
	.catch(() => {
		sweetAlert(`${page} ${actionType} 실패`, `${page} ${actionType}에 실패하였습니다.`, 'warning')
	})
}

/**
 * 
 * @param {*} html 페이지 명 alert에 출력
 * @param {*} callback response 이후 callback형태로 실행
 */
export const checkRealDoing = (html, callback) => {
	const MySwal = withReactContent(Swal)
	MySwal.fire({
		icon: "warning",
		html: html,
		showCancelButton: true,
		showConfirmButton: true,
		heightAuto: false,
		cancelButtonText: "취소",
		confirmButtonText: '확인',
		confirmButtonColor : primaryColor,
		reverseButtons :true,
		customClass: {
			actions: 'sweet-alert-custom right',
			cancelButton: 'me-1'
		}
	}).then((res) => {
		if (res.isConfirmed) callback()
		else sweetCancleAlert()
	})
}

export const checkApp = window.navigator.userAgent.includes('work_app')

export const gotoErrPage = (navigate) => {
	navigate('/error')
}

export const getScheduleCycle = (row) => {
	const dayOptionKr = {
		0 : '(주말/공휴일의 경우 그대로 생성)',
		'-1' : '(주말/공휴일의 경우 이전 평일에 생성)',
		1 : '(주말/공휴일의 경우 다음 평일에 생성)'
	}

	if (row.maintenance_cycle === 'everyday') {
		let tempChoice = '매일'
		if (row.period !== 1) {
			tempChoice = `${row.period} 일마다`
		}
		return tempChoice
	} else if (row.maintenance_cycle === 'everyWeek') {
		let tempChoice = '매주'
		let tempDayOfWeek = ''
		if (row.period !== 1) {
			tempChoice = `${row.period} 주마다`
		}
		if (row.day_of_week !== null) (row.day_of_week.split(',')).map(i => { tempDayOfWeek += weekdayNumberKr[i.trim()] })
		return `${tempChoice } - ${tempDayOfWeek}`
	} else if (row.maintenance_cycle === 'everyMonthDay') {
		let tempChoice = '매월'
		let tempDayOfWeek = ''
		let tempMonthOfWeek = ''
		if (row.period !== 1) {
			tempChoice = `${row.period} 개월마다`
		}
		row.day_of_week.split(',').map(i => { tempDayOfWeek += weekdayNumberKr[i.trim()] })
		row.week_of_month.split(',').map((i, index) => {
			if (index > 0) {
				tempMonthOfWeek += `,${weekMonthKr[i.trim()]}` 	
			} else {
				tempMonthOfWeek += weekMonthKr[i.trim()]
			}
		})
		return `${tempChoice } - ${tempMonthOfWeek} ${tempDayOfWeek}`
	} else if (row.maintenance_cycle === 'everyMonthDate') {
		let tempChoice = '매월'
		let temp = ''
		if (row.period !== 1) {
			tempChoice = `${row.period} 개월마다`
		}
		if (row.last_day === true) {
			temp = `마지막날 ${dayOptionKr[row.option]}`
		} else {
			let day = ''
			row.date_choice.split(',').map((i, index) => {
				if (index > 0) {
					day += `,${i.trim()}일` 	
				} else {
					day += `${i.trim()}일` 
				}
			})
			temp = `${day}`
		}
		return `${tempChoice} - ${temp}`
	}
}

/**
 * MutationObserver를 통해 node를 Observer하므로 useEffect와 유사한 기능을 하도록 제작
 * @param {String} node document queryselect string (ex 'div.noteOne .note-editable')
 * @param {Function} callback observer callback
 * @param {Object} option observer option
 */
export const useObserver = (node='', callback = undefined, option=undefined) => {
	const temp = document.querySelector(node)?.childNodes[0]
	let observer = new MutationObserver((mutations, observerObj) => {
		if (callback) {
			callback(mutations, observerObj)
		}
	})
	if (!option) {
		option = {
			childList: true,
			characterData: true,
			subtree: true
		}
	}
	observer.disconnect()
	if (temp !== undefined && temp !== null) observer.observe(temp, option)
 }
 