import { lazy } from "react"
import { 
	ROUTE_BASICINFO_AREA_BUILDING, 
	ROUTE_BASICINFO_AREA_PROPERTY, 
	ROUTE_BASICINFO_AREA_PROPERTY_DETAIL,
	// 층정보
	ROUTE_BASICINFO_AREA_FLOOR,
	ROUTE_BASICINFO_AREA_BUILDING_DETAIL, 
	ROUTE_BASICINFO_AREA_BUILDING_REGISTER, 
	ROUTE_BASICINFO_AREA_BUILDING_DRAWING_ADD, 
	ROUTE_BASICINFO_AREA_BUILDING_DRAWING_DETAIL, 
	ROUTE_BASICINFO_AREA_BUILDING_BUILDINGINDEX, 
	ROUTE_BASICINFO_AREA_BUILDING_ETC, 
	ROUTE_BASICINFO_AREA_BUILDING_PHOTO, 
	ROUTE_BASICINFO_AREA_BUILDING_DRAWING,
	ROUTE_BASICINFO_AREA_BUILDING_PHOTO_DETAIL, 
	ROUTE_BASICINFO_AREA_BUILDING_PHOTO_REGISTER,
	ROUTE_BASICINFO_AREA_CONTRACT,
	ROUTE_BASICINFO_AREA_CONTRACT_FORM,
	ROUTE_BASICINFO_AREA_CONTRACT_DETAIL,
	ROUTE_BASICINFO_EMPLOYEE_INFORMATION,
	ROUTE_BASICINFO_EMPLOYEE_REGISTER,
	ROUTE_BASICINFO_EMPLOYEE_LICENSE_REGISTER,
	ROUTE_BASICINFO_EMPLOYEE_LICENSE,
	ROUTE_BASICINFO_PARTNER_MANAGEMENT,
	ROUTE_BASICINFO_PARTNER_MANAGEMENT_DETAIL,
	ROUTE_BASICINFO_PARTNER_MANAGEMENT_REGISTER,
	ROUTE_BASICINFO_PARTNER_MANAGEMENT_FIX,
	ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION,
	ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_DETAIL,
	ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_REGISTER,
	ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_FIX,
	ROUTE_BASICINFO_PNR_MGMT_CLASS,
	ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT, 
	ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_ADD, 
	ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL, 
	ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_FIX, 
	ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_RECORD,
	ROUTE_BASICINFO_FACILITY_FACILITYINFO,
	ROUTE_BASICINFO_FACILITY_FACILITYINFO_DETAIL,
	ROUTE_BASICINFO_FACILITY_FACILITYINFO_FORM,
	ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT,
	ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_FORM,
	ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_DETAIL,
	ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_LIST,
	ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_DETAIL,
	ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_FORM,
	ROUTE_BASICINFO_AREA_DRAWING,
	ROUTE_BASICINFO_AREA_DRAWING_FORM,
	ROUTE_BASICINFO_AREA_DRAWING_DETAIL,

	// 실정보
	ROUTE_BASICINFO_AREA_ROOM,
	ROUTE_BASICINFO_AREA_ROOM_REGISTER
} from "../../constants"

const AddDrawing = lazy(() => import('../../views/basic/area/building/add/AddDrawing'))
const DrawingDetail = lazy(() => import('../../views/basic/area/building/detail/DrawingDetail'))

const BasicInfoBuilding = lazy(() => import('../../views/basic/area/building'))
const BasicInfoProperty = lazy(() => import('../../views/basic/area/property'))
const BasicInfoPropertyDetail = lazy(() => import('../../views/basic/area/property/Property'))
// 층정보
const BasicInfoFloor = lazy(() => import('@views/basic/area/floor'))
const BasicInfoFloorDetail = lazy(() => import('@views/basic/area/floor/Floor'))
// 실정보
const BasicInfoRoom = lazy(() => import('@views/basic/area/room'))
const BasicInfoRoomDetail = lazy(() => import('@views/basic/area/room/Room'))
const BasicInfoRoomForm = lazy(() => import('@views/basic/area/room/Room'))

const BasicInfoBuildingDetail = lazy(() => import('../../views/basic/area/building/BuildingIndex'))
const BasicInfoBuildingRegister = lazy(() => import('../../views/basic/area/building/BuildingRegister'))
const BuildingIndex = lazy(() => import('../../views/basic/area/building/BuildingIndex'))
const BuildingETC = lazy(() => import('../../views/basic/area/building/ETC'))
const Photo = lazy(() => import('../../views/basic/area/building/Photo'))
const Drawing = lazy(() => import('../../views/basic/area/building/Drawing'))
const FacilityInfoList = lazy(() => import('@views/basic/facility/Facility/FacilityInfoList'))
const FacilityForm = lazy(() => import('@views/basic/facility/Facility/FacilityForm'))
const FacilityDetail = lazy(() => import('@views/basic/facility/Facility/FacilityDetail'))
const BasicInfoBuildingPhotoDetail = lazy(() => import('../../views/basic/area/building/PhotoTabDetail'))
const BasicInfoBuildingPhotoPhoto = lazy(() => import('../../views/basic/area/building/PhotoTabRegister'))
const BasicInfoEmployeeInformation = lazy(() => import('../../views/basic/employee/information'))
// 기본정보>공간>도면정보관리(도면분리)
const BasicInfoDrawingList = lazy(() => import('../../views/basic/area/drawing/list/index'))
const BasicInfoDrawingForm = lazy(() => import('../../views/basic/area/drawing/form/DrawingForm'))
const BasicInfoDrawingDetail = lazy(() => import('../../views/basic/area/drawing/list/indexDetail'))

