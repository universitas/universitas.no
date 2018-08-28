import { connect } from 'react-redux'
import { MODEL, fields, selectors, actions } from './model.js'
import { PhotoTools } from '.'
import ModelField from 'components/ModelField'
import Debug from 'components/Debug'

const Field = ({ name, ...props }) => (
  <ModelField
    key={name}
    name={name}
    model={MODEL}
    {...fields[name]}
    {...props}
  />
)

const PhotoDetail = ({ pk, detail }) => (
  <section className="DetailPanel">
    <PhotoTools pk={pk} detail={detail} />
    <div className="panelContent">
      {detail == 'crop' ? (
        <React.Fragment>
          <Field
            pk={pk}
            name="crop_box"
            type="cropbox"
            previews={[0.5, 1, 2.5]}
          />
          <Field pk={pk} name="description" />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Field pk={pk} name="large" />
          <Field pk={pk} name="description" />
          <div className="wrapForm">
            <Field pk={pk} name="artist" />
            <Field pk={pk} name="filename" />
            <Field pk={pk} name="category" />
            <Field pk={pk} name="original" />
            <Field pk={pk} name="usage" />
            <Field pk={pk} name="created" />
            <Field pk={pk} name="filesize" />
            <Field pk={pk} name="height" />
            <Field pk={pk} name="width" />
          </div>
        </React.Fragment>
      )}
    </div>
  </section>
)

const getRouter = R.path(['router', 'params'])

export default connect(
  R.applySpec({
    pk: selectors.getCurrentItemId,
    detail: R.pipe(getRouter, R.propOr('normal', 'detail')),
  }),
)(PhotoDetail)
