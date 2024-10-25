import Timeline from '@components/timeline'
import Avatar from '@components/avatar'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { timelineImgList } from '../EducationData'
import { ROUTE_EDUCATION } from "../../../constants"
import * as moment from 'moment'

const CooperatorTimeline = (props) => {
    const { userData, cooperatorData } = props
    const [cooperatorTableData, setCooperatorTableData] = useState([])

    useEffect(() => {
        if (cooperatorData.length > 0) {
            let count = 0
            userData.map((data) => {
                count += data.employee.length
            })
            const result = []
            let empCount = 0
            cooperatorData.map((data, idx) => {
                if (idx < 4) {
                    const imagePath = timelineImgList.find((img) => data.type in img)[data.type]
                    const tempData = {
                        title: data.subject,
                        content: moment(data.start_date).format('MM월 DD일'),
                        meta: '',
                        metaClassName: 'me-1',
                        color: 'cooperator',
                        customContent: (
                            <div className='d-flex align-items-center'>
                            <Avatar  img={imagePath} type='button' tag={Link} to={`${ROUTE_EDUCATION}/cooperator/detail/${data.id}`}/>
                            <div className='ms-50'>
                                {data.participants.map((user, index) => {
                                    const name = user.participant_name.split('(')
                                    if (user.belong === null) {
                                        empCount++
                                    }
                                    if (data.participants.length > 4) {
                                        if (index + 1 === data.participants.length) {
                                            if (count === empCount) {
                                                return (
                                                    <span key={index}>전체</span>
                                                )
                                            } else {
                                                const user = data.participants[0]
                                                return (
                                                    <span key={index}>{user.participant_name.split('(')[0]} 외 {data.participants.length - 1}명</span>
                                                    )
                                                }
                                            }
                                    }
                                    if (index + 1 === data.participants.length) {
                                        return (
                                            <span key={index}>{name[0]}</span>
                                        )
                                    } 
                                    if (data.participants.length < 5) {
                                        return (
                                            <span key={index}>{name[0]},&nbsp;</span>
                                        )
                                    }
                                })}
                            </div>
                            </div>
                        )
                    }
                    result.push(tempData)
                    empCount = 0
                }
            })
            setCooperatorTableData(result)
        }

    }, [userData, cooperatorData])

    return (
        <div>
            { cooperatorTableData &&
                <Timeline className='ms-50 mb-0 general' data={cooperatorTableData} />
            }
        </div>
    )

}
export default CooperatorTimeline