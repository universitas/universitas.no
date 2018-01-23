import React from 'react'
const sections = [
  'nyheter',
  'nett',
  'kultur',
  'anmeldelser',
  'debatt',
  'side-2',
  'magasin',
]
export default () => (
  <section>
    <h1>Colors</h1>
    <table className="swatches">
      <tbody>
        <tr>
          <th>section</th>
          <th>dark</th>
          <th>medium</th>
          <th>light</th>
        </tr>
        {sections.map(section => (
          <tr key={section}>
            <th>{section}</th>
            <td className={`${section} dark`} />
            <td className={`${section}`} />
            <td className={`${section} light`} />
          </tr>
        ))}
      </tbody>
    </table>
  </section>
)
