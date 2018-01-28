import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { push } from "react-router-redux";

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

    componentWillReceiveProps(nextProps) {
        console.log("recv:", nextProps);
        if (nextProps.status && nextProps.status === "success") {
            this.props.push(`/${nextProps.data.id}/step/1`);
        }
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

const mapStateToProps = state => ({
    status: state.client.status,
    data: state.client.data
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ list_apps, create_app, push }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppCoverCreate);
