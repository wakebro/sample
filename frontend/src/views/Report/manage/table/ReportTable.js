import { Fragment } from "react"
import { Row, Col, Input, Badge, Table } from "reactstrap"
import { primaryColor, primaryHeaderColor } from "../../../../utility/Utils"

const ReportTalbe = (props) => {
    const {reportType, setReportType, pdfList, xlsxList, setPdfList, setXlsxList} = props
    const tableList = ['general', 'weekly', 'monthly', 'accident']

    const handleCheckboxClick = (value) => {
        if (value === 'all') {
            if (reportType.length === 4) {
                setReportType([])
                const newFilter = pdfList.filter(el => el !== 'report')
                const newXFilter = xlsxList.filter(el => el !== 'report')
                setPdfList(newFilter)
                setXlsxList(newXFilter)
            } else {
                setReportType(tableList)
                setPdfList([...pdfList, 'report']) 
                setXlsxList([...xlsxList, 'report']) 
            }
        } else {
            const index = reportType.indexOf(value)
            if (index >= 0) {
                if (index === 0) {
                    const newFilter = pdfList.filter(el => el !== 'report')
                    const newXFilter = xlsxList.filter(el => el !== 'report')
                    setPdfList(newFilter)
                    setXlsxList(newXFilter)
                }
                const newFilter = reportType.filter(el => el !== value)
                setReportType(newFilter)
            } else {
                setReportType([...reportType, value])
                if (!pdfList.includes('report')) setPdfList([...pdfList, 'report'])
                if (!xlsxList.includes('report')) setXlsxList([...xlsxList, 'report'])

            }
        }
    }

    return (
        <Fragment>
            <Row className='top' style={{marginTop:'1rem', marginBottom:'0.8rem'}}>
                <Col className="manage-report-font">보고서<span className="manage-sub-font ms-2">{reportType.length > 0 ? 1 : 0}개 파일 선택됨</span></Col>
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
                            <Input type="checkbox" id="all" checked={reportType.length === 4} readOnly onClick={() => handleCheckboxClick('all')}/>
                        </td>
                        <td>
                            보고서 &nbsp;
                            <Badge color='light-skyblue' pill>PDF</Badge>&nbsp;
                            <Badge color='light-secondary' pill>첨부파일</Badge>
                        </td>
                        <td>
                            <Row style={{display:'flex'}}>
                                <Col md={1} xs={2}className="px-0">
                                    <Input type="checkbox" id="general" checked={reportType.includes('general')} readOnly onClick={() => handleCheckboxClick('general')}/>&nbsp;<span>일반보고서</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="weekly" checked={reportType.includes('weekly')} readOnly onClick={() => handleCheckboxClick('weekly')}/>&nbsp;<span>주간보고서</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="monthly" checked={reportType.includes('monthly')} readOnly onClick={() => handleCheckboxClick('monthly')}/>&nbsp;<span>월간보고서</span>
                                </Col>
                                <Col md={1} xs={2} className="px-0">
                                    <Input type="checkbox" id="accident" checked={reportType.includes('accident')} readOnly onClick={() => handleCheckboxClick('accident')}/>&nbsp;<span>사고보고서</span>
                                </Col>
                            </Row>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </Fragment>
    )
}
export default ReportTalbe