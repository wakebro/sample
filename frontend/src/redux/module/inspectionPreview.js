import { createSlice } from "@reduxjs/toolkit"

const initialState = { 
	// progress: false,
	// authMenuTabList: [],
	// list: []
	name : '',
	employeeClass : '',
	type : '',
	discription : '',
	building : '',
	buildingLocation : '',
	buildingUse : '',
	section : [],
	formId : '',
	reportType: '',
	signList : []

}

const inspectionPreview = createSlice({
	name: 'inspectionPreview',
	initialState,
	reducers: {
		setName: (state, action) => ({
			...state,
			name : action.payload
		}),
		setEmployeeClass: (state, action) => ({
			...state,
			employeeClass : action.payload
		}),
		setType: (state, action) => ({
			...state,
			type : action.payload
		}),
		setDiscription: (state, action) => ({
			...state,
			discription : action.payload
		}),
		setBuilding: (state, action) => ({
			...state,
			building : action.payload
		}),
		setBuildingLocation: (state, action) => ({
			...state,
			buildingLocation : action.payload
		}),
		setBuildingUse: (state, action) => ({
			...state,
			buildingUse : action.payload
		}),
		setSection: (state, action) => ({
			...state,
			section : action.payload
		}),
		setFormId: (state, action) => ({
			...state,
			formId : action.payload
		}),
		setReportType: (state, action) => ({
			...state,
			reportType : action.payload
		}),
		setSignList: (state, action) => ({
			...state,
			signList : action.payload
		})
		
	}
})

export const { setName, setEmployeeClass, setType, setDiscription, setBuilding, setBuildingLocation, setBuildingUse, setSection, setFormId, setReportType, setSignList } = inspectionPreview.actions

export default inspectionPreview.reducer
