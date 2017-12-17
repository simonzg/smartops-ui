import React, { Component } from "react";
import { Button, Container, col, ul } from "reactstrap";
import { BrowserRouter, Route, Link } from "react-router-dom";

class AppTestPlan extends Component {
    render() {
        return (
            <div className="container body-container">
                <h1 className="form-title">Test Plan</h1>
                <div className="row">
                    <div className="col-4">
                        <div className="form-group">
                            <label className="label-blue" for="name">
                                Name
                            </label>
                            <div
                                className="col-8"
                                style={{ "padding-left": 0 }}
                            >
                                <input
                                    className="form-control"
                                    placeholder=" "
                                    name="name"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-group">
                            <label className="label-blue" for="url">
                                Url
                            </label>
                            <input
                                className="form-control"
                                placeholder=" "
                                name="url"
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-group">
                            <label className="label-blue" for="url">
                                Counts of Requestes Perscond
                            </label>
                            <select className="form-control" name="counts">
                                <option>1min</option>
                                <option>2mins</option>
                                <option>3mins</option>
                            </select>
                        </div>
                    </div>
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

export default AppTestPlan;
