import { connect } from 'react-redux'
import modulKartLiten from 'images/modulkart_liten.png'
import modulKart from 'images/modulkart.png'

const AD_MODULES = [
  { name: 'Modul 2 forside', width: 245, height: 55, price: 9100 },
  { name: 'Helside', width: 245, height: 355, price: 17560 },
  { name: 'Halvside stående', width: 145, height: 355, price: 10860 },
  { name: 'Halvside liggende', width: 245, height: 177, price: 9050 },
  { name: 'Modul 3', width: 145, height: 177, price: 5430 },
  { name: 'Modul 4', width: 95, height: 355, price: 7245 },
  { name: 'Modul 5', width: 245, height: 70, price: 3620 },
  { name: 'Modul 6', width: 145, height: 70, price: 2180 },
  { name: 'Modul 7', width: 95, height: 210, price: 4350 },
  { name: 'Modul 8', width: 45, height: 355, price: 3620 },
  { name: 'Modul 9', width: 95, height: 140, price: 2900 },
  { name: 'Modul 10', width: 95, height: 70, price: 1450 },
]

const formatPrice = R.pipe(
  R.toString,
  R.reverse,
  R.splitEvery(3),
  R.join('\u00A0'),
  R.reverse,
  R.concat(R.__, ',-'),
)

const Row = ({ name, width, height, price }) => (
  <tr key={name}>
    <td>{name}</td>
    <td>{width} mm</td>
    <td>{height} mm</td>
    <td>{formatPrice(price)}</td>
  </tr>
)

const ModulKart = ({}) => (
  <a href={modulKart} className="ModulKart">
    <img
      style={{ paddingLeft: '1rem' }}
      title="Modulkart"
      alt="modulkart"
      src={modulKartLiten}
    />
  </a>
)

const AdvertiserInfo = ({ pageTitle, state }) => (
  <div className="AdvertiserInfo">
    <h1>{pageTitle}</h1>
    <p>
      Avisen har et opplag på 14 000 og distribueres til læresteder tilknyttet
      SiO, blant annet Universitetet i Oslo, Handelshøyskolen BI, Høgskolen i
      Oslo og Akershus, Idrettshøgskolen, Musikkhøgskolen, Politihøgskolen,
      Kunsthøgskolen og Menighetsfakultetet.
    </p>
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <table className="univTable prices">
          <caption>Annonsepriser</caption>
          <tbody>
            <tr>
              <th>Modul</th>
              <th>Bredde</th>
              <th>Høyde</th>
              <th>Pris</th>
            </tr>
            {R.map(Row, AD_MODULES)}
            <tr>
              <td colSpan="4">Ta kontakt for andre formater</td>
            </tr>
          </tbody>
        </table>
        <table className="univTable prices">
          <caption>Tillegg</caption>
          <tbody>
            <tr>
              <td>Farge per annonse</td>
              <td>1575,-</td>
            </tr>
            <tr>
              <td>Nyhetsside</td>
              <td>800,-</td>
            </tr>
            <tr>
              <td>Kulturside</td>
              <td>600,-</td>
            </tr>
          </tbody>
        </table>
        <table className="univTable prices">
          <caption>Annonsepriser på nettsiden</caption>
          <tbody>
            <tr>
              <th>Plassering</th>
              <th>bredde</th>
              <th>høyde</th>
              <th>pris/uke</th>
            </tr>
            <tr>
              <td>Toppbanner</td>
              <td>960px</td>
              <td>150px</td>
              <td>19 900,-</td>
            </tr>
            <tr>
              <td>Stolpe</td>
              <td>172px</td>
              <td>500px</td>
              <td>19 900,-</td>
            </tr>
            <tr>
              <td colSpan="4">Ta kontakt for andre formater</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ModulKart />
    </div>
  </div>
)
const mapStateToProps = (state, ownProps) => ({})
const mapDispatchToProps = (dispatch, ownProps) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(AdvertiserInfo)
