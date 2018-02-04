import React, { Component } from "react";
import { FormGroup, Input, Label, Button } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { show_notification, update_app } from "../modules/client";
import { push } from "react-router-redux";
import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/theme/github";

class TestPlanComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
            id: props.id
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        this.props.handleChange(this.state.id, {
            ...this.state,
            [event.target.name]: event.target.value
        });
    }

    handleRemove(event) {
        this.props.handleRemove(this.state.id);
    }

    render() {
        console.log(this.state);
        return (
            <div className="row" style={{ marginTop: 20 }}>
                <div className="col-2">
                    <FormGroup>
                        <Label>HTTP Verb</Label>
                        <Input
                            type="select"
                            name="method"
                            value={this.state.method}
                            onChange={this.handleChange}
                        >
                            <option>PUT</option>
                            <option>POST</option>
                            <option>GET</option>
                        </Input>
                    </FormGroup>
                </div>
                <div className="col-6">
                    <FormGroup>
                        <Label>Url</Label>
                        <Input
                            type="text"
                            name="url"
                            value={this.state.url}
                            onChange={this.handleChange}
                            placeholder="http://...."
                        />
                    </FormGroup>
                </div>
                <div className="col-2">
                    <FormGroup>
                        <Label>Load (req/s)</Label>
                        <Input
                            type="number"
                            name="request_per_second"
                            onChange={this.handleChange}
                            value={this.state.request_per_second}
                            placeholder={5}
                        />
                    </FormGroup>
                </div>
                <div className="col-2" />
                {this.state.method !== "GET" && (
                    <div className="col-2">
                        <FormGroup>
                            <Label>Content Type</Label>
                            <Input
                                type="select"
                                name="content_type"
                                onChange={this.handleChange}
                                value={this.props.content_type}
                            >
                                <option>application/json</option>
                                <option>application/xml</option>
                            </Input>
                        </FormGroup>
                    </div>
                )}

                {this.state.method !== "GET" && (
                    <div className="col-8">
                        <Label>Body</Label>
                        <AceEditor
                            mode="yaml"
                            theme="github"
                            name="editor"
                            editorProps={{ $blockScrolling: true }}
                            style={{ width: "100%", height: "80px" }}
                            onChange={this.onChange}
                        />
                    </div>
                )}
                <div className="col-10">
                    <Button
                        className="btn btn-default float-right"
                        onClick={this.handleRemove}
                        type="button"
                    >
                        X Remove
                    </Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TestPlanComponent);
