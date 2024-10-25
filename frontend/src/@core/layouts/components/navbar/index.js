/* eslint-disable */
// ** React Imports
import { Fragment, useState } from "react"

// ** Custom Components

// ** Third Party Components
import { Menu, Moon, Search, Sun } from "react-feather"

// ** Reactstrap Imports
import Select from 'react-select'
import { Col, InputGroup, InputGroupText, NavItem, NavLink } from "reactstrap"
import Cookies from 'universal-cookie'


const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility, userData } = props

  const properties = userData.properties
  const cookies = new Cookies()
  const [currentStore, setCurrentStore] = useState(cookies.get('property'))
  

  const selectStore = (e) => {
    cookies.remove('property')
    setCurrentStore(e)
    cookies.set('property', e, {path:'/'})
    window.location.reload()
  }

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
      return <Sun className="ficon" onClick={() => setSkin("light")} />
    } else {
      return <Moon className="ficon" onClick={() => setSkin("dark")} />
    }
  }

  return (
    <Fragment>
      <div className="bookmark-wrapper d-flex align-items-center" style={{width:'100%'}}>
        <Col xs={2}>
            <ul className="navbar-nav d-xl-none">
                <NavItem className="mobile-menu me-auto">
                    <NavLink
                        className="nav-menu-main menu-toggle hidden-xs is-active"
                        onClick={() => setMenuVisibility(true)}>
                        <Menu className="ficon" />
                    </NavLink>
                </NavItem>
            </ul>
        </Col>
        <Col xs={10} style={{display:'flex', flexDirection:'row-reverse'}}>
            <div>
                <InputGroup>
                    <InputGroupText>
                        <Search size={14} />
                    </InputGroupText>
                    <Select
                        styles={{ 
                            control: base => ({ ...base, borderRadius: '0px', borderTopRightRadius:'0.357rem', borderBottomRightRadius:'0.357rem', width:'200px'}),
                            menuList: base => ({ ...base, height:'350px'})
                        }}
                        className="react-select"
                        classNamePrefix={'select'}
                        onChange={e => selectStore(e)}
                        defaultValue={currentStore}
                        options={properties}
                    />
                </InputGroup>
            </div>
        </Col>
        
        {/* <NavItem className="d-none d-lg-block">
          <NavLink className="nav-link-style">
            <ThemeToggler />
          </NavLink>
        </NavItem> */}
      </div>
      {/* <NavbarUser skin={skin} setSkin={setSkin} userData={userData} /> */}
    </Fragment>
  )
}

export default ThemeNavbar
