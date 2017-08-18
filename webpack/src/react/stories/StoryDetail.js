import R from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { getCurrentStory, fieldChanged } from 'stories/duck'
import { detailFields as fields } from 'stories/model'
import { formatDateTime, formatDate } from 'utils/modelUtils'

const PdfPreview = ({ cover_page, pdf }) => (
  <a href={pdf}>
    <img className="PdfPreview" src={cover_page} alt="pdf" />
  </a>
)

const ChoiceField = ({ choices, value, editable, ...args }) =>
  editable
    ? <select value={value} {...args}>
        {choices.map(({ value, display_name }) => (
          <option key={value} value={value}> {display_name} </option>
        ))}
      </select>
    : <span>{value}</span>

const IntegerField = ({ value, editable, choices, ...args }) =>
  editable
    ? <input type="number" value={value} {...args} />
    : <span>{value}</span>

const ThumbField = ({ value, editable, ...args }) =>
  editable ? <img src={value} /> : <img src={value} />

const LinkField = ({ value, editable, ...args }) => <a href={value}>{value}</a>

const DateField = ({ value, editable, choices, ...args }) =>
  editable
    ? <input type="date" value={value} {...args} />
    : <span>{formatDate(value)}</span>

const DateTimeField = ({ value, editable, choices, ...args }) =>
  editable
    ? <input type="datetime" value={value} {...args} />
    : <span>{formatDateTime(value)}</span>

const StringField = ({ value, editable, choices, ...args }) =>
  editable
    ? <input style={{ width: '100%' }} type="text" value={value} {...args} />
    : <span>{value}</span>

const tfstyle = {
  width: '100%',
  height: '500px',
}

const TextField = ({ value, editable, choices, ...args }) =>
  editable
    ? <textarea style={tfstyle} type="text" value={value} {...args} />
    : <span>{value}</span>

const fieldTypes = {
  choice: ChoiceField,
  string: StringField,
  text: TextField,
  link: LinkField,
  integer: IntegerField,
  thumb: ThumbField,
  date: DateField,
  datetime: DateTimeField,
}

const DetailField = ({ label, type, ...args }) => {
  const TypeField = fieldTypes[type] || StringField
  return (
    <div>
      <span>{label}: </span>
      <TypeField {...args} />
    </div>
  )
}

const Detail = ({ pdfs = [], dirty, fieldChanged, ...data }) => (
  <div>
    {fields.map(({ key, ...args }) => (
      <DetailField
        key={key}
        name={key}
        value={data[key]}
        onChange={e => fieldChanged(data.id, key, e.target.value)}
        {...args}
      />
    ))}
    <div>
      {pdfs.map((props, index) => (
        <PdfPreview key={index} name={props.url} {...props} />
      ))}
    </div>
  </div>
)

export default connect(getCurrentStory, { fieldChanged })(Detail)
