import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FormGroup, Input, Label } from "reactstrap";

import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/yaml";
import "brace/theme/monokai";

class AppTestPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            method: "",
            header: "",
            name: "",
            url: "",
            load: 0,
            body: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(newValue) {
        this.setState({ body: newValue });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <div className="container body-container">
                <h1 className="form-title">Test Plan</h1>
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
                        name="header"
                        onChange={this.handleChange}
                    >
                        <option>application/json</option>
                        <option>application/xml</option>
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label>Name</Label>
                    <Input
                        type="text"
                        name="name"
                        onChange={this.handleChange}
                    />
                </FormGroup>

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
                        name="load"
                        onChange={this.handleChange}
                    />
                </FormGroup>

                <AceEditor
                    mode="yaml"
                    theme="monokai"
                    name="editor"
                    value={""}
                    editorProps={{ $blockScrolling: true }}
                    style={{ width: "100%", height: "500px" }}
                    onChange={this.onChange}
                />
                <div className="action-footer">
                    <Link className="btn btn-main" to="/step/5">
                        Next
                    </Link>
                </div>
            </div>
        );
    }
}

export default AppTestPlan;
