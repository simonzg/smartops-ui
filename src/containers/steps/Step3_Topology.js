import React, { Component } from "react";
import { FormGroup, Input, Label, Button } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { load_blueprint_json, update_app } from "../../modules/client";
import TopologyGroup from "./TopologyGroup";
import { push } from "react-router-redux";

class Step3_Topology extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.state = {
            entrypoint: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit() {
        this.props.update_app(this.props.app_id, {
            entrypoint: this.state.entrypoint
        });
    }

    componentWillMount() {
        this.props.load_blueprint_json(this.props.app_id);
    }

    componentWillReceiveProps(nextProps) {
        console.log("next props = ", nextProps);
        if (nextProps.status && nextProps.status === "success") {
            this.props.push(
                `/${this.props.app_id}/step/${this.props.step + 1}`
            );
        }
    }

    render() {
        let topologies = <div />;
        if (this.props.topology && Object.keys(this.props.topology)) {
            let pod_names = Object.keys(this.props.topology);
            topologies = pod_names.map((pn, idx) => (
                <TopologyGroup
                    {...this.props.topology[pn]}
                    pod_name={pn}
                    key={idx}
                />
            ));
        }

        let entrypoints = <div />;
        if (this.props.entrypoints) {
            if (this.state.entrypoint !== this.props.entrypoints[0]) {
                this.setState({ entrypoint: this.props.entrypoints[0] });
            }
            entrypoints = this.props.entrypoints.map((ep, idx) => (
                <option value={ep} key={idx}>
                    {ep}
                </option>
            ));
        }

        let next_url = `/${this.props.app_id}/step/4`;

        return (
            <div className="container body-container">
                <div className="page-title"> Application Topology</div>
                <div className="row">
                    <div className="col-3">
                        <Label>Entrypoint</Label>
                        <FormGroup
                            style={{ display: "inline-block", marginLeft: 20 }}
                        >
                            <Input
                                type="select"
                                name="method"
                                onChange={this.handleChange}
                            >
                                {entrypoints}
                            </Input>
                        </FormGroup>
                    </div>
                </div>
                <div className="topology">{topologies}</div>
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
    topology: state.client.data.topology,
    data: state.client.data,
    status: state.client.status,
    entrypoints: state.client.data.entrypoints
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ load_blueprint_json, update_app, push }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Step3_Topology);
