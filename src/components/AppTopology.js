import React, { Component } from "react";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { load_blueprint_json } from "../modules/client";
import TopologyGroup from "../components/TopologyGroup";

import { Link } from "react-router-dom";

class AppTopology extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    componentWillMount() {
        this.props.load_blueprint_json(this.props.app_id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.status && nextProps.status == "success") {
            this.props.push(
                `/${this.props.app_id}/step/${this.props.step + 1}`
            );
        }
    }

    render() {
        console.log(this.props.data);

        let topologies = <div />;
        if (this.props.topology && Object.keys(this.props.topology)) {
            let pod_names = Object.keys(this.props.topology);
            topologies = pod_names.map(pn => (
                <TopologyGroup {...this.props.topology[pn]} pod_name={pn} />
            ));
        }

        let entrypoints = <DropdownItem />;
        if (
            this.props.hasOwnProperty("entrypoints") &&
            this.props.entrypoints
        ) {
            entrypoints = this.props.entrypoints.map(ep => (
                <DropdownItem>{ep}</DropdownItem>
            ));
        }

        let next_url = `/${this.props.app_id}/step/4`;

        return (
            <div className="container body-container">
                <div className="page-title"> Application Topology</div>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <span
                        onClick={this.toggle}
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded={this.state.dropdownOpen}
                    >
                        {this.state.value}
                    </span>
                    <Dropdown
                        isOpen={this.state.dropdownOpen}
                        toggle={this.toggle}
                    >
                        <DropdownToggle caret>
                            Select Entry Point
                        </DropdownToggle>
                        <DropdownMenu>{entrypoints}</DropdownMenu>
                    </Dropdown>
                </Dropdown>

                <div className="topology">{topologies}</div>
                <div className="action-footer">
                    <Link className="btn btn-main" to={next_url}>
                        Next
                    </Link>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    topology: state.client.data.topology,
    data: state.client.data,
    entrypoints: state.client.data.entrypoints
});

const mapDispatchToProps = dispatch =>
    bindActionCreators({ load_blueprint_json }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppTopology);
