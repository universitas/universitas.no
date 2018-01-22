import React from 'react'
import * as Icons from 'components/Icons'

const logMessage = msg => e => console.log(msg)

const iconStyle = {
  fontSize: '150%',
  cursor: 'pointer',
}

export default () => {
  return (
    <table>
      <tbody>
        {Object.keys(Icons).map(name => (
          <tr key={name}>
            <td>
              {Icons[name]({
                style: iconStyle,
                onClick: logMessage(`clicked ${name}`),
              })}
            </td>
            <td>{`<${name} />`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
