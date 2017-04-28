import React from 'react'
import './features.scss'

const Symbols = () => (
  <defs>
    <symbol id="profile-face" viewBox="0 0 100 100">
      <path
        d={`m15.3 69.6c-2.7-1.8-10.1-3.3-7.91-7.2 2.91-5.2 9.11-11.9
          8.21-17.5-4-24.2 10-39.8 33.9-39.9 24-.09 37.5 12.8 37.5 38.2 0
          35.7-51.1 60.8-59.8 48.5-8.8-12.6-7.6-17.4-11.9-22.1z`}
      />
    </symbol>
    <symbol id="frontal-face" viewBox="0 0 100 100">
      <path
        d={`m50 5c-12.8 0-25.8 7.73-30 16.9-4.19 9.17-.562 14.4-.768
          29.3-.205 15 6.92 30 13.4 34.9 6.49 4.88 11.3 8.89 17.3 8.89 6.04
          0 10.8-4.01 17.3-8.89 6.6-4.9 13.7-19.9 13.5-34.9-.2-14.9
          3.5-20.1-.7-29.3s-17.2-16.9-30-16.9z`}
      />
    </symbol>
  </defs>
)

const Label = ({ items, size }) => (
  <text
    x="1" y={size * 0.6}
    textAnchor="middle"
  >
    {Object.keys(items).map((key) => (
      <tspan
        key={key}
        className={key}
        x={1}
        dy={size * 1.2}
        style={{ fontSize: size }}
      >
        {`${key}: ${items[key]}`}
      </tspan>
    ))}
  </text>
)
Label.propTypes = {
  items: React.PropTypes.object,
  size: React.PropTypes.number,
}

const Keypoint = () => (
  <g>
    <circle r="1" cx="1" cy="1" className="back" />
    <circle r="1" cx="1" cy="1" className="front" />
    <path
      className="cross"
      d="M0,1h0.9m0.2,0h0.9M1,0v0.9m0,0.2v0.9"
      transform="rotate(45 1 1)"
    />
  </g>
)

const Face = ({ className }) => {
  const symbol = className.includes('profile') ?
    '#profile-face' : '#frontal-face'
  return (
    <g>
      <use xlinkHref={symbol} x="0" y="0" height="2" width="2" className="back" />
      <use xlinkHref={symbol} x="0" y="0" height="2" width="2" className="front" />
    </g>
  )
}
Face.propTypes = {
  className: React.PropTypes.string,
}

const Feature = ({ label = "", weight = 0, ...props }) => (
  <svg
    className={`feature ${label}`}
    preserveAspectRatio="none"
    viewBox="0 0 2 2"
    {...props}
  >
    {label.includes('keypoint') && <Keypoint />}
    {label.includes('face') && <Face className={label} />}
    <Label items={{ label, weight }} size={0.04 / props.width} />
  </svg>
)
Feature.propTypes = {
  label: React.PropTypes.string,
  weight: React.PropTypes.number,
  width: React.PropTypes.number,
}

export { Feature, Symbols }
