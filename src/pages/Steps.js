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
    this.state = { step: parseInt(props.match.params.step, 10) };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty("match")) {
      this.setState({ step: parseInt(nextProps.match.params.step, 10) });
    }
  }

  getMainComponent(step) {
    switch (step) {
      case 2:
        return <AppBlueprint />;
      case 3:
        return <AppTopology />;
      case 4:
        return <AppTestPlan />;
      case 5:
        return <DryRun />;
      case 6:
        return <DryrunResult />;
      default:
        return <AppRequirements />;
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <GuideBar step={this.state.step} />
        {this.getMainComponent(this.state.step)}
      </div>
    );
  }
}

export default Steps;
