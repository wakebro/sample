import { Fragment } from "react"
import { Button, Col, Input, InputGroup, Row } from "reactstrap"
import { BuildingSelectTable } from "../../basic/area/contract/list/BuildingSelect"

const Filter = (props) => {
    const {typecode, cookies, search, setSearch, handleSaarch, setSelectBuilding, selectBuilding, setBuildingListLength} = props

    return (
        <Fragment>
            <Row>
                <Col md={5}>
                    {typecode === 'utilitycode' &&
                        <Col className="mb-1">
                            <InputGroup>
                                <Input
                                    maxLength={250} 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder='코드 또는 수광비코드를 검색해보세요.'
                                />
                                <Button 
                                    style={{zIndex:0}}
                                    onClick={() => handleSaarch()}>
                                    검색
                                </Button>
                            </InputGroup>
                        </Col>
                    }
                    {typecode === 'magnification' &&
                        <Row className="mb-1">
                            <BuildingSelectTable 
                                setSelectedBuilding={setSelectBuilding}
                                cookies={cookies}
                                selectBuilding={selectBuilding}
                                setBuildingListLength={setBuildingListLength}
                            />
                        </Row>
                    }
                    {typecode === 'utilityentry' &&
                        <Row>
                            <Col md={5} className="mb-1">
                                <BuildingSelectTable 
                                    setSelectedBuilding={setSelectBuilding}
                                    cookies={cookies}
                                    selectBuilding={selectBuilding}
                                    setBuildingListLength={setBuildingListLength}
                                />
                            </Col>
                            <Col md={7} className="mb-1">
                                <InputGroup>
                                    <Input 
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder='코드명을 검색해보세요.'
                                    />
                                    <Button 
                                        style={{zIndex:0}}
                                        onClick={() => handleSaarch()}>
                                        검색
                                    </Button>
                                </InputGroup>
                            </Col>
                        </Row>
                    }

                </Col>
            </Row>
        </Fragment>

    )
}
export default Filter