import { Fragment } from "react"
import { Row, Col, Input, Badge, Table } from "reactstrap"
import { primaryColor, primaryHeaderColor } from "../../../../utility/Utils"

const BasicInfoTable = (props) => {
    const {employeeClassData, employeeIds, basicChoice, setBasicChoice, basicEmployeeClassChoice, setBasicEmployeeClassChoice, xlsxList, setXlsxList} = props
    const tableList = ['building', 'toolEquipment']

    const handleCheckboxClick = (value) => {
        if (value === 'all') {
            if (basicChoice.length === 2) {
                setBasicChoice('')
                setBasicEmployeeClassChoice('')
                const newFilter = xlsxList.filter(el => el !== 'building' && el !== 'toolEquipment')
                setXlsxList(newFilter)
            } else {
                setBasicChoice(tableList)
                setBasicEmployeeClassChoice(employeeIds)
                setXlsxList([...xlsxList, 'building', 'toolEquipment'])
            }
        } else if (tableList.includes(value)) {
            if (basicChoice.includes(value)) {
                if (value === 'toolEquipment') {
                    setBasicEmployeeClassChoice('')
                }
                const newFilter = basicChoice.filter(el => el !== value)
                setBasicChoice(newFilter)
                const newXlsxFilter = xlsxList.filter(el => el !== value)
                setXlsxList(newXlsxFilter)
            } else {
                if (value === 'toolEquipment') {
                    setBasicEmployeeClassChoice(employeeIds)
                }
                setBasicChoice([...basicChoice, value])
                setXlsxList([...xlsxList, value])
            }
        } else {
            const index = basicEmployeeClassChoice.indexOf(value.id)
            if (index >= 0) {
                const newFilter = basicEmployeeClassChoice.filter(el => el !== value.id)
                setBasicEmployeeClassChoice(newFilter)
                if (basicEmployeeClassChoice.length === 1) {
                    const newFilter = basicChoice.filter(el => el !== 'toolEquipment')
                    setBasicChoice(newFilter)
                    const newXlsxFilter = xlsxList.filter(el => el !== 'toolEquipment')
                    setXlsxList(newXlsxFilter)
                }
            } else {
                setBasicEmployeeClassChoice([...basicEmployeeClassChoice, value.id])
                if (!basicChoice.includes('toolEquipment')) setBasicChoice([...basicChoice, 'toolEquipment'])
                if (!xlsxList.includes('toolEquipment')) setXlsxList([...xlsxList, 'toolEquipment'])
            }
        }
    }

    return (
        <Fragment>
            <Row className='top' style={{marginTop:'2rem', marginBottom:'0.8rem'}}>
                <Col className="manage-report-font">기본정보<span className="manage-sub-font ms-2">{basicChoice.length}개 파일 선택됨</span></Col>
            </Row>
            <Table bordered responsive style={{minWidth: '1440px'}}>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`, backgroundColor:primaryHeaderColor, textAlign:'center'}}>
                        <td style={{textAlign:'center', width:'10%'}}>
                            <Input type="checkbox" id="report-total" checked={basicChoice.length === 2} readOnly onClick={() => handleCheckboxClick('all')}/>
                        </td>
                        <td style={{width:'16%'}}>메뉴명</td>
                        <td style={{borderRadius:0}}>선택 항목</td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={basicChoice.includes('building')} readOnly onClick={() => handleCheckboxClick('building')}/>
                        </td>
                        <td>건물정보</td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={basicChoice.includes('toolEquipment')} readOnly onClick={() => handleCheckboxClick('toolEquipment')}/>
                        </td>
                        <td>설비정보</td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}></td>
                        <td>
                            <Input type="checkbox" id="report-total" checked={basicChoice.includes('toolEquipment')} readOnly onClick={() => handleCheckboxClick('toolEquipment')}/>&nbsp;
                            공구비품정보
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                {employeeClassData && employeeClassData.length > 0 &&
                                    employeeClassData.map((data) => (
                                        <Col key={data.id} md={1} xs={2} className="px-0">
                                            <Input type="checkbox" id={data.id} checked={basicEmployeeClassChoice.includes(data.id)} readOnly onClick={() => handleCheckboxClick(data)} />&nbsp;<span>{data.name}</span>
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
export default BasicInfoTable