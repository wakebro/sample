import Select from 'react-select'

export const BuildingSelectTable = (props) => {
    const {setSelectedBuilding, buildingList, selectBuilding} = props

    return (
        <Select
            classNamePrefix={'select'}
            className="react-select"
            options={buildingList}
            value={selectBuilding}
            onChange={(e) => setSelectedBuilding(e)}
            placeholder='건물을 선택해주세요.'
        />
    )
}