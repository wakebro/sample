import { createSlice } from "@reduxjs/toolkit"

const initialState = { 
	isOpen: false, 
	id: null,
	name: '',
	auths: [],
	auth: {label: '권한을 선택해주세요.', value: null},
	defaultAuth: {label: '권한을 선택해주세요.', value: null}
}

const authUserSlice = createSlice({
	name: 'authUser',
	initialState,
	reducers: {
		setIsOpen: (state, action) => ({
			...state,
			['isOpen']:action.payload
		}), 
		setId: (state, action) => ({
			...state,
			['id']:action.payload
		}),
		setName: (state, action) => ({
			...state,
			['name']:action.payload
		}),
		setAuths: (state, action) => ({
			...state,
			['auths']: action.payload
		}),
		setAuth: (state, action) => ({
			...state,
			['auth']: action.payload
		})
	}
})

export const { 
	setIsOpen,
	setId,
	setName,
	setAuths,
	setAuth 
} = authUserSlice.actions

export default authUserSlice.reducer
