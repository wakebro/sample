import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	buildings: [],
	building: {label:'전체', value:''},
	floors: [],
	floor: {label:'전체', value:''},
	rooms: [],
	pageType: '',
	detailBackUp: null,
	id: null,
	submitResult: false
}

const basicRoom = createSlice({
	name: 'basicRoom',
	initialState,
	reducers: {
		setBuildings: (state, action) => ({
			...state,
			['buildings']: action.payload
		}),
		setBuilding: (state, action) => ({
			...state,
			['building']: action.payload
		}),
		setFloors: (state, action) => ({
			...state,
			['floors']: action.payload
		}),
		setFloor: (state, action) => ({
			...state,
			['floor']: action.payload
		}),
		setRooms: (state, action) => ({
			...state,
			['rooms']: action.payload
		}),
		setPageType: (state, action) => ({
			...state,
			['pageType']: action.payload
		}),
		setDetailBackUp: (state, action) => ({
			...state,
			['detailBackUp']: action.payload
		}),
		setId: (state, action) => ({
			...state,
			['id']: action.payload
		}),
		setSubmitResult: (state, action) => ({
			...state,
			['submitResult']: action.payload
		})
	}
})

export const { setBuildings, setBuilding, setFloors, setFloor, setRooms, setPageType, setDetailBackUp, setId, setSubmitResult } = basicRoom.actions
export default basicRoom.reducer