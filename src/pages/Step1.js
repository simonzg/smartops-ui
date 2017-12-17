import React, { Component } from "react";
import "../styles/App.css";
import Navbar from "../components/Navbar";
import AppRequirements from "../components/AppRequirements";
import GuideBar from "../components/GuideBar";

class Step1 extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <GuideBar step={1} />
        <AppRequirements />
      </div>
    );
  }
}

export default Step1;
