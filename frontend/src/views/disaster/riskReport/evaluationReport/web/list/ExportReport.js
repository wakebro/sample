import { useEffect, useState } from "react"
import { Card } from "reactstrap"
import { useParams } from "react-router-dom"

import { API_CRITICAL_REPORT_DETAIL_EXPORT } from "../../../../../../constants"

import BoardForm from "../../../../../Report/manage/export/disasterForm/BoardForm"
import ScheduleForm from "../../../../../Report/manage/export/disasterForm/ScheduleForm"
import EvaluationForm from "../../../../../Report/manage/export/disasterForm/EvaluationForm"
import CounterPlanForm from "../../../../../Report/manage/export/disasterForm/CounterPlanForm"
import axios from "axios"

const CriticalExportReport = () => {
    const { id } = useParams()
    const [data, setData] = useState([])
    const [url, setUrl] = useState([])

    useEffect(() => {
        axios.get(`${API_CRITICAL_REPORT_DETAIL_EXPORT}/${id}`, {params: {}})
        .then(res => {
            const returnData = res.data
            setData(returnData.data)
            setUrl(returnData.url)
        })
    }, [])
    
    useEffect(() => {
        if (data.length !== 0) {
            setTimeout(() => window.print(), 200)
            axios({
                url: url.url,
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                const urlTemp = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = urlTemp
                link.setAttribute('download', `${url.name}`)
                document.body.appendChild(link)
                link.click()
            }).catch((res) => {
                console.log(res)
            })
        }
    }, [data, url])

    return (
        <div id='print' className='print'>
            {data && data.length !== 0 &&
                data.map((item, index) => {
                    const lastIndex = data.length - 1
                    return (
                        <Card className="shadow-none" key={`riskDetail_${item.id}`}>
                            <h1 style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'30rem'}}>{item.title}</h1>
                            <div className='page-break'/>
                                <BoardForm
                                    data={item}
                                    type={'notice'}
                                    lastPage={'riskReport'}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                                <ScheduleForm 
                                    data={item}
                                    type={'meeting'}
                                    lastPage={'riskReport'}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                                <EvaluationForm
                                    data={item.evaluation}
                                    type={'evaluation'}
                                    lastPage={'riskReport'}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                                <CounterPlanForm 
                                    data={item.evaluation}
                                    type={'counterplan'}
                                    lastPage={'riskReport'}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                                <ScheduleForm 
                                    data={item}
                                    type={'education'}
                                    lastPage={'riskReport'}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                                <BoardForm
                                    data={item}
                                    type={'riskReport'}
                                    lastPage={'riskReport'}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                        </Card>
                    )
                })}
        </div>
    )
}

export default CriticalExportReport