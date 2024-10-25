import { Fragment } from "react"
import { Controller } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, CardFooter, Col, Form, FormFeedback, Input, Row } from "reactstrap"
import { ROUTE_SYSTEMMGMT_AUTH_GROUP } from '../../../../../constants'
import { axiosPostPut, setFormData, setValueFormat } from "../../../../../utility/Utils"
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { authAPIObj, authLabelObj } from "../../data"
import { changePageType } from "../../../../../redux/module/authGroup"

const GroupForm = (props) => {
	useAxiosIntercepter()
	const { 
		control,
		handleSubmit,
		errors,
		setValue,
		setSubmitResult,
		detailBackUp
	} = props
	const authGroup = useSelector((state) => state.authGroup)
	const dispatch = useDispatch()

	// POST, PUT
	const onSubmit = (data) => {
		const formData = new FormData()
		setFormData(data, formData)

		const API = authGroup.pageType === 'register' ? `${authAPIObj['group']}/-1`
										: `${authAPIObj['group']}/${authGroup.detailRow}`

		axiosPostPut(authGroup.pageType, authLabelObj['group'], API, formData, setSubmitResult)
	}

	return (
		<Fragment>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row className='card_table top'>
					<Col md='12' xs='12'>
						<Row className='card_table table_row'>
							<Col xs='3' className='card_table col col_color text center px-0'>
								{/* 미디어 쿼리로 모바일 경우 폰트사이즈 조절 필요 */}
								<div>그룹명</div>&nbsp;
								<div className='essential_value'/>
							</Col>
							<Col xs='9' className='card_table col text' style={{justifyContent:'space-between'}}>
								<Controller
									name='name'
									control={control}
									render={({ field }) => (
										<Col className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
											<Row style={{width:'100%'}}>
												<Input maxLength='225' style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field}/>
												{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
											</Row>
										</Col>
									)}/>
							</Col>
						</Row>
					</Col>
				</Row>
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
					{authGroup.pageType === 'modify' && <Button className="ms-1" color="report" onClick={() => {
						dispatch(changePageType('detail'))
						setValueFormat(detailBackUp, control._formValues, setValue, null)
					}}>취소</Button>}
					<Button className="ms-1" onClick={handleSubmit(onSubmit)} color='primary'>{authGroup.pageType === 'register' ? '저장' : '수정'}</Button>
					<Button className="ms-1" tag={Link} to={ROUTE_SYSTEMMGMT_AUTH_GROUP}>목록</Button>
				</CardFooter>
			</Form>
		</Fragment>
	)
}

export default GroupForm