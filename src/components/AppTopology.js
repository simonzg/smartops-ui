import React, { Component } from 'react';
import { Button, Container, col, ul, } from 'reactstrap';


class AppTopology extends Component {
    render() {
        return (
            <div class="container body-container">
        <div class="form-title">
            <h1>className=lication Topology</h1></div>
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
            <Button color="link">Next</Button></div>
        </div>


        );

    }
}

export default AppTopology;