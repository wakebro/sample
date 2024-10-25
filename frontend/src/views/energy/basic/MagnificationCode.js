import { Fragment } from "react"
import EnergyDatatable from "../EnergyDatatable"
import { Button, Col, Row } from "reactstrap"
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { useSelector } from "react-redux"
import { checkOnlyView } from "../../../utility/Utils"
import { ENERGY_BASIC_MAGIFICATION } from "../../../constants/CodeList"


const MagnificationCode = (props) => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const {handleEditModal, data, handleDeleteModal} = props

    const columns = [
        {
            name: '건물',
            cell: row => row.building
        },
        {
            name: '적용배열(일반전력)',
            cell: row => row.general_electric.toLocaleString('ko-KR')
        }, 
        {
            name: '적용배열(빙축열)',
            cell: row => row.ice_storage.toLocaleString('ko-KR')
        }, 
        {
            name: '적용단가(중, 저압)',
            cell: row => row.pressure.toLocaleString('ko-KR')
        }, 
        {
            name: '적용단가(취사)',
            cell: row => row.cooking.toLocaleString('ko-KR')
        },
        {
            name: '관리',
            cell : row => {
                return (
                    <Fragment key={row.id}>
                        <Row style={{width:'100%', padding:0}}>
                            <Col  xs={12} lg={6} style={{textAlign:'center'}}>
                                <Row>
                                    <Button hidden={checkOnlyView(loginAuth, ENERGY_BASIC_MAGIFICATION, 'available_update')}
                                        size='sm' color='primary' outline onClick={() => handleEditModal(row.id)}>수정</Button>
                                </Row>
                            </Col>
                            <Col  xs={12} lg={6} style={{textAlign:'center'}}>
                                <Row>
                                    <Button hidden={checkOnlyView(loginAuth, ENERGY_BASIC_MAGIFICATION, 'available_delete')}
                                        size='sm' outline onClick={() => handleDeleteModal(row.id)}>삭제</Button>
                                </Row>
                            </Col>
                        </Row>
                    </Fragment>
                )
            }
        }
    ]

    return (
        <Fragment>
            <EnergyDatatable 
                columns={columns}
                selectType={false}
                tableData={data}
            />
        </Fragment>
    )

}

export default MagnificationCode