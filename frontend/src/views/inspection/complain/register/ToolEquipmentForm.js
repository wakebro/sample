import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useAxiosIntercepter } from "@utility/hooks/useAxiosInterceptor"
import { sweetAlert } from '@utils'
import { Fragment, useState } from "react"
import Flatpickr from 'react-flatpickr'
import { Button, Card, CardBody, Col, Input, Row } from 'reactstrap'
import CustomDataTable from "../../../basic/facility/CustomDataTable"
import { columns } from "../../data"
import ToolEquipmentModal from "../register/Modal/ToolEquipmentModal"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import { setStringDate } from '../../../../utility/Utils'

const ToolEquipmentForm = (props) => {
  useAxiosIntercepter()
  const { property_id, toolequipment, setToolEquipment, workToolDate, setWorkToolDate,
    useHistory, setUseHistory, tableData, setTableData, dataCount, setDataCount
  } = props

  const [tableSelect, setTableSelect] = useState([])

  const PlusTableData = () => {
    if (toolequipment.code === '') {
      sweetAlert('', '공구비품 정보를 등록 해주세요', 'warning', 'center')
      return false
    }
    if (workToolDate === '') {
      sweetAlert('', '사용일시를 등록 해주세요', 'warning', 'center')
      return false
    }
    const newData = { id: dataCount, toolequipment: toolequipment, workToolDate: workToolDate, useHistory: useHistory  }
    const updatedTableData = [...tableData, newData]
    setTableData(updatedTableData)
    setDataCount(dataCount - 1)
    setToolEquipment({ code: '', value: '' })
    setWorkToolDate('')
    setUseHistory('')
    // setValue 할 예정
  }

  const DeleteTableData = () => {
    if (tableSelect.length !== 0) {
      const selectedIds = tableSelect.map(item => item.id)
      const updatedTableData = tableData.filter(item => !selectedIds.includes(item.id))
      setTableData(updatedTableData)
    }
  }

const [modal, setModal] = useState(false)
const toggle = () => setModal(!modal)

  return (
  <Fragment>
    <Card className="mt-1 mb-15" style={{marginBottom:'80px'}}>
      <Col className="custom-card-header">
          <div className="custom-create-title">공구비품 정보</div>
      </Col>
      <hr/>
      <CardBody>
      <Row className='mb-1' style={{alignItems:'center'}}>
        <Col md='6' xs='12'>
          <Row style={{alignItems:'center'}}>
            <Col className='card_table col text center' xs='2'>
              공구비품&nbsp;
              <div className='essential_value'/>
            </Col>
            <Col xs='10'>
              <Row>
                <Col xs='7' md='9'>
                  <Input
                  placeholder="공구비품을 검색해 주세요"
                  value={toolequipment.code}
                  disabled={true}
                  />
                </Col>
                <Col xs='3'>
                  <Button color="white" style={{borderColor:'gray', whiteSpace: 'nowrap', justifyContent:'end'}} onClick={toggle}>검색</Button>
                </Col>
                <ToolEquipmentModal
                property_id = {property_id}
                open = {modal}
                toggle = {toggle}
                setToolEquipment = {setToolEquipment}
                />
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mb-1" style={{alignItems:'center'}}>
        <Col md='6' xs='12'>
          <Row style={{alignItems:'center'}}>
            <Col className='card_table col text center' xs='2'>
              사용일시&nbsp;
              <div className='essential_value'/>
            </Col>
            <Col xs='10'>
                <Flatpickr
                  id='range-picker'
                  className='form-control'
                  placeholder="2023/03/23 1:30PM"
                  value={workToolDate}
                  onChange={(data) => {
                      const newData = setStringDate(data, true)
                      setWorkToolDate(newData)
                  }}
                  options = {{
                      enableTime: true,
                      dateFormat: "Y-m-d H:i",
                      locale: Korean
                  }}
                    />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className='mb-1' style={{alignItems:'center'}}>
        <Col md='6' xs='12'>
          <Row style={{alignItems:'center'}}>
            <Col className='card_table col text center' xs='2'>
              사용내역
            </Col>
            <Col xs='10'>
                <Input
                value={useHistory}
                onChange={(e) => setUseHistory(e.target.value)}
                />               
            </Col>
          </Row>
        </Col>
      </Row>
      <hr/>
      <Row>
      <div className='d-flex justify-content-end mb-1'>
        <Button color="white" style={{borderColor: 'gray', whiteSpace:'nowrap'}} onClick={() => { PlusTableData() }} >추가 </Button>
        <Button color="white" style={{borderColor: 'gray', whiteSpace:'nowrap', marginLeft:'1%'}} onClick={() => { DeleteTableData() }} >삭제 </Button>  
      </div>
      </Row>
      <Row >
      <CustomDataTable
          tableData={tableData}
          columns={columns.toolEquipment}
          setTableSelect={setTableSelect}
          selectType = {true}
          />
      </Row>
      </CardBody>
    </Card>
</Fragment>
)
}


export default ToolEquipmentForm