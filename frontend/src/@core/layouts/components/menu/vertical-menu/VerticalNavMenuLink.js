// ** React Imports
import { setProperty } from "@store/module/loginAuth"
import { NavLink } from "react-router-dom"

// ** Third Party Components
import classnames from "classnames"

// ** Reactstrap Imports
import Avatar from "@components/avatar"
import { LogOut, Search } from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import Select from 'react-select'
import { Badge, InputGroup, InputGroupText } from "reactstrap"
import Cookies from 'universal-cookie'
import { ROUTE_LOGIN } from "../../../../../constants"

const VerticalNavMenuLink = ({ item, activeItem, userData }) => {
	// ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
	const properties = userData.properties
	const cookies = new Cookies()
	const loginAuth = useSelector((state) => state.loginAuth)
	const dispatch = useDispatch()
	
	const selectStore = (e) => {
		cookies.remove('property')
		dispatch(setProperty(e))
		cookies.set('property', e, {path:'/'})
		window.location.reload()
	}

	const logout = () => {
		window.location.href = ROUTE_LOGIN
	}


	const LinkTag = item.externalLink ? "a" : NavLink
	let obj
	if (item.id === 'mystores') {
		obj = (
			<div className="my-properties">
                <InputGroup style={{width:'max-content'}}>
                    <InputGroupText>
                        <Search size={15}/>
                    </InputGroupText>
                    <Select
                        className="react-select"
                        classNamePrefix={'select'}
                        onChange={e => selectStore(e)}
                        defaultValue={loginAuth.property}
                        maxMenuHeight={150}
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: base => ({...base, zIndex:9999}),
                            control: base => ({ ...base, borderRadius: '0px', borderTopRightRadius:'0.357rem', borderBottomRightRadius:'0.357rem', width:'180px'}),
                            menuList: base => ({...base, maxHeight:'400px'})
                        }}
                        options={properties}
                    />
                </InputGroup>
			</div>
		)
	} else if (item.id === 'profile') {
		obj = (
			<div className="my-properties" style = {{paddingBottom : '10px'}}>
				<div className="d-flex justify-content-end" style={{marginRight:'10px'}}>
					<div className="user-nav d-flex" style = {{flexDirection:'column', marginRight:'8px'}}>
						<span className="user-name fw-bold" style = {{fontSize:'14px'}}>{userData.username}</span>
						<span className="user-status" style = {{fontSize:'11px'}}>{loginAuth.property.label}</span>
					</div>
					<Avatar className="ms-1 mt-auto" color="primary" content = {userData.username.substring(0, 1).toUpperCase()}/>
				</div>
				<div className="d-flex justify-content-end align-items-center" style = {{marginTop:'10px', cursor:'pointer'}} onClick={logout}>
					<LogOut size={14}/>
					<span style={{marginLeft:'4px'}}>로그아웃</span>
				</div>
			</div>
		)
	} else {
		obj = (
			<LinkTag
					className="d-flex align-items-center"
					target={item.newTab ? "_blank" : undefined}
					/*eslint-disable */
					{...(item.externalLink === true
						? {
								href: item.navLink || "/",
							}
						: {
								to: item.navLink || "/",
								className: ({ isActive }) => {
									if (isActive && !item.disabled) {
										return "d-flex align-items-center active"
									}
								},
							})}
					onClick={(e) => {
						if (
							item.navLink.length === 0 ||
							item.navLink === "#" ||
							item.disabled === true
						) {
							e.preventDefault()
						}
					}}
					>
					
				{item.icon}
				<span className="menu-item text-truncate">{item.title}</span>
		
				{item.badge && item.badgeText ? (
					<Badge className="ms-auto me-1" color={item.badge} pill>
						{item.badgeText}
					</Badge>
				) : null}
				</LinkTag>
		)
	}
	// ** Hooks

	return (
		<li
			className={classnames({
				"nav-item": !item.children,
				disabled: item.disabled,
				active: item.navLink === activeItem
			})}
		>
		{obj}
		</li>
	)
}

export default VerticalNavMenuLink
