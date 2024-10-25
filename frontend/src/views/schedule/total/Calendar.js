// ** React Import
import { useEffect, useRef, memo } from 'react'
import { useNavigate } from "react-router-dom"

import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/ko'
import { Card, CardBody } from 'reactstrap'
import { Menu } from 'react-feather'
import {detailPageUrl} from '../data'

const Calendar = props => {

  // ** Refs
  const calendarRef = useRef(null)
  const navigate = useNavigate()

  // ** Props
  const {
    store,
    isRtl,
    calendarsColor,
    calendarApi,
    setCalendarApi,
    handleEditEventSidebar,
    toggleSidebar,
    registerModal,
    setRegisterModal
  } = props

  // ** UseEffect checks for CalendarAPI Update
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi])

  // ** calendarOptions(Props)
  const calendarOptions = {
    events: store.events && store.events.length ? store.events : [],
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
        start: 'sidebarToggle, prevYear, prev,next, nextYear, title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth custom1'
    },
    editable: true,
    locale: esLocale,
    eventOrderStrict: true,
    slotEventOverlap:false,
    eventOverlap:false,

    dragScroll: true,
    dayMaxEventRows: 1,

    dayMaxEvents: 2,
    
    eventOrder: 'id',
    eventOrderStrict: true,
    navLinks: true,
    eventLimit: true,
    
    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `bg-light-${colorName}`
      ]
    },

    eventClick({ event: clickedEvent }) {
      const filter = clickedEvent._def.extendedProps.calendar
      const id = clickedEvent._def.publicId
      if (filter === '나의 메모') {
        handleEditEventSidebar(clickedEvent)
      } else if (filter === '교육') {
        navigate(`${detailPageUrl[clickedEvent._def.extendedProps.type]}/${id}`)
      } else {
        navigate(`${detailPageUrl[filter]}/${id}`)
      }
    },

    customButtons: {
      sidebarToggle: {
        text: <Menu className='d-xl-none d-block' />,
        click() {
          toggleSidebar(true)
        }
      },
      custom1: {
        text:<div className='calendar-registeration-button'>등록</div>,
        className:'calendar-registeration-button',
        click() {
            setRegisterModal(!registerModal)
            }
        }
    },

    ref: calendarRef,

    // Get direction from app state (store)
    direction: isRtl ? 'rtl' : 'ltr'
  }

  return (
    <Card className='overflow-auto shadow-none border-0 mb-0 rounded-0'>
      <CardBody className='mx-0 pb-0' style={{minWidth:'700px'}}>
        <FullCalendar {...calendarOptions}/>
      </CardBody>
    </Card>
  )
}

export default memo(Calendar)
