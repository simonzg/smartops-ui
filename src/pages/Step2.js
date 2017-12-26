import React, { Component } from "react";
import "../styles/App.css";
import Navbar from "../components/Navbar";
import AppRequirements from "../components/AppRequirements";
import GuideBar from "../components/GuideBar";

import { render } from "react-dom";
import brace from "brace";
import AceEditor from "react-ace";
import { BrowserRouter, Route, Link } from "react-router-dom";

import "brace/mode/yaml";
import "brace/theme/monokai";

class Step1 extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <GuideBar step={2} />
        <div className="container">
          <div className="form-title">
            <h1 style={{ color: "#2699fb" }}>Application Blue Print</h1>
          </div>
          <AceEditor
            mode="yaml"
            theme="monokai"
            name="editor"
            value={`
--- !clarkevans.com/^invoice
invoice: 34843
date   : 2001-01-23
bill-to: &id001
    given  : Chris
    family : Dumars
    address:
        lines: |
            458 Walkman Dr.
            Suite #292
        city    : Royal Oak
        state   : MI
        postal  : 48046
ship-to: *id001
product:
    - sku         : BL394D
      quantity    : 4
      description : Basketball
      price       : 450.00
    - sku         : BL4438H
      quantity    : 1
      description : Super Hoop
      price       : 2392.00
tax  : 251.42
total: 4443.52
comments: >
    Late afternoon is best.
    Backup contact is Nancy
    Billsmer @ 338-4338.`}
            editorProps={{ $blockScrolling: true }}
            style={{ width: "100%", height: "500px" }}
          />
          <div className="action-footer">
            <Link className="btn btn-main" to="/step/3">
              Next
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Step1;
