import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState, useRef } from "react"
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import DataTable from 'react-data-table-component'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import axios from "axios"

import { 
    API_ENERGY_ELECTRIC_ITS,
    API_ENERGY_BASIC_MAGNIFICATION_BUILDINGS
} from "@src/constants"

import { 
    getTableData,
    setStringDate
} from '@utils'
// 

import { 
    electricITSSCustomStyles,
    electricITSSColumns
} from "../../data"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from '../../../../../components/TotalLabel'

// //첫 랜더링에서 effect 효과 막기
const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false)
  
    useEffect(() => {
      if (didMount.current) func()
      else didMount.current = true
    }, deps)
}// useDidMountEffect end

const ElectricITSS = () => {
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
    // now yesterday
    const now = moment().subtract(0, 'days').format('YYYY-MM-DD')
    const yesterday = moment().subtract(6, 'days').format('YYYY-MM-DD')

    // dataset state
    const [electricITSSData, setElectricITSSData] = useState([])

    // date state
    const [dayElectric, setDayElectric] = useState([yesterday, now])

    // building state
    const [selectBuild, setselectBuild] = useState({label: '선택', value:''})
    const [buildElectric, setBuildElectric] = useState([])

    // select 선택시 데이터를 새로 받아옴
    useDidMountEffect(() => {
        if (selectBuild && Object.keys(selectBuild).includes('value')) {
            const param = {
                property : cookies.get('property').value,
                targetDate : dayElectric,
                building : selectBuild.value
            }
            // 차트에 들어갈 데이터 배열을 받아옴
            getTableData(API_ENERGY_ELECTRIC_ITS, param, setElectricITSSData)
        }// if end
    }, [dayElectric, selectBuild, buildElectric])

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
                        breadCrumbTitle='빙축열 조회' 
                        breadCrumbParent='에너지관리' 
                        breadCrumbParent2='전력사용관리'
                        breadCrumbActive='빙축열 조회'
                    />
                </div>
			</Row>
            <Card>
                <CardHeader className='pb-0'>
                    <CardTitle>
                        빙축열 조회
                    </CardTitle>
                    <Row className='w-50'>
                        <Col xs={12} lg={1} className='mt-1 mx-0 pe-0 electric-label-7'>
                            {"기간:"}
                        </Col>
                        <Col xs={12} lg={6}>
                            <Flatpickr 
                                id='picker'
                                className='form-control mt-1'
                                value={dayElectric}
                                onChange={date => { 
                                    if (date.length === 2) {
                                        setDayElectric(setStringDate(date))
                                    }
                                }}
                                options={{
                                    mode: 'range',
                                    ariaDateFormat:'Y-m-d',
                                    locale: {
                                      rangeSeparator: ' ~ '
                                    },
                                    maxDate: now,
                                    locale: Korean
                                }}
                            />
                        </Col>
                        <Col xs={12} lg={1} className='mt-1 mx-0 pe-0 electric-label-7'>
                            {"건물:"}
                        </Col>
                        <Col xs={12} lg={4}>
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
                <CardBody className='mt-0'>
                    <TotalLabel 
                        num={3}
                        data={electricITSSData.length}
                    />
                    <div style={{marginBottom: '15px'}}>
                        <DataTable
                            persistTableHead
                            columns={electricITSSColumns}
                            customStyles={electricITSSCustomStyles}
                            data={electricITSSData}
                            sortIcon={<NoIconComponent/>}
                            noDataComponent={<NoDataComponent/>}
                        />
                    </div>
                </CardBody>
            </Card>
        </Fragment>
    )
}
export default ElectricITSS
