/** @odoo-module **/

import { registry } from "@web/core/registry";
import { ChartRenderer } from "./chart_renderer/chart_renderer";
import { KpiBox } from "./kpi_box/kpi_box";
import { useEffect, useService } from "@web/core/utils/hooks";
import { loadJS } from "web.ajax";
// import { loadJS } from "@web/core/assets"
const { Component, useRef, onMounted } = owl;
const { useState, onWillStart } = owl.hooks;

export class MainDashboard extends Component {
  static components = { KpiBox };
  setup() {
    this.rpc = useService("rpc");
    this.orm = useService("orm");
    this.action = useService("action");

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const defaultMonth = `${year}-${month}`;

    this.state = useState({
      start_date: `${year}-${month}-01`,
      end_date: new Date(year, month, 0).toISOString().split("T")[0],
      month_value: defaultMonth,
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
  onMonthChange(ev) {
    const selectedMonth = ev.target.value; // Format: "2025-04"
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const firstDay = `${year}-${month}-01`;
      const lastDay = new Date(year, month, 0).toISOString().split("T")[0];

      this.state.start_date = firstDay;
      this.state.end_date = lastDay;
      this.state.month_value = selectedMonth;

      this.onChangeDate(firstDay, lastDay);
    }
  }
  async onKpiClick(stateName) {
    let actionXmlId = null;
    let options = {};
    const stateLabelMap = {
      "1-allotment_pending": "Allotment Pending",
      "2-alloted": "Alloted",
      "3-pending_verification": "Pending Verification",
      "4-in_report": "In Report",
      "5-pending_approval": "Pending Approval",
    };
    switch (stateName) {
      case "1-allotment_pending":
        actionXmlId = "lerm_civil.test_sample_pending_allotment_action";
        break;
      case "2-alloted":
        actionXmlId = "lerm_civil.test_sample_pending_allotted_action";
        break;
      case "3-pending_verification":
        actionXmlId = "lerm_civil.sample_pending_verification_action";
        break;
      case "4-in_report":
        actionXmlId = "lerm_civil.test_sample_pending_in_report_action";
        break;
      case "5-pending_approval":
        actionXmlId = "lerm_civil.sample_pending_approval_action";
        break;
    }
    if (actionXmlId) {
      const domain = [
        ["sample_received_date", ">=", this.state.start_date],
        ["sample_received_date", "<=", this.state.end_date],
        ["state", "=", stateName],
      ];

      this.action.doAction({
        type: "ir.actions.act_window",
        name: stateLabelMap[stateName] || "Sample Records",
        res_model: "lerm.srf.sample",
        domain: domain,
        views: [
          [false, "list"],
          [false, "form"],
        ],
      });
    }
  }
}

MainDashboard.template = "lerm_civil_dashboard.MainDashboard";
MainDashboard.components = { ChartRenderer, KpiBox };

registry
  .category("actions")
  .add("lerm_civil_dashboard.main_dashboard", MainDashboard);
