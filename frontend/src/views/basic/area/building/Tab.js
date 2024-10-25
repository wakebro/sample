import { useNavigate } from "react-router-dom"
import { Button } from "reactstrap"

const Tab = (props) => {
    const { id, active } = props
    const navigate = useNavigate()

    const handleTabClick = (e) => {
        navigate(`/basic-info/area/building/${e}/${id}`)
    }

    return (
        <div className='mb-1' style={{ padding: 0, display: 'flex' }}>
            <Button outline={active !== "building-index"} color={active === 'building-index' ? 'primary' : 'link'} style={{ marginRight: '1%' }} onClick={() => handleTabClick('building-index')}>건물개요</Button>
            <Button outline={active !== "etc"} color={active === "etc" ? "primary" : "link"} style={{ marginRight: '1%' }} onClick={() => handleTabClick('etc')}>기타정보</Button>
            <Button outline={active !== "photo"} color={active === "photo" ? "primary" : "link"} style={{ marginRight: '1%' }} onClick={() => handleTabClick('photo')}> 사진 </Button>
            {/* <Button outline={active !== "drawing"} color={active === "drawing" ? "primary" : "link"} onClick={() => handleTabClick('drawing')}> 도면 </Button> */}
        </div>
    )
}

export default Tab