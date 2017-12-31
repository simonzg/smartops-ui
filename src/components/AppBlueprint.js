import React, { Component } from "react";

import { render } from "react-dom";
import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/yaml";
import "brace/theme/monokai";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

import { load_blueprint, save_blueprint } from "../modules/client";
import { push } from "react-router-redux";

class AppBlueprint extends Component {
    constructor(props) {
        super(props);
        this.state = { yml: "" };

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.props.load_blueprint(this.props.app_id);
    }

    componentWillReceiveProps(nextProps) {
        console.log("recved props: ", nextProps);
        if (nextProps.hasOwnProperty("yml")) {
            this.setState({ yml: nextProps.yml });
        }

        if (nextProps.status && nextProps.status == "success") {
            this.props.push(
                `/${this.props.app_id}/step/${this.props.step + 1}`
            );
        }
    }

    onChange(newValue) {
        console.log("new value", newValue);
        this.setState({ yml: newValue });
    }

    handleSubmit() {
        this.props.save_blueprint(this.props.app_id, {
            content: this.state.yml
        });
    }

    render() {
        console.log("render");
        return (
            <div className="container body-container">
                <div className="form-title">
                    <h1>Application Blue Print</h1>
                </div>

                <AceEditor
                    mode="yaml"
                    theme="monokai"
                    name="editor"
                    value={this.state.yml}
                    editorProps={{ $blockScrolling: true }}
                    style={{ width: "100%", height: "500px" }}
                    onChange={this.onChange}
                />
                <div className="action-footer">
                    <Button
                        className="btn btn-main"
                        onClick={this.handleSubmit}
                    >
                        Save
                    </Button>
                    <Link className="btn btn-main" to="/step/3">
                        Next
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("new state: ", state);
    return {
        yml: state.client.yml,
        status: state.client.status
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators({ load_blueprint, save_blueprint, push }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppBlueprint);
