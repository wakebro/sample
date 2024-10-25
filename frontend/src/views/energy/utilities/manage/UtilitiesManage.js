import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useRef, useState } from "react"
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Button } from "reactstrap"
import Select from 'react-select'
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import { HotTable } from '@handsontable/react'
import '@styles/react/libs/tables/HandsonTable.scss'
import 'handsontable/dist/handsontable.full.min.css'
import { registerAllModules } from 'handsontable/registry'
import Cookies from 'universal-cookie'
import axios from 'axios'

import { 
    getTableData,
    getObjectKeyCheck
} from '@utils'

import { 
    API_ENERGY_UTILITIES_MANAGE,
    API_ENERGY_BASIC_UTILITY_ENTRY_BUILDINGS
} from "@src/constants"

import { 
    utilitesColumn
} from '../data'
import { sweetAlert } from '../../../../utility/Utils'
import TotalLabel from '../../../../components/TotalLabel'

registerAllModules()

const yearList = []
const currentYear = new Date().getFullYear()
const startYear = 1970
for (let year = currentYear; year >= startYear; year--) {
    yearList.push({ label: `${year}년`, value: `${year}` })
}
const dayOfWeek = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dem']
const UtilitiesManage = () => {
    useAxiosIntercepter()

    // property 위한 쿠키
    const cookies = new Cookies()

    const hotRef = useRef(null)
    const [utilitiesData, setUtilitiesData] = useState([])
    const [utilitiesSpan, setUtilitiesSpan] = useState([])

    // 기간
    const [targetYear, setTargetYear] = useState(yearList[0])

    // building state
    const [selectBuild, setselectBuild] = useState({ value:'', label: '건물전체'})
    const [buildList, setBuildList] = useState([])

    // setData func
    const setDataTable = (data) => {
        setUtilitiesData(data.rows)
        setUtilitiesSpan(data.span)
    }

    const NoDataComponent = () => (
		<div style={{margin:'3%'}} className="hand-no-data">데이터가 없습니다.</div>
	)

    const getInit = () => {
        const param = {
            property : cookies.get('property').value,
            year : targetYear.value,
            building : getObjectKeyCheck(selectBuild, 'value')
        }
        getTableData(API_ENERGY_UTILITIES_MANAGE, param, setDataTable)
    }

    useEffect(() => {
        getInit()
    }, [targetYear, selectBuild])

    // 화면 랜더링시 라벨과 사업소를 보내서 데이터를 받아옴
    useEffect(() => {
        const param = {
            prop_id : cookies.get('property').value
        }
        axios.get(API_ENERGY_BASIC_UTILITY_ENTRY_BUILDINGS, {
            params : param 
        }).then(
            (res) => {
                const tempList = res.data
                if (Array.isArray(tempList)) { // 배열인지 체크
                    setBuildList(tempList)
                    setselectBuild(tempList[0])
                }
            }
        )
	}, [])

    return (
        <Fragment>
			<Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs 
                        breadCrumbTitle='수광비실적관리' 
                        breadCrumbParent='에너지관리' 
                        breadCrumbParent2='수광비관리'
                        breadCrumbActive='수광비실적관리'
                    />
                </div>
			</Row>
            <Card>
                <CardHeader className='pb-0'>
                    <CardTitle>
                        수광비실적관리
                    </CardTitle>
                    <Row className='w-75 d-flex justify-content-end energy-w'>
                        <Col xs={2} lg={1} className='mt-1 mx-0 pe-0 electric-label-7' style={{textAlign:'end'}}>
                            {"건물:"}
                        </Col>
                        <Col xs={10} lg={2}>
                            <div className='mt-1 flex-grow-1'>
                            <Select
                                className="react-select mt-1"
                                classNamePrefix={'select'}
                                value={selectBuild}
                                options={buildList}
                                onChange={(e) => {
                                    setselectBuild(e)
                                }}
                            />
                            </div>
                        </Col>
                        <Col xs={2} lg={1} className='mt-1 mx-0 pe-0 electric-label-7' style={{textAlign:'end'}}>
                            {"기간:"}
                        </Col>
                        <Col xs={10} lg={2}>
                            <Select 
                                className='react-select mt-1 flex-grow-1'
                                classNamePrefix='select'
                                defaultValue={yearList[0]}
                                options={yearList}
                                onChange={(e) => setTargetYear(e)}
                                value={targetYear}
                            />
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody className='mt-0'>
                    <TotalLabel 
                        num={3}
                        data={utilitiesData.length / 2}
                    />
                    <HotTable 
                        id='hot-table'
                        className="react-dataTable-Handson htCenter htMiddle"
                        ref={hotRef}
                        data={utilitiesData}
                        beforeRefreshDimensions={() => true} //자동크기조절
                        columns={utilitesColumn}
                        contextMenu={true}
                        width='100%'
                        height='auto'
                        stretchH="all"
                        rowHeights={28}
                        columnHeaderHeight={40}
                        licenseKey="non-commercial-and-evaluation"
                        afterChange={(changes, source) => {
                            if (source === 'edit' || source === 'Autofill.fill') {
                                if (changes[0][1] === 'code') {
                                    return
                                }
                                changes.map(change => {
                                    const [row, prop, oldValue, newValue] = change
                                    const RowId = utilitiesData[row].id
                                    let RowType = utilitiesData[row].type
                                    console.log(oldValue)
                                    console.log(newValue)
                                    if (RowType === '사용량') RowType = 'usage'
                                    else if (RowType === '금액') RowType = 'amount'
                                    if ((dayOfWeek.includes(prop)) && (Number.isNaN(newValue) || !Number.isFinite(newValue))) {
			                            sweetAlert('', '숫자를 입력해주세요.', 'warning')
                                    } else if (newValue < 0) {
			                            sweetAlert('', '0 이상의 숫자를 입력해주세요.', 'warning')
                                    } else {
                                        const formData = new FormData()
                                        formData.append(prop, newValue)
                                        formData.append('id', RowId)
                                        formData.append('type', RowType)
                                        axios.put(`${API_ENERGY_UTILITIES_MANAGE}`, formData, {
                                            headers: {
                                                "Content-Type": "multipart/form-data"
                                            }
                                        }).then(() => {
                                            getInit()
                                        })
                                    }
                                })
                            }
                        }}
                        nestedHeaders={
                            [['관리부분', '구분', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '계']]
                        }
                        mergeCells={utilitiesSpan}
                    />
                    {(utilitiesData.length === 0) && <NoDataComponent/>}
                </CardBody>
            </Card>
        </Fragment>
    )
}
export default UtilitiesManage