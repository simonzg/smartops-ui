import React, { Component } from "react";
import { Link } from "react-router-dom";

class AppCover extends Component {
    render() {
        let url = `/${this.props.id}/step/1`;
        let base_url = `/${this.props.id}/step/`;
        let status = this.props.status ? this.props.status.status : "";
        let status_str = "";
        if (status) {
            console.log("status = ", status);
            if (status === "PLAN_GENERATED") {
                url = base_url + "6";
                status_str = "completed";
            }
            if (status.includes("CREATING_STEP")) {
                let [a, b, c] = status.split("_");
                url = base_url + (parseInt(c) + 1);
                status_str = "configuring";
            }
        }
        return (
            <div className="col-md-4">
                <div className="app-cover">
                    <div className="header">{status_str}</div>
                    <div className="body">
                        <Link className="name" to={url}>
                            {this.props.name}
                        </Link>
                        <div className="row clearfix">
                            {this.props.services >= 0 && (
                                <div className="col-md-4">
                                    Service: {this.props.services}
                                </div>
                            )}
                            {this.props.containers >= 0 && (
                                <div className="col-md-4">
                                    Container: {this.props.containers}
                                </div>
                            )}
                            {this.props.pods >= 0 && (
                                <div className="col-md-4">
                                    Pod: {this.props.pods}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppCover;
