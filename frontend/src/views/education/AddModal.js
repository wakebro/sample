/* eslint-disable */
import axios from 'axios'
import * as yup from 'yup'
import Cookies from 'universal-cookie'
import { isEmptyObject } from 'jquery'
import { useState, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import Select from 'react-select'
import { Controller, useForm } from 'react-hook-form'
import { API_INTRANET_ARCHIVE } from "../../constants"
import { checkSelectValue, checkSelectValueObj } from '../../utility/Utils'
import { useAxiosIntercepter } from '../../utility/hooks/useAxiosInterceptor'

const defaultEducation = {
    name: '',
    contents: '',
    employee_class: {label:'선택', value:''},
    employee_level: '', //add
    belong: ''
}

const AddModal = (props) => {
    useAxiosIntercepter()
    const {formModal, setFormModal, userData, setUserData, dataBaseUserList, setDataBaseUserList, rowSelect, setRowSelect} = props
    const [selectList, setSelectList] = useState([{label: '선택', value:''}])
    const [selectError, setSelectError] = useState({employee_class: false})
    const [selectData, SetSelectData] = useState([])
	const {employee_class} = selectError
    const cookies = new Cookies()

    const special_pattern = /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/
    const validationSchemaModal =  
        selectData.value === false ? 
            yup.object().shape({
                name: yup.string().matches(
                    special_pattern, "특수문자가 포함되면 안됩니다").required('이름을 입력해주세요.'),
                employee_level: yup.string().matches(
                    special_pattern, "특수문자가 포함되면 안됩니다").required('직급을 입력해주세요.'),
                belong: yup.string().required('소속을 입력해주세요.'),
                input_class: yup.string().required('직종을 입력해주세요.')
            })
        : 
            yup.object().shape({
                name: yup.string().matches(
                    special_pattern, "특수문자가 포함되면 안됩니다").required('이름을 입력해주세요.'),
                employee_level: yup.string().matches(
                    special_pattern, "특수문자가 포함되면 안됩니다").required('직급을 입력해주세요.'),
                belong: yup.string().matches(
                    special_pattern, "특수문자가 포함되면 안됩니다").required('소속을 입력해주세요.')
            })

    const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
        reset
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultEducation)),
		resolver: yupResolver(validationSchemaModal)
	})

    const handleSelectValidation = (e, event) => {
        SetSelectData(e)
        checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

    const customToggle = () => {
        reset()
        SetSelectData([])
		setFormModal(!formModal)
	}

    const modalSubmit = (inputData) => {
        const check = checkSelectValueObj(control, selectError, setSelectError)
        if (!check) { return false }
        let id = ''
        const userId = Math.max(...dataBaseUserList) + 1
        const copyUserData = [...userData]
        const compareValue = inputData.employee_class.value === false ? inputData.input_class.trim() : inputData.employee_class.label
        if (copyUserData.find(data => data.class === compareValue)) {
            const filterTemp = copyUserData.find(data => data.class === compareValue)
            filterTemp['employee'].push({
                id: userId,
                base_id: null,
                name: inputData.name,
                username: null,
                default: true,
                employee_level: inputData.employee_level,
                employee_class: inputData.employee_class.value !== false ? inputData.employee_class.label : inputData.input_class.trim(),
                belong: inputData.belong
            })
        } else {
            const id = Math.max(...userData.map(data => data.id)) + 1
            // const id = userData.length + 1
            const nonmember = {
                id: id,
                type: 'nonmember',
                class: inputData.employee_class.value !== false ? inputData.employee_class.label : inputData.input_class.trim(),
                checked: false,
                employee: [
                    {
                    id: userId,
                    base_id: null,
                    name: inputData.name,
                    username: null,
                    default: true,
                    employee_level: inputData.employee_level,
                    employee_class: inputData.employee_class.value !== false ? inputData.employee_class.label : inputData.input_class.trim(),
                    belong: inputData.belong
                }
            ]}
            copyUserData.push(nonmember)
            if (!rowSelect.includes(nonmember.id)) {
                const newRowSelect = [...rowSelect, nonmember.id]
                setRowSelect(newRowSelect)
            }
        }
        setDataBaseUserList(prev => [...prev, userId])
        setUserData(copyUserData)
        reset()
        SetSelectData([])
        setFormModal(!formModal)
    }

    useEffect(() => {
        setSelectList([])
        axios.get(API_INTRANET_ARCHIVE, {
            params: {type: true, property:cookies.get('property').value}
        })
        .then(res => {
            res.data.push({label : "직접입력", value: false})
            setSelectList(prevList => [...prevList, ...res.data])
        })
        reset()
    }, [])

    useEffect(() => {
        if (!isEmptyObject(errors)) {
            checkSelectValueObj(control, selectError, setSelectError)
        }
	}, [errors])

    return (
        <Modal isOpen={formModal} toggle={() => customToggle()} className='modal-dialog-centered'>
            <Form onSubmit={handleSubmit(modalSubmit)}>
                <ModalHeader>비직원 등록</ModalHeader>
                <ModalBody>
                    <Row className='card_table'>
                        <Col md='6'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div>이름</div>&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <Controller
                                name='name'
                                control={control}
                                render={({ field }) => (
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%'}}>
                                            <Input style={{width:'100%'}} bsSize='lg' invalid={errors.name && true} {...field}/>
                                            {errors.name && <FormFeedback style={{paddingLeft:0}}>{errors.name.message}</FormFeedback>}
                                        </Row>
                                    </Col>
                                )}/>
                            </div>
                        </Col>
                        <Col md='6'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div>직종</div>&nbsp;
                                    <div className='essential_value'/> 
                                </Col>
                                {selectData.value === false && 
                                    <Controller 
                                        name='input_class'
                                        control={control}
                                        render={({ field }) => (
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%'}}>
                                                    <Input maxLength={50} style={{width:'100%'}} bsSize='lg' invalid={errors.input_class && true} {...field}/>
                                                    {errors.input_class && <FormFeedback style={{paddingLeft:0}}>{errors.input_class.message}</FormFeedback>}
                                                </Row>
                                            </Col>
                                        )}
                                    />
                                }
                                <Controller
                                    name='employee_class'
                                    control={control}
                                    render={({ field: { value } }) => (
                                        <Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start', paddingTop:'2%'}}>
                                            <Select
                                                name='employee_class'
                                                height='45.99'
                                                classNamePrefix={'select'}
                                                className="react-select custom-select-employee_class custom-react-select"
                                                options={selectList}
                                                value={value}
                                                onChange={handleSelectValidation}/>
                                            {employee_class && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
                                        </Col>
                                )}/>
                            </div>
                        </Col>
                    </Row>
                    <Row className='card_table'>
                        <Col md='6'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div>직급</div>&nbsp;
                                    <div className='essential_value'/> 
                                </Col>
                                <Controller
                                name='employee_level'
                                control={control}
                                render={({ field }) => (
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%'}}>
                                            <Input style={{width:'100%'}} bsSize='lg' invalid={errors.employee_level && true} {...field}/>
                                            {errors.employee_level && <FormFeedback style={{paddingLeft:0}}>{errors.employee_level.message}</FormFeedback>}
                                        </Row>
                                    </Col>
                                )}/>
                            </div>
                        </Col>
                        <Col md='6'>
                            <div className="mb-1">
                                <Col className='card_table col text' style={{paddingBottom:0}}>
                                    <div>소속</div>&nbsp;
                                    <div className='essential_value'/>
                                </Col>
                                <Controller
                                name='belong'
                                control={control}
                                render={({ field }) => (
                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                        <Row style={{width:'100%'}}>
                                            <Input style={{width:'100%'}} bsSize='lg' invalid={errors.belong && true} {...field}/>
                                            {errors.belong && <FormFeedback style={{paddingLeft:0}}>{errors.belong.message}</FormFeedback>}
                                        </Row>
                                    </Col>
                                )}/>
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color='report' onClick={() => customToggle()}>
                        취소
                    </Button>
                    <Button color='primary'>
                        등록 
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
    )

}

export default AddModal