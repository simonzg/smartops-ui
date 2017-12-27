import axios from "axios";

const BASE = "http://localhost:8000";

export const INIT = "home/INIT";
export const INIT_SUCCESS = "home/INIT_SUCCESS";
export const INIT_FAILURE = "home/INIT_FAILURE";

export const CREATE_APP = "home/CREATE_APP";
export const CREATE_APP_SUCCESS = "home/CREATE_APP_SUCCESS";
export const CREATE_APP_FAILURE = "home/CREATE_APP_FAILURE";

const events = [INIT, CREATE_APP];

const list_appsState = {
  apps: [],
  data: {},
  loading: false,
  error: ""
};

export default (state = list_appsState, action) => {
  console.log("action: ", action);
  if (events.includes(action.type)) {
    return {
      ...state,
      loading: true
    };
  }
  if (action.type.includes("_SUCCESS")) {
    if (action.type == INIT_SUCCESS) {
      return {
        ...state,
        loading: false,
        apps: action.data
      };
    } else {
      return {
        ...state,
        loading: false,
        data: action.data
      };
    }
  }
  if (action.type.includes("_FAILURE")) {
    if (action.type == INIT_FAILURE) {
      return {
        ...state,
        loading: false,
        error: action.error,
        apps: []
      };
    } else {
      return {
        ...state,
        loading: false,
        data: {},
        error: action.error
      };
    }
  }

  return state;
};

const callAPI = (dispatch, base_type, verb, url, payload = {}) => {
  dispatch({
    type: base_type
  });

  let config = {
    method: verb,
    url: BASE + url
  };

  if (verb != "get") {
    config.data = payload;
  }

  try {
    axios(config)
      .then(response => {
        dispatch({ type: base_type + "_SUCCESS", data: response.data });
        if (base_type == CREATE_APP) {
          // after create_app, trigger lis  t_apps action
          // list_apps()(dispatch);
        }
      })
      .catch(error => {
        dispatch({ type: base_type + "_FAILURE", error: error.message });
      });
  } catch (error) {
    let message = "";
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      message = `${error.response.status} ${error.response.data}`;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      message = "request sent but got no response";
    } else {
      // Something happened in setting up the request that triggered an Error
      message = error.message;
    }
    dispatch({ type: base_type + "_FAILURE", error: message });
  }
};

export const list_apps = () => {
  return dispatch => {
    callAPI(dispatch, INIT, "get", "/apps");
  };
};

export const create_app = name => {
  return dispatch => {
    callAPI(dispatch, CREATE_APP, "post", "/apps", { name: name });
  };
};
