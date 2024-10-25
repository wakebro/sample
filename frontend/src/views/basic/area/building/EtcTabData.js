import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment } from "react"
import { CardBody, Col, Row, CardFooter, Button } from "reactstrap"
import * as moment from 'moment'
// import * as moment from 'moment'
const EtcTabData = (props) => {
	const {data, update, setUpdate} = props
	const trueFalseCustom = (data) => {
		if (data) {
			return '유'
		} else {
			return '무'
		}
	}
	const dateFormat = (data) => {
		if (data !== null && data !== undefined) {
			return moment(data).format('YYYY-MM-DD')
		}
	}

	return (
		<Fragment>
			<div>
				<CardBody>
				<Row className='card_table top' >
					<Col  xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>등기부여</Col>
							<Col xs='8' className='card_table col text start '>{trueFalseCustom(data['is_regist'])}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center word-normal px-0'>
								<span>건물취득일</span>
							</Col>
							<Col xs='8' className='card_table col text start '>{dateFormat(data['buy_date'])}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center'>대지 취득일</Col>
							<Col xs='8' className='card_table col text start '>{dateFormat(data['land_buy_date'])}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>매각일자</Col>
							<Col xs='8' className='card_table col start '>{dateFormat(data['sale_date'])}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
						<Col xs='4' className='card_table col col_color text center'>관리 개시일</Col>
							<Col xs='8' className='card_table col start '>{dateFormat(data['manage_start_date'])}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>공시지가</Col>
							<Col xs='8' className='card_table col text end '>{data['pa_land_price'] && data['pa_land_price'].toLocaleString('ko-KR')}원</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center'>지상 층면적</Col>
							<Col xs='8' className='card_table col text end '>{data['fl_area'] && data['fl_area'].toLocaleString('ko-KR')}{'m\xB2'}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center'>지하 층면적</Col>
							<Col xs='8' className='card_table col end '>{data['bf_area'] && data['bf_area'].toLocaleString('ko-KR')}{'m\xB2'}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center'>임대 가능면적</Col>
							<Col xs='8' className='card_table col text number end '>{data['rentable_area'] && data['rentable_area'].toLocaleString('ko-KR')}{'m\xB2'}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>조경면적</Col>
							<Col xs='8' className='card_table col number end '>{data['garden_area'] && data['garden_area'].toLocaleString('ko-KR')}{'m\xB2'}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>장부가</Col>
							<Col xs='8' className='card_table col text end '>{data['book_value_price'] && data['book_value_price'].toLocaleString('ko-KR')}원</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>임대가 환산율</Col>
							<Col xs='8' className='card_table col end '>{data['base_rate'] && data['base_rate'].toLocaleString('ko-KR')}%</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>4층 유무</Col>
							<Col xs='8' className='card_table col text start '>{trueFalseCustom(data['use_fl_4'])}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4' className='card_table col col_color text center '>13층 유무</Col>
							<Col xs='8' className='card_table col start '>{trueFalseCustom(data['use_fl_13'])}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>전면 도로폭</Col>
							<Col xs='8' className='card_table col text end '>{data['front_road_width'] && data['front_road_width'].toLocaleString('ko-KR')}m</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table row'>
							<Col xs='4' className='card_table col col_color text center '>후면 도로폭</Col>
							<Col xs='8' className='card_table col end '>{data['back_load_width'] && data['back_load_width'].toLocaleString('ko-KR')}m</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>측면 도로폭</Col>
							<Col xs='8' className='card_table col text end '>{data['side_road_width'] && data['side_road_width'].toLocaleString('ko-KR')}m</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>옥내 주차대수</Col>
							<Col xs='8' className='card_table col text end '>{data['parking_unit_indoor'] && data['parking_unit_indoor'].toLocaleString('ko-KR')}대</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>옥탁 유무</Col>
							<Col xs='8' className='card_table col text start '>{trueFalseCustom(data['ph'])}</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>옥외 주차대수</Col>
							<Col xs='8' className='card_table col text end '>{data['parking_unit_outdoor'] && data['parking_unit_outdoor'].toLocaleString('ko-KR')}대</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>E/L대수</Col>
							<Col xs='8' className='card_table col text end '>{data['el_unit'] && data['el_unit'].toLocaleString('ko-KR')}대</Col>
						</Row>
					</Col>
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>E/S대수</Col>
							<Col xs='8' className='card_table col text end '>{data['es_unit'] && data['es_unit'].toLocaleString('ko-KR')}대</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='6'>
						<Row className='card_table table_row'>
							<Col xs='4'  className='card_table col col_color text center '>비고</Col>
							<Col xs='8' className='card_table col text start '>{data['comments']}</Col>
						</Row>
					</Col>
				</Row>
				</CardBody>
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
					<Button color="primary" onClick={() => setUpdate(!update)}>
						수정
					</Button>
						
				</CardFooter>
			</div>
		</Fragment>
	)
}

export default EtcTabData