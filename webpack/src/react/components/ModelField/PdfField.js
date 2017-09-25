// String Field
import { stringify } from 'utils/text'
import { Pdf } from 'components/Icons'
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

const PdfThumb = ({ cover_page, pages, pdf }) => (
  <div className="PdfThumb">
    <img src={cover_page} alt="" />
    <span className="pages">
      {pages} sider <PdfLink url={pdf} />
    </span>
  </div>
)

export const DetailField = ({ value = [], ...args }) => (
  <div className="PdfDetail" {...args}>
    {value.map((props, index) => <PdfThumb key={index} {...props} />)}
  </div>
)

export const EditableField = DetailField
