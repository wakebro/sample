import { useState, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle} from "reactstrap"
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import { useNavigate, Link } from "react-router-dom"
import Cookies from 'universal-cookie'
import { getTableData } from '@utils'
import moment from "moment"
import { 
  ROUTE_SCHEDULE_REGISTRATION_INSPECT_CALENDAR
} from "@src/constants"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/ko'

// ** Styles
import '@styles/react/apps/inspect-calendar.scss'
import { API_INSPECTION_MAIN_CHECK_EVENT, ROUTE_INSPECTION_INSPECTION_DETAIL } from "../../../../constants"
import { checkOnlyView } from "../../../../utility/Utils"
import { useSelector } from "react-redux"
import { SCHEDULE_REGISTER } from "../../../../constants/CodeList"
import CustomHelpCircle from "../../../apps/CustomHelpCircle"

// events 가 데이터
const InspectMonthCheckList = () => {
  //axios csrf
  useAxiosIntercepter()
  const loginAuth = useSelector((state) => state.loginAuth)

  // property 위한 쿠키
  const cookies = new Cookies()

  // navi
  const navigate = useNavigate()

  // now date val
  const now = moment().subtract(0, 'days')
  
  // data states
  const [checkEventList, setCheckEventList] = useState([])
  // now date state
  const [nowDate] = useState(now.format('YYYY년 MM월'))

  // calendar event onclick
  const onClickCalendarEvent = (e) => {
    const checkListId = e.event._def.publicId
    navigate(`${ROUTE_INSPECTION_INSPECTION_DETAIL}/${checkListId}`, {state:{type: undefined, scheduleId:e.schedule}})
  }

  // useEffect
  // 화면 랜더링시 라벨과 사업소를 보내서 데이터를 받아옴
  useEffect(() => {
    const param = {
      property : cookies.get('property').value
    }
    // 차트에 들어갈 데이터 배열을 받아옴
    getTableData(API_INSPECTION_MAIN_CHECK_EVENT, param, setCheckEventList)
  }, [])

  return (
    <Card style={{minHeight:'550px'}}>
      <CardHeader className="pb-0">
          <CardTitle>
              월간 점검 리스트 
              <CustomHelpCircle
                id={'monthlyCheckList'}
                content={'한달 간 해야할 점검 리스트를 볼 수 있습니다.'}
              /> 
          </CardTitle>
          <CardTitle className="d-flex">
              <div className="mx-1" style={{paddingTop: '5px'}}>
                {nowDate}
              </div>
              <div className="ms-1">
                <Button
                  hidden={checkOnlyView(loginAuth, SCHEDULE_REGISTER, 'available_read')}
                  color='primary'
                  tag={Link}
                  to={`${ROUTE_SCHEDULE_REGISTRATION_INSPECT_CALENDAR}`}
                  state = {{type:'inspection'}}
                >
                  바로가기
                </Button>
              </div>
          </CardTitle>
      </CardHeader>
      <CardBody className="px-0 py-0">
        <div className="inspect-calendar">
          <FullCalendar
            plugins={[dayGridPlugin]}
            headerToolbar={{
              start: '',
              end: ''
            }}
            locale={esLocale}
            events={checkEventList}
            dayMaxEvents={2}
            height={"auto"}
            eventClick={(e) => { onClickCalendarEvent(e) }}
          />
        </div>
      </CardBody>
    </Card>
  )
}
export default  InspectMonthCheckList