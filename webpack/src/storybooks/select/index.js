import { storiesOf } from '@storybook/react'
import ConnectedSelect, { Select } from 'components/Select'
import initialState from './fixtures/state.js'
import { boolean, select, radios } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const models = R.pipe(
  R.pick(['contributors', 'photos', 'storytypes', 'issues', 'stories']),
  R.map(
    R.pipe(R.prop('items'), R.toPairs, R.reverse, R.slice(0, 5), R.fromPairs),
  ),
)(initialState)

const menuIsOpen = () => boolean('always open', false) || undefined

const reducers = R.tap(action('dispatch'))
const store = createStore(reducers, initialState)
const onChange = action('onChange')

storiesOf('Select', module)
  .addWithJSX('unconnected', () => {
    const modelName = radios('model', R.keys(models), 'contributors')
    const items = models[modelName]
    const model = boolean('plain?', false) ? undefined : modelName
    const menuIsOpen = boolean('open', true) ? true : undefined
    return (
      <Select
        {...{ items, model, menuIsOpen }}
        key={model}
        onChange={onChange}
      />
    )
  })
  .addWithJSX('connected', () => {
    const model = radios('model', R.keys(models), 'contributors')
    const menuIsOpen = boolean('open', true) ? true : undefined
    return (
      <Provider store={store}>
        <ConnectedSelect
          {...{ model, menuIsOpen }}
          key={model}
          onChange={onChange}
        />
      </Provider>
    )
  })
