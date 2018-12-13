import { storiesOf } from '@storybook/react'
import { number, text, object, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import * as icons from 'components/frontpage/Icons'
import { FeedItem, StoryBookGrid } from 'components/NewsFeed/FeedItem'
import Debug from 'components/Debug'
import { StyleButtons } from 'components/frontpage/StyleButtons'
import mooch from '../assets/mooch.jpg'

const htmlClass = () => [
  select(
    'font size',
    ['size-small', 'size-medium', 'size-large'],
    'size-small',
  ),
  select(
    'layout',
    ['layout-top', 'layout-left', 'layout-behind'],
    'layout-top',
  ),
  select('background', ['bg-white', 'bg-black', 'bg-section'], 'bg-white'),
  select('font weight', ['weight-bold', 'weight-thin'], 'weight-bold'),
]

const wrapper = props => <div {...props} />

const feedItemProps = () => ({
  sectionName: select(
    'section',
    ['nyheter', 'kultur', 'debatt', 'magasin'],
    'nyheter',
  ),
  html_class: R.join(' ', htmlClass()),
  size: [
    number('cols', 3, { range: true, min: 1, max: 6 }),
    number('rows', 3, { range: true, min: 1, max: 6 }),
  ],
  imagefile: { large: mooch, width: 1291, height: 777 },
  headline: text('headline', 'Hello World!'),
  vignette: text('vignette', 'vignette'),
  kicker: text('kicker', 'Kicker here'),
  lede: text('lede', 'The lede'),
  crop_box: { x: 0.5, y: 0.4, top: 0.2, bottom: 0.7, left: 0.3, right: 0.7 },
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

const style = {
  fontFamily: 'Roboto',
  display: 'grid',
  overflow: 'hidden',
  gridGap: '1rem',
  gridTemplateRows: 'repeat(6,15vh)',
  gridTemplateColumns: 'repeat(6,15vw)',
}

storiesOf('FrontpageEdit', module)
  .addWithJSX('widget', () => <ButtonWrapper />)
  .addWithJSX('feed item', () => {
    const props = feedItemProps()
    return (
      <StoryBookGrid>
        <FeedItem {...props} />
      </StoryBookGrid>
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
