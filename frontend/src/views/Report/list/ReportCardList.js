import Flatpickr from 'react-flatpickr'
import { Fragment } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Label, TabPane, InputGroup, Badge } from "reactstrap"
import { ROUTE_REPORT_DETAIL, API_REPORT_LIST } from '../../../constants'
import { tabTatleList, reportTypeList } from '../../Report/ReportData'
import { checkOnlyView, getTableData, pickerDateChange } from '../../../utility/Utils'
import * as moment from 'moment'
import ReportDataTable from '../ReportDataTable'
import RegisterModal from './RegisterModal'
import LineModal from './LineModal'
import { useSelector } from 'react-redux'
import { REPORT_INFO } from '../../../constants/CodeList'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from '../../../components/TotalLabel'

const ReportCardList = (props) => {
    const {cookies, data, setData, active, searchValue, setSearchValue, picker, setPicker, selectId, setSelectId, isOpen, setIsOpen, lineIsOpen, setLineIsOpen, checked, setChecked} = props
    const loginAuth = useSelector((state) => state.loginAuth)
    
    const lineOpenModal = (id) => {
        setSelectId(id)
        setLineIsOpen(true)
    }

    const ReportColumn = [
        {
            name:'작성일자',
            width:'130px',
            cell: row => <Fragment key={row.id}>{moment(row.create_datetime).format('YYYY/MM/DD')}</Fragment>
        },
        {
            name:'종류',
            width:'100px',
            cell: row => <Fragment key={row.id}>{reportTypeList[row.main_purpose]}</Fragment>
        },
        {
            name:'사업소',
            width:'200px',
            cell: row => <Fragment>{row.property}</Fragment>
        },
        {
            name:'현장명',
            width:'200px',
            cell: row => <Fragment>{row.accident_title}</Fragment>
        },
        {
            name:'보고서명',
            minWidth:'300px',
            style: {justifyContent:'left'},
            cell: row => <Fragment key={row.id}>{row.title}</Fragment>
        },
        {
            name:'작성자',
            width:'150px',
            cell: row => <Fragment key={row.id}>{row.user}</Fragment>
        },
        {
            name:'결재',
            width:'130px',
            cell: row => { 
                let count = 0
                row.line.map((user) => {
                    if (user.type === 1 || user.type === 2 || user.type === 3) {
                        count++
                    }
                })
                if (row.is_rejected === 1) {
                    return (
                        <Button onClick={() => lineOpenModal(row.id)} style={{width:'100%'}} key={row.id} color='primary'>반려</Button>
                    )
                } else if (row.is_rejected === 2) {
                    return (
                        <Button onClick={() => lineOpenModal(row.id)} style={{width:'100%'}} key={row.id} color='primary'>회수</Button>
                    )
                }
                if (count === 4) {
                    return (
                        <Button onClick={() => lineOpenModal(row.id)} key={row.id} style={{width:'100%'}} color='report'>완료</Button>
                    )
                } else {
                    return (
                        <Button onClick={() => lineOpenModal(row.id)} style={{width:'100%'}} key={row.id} color='danger'>미완료</Button>
                    )
                }
            },
            conditionalCellStyles: [
                {
                    when: row => row,
                    style: {
                        padding: '0.3%',
                        width: '130px'
                    }
                }
            ]
        }
    ]

    const openModal = () => {
        setIsOpen(true)
    }

    return (
        <Card>
            <CardHeader style={{padding: '1.5rem 1.5rem 0rem 1.5rem'}}>
                <CardTitle className="title">
                    {tabTatleList.find(item => active in item)[active]}
                </CardTitle>
                <Row>
                    <Button 
                        hidden={checkOnlyView(loginAuth, REPORT_INFO, 'available_create')}
                        color='primary' 
                        style={{marginLeft: '-22%'}}
                        state={{
                            type:'register'
                        }}
                        onClick={openModal}
                        >등록</Button>
                    <RegisterModal 
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                    {data &&
                        <LineModal 
                            isOpen={lineIsOpen}
                            setIsOpen={setLineIsOpen}
                            data={data.find(data => data.id === selectId)}
                            state={'list'}
                        />
                    }
                </Row>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md={8}>
                        <Row>
                            <Col className='mb-1'md={4} xs={12}>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                    <Col md='2' className='d-flex align-items-center justify-content-center'>기간</Col>
                                    <Col style={{ paddingLeft: '1%' }}>
                                        <Flatpickr
                                            value={picker}
                                            id='range-picker'
                                            className='form-control'
                                            onChange={date => { if (date.length === 2) setPicker(date) } }
                                            options={{
                                            mode: 'range',
                                            ariaDateFormat:'Y-m-d',
                                            locale: {
                                                rangeSeparator: ' ~ '
                                            },
                                            locale: Korean
                                            }}
                                        />
                                    </Col>
                                </div>
                            </Col>
                            <Col className='mb-1' md={4} xs={12}>
                                <InputGroup>
                                    <Input 
                                        value={searchValue} 
                                        maxLength={498}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        placeholder= '보고서명을 입력해주세요.'
                                        />
                                    <Button
                                        onClick={() => {
                                            getTableData(API_REPORT_LIST, {property:cookies.get('property').value, picker:pickerDateChange(picker), search:searchValue, type:active, checked:checked}, setData)
                                            }}
                                    >검색</Button>
                                </InputGroup>
                            </Col>
                            <Col className='mb-1' md={4} xs={12} style={{display:'flex', alignItems:'center'}}>
                                <div className='demo-inline-spacing'>
                                    { active !== 'temporary' && 
                                        <div className='form-check'>
                                            <Input type='checkbox' id='basic-cb-checked' readOnly checked={checked} value={checked || ''} onClick={(e) => setChecked(e.target.checked)}/>
                                            <Label for='basic-cb-checked' style={{color:'#FF922A', marginBottom:0, fontSize:'1rem'}}>
                                                결재 미완료 모아보기
                                            </Label>
                                        </div>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <TotalLabel 
                    num={3}
                    data={data.length}
                />
                <ReportDataTable 
                    columns={ReportColumn} 
                    tableData={data}
                    setTabelData={setData} 
                    selectType={false} 
                    onRowClicked
                    detailAPI={ROUTE_REPORT_DETAIL}
                    noDataComponent
                />
            </CardBody>
        </Card>
    )

}
export default ReportCardList