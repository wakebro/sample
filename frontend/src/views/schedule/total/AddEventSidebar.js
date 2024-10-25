import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState } from 'react'
import Swal from "sweetalert2"
import Cookies from 'universal-cookie'
import * as yup from 'yup'
import axios from "../../../utility/AxiosConfig"
// ** Third Party Components
import { X } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { Controller, useForm } from 'react-hook-form'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Select from 'react-select'

// ** Reactstrap Imports
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'

// ** Utils
import { isObjEmpty, selectThemeColors } from '@utils'

// ** Styles Imports
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'

import { API_EDUCATION_EMPLOYEE_LIST, API_SCHEDULE_MEMO_DETAIL, API_SCHEDULE_MEMO_FORM } from '../../../constants'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { primaryColor } from '../../../utility/Utils'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const AddEventSidebar = props => {
  useAxiosIntercepter()
  // ** Props
  const {
    open,
    eventId,
    setEventId,
    handleAddEventSidebar
  } = props

  // ** Vars & Hooks
  const selectedEvent = {},
    {
      control,
      setError,
      setValue,
      getValues,
      handleSubmit,
      formState: { errors }
    } = useForm({
      defaultValues: { title: '' },
      resolver: yupResolver(yup.object().shape({title: yup.string().required('제목을 입력해주세요.')}))
    })

  // ** States
  const cookies = new Cookies()
  const [desc, setDesc] = useState('')
  const [guests, setGuests] = useState({})
  const [allDay, setAllDay] = useState(false)
  const [endPicker, setEndPicker] = useState(new Date())
  const [startPicker, setStartPicker] = useState(new Date())
  const [partners, setPartners] = useState([])

  const formatDateTime = (datetimeString) => {
    if (!datetimeString) {
      return false
    }
    const date = new Date(datetimeString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1)
    const day = String(date.getDate())
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  // ** Adds New Event
  const handleAddEvent = () => {
    const obj = {
      title: getValues('title'),
      start: startPicker,
      end: endPicker,
      allDay,
      display: 'block',
      extendedProps: {
        filter: '나의 메모',
        guests: guests.length ? guests : undefined,
        desc: desc.length ? desc : undefined
      }
    }
    let userIdList = []
    if (obj.extendedProps.guests !== undefined) {
      obj.extendedProps.guests.map(data => userIdList.push(data.value))
    } else {
      userIdList = null
    }
    const formData = new FormData()
    formData.append('title', obj.title)
    formData.append('start_datetime', formatDateTime(obj.start))
    formData.append('end_datetime', formatDateTime(obj.end))
    formData.append('all_day', obj.allDay)
    formData.append('filter', obj.extendedProps.filter)
    formData.append('partner',  userIdList)
    formData.append('memo', obj.extendedProps.desc)
    formData.append('user', cookies.get('userId'))

    axios.post(API_SCHEDULE_MEMO_FORM, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    .then(res => {
        if (res.status === 200) {
            Swal.fire({
                icon: "success",
                html: '등록을 성공적으로 완료하였습니다.!',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: "확인",
                cancelButtonColor : primaryColor,
                reverseButtons :true,
                customClass: {
                    actions: 'sweet-alert-custom right'
                }
            }).then(() => {
                handleAddEventSidebar()
                window.location.reload()
            })
        }
    }).catch(res => {
        console.log(res, "!!!!!!!!error")
    })
  }

  // ** Reset Input Values on Close
  const handleResetInputValues = () => {
    setValue('title', '')
    setAllDay(false)
    setDesc('')
    setGuests({})
    setEventId('')
    setStartPicker(new Date())
    setEndPicker(new Date())
  }
  // ** Updates Event in Store
  const handleUpdateEvent = () => {
    if (getValues('title').length) {
      const eventToUpdate = {
        id: selectedEvent.id,
        title: getValues('title'),
        allDay,
        start: startPicker,
        end: endPicker,
        display: allDay === false ? 'block' : undefined,
        extendedProps: {
          filter: '나의 메모',
          description: desc,
          guests
        }
      }
      let userIdList = []
    if (eventToUpdate.extendedProps.guests !== undefined) {
      eventToUpdate.extendedProps.guests.map(data => userIdList.push(data.value))
    } else {
      userIdList = null
    }
    const formData = new FormData()
    formData.append('title', eventToUpdate.title)
    formData.append('start_datetime', formatDateTime(eventToUpdate.start))
    formData.append('end_datetime', formatDateTime(eventToUpdate.end))
    formData.append('all_day', eventToUpdate.allDay)
    formData.append('filter', eventToUpdate.extendedProps.filter)
    formData.append('partner',  userIdList)
    formData.append('memo', eventToUpdate.extendedProps.description)

    axios.put(`${API_SCHEDULE_MEMO_DETAIL}/${eventId._def.publicId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    .then(res => {
        if (res.status === 200) {
            Swal.fire({
                icon: "success",
                html: '수정을 성공적으로 완료하였습니다.!',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: "확인",
                cancelButtonColor : primaryColor,
                reverseButtons :true,
                customClass: {
                    actions: 'sweet-alert-custom right'
                }
            }).then(() => {
                handleAddEventSidebar()
                window.location.reload()
            })
        }
    }).catch(res => {
        console.log(res, "!!!!!!!!error")
    })
    } else {
      setError('title', {
        type: 'manual'
      })
    }
  }

  // ** (UI) removeEventInCalendar

  const handleDeleteEvent = () => {
    Swal.fire({
			icon: "warning",
			html: "정말 삭제하시겠습니까?",
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonText: "취소",
			confirmButtonText: '확인',
			confirmButtonColor : primaryColor,
			reverseButtons :true,
			customClass: {
				actions: 'sweet-alert-custom right',
				cancelButton: 'me-1'
			}
		}).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${API_SCHEDULE_MEMO_DETAIL}/${eventId._def.publicId}`)
        .then(res => {
					if (res.status === 200) {
						Swal.fire({
              icon: "success",
              html: `삭제 성공적으로 완료하였습니다.!`,
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: "확인",
              cancelButtonColor : primaryColor,
              reverseButtons :true,
              customClass: {
                actions: 'sweet-alert-custom right'
              }
            }).then(() => {
              handleAddEventSidebar()
              window.location.reload()
            })
					}
				})
      } else if (result.dismiss) {
				Swal.fire({
					icon: "info",
					html: "취소하였습니다.",
					showCancelButton: true,
					showConfirmButton: false,
					cancelButtonText: "확인",
					cancelButtonColor : primaryColor,
					reverseButtons :true,
					customClass: {
						actions: 'sweet-alert-custom right'
					}
				})
			}
    })
   
  }

  // ** Event Action buttons
  const EventActions = () => {
    if (eventId === '') {
      return (
        <Fragment>
            <Button className='me-1' color='report' type='reset' onClick={handleAddEventSidebar} outline>
                취소
            </Button>
            <Button  type='submit' color='primary'>
                확인
            </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button className='me-1' color='danger' onClick={handleDeleteEvent} outline>
            삭제
          </Button>
          <Button color='primary' onClick={handleUpdateEvent}>
            수정
          </Button>
        </Fragment>
      )
    }
  }

  // ** Close BTN
  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleAddEventSidebar} />

  useEffect(() => {
    axios.get(API_EDUCATION_EMPLOYEE_LIST, { params: {propId: cookies.get('property').value} })
    .then(res => {
        const tempUserList = []
        res.data.map(data => {
            data.employee.map(employee => {
                tempUserList.push({value: employee.id, label:employee.name})
            })
        })
        setPartners(tempUserList)
    })
  }, [])

  useEffect(() => {
    if (eventId) {
      const result = []
      const description = eventId._def.extendedProps.desc
      setValue('title', eventId._def.title || getValues('title'))
      setAllDay(eventId._def.allDay || allDay)
      setDesc((description !== 'undefined' && description) || desc)
      if (eventId._def.extendedProps.guests !== undefined && eventId._def.extendedProps.guests !== null) {
        const data = eventId.extendedProps.guests.split(',')
        data.map(user => {
          partners.find(partner => { 
            if (String(partner.value) === String(user)) {
              result.push(partner)
            }
          })
        })
      }
      setGuests(result || guests)
      setStartPicker(eventId._instance.range.start)
      setEndPicker(eventId.allDay ? eventId._instance.range.start : eventId._instance.range.end)
    }

  }, [eventId, partners])

  return (
    <Modal
      isOpen={open}
      className='sidebar-lg'
      toggle={handleAddEventSidebar}
      onClosed={handleResetInputValues}
      contentClassName='p-0 overflow-hidden'
      modalClassName='modal-slide-in event-sidebar'
    >
      <ModalHeader className='mb-1' toggle={handleAddEventSidebar} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>
            일정 {selectedEvent && selectedEvent.title && selectedEvent.title.length ? '수정' : '추가'}
        </h5>
      </ModalHeader>
      <PerfectScrollbar options={{ wheelPropagation: false }}>
        <ModalBody className='flex-grow-1 pb-sm-0 pb-3'>
          <Form
            onSubmit={handleSubmit(data => {
              if (data.title.length) {
                if (isObjEmpty(errors)) {
                  if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
                    handleAddEvent()
                  } else {
                    handleUpdateEvent()
                  }
                  handleAddEventSidebar()
                }
              } else {
                setError('title', {
                  type: 'manual'
                })
              }
            })}
          >
            <div className='mb-1'>
              {/* <Label className='form-label' for='title'>
                일정<span className='text-danger'>*</span>
              </Label> */}
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <Col className='card_table col text center'>
                    <Row style={{width:'100%'}}>
                      <Input id='title' placeholder='제묵을 입력해주세요.' invalid={errors.title && true} {...field} />
                      {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                    </Row>
                  </Col>
                )}
              />
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='startDate'>
                시작일/시간
              </Label>
              <Flatpickr
                required
                id='startDate'
                name='startDate'
                className='form-control'
                onChange={date => setStartPicker(date[0])}
                value={startPicker}
                options={{
                  enableTime: allDay === false,
                  dateFormat: 'Y-m-d H:i',
                  locale: Korean
                }}
              />
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='endDate'>
                종료일/시간
              </Label>
              <Flatpickr
                required
                id='endDate'
                // tag={Flatpickr}
                name='endDate'
                className='form-control'
                onChange={date => setEndPicker(date[0])}
                value={endPicker}
                options={{
                  enableTime: allDay === false,
                  dateFormat: 'Y-m-d H:i',
                  locale: Korean
                }}
              />
            </div>

            <div className='form-switch mb-1'>
              <Input
                id='allDay'
                type='switch'
                className='me-1'
                checked={allDay}
                name='customSwitch'
                onChange={e => setAllDay(e.target.checked)}
              />
              <Label className='form-label' for='allDay'>
                All Day
              </Label>
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='guests'>
                직원
              </Label>
              <Select
                isMulti
                id='guests'
                className='react-select'
                classNamePrefix='select'
                isClearable={false}
                placeholder='직원을 선택해주세요.'
                options={partners}
                theme={selectThemeColors}
                value={guests.length ? [...guests] : null}
                onChange={data => setGuests([...data])}
              />
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='description'>
                설명
              </Label>
              <Input
                style={{height:'126px'}}
                type='textarea'
                name='text'
                id='description'
                rows='3'
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder='상세한 설명을 적어보세요.'
              />
            </div>
            <div className='d-flex mb-1' style={{justifyContent:'end'}}>
              <EventActions />
            </div>
          </Form>
        </ModalBody>
      </PerfectScrollbar>
    </Modal>
  )
}

export default AddEventSidebar
