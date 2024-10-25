import { lazy } from "react"
import { 
	ROUTE_ENERGY_GAUGE_GROUP,
	ROUTE_ENERGY_GAUGE_GROUP_REGISTER,
	ROUTE_ENERGY_GAUGE_GROUP_DETAIL,
	ROUTE_ENERGY_GAUGE_GROUP_FIX,
	ROUTE_ENERGY_GAUGE_LIST, 
	ROUTE_ENERGY_GAUGE_DETAIL,
	ROUTE_ENERGY_GAUGE_FORM,
	ROUTE_ENERGY_GAUGE_EXAMIN,
	ROUTE_ENERGY_ELECTRIC_REGISTER,
	ROUTE_ENERGY_ELECTRIC_LIST,
	ROUTE_ENERGY_ELECTRIC_ITSS,
	ROUTE_ENERGY_ELECTRIC_TOTAL,
	ROUTE_ENERGY_CODE,
	ROUTE_ENERGY_PURPOSE,
	ROUTE_ENERGY_SOLID,
	ROUTE_ENERGY_SOLID_FORM,
	ROUTE_ENERGY_UTILITIES
} from "../../constants"

const Gauge = lazy(() => import("../../views/energy/Gauge"))
const GaugeRegister = lazy(() => import("../../views/energy/Gauge/Register.js"))
const Gauge_Detail = lazy(() => import("../../views/energy/Gauge/Detail.js"))
const GaugeFix = lazy(() => import("../../views/energy/Gauge/Fix.js"))
const GaugeList = lazy(() => import('../../views/energy/gaugeTemp/GaugeList'))
const GaugeDetail = lazy(() => import('../../views/energy/gaugeTemp/GaugeDetail'))
const GaugeForm = lazy(() => import('../../views/energy/gaugeTemp/GaugeForm'))
const GaugeExamin = lazy(() => import("../../views/energy/GaugeExamin"))
const GaugeExaminChart = lazy(() => import("../../views/energy/GaugeExamin/Chart"))
const GaugeElectricRegister = lazy(() => import("../../views/energy/electric/electricpower/component/ElectricRegister"))
const GaugeElectricList = lazy(() => import("../../views/energy/electric/electriclist/component/ElectricList"))
const GaugeElectricITSS = lazy(() => import("../../views/energy/electric/electricitss/component/ElectricITSS"))
const GaugeElectricTotal = lazy(() => import("../../views/energy/electric/electrictotal/component/ElectricTotal"))
const EnergyCode = lazy(() => import('../../views/energy/basic/EnergyBasicIndex'))
const EnergyPurpose = lazy(() => import('../../views/energy/basic/EnergyPurpose'))
const EnergySolid = lazy(() => import('../../views/energy/solid/list/index'))
const EnergySolidForm = lazy(() => import('../../views/energy/solid/form/SolidForm'))
const UtilitiesManage = lazy(() => import("../../views/energy/utilities/manage/UtilitiesManage"))
const UtilitiesList = lazy(() => import('../../views/energy/utilities/list/UtilitiesList'))
const UtilitiesIDR = lazy(() => import('../../views/energy/utilities/idr/UtilitiesIDR'))

const EnergyRoutes = [
	
	{
		path: ROUTE_ENERGY_GAUGE_GROUP,
		element: <Gauge/>
	},
	{
		path: ROUTE_ENERGY_GAUGE_GROUP_REGISTER,
		element: <GaugeRegister/>
	},
	{
		path:`${ROUTE_ENERGY_GAUGE_GROUP_DETAIL}/:id`,
		element: <Gauge_Detail/>
	},
	{
		path:`${ROUTE_ENERGY_GAUGE_GROUP_FIX}/:id`,
		element: <GaugeRegister/>
	},
	{
		path: ROUTE_ENERGY_GAUGE_LIST,
		element: <GaugeList/>
	},
	{
		path: `${ROUTE_ENERGY_GAUGE_DETAIL}/:id`,
		element: <GaugeDetail />
	},
	{
		path: ROUTE_ENERGY_GAUGE_FORM,
		element: <GaugeForm />
	},
	{
		path: `${ROUTE_ENERGY_GAUGE_EXAMIN}/:part`,
		element: <GaugeExamin/>
	},
	{
		path: `${ROUTE_ENERGY_GAUGE_EXAMIN}/chart`,
		element: <GaugeExaminChart/>
	},
	{
		path: ROUTE_ENERGY_ELECTRIC_REGISTER,
		element: <GaugeElectricRegister/>
	},
	{
		path: ROUTE_ENERGY_ELECTRIC_LIST,
		element: <GaugeElectricList/>
	},
	{
		path: ROUTE_ENERGY_ELECTRIC_ITSS,
		element: <GaugeElectricITSS/>
	},
	{
		path: ROUTE_ENERGY_ELECTRIC_TOTAL,
		element: <GaugeElectricTotal/>
	},
	{
		path: `${ROUTE_ENERGY_CODE}/:typecode`,
		element: <EnergyCode />
	},
	{
		path: ROUTE_ENERGY_PURPOSE,
		element: <EnergyPurpose />
	},
	{
		path: `${ROUTE_ENERGY_UTILITIES}/manage`,
		element: <UtilitiesManage/>
	},
	{
		path: `${ROUTE_ENERGY_UTILITIES}/list`,
		element: <UtilitiesList/>
	},
	{
		path: `${ROUTE_ENERGY_UTILITIES}/idr`,
		element: <UtilitiesIDR/>
	},
	{
		path: `${ROUTE_ENERGY_SOLID}/:page`,
		element: <EnergySolid />
	},
	{
		path: ROUTE_ENERGY_SOLID_FORM,
		element: <EnergySolidForm />
	}
] 
export default EnergyRoutes