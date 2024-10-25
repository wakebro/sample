import BasicInfo from "./BasicInfo"
import Dashboard from "./Dashboard"
import SystemMgmt from "./SystemMgmt"
import Intranet from "./Intranet"
import Inspection from "./Inspection"
import Education from "./Education"
import Report from "./Report"
import Energy from "./Energy"
import FacilityMgmt from "./FacilityMgmt"
import BusinessMgmt from "./BusinessMgmt"
import Schedule from "./Schedule"
import CriticalDisaster from "./CriticalDisaster"

export default [
	{
		id:"profile",
		title:"Profile",
		navLink: '#',
		storeType:'all'
		// franchiseOnly:false
	},
	{
		id:"mystores",
		title:"Store",
		navLink: '#',
		storeType:'all'
		// franchiseOnly:false
	},
	...Dashboard,
	...Intranet,
	...Schedule,
	...BasicInfo,
	...FacilityMgmt,
	...CriticalDisaster,
	...Inspection,
	...Report,
	...Education,
	...Energy,
	...BusinessMgmt,
	...SystemMgmt
]
