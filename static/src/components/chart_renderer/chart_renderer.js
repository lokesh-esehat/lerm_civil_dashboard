/** @odoo-module */

import { registry } from "@web/core/registry";
import { useEffect } from "@web/core/utils/hooks";

// import { loadJS } from "@web/core/assets"
import { loadJS } from "web.ajax";

const { Component } = owl;
const { useRef, onWillStart, onMounted, onWillUnmount } = owl.hooks;
export class ChartRenderer extends Component {
  setup() {
    this.chartRef = useRef("chart");
    onWillStart(async () => {
      await loadJS(
        "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"
      );
    });

    useEffect(
      () => {
        // console.log("State Change")
        this.renderChart();
      },
      () => [this.props.data]
    );

    onMounted(() => this.renderChart());
    onWillUnmount(() => {
      if (this.chart) {
        this.chart.destroy();
      }
    });
  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartRef.el, {
      type: this.props.type,
      data: this.props.data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: this.props.title,
            position: "bottom",
          },
        },
      },
    });
  }
}

ChartRenderer.template = "lerm_civil_dashboard.ChartRenderer";
