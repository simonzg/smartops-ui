import axios from "axios";

// const BASE = "http://10.145.88.68:8000";
const BASE = "http://12.234.32.103:8000";

const GET_RESULT_URL =
  "http://10.145.88.66:30500/api/autoshift/api/v1/apps/6/demand-profiles/11/all-merged";

export const LIST_APPS = "client/LIST_APPS";
export const LIST_APPS_SUCCESS = "client/LIST_APPS_SUCCESS";
export const LIST_APPS_FAILURE = "client/LIST_APPS_FAILURE";

export const CREATE_APP = "client/CREATE_APP";
export const CREATE_APP_SUCCESS = "client/CREATE_APP_SUCCESS";
export const CREATE_APP_FAILURE = "client/CREATE_APP_FAILURE";

export const GET_APP_INFO = "client/GET_APP_INFO";
export const GET_APP_INFO_SUCCESS = "client/GET_APP_INFO_SUCCESS";
export const GET_APP_INFO_FAILURE = "client/GET_APP_INFO_FAILURE";

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

export const UPDATE_APP = "client/UPDATE_APP";
export const UPDATE_APP_SUCCESS = "client/UPDATE_APP_SUCCESS";
export const UPDATE_APP_FAILURE = "client/UPDATE_APP_FAILURE";

export const LOAD_DRYRUN_PLAN = "client/LOAD_DRYRUN_PLAN";
export const LOAD_DRYRUN_PLAN_SUCCESS = "client/LOAD_DRYRUN_PLAN_SUCCESS";
export const LOAD_DRYRUN_PLAN_FAILURE = "client/LOAD_DRYRUN_PLAN_FAILURE";

export const LOAD_DRYRUN_RESULT = "client/LOAD_DRYRUN_RESULT";
export const LOAD_DRYRUN_RESULT_SUCCESS = "client/LOAD_DRYRUN_RESULT_SUCCESS";
export const LOAD_DRYRUN_RESULT_FAILURE = "client/LOAD_DRYRUN_RESULT_FAILURE";

export const NOTIFICATION = "client/NOTIFICATION";
export const CLEAR_NOTIFICATION = "client/CLEAR_NOTIFICATION";

export const GET_RESULT = "client/GET_RESULT";
export const GET_RESULT_SUCCESS = "client/GET_RESULT_SUCCESS";
export const GET_RESULT_FAILURE = "client/GET_RESULT_FAILURE";

const ajax_events = [
  LIST_APPS,
  CREATE_APP,
  GET_APP_INFO,
  LOAD_BLUEPRINT,
  SAVE_BLUEPRINT,
  LOAD_BLUEPRINT_JSON,
  LOAD_DRYRUN_PLAN,
  GET_RESULT,
  SAVE_REQUIREMENT,
  UPDATE_APP
];

const next_page_events = [
  CREATE_APP_SUCCESS,
  SAVE_BLUEPRINT_SUCCESS,
  SAVE_REQUIREMENT_SUCCESS,
  UPDATE_APP_SUCCESS
];

const list_appsState = {
  apps: [],
  data: {},
  yml: "",
  loading: false,
  status: "unknown", // could be either: unknown, success, failure
  error: "",
  app_status: "",
  last_updated: new Date()
};

export default (state = list_appsState, action) => {
  if (ajax_events.includes(action.type)) {
    return {
      ...state,
      loading: true,
      status: "unknown"
    };
  }

  // success reducers
  if (action.type.includes("_SUCCESS")) {
    let baseState = {
      ...state,
      loading: false,
      error: "",
      data: action.data,
      last_updated: new Date()
    };

    // next page
    if (next_page_events.includes(action.type)) {
      baseState = {
        ...baseState,
        status: "success"
      };
    }

    // ajax call success
    switch (action.type) {
      case LIST_APPS_SUCCESS:
        return Object.assign(baseState, {
          apps: action.data
        });

      case CREATE_APP_SUCCESS:
        return Object.assign(baseState, {
          apps: [...state.apps, action.data]
        });

      case LOAD_BLUEPRINT_SUCCESS:
        return Object.assign(baseState, {
          yml: action.data,
          last_updated: new Date()
        });

      case GET_APP_INFO_SUCCESS:
        return Object.assign(baseState, {
          app_status: action.data.status.status
        });

      default:
        return baseState;
    }
  }

  // failure reducers
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

  // other reducers
  switch (action.type) {
    // get app info
    case GET_APP_INFO:
      return {
        ...state,
        app_status: ""
      };

    // notification
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
        console.log(
          verb,
          url,
          "\npayload = ",
          JSON.stringify(payload),
          "\nresponse.data = ",
          JSON.stringify(response.data)
        );
        dispatch({
          type: base_type + "_SUCCESS",
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
/*
const getResult = (dispatch, base_type, verb, url) => {
  dispatch({
    type: base_type
  });

  let config = {
    method: verb,
    url: url
  };

  try {
    axios(config)
      .then(response => {
        console.log(
          verb,
          url,
          "\nresponse.data = ",
          JSON.stringify(response.data)
        );

        dispatch({
          type: base_type + "_SUCCESS",
          data: response.data
        });
      })
      .catch(error => {
        console.log(verb, url, "\nerror = ", JSON.stringify(error));

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
*/
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

export const update_app = (app_id, data) => {
  let url = `/apps/${app_id}`;
  return dispatch => {
    callAPI(dispatch, UPDATE_APP, "put", url, data);
  };
};

export const get_app_info = app_id => {
  return dispatch => {
    callAPI(dispatch, GET_APP_INFO, "get", "/apps/" + app_id);
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
  let url = `/apps/${app_id}/dryrun_base_plan`;
  return dispatch => {
    callAPI(dispatch, LOAD_DRYRUN_PLAN, "get", url);
  };
};

export const get_result = app_id => {
  let url = `/apps/${app_id}/dry_run_result`;
  return dispatch => {
    callAPI(dispatch, GET_RESULT, "get", url);
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
