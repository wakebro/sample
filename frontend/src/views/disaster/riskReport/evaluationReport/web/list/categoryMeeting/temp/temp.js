import { getCommaDel, resultCheckFunc } from "../../../../../../../../utility/Utils"
import * as yup from 'yup'

export const meetingHtmlCode = `
<h1 style="text-align: left; " class="">1. 개요</h1><ul><li style="text-align: left;"><span style="font-size: 14px;">회의일시/ 장소: 2023. 5. 18. 13: 30 / 마루나루(북카페) 1층</span></li><li style="text-align: left;"><span style="font-size: 14px;">팀별위험요인• 개선대책파악: 2023. 5. 15. ~ 18.</span></li></ul><h1 style="text-align: left;" class=""><span style="font-size: 24px;"><b>2. 분야별 위험요인 파악</b></span></h1><ul><li style="text-align: left;"><span style="font-size: 14px;">﻿미화</span></li></ul><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 슬리퍼, 미끄러운 신발 등 부적절한 보호구 착용으로 넘어짐</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 지하주차 장 배수로 및 트랜치 청소 중 개방 부위에 걸려 넘어짐</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 물청소 중 바닥 물기와 세제 등으로 인해 미끄러져 다칠 위험&nbsp;</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 안전 장갑을 착용하지 않고 날카로운 물체 취급 작업 중 찔릴 위험</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 청소작업 중 바닥 장해물 방치로 인해 걸려 넘어질 위험</p><ul><li style="text-align: left;">시설관리</li></ul><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 안전난간 및 덮개가 설치되지 않은 오수정화시설 개구부에 추락</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 사다리, 작업대 등에서 추락 또는 충돌</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 중량물 공동 운반작업 시 신호 불일치로 허리 부상 또는 낙하사고</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 노후 배선, 절연이 불량한 이동 전선 사용 중 감전</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;- 자재 등 중량물 취급 방법 불량으로 요통 및 근골격계 질환</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 절삭 휠 작업 시 불티 비산으로 주변 인화성 물질 화재 발생위험</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 이동식 케이블릴 연결 전기기계 기구 작업 시 누전으로 인한 감전</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 용접작업장소 주변 인화물질에 불티가 틔어 화재 사고 발생</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 텍스 등 해체작업 시 이물질 낙하로 인한 눈/호흡기에 오염 위험</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 겨울철 경사진 빙판길을 지나다 미끄러져 넘어져 다칠 위험&nbsp;</p><p style="text-align: left;"><span style="font-size: 14px;"></span><span style="font-size: 24px;"><b><br></b></span></p><h1 style="text-align: left;" class=""><span style="font-size: 14px;"><br></span></h1><p style="text-align: left;"><br></p><p style="text-align: left;"><br></p><p style="text-align: left; "><span data-metadata="<!--(figmeta)eyJmaWxlS2V5IjoiMEw1cFZoSW1NSVg5aWMxRWdsYldMcyIsInBhc3RlSUQiOjQzNTk4ODY3NCwiZGF0YVR5cGUiOiJzY2VuZSJ9Cg==(/figmeta)-->"></span></p><p><span style="white-space-collapse: preserve;"><br></span></p><p><span style="white-space-collapse: preserve;"><br></span></p>
`

