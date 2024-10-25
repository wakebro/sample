import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAxiosIntercepter } from "@hooks/useAxiosInterceptor"
import axios from '@utility/AxiosConfig'
import { checkSelectValue, checkSelectValueObj, formatDateTime, getTableData } from '@utils'
import { isEmptyObject } from "jquery"
import { Fragment, useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Button, Col, Form, Row } from 'reactstrap'
import Swal from "sweetalert2"
import Cookies from 'universal-cookie'
import * as yup from 'yup'
import { API_EMPLOYEE_CLASS_LIST, API_GET_BUILDING_FLOOR_ROOM, API_GET_FACILITY_LIST, API_GET_PROBELM_TYPE_LIST, API_GET_PROPERTY_OUTSOURCING, API_GET_PROPERTY_USER, API_INSPECTION_COMPLAIN_DETAIL, ROUTE_INSPECTION_COMPLAIN } from '../../../../constants'
import { FormButton } from "../register/FormButton"
import MaterialForm from '../register/MaterialForm'
import GroupAddModal from "../register/Modal/GroupAddModal"
import ProgressForm from "../register/ProgressForm"
import ToolEquipmentForm from "../register/ToolEquipmentForm"
import WorkerForm from '../register/WorkerForm'

const Complain_Fix = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const property_id =  cookies.get('property').value
    const navigate = useNavigate()
    const param = useParams()
    const complain_id = param.id
    const location = useLocation()
    const state = location.state

    const defaultValues = {
       //진행현황
        title:'', //접수명
        employeeClass : {label: '직종', value:''},  //직종
        workType : {label: '업무 종류를 고르세요', value:''},  //업무 구분
        request_description: '',  //접수 내용
        request_date: '',  // 접수 일시
        requester_name:'',
        requester_department:'',
        requester_phone:'',
        requester_mobile:'',
        work_target: {label: '작업 대상자', value:''},  //작업 대상자
        // construction_title:'', // 공사명
        outsourcing: {label: '공사명', value:''},
        construction_start_date:'', //예정일자
        construction_end_date:'', //예정일자
        status:'', //작업 상태
        work_date:'', //작업일시
        work_content:'',
        location_detail:'', //상세 위치
        facility : {label: '설비', value:''}, // 설비명
        facility_usage:'',
        problem_type:{label: '문제유형을 선택해 주세요', value:''},
        cause_type:{label: '원인유형을 선택해 주세요', value:''},
        repair_type:{label: '처리유형을 선택해 주세요', value:''},
        complete_type: '', // 완료 타입
        complete_date: '',  // 완료 일시
        report_date: '',  // 보고 일시
        checker: {label: '확인자', value:''},
        has_education: '',
        education_start_date:'',
        education_end_date:''
       
    } 

    const validationSchema = yup.object().shape({
		title: yup.string().required('접수명을 입력해주세요.').min(1, '1자 이상 입력해주세요'),
        request_description : yup.string().required('접수 내용을 입력해주세요.').min(1, '1자 이상 입력해주세요')
      	})

