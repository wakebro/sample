import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	id: null,
	dataList : [],
	buildingList : [],
	floorList : [],
	roomList : [],
	contactList : [],
	managerList : [],
	modalIsOpen: null,
	modalPageType: '',
	load: false
}

const camera = createSlice({
	name: 'camera',
	initialState,
	reducers: {
		setId: (state, action) => ({
			...state,
			['id']: action.payload
		}),
		setDataList: (state, action) => ({
			...state,
			['dataList']: action.payload
		}),
		setBuildingList: (state, action) => ({
			...state,
			['buildingList']: action.payload
		}),
		setFloorList: (state, action) => ({
			...state,
			['floorList']: action.payload
		}),
		setRoomList: (state, action) => ({
			...state,
			['roomList']: action.payload
		}),
		setContactList: (state, action) => ({
			...state,
			['contactList']: action.payload
		}),
		setManagerList: (state, action) => ({
			...state,
			['managerList']: action.payload
		}),
		setModalIsOpen: (state, action) => ({
			...state,
			['modalIsOpen']: action.payload
		}),
		setModalPageType: (state, action) => ({
			...state,
			['modalPageType']: action.payload
		}),
		setLoad: (state, action) => ({
			...state,
			['load']: action.payload
		})
	}
})

export const { 
	setId
	, setDataList
	, setBuildingList
	, setFloorList
	, setRoomList
	, setContactList
	, setManagerList
	, setModalIsOpen
	, setModalPageType
	, setLoad
} = camera.actions
export default camera.reducer