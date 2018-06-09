import { connect } from 'react-redux'
import { getLanguage, toggleLanguage } from 'ducks/newsFeed'
import cx from 'classnames'

const LanguageButton = ({ code, language, toggleLanguage }) => (
  <div
    className={cx('LanguageButton', { active: code == language })}
    onClick={() => toggleLanguage(code)}
  >
    {code}
  </div>
)

const LanguageWidget = props => (
  <nav className="LanguageWidget">
    <LanguageButton code="nor" {...props} />
    <LanguageButton code="eng" {...props} />
  </nav>
)

export default connect(state => ({ language: getLanguage(state) }), {
  toggleLanguage,
})(LanguageWidget)
