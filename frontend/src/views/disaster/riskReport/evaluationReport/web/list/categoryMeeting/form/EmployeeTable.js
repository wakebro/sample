import DisasterEmployeeModal from "../../categoryEducation/component/EmployeeModal"
import { Fragment } from "react"
import { Row, Col } from 'reactstrap'

const EmployeeTable = (props) => {
    const {cookies, isOpen, setIsOpen, selectPartner, setSelectPartner, setAttendState, title} = props
    return (
        <Fragment>
            {selectPartner.length === 0 ? 
                <Row className="mb-2">
                    <Col md={6} xs={12} className="pe-1" style={{paddingTop:'5px'}}>
                        <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Col lg='2' md='2' xs='3' className='card_table col col_gray text center border-b' style={{backgroundColor:'report'}}>번호</Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b'>직책</Col>
                            <Col lg='4' md='4' xs='3'  className='card_table col col_gray text center border-b'>서명</Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b'>사인</Col>
                        </Row>
                        <Row className="card_table mx-0" style={{ borderRight: '1px solid #B9B9C3'}}>
                            <Col lg='2' md='2' xs='3'  className='card_table col col_gray text center border-b'>1</Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b'></Col>
                            <Col lg='4' md='4' xs='3'  className='card_table col col_gray text center border-b'></Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b'></Col>
                        </Row>
                    </Col>
                    <Col md={6} xs={12} className="pe-1" style={{paddingTop:'5px'}}>
                        <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Col lg='2' md='2' xs='3'  className='card_table col col_gray text center border-b'>번호</Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b'>직책</Col>
                            <Col lg='4' md='4' xs='3'  className='card_table col col_gray text center border-b'>서명</Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b'>사인</Col>
                        </Row>
                        <Row className="card_table mx-0" style={{borderRight: '1px solid #B9B9C3'}}>
                            <Col lg='2' md='2' xs='3'  className='card_table col col_gray text center border-b'>2</Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b'></Col>
                            <Col lg='4' md='4' xs='3'  className='card_table col col_gray text center border-b'></Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_gray_b'></Col>
                        </Row>
                    </Col>
                </Row>
                :
                <Row className="mb-2">
                    <Col md={6} xs={12} className="pe-1" style={{paddingTop:'5px'}}>
                        <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Col lg='2' md='2' xs='3' className='card_table col col_color text center border-b' style={{backgroundColor:'report'}}>번호</Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_b'>직책</Col>
                            <Col lg='4' md='4' xs='3'  className='card_table col col_color text center border-b'>서명</Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_b'>사인</Col>
                        </Row>
                        {selectPartner.map((user, index) => {
                            return (
                                (index <= Math.floor(selectPartner.length / 2)) && (
                                // const count = Math.floor(index / 2) + 1
                                    <Row className="card_table mx-0" key={`partner${user.name ? user.name : user.emp_name}`} style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Col lg='2' md='2' xs='3'  className='card_table col text center border-b border-left'>{index + 1}</Col>
                                        <Col lg='3' md='3' xs='3'  className='card_table col text center border-b border-left'>{user.position ? user.position : user.emp_class}</Col>
                                        <Col lg='4' md='4' xs='3'  className='card_table col center border-b border-left' style={{wordBreak:'break-all'}}>{user.name ? user.name : user.emp_name}</Col>
                                        <Col lg='3' md='3' xs='3'  className='card_table col text center border-b border-left'>{user.sign !== null ? '등록' : '미등록'}</Col>
                                    </Row>
                                )
                            )
                        })}
                    </Col>
                    <Col md={6} xs={12} className="pe-1" style={{paddingTop:'5px'}}>
                        <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Col lg='2' md='2' xs='3' className='card_table col col_color text center border-b' style={{backgroundColor:'report'}}>번호</Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_b'>직책</Col>
                            <Col lg='4' md='4' xs='3'  className='card_table col col_color text center border-b'>서명</Col>
                            <Col lg='3' md='3' xs='3'  className='card_table col text center col_b'>사인</Col>
                        </Row>
                        {selectPartner.map((user, index) => {
                            return (
                                (index > Math.floor(selectPartner.length / 2)) && (
                                    <Row className="card_table mx-0" key={`partner${user.name ? user.name : user.emp_name}`} style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                                        <Col lg='2' md='2' xs='3'  className='card_table col text center border-b border-left'>{index + 1}</Col>
                                        <Col lg='3' md='3' xs='3'  className='card_table col text center border-b border-left'>{user.position ? user.position : user.emp_class}</Col>
                                        <Col lg='4' md='4' xs='3'  className='card_table col center border-b border-left' style={{wordBreak:'break-all'}}>{user.name ? user.name : user.emp_name}</Col>
                                        <Col lg='3' md='3' xs='3'  className='card_table col text center border-b border-left'>{user.sign !== null ? '등록' : '미등록'}</Col>
                                    </Row>
                                )
                            )
                        })}
                    </Col>
                </Row>
            }
            <DisasterEmployeeModal
                modalTitle={title}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                cookies={cookies}
                attendUser={selectPartner}
                setAttendUser={setSelectPartner}
                setAttendState={setAttendState}
            />
        </Fragment>
    )
}
export default EmployeeTable