import { Fragment } from "react"
import { Row, Col, Input, Badge, Table } from "reactstrap"
import { primaryColor, primaryHeaderColor } from "../../../../utility/Utils"

const BusinessTable = (props) => {
    const {businessTotal, setBusinessTotal, xlsxList, setXlsxList} = props
    const tableList = ['cost', 'costLong']

    const handleCheckboxClick = (value) => {
        if (value === 'all') {
            if (businessTotal.length === 2) {
                setBusinessTotal([])
                const newFilter = xlsxList.filter(el => el !== 'cost' && el !== 'costLong')
                setXlsxList(newFilter)
            } else {
                setBusinessTotal(tableList)
                setXlsxList([...xlsxList, 'cost', 'costLong'])
            }
        } else {
            const index = businessTotal.indexOf(value)
            if (index >= 0) {
                const newFilter = businessTotal.filter(el => el !== value)
                setBusinessTotal(newFilter)
                const newXlsxFilter = xlsxList.filter(el => el !== value)
                setXlsxList(newXlsxFilter)
            } else {
                setBusinessTotal([...businessTotal, value])
                setXlsxList([...xlsxList, value])
            }
        }
    }

    return (
        <Fragment>
            <Row className='top' style={{marginTop:'2rem', marginBottom:'0.8rem'}}>
                <Col className="manage-report-font">사업관리<span className="manage-sub-font ms-2">{businessTotal.length}개 파일 선택됨</span></Col>
            </Row>
            <Table responsive bordered style={{minWidth: '1440px'}}>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`, backgroundColor:primaryHeaderColor, textAlign:'center' }}>
                        <th style={{width:'10%'}}>
                            <Input type="checkbox" id="report-total" checked={businessTotal.length === 2} readOnly onClick={() => handleCheckboxClick('all')}/>
                        </th>
                        <td style={{width:'16%'}}>메뉴명</td>
                        <td style={{borderRadius:0, width:'73%'}}>선택 항목</td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <th style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={businessTotal.includes('cost')} readOnly onClick={() => handleCheckboxClick('cost')}/>
                        </th>
                        <td>유지보수</td>
                        <td></td>
                    </tr>
                </tbody>
                <tbody className='border-all'>
                    <tr style={{borderLeft:`5px solid ${primaryColor}`}}>
                        <th style={{textAlign:'center'}}>
                            <Input type="checkbox" id="report-total" checked={businessTotal.includes('costLong')} readOnly onClick={() => handleCheckboxClick('costLong')}/>
                        </th>
                        <td>장기수선충당금</td>
                        <td></td>
                    </tr>
                </tbody>
            </Table>
        </Fragment>
    )
}
export default BusinessTable