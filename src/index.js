import ReactDOM from "react-dom";
import React, { Component } from "react";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/App.css";
import { Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import store, { history } from "./store";

import Home from "./containers/Home";
import Steps from "./pages/Steps";
import Counter from "./containers/Counter";
import Notification from "./containers/Notification";

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <div>
                        <Route exact path="/" component={Home} />
                        <Route path="/:app_id/step/:step" component={Steps} />
                        <Route path="/counter" component={Counter} />
                        <Notification />
                    </div>
                </ConnectedRouter>
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
