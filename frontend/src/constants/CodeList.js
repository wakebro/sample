export const DASHBOARD = '010000' //대시보드

export const INTRANET = '020000' //인트라넷
export const INTRANET_MAIN = '020100' //메인
export const INTRANET_ANNOUNCEMENT = '020200' //공지사항
export const INTRANET_ARCHIVES = '020300' //자료실
export const INTRANET_NOTIFICATION = '020400' //알림발송
export const INTRANET_DOCUMENT = '020500' //문서함

export const SCHEDULE = '030000' //일정관리
export const SCHEDULE_INFO = '030100' //일정
export const SCHEDULE_REGISTER = '030200' //업무등록
export const SCHEDULE_REGISTER_DISASTER = '030300' //중대재 업무등록

export const BASIC_INFO = '040000' //기본정보관리
export const BASIC_INFO_AREA = '040100' //공간정보관리
export const BASIC_INFO_AREA_PROPERTY = '040101' //사업소정보
export const BASIC_INFO_AREA_BUILDING = '040102' //건물정보
export const BASIC_INFO_AREA_FLOOR = '040103' //층정보
export const BASIC_INFO_AREA_ROOM = '040104' //실정보
export const BASIC_INFO_AREA_CONTRACT = '040105' //사업소별계약관리
export const BASIC_INFO_FACILITY = '040200' //설비정보관리
export const BASIC_INFO_FACILITY_FACILITY_INFO = '040201' //설비정보
export const BASIC_INFO_FACILITY_TOOL_EQUIPMENT = '040202' //공구비품정보
export const BASIC_INFO_EMPLOYEE = '040300' //직원정보관리
export const BASIC_INFO_EMPLOYEE_INFO = '040301' //직원정보
export const BASIC_INFO_EMPLOYEE_APPOINTMENT = '040302' //선임관리
export const BASIC_INFO_EMPLOYEE_ATTENDANCE = '040303' //근태현황
export const BASIC_INFO_PARTNER = '040400' //협력업체관리
export const BASIC_INFO_PARTNER_MAIN = '040401' //협력업체
export const BASIC_INFO_PARTNER_CLASS = '040402' //협력업체분류
export const BASIC_INFO_PARTNER_EVALUATION = '040403' //협력업체평가
export const BASIC_INFO_AREA_DRAWING = '040500' //도면정보관리

export const INSPECTION = '050000' //점검현황
export const INSPECTION_MAIN = '050100' //점검현황메인
export const INSPECTION_INFO = '050200' //점검현황
export const INSPECTION_INSPECTION = '050201' //점검일지
export const INSPECTION_FORM = '050202' //점검양식
export const INSPECTION_PERFORMANCE = '050203' //점검실적관리
export const INSPECTION_REG = '050204' //점검일지관리

export const INSPECTION_OUTSOURCING = '050300' //외주점검

export const EDUCATION_MGMT = '060000' //교육관리
export const EDUCATION_SCHEDULE = '060100' //교육일정현황
export const EDUCATION_MENU = '060200' //교육관리
export const EDUCATION_LEGAL = '060201' //법정교육
export const EDUCATION_GENERAL = '060202' //일반교육
export const EDUCATION_SAFETY = '060203' //안전교육
export const EDUCATION_COOPERATOR = '060204' //외주업체교육

export const FACILITY_MGMT = '070000' //시설관리
export const FACILITY_ALARM = '070100' //경보관리
export const FACILITY_CAMERA = '070101' //CCTV관리
export const FACILITY_HISTORY = '070102' //CCTV히스토리
export const FACILITY_IOT = '070103' //IoT관리
export const FACILITY_HISTORY_IOT = '070104' //Iot히스토리
export const FACILITY_GUARD = '070200' //경비업무
export const FACILITY_NFC_SCAN = '070201' //NFC스캔
export const FACILITY_NFC_LIST = '070202' //NFC스캔목록
export const FACILITY_NFC_MGMT = '070203' //NFC관리
export const FACILITY_WORK_STATUS = '070204' //경비업무현황
export const FACILITY_MATERIAL_MGMT = '070300' //자재관리
export const FACILITY_MATERIAL_INFO = '070301' //자재정보
export const FACILITY_MATERIAL_REQUEST = '070302' //자재청구
export const FACILITY_CONTRACT_MGMT = '070400' //외주계약관리
export const INSPECTION_DEFECT = '070500' //하자관리
export const INSPECTION_COMPLAIN = '070600' //불편신고접수
export const INSPECTION_COMPLAIN_STATUS = '070700' //작업현황관리
export const INSPECTION_MANUAL = '070800' //유지관리매뉴얼

