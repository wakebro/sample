import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment, useState, useEffect } from "react"
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle } from "reactstrap"
import { API_SPACE_DETAIL_BUILDING} from '../../../../constants'
import { useParams } from "react-router-dom"
import axios from "../../../../utility/AxiosConfig"
import EtcTabData from './EtcTabData'
import EtcTabUpdate from './EtcTabUpdate'

const EtcTab = () => {
	const {type} = useParams()
	const [update, setUpdate] = useState(false)
	const [data, setData] = useState({})
	const getHistory = () => {
		axios.get(API_SPACE_DETAIL_BUILDING, {
			params : {id : type}
		})
		.then(res => {
			setData(res.data)
		})
		.catch(() => {

		})
	}
	useEffect(() => {
		getHistory()
	}, [update])

	return (
		<Fragment>
					<Card >
						<CardHeader>
							<CardTitle>
								기타정보
							</CardTitle>
						</CardHeader>
						{update ? 
							<EtcTabUpdate data = {data}  update={update} setUpdate={setUpdate} type = {type} />
						:
							<EtcTabData data = {data} update={update} setUpdate={setUpdate} />
						}
					</Card>		
		</Fragment>
	)
}

export default EtcTab