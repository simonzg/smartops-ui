import React, { Component } from "react";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { clear_notification } from "../modules/client";
import NotificationAlert from "./NotificationAlert";

class Notification extends Component {
  render() {
    if (this.props.notification) {
      setTimeout(() => {
        this.props.clear_notification();
      }, 3000);
      return (
        <div className="notification show">
          <div className="container">
            <NotificationAlert
              color={this.props.notification.color}
              message={this.props.notification.message}
            />
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = state => ({
  notification: state.client.notification
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ push, clear_notification }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
