import { useEffect, useState } from "react"
import { Card, CardBody, CardHeader, CardTitle, Col } from "reactstrap"
import Flatpickr from 'react-flatpickr'
import moment from "moment"
import { getTableData, setStringDate } from '@utils'
import Cookies from 'universal-cookie'
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import { 
  API_INSPECTION_MAIN_EMPCLASS_COUNT
} from "@src/constants"

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

import InspectCustomButtonGroup from "./InspectCustomButtonGroup"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import CustomHelpCircle from "../../../apps/CustomHelpCircle"

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
          stacked: true
      },
      y: {
          stacked: true,
          ticks: {
              callback: function(value) {
                  return `${value} 건`
              },
              stepSize: 1
          }
      }
  }   
}

const InspectResultBarChart = () => {
  //axios csrf
  useAxiosIntercepter()

  // property 위한 쿠키
  const cookies = new Cookies()

  // default data 
  const defaultData = {
    labels : [],
    datasets: []
  }// default data end

  // now yesterday
  const now = moment().subtract(0, 'days')
  const yesterday = moment().subtract(1, 'days')

  // 기간 value state
  const [picker, setPicker] = useState([yesterday.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')])

  // 기간 타입 state 일 / 주 / 월
  const [periodType, setReportPeriod] = useState(1)

  // chart data state
  const [empClassReportDataset, setEmpClassReportDataset] = useState(defaultData)

  // useEffect
  // 화면 랜더링시 라벨과 사업소를 보내서 데이터를 받아옴
  // 기간 타입 변경되면 일 / 주 / 월 형태로 차트 변경
  // 기간이 변경 되면 db에서 데이터를 새로 받옴
  useEffect(() => {
    const param = {
      property : cookies.get('property').value,
      picker : picker,
      periodType : periodType
    }
    getTableData(API_INSPECTION_MAIN_EMPCLASS_COUNT, param, setEmpClassReportDataset)
  }, [picker, periodType])

  return (
    <Card style={{minHeight:'550px'}}>
      <CardHeader className="pb-0">
          <CardTitle className=" px-0">
              점검 실적 관리
              <CustomHelpCircle
                id={'resultBarChart'}
                content={'점검 실적 현황을 알 수 있습니다.'}
              /> 
          </CardTitle>
          <InspectCustomButtonGroup
            setPeriodCallback={setReportPeriod}
            periodObj={{
              label: ['일', '주', '월'],
              value: [1, 2, 3]
            }}
          />
      </CardHeader>
      <CardHeader className="pb-0 justify-content-start">
        <Col lg={1} className="px-0 mx-0">
          {"기간"}
        </Col>
        <Col lg={5} className="px-0">
          <Flatpickr
            className='form-control'
            value={picker}
            onChange={date => { 
              if (date.length === 2) {
                setPicker(setStringDate(date))
              }
            }}
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
      </CardHeader>
      <CardBody className="px-1 py-1">
        <Bar 
          data={empClassReportDataset}
          options={options}
				/>
      </CardBody>
    </Card>
  )
}
export default  InspectResultBarChart