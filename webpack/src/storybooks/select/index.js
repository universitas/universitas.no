import { storiesOf } from '@storybook/react'
import Select, { Select as DumbSelect } from 'components/Select'
import initialState from './fixtures/state.js'
import { object, boolean, select, radios } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const models = R.pipe(
  R.pick(['contributors', 'photos', 'storytypes', 'issues', 'stories']),
  R.map(R.pipe(R.prop('items'), R.values, R.slice(0, 5))),
)(initialState)

const menuIsOpen = () => boolean('always open', false) || undefined

const reducers = R.tap(action('dispatch'))
const store = createStore(reducers, initialState)
const onChange = action('onChange')

storiesOf('Select', module)
  .addWithJSX('dumb ModelSelect', () => {
    const modelName = radios('model', R.keys(models), 'contributors')
    const options = models[modelName]
    const model = boolean('plain?', false) ? undefined : modelName
    const menuIsOpen = boolean('open', true) ? true : undefined
    return (
      <DumbSelect
        {...{ options, model, menuIsOpen }}
        key={model}
        onChange={onChange}
      />
    )
  })
  .addWithJSX('connected ModelSelect', () => {
    const model = radios('model', R.keys(models), 'contributors')
    const menuIsOpen = boolean('open', true) ? true : undefined
    return (
      <Provider store={store}>
        <Select {...{ model, menuIsOpen }} key={model} onChange={onChange} />
      </Provider>
    )
  })
  .addWithJSX('plain Select', () => {
    const options = object('options', [
      { value: 1, label: 'one' },
      { value: 2, label: 'two' },
    ])
    return <Select options={options} onChange={onChange} />
  })
