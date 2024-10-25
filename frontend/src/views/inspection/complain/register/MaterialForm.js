import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useAxiosIntercepter } from "@utility/hooks/useAxiosInterceptor"
import { getTableData, sweetAlert } from '@utils'

import { Fragment, useEffect, useState } from "react"
import Flatpickr from 'react-flatpickr'
import { Button, Card, CardBody, Col, Input, Label, Row } from 'reactstrap'
import Swal from 'sweetalert2'

import { API_FACILITY_MATERIAL_INFO_STOCK } from '../../../../constants'
import CustomDataTable from "../../../basic/facility/CustomDataTable"
import { columns } from "../../data"
import MaterialModal from "./Modal/MaterialModal"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import { AddCommaOnChange, getCommaDel, setStringDate } from '../../../../utility/Utils'

const MaterialForm = (props) => {
  useAxiosIntercepter()
  const { 
	property_id, material, setMaterial, materialDate, setMaterialDate,
	usage, setUsage, unit, setUnit, is_rest, setIsRest, Instructions, 
	setInstructions, tableData, setTableData
  } = props
  const [tableSelect, setTableSelect] = useState([])
  const [data, setData] = useState([])
  const [unitPrice, setUnitPrice] = useState('')

  const PlusTableData = () => {
	if (material.name === '') {
	  sweetAlert('', '자재를 등록 해주세요', 'warning', 'center')
	  return false
	}
	if (materialDate === '') {
	  sweetAlert('', '사용일을 등록 해주세요', 'warning', 'center')
	  return false
	}
	if (usage === '') {
	  sweetAlert('', '사용량을 입력 해주세요', 'warning', 'center')
	  return false
	}
	const tableNewData = []

	for (let i = 0; i < unitPrice.length; i++) {
	  const temp = {
		id: tableData.length + i,
		material: material,
		materialDate: materialDate,
		usage: usage,
		unit: is_rest ? '' : unit, 
		price: unitPrice[i],
		Instructions: Instructions,
		is_rest: is_rest
	  }
	  tableNewData.push(temp)
	}
	const updatedShowTable = [...tableData, ...tableNewData]
	setTableData(updatedShowTable)
	setMaterial({ code: ''})
	setUsage('')
	setUnit('')
	setIsRest(true)
	setMaterialDate('')
	setInstructions('')
  }

  const DeleteTableData = () => {
	if (tableSelect.length !== 0) {
	  const selectedIds = tableSelect.map(item => item.id)
	  const updatedTableData = tableData.filter(item => !selectedIds.includes(item.id))
	  setTableData(updatedTableData)
	}
  }

	const handleUsageChange = (e) => {
		if (material.id === '') {
			sweetAlert('', '사용할 자재를 선택해주세요.', 'warning')
			return
		}
		const result = AddCommaOnChange(e, undefined, true, usage)
		const temp = getCommaDel(result)
		if (is_rest === true) {
			if (Number(temp) > material.qty) {
				Swal.fire({
					title: '',
					html: '재고수량보다 출고수량이 많을 수 없습니다.',
					icon: 'warning',
					customClass: {
						confirmButton: 'btn btn-primary',
						actions: `sweet-alert-custom center`
					}
				}).then(res => {
					console.log(res)
					setUsage(0)
				})
				return
			}
			setUsage(result)
		}
	}

const [modal, setModal] = useState(false)
const toggle = () => setModal(!modal)

useEffect(() => {
  if (material && material.id !== undefined) {
	getTableData(API_FACILITY_MATERIAL_INFO_STOCK, {property_id: property_id, material_id: material.id}, setData)
  }
}, [material])

useEffect(() => {
  let inputNumber = getCommaDel(usage)
  const modifiedData = []
  for (let i = 0; i < data.length && inputNumber > 0; i++) {
	  try {
		  const subtractAmount = Math.min(inputNumber, (data.filter(item => item.material === Number(material.id)))[i].quantity)
		  modifiedData.push({ unit_price: (data.filter(item => item.material === Number(material.id)))[i].unit_price, quantity: subtractAmount })
		  inputNumber -= subtractAmount
	  } catch (err) {
		  Swal.fire({
			  title: '',
			  html: '재고수량보다 출고수량이 많을 수 없습니다.',
			  icon: 'warning',
			  customClass: {
				  confirmButton: 'btn btn-primary',
				  actions: `sweet-alert-custom center`
			  }
		  }).then(res => {
			  console.log(res)
			  setUsage(0)
		  })
		  return ''
	  }
  }
  setUnitPrice(modifiedData)
}, [usage])

  return (
	<Fragment>
	  <Card className="mt-1 mb-15" style={{marginBottom:'80px'}}>
		<Col className="custom-card-header">
			<div className="custom-create-title">자재 정보</div>
		</Col>
		<hr/>
		<CardBody>
		<Row className='mb-1' style={{alignItems:'center'}}>
		  <Col xs='12' md='6'>
			<Row style={{alignItems:'center'}}>
			  <Col className='card_table col text center mb-1' xs='2'>
				자재&nbsp;
				<div className='essential_value'/>
			  </Col>
			  <Col xs='10'>
				<Row>
				  <Col xs='7' md='9'>
					<Input
					placeholder="자재 정보를 검색해 주세요"
					value={material.code}
					disabled={true}
					/>
				  </Col>
				  <Col xs='3' md='3'>
					<Button color='white' style={{borderColor:'gray', whiteSpace: 'nowrap', justifyContent:'end'}} onClick={toggle}>검색</Button>
				  </Col>
				  <MaterialModal
					property_id = {property_id}
					open = {modal}
					toggle = {toggle}
					setMaterial = {setMaterial}
				  />
				</Row>
			  </Col>
			</Row>
		  </Col>
		  <Col xs='12' md='6'>
			<Row style={{alignItems:'center'}}>
			  <Col className='card_table col text center  mb-1' xs='2'>
			  	사용일&nbsp;
				<div className='essential_value'/>
			  </Col>
			  <Col xs='10'>
				<Flatpickr
				  id='range-picker'
				  className='form-control'
				  placeholder="YYYY/MM/DD"
				  value={materialDate}
				  onChange={(data) => {
					  const newData = setStringDate(data, true)
					  setMaterialDate(newData)
				  }}
				  options = {{
					  dateFormat: "Y-m-d",
					  locale: Korean
				  }}
				/>   
			  </Col>
			</Row>
		  </Col>
		</Row>
		<Row className='mb-1' style={{alignItems:'center'}}>
		  <Col xs='12' md='6'>
			<Row style={{alignItems:'center'}}>
			  <Col className='card_table col text center  mb-1' xs='2'>
				사용량&nbsp;
				<div className='essential_value'/>
			  </Col>
			  <Col xs='10'>
				<Row>
				  <Col xs='5'>
					<Input
					placeholder="사용량을 입력해주세요"
					value={usage}
					onChange={handleUsageChange}
					disabled = {material.value === ''}
					/>
				  </Col>
				  <Col xs='4'>
				  <Input
					placeholder="(잉여단위)"
					value={unit}
					onChange={(e) => setUnit(e.target.value)}
					disabled = {is_rest}
					/>          
				  </Col>
				</Row>
			  </Col>
			</Row>
		  </Col>
		  <Col xs='12' md='6'>
			<Row style={{alignItems:'center'}}>
			  <Col className='card_table col text center  mb-1' xs='2'>
			  구분
			  </Col>
			  <Col xs='10' className='d-flex align-items-center'>
					<Input
						id='idRadioMaterial1'
						name='radioMaterial'
						className='mx-1'
						type='radio'
						checked={is_rest}
						onChange={() => setIsRest(true)}
					/>
					<Label className='form-check-label' for='idRadioMaterial1'>
						재고자재
					</Label>

					<Input
						id='idRadioMaterial2'
						name='radioMaterial'
						className='mx-1'
						type='radio'
						checked={!is_rest}
						onChange={() => setIsRest(false)}
					/>
					<Label className='form-check-label' for='idRadioMaterial2'>
						잉여자재
					</Label>
			  </Col>
			</Row>
		  </Col>
		</Row>
		<Row className='mb-1' style={{alignItems:'center'}}>
		  <Col md='12' xs='12'>
			<Row style={{alignItems:'center'}}>
			  <Col className='card_table col text center' xs='2' md='1'>
				사용설명
			  </Col>
			  <Col xs='10' md='11'>
				  <Input
				  type="textarea"
				  value={Instructions}
				  onChange={(e) => setInstructions(e.target.value)}
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
		<Row>
		  <CustomDataTable
			tableData={tableData}
			columns={columns.material}
			setTableSelect={setTableSelect}
			selectType = {true}
			/>
		</Row>
		</CardBody>
	  </Card>
	</Fragment>
  )
}

export default MaterialForm