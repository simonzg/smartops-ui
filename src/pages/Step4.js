import React, { Component } from "react";
import logo from "../images/logo.svg";
import "../styles/App.css";
import Navbar from "../components/Navbar";
import GuideBar from "../components/GuideBar";
import AppTestPlan from "../components/AppTestPlan";

class Step4 extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <GuideBar step={4} />
        <AppTestPlan />
      </div>
    );
  }
}

export default Step4;
