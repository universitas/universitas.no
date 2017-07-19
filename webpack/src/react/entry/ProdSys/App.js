import React from 'react'
import PropTypes from 'prop-types'
import { Fragment, Link } from 'redux-little-router'
import { Camera, Person, Newspaper } from 'components/Icons'
import Issues from 'pages/IssueList'
import 'styles/prodsys.scss'

const Contributors = ({}) => (
  <div className="Contributors">
    Contributors App
  </div>
)
const Photos = ({}) => (
  <div className="Photos">
    Photos App
  </div>
)

const Home = () => <div>home</div>

const AppButton = ({ href, Icon, label }) => (
  <Link
    className="AppButton"
    href={href}
    activeProps={{ className: 'AppButton active' }}
  >
    <Icon /><small>{label}</small>
  </Link>
)
AppButton.propTypes = {
  Icon: PropTypes.func.isRequired,
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

export default () => (
  <main className="ProdSys">
    <section className="SideBar">
      <AppButton href="/photos" Icon={Camera} label="photos" />
      <AppButton href="/issues" Icon={Newspaper} label="issues" />
      <AppButton href="/contributors" Icon={Person} label="contributors" />
    </section>
    <section className="MainPanel">
      <Fragment forRoute="/contributors"><Contributors /></Fragment>
      <Fragment forRoute="/issues"><Issues /></Fragment>
      <Fragment forRoute="/photos"><Photos /></Fragment>
    </section>
  </main>
)
