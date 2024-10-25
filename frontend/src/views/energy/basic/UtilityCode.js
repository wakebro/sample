import { Fragment } from "react"
import EnergyDatatable from "../EnergyDatatable"
import { Button, Col, Row } from "reactstrap"
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { useSelector } from "react-redux"
import { checkOnlyView } from "../../../utility/Utils"
import { ENERGY_BASIC_UTILITY_CODE } from "../../../constants/CodeList"


const UtilityCode = (props) => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const {handleEditModal, data, handleDeleteModal} = props

    const columns = [
        {
            name: '코드',
            selector: row => row.code
        },
        {
            name: '수광비코드',
            selector: row => row.description
        }, 
        {
            name: '관리',
            cell : row => {
                return (
                    <Fragment key={row.id}>
                        <Row style={{width:'100%', padding:0}}>
                            <Col  xs={12} lg={6} style={{textAlign:'center'}}>
                                <Row>
                                    <Button hidden={checkOnlyView(loginAuth, ENERGY_BASIC_UTILITY_CODE, 'available_update')}
                                        size='sm' color='primary' outline onClick={() => handleEditModal(row.id)}>수정</Button>
                                </Row>
                            </Col>
                            <Col  xs={12} lg={6} style={{textAlign:'center'}}>
                                <Row>
                                    <Button hidden={checkOnlyView(loginAuth, ENERGY_BASIC_UTILITY_CODE, 'available_delete')}
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

export default UtilityCode