// String Field
import { stringify } from 'utils/text'

const PdfThumb = ({ cover_page, pages }) => (
  <div className="PdfThumb">
    <span>pages: {pages}</span>
    <img src={cover_page} alt="" />
  </div>
)

export const DetailField = ({ value, ...args }) => (
  <div className="PdfDetail" {...args}>
    {value.map((props, index) => <PdfThumb key={index} {...props} />)}
  </div>
)

export const EditableField = DetailField
