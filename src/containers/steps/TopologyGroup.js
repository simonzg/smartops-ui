import React, { Component } from "react";

class TopologyGroup extends Component {
    render() {
        return (
            <ul className="topology-group">
                <li>
                    <div className="title">{this.props.service_name}</div>
                </li>
                <li>
                    <div className="title">{this.props.pod_name}</div>
                    <div className="note">Replica:{this.props.replica}</div>
                </li>
                <li>
                    <div className="title">{this.props.pod_name}</div>
                    <div className="note">Pod:1</div>
                </li>
            </ul>
        );
    }
}

export default TopologyGroup;
