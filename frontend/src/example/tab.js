import { Col, Nav, NavItem, NavLink } from "reactstrap"

// <NaviTab tabList={['가','나','다','라','바']} active={active} setActive={setActive}/>
export const NaviTab = (props) => {
	const {tabList, active, setActive} = props
	const toggle = tab => {
		setActive(tab)
	}
	return (
	<Nav pills >
		{tabList !== undefined && tabList.map(function(e) {
		return (
			<NavItem key = {e} >
			<NavLink
				active={active === e}
				onClick={() => {
				toggle(e)
				}}
			>
				{e}
			</NavLink>
		</NavItem>
		)
		})}
	</Nav>
	)
}

export const NaviTabVer2 = (props) => {
	const {tabList, active, setActive} = props
	const toggle = tab => {
		setActive(tab)
	}
	return (
		<Nav tabs justified style={{display:'flex', marginBottom:'0'}}>
			{tabList !== undefined && tabList.map(function(e) {
			return (
				<Col xs={6} md={3} style={{display:'flex'}}>
					<NavItem key = {e} style={{backgroundColor: 'white', borderRadius: '6px 6px 0px 0px'}}>
						<NavLink
							active={active === e}
							onClick={() => {
							toggle(e)
							}}>{e}
						</NavLink>
					</NavItem>
				</Col>
			)
			})}
		</Nav>
	)
}