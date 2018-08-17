import EditImage from 'x/components/EditImage'
import PhotoList from 'x/components/PhotoList'
import SearchField from 'x/components/SearchField'
import ResultsPanel from 'x/components/ResultsPanel'
import './app.scss'
import CropBox from '@haakenlid/photocrop'

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
