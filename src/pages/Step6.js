import React, { Component } from "react";
import "../styles/App.css";
import Navbar from "../components/Navbar";
import GuideBar from "../components/GuideBar";
import AppTestPlan from "../components/AppTestPlan";
import DryRun from "../components/DryRun";
import DryrunResult from "../components/DryrunResult";

class Step6 extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <GuideBar step={6} />
        <DryrunResult />
      </div>
    );
  }
}

export default Step6;
