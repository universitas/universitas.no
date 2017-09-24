// String Field
import { stringify } from 'utils/text'
import { Pdf } from 'components/Icons'

const PdfThumb = ({ cover_page, pages, pdf }) => (
  <div className="PdfThumb">
    <img src={cover_page} alt="" />
    <span className="pages">
      {pages} sider <a style={{ fontSize: '2em' }} href={pdf}><Pdf /></a>
    </span>
  </div>
)

export const DetailField = ({ value = [], ...args }) => (
  <div className="PdfDetail" {...args}>
    {value.map((props, index) => <PdfThumb key={index} {...props} />)}
  </div>
)

export const EditableField = DetailField
