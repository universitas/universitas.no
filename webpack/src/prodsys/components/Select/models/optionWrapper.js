import cx from 'classnames'

const getDisplayName = component =>
  component.displayName || component.name || '[Anonymous]'

const optionWrapper = Inner => {
  const wrapper = ({
    innerRef,
    innerProps,
    data,
    isDisabled,
    isFocused,
    isSelected,
    ...props
  }) => (
    <div
      className={cx({
        'react-select__option': true,
        'react-select__option--is-disabled': isDisabled,
        'react-select__option--is-focused': isFocused,
        'react-select__option--is-selected': isSelected,
      })}
      ref={innerRef}
      {...innerProps}
    >
      <Inner {...data} />
    </div>
  )
  wrapper.displayName = `Option{getDisplayName(Inner)}`
  return wrapper
}

export default optionWrapper
