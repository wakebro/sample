import axios from 'axios'
import { isEmptyObject } from 'jquery'
import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import { useLocation } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, TabContent, TabPane, InputGroup, Form, CardFooter } from "reactstrap"
import { API_BASICINFO_AREA_TENANT, ROUTE_BASICINFO_AREA_TENANT } from "../../../../../constants"
import { defaultValues } from '../TenantData'
import { checkSelectValue, checkSelectValueObj, getTableData } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'

const TenantForm = () => {
    useAxiosIntercepter()
    const { state } = useLocation()
    const cookies = new Cookies()
    const [data, setData] = useState([])
    const [buildingList, setBuildingList] = useState([{ value:'', label: '건물전체'}])
    const [floorList, setFloorList] = useState([{ value:'', label: '층전체'}])
    const [selectedBuilding, setSelectedBuilding] =  useState(buildingList[0])
    // const [selectedFloor, setSelectedFloor] =  useState(floorList[0])
    const [selectError, setSelectError] = useState({building: false})
	const {building} = selectError
    const [selectFloorError, setSelectFloorError] = useState({floor: false})
	const {floor} = selectFloorError
    const [selectRoomError, setSelectRoomError] = useState({room: false})
	const {room} = selectRoomError
    console.log(floorList)
    console.log(selectedBuilding)
    console.log(data)

    let yubResolver
	if (state.type === 'register') {
		yubResolver = yupResolver("수정")
	} else {
		yubResolver = yupResolver("수정")
	}

    const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
		// watch
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues)),
		resolver: yubResolver
	})

    const handleSelectValidation = (e, event) => {
        setSelectedBuilding(e)
		checkSelectValue(e, event, selectError, setSelectError, setValue)
        checkSelectValue(e, event, selectFloorError, setSelectFloorError, setValue)
        checkSelectValue(e, event, selectRoomError, setSelectRoomError, setValue)
	}

    const onSubmit = (data) => {
        console.log(data)
    }

    useEffect(() => {
		if (state.type === 'register') {
			getTableData(API_BASICINFO_AREA_TENANT, {property:cookies.get('property').value, search:'', floor:'', building:''}, setData, setBuildingList)
		}
	}, [])

    useEffect(() => {
        if (selectedBuilding.value !== '') {
            axios.get(API_BASICINFO_AREA_TENANT, {
                params:{property:cookies.get('property').value, search:'', floor:'', building:selectedBuilding.value}
            })
            .then(res => {
                setData(res.data.data)
                if (res.data.floor_list) {
                    const floorList = []
                    for (let i = 0; i < res.data.floor_list.length; i++) {
                        floorList.push({value:res.data.floor_list[i].id, label: res.data.floor_list[i].name})
                    }
                    setFloorList(prevList => [...prevList, ...floorList])
                }
            }) 
        }
    }, [selectedBuilding])

    useEffect(() => {
		if (state.type === 'register') {
			if (!isEmptyObject(errors)) {
				checkSelectValueObj(control, selectError, setSelectError)
			}
		}
	}, [errors])

    return (
        <Fragment>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='건물정보' breadCrumbParent='기본정보' breadCrumbParent2='건물정보' breadCrumbActive='건물정보' />
					</div>
				</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
						입주사정보&nbsp;{state.type === 'register' ? '등록' : '수정'}
					</CardTitle>
				</CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className='card_table top'>
                            <Col md='4' xs='12'>
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                        <div>입주사명</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                        name='code'
                                        control={control}
                                        render={({ field }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            <Input style={{width:'100%'}} bsSize='sm' invalid={errors.code && true} {...field}/>
                                                            {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                            <Col md='4' xs='12'>
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                        <div>건물</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                        <Controller
                                            name='building'
                                            control={control}
                                            render={({ field: { value } }) => (
                                                <Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                                    <Select
                                                        name='building'
                                                        classNamePrefix={'select'}
                                                        className="react-select custom-select-building custom-react-select"
                                                        options={buildingList}
                                                        value={value}
                                                        onChange={ handleSelectValidation }/>
                                                    {building && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
                                                </Col>
                                            )}/>
                                </Row>
                            </Col>
                            <Col md='4' xs='12'>
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>전용면적</Col>
                                        <Controller
                                            name='name'
                                            control={control}
                                            render={({ field }) => (
                                                <Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Col lg='6' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                            <Input style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field} placeholder='자동부여'/>
                                                            {/* {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>} */}
                                                        </Col>
                                                        <Col lg='6' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                            <Input style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field} placeholder='자동부여'/>
                                                            {/* {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>} */}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            )}/>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='card_table top'>
                            <Col md='4' xs='12'>
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                        <div>입실일자</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                        name='code'
                                        control={control}
                                        render={({ field }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            <Input style={{width:'100%'}} bsSize='sm' invalid={errors.code && true} {...field}/>
                                                            {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                            <Col md='4' xs='12'>
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                        <div>층</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                        <Controller
                                            name='floor'
                                            control={control}
                                            render={({ field: { value } }) => (
                                                <Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                                    <Select
                                                        name='floor'
                                                        classNamePrefix={'select'}
                                                        className="react-select custom-select-floor custom-react-select"
                                                        options={floorList}
                                                        value={value}
                                                        onChange={ handleSelectValidation }/>
                                                    {floor && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
                                                </Col>
                                            )}/>
                                </Row>
                            </Col>
                            <Col md='4' xs='12'>
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>계약면적</Col>
                                    <Controller
                                        name='name'
                                        control={control}
                                        render={({ field }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='6' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Input style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field} placeholder='자동부여'/>
                                                        {/* {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>} */}
                                                    </Col>
                                                    <Col lg='6' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Input style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field} placeholder='자동부여'/>
                                                        {/* {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>} */}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='card_table top' style={{marginBottom: '1%'}}>
                            <Col md='4' xs='12'>
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                        <div>퇴실일자</div>
                                    </Col>
                                    <Controller
                                        name='code'
                                        control={control}
                                        render={({ field }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            <Input style={{width:'100%'}} bsSize='sm' invalid={errors.code && true} {...field}/>
                                                            {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                            <Col md='4' xs='12'>
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>실</Col>
                                        <Controller
                                            name='room'
                                            control={control}
                                            render={({ field: { value } }) => (
                                                <Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                                    <Select
                                                        name='building'
                                                        classNamePrefix={'select'}
                                                        className="react-select custom-select-room custom-react-select"
                                                        // options={buildingList}
                                                        value={value}
                                                        onChange={ handleSelectValidation }/>
                                                    {room && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
                                                </Col>
                                            )}/>
                                </Row>
                            </Col>
                            <Col md='4' xs='12'>
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>임대면적(평)</Col>
                                    <Controller
                                        name='name'
                                        control={control}
                                        render={({ field }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text center' style={{flexDirection:'column'}}>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='6' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Input style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field} placeholder='자동부여'/>
                                                        {/* {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>} */}
                                                    </Col>
                                                    <Col lg='6' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Input style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field} placeholder='자동부여'/>
                                                        {/* {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>} */}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                        </Row>
                        <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                            <Fragment >
                                <Button type='submit' color='primary'>{state.type === 'register' ? '저장' : '수정'}</Button>
                                <Button color='primary' 
                                    className="ms-1"
                                    tag={Link} 
                                    to={ROUTE_BASICINFO_AREA_TENANT} 
                                    state={{
                                        key: 'costCategory'
                                    }} >목록보기</Button>
                            </Fragment>
                        </CardFooter>
                    </Form>
                </CardBody>
			</Card>
		</Fragment>
    )

}
export default TenantForm