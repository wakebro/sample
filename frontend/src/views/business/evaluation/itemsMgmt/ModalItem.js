/*eslint-disable */
import { setIsOpen, setModalPageType } from '@store/module/businessEevaluationItems'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// import axios from 'axios'

import winLogoImg from '@src/assets/images/winlogo.png'
import { Fragment, useEffect, useState } from 'react'
import { PlusCircle } from "react-feather"

import { useDispatch, useSelector } from "react-redux"
// import Select from 'react-select'
import { sweetAlert } from '@utils'
import { Controller } from 'react-hook-form'
import { Button, Card, CardBody, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, Row } from "reactstrap"
import ItemLineCreate from './ItemLineCreate'
import ItemLine from './ItemLine'
import { primaryColor } from '../../../../utility/Utils'

const ModalItem = (props) => {
	const {
		items,
		setItems,
		parentId,
		setParentId,
		maxNum,
		control,
		errors,
		handleSubmit,
		setValue,
		resolver,
		setResolver,
		lines,
		setLines
	} = props

	const dispatch = useDispatch()
	const businessEevaluationItems = useSelector((state) => state.businessEevaluationItems)
	
	const closeModal = () => {
		setValue('id', '')
		setValue('code', '')
		setValue('memo', '')
		setValue('additional', '')
		setParentId()
		dispatch(setIsOpen(false))
		dispatch(setModalPageType(''))
	}

	const addNode = () => {
		const filteredList = items.filter(obj => obj.parent_id === parentId)
		let maxSortNum = filteredList.reduce((max, obj) => Math.max(max, obj.sort), -Infinity)
		if (maxSortNum === -Infinity) maxSortNum = 0
		const newNode = {
			id:maxNum+1, 
			code: control._formValues.code, 
			memo:control._formValues.memo, 
			parent_id: parentId, 
			additional: control._formValues.additional,
			sort:maxSortNum+1
		}
		setItems([...items, newNode])
		closeModal()
	}

	const modifyNode = () => {
		setItems(items.map(
			node => node.id === control._formValues.id ? 
			{...node, code: control._formValues.code, memo:control._formValues.memo, additional: control._formValues.additional }
			: node
		))
		closeModal()
	}

	const deleteNode = () => {
		const MySwal = withReactContent(Swal)
		MySwal.fire({
			icon: "warning",
			html: "하단의 평가항목도 같이 삭제됩니다. <br/>정말로 삭제하시겠습니까?",
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonText: "취소",
			confirmButtonText: '확인',
			confirmButtonColor : primaryColor,
			reverseButtons :true,
			customClass: {
				actions: 'sweet-alert-custom right',
				cancelButton: 'me-1'
			}
		}).then((res) => {
			if (res.isConfirmed) {
				setItems(items.filter(node => node.id !== control._formValues.id && node.parent_id !== control._formValues.id))
				closeModal()
				sweetAlert(`${control._formValues.code} 삭제 완료`, `${control._formValues.code} 삭제가 완료되었습니다.`, 'success')

			} else {
				MySwal.fire({
					icon: "info",
					html: "취소하였습니다.",
					showCancelButton: true,
					showConfirmButton: false,
					cancelButtonText: "확인",
					cancelButtonColor : primaryColor,
					reverseButtons :true,
					customClass: {
						actions: 'sweet-alert-custom right'
					}
				})
			}
		})
	}

	const showItemLines = () => {
		// const tempList = ['ali', 'mia', 'jamie']
		// return (
		// 	tempList.map((data, idx) => {
		// 		// return <div key={idx}>{data}</div>
		// 		return <ItemLine key={idx} idx={idx} data={data}/>
		// 	})
		// )
	}

	useEffect(() => {
		console.log(lines)
	}, [lines])
	return (
		<Fragment>
			{
				<Form onClick={handleSubmit(addNode)}>
					<Modal isOpen={businessEevaluationItems.isOpen} toggle={() => closeModal()} className='modal-dialog-centered modal-lg'>
						<ModalBody style={{backgroundColor:'#FF922A', borderTopLeftRadius : '0.357rem', borderTopRightRadius : '0.357rem'}}>
							<Row className='ms-1' style={{width:'100%', margin:'inherit'}}>
								<Col xs='10' className='custom-modal-header' style={{display: 'flex', flexDirection : 'column', justifyContent : 'center'}}>
									<Row style={{fontSize: '20px', color:'white'}}>
										분류/항목 등록
									</Row>
									<Row  style={{fontSize: '16px', color:'white'}}>
										빈칸에 맞춰 양식을 작성해 주세요.
									</Row>
								</Col>

								<Col xs='2' className='custom-modal-header'>
									<Card style={{marginBottom:0, boxShadow:'none', backgroundColor:'transparent'}}>
										<img src={winLogoImg} style={{display:'flex', position:'relative', flexDirection:'column', height: "82px", width: '89px' }}/>
									</Card>
								</Col>
							</Row>
						</ModalBody>

						<ModalBody className='ms-1 me-1' style={{ backgroundColor:'#fff', borderBottomLeftRadius : '0.357rem', borderBottomRightRadius : '0.357rem', height:'auto'}}>
							<Row >
								<Col xs={8}>
									<Label className="form-check-label custom_label">분류명</Label>
									<Controller
										name='code'
										control={control}
										render={({ field }) => (
											<Fragment>
												<Input style={{width:'100%'}} bsSize='sm' invalid={errors.code && true} {...field}/>
												{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
											</Fragment>
									)}/>
								</Col>
								<Col xs={4}>
									<Label className="form-check-label custom_label">가중치</Label>
									<Controller
										name='additional'
										control={control}
										render={({ field }) => (
											<Fragment>
												<Input style={{width:'100%'}} bsSize='sm' invalid={errors.additional && true} {...field}/>
												{errors.additional && <FormFeedback>{errors.additional.message}</FormFeedback>}
											</Fragment>
									)}/>
								</Col>
							</Row>
							<br/>
							<Row >
								<Col>
									<Label className="form-check-label custom_label">메모</Label>
									<Controller
										name='memo'
										control={control}
										render={({ field }) => (
											<Fragment>
												<Input style={{width:'100%'}} bsSize='sm' {...field}/>
											</Fragment>
									)}/>
								</Col>
							</Row>
							<br/>
						</ModalBody>

						<div className='hidden-scrollbar' style={{maxHeight:'400px', overflow:'scroll'}}>
							{showItemLines()}
						</div>
						<ItemLineCreate
							itemId={businessEevaluationItems.id}
							lines={lines}
							setLines={setLines}
							items={items}
							maxNum={maxNum}
							// setValue={setValue}
							// resolver={resolver}
							// setResolver={setResolver}
						/>

						<ModalFooter>
							<Button color="report" onClick={() => closeModal()}>취소</Button>
							{businessEevaluationItems.modalPageType === 'register' && <Button color='primary' onClick={handleSubmit(addNode)}>저장</Button>}
							{businessEevaluationItems.modalPageType === 'modify' && <Button color='primary' onClick={handleSubmit(modifyNode)}>수정</Button>}
							{businessEevaluationItems.modalPageType === 'modify' && <Button color='danger' onClick={handleSubmit(deleteNode)}>삭제</Button>}
						</ModalFooter>
					</Modal>
				</Form>
			}
		</Fragment>
	)
}

export default ModalItem