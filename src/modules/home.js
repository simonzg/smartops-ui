import { BASE } from "./client";
import axios from "axios";

export const INIT = "home/INIT";
export const INIT_SUCCESS = "home/INIT_SUCCESS";
export const INIT_FAILED = "home/INIT_FAILED";

const initState = {
  apps: [],
  loading: false,
  error: ""
};

export default (state = initState, action) => {
  console.log("reduce: " + action.type);
  switch (action.type) {
    case INIT:
      return {
        ...state,
        loading: true
      };

    case INIT_SUCCESS:
      console.log(action);
      return {
        ...state,
        loading: false,
        apps: action.apps
      };
    case INIT_FAILED:
      console.log("ERROR: " + action.error);
      return {
        ...state,
        loading: false,
        apps: [],
        error: action.error
      };
    default:
      return state;
  }
};

export const init = () => {
  return dispatch => {
    dispatch({
      type: INIT
    });

    try {
      axios
        .get(BASE + "/apps")
        .then(resp => {
          dispatch({
            type: INIT_SUCCESS,
            apps: resp.data
          });
        })
        .catch(err => {
          dispatch({
            type: INIT_FAILED,
            error: err
          });
        });
    } catch (e) {
      console.log(e);
    }
  };
};
