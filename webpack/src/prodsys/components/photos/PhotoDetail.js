import { connect } from 'react-redux'
import { Field, selectors, actions } from './model.js'
import { PhotoTools } from '.'
import Debug from 'components/Debug'

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
            editable
          />
          <Field pk={pk} name="description" editable />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Field pk={pk} name="large" />
          <Field pk={pk} name="description" editable />
          <div className="wrapForm">
            <Field pk={pk} name="contributor" editable />
            <Field pk={pk} name="category" editable />
            <Field pk={pk} name="filename" />
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
