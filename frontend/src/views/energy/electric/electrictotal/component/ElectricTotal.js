import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState, useRef } from "react"
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import Cookies from 'universal-cookie'
import axios from "axios"

import { 
    API_ENERGY_ELECTRIC_YM,
    API_ENERGY_BASIC_MAGNIFICATION_BUILDINGS
} from "@src/constants"

import { 
    getTableData
} from '@utils'
// 

import { 
    electricTotalCustomStyles,
    electricTotalColumns
} from "../../data"

// //첫 랜더링에서 effect 효과 막기
const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false)
  
    useEffect(() => {
      if (didMount.current) func()
      else didMount.current = true
    }, deps)
}// useDidMountEffect end

const yearList = []
const currentYear = new Date().getFullYear()
const startYear = 1970
for (let year = currentYear; year >= startYear; year--) {
    yearList.push({ label: `${year}년`, value: `${year}` })
}
const monthList = [
    { label: '1월', value: 1 },
    { label: '2월', value: 2 },
    { label: '3월', value: 3 },
    { label: '4월', value: 4 },
    { label: '5월', value: 5 },
    { label: '6월', value: 6 },
    { label: '7월', value: 7 },
    { label: '8월', value: 8 },
    { label: '9월', value: 9 },
    { label: '10월', value: 10 },
    { label: '11월', value: 11 },
    { label: '12월', value: 12 }
]

const ElectricTotal = () => {
    useAxiosIntercepter()

    // property 위한 쿠키
    const cookies = new Cookies()

    const NoDataComponent = () => (
		<div style={{margin:'3%'}} className="no-data-message">데이터가 없습니다.</div>
	)
    const NoIconComponent = () => (
		<></>
	)

    // moment
    const [beforeYear, setBeforeYear] = useState(yearList[0])
    const [befoteMonth, setBeforeMonth] = useState({value: new Date().getMonth() + 1, label: `${new Date().getMonth() + 1}월`})

    const [currentYear, setCurrentYear] = useState(yearList[0])
    const [currentmonth, setCurrentMonth] = useState({value: new Date().getMonth() + 1, label: `${new Date().getMonth() + 1}월`})

    // dataset state
    const [electricTotalData, setElectricTotalData] = useState([])

    // building state
    const [selectBuild, setselectBuild] = useState({label: '선택', value:''})
    const [buildElectric, setBuildElectric] = useState([])

    // select 선택시 데이터를 새로 받아옴
    useDidMountEffect(() => {
        if (selectBuild && Object.keys(selectBuild).includes('value')) {
            const lastDay = new Date(currentYear.value, currentmonth.value, 0).getDate()
            const param = {
                property : cookies.get('property').value,
                targetDate : [`${beforeYear.value}-${befoteMonth.value}-${1}`, `${currentYear.value}-${currentmonth.value}-${lastDay}`],
                building : selectBuild.value
            }
            // 차트에 들어갈 데이터 배열을 받아옴
            getTableData(API_ENERGY_ELECTRIC_YM, param, setElectricTotalData)
        }// if end
    }, [beforeYear, befoteMonth, currentYear, currentmonth, selectBuild, buildElectric])

    // 화면 랜더링시 라벨과 사업소를 보내서 데이터를 받아옴
    useEffect(() => {
        const param = {
            prop_id : cookies.get('property').value,
            list: true
        }
        axios.get(API_ENERGY_BASIC_MAGNIFICATION_BUILDINGS, {
            params : param 
        }).then(
            (res) => {
                const tempList = res.data
                if (Array.isArray(tempList)) { // 배열인지 체크
                    tempList.shift() // shift
                    setBuildElectric(tempList)
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
                        breadCrumbTitle='전력 사용 집계' 
                        breadCrumbParent='에너지관리' 
                        breadCrumbParent2='전력사용관리'
                        breadCrumbActive='전력사용 집계'
                    />
                </div>
			</Row>
            <Card>
                <CardHeader className='pb-0'>
                    <CardTitle>
                        년 / 월 전력사용 집계
                    </CardTitle>
                    <Row className='w-75 d-flex justify-content-end'>
                        <Col xs={12} lg={1} className='mt-1 mx-0 pe-0 electric-label-7'>
                            {"기간:"}
                        </Col>
                        <Col xs={12} lg={3} className='pe-0 d-flex flex-row' style={{minWidth: '200px'}}>
                            <Select 
                                className='react-select mt-1 flex-grow-1'
                                classNamePrefix='select'
                                defaultValue={yearList[0]}
                                options={yearList}
                                onChange={(e) => setBeforeYear(e)}
                                value={beforeYear}
                            />
                            <Select
                                className='react-select mt-1 flex-grow-1'
                                classNamePrefix='select'
                                defaultValue={monthList[0]}
                                options={monthList}
                                onChange={(e) => setBeforeMonth(e)}
                                value={befoteMonth}
                            />
                        </Col>
                        <Col xs={12} lg={3} className='pe-0 d-flex flex-row' style={{minWidth: '200px'}}>
                            <Select
                                className='react-select mt-1 flex-grow-1'
                                classNamePrefix='select'
                                defaultValue={yearList[0]}
                                options={yearList}
                                onChange={(e) => setCurrentYear(e)}
                                value={currentYear}
                            />
                            <Select 
                                className='react-select mt-1 flex-grow-1'
                                classNamePrefix='select'
                                defaultValue={monthList[0]}
                                options={monthList}
                                onChange={(e) => setCurrentMonth(e)}
                                value={currentmonth}
                            />
                        </Col>
                        <Col xs={12} lg={1} className='mt-1 mx-0 pe-0 electric-label-7'>
                            {"건물:"}
                        </Col>
                        <Col xs={12} lg={3}>
                            <Select
                                className="react-select mt-1"
                                classNamePrefix={'select'}
                                value={selectBuild}
                                options={buildElectric}
                                onChange={(e) => {
                                    setselectBuild(e)
                                }}
                            />
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <div style={{marginBottom: '15px'}}>
                        <DataTable
                            persistTableHead
                            columns={electricTotalColumns}
                            customStyles={electricTotalCustomStyles}
                            data={electricTotalData}
                            sortIcon={<NoIconComponent/>}
                            noDataComponent={<NoDataComponent/>}
                            responsive={true}
                        />
                    </div>
                </CardBody>
            </Card>

        </Fragment>
    )
}
export default ElectricTotal
