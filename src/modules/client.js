import axios from "axios";

// const BASE = "http://10.145.88.67:8000";
const BASE = "http://localhost:8000";

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

export const LOAD_DRYRUN_PLAN = "client/LOAD_DRYRUN_PLAN";
export const LOAD_DRYRUN_PLAN_SUCCESS = "client/LOAD_DRYRUN_PLAN_SUCCESS";
export const LOAD_DRYRUN_PLAN_FAILURE = "client/LOAD_DRYRUN_PLAN_FAILURE";

export const LOAD_DRYRUN_RESULT = "client/LOAD_DRYRUN_RESULT";
export const LOAD_DRYRUN_RESULT_SUCCESS = "client/LOAD_DRYRUN_RESULT_SUCCESS";
export const LOAD_DRYRUN_RESULT_FAILURE = "client/LOAD_DRYRUN_RESULT_FAILURE";

export const NOTIFICATION = "client/NOTIFICATION";
export const CLEAR_NOTIFICATION = "client/CLEAR_NOTIFICATION";

const events = [
  LIST_APPS,
  CREATE_APP,
  LOAD_BLUEPRINT,
  SAVE_BLUEPRINT,
  LOAD_BLUEPRINT_JSON,
  LOAD_DRYRUN_PLAN,
  LOAD_DRYRUN_RESULT
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
      loading: false,
      error: ""
    };

    // save or create
    if (action.type.includes("CREATE_") || action.type.includes("SAVE_")) {
      console.log("SAVE_OR_CREATE");
      baseState = {
        ...state,
        loading: false,
        status: "success"
      };
    }

    // ajax call success
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

  // ajax call failure
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

  // notification
  switch (action.type) {
    case NOTIFICATION:
      return {
        ...state,
        notification: { color: action.color, message: action.message }
      };
    case CLEAR_NOTIFICATION:
      return { ...state, notification: null };
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

  if (verb !== "get") {
    config.data = payload;
  }

  try {
    axios(config)
      .then(response => {
        let type = base_type + "_SUCCESS";
        console.log(
          verb,
          url,
          "\npayload = ",
          JSON.stringify(payload),
          "\nresponse.data = ",
          JSON.stringify(response.data)
        );
        dispatch({
          type: type,
          data: response.data,
          payload: payload
        });
      })
      .catch(error => {
        console.log(
          verb,
          url,
          "\npayload = ",
          JSON.stringify(payload),
          "\nerror = ",
          JSON.stringify(error)
        );
        dispatch({ type: base_type + "_FAILURE", error: error.message });
        dispatch({
          type: NOTIFICATION,
          color: "danger",
          message: error.message
        });
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

// apps
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

// blueprint
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
    callAPI(dispatch, LOAD_BLUEPRINT_JSON, "get", url);
  };
};

// dryrun

export const load_dryrun_plan = app_id => {
  let url = `/apps/${app_id}/dryrun_plan`;
  return dispatch => {
    callAPI(dispatch, LOAD_DRYRUN_PLAN, "get", url);
  };
};

export const load_dryrun_result = app_id => {
  let url = `/apps/${app_id}/dryrun_result`;
  return dispatch => {
    callAPI(dispatch, LOAD_DRYRUN_RESULT, "get", url);
  };
};

// notification
export const show_notification = (color, message) => {
  return dispatch => {
    dispatch({ type: NOTIFICATION, color, message });
  };
};

export const clear_notification = () => {
  return dispatch => {
    dispatch({ type: CLEAR_NOTIFICATION });
  };
};
