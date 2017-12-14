import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Container, Row, col } from 'reactstrap';


class AppRequirements extends Component {
    render() {
        return (
            <div className="container body-container">
        <div className="form-title">
            <h1>Operational Requirements</h1>
        </div>
        <div className="form-group row">
            <label for="tail" className="label-blue col-12">Maximum Tail Latency</label>
            <div className="col-5">
                <input className="form-control" name="tail" placeholder=" "></input>
            </div>
        </div>
        <div className="form-group row">
            <label for="error-rate" className="label-blue col-12">Maximum Error Rate</label>
            <div className="col-5">
                <input className="form-control" name="errorRate" placeholder=" "></input>
            </div>
        </div>
        <div className="action-footer"><Button>Next</Button></div>
        </div>

        );
    }
}

export default AppRequirements;