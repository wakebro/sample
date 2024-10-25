import { Card, CardBody, CardHeader, CardTitle, Col} from "reactstrap"
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Cookies from 'universal-cookie'
import moment from "moment"
import { useEffect, useState } from "react"
import { getTableData } from '@utils'
import { 
    // API_DASHBOARD_GAUGE_TOTAL_COUNT,
    API_DASHBOARD_ELECTRIC_CHART,
    API_DASHBOARD_SOLID_BOILER_CHART,
    API_DASHBOARD_SOLID_WATER_CHART,
    API_DASHBOARD_UTILITIES_CHART
 } from "@src/constants"

// 라인 차트 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
import { 
    // options, 
    electricOptions,
    solidOptions,
    waterOptions,
    utilitiesOptions
} from "../data"
import CustomHelpCircle from "../../apps/CustomHelpCircle"

// 대시 보드 line chart component
const DashBoardLinechart = () => {
    //axios csrf
    useAxiosIntercepter()

    // 사업소 데이터를 위한 쿠키선언
    const cookies = new Cookies()
    // 라밸 제작
    // backend로 넘겨줄 label
    const labelsDay = []
    for (let index = 0; index < 7; index++) {
        labelsDay.push(moment().add(index * -1, 'd').format("M / D"))
    }
    labelsDay.reverse()

    const labelsMonth = []
    for (let index = 0; index < 6; index++) {
        labelsMonth.push(moment().add(index * -1, 'M').format("Y / M"))
    }
    labelsMonth.reverse()

    // 보여줄 label
    const labelsDayShow = []
    for (let index = 0; index < 7; index++) {
        labelsDayShow.push(moment().add(index * -1, 'd').format("MM / DD"))
    }
    labelsDayShow.reverse()

    const labelsMonthShow = []
    for (let index = 0; index < 6; index++) {
        labelsMonthShow.push(moment().add(index * -1, 'M').format("Y / MM"))
    }
    labelsMonthShow.reverse()

    // 계기 state 
    // const [gaugeTotalData, setGaugeTotalData] = useState([])
    const [electricData, setElectricData] = useState([])
    const [solidBoilerData, setSolidBoilerData] = useState([])
    const [solidWaterData, setSolidWaterData] = useState([])
    const [utilitiesData, setUtilitiesData] = useState([])

    // 계기 사용 분석
    // const gaugeDefaultData = {
    //     labels: labelsDayShow,
    //     datasets: gaugeTotalData
    // }// data end
    
    // 전기 사용 분석
    const electricDefaultData = {
        labels: labelsMonthShow,
        datasets: electricData
    }// data end
    // 가스(보일러) 사용 분석
    const solidBoilerDefaultData = {
        labels: labelsMonthShow,
        datasets: solidBoilerData
    }// data end
    // 수도 사용 분석
    const solidWaterDefaultData = {
        labels: labelsMonthShow,
        datasets: solidWaterData
    }// data end
    // 수광비 사용 분석
    const utilitiesDefaultData = {
        labels: labelsMonthShow,
        datasets: utilitiesData
    }// data end
    // 화면 랜더링시 사업소와 라벨을 backend로 보내서 데이터를 받아옴
    useEffect(() => {
        // const paramDay = {
        //     property : cookies.get('property').value,
        //     labels : labelsDay
        // }
        const paramMonth = {
            property : cookies.get('property').value,
            labels : labelsMonth
        }
        // const paramMonthtest = {
        //     property : cookies.get('property').value,
        //     labels : labelsMonthTemp
        // }
        // 일일 계기 데이터를 받아옴 python dict타입으로 받음.
        // getTableData(API_DASHBOARD_GAUGE_TOTAL_COUNT, paramDay, setGaugeTotalData)
        getTableData(API_DASHBOARD_ELECTRIC_CHART, paramMonth, setElectricData)
        getTableData(API_DASHBOARD_SOLID_BOILER_CHART, paramMonth, setSolidBoilerData)
        getTableData(API_DASHBOARD_SOLID_WATER_CHART, paramMonth, setSolidWaterData)
        getTableData(API_DASHBOARD_UTILITIES_CHART, paramMonth, setUtilitiesData)
	}, [])
    return (
        <>
            {/* <Col lg={4} md={6} xs={12}>
                <Card style={{minHeight: '350px'}}>
                    <CardHeader>
                        <CardTitle className="dashboard-custom-title">
                            계기 사용 분석 
                            <CustomHelpCircle
                                id={'gaugeLineChart'}
                                content={'일일 계기의 검침량을 분석 할 수 있습니다.'}
                            />
                        </CardTitle>
                        <Row>
                        </Row>
                    </CardHeader>
                    <CardBody className="px-1 py-1">
                        <Line 
                            data={gaugeDefaultData} 
                            options={options}
                        />
                    </CardBody>
                </Card>
            </Col> */}
            <Col lg={4} md={6} xs={12}>
                <Card style={{minHeight: '350px'}}>
                    <CardHeader>
                        <CardTitle className="dashboard-custom-title">
                            {"가스(보일러) 사용 분석"} 
                            <CustomHelpCircle
                                id={'solidBoilerLineChart'}
                                content={'6개월간의 가스(보일러)에 대한 사용량을 분석 할 수 있습니다.'}
                            />
                        </CardTitle>
                    </CardHeader>
                    <CardBody className="px-1 py-1">
                        <Line 
                            data={solidBoilerDefaultData}
                            options={solidOptions}
                        />
                    </CardBody>
                </Card>
            </Col>
            <Col lg={4} md={6} xs={12}>
                <Card style={{minHeight: '350px'}}>
                    <CardHeader>
                        <CardTitle className="dashboard-custom-title">
                            {"수도 사용 분석"} 
                            <CustomHelpCircle
                                id={'solidWaterLineChart'}
                                content={'6개월간의 가스(수도)에 대한 사용량을 분석 할 수 있습니다.'}
                            />
                        </CardTitle>
                    </CardHeader>
                    <CardBody className="px-1 py-1">
                        <Line 
                            data={solidWaterDefaultData}
                            options={waterOptions}
                        />
                    </CardBody>
                </Card>
            </Col>
            <Col lg={4} md={6} xs={12}>
                <Card style={{minHeight: '350px'}}>
                    <CardHeader>
                        <CardTitle className="dashboard-custom-title">
                            {"전기 사용 분석"} 
                            <CustomHelpCircle
                                id={'electricLineChart'}
                                content={'6개월간의 전기 사용량을 분석 할 수 있습니다.'}
                            />
                        </CardTitle>
                    </CardHeader>
                    <CardBody className="px-1 py-1">
                        <Line 
                            data={electricDefaultData}
                            options={electricOptions}
                        />
                    </CardBody>
                </Card>
            </Col>
            <Col lg={4} md={6} xs={12}>
                <Card style={{minHeight: '350px'}}>
                    <CardHeader>
                        <CardTitle className="dashboard-custom-title">
                            {"수광비 사용 분석"} 
                            <CustomHelpCircle
                                id={'utilitiesLineChart'}
                                content={'6개월간의 수광비 실적을 분석 할 수 있습니다.'}
                            />
                        </CardTitle>
                    </CardHeader>
                    <CardBody className="px-1 py-1">
                        <Line 
                            data={utilitiesDefaultData}
                            options={utilitiesOptions}
                        />
                    </CardBody>
                </Card>
            </Col>
        </>
    )
}
export default DashBoardLinechart
