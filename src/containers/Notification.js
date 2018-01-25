import React, { Component } from "react";
import Navbar from "../components/Navbar";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Button } from "reactstrap";

class Notification extends Component {
  render() {
    if (!this.props.error) {
      return <div />;
    } else {
      return (
        <div className="notification notification-error show">
          {this.props.error}
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  error: state.client.error
});

const mapDispatchToProps = dispatch => bindActionCreators({ push }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
