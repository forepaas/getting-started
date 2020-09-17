import FpSdk from "forepaas/sdk";
import FpClientAuthorityManager from "forepaas/client-authority-manager";
import FpXhr from "forepaas/xhr";

const axios = require("axios");
const _get = require("lodash/get");

class FpDpe extends FpXhr {

  /* getters */
  get localSession() {
    try {
      return JSON.parse(
        localStorage.getItem("client-authority-manager-session")
      );
    } catch (_) {
      return null;
    }
  }
  get token() {
    return this.localSession && this.localSession.token;
  }
  get dpeUrl() {
    if (FpSdk.config.dpe) {
      return FpSdk.config.dpe;
    }
    if (FpSdk.config.api) {
      const url = new URL(FpSdk.config.api);
      return `${url.protocol}//${url.hostname}/dpe/v3`;
    }
    return null;
  }

  get appId() {
    return FpClientAuthorityManager.FpAuthentication.getAppId();
  }

  async listJobs() {
    const response = await this.request({
      url: "jobs",
    });
    this.jobs = response
    return response
  }

  async listWorkflows() {
    const response = await this.request({
      url: "workflows",
    });
    this.workflows = response
    return response
  }

  async getWorkflow(workflowId) {
    const workflow = await this.request({
      url: `workflows/${workflowId}`,
    });
    return workflow
  }

  async getJob(executionId) {
    const workflow = await this.request({
      url: `jobs/${executionId}`,
    });
    return workflow
  }

  async getJobByWorkflowId(workflowId) {
    const jobs = await this.listJobs()
    const job = jobs.reverse().find(job => job.id === workflowId)
    return job
  }

  async getJobLogs(jobId, executionId) {
    const logs = await this.request({
      url: `workflows/${jobId}/logs/${executionId}`,
    });
    return logs
  }

  async executeWorkflow(workflowId) {
    let response = await this.request({
      method: 'POST',
      url: `/workflow/${workflowId}/start`
    })
    return response
  }

  async stopWorkflow(workflowId) {
    let response = await this.request({
      method: 'DELETE',
      url: `/workflow/${workflowId}/stop`
    })
    return response
  }

  async getWorkflowIdByName(name) {
    let data = await this.request({
      method: "GET",
      url: `/v3/workflows/${name}`
    });
    return data._id;
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
    const executionStatus = _get(data, "execution.status");
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
    const executionProgress = _get(data, "execution.progress");
    if (executionProgress) return Math.floor(executionProgress);
    if (!data.status) return 0;
    if (data.status.failed) return null;
    if (data.status.stopped) return null;
    if (data.status.active) return 0;
    const executionStatus = _get(data, "execution.status");
    if (executionStatus === "SUCCESS") return 1;
    return 0;
  }

  request(options) {
    options.baseURL = this.dpeUrl;
    options.queryString = options.queryString || {};
    options.queryString.type = "cam";
    return super
      .request(options)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
}




export default FpDpe;
