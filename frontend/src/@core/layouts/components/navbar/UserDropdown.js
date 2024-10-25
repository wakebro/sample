// ** React Imports
import { Link } from "react-router-dom"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power
} from "react-feather"

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from "reactstrap"
import { ROUTE_LOGIN } from "../../../../constants"

// ** Default Avatar Image
// import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg"

const UserDropdown = (props) => {
  const { userData } = props
  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">{userData.username}</span>
          <span className="user-status">{userData.shopName}</span>
        </div>
        <Avatar
          color="primary"
          content={userData.username.toUpperCase().substring(0, 2)}/>
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to={ROUTE_LOGIN}>
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
