const getStyles = () => {
  const styleKeys = [
    'container' /* main component */,
    // MAIN INPUT
    'control',
    'valueContainer',
    'input',
    'singleValue',
    'placeholder',
    // MENU
    // 'menu',  /* keep for automatic flip */
    'menuList',
    'option',
    'group',
    'groupHeading',
    // INDICATORS
    'indicatorsContainer',
    'indicatorSeparator',
    'dropdownIndicator',
    'loadingIndicator',
    'clearIndicator',
    // MULTIVALUE
    // 'multiValue',
    // 'multiValueLabel',
    // 'multiValueRemove',
    // MESSAGES
    // 'loadingMessage',
    // 'noOptionsMessage',
  ]

  const styles = {}
  for (const key of styleKeys) styles[key] = () => ({})
  styles['menu'] = R.pick(['top', 'bottom'])
  return styles
}

export default getStyles()
