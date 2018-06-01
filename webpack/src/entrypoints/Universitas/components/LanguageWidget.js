import { connect } from 'react-redux'
import { getMenu, toggleLanguage } from 'ducks/menu'
import cx from 'classnames'

const LanguageButton = ({ code, language, toggleLanguage }) => (
  <div
    className={cx('LanguageButton', { active: language[code] })}
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

export default connect(getMenu, { toggleLanguage })(LanguageWidget)
