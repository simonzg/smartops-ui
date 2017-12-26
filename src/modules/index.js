import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import counter from "./counter";
import home from "./home";

export default combineReducers({
  routing: routerReducer,
  counter,
  home
});
