import React, { Component } from "react";
import { Link } from "react-router-dom";

class AppCover extends Component {
    render() {
        let url = `/${this.props.id}/step/1`;
        let result_url = `/${this.props.id}/step/6`;
        let status = this.props.status ? this.props.status.status : "";
        if (status) {
            console.log("status = ", status);
            switch (status) {
                case "PLAN_GENERATED":
                    url = result_url;
            }
        }
        return (
            <div className="col-md-4">
                <div className="app-cover">
                    <div className="header">{this.props.status.status}</div>
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
