import { Fragment, useState, useEffect } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Form  } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import ProgressForm from './ProgressForm'
import WorkerForm from './WorkerForm'
import MaterialForm from './MaterialForm'
import ToolEquipmentForm from './ToolEquipmentForm'
import { FormButton } from "./FormButton"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { checkSelectValue, checkSelectValueObj, getTableData, getTableDataCallback } from '../../../../utility/Utils'
import { isEmptyObject } from "jquery"
import Cookies from 'universal-cookie'
import { ROUTE_INSPECTION_COMPLAIN, API_EMPLOYEE_CLASS_LIST, API_GET_BUILDING_FLOOR_ROOM, API_GET_FACILITY_LIST, API_GET_PROBELM_TYPE_LIST, API_GET_PROPERTY_USER, API_INSPECTION_COMPLAIN_REGISTER, API_GET_PROPERTY_OUTSOURCING  } from '../../../../constants'
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import axios from '../../../../utility/AxiosConfig'
import { useLocation, useNavigate } from "react-router-dom"
import GroupAddModal from "./Modal/GroupAddModal"
import Swal from "sweetalert2"
import { defaultWorkList } from "../../data"

const Complain_Register = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const property_id =  cookies.get('property').value
    const navigate = useNavigate()
    const { state } = useLocation()
    const defaultValues = {
       //진행현황
        title:'', //접수명
        employeeClass : {label: '선택', value:''},  //직종
        workType : {label: '업무 종류를 고르세요', value:''},  //업무 구분
        request_description: '',  //접수 내용
        request_date: '',  // 접수 일시
        requester_name:'',
        requester_department:'',
        requester_phone:'',
        requester_mobile:'',
        work_target: {label: '직원 선택', value:''},  //작업 대상자
        // construction_title:'',
        outsourcing: {label: '공사 선택', value:''},
        construction_start_date:'', //예정일자
        construction_end_date:'', //예정일자
        status:'접수', //작업 상태
        work_date:'', //작업일시
        work_content:'',
        location_detail:'', //상세 위치
        facility : {label: '설비 선택', value:''}, // 설비명
        facility_usage:'',
        problem_type:{label: '문제유형을 선택해 주세요', value:''},
        cause_type:{label: '원인유형을 선택해 주세요', value:''},
        repair_type:{label: '처리유형을 선택해 주세요', value:''},
        complete_type: '', // 완료 타입
        complete_date: '',  // 완료 일시
        report_date: '',  // 보고 일시
        checker: {label: '직원 선택', value:''},
        has_education: '',
        education_start_date:'',
        education_end_date:''
    } 
    
    const validationSchema = yup.object().shape({
		title: yup.string().required('접수명을 입력해주세요.').min(1, '1자 이상 입력해주세요'),
        request_description : yup.string().required('접수 내용을 입력해주세요.').min(1, '1자 이상 입력해주세요'),
        request_date: yup.array().test('isNonEmpty', '접수일시를 입력해주세요.', function(value) {
			return value
		}).nullable()	})

//진행현황
    const [modal, setModal] = useState(false)
    const [page, setPage] = useState('progress')
    const [classList, setClassList] = useState([{label: '선택', value:''}])
    const [workList, setWorkList] = useState([])
    const [facilityList, setFacilityList] = useState([])
    const [problemList, setProblemList] = useState([{label: '문제', value:''}])
    const [causeList, setCauseList] = useState([{label: '원인', value:''}])
    const [repairList, setRepairList] = useState([{label: '문제', value:''}])
    const [checkerList, setCheckerList] = useState([])
    const [outsourcingList, setOutSourcingList] = useState([])
    const [worktargetList, setWorkTargetList] = useState([])
    const [customResolver, setResolver] = useState(validationSchema)
	const [selectError, setSelectError] = useState({employeeClass: false, workType: false})
	const {employeeClass, workType } = selectError // 셀렉터 에러
    const [requestDate, setRequestDate] = useState() // 접수 일시
    const [constructstartDate, setConstructStartDate] = useState() // 공사예정 일시
    const [constructendDate, setConstructEndDate] = useState() // 공사예정 일시
    const [completeDate, setCompleteDate] = useState('') // 완료 일시
    const [reportDate, setReportDate] = useState() // 보고 일시
    const [workDate, setWorkDate] = useState() // 작업 일시
    const [files, setFiles] = useState([])
    const [showNames, setShowNames] = useState([])
    const [buildingList, setBuildingList] = useState([])
    const [building, setBuilding] = useState({label: '건물 선택', value:''})
    const [floorList, setFloorList] = useState([])
    const [floor, setFloor] = useState({label: '층 선택', value:''})
    const [roomList, setRoomList] = useState([])
    const [room, setRoom] = useState({label: '호실 선택', value:''})
    const [educationStartDate, setEducationStartDate] = useState()
    const [educationEndDate, setEducationEndDate] = useState()
    const [selectEmployeeClass, setSelectEmployeeClass] = useState({label: '업무', value:''})

