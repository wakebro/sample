// import { useNavigate } from "react-router-dom"
import { Button } from "reactstrap"

const Tab = (props) => {
    const { active, setActive } = props
    // const navigate = useNavigate()

    const handleTabClick = (e) => {
        setActive(e)
    }

    return (
        <div className='mb-1' style={{ padding: 0, display: 'flex' }}>
            <Button outline={active !== "info"} color={active === 'info' ? 'primary' : 'link'} style={{ marginRight: '1%' }} onClick={() => handleTabClick('info')}>직원정보</Button>
            <Button outline={active !== "certificate"} color={active === "certificate" ? "primary" : "link"} style={{ marginRight: '1%' }} onClick={() => handleTabClick('certificate')}>자격증정보</Button>
        </div>
    )
}

export default Tab