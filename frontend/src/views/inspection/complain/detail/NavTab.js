import { Col, Nav, NavItem, NavLink } from "reactstrap"

const NavTab = (props) => {
	const {tabList, active, setActive} = props
	const toggle = tab => {
		setActive(tab)
	}
	return (
		<Nav tabs justified style={{display:'flex', marginBottom:'0', width:'100%'}}>
			{tabList !== undefined && tabList.map((e, idx) => {
			return (
				<Col key={idx} xs={3} sm={3} md={3} lg={3}  style={{display:'flex'}}>
					<NavItem style={{backgroundColor: 'white', borderRadius: '6px 6px 0px 0px'}}>
						<NavLink
							style={{letterSpacing: '0px', wordBreak: 'keep-all'}}
							active={active === e.value}
							onClick={() => {
							toggle(e.value)
							}}>{e.label}
						</NavLink>
					</NavItem>
				</Col>
			)
			})}
		</Nav>
	)
}

export default NavTab