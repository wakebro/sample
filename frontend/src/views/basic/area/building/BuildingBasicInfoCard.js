import { useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle } from 'reactstrap'
import { API_SPACE_SUMMARY_DETAIL_BUILDING } from '../../../../constants'
import axios from "../../../../utility/AxiosConfig"
import DetailSummary from "./DetailSummary"
import UpdateSummary from "./UpdateSummary"
import { useState, useEffect } from "react"

const BuildingBasicInfoCard = (props) => {
	const {check} = props
	const [update, setUpdate] = useState(false)
	const [summaryData, setSummaryData] = useState({})
	const [files, setFiles] = useState([])
	const {type} = useParams()
	const getHistory = () => {
		axios.get(API_SPACE_SUMMARY_DETAIL_BUILDING, {
			params : {id : type}
		})
		.then(res => {
			setSummaryData(res.data)
			if (res.data.image !== null) {
				setFiles([res.data.image])
			}
		})
		.catch(() => {

		})
	}
	useEffect(() => {
		getHistory()
	}, [check])

	return (
		<Card >
			<CardHeader>
				<CardTitle>
					건물기본정보
				</CardTitle>
			</CardHeader>
			{update ? 
				<UpdateSummary files={files} setFiles={setFiles} data={summaryData} setUpdate={setUpdate} update={update} getHistory={() => getHistory()}/>
				:
				<DetailSummary setUpdate={setUpdate} update={update} data={summaryData}/>
			}
		</Card>
	)
}

export default BuildingBasicInfoCard