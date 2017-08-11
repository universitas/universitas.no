import React from 'react'
import PropTypes from 'prop-types'
import { Fragment, Link } from 'redux-little-router'
import { Camera, Person, Newspaper, Edit } from 'components/Icons'
import { connect } from 'react-redux'
import IssueList from 'issues/IssueList'
import IssueDetail from 'issues/IssueDetail'
import ContributorList from 'contributors/ContributorList'
import ContributorDetail from 'contributors/ContributorDetail'
import PhotoList from 'photos/PhotoList'
import PhotoDetail from 'photos/PhotoDetail'
import 'styles/prodsys.scss'

const Photos = ({}) => (
  <div className="Photos">
    Photos App
  </div>
)
const Stories = ({}) => (
  <div className="Stories">
    Stories App
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
      <AppButton href="/stories" Icon={Edit} label="stories" />
      <AppButton href="/issues" Icon={Newspaper} label="issues" />
      <AppButton href="/photos" Icon={Camera} label="photos" />
      <AppButton href="/contributors" Icon={Person} label="contributors" />
    </section>
    <section className="ListPanel">
      <Fragment forRoute="/stories"><Stories /></Fragment>
      <Fragment forRoute="/issues"><IssueList /></Fragment>
      <Fragment forRoute="/contributors"><ContributorList /></Fragment>
      <Fragment forRoute="/photos"><PhotoList /></Fragment>
    </section>
    <Fragment forRoute="/contributors/:id">
      <section className="DetailPanel">
        <ContributorDetail />
      </section>
    </Fragment>
    <Fragment forRoute="/issues/:id">
      <section className="DetailPanel">
        <IssueDetail />
      </section>
    </Fragment>
    <Fragment forRoute="/photos/:id">
      <section className="DetailPanel">
        <PhotoDetail />
      </section>
    </Fragment>
  </main>
)
