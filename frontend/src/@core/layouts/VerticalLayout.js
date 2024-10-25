// ** React Imports
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

// ** Store & Actions
import {
	handleContentWidth,
	handleMenuCollapsed,
	handleMenuHidden
} from "@store/layout"
import { useDispatch, useSelector } from "react-redux"

// ** Third Party Components
import classnames from "classnames"
import { ArrowUp } from "react-feather"
import Cookies from 'universal-cookie'

// ** Reactstrap Imports
import { Button, Navbar } from "reactstrap"

// ** Configs
import themeConfig from "@configs/themeConfig"

// ** Custom Components

import Customizer from "@components/customizer"
import ScrollToTop from "@components/scrolltop"
import FooterComponent from "./components/footer"
import SidebarComponent from "./components/menu/vertical-menu"
import NavbarComponent from "./components/navbar"

// ** Custom Hooks
import { useFooterType } from "@hooks/useFooterType"
import { useLayout } from "@hooks/useLayout"
import { useNavbarColor } from "@hooks/useNavbarColor"
import { useNavbarType } from "@hooks/useNavbarType"
import { useRTL } from "@hooks/useRTL"
import { useSkin } from "@hooks/useSkin"

// ** Styles
import "@styles/base/core/menu/menu-types/vertical-menu.scss"
import "@styles/base/core/menu/menu-types/vertical-overlay-menu.scss"
import { ROUTE_DASHBOARD } from "../../constants"

