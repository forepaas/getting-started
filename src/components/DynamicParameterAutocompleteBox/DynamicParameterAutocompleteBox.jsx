import React, { useState, useEffect } from 'react'
import Select, { createFilter }  from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import { set } from 'forepaas/store/querystring/action'

const searchIcon = () => ({
  alignItems: 'center',
  display: 'flex',
  ':before': {
    fontFamily: 'FontAwesome',
    content: '"\f002"',
    marginRight: 8
  }
})

const customStyles = {
  control: (base, state) => ({
    ...base,
    height: '57px',
    borderWidth: '0px',
    boxShadow: '5px 5px -2px rgba(0, 0, 0, 0.1)'
  }),
  option: (base, state) => ({
    ...base,
    color: state.theme.colors.neutral50,
    fontSize: '13px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    letterSpacing: 0
  }),
  menu: (base, state) => ({
    ...base,
    zIndex: 2000
  }),
  multiValue: (base, state) => ({
    ...base,
    borderRadius: '21px',
    backgroundColor: state.theme.colors.primary75,
    color: state.theme.colors.neutral0,
    height: '34px',
    alignItems: 'center'
  }),
  multiValueLabel: (base, state) => ({
    ...base,
    color: state.theme.colors.neutral0,
    display: 'flex',
    alignItems: 'center',
    marginLeft: '10px',
    fontWeight: 600,
    letterSpacing: 0
  }),
  placeholder: (base, state) => ({
    ...base,
    color: state.theme.colors.neutral20,
    fontSize: '14px',
    ...searchIcon()
  }),
  multiValueRemove: (base, state) => {
    return ({
      ...base,
      color: state.theme.colors.neutral0,
      borderRadius: '10px',
      padding: '0px',
      margin: '10px',
      border: `1px solid ${state.theme.colors.neutral0}`,
      ':hover': {
        backgroundColor: state.theme.colors.neutral0,
        color: state.theme.colors.primary75,
        cursor: 'pointer'
      }
    })
  }

}

const DynamicParameterAutocompleteBox = ({ items, ...props }) => {
  const [selectedOptions, setSelectedOptions] = useState([])
  const selectedValues = useSelector((state) => state.querystring[props.id])
  const dispatch = useDispatch()
  items.sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0))

  const customTheme = theme => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: props.primaryColor || '#00CCF9',
      primary25: props.primary25Color || 'rgba(16,182,233,0.06)',
      primary50: props.primary50Color || 'rgba(16,182,233,0.20)',
      primary75: props.primary75Color || 'rgba(16,182,233,0.8)',
      neutral20: props.placeholderColor || '#97A7B7',
      neutral50: props.menuColor || '#485465'
    }
  })

  useEffect (() => {
    const mappedOptions = items.filter(item => (selectedValues || []).includes(item.value))
    setSelectedOptions(mappedOptions)
  }, [selectedValues, items])

  const updateModel = (model) => {
    if (props.id) {
      let values = (model || []).map((item) => item && item.value ? item.value : item)
      dispatch(set(props.id, values.length ? values : null))
    }
  }

  const onChange = (options) => {
    if (options && !Array.isArray(options)) {
      options = [options]
    }
    updateModel(options)
  }

  return (
    <Select 
      value={selectedOptions || []} 
      styles={customStyles} theme={customTheme} 
      options={items} 
      isMulti={props.isMulti}
      placeholder={props.placeholder}
      onChange={onChange} 
      autoFocus={true}
      isClearable={true}
      isSearchable={true}
      pageSize={10}
      closeMenuOnSelect={true}
      filterOption={createFilter({ignoreCase: true, ignoreAccents: true, trim: true, matchFrom: 'start'})}
    />
  )
}

export default DynamicParameterAutocompleteBox

