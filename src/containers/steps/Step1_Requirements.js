import React, { Component } from "react";
import { Button } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
    save_requirement,
    show_notification,
    get_app_info
} from "../../modules/client";
import { push } from "react-router-redux";

class Step1_Requirements extends Component {
    constructor(props) {
        super(props);
        this.state = { latency: 0, error_rate: 0 };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    validateForm() {
        return this.state.latency > 0 && this.state.error_rate > 0;
    }

    handleSubmit() {
        if (this.validateForm()) {
            this.props.save_requirement(this.props.app_id, { sla: this.state });
        } else {
            this.props.show_notification(
                "danger",
                "Latency and Error Rate must be bigger than 0"
            );
        }
    }

    componentWillMount() {
        this.props.get_app_info(this.props.app_id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.status && nextProps.status === "success") {
            this.props.push(
                `/${this.props.app_id}/step/${this.props.step + 1}`
            );
        }

        console.log("app status:", nextProps.app_status);

        if (nextProps.app_status && nextProps.app_status === "PLAN_GENERATED") {
            this.props.push(`/${this.props.app_id}/step/6`);
        }
    }

    render() {
        return (
            <div className="container body-container">
                <div className="page-title"> Operational Requirements</div>
                <div className="form-group row">
                    <label htmlFor="tail" className="label-blue col-12">
                        Maximum Tail Latency
                    </label>
                    <div className="col-5">
                        <input
                            className="form-control"
                            name="latency"
                            placeholder=" "
                            onChange={this.handleChange}
                            type="number"
                            value={this.state.latency}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="error-rate" className="label-blue col-12">
                        Maximum Error Rate
                    </label>
                    <div className="col-5">
                        <input
                            className="form-control"
                            name="error_rate"
                            placeholder=" "
                            onChange={this.handleChange}
                            type="number"
                            value={this.state.error_rate}
                        />
                    </div>
                </div>
                <div className="action-footer">
                    <Button
                        className="btn btn-main"
                        onClick={this.handleSubmit}
                    >
                        Save
                    </Button>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    status: state.client.status,
    app_status: state.client.app_status
});
const mapDispatchToProps = dispatch =>
    bindActionCreators(
        { save_requirement, push, show_notification, get_app_info },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Step1_Requirements);