//진행현황
    const [modal, setModal] = useState(false)
    const [page, setPage] = useState(state)
    const [classList, setClassList] = useState([{label: '직종', value:''}])
    const [workList, setWorkList] = useState([{label: '업무', value:''}])
    const [facilityList, setFacilityList] = useState([{label: '설비', value:''}])
    const [problemList, setProblemList] = useState([{label: '문제', value:''}])
    const [causeList, setCauseList] = useState([{label: '원인', value:''}])
    const [repairList, setRepairList] = useState([{label: '문제', value:''}])
    const [checkerList, setCheckerList] = useState([{label: '확인자', value:''}])
    const [outsourcingList, setOutSourcingList] = useState([{label: '공사명', value:''}])
    const [worktargetList, setWorkTargetList] = useState([{label: '작업대상자', value:''}])
    const [customResolver, setResolver] = useState(validationSchema)
	const [selectError, setSelectError] = useState({employeeClass: false, workType: false})
	const {employeeClass, workType } = selectError // 셀렉터 에러
    const [requestDate, setRequestDate] = useState() // 접수 일시
    const [constructstartDate, setConstructStartDate] = useState() // 공사예정 일시
    const [constructendDate, setConstructEndDate] = useState() // 공사예정 일시
    const [completeDate, setCompleteDate] = useState() // 완료 일시
    const [reportDate, setReportDate] = useState() // 보고 일시
    const [workDate, setWorkDate] = useState() // 작업 일시
    const [files, setFiles] = useState([])
    const [showNames, setShowNames] = useState([])
    const [buildingList, setBuildingList] = useState([{label: '건물', value:''}])
    const [building, setBuilding] = useState({ label: '건물', value: '' })
    const [floorList, setFloorList] = useState([{label: '층', value:''}])
    const [floor, setFloor] = useState({ label: '층', value: '' })
    const [roomList, setRoomList] = useState([{label: '호실', value:''}])
    const [room, setRoom] = useState({ label: '호실', value: '' })
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
    const [workHour, setWorkHour] = useState('')
    const [description, setDescription] = useState('')
    const [worktype, setWorkType] = useState({label:'작업유형', value:''})
    const [WorkData, setWorkData] = useState([])
    const [WorkrowId, setWorkrowId] = useState(0)
    const [WorkdataCount, setWorkDataCount] = useState(-1) // tableData의  id 값

