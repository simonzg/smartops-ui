import React, { Component } from "react";
import { Link } from "react-router-dom";

class AppCover extends Component {
    render() {
        let url = `/${this.props.id}/step/1`;
        return (
            <div className="col-md-4">
                <div className="app-cover">
                    <div className="header">Status</div>
                    <div className="body">
                        <Link className="name" to={url}>
                            {this.props.name}
                        </Link>
                        <div className="row clearfix">
                            {this.props.services && (
                                <div className="col-md-4">
                                    Service: {this.props.services}
                                </div>
                            )}
                            {this.props.containers && (
                                <div className="col-md-4">
                                    Container: {this.props.containers}
                                </div>
                            )}
                            {this.props.pods && (
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
