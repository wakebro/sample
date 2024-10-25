import { Fragment } from 'react'
import classnames from 'classnames'
import { CardBody, Input, Label, CardTitle } from 'reactstrap'

const SidebarLeft = props => {
  // ** Props
  const { filters, setChoiceFilter, choiceFilter, filterCount, filterNames} = props

  const changeFilter = (filter) => {
    if (filter.id === 0) {
      if (filterCount === choiceFilter.length) {
        setChoiceFilter([])
      } else {
        setChoiceFilter(filterNames)
      }
    } else {
      if (choiceFilter.includes(filter.label)) {
        setChoiceFilter(choiceFilter.filter(item => item !== filter.label))
      } else {
        setChoiceFilter([...choiceFilter, filter.label])
      }
    }
  }

  return (
    <Fragment>
      <div className='sidebar-wrapper'>
        <CardBody className='card-body d-flex justify-content-center my-sm-0 mb-3'>
          <CardTitle style={{fontSize:'24px', color:'black'}}>일일점검 업무등록</CardTitle>
        </CardBody>
        <CardBody>
          <h5 className='section-label mb-1'>
            <span className='align-middle'>필터</span>
          </h5>
          <div className='calendar-events-filter'>
            {filters.length &&
              filters.map(filter => {
                return (
                  <div
                    key={`${filter.label}-key`}
                    className={classnames('form-check', {
                      [filter.className]: filter.className
                    })}
                  >
                    <Input
                      type='checkbox'
                      key={filter.label}
                      label={filter.label}
                      className='input-filter'
                      readOnly
                      id={`${filter.label}-event`}
                      checked={filter.id !== 0 ? choiceFilter.includes(filter.label) : filterCount === choiceFilter.length}
                      onClick={() => {
                        changeFilter(filter)
                      }}
                    />
                    <Label className='form-check-label' for={`${filter.label}-event`}>
                      {filter.label}
                    </Label>
                  </div>
                )
              })}
          </div>
        </CardBody>
      </div>
    </Fragment>
  )
}

export default SidebarLeft
