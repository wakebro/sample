import Breadcrumbs from '@components/breadcrumbs'
import { Fragment } from "react"
import { Card, CardBody, CardHeader, CardTitle, Row, Col, Button, Form, FormFeedback } from 'reactstrap'
import Sign from './SignPreview'
import { FormPreviewButton } from './FormButton'
import { useSelector } from 'react-redux'
import * as moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import PreviewSection from './PreviewSection'

const InspectDetailPreview = () => {
	const {
		control,
		setValue,
		getValues,
		formState: { errors }
	} = useForm()
	
	const previewData = useSelector((state) => state.inspectionPreview)
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs 
						breadCrumbTitle={`${previewData.reportType !== 'disaster' ? '점검일지' : '안전 점검일지'}`} 
						breadCrumbParent={`${previewData.reportType !== 'disaster' ? '점검관리' : '중대재해관리'}`} 
						breadCrumbParent2={`${previewData.reportType !== 'disaster' ? '자체점검' : '일일안전점검'}`}
						breadCrumbActive={`${previewData.reportType !== 'disaster' ? '점검실적' : '점검일지'}`}
					/>
				</div>
			</Row>
			<Row>
				<Form >
					<Card>
						<CardHeader>
							<Col lg='8' md='12' >
								<CardTitle>
									{previewData.name}
								</CardTitle>
									<Row className='card_table top mt-1'>
										<Col lg='4' md='12'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													건물
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
													{previewData.building.label}
												</Col>
											</Row>
										</Col>
										<Col lg='4' md='12'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													작성일자
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
													{moment().format('YYYY-MM-DD')}
												</Col>
											</Row>
										</Col>
										<Col lg='4' md='12'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													관리자
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
												-
												</Col>
											</Row>
										</Col>
									</Row>
									<Row className='card_table mid'>
										<Col lg='4' md='12'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													직종
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
													{previewData.employeeClass.label}
												</Col>
											</Row>
										</Col>
										<Col lg='4' md='12'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													직급
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
													-
												</Col>
											</Row>
										</Col>
										<Col lg='4' md='12'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													이름
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
													-
												</Col>
											</Row>
										</Col>
									</Row>
							</Col>
							<Col lg='4' md='12'>
								<Sign 
									userSign={previewData.signList}
									userName={previewData.signList.map(sign => sign.username)}
									signList={previewData.signList.map(sign => sign.type)}

								/>
							</Col>
						</CardHeader>
					</Card>
					<PreviewSection
						control={control}
						setValue = {setValue}
						errors = {errors}
						getValues = {getValues}
					/>
				</Form>
			</Row>
			<FormPreviewButton formId ={previewData.formId === undefined ? 'new' : previewData.formId} type={previewData.reportType}/>
		</Fragment>
	)
}
export default InspectDetailPreview