import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row} from "reactstrap"
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'react-feather'
import moment from "moment"
import { getTableData } from '@utils'
import { 
    API_DASHBOARD_COMPLAIN_COUNT, 
    API_DASHBOARD_REPORT_COUNT, 
    API_DASHBOARD_CHECKLIST_COUNT,
    ROUTE_INSPECTION_COMPLAIN,
    ROUTE_INSPECTION_COMPLAIN_REGISTER_TAB
} from "@src/constants"
import Cookies from 'universal-cookie'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Chart
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useEffect, useState } from "react"
import { ROUTE_INSPECTION_REG } from "../../../constants"
import CustomHelpCircle from "../../apps/CustomHelpCircle"

// 차트 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

// 차트 옵션
export const options = {
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: false
          },
        legend: {
            display: false
        },
        tooltip:{
            callbacks:{
                label: (context) => {
                    const label = context.dataset.label
                    return `${label} : ${context.formattedValue} 건`
                }
            }
        }
    },
    scales: {
        x: {
            ticks: {
                font: {
                    size: 10
                }
            }
        },
        y: {
            ticks: {
                callback: function(value) {
                    return `${value} 건`
                },
                stepSize: 1
            }
        }
    }
}


// 대시 보드 공지사항 component
const DashBoardHistogram = () => {
    //axios csrf
    useAxiosIntercepter()

    const labels = []
    // property 위한 쿠키
    const cookies = new Cookies()

    // chart에 들어갈 데이터 state
    const [barCharDataReport, setBarCharDataReport] = useState([])
    const [barCharDataComplain, setBarCharDataComplain] = useState([])
    const [barCharDataCheckList, setBarCharDataCheckList] = useState([])

    // 라벨 제작
    for (let index = 0; index < 7; index++) {
        labels.push(moment().add(index * -1, 'd').format("MM / DD"))
    }
    labels.reverse()

    // 데이터 형태 제작
    const reportData = {
        labels : labels,
        datasets: [
          {
              label: '작업 현황',
              data: barCharDataReport,
              borderColor: '#FFC1AD',
              backgroundColor: '#FFC1AD',
              borderRadius: 5
          }
        ]
    }

    const complainData = {
        labels : labels,
        datasets: [
          {
              label: '불편신고 접수',
              data: barCharDataComplain,
              borderColor: '#FFC996',
              backgroundColor: '#FFC996',
              borderRadius: 5
          }
        ]
    }

    const checkListData = {
        labels : labels,
        datasets: [
          {
              label: '점검 현황',
              data: barCharDataCheckList,
              borderColor: '#FFC1AD',
              backgroundColor: '#FFC1AD',
              borderRadius: 5
          }
        ]
    }

    // 화면 랜더링시 라벨과 사업소를 보내서 데이터를 받아옴
    useEffect(() => {
        const param = {
            property : cookies.get('property').value,
            labels : labels
        }
        // 차트에 들어갈 데이터 배열을 받아옴
        getTableData(API_DASHBOARD_REPORT_COUNT, param, setBarCharDataReport)
        getTableData(API_DASHBOARD_COMPLAIN_COUNT, param, setBarCharDataComplain)
        getTableData(API_DASHBOARD_CHECKLIST_COUNT, param, setBarCharDataCheckList)
	}, [])

    return (
        <>
            <Col lg={4} md={6} xs={12}>
                <Card>
                    <CardHeader>
                        <CardTitle className="dashboard-custom-title px-0">
                            작업 완료 현황 
                            <CustomHelpCircle
                                id={'report'}
                                content={'금주의 완료된 작업 현황을 알 수 있습니다.'}
                            /> 
                        </CardTitle>
                        <Row>
                            <Col>
                                <Button className="px-1" color='primary' 
                                    tag={Link}
                                    to={`${ROUTE_INSPECTION_COMPLAIN}`}
                                >
                                    바로가기 <ChevronRight style={{width: '14', height: '14'}}/>
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody className="px-1 py-1">
                        <Bar 
							data={reportData}
                            options={options}
						/>
                    </CardBody>
                </Card>
            </Col>
            <Col lg={4} md={6} xs={12}>
                <Card>
                    <CardHeader>
                        <CardTitle className="dashboard-custom-title">
                            불편신고 접수 
                            <CustomHelpCircle
                                id={'complain'}
                                content={'금주의 접수된 불편신고에 대한 현황을 알 수 있습니다.'}
                            />
                        </CardTitle>
                        <Row>
                            <Col>
                                <Button className="px-1" color='primary' 
                                    tag={Link}
                                    to={`${ROUTE_INSPECTION_COMPLAIN_REGISTER_TAB}`}
                                >
                                    바로가기 <ChevronRight style={{width: '14', height: '14'}}/>
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody className="px-1 py-1">
                        <Bar 
							data={complainData}
                            options={options}
						/>
                    </CardBody>
                </Card>
            </Col>
            <Col lg={4} md={6} xs={12}>
                <Card>
                    <CardHeader>
                        <CardTitle className="dashboard-custom-title">
                            점검 현황
                            <CustomHelpCircle
                                id={'checkList'}
                                content={'금주의 점검 현황을 알 수 있습니다.'}
                            />
                        </CardTitle>
                        <Row>
                            <Col>
                                <Button className="px-1" color='primary' 
                                    tag={Link}
                                    to={`${ROUTE_INSPECTION_REG}/mg`}
                                    >
                                    바로가기 <ChevronRight style={{width: '14', height: '14'}}/>
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody className="px-1 py-1">
                        <Bar 
							data={checkListData}
                            options={options}
						/>
                    </CardBody>
                </Card>
            </Col>
        </>
    )
}
export default DashBoardHistogram