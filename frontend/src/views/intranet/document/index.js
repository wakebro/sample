import { Fragment, useEffect, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Mails from './Mails'
import Sidebar from './Sidebar'
import {Card, CardBody, Col, Row, Button} from "reactstrap"
import { API_DOC_MAILBOX, ROUTE_INTRANET_DETAIL} from "../../../constants"
import axios from '../../../utility/AxiosConfig'
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import Cookies from "universal-cookie"
import '@styles/react/apps/app-email.scss'
import classnames from 'classnames'
import { useLocation } from 'react-router-dom'
import {pickerDateNullChange} from "@utils"

const Intranet_doc = () => {
  useAxiosIntercepter()
  const [selectedTab, setSelectedTab] = useState()
  const [data, setData] = useState()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [total_Count,  setTotalCount] = useState(0)
  const cookies = new Cookies()
  const userid = cookies.get('userId')
  const currentpage = currentPage + 1
  const location = useLocation()
  const [picker, setPicker] = useState([])
  
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const TabChange = () => {
    if (selectedTab !== undefined) {
      setData([])
      axios.get(API_DOC_MAILBOX, { params: {page: currentpage, userid: userid, selectedTab: selectedTab, picker: pickerDateNullChange(picker)} })
      .then((response) => {
        setData(response.data.tableData)
        setTotalCount(response.data.total_count)
      })
      .catch(error => {
        // 응답 실패 시 처리
        console.error(error)// 에러 메시지
      })
    }
  }


  const StarClicked = (row) => {
    const {id} = row
    const formData = new FormData()
    formData.append('userid', userid)
    formData.append('id', id)
      axios.put(API_DOC_MAILBOX, formData)
        .then(() => { 
          TabChange()
        })
        .catch(error => {
          // 응답 실패 시 처리
          console.error(error)// 에러 메시지
        }) 
  }

  useEffect(() => {
    if (selectedTab === null) {
      setSelectedTab('inbox')
    }
    TabChange()
  
  }, [selectedTab, currentPage, location])
  
return (
    <Fragment>
    <Row>
      <div className='d-flex justify-content-start'>
        <Breadcrumbs breadCrumbTitle='문서함' breadCrumbParent='인트라넷' breadCrumbActive='문서함'/>
      </div>
    </Row>
    <Card style={{ minHeight: '350px' }}>
    <div className='d-flex justify-space-between'>
          <Sidebar
            onTabChange={setSelectedTab}
            sidebarOpen={sidebarOpen}
            location={location.state}
          />
      <div className='content-right' style={{ height:'100%', minHeight: '350px' }}>
        <div className='content-body'>
          <div
            className={classnames('body-content-overlay', {show: sidebarOpen })}
            onClick={() => setSidebarOpen(false)}></div>
            <Mails 
              datas={data}
              selectedTab={selectedTab}
              StarClick={StarClicked}
              setData={setData}
              setCurrentPage= {setCurrentPage}
              currentPage={currentPage}
              handleToggleSidebar={handleToggleSidebar}
              userid={userid}
              total_Count={total_Count}
              detailAPI={ROUTE_INTRANET_DETAIL}
              TabChange={TabChange}
              picker={picker}
              setPicker={setPicker}
            />
        </div>
      </div>  
    </div>
    </Card>
  </Fragment>
  )
}
export default Intranet_doc