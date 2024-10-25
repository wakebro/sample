import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment, useState, useEffect } from "react"
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle } from "reactstrap"
import { API_SPACE_DETAIL_BUILDING} from '../../../../constants'
import { useParams } from "react-router-dom"
import axios from "../../../../utility/AxiosConfig"
import BuildingTabData from './BuildingTabData'
import BuildingTabUpdate from './BuildingTabUpdate'

const BuildingTab = () => {
	const {type} = useParams()
	const [update, setUpdate] = useState(false)
	const [data, setData] = useState({})
	const getHistory = () => {
		axios.get(API_SPACE_DETAIL_BUILDING, {
			params : {id : type}
		})
		.then(res => {
			setData(res.data)
			console.log(res.data)
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
								건물개요
							</CardTitle>
						</CardHeader>
						{update ? 
							<BuildingTabUpdate data = {data}  update={update} setUpdate={setUpdate} type = {type} />
						:
							<BuildingTabData data = {data} update={update} setUpdate={setUpdate} />
						}
					</Card>		
		</Fragment>
	)
}

export default BuildingTab