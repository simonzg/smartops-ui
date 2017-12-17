import React, { Component } from "react";
import { Button, Container, col, ul, row } from "reactstrap";
import { BrowserRouter, Route, Link } from "react-router-dom";

class DryRun extends Component {
  render() {
    return (
      <div className="container body-container">
        <h1 className="form-title">Dry Run Plan</h1>
        <div className="row">
          <div className="plan-form col-8">
            <div className="form-title row">
              <div className="col-12">Pod:web</div>
            </div>
            <div className="row">
              <div className="col">
                <div className="title">Pod Replicas</div>
              </div>
              <div className="col">
                <div className="stats">2</div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="title">
                  <b>Nginx</b>
                </div>
              </div>
              <div className="col">
                <div className="stats" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="title">CPU</div>
              </div>
              <div className="col">
                <div className="stats">2.5</div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="title">Memory</div>
              </div>
              <div className="col">
                <div className="stats">1024</div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="title">
                  <b>Tomcat</b>
                </div>
              </div>
              <div className="col">
                <div className="stats" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="title">CPU</div>
              </div>
              <div className="col">
                <div className="stats">2.5</div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="title">Memory</div>
              </div>
              <div className="col">
                <div className="stats">512</div>
              </div>
            </div>
            <div className="form-title row">
              <div className="col-12">Pod:Database</div>
            </div>
            <div className="row">
              <div className="col">
                <div className="title">Pod Replicas</div>
              </div>
              <div className="col">
                <div className="stats">2</div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="title">
                  <b>Nginx</b>
                </div>
              </div>
              <div className="col">
                <div className="stats" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="title">CPU</div>
              </div>
              <div className="col">
                <div className="stats">2.5</div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="title">Memory</div>
              </div>
              <div className="col">
                <div className="stats">1024</div>
              </div>
            </div>
          </div>
        </div>
        <div className="action-footer">
          <Link className="btn btn-main" to="/step/4">
            Next
          </Link>
        </div>
      </div>
    );
  }
}

export default DryRun;
