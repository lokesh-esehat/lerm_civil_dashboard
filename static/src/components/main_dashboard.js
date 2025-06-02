/** @odoo-module **/
import { registry } from "@web/core/registry";
import { ChartRenderer } from "./chart_renderer/chart_renderer";
import { useEffect } from "@web/core/utils/hooks";
const { Component, useRef, onMounted } = owl;
const { useState, onWillStart } = owl.hooks;
import { useService } from "@web/core/utils/hooks";
// import { loadJS } from "@web/core/assets";
import { loadJS } from "web.ajax";
export class MainDashboard extends Component {
  setup() {
    this.state = useState({
      batches: [],
      regions: [],
      selected_region_id: 1,
      selected_batch_id: 3,
    });

    useEffect(
      () => {
        this.onChangeBatch(undefined, this.state.selected_batch_id);
        this.onChangeRegion(undefined, this.state.selected_region_id);
      },
      () => [this.state.selected_batch_id, this.state.selected_region_id]
    );

    // this.state.gsk_po_attempting_candidate =
    // this.state.gsk_po_attempting_candidate =

    this.rpc = useService("rpc");

    onWillStart(async () => {
      await loadJS(
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"
      );
      await this.getBatches();
      await this.getRegions();
    });
  }
}

MainDashboard.template = "lerm_civil_dashboard.MainDashboard";
MainDashboard.components = { ChartRenderer };

registry
  .category("actions")
  .add("lerm_civil_dashboard.main_dashboard", MainDashboard);
