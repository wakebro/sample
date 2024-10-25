import axios from 'axios'
import { Fragment } from "react"
import * as moment from 'moment'

export const AnnouncementColumn = [
    {
        name:'사업소',
        cell: row => <Fragment>{row.property_name}</Fragment>
    },
    {
        name:'날짜',
        cell: row => <Fragment>{moment(row.create_datetime).format('MM월 DD일')}</Fragment>
    },
    {
        name:'제목',
        cell: row => <Fragment>{row.subject}</Fragment>
    }
]

export const NoticeColumn = [
    {
        name:'날짜',
        cell: row => <Fragment>{moment(row.send_date).format('MM월 DD일 HH시mm분')}</Fragment>
    },
    {
        name:'알림',
        cell: row => <Fragment>{row.subject}</Fragment>
    },
    {
        name:'발송/수신 여부',
        cell: row => <Fragment>{row.type}</Fragment>
    }
]

export const MailColumn = [
    {
        name:'날짜',
        cell: row => <Fragment>{moment(row.date).format('MM월 DD일')}</Fragment>
    },
    {
        name:'문서명',
        cell: row => <Fragment>{row.title}</Fragment>
    },
    {
        name:'발신자',
        cell: row => <Fragment>{row.sender}</Fragment>
    }
]

export const CustomGetTableData = (API, param, setData) => {
    axios.get(API, {
        params: param
    })
    .then(res => {
        const data = []
        for (let i = 0; i < res.data.length; i++) {
            if (i < 5) {
                data.push(res.data[i])
            }
        }
        setData(data)
        
    })
    .catch(res => {
        console.log(API, res)
    })
}
