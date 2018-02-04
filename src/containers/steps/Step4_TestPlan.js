import React, { Component } from "react";
import { FormGroup, Input, Label, Button } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { show_notification, update_app } from "../../modules/client";
import { push } from "react-router-redux";
import TestPlanComponent from "../TestPlanComponent";
import update from "react-addons-update"; // ES6

let sample_plan = {
    method: "GET",
    content_type: "application/json",
    url: "",
    request_per_second: 0
};

class Step4_TestPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plans: [sample_plan]
        };

        this.handleChange = this.handleChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addComponent = this.addComponent.bind(this);
        this.removeComponent = this.removeComponent.bind(this);
    }

    handleChange(id, plan) {
        let plans = this.state.plans;
        plans[id] = plan;
        this.setState({ plans: plans });
    }

    validateForm(data) {
        return (
            data.method &&
            data.content_type &&
            data.url &&
            data.request_per_second
        );
    }

    handleSubmit() {
        console.log("plans[0]", this.state.plans[0]);
        if (this.validateForm(this.state.plans[0])) {
            this.props.update_app(this.props.app_id, { testplan: this.state });
        } else {
            this.props.show_notification(
                "danger",
                "No input could be empty here"
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("next props: ", nextProps);
        if (nextProps.status && nextProps.status === "success") {
            this.props.push(
                `/${this.props.app_id}/step/${this.props.step + 1}`
            );
        }
    }

    addComponent() {
        let plans = this.state.plans;
        plans.push(sample_plan);
        this.setState({ plans: plans });
    }

    removeComponent(id) {
        this.setState({
            plans: update(this.state.plans, { $splice: [[id, 1]] })
        });
    }

    render() {
        let components = [];
        for (var i = 0; i < this.state.plans.length; i++) {
            let plan = this.state.plans[i];
            components.push(
                <TestPlanComponent
                    {...plan}
                    key={i}
                    id={i}
                    handleRemove={this.removeComponent}
                    handleChange={this.handleChange}
                />
            );
        }
        return (
            <div className="container body-container">
                <h1 className="page-title">Test Plan</h1>

                {components}

                <div className="action-footer">
                    <Button
                        className="btn btn-main"
                        onClick={this.handleSubmit}
                    >
                        Save
                    </Button>
                    <Button
                        className="btn btn-default"
                        onClick={this.addComponent}
                    >
                        Add One
                    </Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    status: state.client.status,
    last_updated: state.client.last_updated
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ push, show_notification, update_app }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Step4_TestPlan);
