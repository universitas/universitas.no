import { EditImage, PhotoList, GetButton } from '.'
import React from 'react'
import './app.scss'

const App = () => {
  const style = {}
  return (
    <section className="App">
      <EditImage style={{ flex: 1 }} />
      <PhotoList style={{ flex: 2 }} />
    </section>
  )
}

export { App }
