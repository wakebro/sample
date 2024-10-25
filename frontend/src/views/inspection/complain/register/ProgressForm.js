import { Fragment, useState, useEffect } from "react"
import { Label, Row, Card, Button, CardBody, Col, Input, FormFeedback } from 'reactstrap'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import { Controller } from 'react-hook-form'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import CustomHelpCircle from "../../../apps/CustomHelpCircle"
import { autoPhoneNumberHyphen, getObjectKeyCheck, handleFileInputLimitedChange, primaryColor, setStringDate } from "../../../../utility/Utils"
import FileIconImages from "../../../apps/customFiles/FileIconImages"
import { Korean } from "flatpickr/dist/l10n/ko.js"

const ProgressForm = (props) => {
  const {control, errors, handleSelectValidation, employeeClass, classList, workList,
    workType, setRequestDate, setValue, files, setFiles, setConstructStartDate, setConstructEndDate,
    setWorkDate, buildingList, floorList, setBuilding, setFloor, building, floor, setRoom, roomList, room, facilityList,
    problemList, causeList, repairList, setCompleteDate, setReportDate, checkerList, worktargetList, outsourcingList,
    setEducationStartDate, setEducationEndDate, showNames, setShowNames, type, setModal, modal, unregister, setSelectEmployeeClass,
    selectEmployeeClass
} = props
  const [selectedFiles, setSelectedFiles] = useState([])

  const handleClickNow = (date, setDateFunction) => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1 
    const day = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const formattedMonth = month < 10 ? `0${month}` : `${month}`
    const formattedDay = day < 10 ? `0${day}` : `${day}`
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
  
    const formattedDateTime = `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}`
    unregister(date)
    setValue(date, [formattedDateTime])
    setDateFunction([formattedDateTime])

  }

  const handleFileInputChange = (e) => {
    handleFileInputLimitedChange(e, files, setFiles, 6, showNames, setShowNames, setSelectedFiles)
  }

  const onRemoveFile = (file) => {
    const updatedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file)
    setSelectedFiles(updatedFiles)
    setFiles(updatedFiles)
  }

  const onPastRemoveFile = (file) => {
    setShowNames(showNames.filter((element) => element !== file))
}

  useEffect(() => {
    const inputElement = document.getElementById("doc_file")
    inputElement.value = ""
  
    const dataTransfer = new DataTransfer()
    for (let i = 0; i < files.length; i++) {
      dataTransfer.items.add(files[i])
    }
    inputElement.files = dataTransfer.files
  }, [files])
  
  return (
		<Fragment>
      <Row className='d-flex align-items-center justify-content-between'>
        <div className='d-flex justify-content-between mt-1'>
          <div style={{fontSize : '22px', color : primaryColor, fontFamily : 'Montserrat,sans-serif'}}>
          접수내용 및 계획
          </div>
          <Button size="xs" color="primary" style={{whiteSpace: 'nowrap'}} onClick={() => { setModal(!modal) }}>알림발송</Button>
        </div>
      </Row>
      <hr/>
      <Card className="mt-1">
        <Col className="custom-card-header">
					<div className="custom-create-title">접수명</div>
					<div className='essential_value'/>
          <div className="custom-create-title-sub">필수항목</div>
				</Col>
        <hr/>
        <CardBody>
          <Controller
            id='title'
            name='title'
            control={control}
            render={({ field }) => <Input maxLength={499} bsSize='sm' placeholder={'시설물 안전 점검표'} invalid={errors.title && true} {...field} />}
          />
          {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
				</CardBody>
      </Card>

      <Card>
        <Col className="custom-card-header">
					<div className="custom-create-title">접수 정보</div>
					<div className='essential_value'/>
          <div className="custom-create-title-sub">필수항목</div>
				</Col>
        <hr/>
        <CardBody>
            <Row className='mb-1' style={{alignItems:'center'}}>
                <Col md='6' xs='12'>
                    <Row style={{alignItems:'center'}}>
                        <Col className='card_table col text center' xs='2'>접수일시</Col>
                        <Col xs='10'>
                            <Row>
                                <Col xs='7' md='9'>
                                    <Controller
                                    id='request_date'
                                    name='request_date'
                                    control={control}
                                    render={({ field: {onChange, value} }) => (
                                        <Col lg='12' md='12' xs='12' className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                            {/* <Row style={{width:'100%'}}> */}
                                                <Flatpickr
                                                    className={`form-control ${errors.request_date ? 'is-invalid' : ''}`}
                                                    id='default-picker'
                                                    placeholder="YYYY/MM/DD H:mm PM"
                                                    value={value}
                                                    onChange={(data) => {
                                                        const newData = setStringDate(data, true)
                                                        onChange(newData)
                                                        setRequestDate(newData)
                                                        }}
                                                    options = {{
                                                        enableTime: true,
                                                        dateFormat: "Y-m-d H:i",
                                                        locale: Korean
                                                    }}
                                                        />
                                                    {errors.request_date && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.request_date.message}</div>}
                                            {/* </Row> */}
                                        </Col>
                                    )}/>
                                    </Col>
                                <Col xs='3' md='3' className=" align-items-center ">
                                    <Button color="white" style={{borderColor:'gray', whiteSpace: 'nowrap', justifyContent:'end'}} onClick={() => handleClickNow('request_date', setRequestDate)}>현재</Button>
                                    {errors.request_date && <div> &nbsp; </div>}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col md='6' xs='12'>
                    <Row style={{alignItems:'center'}}>
                        <Col className='card_table col text center' xs='2'>업무 구분</Col>
                        <Col xs='10'>
                            <Controller
                                id = 'workType'
                                name='workType'
                                control={control}
                                render={({ field: { value  } }) => (
                                    <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                        <Select
                                            name='workType'
                                            classNamePrefix={'select'}
                                            className="react-select custom-select-workType custom-react-select"
                                            options={workList}
                                            value={value}
                                            onChange={ handleSelectValidation }
                                            />
                                        {workType && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>업무 구분을 선택해주세요.</div>}
                                    </Col>
                            )}/>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row className="mb-1" style={{alignItems:'center'}}>
              <Col md='6' xs='12'>
                <Row style={{alignItems:'center'}}>
                    <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                      직업직종
                    </Col>
                    <Col xs='10' >
                      <Controller
                        id = 'employeeClass'
                        name='employeeClass'
                        control={control}
                        render={({ field: { value } }) => (
                          <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                            <Select
                              name='employeeClass'
                              classNamePrefix={'select'}
                              className="react-select custom-select-employeeClass custom-react-select"
                              options={classList}
                              value={value}
                              defaultValue={classList[0]}
                              onChange={ 
                                (e, event) => {
                                    handleSelectValidation(e, event)
                                    setSelectEmployeeClass(e)
                                }
                              }
                              />
                            {employeeClass && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
                          </Col>
                      )}/>
                    </Col>
                </Row>
              </Col>
            </Row>

            <Row style={{alignItems:'center'}}>
              <Col className='card_table col text center' md= '1' xs='2'>
                접수내용
              </Col>
              <Col md='11' xs='10' >
              <Controller
                id='request_description'
                name='request_description'
                control={control}
                render={({ field }) => <Input bsSize='sm' type="textarea" placeholder={'접수내용 및 계획을 입력해 주세요.'} invalid={errors.request_description && true} {...field} />}
              />
              {errors.request_description && <FormFeedback>{errors.request_description.message}</FormFeedback>}
              </Col>
            </Row>
			
					</CardBody>
        </Card>
        
        <Card>
          <Col className="custom-card-header">
            <div className="custom-create-title">신청자 정보</div>
          </Col>
          <hr/>
          <CardBody>
              <Row className="mb-1" style={{alignItems:'center'}}>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        신청자
                        </Col>
                      <Col xs='10' >
                      <Controller
                        id='requester_name'
                        name='requester_name'
                        control={control}
                        render={({ field }) => <Input bsSize='sm' maxLength={49}  placeholder={'홍길동'} invalid={errors.requester_name && true} {...field} />}
                      />
                      </Col>
                  </Row>
                </Col>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        부서
                        </Col>
                      <Col xs='10' >
                      <Controller
                        id='requester_department'
                        name='requester_department'
                        control={control}
                        render={({ field }) => <Input bsSize='sm'  maxLength={49}  placeholder={'부서명을 입력해 주세요.'} invalid={errors.requester_department && true} {...field} />}
                      />
                      </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mb-1" style={{alignItems:'center'}}>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        연락처
                        </Col>
                      <Col xs='10' >
                        <Controller
                          id='requester_phone'
                          name='requester_phone'
                          control={control}
                          render={({ field: {onChange, value} }) => <Input 
                            bsSize='sm' 
                            maxLength={49}
                            placeholder={'02-0000-0000'} 
                            invalid={errors.requester_phone && true}
                            value={value}
                            onChange={(e) => {
                              autoPhoneNumberHyphen(e, onChange)
                            }}
                            />}
                        />
                      </Col>
                  </Row>
                </Col>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        핸드폰
                        </Col>
                      <Col xs='10' >
                        <Controller
                          id='requester_mobile'
                          name='requester_mobile'
                          control={control}
                          render={({ field : {onChange, value} }) => <Input 
                            bsSize='sm' 
                            maxLength={49}  
                            placeholder={'010-0000-0000'} 
                            invalid={errors.requester_mobile && true} 
                            value={value}
                            onChange={(e) => {
                              autoPhoneNumberHyphen(e, onChange)
                            }}
                          />}
                        />
                      </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
        </Card>

        <Card>
          <Col className="custom-card-header">
            <div className="custom-create-title">작업대상자</div>
          </Col>
          <hr/>
          <CardBody>
            <Row style={{alignItems:'center'}}>
              <Col className='card_table col text center' md= '1' xs='2'>
                작업대상자
              </Col>
              <Col md='11' xs='10' >
              <Controller
                id = 'work_target'
                name='work_target'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                    <Select
                      name='work_target'
                      classNamePrefix={'select'}
                      className="react-select custom-select-work_target custom-react-select"
                      options={worktargetList}
                      value={value}
                      onChange={ e => onChange(e) }
                      />
                  </Col>
                )}/>    
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card>
          <Col className="custom-card-header">
            <div className="custom-create-title">첨부파일</div>
          </Col>
          <hr/>
          <CardBody>
              <Col className="mb-1" md='12' xs='12' >
                <div className="mb-1">
                  <Input type="file" id="doc_file" name="doc_file"  multiple onChange={handleFileInputChange}  />
                </div>
              
                <div className='form-control hidden-scrollbar mt-1' style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    { selectedFiles.length > 0 &&
                        selectedFiles.map((file, idx) => {
                          const ext = file.name.split('.').pop()
                          return (
                            <span key={`file_${idx}`} className="mx-0 px-0">
                              <FileIconImages
                                ext={ext}
                                file={file}
                                filename={file.name}
                                removeFunc={onRemoveFile}
                              />
                            </span>
                          )
                        })
                    }
                    { type === 'fix' &&
                      showNames.map((file, idx) => {
                          const ext = file.names.split('.').pop()
                          return (
                            <span key={idx} className="mx-0 px-0">
                              <FileIconImages
                                ext={ext}
                                file={file}
                                filename={file.names}
                                removeFunc={onPastRemoveFile}
                              />
                            </span>
                          )
                      })
                    }
                  </div>
              </Col>
          </CardBody>
        </Card>

        <Card>
          <Col className="custom-card-header">
            <div className="custom-create-title">공사정보</div>
          </Col>
          <hr/>
          <CardBody>
            <Row className="mb-1" style={{alignItems:'center'}}>
              <Col md='6' xs='12'>
                <Row style={{alignItems:'center'}}>
                    <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                      공사명
                    </Col>
                      <Col xs='9' >
                      <Controller
                        id = 'outsourcing'
                        name='outsourcing'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                            <Select
                              name='outsourcing'
                              classNamePrefix={'select'}
                              className="react-select custom-select-outsourcing custom-react-select"
                              options={outsourcingList}
                              value={value}
                              onChange={ e => onChange(e) }
                              />
                          </Col>
                        )}/>    
                    </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mb-1" style={{alignItems:'center'}}>
              <Col className='card_table col text center' xs='2' md='1'  style={{whiteSpace:'nowrap'}}>
                예정일자
              </Col>
              <Col xs='10' md='11' >
                <Row>
                  <Col xs='12' md='5' >
                  <Controller
                    id='construction_start_date'
                    name='construction_start_date'
                    control={control}
                    render={({ field: {onChange, value } }) => (
                        <Col lg='12' md='12' xs='12' className='card_table col text center'>
                            <Row style={{width:'100%'}}>
                                <Flatpickr
                                    className={`form-control ${errors.construction_start_date ? 'is-invalid' : ''}`}
                                    id='default-picker'
                                    //placeholder="년/월/일 시:분 PM"
                                    placeholder="YYYY/MM/DD H:mm PM"
                                    value={value}
                                    onChange={(data) => {
                                        const newData = setStringDate(data, true)
                                        onChange(newData)
                                        setConstructStartDate(newData)
                                    }}
                                    options = {{
                                      enableTime: true,
                                      dateFormat: "Y-m-d H:i",
                                      locale: Korean
                                    }}
                                      />
                            </Row>
                        </Col>
                  )}/>
                </Col>
                <Col xs='12' md='1' className='d-flex align-items-center justify-content-center'>  ~ </Col>
                 
                <Col xs='12' md='6' >
                  <Controller
                    id='construction_end_date'
                    name='construction_end_date'
                    control={control}
                    render={({ field: {onChange, value} }) => (
                        <Col lg='12' md='12' xs='12' className='card_table col text center'>
                            <Row style={{width:'100%'}}>
                                <Flatpickr
                                    className={`form-control ${errors.construction_end_date ? 'is-invalid' : ''}`}
                                    id='default-picker'
                                    //placeholder="2023/03/23 1:30PM"
                                    placeholder="YYYY/MM/DD H:mm PM"
                                    value={value}
                                    onChange={(data) => {
                                        const newData = setStringDate(data, true)
                                        onChange(newData)
                                        setConstructEndDate(newData)
                                    }}
                                    options = {{
                                      enableTime: true,
                                      dateFormat: "Y-m-d H:i",
                                      locale: Korean
                                    }}
                                      />
                            </Row>
                        </Col>
                    )}/>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>
        
      <Row className='d-flex align-items-center justify-content-between'>
        <div className='d-flex justify-content-between mt-3'>
          <div style={{fontSize : '22px', color : primaryColor, fontFamily : 'Montserrat,sans-serif'}}>
            작업 내용
          </div>
          <Button size='xs' color="primary" style={{whiteSpace: 'nowrap'}} onClick={() => { setModal(!modal) }}>알림발송</Button>
        </div>
      </Row>
				<hr/>

        <Card>
          <Col className="custom-card-header">
            <div className="custom-create-title">작업 정보</div>
          </Col>
          <hr/>
          <CardBody>
            <Row className="mb-1" style={{alignItems:'center'}}>
              <Col className='card_table col text center' xs='2' md='1'  style={{whiteSpace:'nowrap'}}>
                  작업상태
              </Col>
                <Col xs='10' md='11'>
                <Row>
                  <Col xs='4' md='2'>
                    <Controller
                      id='status'
                      name='status'
                      control={control}
                      render={({ field : {onChange, value} }) => (
                        <Col className='form-check'>
                          <Input id='status' value={''} type='radio' checked={value === '접수'}
                          onChange={() => {									
                            onChange('접수')
                          }}/>
                          <Label className='form-check-label' for='status'>
                          접수
                          </Label>
                          
                        </Col>
                    )}/>
                  </Col>
                  <Col xs='4' md='2' className="px-0">
                    <Controller
                    id='status'
                    name='status'
                    control={control}
                    render={({ field : {onChange, value} }) => (
                      <Col className='form-check'>
                        <Input id='status' value={''} type='radio' checked={value === '진행중'}
                        onChange={() => {									
                          onChange('진행중')
                        }}/>
                        <Label className='form-check-label' for='status'>
                        진행중
                        </Label>
                        
                      </Col>
                    )}/>

                  </Col>
                  <Col xs='4' md='2'>
                    <Controller
                      id='status'
                      name='status'
                      control={control}
                      render={({ field : {onChange, value} }) => (
                        <Col className='form-check'>
                          <Input id='status' value={''} type='radio' checked={value === '완료'}
                          onChange={() => {									
                            onChange('완료')
                          }}/>
                          <Label className='form-check-label' for='status'>
                          완료 
                          </Label>
                          
                        </Col>
                    )}/>
                  
                   
                  </Col>
                </Row>
                
              
              </Col>
            </Row>
            <Row className="mb-1" style={{alignItems:'center'}}>
              <Col xs='12' md='12'>
                <Row>
                  <Col className='card_table col text center' xs='2' md='1'>
                      작업일시
                  </Col>
                  <Col xs='10' md='11'>
                    <Row>
                      <Col xs='7' md='9'>
                      <Controller
                              id='work_date'
                              name='work_date'
                              control={control}
                              render={({ field: {onChange, value} }) => (
                                  <Col lg='12' md='12' xs='12' className='card_table col text center'>
                                      <Row style={{width:'100%'}}>
                                          <Flatpickr
                                              className={`form-control ${errors.work_date ? 'is-invalid' : ''}`}
                                              id='default-picker'
                                              placeholder="YYYY/MM/DD H:mm PM"
                                              value={value || '' }
                                              // data-enable-time
                                              onChange={(data) => {
                                                  const newData = setStringDate(data, true)
                                                  onChange(newData)
                                                  setWorkDate(newData)
                                              }}
                                              options = {{
                                                  enableTime: true,
                                                  dateFormat: "Y-m-d H:i",
                                                  locale: Korean
                                              }}
                                                />
                                      </Row>
                                  </Col>
                              )}/>
                      </Col>
                      <Col xs='3' md='3' className="d-flex align-items-center ">
                        <Button color="white" style={{borderColor: 'gray', whiteSpace: 'nowrap', justifyContent:'end'}} onClick={() => handleClickNow('work_date', setWorkDate)}>현재</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row style={{alignItems:'center'}}>
              <Col className='card_table col text center' md= '1' xs='2'>
                작업내용
              </Col>
              <Col md='11' xs='10' >
                <Controller
                id='work_content'
                name='work_content'
                control={control}
                render={({ field }) => <Input bsSize='sm' type="textarea" placeholder={'작업내용을 입력해 주세요.'} invalid={errors.work_content && true} {...field} />}
              />
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card>
          <Col className="custom-card-header">
            <div className="custom-create-title">위치 정보</div>
          </Col>
          <hr/>
          <CardBody>
          <Row className="mb-1" style={{alignItems:'center'}}>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        건물
                        </Col>
                      <Col xs='10' >
                        <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                          <Select
                            name='building'
                            classNamePrefix={'select'}
                            className="react-select custom-select-building custom-react-select"
                            options={buildingList}
                            value={building}
                            // defaultValue={buildingList[0]}
                            onChange={(e) => setBuilding(e)}
                            />
                        </Col>
                      </Col>
                  </Row>
                </Col>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        층/호실
                        </Col>
                      <Col xs='5' >
                        <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                          <Select
                            name='floor'
                            classNamePrefix={'select'}
                            className="react-select custom-select-floor custom-react-select"
                            options={floorList}
                            value={floor}
                            // defaultValue={floorList[0]}
                            onChange={(e) => setFloor(e)}
                            />
                        </Col>
                      </Col>
                      <Col xs='5' >
                        <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                          <Select
                            name='room'
                            classNamePrefix={'select'}
                            className="react-select custom-select-room custom-react-select"
                            options={roomList}
                            value={room}
                            // defaultValue={roomList[0]}
                            onChange={(e) => setRoom(e)}
                            />
                        </Col>
                      </Col>
                  </Row>
                </Col>
              </Row>
            <Row className="mb-1" style={{alignItems:'center'}}>
              <Col md='6' xs='12'>
                <Row style={{alignItems:'center'}}>
                    <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                      상세 위치
                    </Col>
                    <Col xs='10' >
                      <Controller
                        id='location_detail'
                        name='location_detail'
                        control={control}
                        render={({ field }) => <Input bsSize='sm' maxLength={98} placeholder={'상세위치를 입력해 주세요.'} invalid={errors.location_detail && true} {...field} />}
                      />
                    </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card>
          <Col className="custom-card-header">
            <div className="custom-create-title">설비 정보</div>
          </Col>
          <hr/>
          <CardBody>
            <Row className="mb-1" style={{alignItems:'center'}}>
                  <Col md='6' xs='12'>
                    <Row style={{alignItems:'center'}}>
                        <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                          설비명
                          </Col>
                        <Col xs='10' >
                        <Controller
                          id = 'facility'
                          name='facility'
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                              <Select
                                name='facility'
                                classNamePrefix={'select'}
                                className="react-select custom-select-facility custom-react-select"
                                options={facilityList}
                                value={value}
                                onChange={ e => onChange(e) }
                                isDisabled={building.value === ''}
                                />
                            </Col>
                        )}/>
                        </Col>
                    </Row>
                  </Col>
        
            </Row>
            <Row className="mb-1" style={{alignItems:'center'}}>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        설비 용도
                      </Col>
                      <Col xs='10' >
                        <Controller
                          id='facility_usage'
                          name='facility_usage'
                          control={control}
                          render={({ field }) => <Input bsSize='sm' maxLength={48} placeholder={'설비 용도를 입력해 주세요.'} invalid={errors.facility_usage && true} {...field} />}
                        />
                      </Col>
                  </Row>
                </Col>
            </Row>
          </CardBody>
        </Card>
        
        <Card>
          <Col className="custom-card-header">
            <div className="custom-create-title">문제 유형</div>
            <CustomHelpCircle 
              id={'complainType'}
              content={'접수 정보의 선택된 직업 직종에 따라 유형이 조회됩니다.'}
            />
          </Col>
          <hr/>
          <CardBody>
          <Row style={{alignItems:'center'}}>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        문제유형
                        </Col>
                      <Col xs='10' >
                        <Controller
                            id = 'problem_type'
                            name='problem_type'
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                <Select
                                  name='problem_type'
                                  classNamePrefix={'select'}
                                  className="react-select custom-select-problem_type custom-react-select"
                                  isDisabled={getObjectKeyCheck(selectEmployeeClass, 'value') === ''}
                                  options={problemList}
                                  value={value}
                                  onChange={ e => onChange(e) }
                                  />
                              </Col>
                          )}/>
                      </Col>
                  </Row>
                </Col>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        원인유형
                        </Col>
                      <Col xs='10' >
                        <Controller
                            id = 'cause_type'
                            name='cause_type'
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                <Select
                                  name='cause_type'
                                  classNamePrefix={'select'}
                                  isDisabled={getObjectKeyCheck(selectEmployeeClass, 'value') === ''}
                                  className="react-select custom-select-cause_type custom-react-select"
                                  options={causeList}
                                  value={value}
                                  onChange={ e => onChange(e) }
                                  />
                              </Col>
                        )}/>
                    </Col>
                  </Row>
                </Col>
              </Row>
            <Row className="mb-1" style={{alignItems:'center'}}>
              <Col md='6' xs='12'>
                <Row style={{alignItems:'center'}}>
                    <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                      처리유형
                    </Col>
                      <Col xs='10' >
                      <Controller
                            id = 'repair_type'
                            name='repair_type'
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                <Select
                                  name='repair_type'
                                  classNamePrefix={'select'}
                                  isDisabled={getObjectKeyCheck(selectEmployeeClass, 'value') === ''}
                                  className="react-select custom-select-repair_type custom-react-select"
                                  options={repairList}
                                  value={value}
                                  onChange={ e => onChange(e) }
                                  />
                              </Col>
                      )}/>    
                    </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card className="mb-5">
          <Col className="custom-card-header">
            <div className="custom-create-title">완료 및 보고일시</div>
          </Col>
          <hr/>
          <CardBody>
              <Row className="mb-1" style={{alignItems:'center'}}>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        완료타입  
                      </Col>
                      <Col xs='10'  className='d-flex' >
                      <Controller
                          id='complete_type'
                          name='complete_type'
                          control={control}
                          render={({ field : {onChange, value} }) => (
                            <Col className='form-check'>
                              <Input id='complete_type' value={''} type='radio' checked={value === '취소'}
                              onChange={() => {									
                                onChange('취소')
                              }}/>
                              <Label className='form-check-label' for='complete_type'>
                              취소
                              </Label>
                              
                            </Col>
                        )}/>
                      <Controller
                        id='complete_type'
                        name='complete_type'
                        control={control}
                        render={({ field : {onChange, value} }) => (
                          <Col className='form-check'>
                            <Input id='complete_type' value={''} type='radio' checked={value === '중지'}
                            onChange={() => {									
                              onChange('중지')
                            }}/>
                            <Label className='form-check-label' for='complete_type'>
                            중지
                            </Label>
                            
                          </Col>
                      )}/>
                      <Controller
                        id='complete_type'
                        name='complete_type'
                        control={control}
                        render={({ field : {onChange, value} }) => (
                          <Col className='form-check'>
                            <Input id='complete_type' value={''} type='radio' checked={value === '완료'}
                            onChange={() => {									
                              onChange('완료')
                            }}/>
                            <Label className='form-check-label' for='complete_type'>
                              완료
                            </Label>
                            
                          </Col>
                      )}/>
                    </Col>                   
                  </Row>
                </Col>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        완료일시  
                      </Col>
                      <Col xs='10'>
                      <Row>
                          <Col xs='7' md='9'>
                            <Controller
                              id='complete_date'
                              name='complete_date'
                              control={control}
                              render={({ field: {onChange, value} }) => (
                                  <Col lg='12' md='12' xs='12' className='card_table col text center'>
                                      <Row style={{width:'100%'}}>
                                          <Flatpickr
                                              className={`form-control ${errors.complete_date ? 'is-invalid' : ''}`}
                                              id='default-picker'
                                              placeholder="YYYY/MM/DD H:mm PM"
                                              value={value}
                                              // data-enable-time
                                              onChange={(data) => {
                                                  const newData = setStringDate(data, true)
                                                  onChange(newData)
                                                  setCompleteDate(newData)
                                              }}
                                              options = {{
                                                  enableTime: true,
                                                  dateFormat: "Y-m-d H:i",
                                                  locale: Korean
                                              }}
                                                />
                                      </Row>
                                  </Col>
                              )}/>
                            </Col>
                        
                          <Col xs='3' className="d-flex align-items-center" >
                            <Button color="white" style={{borderColor:'gray', whiteSpace: 'nowrap', justifyContent:'end'}} onClick={() => handleClickNow('complete_date', setCompleteDate)}>현재</Button>
                          </Col>
                      </Row>
                      </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mb-1" style={{alignItems:'center'}}>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                    <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                      보고일시
                    </Col>
                    <Col xs='10'>
                      <Row>
                      <Col xs='7' md='9'>
                            <Controller
                              id='report_date'
                              name='report_date'
                              control={control}
                              render={({ field: {onChange, value} }) => (
                                  <Col lg='12' md='12' xs='12' className='card_table col text center'>
                                      <Row style={{width:'100%'}}>
                                          <Flatpickr
                                              className={`form-control ${errors.report_date ? 'is-invalid' : ''}`}
                                              id='default-picker'
                                              placeholder="2023/03/23 1:30PM"
                                              value={value}
                                              // data-enable-time
                                              onChange={(data) => {
                                                  const newData = setStringDate(data, true)
                                                  onChange(newData)
                                                  setReportDate(newData)
                                              }}
                                              options = {{
                                                  enableTime: true,
                                                  dateFormat: "Y-m-d H:i",
                                                  locale: Korean
                                              }}
                                                />
                                      </Row>
                                  </Col>
                              )}/>
                            </Col>
                          <Col xs='3' className="d-flex align-items-center ">
                            <Button color="white" style={{borderColor:'gray', whiteSpace: 'nowrap', justifyContent:'end'}} onClick={() => handleClickNow('report_date', setReportDate)}>현재</Button>
                          </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col md='6' xs='12'>
                  <Row style={{alignItems:'center'}}>
                      <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                        확인자
                      </Col>
                      <Col xs='10' >
                      <Controller
                        id = 'checker'
                        name='checker'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                            <Select
                              name='checker'
                              classNamePrefix={'select'}
                              className="react-select custom-select-checker custom-react-select"
                              options={checkerList}
                              value={value}
                              onChange={ e => onChange(e) }
                              menuPlacement='top' 
                              />
                          </Col>
                        )}/>    
                      </Col>
                  </Row>
                </Col>
              </Row>
          </CardBody>
        </Card>

        
        <Card style={{marginBottom:'80px'}}>
          <Col className="custom-card-header">
            <div className="custom-create-title">안전교육</div>
          </Col>
          <hr/>
          <CardBody>
            <Row className="mb-1" style={{alignItems:'center'}}>
              <Col md='6' xs='12'>
                <Row style={{alignItems:'center'}}>
                    <Col className='card_table col text center' xs='2'  style={{whiteSpace:'nowrap'}}>
                      안전교육
                    </Col>
                    <Col xs='10'  className='d-flex' >
                      <Controller
                          id='has_education'
                          name='has_education'
                          control={control}
                          render={({ field : {onChange, value} }) => (
                            <Col className='form-check'>
                              <Input id='has_education' value={''} type='radio' checked={value === true}
                              onChange={() => {									
                                onChange(true)
                              }}/>
                              <Label className='form-check-label' for='has_education'>
                              예
                              </Label>
                              
                            </Col>
                        )}/>
                      <Controller
                        id='has_education'
                        name='has_education'
                        control={control}
                        render={({ field : {onChange, value} }) => (
                          <Col className='form-check'>
                            <Input id='has_education' value={''} type='radio' checked={value === false}
                            onChange={() => {									
                              onChange(false)
                            }}/>
                            <Label className='form-check-label' for='has_education'>
                            아니오
                            </Label>
                            
                          </Col>
                      )}/>
                      
                    </Col>           
                     
                </Row>
              </Col>
            </Row>
            <Row className="mb-1" style={{alignItems:'center'}}>
              <Col className='card_table col text center' xs='2' md='1'  style={{whiteSpace:'nowrap'}}>
                실행일자
              </Col>
              <Col xs='10' md='11' >
                <Row>
                  <Col xs='12' md='5' >
                  <Controller
                    id='education_start_date'
                    name='education_start_date'
                    control={control}
                    render={({ field: {onChange, value } }) => (
                        <Col lg='12' md='12' xs='12' className='card_table col text center'>
                            <Row style={{width:'100%'}}>
                                <Flatpickr
                                    className={`form-control ${errors.education_start_date ? 'is-invalid' : ''}`}
                                    id='default-picker'
                                    placeholder="YYYY/MM/DD H:mm PM"
                                    value={value}
                                    onChange={(data) => {
                                        const newData = setStringDate(data, true)
                                        onChange(newData)
                                        setEducationStartDate(newData)
                                    }}
                                    options = {{
                                      enableTime: true,
                                      dateFormat: "Y-m-d H:i",
                                      locale: Korean
                                    }}
                                      />
                            </Row>
                        </Col>
                  )}/>
                </Col>
                <Col xs='12' md='1' className='d-flex align-items-center justify-content-center'>  ~ </Col>
                 
                <Col xs='12' md='6' >
                  <Controller
                    id='education_end_date'
                    name='education_end_date'
                    control={control}
                    render={({ field: {onChange, value} }) => (
                        <Col lg='12' md='12' xs='12' className='card_table col text center'>
                            <Row style={{width:'100%'}}>
                                <Flatpickr
                                    className={`form-control ${errors.education_end_date ? 'is-invalid' : ''}`}
                                    id='default-picker'
                                    placeholder="YYYY/MM/DD H:mm PM"
                                    value={value}
                                    onChange={(data) => {
                                        const newData = setStringDate(data, true)
                                        onChange(newData)
                                        setEducationEndDate(newData)
                                    }}
                                    options = {{
                                      enableTime: true,
                                      dateFormat: "Y-m-d H:i",
                                      locale: Korean
                                    }}
                                      />
                            </Row>
                        </Col>
                    )}/>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
        </Card>     
	</Fragment>
	)
}


export default ProgressForm