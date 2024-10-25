// FlatPickr 기간 설정
export const setRangeDate = (e, setRangeDate) => {
	const tempDateList = []
	if (e.length === 2) {
		e.map((e) => {
			const sYear = e.getFullYear()
			const sMonth = (e.getMonth() + 1) > 9 ? (e.getMonth() + 1) : `0${(e.getMonth() + 1)}`
			const sDate = (e.getDate()) > 9 ? e.getDate() : `0${e.getDate()}`
			tempDateList.push(`${sYear}-${sMonth}-${sDate}`)
		})
		setRangeDate(tempDateList)
	}
}

// 날짜 1주일 range
export const getDatetime = (setDatePlaceholder) => {
	try {
		const today = new Date()
		let strRange = `${getDateStr(today, '-')} - `
		today.setDate(today.getDate() + 7)
		strRange += `${getDateStr(today, '-')}`

		setDatePlaceholder(strRange)
	} catch (e) {
		console.log('getDatetime : ', e)
	}
}
const getDateStr = (date, gubun) => {
	const sYear = date.getFullYear()
	let sMonth = date.getMonth() + 1
	let sDate = date.getDate()

	sMonth = sMonth > 9 ? sMonth : `0${sMonth}`
	sDate  = sDate > 9 ? sDate : `0${sDate}`
	return sYear + gubun + sMonth + gubun + sDate
}