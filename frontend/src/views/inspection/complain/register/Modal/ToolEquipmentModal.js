import axios from '@utility/AxiosConfig'
import { dataTableClickStyle, getTableData } from '@utils'
import { useEffect, useState } from "react"
import { Button, Col, Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { API_BASICINFO_FACILITY_TOOLEQUIPMENT } from "../../../../../constants"
import AppointmentDataTable from '../../../../basic/employee/appointment/AppointmentDataTable'

const ToolEquipmentModal = (props) => {
    const {open, toggle, property_id, setToolEquipment} = props
    const [rowId, setrowId] = useState(0)
    const [tableData, setTableData] = useState()
    const [searchValue, setSearchValue] = useState('')

    const columns = [
        {
			name: '공구비품코드',
			selector: row => row.code,
            conditionalCellStyles: dataTableClickStyle(rowId),
            width:'70%'
		},
		{
            name: '비품상태',
            conditionalCellStyles: dataTableClickStyle(rowId),
            width:'30%'
		}
	]

    const postSearchData = () => {
        const params = {
            searchValue: searchValue,
            property_id : property_id,
            employee_class_id:''
        }
        axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT, { params })
        .then(response => setTableData(response.data))
        .catch(error => console.error(error))
    }

    const handleSearch = (event) => {
        const value = event.target.value
        setSearchValue(value)
    }

    useEffect(() => getTableData(API_BASICINFO_FACILITY_TOOLEQUIPMENT, {property_id: property_id, employee_class_id:'', searchValue:'' }, setTableData), [])

    const onModalButton = () => {
        toggle()
        const data = tableData.find(item => item.id === rowId)
        if (data !== undefined && data !== null) {
            setToolEquipment({code: data.code, value: data.id})
        }
    }

    return (
        <Modal isOpen={open} toggle={toggle}>
            <ModalHeader className="mb-2">공구비품</ModalHeader>

            <Col className='mb-1' md='6' style={{marginLeft:'5%'}}>
                <InputGroup>
                    <Input 
                    id='search'
                    placeholder='공구비품을 검색해 보세요.'
                    value={searchValue}
                    onChange={handleSearch}/>
                    <Button
                        onClick={postSearchData}
                    >검색
                    </Button>
                </InputGroup>
            </Col>
            <ModalBody style={{padding: 0}}>
                <AppointmentDataTable
                    tableData={tableData}
                    columns={columns}
                    setClick={setrowId}
                />
            </ModalBody>
            <ModalFooter className='mt-1' style={{display:'flex', justifyContent:'end', alignItems:'center', borderTop: '1px solid #B9B9C3'}}>
                <Button color='report' className="mx-1" onClick={() => toggle()}>취소</Button>
                <Button color='primary' onClick={() => onModalButton()}>저장</Button>
            </ModalFooter>
        </Modal>    
    )
}
export default ToolEquipmentModal

