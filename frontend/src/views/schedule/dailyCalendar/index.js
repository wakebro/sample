// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
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
import { useLocation } from "react-router-dom"

// ** Store & Actions
import { selectEvent, updateEvent, updateFilter, updateAllFilters } from './store'

import {API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, API_SCHEDULE_CHECKLIST} from '../../../constants'
// ** Styles
import '@styles/react/apps/app-calendar.scss'

const colorList = ['danger', 'primary', 'warning', 'success', 'info', 'safety', 'legal', 'cooperator', 'report', 'skyblue', 'secondary', 'pink']

const CalendarComponent = () => {
  // ** Variables
  const cookies = new Cookies()
  const state = useLocation()

  // ** states
  const [calendarApi, setCalendarApi] = useState(null)
  const [addSidebarOpen, setAddSidebarOpen] = useState(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [filters, setFilters] = useState([])
  const [filterNames, setFilterNames] = useState([])
  const [data, setData] = useState([])
  const [calendarsColor, setCalendarColor] = useState('')
  const [choiceFilter, setChoiceFilter] = useState([])
  const [filterCount, setFilterCount] = useState('')

  // ** Hooks
  const [isRtl] = useRTL()

  // ** AddEventSidebar Toggle Function
  const handleAddEventSidebar = () => setAddSidebarOpen(!addSidebarOpen)

  // ** LeftSidebar Toggle Function
  const toggleSidebar = val => setLeftSidebarOpen(val)


  useEffect(() => {
    axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, { params: {property_id: cookies.get('property').value} })
      .then(res => {
        const tempList = [{ label: '전체보기', color: colorList[1], className: `form-check-${colorList[1]} mb-1`, id: 0, checked : true}]
        const tempCodeList = []
        const tempColor = {}
        let tempCount = 0
        res.data.map((employeeClass, index) => {
          tempCount += 1
          tempList.push({ label: employeeClass.name, color: colorList[index], className: `form-check-${colorList[index]} mb-1`, id: employeeClass.id, checked : true})
          tempCodeList.push(employeeClass.name)
          tempColor[employeeClass.name] = colorList[index]
        })
        setFilters(tempList)
        setFilterNames(tempCodeList)
        setChoiceFilter(tempCodeList)
        setCalendarColor(tempColor)
        setFilterCount(tempCount)
      })
  }, [])

  useEffect(() => {
    if (filterNames.length > 0) {
      axios.get(API_SCHEDULE_CHECKLIST, {params: {property: cookies.get('property').value, type: state.state.type, choiceFilter: choiceFilter}})
      .then(res => {
        setData({
          events : res.data,
          selectedCalendars: filterNames,
          selectedEvent: {}
        })
      })
    }
  }, [filterNames, choiceFilter, state])

  return (
    <Fragment>
        <Row>
            <div className='d-flex justify-content-start'>
                <Breadcrumbs breadCrumbTitle='업무등록' breadCrumbParent='일정' breadCrumbActive='업무등록'/>
            </div>
        </Row>
        <Card>
            <div className='app-calendar overflow-hidden border'>
                <Row className='g-0'>
                    <Col
                      id='app-calendar-sidebar'
                      className={classnames('col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column', {
                      show: leftSidebarOpen
                      })}
                    >
                        <SidebarLeft
                        store={data}
                        updateFilter={updateFilter}
                        toggleSidebar={toggleSidebar}
                        updateAllFilters={updateAllFilters}
                        handleAddEventSidebar={handleAddEventSidebar}
                        filters={filters}
                        choiceFilter={choiceFilter}
                        setChoiceFilter={setChoiceFilter}
                        filterNames = {filterNames}
                        setFilterNames = {setFilterNames}
                        filterCount= {filterCount}
                        />
                    </Col>
                    <Col className='position-relative duty-calendar'>
                        <Calendar
                          isRtl={isRtl}
                          store={data}
                          calendarApi={calendarApi}
                          selectEvent={selectEvent}
                          updateEvent={updateEvent}
                          toggleSidebar={toggleSidebar}
                          calendarsColor={calendarsColor}
                          setCalendarApi={setCalendarApi}
                          handleAddEventSidebar={handleAddEventSidebar}
                          type={state.state}
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
        </Card>
    </Fragment>
  )
}

export default CalendarComponent
