import React, { Component } from 'react';

class GuideBar extends Component {
    render() {
        return (
            <div className="container-fluid" style={{background: 'white'}}>
        <div className="container" style={{padding:'20px 0'}}>
            <ul className="guide-bar">
                <li className="active">
                    <div className="title">Operational Requirements</div>
                </li>
                <li className="active">
                    <div className="title">Application Blue Print</div>
                </li>
                <li>
                    <div className="title">Application Topology</div>
                </li>
                <li>
                    <div className="title">Testing Plan </div>
                </li>
                <li>
                    <div className="title">Dry Run Plan </div>
                </li>
                <li>
                    <div className="title">Dry Run </div>
                </li>
            </ul>
        </div>
    </div>
        );
    }
}

export default GuideBar;