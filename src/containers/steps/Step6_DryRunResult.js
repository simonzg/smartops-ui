import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { get_result } from "../../modules/client";

class Step6_DryRunResult extends Component {
  componentWillMount() {
    this.props.get_result(this.props.app_id);
  }

  render() {
    return (
      <div className="container body-container">
        <h1 className="page-title">Dry Run Result</h1>
        <div className="col-10 result-table" style={{ "padding-left": 0 }}>
          <ul className="result-table-head">
            <li>
              <div className="title">5</div>Pods
            </li>
            <li>
              <div className="title">6</div>Container
            </li>
            <li>
              <div className="title">55000</div>CPU
            </li>
            <li>
              <div className="title">5566</div>Memory
            </li>
          </ul>
          <div className="result-table-body">
            <div className="result-table-stats">
              <div className="row">
                <div className="col-sm">
                  <div className="title">Name: xxx</div>
                </div>
                <div className="col-sm">
                  <div className="title">Replica: 2</div>
                </div>
                <div className="col-sm" />
              </div>
              <div className="row">
                <div className="col-sm">
                  <div className="title">Container Name</div>
                  <div>mysql</div>
                  <div>mysql_forwarder</div>
                </div>
                <div className="col-sm">
                  <div className="title">CPU(mcores)</div>
                  <div>100000</div>
                  <div>500000</div>
                </div>
                <div className="col-sm">
                  <div className="title">Memory(MB)</div>
                  <div>2048</div>
                  <div>512</div>
                </div>
              </div>
              <div className="row">
                <div className="col-12" style={{ "margin-top": 15 }}>
                  <div>Latency</div>
                  <div className="progress">
                    <div
                      className="progress-bar bg-success"
                      style={{ width: 75 }}
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
                <div className="col-12" style={{ "margin-top": 15 }}>
                  <div>Erro Rate</div>
                  <div className="progress">
                    <div
                      className="progress-bar bg-warning"
                      style={{ width: 25 }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ get_result }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Step6_DryRunResult);
