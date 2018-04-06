import React from 'react'
import * as Icons from 'components/Icons'

const logMessage = msg => e => console.log(msg)

const iconStyle = {
  fontSize: '150%',
  cursor: 'pointer',
}
const tableStyle = {
  padding: '0.2em',
}

const Icon = ({ name }) =>
  Icons[name]({
    style: iconStyle,
    onClick: logMessage(`clicked ${name}`),
  })

export default () => {
  return (
    <section>
      <h1>Icons</h1>
      <p>
        Icon components in <code>components/Icons</code>
      </p>
      <table>
        <tbody>
          {Object.keys(Icons).map(name => (
            <tr key={name}>
              <td style={tableStyle}>
                <Icon name={name} />
              </td>
              <td style={tableStyle}>
                <code>{`<${name} />`}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
