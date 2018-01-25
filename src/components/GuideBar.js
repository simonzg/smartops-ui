import React, { Component } from "react";
import { Link } from "react-router-dom";
import { push } from "react-router-redux";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class GuideBar extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        let elem = e.target;
        this.props.jumpToStep(this.props.app_id, elem.dataset.step);
    }

    render() {
        let titles = [
            "Operational Requirements",
            "Application Blue Print",
            "Application Topology",
            "Test Plan",
            "Dry Run Plan",
            "Dry Run Results"
        ];
        let lis = [];
        titles.forEach((item, index) => {
            let className = "";
            if (this.props.step > index + 1) {
                className = "active";
            } else if (this.props.step == index + 1) {
                className = "current";
            }
            lis.push(
                <li
                    className={className}
                    key={index}
                    onClick={this.onClick}
                    data-step={index + 1}
                >
                    <div className="title" data-step={index + 1}>
                        {item}
                    </div>
                </li>
            );
        });

        return (
            <div className="container-fluid" style={{ background: "white" }}>
                <div className="container" style={{ padding: "20px 0 8px 0" }}>
                    <ul className="guide-bar">{lis}</ul>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            jumpToStep: (app_id, step) => push(`/${app_id}/step/${step}`)
        },
        dispatch
    );

export default connect(null, mapDispatchToProps)(GuideBar);
