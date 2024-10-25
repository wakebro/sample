import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	id: null,
	tabName: '',
	logList : [],
	pageType: '',
	logModalIsOpen: null,
	facilityMaterialModalIsOpen: null,
	modalType: '',
	rowInfo: null,
	load: false
}

const facility = createSlice({
	name: 'facility',
	initialState,
	reducers: {
		setId: (state, action) => ({
			...state,
			['id']: action.payload
		}),
		setTabName: (state, action) => ({
			...state,
			['tabName']: action.payload
		}),
		setLogList: (state, action) => ({
			...state,
			['logList']: action.payload
		}),
		setPageType: (state, action) => ({
			...state,
			['pageType']: action.payload
		}),
		setLogModalIsOpen: (state, action) => ({
			...state,
			['logModalIsOpen']: action.payload
		}),
		setFacilityMaterialModalIsOpen: (state, action) => ({
			...state,
			['facilityMaterialModalIsOpen']: action.payload
		}),
		setModalType: (state, action) => ({
			...state,
			['modalType']: action.payload
		}),
		setRowInfo: (state, action) => ({
			...state,
			['rowInfo']: action.payload
		}),
		setLoad: (state, action) => ({
			...state,
			['load']: action.payload
		})
	}
})

export const { 
	setId
	, setTabName
	, setLogList
	, setPageType
	, setLogModalIsOpen
	, setFacilityMaterialModalIsOpen
	, setModalType
	, setRowInfo
	, setLoad
} = facility.actions
export default facility.reducer