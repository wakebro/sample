// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
// ** Third Party Components
import classnames from 'classnames'
import Breadcrumbs from '@components/breadcrumbs'
import { Row, Col, Card } from 'reactstrap'
// ** Calendar App Component Imports
import Calendar from './Calendar'
import SidebarLeft from './SidebarLeft'
// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'
// ** Store & Actions
import { useDispatch } from 'react-redux'

import {API_SCHEDULE_TOTAL} from '../../../constants'
// ** Styles
import '@styles/react/apps/app-calendar.scss'
import AddEventSidebar from './AddEventSidebar'
import { getTableDataCallback } from '../../../utility/Utils'

const colorList = ['skyblue', 'primary', 'danger', 'warning', 'success', 'info', 'safety', 'legal', 'cooperator', 'report', 'secondary', 'pink']

const CalendarComponent = () => {
  // ** Variables
  const dispatch = useDispatch()
  const cookies = new Cookies()

  // ** states
  const [calendarApi, setCalendarApi] = useState(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [filters, setFilters] = useState([])
  const [filterNames, setFilterNames] = useState([])
  const [data, setData] = useState([])
  const [calendarsColor, setCalendarColor] = useState('')
  const [choiceFilter, setChoiceFilter] = useState([])
  const [filterCount, setFilterCount] = useState('')
  const [registerModal, setRegisterModal] = useState(false)
  const [eventId, setEventId] = useState('')


  // ** Hooks
  const [isRtl] = useRTL()

  // ** AddEventSidebar Toggle Function
  const handleAddEventSidebar = () => setRegisterModal(!registerModal)

  const handleEditEventSidebar = (data) => {
    setRegisterModal(!registerModal)
    setEventId(data)
  }

  // ** LeftSidebar Toggle Function
  const toggleSidebar = val => setLeftSidebarOpen(val)

  useEffect(() => {
    getTableDataCallback(
      API_SCHEDULE_TOTAL, 
      {property: cookies.get('property').value, userId: cookies.get('userId'), choiceFilter: choiceFilter, type:true},
      (data) => {
        const tempList = [{ label: '전체보기', color: colorList[1], className: `form-check-${colorList[1]} mb-1`, id: 0, checked : true}]
        const tempCodeList = []
        const tempColor = {}
        let tempCount = 0
        data.map((title, index) => {
            tempCount += 1
            tempList.push({ label: title, color: colorList[index], className: `form-check-${colorList[index]} mb-1`, id: index + 1, checked : true, value: title})
            tempCodeList.push(title)
            tempColor[title] = colorList[index]
        })
        setFilters(tempList)
        setFilterNames(tempCodeList)
        setChoiceFilter(tempCodeList)
        setCalendarColor(tempColor)
        setFilterCount(tempCount)
      }
    )
  }, [])

  useEffect(() => {
    if (filterNames.length > 0) {
      getTableDataCallback(
        API_SCHEDULE_TOTAL, 
        {property: cookies.get('property').value, userId: cookies.get('userId'), choiceFilter: choiceFilter},
        (data) => { 
          setData({ events : data, selectedCalendars: filterNames, selectedEvent: {}}) 
        }
      )
    }
  }, [filterNames, choiceFilter])

  return (
    <Fragment>
        <Row>
            <div className='d-flex justify-content-start'>
                <Breadcrumbs breadCrumbTitle='일정' breadCrumbParent='일정관리' breadCrumbActive='일정'/>
            </div>
        </Row>
          <Card>
              <div className='app-calendar border'>
                  <Row className='g-0'>
                      <Col
                          id='app-calendar-sidebar'
                          className={classnames('col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column', {
                          show: leftSidebarOpen
                          })}
                      >
                          <SidebarLeft
                          store={data}
                          dispatch={dispatch}
                          toggleSidebar={toggleSidebar}
                          filters={filters}
                          choiceFilter={choiceFilter}
                          setChoiceFilter={setChoiceFilter}
                          filterNames = {filterNames}
                          setFilterNames = {setFilterNames}
                          filterCount= {filterCount}
                          />
                      </Col>
                      <Col className='total-calendar'>
                          <Calendar
                            isRtl={isRtl}
                            store={data}
                            dispatch={dispatch}
                            calendarApi={calendarApi}
                            toggleSidebar={toggleSidebar}
                            calendarsColor={calendarsColor}
                            setCalendarApi={setCalendarApi}
                            handleAddEventSidebar={handleAddEventSidebar}
                            handleEditEventSidebar={handleEditEventSidebar}
                            setRegisterModal={setRegisterModal}
                            registerModal={registerModal}
                          />
                      </Col>
                      <div
                          className={classnames('body-content-overlay', {
                          show: leftSidebarOpen === true
                          })}
                          onClick={() => toggleSidebar(false)}
                      ></div>
                  </Row>
              </div>
              <AddEventSidebar 
                  open={registerModal}
                  eventId={eventId}
                  setEventId={setEventId}
                  handleAddEventSidebar={handleAddEventSidebar}
              />

          </Card>
    </Fragment>
  )
}

export default CalendarComponent
