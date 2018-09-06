// String Field
import { stringify } from 'utils/text'
import { Pdf } from 'components/Icons'
import Thumb from 'components/Thumb'
import cx from 'classnames'

const openUrl = url => () => window.open(url)

const PdfLink = ({ url }) => (
  <span
    className={cx('PdfLink')}
    onClick={openUrl(url)}
    title="åpne pdf i ny tab"
  >
    <Pdf />
  </span>
)

const PdfThumb = ({ cover, pages, pdf }) => (
  <div className="PdfThumb">
    <Thumb className="dropshadow" src={cover} />
    <span className="data">
      {pages} sider <PdfLink url={pdf} />{' '}
    </span>
  </div>
)

export const DetailField = ({ value = [], ...args }) => (
  <div {...args}>
    {value.map((props, index) => <PdfThumb key={index} {...props} />)}
  </div>
)

export const EditableField = DetailField
