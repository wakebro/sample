import { Circle, File } from "react-feather"
import { ROUTE_EDUCATION, ROUTE_EDUCATION_TIMELINE } from "../../constants"
import { EDUCATION_COOPERATOR, EDUCATION_GENERAL, EDUCATION_LEGAL, EDUCATION_MENU, EDUCATION_MGMT, EDUCATION_SAFETY, EDUCATION_SCHEDULE } from "../../constants/CodeList"


export default [
	{
		id: "education-mgmt",
		title: "교육관리",
		icon: <File size={20} />,
		code: EDUCATION_MGMT,
		appExpose:true,
		children: [
			{
				id: 'education-schedule',
				title: '교육일정현황',
				icon: <Circle size={12} />,
				navLink: ROUTE_EDUCATION_TIMELINE,
				code: EDUCATION_SCHEDULE,
				appExpose:true
			},
			{
				id: 'education-menu-mgmt',
				title: '교육',
				icon: <Circle size={12} />,
				code: EDUCATION_MENU,
				appExpose:false,
				children: [
					{
						id: 'legal-education',
						title: '법정교육',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_EDUCATION}/legal`,
						code: EDUCATION_LEGAL,
						appExpose:true
					},
					{
						id: 'general-education',
						title: '일반교육',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_EDUCATION}/general`,
						code: EDUCATION_GENERAL,
						appExpose:true
					},
					{
						id: 'safety-education',
						title: '안전교육',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_EDUCATION}/safety`,
						code: EDUCATION_SAFETY,
						appExpose:true
					},
					{
						id: 'outsourcing-education',
						title: '외주업체교육',
						icon: <Circle size={12} />,
						navLink: `${ROUTE_EDUCATION}/cooperator`,
						code: EDUCATION_COOPERATOR,
						appExpose:true
					}
				]
			}
		]
	}
]
