import FpSdk from "forepaas/sdk";

import DashboardTitle from "./DashboardTitle";
import Username from "./Username";
import Toaster from "./Toaster";
import WorkInProgress from "./WorkInProgress";
import DynamicParameterCheckbox from "./DynamicParameterCheckbox";
import DynamicParameterAutocompleteBox from "./DynamicParameterAutocompleteBox";
import ChartMap from "./ChartMap";
import FileExplorer from "./FileExplorer";
import EditableTable from "./EditableTable";
import LaunchWorkflow from "./LaunchWorkflow";

export default {
  components: {
    DashboardTitle,
    Username,
    Toaster,
    WorkInProgress,
    DynamicParameterCheckbox,
    DynamicParameterAutocompleteBox,
    ChartMap,
    FileExplorer,
    EditableTable,
    LaunchWorkflow
  },
  camelCaseToDash(myStr) {
    return myStr.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  },
  init() {
    for (let component in this.components) {
      FpSdk.modules[this.camelCaseToDash(component)] = this.components[
        component
      ];
    }
  }
};
