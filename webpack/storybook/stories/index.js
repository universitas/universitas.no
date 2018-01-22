import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as Icons from 'components/Icons'

const IconTable = () => {
  return (
    <table>
      {Object.keys(Icons).map(name => (
        <tr key={name}>
          <td style={{ fontSize: '150%' }}>{Icons[name]()}</td>
          <td>{`<${name} />`}</td>
        </tr>
      ))}
    </table>
  )
}

storiesOf('Elements', module).add('icons', () => <IconTable />)
