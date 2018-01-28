import React, { Component } from "react";
import Navbar from "../Navbar";
import GuideBar from "../GuideBar";
import Step1_Requirements from "./Step1_Requirements";
import Step2_Blueprint from "./Step2_Blueprint";
import Step3_Topology from "./Step3_Topology";
import Step4_TestPlan from "./Step4_TestPlan";
import Step5_DryRunPlan from "./Step5_DryRunPlan";
import Step6_DryRunResult from "./Step6_DryRunResult";

class Steps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: parseInt(props.match.params.step, 10),
      app_id: props.match.params.app_id
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty("match")) {
      this.setState({ step: parseInt(nextProps.match.params.step, 10) });
    }
  }

  getMainComponent(app_id, step) {
    switch (step) {
      case 2:
        return <Step2_Blueprint app_id={app_id} step={step} />;
      case 3:
        return <Step3_Topology app_id={app_id} step={step} />;
      case 4:
        return <Step4_TestPlan app_id={app_id} step={step} />;
      case 5:
        return <Step5_DryRunPlan app_id={app_id} step={step} />;
      case 6:
        return <Step6_DryRunResult app_id={app_id} step={step} />;
      default:
        return <Step1_Requirements app_id={app_id} step={1} />;
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <GuideBar step={this.state.step} app_id={this.state.app_id} />
        {this.getMainComponent(this.state.app_id, this.state.step)}
      </div>
    );
  }
}

export default Steps;
