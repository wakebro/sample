// ** Dropdowns Imports
import UserDropdown from "./UserDropdown"

const NavbarUser = (props) => {
  const { userData } = props
  return (
    <ul className="nav navbar-nav align-items-center ms-auto">
      <UserDropdown userData={userData} />
    </ul>
  )
}
export default NavbarUser
