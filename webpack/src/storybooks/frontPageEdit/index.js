import { storiesOf } from '@storybook/react'
import { number, text, object, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import * as icons from 'components/frontpage/Icons'
import { FeedItem } from 'components/NewsFeed'
import Debug from 'components/Debug'
import { StyleButtons } from 'components/frontpage/StyleButtons'
import mooch from '../assets/mooch.jpg'

const htmlClass = () => [
  select('size', ['size-small', 'size-medium', 'size-large'], 'size-small'),
  select(
    'layout',
    ['layout-top', 'layout-left', 'layout-behind'],
    'layout-top',
  ),
  select('background', ['bg-white', 'bg-black', 'bg-section'], 'bg-white'),
  select('weight', ['weight-bold', 'weight-thin'], 'weight-bold'),
]

const feedItemProps = () => ({
  sectionName: select(
    'section',
    ['nyheter', 'kultur', 'debatt', 'magasin'],
    'nyheter',
  ),
  html_class: R.join(' ', htmlClass()),
  size: [number('cols', 3), number('rows', 3)],
  image: mooch,
  headline: text('headline', 'Hello World!'),
  vignette: text('vignette', 'vignette'),
  kicker: text('kicker', 'Kicker here'),
  lede: text('lede', 'The lede'),
  crop_box: {},
  Wrapper: props => <div {...props} />,
})

class ButtonWrapper extends React.Component {
  state = { value: 'bg-black' }

  render() {
    const onChange = (value => this.setState({ value })).bind(this)
    return (
      <div>
        {this.state.value}
        <StyleButtons value={this.state.value} onChange={onChange} />
      </div>
    )
  }
}

storiesOf('FrontpageEdit', module)
  .addWithJSX('widget', () => <ButtonWrapper />)
  .addWithJSX('feed item', () => {
    const props = feedItemProps()
    return (
      <div className="NewsFeed">
        <FeedItem {...props} />
      </div>
    )
  })
  .addWithJSX('icons', () => {
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
