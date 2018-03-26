import React from 'react'
import { storiesOf } from '@storybook/react'
import { Field, fieldNames } from 'components/ModelField'
import { boolean } from '@storybook/addon-knobs'

import mooch from '../upload/assets/mooch.jpg'

const initialState = {
  choice: {
    value: '2',
    choices: [
      { value: '1', display_name: 'foo' },
      { value: '2', display_name: 'bar' },
    ],
  },
  string: { value: 'foo' },
  integer: { value: 42 },
  date: { value: '1975-02-19' },
  datetime: { value: '1975-02-19T22:50:00' },
  text: { value: 'foobar foobar foobar', rows: 10 },
  link: { value: 'https://example.com' },
  thumb: { value: mooch },
  email: { value: 'mooch@example.com' },
  phone: { value: '555-12-345' },
  // stints: { value: [] },
  // image: { value: mooch },
  // pdf: { value: mooch },
}

class FormFields extends React.Component {
  constructor(props) {
    super(props)
    this.state = initialState
    this.changeState = key => e => {
      console.log(key, e.target.value)
      this.setState(R.assocPath([key, 'value'], e.target.value))
    }
  }
  render() {
    return (
      <section style={{ display: 'flex', flexDirection: 'column' }}>
        {R.pipe(
          R.mapObjIndexed((props, key) => (
            <Field
              key={key}
              onChange={this.changeState(key)}
              label={key}
              type={key}
              editable={this.props.editable}
              {...props}
            />
          )),
          R.values
        )(this.state)}
      </section>
    )
  }
}

storiesOf('Form fields', module).addWithJSX('editable', () => (
  <FormFields editable={boolean('editable')} />
))
