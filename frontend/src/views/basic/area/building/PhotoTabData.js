import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment } from "react"
import Swal from 'sweetalert2'
import { Button, CardBody, CardFooter, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import { useNavigate } from 'react-router'
import { API_SPACE_DETAIL_BUILDING_PHOTO_DETAIL } from '../../../../constants'
import axios from "../../../../utility/AxiosConfig"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import {sweetAlert, axiosSweetAlert, primaryColor} from '../../../../utility/Utils'

const PhotoTabData = (props) => {
	useAxiosIntercepter()
	const navigate = useNavigate()
	const { data, update, setUpdate} = props

	const delectPhoto = () => {
		Swal.fire({
			icon: "warning",
			html: "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
			showCancelButton: true,
			showConfirmButton: true,
			heightAuto: false,
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
				axios.delete(API_SPACE_DETAIL_BUILDING_PHOTO_DETAIL, {
					params: {id : data.building_attachment.id}
				}).then(res => {
					if (res.status === 200) {
						axiosSweetAlert(`건물사진 삭제 완료`, `건물사진 삭제가 완료되었습니다.`, 'success', 'center', null)
						navigate(-1)
					} else {
						sweetAlert(`건물사진 삭제 실패`, `건물사진 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
					}
				})
				.catch(() => {
					sweetAlert(`건물사진 삭제 실패`, `건물사진 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
				})
			} else {
                Swal.fire({
                    icon: "info",
                    html: "취소하였습니다.",
                    showCancelButton: true,
                    showConfirmButton: false,
                    heightAuto: false,
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
	
	return (
		<Fragment>
			<CardBody>
				<Row className='card_table top' >
					<Col  xs='12'>
						<Row className='card_table table_row'>
							<Col xs='2'  className='card_table col col_color text center '>제목</Col>
							<Col xs='10' className='card_table col text start '>{data !== undefined && data.building_attachment.name}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='12'>
						<Row className='card_table table_row'>
							<Col xs='2'  className='card_table col col_color text center '>등록자</Col>
							<Col xs='10' className='card_table col text start '>{data !== undefined && data.building_attachment.user}</Col>
						</Row>
					</Col>
				</Row>
				<Row className='card_table mid' >
					<Col xs='12'>
						<Row className='card_table table_row'>
							<Col xs='2'  className='card_table col col_color text center '>이미지</Col>
							<Col xs='10' className='card_table col text start' style={{height : '520px'}}>
								<img src={`/static_backend/${data.path}${data.file_name}`} style={{height:"100%", width: '100%', objectFit:'contain'}}></img>
							</Col>
						</Row>
					</Col>
				</Row>
			</CardBody>
			<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
				<Button onClick={() => delectPhoto()} color="danger">
					삭제
				</Button>
				<Button className="ms-1" onClick={() => setUpdate(!update)} color="primary">
					수정
				</Button>
				<Button className="ms-1" onClick={() => navigate(-1)}>
					목록
				</Button>
			</CardFooter>
		</Fragment>
	)
}

export default PhotoTabData