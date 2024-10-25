import { Fragment } from "react"
import { Row, Col, Input, Badge, Table } from "reactstrap"
import { primaryColor, primaryHeaderColor } from "../../../../utility/Utils"

const EducationTable = (props) => {
    const {educationType, setEducationType, xlsxList, setXlsxList} = props
    const tableList = ['legal', 'safety', 'general', 'cooperator']

    const handleCheckboxClick = (value) => {
        if (value === 'all') {
            if (educationType.length === 4) {
                setEducationType('')
                const newFilter = xlsxList.filter(el => el !== 'education')
                setXlsxList(newFilter)
            } else {
                setEducationType(tableList)
                setXlsxList([...xlsxList, 'education'])
            }
        } else {
            const index = educationType.indexOf(value)
            if (index >= 0) {
                const newFilter = educationType.filter(el => el !== value)
                setEducationType(newFilter)
                if (educationType.length === 1) {
                    const newFilter = xlsxList.filter(el => el !== 'education')
                    setXlsxList(newFilter)
                }
            } else {
                setEducationType([...educationType, value])
                if (!xlsxList.includes('education')) setXlsxList([...xlsxList, 'education'])
            }
        }
    }

    return (
        <Fragment>
            <Row className='top' style={{marginTop:'2rem', marginBottom:'0.8rem'}}>
                <Col className="manage-report-font">교육관리<span className="manage-sub-font ms-2">{educationType.length > 0 ? 1 : 0}개 파일 선택됨</span></Col>
            </Row>
            <Table bordered responsive style={{minWidth: '1440px'}}>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`, backgroundColor:primaryHeaderColor, textAlign:'center'}}>
                        <td style={{width:'10%'}}></td>
                        <td style={{width:'16%'}}>메뉴명</td>
                        <td style={{borderRadius:0}}>선택 항목</td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <td style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={educationType.length > 0} readOnly onClick={() => handleCheckboxClick('all')}/>
                        </td>
                        <td>
                            교육관리 &nbsp;
                            <Badge color='light-secondary' pill>첨부파일</Badge>
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                <Col md={1} className="px-0">
                                    <Input type="checkbox" id="report-total" checked={educationType.includes('legal')} readOnly onClick={() => handleCheckboxClick('legal')}/>&nbsp;<span>법정</span>
                                </Col>
                                <Col md={1} className="px-0">
                                    <Input type="checkbox" id="report-total" checked={educationType.includes('safety')} readOnly onClick={() => handleCheckboxClick('safety')}/>&nbsp;<span>안전</span>
                                </Col>
                                <Col md={1} className="px-0">
                                    <Input type="checkbox" id="report-total" checked={educationType.includes('general')} readOnly onClick={() => handleCheckboxClick('general')}/>&nbsp;<span>일반</span>
                                </Col>
                                <Col md={1} className="px-0">
                                    <Input type="checkbox" id="report-total" checked={educationType.includes('cooperator')} readOnly onClick={() => handleCheckboxClick('cooperator')}/>&nbsp;<span>외주</span>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Fragment>
    )
}
export default EducationTable