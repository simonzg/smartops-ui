import React, { Component } from "react";
import Navbar from "../components/Navbar";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Button } from "reactstrap";

// modules
import { list_apps } from "../modules/client";

// components
import AppCoverCreate from "../components/AppCoverCreate";
import AppCover from "../components/AppCover";

class Home extends Component {
  componentWillMount() {
    this.props.list_apps();
  }

  render() {
    let appCovers = this.props.apps.map((app, index) => (
      <AppCover {...app} key={index} />
    ));

    return (
      <div>
        <Navbar />
        <div className="container-bg">
          <div className="container app-cover-container">
            <div className="row">
              <AppCoverCreate />
              {appCovers}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  apps: state.client.apps
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ list_apps }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
