import { connect } from 'react-redux'
import { Info, Close, Edit, Tune, GridView } from 'components/Icons'
import Debug from 'components/Debug'
// import { getSite } from 'ducks/site'
import { getUser } from 'ducks/auth'
import { getStory } from 'ducks/publicstory'
import { buildNodeTree } from 'markup/nodeTree'
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
const frontpageProdsys = () => `${global.location.origin}/prodsys/frontpage/`

const djangoUrl = location => {
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

const selectDebugData = state => {
  const location = getLocation(state)
  switch (location.type) {
    case STORY:
      return R.pipe(getStory(location.payload.id), buildNodeTree)(state)
    default:
      return state
  }
}

const StateData = connect(selectDebugData)(Debug)

class DebugToggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false }
    this.clickHandler = () => this.setState(R.over(R.lensProp('open'), R.not))
  }

  render() {
    return (
      <span title="debug data" onClick={this.clickHandler}>
        <Info />
        {this.state.open && <StateData />}
      </span>
    )
  }
}

const EditLinks = ({ location, close }) => {
  const urls = djangoUrl(location)
  return (
    <React.Fragment>
      <a title="Django-admin" href={urls[0]}>
        <Tune />
      </a>
      <a title="Prodsys" href={urls[1]}>
        <GridView />
      </a>
      <Close onClick={close} />
    </React.Fragment>
  )
}

const FrontpageEdit = ({ editing, location, user, toggleUx }) =>
  user && user.pk ? (
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
