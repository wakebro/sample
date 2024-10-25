import * as yup from 'yup'

export const defaultValues = {
    code:'',
    preserve_year: 5,
    department:'', // 부서??
    report_date:'',
    arbitary_cause:'',
    agreement:'',
    title:'',
    purpose:'',
    company_name:'',
    execution_amount:0,
    content:'',
    budget: 0,
    recently_total:0,
    balance:'',
    processing_items:''
}

export const validationSchema = yup.object().shape({
    preserve_year: yup.number('보존년한을 입력해주세요.').required('보존년한을 입력해주세요.').positive('양수를 입력해주세요.').typeError('보존년한을 입력해주세요.'),
    department: yup.string().required('부서를 입력해주세요.').min(0, '1자 이상 입력해주세요'),
    arbitary_cause: yup.string().required('전결근거 및 전결권자를 입력해주세요.').min(1, '1자 이상 입력해주세요'),
    budget: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').required('출고수량을 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return '0'
        return value
    }).matches(/^[^0]/, '1 이상 값을 입력해주세요.'),
    recently_total: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').required('출고수량을 입력해주세요.').transform((value, originalValue) => {
        if (originalValue === "") return '0'
        return value
    }).matches(/^[^0]/, '1 이상 값을 입력해주세요.'),
    report_date: yup.array().test('isNonEmpty', '기안일자를 입력해주세요.', function(value) {
        return value
    }).nullable(),
    execution_amount: yup.string().required('집행금액을 입력해주세요.').matches(/^[\d,\.]+$/g, '음수는 입력할 수 없습니다.')
})

export const signListObj = {
	0: '담당자',
	1: '1차결재자',
	2: '2차 결재자',
	3: '최종 결재자'
}