import React, { Component } from "react";

class GuideBar extends Component {
    render() {
        let titles = [
            "Operational Requirements",
            "Application Blue Print",
            "Application Topology",
            "Test Plan",
            "Dry Run Plan",
            "Dry Run"
        ];
        let lis = [];
        titles.forEach((item, index) => {
            lis.push(
                <li className={this.props.step > index ? "active" : ""}>
                    <div className="title">Application Topology</div>
                </li>
            );
        });

        return (
            <div className="container-fluid" style={{ background: "white" }}>
                <div className="container" style={{ padding: "20px 0" }}>
                    <ul className="guide-bar">{lis}</ul>
                </div>
            </div>
        );
    }
}

export default GuideBar;
