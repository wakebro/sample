import { lazy } from "react"
import { ROUTE_INTRANET, ROUTE_INTRANET_DETAIL, ROUTE_INTRANET_DOCUMENT, ROUTE_INTRANET_SEND, 
	ROUTE_INTRANET_ANNOUNCEMENT, ROUTE_INTRANET_ANNOUNCEMENT_FORM, ROUTE_INTRANET_ANNOUNCEMENT_DETAIL,
	ROUTE_INTRANET_ARCHIVE, ROUTE_INTRANET_ARCHIVE_FORM, ROUTE_INTRANET_ARCHIVE_DETAIL,   
	ROUTE_INTRANET_MAIN, ROUTE_INTRANET_NOTIFICATION, ROUTE_INTRANET_NOTIFICATION_FORM
} from "../../constants"

const Intranet = lazy(() => import("../../views/intranet"))
const Intranet_doc = lazy(() => import("../../views/intranet/document"))
const Send = lazy(() => import("../../views/intranet/document/send"))
const MailDetails = lazy(() => import("../../views/intranet/document/detail"))
const IntranetMain = lazy(() => import("../../views/intranet/main/IntranetMainList"))
const IntranetAnnouncementList = lazy(() => import("../../views/intranet/announcement/list/AnnouncementList"))
const IntranetAnnouncementForm = lazy(() => import("../../views/intranet/announcement/form/AnnouncementForm"))
const IntranetAnnouncementDetail = lazy(() => import("../../views/intranet/announcement/list/AnnouncementDetail"))
const IntranetArchiveList = lazy(() => import('../../views/intranet/archive/list/ArchiveList'))
const IntranetArchiveForm = lazy(() => import('../../views/intranet/archive/form/ArchiveForm'))
const IntranetArchiveDetail = lazy(() => import('../../views/intranet/archive/list/ArchiveDetail'))
const IntranetNotificationList = lazy(() => import('../../views/intranet/notification/list/NotificationList'))
const IntranetNotificationForm = lazy(() => import('../../views/intranet/notification/form/NotificationForm'))


const IntranetRoutes = [
	
	{
		path: ROUTE_INTRANET,
		element: <Intranet/>
	},
    {
        path: ROUTE_INTRANET_DOCUMENT,
		element: <Intranet_doc/>
    },
	{
		path: ROUTE_INTRANET_SEND,
		element: <Send/>
	},
	{
		path: `${ROUTE_INTRANET_DETAIL}/:id`,
		element: <MailDetails/>
	},
	{
		path:ROUTE_INTRANET_MAIN,
		element:<IntranetMain />
	},
	{
		path: ROUTE_INTRANET_ANNOUNCEMENT,
		element: <IntranetAnnouncementList />
	},
	{
		path: ROUTE_INTRANET_ANNOUNCEMENT_FORM,
		element: <IntranetAnnouncementForm />
	},
	{
		path: `${ROUTE_INTRANET_ANNOUNCEMENT_DETAIL}/:id`,
		element: <IntranetAnnouncementDetail />
	},
	{
		path: ROUTE_INTRANET_ARCHIVE,
		element: <IntranetArchiveList />
	},
	{
		path: ROUTE_INTRANET_ARCHIVE_FORM,
		element: <IntranetArchiveForm />
	},
	{
		path: `${ROUTE_INTRANET_ARCHIVE_DETAIL}/:id`,
		element: <IntranetArchiveDetail />
	},
	{
		path: ROUTE_INTRANET_NOTIFICATION,
		element: <IntranetNotificationList /> 
	},
	{
		path: ROUTE_INTRANET_NOTIFICATION_FORM,
		element: <IntranetNotificationForm />
	}
]
export default IntranetRoutes