export const meetingMinutesCode = `
<h1 style="text-align: left; " class="">1. 개요</h1><ul><li style="text-align: left;"><span style="font-size: 14px;">회의일시/ 장소: 2023. 5. 18. 13: 30 / 마루나루(북카페) 1층</span></li><li style="text-align: left;"><span style="font-size: 14px;">팀별위험요인• 개선대책파악: 2023. 5. 15. ~ 18.</span></li></ul><h1 style="text-align: left;" class=""><span style="font-size: 24px;"><b>2. 분야별 위험요인 파악</b></span></h1><ul><li style="text-align: left;"><span style="font-size: 14px;">﻿미화</span></li></ul><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 슬리퍼, 미끄러운 신발 등 부적절한 보호구 착용으로 넘어짐</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 지하주차 장 배수로 및 트랜치 청소 중 개방 부위에 걸려 넘어짐</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 물청소 중 바닥 물기와 세제 등으로 인해 미끄러져 다칠 위험&nbsp;</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 안전 장갑을 착용하지 않고 날카로운 물체 취급 작업 중 찔릴 위험</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 청소작업 중 바닥 장해물 방치로 인해 걸려 넘어질 위험</p><ul><li style="text-align: left;">시설관리</li></ul><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp;- 안전난간 및 덮개가 설치되지 않은 오수정화시설 개구부에 추락</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 사다리, 작업대 등에서 추락 또는 충돌</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 중량물 공동 운반작업 시 신호 불일치로 허리 부상 또는 낙하사고</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 노후 배선, 절연이 불량한 이동 전선 사용 중 감전</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;- 자재 등 중량물 취급 방법 불량으로 요통 및 근골격계 질환</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 절삭 휠 작업 시 불티 비산으로 주변 인화성 물질 화재 발생위험</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 이동식 케이블릴 연결 전기기계 기구 작업 시 누전으로 인한 감전</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 용접작업장소 주변 인화물질에 불티가 틔어 화재 사고 발생</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 텍스 등 해체작업 시 이물질 낙하로 인한 눈/호흡기에 오염 위험</p><p style="text-align: left;">&nbsp; &nbsp; &nbsp; &nbsp; - 겨울철 경사진 빙판길을 지나다 미끄러져 넘어져 다칠 위험&nbsp;</p><p style="text-align: left;"><span style="font-size: 14px;"></span><span style="font-size: 24px;"><b><br></b></span></p><h1 style="text-align: left;" class=""><span style="font-size: 14px;"><br></span></h1><p style="text-align: left;"><br></p><p style="text-align: left;"><br></p><p style="text-align: left; "><span data-metadata="<!--(figmeta)eyJmaWxlS2V5IjoiMEw1cFZoSW1NSVg5aWMxRWdsYldMcyIsInBhc3RlSUQiOjQzNTk4ODY3NCwiZGF0YVR5cGUiOiJzY2VuZSJ9Cg==(/figmeta)-->"></span></p><p><span style="white-space-collapse: preserve;"><br></span></p><p><span style="white-space-collapse: preserve;"><br></span></p>
`

export const tempData = {
	id :1,
	title: '충남대학교 1차 BTL 위험성평가',
	target_total:33,
	target_man: 0,
	target_woman: 33,
	attendance_total: 30,
	attendance_man: 0,
	attendance_woman: 30,
	reason:'외부 업체와 미팅으로 인한 불참\r\n무단불참자 한명\r\n테스트',
	contents: meetingHtmlCode,
	manger_name: '이훈',
	manager_level:'영업소장',
	education_location:'선암영업소',
	description:'13:00~14:00',
	minutes: {
		id: 1,
		title:'회의록',
		date:'2023.05.18',
		user:'김창진', // 직급도 같이 출력
		department: '충남대 1차 BTL 학생생활관',
		attendee:'김창진, 이종섭, 명현경, 남택근, 유용길, 이재혁, 김상권, 이남순, 인미자, 정복순, 윤종숙, 최명례, 윤영옥',
		topic:'위험성 평가 결과 개선방안 마련 : 미화, 시설관리(보수, 전기, 조경, 비품수리)',
		contents: meetingMinutesCode,
		message: '각종 사고사례 및 예방대책 교육',
		etc: '-없음.'
	}
}

export const selectPartnerList = [
    {id: 1, name: 'admin(admin)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 8, name: '창진(test7)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 10, name: '이종섭(test9)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 12, name: '명현경(test11)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 14, name: '남택근(test13)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 16, name: '유용길(test15)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 18, name: '이재혁(test17)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 20, name: '김상권(test19)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 3, name: '이남순(test2)', position: '대리', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 4, name: '인미자(test3)', position: '주임', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 7, name: '정복순!(test6)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 9, name: '윤종숙(test8)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 11, name: '최명례(test10)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'},
    {id: 13, name: '윤영옥(test12)', position: '차장', tempSign:'/static_backend/upload/sign/signsample.png'}
]

export const files = [
    {name: 'safe.jpeg'},
    {name: 'education3.png'},
    {name: 'education2.jpeg'}
]

export const meetingDefaultValues = {
    target_total: 0,
    target_woman: 0,
    target_man: 0,
    participant_total: 0,
    participant_woman: 0,
    participant_man: 0
}

export const meetingNumValidationSchema = yup.object().shape({
    target_woman: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),
    target_man: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),
    participant_woman: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요'),    
    participant_man: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
})

export const meetingCountFunc = (setValue, getValues, selectPartner) => {
    const targetTotal = resultCheckFunc((getCommaDel(getValues('target_woman'))) + (getCommaDel(getValues('target_man'))))
    setValue('target_total', targetTotal)
    const participantTotal = resultCheckFunc((getCommaDel(getValues('participant_woman'))) + (getCommaDel(getValues('participant_man'))))
    setValue('participant_total', participantTotal)

    if (selectPartner && selectPartner.length > 0) {
        const totalCount = getCommaDel(getValues('participant_woman')) + getCommaDel(getValues('participant_man')) - 1
        const letter = totalCount > 0 ? `${selectPartner[0].name} 외 ${totalCount}` : selectPartner[0].name
        setValue('minutes_participant', letter)
    }
}