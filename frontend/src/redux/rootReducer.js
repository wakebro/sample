// ** Reducers Imports
import layout from "./layout"
import navbar from "./navbar"
// import counter from "./module/testCounter"
// import cart from "./module/testCart"
// import authGroupReducer from "./module/authGroup"
import counter from "./module/testCounterToolkit"
import cart from "./module/testCartToolkit"
import authGroup from "./module/authGroup"
import authMenu from "./module/authMenu"
import authUser from "./module/authUser"
import basicFloor from "./module/basicFloor"
import inspectionPreview from "./module/inspectionPreview"

import basicRoom from "./module/basicRoom"
import basicPnrClass from "./module/basicPnrClass"
import businessCost from "./module/businessCost"
import businessEevaluationItems from "./module/businessEevaluationItems"
import nfc from "./module/nfc"
import nfcWorker from "./module/nfcWorker"
import camera from "./module/camera"
import facility from "./module/facility"
import loginAuth from "./module/loginAuth"
import criticalDisaster from "./module/criticalDisaster"

// counter, cart : Redux Test
const rootReducer = { 
	navbar, 
	layout, 
	counter, 
	cart, 
	authGroup, 
	authMenu, 
	authUser,
	basicFloor,
	basicRoom,
	basicPnrClass,
	businessCost,
	businessEevaluationItems,
	inspectionPreview,
	nfc,
	nfcWorker,
	camera,
	facility,
	loginAuth,
	criticalDisaster
}

export default rootReducer
