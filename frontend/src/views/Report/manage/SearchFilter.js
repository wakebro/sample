import { Fragment } from "react"
import { Button, Row, Col, Input } from "reactstrap"
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import { pickerDateChange } from "../../../utility/Utils"
import { Korean } from "flatpickr/dist/l10n/ko.js"

const SearchFilter = (props) => {
    const { picker, setPicker, year, 
        setYear, quarter, setQuarter, 
        yearList, quarterList, filters, 
        setFilters, radioValue, setRadioValue} = props
    // const [filterStatus, setFilterStatus] = useState('전체')
    const checkActive = (target, val) => {
		return !target.includes(val)
	}

    const selectFilter = (val) => {
        if (val === 'all') {
            if (filters.length === 9) {
                setFilters('')
            } else {
                setFilters(['report', 'schedule', 'basicInfo', 'inspection', 'facility', 'education', 'energy', 'business', 'safety'])
            }
        } else {
            const index = filters.indexOf(val)
            if (index >= 0) {
                const newFilter = filters.filter(el => el !== val)
                setFilters(newFilter)
            } else {
                if (filters.length === 8) {
                    setFilters(['report', 'schedule', 'basicInfo', 'inspection', 'facility', 'education', 'energy', 'business', 'safety'])
                } else {
                    setFilters([...filters, val])
                }
            }
        }
        // 중대재 미포함
        // if (val === 'all') {
        //     if (filters.length === 8) {
        //         setFilters('')
        //     } else {
        //         setFilters(['report', 'schedule', 'basicInfo', 'inspection', 'facility', 'education', 'energy', 'business'])
        //     }
        // } else {
        //     const index = filters.indexOf(val)
        //     if (index >= 0) {
        //         const newFilter = filters.filter(el => el !== val)
        //         setFilters(newFilter)
        //     } else {
        //         if (filters.length === 7) {
        //             setFilters(['report', 'schedule', 'basicInfo', 'inspection', 'facility', 'education', 'energy', 'business'])
        //         } else {
        //             setFilters([...filters, val])
        //         }
        //     }
        // }
    }

    const handleYearChoice = (e) => {
        setQuarter(e)
        const last = new Date(year.value, e.value, 0)
        setPicker(pickerDateChange([`${year.value}-${e.value - 2}-01`, last]))
    }

    return (
        <Fragment>
            <Row>
                <Col lg='2' md='3' className="pe-0">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        <Input type='radio' id='ex1-active' name='ex1' value={radioValue} checked={radioValue === 'year'} onChange={() => setRadioValue('year')}/>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight:'2%', paddingLeft:'2%' }}>년도</div>
                        <Col xs='8'>
                        {radioValue === 'year' ?
                            <Select 
                                id='employeeClass-select'
                                autosize={true}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={yearList[0]}
                                options={yearList}
                                onChange={(e) => setYear(e)}
                                value={year}
                            />
                            :
                            <Select 
                                id='employeeClass-select'
                                autosize={true}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={yearList[0]}
                                options={yearList}
                                onChange={(e) => setYear(e)}
                                isDisabled={true}
                                value={year}
                            />
                        }
                        </Col>
                    </div>
                </Col>
                <Col lg='2' md='3' className="ps-0 manage">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        <div className='manage-div' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight:'1%', paddingLeft:'16%' }}>분기</div>
                        <Col xs='8'>
                        {radioValue === 'year' ?
                            <Select 
                                id='employeeClass-select'
                                autosize={true}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={quarterList[0]}
                                options={quarterList}
                                onChange={(e) => handleYearChoice(e)}
                                value={quarter}
                            />
                            :
                            <Select 
                                id='employeeClass-select'
                                isDisabled={true}
                                autosize={true}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={quarterList[0]}
                                options={quarterList}
                                onChange={(e) => setQuarter(e)}
                                value={quarter}
                            />
                        }
                        </Col>
                    </div>
                </Col>
                <Col lg='4' md='5' xs='12'>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        <Input type='radio' id='ex2-active' name='ex1' value={radioValue} checked={radioValue === 'period'} onChange={() => setRadioValue('period')}/>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight:'2%', paddingLeft:'2%'}}>기간</div>
                        <Col xs='8' style={{ paddingLeft: '1%' }}>
                            {radioValue === 'period' ?
                                <Flatpickr
                                    value={picker}
                                    id='range-picker'
                                    className='form-control'
                                    onChange={date => { if (date.length === 2) setPicker(pickerDateChange(date)) } }
                                    options={{
                                        mode: 'range',
                                        ariaDateFormat:'Y-m-d',
                                        locale: {
                                            rangeSeparator: ' ~ '
                                        },
                                        defaultValue: picker,
                                        locale: Korean
                                    }}
                                />
                                :
                                <Flatpickr
                                    value={picker}
                                    disabled
                                    readOnly
                                    id='range-picker'
                                    className='form-control'
                                    style={{backgroundColor: '#efefef'}}
                                    options={{
                                        mode: 'range',
                                        ariaDateFormat:'Y-m-d',
                                        locale: {
                                            rangeSeparator: ' ~ '
                                        },
                                        defaultValue: picker,
                                        locale: Korean
                                    }}
                                />
                            }
                        </Col>
                    </div>
                </Col>
            </Row>
            <Row style={{marginTop:'1rem'}}>
                <Col md='1' xs='2' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>필터</Col>
                <Col md='11' xs='10' className="ps-0">
                    <Button className="round btn-sm filter-buttons ms-1" outline={filters.length !== 9} color="primary" onClick={() => selectFilter('all')}>전체 메뉴</Button>
                    {/* <Button className="round btn-sm filter-buttons ms-1" outline={filters.length !== 8} color="primary" onClick={() => selectFilter('all')}>전체 메뉴</Button> */}
                    <Button className="round btn-sm filter-buttons ms-1" outline={checkActive(filters, 'report')} color="primary" onClick={() => selectFilter('report')}>보고서</Button>
                    <Button className="round btn-sm filter-buttons ms-1" outline={checkActive(filters, 'schedule')} color="primary" onClick={() => selectFilter('schedule')}>일정</Button>
                    <Button className="round btn-sm filter-buttons ms-1" outline={checkActive(filters, 'basicInfo')} color="primary" onClick={() => selectFilter('basicInfo')}>기본정보</Button>
                    <Button className="round btn-sm filter-buttons ms-1" outline={checkActive(filters, 'inspection')} color="primary" onClick={() => selectFilter('inspection')}>점검현황</Button>
                    <Button className="round btn-sm filter-buttons ms-1" outline={checkActive(filters, 'safety')} color="primary" onClick={() => selectFilter('safety')}>중대재해관리</Button>
                    <Button className="round btn-sm filter-buttons ms-1" outline={checkActive(filters, 'facility')} color="primary" onClick={() => selectFilter('facility')}>시설관리</Button>
                    <Button className="round btn-sm filter-buttons ms-1" outline={checkActive(filters, 'education')} color="primary" onClick={() => selectFilter('education')}>교육관리</Button>
                    <Button className="round btn-sm filter-buttons ms-1" outline={checkActive(filters, 'energy')} color="primary" onClick={() => selectFilter('energy')}>에너지관리</Button>
                    <Button className="round btn-sm filter-buttons ms-1" outline={checkActive(filters, 'business')} color="primary" onClick={() => selectFilter('business')}>사업관리</Button>
                </Col>
            </Row>
        </Fragment>
    )
}
export default SearchFilter