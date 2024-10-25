import { Fragment, useEffect, useState} from "react"
import Cookies from "universal-cookie"
import axios from 'axios'
import * as moment from 'moment'
import { useParams } from 'react-router'
import Breadcrumbs from '@components/breadcrumbs'
import { Card, CardBody, CardHeader, CardTitle, Row, Col } from "reactstrap"
import { pickerDateChange, getTableData } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import Filter from '../list/Filter'
import { API_ENERGY_BASIC_MAGNIFICATION_BUILDINGS } from '../../../../constants'
import {solidTypeObj, monthlyList, solidApiObj} from '../../data'
import SolidDay from "./page/SolidDay"
import SolidMonthly from "./page/SolidMonthly"
import SoildCompare from "./page/SoildCompare"
import TotalLabel from "../../../../components/TotalLabel"

const yearList = []
const currentYear = new Date().getFullYear()
const startYear = 1970
for (let year = currentYear; year >= startYear; year--) {
    yearList.push({ label: `${year}년`, value: `${year}` })
}

const SolidAmountList = () => {
    useAxiosIntercepter()
    const { page } = useParams()
    const cookies = new Cookies()
    const now = moment().subtract(0, 'days')
    const yesterday = moment().subtract(7, 'days')
	const [picker, setPicker] = useState([yesterday.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')])
    const [year, setYear] = useState(yearList[0])
    const [year2, setYear2] = useState(yearList[0])
    const [month, setMonth] = useState(monthlyList[0])
    const [month2, setMonth2] = useState(monthlyList[0])
    const [buildingList, setBuildingList] = useState([])
    const [selectBuilding, setSelectBuilding] = useState()
    const [data, setData] = useState([])

    const paramObj = {
        day : {
            propertyId: cookies.get('property').value,
            buildingId: selectBuilding ? selectBuilding.value : '', 
            picker:pickerDateChange(picker)
        },
        monthly : {
            buildingId: selectBuilding ? selectBuilding.value : '', 
            type: page,
            year : year.value,
            month: month.value,
            year2: year2.value,
            month2: month2.value
        },
        compare : {
            buildingId: selectBuilding ? selectBuilding.value : '',            
            type: page,
            year : year.value,
            month: month2.value,
            year2: year2.value,
            month2: month2.value
        },
        year : {
            buildingId: selectBuilding ? selectBuilding.value : '',            
            type: page,
            year : year.value,
            year2: year2.value
        }
    }

    useEffect(() => {
        getTableData(solidApiObj[page], paramObj[page], setData)
    }, [picker, selectBuilding, month, month2, year, year2])

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
                    setBuildingList(tempList)
                    setSelectBuilding(tempList[0])
                }
            }
        )
	}, [])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle={solidTypeObj[`${page}`]} breadCrumbParent='에너지관리' breadCrumbParent2='가스사용관리' breadCrumbActive={solidTypeObj[`${page}`]} />
                </div>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <CardTitle>{solidTypeObj[`${page}`]}</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col md={8}>
                                    <Filter
                                        page={page}
                                        cookies={cookies}
                                        picker={picker}
                                        setPicker={setPicker}
                                        selectBuilding={selectBuilding}
                                        setSelectBuilding={setSelectBuilding}
                                        year={year}
                                        year2={year2}
                                        setYear={setYear}
                                        setYear2={setYear2}
                                        yearList={yearList}
                                        month={month}
                                        setMonth={setMonth}
                                        month2={month2}
                                        setMonth2={setMonth2}
                                        buildingList={buildingList}
                                    />
                                </Col>
                            </Row>
                            <TotalLabel 
                                num={3}
                                data={data.length}
                            />
                            { page === 'day' &&
                                <SolidDay 
                                    data={data}
                                />
                            }
                            { page === 'monthly' &&
                                <SolidMonthly 
                                    data={data}
                                />
                            }
                           {(page === 'compare' || page === 'year') && (
                                <SoildCompare 
                                    data={data}
                                />
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default SolidAmountList