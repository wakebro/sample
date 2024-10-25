import { Fragment } from "react"
import { BuildingSelectTable } from "../list/SolidBuildingSelect"
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Row, Col } from "reactstrap"
import Select from 'react-select'
import {monthlyList} from '../../data'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const Filter = (props) => {
    const {page, picker, setPicker, selectBuilding, setSelectBuilding, year, setYear, year2, setYear2, yearList, month, setMonth, month2, setMonth2, buildingList} = props

    return (
        <Fragment>
            <Row>
                <Col className="mb-1" md={4}>
                    {buildingList && 
                        <BuildingSelectTable 
                            setSelectedBuilding={setSelectBuilding}
                            selectBuilding={selectBuilding}
                            buildingList={buildingList}
                        />
                    }
                </Col>
                <Col className="mb-1" md={8}>
                    { page === 'day' && 
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                            <Col md='1' xs='2' className='d-flex align-items-center justify-content-center'>기간</Col>
                            <Col md='11' xs='10' style={{ paddingLeft: '1%' }}>
                                <Flatpickr
                                    value={picker}
                                    id='range-picker'
                                    className='form-control'
                                    onChange={date => { if (date.length === 2) setPicker(date) } }
                                    // styles={{ zIndex: 9999 }}
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
                    }
                    { page === 'monthly' && 
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                            <Col md='3' xs='3'>
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
                            </Col>
                            <Col md='3' xs='3' style={{ paddingLeft: '1%' }}>
                                <Select 
                                id='employeeClass-select'
                                autosize={true}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={monthlyList[0]}
                                options={monthlyList}
                                onChange={(e) => setMonth(e)}
                                value={month}
                                />
                            </Col>
                            <Col md='3' xs='3' style={{ paddingLeft: '1%' }}>
                                <Select 
                                id='employeeClass-select'
                                autosize={true}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={yearList[0]}
                                options={yearList}
                                onChange={(e) => setYear2(e)}
                                value={year2}
                                />
                            </Col>
                            <Col md='3' xs='3' style={{ paddingLeft: '1%' }}>
                                <Select 
                                id='employeeClass-select'
                                autosize={true}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={monthlyList[0]}
                                options={monthlyList}
                                onChange={(e) => setMonth2(e)}
                                value={month2}
                                />
                            </Col>
                        </div>
                    }
                    { page === 'compare' &&
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                            <Col md='3' xs='3'>
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
                            </Col>
                            <Col md='1' xs='1' className='d-flex align-items-center justify-content-center'>/</Col>
                            <Col md='4' xs='4' style={{ paddingLeft: '1%' }}>
                                <Select 
                                id='employeeClass-select'
                                autosize={true}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={yearList[0]}
                                options={yearList}
                                onChange={(e) => setYear2(e)}
                                value={year2}
                                />
                            </Col>
                            <Col md='4' xs='4' style={{ paddingLeft: '1%' }}>
                                <Select 
                                id='employeeClass-select'
                                autosize={true}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={monthlyList[0]}
                                options={monthlyList}
                                onChange={(e) => setMonth2(e)}
                                value={month2}
                                />
                            </Col>
                        </div>
                    }
                    { page === 'year' &&
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                            <Col md='5' xs='5'>
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
                            </Col>
                            <Col md='1' xs='2' className='d-flex align-items-center justify-content-center'>~</Col>
                            <Col md='5' xs='5'>
                                <Select 
                                id='employeeClass-select'
                                autosize={true}
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={yearList[0]}
                                options={yearList}
                                onChange={(e) => setYear2(e)}
                                value={year2}
                                />
                            </Col>
                        </div>
                    }
                </Col>
            </Row>
        </Fragment>

    )
}
export default Filter