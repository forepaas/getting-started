import React, { useEffect, useState } from "react";
import FpDpe from "src/services/FpDpe";
import FpToaster from "forepaas/toaster";
import { Console } from "console-feed";
import { Line } from "rc-progress";

const dpe = new FpDpe();
const LaunchWorkflow = ({ options }) => {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState({});
  const [logsPromise, setLogsPromise] = useState(null);
  const [workflow, setWorkflow] = useState({});
  const [job, setJob] = useState({});
  const [currentInterval, setCurrentInterval] = useState(null);
  const [currentLogsInterval, setCurrentLogsInterval] = useState(null);

  useEffect(() => {
    getWorkflow();
    updateStatus();
    updateLogs();
  }, []);

  useEffect(() => {
    if (status === "PENDING") {
      const interval = setInterval(() => {
        updateStatus();
      }, 1000);
      currentInterval && clearInterval(currentInterval);
      setCurrentInterval(interval);
      return () => clearInterval(interval);
    } else {
      clearInterval(currentInterval);
    }
  }, [status]);

  useEffect(() => {
    if (status === "PENDING") {
      const logsInterval = setInterval(() => {
        updateLogs();
      }, 1000);
      currentInterval && clearInterval(currentLogsInterval);
      setCurrentLogsInterval(logsInterval);
      return () => clearInterval(logsInterval);
    } else {
      clearInterval(currentLogsInterval);
    }
  }, [status, logs]);

  const getWorkflow = async () => {
    let wf = await dpe.getWorkflow(options.workflowId);
    setWorkflow(wf);
  };

  const launchWorkflow = async () => {
    try {
      let response = await dpe.executeWorkflow(options.workflowId);
      FpToaster.success(response.message);
      updateStatus();
    } catch (error) {
      FpToaster.error(error.response.data.message);
    }
  };

  const stopWorkflow = async () => {
    try {
      let response = await dpe.stopWorkflow(options.workflowId);
      updateStatus();
    } catch (error) {
      
    }
  };

  const updateStatus = async () => {
    try {
      let job = await dpe.getJobByWorkflowId(options.workflowId);
      setJob(job);
      let wfStatus = dpe.getStatus(job);
      let wfProgress = dpe.getProgress(job);
      let logsPromise = dpe.getJobLogs(job.id, job.execution_id);
      setLogsPromise(logsPromise);
      setStatus(wfStatus);
      return status, logsPromise;
    } catch (error) {
      FpToaster.error(error.response.data.message);
    }
  };

  const updateLogs = async () => {
    const logs = await logsPromise;
    setLogs(logs);
    return logs;
  };

  return (
    workflow &&
    status && (
      <div>
        <div className="workflow-container">
          <div className="workflow-left">
            <div className="chart-title">{workflow.display_name}</div>
          </div>
          <div className="workflow-right">
            <div className="progress-bar">
              {status === "PENDING" && (
                <>
                <div className="percentage-value">{dpe.getProgress(job)}%</div>
                <Line
                  percent={dpe.getProgress(job)}
                  strokeWidth={8}
                  trailWidth={8}
                  strokeColor="#00ccf9"
                />
                </>
              )}
            </div>
            <button
              disabled={status === "PENDING"}
              className="launch-button"
              onClick={launchWorkflow}
            >
              {status === "PENDING" ? (
                <i className="fa fa-spin fa-spinner"></i>
              ) : (
                <i className="fa fa-play"></i>
              )}
            </button>
            <button
              disabled={status !== "PENDING"}
              className="stop-workflow"
              onClick={stopWorkflow}
            >
              <i className="fa fa-stop"></i>
            </button>
          </div>
        </div>
      </div>
    )
  );
};

LaunchWorkflow.propTypes = {};
export default LaunchWorkflow;
