import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	id: null,
	dataList : [],
	buildingList : [],
	floorList : [],
	roomList : [],
	modalIsOpen: null,
	modalPageType: ''
}

const nfc = createSlice({
	name: 'nfc',
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
		setModalIsOpen: (state, action) => ({
			...state,
			['modalIsOpen']: action.payload
		}),
		setModalPageType: (state, action) => ({
			...state,
			['modalPageType']: action.payload
		})
	}
})

export const { 
	setId
	, setDataList
	, setBuildingList
	, setFloorList
	, setRoomList
	, setModalIsOpen
	, setModalPageType
} = nfc.actions
export default nfc.reducer