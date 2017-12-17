import React, { Component } from "react";
import "../styles/App.css";
import Navbar from "../components/Navbar";
import GuideBar from "../components/GuideBar";
import AppRequirements from "../components/AppRequirements";
import AppBlueprint from "../components/AppBlueprint";
import AppTopology from "../components/AppTopology";
import AppTestPlan from "../components/AppTestPlan";
import DryRun from "../components/DryRun";
import DryrunResult from "../components/DryrunResult";
import { BrowserRouter, Route, Link } from "react-router-dom";

class Steps extends Component {
  constructor(props) {
    super(props);
    this.state = { step: 1 };
  }

  componentWillReceiveProps(nextProps) {
    console.log("new props: ", nextProps);
    if (nextProps.hasOwnProperty("match")) {
      this.setState({ step: nextProps.match.params.step });
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    return (
      <div>
        <Navbar />
        <GuideBar step={this.state.step} />
        <BrowserRouter>
          <div>
            <Route path="/step/1" component={AppRequirements} />
            <Route path="/step/2" component={AppBlueprint} />
            <Route path="/step/3" component={AppTopology} />
            <Route path="/step/4" component={AppTestPlan} />
            <Route path="/Step/5" component={DryRun} />
            <Route path="/Step/6" component={DryrunResult} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default Steps;
