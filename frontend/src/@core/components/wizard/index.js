// ** React Imports
import { useEffect, Fragment, forwardRef } from "react"

// ** Third Party Components
import Stepper from "bs-stepper"
import classnames from "classnames"
import { PropTypes } from "prop-types"
import { ChevronRight, CheckCircle } from "react-feather"
import { signIndex } from "../../../views/Report/ReportData"

// ** Styles
import "bs-stepper/dist/css/bs-stepper.min.css"
import "../../../@core/scss/base/plugins/forms/form-wizard.scss"
import { sweetAlert } from "../../../utility/Utils"

const Wizard = forwardRef((props, ref) => {
  // ** Props
  const {
    type,
    steps,
    // options,
    instance,
    separator,
    className,
    headerClassName,
    contentClassName,
    contentWrapperClassName,
    userSign,
    activeIndex,
    setActiveIndex
  } = props

  // ** State

  // ** Vars
  const stepper = null

  const handleNextPage = (step) => {
    const index =  signIndex[step.id]

    if (userSign[0] === '') {
		  sweetAlert('', '담당자를 선택해 주세요.', 'warning', 'center')
      setActiveIndex(0)
    } else {
      setActiveIndex(index)
    }
  }

  // ** Step change listener on mount
  useEffect(() => {
    // stepper = new Stepper(ref.current, options)
    ref.current.addEventListener("shown.bs-stepper", function (event) {
      if (userSign[activeIndex] === '') {
        setActiveIndex(activeIndex)
      } else {
        setActiveIndex(event.detail.indexStep)
      }
    })
    if (instance) {
      instance(stepper)
    }
  }, [])

  // ** Renders Wizard Header
  const renderHeader = () => {
    return steps.map((step, index) => {
      return (
        <Fragment key={step.id}>
          {index !== 0 && index !== steps.length ? (
            <div className="line">{separator}</div>
          ) : null}
          <div
            className={classnames("step", {
              crossed: activeIndex > index,
              active: index === activeIndex
            })}
            data-target={`#${step.id}`}
          >
            <button type="button" className="step-trigger" onClick={() => handleNextPage(step)}>
              {/* onClick={() => handleNextPage(step)} */}
              <span className="bs-stepper-label">
                <span className="bs-stepper-title">{step.title} {index === activeIndex ? <CheckCircle size={21}/> : null}</span>
                {step.subtitle ? (
                  <span className="bs-stepper-subtitle">{step.subtitle}</span>
                ) : null}
              </span>
            </button>
          </div>
        </Fragment>
      )
    })
  }

  // ** Renders Wizard Content
  const renderContent = () => {
    return steps.map((step, index) => {
      return (
        <div
          className={classnames("content", {
            [contentClassName]: contentClassName,
            "active dstepper-block": activeIndex === index
          })}
          id={step.id}
          key={step.id}
        >
          {step.content}
        </div>
      )
    })
  }

  return (
    <div
      ref={ref}
      className={classnames("bs-stepper", {
        [className]: className,
        vertical: type === "vertical",
        "vertical wizard-modern": type === "modern-vertical",
        "wizard-modern": type === "modern-horizontal"
      })}
    >
      <div
        style={{padding: '1rem 6rem 1.5rem 1rem'}}
        className={classnames("bs-stepper-header", {
          [headerClassName]: headerClassName
        })}
      >
        {renderHeader()}
      </div>
      <div
        className={classnames("bs-stepper-content", {
          [contentWrapperClassName]: contentWrapperClassName
        })}
      >
        {renderContent()}
      </div>
    </div>
  )
})

export default Wizard

// ** Default Props
Wizard.defaultProps = {
  options: {},
  type: "horizontal",
  separator: <ChevronRight size={17} />
}

// ** PropTypes
Wizard.propTypes = {
  type: PropTypes.string,
  instance: PropTypes.func,
  options: PropTypes.object,
  className: PropTypes.string,
  separator: PropTypes.element,
  headerClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  contentWrapperClassName: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      icon: PropTypes.any,
      content: PropTypes.any.isRequired
    })
  ).isRequired
}