// 자재
    const [material, setMaterial] = useState({name:'', value:''})
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
		if (!check) { return false }
        
        const formData = new FormData()
        formData.append('complain_id', complain_id)
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
        let matchingIds = []
        matchingIds = showNames.map((id) => id.id)
        formData.append('old_files_id', matchingIds)
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])
        }

        //작업자
        formData.append('work_data', JSON.stringify(WorkData))
        //자재
        formData.append('material_data', JSON.stringify(MaterialData))
        //공구비품
        formData.append('tool_data', JSON.stringify(ToolData))

        axios.put(API_INSPECTION_COMPLAIN_DETAIL, formData, {
            headers : {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(() => {
            Swal.fire({
                icon: 'success',
                title: '불편신고 및 작업현황 수정 완료',
				html: '접수사항이 수정되었습니다.',
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
		getTableData(API_EMPLOYEE_CLASS_LIST, param, setClassList)
        setWorkList([
            {label: '업무 종류를 고르세요', value:''}, {label: '공사', value:'공사'}, {label: '민원업무', value:'민원업무'}, {label: '서비스', value:'서비스'}, {label: '순회점검', value:'순회점검'},
            {label: '위험성평가', value:'위험성평가'}, {label: '이용자불편사항', value:'이용자불편사항'}, {label: '작업', value:'작업'}, {label: '작업/공사(기술팀)', value:'작업/공사(기술팀)'},
            {label: '작업/공사(외주)', value:'작업/공사(외주)'}, {label: '작업/공사(현장소장)', value:'작업/공사(현장소장)'}, {label: '점검', value:'점검'},
            {label: '점검(현장소장)', value:'점검(현장소장)'}, {label: '지원요청', value:'지원요청'}
        ])
        getTableData(API_GET_FACILITY_LIST, param, setFacilityList)
        axios.get(API_GET_BUILDING_FLOOR_ROOM, { params: param })
        .then(res => {
        setBuildingList(res.data.building_list)
        })
        .catch(() => {
        })
        axios.get(API_GET_PROBELM_TYPE_LIST, { params: employeeClassParam })
        .then(res => {
            setProblemList(res.data.problem_type_list)
            setCauseList(res.data.cause_type_list)
            setRepairList(res.data.repair_type_list)
        })
        .catch(() => {
        })
        getTableData(API_GET_PROPERTY_USER, param, setCheckerList)
        getTableData(API_GET_PROPERTY_USER, param, setWorkTargetList)
        getTableData(API_GET_PROPERTY_OUTSOURCING, param, setOutSourcingList)

    }
    
    const setDefaultValues = () => {
        axios.get(API_INSPECTION_COMPLAIN_DETAIL, { params: {complain_id: complain_id} })
        .then(res => {
            const data = res.data
            setValue('title', data.complain.title)
            setValue('workType', {label: data.complain.type, value:data.complain.type})
            setValue('request_date', data.complain.request_datetime)
            setRequestDate(data.complain.request_datetime ? formatDateTime(data.complain.request_datetime) : null)
            setValue('employeeClass', data.complain.emp_class && {label: data.complain.emp_class.code, value:data.complain.emp_class.id})
            setSelectEmployeeClass(data.complain.emp_class && {label: data.complain.emp_class.code, value:data.complain.emp_class.id})
            setValue('request_description', data.complain.request_description)
            setValue('requester_name', data.complain.requester_name)
            setValue('requester_department', data.complain.requester_department)
            setValue('requester_phone', data.complain.requester_phone)
            setValue('requester_mobile', data.complain.requester_mobile)
            setValue('work_target', data.complain.work_target_user ? {label: `${data.complain.work_target_user.name} (${data.complain.work_target_user.username})`, value: data.complain.work_target_user.id} : {label: '작업 대상자', value:''})
            setValue('outsourcing', data.complain.outsourcing_contract ? {label: data.complain.outsourcing_contract.name, value: data.complain.outsourcing_contract.id} : {label: '공사명', value:''})
            setValue('construction_start_date', data.complain.construction_start_date)
            setValue('construction_end_date', data.complain.construction_end_date)
            setConstructStartDate(data.complain.construction_start_date ? formatDateTime(data.complain.construction_start_date) : null)
            setConstructEndDate(data.complain.construction_end_date ? formatDateTime(data.complain.construction_end_date) : null)
            setValue('status', data.complain.status)
            setValue('work_date', data.complain.working_datetime)
            setWorkDate(data.complain.working_datetime ? formatDateTime(data.complain.working_datetime) : null)
            setValue('work_content', data.complain.working_description)
            setValue('location_detail', data.complain.detail_location)
            setValue('facility', data.complain.facility ? {label: `${data.complain.facility.name} (${data.complain.facility.code})`, value: data.complain.facility.id} : {label: '설비 선택', value:''})
            setValue('facility_usage', data.complain.facility_usage)
            setValue('problem_type', data.complain.problem_type ? {label: data.complain.problem_type.code, value: data.complain.problem_type.id} : {label: '문제유형을 선택해 주세요', value:''})
            setValue('cause_type', data.complain.cause_type ? {label: data.complain.cause_type.code, value: data.complain.cause_type.id} : {label: '원인유형을 선택해 주세요', value:''})
            setValue('repair_type', data.complain.repair_type ? {label: data.complain.repair_type.code, value: data.complain.repair_type.id} : {label: '처리유형을 선택해 주세요', value:''})
            setValue('complete_type', data.complain.complete_type)
            setValue('checker', data.complain.confirm_user ? {label: `${data.complain.confirm_user.name} (${data.complain.confirm_user.username})`, value: data.complain.confirm_user.id} : {label: '확인자', value:''})
            setValue('complete_date', data.complain.complete_datetime)
            setCompleteDate(data.complain.complete_datetime ? formatDateTime(data.complain.complete_datetime) : null)
            setValue('report_date', data.complain.report_datetime)
            setReportDate(data.complain.report_datetime ? formatDateTime(data.complain.report_datetime) : null)
            setBuilding(data.complain.building ? {label: data.complain.building.name, value: data.complain.building.id} : {label: '건물', value:''})
            setFloor(data.complain.floor ? {label: data.complain.floor.name, value: data.complain.floor.id} : {label: '층', value:''})
            setRoom(data.complain.room ? {label: data.complain.room.name, value: data.complain.room.id} : {label: '호실', value:''})
            setValue('has_education', data.complain.has_education)
            setValue('education_start_date', data.complain.education_start_datetime)
            setValue('education_end_date', data.complain.education_end_datetime)
            setEducationStartDate(data.complain.education_start_datetime ? formatDateTime(data.complain.education_start_datetime) : null)
            setEducationEndDate(data.complain.education_end_datetime ? formatDateTime(data.complain.education_end_datetime) : null)
            const oringinal_files = data.files && data.files.file_name
            const original_ids = data.files && data.files.files_ids
            if (original_ids && original_ids !== null) {
                setShowNames(original_ids.map((item, index) => ({
                    id: item,
                    names: oringinal_files[index]
                  })))
            }

            //공구비품 
            const tooldata = res.data.tool
            const toolDataList = tooldata.map((tool) => ({
                id: tool.id,
                toolequipment: {code: tool.toolequipment.code, value: tool.toolequipment.id},
                useHistory: tool.description,
                workToolDate: formatDateTime(tool.use_date)
              }))
            setToolData(toolDataList)            
            //작업자
            const workdata = res.data.work
            const workDataList = workdata.map((work) => ({
                id: work.id,
                worker: {
                  name: work.user ? work.user.username : '',
                  position: work.user ? (work.user.employee_level ? work.user.employee_level.code : '') : '',
                  employee_class: work.user ? (work.user.employee_level ? work.user.employee_class.code : '') : ''
                },
                worktype: work.work_type,
                workerDate : formatDateTime(work.work_date),
                workHour: work.work_hour,
                description : work.description
              }))
            setWorkData(workDataList)
            //자재
            const materialdata = res.data.material
            const MaterialList = materialdata.map((material) => ({
                id: material.id,
                material: material.material,
                materialDate: formatDateTime(material.use_date),
                usage:material.qty,
                unit: material.rest_unit,
                price: {unit_price: material.material.price, quantity: material.qty},
                Instructions: material.description,
                is_rest: material.is_rest

              }))
            setMaterialData(MaterialList)

            })
    }

    useEffect(() => {
        setDefaultValues()
        // add 
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        })
    }, [])

    useEffect(() => {
        getInit()
    }, [selectEmployeeClass])

    useEffect(() => {	
        axios.get(API_GET_BUILDING_FLOOR_ROOM, { params: {building: building.value}})
        .then(res => {
            setFloorList(res.data.floor_list)
            if (building.value === '') {
                setFloor(floorList[0])
                setRoom(roomList[0])
            }
        })
        .catch(() => {
        })
    }, [building.value])

    useEffect(() => {
        axios.get(API_GET_BUILDING_FLOOR_ROOM, { params: {floor: floor.value}})
        .then(res => {
            setRoomList(res.data.room_list)
            if (floor.value === '') {
                setRoom(roomList[0])
            }
        })
        .catch(() => {
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
                    <Breadcrumbs breadCrumbTitle='작업현황관리' breadCrumbParent='점검관리' breadCrumbActive='작업현황관리' />
                </div>
            </Row>
            <Col className='d-flex justify-content-start' >
                <Button color={page === 'progress' ? 'primary' : 'light-info'} onClick={() => setPage('progress')}>진행현황</Button>
                <Button color={page === 'worker' ? 'primary' : 'light-info'}  onClick={() => setPage('worker')}>작업자</Button>
                <Button color={page === 'material' ? 'primary' : 'light-info'}  onClick={() => setPage('material')}>자재</Button>
                <Button color={page === 'toolequipment' ? 'primary' : 'light-info'}  onClick={() => setPage('toolequipment')}>공구비품</Button>
            </Col>
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
                    outsourcingList = {outsourcingList}
                    workList = {workList}
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
                    files={files}
                    setFiles={setFiles}
                    showNames = {showNames}
                    setShowNames = {setShowNames}
                    modal = {modal}
                    setModal = {setModal}
                    unregister = {unregister}
                    selectEmployeeClass={selectEmployeeClass}
                    setSelectEmployeeClass={setSelectEmployeeClass}
                    type= {'fix'}
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
            <FormButton type={'detail'} complainId={complain_id}/>
        </Form>
        <GroupAddModal 
          formModal={modal} 
          setFormModal={setModal} 
        /> 

	</Fragment>
	)
}


export default Complain_Fix