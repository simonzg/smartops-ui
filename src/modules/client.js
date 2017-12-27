import axios from "axios";

const BASE = "http://localhost:8000";

export const LIST_APPS = "client/LIST_APPS";
export const LIST_APPS_SUCCESS = "client/LIST_APPS_SUCCESS";
export const LIST_APPS_FAILURE = "client/LIST_APPS_FAILURE";

export const CREATE_APP = "client/CREATE_APP";
export const CREATE_APP_SUCCESS = "client/CREATE_APP_SUCCESS";
export const CREATE_APP_FAILURE = "client/CREATE_APP_FAILURE";

const events = [LIST_APPS, CREATE_APP];

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
    let baseState = {
      ...state,
      loading: false
    };
    switch (action.type) {
      case LIST_APPS_SUCCESS:
        return Object.assign(baseState, { apps: action.data });

      case CREATE_APP_SUCCESS:
        return Object.assign(baseState, { apps: [...state.apps, action.data] });

      default:
        return Object.assign(baseState, { data: action.data });
    }
  }

  if (action.type.includes("_FAILURE")) {
    let baseState = {
      ...state,
      loading: false,
      error: action.error
    };

    switch (action.type) {
      case LIST_APPS_FAILURE:
        return Object.assign(baseState, { apps: [] });

      default:
        return Object.assign(baseState, { data: {} });
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
        dispatch({
          type: base_type + "_SUCCESS",
          data: response.data,
          payload: payload
        });
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
    callAPI(dispatch, LIST_APPS, "get", "/apps");
  };
};

export const create_app = name => {
  return dispatch => {
    callAPI(dispatch, CREATE_APP, "post", "/apps", { name: name });
  };
};
