import { connect } from 'react-redux'
import { Close, Edit, Tune, GridView } from 'components/Icons'
import Debug from 'components/Debug'
// import { getSite } from 'ducks/site'
import { getUser } from 'ducks/auth'
import { getLocation, STORY, HOME, SECTION } from 'ducks/router'
import { getUx, toggleUx } from 'ducks/site'

const storyDjango = pk =>
  `${global.location.origin}/admin/stories/story/${pk}/change/`
const photoDjango = pk =>
  `${global.location.origin}/admin/photo/imagefile/${pk}/change/`
const storyProdsys = pk => `${global.location.origin}/prodsys/stories/${pk}`
const photoProdsys = pk => `${global.location.origin}/prodsys/photos/${pk}`
const frontpageDjango = () =>
  `${global.location.origin}/admin/frontpage/frontpagestory/`
const frontpageProdsys = () => `${global.location.origin}/prodsys/`

const djangoUrl = location => {
  console.log(location.type)
  switch (location.type) {
    case STORY:
      return [
        storyDjango(location.payload.id),
        storyProdsys(location.payload.id),
      ]
    default:
      return [frontpageDjango(), frontpageProdsys()]
  }
}

const EditLinks = ({ location, close }) => {
  const urls = djangoUrl(location)
  return (
    <React.Fragment>
      <Close onClick={close} />
      <a title="Prodsys" href={urls[1]}>
        <GridView />
      </a>
      <a title="Django-admin" href={urls[0]}>
        <Tune />
      </a>
    </React.Fragment>
  )
}

const FrontpageEdit = ({ editing, location, user, toggleUx }) =>
  user ? (
    <div className="FrontpageEdit">
      {editing ? (
        <EditLinks
          location={location}
          close={() => toggleUx({ editing: false })}
        />
      ) : (
        <Edit onClick={() => toggleUx({ editing: true })} />
      )}
    </div>
  ) : null

const mapStateToProps = (state, ownProps) => ({
  user: getUser(state),
  location: getLocation(state),
  editing: getUx(state).editing,
})

export { FrontpageEdit }
const mapDispatchToProps = { toggleUx }
export default connect(mapStateToProps, mapDispatchToProps)(FrontpageEdit)
