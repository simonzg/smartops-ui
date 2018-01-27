import React, { Component } from "react";
import { Alert } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { clear_notification } from "../modules/client";

class NotificationAlert extends Component {
  render() {
    return (
      <Alert color={this.props.color} toggle={this.props.clear_notification}>
        {this.props.message}
      </Alert>
    );
  }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ clear_notification }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NotificationAlert);
