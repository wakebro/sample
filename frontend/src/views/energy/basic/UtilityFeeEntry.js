import { Fragment } from "react"
import EnergyDatatable from "../EnergyDatatable"
import { Button, Col, Row } from "reactstrap"
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { checkOnlyView } from "../../../utility/Utils"
import { useSelector } from "react-redux"
import { ENERGY_BASIC_UTILITY_ENTRY } from "../../../constants/CodeList"

const UtilityCodeEntry = (props) => {
    useAxiosIntercepter()
    const {handleEditModal, data, handleDeleteModal} = props
    const loginAuth = useSelector((state) => state.loginAuth)
    const columns = [
        {
            name: '건물',
            cell: row => row.building
        },
        {
            name: '코드명',
            cell: row => row.code
        },
        {
            name: '관리',
            cell : row => {
                return (
                    <Fragment key={row.id}>
                        <Row style={{width:'100%', padding:0}}>
                            <Col  xs={12} lg={6} style={{textAlign:'center'}}>
                                <Row>
                                    <Button hidden={checkOnlyView(loginAuth, ENERGY_BASIC_UTILITY_ENTRY, 'available_update')}
                                        size='sm' color='primary' outline onClick={() => handleEditModal(row.id)}>수정</Button>
                                </Row>
                            </Col>
                            <Col  xs={12} lg={6} style={{textAlign:'center'}}>
                                <Row>
                                    <Button hidden={checkOnlyView(loginAuth, ENERGY_BASIC_UTILITY_ENTRY, 'available_delete')}
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
export default UtilityCodeEntry