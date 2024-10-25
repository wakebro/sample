// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components

// ** Reactstrap Imports
import { Col, Row } from 'reactstrap'

// ** Third Party Components

// ** Configs
// import themeConfig from "@configs/themeConfig"

// ** Steps
import AccountDetails from './steps/AccountDetails'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

const RegisterMultiSteps = () => {
  
  // ** Ref
  // ** State
  
  const source = require('@src/assets/images/pages/main.png').default
  console.log(source)

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className="brand-logo d-none d-lg-flex" lg="8" sm="12" to="/" onClick={(e) => e.preventDefault()}>
            {/* <img src={themeConfig.app.title} style={{width:'20%'}} alt="Login Cover" /> */}
        </Link>
        <Col lg='3' className='d-none d-lg-flex align-items-center p-0'>
          {/* style={{backgroundImage: `url("${source}")`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}} */}
          <div className='w-100 d-lg-flex align-items-center justify-content-center h-100' style={{backgroundImage: `url("${source}")`}}>
          </div>
        </Col>
        <Col lg='9' className='d-flex align-items-center auth-bg px-2 px-sm-3 px-lg-5 pt-3'>
        {/* <Col lg='9' className='d-flex align-items-center auth-bg h-100'> */}
          <div className='width-700 mx-auto'>
            <AccountDetails />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default RegisterMultiSteps
