
import { useEffect, useState } from "react"
import Cookies from "universal-cookie"
import { getTableData } from "../../../../utility/Utils"

import { API_REPORT_MANAGE_RISK_FORM_DETAIL } from '../../../../constants'
import { Card, CardBody, CardHeader, Col, Label, Row } from "reactstrap"
import BoardForm from "./disasterForm/BoardForm"
import ScheduleForm from "./disasterForm/ScheduleForm"
import EvaluationForm from "./disasterForm/EvaluationForm"
import CounterPlanForm from "./disasterForm/CounterPlanForm"

const DisasterReportPdf = () => {
    const cookies = new Cookies()
    const startDate = localStorage.getItem('start_date')
    const endDate = localStorage.getItem('end_date')
    const formType = localStorage.getItem('selectFormType')
    const pageType = localStorage.getItem('riskPageType').split(',')

    const [data, setData] = useState([])
    const [lastPage, setLastPage] = useState('')

    useEffect(() => {
        getTableData(API_REPORT_MANAGE_RISK_FORM_DETAIL, {type:formType, start_date: startDate, end_date: endDate, propertyId: cookies.get('property').value}, setData)
    }, [])

    useEffect(() => {
        setLastPage(pageType[pageType.length - 1])
    }, [pageType])

    useEffect(() => {
        if (data.length !== 0) setTimeout(() => window.print(), 200)
    }, [data])

    return (
        <div id='print' className='print'>
            {data && data.length !== 0 &&
                data.map((item, index) => {
                    const lastIndex = data.length - 1
                    return (
                        <Card className="shadow-none" key={`riskDetail_${item.id}`}>
                            <h1 style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'30rem'}}>{item.title}</h1>
                            <div className='page-break'/>
                            { pageType.includes('notice') && 
                                <BoardForm
                                    data={item}
                                    type={'notice'}
                                    lastPage={lastPage}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                            }
                            { pageType.includes('meeting') && 
                                <ScheduleForm 
                                    data={item}
                                    type={'meeting'}
                                    lastPage={lastPage}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                            }
                            { pageType.includes('evaluation') && 
                                <EvaluationForm
                                    data={item.evaluation}
                                    type={'evaluation'}
                                    lastPage={lastPage}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                            }
                            { pageType.includes('counterplan') && 
                                <CounterPlanForm 
                                    data={item.evaluation}
                                    type={'counterplan'}
                                    lastPage={lastPage}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                            }
                            { pageType.includes('education') && 
                                <ScheduleForm 
                                    data={item}
                                    type={'education'}
                                    lastPage={lastPage}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                            }
                            { pageType.includes('riskReport') && 
                                <BoardForm
                                    data={item}
                                    type={'riskReport'}
                                    lastPage={lastPage}
                                    index={index}
                                    lastIndex={lastIndex}
                                />
                            }
                        </Card>
                    )
                })}
        </div>
    )
}
export default DisasterReportPdf