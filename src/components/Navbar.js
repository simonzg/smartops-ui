import React, { Component } from 'react';
import logo from '../images/logo.png';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-blue">
        <div className="container">
            <a className="navbar-brand" href="#">
              <img className="img-fluid" src={logo} width="150"></img>
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        </div>
    </nav>
        );
    }
}

export default Navbar;