const VerticalLayout = (props) => {
	const cookies = new Cookies()
	// ** Props
	const { menu, navbar, footer, children, menuData, userData, auth } = props
	
	// ** Hooks
	const [isRtl, setIsRtl] = useRTL()
	const { skin, setSkin } = useSkin()
	const { navbarType, setNavbarType } = useNavbarType()
	const { footerType, setFooterType } = useFooterType()
	const { navbarColor, setNavbarColor } = useNavbarColor()
	const { layout, setLayout, setLastLayout } = useLayout()

	// ** States
	const [isMounted, setIsMounted] = useState(false)
	const [menuVisibility, setMenuVisibility] = useState(false)
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)

	// ** Vars
	const dispatch = useDispatch()
	const layoutStore = useSelector((state) => state.layout)

	// ** Update Window Width
	const handleWindowWidth = () => {
		setWindowWidth(window.innerWidth)
	}

	// ** Vars
	const location = useLocation()
	const isHidden = layoutStore.menuHidden
	const contentWidth = layoutStore.contentWidth
	const menuCollapsed = layoutStore.menuCollapsed

	// ** Toggles Menu Collapsed
	const setMenuCollapsed = (val) => dispatch(handleMenuCollapsed(val))

	// ** Handles Content Width
	const setContentWidth = (val) => dispatch(handleContentWidth(val))

	// ** Handles Content Width
	const setIsHidden = (val) => dispatch(handleMenuHidden(val))

	useEffect(() => {
		let nowLocation = null
		auth.map((auth) => {
			if (window.location.pathname === auth.url) {
				nowLocation = auth
			}
		})

		// 권한이 변경되었을 경우
		if (nowLocation !== null) {
			// 상위 주소 권한까지 확인
			if (nowLocation.available_read) {
				const urls = nowLocation.url.split('/')
				urls.shift() // 공백 제거
				urls.pop() // 현재 위치의 주소 제거

				let checkUrl = ''
				urls.map(url => {
					checkUrl += `/${url}`
					auth.map(auth => {
						if (auth.url === checkUrl && !auth.available_read) {
							window.location.href = cookies.get('startUrl')
						}
					})
				})
			} else {
				window.location.href = cookies.get('startUrl')
			}
		} 
	}, [])

	//** This function will detect the Route Change and will hide the menu on menu item click
	useEffect(() => {
		if (menuVisibility && windowWidth < 1200) {
			setMenuVisibility(false)
		}
	}, [location])

	//** Sets Window Size & Layout Props
	useEffect(() => {
		if (window !== undefined) {
			window.addEventListener("resize", handleWindowWidth)
		}
	}, [windowWidth])

	//** ComponentDidMount
	useEffect(() => {
		setIsMounted(true)
		return () => setIsMounted(false)
	}, [])

	// ** Vars
	const footerClasses = {
		static: "footer-static",
		sticky: "footer-fixed",
		hidden: "footer-hidden"
	}

	const navbarWrapperClasses = {
		floating: "navbar-floating",
		sticky: "navbar-sticky",
		static: "navbar-static",
		hidden: "navbar-hidden"
	}

	const navbarClasses = {
		floating:
			contentWidth === "boxed" ? "floating-nav container-xxl" : "floating-nav",
		sticky: "fixed-top",
		static: "navbar-static-top",
		hidden: "d-none"
	}

	const bgColorCondition =
		navbarColor !== "" && navbarColor !== "light" && navbarColor !== "white"

	if (!isMounted) {
		return null
	}
	return (
		<div
			className={classnames(
				`wrapper vertical-layout ${
					navbarWrapperClasses[navbarType] || "navbar-floating"
				} ${footerClasses[footerType] || "footer-static"}`,
				{
					// Modern Menu
					"vertical-menu-modern": windowWidth >= 1200,
					"menu-collapsed": menuCollapsed && windowWidth >= 1200,
					"menu-expanded": !menuCollapsed && windowWidth > 1200,

					// Overlay Menu
					"vertical-overlay-menu": windowWidth < 1200,
					"menu-hide": !menuVisibility && windowWidth < 1200,
					"menu-open": menuVisibility && windowWidth < 1200
				}
			)}
			{...(isHidden ? { "data-col": "1-column" } : {})}
		>
			{!isHidden ? (
				<SidebarComponent
					skin={skin}
					menu={menu}
					menuData={menuData}
					menuCollapsed={menuCollapsed}
					menuVisibility={menuVisibility}
					setMenuCollapsed={setMenuCollapsed}
					setMenuVisibility={setMenuVisibility}
					userData={userData}
				/>
			) : null}

			<Navbar
				expand="lg"
				style={{zIndex : 999}}
				container={false}
				light={skin !== "dark"}
				dark={skin === "dark" || bgColorCondition}
				color={bgColorCondition ? navbarColor : undefined}
				className={classnames(
					`header-navbar navbar align-items-center ${
						navbarClasses[navbarType] || "floating-nav"
					} navbar-shadow`
				)}
			>
				<div className="navbar-container d-flex content" style={{zIndex : 999}}>
					{navbar ? (
						navbar({ skin, setSkin, setMenuVisibility, userData })
					) : (
						<NavbarComponent
							setMenuVisibility={setMenuVisibility}
							skin={skin}
							setSkin={setSkin}
							userData={userData}
						/>
					)}
				</div>
			</Navbar>
			{children}

			{/* Vertical Nav Menu Overlay */}
			<div
				className={classnames("sidenav-overlay", {
					show: menuVisibility
				})}
				onClick={() => setMenuVisibility(false)}
			></div>
			{/* Vertical Nav Menu Overlay */}

			{themeConfig.layout.customizer === true ? (
				<Customizer
					skin={skin}
					isRtl={isRtl}
					layout={layout}
					setSkin={setSkin}
					setIsRtl={setIsRtl}
					isHidden={isHidden}
					setLayout={setLayout}
					footerType={footerType}
					navbarType={navbarType}
					setIsHidden={setIsHidden}
					themeConfig={themeConfig}
					navbarColor={navbarColor}
					contentWidth={contentWidth}
					setFooterType={setFooterType}
					setNavbarType={setNavbarType}
					setLastLayout={setLastLayout}
					menuCollapsed={menuCollapsed}
					setNavbarColor={setNavbarColor}
					setContentWidth={setContentWidth}
					setMenuCollapsed={setMenuCollapsed}
				/>
			) : null}
			<footer
				className={classnames(
					`footer footer-light ${footerClasses[footerType] || "footer-static"}`,
					{
						"d-none": footerType === "hidden"
					}
				)}
			>
				{footer ? (
					footer
				) : (
					<FooterComponent
						footerType={footerType}
						footerClasses={footerClasses}
					/>
				)}
			</footer>

			{themeConfig.layout.scrollTop === true ? (
				<div className="scroll-to-top">
					<ScrollToTop showOffset={300} className="scroll-top d-block">
						<Button className="btn-icon" color="primary">
							<ArrowUp size={14} />
						</Button>
					</ScrollToTop>
				</div>
			) : null}
		</div>
	)
}

export default VerticalLayout
