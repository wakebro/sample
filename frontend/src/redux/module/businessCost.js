import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	id: null,
	costType: null,
	dataList : [],
	buildingList : [],
	modalIsOpen: null,
	modalPageType: ''
}

const businessCost = createSlice({
	name: 'businessCost',
	initialState,
	reducers: {
		setId: (state, action) => ({
			...state,
			['id']: action.payload
		}),
		setCostType: (state, action) => ({
			...state,
			['costType']: action.payload
		}),
		setDataList: (state, action) => ({
			...state,
			['dataList']: action.payload
		}),
		setBuildingList: (state, action) => ({
			...state,
			['buildingList']: action.payload
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
	, setCostType
	, setDataList
	, setBuildingList
	, setModalIsOpen
	, setModalPageType
} = businessCost.actions
export default businessCost.reducer