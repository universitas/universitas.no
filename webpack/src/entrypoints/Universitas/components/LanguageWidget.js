import { connect } from 'react-redux'
import { getMenu, toggleLanguage, onlyLanguage } from 'ducks/menu'
import cx from 'classnames'

const LanguageButton = ({ code, language, toggleLanguage, onlyLanguage }) => (
  <div
    className={cx('LanguageButton', { active: language[code] })}
    onClick={() => (language[code] ? toggleLanguage(code) : onlyLanguage(code))}
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

export default connect(getMenu, { toggleLanguage, onlyLanguage })(
  LanguageWidget,
)
