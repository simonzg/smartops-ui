import React, { Component } from "react";
import { Button } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { load_dryrun_plan } from "../../modules/client";
import { push } from "react-router-redux";

class Step5_DryRunPlan extends Component {
  constructor(props) {
    super(props);
    this.state = { enable_run: true };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.load_dryrun_plan(this.props.app_id);
  }

  handleSubmit() {
    this.setState({ enable_run: false });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status && nextProps.status === "success") {
      this.props.push(`/${this.props.app_id}/step/${this.props.step + 1}`);
    }
  }

  render() {
    let content = <div />;
    let runBtnClass = "btn btn-main ";
    let runBtnText = "Start Dryrun";
    if (!this.state.enable_run) {
      runBtnClass += "disabled";
      runBtnText = "Running ...";
      this.props.push(`/${this.props.app_id}/step/${this.props.step + 1}`);
    }
    if (this.props.plan && this.props.plan.length > 0) {
      content = this.props.plan.map((el, idx) => {
        let name = (
          <div>
            <div className="blue-ribbon row">
              <div className="col-12">Pod:{el.name}</div>
            </div>
            <div className="row hover-bg">
              <div className="col">
                <div className="title">Containers</div>
              </div>
              <div className="col">
                <div className="stats">{el.pod_replicas}</div>
              </div>
            </div>
          </div>
        );
        let details = el.containers.map((c, i) => {
          return (
            <div key={i} className="white-box">
              <div className="row hover-bg">
                <div className="col">
                  <div className="title">
                    <b>{c.name}</b>
                  </div>
                </div>
                <div className="col">
                  <div className="stats" />
                </div>
              </div>

              <div className="row hover-bg">
                <div className="col">
                  <div className="title">CPU</div>
                </div>
                <div className="col">
                  <div className="stats">{c.cpu}</div>
                </div>
              </div>
              <div className="row hover-bg">
                <div className="col">
                  <div className="title">Memory</div>
                </div>
                <div className="col">
                  <div className="stats">{c.memory}</div>
                </div>
              </div>
            </div>
          );
        });

        return (
          <div key={idx}>
            {name}
            {details}
          </div>
        );
      });
    } else {
      content = <div style={{ background: "#f5f5f5" }}>Loading...</div>;
    }

    return (
      <div className="container body-container">
        <h1 className="page-title">Dry Run Plan</h1>
        <div className="row">
          <div className="plan-form col-8">{content}</div>
        </div>
        <div className="action-footer">
          <Button className={runBtnClass} onClick={this.handleSubmit}>
            {runBtnText}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plan: state.client.data
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ load_dryrun_plan, push }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Step5_DryRunPlan);