export const SYSTEM_MGMT = '080000' //시스템관리
export const SYSTEM_INFO_BASIC = '080100' //기본정보
export const SYSTEM_INFO_COMPANY = '080101' //회사정보관리
export const SYSTEM_INFO_SPACE = '080102' //공간정보관리
export const SYSTEM_INCONVENIENCE = '080200' //시설표준정보
export const SYSTEM_INCONVENIENCE_TYPE = '080201' //유형별분류
export const SYSTEM_INCONVENIENCE_NORMAL = '080202' //표준자재
export const SYSTEM_INCONVENIENCE_EMPLOYEE_CLASS = '080203' //직종코드
export const SYSTEM_INCONVENIENCE_EMPLOYEE_LEVEL = '080204' //직급정보
export const SYSTEM_INCONVENIENCE_LICENSE = '080205' //자격증정보
export const SYSTEM_AUTH_MGMT = '080300' //권한관리
export const SYSTEM_AUTH_USER = '080301' //사용자권한관리
export const SYSTEM_AUTH_GROUP = '080302' //그룹권한관리

export const CRITICAL_DISASTER = '090000' //중대재해관리
export const CRITICAL_INSPECTION = '090100' //중대재해_일일점검
export const CRITICAL_INSPECTION_INSPECTION = '090101' //중대재해_점검일지
export const CRITICAL_INSPECTION_FORM = '090102' //중대재해_점검양식
export const CRITICAL_DISASTER_INSPECTION_REG = '090103' //중대재해_점검일지관리

export const CRITICAL_EVALUATION = '090200' //중대재해_위험성평가
export const CRITICAL_EVALUATION_LIST = '090201' //중대재해_위험성평가_목록
export const CRITICAL_EVALUATION_TEMPLATE = '090202' //중대재해_위험성평가_양식

export const CRITICAL_QNA = '090300' //중대재해_종사자의견
export const CRITICAL_CORPERATION = '090400' //중대재해_협력업체

export const REPORT_MGMT = '100000' //보고서관리
export const REPORT_INFO = '100100' //보고서
export const REPORT_MANAGE = '100200' //운영보고서

export const ENERGY_MGMT = '110000'	//에너지관리
export const ENERGY_READ = '110100'	//검침정보관리
export const ENERGY_GAUGE_GROUP = '110101'	//계량기정보
export const ENERGY_GAUGE = '110102'	//계기정보
export const ENERGY_DAY_MONTH = '110200'	//일일/월간검침
export const ENERGY_DAILY = '110201'	//일일검침
export const ENERGY_MONTHLY = '110202'	//월간검침
export const ENERGY_CHART = '110203'	//검침차트
export const ENERGY_ELECTRIC = '110300'	//전력사용관리
export const ENERGY_ELECTRIC_REGISTER = '110301'	//전력 및 발전량 등록
export const ENERGY_ELECTRIC_LIST = '110302'	//전력 및 발전량 조회
export const ENERGY_ELECTRIC_ITSS = '110303'	//빙축열 조회
export const ENERGY_ELECTRIC_TOTAL = '110304'	//전력사용 집계
export const ENERGY_GAS_MGMT = '110400'	//가스사용관리
export const ENERGY_GAS_REGISTER = '110401'	//가스 사용량 등록
export const ENERGY_GAS_DAY = '110402'	//보일러 및 가스사용량
export const ENERGY_GAS_MONTH = '110403'	//월별 사용량
export const ENERGY_GAS_COMPARE = '110404'	//지정월 사용량
export const ENERGY_GAS_YEAR = '110405'	//년도별 사용량
export const ENERGY_UE_MGMT = '110500'	//수광비관리
export const ENERGY_UE_PERFORM = '110501'	//수광비실적관리
export const ENERGY_UE_LIST = '110502'	//수광비실적조회
export const ENERGY_UE_IDRATE = '110503'	//수광비실적증감율
export const ENERGY_BASIC_INFO = '110600'	//기본정보
export const ENERGY_BASIC_MAGIFICATION = '110601'	//배율관리
export const ENERGY_BASIC_UTILITY_CODE = '110602'	//수광비코드관리
export const ENERGY_BASIC_UTILITY_ENTRY = '110603'	//수광비항목관리
export const ENERGY_BASIC_PURPOSE = '110604'	//에너지목표관리

export const BUSINESS_MGMT = '120000' //사업관리
export const BUSINESS_REQUISITION = '120100' //품의서
export const BUSINESS_REQUISITION_BTL = '120101' //BTL사업소
export const BUSINESS_REQUISITION_OURIDURI = '120102' //우리두리사업소
export const BUSINESS_MAINTENANCE = '120200' //유지보수
export const BUSINESS_PLAN = '120300' //장기수선충당금