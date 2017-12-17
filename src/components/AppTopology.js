import React, { Component } from "react";
import { Button, Container, col, ul } from "reactstrap";
import { BrowserRouter, Route, Link } from "react-router-dom";

class AppTopology extends Component {
    render() {
        return (
            <div class="container body-container">
                <div class="form-title">
                    <h1>lication Topology</h1>
                </div>
                <div class="topology">
                    <ul class="topology-group">
                        <li>
                            <div class="title">loadbalancer</div>
                        </li>
                        <li>
                            <div class="title">rc-lb</div>
                            <div class="note">Container:2</div>
                        </li>
                        <li>
                            <div class="title">lb-node1</div>
                            <div class="note">SSS:ss</div>
                        </li>
                    </ul>
                    <ul class="topology-group">
                        <li>
                            <div class="title">loadbalancer</div>
                        </li>
                        <li>
                            <div class="title">rc-lb</div>
                            <div class="note">Container:2</div>
                        </li>
                        <li>
                            <div class="title">lb-node1</div>
                            <div class="note">SSS:ss</div>
                        </li>
                    </ul>
                    <ul class="topology-group">
                        <li>
                            <div class="title">loadbalancer</div>
                        </li>
                        <li>
                            <div class="title">rc-lb</div>
                            <div class="note">Container:2</div>
                        </li>
                        <li>
                            <div class="title">lb-node1</div>
                            <div class="note">SSS:ss</div>
                        </li>
                    </ul>
                </div>
                <div class="action-footer">
                    <Link className="btn btn-main" to="/step/4">
                        Next
                    </Link>
                </div>
            </div>
        );
    }
}

export default AppTopology;
