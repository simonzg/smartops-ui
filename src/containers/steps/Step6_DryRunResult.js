import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { get_result } from "../../modules/client";

class Step6_DryRunResult extends Component {
  componentWillMount() {
    this.props.get_result(this.props.app_id);
  }

  render() {
    let podContents = [];
    let podCount = 0;
    let containerCount = 0;
    let plan = {};
    let totalCpu = 0;
    let totalRam = 0;
    let latency = 0;
    let errorRate = 0;
    if (this.props.result.auto_plans && this.props.result.auto_plans.length > 0) {
      if (this.props.result.auto_plans[0].sla_result) {
        latency = this.props.result.auto_plans[0].sla_result.latency;
        errorRate = this.props.result.auto_plans[0].sla_result.error_rate;
      };
      plan = this.props.result.auto_plans[0];
      podCount = this.props.result.auto_plans[0].SetConfigs.length;
      let config = this.props.result.auto_plans[0].SetConfigs.map((el, idx) => {
        containerCount += el.replicas;
        let c = Object.entries(el.podConfig.containersConfig).forEach(([key, value]) => {
          totalCpu += value.cpu_quota*containerCount;
          totalRam += value.mem_limit*containerCount;
        });
        let podContent = (
          <div className="row">
            <div className="col-sm">
              <div className="title">Pod Name: {el.name}</div>
            </div>
            <div className="col-sm">
              <div className="title">Replica: {el.replicas}</div>
            </div>
            <div className="col-sm" />
          </div>
        );
        podContents.push(podContent)
      });
    };
    return (
      <div className="container body-container">
        <h1 className="page-title">Dry Run Result</h1>
        <div className="col-10 result-table" style={{ "padding-left": 0 }}>
          <ul className="result-table-head">
            <li>
              <div className="title">{podCount}</div>Pods
            </li>
            <li>
              <div className="title">{containerCount}</div>Container
            </li>
            <li>
              <div className="title">{totalCpu/1000000}</div>Total CPU
            </li>
            <li>
              <div className="title">{(totalRam/1000000000).toFixed(2)}GB</div>Total RAM
            </li>
          </ul>
          <div className="result-table-body">
            <div className="result-table-stats">
            {podContents}
            <div className="row">
              <div className="col-12" style={{ "margin-top": 15 }}>
                <div>Latency: {latency}</div>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: 75 }}
                    aria-valuenow={latency}
                    aria-valuemin="0"
                    aria-valuemax="50000"
                  />
                </div>
              </div>
              <div className="col-12" style={{ "margin-top": 15 }}>
                <div>Erro Rate: {errorRate}</div>
                <div className="progress">
                  <div
                    className="progress-bar bg-warning"
                    style={{ width: 25 }}
                    aria-valuenow={errorRate}
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

const mapStateToProps = state => ({
  result: state.client.data
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ get_result }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Step6_DryRunResult);
