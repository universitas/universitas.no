import { EditImage, PhotoList, SearchField, ResultsPanel } from '.'
import React from 'react'
import './app.scss'

const App = () => {
  const style = {}
  return (
    <section className="App">
      <section className="controlsPanel">
        <SearchField />
        <ResultsPanel />
      </section>
      <section className="mainPanel">
        <EditImage style={{ flex: 1 }} />
        <PhotoList style={{ flex: 2 }} />
      </section>
    </section>
  )
}

export { App }
