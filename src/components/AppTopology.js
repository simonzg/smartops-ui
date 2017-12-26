import React, { Component } from "react";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import { Link } from "react-router-dom";

class AppTopology extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        return (
            <div className="container body-container">
                <div className="form-title">
                    <h1>Application Topology</h1>
                </div>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <span
                        onClick={this.toggle}
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded={this.state.dropdownOpen}
                    >
                        {this.state.value}
                    </span>
                    <Dropdown
                        isOpen={this.state.dropdownOpen}
                        toggle={this.toggle}
                    >
                        <DropdownToggle caret>
                            Select Entry Point
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>1</DropdownItem>
                            <DropdownItem>2</DropdownItem>
                            <DropdownItem>3</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Dropdown>

                <div className="topology">
                    <ul className="topology-group">
                        <li>
                            <div className="title">loadbalancer</div>
                        </li>
                        <li>
                            <div className="title">rc-lb</div>
                            <div className="note">Container:2</div>
                        </li>
                        <li>
                            <div className="title">lb-node1</div>
                            <div className="note">SSS:ss</div>
                        </li>
                    </ul>
                    <ul className="topology-group">
                        <li>
                            <div className="title">loadbalancer</div>
                        </li>
                        <li>
                            <div className="title">rc-lb</div>
                            <div className="note">Container:2</div>
                        </li>
                        <li>
                            <div className="title">lb-node1</div>
                            <div className="note">SSS:ss</div>
                        </li>
                    </ul>
                    <ul className="topology-group">
                        <li>
                            <div className="title">loadbalancer</div>
                        </li>
                        <li>
                            <div className="title">rc-lb</div>
                            <div className="note">Container:2</div>
                        </li>
                        <li>
                            <div className="title">lb-node1</div>
                            <div className="note">SSS:ss</div>
                        </li>
                    </ul>
                </div>
                <div className="action-footer">
                    <Link className="btn btn-main" to="/step/4">
                        Next
                    </Link>
                </div>
            </div>
        );
    }
}

export default AppTopology;
