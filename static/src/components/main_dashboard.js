/** @odoo-module **/

import { registry } from "@web/core/registry";
import { ChartRenderer } from "./chart_renderer/chart_renderer";
import { KpiBox } from "./kpi_box/kpi_box";
import { useEffect, useService } from "@web/core/utils/hooks";
import { loadJS } from "web.ajax";
const { Component, useRef, onMounted } = owl;
const { useState, onWillStart } = owl.hooks;

export class MainDashboard extends Component {
  setup() {
    this.rpc = useService("rpc");

    this.state = useState({
      start_date: "",
      end_date: "",
      dashboardData: null,
      isLoading: false,
      dateRangeSelected: false,
    });

    useEffect(
      () => {
        if (this.state.start_date && this.state.end_date) {
          this.onChangeDate(this.state.start_date, this.state.end_date);
        }
      },
      () => [this.state.start_date, this.state.end_date]
    );

    onWillStart(async () => {
      await loadJS(
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"
      );
    });
  }

  async onChangeDate(from, to) {
    this.state.isLoading = true;

    try {
      const data = await this.rpc("/dashboard/getdata", {
        start_date: from,
        end_date: to,
      });

      const parsed = JSON.parse(data);
      this.state.dashboardData = parsed;
      this.state.dateRangeSelected = true;

      const stateLabelMap = {
        "1-allotment_pending": "Allotment Pending",
        "2-alloted": "Alloted",
        "3-pending_verification": "Pending Verification",
        "4-in_report": "In Report",
        "5-pending_approval": "Pending Approval",
      };
      // Add label to each state item
      parsed.state_data = parsed.state_data.map((item) => ({
        ...item,
        state_label: stateLabelMap[item.state] || item.state,
      }));

      this.state.dashboardData = parsed;
      this.state.dateRangeSelected = true;

      // Prepare data for ChartRenderer
      const labels = parsed.state_data.map(
        (item) => stateLabelMap[item.state] || item.state
      );
      const counts = parsed.state_data.map((item) => item.count);

      this.state.chart = {
        type: "line",
        title: "State-wise Record Count",
        data: {
          labels: labels,
          datasets: [
            {
              label: "No. of Records",
              data: counts,
              fill: false,
              tension: 0.3,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
            },
          ],
        },
      };
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      this.state.dashboardData = null;
    }

    this.state.isLoading = false;
  }
}

MainDashboard.template = "lerm_civil_dashboard.MainDashboard";
MainDashboard.components = { ChartRenderer, KpiBox };

registry
  .category("actions")
  .add("lerm_civil_dashboard.main_dashboard", MainDashboard);
