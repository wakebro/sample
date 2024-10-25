/* eslint-disable */
import {useEffect, useRef, memo, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/ko'
import {Card, CardBody} from 'reactstrap'
import {Menu} from 'react-feather'

import {ROUTE_INSPECTION_INSPECTION_DETAIL, ROUTE_SCHEDULE_REGISTRATION, ROUTE_SCHEDULE_REGISTRATION_INSPECT_CALENDAR, ROUTE_CRITICAL_DISASTER_DETAIL, ROUTE_SCHEDULE_REGISTRATION_DISASTER_CALENDAR } from '../../../constants'

import RegisterModal from '../registration/RegisterModal'

const Calendar = props => {
    const navigate = useNavigate()

    const {
        store,
        isRtl,
        calendarsColor,
        calendarApi,
        setCalendarApi,
        toggleSidebar,
        type
    } = props

    const calendarRef = useRef(null)
    const [registerModal, setRegisterModal] = useState(false)
    const [state, setState] = useState('')

    useEffect(() => {
        if (calendarApi === null) {
            // 현재 날짜
            setCalendarApi(calendarRef.current.getApi())
            const buttonList = document.querySelector('.fc-toList-button')
            const buttonCalendar = document.querySelector('.fc-toCalendar-button')
            buttonCalendar.title = '캘린더'
            buttonList.title = '목록'
        }
    }, [calendarApi])

    useEffect(() => {
        const currentViewType = calendarRef.current.getApi().currentDataManager.state.currentViewType
        const buttonCalendar = document.querySelector('.fc-toCalendar-button')
        const buttonList = document.querySelector('.fc-toList-button')

        if (currentViewType === 'dayGridMonth') {
            buttonCalendar.classList.add('fc-button-active')
            buttonCalendar.title = '캘린더'
            buttonList.title = '목록'
        }

        const buttonListCalendar = document.querySelector('.fc-listMonth-button')
        buttonListCalendar.addEventListener('click', function () {
            buttonCalendar.title = '캘린더'
            buttonList.title = '목록'
            buttonCalendar.classList.remove('fc-button-active')
        })
        buttonCalendar.title = '캘린더'
        buttonList.title = '목록'
    }, [])

    const calendarOptions = {
        events: store.events && store.events.length ? store.events : [],
        plugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin ],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'sidebarToggle, prevYear, prev,next, nextYear, title',
            right: 'toList,toCalendar,listMonth, custom1'
        },
        editable: true,

        locale: esLocale,

        eventResizableFromStart: true,

        dragScroll: true,

        dayMaxEvents: 2,

        navLinks: true,

        eventClassNames({event: calendarEvent}) {
            const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]
            return [`bg-light-${colorName}`]
        },

        eventClick({event: clickedEvent}) {
            const id = clickedEvent._def.publicId
            const detailUrl = type.type === 'inspection' ? `${ROUTE_INSPECTION_INSPECTION_DETAIL}/${id}` : `${ROUTE_CRITICAL_DISASTER_DETAIL}/${id}`
            navigate(detailUrl, {state:{type: type.type}})
        },

        customButtons: {
            sidebarToggle: {
                text: <Menu className='d-xl-none d-block'/>,
                click() {
                    toggleSidebar(true)
                }
            },
            custom1: {
                text: <div className='calendar-registeration-button'>등록</div>,
                click() {
                    setRegisterModal(!registerModal)
                }
            },
            toList: {
                text: <div className='calendar-registeration-button'>목록</div>,
                click() {
                    const listUrl = type.type === 'inspection' ? `${ROUTE_SCHEDULE_REGISTRATION}/inspection` : `${ROUTE_SCHEDULE_REGISTRATION}/disaster`
                    navigate(listUrl)
                }
            },
            toCalendar: {
                text: <div className='calendar-registeration-button'>캘린더</div>,
                click() {
                    const url = type.type === 'inspection' ? ROUTE_SCHEDULE_REGISTRATION_INSPECT_CALENDAR : ROUTE_SCHEDULE_REGISTRATION_DISASTER_CALENDAR
                    navigate(url, {
                        state: {
                            type: type.type
                        }
                    })
                }
            }
        },
        ref: calendarRef,
        direction: isRtl ? 'rtl' : 'ltr'
    }

    return (
        <Card className='shadow-none border-0 mb-0 rounded-0'>
            <CardBody className='pb-0'>
                <FullCalendar {...calendarOptions}/>
                <RegisterModal
                    isOpen={registerModal}
                    setIsOpen={setRegisterModal}
                    state={state}
                    setState={setState}
                    type={type.type}/>
            </CardBody>
        </Card>
    )
}

export default memo(Calendar)