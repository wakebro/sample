import Breadcrumbs from '@components/breadcrumbs'
import axios from 'axios'
import Cookies from "universal-cookie"
import { Fragment, useEffect, useState, useRef } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row } from "reactstrap"
import { BuildingSelectTable } from "../../basic/area/contract/list/BuildingSelect"
import { API_ENERGY_BASIC_ENTRY_PURPOSE, API_ENERGY_BASIC_ENTRY_PURPOSE_FORM } from '../../../constants'
import Select from 'react-select'
import { HotTable } from '@handsontable/react'
import { registerAllModules } from 'handsontable/registry'
import '@styles/react/libs/tables/HandsonTable.scss'
import 'handsontable/dist/handsontable.full.min.css'
import { getTableData, sweetAlert } from '../../../utility/Utils'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import TotalLabel from '../../../components/TotalLabel'

registerAllModules()

const EnergyEntryPurpose = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const [year, setYear] = useState()
    const [selectBuilding, setSelectBuilding] = useState({ value:'', label: '건물전체'})
    const [data, setData] = useState([])
    const hotRef = useRef(null)

    const dayOfWeek = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dem']
    const yearList = []
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 9
    for (let year = currentYear; year >= startYear; year--) {
        yearList.push({ label: `${year}년`, value: `${year}` })
    }

    const getInit = () => {
        getTableData(API_ENERGY_BASIC_ENTRY_PURPOSE, {propertyId: cookies.get('property').value, buildingId: selectBuilding.value, year: year !== undefined ? year.value : yearList[0].value}, setData)
    }
    
    const NoDataComponent = () => (
		<div style={{margin:'3%'}} className="hand-no-data">데이터가 없습니다.</div>
	)

    useEffect(() => {
        getInit()
    }, [selectBuilding, year])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='에너지목표관리' breadCrumbParent='에너지관리' breadCrumbParent2='기본정보' breadCrumbActive='에너지목표관리' />
                </div>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <CardTitle>에너지목표관리</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md={5}>
                                    <Row>
                                        <Col className='mb-1' md={5}>
                                            <BuildingSelectTable 
                                            setSelectedBuilding={setSelectBuilding}
                                            cookies={cookies}
                                            selectBuilding={selectBuilding}
                                            />
                                        </Col>
                                        <Col className='mb-1' md={7}>
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
                                    </Row>
                                </Col>
                            </Row>
                            <TotalLabel
                                num={3}
                                data={data.length}
                            />
                            <HotTable 
                                id='hot-table'
                                className="react-dataTable-Handson htCenter htMiddle"
                                ref={hotRef}
                                beforeRefreshDimensions={() => true} //자동크기조절
                                colHeaders={['관리부분', '구분', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '계']}
                                data={data}
                                // startRows={1}
                                // minSpareRows={0}
                                columns={[
                                    {
                                        data: 'code',
                                        readOnly: true,
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        }
                                    },
                                    {
                                        data: 'type',
                                        readOnly: true,
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        }
                                    },
                                    {
                                        data: 'jan',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data: 'feb',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data: 'mar',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data:'apr',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data: 'may',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data: 'jun',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data: 'jul',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data: 'aug',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data: 'sep',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data: 'oct',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data: 'nov',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data:'dem',
                                        type: 'numeric',
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    },
                                    {
                                        data: 'total',
                                        readOnly: true,
                                        columnSorting: {
                                            indicator: false, // disable indicator for the first column,
                                            headerAction: false
                                        },
                                        numericFormat: {
                                            pattern: '0,0.00'
                                        }
                                    }
                                ]}
                                contextMenu={true}
                                width='100%'
                                height='auto'
                                stretchH="all"
                                colWidths={[50, 40, undefined, undefined, undefined, undefined, undefined,, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 15]}
                                rowHeights={40}
                                columnHeaderHeight={40}
                                licenseKey="non-commercial-and-evaluation"
                                afterChange={(changes, source) => {
                                    if (source === 'edit' || source === 'Autofill.fill') {
                                        changes.map(change => {
                                            const [row, prop, oldValue, newValue] = change
                                            const RowId = data[row].id
                                            console.log(oldValue)
                                            if ((dayOfWeek.includes(prop)) && (Number.isNaN(newValue) || !Number.isFinite(newValue))) {
			                                    sweetAlert('', `숫자를 입력해주세요.`, 'warning')
                                            } else if (newValue < 0) {
			                                    sweetAlert('', `0 이상의 숫자를 입력해주세요.`, 'warning')
                                            } else {
                                                const formData = new FormData()
                                                formData.append(prop, newValue)
                                                axios.put(`${API_ENERGY_BASIC_ENTRY_PURPOSE_FORM}/${RowId}`, formData, {
                                                    headers: {
                                                        "Content-Type": "multipart/form-data"
                                                    }
                                                }).then((res) => {
                                                    console.log(res, 'status.ok')
                                                    getInit()
                                                }).catch(res => {
                                                    console.log(res, "!!!!!!!!error")
                                                })
                                            }
                                        })
                                    }
                                }}
                            />
                            {(data.length === 0) && <NoDataComponent/>}
                            <Col style={{marginBottom:'1rem'}}/>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>

    )
}
export default EnergyEntryPurpose