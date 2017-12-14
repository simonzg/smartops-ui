import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../styles/App.css';
import Navbar from '../components/Navbar';
import AppTopology from '../components/AppTopology';
import GuideBar from '../components/GuideBar';



class Step3 extends Component {
    render() {
        return (
            <div>
            <Navbar/>
            <GuideBar/>
            <AppTopology/>
            </div>
        );
    }
}

export default Step3;