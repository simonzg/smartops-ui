import React, { Component } from "react";
import Navbar from "../components/Navbar";
import GuideBar from "../components/GuideBar";
import AppRequirements from "../components/AppRequirements";
import AppBlueprint from "../components/AppBlueprint";
import AppTopology from "../components/AppTopology";
import AppTestPlan from "../components/AppTestPlan";
import DryRun from "../components/DryRun";
import DryrunResult from "../components/DryrunResult";

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
        return <AppBlueprint app_id={app_id} step={step} />;
      case 3:
        return <AppTopology app_id={app_id} step={step} />;
      case 4:
        return <AppTestPlan app_id={app_id} step={step} />;
      case 5:
        return <DryRun app_id={app_id} step={step} />;
      case 6:
        return <DryrunResult app_id={app_id} step={step} />;
      default:
        return <AppRequirements app_id={app_id} step={1} />;
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
