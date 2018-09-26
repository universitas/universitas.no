import { getAdverts, advertsRequested } from 'ducks/adverts'
import { connect } from 'react-redux'
import cx from 'classnames'
import { hyphenate } from 'utils/text'

const Advert = ({ children, className = '', ...props }) => (
  <div className={cx('Advert', className)} {...props}>
    {children}
  </div>
)

const AdHoc = ({ image, url }) => (
  <Advert className="col-6 row-1" style={{ textAlign: 'center' }}>
    <a href={url}>
      <img src={image} />
    </a>
  </Advert>
)

class Google extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    }, 500)
  }

  render() {
    const { className, style = {} } = this.props
    return (
      <Advert className={cx('Google', className)} style={style}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', ...style }}
          data-ad-client="ca-pub-5135593726012785"
          data-ad-slot="2776054351"
          data-ad-format="rectangle, horizontal"
          data-full-width-responsive="true"
        />
      </Advert>
    )
  }
}

const QmediaSub = ({ id, text, link, image }) => (
  <a className="QmediaSub" href={link} target="_blank" rel="nofollow">
    <img src={image} />
    <p>{hyphenate(text)}</p>
  </a>
)

class Qmedia extends React.Component {
  componentDidMount() {
    this.props.qmedia || this.props.advertsRequested()
  }
  render() {
    const { className = '', qmedia = [] } = this.props
    return (
      <Advert className={cx('Qmedia', className)}>
        {qmedia.map(props => <QmediaSub key={props.id} {...props} />)}
      </Advert>
    )
  }
}

export default {
  Google,
  Qmedia: connect(getAdverts, { advertsRequested })(Qmedia),
  AdHoc,
}
