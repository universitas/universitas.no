import { storiesOf } from '@storybook/react'
import Select, { Select as DumbSelect } from 'components/Select'
import modelSpec from 'components/Select/models'
import initialState from './fixtures/state.js'
import { object, boolean, select, radios } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

const reshape = R.map(
  R.pipe(
    R.propOr(props => ({ value: props.id, label: 'foo' }), 'reshape'),
    R.map,
  ),
)(modelSpec)

const models = R.pipe(
  R.pick(['contributors', 'photos', 'storytypes', 'issues', 'stories']),
)(initialState)

const menuIsOpen = () => boolean('always open', false) || undefined

const reducer = (state = {}, action) => R.merge(state, action.payload)

const store = createStore(reducer, initialState)
const onChange = action('onChange')

class StateFulSelect extends React.Component {
  state = { value: null }
  render() {
    return (
      <Select
        {...this.props}
        onChange={value => this.setState({ value })}
        value={this.state.value}
      />
    )
  }
}

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
        <React.Fragment>
          <h2>{model}</h2>
          <StateFulSelect key={model} model={model} menuIsOpen={menuIsOpen} />
        </React.Fragment>
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
