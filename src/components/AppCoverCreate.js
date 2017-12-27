import React, { Component } from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import {
    FormGroup,
    Label,
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";

import { list_apps, create_app } from "../modules/client";

class AppCoverCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            value: ""
        };

        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit() {
        this.props.create_app(this.state.value);
        this.toggle();
        this.props.list_apps();
    }

    render() {
        return (
            <div className="col-md-4">
                <div className="app-cover-create">
                    <div className="title">
                        <Button color="link" onClick={this.toggle}>
                            {this.props.buttonLabel}Create New
                        </Button>

                        <div id="popup">
                            <Modal
                                isOpen={this.state.modal}
                                toggle={this.toggle}
                                className={this.props.className}
                            >
                                <ModalHeader toggle={this.toggle}>
                                    Create New Application
                                </ModalHeader>

                                <ModalBody>
                                    <FormGroup>
                                        <Label>App Name</Label>
                                        <Input
                                            placeholder=""
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="secondary"
                                        onClick={this.toggle}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        onClick={this.handleSubmit}
                                    >
                                        Create
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators({ list_apps, create_app }, dispatch);

export default connect(null, mapDispatchToProps)(AppCoverCreate);
