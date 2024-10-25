import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Mail, Send, Edit2, Star, Info, Trash } from 'react-feather'
import { Button, ListGroup, ListGroupItem, Badge, CardBody } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { ROUTE_INTRANET_SEND } from "../../../constants"
import { Fragment, useEffect, useState} from 'react'
import { checkOnlyView, primaryColor } from '../../../utility/Utils'
import { useSelector } from 'react-redux'
import { INTRANET_DOCUMENT } from '../../../constants/CodeList'
const Sidebar = ({ onTabChange, sidebarOpen, location }) => {
  const loginAuth = useSelector((state) => state.loginAuth)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState()
  const handleTabClick = (tab) => {
    setActiveTab(tab)
    onTabChange(tab)
  }
  
  useEffect(() => {
    setActiveTab(location)
    onTabChange(location)
}, [location])
useEffect(() => {
  if (activeTab === null) {
    setActiveTab('inbox')
  }
}, [activeTab])
  const handleSendClick = () => {
    navigate(ROUTE_INTRANET_SEND)
  }
  return (
    <Fragment>
     
      <div className={classnames('sidebar-left', {
          show: sidebarOpen
          })}>
        <div className='sidebar' style={{ height: '100%', minHeight:'350px' }}>
          <div className='sidebar-content email-app-sidebar'>
            <div className='email-app-menu'>
            <div className='form-group-compose text-center compose-btn'>
              <Button hidden={checkOnlyView(loginAuth, INTRANET_DOCUMENT, 'available_create')}
                className='compose-email' color='primary' block onClick={handleSendClick} >
                문서 보내기
              </Button>
              </div>
              <PerfectScrollbar className='sidebar-menu-list' options={{ wheelPropagation: false }}>
                <ListGroup tag='div' className='list-group-messages'>
                  <ListGroupItem
                    onClick={() => { handleTabClick('inbox') }}
                    action
                    style={{ cursor: 'pointer', background: activeTab === 'inbox' ? 'initial' : 'initial', color: activeTab === 'inbox' ? primaryColor : '#5E5873', borderLeft: activeTab === 'inbox' ? `2px solid ${primaryColor}` : 'none', borderRadius :'0px'
                  }}
                
                  >
                    <Mail size={18} className='me-75' />
                    <span className='align-middle'>받은문서함</span>
                  </ListGroupItem>
                  <ListGroupItem
                    onClick={() => { handleTabClick('sent') }}
                    action
                    style={{ cursor: 'pointer', background: activeTab === 'sent' ? 'initial' : 'initial', color: activeTab === 'sent' ? primaryColor : '#5E5873', borderLeft: activeTab === 'sent' ? `2px solid ${primaryColor}` : 'none' }}
                  >
                    <Send size={18} className='me-75' />
                    <span className='align-middle'>보낸문서함</span>
                  </ListGroupItem>
                  <ListGroupItem
                    onClick={() => { handleTabClick('star') }}
                    action
                    style={{ cursor: 'pointer', background: activeTab === 'star' ? 'initial' : 'initial', color: activeTab === 'star' ? primaryColor : '#5E5873', borderLeft: activeTab === 'star' ? `2px solid ${primaryColor}` : 'none' }}
                  >
                    <Star size={18} className='me-75' />
                    <span className='align-middle'>중요문서함</span>
                  </ListGroupItem>
                  <ListGroupItem
                    onClick={() => { handleTabClick('trash') }}
                    action
                    style={{ cursor: 'pointer', background: activeTab === 'trash' ? 'initial' : 'initial', color: activeTab === 'trash' ? primaryColor : '#5E5873', borderLeft: activeTab === 'trash' ? `2px solid ${primaryColor}` : 'none', borderRadius :'0px'}}
                  >
                    <Trash size={18} className='me-75' />
                    <span className='align-middle'>휴지통</span>
                  </ListGroupItem>
                </ListGroup>
              </PerfectScrollbar>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
export default Sidebar