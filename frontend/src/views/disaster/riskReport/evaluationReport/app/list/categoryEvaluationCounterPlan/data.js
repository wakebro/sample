import { CHECKLIST, FREQUENCY_3X3, FREQUENCY_5X5, NOMAL, STEP_3, getMultiResult, getStrGradeApp, val2Label } from "../../../web/data"

export const PREV = 0
export const NEXT = 1

export function handleBordlerCss(type, value) {
	if (value === undefined || value === null || value === '') {
		return {width:'100px', height:'70px', display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#F4F4F4', border:'1px solid'}
	} else {
		const dangerousness = getMultiResult(type, value)
		if (dangerousness >= NOMAL) {
			return {width:'100px', height:'70px', display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#FDEAEB', border:'1px solid', borderColor:'#CB2021'}
		} else {
			return {width:'100px', height:'70px', display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#EAFDED', border:'1px solid', borderColor:'#1FAD4F'}
		}
	}
}

export function handleResult(type, value) {
	const dangerousness = getMultiResult(type, value)
	if (type === FREQUENCY_3X3 || type === FREQUENCY_5X5) {
		return (
			<>
				<div style={{fontSize:'40px', fontFamily:'Pretendard-Regular', color:`${dangerousness >= NOMAL ? '#CB2021' : '#1FAD4F'}`}}>{value}</div>
				<div style={{fontSize:'20px', fontFamily:'Pretendard-Regular', color:`${dangerousness >= NOMAL ? '#CB2021' : '#1FAD4F'}`}}>{getStrGradeApp(type, dangerousness)}</div>
			</>
		)
	} else if (type === STEP_3) {
		return (
			<div style={{fontSize:'40px', fontFamily:'Pretendard-Regular', color:`${dangerousness >= NOMAL ? '#CB2021' : '#1FAD4F'}`}}>{val2Label(type, value) !== undefined ? val2Label(type, value).label : ''}</div>
		)
	} else if (type === CHECKLIST) {
		return (
			<div style={{fontSize:'20px', fontFamily:'Pretendard-Regular', color:`${dangerousness >= NOMAL ? '#CB2021' : '#1FAD4F'}`}}>{val2Label(type, value) !== undefined ? val2Label(type, value).label : ''}</div>
		)
	}
}