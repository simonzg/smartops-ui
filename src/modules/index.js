import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import counter from "./counter";
import client from "./client";

export default combineReducers({
  routing: routerReducer,
  counter,
  client
});
