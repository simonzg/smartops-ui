import React, { Component } from "react";

class AppCover extends Component {
    render() {
        return (
            <div className="col-md-4">
                <div className="app-cover">
                    <div className="header">Status</div>
                    <div className="body">
                        <div className="name">{this.props.name}</div>
                        <div className="row">
                            <div className="col-md-4">Service</div>
                            <div className="col-md-4">Container</div>
                            <div className="col-md-4">Pod</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppCover;
