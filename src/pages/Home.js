import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../styles/App.css';
import Navbar from '../components/Navbar';
import AppCover from '../components/AppCover';



class Home extends Component {
    render() {
        return (
            <div>
            <Navbar/>
            <AppCover/>     
            </div>
        );
    }
}

export default Home;