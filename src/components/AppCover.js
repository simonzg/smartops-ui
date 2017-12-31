import React, { Component } from "react";
import { Link } from "react-router-dom";

class AppCover extends Component {
    render() {
        console.log(this.props);
        let url = `/${this.props.id}/step/1`;
        return (
            <div className="col-md-4">
                <div className="app-cover">
                    <div className="header">Status</div>
                    <div className="body">
                        <Link className="name" to={url}>
                            {this.props.name}
                        </Link>
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