//공구비품
    const [toolequipment, setToolEquipment] = useState({code:'', value:''})
    const [workToolDate, setWorkToolDate] = useState('')
    const [useHistory, setUseHistory] = useState('')
    const [ToolData, setToolData] = useState([])
    const [ToolrowId, setToolrowId] = useState(0)
    const [TooldataCount, setToolDataCount] = useState(-1) // tableData의  id 값

//작업자
    const [worker, setWorker] = useState({name:'', value:''})
    const [workerDate, setWorkerDate] = useState('')
    const [description, setDescription] = useState('')
    const [workHour, setWorkHour] = useState('')
    const [worktype, setWorkType] = useState({label:'작업타입', value:''})
    const [WorkData, setWorkData] = useState([])
    const [WorkrowId, setWorkrowId] = useState(0)
    const [WorkdataCount, setWorkDataCount] = useState(-1) // tableData의  id 값

// 자재
    const [material, setMaterial] = useState({name:'', id:''})
    const [materialDate, setMaterialDate] = useState('')
    const [usage, setUsage] = useState('')
    const [unit, setUnit] = useState('')
    const [is_rest, setIsRest] = useState(true)
    const [Instructions, setInstructions] = useState('')
    const [MaterialData, setMaterialData] = useState([])
    
    const {
        control,
		handleSubmit,
		setValue,
        unregister,
		formState: { errors }
	} = useForm({
		defaultValues : defaultValues,
		resolver: yupResolver(customResolver)
	})
	
    const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}
    
    const onSubmit = data => {
        const check = checkSelectValueObj(control, selectError, setSelectError)
        console.log('check', check)
		if (!check) { return false }

        const formData = new FormData()
        formData.append('prop_id', property_id)
        formData.append('title', data.title)
        formData.append('request_datetime', requestDate)
        formData.append('type', data.workType.value)
        formData.append('emp_class_id', data.employeeClass.value)
        formData.append('request_description', data.request_description)
        formData.append('requester_name', data.requester_name)
        formData.append('requester_department', data.requester_department)
        formData.append('requester_phone', data.requester_phone)
        formData.append('requester_mobile', data.requester_mobile)
        formData.append('work_target_user_id', data.work_target.value)
        formData.append('outsourcing_contract_id', data.outsourcing.value)
        formData.append('construction_start_date', constructstartDate)
        formData.append('construction_end_date', constructendDate)
        formData.append('status', data.status)
        formData.append('working_datetime', workDate)
        formData.append('working_description', data.work_content)
        formData.append('building_id', building.value)
        formData.append('floor_id', floor.value)
        formData.append('room_id', room.value)
        formData.append('detail_location', data.location_detail)
        formData.append('facility_id', data.facility.value)
        formData.append('facility_usage', data.facility_usage)
        formData.append('problem_type_id', data.problem_type.value)
        formData.append('cause_type_id', data.cause_type.value)
        formData.append('repair_type_id', data.repair_type.value)
        formData.append('complete_type', data.complete_type)
        formData.append('complete_datetime', completeDate)
        formData.append('report_datetime', reportDate)
        formData.append('confirm_user_id', data.checker.value)
        formData.append('has_education', data.has_education)
        formData.append('education_start_datetime', educationStartDate)
        formData.append('education_end_datetime', educationEndDate)
        formData.append('user', cookies.get('userId'))

        //파일
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])
        }

        //작업자
        formData.append('work_data', JSON.stringify(WorkData))
        //자재
        formData.append('material_data', JSON.stringify(MaterialData))
        //공구비품
        formData.append('tool_data', JSON.stringify(ToolData))

        axios.post(API_INSPECTION_COMPLAIN_REGISTER, formData, {
            headers : {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(() => {
            Swal.fire({
                icon: 'success',
                title: `${state ? '작업현황' : '불편신고접수'} 등록 완료`,
				html: '접수사항이 저장되었습니다.',
                customClass: {
					confirmButton: 'btn btn-primary',
					actions: `sweet-alert-custom center`
				}
            }).then(() => { 
                navigate(ROUTE_INSPECTION_COMPLAIN)
            })
          })
          .catch(error => {
            // 응답 실패 시 처리
            console.error(error) 
          })
    }

    const getInit = () => {
        setValue('problem_type', {label: '문제유형을 선택해 주세요', value:''})
        setValue('cause_type', {label: '원인유형을 선택해 주세요', value:''})
        setValue('repair_type', {label: '처리유형을 선택해 주세요', value:''})
		const param = {
			prop_id :  cookies.get('property').value
		}
        const employeeClassParam = {
            prop_id :  cookies.get('property').value,
            employeeClass : selectEmployeeClass.value
        }
        getTableDataCallback(API_EMPLOYEE_CLASS_LIST, param, function(data) {
            data[0].label = `${data[0].label} 선택`
			setClassList(data)
        })
        setWorkList(defaultWorkList)
        
        getTableDataCallback(API_GET_BUILDING_FLOOR_ROOM, param, function(data) {
            setBuildingList(data?.building_list)
        })
        
        getTableDataCallback(API_GET_PROBELM_TYPE_LIST, employeeClassParam, function(data) {
            setProblemList(data.problem_type_list)
            setCauseList(data.cause_type_list)
            setRepairList(data.repair_type_list)
        })

        getTableData(API_GET_PROPERTY_USER, param, setCheckerList)
        getTableData(API_GET_PROPERTY_USER, param, setWorkTargetList)
        getTableData(API_GET_PROPERTY_OUTSOURCING, param, setOutSourcingList)
    }

    useEffect(() => {
        getInit()
	}, [selectEmployeeClass])

    useEffect(() => {	
        setFloor({label: '층 선택', value:''})
        setRoom({label: '호실 선택', value:''})
        setValue('facility', {label: '설비 선택', value:''})
        getTableDataCallback(API_GET_BUILDING_FLOOR_ROOM, {building: building.value}, function(data) {
            setFloorList(data?.floor_list)
        })
        getTableData(API_GET_FACILITY_LIST, {building: building.value}, setFacilityList)
	}, [building.value])

    useEffect(() => {
        setRoom({label: '호실 선택', value:''})
        getTableDataCallback(API_GET_BUILDING_FLOOR_ROOM, {floor: floor.value}, function(data) {
            setRoomList(data?.room_list)
        })
	}, [floor.value])

    useEffect(() => {
		if (!isEmptyObject(errors)) {
			checkSelectValueObj(control, selectError, setSelectError)
		}
	}, [errors])

    return (
        <Fragment>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <div className='d-flex justify-content-start'>
                        <Breadcrumbs breadCrumbTitle={state ? '작업현황관리' : '불편신고접수'} breadCrumbParent='점검관리' breadCrumbActive={state ? '작업현황관리' : '불편신고접수'} />
                    </div>
                </Row>

                <Row className='complain-pm'>
                    <Col lg='2' md ='2' xs='12' className="mb-1" style={{ paddingLeft: '1rem', display: 'flex' }}>
                        <Button color={page === 'progress' ? 'primary' : 'report'} style={{width:'100%'}} onClick={() => setPage('progress')}>진행현황</Button>
                    </Col>
                    <Col lg='2' md ='2' xs='12' className="mb-1" style={{ paddingLeft: '1rem', display: 'flex' }}>
                        <Button color={page === 'worker' ? 'primary' : 'report'} style={{width:'100%'}}  onClick={() => setPage('worker')}>작업자</Button>
                    </Col>
                    <Col lg='2' md ='2' xs='12' className="mb-1" style={{ paddingLeft: '1rem', display: 'flex' }}>
                        <Button color={page === 'material' ? 'primary' : 'report'} style={{width:'100%'}}  onClick={() => setPage('material')}>자재</Button>
                    </Col>
                    <Col lg='2' md ='2' xs='12' className="mb-1" style={{ paddingLeft: '1rem', display: 'flex' }}>
                        <Button color={page === 'toolequipment' ? 'primary' : 'report'} style={{width:'100%'}} onClick={() => setPage('toolequipment')}>공구비품</Button>
                    </Col>
                </Row>
                { page === 'progress' &&
                    <ProgressForm
                        control = {control}
                        handleSubmit = {handleSubmit}
                        setValue = {setValue}
                        errors = {errors}
                        setResolver = {setResolver}
                        handleSelectValidation = {handleSelectValidation}
                        employeeClass ={employeeClass}//에러
                        classList = {classList}
                        workType = {workType}//에러
                        workList = {workList}
                        outsourcingList = {outsourcingList}
                        facilityList = {facilityList}
                        problemList = {problemList}
                        causeList = {causeList}
                        repairList = {repairList}
                        buildingList = {buildingList}
                        checkerList = {checkerList}
                        worktargetList = {worktargetList}
                        building = {building}
                        setBuilding = {setBuilding}
                        floorList = {floorList}
                        floor = {floor}
                        setFloor = {setFloor}
                        roomList = {roomList}
                        room = {room}
                        setRoom = {setRoom}
                        setRequestDate ={setRequestDate}
                        setConstructStartDate = {setConstructStartDate}
                        setConstructEndDate = {setConstructEndDate}
                        setWorkDate = {setWorkDate}
                        setCompleteDate = {setCompleteDate}
                        setReportDate = {setReportDate}
                        setEducationStartDate = {setEducationStartDate}
                        setEducationEndDate = {setEducationEndDate}
                        files = {files}
                        setFiles = {setFiles}
                        showNames = {showNames}
                        setShowNames = {setShowNames}
                        modal = {modal}
                        setModal = {setModal}
                        unregister = {unregister}
                        selectEmployeeClass={selectEmployeeClass}
                        setSelectEmployeeClass={setSelectEmployeeClass}
                    />
                }
                { page === 'worker' &&
                    <WorkerForm
                        property_id = {cookies.get('property').value}
                        control = {control}
                        handleSubmit = {handleSubmit}
                        setValue = {setValue}
                        errors = {errors}
                        handleSelectValidation = {handleSelectValidation}
                        worker = {worker}
                        setWorker = {setWorker}
                        workerDate = {workerDate}
                        setWorkerDate = {setWorkerDate}
                        workHour = {workHour}
                        setWorkHour = {setWorkHour}
                        worktype ={worktype}
                        setWorkType = {setWorkType}
                        description = {description}
                        setDescription = {setDescription}
                        tableData = {WorkData}
                        setTableData = {setWorkData}
                        rowId = {WorkrowId}
                        setrowId = {setWorkrowId}
                        dataCount = {WorkdataCount}
                        setDataCount = {setWorkDataCount}
                    />
                }
                { page === 'material' &&
                    <MaterialForm
                        property_id = {cookies.get('property').value}
                        material = {material}
                        setMaterial = {setMaterial}
                        materialDate ={materialDate}
                        setMaterialDate = {setMaterialDate}
                        Instructions = {Instructions}
                        setInstructions = {setInstructions}
                        usage = {usage}
                        setUsage = {setUsage}
                        unit = {unit}
                        setUnit = {setUnit}
                        is_rest = {is_rest}
                        setIsRest = {setIsRest}
                        tableData = {MaterialData}
                        setTableData = {setMaterialData}
                    />
                }
                { page === 'toolequipment' &&
                    <ToolEquipmentForm
                        property_id = {cookies.get('property').value}
                        control = {control}
                        handleSubmit = {handleSubmit}
                        setValue = {setValue}
                        errors = {errors}
                        handleSelectValidation = {handleSelectValidation}
                        toolequipment = {toolequipment}
                        setToolEquipment = {setToolEquipment}
                        workToolDate = {workToolDate}
                        setWorkToolDate = {setWorkToolDate}
                        useHistory = {useHistory}
                        setUseHistory = {setUseHistory}
                        tableData = {ToolData}
                        setTableData = {setToolData}
                        rowId = {ToolrowId}
                        setrowId = {setToolrowId}
                        dataCount = {TooldataCount}
                        setDataCount = {setToolDataCount}

                    />
                }
                <FormButton type={'create'}/>
            </Form>
            <GroupAddModal 
            formModal={modal} 
            setFormModal={setModal} 
            /> 

        </Fragment>
	)
}


export default Complain_Register