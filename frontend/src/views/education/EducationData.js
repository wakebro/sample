import * as yup from 'yup'
import { Fragment } from "react"
import legalImg from '@src/assets/images/legal_blue.png'
import generalImg from '@src/assets/images/general_blue.png'
import safetyImg from '@src/assets/images/safety_blue.png'
import cooperateImg from '@src/assets/images/cooperate_blue.png'

export const SafetyEducationColumn = [
    {
        name:'교육명',
        width:'41%',
        cell: row => (<Fragment key={row.id}>{row.subject}</Fragment>),
        style: { justifyContent:'left' }
    },
    {
        name:'교육인원',
        width:'29%',
        cell: row => <Fragment key={row.id}>{row.target_count}</Fragment>
        // <Fragment key={row.id} style={{ width:'100%', textAlign: 'center' }}>{row.target_count}</Fragment>
    },
    {
        name:'교육일자',
        width:'30%',
        cell: row => <Fragment key={row.id}>{row.start_date}</Fragment>
    }
]

export const timelineImgList = [
    {legal: legalImg},
    {general: generalImg},
    {safety: safetyImg},
    {cooperate: cooperateImg}
]

export const bigTitleObj = {
    legal: '법정교육관리',
    general: '일반교육관리',
    safety: '안전교육관리',
    cooperator: '외주업체교육관리'
}

export const titleObj = {
    legal: '법정교육',
    general: '일반교육',
    safety: '안전교육',
    cooperator: '외주업체교육'
}

export const defaultValues = {
    subject: '',
    training_time: '',
    target_count: '',
    comment: '',
    employee_class: {label:'전체', value:''}
}

export const pageTypeKor = {
	register : '등록',
	modify : ' 수정'
}

export const validationSchemaInconv =  
    yup.object().shape({
        subject: yup.string().required('교육명을 입력해주세요.'),
        date: yup.array().test('isNonEmpty', '교육일자를 입력해주세요.', function(value) {
            return value && value.length > 0
        }),
        training_time: yup.number().min(1, '1이상 값을 입력해주세요.').transform(value => (isNaN(value) ? undefined : value)).required('교육시간을 입력해주세요!!'),
        target_count: yup.number().min(1, '1이상 값을 입력해주세요.').transform(value => (isNaN(value) ? undefined : value)).required('교육인원을 입력해주세요!!'),
        comment: yup.string().required('교육 내용을 입력해주세요.')
    })
