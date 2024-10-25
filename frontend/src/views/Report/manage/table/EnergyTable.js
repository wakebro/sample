import { Fragment } from "react"
import { Row, Col, Input, Badge, Table } from "reactstrap"
import { primaryColor, primaryHeaderColor } from "../../../../utility/Utils"

const EnergyTable = (props) => {
    const { employeeClassData, employeeIds, 
        energyTotal, setEnergyTotal, 
        energyDEmployeeClassChoice, setEnergyDEmployeeClassChoice, 
        energyMEmployeeClassChoice, setEnergyMEmployeeClassChoice, 
        xlsxList, setXlsxList } = props
    
    const tableList = ['daily', 'monthly']

    const employeeSetObj = {
        daily: setEnergyDEmployeeClassChoice,
        monthly : setEnergyMEmployeeClassChoice
    }

    const employeeListObj = {
        daily: energyDEmployeeClassChoice,
        monthly : energyMEmployeeClassChoice
    }

    const handleCheckboxClick = (type, value) => {
        if (value === 'all') {
            if (energyTotal.length === 2) {
                setEnergyTotal([])
                setEnergyDEmployeeClassChoice([])
                setEnergyMEmployeeClassChoice([])
                const newFilter = xlsxList.filter(el => el !== 'daily' && el !== 'monthly')
                setXlsxList(newFilter)

            } else {
                setEnergyTotal(tableList)
                setEnergyDEmployeeClassChoice(employeeIds)
                setEnergyMEmployeeClassChoice(employeeIds)
                setXlsxList([...xlsxList, 'daily', 'monthly'])
            }
        } else if (tableList.includes(value)) {
            if (energyTotal.includes(value)) {
                employeeSetObj[value]([])
                const newFilter = energyTotal.filter(el => el !== value)
                setEnergyTotal(newFilter)
                const newXlsxFilter = xlsxList.filter(el => el !== value)
                setXlsxList(newXlsxFilter)
            } else {
                setEnergyTotal([...energyTotal, value])
                setXlsxList([...xlsxList, value])
                employeeSetObj[value](employeeIds)
            }
        } else {
            const index = employeeListObj[type].indexOf(value.id)
            if (index >= 0) {
                const newFilter = employeeListObj[type].filter(el => el !== value.id)
                employeeSetObj[type](newFilter)
                if (employeeListObj[type].length === 1) {
                    const newFilter = energyTotal.filter(el => el !== type)
                    setEnergyTotal(newFilter)
                    const newXlsxFilter = xlsxList.filter(el => el !== type)
                    setXlsxList(newXlsxFilter)
                }
            } else {
                employeeSetObj[type]([...employeeListObj[type], value.id])
                if (!energyTotal.includes(type)) setEnergyTotal([...energyTotal, type])
                if (!xlsxList.includes(type)) setXlsxList([...xlsxList, type])
            }
        }
    }
    return (
        <Fragment>
            <Row className='top' style={{marginTop:'2rem', marginBottom:'0.8rem'}}>
                <Col className="manage-report-font">에너지관리<span className="manage-sub-font ms-2">{energyTotal.length}개 파일 선택됨</span></Col>
            </Row>
            <Table bordered responsive style={{minWidth: '1440px'}}>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`, backgroundColor:primaryHeaderColor, textAlign:'center'}}>
                        <td style={{width:'10%'}}>
                            <Input type="checkbox" id="report-total" checked={energyTotal.length === 2} readOnly onClick={() => handleCheckboxClick('all', 'all')}/>
                        </td>
                        <td style={{width:'16%'}}>메뉴명</td>
                        <td style={{borderRadius:0}}>선택 항목</td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={energyTotal.includes('daily')} readOnly onClick={() => handleCheckboxClick('daily', 'daily')}/>&nbsp;
                        </td>
                        <td>일일검침</td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" id={data.id} checked={energyDEmployeeClassChoice.includes(data.id)} readOnly onClick={() => handleCheckboxClick("daily", data)} />&nbsp;<span>{data.name}</span>
                                        </Col>
                                    ))
                                }   
                            </Row>
                        </td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={energyTotal.includes('monthly')} readOnly onClick={() => handleCheckboxClick('monthly', 'monthly')}/>&nbsp;
                        </td>
                        <td>월간검침</td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" id={data.id} checked={energyMEmployeeClassChoice.includes(data.id)} readOnly onClick={() => handleCheckboxClick('monthly', data)} />&nbsp;<span>{data.name}</span>
                                        </Col>
                                    ))
                                }   
                            </Row>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Fragment>
    )
}
export default EnergyTable