const BasicInfoAreaContractList = lazy(() => import('../../views/basic/area/contract/list/ContractList'))
const BasicInfoAreaContractForm = lazy(() => import('../../views/basic/area/contract/form/ContractForm'))
const BasicInfoAreaContractDetail = lazy(() => import('../../views/basic/area/contract/list/ContractDetail'))

const BasicInfoEmployeeRegister = lazy(() => import('../../views/basic/employee/information/EmployeeRegister'))
const BasicInfoEmployeeLicenseRegister = lazy(() => import('../../views/basic/employee/information/LicenseRegister'))
const BasicInfoEmployeeLicenseDetail = lazy(() => import('../../views/basic/employee/information/LicenseDetail'))
const BasicInfoEmployeeAppointment = lazy(() => import('../../views/basic/employee/appointment/AppointmentList'))
const BasicInfoEmployeeAppointmentForm = lazy(() => import('../../views/basic/employee/appointment/AppointmentForm'))
const BasicinfoEmployeeAppointmentDetail = lazy(() => import('../../views/basic/employee/appointment/AppointmentDetail'))
const BasicInfoEmployeeAttendance = lazy(() => import('../../views/basic/employee/attendance/AttendanceList'))
const BasicInfoEmployeeAttendanceForm = lazy(() => import('../../views/basic/employee/attendance/AttendanceForm'))

const Partner_Management = lazy(() => import('../../views/basic/partner/main'))
const Partner_Management_Register = lazy(() => import('../../views/basic/partner/main/register'))
const Partner_Management_Detail = lazy(() => import('../../views/basic/partner/main/detail'))
const Partner_Management_Fix = lazy(() => import('../../views/basic/partner/main/fix'))
const Partner_Management_Evaluation = lazy(() => import('../../views/basic/partner/evaluation'))
const Partner_Management_Evaluation_Detail = lazy(() => import('../../views/basic/partner/evaluation/Detail'))
const Partner_Management_Evaluation_Register = lazy(() => import('../../views/basic/partner/evaluation/Register'))
const Partner_Management_Evaluation_Fix = lazy(() => import('../../views/basic/partner/evaluation/Fix'))
const PartnerMgmtCLass = lazy(() => import('@views/basic/partner/class'))

const Facility_ToolEquipment = lazy(() => import('../../views/basic/facility/ToolEquipment'))
const Facility_ToolEquipment_Add = lazy(() => import('../../views/basic/facility/ToolEquipment/ToolEquipmentAdd'))
const Facility_ToolEquipment_detail = lazy(() => import('../../views/basic/facility/ToolEquipment/ToolEquipmentDetail'))
const Facility_ToolEquipment_fix = lazy(() => import('../../views/basic/facility/ToolEquipment/ToolEquipmentFix'))

