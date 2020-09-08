const axios = require("axios");
const _get = require("lodash/get");

class FpDpe {
  get _config() {
    return {
      "site-intendant": {
        take_off_man_power: [
          "3a_load_manpower_site_intendants",
          "5a_update_aggregate_qty",
          "7_empty_files",
          "8_export_xlsx"
        ],
        take_off_quantity: [
          "2a_load_quantities_site_intendants",
          "5a_update_aggregate_qty",
          "7_empty_files",
          "8_export_xlsx"
        ]
      }
    };
  }

  constructor() {
    this._queue = [];
    this._state = {};
    this._running = false;
  }

  get _baseURL() {
    return process.env.FOREPAAS_DPE_URL;
  }

  get _intervalStatus() {
    return process.env.FOREPAAS_ETL_INTERVAL_STATUS || 5000;
  }

  get status() {
    return {
      config: this._config,
      queue: this._queue,
      state: this._state || {}
    };
  }

  add(object) {
    console.log("info", `DPEQueue::add:${object.bucket}:${object.key}`);
    let wks = this._getWorkflows(object);
    wks.forEach(wk => {
      this._queue = this._queue.filter(w => w !== wk);
      delete this._state[wk];
      this._queue.push(wk);
    });
    this._printState();
    this._start();
  }

  _printState() {
    console.log("info", `DPEQueue::${this._queue.join(",") || "empty"}`);
  }

  async _start() {
    if (this._running) return;
    if (!this._queue.length) return;
    let first = this._queue.shift();
    console.log("info", `DPEQueue::start:${first}`);
    this._running = true;

    try {
      await this._execute(first);
      console.log("info", `DPEQueue::end:${first}`);
      this._running = false;
      this._printState();
      await this._start();
    } catch (err) {
      console.log("error", `DPEQueue::error:${err.stack}`);
      this._running = false;
      this._printState();
      this._start();
    }
  }

  _getWorkflows(object) {
    return this._config[object.bucket][object.key.split("/")[0]] || [];
  }

  async _execute(workflow) {
    this._state[workflow] = {
      status: "IN_QUEUE",
      progress: 0
    };
    await this.login();
    let id = await this.getIdWorkflowByName(workflow);
    let data = await this._request({
      method: "POST",
      url: `/v3/workflow/${id}/start`
    });
    let executionId = data.execution_id;
    if (!executionId) throw new Error("DPEQueue::LaunchFailure");
    return this._follow(workflow, executionId);
  }

  async _later() {
    return new Promise(resolve => setTimeout(resolve, this._intervalStatus));
  }

  async getIdWorkflowByName(name) {
    let data = await this._request({
      method: "GET",
      url: `/v3/workflows/${name}`
    });
    return data._id;
  }

  async login() {
    console.log("info", "DPE::Login");
    let body = {
      auth_mode: "apikey",
      app_id: process.env.FOREPAAS_APP_ID,
      apikey: process.env.FOREPAAS_API_KEY,
      secretkey: process.env.FOREPAAS_SECRET_KEY
    };
    try {
      let options = {
        baseURL: process.env.CAM_URI,
        url: "/login",
        method: "POST",
        data: body
      };
      let response = await axios(options);
      console.log("info", "DPE::LoginSuccess");
      this.token = response.data.token;
    } catch (err) {
      console.log("error", err.stack);
      body.secretkey = "********";
      console.log(
        "error",
        "DPE::InvalidAuthentication:" +
          err.response.status +
          ":" +
          JSON.stringify(body)
      );
      throw err;
    }
  }

  getStatus(data) {
    if (!data.status) return "NOT_FOUND";
    if (
      data.status === "FAILED" ||
      data.status === "TIMEOUT" ||
      data.status === "UNKNOWN"
    ) {
      return "FAILED";
    }
    const executionStatus = _get(data, "execution_status.status");
    if (executionStatus) return executionStatus;
    if (
      data.status === "PROVISIONING" ||
      data.status === "PROCESSING" ||
      data.status === "QUEUED" ||
      data.status === "SUBMITTED" ||
      data.status === "BUILDING"
    ) {
      return "PENDING";
    }
    return data.status || "NOT_FOUND";
  }

  getProgress(data) {
    const executionProgress = _get(data, "execution_status.progress");
    if (executionProgress) return Math.floor(executionProgress);
    if (!data.status) return 0;
    if (data.status.failed) return null;
    if (data.status.stopped) return null;
    if (data.status.active) return 0;
    const executionStatus = _get(data, "execution_status.status");
    if (executionStatus === "SUCCESS") return 1;
    return 0;
  }

  async _follow(workflowName, executionId) {
    console.log("info", `DPEQueue::follow:${workflowName}:Start`);
    let data = await this._request({
      method: "GET",
      url: `v3/jobs/${executionId}`
    });

    let status = this.getStatus(data);
    let progress = this.getProgress(data);
    console.log(
      "info",
      `DPEQueue::followStatus:${workflowName}:${status}:${progress}`
    );
    this._state[workflowName] = {
      status,
      progress
    };
    if (
      status === "PENDING" ||
      status === "IN_QUEUE" ||
      status === "NOT_FOUND" ||
      status === "PROCESSING"
    ) {
      await this._later();
      return this._follow(workflowName, executionId);
    }
    console.log("info", `DPEQueue::followEnd:${workflowName}:${status}`);
  }

  async _request(options) {
    try {
      console.log("debug", options);
      options.baseURL = this._baseURL;
      options.params = options.params || {};
      options.params.fprn = process.env.FOREPAAS_FPRN.replace("-", "_");
      options.params.app_id = process.env.FOREPAAS_APP_ID;
      options.params.type = "cam";
      options.params.token = this.token;
      let response = await axios(options);
      return response.data;
    } catch (err) {
      console.log("error", err.stack);
      options.params.token = "*****";
      console.log(
        "error",
        "DPE::InvalidRequest:" +
          err.response.status +
          "::Body:" +
          JSON.stringify(options)
      );
      console.log("error", err.response.data);
      throw err;
    }
  }
}

export default FpDpe;
