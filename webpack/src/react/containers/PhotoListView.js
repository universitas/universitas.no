import { EditImage, PhotoList, SearchField, ResultsPanel } from './components'
import 'styles/photolistview.scss'

const App = () => {
  return (
    <section className="App">
      <section className="controlsPanel">
        <SearchField />
        <ResultsPanel />
      </section>
      <section className="mainPanel">
        <EditImage />
        <PhotoList style={{ flex: 2 }} />
      </section>
    </section>
  )
}

export default App
