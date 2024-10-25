import { Fragment, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, Col, Form, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import Cookies from "universal-cookie"
import { API_FACILITY_MATERIAL_REQUEST_FORM } from "../../../../constants"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import CustomDataTable from "../../../../components/CustomDataTable"
import axios from "axios"
import { sweetAlert } from "../../../../utility/Utils"

const FormModal = (props) => {
    useAxiosIntercepter()
    const cookies = new Cookies()
	const [modalTableSelect, setModalTableSelect] = useState([])
    const { modal, toggle, setDetailData, state, setTableSelect, detailDataIds } = props
    const columns = [
        {
            name: '직종',
            cell: row => row.employee_class,
            width: '100px'
        },
        {
            name: '자재코드',
            cell: row => row.material_code
        },
        {
            name: '규격',
            cell: row => row.capacity
        },
        {
            name: '자재명',
            cell: row => row.model_no
        },
        {
            name: '재고수량',
            cell: row => <Col style={{ textAlign: 'end' }}>{row?.stock?.toLocaleString('ko-KR') ?? 0}</Col>,
            width: '100px'
        },
        {
            name: '단위',
            cell: row => row.unit,
            width: '100px'
        }
    ]
    const [data, setData] = useState()
    const {
        handleSubmit
    } = useForm()

    const onSubmit = () => {
        const modalTableSelectIds = modalTableSelect.map(item => item.id)
        if (state === 'register') {
            const stop = modalTableSelectIds.some(item => detailDataIds.includes(item))
            if (!stop) {
                const temp = modalTableSelect.map((item)  => (
                    {id: item.id, material: item, request_quantity: '', unit_price: ''}
                ))
                setDetailData((prev) => [...prev, ...temp])
                setTableSelect([])
                toggle()
            } else if (stop) {
                sweetAlert('', '동일한 자재가 이미 등록되어 있습니다.', 'warning')
            }
        } else if (state === 'modify') {
            const detailTemp = detailDataIds.map(item => item.material.id)
            const stop = modalTableSelectIds.some(item => detailTemp.includes(item))
            if (!stop) {
                const temp = modalTableSelect.map((item) => (
                    {id: -1 * item.id, material: item, request_quantity: '', unit_price: ''}
                ))
                setDetailData((prev) => [...prev, ...temp])
                toggle()
            } else if (stop) {
                sweetAlert('', '동일한 자재가 이미 등록되어 있습니다.', 'warning')
            }
        }
    }

    useEffect(() => {
        axios.get(`${API_FACILITY_MATERIAL_REQUEST_FORM}/-1`, {params: {property_id: cookies.get('property').value, user_id: cookies.get('userId')}})
        .then(res => {
            setData(res.data.material)
        })
        .catch(res => {
            console.log(API_FACILITY_MATERIAL_REQUEST_FORM, res)
        })
    }, [])

    return (
        <Fragment>
            {data &&
                <>
                    <Modal isOpen={modal} toggle={toggle} size='lg'>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <ModalHeader>자재코드</ModalHeader>
                            <ModalBody style={{padding: 0}}>
                                <CustomDataTable
                                    tableData={data}
                                    columns={columns}
                                    setTableSelect={setModalTableSelect}
                                    selectType={true}
                                />
                            </ModalBody>
                            <ModalFooter className='mt-1' style={{display:'flex', justifyContent:'end', alignItems:'center', borderTop: '1px solid #B9B9C3'}}>
                                <Button color='report' className="mx-1" onClick={toggle}>취소</Button>
                                <Button type='submit' color='primary'>확인</Button>
                            </ModalFooter>
                        </Form>
                    </Modal>
                </>
            }
        </Fragment>
    )
}

export default FormModal