import React from 'react';
import ReactDOM from 'react-dom';
import Step1 from './pages/Step1';
import registerServiceWorker from './registerServiceWorker';
import Step3 from './pages/Step3';
import Step4 from './pages/Step4';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(<Step4/>, document.getElementById('root'));
registerServiceWorker();