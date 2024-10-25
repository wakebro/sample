import { Users, Circle } from "react-feather"
import { ROUTE_INTRANET, ROUTE_INTRANET_DOCUMENT, ROUTE_INTRANET_ANNOUNCEMENT, ROUTE_INTRANET_ARCHIVE, ROUTE_INTRANET_MAIN, ROUTE_INTRANET_NOTIFICATION} from "../../constants"
import { INTRANET, INTRANET_ANNOUNCEMENT, INTRANET_ARCHIVES, INTRANET_DOCUMENT, INTRANET_MAIN, INTRANET_NOTIFICATION } from "../../constants/CodeList"
export default [
	{
		id: "intranet",
		title: "인트라넷",
		icon: <Users size={20} />,
		// navLink: ROUTE_INTRANET,
		code: INTRANET,
		appExpose:true,
		children: [
			{
				id: 'intranet_main',
				title: '인트라넷 메인',
				icon: <Circle size={12} />,
				navLink: ROUTE_INTRANET_MAIN,
				code: INTRANET_MAIN,
				appExpose:true
			},
			{
				id: 'intranet_announcement',
				title: '공지사항',
				icon: <Circle size={12} />,
				navLink: ROUTE_INTRANET_ANNOUNCEMENT,
				code: INTRANET_ANNOUNCEMENT,
				appExpose:true
			},
			{
				id: 'intranet_notifications',
				title: '알림함',
				icon: <Circle size={12} />,
				navLink: ROUTE_INTRANET_NOTIFICATION,
				code: INTRANET_NOTIFICATION,
				appExpose:true
			},
			{
				id: 'intranet_document',
				title: '문서함',
				icon: <Circle size={12} />,
				navLink: ROUTE_INTRANET_DOCUMENT,
				code: INTRANET_DOCUMENT,
				appExpose:true
			},
			{
				id: 'intranet_archives',
				title: '자료실',
				icon: <Circle size={12} />,
				navLink: ROUTE_INTRANET_ARCHIVE,
				code: INTRANET_ARCHIVES,
				appExpose:true
			}
		]
	}
]