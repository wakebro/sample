// ** React Imports
import { Suspense, useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout"

// ** Menu Items Array
import navigation from "@src/navigation/vertical"
import { setIsManager, setMenuList, setProperty } from "@store/module/loginAuth"
import { useDispatch } from "react-redux"
import Cookies from 'universal-cookie'
import { IS_AUTH, ROUTE_LOGIN } from "../constants"
import { FACILITY_NFC_LIST, FACILITY_NFC_SCAN } from "../constants/CodeList"
import axios from "../utility/AxiosConfig"
function firstMenuFilter(menuList) {
	const tempList = []
	// 웹에서 불필요한 메뉴일 경우 제외
	if (!window.navigator.userAgent.includes('work_app')) {
		menuList.map(menu => {
			if (menu.code !== FACILITY_NFC_SCAN && menu.code !== FACILITY_NFC_LIST) tempList.push(menu)
		})
	// 앱에서 불필요한 메뉴일 경우 제외
	} else menuList.map(menu => tempList.push(menu))
	return tempList
}

const filterRecursive = (menus) => {
	const result = []
	menus.forEach((menu) => {
		let tempMenu = null
		if (menu.appExpose) {
			tempMenu = {...menu}
			if (menu.children && menu.children.length > 0) {
				const filterChildren = filterRecursive(menu.children)
				tempMenu.children = filterChildren
			}
			result.push(tempMenu)
		}
	})
	return result
}

const VerticalLayout = (props) => {
	// const [menuData, setMenuData] = useState([])
	
	// ** For ServerSide navigation
	// useEffect(() => {
	//     axios.get(URL).then(response => setMenuData(response.data))
	// }, [])

	const [userData, setUserData] = useState(null)
	const [menuData, setMenuData] = useState([])
	const [auth, setAuth] = useState([])
	const cookies = new Cookies()
	const dispatch = useDispatch()
	function isAuth() {
		axios.get(IS_AUTH)
		.then(response => {
			dispatch(setMenuList(firstMenuFilter(response.data['authorities'])))
			dispatch(setIsManager(response.data['isManager'] || response.data['isManager'] === 'true'))
			cookies.set('authorities', response.data['authorities'])
			cookies.set('username', response.data['user'])
			cookies.set('userId', response.data['userId'])
			cookies.set('isAdmin', response.data['isAdmin'])
			cookies.set('isManager', response.data['isManager'])
			cookies.set('startUrl', response.data['startUrl'])

			if (response.data['properties'].length > 1) {
				cookies.set('propertiesLength', response.data['properties'].length)
			}

			if (cookies.get('property') === undefined) cookies.set('property', response.data['properties'][0], {path:'/'})
			let result = navigation.filter(item => { return item })
			if (window.navigator.userAgent.includes('work_app')) {
				result = filterRecursive(result)
			}
			setMenuData(result)

			setAuth(response.data['authorities'])

			setUserData({
				username: response.data['user'],
				properties: response.data['properties']
			})
		}).catch(() => {
			window.location.href = ROUTE_LOGIN
		})
	}

	useEffect(() => isAuth(), [])

	useEffect(() => {
		dispatch(setProperty(cookies.get('property')))
	}, [cookies.get('property')])
	
	return (userData) ? (
	<Layout menuData={menuData} userData={userData} auth={auth} {...props}>
		<Outlet />
	</Layout>
	) : (<Suspense fallback={null}></Suspense>)
}

export default VerticalLayout
