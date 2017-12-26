import React, { Component } from "react";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { increment, decrement } from "../modules/counter";

import { Button } from "reactstrap";

const Counter = props => (
  <div>
    <Button onClick={props.decrement}>-</Button>
    <span>Counter: {props.count}</span>
    <Button onClick={props.increment}>+</Button>

    <hr />
    <Button onClick={props.changePage}>Back to Home Page</Button>
  </div>
);

const mapStateToProps = state => ({
  count: state.counter.count
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      increment,
      decrement,
      changePage: () => push("/")
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
