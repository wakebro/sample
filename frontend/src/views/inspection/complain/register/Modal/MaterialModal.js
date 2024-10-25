import { dataTableClickStyle, getTableData } from '@utils'
import axios from "axios"
import { useEffect, useState } from "react"
import Select from 'react-select'
import {
    Button,
    Col,
    Input, InputGroup, Modal,
    ModalBody, ModalFooter, ModalHeader,
    Row
} from 'reactstrap'
import { API_EMPLOYEE_CLASS_LIST, API_GET_MATERIAL } from "../../../../../constants"
import AppointmentDataTable from '../../../../basic/employee/appointment/AppointmentDataTable'
import { getTableDataCallback } from '../../../../../utility/Utils'

const MaterialModal = (props) => {
    const {open, toggle, property_id, setMaterial} = props
    const [rowId, setrowId] = useState(0)
    const [tableData, setTableData] = useState()
    const [searchValue, setSearchValue] = useState('')
    const [employee_class, setEmployeeClass] = useState({label: '전체', value: ''})
    const [classList, setClassList] = useState([{label: '전체', value: ''}])

    const columns = [
        {
            name: '직종',
            cell: row => row.employee_class,
            conditionalCellStyles: dataTableClickStyle(rowId),
            width: '80px'
        }, {
            name: '자재코드',
            cell: row => row.material_code,
            conditionalCellStyles: dataTableClickStyle(rowId),
            midWidth: '120px'
        }, {
            name: '규격',
            cell: row => row.capacity,
            conditionalCellStyles: dataTableClickStyle(rowId),
            width: '80px'
        }, {
            name: '모델',
            cell: row => row.model_no,
            conditionalCellStyles: dataTableClickStyle(rowId),
            minWidth: '100px'
        }, {
            name: '재고수량',
            cell: row => (row?.stock?.toLocaleString('ko-KR') ?? 0),
            conditionalCellStyles: dataTableClickStyle(rowId)
        }, {
            name: '단위',
            cell: row => row.unit,
            conditionalCellStyles: dataTableClickStyle(rowId),
            width: '80px'
        }
    ]

    const postSearchData = () => {
        const params = {
            search: searchValue,
            property_id: property_id,
            employeeClass: employee_class.value
        }
        axios.get(API_GET_MATERIAL, {params})
        .then(response => setTableData(response.data))
        .catch(error => console.error(error))
    }

    const handleSearch = (event) => {
        const value = event.target.value
        setSearchValue(value)
    }

    const getClassList = (data) => {
        if (Array.isArray(data)) {
            data.shift()
            data.unshift({label: '전체', value: ''})
        }
        setClassList(data)
    }

    useEffect(() => {
        getTableData(API_GET_MATERIAL, {
            property_id: property_id,
            employeeClass: '',
            search: ''
        }, setTableData)

        getTableDataCallback(API_EMPLOYEE_CLASS_LIST, {
            prop_id: property_id
        }, getClassList)

    }, [])

    const onModalButton = () => {
        toggle()
        const data = tableData.find(item => item.id === rowId)
        if (data !== undefined && data !== null) {
            setMaterial(
                {code: data.material_code, id: data.id, price: data.price, unit: data.unit, qty: data.stock}
            )
        }
    }

    return (
        <Modal isOpen={open} toggle={toggle} className='modal-dialog-centered modal-lg'>
            <ModalHeader className="mb-2">자재코드</ModalHeader>
            <ModalBody>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col xs='12' md='5' className="mb-1">
                        <Row>
                            <Col xs='3' md='3' className="d-flex align-items-center justify-content-center px-0">직종</Col>
                            <Col xs='9' md='9' className="ps-0">
                                <Select
                                    name='employeeClass'
                                    classNamePrefix={'select'}
                                    className="react-select custom-select-employeeClass custom-react-select"
                                    options={classList}
                                    value={employee_class}
                                    defaultValue={classList[0]}
                                    onChange={(e) => setEmployeeClass(e)}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' className="mb-1">
                        <InputGroup>
                            <Input
                                id='search'
                                placeholder='자재 정보를 검색해 보세요.'
                                value={searchValue}
                                onChange={handleSearch}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        postSearchData()
                                    }
                                }}/>
                            <Button style={{zIndex: 0}} onClick={postSearchData}>검색
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </ModalBody>
            <AppointmentDataTable
                tableData={tableData}
                columns={columns}
                setClick={setrowId}/>
            <ModalFooter
                className='mt-1'
                style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                    borderTop: '1px solid #B9B9C3'
                }}>
                <Button color='report' className="mx-1" onClick={() => toggle()}>취소</Button>
                <Button color='primary' onClick={() => onModalButton()}>저장</Button>
            </ModalFooter>
        </Modal>
    )
}
export default MaterialModal
