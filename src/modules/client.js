import axios from "axios";
import { push } from "react-router-redux";

const BASE = "http://192.168.1.194:8080";

export const LIST_APPS = "client/LIST_APPS";
export const LIST_APPS_SUCCESS = "client/LIST_APPS_SUCCESS";
export const LIST_APPS_FAILURE = "client/LIST_APPS_FAILURE";

export const CREATE_APP = "client/CREATE_APP";
export const CREATE_APP_SUCCESS = "client/CREATE_APP_SUCCESS";
export const CREATE_APP_FAILURE = "client/CREATE_APP_FAILURE";

export const SAVE_REQUIREMENT = "client/SAVE_REQUIREMENT";
export const SAVE_REQUIREMENT_SUCCESS = "client/SAVE_REQUIREMENT_SUCCESS";
export const SAVE_REQUIREMENT_FAILURE = "client/SAVE_REQUIREMENT_FAILURE";

export const LOAD_BLUEPRINT = "client/LOAD_BLUEPRINT";
export const LOAD_BLUEPRINT_SUCCESS = "client/LOAD_BLUEPRINT_SUCCESS";
export const LOAD_BLUEPRINT_FAILURE = "client/LOAD_BLUEPRINT_FAILURE";

export const SAVE_BLUEPRINT = "client/SAVE_BLUEPRINT";
export const SAVE_BLUEPRINT_SUCCESS = "client/SAVE_BLUEPRINT_SUCCESS";
export const SAVE_BLUEPRINT_FAILURE = "client/SAVE_BLUEPRINT_FAILURE";

export const LOAD_BLUEPRINT_JSON = "client/LOAD_BLUEPRINT_JSON";
export const LOAD_BLUEPRINT_JSON_SUCCESS = "client/LOAD_BLUEPRINT_JSON_SUCCESS";
export const LOAD_BLUEPRINT_JSON_FAILURE = "client/LOAD_BLUEPRINT_JSON_FAILURE";

const events = [
  LIST_APPS,
  CREATE_APP,
  LOAD_BLUEPRINT,
  SAVE_BLUEPRINT,
  LOAD_BLUEPRINT_JSON
];

const list_appsState = {
  apps: [],
  data: {},
  yml: "",
  loading: false,
  status: "unknown", // could be either: unknown, success, failure
  error: ""
};

export default (state = list_appsState, action) => {
  if (events.includes(action.type)) {
    return {
      ...state,
      loading: true,
      status: "unknown"
    };
  }

  if (action.type.includes("_SUCCESS")) {
    let baseState = {
      ...state,
      loading: false
    };
    if (action.type.includes("CREATE_") || action.type.includes("SAVE_")) {
      console.log("SAVE_OR_CREATE");
      baseState = {
        ...state,
        loading: false,
        status: "success"
      };
    }
    switch (action.type) {
      case LIST_APPS_SUCCESS:
        return Object.assign(baseState, {
          apps: action.data,
          data: action.data
        });

      case CREATE_APP_SUCCESS:
        return Object.assign(baseState, {
          apps: [...state.apps, action.data],
          data: action.data
        });

      case LOAD_BLUEPRINT_SUCCESS:
        return Object.assign(baseState, {
          yml: action.data,
          data: action.data
        });

      default:
        return Object.assign(baseState, { data: action.data });
    }
  }

  if (action.type.includes("_FAILURE")) {
    let baseState = {
      ...state,
      loading: false,
      status: "failure",
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
        let type = base_type + "_SUCCESS";
        dispatch({
          type: type,
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

export const save_requirement = (app_id, payload) => {
  let url = `/apps/${app_id}/sla`;
  return dispatch => {
    callAPI(dispatch, SAVE_REQUIREMENT, "put", url, payload);
  };
};

export const load_blueprint = app_id => {
  console.log("loading blueprint");
  let url = `/apps/${app_id}/raw_blueprint`;
  return dispatch => {
    callAPI(dispatch, LOAD_BLUEPRINT, "get", url);
  };
};

export const save_blueprint = (app_id, payload) => {
  let url = `/apps/${app_id}/blueprint`;
  return dispatch => {
    callAPI(dispatch, SAVE_BLUEPRINT, "put", url, payload);
  };
};

export const load_blueprint_json = app_id => {
  let url = `/apps/${app_id}/blueprint`;
  return dispatch => {
    callAPI(dispatch, LOAD_BLUEPRINT, "get", url);
  };
};
