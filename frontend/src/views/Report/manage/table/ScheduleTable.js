/* eslint-disable */
import { Fragment } from "react"
import { Row, Col, Input, Badge, Table } from "reactstrap"
import { primaryColor, primaryHeaderColor } from "../../../../utility/Utils"

const ScheduleTalbe = (props) => {
    const {
        employeeClassData, employeeIds, dailyChoice, 
        setDailyChoice, dayEmployeeClassChoice, setDayEmployeeClassChoice, 
        xlsxList, setXlsxList, disasterEmployeeClassChoice,
        setDisasterDayEmployeeClassChoice
    } = props
    const tableList = ['registration', 'schedule', 'disaster']
    const setObjectList = {
        registration : setDayEmployeeClassChoice,
        disaster : setDisasterDayEmployeeClassChoice
    }
    const objectList = {
        registration : dayEmployeeClassChoice,
        disaster : disasterEmployeeClassChoice
    }

    const handleCheckboxClick = (value, emp) => {
        if (value === 'all') {
            // 위험성평가 추가되면 length 3개로 변경 필요
            if (dailyChoice.length === 3) {
                setDailyChoice([])
                setDayEmployeeClassChoice([])
                setDisasterDayEmployeeClassChoice([])
                const newFilter = xlsxList.filter(el => el !== 'registration' && el !== 'schedule' && el !== 'disaster')
                setXlsxList(newFilter)
            } else {
                setDailyChoice(tableList)
                setDayEmployeeClassChoice(employeeIds)
                setDisasterDayEmployeeClassChoice(employeeIds)
                setXlsxList([...xlsxList, 'registration', 'schedule', 'disaster'])
            }
        } else if (tableList.includes(emp)) {
            if (dailyChoice.includes(value)) {
                if (value === 'registration' || value === 'disaster') {
                    setObjectList[value]([])
                }
                const newFilter = dailyChoice.filter(el => el !== value)
                setDailyChoice(newFilter)
                const newXlsxFilter = xlsxList.filter(el => el !== value)
                setXlsxList(newXlsxFilter)
            } else {
                if (value === 'registration' || value === 'disaster') {
                    setObjectList[value](employeeIds)
                }
                setDailyChoice([...dailyChoice, value])
                setXlsxList([...xlsxList, value])
            }
        } else {
            const index = objectList[value].indexOf(emp.id)
            if (index >= 0) {
                const newFilter = objectList[value].filter(el => el !== emp.id)
                setObjectList[value](newFilter)
                if (objectList[value].length === 1) {
                    const newFilter = dailyChoice.filter(el => el !== value)
                    setDailyChoice(newFilter)
                    const newXlsxFilter = xlsxList.filter(el => el !== value)
                    setXlsxList(newXlsxFilter)
                }
            } else {
                setObjectList[value]([...objectList[value], emp.id])
                if (!dailyChoice.includes(value)) setDailyChoice([...dailyChoice, value])
                if (!xlsxList.includes(value)) setXlsxList([...xlsxList, value])
            }
        }
    }

    return (
        <Fragment>
            <Row className='top' style={{marginTop:'2rem', marginBottom:'0.8rem'}}>
                <Col className="manage-report-font">일정<span className="manage-sub-font ms-2">{dailyChoice.length}개 파일 선택됨</span></Col>
            </Row>
            <Table responsive style={{minWidth: '1440px'}}>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`, backgroundColor:primaryHeaderColor, textAlign:'center'}}>
                        <td style={{width:'10%'}}>
                            <Input type="checkbox" id="report-total" checked={dailyChoice.length === 3} readOnly onClick={() => handleCheckboxClick('all')}/>
                        </td>
                        <td className='border-x' style={{width:'16%'}}>메뉴명</td>
                        <td style={{borderRadius:0}}>선택 항목</td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={dailyChoice.includes('schedule')} readOnly onClick={() => handleCheckboxClick('schedule', 'schedule')}/>
                        </td>
                        <td className='border-x'>일정</td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={dailyChoice.includes('registration')} readOnly onClick={() => handleCheckboxClick('registration', 'registration')}/>
                        </td>
                        <td className='border-x'>업무등록</td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" id={data.id} checked={dayEmployeeClassChoice.includes(data.id)} readOnly onClick={() => handleCheckboxClick('registration', data)} />&nbsp;<span>{data.name}</span>
                                        </Col>
                                    ))
                                }                   
                            </Row>
                        </td>
                    </tr>
                </tbody>
                {/* <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={dailyChoice.includes('disaster')} readOnly onClick={() => handleCheckboxClick('disaster', 'disaster')}/>
                        </td>
                        <td className='border-x'>안전점검 업무등록</td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" id={data.id} checked={disasterEmployeeClassChoice.includes(data.id)} readOnly onClick={() => handleCheckboxClick('disaster', data)} />&nbsp;<span>{data.name}</span>
                                        </Col>
                                    ))
                                }   
                            </Row>                
                        </td>
                    </tr>
                </tbody> */}
            </Table>
        </Fragment>
    )
}
export default ScheduleTalbe