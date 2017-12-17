import React, { Component } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";

class AppCover extends Component {
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
            <div className="container app-cover-container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="app-cover-create">
                            <div className="title">
                                <Button color="link" onClick={this.toggle}>
                                    {this.props.buttonLabel}Create New
                                </Button>
                                <Modal
                                    isOpen={this.state.modal}
                                    toggle={this.toggle}
                                    className={this.props.className}
                                >
                                    <ModalHeader toggle={this.toggle}>
                                        Modal title
                                    </ModalHeader>
                                    <ModalBody>HELLO</ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="primary"
                                            onClick={this.toggle}
                                        >
                                            Do Something
                                        </Button>{" "}
                                        <Button
                                            color="secondary"
                                            onClick={this.toggle}
                                        >
                                            Cancel
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        {" "}
                        <div className="app-cover">
                            <div className="header">Status</div>
                            <div className="body">
                                <div className="name">Application Name</div>
                                <div className="row">
                                    <div className="col-md-4">Service</div>
                                    <div className="col-md-4">Container</div>
                                    <div className="col-md-4">Pod</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="app-cover">
                            <div className="header">Status</div>
                            <div className="body">
                                <div className="name">Application Name</div>
                                <div className="row">
                                    <div className="col-md-4">Service</div>
                                    <div className="col-md-4">Container</div>
                                    <div className="col-md-4">Pod</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="app-cover">
                            <div className="header">Status</div>
                            <div className="body">
                                <div className="name">Application Name</div>
                                <div className="row">
                                    <div className="col-md-4">Service</div>
                                    <div className="col-md-4">Container</div>
                                    <div className="col-md-4">Pod</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppCover;
