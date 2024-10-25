import { useEffect, useState, useRef } from "react"
import { Col, Row} from "reactstrap"
import { useNavigate } from "react-router-dom"

// 대시 보드 공지사항 롤릴 component
const  DashBoardRollingDiv = (props) => {

  // 공지사항 없으면 출력
  if (!props.informRows) {
    return (
      <>
        <span className="dashboard-custom-text">공지사항이 없습니다.</span>
      </>
    )
  }

  // props 공지사항 목록 받아옴.
  const informs = props.informRows

  // 롤링을 위한 인덱스 state
  const [idx, setIdx] = useState(0)
  // 롤링을 위한 변수 관리 ref
  const idxRef = useRef(0)
  //
  const navigate = useNavigate()
  
  // 4000 을 기준으로 롤링
  useEffect(() => {
    setInterval(() => {
      if (informs.length === 0) {  // 처음에 length가 0으로 들어와서 NaN을 방지하기 위한 조건문
        return
      }
      idxRef.current = (idxRef.current + 1) % informs.length 
      setIdx(idxRef.current)
    }, 4000)
  }, [informs.length])

  // inform detail move onclick func
  const onClickMoveInformDetail = (e, id) => {
    if (e.type !== 'click') {
      return
    }
    if (!id || id.length === 0) {
      return
    }
    navigate(`/intranet/announcements/detail/${id}`)
  }

  return (
    <ul className="dashboard_roll_div">
      <div className=" dashboard_roll_container" style={{ transform: `translateY(-${25 * idx}px)` }}>
        {informs.map((item, idx) => {
          return (
            <li className="dashboard_roll_content" key={idx}>
              <Row>
                <Col lg={3} xs={6} className="dashboard-custom-text-bold dashboard-custom-overflow">{item['create_datetime']}</Col>
                <Col 
                  lg={8} xs={6} 
                  className="dashboard-custom-text dashboard-custom-overflow" 
                  onClick={(e) => { onClickMoveInformDetail(e, item['id']) }}
                  style={{cursor:'pointer'}}
                >{item['subject']}</Col>
              </Row>
            </li>
          )
        })}
      </div>
    </ul>
  )
}
export default  DashBoardRollingDiv
