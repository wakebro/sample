import Arrow from '@src/assets/images/arrow.png'
import { CardHeader, Row, Col, Label, CardBody } from "reactstrap"
import { useEffect, useState } from "react"
import { multResult, NOMAL, FREQUENCY_3X3, FREQUENCY_5X5, val2Label, STEP_3, CHECKLIST } from "../../../../disaster/riskReport/evaluationReport/web/data"

const CounterPlanForm = (props) => {
    const {data, lastPage, type, index, lastIndex} = props
    const [dataList, setDataList] = useState([])
    const [files, setFiles] = useState({})
    
    const ContentEvaluation = (props) => {
        const { type, cnt, data, file } = props

        return (
            <CardBody>
                <Row className='card_table top'>
                    <Col xs='12' className='card_table col col_color text center' style={{borderRight:'0px'}}>유해 위험요인{cnt}</Col>
                </Row>
                <Row className='card_table mid' >
                    <Col xs='12'>
                        <Row className='card_table table_row'>
                            <Col xs='12' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3'}}>
                                <img style={{height:"200px", width: '100%', objectFit:'contain'}}
                                    src={file.length !== 0 ? 
                                        `/static_backend/${file[0].path}/${file[0].file_name}` :
                                        `/static_backend/disaster/noImg.png`}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='card_table mid' >
                    <Col xs='12'>
                        <Row className='card_table table_row'>
                            <Col xs='3' className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                <div>유해</div><div>위험요인</div>
                            </Col>
                            <Col style={{display:'flex', alignItems:'center'}}>{data.inputResult}</Col>
                        </Row>
                    </Col>
                </Row>
                {
                    (type === FREQUENCY_3X3 || type === FREQUENCY_5X5) &&
                    <>
                        <Row className='card_table mid' >
                            <Col xs='12'>
                                <Row className='card_table table_row'>
                                    <Col xs='3'  className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                        <div>위험성</div><div>평가</div>
                                    </Col>
                                    <Col xs='9'  className='card_table col text center' style={{flexDirection:'column', padding:0}}>
                                        <Row style={{width:'100%', borderBottom:'1px solid #B9B9C3'}}><Col >현재 위험성</Col></Row>
                                        <Row style={{width:'100%'}}>
                                            <Col xs={4} style={{flexDirection:'column', borderRight:'1px solid #B9B9C3', padding:'1px 0px'}}><div>가능성</div><div>(빈도)</div></Col>
                                            <Col xs={4} style={{flexDirection:'column', borderRight:'1px solid #B9B9C3', padding:'1px 0px'}}><div>중대성</div><div>(강도)</div></Col>
                                            <Col xs={4} className="d-flex card_table text center" style={{padding:'1px 0px'}}>위험성</Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='card_table mid' >
                            <Col xs='12'>
                                <Row className='card_table table_row'>
                                    <Col xs='3'  className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                        {data.evaluation}
                                    </Col>
                                    <Col xs='9'  className='card_table col text center' style={{flexDirection:'column', padding:0}}>
                                        <Row style={{width:'100%', height:'100%'}}>
                                            <Col xs={4} style={{display:'flex', alignItems:'center', justifyContent:'center', borderRight:'1px solid #B9B9C3'}}>
                                                {data.frequency.label}
                                            </Col>
                                            <Col xs={4} style={{display:'flex', alignItems:'center', justifyContent:'center', borderRight:'1px solid #B9B9C3'}}>
                                                {data.strength.label}
                                            </Col>
                                            <Col xs={4} style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                                                {val2Label(type, multResult(type, data.frequency.value, data.strength.value)).label}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                }
                {
                    (type === STEP_3 || type === CHECKLIST) && 
                    <>
                        <Row className='card_table mid' >
                            <Col xs='12'>
                                <Row className='card_table table_row'>
                                    <Col xs='3' className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3', padding:0}}>
                                        <div>위험성</div>
                                    </Col>
                                    <Col xs='9' className='card_table col text center' style={{flexDirection:'column'}}>
                                        위험성 평가
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='card_table mid' >
                            <Col xs='12'>
                                <Row className='card_table table_row'>
                                    <Col xs='3'  className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                        {val2Label(type, multResult(type, data.frequency.value)).label}
                                    </Col>
                                    <Col xs='9'  className='card_table col text center' style={{flexDirection:'column', padding:0}}>
                                        {data.evaluation}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                }
            </CardBody>
        )
    }

    const ContentCounterPlan = (props) => {
        const { type, cnt, data, file } = props

        return (
            <CardBody>
                <Row className='card_table top'>
                    <Col xs='12' className='card_table col col_color text center' style={{borderRight:'0px'}}>예방대책{cnt}</Col>
                </Row>
                <Row className='card_table mid'>
                    <Col>
                        <Row className='card_table table_row'>
                            <Col xs='12' className='card_table col text center' style={{borderLeft:'1px solid #B9B9C3'}}>
                                <img style={{height:"200px", width: '100%', objectFit:'contain'}}
                                    src={file.length !== 0 ? 
                                        `/static_backend/${file[0].path}/${file[0].file_name}` :
                                        `/static_backend/disaster/noImg.png`}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='card_table mid' >
                    <Col xs='12'>
                        <Row className='card_table table_row' style={{minHeight:'48px'}}>
                            <Col xs='3' className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
                                <div>조치사항</div>
                            </Col>
                            <Col xs='9' style={{display:'flex', alignItems:'center'}}>{data.nowAction}</Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='card_table mid' >
                    <Col xs='12'>
                        <Row className='card_table table_row' style={{minHeight:'48px'}}>
                            <Col xs='9' className='card_table col text center' style={{display:'flex', alignItems:'center', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>예방대책</Col>
                            <Col xs='3' className='card_table text center' style={{display:'flex', alignItems:'center', flexDirection:'column'}}><div>개선후</div><div>위험성</div></Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='card_table mid' >
                    <Col xs='12'>
                        <Row className='card_table table_row' style={{minHeight:'43px'}}>
                            <Col xs='9' className='card_table col text center' style={{display:'flex', alignItems:'center', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>{data.counterplan}</Col>
                            <Col xs='3' className='card_table text center' style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                                {data.dangerousness !== null && val2Label(type, multResult(type, data.dangerousness.value, 1)).label}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </CardBody>
        )
    }

    useEffect(() => {
        if (data !== null) {
            const tempFiles = {}
            const evaluationType = data.info.form_type
            const tempEvaluationList = []
            const copyList = [...data.contents]

            copyList.map((row, index) => {
                const tempResult = multResult(evaluationType, row.frequency.value, row.strength.value)
                if (tempResult !== false && tempResult >= NOMAL) {
                    const copyRow = {...row}
                    copyRow['index'] = index
                    tempEvaluationList.push(copyRow)
                    tempFiles[index] = {
                        evaluation: row.images.evaluation,
                        counterplan: row.images.counterplan
                    }
                }
            })
            setDataList(tempEvaluationList)
            setFiles(tempFiles)
        } 
    }, [data])

    return (
        data &&
        <>
            <CardHeader>
                <Row className='w-100'>
                    <Col md={9} xs={9}>
                        <Label className="risk-report title-bold d-flex align-items-center">
                            {data.info.counterplan_title}
                        </Label>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>
                {
                    dataList.length !== 0 ? dataList.map((row, idx) => {
                        return (
                            <>
                                <Row key={idx}>
                                    <Col xl={6} lg={6} md={12} xs={12}>
                                        <ContentEvaluation
                                            type={data.info.form_type}
                                            cnt={idx + 1}
                                            data={row}
                                            file={files[row.index]['evaluation']}/>
                                    </Col>
                                    <Col xl={1} lg={1} md={12} xs={12} className='risk-report custom-img-rotate' style={{padding:'0', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                        <img src={Arrow}/>
                                    </Col>
                                    <Col xl={5} lg={5} md={12} xs={12}>
                                        <ContentCounterPlan
                                            type={data.info.form_type}
                                            cnt={idx + 1}
                                            data={row}
                                            file={files[row.index]['counterplan']}/>
                                    </Col>
                                </Row>
                                { lastPage !== '' && lastPage !== type && 
                                    < div className = 'page-break' /> 
                                }
                                { lastPage === type && index !== lastIndex &&
                                    <div className='page-break'/>
                                }
                            </>
                            
                        )
                    })
                    :
                    <>
                        <Row className='mx-0 my-2'>
                            <Col className='py-3 border-left card_table text center risk-report title-bold border-all'>
                                예방 대책 미필요
                            </Col>
                        </Row>
                        { lastPage !== '' && lastPage !== type && 
                            < div className = 'page-break' /> 
                        }
                        { lastPage === type && index !== lastIndex &&
                            <div className='page-break'/>
                        }
                    </>
                }
            </CardBody>
        </>
    )
}

export default CounterPlanForm