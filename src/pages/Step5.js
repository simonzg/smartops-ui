import React, { Component } from "react";
import "../styles/App.css";
import Navbar from "../components/Navbar";
import GuideBar from "../components/GuideBar";
import AppTestPlan from "../components/AppTestPlan";
import DryRun from "../components/DryRun";

class Step5 extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <GuideBar step={5} />
        <DryRun />
      </div>
    );
  }
}

export default Step5;
