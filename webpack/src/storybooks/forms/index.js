import React from 'react'
import { storiesOf } from '@storybook/react'
import { Field, fieldNames } from 'components/ModelField'
import { boolean } from '@storybook/addon-knobs'

import mooch from '../assets/mooch.jpg'

const initialState = {
  choice: {
    value: null,
    choices: [
      { value: '1', display_name: 'one' },
      { value: '2', display_name: 'two' },
      { value: '3', display_name: 'three' },
      { value: '4', display_name: 'four' },
      { value: '5', display_name: 'five' },
      { value: '6', display_name: 'six' },
      { value: '7', display_name: 'seven' },
      { value: '8', display_name: 'eight' },
      { value: '9', display_name: 'nine' },
      { value: '10', display_name: 'ten' },
      { value: '11', display_name: 'eleven' },
      { value: '12', display_name: 'twelve' },
      { value: '13', display_name: 'thirteen' },
      { value: '14', display_name: 'fourteen' },
      { value: '15', display_name: 'fifteen' },
      { value: '16', display_name: 'sixteen' },
    ],
  },
  string: {
    value:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod',
  },
  integer: { value: 42 },
  date: { value: '1975-02-19' },
  datetime: { value: '1975-02-19T22:50:00' },
  text: {
    value: `Amet beatae veritatis quisquam exercitationem officia. Modi delectus voluptatum qui tempore blanditiis! Similique alias expedita sunt ipsa error! Dolorum ipsa nobis iure itaque repudiandae voluptas ea Amet ex laboriosam exercitationem
    Lorem deserunt temporibus nesciunt qui tenetur magnam? Error doloremque aliquam voluptate culpa laborum cupiditate. Id et in molestias nobis autem. Ipsa fuga eveniet nulla ipsa consectetur ipsam Nobis odio cumque.`,
    rows: 10,
  },
  link: { value: 'https://example.com' },
  thumb: { value: mooch },
  image: { value: mooch },
  email: { value: 'mooch@example.com' },
  phone: { value: '555 12 345' },
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
      <section
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
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
          R.values,
        )(this.state)}
      </section>
    )
  }
}

storiesOf('Form fields', module).addWithJSX('editable', () => (
  <FormFields editable={boolean('editable')} />
))
