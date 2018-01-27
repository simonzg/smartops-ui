import React, { Component } from "react";
import Navbar from "../components/Navbar";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Alert, Button } from "reactstrap";
import { clear_notification } from "../modules/client";
import NotificationAlert from "./NotificationAlert";

class Notification extends Component {
  render() {
    if (this.props.error) {
      setTimeout(() => {
        this.props.clear_notification();
      }, 3000);
      return (
        <div className="notification show">
          <div className="container">
            <NotificationAlert color="danger" message={this.props.error} />
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = state => ({
  error: state.client.error
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ push, clear_notification }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
