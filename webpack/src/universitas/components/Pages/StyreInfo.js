import { connect } from 'react-redux'
import Link from 'redux-first-router-link'
import LoadingIndicator from 'components/LoadingIndicator'
import { requestData } from 'utils/hoc'
import { getSite, siteRequested } from 'ducks/site'
import Debug from 'components/Debug'
import cx from 'classnames'

const StyreInfo = ({ pageTitle, state, className = '' }) => (
   <article className={cx('StyreInfo', className)}>
     <h1>{pageTitle}</h1>
     <h3>Styret</h3>
     <p>
     	Styret i Universitas består av tre medlemmer valgt av Velferdstinget i Oslo og Akershus 
     	og fire medlemmer valgt av redaksjonsklubben.
     </p>
     <p>
     	For perioden 2018/2019 består styret av følgende personer:
     </p>
     <h3>Oppnevnt av Velferdstinget:</h3>
     <p> 
     	Henrik Paulsen Mandelid
     	Styrets leder
     	Vara: Jens Lægreid
	 </p>
	 <p>
	 	Henrik Bjørndalen
	 	Vara: Markus Neslein
	 </p>
	 <p>
	 	Ingrid Uleberg
	 	Vara: Erlend Ditlevsen Aag
	 </p>
     <h3>Oppnevnt av klubben:</h3>
     <p>
     	Hans Magnus Meland
     	Klubbleder
     </p>
     <p>
     	Birk Tjeldflaat Helle
     	Vara: Mads Randen
     </p>
     <p>
      	Jørgen Brynhildsvoll
      	Vara: Adrian Nielsen
     </p>
     <p>
     	Vilde Sagstad Imeland
     	Vara: Benedicte Tobiassen
     </p>
   </article>
 )

 const mapStateToProps = getSite
 const mapDispatchToProps = { fetchData: siteRequested }
 export default connect(mapStateToProps, mapDispatchToProps)
 


