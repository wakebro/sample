import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment } from "react"
import { CardBody, Col, Row, CardFooter, Button } from "reactstrap"
import * as moment from 'moment'
import {ROUTE_BASICINFO_AREA_BUILDING} from '../../../../constants'
import { Link } from 'react-router-dom'

const BuildingTabData = (props) => {
	const {data, update, setUpdate} = props
	const landCustom = (num) => {
		const temp = `${(Math.round(num / 3.3058)).toLocaleString()}평`
		return temp
	}
	const dateFormat = (data) => {
		if (data !== null && data !== undefined) {
			return moment(data).format('YYYY-MM-DD')
		}
	}
	const exclusiveRatio = (num) => {
		if (isNaN(num) || !Number.isFinite(num)) {
			return 0
		} else {
			return Math.round(num)
		}	
	}

	return (
		<Fragment>
			<div>
				<CardBody>
				<Row className='card_table top' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>건물명</Col>
							<Col xs='8' className='card_table col text start '>{data['name']}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>소유주</Col>
							<Col xs='8' className='card_table col text start '>{data['landlord']}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>설계자</Col>
							<Col xs='8' className='card_table col text start '>{data['designer']}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>시공사</Col>
							<Col xs='8' className='card_table col start '>{data['builder']}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>소재지</Col>
							<Col xs='8' className='card_table col text start '>{data['address']}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>연면적</Col>
							<Col>
								<Row className='card_table col start '>
									<Col md={6} xs={12}>
										{data['area_total'] && data['area_total'].toLocaleString('ko-KR')}{'m\xB2'}
									</Col>
									<Col md={6} xs={12}>
										{landCustom(data['area_total'])}
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>지목</Col>
							<Col xs='8' className='card_table col start '>{data['class_land']}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>지역</Col>
							<Col xs='8' className='card_table col text start '>{data['district']}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>지구</Col>
							<Col xs='8' className='card_table col start '>{data['section']}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>건축 면적</Col>
							<Col xs='8' className='card_table col text number end '>{data['bl_area'] && data['bl_area'].toLocaleString('ko-KR')}{'m\xB2'}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>대지 면적</Col>
							<Col xs='8' className='card_table col number end '>{data['parcel'] && data['parcel'].toLocaleString('ko-KR')}{'m\xB2'}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>건폐율</Col>
							<Col xs='8' className='card_table col text end '>{data['bl_to_land_ratio'] && data['bl_to_land_ratio'].toLocaleString('ko-KR')}%</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>전용율</Col>
							<Col xs='8' className='card_table col end '>{exclusiveRatio((data['area_total'] / data['parcel']) * 100)}%</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>용적률</Col>
							<Col xs='8' className='card_table col text end '>{data['fl_area_ratio'] && data['fl_area_ratio'].toLocaleString('ko-KR')}%</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>전용 면적</Col>
							<Col xs='8' className='card_table col end '>{data['usable_area'] && data['usable_area'].toLocaleString('ko-KR')}{'m\xB2'}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>건축 구조</Col>
							<Col xs='8' className='card_table col text start '>{data['construction_type']}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table row'>
							<Col xs='4' className='card_table col col_color text center '>지붕 형태</Col>
							<Col xs='8' className='card_table col start '>{data['roof_type']}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>
								<div>
									<div style={{display : 'flex', justifyContent: 'center', alignItems : 'center'}}>층수</div>
									<div style={{display : 'flex', justifyContent: 'center', alignItems : 'center'}}>(지상/지하)</div> 
								</div>							
							</Col>
							<Col xs='8' className='card_table col text end '>
								<div className='card_table text number'>
									{data['count_fl'] && data['count_fl'].toLocaleString('ko-KR')}층/{data['count_bf'] && data['count_bf'].toLocaleString('ko-KR')}층
								</div>
							</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>
								<div>
									<div style={{display : 'flex', justifyContent: 'center', alignItems : 'center'}}>최고높이</div>
									<div style={{display : 'flex', justifyContent: 'center', alignItems : 'center'}}>(지상/지하)</div> 
								</div>		
							</Col>
							<Col xs='8' className='card_table col end '>
								<div className='card_table text number'>
									{data['bl_height'] && data['bl_height'].toLocaleString('ko-KR')}m/{data['bl_depth'] && data['bl_depth'].toLocaleString('ko-KR')}m
								</div>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>주용도</Col>
							<Col xs='8' className='card_table col text start '>{data['main_purpose']}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>준공일</Col>
							<Col xs='8' className='card_table col text start '>{dateFormat(data['bl_date'])}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='2'  className='card_table col col_color text center '>주차 설비</Col>
					<Col xs='10' className='card_table col text start'>{data['parking_facility']}</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='2'  className='card_table col col_color text center '>승강 설비</Col>
					<Col xs='10' className='card_table col text start '>{data['elev_facility']}</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='2'  className='card_table col col_color text center '>수전 설비</Col>
					<Col xs='10' className='card_table col text start '>{data['elec_cap']}</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='2'  className='card_table col col_color text center '>발전 설비</Col>
					<Col xs='10' className='card_table col text start '>{data['generator_cap']}</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='2'  className='card_table col col_color text center '>난방 설비</Col>
					<Col xs='10' className='card_table col text start '>{data['heating_facility']}</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='2'  className='card_table col col_color text center '>냉방 설비</Col>
					<Col xs='10' className='card_table col text start '>{data['cooling_facility']}</Col>
				</Row>
				</CardBody>
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
					<Button color="primary" onClick={() => setUpdate(!update)}>
						수정
					</Button>
					<Button 
						className="ms-1"
						tag={Link} 
						to={ROUTE_BASICINFO_AREA_BUILDING} 
					>목록</Button>		
						
				</CardFooter>
			</div>
		</Fragment>
	)
}

export default BuildingTabData