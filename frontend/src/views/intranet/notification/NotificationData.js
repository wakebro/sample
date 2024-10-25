import * as moment from 'moment'
import * as yup from 'yup'

export const NotificationColumn = [
    {
        name:'구분',
        width:'150px',
        cell: row => row.type
    },
    {
        name:'발신자',
        width:'150px',
        cell: row => row.sender
    },
    {
        name:'수신자',
        width:'150px',
        cell: row => row.receiver
    },
    {
        name:'제목',
        minWidth:'400px',
        style: {
            width:'100%',
            justifyContent: 'left'
        },
        cell: row => row.subject
    },
    {
        name:'발송일',
        width:'200px',
        cell: row => moment(row.send_date).format('YYYY-MM-DD HH:mm:ss')
    }
]

export const columns = [
    {
        name: '그룹명',
        sortable: true,
        selector: row => row.name,
        width:'35%'
    },
    {
        name: '직종',
        sortable: true,
        selector: row => row.employee_class

    },
    {
        name: '등록자',
        sortable: true,
        selector: row => row.register_user
    },
    {
        name: '수신인원',
        sortable: true,
        selector: row => row.receiver_count
    }
]

export const defaultValues = {
    subject: '',
    body: ''
}

export const selectList = [
    {value:'직원', label:'직원'},
    {value:'건물', label:'회사'}
]

export const resultSelectList = [
    {value:'', label:'수신/발신'},
    {value:'수신', label:'수신'},
    {value:'발신', label:'발신'}
]

function countBytes(text) {
    return new Blob([text]).size
  }

export const validationSchemaInconv =  
    yup.object().shape({
        subject: yup.string().required('알림명을 입력해주세요.').max(100, '알림명은 100자 내여야 합니다.').test('maxBytes', '1000바이트 이하로 작성해주세요.', function (value) {
            return countBytes(value) <= 1000
        }),
        body: yup.string().required('알림 내용을 입력해주세요.').test('maxBytes', '3000바이트 이하로 작성해주세요.', function (value) {
            return countBytes(value) <= 3000 
        })
    })

export const validationSchema = yup.object().shape({
    title: yup.string().required('제목을 입력해주세요').min(1, '1자 이상 입력해주세요')

})