const BasicRoutes = [
	{
		path: ROUTE_BASICINFO_AREA_BUILDING,
		element: <BasicInfoBuilding />
	},
	{
		path: ROUTE_BASICINFO_AREA_PROPERTY,
		element: <BasicInfoProperty />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_PROPERTY_DETAIL}/:type`,
		element: <BasicInfoPropertyDetail />
	},
	{
		path: ROUTE_BASICINFO_AREA_FLOOR,
		element: <BasicInfoFloor/>
	},
	{
		path: `${ROUTE_BASICINFO_AREA_FLOOR}/:rowId`,
		element: <BasicInfoFloorDetail/>
	},
	{
		path: ROUTE_BASICINFO_AREA_ROOM,
		element: <BasicInfoRoom/>
	},
	{
		path: `${ROUTE_BASICINFO_AREA_ROOM}/:rowId`,
		element: <BasicInfoRoomDetail/>
	},
	{
		path: ROUTE_BASICINFO_AREA_ROOM_REGISTER,
		element: <BasicInfoRoomForm/>
	},
	{
		path: `${ROUTE_BASICINFO_AREA_BUILDING_DETAIL}/:type`,
		element: <BasicInfoBuildingDetail />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_BUILDING_REGISTER}`,
		element: <BasicInfoBuildingRegister />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_BUILDING_DRAWING_ADD}/:type`,
		element: <AddDrawing />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_BUILDING_DRAWING_DETAIL}/:type/:id`,
		element: <DrawingDetail />
	},
	// {
	// 	path: ROUTE_BASICINFO_AREA_BUILDING_BUILDINGINDEX,
	// 	element: < />
	// }
	{
		path: `${ROUTE_BASICINFO_AREA_BUILDING_BUILDINGINDEX}/:type`,
		element: <BuildingIndex />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_BUILDING_ETC}/:type`,
		element: <BuildingETC />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_BUILDING_PHOTO}/:type`,
		element: <Photo />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_BUILDING_DRAWING}/:type`,
		element: <Drawing />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_BUILDING_PHOTO_DETAIL}/:type`,
		element: <BasicInfoBuildingPhotoDetail />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_BUILDING_PHOTO_REGISTER}/:type`,
		element: <BasicInfoBuildingPhotoPhoto />
	},
	{
		path: `${ROUTE_BASICINFO_EMPLOYEE_INFORMATION}`,
		element: <BasicInfoEmployeeInformation />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_CONTRACT}`,
		element:<BasicInfoAreaContractList />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_CONTRACT_FORM}`,
		element:<BasicInfoAreaContractForm />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_CONTRACT_DETAIL}/:id`,
		element:<BasicInfoAreaContractDetail />
	},
	{
		path: `${ROUTE_BASICINFO_EMPLOYEE_REGISTER}`,
		element: <BasicInfoEmployeeRegister />
	},
	{
		path: `${ROUTE_BASICINFO_EMPLOYEE_LICENSE_REGISTER}`,
		element: <BasicInfoEmployeeLicenseRegister />
	},
	{
		path: `${ROUTE_BASICINFO_EMPLOYEE_LICENSE}`,
		element: <BasicInfoEmployeeLicenseDetail />
	},
	{
		path: ROUTE_BASICINFO_PARTNER_MANAGEMENT,
		element:<Partner_Management/>
	},
	{
		path: ROUTE_BASICINFO_PARTNER_MANAGEMENT_REGISTER,
		element:<Partner_Management_Register/>
	},
	{
		path: `${ROUTE_BASICINFO_PARTNER_MANAGEMENT_DETAIL}/:id`,
		element:<Partner_Management_Detail/>
	},
	{
		path: `${ROUTE_BASICINFO_PARTNER_MANAGEMENT_FIX}/:id`,
		element:<Partner_Management_Fix/>
	},
	{
		path: ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION,
		element:<Partner_Management_Evaluation/>
	},
	{
		path: `${ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_DETAIL}/:id`,
		element:<Partner_Management_Evaluation_Detail/>
	},
	{
		path: `${ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_REGISTER}/:id`,
		element:<Partner_Management_Evaluation_Register/>
	},
	{
		path: `${ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_FIX}/:id`,
		element:<Partner_Management_Evaluation_Fix/>
	},
	{
		path: ROUTE_BASICINFO_PNR_MGMT_CLASS,
		element: <PartnerMgmtCLass/>
	},

	{
		path: ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT,
		element: <Facility_ToolEquipment />
	},
	{
		path: ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_ADD,
		element: <Facility_ToolEquipment_Add />
	},
	{
		path: `${ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL}/:id`,
		element: <Facility_ToolEquipment_detail/>
	},
	{
		path: `${ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_FIX}/:id`,
		element: <Facility_ToolEquipment_fix/>
	},
	{
		path: ROUTE_BASICINFO_FACILITY_FACILITYINFO,
		element: <FacilityInfoList />
	},
	{
		path: `${ROUTE_BASICINFO_FACILITY_FACILITYINFO_DETAIL}/:id`,
		element: <FacilityDetail />
	},
	{
		path: ROUTE_BASICINFO_FACILITY_FACILITYINFO_FORM,
		element: <FacilityForm />
	},
	{
		path: ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT,
		element: <BasicInfoEmployeeAppointment />
	},
	{
		path: ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_FORM,
		element: <BasicInfoEmployeeAppointmentForm />
	},
	{
		path: `${ROUTE_BASICINFO_EMPLOYEE_APPOINTMENT_DETAIL}/:id`,
		element: <BasicinfoEmployeeAppointmentDetail />
	},
	{
		path: ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_LIST,
		element: <BasicInfoEmployeeAttendance />
	},
	{
		path: ROUTE_BASICINFO_EMPLOYEE_ATTENDANCE_FORM,
		element: <BasicInfoEmployeeAttendanceForm />
	},
	{
		path: ROUTE_BASICINFO_AREA_DRAWING,
		element: <BasicInfoDrawingList />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_DRAWING_DETAIL}/:id`,
		element: <BasicInfoDrawingDetail />
	},
	{
		path: `${ROUTE_BASICINFO_AREA_DRAWING_FORM}/:id`,
		element: <BasicInfoDrawingForm />
	}
]

export default BasicRoutes