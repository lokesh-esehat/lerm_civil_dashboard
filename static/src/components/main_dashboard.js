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
      chartData: {
        type: "bar",
        title: "Sample Bar Chart",
        data: {
          labels: ["A", "B", "C", "D"],
          datasets: [
            {
              label: "Dataset 1",
              data: [10, 20, 30, 40],
              backgroundColor: ["#1abc9c", "#3498db", "#9b59b6", "#f39c12"],
            },
          ],
        },
      },
    });
  }
}

MainDashboard.template = "lerm_civil_dashboard.MainDashboard";
MainDashboard.components = { ChartRenderer };

registry
  .category("actions")
  .add("lerm_civil_dashboard.main_dashboard", MainDashboard);
