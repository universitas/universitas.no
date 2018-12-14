// import * as Icons from './icons/'
import { Binoculars, Mobile, Eye, Desktop, Laptop } from 'components/Icons'

const ZoomSlider = props => (
  <div className="ZoomSlider" {...props}>
    {R.values(
      R.mapObjIndexed(
        (Icon, name) => (
          <div className="iconwrapper" key={name}>
            <Icon className="icon" />
            <small>{name}</small>
          </div>
        ),
        { Mobile, Eye, Laptop, Desktop, Binoculars },
      ),
    )}
  </div>
)

export default ZoomSlider
