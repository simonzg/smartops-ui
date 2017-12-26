import React, { Component } from "react";
import { Link } from "react-router-dom";

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

class AppCoverCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
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
                                    Creat New Application
                                </ModalHeader>

                                <ModalBody>
                                    <FormGroup>
                                        <Label htmlFor="appname">
                                            App Name
                                        </Label>
                                        <Input placeholder="" />
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
                                        onClick={this.toggle}
                                    >
                                        <Link
                                            className="btn btn-main"
                                            to="/step/1"
                                        >
                                            Create
                                        </Link>
                                    </Button>{" "}
                                </ModalFooter>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppCoverCreate;
