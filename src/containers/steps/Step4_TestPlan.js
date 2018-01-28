import React, { Component } from "react";
import { FormGroup, Input, Label, Button } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { show_notification } from "../../modules/client";
import { push } from "react-router-redux";

class Step4_TestPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            method: "GET",
            content_type: "application/json",
            url: "",
            request_per_second: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    validateForm() {
        return (
            this.state.method &&
            this.state.content_type &&
            this.state.url &&
            this.state.request_per_second
        );
    }

    handleSubmit() {
        if (this.validateForm()) {
            let next_url = `/${this.props.app_id}/step/5`;
            this.props.push(next_url);
        } else {
            this.props.show_notification(
                "danger",
                "No input could be empty here"
            );
        }
    }

    render() {
        console.log(this.state);
        return (
            <div className="container body-container">
                <h1 className="page-title">Test Plan</h1>
                <div className="row">
                    <div className="col-3">
                        <FormGroup>
                            <Label>HTTP Verb</Label>
                            <Input
                                type="select"
                                name="method"
                                onChange={this.handleChange}
                            >
                                <option>GET</option>
                                <option>PUT</option>
                                <option>POST</option>
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label>Content Type</Label>
                            <Input
                                type="select"
                                name="content_type"
                                onChange={this.handleChange}
                            >
                                <option>application/json</option>
                                <option>application/xml</option>
                            </Input>
                        </FormGroup>
                    </div>

                    <div className="col-7">
                        <FormGroup>
                            <Label>Url</Label>
                            <Input
                                type="text"
                                name="url"
                                onChange={this.handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Request load per second</Label>
                            <Input
                                type="number"
                                name="request_per_second"
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                </div>

                <div className="action-footer">
                    <Button
                        className="btn btn-main"
                        onClick={this.handleSubmit}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ push, show_notification }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Step4_TestPlan);
