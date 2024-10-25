import axios from 'axios'
import Select from 'react-select'
import { useEffect, useState } from "react"
import {API_BUILIDNG_SELECT_LIST} from '../../../../../constants'

export const BuildingSelectTable = (props) => {
    const {setSelectedBuilding, cookies, selectBuilding, setBuildingListLength} = props
    const [buildingList, setBuildingList] = useState([{ value:'', label: '건물전체'}])

    useEffect(() => {
		axios.get(API_BUILIDNG_SELECT_LIST, { params:{property:cookies.get('property').value}})
        .then(res => {
        const buildingList = []
            if (res.data) {
				for (let i = 0; i < res.data.length; i++) {
					buildingList.push({value:res.data[i].id, label: `${res.data[i].name} (${res.data[i].code})`})
				}
                setBuildingList(prevList => [...prevList, ...buildingList])
			}
        })
	}, [])

    if (setBuildingListLength) {
        useEffect(() => {
            setBuildingListLength(buildingList.length)
        }, [buildingList])
    }

    return (
        <Select
            classNamePrefix={'select'}
            className="react-select"
            options={buildingList}
            value={selectBuilding}
            onChange={(e) => setSelectedBuilding(e)}
        />
    )
}