import { storiesOf } from '@storybook/react'
import { number, text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import * as icons from 'components/frontpage/Icons'

storiesOf('FrontpageEdit', module).addWithJSX('icons', () => {
  const fillColor = text('color', '#555')
  const background = text('background', '#ddd')
  const iconSize = number('size', 3, {
    range: true,
    min: 1,
    max: 10,
    step: 0.1,
  })
  const renderIcons = R.pipe(
    R.toPairs,
    R.map(([name, Icon]) => (
      <div key={name}>
        <small>{name}:</small>
        <div
          style={{
            fontSize: `${iconSize}rem`,
            lineHeight: 0,
            color: fillColor,
            background,
            width: '1em',
            height: '1em',
            padding: '0.1em',
          }}
        >
          <Icon />
        </div>
      </div>
    )),
  )

  return <div>{renderIcons(icons)}</div>
})
