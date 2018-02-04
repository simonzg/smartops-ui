import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { get_result } from "../../modules/client";
import { Progress } from "reactstrap";

class Step6_DryRunResult extends Component {
  componentWillMount() {
    this.props.get_result(this.props.app_id);
  }

  parsePlan(p, cf, is_auto = true) {
    let sample_plan = {
      latency: 0,
      error_rate: 0,
      cpu: 0,
      ram: 0,
      pods_count: 0,
      containers_count: 0,
      pods: [],
      is_auto: is_auto
    };
    let plan = Object.assign({}, sample_plan);
    plan.latency = p.sla_result.latency;
    plan.error_rate = p.sla_result.error_rate;

    plan.pods_count = cf.length;
    plan.containers_count = cf.reduce((sum, conf) => conf.replicas + sum, 0);
    let cpu_ram = cf.reduce(
      (sum, conf) => {
        sum.pods.push({ name: conf.name, containers: conf.replicas });
        let cpu_quota = Object.entries(conf.podConfig.containersConfig).reduce(
          (sum, c) => sum + c[1].cpu_quota * conf.replicas,
          0
        );
        let mem_limit = Object.entries(conf.podConfig.containersConfig).reduce(
          (sum, c) => sum + c[1].mem_limit * conf.replicas,
          0
        );
        return {
          ...sum,
          cpu: sum.cpu + parseFloat(cpu_quota),
          ram: sum.ram + parseFloat(mem_limit)
        };
      },
      { cpu: 0, ram: 0, pods: [] }
    );

    plan = { ...plan, ...cpu_ram };
    plan.cpu = (plan.cpu / 1000000).toFixed(2); //
    plan.ram = (plan.ram / 1000000000).toFixed(2); // to GB
    return plan;
  }

  renderTable(plan, idx) {
    let pods = plan.pods.map((pod, idx) => (
      <div className="row" key={idx}>
        <div className="col">
          <div>
            Name: <b>{pod.name}</b>
          </div>
        </div>
        <div className="col">
          <div>
            Container: <b>{pod.containers}</b>
          </div>
        </div>
        <div className="col" />
      </div>
    ));

    return (
      <div className="col-md-6 result-table" key={idx}>
        <ul className="result-table-head">
          <div
            className="title text-center"
            style={{
              background: "#cfe8fc",
              marginBottom: 15,
              fontWeight: "bold",
              fontSize: 16,
              paddingTop: 8,
              paddingBottom: 5
            }}
          >
            {plan.is_auto ? "Auto Plan " + (1 + idx) : "Manual Plan"}
          </div>

          <li>
            <div className="title">{plan.pods_count}</div>Pods
          </li>
          <li>
            <div className="title">{plan.containers_count}</div>Container
          </li>
          <li>
            <div className="title">{plan.cpu}</div>Total CPU
          </li>
          <li>
            <div className="title">{plan.ram}GB</div>Total RAM
          </li>
        </ul>
        <div className="result-table-body">
          <div className="result-table-stats">
            <div className="title">Pods</div>
            {pods}
            <div className="row">
              <div className="col-12" style={{ marginTop: 15 }}>
                <div className="title"> Latency </div>
                <Progress
                  striped
                  color="success"
                  value={plan.latency * 100 / 5000}
                >
                  {plan.latency} ms
                </Progress>
              </div>
              <div className="col-12" style={{ marginTop: 15 }}>
                <div className="title">Error Rate</div>
                <Progress striped color="warning" value={plan.error_rate}>
                  {plan.error_rate.toFixed(1)} %
                </Progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    let autoPlansData = [];
    let autoPlansTable = [];
    let manualPlanTable = <div />;

    let auto_plans = this.props.result.auto_plans;
    if (auto_plans && auto_plans.length > 0) {
      autoPlansData = auto_plans.map((p, idx) => {
        let cf = p.SetConfigs;
        return this.parsePlan(p, p.SetConfigs);
      });
      console.log("plans = ", autoPlansData.length);
      autoPlansTable = autoPlansData.map(this.renderTable);
    }

    let manual_plans = this.props.result.manual_plans;
    if (manual_plans && manual_plans.length >= 1) {
      let mp = manual_plans[0];
      let cf = this.props.result.capacity_plans.filter(cp => !cp.is_auto)[0]
        .SetConfigs;
      let plan = this.parsePlan(mp, cf, false);
      manualPlanTable = this.renderTable(plan, -1);
    }
    console.log(autoPlansTable);

    let result_status = this.props.result.auto_plan_status;

    return (
      <div className="container body-container">
        <h1 className="page-title">Dry Run Result</h1>
        <div className="col-10 " style={{ paddingLeft: 0 }}>
          <div className="row">
            {result_status == "COMPLETED" && manualPlanTable}
            {result_status == "COMPLETED" && autoPlansTable}
            {result_status == "CREATED" && (
              <div className="col-12">
                Dry run has been created, please wait for it to complete
              </div>
            )}
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
