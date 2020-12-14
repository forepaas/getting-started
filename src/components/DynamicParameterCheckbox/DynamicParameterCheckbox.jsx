import React, { useEffect, useState } from 'react'
import CheckboxGroup from 'react-checkbox-group'
import { useSelector, useDispatch } from 'react-redux'
import { set } from 'forepaas/store/querystring/action'

const DynamicParameterCheckbox = (props) => {
  const [expanded, setExpanded] = useState(true)
  // Checked options array
  const [selectedOptions, setSelectedOptions] = useState([])
  const options = useSelector((state) => state.querystring[props.id])
  const dispatch = useDispatch()

  useEffect (() => {
    setSelectedOptions(options)
  }, [options])

  const onChange = (options) => {
    updateModel(options)
  }

  const updateModel = (model) => {
    if (props.id) {
      let value = (model || []).map((item) => item && item.value ? item.value : item)
      dispatch(set(props.id, value.length ? value : null))
    }
  }

  return (
    <div>
      <div className='dyn-title checkbox-header'>
        {props.title}
        <i onClick={() => setExpanded(!expanded)} className={`fa fa-chevron-${expanded ? 'down' : 'right'} expand-icon`} /></div>
      {expanded && <CheckboxGroup name='options' value={selectedOptions || []} onChange={onChange}>
        {(Checkbox) => (
          <React.Fragment>
            {props.items.map(option =>
              <div key={option.value}>
                <label className='dyn-checkbox-container' htmlFor={option.value}>
                  <Checkbox className='dyn-checkbox' id={option.value} value={option.value} />
                  <span className='dyn-checkbox-label'>{option.label}</span>
                </label>
              </div>)}
          </React.Fragment>
        )}
      </CheckboxGroup>}
    </div>
  )
}

DynamicParameterCheckbox.propTypes = {}

export default DynamicParameterCheckbox

